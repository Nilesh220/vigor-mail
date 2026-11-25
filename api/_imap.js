// Minimal Gmail IMAP client used only to answer one question:
// "Has this contact emailed me AFTER I sent them the pitch?"
// Read-only: nothing in the mailbox is changed or marked as read.

const tls = require('tls');

const SAFE_EMAIL = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };

function quote(s) { return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'; }

// Gmail search only understands whole days, so search from the day before
// and then compare exact times ourselves.
function gmailDate(ms) {
  const d = new Date(ms - 864e5);
  return `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${String(d.getUTCDate()).padStart(2, '0')}`;
}

// IMAP INTERNALDATE, e.g. "25-Nov-2026 16:40:12 +0530" → milliseconds
function parseInternalDate(s) {
  const m = String(s).match(/^\s*(\d{1,2})-([A-Za-z]{3})-(\d{4}) (\d{2}):(\d{2}):(\d{2}) ([+-])(\d{2})(\d{2})/);
  if (!m) return 0;
  const utc = Date.UTC(+m[3], MONTHS[m[2].toLowerCase()], +m[1], +m[4], +m[5], +m[6]);
  const off = (+m[8] * 60 + +m[9]) * 60e3 * (m[7] === '+' ? 1 : -1);
  return utc - off;
}

/**
 * contacts: [{ email, since }]  since = exact time (ms) the pitch was sent to that person
 * returns:  [{ email, at }]     at = time of their first message after `since`
 */
function checkReplies({ user, pass, contacts }) {
  const host = process.env.IMAP_HOST || 'imap.gmail.com';
  const port = Number(process.env.IMAP_PORT || 993);
  const me = String(user).toLowerCase();
  const seen = new Set();
  const list = contacts
    .map(c => (typeof c === 'string' ? { email: c, since: 0 } : c))
    .map(c => ({ email: String(c.email || '').trim().toLowerCase(), since: Number(c.since) || 0 }))
    .filter(c => SAFE_EMAIL.test(c.email) && c.email !== me && c.since > 0 && !seen.has(c.email) && seen.add(c.email));

  return new Promise((resolve, reject) => {
    if (!list.length) return resolve([]);
    let done = false;
    const sock = tls.connect({ host, port, servername: host });
    const finish = (err, val) => {
      if (done) return; done = true;
      try { sock.end(); sock.destroy(); } catch {}
      err ? reject(err) : resolve(val);
    };
    sock.setTimeout(24000, () => finish(new Error('Gmail took too long to answer.')));
    sock.on('error', e => finish(e));

    let buf = '', greeted = false, tagN = 0, onGreet;
    const pending = [];
    const greeting = new Promise((res, rej) => { onGreet = { res, rej }; });

    sock.on('data', chunk => {
      buf += chunk.toString('utf8');
      let i;
      while ((i = buf.indexOf('\r\n')) >= 0) {
        const line = buf.slice(0, i); buf = buf.slice(i + 2);
        if (!greeted) {
          greeted = true;
          /^\* (OK|PREAUTH)/i.test(line) ? onGreet.res() : onGreet.rej(new Error('Unexpected reply from Gmail.'));
          continue;
        }
        const cur = pending[0];
        if (!cur) continue;
        if (line.startsWith(cur.tag + ' ')) {
          pending.shift();
          /^\S+ OK/i.test(line) ? cur.res(cur.lines) : cur.rej(Object.assign(new Error(line.slice(cur.tag.length + 1)), { imap: true }));
        } else cur.lines.push(line);
      }
    });

    const cmd = text => new Promise((res, rej) => {
      const tag = 'V' + (++tagN);
      pending.push({ tag, lines: [], res, rej });
      sock.write(tag + ' ' + text + '\r\n');
    });

    (async () => {
      await greeting;
      try { await cmd(`LOGIN ${quote(user)} ${quote(pass)}`); }
      catch (e) { const err = new Error('AUTH'); err.auth = true; throw err; }

      // "All Mail" (its name depends on the account language), so archived replies count too.
      let mailbox = 'INBOX';
      try {
        const lines = await cmd('LIST "" "*"');
        const all = lines.find(l => /\\All\b/i.test(l));
        const m = all && all.match(/^\* LIST \([^)]*\) (?:"(?:[^"\\]|\\.)*"|NIL) (.+)$/i);
        if (m) mailbox = m[1].trim();
      } catch {}
      await cmd('EXAMINE ' + mailbox);

      // 1) Find messages FROM each contact around the send date (auto-replies excluded)
      const uidLists = await Promise.all(list.map(c =>
        cmd('UID SEARCH X-GM-RAW ' + quote(`from:${c.email} after:${gmailDate(c.since)} -subject:"automatic reply" -subject:"out of office" -subject:"auto-reply" -subject:"undeliverable" -subject:"delivery status"`))
          .then(lines => {
            const l = lines.find(x => /^\* SEARCH/i.test(x)) || '';
            return l.replace(/^\* SEARCH/i, '').trim().split(/\s+/).filter(Boolean).slice(-25);
          })
          .catch(() => [])
      ));

      // 2) Keep only messages that arrived AFTER the pitch was sent to that person
      const results = await Promise.all(list.map((c, i) => {
        const uids = uidLists[i];
        if (!uids.length) return null;
        return cmd(`UID FETCH ${uids.join(',')} (INTERNALDATE)`)
          .then(lines => {
            const times = lines.map(l => (l.match(/INTERNALDATE "([^"]+)"/i) || [])[1]).filter(Boolean).map(parseInternalDate)
              .filter(t => t > c.since).sort((a, b) => a - b);
            return times.length ? { email: c.email, at: times[0] } : null;
          })
          .catch(() => null);
      }));
      try { await cmd('LOGOUT'); } catch {}
      return results.filter(Boolean);
    })().then(v => finish(null, v), e => finish(e));
  });
}

module.exports = { checkReplies, parseInternalDate };
