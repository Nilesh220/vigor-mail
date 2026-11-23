// "Test connection" button in Settings — checks the Gmail login without sending anything.
const nodemailer = require('nodemailer');
const { checkAccess, sameOriginOnly } = require('./_lib');

module.exports = async (req, res) => {
  sameOriginOnly(res);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!checkAccess(req, res)) return;

  const { user, pass } = req.body || {};
  if (!user || !pass) return res.status(400).json({ ok: false, error: 'Enter your Gmail address and App Password first.' });

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', port: 465, secure: true,
    auth: { user: String(user).trim(), pass: String(pass).replace(/\s+/g, '') },
    connectionTimeout: 15000, greetingTimeout: 10000, socketTimeout: 15000,
  });
  try {
    await transporter.verify();
    return res.status(200).json({ ok: true });
  } catch (err) {
    const msg = String(err && (err.response || err.message) || '');
    const auth = err && (err.code === 'EAUTH' || err.responseCode === 535) || /Invalid login|not accepted/i.test(msg);
    return res.status(auth ? 401 : 502).json({
      ok: false,
      error: auth
        ? 'Gmail did not accept this login. Make sure 2-Step Verification is on and you pasted the 16-letter App Password.'
        : 'Could not reach Gmail right now. Try again in a minute.',
    });
  } finally {
    transporter.close();
  }
};
