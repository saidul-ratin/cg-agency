/* CG Agency — dashboard.js  (FIXED)
   - real sidebar overlay (tap outside closes it), Esc closes it
   - notification panel moved out of the <button>, items are clickable
   - overview "+ New Project" now opens the modal
   - invoice Download / View and file download buttons work,
     including buttons on newly uploaded files (event delegation)
   - reply goes to the contact you sent it to, even if you switch chats */

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* TOAST */
function showToast(msg) {
  let t = document.getElementById('dashToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'dashToast';
    t.className = 'dash-toast';
    t.setAttribute('role', 'status');
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* SIDEBAR */
const sidebar = document.getElementById('sidebar');
const sbToggle = document.getElementById('sbToggle');

const sbOverlay = document.createElement('div');
sbOverlay.className = 'sb-overlay';
document.body.appendChild(sbOverlay);

function setSidebar(open) {
  if (sidebar) sidebar.classList.toggle('open', open);
  document.body.classList.toggle('sb-open', open);
}
sbOverlay.addEventListener('click', () => setSidebar(false));

if (sbToggle && sidebar) {
  sbToggle.addEventListener('click', e => {
    e.stopPropagation();
    setSidebar(!sidebar.classList.contains('open'));
  });
  document.addEventListener('click', e => {
    if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !sbToggle.contains(e.target)) {
      setSidebar(false);
    }
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) setSidebar(false); });
}

/* SECTION SWITCHING */
function switchSection(id) {
  document.querySelectorAll('.sbn').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.ds-section').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById('sec-' + id);
  if (sec) sec.classList.add('active');
  const nav = document.querySelector(`.sbn[data-section="${id}"]`);
  if (nav) nav.classList.add('active');
  setSidebar(false);
  window.scrollTo(0, 0);
}
window.switchSection = switchSection;

document.querySelectorAll('.sbn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    switchSection(btn.dataset.section);
  });
});

/* GREETING */
const greetEl = document.getElementById('greetMsg');
if (greetEl) {
  const h = new Date().getHours();
  const greet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  try {
    const user = JSON.parse(sessionStorage.getItem('cg_user') || '{}');
    const name = user.name ? user.name.split(' ')[0] : 'Saidul';
    greetEl.textContent = `${greet}, ${name} 👋`;
    const sbName = document.getElementById('sbName');
    const sbEmail = document.getElementById('sbEmail');
    const sbAv = document.getElementById('sbAv');
    const tbName = document.getElementById('tbName');
    const tbAv = document.getElementById('tbAv');
    if (sbName) sbName.textContent = user.name || 'MD Saidul Islam Ratin';
    if (sbEmail) sbEmail.textContent = user.email || 'mdsaidulislamratin967@gmail.com';
    if (sbAv) sbAv.textContent = (user.name || 'SR').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    if (tbName) tbName.textContent = user.name || 'MD Saidul Islam Ratin';
    if (tbAv) tbAv.textContent = (user.name || 'SR').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  } catch {}
}

/* COUNTERS */
document.querySelectorAll('.counter').forEach(el => {
  const end = parseInt(el.dataset.t),
    dur = 1400,
    s = performance.now();
  const tick = n => {
    const p = Math.min((n - s) / dur, 1),
      v = Math.floor((1 - Math.pow(1 - p, 3)) * end);
    el.textContent = v;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = end;
  };
  setTimeout(() => requestAnimationFrame(tick), 200);
});

/* PROGRESS BARS */
setTimeout(() => {
  document.querySelectorAll('.pip-bar, .pcp-bar').forEach(bar => {
    const w = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => { bar.style.width = w; }, 100);
  });
}, 300);

/* ANALYTICS CHART */
const chartEl = document.getElementById('trafficChart');
if (chartEl) {
  const data = [30, 45, 35, 60, 50, 75, 65, 80, 72, 90, 85, 95];
  const max = Math.max(...data);
  const cols = ['#c9a84c', '#e8c76a', '#a8863a'];
  chartEl.innerHTML = data.map((v, i) => {
    const hh = Math.round((v / max) * 72);
    return `<div style="flex:1;height:${hh}px;background:${cols[i % 3]};border-radius:3px 3px 0 0;opacity:${.45 + i * .05};transition:height .8s ${i * .05}s ease"></div>`;
  }).join('');
}

/* MESSAGES */
const mcInput = document.getElementById('mcInput');
const mcSend = document.getElementById('mcSend');
const mcMsgs = document.getElementById('mcMessages');

const contactHistory = {
  'Jane Doe': [
    { type: 'them', text: "Hi! The logo options are ready for your review. I've uploaded 3 concepts to the files section.", time: '2:30 PM' },
    { type: 'them', text: "Let me know which direction feels right 🎨", time: '2:31 PM' },
    { type: 'me', text: "These look amazing! I'm leaning towards concept 2. Can we make the font slightly bolder?", time: '3:15 PM' },
    { type: 'them', text: "Absolutely! I'll have the updated version ready by tomorrow morning.", time: '3:20 PM' }
  ],
  'John Smith': [
    { type: 'them', text: "Hey! All wireframes have been uploaded to the files section.", time: '9:00 AM' },
    { type: 'them', text: "Let me know if you need any revisions on the homepage layout.", time: '9:01 AM' }
  ],
  'Emily Clark': [
    { type: 'them', text: "Hi there! Your Q2 campaign report is ready for review.", time: 'Yesterday' },
    { type: 'them', text: "Overall performance was up 41% vs last month 🎉", time: 'Yesterday' }
  ],
  'CG Agency Team': [
    { type: 'them', text: "Welcome to your CG Agency client portal! 🎉 We're excited to work with you.", time: '3d ago' },
    { type: 'them', text: "Here you can track projects, view files, pay invoices, and message your team.", time: '3d ago' }
  ]
};

const autoReplies = {
  'Jane Doe': ["Great feedback! I'll work on that right away.", "Thanks! Will have revisions ready by end of day.", "Noted! Will incorporate those changes in the next version.", "Perfect! Updated draft ready tomorrow morning."],
  'John Smith': ["On it! I'll update the wireframes shortly.", "Got it! Changes reflected in the next revision.", "Sure thing! Pushing those updates now.", "Absolutely, will have that sorted by EOD."],
  'Emily Clark': ["Thanks! Reviewing the report now.", "Great numbers! Let's discuss the next campaign strategy.", "Noted! I'll review and get back with feedback.", "Excellent work! Can we schedule a call to go over the highlights?"],
  'CG Agency Team': ["Thank you! Excited to get started.", "The portal looks great!", "Thanks for the support!", "Great onboarding experience!"]
};

let currentContact = 'Jane Doe';
const replyIndex = {};

function getAutoReply(contact) {
  const replies = autoReplies[contact] || autoReplies['CG Agency Team'];
  if (!(contact in replyIndex)) replyIndex[contact] = 0;
  const reply = replies[replyIndex[contact] % replies.length];
  replyIndex[contact]++;
  return reply;
}

function renderMessages(contact) {
  mcMsgs.innerHTML = '';
  const msgs = contactHistory[contact] || [];
  msgs.forEach(m => {
    const el = document.createElement('div');
    el.className = 'mc-msg ' + m.type;
    el.innerHTML = `<div class="mc-bubble">${esc(m.text)}</div><span>${esc(m.time)}</span>`;
    mcMsgs.appendChild(el);
  });
  mcMsgs.scrollTop = mcMsgs.scrollHeight;
}

document.querySelectorAll('.msg-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.msg-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    const badge = item.querySelector('.msg-unread');
    if (badge) badge.remove();
    currentContact = item.dataset.contact;
    document.getElementById('mcHeadName').textContent = currentContact;
    document.getElementById('mcHeadAv').textContent = item.dataset.init;
    const statusMap = {
      'Jane Doe': 'Creative Director · Online',
      'John Smith': 'Lead Designer · Away',
      'Emily Clark': 'Strategy Director · Online',
      'CG Agency Team': 'Support Team · Online'
    };
    document.getElementById('mcHeadStatus').textContent = statusMap[currentContact] || 'Online';
    renderMessages(currentContact);
    // on phones the chat is below the list, so bring it into view
    if (window.innerWidth <= 900) {
      const chat = document.querySelector('.msg-chat');
      if (chat) chat.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
renderMessages(currentContact);

let isMsgSending = false;

function sendChatMsg() {
  const text = mcInput.value.trim();
  if (!text || isMsgSending) return;
  isMsgSending = true;
  const contact = currentContact;   // remember who this message was sent to

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (!contactHistory[contact]) contactHistory[contact] = [];
  contactHistory[contact].push({ type: 'me', text, time: now });
  mcInput.value = '';
  renderMessages(contact);

  const typing = document.createElement('div');
  typing.className = 'mc-typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  mcMsgs.appendChild(typing);
  mcMsgs.scrollTop = mcMsgs.scrollHeight;

  const delay = 900 + Math.random() * 700;
  setTimeout(() => {
    typing.remove();
    const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    contactHistory[contact].push({ type: 'them', text: getAutoReply(contact), time: replyTime });
    if (currentContact === contact) renderMessages(contact);
    isMsgSending = false;
  }, delay);
}

if (mcSend) mcSend.addEventListener('click', sendChatMsg);
if (mcInput) mcInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendChatMsg();
});

/* NOTIFICATIONS */
const notifBtn = document.getElementById('notifBtn');
if (notifBtn) {
  const panel = document.createElement('div');
  panel.className = 'notif-panel';
  panel.id = 'notifPanel';
  panel.innerHTML = `
    <div class="np-head">Notifications</div>
    <div class="np-item" data-go="files"><div class="np-dot" style="background:var(--v3)"></div><div><p>Logo draft uploaded by Jane D.</p><span>2 hours ago</span></div></div>
    <div class="np-item" data-go="files"><div class="np-dot" style="background:var(--blue)"></div><div><p>Homepage wireframe approved</p><span>5 hours ago</span></div></div>
    <div class="np-item" data-go="invoices"><div class="np-dot" style="background:var(--coral)"></div><div><p>Invoice #INV-2026-09 is pending</p><span>Yesterday</span></div></div>
    <div class="np-item" data-go="messages"><div class="np-dot" style="background:var(--gold)"></div><div><p>New message from Emily C.</p><span>2 days ago</span></div></div>`;
  // sits next to the button (not inside it) so taps on the panel are real taps on the panel
  (notifBtn.parentElement || document.body).appendChild(panel);

  notifBtn.addEventListener('click', e => {
    e.stopPropagation();
    panel.classList.toggle('open');
    const dot = notifBtn.querySelector('.notif-dot');
    if (dot) dot.style.display = 'none';
  });
  panel.addEventListener('click', e => {
    e.stopPropagation();
    const item = e.target.closest('.np-item');
    if (item && item.dataset.go) switchSection(item.dataset.go);
    panel.classList.remove('open');
  });
  document.addEventListener('click', () => panel.classList.remove('open'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') panel.classList.remove('open'); });
}

/* SEARCH */
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    if (!q) {
      document.querySelectorAll('.pcard').forEach(c => c.style.opacity = '1');
      return;
    }
    document.querySelectorAll('.pcard').forEach(c => {
      const match = c.innerText.toLowerCase().includes(q);
      c.style.opacity = match ? '1' : '.3';
    });
  });
}

/* NEW PROJECT MODAL */
const projModal = document.getElementById('projModal');
const newProjectBtn = document.getElementById('newProjectBtn');
const closeProjModalBtn = document.getElementById('closeProjModal');
const createProjBtn = document.getElementById('createProjectBtn');

function openProjModal() {
  if (!projModal) return;
  projModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  const box = projModal.querySelector('.modal-box-dash');
  if (box) box.scrollTop = 0;
}
function closeProjModal() {
  if (!projModal) return;
  projModal.classList.remove('open');
  document.body.style.overflow = '';
}
window.openProjModal = openProjModal;

if (newProjectBtn) newProjectBtn.addEventListener('click', openProjModal);
if (closeProjModalBtn) closeProjModalBtn.addEventListener('click', closeProjModal);
if (projModal) projModal.addEventListener('click', e => {
  if (e.target === projModal) closeProjModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeProjModal(); });

// Overview "+ New Project": go to Projects and open the modal
const overviewNew = document.querySelector('#sec-overview .btn-new');
if (overviewNew) {
  overviewNew.removeAttribute('onclick');
  overviewNew.addEventListener('click', () => {
    switchSection('projects');
    openProjModal();
  });
}

if (createProjBtn) {
  createProjBtn.addEventListener('click', async () => {
    const title = document.getElementById('npTitle').value.trim();
    const due = document.getElementById('npDue').value.trim();
    const status = document.getElementById('npStatus').value;
    const msg = document.getElementById('projMsg');

    if (!title) {
      msg.textContent = '⚠ Project title is required.';
      msg.style.color = '#ff6b4a';
      return;
    }
    createProjBtn.disabled = true;
    createProjBtn.textContent = 'Creating…';

    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, due, status })
      });
    } catch {}

    const colors = { active: 'var(--v3)', review: 'var(--gold)', done: 'var(--green)' };
    const card = document.createElement('div');
    card.className = 'pcard';
    card.innerHTML = `
      <div class="pcard-top">
        <span class="pcard-status ${esc(status)}">${esc(status.charAt(0).toUpperCase() + status.slice(1))}</span>
        <span class="pcard-date">${due ? 'Due ' + esc(due) : 'TBD'}</span>
      </div>
      <h3>${esc(title)}</h3>
      <p>New project — add description and team members.</p>
      <div class="pcard-prog"><div class="pcp-bar" style="width:0%;background:${colors[status] || 'var(--v3)'}"></div></div>
      <div class="pcard-foot"><span>0% complete</span><div class="pcard-team"><div class="pt-av">ME</div></div></div>`;
    const grid = document.getElementById('projCards');
    if (grid) grid.prepend(card);

    msg.textContent = '✓ Project created!';
    msg.style.color = '#7ec8a0';
    setTimeout(() => {
      closeProjModal();
      msg.textContent = '';
      document.getElementById('npTitle').value = '';
      document.getElementById('npDue').value = '';
      createProjBtn.disabled = false;
      createProjBtn.textContent = 'Create Project';
    }, 1200);
  });
}

/* SETTINGS SAVE */
const saveProfile = document.getElementById('saveProfile');
if (saveProfile) {
  saveProfile.addEventListener('click', async () => {
    const name = `${document.getElementById('setFirst').value} ${document.getElementById('setLast').value}`.trim();
    const email = document.getElementById('setEmail').value.trim();
    const company = document.getElementById('setCompany').value.trim();
    const msg = document.getElementById('saveMsg');
    saveProfile.disabled = true;

    try {
      await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company })
      });
    } catch {}

    try {
      const user = JSON.parse(sessionStorage.getItem('cg_user') || '{}');
      user.name = name;
      user.email = email;
      user.company = company;
      sessionStorage.setItem('cg_user', JSON.stringify(user));
    } catch {}

    msg.textContent = '✓ Profile saved successfully!';
    msg.style.color = '#e8c76a';
    saveProfile.textContent = 'Saved ✓';
    saveProfile.style.background = 'var(--green)';
    setTimeout(() => {
      msg.textContent = '';
      saveProfile.textContent = 'Save Changes';
      saveProfile.style.background = '';
      saveProfile.disabled = false;
    }, 2500);
  });
}

/* INVOICE + FILE BUTTONS — one delegated handler, so buttons added later work too */
async function handlePay(btn) {
  if (btn.disabled) return;
  const row = btn.closest('.it-row');
  const id = row ? row.querySelector('span').textContent.trim() : 'Invoice';
  btn.textContent = 'Processing…';
  btn.disabled = true;
  await new Promise(r => setTimeout(r, 1200));
  const status = row && row.querySelector('.inv-pending');
  if (status) {
    status.textContent = 'Paid';
    status.className = 'inv-paid';
  }
  btn.textContent = 'Download';
  btn.className = 'inv-btn';
  btn.disabled = false;
  showToast(`${id} paid`);
}

function handleInvoiceButton(btn) {
  const row = btn.closest('.it-row');
  const cells = row ? row.querySelectorAll('span') : [];
  const id = cells[0] ? cells[0].textContent.trim() : 'Invoice';
  const date = cells[3] ? cells[3].textContent.trim() : '';
  if (btn.textContent.trim() === 'Download') showToast(`Downloading ${id}…`);
  else showToast(`${id} will be issued on ${date}`);
}

function handleFileDownload(btn) {
  if (btn.dataset.busy) return;
  const card = btn.closest('.file-card');
  const strong = card && card.querySelector('strong');
  const name = strong ? strong.textContent.trim() : 'File';
  btn.dataset.busy = '1';
  btn.textContent = '✓';
  btn.style.borderColor = 'var(--green)';
  btn.style.color = 'var(--green)';
  showToast(`Downloading ${name}…`);
  setTimeout(() => {
    btn.textContent = '↓';
    btn.style.borderColor = '';
    btn.style.color = '';
    delete btn.dataset.busy;
  }, 2000);
}

document.addEventListener('click', e => {
  const pay = e.target.closest('.inv-btn.pay');
  if (pay) { handlePay(pay); return; }
  const inv = e.target.closest('.inv-btn');
  if (inv) { handleInvoiceButton(inv); return; }
  const dl = e.target.closest('.fc-dl');
  if (dl) handleFileDownload(dl);
});

/* FILE UPLOAD */
const uploadBtn = document.getElementById('uploadBtn');
if (uploadBtn) {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);
  uploadBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toUpperCase().slice(0, 3);
    const size = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const card = document.createElement('div');
    card.className = 'file-card';
    card.innerHTML = `<div class="fc-icon" style="background:var(--vdim);color:var(--v3)">${esc(ext)}</div><div class="fc-info"><strong>${esc(file.name)}</strong><span>${size} · ${date}</span></div><button class="fc-dl">↓</button>`;
    document.querySelector('.files-grid').prepend(card);
    fileInput.value = '';
    showToast(`${file.name} uploaded`);
  });
}
