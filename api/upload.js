// Stores attachments in team storage (in pieces) so they can be up to 15 MB in total,
// and so each file is uploaded once per campaign instead of once per recipient.
// Files are deleted automatically after 36 hours.
const { storeConfig, redis, checkAccess, sameOriginOnly } = require('./_lib');

const TTL = String(36 * 3600);
const ID_RE = /^[a-f0-9]{24,64}$/;
const MAX_CHUNKS = 10;
const MAX_CHUNK_B64 = 3.4 * 1024 * 1024;

module.exports = async (req, res) => {
  sameOriginOnly(res);
  if (!checkAccess(req, res)) return;
  if (!storeConfig()) return res.status(400).json({ ok: false, code: 'NO_STORAGE', error: 'Team storage is not connected.' });

  try {
    // Already uploaded? (same file used in an earlier campaign)
    if (req.method === 'GET') {
      const id = String(req.query.id || '');
      if (!ID_RE.test(id)) return res.status(400).json({ ok: false, error: 'Bad file id.' });
      const out = await redis([['EXISTS', `vl:f:${id}:meta`]]);
      const exists = !!(out && out[0] && out[0].result);
      if (exists) await redis([['EXPIRE', `vl:f:${id}:meta`, TTL]]);
      return res.status(200).json({ ok: true, exists });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const b = req.body || {};
    const id = String(b.id || '');
    const total = Number(b.total);
    if (!ID_RE.test(id) || !(total >= 1 && total <= MAX_CHUNKS)) return res.status(400).json({ ok: false, error: 'Bad upload.' });

    if (b.commit) {
      const keys = Array.from({ length: total }, (_, i) => ['EXISTS', `vl:f:${id}:${i}`]);
      const out = await redis(keys);
      if (!out.every(r => r.result === 1)) return res.status(409).json({ ok: false, error: 'Some parts of the file are missing. Try again.' });
      const meta = { name: String(b.name || 'attachment').slice(0, 200), type: String(b.type || 'application/octet-stream').slice(0, 120), size: Number(b.size) || 0, total };
      const cmds = [['SET', `vl:f:${id}:meta`, JSON.stringify(meta), 'EX', TTL]];
      for (let i = 0; i < total; i++) cmds.push(['EXPIRE', `vl:f:${id}:${i}`, TTL]);
      await redis(cmds);
      return res.status(200).json({ ok: true });
    }

    const index = Number(b.index);
    const data = String(b.data || '');
    if (!(index >= 0 && index < total) || !data || data.length > MAX_CHUNK_B64 || !/^[A-Za-z0-9+/=]+$/.test(data)) {
      return res.status(400).json({ ok: false, error: 'Bad file part.' });
    }
    await redis([['SET', `vl:f:${id}:${index}`, data, 'EX', TTL]]);
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(502).json({ ok: false, error: 'Could not save the attachment: ' + err.message });
  }
};
