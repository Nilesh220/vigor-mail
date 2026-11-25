// Minimal Gmail IMAP client used only to answer one question:
// "Has this contact emailed me since <date>?"  (read-only, nothing is changed in the mailbox)

const tls = require('tls');

const SAFE_EMAIL = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

function quote(s) { return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'; }

function gmailDate(ms) {
  const d = new Date(ms - 864e5); // one day of slack for time zones
  return `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${String(d.getUTCDate()).padStart(2, '0')}`;
}

function checkReplies({ user, pass, contacts, since }) {
  const host = process.env.IMAP_HOST || 'imap.gmail.com';
  const port = Number(process.env.IMAP_PORT || 993);
  const list = [...new Set(contacts.map(c => String(c).trim().toLowerCase()))].filter(c => SAFE_EMAIL.test(c));

  return new Promise((resolve, reject) => {
    let done = false;
    const sock = tls.connect({ host, port, servername: host });
    const finish = (err, val) => {
      if (done) return; done = true;
      try { sock.end(); sock.destroy(); } catch {}
      err ? reject(err) : resolve(val);
    };
    sock.setTimeout(22000, () => finish(new Error('Gmail took too long to answer.')));
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

      // Find "All Mail" (name differs by language); fall back to the inbox.
      let mailbox = 'INBOX';
      try {
        const lines = await cmd('LIST "" "*"');
        const all = lines.find(l => /\\All\b/i.test(l));
        const m = all && all.match(/^\* LIST \([^)]*\) (?:"(?:[^"\\]|\\.)*"|NIL) (.+)$/i);
        if (m) mailbox = m[1].trim();
      } catch {}
      await cmd('EXAMINE ' + mailbox);

      const after = gmailDate(since || Date.now() - 30 * 864e5);
      const results = await Promise.all(list.map(email =>
        cmd('SEARCH X-GM-RAW ' + quote(`from:${email} after:${after} -subject:"automatic reply" -subject:"out of office" -subject:"auto-reply"`))
          .then(lines => lines.some(l => /^\* SEARCH \d/i.test(l)))
          .catch(() => false)
      ));
      try { await cmd('LOGOUT'); } catch {}
      return list.filter((_, i) => results[i]);
    })().then(v => finish(null, v), e => finish(e));
  });
}

module.exports = { checkReplies };
