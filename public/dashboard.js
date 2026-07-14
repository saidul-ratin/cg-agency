/* CG Agency — dashboard.js
   Dashboard: Section Switching, Sidebar, Greeting, Counters,
   Progress Bars, Charts, Messages, Notifications, Search,
   Project Modal, Settings, Invoices, File Upload, Logout */

/* SECTION SWITCHING */
function switchSection(id) {
  document.querySelectorAll('.sbn').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.ds-section').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById('sec-' + id);
  if (sec) sec.classList.add('active');
  const nav = document.querySelector(`.sbn[data-section="${id}"]`);
  if (nav) nav.classList.add('active');
  document.getElementById('sidebar').classList.remove('open');
}
window.switchSection = switchSection;

document.querySelectorAll('.sbn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    switchSection(btn.dataset.section);
  });
});

/* SIDEBAR TOGGLE */
const sbToggle = document.getElementById('sbToggle');
const sidebar = document.getElementById('sidebar');
if (sbToggle) {
  sbToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!sidebar.contains(e.target) && !sbToggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

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

/*  PROGRESS BARS */
setTimeout(() => {
  document.querySelectorAll('.pip-bar, .pcp-bar').forEach(bar => {
    const w = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => {
      bar.style.width = w;
    }, 100);
  });
}, 300);

/* ANALYTICS CHART */
const chartEl = document.getElementById('trafficChart');
if (chartEl) {
  const data = [30, 45, 35, 60, 50, 75, 65, 80, 72, 90, 85, 95];
  const max = Math.max(...data);
  const cols = ['#c9a84c', '#e8c76a', '#a8863a'];
  chartEl.innerHTML = data.map((v, i) => {
    const h = Math.round((v / max) * 72);
    return `<div style="flex:1;height:${h}px;background:${cols[i % 3]};border-radius:3px 3px 0 0;opacity:${.45 + i * .05};transition:height .8s ${i * .05}s ease"></div>`;
  }).join('');
}

/* MESSAGES */
const mcInput = document.getElementById('mcInput');
const mcSend = document.getElementById('mcSend');
const mcMsgs = document.getElementById('mcMessages');

const contactHistory = {
  'Jane Doe': [{
    type: 'them',
    text: "Hi! The logo options are ready for your review. I've uploaded 3 concepts to the files section.",
    time: '2:30 PM'
  }, {
    type: 'them',
    text: "Let me know which direction feels right 🎨",
    time: '2:31 PM'
  }, {
    type: 'me',
    text: "These look amazing! I'm leaning towards concept 2. Can we make the font slightly bolder?",
    time: '3:15 PM'
  }, {
    type: 'them',
    text: "Absolutely! I'll have the updated version ready by tomorrow morning.",
    time: '3:20 PM'
  }, ],
  'John Smith': [{
    type: 'them',
    text: "Hey! All wireframes have been uploaded to the files section.",
    time: '9:00 AM'
  }, {
    type: 'them',
    text: "Let me know if you need any revisions on the homepage layout.",
    time: '9:01 AM'
  }, ],
  'Emily Clark': [{
    type: 'them',
    text: "Hi there! Your Q2 campaign report is ready for review.",
    time: 'Yesterday'
  }, {
    type: 'them',
    text: "Overall performance was up 41% vs last month 🎉",
    time: 'Yesterday'
  }, ],
  'CG Agency Team': [{
    type: 'them',
    text: "Welcome to your CG Agency client portal! 🎉 We're excited to work with you.",
    time: '3d ago'
  }, {
    type: 'them',
    text: "Here you can track projects, view files, pay invoices, and message your team.",
    time: '3d ago'
  }, ]
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
    el.innerHTML = `<div class="mc-bubble">${m.text}</div><span>${m.time}</span>`;
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
    const init = item.dataset.init;
    document.getElementById('mcHeadName').textContent = currentContact;
    document.getElementById('mcHeadAv').textContent = init;
    const statusMap = {
      'Jane Doe': 'Creative Director · Online',
      'John Smith': 'Lead Designer · Away',
      'Emily Clark': 'Strategy Director · Online',
      'CG Agency Team': 'Support Team · Online'
    };
    document.getElementById('mcHeadStatus').textContent = statusMap[currentContact] || 'Online';
    renderMessages(currentContact);
  });
});
renderMessages(currentContact);

let isMsgSending = false;

function sendChatMsg() {
  const text = mcInput.value.trim();
  if (!text || isMsgSending) return;
  isMsgSending = true;

  const now = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  if (!contactHistory[currentContact]) contactHistory[currentContact] = [];
  contactHistory[currentContact].push({
    type: 'me',
    text,
    time: now
  });
  mcInput.value = '';
  renderMessages(currentContact);

  const typing = document.createElement('div');
  typing.className = 'mc-typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  mcMsgs.appendChild(typing);
  mcMsgs.scrollTop = mcMsgs.scrollHeight;

  const delay = 900 + Math.random() * 700;
  setTimeout(() => {
    typing.remove();
    const reply = getAutoReply(currentContact);
    const replyTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    contactHistory[currentContact].push({
      type: 'them',
      text: reply,
      time: replyTime
    });
    renderMessages(currentContact);
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
    <div class="np-item"><div class="np-dot" style="background:var(--v3)"></div><div><p>Logo draft uploaded by Jane D.</p><span>2 hours ago</span></div></div>
    <div class="np-item"><div class="np-dot" style="background:var(--blue)"></div><div><p>Homepage wireframe approved</p><span>5 hours ago</span></div></div>
    <div class="np-item"><div class="np-dot" style="background:var(--coral)"></div><div><p>Invoice #INV-2026-09 is pending</p><span>Yesterday</span></div></div>
    <div class="np-item"><div class="np-dot" style="background:var(--gold)"></div><div><p>New message from Emily C.</p><span>2 days ago</span></div></div>`;
  notifBtn.style.position = 'relative';
  notifBtn.appendChild(panel);
  notifBtn.addEventListener('click', e => {
    e.stopPropagation();
    panel.classList.toggle('open');
    const dot = notifBtn.querySelector('.notif-dot');
    if (dot) dot.style.display = 'none';
  });
  document.addEventListener('click', () => panel.classList.remove('open'));
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
const closeProjModal = document.getElementById('closeProjModal');
const createProjBtn = document.getElementById('createProjectBtn');

if (newProjectBtn) newProjectBtn.addEventListener('click', () => projModal.classList.add('open'));
if (closeProjModal) closeProjModal.addEventListener('click', () => projModal.classList.remove('open'));
if (projModal) projModal.addEventListener('click', e => {
  if (e.target === projModal) projModal.classList.remove('open');
});

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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          due,
          status
        })
      });
    } catch {}

    const colors = {
      active: 'var(--v3)',
      review: 'var(--gold)',
      done: 'var(--green)'
    };
    const card = document.createElement('div');
    card.className = 'pcard';
    card.innerHTML = `
      <div class="pcard-top">
        <span class="pcard-status ${status}">${status.charAt(0).toUpperCase()+status.slice(1)}</span>
        <span class="pcard-date">${due ? 'Due '+due : 'TBD'}</span>
      </div>
      <h3>${title}</h3>
      <p>New project — add description and team members.</p>
      <div class="pcard-prog"><div class="pcp-bar" style="width:0%;background:${colors[status]||'var(--v3)'}"></div></div>
      <div class="pcard-foot"><span>0% complete</span><div class="pcard-team"><div class="pt-av">ME</div></div></div>`;
    const grid = document.getElementById('projCards');
    if (grid) grid.prepend(card);

    msg.textContent = '✓ Project created!';
    msg.style.color = '#7ec8a0';
    setTimeout(() => {
      projModal.classList.remove('open');
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          company
        })
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

const savePw = document.getElementById('savePw');
if (savePw) {
  savePw.addEventListener('click', () => {
    const cur = document.getElementById('curPw').value.trim();
    const nw = document.getElementById('newPw').value.trim();
    const msg = document.getElementById('savePwMsg');
    if (!cur || !nw) {
      msg.textContent = '⚠ Fill in both fields.';
      msg.style.color = '#ff6b4a';
      return;
    }
    if (nw.length < 8) {
      msg.textContent = '⚠ Password must be at least 8 characters.';
      msg.style.color = '#ff6b4a';
      return;
    }
    msg.textContent = '✓ Password updated!';
    msg.style.color = '#e8c76a';
    document.getElementById('curPw').value = '';
    document.getElementById('newPw').value = '';
    setTimeout(() => msg.textContent = '', 2500);
  });
}

/* INVOICE PAY */
document.querySelectorAll('.inv-btn.pay').forEach(btn => {
  btn.addEventListener('click', async () => {
    btn.textContent = 'Processing…';
    btn.disabled = true;
    await new Promise(r => setTimeout(r, 1200));
    const row = btn.closest('.it-row');
    const status = row.querySelector('.inv-pending');
    if (status) {
      status.textContent = 'Paid';
      status.className = 'inv-paid';
    }
    btn.textContent = 'Download';
    btn.className = 'inv-btn';
    btn.disabled = false;
  });
});

/* FILE DOWNLOAD (demo) */
document.querySelectorAll('.fc-dl').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.closest('.file-card').querySelector('strong').textContent;
    btn.textContent = '✓';
    btn.style.borderColor = 'var(--green)';
    btn.style.color = 'var(--green)';
    setTimeout(() => {
      btn.textContent = '↓';
      btn.style.borderColor = '';
      btn.style.color = '';
    }, 2000);
  });
});

/* FILE UPLOAD (demo) */
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
    const date = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const card = document.createElement('div');
    card.className = 'file-card';
    card.innerHTML = `<div class="fc-icon" style="background:var(--vdim);color:var(--v3)">${ext}</div><div class="fc-info"><strong>${file.name}</strong><span>${size} · ${date}</span></div><button class="fc-dl">↓</button>`;
    document.querySelector('.files-grid').prepend(card);
    fileInput.value = '';
  });
}

/*  LOGOUT */
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async e => {
    e.preventDefault();
    try {
      await fetch('/api/auth/logout', {
        method: 'POST'
      });
    } catch {}
    sessionStorage.removeItem('cg_user');
    sessionStorage.removeItem('cg_token');
    location.href = 'login.html';
  });
}
