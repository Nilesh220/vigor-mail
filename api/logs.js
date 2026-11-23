// Returns the team's sending history for the dashboard.
const { storeConfig, redis, checkAccess, sameOriginOnly, EVENTS_KEY } = require('./_lib');

const MAX_RETURN = 8000;

module.exports = async (req, res) => {
  sameOriginOnly(res);
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!checkAccess(req, res)) return;

  if (!storeConfig()) return res.status(200).json({ storage: false, events: [] });

  try {
    const since = Number(req.query.since || 0);
    const out = await redis([['LRANGE', EVENTS_KEY, '0', String(MAX_RETURN - 1)]]);
    const raw = (out && out[0] && out[0].result) || [];
    const events = [];
    for (const r of raw) {
      try {
        const e = JSON.parse(r);
        if (!since || e.t >= since) events.push(e);
      } catch {}
    }
    return res.status(200).json({ storage: true, events, capped: raw.length >= MAX_RETURN });
  } catch (err) {
    return res.status(502).json({ storage: true, events: [], error: 'Could not load team history: ' + err.message });
  }
};
