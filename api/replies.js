// "Check for replies": looks in the sender's own Gmail (read-only) to see which
// contacts have written back, so follow-ups skip them. Uses the same App Password.
const { checkReplies } = require('./_imap');
const { storeConfig, redis, checkAccess, sameOriginOnly, REPLIES_KEY } = require('./_lib');

module.exports = async (req, res) => {
  sameOriginOnly(res);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!checkAccess(req, res)) return;

  const { auth = {}, contacts = [] } = req.body || {};
  const user = String(auth.user || '').trim().toLowerCase();
  const pass = String(auth.pass || '').replace(/\s+/g, '');
  if (!user || !pass) return res.status(400).json({ ok: false, error: 'Add your Gmail and App Password in Settings first.' });
  if (!Array.isArray(contacts) || !contacts.length) return res.status(200).json({ ok: true, replied: [] });
  if (contacts.length > 200) return res.status(400).json({ ok: false, error: 'Check at most 200 contacts at a time.' });

  try {
    // contacts: [{ email, since }] where since = exact time the pitch went to that person
    const replied = await checkReplies({ user, pass, contacts });
    if (replied.length && storeConfig()) {
      try { await redis(replied.map(r => ['HSETNX', REPLIES_KEY, `${user}|${r.email}`, String(r.at)])); } catch {}
    }
    return res.status(200).json({ ok: true, replied, checked: contacts.length });
  } catch (err) {
    if (err.auth) return res.status(401).json({ ok: false, error: 'Gmail did not accept the login. Check your App Password in Settings.' });
    return res.status(502).json({ ok: false, error: 'Could not check Gmail for replies right now. Try again in a minute.' });
  }
};
