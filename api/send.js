// Sends ONE email per request. The dashboard calls this once per recipient,
// which keeps every request well inside Vercel's time limit, gives a true
// live progress bar, and lets the sender pause or stop mid-campaign.

const nodemailer = require('nodemailer');
const { logEvent, checkAccess, sameOriginOnly } = require('./_lib');

const EMAIL_RE = /^[^\s@<>()",;]+@[^\s@<>()",;]+\.[^\s@<>()",;]{2,}$/;
const MAX_ATTACH_BYTES = 3.2 * 1024 * 1024; // Vercel request limit is 4.5 MB incl. base64 overhead

module.exports = async (req, res) => {
  sameOriginOnly(res);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!checkAccess(req, res)) return;

  const b = req.body || {};
  const auth = b.auth || {};
  const to = b.to || {};
  const meta = b.meta || {};
  const gmail = String(auth.user || '').trim();
  const pass = String(auth.pass || '').replace(/\s+/g, '');

  if (!gmail || !pass) return res.status(400).json({ code: 'NO_ACCOUNT', error: 'Add your Gmail address and App Password in Settings.' });
  if (!EMAIL_RE.test(String(to.email || ''))) return res.status(400).json({ code: 'BAD_RECIPIENT', error: 'This email address is not valid.' });
  if (!b.subject || !b.html) return res.status(400).json({ code: 'EMPTY', error: 'Subject and message are required.' });

  // Attachments
  let attachments = [];
  if (Array.isArray(b.attachments) && b.attachments.length) {
    let total = 0;
    attachments = b.attachments.map(a => {
      total += Math.floor(String(a.data || '').length * 0.75);
      return { filename: String(a.name || 'attachment'), content: String(a.data || ''), encoding: 'base64', contentType: a.type || undefined };
    });
    if (total > MAX_ATTACH_BYTES) return res.status(413).json({ code: 'TOO_LARGE', error: 'Attachments are over 3 MB. Share large decks as a Google Drive link instead.' });
  }

  const senderName = clean(auth.name);
  const toName = clean(to.name);
  const html = wrapHtml(String(b.html));
  const text = htmlToText(String(b.html));

  const headers = {};
  if (b.unsubscribe && !b.test) {
    headers['List-Unsubscribe'] = `<mailto:${gmail}?subject=Unsubscribe>`;
  }

  const mail = {
    from: senderName ? { name: senderName, address: gmail } : gmail,
    to: toName ? { name: toName, address: to.email } : to.email,
    subject: clean(b.subject),
    text,
    html,
    headers,
    attachments,
  };
  if (b.replyTo && EMAIL_RE.test(b.replyTo)) mail.replyTo = b.replyTo;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: gmail, pass },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });

  const evt = {
    t: Date.now(),
    cid: String(meta.cid || ''),
    from: gmail.toLowerCase(),
    fromName: senderName,
    to: String(to.email).toLowerCase(),
    toName,
    brand: clean(meta.brand),
    type: clean(meta.type),
    subject: mail.subject,
    att: attachments.length,
    acct: meta.acct === 'workspace' ? 'workspace' : 'gmail',
    ok: true,
  };

  try {
    const info = await transporter.sendMail(mail);
    if (!b.test) await logEvent(evt);
    return res.status(200).json({ ok: true, id: info.messageId });
  } catch (err) {
    const friendly = explain(err);
    if (!b.test && !friendly.fatal) await logEvent({ ...evt, ok: false, err: friendly.error });
    return res.status(friendly.status).json({ ok: false, code: friendly.code, error: friendly.error, fatal: friendly.fatal });
  } finally {
    transporter.close();
  }
};

// Turn SMTP errors into plain-English messages.
function explain(err) {
  const msg = String(err && (err.response || err.message) || '');
  const code = err && err.responseCode;
  if (err && err.code === 'EAUTH' || code === 535 || /Invalid login|Username and Password not accepted|BadCredentials/i.test(msg)) {
    return { status: 401, code: 'AUTH', fatal: true, error: 'Gmail did not accept the login. Check the Gmail address and use a 16-letter App Password (not your normal password).' };
  }
  if (/5\.4\.5|Daily user sending limit|sending limit exceeded/i.test(msg)) {
    return { status: 429, code: 'DAILY_LIMIT', fatal: true, error: 'Gmail’s daily sending limit is reached for this account. Sending will work again in about 24 hours.' };
  }
  if (code === 421 || code === 454 || /4\.7\.0|rate|Too many/i.test(msg)) {
    return { status: 429, code: 'RATE', fatal: false, error: 'Gmail asked us to slow down. Try a gentler sending pace.' };
  }
  if (code === 550 || code === 553 || /5\.1\.1|does not exist|recipient/i.test(msg)) {
    return { status: 400, code: 'REJECTED', fatal: false, error: 'Gmail rejected this address.' };
  }
  if (/ETIMEDOUT|ECONNECTION|ESOCKET|timeout/i.test(msg + (err && err.code))) {
    return { status: 504, code: 'TIMEOUT', fatal: false, error: 'Could not reach Gmail in time. It will usually work on retry.' };
  }
  return { status: 500, code: 'UNKNOWN', fatal: false, error: msg.slice(0, 200) || 'Unknown sending error.' };
}

function clean(s) { return String(s || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 300); }

// A plain, personal-looking wrapper — like an email typed in Gmail.
// Heavy banners and gradients push cold emails into Promotions or Spam.
function wrapHtml(body) {
  return '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>' +
    '<body style="margin:0;padding:0;">' +
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#202124;max-width:640px;">' +
    body +
    '</div></body></html>';
}

// Readable plain-text version (sent alongside HTML; helps inbox placement).
function htmlToText(html) {
  return html
    .replace(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, (m, href, label) => {
      const l = label.replace(/<[^>]+>/g, '').trim();
      return l && l !== href ? `${l} (${href})` : href;
    })
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/(p|div|h\d|ul|ol)>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
