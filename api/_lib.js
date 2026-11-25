// Shared helpers for the API routes.
// Files starting with "_" are not exposed as URLs by Vercel.

const crypto = require('crypto');

// ── Team storage (Upstash Redis via Vercel Marketplace) ──────────────
// When you connect "Upstash for Redis" in the Vercel dashboard, Vercel adds
// these environment variables automatically. No code changes needed.
function storeConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ''), token };
}

async function redis(commands) {
  const cfg = storeConfig();
  if (!cfg) return null;
  const res = await fetch(cfg.url + '/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + cfg.token, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error('Team storage responded with ' + res.status);
  return res.json();
}

const EVENTS_KEY = 'vl:events';
const REPLIES_KEY = 'vl:replies2'; // v2: exact-time matching (v1 marks were unreliable and are ignored)
const MAX_EVENTS = 25000;

async function logEvent(evt) {
  if (!storeConfig()) return false;
  try {
    await redis([
      ['LPUSH', EVENTS_KEY, JSON.stringify(evt)],
      ['LTRIM', EVENTS_KEY, '0', String(MAX_EVENTS - 1)],
    ]);
    return true;
  } catch (e) {
    console.error('logEvent failed', e.message);
    return false;
  }
}

// ── Optional access code ─────────────────────────────────────────────
// Set TEAM_ACCESS_CODE in Vercel → Settings → Environment Variables to make
// the dashboard ask for a code before anyone can use it.
function hash(s) { return crypto.createHash('sha256').update(String(s)).digest(); }

function checkAccess(req, res) {
  const code = process.env.TEAM_ACCESS_CODE;
  if (!code) return true;
  const given = req.headers['x-vl-access'] || '';
  if (crypto.timingSafeEqual(hash(code), hash(given))) return true;
  res.status(401).json({ code: 'ACCESS_REQUIRED', error: 'Enter your team access code to continue.' });
  return false;
}

function sameOriginOnly(res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

module.exports = { storeConfig, redis, logEvent, checkAccess, sameOriginOnly, EVENTS_KEY, REPLIES_KEY };
