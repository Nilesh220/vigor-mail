'use strict';
/* VigorLaunchpad · Mail Studio
   Static front end on Vercel. Talks to /api/send, /api/verify, /api/logs, /api/health. */

// ═══════════════════════════════════════════════════════════════
//  Content: campaign types, tips, templates
// ═══════════════════════════════════════════════════════════════
const TYPES = {
  college: 'College', btl: 'BTL', influencer: 'Influencer', brand_activation: 'Brand activation',
  digital: 'Digital', followup: 'Follow-up', custom: 'Other',
};

const TIPS = {
  college: [
    'Name the fests or cities in the subject. “Mood Indigo” beats “college event”.',
    'Give one concrete number you can stand behind, like footfall or past reach.',
    'Suggest one format they can say yes to, not a menu of ten.',
    'Pitch 6–8 weeks before fest season, when brand budgets get locked.',
  ],
  btl: [
    'Say exactly where: the mall, society cluster or city.',
    'Brands buy cost per contact. Mention it if you have it.',
    'One photo-worthy past activation (as a Drive link) does more than a long deck.',
    'Offer a small pilot in one city to lower the risk of saying yes.',
  ],
  influencer: [
    'Talk engagement and audience fit, not follower counts.',
    'Name 2–3 creator profiles that suit their category.',
    'Be clear on deliverables: reels, stories, usage rights.',
    'Share past creator work as a link, not a heavy attachment.',
  ],
  brand_activation: [
    'Open with the experience. What will people see and do?',
    'Mention the location and expected footfall.',
    'Show you handle it end to end: permissions, staff, set-up.',
    'Pitch around a moment: a launch, festival or season.',
  ],
  digital: [
    'Reference something specific about their current social or ads.',
    'Offer a short audit as the first step. It’s an easy yes.',
    'Use plain business outcomes (leads, sales), not jargon.',
    'Keep it under 150 words. Digital teams skim.',
  ],
  followup: [
    'Wait 3–5 working days after the first email.',
    'Keep it to 2–3 lines and add one new reason to reply.',
    'Stop after two follow-ups. A third hurts your sender reputation.',
  ],
  custom: [
    'Open with something specific to the brand, so it’s clear you did your homework.',
    'Keep subjects under 50–60 characters.',
    'Ask for one thing only, usually a short call.',
    'Avoid words like FREE, GUARANTEED and URGENT.',
  ],
};

const TEMPLATES = {
  college: [
    {
      name: 'Campus activation',
      subject: 'Campus activations for {{brand}} this season',
      body: `<p>Hi {{first_name}},</p>
<p>I’m with VigorLaunchpad, a marketing agency that runs college campaigns and on-ground activations for youth brands.</p>
<p>With fest season coming up, I think there’s a strong fit for {{brand}} on campus. A few formats that work well for brands like yours:</p>
<ul><li>Stalls and sampling zones at college fests</li><li>Student ambassador programmes across campuses</li><li>Reels and content made by student creators</li></ul>
<p>[Add one line about a recent college campaign or result]</p>
<p>Would you be open to a 15-minute call this week? I can share a short plan for {{brand}} with colleges, formats and costs.</p>
<p>Best regards,</p>`,
    },
    {
      name: 'Fest sponsorship',
      subject: 'Sponsorship options for {{brand}} at [fest name]',
      body: `<p>Hi {{first_name}},</p>
<p>We’re the marketing partner for [fest name], which draws [footfall] students over [number] days, and {{brand}} would be a natural fit for this crowd.</p>
<p>Sponsors typically get branding across stages and entry gates, a dedicated activation zone, and coverage on the fest’s social pages.</p>
<p>I can send over the sponsorship deck with tiers and pricing. Would it help if I shared it here, or is a quick call easier?</p>
<p>Best regards,</p>`,
    },
  ],
  btl: [
    {
      name: 'Mall & retail activation',
      subject: '{{brand}} on-ground activation idea',
      body: `<p>Hi {{first_name}},</p>
<p>I’m reaching out from VigorLaunchpad. We plan and run BTL activations: mall kiosks, retail sampling, and transit and society campaigns.</p>
<p>For {{brand}}, I had a specific idea in mind: [one-line activation idea, with city or location].</p>
<p>We manage everything end to end, from permissions and staffing to set-up and daily reporting, so your team only sees results.</p>
<p>Could we set up a short call to understand your goals for the next quarter?</p>
<p>Best regards,</p>`,
    },
    {
      name: 'Hyperlocal / society',
      subject: 'Neighbourhood-level campaign for {{brand}}',
      body: `<p>Hi {{first_name}},</p>
<p>Many brands we work with find that hyperlocal campaigns convert better than broad reach, especially for trials and sign-ups.</p>
<p>For {{brand}}, we could run residential society activations and RWA tie-ups in [cities], with every visit tracked for footfall and conversions.</p>
<p>Happy to put together a pilot plan for one city first. Would you be open to a 15-minute chat?</p>
<p>Best regards,</p>`,
    },
  ],
  influencer: [
    {
      name: 'Creator campaign',
      subject: 'Creator campaign idea for {{brand}}',
      body: `<p>Hi {{first_name}},</p>
<p>I’m with VigorLaunchpad. We run influencer campaigns with nano and micro creators across Instagram and YouTube.</p>
<p>I’ve been following {{brand}}’s recent content, and I think a creator-led push around [product or launch] could do really well.</p>
<p>We handle shortlisting, briefs, approvals and reporting, so you only review content and see the numbers.</p>
<p>Would you like me to send 3–4 creator profiles that suit {{brand}}?</p>
<p>Best regards,</p>`,
    },
    {
      name: 'UGC content',
      subject: 'UGC content for {{brand}}’s socials',
      body: `<p>Hi {{first_name}},</p>
<p>Brands are getting their best-performing ads from user-generated content right now, and I think {{brand}} could get a lot out of it.</p>
<p>We can produce a monthly batch of creator videos that you can post organically or run as ads, with usage rights included.</p>
<p>Can I share a few samples from our recent work?</p>
<p>Best regards,</p>`,
    },
  ],
  brand_activation: [
    {
      name: 'Experiential pop-up',
      subject: 'Pop-up experience for {{brand}}',
      body: `<p>Hi {{first_name}},</p>
<p>I’m reaching out from VigorLaunchpad. We design and run brand activations: pop-ups, launch events and experience zones.</p>
<p>For {{brand}}, I’m imagining [one-line concept] at [location], built around [launch or season].</p>
<p>We take care of concept, design, permissions and on-ground staff, and we share a full report with footfall, trials and social mentions after.</p>
<p>Would you be open to a quick call to see if this fits your plans?</p>
<p>Best regards,</p>`,
    },
  ],
  digital: [
    {
      name: 'Digital audit offer',
      subject: 'A few ideas for {{brand}}’s digital',
      body: `<p>Hi {{first_name}},</p>
<p>I was looking at {{brand}}’s Instagram and ads, and noticed [one specific observation].</p>
<p>At VigorLaunchpad, we run performance marketing and content for consumer brands across Meta and Google.</p>
<p>I’d be glad to put together a short audit of {{brand}}’s current setup with 3–4 quick wins, at no charge. Would that be useful?</p>
<p>Best regards,</p>`,
    },
  ],
  followup: [
    {
      name: 'Gentle nudge',
      subject: 'Following up on campaign ideas for {{brand}}',
      body: `<p>Hi {{first_name}},</p>
<p>Just following up on my note from last week about a campaign for {{brand}}.</p>
<p>If it helps, I can send a one-page plan so you can see what it would look like before we talk.</p>
<p>Best regards,</p>`,
    },
    {
      name: 'Last check-in',
      subject: 'Should I close the loop?',
      body: `<p>Hi {{first_name}},</p>
<p>I don’t want to fill your inbox, so this is my last note. If campaigns for {{brand}} aren’t a priority right now, no problem at all.</p>
<p>If they are, or if someone else on your team handles this, I’d appreciate a pointer.</p>
<p>Best regards,</p>`,
    },
  ],
  custom: [],
};

const SPAM_WORDS = ['free', 'guaranteed', 'guarantee', '100%', 'act now', 'urgent', 'limited time', 'click here', 'buy now',
  'winner', 'cash', 'earn money', 'risk-free', 'risk free', 'no cost', 'offer expires', 'lowest price', '$$$', 'double your',
  'congratulations', 'exclusive deal', 'special promotion', 'once in a lifetime', 'no obligation', 'amazing offer', 'dear friend'];
const SHORTENERS = /\b(bit\.ly|tinyurl\.com|goo\.gl|t\.co|ow\.ly|is\.gd|cutt\.ly|rebrand\.ly|shorturl\.at)\b/i;
const PACES = { gentle: [10, 20], normal: [5, 10], fast: [2, 4] };
const INLINE_LIMIT = 3 * 1024 * 1024;   // without team storage
const STORED_LIMIT = 15 * 1024 * 1024;  // with team storage (Gmail's own cap is 25 MB after encoding)
const CHUNK_BYTES = 2.4 * 1024 * 1024;
const BLOCKED_EXT = new Set(['ade','adp','apk','appx','bat','cab','chm','cmd','com','cpl','dll','dmg','exe','hta','ins','iso','isp','jar','js','jse','lib','lnk','mde','msc','msi','msp','mst','nsh','pif','ps1','scr','sct','shb','sys','vb','vbe','vbs','vxd','wsc','wsf','wsh']);
const FU_DUE_DAYS = 3, FU_MAX = 2;
function storageOn() { return S.team.storage === true; }
function attachLimit() { return storageOn() ? STORED_LIMIT : INLINE_LIMIT; }
const EMAIL_RE = /^[^\s@<>()",;]+@[^\s@<>()",;]+\.[^\s@<>()",;]{2,}$/;

// ═══════════════════════════════════════════════════════════════
//  State
// ═══════════════════════════════════════════════════════════════
const DEFAULT_SETTINGS = {
  name: '', email: '', pass: '', acct: 'gmail', signature: '',
  pace: 'normal', unsubscribe: true, dupDays: 30, replyTo: '', dnc: [],
};
const S = {
  settings: { ...DEFAULT_SETTINGS },
  recipients: [],      // parsed list
  fields: [],          // extra merge fields found in a sheet
  excluded: new Set(), // removed by hand
  parseInfo: { invalid: 0, dupes: 0 },
  files: [],
  local: [],           // events sent from this browser
  team: { storage: null, events: [], loaded: false, error: '', capped: false, accessRequired: false },
  myTemplates: [],
  activeTpl: null,
  period: 7, person: '',
  logLimit: 200,
  job: null,
  pvIndex: 0,
  lastFocus: 'editor',
  savedRange: null,
  replies: {},         // 'from|to' -> when a reply was found
  lastReplyCheck: 0,
  fu: null,            // follow-up mode
  uploads: new Map(),  // file -> stored attachment id
};

const $ = id => document.getElementById(id);
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};

// ═══════════════════════════════════════════════════════════════
//  Init
// ═══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  S.settings = { ...DEFAULT_SETTINGS, ...store.get('vl_settings', {}) };
  S.local = store.get('vl_events', []);
  S.myTemplates = store.get('vl_templates', []);
  S.replies = store.get('vl_replies', {});
  S.lastReplyCheck = store.get('vl_reply_check', 0);
  try { document.execCommand('defaultParagraphSeparator', false, 'p'); } catch {}

  bindNav();
  bindCompose();
  bindTeam();
  bindSettings();
  bindModals();

  restoreDraft();
  fillSettingsForm();
  refreshIdentity();
  renderTemplates();
  renderTips();
  parseAndRender();
  renderAttachments();
  updateReadiness();
  updateQuota();

  updateFuBadge();
  route();
  window.addEventListener('hashchange', route);
  checkServer();
});

// ═══════════════════════════════════════════════════════════════
//  Navigation
// ═══════════════════════════════════════════════════════════════
const PAGE_TITLES = { compose: 'New campaign', followups: 'Follow-ups', team: 'Team activity', log: 'Sent log', settings: 'Settings' };

function bindNav() {
  $('menuBtn').onclick = () => { $('nav').classList.add('open'); $('navScrim').classList.add('open'); };
  $('navScrim').onclick = closeNav;
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-goto]');
    if (g) { e.preventDefault(); go(g.dataset.goto); }
  });
}
function closeNav() { $('nav').classList.remove('open'); $('navScrim').classList.remove('open'); }
function go(page) { if (location.hash !== '#' + page) location.hash = page; else route(); }
function route() {
  const page = (location.hash || '#compose').slice(1);
  const p = PAGE_TITLES[page] ? page : 'compose';
  document.querySelectorAll('.page').forEach(s => { s.hidden = s.id !== 'page-' + p; });
  document.querySelectorAll('.nav-link').forEach(a => a.classList.toggle('on', a.dataset.page === p));
  $('topbarTitle').textContent = PAGE_TITLES[p];
  document.title = PAGE_TITLES[p] + ' · VigorLaunchpad Mail Studio';
  closeNav();
  window.scrollTo(0, 0);
  if (p === 'team') { renderTeam(); loadTeam(); }
  if (p === 'followups') { renderFollowups(); loadTeam(); autoCheckReplies(); }
  if (p === 'log') { S.logLimit = 200; renderLog(); loadTeam(); }
}

// ═══════════════════════════════════════════════════════════════
//  Server
// ═══════════════════════════════════════════════════════════════
async function api(path, opts = {}) {
  const headers = { ...(opts.body ? { 'Content-Type': 'application/json' } : {}), 'x-vl-access': store.get('vl_access', '') };
  const res = await fetch(path, { method: opts.method || 'GET', headers, body: opts.body ? JSON.stringify(opts.body) : undefined });
  let data = {};
  try { data = await res.json(); } catch {}
  if (res.status === 401 && data.code === 'ACCESS_REQUIRED') {
    store.del('vl_access');
    openAccess();
    const err = new Error(data.error || 'Access code required'); err.access = true; throw err;
  }
  return { ok: res.ok, status: res.status, data };
}

async function checkServer() {
  try {
    const { data } = await api('/api/health');
    S.team.storage = !!data.storage;
    S.team.accessRequired = !!data.accessRequired;
    if (data.accessRequired && !store.get('vl_access', '')) openAccess();
    renderStorageStatus(); renderAttachments(); updateReadiness();
    if (data.storage && (!data.accessRequired || store.get('vl_access', ''))) loadTeam();
  } catch {
    S.team.storage = null;
    renderStorageStatus();
  }
}

let teamLoading = null;
async function loadTeam(force) {
  if (S.team.storage === false) { renderTeam(); renderLog(); return; }
  if (teamLoading && !force) return teamLoading;
  teamLoading = (async () => {
    try {
      const { ok, data } = await api('/api/logs');
      if (data.storage === false) { S.team.storage = false; }
      else if (ok) { S.team.events = data.events || []; S.team.loaded = true; S.team.capped = !!data.capped; S.team.error = ''; S.team.storage = true; mergeReplies(data.replies); }
      else { S.team.error = data.error || 'Could not load team history.'; }
    } catch (e) {
      if (!e.access) S.team.error = 'Could not reach the server.';
    }
    teamLoading = null;
    renderStorageStatus();
    renderTeam(); renderLog(); updateQuota(); parseAndRender(true); renderAttachments(); renderFollowups(); updateFuBadge();
  })();
  return teamLoading;
}

function events() {
  // Team history when storage is connected; otherwise this browser's own history.
  return S.team.storage && S.team.loaded ? S.team.events : S.local;
}
function allKnownEvents() {
  if (!(S.team.storage && S.team.loaded)) return S.local;
  const seen = new Set(S.team.events.map(e => e.t + e.to));
  return S.team.events.concat(S.local.filter(e => !seen.has(e.t + e.to)));
}

// ═══════════════════════════════════════════════════════════════
//  Compose: bindings
// ═══════════════════════════════════════════════════════════════
function bindCompose() {
  const editor = $('editor');
  $('brand').addEventListener('input', () => { saveDraftSoon(); parseAndRender(true); updateReadiness(); });
  $('ctype').addEventListener('change', () => { S.activeTpl = null; renderTemplates(); renderTips(); saveDraftSoon(); });
  $('subject').addEventListener('input', () => { updateSubjectCount(); saveDraftSoon(); updateReadinessSoon(); });
  $('subject').addEventListener('focus', () => { S.lastFocus = 'subject'; });
  editor.addEventListener('focus', () => { S.lastFocus = 'editor'; });
  editor.addEventListener('input', () => { saveDraftSoon(); updateReadinessSoon(); });
  editor.addEventListener('blur', saveSelection);
  editor.addEventListener('keyup', saveSelection);
  editor.addEventListener('mouseup', saveSelection);
  editor.addEventListener('paste', onPaste);
  $('useSignature').addEventListener('change', () => { saveDraftSoon(); updateReadiness(); });

  document.querySelectorAll('.tb[data-cmd]').forEach(b => {
    b.addEventListener('mousedown', e => e.preventDefault());
    b.addEventListener('click', () => {
      const cmd = b.dataset.cmd;
      if (cmd === 'link') return openLinkModal();
      editor.focus();
      document.execCommand(cmd, false, null);
      if (cmd === 'removeFormat') document.execCommand('unlink', false, null);
      saveDraftSoon(); updateReadinessSoon();
    });
  });

  // Merge-field menu
  const mb = $('fieldMenuBtn'), menu = $('fieldMenu');
  mb.addEventListener('mousedown', e => e.preventDefault());
  mb.addEventListener('click', () => {
    const open = menu.hidden;
    if (open) renderFieldMenu();
    menu.hidden = !open; mb.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', e => { if (!e.target.closest('.menu-host')) { menu.hidden = true; mb.setAttribute('aria-expanded', 'false'); } });

  $('saveTplBtn').onclick = () => {
    if (!$('subject').value.trim() && isEditorEmpty()) return toast('info', 'Nothing to save yet', 'Write a subject and email first.');
    $('tplName').value = ''; openModal('tplModal'); setTimeout(() => $('tplName').focus(), 50);
  };
  $('tplSave').onclick = saveMyTemplate;
  $('tplName').addEventListener('keydown', e => { if (e.key === 'Enter') saveMyTemplate(); });

  // Recipients
  let t;
  $('recipientsInput').addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { S.excluded.clear(); parseAndRender(); saveDraftSoon(); }, 220); });
  $('csvBtn').onclick = () => $('csvFile').click();
  $('csvFile').onchange = e => { const f = e.target.files[0]; if (f) loadCsvFile(f); e.target.value = ''; };
  $('sampleCsvBtn').onclick = downloadSample;
  $('recBody').addEventListener('click', e => {
    const b = e.target.closest('[data-rm]'); if (!b) return;
    S.excluded.add(b.dataset.rm); parseAndRender(true);
  });
  $('recSummary').addEventListener('click', e => {
    if (e.target.closest('[data-undo-rm]')) { S.excluded.clear(); parseAndRender(true); }
  });
  const ri = $('recipientsInput');
  ri.addEventListener('dragover', e => { e.preventDefault(); ri.classList.add('over'); });
  ri.addEventListener('dragleave', () => ri.classList.remove('over'));
  ri.addEventListener('drop', e => {
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f && /\.(csv|tsv|txt)$/i.test(f.name)) { e.preventDefault(); loadCsvFile(f); }
  });

  // Attachments
  const drop = $('drop');
  drop.onclick = () => $('attFile').click();
  drop.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('attFile').click(); } };
  $('attFile').onchange = e => { addFiles(e.target.files); e.target.value = ''; };
  drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('over'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('over'));
  drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('over'); addFiles(e.dataTransfer.files); });
  $('attList').addEventListener('click', e => {
    const b = e.target.closest('[data-rm-file]'); if (!b) return;
    S.files.splice(+b.dataset.rmFile, 1); renderAttachments(); updateReadiness();
  });

  // Actions
  $('previewBtn').onclick = () => openPreview(0);
  $('pvSend').onclick = () => { closeModal('previewModal'); reviewAndSend(); };
  $('sendBtn').onclick = reviewAndSend;
  $('testBtn').onclick = sendTest;
  $('newDraftBtn').onclick = startOver;
  $('pvPrev').onclick = () => openPreview(S.pvIndex - 1);
  $('pvNext').onclick = () => openPreview(S.pvIndex + 1);

  // Link modal
  $('lnAdd').onclick = insertLink;
  $('lnUrl').addEventListener('keydown', e => { if (e.key === 'Enter') insertLink(); });

  $('fuCancel').onclick = () => { exitFollowUp(); toast('info', 'Follow-up cancelled', 'Your previous draft is back.'); };
  $('fuThreaded').onchange = e => {
    if (!S.fu) return;
    S.fu.threaded = e.target.checked;
    const first = S.fu.contacts.values().next().value;
    if (S.fu.threaded) { S.fu.altSubject = $('subject').value; $('subject').value = first ? reSubject(first.subject) : $('subject').value; }
    else $('subject').value = S.fu.altSubject || TEMPLATES.followup[0].subject;
    applyFuUI(); updateSubjectCount(); updateReadiness();
  };

  window.addEventListener('beforeunload', e => { if (S.job && S.job.running) { e.preventDefault(); e.returnValue = ''; } });
}

// ═══════════════════════════════════════════════════════════════
//  Draft
// ═══════════════════════════════════════════════════════════════
let draftTimer;
function saveDraftSoon() { clearTimeout(draftTimer); draftTimer = setTimeout(saveDraft, 400); }
function saveDraft() {
  if (S.fu) return;
  store.set('vl_draft', {
    brand: $('brand').value, type: $('ctype').value, subject: $('subject').value,
    body: $('editor').innerHTML, recipients: $('recipientsInput').value, useSig: $('useSignature').checked,
  });
}
function restoreDraft() {
  const d = store.get('vl_draft', null);
  if (!d) { $('ctype').value = 'college'; updateSubjectCount(); return; }
  $('brand').value = d.brand || '';
  $('ctype').value = TYPES[d.type] ? d.type : 'college';
  $('subject').value = d.subject || '';
  $('editor').innerHTML = sanitize(d.body || '');
  $('recipientsInput').value = d.recipients || '';
  $('useSignature').checked = d.useSig !== false;
  updateSubjectCount();
}
function startOver() {
  const prev = store.get('vl_draft', null);
  $('brand').value = ''; $('subject').value = ''; $('editor').innerHTML = ''; $('recipientsInput').value = '';
  S.files = []; S.excluded.clear(); S.activeTpl = null;
  saveDraft(); renderAttachments(); parseAndRender(); renderTemplates(); updateSubjectCount(); updateReadiness();
  toast('info', 'Started a fresh campaign', 'Attachments were removed too.', prev ? {
    label: 'Undo', fn: () => { store.set('vl_draft', prev); restoreDraft(); parseAndRender(); updateReadiness(); renderTemplates(); },
  } : null);
}

// ═══════════════════════════════════════════════════════════════
//  Templates
// ═══════════════════════════════════════════════════════════════
function renderTemplates() {
  const type = S.fu ? 'followup' : $('ctype').value;
  const built = (TEMPLATES[type] || []).map((t, i) => ({ ...t, id: 'b:' + type + ':' + i }));
  const mine = S.myTemplates.filter(t => t.type === type);
  const wrap = $('templateChips');
  if (!built.length && !mine.length) {
    wrap.innerHTML = `<span class="muted" style="font-size:.84rem">No templates for this type yet. Write your own and click “Save as template”.</span>`;
    return;
  }
  wrap.innerHTML = built.map(t => `<button type="button" class="chip${S.activeTpl === t.id ? ' on' : ''}" data-tpl="${esc(t.id)}">${esc(t.name)}</button>`).join('') +
    mine.map(t => `<button type="button" class="chip chip-mine${S.activeTpl === t.id ? ' on' : ''}" data-tpl="${esc(t.id)}" title="Your template">${esc(t.name)}<svg class="chip-x" data-del-tpl="${esc(t.id)}" viewBox="0 0 24 24" aria-label="Delete template"><path d="M7 7l10 10M17 7L7 17"/></svg></button>`).join('');
  wrap.onclick = e => {
    const del = e.target.closest('[data-del-tpl]');
    if (del) {
      e.stopPropagation();
      const id = del.dataset.delTpl; const t = S.myTemplates.find(x => x.id === id);
      S.myTemplates = S.myTemplates.filter(x => x.id !== id); store.set('vl_templates', S.myTemplates); renderTemplates();
      toast('info', 'Template deleted', t ? t.name : '', { label: 'Undo', fn: () => { S.myTemplates.push(t); store.set('vl_templates', S.myTemplates); renderTemplates(); } });
      return;
    }
    const b = e.target.closest('[data-tpl]'); if (b) applyTemplate(b.dataset.tpl);
  };
}
function findTemplate(id) {
  if (id.startsWith('b:')) { const [, type, i] = id.split(':'); return (TEMPLATES[type] || [])[+i]; }
  return S.myTemplates.find(t => t.id === id);
}
function applyTemplate(id) {
  const t = findTemplate(id); if (!t) return;
  const prev = { subject: $('subject').value, body: $('editor').innerHTML, tpl: S.activeTpl };
  const hadContent = prev.subject.trim() || !isEditorEmpty();
  $('subject').value = t.subject;
  $('editor').innerHTML = sanitize(t.body);
  S.activeTpl = id;
  renderTemplates(); updateSubjectCount(); saveDraft(); updateReadiness();
  const hasBrackets = /\[[^\]]{2,}\]/.test(t.subject + t.body);
  toast('info', `“${t.name}” loaded`, hasBrackets ? 'Fill in the parts in [square brackets] before sending.' : 'Edit it however you like.',
    hadContent ? { label: 'Undo', fn: () => { $('subject').value = prev.subject; $('editor').innerHTML = prev.body; S.activeTpl = prev.tpl; renderTemplates(); updateSubjectCount(); saveDraft(); updateReadiness(); } } : null);
}
function saveMyTemplate() {
  const name = $('tplName').value.trim();
  if (!name) { $('tplName').focus(); return; }
  const t = { id: 'm:' + Date.now().toString(36), type: $('ctype').value, name, subject: $('subject').value, body: sanitize($('editor').innerHTML) };
  if (S.fu) t.type = 'followup';
  S.myTemplates.push(t); store.set('vl_templates', S.myTemplates);
  S.activeTpl = t.id; renderTemplates(); closeModal('tplModal');
  toast('ok', 'Template saved', `Find it under ${TYPES[t.type]}.`);
}
function renderTips() {
  const type = S.fu ? 'followup' : $('ctype').value;
  $('tipsTitle').textContent = (type === 'custom' ? 'Pitch' : TYPES[type]) + ' tips';
  $('tips').innerHTML = (TIPS[type] || TIPS.custom).map(t => `<li>${esc(t)}</li>`).join('');
}

// ═══════════════════════════════════════════════════════════════
//  Editor helpers
// ═══════════════════════════════════════════════════════════════
function isEditorEmpty() { return !$('editor').textContent.trim(); }
function saveSelection() {
  const sel = window.getSelection();
  if (sel.rangeCount && $('editor').contains(sel.anchorNode)) S.savedRange = sel.getRangeAt(0).cloneRange();
}
function restoreSelection() {
  const ed = $('editor'); ed.focus();
  if (S.savedRange) { const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(S.savedRange); }
  else { const r = document.createRange(); r.selectNodeContents(ed); r.collapse(false); const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r); }
}
function renderFieldMenu() {
  const base = [['first_name', 'First name'], ['name', 'Full name'], ['brand', 'Brand'], ['company', 'Company']];
  const extra = S.fields.filter(f => !['first_name', 'name', 'brand', 'company', 'email'].includes(f)).map(f => [f, 'From your sheet']);
  $('fieldMenu').innerHTML = base.concat(extra).map(([k, l]) => `<button type="button" role="menuitem" data-field="${esc(k)}">{{${esc(k)}}}<span>${esc(l)}</span></button>`).join('');
  $('fieldMenu').onmousedown = e => e.preventDefault();
  $('fieldMenu').onclick = e => {
    const b = e.target.closest('[data-field]'); if (!b) return;
    insertField(b.dataset.field);
    $('fieldMenu').hidden = true;
  };
}
function insertField(key) {
  const token = `{{${key}}}`;
  if (S.lastFocus === 'subject') {
    const inp = $('subject'); const s = inp.selectionStart ?? inp.value.length, e = inp.selectionEnd ?? s;
    inp.value = inp.value.slice(0, s) + token + inp.value.slice(e);
    inp.focus(); inp.setSelectionRange(s + token.length, s + token.length);
    updateSubjectCount();
  } else {
    restoreSelection();
    document.execCommand('insertText', false, token);
  }
  saveDraftSoon(); updateReadinessSoon();
}
function openLinkModal() {
  saveSelection();
  const sel = window.getSelection();
  $('lnText').value = sel && $('editor').contains(sel.anchorNode) ? sel.toString() : '';
  $('lnUrl').value = '';
  openModal('linkModal'); setTimeout(() => $('lnUrl').focus(), 50);
}
function insertLink() {
  let url = $('lnUrl').value.trim();
  if (!url) return $('lnUrl').focus();
  if (!/^(https?:|mailto:)/i.test(url)) url = 'https://' + url;
  const text = $('lnText').value.trim() || url;
  closeModal('linkModal');
  restoreSelection();
  document.execCommand('insertHTML', false, `<a href="${esc(url)}">${esc(text)}</a>`);
  saveDraftSoon(); updateReadiness();
}
function onPaste(e) {
  e.preventDefault();
  const cd = e.clipboardData;
  const html = cd.getData('text/html');
  let out;
  if (html) out = sanitize(html);
  else {
    const text = cd.getData('text/plain') || '';
    out = text.split(/\n{2,}/).map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('');
    if (!/\n/.test(text)) out = esc(text);
  }
  document.execCommand('insertHTML', false, out);
}

// Keep email HTML clean and simple: cleaner HTML lands in the inbox more often.
const ALLOWED = new Set(['P', 'DIV', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'UL', 'OL', 'LI', 'A', 'SPAN', 'BLOCKQUOTE']);
function sanitize(html) {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  const walk = node => {
    [...node.childNodes].forEach(ch => {
      if (ch.nodeType === 8) { ch.remove(); return; }
      if (ch.nodeType !== 1) return;
      const tag = ch.tagName;
      if (['SCRIPT', 'STYLE', 'META', 'LINK', 'TITLE', 'IMG', 'IFRAME', 'OBJECT', 'SVG', 'XML'].includes(tag) || tag.includes(':')) { ch.remove(); return; }
      walk(ch);
      if (/^H[1-6]$/.test(tag)) { const p = doc.createElement('p'); const b = doc.createElement('strong'); b.append(...ch.childNodes); p.append(b); ch.replaceWith(p); return; }
      if (!ALLOWED.has(tag)) { ch.replaceWith(...ch.childNodes); return; }
      const href = tag === 'A' ? ch.getAttribute('href') : null;
      [...ch.attributes].forEach(a => ch.removeAttribute(a.name));
      if (tag === 'A') { if (href && /^(https?:|mailto:)/i.test(href.trim())) ch.setAttribute('href', href.trim()); else ch.replaceWith(...ch.childNodes); }
      if (tag === 'SPAN') ch.replaceWith(...ch.childNodes);
    });
  };
  walk(doc.body);
  return doc.body.innerHTML.replace(/(<p><br><\/p>\s*){2,}/g, '<p><br></p>').trim();
}

// ═══════════════════════════════════════════════════════════════
//  Recipients
// ═══════════════════════════════════════════════════════════════
const norm = h => String(h || '').trim().toLowerCase().replace(/^﻿/, '').replace(/["']/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

function parseTable(text, delim) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === delim) { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some(x => x.trim())) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell); if (row.some(x => x.trim())) rows.push(row);
  return rows;
}
function detectDelim(line) {
  const counts = { '\t': (line.match(/\t/g) || []).length, ',': (line.match(/,/g) || []).length, ';': (line.match(/;/g) || []).length };
  const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return best[1] ? best[0] : null;
}
function titleCase(s) {
  s = String(s || '').trim().replace(/\s+/g, ' ');
  if (s && (s === s.toLowerCase() || s === s.toUpperCase())) s = s.toLowerCase().replace(/(^|[\s'-])\p{L}/gu, m => m.toUpperCase());
  return s;
}

function parseRecipients(raw) {
  const out = { list: [], invalid: 0, dupes: 0, fields: [] };
  const text = String(raw || '').replace(/^﻿/, '').trim();
  if (!text) return out;
  const seen = new Set();
  const push = r => {
    r.email = r.email.trim().toLowerCase().replace(/^mailto:/, '');
    if (!EMAIL_RE.test(r.email)) { out.invalid++; return; }
    if (seen.has(r.email)) { out.dupes++; return; }
    seen.add(r.email);
    r.name = titleCase(r.name);
    out.list.push(r);
  };

  const firstLine = text.split(/\r?\n/)[0];
  const delim = detectDelim(firstLine);
  const header = delim ? parseTable(firstLine, delim)[0].map(norm) : [norm(firstLine)];
  const emailIdx = header.findIndex(h => h === 'email' || h === 'e_mail' || h.includes('email') || h === 'mail');

  if (emailIdx > -1) {
    // Sheet with a header row
    const rows = parseTable(text, delim || ',');
    const hdr = rows.shift().map(norm);
    const find = names => hdr.findIndex(h => names.includes(h));
    const iName = find(['name', 'full_name', 'contact_name', 'contact', 'person', 'poc', 'poc_name']);
    const iFirst = find(['first_name', 'firstname', 'first']);
    const iLast = find(['last_name', 'lastname', 'surname', 'last']);
    const iBrand = find(['brand', 'brand_name', 'brands']);
    const iCompany = find(['company', 'company_name', 'organisation', 'organization', 'org']);
    out.fields = hdr.filter(Boolean);
    rows.forEach(cols => {
      const get = i => (i > -1 ? String(cols[i] || '').trim() : '');
      const fields = {};
      hdr.forEach((h, i) => { if (h) fields[h] = String(cols[i] || '').trim(); });
      const name = get(iName) || [get(iFirst), get(iLast)].filter(Boolean).join(' ');
      push({ email: get(emailIdx), name, brand: get(iBrand), company: get(iCompany), fields });
    });
    return out;
  }

  // Free text: one contact per line, or many emails per line
  text.split(/\r?\n/).forEach(line => {
    line = line.trim(); if (!line) return;
    const angle = line.match(/^"?([^"<]*?)"?\s*<\s*([^>\s]+)\s*>/);
    if (angle) return push({ email: angle[2], name: angle[1], brand: '', company: '', fields: {} });
    const cells = line.split(/[\t,;]+/).map(c => c.trim()).filter(Boolean);
    const emailCells = cells.filter(c => c.includes('@'));
    if (emailCells.length === 1 && cells.length > 1 && cells.length <= 4) {
      const rest = cells.filter(c => c !== emailCells[0]);
      return push({ email: emailCells[0], name: rest[0] || '', brand: rest[1] || '', company: '', fields: {} });
    }
    line.split(/[\s,;]+/).filter(tok => tok.includes('@')).forEach(tok => push({ email: tok.replace(/^[<("']+|[>)"'.]+$/g, ''), name: '', brand: '', company: '', fields: {} }));
  });
  return out;
}

function recentMap() {
  const days = +S.settings.dupDays || 0;
  const m = new Map();
  if (!days) return m;
  const since = Date.now() - days * 864e5;
  allKnownEvents().forEach(e => {
    if (!e.ok || e.t < since) return;
    const prev = m.get(e.to);
    if (!prev || prev.t < e.t) m.set(e.to, e);
  });
  return m;
}

function parseAndRender(keepExcluded) {
  if (!keepExcluded) S.excluded.clear();
  const p = parseRecipients($('recipientsInput').value);
  const dnc = new Set((S.settings.dnc || []).map(x => x.toLowerCase()));
  const recent = recentMap();
  S.fields = p.fields;
  S.parseInfo = { invalid: p.invalid, dupes: p.dupes };
  S.recipients = p.list.filter(r => !S.excluded.has(r.email)).map(r => ({
    ...r,
    dnc: dnc.has(r.email),
    recent: (S.fu && S.fu.contacts.has(r.email)) ? null : (recent.get(r.email) || null),
  }));
  renderRecipients();
  updateSendInfo();
}

function renderRecipients() {
  const list = S.recipients;
  const sum = $('recSummary'), wrap = $('recTableWrap');
  if (!list.length && !S.parseInfo.invalid && !S.excluded.size) { sum.innerHTML = ''; wrap.hidden = true; return; }
  const dnc = list.filter(r => r.dnc).length;
  const recent = list.filter(r => r.recent && !r.dnc).length;
  const noName = list.filter(r => !r.name).length;
  const bits = [`<span><strong>${list.length}</strong> recipient${list.length === 1 ? '' : 's'}</span>`];
  if (S.parseInfo.dupes) bits.push(`<span class="flag flag-muted">${S.parseInfo.dupes} duplicate${S.parseInfo.dupes > 1 ? 's' : ''} removed</span>`);
  if (S.parseInfo.invalid) bits.push(`<span class="flag flag-bad">${S.parseInfo.invalid} invalid address${S.parseInfo.invalid > 1 ? 'es' : ''} ignored</span>`);
  if (recent) bits.push(`<span class="flag flag-warn">${recent} pitched in the last ${S.settings.dupDays} days</span>`);
  if (dnc) bits.push(`<span class="flag flag-bad">${dnc} on do-not-contact (will be skipped)</span>`);
  if (S.excluded.size) bits.push(`<span class="flag flag-muted">${S.excluded.size} removed · <button class="btn-link" data-undo-rm type="button" style="color:var(--cobalt);font-weight:600">undo</button></span>`);
  if (list.length && noName) bits.push(`<span class="flag flag-muted">${noName} without a name, so they’ll be greeted “Hi there”</span>`);
  const extra = S.fields.filter(f => !['email', 'name', 'full_name', 'first_name', 'last_name', 'brand', 'company'].includes(f));
  if (extra.length) bits.push(`<span class="rec-fields">Extra fields from your sheet: ${extra.slice(0, 8).map(f => `<code>{{${esc(f)}}}</code>`).join('')}</span>`);
  sum.innerHTML = bits.join('');

  if (!list.length) { wrap.hidden = true; return; }
  wrap.hidden = false;
  const fallbackBrand = $('brand').value.trim();
  const shown = list.slice(0, 300);
  $('recBody').innerHTML = shown.map(r => {
    let status = '<span class="pill pill-muted">Ready</span>';
    if (r.dnc) status = '<span class="pill pill-bad">Do not contact</span>';
    else if (r.recent) status = `<span class="pill pill-warn" title="${esc((r.recent.fromName || r.recent.from) + ' · ' + fmtDate(r.recent.t))}">Pitched ${esc(timeAgo(r.recent.t))}</span>`;
    const brand = r.brand || r.company || fallbackBrand;
    return `<tr class="${r.dnc ? 'row-skip' : ''}">
      <td>${esc(r.email)}</td>
      <td>${r.name ? esc(r.name) : '<span class="muted">—</span>'}</td>
      <td>${brand ? esc(brand) : '<span class="muted">—</span>'}</td>
      <td class="t-right">${status}</td>
      <td class="t-right"><button class="rec-rm" data-rm="${esc(r.email)}" title="Remove" aria-label="Remove ${esc(r.email)}"><svg viewBox="0 0 24 24"><path d="M7 7l10 10M17 7L7 17"/></svg></button></td>
    </tr>`;
  }).join('') + (list.length > shown.length ? `<tr><td colspan="5" class="muted" style="text-align:center">…and ${list.length - shown.length} more</td></tr>` : '');
}

function loadCsvFile(file) {
  if (/\.(xlsx|xls)$/i.test(file.name)) return toast('bad', 'Save it as CSV first', 'In Excel or Google Sheets, choose File → Download → CSV.');
  const reader = new FileReader();
  reader.onload = () => {
    $('recipientsInput').value = String(reader.result || '').trim();
    parseAndRender(); saveDraft(); updateReadiness();
    toast('ok', 'Sheet loaded', `${S.recipients.length} contacts from ${file.name}`);
  };
  reader.onerror = () => toast('bad', 'Couldn’t read that file', 'Try saving it again as CSV.');
  reader.readAsText(file);
}
function downloadSample() {
  const csv = 'email,name,brand,city\npriya.sharma@example.com,Priya Sharma,Myntra,Mumbai\nrahul@example.in,Rahul Mehta,boAt,Delhi\nmarketing@example.co,,Mamaearth,Bangalore\n';
  downloadFile('vigorlaunchpad-contacts-sample.csv', csv, 'text/csv');
}

// ═══════════════════════════════════════════════════════════════
//  Personalisation
// ═══════════════════════════════════════════════════════════════
function firstName(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(p => !/^(mr|mrs|ms|miss|dr|shri|smt)\.?$/i.test(p));
  return parts[0] || '';
}
function valueFor(key, r) {
  const k = norm(key);
  const brand = r.brand || r.company || $('brand').value.trim();
  switch (k) {
    case 'first_name': case 'firstname': return firstName(r.name);
    case 'name': case 'full_name': return r.name;
    case 'brand': return brand;
    case 'company': return r.company || brand;
    case 'email': return r.email;
    case 'my_name': case 'sender': return S.settings.name;
  }
  return (r.fields && r.fields[k]) || '';
}
const TOKEN_RE = /\{\{\s*([a-zA-Z0-9_ ]+?)\s*(?:\|\s*([^}]*?)\s*)?\}\}/g;
function fill(str, r, html, missing) {
  return String(str || '').replace(TOKEN_RE, (m, key, fb) => {
    let v = valueFor(key, r);
    if (!v) {
      const k = norm(key);
      if (fb != null && fb !== '') v = fb;
      else if (k === 'first_name' || k === 'name' || k === 'firstname' || k === 'full_name') v = 'there';
      else { if (missing) missing.add(k); v = ''; }
    }
    return html ? esc(v) : v;
  });
}
function signatureHtml() {
  const sig = (S.settings.signature || '').trim();
  if (!sig || !$('useSignature').checked) return '';
  const lines = esc(sig).split('\n').join('<br>');
  return `<div style="margin-top:18px;color:#5f6368;">${lines}</div>`;
}
function reSubject(s) { return 'Re: ' + String(s || '').replace(/^\s*((re|fwd?|fw)\s*:\s*)+/i, ''); }
function fuContact(r) { return S.fu && S.fu.threaded ? S.fu.contacts.get(r.email) : null; }
function buildMessage(r, missing) {
  const body = fill(sanitize($('editor').innerHTML), r, true, missing) + signatureHtml();
  const c = fuContact(r);
  const subject = c && c.subject ? reSubject(c.subject) : fill($('subject').value.trim(), r, false, missing).replace(/\s+/g, ' ').trim();
  return { subject, html: body, inReplyTo: c && c.mid ? c.mid : '' };
}

// ═══════════════════════════════════════════════════════════════
//  Attachments
// ═══════════════════════════════════════════════════════════════
function addFiles(list) {
  const blocked = [];
  [...list].forEach(f => {
    const ext = (f.name.split('.').pop() || '').toLowerCase();
    if (BLOCKED_EXT.has(ext)) { blocked.push(f.name); return; }
    if (!f.size) return;
    if (!S.files.some(x => x.name === f.name && x.size === f.size)) S.files.push(f);
  });
  if (blocked.length) toast('bad', 'Gmail blocks this file type', `${blocked.join(', ')} can’t be sent by email. Share it as a Google Drive link instead.`);
  renderAttachments(); updateReadiness();
}
function totalAttach() { return S.files.reduce((s, f) => s + f.size, 0); }
function renderAttachments() {
  $('attList').innerHTML = S.files.map((f, i) => {
    const ext = (f.name.split('.').pop() || '').slice(0, 4).toUpperCase();
    return `<div class="att"><span class="att-ext">${esc(ext)}</span><span class="att-name">${esc(f.name)}</span><span class="att-size">${fmtSize(f.size)}</span>
      <button class="rec-rm" data-rm-file="${i}" aria-label="Remove ${esc(f.name)}"><svg viewBox="0 0 24 24"><path d="M7 7l10 10M17 7L7 17"/></svg></button></div>`;
  }).join('');
  const total = totalAttach();
  $('attMeter').hidden = !S.files.length;
  const lim = attachLimit();
  const pct = Math.min(100, total / lim * 100);
  $('attMeterBar').style.width = pct + '%';
  $('attMeterBar').parentElement.className = 'meter' + (total > lim ? ' bad' : pct > 80 ? ' warn' : '');
  $('attMeter').classList.toggle('over', total > lim);
  const n = S.files.length;
  $('attMeterText').textContent = total > lim
    ? (storageOn() ? `${fmtSize(total)}, over the 15 MB limit. Share the biggest file as a Drive link.` : `${fmtSize(total)}, over 3 MB. Turn on team storage (setup guide, step 4) to send up to 15 MB.`)
    : `${n} file${n === 1 ? '' : 's'} · ${fmtSize(total)} of ${storageOn() ? '15' : '3'} MB`;
  $('attNote').textContent = storageOn()
    ? 'Add as many files as you need: decks, rate cards, case studies. Up to 15 MB in total, sent with every email.'
    : 'Add as many files as you need: decks, rate cards, case studies. Up to 3 MB in total (15 MB once team storage is on).';
  updateSendInfo();
}
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve({ name: file.name, type: file.type || 'application/octet-stream', data: String(r.result).split(',')[1] || '' });
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function readAsBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1] || '');
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}
async function fileHash(file) {
  const buf = await file.arrayBuffer();
  const h = await crypto.subtle.digest('SHA-256', buf);
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 40);
}
// With team storage: upload each file once (in pieces) and send a reference.
// Without it: send the file inside every request (3 MB limit).
async function prepareAttachments(onProgress, force) {
  if (!S.files.length) return [];
  if (!storageOn()) return Promise.all(S.files.map(fileToBase64));
  const totalBytes = totalAttach();
  let doneBytes = 0;
  const out = [];
  for (const f of S.files) {
    const key = f.name + '|' + f.size + '|' + f.lastModified;
    const cached = S.uploads.get(key);
    if (cached && !force && Date.now() - cached.at < 24 * 3600e3) { out.push({ ref: cached.id, name: f.name, type: f.type }); doneBytes += f.size; continue; }
    const id = await fileHash(f);
    const check = await api('/api/upload?id=' + id);
    if (!(check.ok && check.data.exists) || force) {
      const total = Math.max(1, Math.ceil(f.size / CHUNK_BYTES));
      for (let i = 0; i < total; i++) {
        const part = f.slice(i * CHUNK_BYTES, Math.min(f.size, (i + 1) * CHUNK_BYTES));
        const data = await readAsBase64(part);
        const res = await api('/api/upload', { method: 'POST', body: { id, index: i, total, data } });
        if (!res.ok) throw new Error(res.data.error || 'Upload failed.');
        doneBytes += part.size;
        if (onProgress) onProgress(Math.min(99, Math.round(doneBytes / totalBytes * 100)));
      }
      const c = await api('/api/upload', { method: 'POST', body: { id, total, commit: true, name: f.name, type: f.type, size: f.size } });
      if (!c.ok) throw new Error(c.data.error || 'Upload failed.');
    } else doneBytes += f.size;
    S.uploads.set(key, { id, at: Date.now() });
    out.push({ ref: id, name: f.name, type: f.type || 'application/octet-stream' });
    if (onProgress) onProgress(Math.min(99, Math.round(doneBytes / totalBytes * 100)));
  }
  return out;
}

// ═══════════════════════════════════════════════════════════════
//  Readiness checks & quota
// ═══════════════════════════════════════════════════════════════
let readyTimer;
function updateReadinessSoon() { clearTimeout(readyTimer); readyTimer = setTimeout(updateReadiness, 300); }
function updateSubjectCount() {
  const n = $('subject').value.length;
  $('subjCount').textContent = `${n} / 60`;
  $('subjCount').classList.toggle('over', n > 60);
}

function readinessChecks() {
  const subject = $('subject').value.trim();
  const html = $('editor').innerHTML;
  const text = $('editor').innerText || '';
  const all = (subject + ' ' + text).toLowerCase();
  const out = [];
  const empty = !subject && !text.trim() && !S.fu;
  if (empty) return [];

  // subject
  if (S.fu && S.fu.threaded) out.push(['ok', 'Replies in the original email thread']);
  else if (!subject) out.push(['bad', 'Add a subject line']);
  else if (subject.length > 80) out.push(['warn', 'Subject is long', 'Aim for under 60 characters so it isn’t cut off on phones.']);
  else if (subject.length > 60) out.push(['warn', 'Subject is a little long', 'Under 60 characters reads best on phones.']);
  else out.push(['ok', 'Subject length is good']);

  // spammy words
  const hits = SPAM_WORDS.filter(w => new RegExp('(^|[^a-z])' + w.replace(/[$%]/g, '\\$&') + '($|[^a-z])', 'i').test(all));
  if (hits.length) out.push(['warn', 'Words that spam filters dislike', hits.slice(0, 4).map(h => `“${h}”`).join(', ')]);
  else out.push(['ok', 'No spam-trigger words']);

  // shouting
  const caps = (subject.match(/\b[A-Z]{4,}\b/g) || []).filter(w => !['VIGORLAUNCHPAD', 'BTL', 'UGC', 'ROAS', 'ROI'].includes(w));
  const bangs = (subject + text).split('!').length - 1;
  if (caps.length || bangs > 2) out.push(['warn', 'Calm the tone', caps.length ? 'Avoid ALL-CAPS words in the subject.' : 'Use one exclamation mark at most.']);

  // personal
  if (/\{\{\s*(first_name|name)\s*(\|[^}]*)?\}\}/i.test(subject + html)) out.push(['ok', 'Greets each person by name']);
  else out.push(['warn', 'Not personalised', 'Start with “Hi {{first_name}},”. Personal emails rarely get flagged.']);

  // brackets left
  const br = (subject + ' ' + text).match(/\[[^\]]{2,}\]/g);
  if (br) out.push(['bad', 'Fill in the [square bracket] parts', br.slice(0, 2).join(', ')]);

  // length
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (S.fu) { if (words > 120) out.push(['warn', 'Long for a follow-up', 'Two or three lines works best.']); else out.push(['ok', 'Short and easy to answer']); }
  else if (words < 40) out.push(['warn', 'Very short email', 'A few more lines of context helps.']);
  else if (words > 250) out.push(['warn', `Long email (${words} words)`, 'Under 200 words gets more replies.']);
  else out.push(['ok', `Good length (${words} words)`]);

  // links
  const links = (html.match(/<a\s/gi) || []).length + (text.match(/(^|\s)(https?:\/\/|www\.)\S+/gi) || []).length;
  if (SHORTENERS.test(html + text)) out.push(['bad', 'Remove link shorteners', 'bit.ly and similar links are a strong spam signal.']);
  else if (links > 3) out.push(['warn', `${links} links`, 'Keep it to 1–2 links in a first email.']);

  // attachments
  if (totalAttach() > attachLimit()) out.push(['bad', `Attachments over ${storageOn() ? 15 : 3} MB`, storageOn() ? 'Share the largest file as a Google Drive link.' : 'Turn on team storage for up to 15 MB, or use a Drive link.']);
  else if (S.files.length) out.push(['ok', `${S.files.length} attachment${S.files.length > 1 ? 's' : ''} (${fmtSize(totalAttach())})`]);

  // signature
  if (!$('useSignature').checked || !(S.settings.signature || '').trim()) out.push(['warn', 'No signature', 'Add your name, role and phone number in Settings.']);
  else out.push(['ok', 'Signature added']);

  // pace
  const n = S.recipients.filter(r => !r.dnc).length;
  if (S.settings.pace === 'fast' && n > 20) out.push(['warn', 'Quick pace for a big list', 'Switch to Normal in Settings for more than 20 people.']);
  return out;
}

const ICONS = {
  ok: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  warn: '<svg viewBox="0 0 24 24"><path d="M12 8v5M12 16.5v.01"/><circle cx="12" cy="12" r="9"/></svg>',
  bad: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></svg>',
  idle: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>',
  info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/></svg>',
  spin: '<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9"/></svg>',
  skip: '<svg viewBox="0 0 24 24"><path d="M6 12h12"/></svg>',
};

function updateReadiness() {
  const checks = readinessChecks();
  const badge = $('readyBadge');
  if (!checks.length) {
    $('checks').innerHTML = ['Subject line', 'Spam-trigger words', 'Personal greeting', 'Length and links', 'Signature']
      .map(t => `<li class="idle">${ICONS.idle}<span>${t}</span></li>`).join('');
    badge.textContent = 'Waiting'; badge.className = 'badge';
    return;
  }
  const order = { bad: 0, warn: 1, ok: 2 };
  checks.sort((a, b) => order[a[0]] - order[b[0]]);
  $('checks').innerHTML = checks.map(([lvl, t, d]) => `<li class="${lvl}">${ICONS[lvl]}<span>${esc(t)}${d ? `<small>${esc(d)}</small>` : ''}</span></li>`).join('');
  const bad = checks.filter(c => c[0] === 'bad').length, warn = checks.filter(c => c[0] === 'warn').length;
  if (bad) { badge.textContent = 'Fix before sending'; badge.className = 'badge bad'; }
  else if (warn > 1) { badge.textContent = 'Could be better'; badge.className = 'badge warn'; }
  else { badge.textContent = 'Looks good'; badge.className = 'badge ok'; }
}

function dailyLimit(acct) { return acct === 'workspace' ? 2000 : 500; }
function startOfDay(d = new Date()) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x.getTime(); }
function sentTodayBy(email) {
  if (!email) return 0;
  const since = startOfDay(); const me = email.toLowerCase();
  return allKnownEvents().filter(e => e.ok && e.from === me && e.t >= since).length;
}
function updateQuota() {
  const lim = dailyLimit(S.settings.acct);
  const used = sentTodayBy(S.settings.email);
  $('quotaUsed').textContent = used.toLocaleString('en-IN');
  $('quotaOf').textContent = `of ${lim.toLocaleString('en-IN')} sent`;
  $('quotaAcct').textContent = S.settings.acct === 'workspace' ? 'Workspace' : 'Free Gmail';
  const pct = Math.min(100, used / lim * 100);
  $('quotaBar').style.width = pct + '%';
  $('quotaBar').parentElement.className = 'meter' + (pct >= 90 ? ' bad' : pct >= 70 ? ' warn' : '');
  $('quotaNote').textContent = used >= lim
    ? 'You’ve hit today’s limit. Gmail will refuse more emails until tomorrow.'
    : `About ${(lim - used).toLocaleString('en-IN')} more today. Gmail resets this every 24 hours.`;
}

function updateSendInfo() {
  const n = S.recipients.filter(r => !r.dnc).length;
  if (!n) { $('sendInfo').textContent = 'Add recipients to get started'; return; }
  $('sendInfo').innerHTML = `<strong>${n}</strong> ${n === 1 ? 'email' : 'emails'} · about ${fmtDuration(estimateSecs(n))} to send`;
}
function estimateSecs(n) { const [a, b] = PACES[S.settings.pace] || PACES.normal; return Math.round(n * 2 + Math.max(0, n - 1) * (a + b) / 2); }

// ═══════════════════════════════════════════════════════════════
//  Preview
// ═══════════════════════════════════════════════════════════════
function previewRecipients() {
  const list = S.recipients.filter(r => !r.dnc);
  return list.length ? list : [{ email: 'contact@brand.com', name: '', brand: '', company: '', fields: {}, sample: true }];
}
function openPreview(i) {
  const list = previewRecipients();
  S.pvIndex = (i + list.length) % list.length;
  const r = list[S.pvIndex];
  const missing = new Set();
  const { subject, html } = buildMessage(r, missing);
  $('pvIndex').textContent = r.sample ? 'Sample' : `${S.pvIndex + 1} of ${list.length}`;
  $('pvPrev').disabled = $('pvNext').disabled = list.length < 2;
  $('pvSubject').textContent = subject || '(no subject)';
  $('pvFrom').textContent = S.settings.name || 'Your name';
  $('pvFromEmail').textContent = S.settings.email ? `<${S.settings.email}>` : '';
  $('pvAvatar').textContent = initials(S.settings.name || S.settings.email);
  $('pvTo').textContent = r.name ? `${r.name} <${r.email}>` : r.email;
  $('pvBody').innerHTML = html || '<p class="muted">Your email is empty.</p>';
  $('pvAtts').innerHTML = S.files.map(f => `<span>${esc(f.name)} · ${fmtSize(f.size)}</span>`).join('');
  const warn = [];
  if (missing.size) warn.push(`Some fields are empty for this contact, so they’ll be left blank: ${[...missing].map(k => `{{${k}}}`).join(', ')}.`);
  if (!valueFor('brand', r) && /\{\{\s*brand/i.test($('subject').value + $('editor').innerHTML)) warn.push('No brand is set, so {{brand}} will be blank. Add one at the top.');
  $('pvWarn').hidden = !warn.length; $('pvWarn').innerHTML = warn.map(esc).join('<br>');
  if ($('previewModal').hidden) openModal('previewModal');
}

// ═══════════════════════════════════════════════════════════════
//  Sending
// ═══════════════════════════════════════════════════════════════
function preflight() {
  const s = S.settings;
  if (!s.email || !s.pass) { toast('bad', 'Connect your Gmail first', 'Add your Gmail and App Password in Settings.'); go('settings'); return false; }
  if (!(S.fu && S.fu.threaded) && !$('subject').value.trim()) { toast('bad', 'Add a subject line'); $('subject').focus(); return false; }
  if (isEditorEmpty()) { toast('bad', 'Your email is empty', 'Write a message or pick a template.'); $('editor').focus(); return false; }
  if (totalAttach() > attachLimit()) { toast('bad', `Attachments are over ${storageOn() ? 15 : 3} MB`, 'Remove some, or share them as a Google Drive link.'); return false; }
  return true;
}

function reviewAndSend() {
  if (!preflight()) return;
  const all = S.recipients;
  if (!all.length) { toast('bad', 'No recipients yet', 'Paste at least one email address.'); $('recipientsInput').focus(); return; }
  const dnc = all.filter(r => r.dnc);
  const recent = all.filter(r => !r.dnc && r.recent);
  const ready = all.filter(r => !r.dnc);
  if (!ready.length) { toast('bad', 'Everyone is on the do-not-contact list'); return; }

  const checks = readinessChecks().filter(c => c[0] !== 'ok');
  const brands = [...new Set(ready.map(r => valueFor('brand', r)).filter(Boolean))];
  const lim = dailyLimit(S.settings.acct), used = sentTodayBy(S.settings.email);
  const left = Math.max(0, lim - used);
  const items = [];

  if (recent.length) {
    const names = recent.slice(0, 3).map(r => `${r.email} (${r.recent.fromName || r.recent.from}, ${timeAgo(r.recent.t)})`).join('; ');
    items.push(`<div class="cf-item warn">${ICONS.warn}<div><strong>${recent.length} ${recent.length === 1 ? 'contact was' : 'contacts were'} pitched in the last ${S.settings.dupDays} days.</strong><br>${esc(names)}${recent.length > 3 ? '…' : ''}
      <label><input type="checkbox" id="cfSkipRecent" checked /> Skip them this time</label></div></div>`);
  }
  if (S.fu) {
    const ago = S.lastReplyCheck ? timeAgo(S.lastReplyCheck) : '';
    items.push(`<div class="cf-item">${ICONS.info}<div><strong>Follow-up ${S.fu.stage} of ${FU_MAX}.</strong> ${S.fu.threaded ? 'Each email goes out as a reply in the original thread.' : 'Sent as a new email with your subject line.'}${S.fu.repliedSkipped ? ` ${S.fu.repliedSkipped} ${S.fu.repliedSkipped === 1 ? 'person who replied was' : 'people who replied were'} left out.` : ''}${ago ? ` Replies last checked ${ago}.` : ''}</div></div>`);
  }
  if (dnc.length) items.push(`<div class="cf-item">${ICONS.info}<div>${dnc.length} on your do-not-contact list will be skipped.</div></div>`);
  if (ready.length > left) items.push(`<div class="cf-item bad">${ICONS.bad}<div><strong>This is more than Gmail allows today.</strong> You have about ${left} left out of ${lim}, so Gmail will stop accepting emails partway through. Split this list across days.</div></div>`);
  checks.forEach(([lvl, t, d]) => items.push(`<div class="cf-item ${lvl}">${ICONS[lvl]}<div><strong>${esc(t)}</strong>${d ? `<br>${esc(d)}` : ''}</div></div>`));
  if (!items.length) items.push(`<div class="cf-item">${ICONS.ok}<div>Everything looks good.</div></div>`);

  const subjSample = buildMessage(ready[0]).subject;
  $('cfBody').innerHTML = `
    <dl class="cf-summary">
      <dt>From</dt><dd>${esc(S.settings.name || '')} &lt;${esc(S.settings.email)}&gt;</dd>
      <dt>To</dt><dd id="cfCount">${ready.length} ${ready.length === 1 ? 'person' : 'people'}, each emailed separately</dd>
      <dt>Brand</dt><dd>${brands.length ? esc(brands.slice(0, 3).join(', ')) + (brands.length > 3 ? ` +${brands.length - 3} more` : '') : '<span class="muted">Not set</span>'}</dd>
      <dt>Subject</dt><dd>${esc(subjSample)}</dd>
      ${S.files.length ? `<dt>Files</dt><dd>${S.files.length} attached (${fmtSize(totalAttach())})</dd>` : ''}
      <dt>Time</dt><dd id="cfTime">About ${fmtDuration(estimateSecs(ready.length))} at ${S.settings.pace === 'gentle' ? 'a gentle' : S.settings.pace === 'fast' ? 'a quick' : 'a normal'} pace</dd>
    </dl>
    <div class="cf-list">${items.join('')}</div>`;

  const count = () => ready.filter(r => !(r.recent && $('cfSkipRecent') && $('cfSkipRecent').checked)).length;
  const refresh = () => {
    const n = count();
    $('cfCount').textContent = `${n} ${n === 1 ? 'person' : 'people'}, each emailed separately`;
    $('cfTime').textContent = `About ${fmtDuration(estimateSecs(n))}`;
    $('cfGo').textContent = `Send ${n} ${n === 1 ? 'email' : 'emails'}`;
    $('cfGo').disabled = !n;
  };
  if ($('cfSkipRecent')) $('cfSkipRecent').onchange = refresh;
  refresh();
  $('cfGo').onclick = () => {
    const skip = $('cfSkipRecent') && $('cfSkipRecent').checked;
    const queue = ready.filter(r => !(skip && r.recent));
    closeModal('confirmModal');
    startJob(queue);
  };
  openModal('confirmModal');
}

async function sendTest() {
  if (!preflight()) return;
  const r = S.recipients.find(x => !x.dnc) || { email: S.settings.email, name: S.settings.name, brand: '', company: '', fields: {} };
  const { subject, html } = buildMessage(r);
  const btn = $('testBtn'); btn.disabled = true; btn.textContent = S.files.length && storageOn() ? 'Uploading files…' : 'Sending test…';
  try {
    const attachments = await prepareAttachments(p => { btn.textContent = `Uploading files ${p}%`; });
    btn.textContent = 'Sending test…';
    const { ok, data } = await api('/api/send', {
      method: 'POST',
      body: {
        auth: { user: S.settings.email, pass: S.settings.pass, name: S.settings.name },
        to: { email: S.settings.email, name: S.settings.name },
        subject: '[Test] ' + subject, html, attachments, test: true,
        replyTo: S.settings.replyTo, meta: {},
      },
    });
    if (ok) toast('ok', 'Test sent to your inbox', `Personalised as ${r.name || r.email}. Check how it looks.`);
    else toast('bad', 'Test didn’t send', data.error || 'Check your Gmail settings.');
  } catch (e) {
    if (!e.access) toast('bad', 'Test didn’t send', e.message && !/fetch/i.test(e.message) ? e.message : 'Check your internet connection and try again.');
  } finally {
    btn.disabled = false; btn.textContent = 'Send test to me';
  }
}

async function startJob(queue) {
  const job = {
    cid: 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    items: queue.map(r => ({ r, status: 'wait', err: '' })),
    attachments: [],
    type: S.fu ? S.fu.type : $('ctype').value,
    root: S.fu ? S.fu.root : '', fu: S.fu ? S.fu.stage : 0,
    paused: false, stopped: false, running: true, fatal: '',
  };
  S.job = job;
  $('pgTitle').textContent = S.fu ? 'Sending follow-up…' : 'Sending…';
  $('pgStop').hidden = false; $('pgPause').hidden = false; $('pgPause').textContent = 'Pause';
  $('pgRetry').hidden = true; $('pgDone').hidden = true;
  renderProgress(true);
  openModal('progressModal');
  if (S.files.length) {
    $('pgNote').textContent = storageOn() ? 'Uploading attachments…' : 'Preparing attachments…';
    try {
      job.attachments = await prepareAttachments(p => { $('pgNote').textContent = `Uploading attachments… ${p}%`; $('pgBar').style.width = (p * 0.08) + '%'; });
    } catch (e) {
      job.fatal = 'Couldn’t upload the attachments: ' + (e.message || 'please try again.');
      job.items.forEach(x => { x.status = 'skip'; x.err = 'Not sent'; });
      job.running = false; finishJob(job); return;
    }
  }
  await runJob(job, job.items);
}

async function runJob(job, items) {
  job.running = true;
  const [minD, maxD] = PACES[S.settings.pace] || PACES.normal;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (job.stopped) break;
    while (job.paused && !job.stopped) { $('pgNote').textContent = 'Paused. Click Resume to continue.'; await sleep(300); }
    if (job.stopped) break;
    it.status = 'busy'; it.err = '';
    $('pgNote').textContent = `Sending to ${it.r.email}…`;
    renderProgress();
    const res = await sendOne(job, it.r);
    it.status = res.ok ? 'ok' : 'bad';
    it.err = res.ok ? '' : res.error;
    renderProgress();
    if (res.fatal) {
      job.fatal = res.error;
      items.slice(i + 1).forEach(x => { if (x.status === 'wait') { x.status = 'skip'; x.err = 'Not sent'; } });
      break;
    }
    const more = items.slice(i + 1).some(x => x.status === 'wait');
    if (more && !job.stopped) {
      const wait = Math.round((minD + Math.random() * (maxD - minD)) * 1000);
      const end = Date.now() + wait;
      while (Date.now() < end && !job.stopped) {
        if (job.paused) { await sleep(300); continue; }
        $('pgNote').textContent = `Next email in ${Math.ceil((end - Date.now()) / 1000)}s. Spacing emails out keeps you out of spam.`;
        await sleep(250);
      }
    }
  }
  if (job.stopped) items.forEach(x => { if (x.status === 'wait') { x.status = 'skip'; x.err = 'Stopped'; } });
  job.running = false;
  finishJob(job);
}

async function sendOne(job, r) {
  const { subject, html, inReplyTo } = buildMessage(r);
  const brand = valueFor('brand', r);
  const evt = {
    t: Date.now(), cid: job.cid, from: S.settings.email.toLowerCase(), fromName: S.settings.name,
    to: r.email, toName: r.name, brand, type: job.type, subject, att: job.attachments.length, acct: S.settings.acct, ok: false,
  };
  if (job.root) { evt.root = job.root; evt.fu = job.fu; }
  try {
    const post = () => api('/api/send', {
      method: 'POST',
      body: {
        auth: { user: S.settings.email, pass: S.settings.pass, name: S.settings.name },
        to: { email: r.email, name: r.name },
        subject, html, attachments: job.attachments, inReplyTo,
        unsubscribe: !!S.settings.unsubscribe, replyTo: S.settings.replyTo,
        meta: { cid: job.cid, brand, type: job.type, acct: S.settings.acct, root: job.root, fu: job.fu },
      },
    });
    let { ok, data } = await post();
    if (!ok && data.code === 'ATT_MISSING' && !job.reuploaded) {
      // Stored files expired mid-campaign: upload them again once and retry.
      job.reuploaded = true;
      try { job.attachments = await prepareAttachments(null, true); ({ ok, data } = await post()); } catch {}
    }
    if (ok && data.ok) { recordLocal({ ...evt, ok: true, mid: data.id }); return { ok: true }; }
    const error = data.error || 'Sending failed.';
    if (!data.fatal) recordLocal({ ...evt, err: error });
    return { ok: false, error, fatal: !!data.fatal };
  } catch (e) {
    if (e.access) return { ok: false, error: 'Team access code needed.', fatal: true };
    recordLocal({ ...evt, err: 'Network error' });
    return { ok: false, error: 'Network error. Check your internet connection.' };
  }
}

function recordLocal(evt) {
  S.local.unshift(evt);
  if (S.local.length > 5000) S.local.length = 5000;
  store.set('vl_events', S.local);
  if (S.team.storage && S.team.loaded) S.team.events.unshift(evt);
  updateQuota(); updateFuBadge();
}

function renderProgress(first) {
  const job = S.job; if (!job) return;
  const c = { ok: 0, bad: 0, wait: 0, busy: 0, skip: 0 };
  job.items.forEach(i => c[i.status]++);
  const total = job.items.length, done = c.ok + c.bad + c.skip;
  $('pgSent').textContent = c.ok; $('pgFailed').textContent = c.bad; $('pgLeft').textContent = c.wait + c.busy;
  $('pgBar').style.width = (total ? done / total * 100 : 0) + '%';
  const ico = { wait: ICONS.idle, busy: ICONS.spin, ok: ICONS.ok, bad: ICONS.bad, skip: ICONS.skip };
  const html = job.items.map(i => `<li><span class="pg-ico ${i.status}">${ico[i.status]}</span><span>${esc(i.r.name ? `${i.r.name} · ${i.r.email}` : i.r.email)}</span>${i.err ? `<span class="pg-err">${esc(i.err)}</span>` : ''}</li>`).join('');
  $('pgList').innerHTML = html;
  if (!first) {
    const busy = $('pgList').querySelector('.pg-ico.busy');
    if (busy) busy.parentElement.scrollIntoView({ block: 'nearest' });
  }
}

function finishJob(job) {
  renderProgress();
  const ok = job.items.filter(i => i.status === 'ok').length;
  const bad = job.items.filter(i => i.status === 'bad').length;
  $('pgStop').hidden = true; $('pgPause').hidden = true; $('pgDone').hidden = false;
  $('pgRetry').hidden = !bad || !!job.fatal;
  if (job.fatal) { $('pgTitle').textContent = 'Sending stopped'; $('pgNote').textContent = job.fatal; }
  else if (job.stopped) { $('pgTitle').textContent = 'Stopped'; $('pgNote').textContent = `${ok} sent before you stopped.`; }
  else if (bad) { $('pgTitle').textContent = 'Finished with some failures'; $('pgNote').textContent = `${ok} sent, ${bad} failed. You can retry the failed ones.`; }
  else { $('pgTitle').textContent = 'Campaign sent'; $('pgNote').textContent = `All ${ok} emails were accepted by Gmail.`; }
}

function bindProgress() {
  $('pgPause').onclick = () => { if (!S.job) return; S.job.paused = !S.job.paused; $('pgPause').textContent = S.job.paused ? 'Resume' : 'Pause'; };
  $('pgStop').onclick = () => { if (S.job) { S.job.stopped = true; S.job.paused = false; $('pgNote').textContent = 'Stopping…'; } };
  $('pgRetry').onclick = async () => {
    const job = S.job; const failed = job.items.filter(i => i.status === 'bad');
    failed.forEach(i => { i.status = 'wait'; i.err = ''; });
    job.stopped = false; job.paused = false;
    $('pgTitle').textContent = 'Retrying…';
    $('pgRetry').hidden = true; $('pgDone').hidden = true; $('pgStop').hidden = false; $('pgPause').hidden = false; $('pgPause').textContent = 'Pause';
    await runJob(job, failed);
  };
  $('pgDone').onclick = () => {
    const job = S.job; closeModal('progressModal');
    const ok = job ? job.items.filter(i => i.status === 'ok').length : 0;
    if (job && job.root) {
      exitFollowUp();
      S.job = null;
      if (ok) toast('ok', `Follow-up sent to ${ok}`, 'You’ll find it on the Follow-ups page.');
      if (S.team.storage) loadTeam(true);
      go('followups');
      return;
    }
    if (ok) {
      const sentSet = new Set(job.items.filter(i => i.status === 'ok').map(i => i.r.email));
      const left = job.items.filter(i => !sentSet.has(i.r.email)).length;
      if (!left) {
        $('recipientsInput').value = ''; S.files = []; S.excluded.clear();
        parseAndRender(); renderAttachments(); saveDraft(); updateReadiness();
        toast('ok', `${ok} emails sent`, 'Recipients and files are cleared. Your message is kept, ready for the next brand.');
      } else {
        parseAndRender(true);
        toast('info', `${ok} emails sent`, 'Contacts that didn’t get the email are still in the list.');
      }
    }
    S.job = null;
    if (S.team.storage) loadTeam(true);
  };
}

// ═══════════════════════════════════════════════════════════════
//  Replies & follow-ups
// ═══════════════════════════════════════════════════════════════
function mergeReplies(map) {
  let changed = false;
  Object.entries(map || {}).forEach(([k, v]) => { if (!S.replies[k]) { S.replies[k] = v; changed = true; } });
  if (changed) store.set('vl_replies', S.replies);
}
function hasReplied(from, to) { return !!S.replies[`${from}|${to}`]; }
function typeLabel(c) { return (TYPES[c.type] || 'Other') + (c.fu ? ` · follow-up ${c.fu}` : ''); }
function sentPill(e) {
  return S.replies[`${e.from}|${e.to}`] ? '<span class="pill pill-ok">Replied</span>' : '<span class="pill pill-muted">Sent</span>';
}

// Your campaigns from the last 60 days, with who replied and what's due.
function myThreads() {
  const me = (S.settings.email || '').toLowerCase();
  if (!me) return [];
  const since = Date.now() - 60 * 864e5;
  const m = new Map();
  allKnownEvents().filter(e => e.ok && e.from === me && e.t >= since && (e.cid || e.root)).slice().sort((a, b) => a.t - b.t).forEach(e => {
    const id = e.root || e.cid;
    let t = m.get(id);
    if (!e.fu) {
      if (!t) { t = { root: id, type: e.type, first: e.t, last: e.t, stage: 0, subject: e.subject, brands: new Map(), contacts: new Map() }; m.set(id, t); }
      if (!t.contacts.has(e.to)) t.contacts.set(e.to, { email: e.to, name: e.toName || '', brand: e.brand || '', subject: e.subject, mid: e.mid || '', last: e.t });
      if (e.brand) t.brands.set(e.brand.toLowerCase(), e.brand);
      t.last = Math.max(t.last, e.t);
    } else if (t) {
      t.stage = Math.max(t.stage, e.fu); t.last = Math.max(t.last, e.t);
      const c = t.contacts.get(e.to); if (c) c.last = e.t;
    }
  });
  const now = Date.now();
  const rank = { due: 0, wait: 1, done: 2, replied: 3 };
  return [...m.values()].map(t => {
    const contactList = [...t.contacts.values()];
    const replied = contactList.filter(c => hasReplied(me, c.email));
    const pending = contactList.filter(c => !hasReplied(me, c.email));
    const days = (now - t.last) / 864e5;
    const status = !pending.length ? 'replied' : t.stage >= FU_MAX ? 'done' : days >= FU_DUE_DAYS ? 'due' : 'wait';
    return { ...t, contactList, replied, pending, days, status };
  }).sort((a, b) => rank[a.status] - rank[b.status] || b.last - a.last);
}

function updateFuBadge() {
  const n = myThreads().filter(t => t.status === 'due').length;
  $('fuBadge').hidden = !n; $('fuBadge').textContent = n;
}

function renderFollowups() {
  if ($('page-followups').hidden) return;
  $('replyStatus').textContent = S.lastReplyCheck ? `Replies checked ${timeAgo(S.lastReplyCheck)}` : '';
  const body = $('fuBody');
  if (!S.settings.email || !S.settings.pass) { body.innerHTML = `<tr class="table-empty"><td colspan="7">Connect your Gmail in Settings to see your follow-ups.</td></tr>`; return; }
  const list = myThreads();
  if (!list.length) { body.innerHTML = `<tr class="table-empty"><td colspan="7">No campaigns from you in the last 60 days. Send one and it will show up here, ready to follow up.</td></tr>`; return; }
  body.innerHTML = list.map(t => {
    const b = [...t.brands.values()];
    const brand = b.length ? b[0] + (b.length > 1 ? ` +${b.length - 1}` : '') : 'Campaign';
    const n = t.contactList.length, r = t.replied.length;
    const dots = Array.from({ length: FU_MAX }, (_, i) => `<i class="${i < t.stage ? 'on' : ''}"></i>`).join('');
    const wait = Math.max(1, Math.ceil(FU_DUE_DAYS - t.days));
    const pill = {
      due: '<span class="pill pill-warn">Due now</span>',
      wait: `<span class="pill pill-muted">In ${wait} day${wait > 1 ? 's' : ''}</span>`,
      replied: '<span class="pill pill-ok">Everyone replied</span>',
      done: '<span class="pill pill-muted">Done</span>',
    }[t.status];
    const action = t.status === 'due'
      ? `<button class="btn btn-primary btn-sm" data-fu="${esc(t.root)}" type="button">Follow up (${t.pending.length})</button>`
      : t.status === 'wait' ? `<button class="btn btn-outline btn-sm" data-fu="${esc(t.root)}" type="button">Follow up early</button>` : '';
    return `<tr>
      <td><span class="td-strong">${esc(brand)}</span><span class="td-sub td-clip" title="${esc(t.subject)}">${esc(t.subject || '')}</span></td>
      <td class="td-when" data-label="First sent">${esc(fmtDate(t.first))}<span class="td-sub">${esc(timeAgo(t.first))}</span></td>
      <td class="t-num" data-label="Contacts">${n}</td>
      <td class="t-num" data-label="Replied"><span class="reply-bar">${r}<span class="meter"><span style="width:${n ? r / n * 100 : 0}%"></span></span></span></td>
      <td data-label="Follow-ups"><span class="dots">${dots}<em>${t.stage} of ${FU_MAX}</em></span></td>
      <td>${pill}</td>
      <td class="t-right">${action}</td>
    </tr>`;
  }).join('');
}

async function checkReplies(contacts, since) {
  const me = S.settings.email.toLowerCase();
  const todo = [...new Set(contacts)].filter(c => !hasReplied(me, c));
  let found = 0;
  for (let i = 0; i < todo.length; i += 150) {
    const { ok, data } = await api('/api/replies', { method: 'POST', body: { auth: { user: me, pass: S.settings.pass }, contacts: todo.slice(i, i + 150), since } });
    if (!ok) throw new Error(data.error || 'Could not check replies.');
    (data.replied || []).forEach(to => { const k = `${me}|${to}`; if (!S.replies[k]) { S.replies[k] = Date.now(); found++; } });
  }
  store.set('vl_replies', S.replies);
  S.lastReplyCheck = Date.now(); store.set('vl_reply_check', S.lastReplyCheck);
  return found;
}

let replyChecking = false;
async function checkAllReplies(silent) {
  if (replyChecking || !S.settings.email || !S.settings.pass) {
    if (!silent && !S.settings.pass) { toast('bad', 'Connect your Gmail first'); go('settings'); }
    return;
  }
  const threads = myThreads().filter(t => t.pending.length && Date.now() - t.first < 45 * 864e5);
  const contacts = threads.flatMap(t => t.pending.map(c => c.email));
  if (!contacts.length) { if (!silent) toast('info', 'Nothing to check', 'No recent campaigns are waiting on replies.'); return; }
  replyChecking = true;
  const btn = $('checkRepliesBtn'); btn.disabled = true;
  $('replyStatus').textContent = 'Checking your Gmail…';
  try {
    const found = await checkReplies(contacts, Math.min(...threads.map(t => t.first)));
    if (!silent) toast(found ? 'ok' : 'info', found ? `${found} new ${found === 1 ? 'reply' : 'replies'} found` : 'No new replies yet', found ? 'They’re left out of follow-ups automatically.' : `Checked ${contacts.length} contacts.`);
  } catch (e) {
    if (!silent && !e.access) toast('bad', 'Couldn’t check replies', e.message);
  } finally {
    replyChecking = false; btn.disabled = false;
    renderFollowups(); updateFuBadge(); renderTeam(); renderLog();
  }
}
function autoCheckReplies() {
  if (S.settings.email && S.settings.pass && Date.now() - S.lastReplyCheck > 15 * 60e3) checkAllReplies(true);
}

async function startFollowUp(root) {
  if (S.job && S.job.running) return;
  if (!S.settings.email || !S.settings.pass) { toast('bad', 'Connect your Gmail first'); go('settings'); return; }
  let t = myThreads().find(x => x.root === root);
  if (!t) return toast('bad', 'Couldn’t find that campaign');
  if (t.stage >= FU_MAX) return toast('info', 'Two follow-ups already sent', 'It’s best to move on from this one.');
  toast('info', 'Checking your Gmail for replies…');
  let replyErr = false;
  try { await checkReplies(t.contactList.map(c => c.email), t.first); } catch (e) { replyErr = !e.access; }
  t = myThreads().find(x => x.root === root);
  if (!t.pending.length) { toast('ok', 'Everyone has replied', 'No follow-up needed.'); renderFollowups(); updateFuBadge(); return; }

  if (S.fu) exitFollowUp();
  saveDraft();
  const prev = { draft: store.get('vl_draft', null), files: S.files.slice() };
  const stage = t.stage + 1;
  const tplIdx = stage >= 2 ? 1 : 0;
  const tpl = TEMPLATES.followup[tplIdx];
  S.fu = {
    root, stage, type: t.type || 'custom', threaded: true, title: t.subject, first: t.first,
    contacts: new Map(t.pending.map(c => [c.email, c])), repliedSkipped: t.replied.length, altSubject: tpl.subject, prev,
  };
  $('recipientsInput').value = ['email,name,brand'].concat(t.pending.map(c => [c.email, c.name, c.brand].map(csvSoft).join(','))).join('\n');
  S.files = [];
  $('brand').value = t.brands.size === 1 ? [...t.brands.values()][0] : '';
  $('editor').innerHTML = sanitize(tpl.body);
  S.activeTpl = 'b:followup:' + tplIdx;
  $('subject').value = reSubject(t.pending[0].subject);
  S.excluded.clear();
  applyFuUI();
  parseAndRender(true); renderAttachments(); renderTemplates(); renderTips(); updateSubjectCount(); updateReadiness();
  go('compose');
  if (replyErr) toast('bad', 'Couldn’t check for replies', 'Review the list and remove anyone who already answered.');
  else toast('info', `Follow-up ${stage} is ready`, `${t.pending.length} ${t.pending.length === 1 ? 'person hasn’t' : 'people haven’t'} replied${t.replied.length ? `, and ${t.replied.length} who did ${t.replied.length === 1 ? 'is' : 'are'} left out` : ''}. Edit the message, then send.`);
}

function applyFuUI() {
  const on = !!S.fu, threaded = on && S.fu.threaded;
  $('fuBanner').hidden = !on;
  $('recipientsInput').readOnly = on;
  $('csvBtn').disabled = on;
  $('subject').disabled = threaded;
  $('subjHint').hidden = !threaded;
  $('newDraftBtn').hidden = on;
  $('h-compose').textContent = on ? 'Follow-up' : 'New campaign';
  $('composeSub').textContent = on ? 'Goes only to people who haven’t replied yet. Keep it short, and give them one easy reason to answer.' : 'Write one pitch, and every contact gets their own personal copy from your Gmail.';
  $('recActions').hidden = on;
  $('recNote').textContent = on ? 'Everyone from the first email who hasn’t replied. Use × to leave someone out.' : 'Paste emails, paste rows from Google Sheets or Excel, or upload a CSV.';
  if (on) {
    $('fuStep').textContent = `Follow-up ${S.fu.stage} of ${FU_MAX}`;
    $('fuTitle').textContent = `“${S.fu.title}”`;
    $('fuMeta').textContent = `First sent ${timeAgo(S.fu.first)}`;
    $('fuThreaded').checked = S.fu.threaded;
  }
}

function exitFollowUp() {
  if (!S.fu) return;
  const prev = S.fu.prev;
  S.fu = null;
  applyFuUI();
  if (prev && prev.draft) { store.set('vl_draft', prev.draft); restoreDraft(); }
  else { $('recipientsInput').value = ''; $('subject').value = ''; $('editor').innerHTML = ''; }
  S.files = prev ? prev.files : [];
  S.activeTpl = null; S.excluded.clear();
  parseAndRender(); renderAttachments(); renderTemplates(); renderTips(); updateSubjectCount(); updateReadiness();
}

// ═══════════════════════════════════════════════════════════════
//  Team dashboard
// ═══════════════════════════════════════════════════════════════
function bindTeam() {
  $('periodSeg').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    S.period = +b.dataset.v;
    $('periodSeg').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    renderTeam();
  });
  $('personFilter').onchange = e => { S.person = e.target.value; renderTeam(); };
  $('refreshBtn').onclick = async () => { $('refreshBtn').disabled = true; await loadTeam(true); $('refreshBtn').disabled = false; toast('info', 'Up to date'); };
  $('campSearch').addEventListener('input', renderCampaigns);
  $('checkRepliesBtn').onclick = () => checkAllReplies(false);
  $('fuBody').addEventListener('click', e => { const b = e.target.closest('[data-fu]'); if (b) startFollowUp(b.dataset.fu); });
  $('exportBtn').onclick = exportCsv;
  $('campBody').addEventListener('click', e => { const tr = e.target.closest('[data-cid]'); if (tr) openCampaign(tr.dataset.cid); });
  $('campBody').addEventListener('keydown', e => { if (e.key === 'Enter') { const tr = e.target.closest('[data-cid]'); if (tr) openCampaign(tr.dataset.cid); } });
  $('logSearch').addEventListener('input', () => { S.logLimit = 200; renderLog(); });
  $('logStatus').onchange = () => { S.logLimit = 200; renderLog(); };
  $('logFoot').addEventListener('click', e => { if (e.target.closest('[data-more]')) { S.logLimit += 300; renderLog(); } });
  bindProgress();
}

function periodSince() { return S.period ? startOfDay(Date.now() - (S.period - 1) * 864e5) : 0; }
function filtered() {
  const since = periodSince();
  return events().filter(e => e.t >= since && (!S.person || e.from === S.person));
}

function renderTeam() {
  if ($('page-team').hidden) return;
  const all = events();
  const usingTeam = S.team.storage && S.team.loaded;
  $('storageNotice').hidden = !(S.team.storage === false || (S.team.storage && S.team.error));
  if (S.team.storage && S.team.error) $('storageNotice').innerHTML = `<div><strong>Couldn’t load team history.</strong> ${esc(S.team.error)} Showing this browser’s history for now.</div>`;

  // people filter options
  const people = new Map();
  all.forEach(e => { if (!people.has(e.from)) people.set(e.from, e.fromName || e.from); });
  const sel = $('personFilter');
  const cur = S.person;
  sel.innerHTML = '<option value="">Everyone</option>' + [...people].sort((a, b) => a[1].localeCompare(b[1])).map(([k, n]) => `<option value="${esc(k)}">${esc(n)}</option>`).join('');
  sel.value = people.has(cur) ? cur : ''; S.person = sel.value;

  const ev = filtered();
  const ok = ev.filter(e => e.ok), fail = ev.filter(e => !e.ok);
  const camps = new Set(ok.map(e => e.cid));
  const brandCount = countBy(ok.filter(e => e.brand), e => e.brand.trim().toLowerCase(), e => e.brand.trim());
  const senders = new Set(ok.map(e => e.from));
  const today = ok.filter(e => e.t >= startOfDay()).length;

  $('kSent').textContent = ok.length.toLocaleString('en-IN');
  $('kSentFoot').textContent = S.period === 1 ? (S.person ? '' : `by ${senders.size} ${senders.size === 1 ? 'person' : 'people'}`) : `${today.toLocaleString('en-IN')} today`;
  $('kCamp').textContent = camps.size.toLocaleString('en-IN');
  $('kCampFoot').textContent = S.person ? '' : `${senders.size} ${senders.size === 1 ? 'teammate' : 'teammates'} sending`;
  $('kBrands').textContent = brandCount.length.toLocaleString('en-IN');
  $('kBrandsFoot').textContent = brandCount.length ? `Most pitched: ${brandCount[0].label}` : '';
  const pairs = new Set(ok.map(e => e.from + '|' + e.to));
  const repliedPairs = [...pairs].filter(k => S.replies[k]).length;
  $('kRate').textContent = pairs.size ? Math.round(repliedPairs / pairs.size * 100) + '%' : '—';
  $('kRateFoot').textContent = pairs.size ? `${repliedPairs} of ${pairs.size} contacts replied${fail.length ? ` · ${fail.length} failed` : ''}` : '';

  renderChart(usingTeam);
  renderTypeBars(ok);
  renderPeople();
  renderCampaigns();
}

function countBy(arr, keyFn, labelFn) {
  const m = new Map();
  arr.forEach(x => { const k = keyFn(x); const c = m.get(k); if (c) c.n++; else m.set(k, { key: k, label: labelFn ? labelFn(x) : k, n: 1 }); });
  return [...m.values()].sort((a, b) => b.n - a.n);
}

function renderChart() {
  const days = S.period === 1 ? 7 : S.period === 0 ? 30 : S.period;
  const since = startOfDay(Date.now() - (days - 1) * 864e5);
  const ev = events().filter(e => e.ok && e.t >= since && (!S.person || e.from === S.person));
  const buckets = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(since + i * 864e5 + 3600e3); d.setHours(0, 0, 0, 0);
    buckets.push({ t: d.getTime(), n: 0, by: new Map() });
  }
  ev.forEach(e => {
    const idx = Math.floor((startOfDay(e.t) - since) / 864e5 + .5);
    const b = buckets[idx]; if (!b) return;
    b.n++; const who = e.fromName || e.from; b.by.set(who, (b.by.get(who) || 0) + 1);
  });
  $('chartMeta').textContent = `Last ${days} days`;
  const max = Math.max(...buckets.map(b => b.n));
  const el = $('chart');
  if (!max) { el.className = 'chart'; el.innerHTML = `<div class="empty"><strong>Nothing sent in this period</strong>Campaigns will show up here as soon as they go out.</div>`; return; }
  const top = niceMax(max);
  const grid = [0.5, 1].map(f => `<span style="bottom:${f * 100}%"><em>${Math.round(top * f)}</em></span>`).join('');
  const step = days > 14 ? Math.ceil(days / 8) : 1;
  el.className = 'chart has-axis';
  el.innerHTML = `<div class="chart-plot"><div class="chart-grid">${grid}</div>${buckets.map((b, i) =>
    `<div class="chart-col${b.n ? '' : ' zero'}" data-i="${i}"><div class="chart-bar" style="height:${b.n / top * 100}%"></div></div>`).join('')}</div>
    <div class="chart-x">${buckets.map((b, i) => `<span>${(i % step === 0 || i === days - 1) && (days - 1 - i) % step === 0 ? esc(dayLabel(b.t, days)) : ''}</span>`).join('')}</div>`;
  const plot = el.querySelector('.chart-plot');
  let tip;
  plot.onmousemove = e => {
    const col = e.target.closest('.chart-col');
    if (!col) { if (tip) tip.remove(); tip = null; return; }
    const b = buckets[+col.dataset.i];
    if (!tip) { tip = document.createElement('div'); tip.className = 'tip'; el.appendChild(tip); }
    const people = [...b.by].sort((a, c) => c[1] - a[1]).slice(0, 3).map(([n, c]) => `${esc(n)}: ${c}`).join('<br>');
    tip.innerHTML = `<strong>${b.n} ${b.n === 1 ? 'email' : 'emails'}</strong> · ${esc(new Date(b.t).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }))}${people && !S.person ? '<br>' + people : ''}`;
    const r = col.getBoundingClientRect(), pr = el.getBoundingClientRect();
    const barTop = col.querySelector('.chart-bar').getBoundingClientRect().top;
    tip.style.left = Math.min(Math.max(r.left - pr.left + r.width / 2, 70), pr.width - 70) + 'px';
    tip.style.top = (Math.min(barTop, r.bottom - 4) - pr.top) + 'px';
  };
  plot.onmouseleave = () => { if (tip) tip.remove(); tip = null; };
}
function niceMax(v) {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const m = v / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p;
}
function dayLabel(t, days) {
  const d = new Date(t);
  return days <= 7 ? d.toLocaleDateString('en-IN', { weekday: 'short' }) : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function renderTypeBars(ok) {
  const rows = countBy(ok, e => e.type || 'custom', e => TYPES[e.type] || 'Other');
  if (!rows.length) { $('typeBars').innerHTML = '<div class="empty">No campaigns in this period</div>'; return; }
  const max = rows[0].n;
  $('typeBars').innerHTML = rows.map(r => `<div class="hbar"><div class="hbar-top"><span>${esc(r.label)}</span><span>${r.n.toLocaleString('en-IN')}</span></div>
    <div class="hbar-track"><div class="hbar-fill" style="width:${r.n / max * 100}%"></div></div></div>`).join('');
}

function renderPeople() {
  const since = periodSince(), today = startOfDay();
  const m = new Map();
  events().forEach(e => {
    let p = m.get(e.from);
    if (!p) { p = { from: e.from, name: e.fromName || '', acct: e.acct || 'gmail', today: 0, period: 0, camps: new Set(), brands: new Set(), pairs: new Set(), failed: 0, last: 0, total: 0 }; m.set(e.from, p); }
    if (!p.name && e.fromName) p.name = e.fromName;
    if (e.t > p.last && e.ok) { p.last = e.t; if (e.acct) p.acct = e.acct; }
    if (e.ok) p.total++;
    if (e.ok && e.t >= today) p.today++;
    if (e.t >= since) {
      if (e.ok) { p.period++; p.camps.add(e.cid); p.pairs.add(e.to); if (e.brand) p.brands.add(e.brand.toLowerCase()); }
      else p.failed++;
    }
  });
  let rows = [...m.values()];
  if (S.person) rows = rows.filter(r => r.from === S.person);
  rows.sort((a, b) => b.period - a.period || b.last - a.last);
  if (!rows.length) { $('peopleBody').innerHTML = `<tr class="table-empty"><td colspan="9">No one has sent anything yet. The first campaign will show up here.</td></tr>`; return; }
  $('peopleBody').innerHTML = rows.map(p => {
    const lim = dailyLimit(p.acct); const pct = Math.min(100, p.today / lim * 100);
    return `<tr>
      <td><div class="person"><span class="avatar">${esc(initials(p.name || p.from))}</span><div><span class="td-strong">${esc(p.name || p.from.split('@')[0])}</span><span class="td-sub">${esc(p.from)}</span></div></div></td>
      <td class="t-num">${p.today}</td>
      <td class="t-num td-strong">${p.period.toLocaleString('en-IN')}</td>
      <td class="t-num">${p.camps.size}</td>
      <td class="t-num">${p.brands.size}</td>
      <td class="t-num">${[...p.pairs].filter(to => S.replies[p.from + '|' + to]).length}</td>
      <td class="t-num">${p.failed ? `<span style="color:var(--bad)">${p.failed}</span>` : '0'}</td>
      <td><div class="limit"><div class="meter${pct >= 90 ? ' bad' : pct >= 70 ? ' warn' : ''}"><span style="width:${pct}%"></span></div><span>${p.today} / ${lim}</span></div></td>
      <td class="td-when">${p.last ? esc(timeAgo(p.last)) : '—'}</td>
    </tr>`;
  }).join('');
}

function campaigns() {
  const m = new Map();
  filtered().slice().sort((a, b) => a.t - b.t).forEach(e => {
    const id = e.cid || ('x' + e.t);
    let c = m.get(id);
    if (!c) { c = { cid: id, root: e.root || id, fu: e.fu || 0, from: e.from, fromName: e.fromName, type: e.type, subject: e.subject, brands: new Map(), sent: 0, failed: 0, first: e.t, last: e.t, att: e.att || 0, rows: [] }; m.set(id, c); }
    if (e.ok) c.sent++; else c.failed++;
    if (e.brand) c.brands.set(e.brand.toLowerCase(), e.brand);
    c.first = Math.min(c.first, e.t); c.last = Math.max(c.last, e.t);
    c.rows.push(e);
  });
  return [...m.values()].sort((a, b) => b.last - a.last);
}
function brandLabel(c) {
  const b = [...c.brands.values()];
  return b.length ? b[0] + (b.length > 1 ? ` +${b.length - 1}` : '') : '—';
}
function renderCampaigns() {
  const q = $('campSearch').value.trim().toLowerCase();
  let list = campaigns();
  if (q) list = list.filter(c => [brandLabel(c), [...c.brands.values()].join(' '), c.subject, c.fromName, c.from, TYPES[c.type]].join(' ').toLowerCase().includes(q));
  if (!list.length) { $('campBody').innerHTML = `<tr class="table-empty"><td colspan="7">${q ? 'No campaigns match your search.' : 'No campaigns in this period yet.'}</td></tr>`; return; }
  $('campBody').innerHTML = list.slice(0, 200).map(c => `<tr data-cid="${esc(c.cid)}" tabindex="0">
    <td class="td-strong">${esc(brandLabel(c))}</td>
    <td class="td-clip" title="${esc(c.subject)}">${esc(c.subject || '—')}</td>
    <td><span class="type-tag">${esc(typeLabel(c))}</span></td>
    <td>${esc(c.fromName || c.from)}</td>
    <td class="t-num">${c.sent}</td>
    <td class="t-num">${c.failed ? `<span style="color:var(--bad)">${c.failed}</span>` : '0'}</td>
    <td class="td-when">${esc(fmtDate(c.last))}</td></tr>`).join('');
}

function openCampaign(cid) {
  const c = campaigns().find(x => x.cid === cid); if (!c) return;
  $('cmTitle').textContent = brandLabel(c) === '—' ? 'Campaign' : brandLabel(c);
  const rows = c.rows.slice().sort((a, b) => a.t - b.t);
  $('cmBody').innerHTML = `
    <div class="cm-meta">
      <div>Sent by<strong>${esc(c.fromName || c.from)}</strong></div>
      <div>Type<strong>${esc(typeLabel(c))}</strong></div>
      <div>Delivered<strong>${c.sent} of ${c.sent + c.failed}</strong></div>
      <div>When<strong>${esc(fmtDate(c.first))}</strong></div>
    </div>
    <p style="margin-bottom:14px"><span class="muted">Subject:</span> ${esc(c.subject || '')}</p>
    <table class="table"><thead><tr><th>To</th><th>Brand</th><th>Time</th><th>Status</th></tr></thead><tbody>
    ${rows.map(e => `<tr><td>${e.toName ? `<span class="td-strong">${esc(e.toName)}</span><span class="td-sub">${esc(e.to)}</span>` : esc(e.to)}</td><td>${esc(e.brand || '—')}</td>
      <td class="td-when">${esc(new Date(e.t).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))}</td>
      <td>${e.ok ? sentPill(e) : `<span class="pill pill-bad" title="${esc(e.err || '')}">Failed</span>`}</td></tr>`).join('')}
    </tbody></table>`;
  const me = (S.settings.email || '').toLowerCase();
  const th = c.from === me ? myThreads().find(t => t.root === c.root) : null;
  $('cmFollow').hidden = !(th && th.stage < FU_MAX && th.pending.length);
  $('cmFollow').onclick = () => { closeModal('campModal'); startFollowUp(c.root); };
  openModal('campModal');
}

function exportCsv() {
  const ev = filtered();
  if (!ev.length) return toast('info', 'Nothing to export', 'There are no emails in this period.');
  const hdr = ['Date', 'Time', 'Sent by', 'Sender email', 'Recipient', 'Recipient name', 'Brand', 'Campaign type', 'Subject', 'Status', 'Error'];
  const rows = ev.slice().sort((a, b) => a.t - b.t).map(e => {
    const d = new Date(e.t);
    return [d.toLocaleDateString('en-IN'), d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), e.fromName, e.from, e.to, e.toName, e.brand, TYPES[e.type] || 'Other', e.subject, e.ok ? 'Sent' : 'Failed', e.err || ''];
  });
  const csv = '﻿' + [hdr, ...rows].map(r => r.map(csvCell).join(',')).join('\n');
  downloadFile(`vigorlaunchpad-emails-${new Date().toISOString().slice(0, 10)}.csv`, csv, 'text/csv');
  toast('ok', 'Exported', `${ev.length} emails downloaded as CSV.`);
}

// ═══════════════════════════════════════════════════════════════
//  Sent log
// ═══════════════════════════════════════════════════════════════
function renderLog() {
  if ($('page-log').hidden) return;
  const q = $('logSearch').value.trim().toLowerCase();
  const st = $('logStatus').value;
  let ev = events().slice().sort((a, b) => b.t - a.t);
  if (st) ev = ev.filter(e => st === 'ok' ? e.ok : !e.ok);
  if (q) ev = ev.filter(e => [e.to, e.toName, e.brand, e.subject, e.fromName, e.from].join(' ').toLowerCase().includes(q));
  if (!ev.length) {
    $('logBody').innerHTML = `<tr class="table-empty"><td colspan="6">${q ? `Nobody has emailed “${esc(q)}” yet.` : 'No emails sent yet. Your first campaign will show up here.'}</td></tr>`;
    $('logFoot').innerHTML = '';
    return;
  }
  const shown = ev.slice(0, S.logLimit);
  $('logBody').innerHTML = shown.map(e => `<tr>
    <td class="td-when">${esc(fmtDate(e.t))}</td>
    <td>${e.toName ? `<span class="td-strong">${esc(e.toName)}</span><span class="td-sub">${esc(e.to)}</span>` : esc(e.to)}</td>
    <td>${esc(e.brand || '—')}</td>
    <td class="td-clip" title="${esc(e.subject)}">${esc(e.subject || '')}</td>
    <td>${esc(e.fromName || e.from)}</td>
    <td>${e.ok ? sentPill(e) : `<span class="pill pill-bad" title="${esc(e.err || '')}">Failed</span>`}</td></tr>`).join('');
  const scope = S.team.storage && S.team.loaded ? 'whole team' : 'this browser only';
  $('logFoot').innerHTML = `<span>Showing ${shown.length.toLocaleString('en-IN')} of ${ev.length.toLocaleString('en-IN')} · ${scope}${S.team.capped ? ' · latest 8,000 emails' : ''}</span>` +
    (ev.length > shown.length ? `<button class="btn btn-outline btn-sm" data-more type="button">Show more</button>` : '');
}

// ═══════════════════════════════════════════════════════════════
//  Settings
// ═══════════════════════════════════════════════════════════════
function bindSettings() {
  $('passEye').onclick = () => { const p = $('sPass'); p.type = p.type === 'password' ? 'text' : 'password'; $('passEye').setAttribute('aria-label', p.type === 'password' ? 'Show password' : 'Hide password'); };
  $('saveAcctBtn').onclick = () => {
    const email = $('sEmail').value.trim().toLowerCase();
    if (email && !EMAIL_RE.test(email)) { toast('bad', 'Check your Gmail address', 'It doesn’t look like a valid email.'); return $('sEmail').focus(); }
    const pass = $('sPass').value.replace(/\s+/g, '');
    if (pass && pass.length !== 16) toast('info', 'App Passwords are 16 letters', 'Double-check that you copied the whole code.');
    Object.assign(S.settings, { name: $('sName').value.trim(), email, pass, acct: $('sAcct').value });
    saveSettings(); toast('ok', 'Gmail details saved', 'Click “Test connection” to make sure they work.');
  };
  $('verifyBtn').onclick = verifyAccount;
  $('saveSigBtn').onclick = () => { S.settings.signature = $('sSig').value.trim(); saveSettings(); toast('ok', 'Signature saved'); };
  $('saveDncBtn').onclick = () => {
    const list = [...new Set($('sDnc').value.split(/[\s,;]+/).map(x => x.trim().toLowerCase()).filter(x => EMAIL_RE.test(x)))];
    S.settings.dnc = list; $('sDnc').value = list.join('\n'); saveSettings(); parseAndRender(true);
    toast('ok', 'Do-not-contact list saved', `${list.length} ${list.length === 1 ? 'address' : 'addresses'}`);
  };
  $('saveSendBtn').onclick = () => {
    const pace = (document.querySelector('input[name="pace"]:checked') || {}).value || 'normal';
    const reply = $('sReply').value.trim();
    if (reply && !EMAIL_RE.test(reply)) { toast('bad', 'Check the reply-to address'); return $('sReply').focus(); }
    Object.assign(S.settings, { pace, unsubscribe: $('sUnsub').checked, dupDays: +$('sDup').value, replyTo: reply });
    saveSettings(); parseAndRender(true); toast('ok', 'Sending options saved');
  };
  $('saveAccessBtn').onclick = () => { store.set('vl_access', $('sAccess').value.trim()); $('sAccess').value = ''; toast('ok', 'Access code saved'); loadTeam(true); };
  $('clearLocalBtn').onclick = () => {
    if (!S.local.length) return toast('info', 'Nothing to clear', 'This browser has no saved history.');
    const prev = S.local.slice();
    S.local = []; store.set('vl_events', []); renderTeam(); renderLog(); updateQuota(); parseAndRender(true);
    toast('info', 'Browser history cleared', S.team.storage ? 'The team’s shared history is not affected.' : '', { label: 'Undo', fn: () => { S.local = prev; store.set('vl_events', prev); renderTeam(); renderLog(); updateQuota(); } });
  };
}
function fillSettingsForm() {
  const s = S.settings;
  $('sName').value = s.name; $('sEmail').value = s.email; $('sPass').value = s.pass; $('sAcct').value = s.acct;
  $('sSig').value = s.signature; $('sDnc').value = (s.dnc || []).join('\n');
  const r = document.querySelector(`input[name="pace"][value="${s.pace}"]`) || document.querySelector('input[name="pace"][value="normal"]');
  r.checked = true;
  $('sUnsub').checked = !!s.unsubscribe; $('sDup').value = String(s.dupDays); $('sReply').value = s.replyTo || '';
}
function saveSettings() {
  store.set('vl_settings', S.settings);
  refreshIdentity(); updateQuota(); updateReadiness(); updateSendInfo();
}
function refreshIdentity() {
  const s = S.settings;
  const ready = s.email && s.pass;
  $('meAvatar').textContent = initials(s.name || s.email);
  $('meName').textContent = s.name || s.email || 'Set up your Gmail';
  $('meSub').textContent = ready ? s.email : 'Takes about 2 minutes';
  $('connStatus').className = 'status' + (ready ? ' ok' : '');
  $('connText').textContent = ready ? 'Gmail connected' : 'Gmail not set up';
  $('setupNotice').hidden = !!ready;
  $('sigHint').textContent = (s.signature || '').trim() ? '' : '(add one in Settings)';
}
async function verifyAccount() {
  const user = $('sEmail').value.trim(), pass = $('sPass').value;
  const st = $('verifyStatus');
  if (!user || !pass) { st.className = 'inline-status bad'; st.textContent = 'Enter your Gmail and App Password first.'; return; }
  st.className = 'inline-status'; st.textContent = 'Checking with Gmail…';
  $('verifyBtn').disabled = true;
  try {
    const { ok, data } = await api('/api/verify', { method: 'POST', body: { user, pass } });
    if (ok && data.ok) {
      st.className = 'inline-status ok'; st.innerHTML = ICONS.ok + ' Connected. You’re ready to send.';
      Object.assign(S.settings, { name: $('sName').value.trim(), email: user.toLowerCase(), pass: pass.replace(/\s+/g, ''), acct: $('sAcct').value });
      saveSettings();
    } else { st.className = 'inline-status bad'; st.textContent = data.error || 'Gmail did not accept this login.'; }
  } catch (e) {
    st.className = 'inline-status bad';
    st.textContent = e.access ? 'Enter the team access code first.' : 'Couldn’t reach the server. Is the site deployed on Vercel?';
  } finally { $('verifyBtn').disabled = false; }
}
function renderStorageStatus() {
  const el = $('storageStatus');
  if (S.team.storage === null) el.innerHTML = '<span class="pill pill-muted">Unknown</span><span>Couldn’t reach the server. This works once the site is live on Vercel.</span>';
  else if (S.team.storage) el.innerHTML = '<span class="pill pill-ok">On</span><span>Every email sent from this dashboard is logged for the team view.</span>';
  else el.innerHTML = '<span class="pill pill-warn">Off</span><span>Only this browser’s history is shown. Connect Upstash Redis in Vercel → Storage to track the whole team.</span>';
  $('accessField').hidden = !S.team.accessRequired;
  if ($('page-team') && !$('page-team').hidden) renderTeam();
}

// ═══════════════════════════════════════════════════════════════
//  Modals, access gate, toasts
// ═══════════════════════════════════════════════════════════════
let lastFocusEl = null;
function openModal(id) { lastFocusEl = document.activeElement; $(id).hidden = false; const f = $(id).querySelector('input,button:not([data-close])'); if (f && id !== 'previewModal' && id !== 'progressModal') setTimeout(() => f.focus(), 30); }
function closeModal(id) { $(id).hidden = true; if (lastFocusEl && lastFocusEl.focus) lastFocusEl.focus(); }
function bindModals() {
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target.closest('[data-close]') || (e.target === m && m.id !== 'progressModal' && m.id !== 'accessModal')) closeModal(m.id);
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const open = [...document.querySelectorAll('.modal')].reverse().find(m => !m.hidden);
    if (open && open.id !== 'progressModal' && open.id !== 'accessModal') closeModal(open.id);
    else if (!open) closeNav();
  });
  $('acGo').onclick = submitAccess;
  $('acCode').addEventListener('keydown', e => { if (e.key === 'Enter') submitAccess(); });
}
function openAccess() { if ($('accessModal').hidden) { $('acErr').hidden = true; $('acCode').value = ''; openModal('accessModal'); } }
async function submitAccess() {
  const code = $('acCode').value.trim(); if (!code) return;
  store.set('vl_access', code);
  try {
    const res = await fetch('/api/logs', { headers: { 'x-vl-access': code } });
    if (res.status === 401) { store.del('vl_access'); $('acErr').hidden = false; return; }
    closeModal('accessModal'); toast('ok', 'Welcome in');
    loadTeam(true);
  } catch { $('acErr').hidden = false; $('acErr').textContent = 'Couldn’t reach the server. Try again.'; }
}

function toast(type, title, msg, action) {
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  const icon = type === 'ok' ? ICONS.ok : type === 'bad' ? ICONS.bad : ICONS.info;
  el.innerHTML = `${icon}<div style="flex:1"><strong>${esc(title)}</strong>${msg ? `<span>${esc(msg)}</span>` : ''}</div>`;
  if (action) {
    const b = document.createElement('button');
    b.className = 'btn btn-sm'; b.style.cssText = 'color:#fff;border:1px solid rgba(255,255,255,.3);height:30px';
    b.textContent = action.label; b.onclick = () => { action.fn(); el.remove(); };
    el.appendChild(b);
  }
  $('toasts').appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 260); }, action ? 7000 : 4500);
}

// ═══════════════════════════════════════════════════════════════
//  Utilities
// ═══════════════════════════════════════════════════════════════
function esc(s) { return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function initials(s) {
  s = String(s || '').trim(); if (!s) return '?';
  if (s.includes('@')) return s[0].toUpperCase();
  return s.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
}
function fmtSize(b) { return b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(1) + ' MB'; }
function fmtDate(t) { return new Date(t).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); }
function fmtDuration(s) {
  if (s < 60) return `${Math.max(1, s)} sec`;
  const m = Math.round(s / 60);
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} hr ${m % 60} min`;
}
function timeAgo(t) {
  const m = Math.floor((Date.now() - t) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h} hr ago`;
  const d = Math.floor(h / 24); if (d < 30) return `${d} day${d > 1 ? 's' : ''} ago`;
  return new Date(t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
function csvSoft(v) { v = String(v ?? ''); return /[",\n]/.test(v) ? csvCell(v) : v; }
function csvCell(v) { return `"${String(v ?? '').replace(/"/g, '""')}"`; }
function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
