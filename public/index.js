/* CG Agency — index.js
   Fixed: Mobile touch, smooth scroll, services click,
          FAQ, testimonials, login, all buttons */

/* SMOOTH SCROLL UTILITY */
function scrollToSection(id) {
  const tgt = document.getElementById(id);
  if (!tgt) return;
  const navbar = document.getElementById('navbar');
  const offset = (navbar ? navbar.offsetHeight : 70) + 8;
  window.scrollTo({
    top: tgt.getBoundingClientRect().top + window.pageYOffset - offset,
    behavior: 'smooth'
  });
}
window.scrollToSection = scrollToSection;

/* LOADER */
const loader = document.getElementById('loader');
const ldProg = document.getElementById('ldProg');
const ldPct = document.getElementById('ldPct');
let pct = 0;
document.body.style.overflow = 'hidden';

const ldInt = setInterval(() => {
  pct += Math.random() * 12 + 4;
  if (pct >= 100) {
    pct = 100;
    clearInterval(ldInt);
    endLoad();
  }
  ldProg.style.width = pct + '%';
  ldPct.textContent = Math.floor(pct) + '%';
}, 90);

function endLoad() {
  setTimeout(() => {
    loader.classList.add('out');
    document.body.style.overflow = '';
    initAOS();
    initCounters();
    initCanvas();
    initHeroProgressBars();
  }, 400);
}

/* CURSOR */
const curOuter = document.getElementById('curOuter');
const curInner = document.getElementById('curInner');
let mx = 0, my = 0, ox = 0, oy = 0, cursorVisible = false;

const isMobile = /Android|iPhone|iPad|iPod|Touch/i.test(navigator.userAgent) || window.innerWidth < 1024;

if (!isMobile) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    curInner.style.left = mx + 'px';
    curInner.style.top = my + 'px';
    if (!cursorVisible) {
      cursorVisible = true;
    }
  });

  (function animOuter() {
    ox += (mx - ox) * 0.11;
    oy += (my - oy) * 0.11;
    curOuter.style.left = ox + 'px';
    curOuter.style.top = oy + 'px';
    requestAnimationFrame(animOuter);
  })();

  document.addEventListener('mousemove', () => {
    if (!curOuter.classList.contains('ready')) {
      curOuter.classList.add('ready');
      curInner.classList.add('ready');
    }
  }, { once: true });

  document.querySelectorAll('a, button, .pf-card, .svc-row, .bl-card, .tm-card, .tst-card, .price-card, .proc-card, .faq-q, .sb-item').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cur-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cur-hover'));
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.add('cur-click');
    setTimeout(() => document.body.classList.remove('cur-click'), 220);
  });
}

/* NAVBAR */
const navbar = document.getElementById('navbar');
const burger = document.getElementById('burger');
const mpanel = document.getElementById('mobilePanel');
const backTopBtn = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  if (backTopBtn) {
    const nearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 60;
    backTopBtn.classList.toggle('show', nearBottom);
  }
}, { passive: true });

if (backTopBtn) {
  backTopBtn.addEventListener('click', goTop);
  backTopBtn.addEventListener('touchend', e => { e.preventDefault(); goTop(); });
}

function goTop() {
  try { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  catch (e) { document.documentElement.scrollTop = 0; }
}

if (burger) {
  burger.addEventListener('click', () => {
    const open = mpanel.classList.toggle('open');
    burger.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
}

function closePanel() {
  if (mpanel) mpanel.classList.remove('open');
  if (burger) burger.classList.remove('active');
  document.body.style.overflow = '';
}

if (mpanel) {
  mpanel.querySelectorAll('a').forEach(a => a.addEventListener('click', closePanel));
}

document.addEventListener('click', e => {
  if (mpanel && burger && !mpanel.contains(e.target) && !burger.contains(e.target)) {
    closePanel();
  }
});

/* SMOOTH SCROLL — ALL ANCHOR LINKS */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const tgt = document.getElementById(id);
    if (!tgt) return;
    e.preventDefault();
    scrollToSection(id);
    closePanel();
  });
});

/* AOS */
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });
  els.forEach(el => io.observe(el));
}

/* COUNTERS */
function initCounters() {
  const els = document.querySelectorAll('.counter');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = parseInt(el.dataset.t), dur = 1800, s = performance.now();
      const tick = n => {
        const p = Math.min((n - s) / dur, 1), v = Math.floor((1 - Math.pow(1 - p, 3)) * end);
        el.textContent = v;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = end;
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}

/* HERO CANVAS */
function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const mouse = { x: -9999, y: -9999 };

  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  const hero = canvas.closest('.hero');
  if (hero && !isMobile) {
    hero.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    hero.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
  }

  const pts = Array.from({ length: isMobile ? 60 : 140 }, () => ({
    x: Math.random() * 1800, y: Math.random() * 1000,
    vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
    r: Math.random() * 1.8 + .3, a: Math.random() * .4 + .07
  }));

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.sqrt(dx * dx + dy * dy);
      if (d < 130) { p.x += dx / d * 1.6; p.y += dy / d * 1.6; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,199,106,${p.a})`; ctx.fill();
    });
    if (!isMobile) {
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(201,168,76,${.07 * (1 - d / 120)})`; ctx.lineWidth = .6; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  })();
}

/* HERO PROGRESS BARS */
function initHeroProgressBars() {
  setTimeout(() => {
    document.querySelectorAll('.hv-bar-fill').forEach((bar, i) => {
      setTimeout(() => bar.classList.add('animate'), i * 200);
    });
  }, 800);
}

/* WORD ROTATOR */
const rotEl = document.getElementById('rotWord');
const words = ['Extraordinary', 'Exceptional', 'Immersive', 'Unforgettable', 'Powerful', 'Visionary'];
let wIdx = 0;
if (rotEl) {
  setInterval(() => {
    rotEl.style.opacity = '0';
    rotEl.style.transform = 'translateY(-14px)';
    setTimeout(() => {
      wIdx = (wIdx + 1) % words.length;
      rotEl.textContent = words[wIdx];
      rotEl.style.transition = 'opacity .35s,transform .35s';
      rotEl.style.opacity = '1';
      rotEl.style.transform = 'translateY(0)';
    }, 340);
  }, 2800);
}

/* VIDEO PLAYER */
const playBtn = document.getElementById('playBtn');
const vpEmbed = document.getElementById('vpEmbed');
const vpThumb = document.getElementById('vpThumb');
const vpIframe = document.getElementById('vpIframe');

if (playBtn && vpEmbed && vpThumb && vpIframe) {
  function openVideo() {
    vpIframe.src = vpIframe.dataset.src;
    vpEmbed.classList.remove('hidden');
    vpThumb.style.opacity = '0';
    vpThumb.style.pointerEvents = 'none';
    vpThumb.style.transition = 'opacity .4s';
  }
  // Both click and touch
  playBtn.addEventListener('click', openVideo);
  playBtn.addEventListener('touchend', e => { e.preventDefault(); openVideo(); });
  vpThumb.addEventListener('click', openVideo);
  vpThumb.addEventListener('touchend', e => { e.preventDefault(); openVideo(); });
}

/* PORTFOLIO FILTER */
const pfBtns = document.querySelectorAll('.pf-btn');
const pfCards = document.querySelectorAll('.pf-card');
pfBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    pfBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.f;
    pfCards.forEach((c, i) => {
      c.style.transitionDelay = (i * .04) + 's';
      (f === 'all' || c.dataset.c === f) ? c.classList.remove('hide') : c.classList.add('hide');
    });
  });
});

/* PORTFOLIO MODAl */
const modal = document.getElementById('modal');
const modalBg = document.getElementById('modalBg');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalClient = document.getElementById('modalClient');
const modalYear = document.getElementById('modalYear');
const modalTag = document.getElementById('modalTag');
const modalDesc = document.getElementById('modalDesc');
const modalResults = document.getElementById('modalResults');
const modalStack = document.getElementById('modalStack');

pfCards.forEach(card => {
  const btn = card.querySelector('.pfc-btn');
  if (!btn) return;
  function openModal() {
    modalTitle.textContent = card.dataset.title || '';
    modalClient.textContent = card.dataset.client || '';
    modalYear.textContent = card.dataset.year || '';
    modalTag.textContent = card.dataset.tag || 'Case Study';
    modalDesc.textContent = card.dataset.desc || '';
    if (modalResults && card.dataset.results) {
      modalResults.innerHTML = card.dataset.results.split('·').map(r =>
        `<span class="modal-result-chip">${r.trim()}</span>`).join('');
    }
    if (modalStack && card.dataset.stack) {
      modalStack.innerHTML = card.dataset.stack.split('·').map(s =>
        `<span>${s.trim()}</span>`).join('');
    }
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  btn.addEventListener('click', e => { e.stopPropagation(); openModal(); });
  btn.addEventListener('touchend', e => { e.stopPropagation(); e.preventDefault(); openModal(); });
});

function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }
window.closeModal = closeModal;
if (modalBg) { modalBg.addEventListener('click', closeModal); modalBg.addEventListener('touchend', closeModal); }
if (modalClose) { modalClose.addEventListener('click', closeModal); modalClose.addEventListener('touchend', closeModal); }

/* TESTIMONIAL MODAL */
const tstModal = document.getElementById('tstModal');
const tstModalBg = document.getElementById('tstModalBg');
const tstModalClose = document.getElementById('tstModalClose');
const tstModalFull = document.getElementById('tstModalFull');
const tstModalAv = document.getElementById('tstModalAv');
const tstModalAuthor = document.getElementById('tstModalAuthor');
const tstModalRole = document.getElementById('tstModalRole');

document.querySelectorAll('.tst-clickable').forEach(card => {
  function openTst() {
    tstModalFull.textContent = '"' + card.dataset.full + '"';
    const initials = (card.dataset.author || '').split(' ').map(w => w[0]).join('').slice(0, 2);
    tstModalAv.textContent = initials;
    tstModalAuthor.textContent = card.dataset.author || '';
    tstModalRole.textContent = card.dataset.role || '';
    tstModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  card.addEventListener('click', openTst);
  card.addEventListener('touchend', e => { e.preventDefault(); openTst(); });
});

function closeTstModal() {
  if (tstModal) { tstModal.classList.remove('open'); document.body.style.overflow = ''; }
}
window.closeTstModal = closeTstModal;

if (tstModalBg) { tstModalBg.addEventListener('click', closeTstModal); tstModalBg.addEventListener('touchend', closeTstModal); }
if (tstModalClose) { tstModalClose.addEventListener('click', closeTstModal); tstModalClose.addEventListener('touchend', closeTstModal); }

/* BLOG ARTICLE MODAL */
const blogModal = document.getElementById('blogModal');
const blogModalBg = document.getElementById('blogModalBg');
const blogModalClose = document.getElementById('blogModalClose');
const blogModalCat = document.getElementById('blogModalCat');
const blogModalDate = document.getElementById('blogModalDate');
const blogModalTitle = document.getElementById('blogModalTitle');
const blogModalFull = document.getElementById('blogModalFull');

document.querySelectorAll('.bl-card').forEach(card => {
  const link = card.querySelector('.blc-link');
  if (!link) return;
  function openBlogModal() {
    const catEl = card.querySelector('.blc-cat');
    const dateEl = card.querySelector('.blc-date');
    const titleEl = card.querySelector('h3');
    blogModalCat.textContent = catEl ? catEl.textContent.trim() : 'Article';
    blogModalDate.textContent = dateEl ? dateEl.textContent.trim() : '';
    blogModalTitle.textContent = titleEl ? titleEl.textContent.trim() : '';
    blogModalFull.textContent = card.dataset.full || '';
    blogModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  link.addEventListener('click', e => { e.preventDefault(); openBlogModal(); });
  link.addEventListener('touchend', e => { e.preventDefault(); openBlogModal(); });
});

function closeBlogModal() { blogModal.classList.remove('open'); document.body.style.overflow = ''; }
window.closeBlogModal = closeBlogModal;
if (blogModalBg) { blogModalBg.addEventListener('click', closeBlogModal); blogModalBg.addEventListener('touchend', closeBlogModal); }
if (blogModalClose) { blogModalClose.addEventListener('click', closeBlogModal); blogModalClose.addEventListener('touchend', closeBlogModal); }

document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeTstModal(); closeBlogModal(); } });



/* SERVICES — CLICK/TOUCH ON MOBILE */
document.querySelectorAll('.svc-row').forEach(row => {
  const panel = row.querySelector('.svc-detail-panel');
  if (!panel) return;

  // Fill content from data attributes
  const txt = panel.querySelector('.sdp-text');
  const tagsEl = panel.querySelector('.sdp-tags');
  const s1 = panel.querySelector('.sdp-s1'), s1l = panel.querySelector('.sdp-s1l');
  const s2 = panel.querySelector('.sdp-s2'), s2l = panel.querySelector('.sdp-s2l');
  if (txt) txt.textContent = row.dataset.detail || '';
  if (tagsEl && row.dataset.tags) {
    tagsEl.innerHTML = row.dataset.tags.split('·').map(t =>
      `<span class="sdp-tag-item">${t.trim()}</span>`).join('');
  }
  if (s1) s1.textContent = row.dataset.stat1 || '';
  if (s1l) s1l.textContent = row.dataset.stat1Label || '';
  if (s2) s2.textContent = row.dataset.stat2 || '';
  if (s2l) s2l.textContent = row.dataset.stat2Label || '';

  // Mobile: toggle on touch/click
  row.addEventListener('click', () => {
    const isOpen = row.classList.contains('svc-open');
    document.querySelectorAll('.svc-row').forEach(r => r.classList.remove('svc-open'));
    if (!isOpen) row.classList.add('svc-open');
  });
});

/*  FAQ ACCORDION — FIXED FOR MOBILE  */
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  if (!q) return;

  function toggleFaq() {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  }

  q.addEventListener('click', toggleFaq);
  q.addEventListener('touchend', e => { e.preventDefault(); toggleFaq(); });
});

/*  STATS BANNER 3D TILT (desktop only)  */
if (!isMobile) {
  document.querySelectorAll('.sb-item').forEach(item => {
    item.addEventListener('mousemove', e => {
      const r = item.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / (r.width / 2) * 8;
      const y = (e.clientY - r.top - r.height / 2) / (r.height / 2) * 8;
      item.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-4px)`;
    });
    item.addEventListener('mouseleave', () => { item.style.transform = ''; });
  });

  document.querySelectorAll('.tm-card, .tst-card, .price-card, .proc-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / (r.width / 2) * 6;
      const y = (e.clientY - r.top - r.height / 2) / (r.height / 2) * 6;
      card.style.transform = `perspective(700px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/*  CONTACT FORM  */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('cfName').value.trim();
    const email = document.getElementById('cfEmail').value.trim();
    const subject = document.getElementById('cfSubject').value.trim();
    const budget = document.getElementById('cfBudget').value;
    const msg = document.getElementById('cfMsg').value.trim();
    const res = document.getElementById('cfRes');
    const btn = e.target.querySelector('.cf-btn');
    if (!name || !email || !msg) { res.textContent = '⚠ Fill in all required fields.'; res.style.color = '#e07b5a'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { res.textContent = '⚠ Enter a valid email.'; res.style.color = '#e07b5a'; return; }
    const orig = btn.innerHTML; btn.disabled = true; btn.innerHTML = '<span>Sending…</span>';
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, subject, budget, message: msg }) });
      const data = await r.json();
      res.textContent = data.success ? `✓ ${data.message}` : '⚠ ' + data.message;
      res.style.color = data.success ? '#e8c76a' : '#e07b5a';
      if (data.success) e.target.reset();
    } catch {
      res.textContent = `✓ Thanks ${name}! We'll reply within 4 hours.`;
      res.style.color = '#e8c76a';
      e.target.reset();
    }
    btn.innerHTML = orig; btn.disabled = false;
    setTimeout(() => res.textContent = '', 7000);
  });
}

/*  CHATBOT  */
const cbToggle = document.getElementById('cbToggle');
const cbClose = document.getElementById('cbClose');
const cbInput = document.getElementById('cbInput');
const cbSend = document.getElementById('cbSend');
const cbMessages = document.getElementById('cbMessages');
const cbBadge = document.getElementById('cbBadge');
const chatbot = document.getElementById('chatbot');
const sessionId = 'sess_' + Math.random().toString(36).slice(2);
let isSending = false;

const botResp = {
  services: ["We offer Brand Strategy, UI/UX Design, Web Dev, Digital Marketing, SEO, and Motion Design. Which one interests you? 🎨"],
  pricing: ["Projects from $1,500 up to $50,000+. Share your project for a custom quote! 💬"],
  project: ["Fill out our contact form or email mdsaidulislamratin967@gmail.com — we reply within 4 hours! ⚡"],
  contact: ["Email: mdsaidulislamratin967@gmail.com | Phone: +880 1407-948498 | Bangladesh & Remote 🌍"],
  portfolio: ["240+ projects across branding, web, and marketing. Click any card to read case studies! ✨"],
  team: ["Jane Doe (Creative Director), John Smith (Lead Designer), Emily Clark (Strategy Director) 👥"],
  hello: ["Hello! 👋 Welcome to CG Agency. How can I help you today?"],
  thanks: ["You're welcome! 😊 Anything else I can help with?"],
  default: ["Great question! Email mdsaidulislamratin967@gmail.com for detailed answers. 🚀"]
};
const lastUsed = {};

function getReply(cat) {
  const arr = botResp[cat] || botResp.default;
  if (!(cat in lastUsed)) lastUsed[cat] = 0;
  const r = arr[lastUsed[cat] % arr.length];
  lastUsed[cat]++;
  return r;
}

function classify(msg) {
  const m = msg.toLowerCase();
  if (m.match(/service|what do|offer/)) return 'services';
  if (m.match(/price|cost|much|budget|rate/)) return 'pricing';
  if (m.match(/start|project|hire|work with/)) return 'project';
  if (m.match(/contact|email|phone|reach/)) return 'contact';
  if (m.match(/portfolio|work|case|example/)) return 'portfolio';
  if (m.match(/team|who|staff|people/)) return 'team';
  if (m.match(/^(hi|hello|hey|sup|yo)/)) return 'hello';
  if (m.match(/thank|thanks|great|awesome/)) return 'thanks';
  return 'default';
}

function addMsg(text, type) {
  const d = document.createElement('div');
  d.className = 'cb-msg ' + type;
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  d.innerHTML = `<div class="cb-bubble">${text}</div><div class="cb-time">${now}</div>`;
  cbMessages.appendChild(d);
  cbMessages.scrollTop = cbMessages.scrollHeight;
}

function showTyping() {
  const t = document.createElement('div');
  t.className = 'cb-typing show';
  t.innerHTML = '<span></span><span></span><span></span>';
  cbMessages.appendChild(t);
  cbMessages.scrollTop = cbMessages.scrollHeight;
  return t;
}

async function sendMsg() {
  const text = cbInput.value.trim();
  if (!text || isSending) return;
  isSending = true; cbInput.value = ''; cbSend.disabled = true;
  addMsg(text, 'user');
  const typing = showTyping();
  let reply;
  try {
    const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, sessionId }) });
    if (r.ok) { const data = await r.json(); reply = data.reply; await new Promise(r => setTimeout(r, 350)); }
    else throw 0;
  } catch {
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    reply = getReply(classify(text));
  }
  typing.remove(); addMsg(reply, 'bot'); isSending = false; cbSend.disabled = false;
  if (!isMobile) cbInput.focus();
}

if (cbToggle) {
  cbToggle.addEventListener('click', () => {
    chatbot.classList.toggle('open');
    cbBadge.classList.add('hidden');
    if (chatbot.classList.contains('open') && !isMobile) setTimeout(() => cbInput.focus(), 420);
  });
  cbToggle.addEventListener('touchend', e => {
    e.preventDefault();
    chatbot.classList.toggle('open');
    cbBadge.classList.add('hidden');
  });
}
if (cbClose) {
  cbClose.addEventListener('click', () => chatbot.classList.remove('open'));
  cbClose.addEventListener('touchend', e => { e.preventDefault(); chatbot.classList.remove('open'); });
}
if (cbSend) { cbSend.addEventListener('click', sendMsg); cbSend.addEventListener('touchend', e => { e.preventDefault(); sendMsg(); }); }
if (cbInput) cbInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });
document.querySelectorAll('.cb-qr').forEach(btn => {
  btn.addEventListener('click', () => { cbInput.value = btn.dataset.msg; btn.closest('.cb-quick-replies').remove(); sendMsg(); });
});

/*  SCROLL PROGRESS BAR */
const progressBar = document.createElement('div');
progressBar.id = 'scrollProgressBar';
document.body.appendChild(progressBar);
window.addEventListener('scroll', () => {
  const s = document.documentElement.scrollTop;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (s / h * 100) + '%';
}, { passive: true });
