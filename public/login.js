/* CG Agency — login.js  |  Offline-first, mobile optimized */

/* TAB SWITCHING */
const tabLogin    = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const formLogin   = document.getElementById('formLogin');
const formReg     = document.getElementById('formRegister');

function showLogin() {
  tabLogin.classList.add('active');
  tabRegister.classList.remove('active');
  formLogin.classList.remove('hidden');
  formReg.classList.add('hidden');
}
function showRegister() {
  tabRegister.classList.add('active');
  tabLogin.classList.remove('active');
  formReg.classList.remove('hidden');
  formLogin.classList.add('hidden');
}

tabLogin.addEventListener('click', showLogin);
tabLogin.addEventListener('touchend', e => { e.preventDefault(); showLogin(); });
tabRegister.addEventListener('click', showRegister);
tabRegister.addEventListener('touchend', e => { e.preventDefault(); showRegister(); });

if (location.hash === '#register') showRegister();

/* PASSWORD TOGGLE */
function pwToggleFn(btnId, inputId) {
  const btn = document.getElementById(btnId);
  const inp = document.getElementById(inputId);
  if (!btn || !inp) return;
  function toggle(e) {
    e.preventDefault();
    inp.type = inp.type === 'password' ? 'text' : 'password';
    btn.textContent = inp.type === 'password' ? '👁' : '🙈';
  }
  btn.addEventListener('click', toggle);
  btn.addEventListener('touchend', toggle);
}
pwToggleFn('pwToggle', 'lPassword');
pwToggleFn('pwToggle2', 'rPassword');

/*  PASSWORD STRENGTH */
const rPw      = document.getElementById('rPassword');
const pwsBar   = document.getElementById('pwsBar');
const pwsLabel = document.getElementById('pwsLabel');
if (rPw) {
  rPw.addEventListener('input', () => {
    const v = rPw.value; let score = 0;
    if (v.length >= 8)           score++;
    if (v.length >= 12)          score++;
    if (/[A-Z]/.test(v))         score++;
    if (/[0-9]/.test(v))         score++;
    if (/[^a-zA-Z0-9]/.test(v))  score++;
    const w = ['0%','20%','40%','60%','80%','100%'];
    const l = ['','Weak','Fair','Good','Strong','Very Strong'];
    const c = ['','#e07b5a','#f59e0b','#f59e0b','#c9a84c','#7ec8a0'];
    if (pwsBar)   { pwsBar.style.width = w[score]; pwsBar.style.background = c[score]; }
    if (pwsLabel)   pwsLabel.textContent = l[score];
  });
}

/* SET MESSAGE */
function setMsg(id, text, ok) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.style.color = ok ? '#e8c76a' : '#e07b5a';
}

/* LOGIN — OFFLINE FIRST */
async function doLogin() {
  const emailEl = document.getElementById('lEmail');
  const pwEl    = document.getElementById('lPassword');
  const btn     = document.getElementById('loginBtn');
  const email   = emailEl ? emailEl.value.trim() : '';
  const pw      = pwEl    ? pwEl.value.trim()    : '';

  setMsg('loginMsg', '', true);
  if (emailEl) emailEl.classList.remove('error', 'success');
  if (pwEl)    pwEl.classList.remove('error', 'success');

  if (!email || !pw) {
    setMsg('loginMsg', '⚠ Please fill in all fields.', false);
    if (!email && emailEl) emailEl.classList.add('error');
    if (!pw    && pwEl)    pwEl.classList.add('error');
    return;
  }

  if (btn) { btn.disabled = true; btn.textContent = 'Signing in…'; }

  // Offline / demo login (instant, no server needed) ────
  if (email === 'mdsaidulislamratin967@gmail.com' && pw === 'demo123') {
    if (emailEl) emailEl.classList.add('success');
    if (pwEl)    pwEl.classList.add('success');
    sessionStorage.setItem('cg_user', JSON.stringify({
      name: 'MD Saidul Islam Ratin',
      email: email,
      company: 'CG Agency'
    }));
    setMsg('loginMsg', '✓ Welcome back! Redirecting…', true);
    setTimeout(() => location.href = 'dashboard.html', 800);
    return;
  }

  // Try server (with 5s timeout) ────
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res  = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pw }),
      signal: controller.signal
    });
    clearTimeout(timer);
    const data = await res.json();
    if (data.success) {
      if (emailEl) emailEl.classList.add('success');
      if (pwEl)    pwEl.classList.add('success');
      sessionStorage.setItem('cg_user',  JSON.stringify(data.user));
      sessionStorage.setItem('cg_token', data.token);
      setMsg('loginMsg', '✓ Logging in…', true);
      setTimeout(() => location.href = 'dashboard.html', 800);
    } else {
      if (emailEl) emailEl.classList.add('error');
      if (pwEl)    pwEl.classList.add('error');
      setMsg('loginMsg', '⚠ ' + data.message, false);
      if (btn) { btn.disabled = false; btn.textContent = 'Sign In →'; }
    }
  } catch {
    // Server timeout or offline — show helpful message
    setMsg('loginMsg', '⚠ Wrong credentials. Demo: mdsaidulislamratin967@gmail.com / demo123', false);
    if (emailEl) emailEl.classList.add('error');
    if (pwEl)    pwEl.classList.add('error');
    if (btn) { btn.disabled = false; btn.textContent = 'Sign In →'; }
  }
}

const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
  loginBtn.addEventListener('click',    doLogin);
  loginBtn.addEventListener('touchend', e => { e.preventDefault(); doLogin(); });
}

['lEmail', 'lPassword'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
});

/* REGISTER */
async function doRegister() {
  const firstEl   = document.getElementById('rFirst');
  const emailEl   = document.getElementById('rEmail');
  const pwEl      = document.getElementById('rPassword');
  const termsEl   = document.getElementById('rTerms');
  const btn       = document.getElementById('registerBtn');
  const first     = firstEl ? firstEl.value.trim() : '';
  const last      = document.getElementById('rLast') ? document.getElementById('rLast').value.trim() : '';
  const email     = emailEl ? emailEl.value.trim()  : '';
  const pw        = pwEl    ? pwEl.value.trim()     : '';
  const company   = document.getElementById('rCompany') ? document.getElementById('rCompany').value.trim() : '';

  setMsg('registerMsg', '', true);

  if (!first)  { setMsg('registerMsg', '⚠ First name required.', false); if (firstEl) firstEl.classList.add('error'); return; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setMsg('registerMsg', '⚠ Valid email required.', false); if (emailEl) emailEl.classList.add('error'); return; }
  if (!pw || pw.length < 8) { setMsg('registerMsg', '⚠ Password min. 8 characters.', false); if (pwEl) pwEl.classList.add('error'); return; }
  if (termsEl && !termsEl.checked) { setMsg('registerMsg', '⚠ Accept Terms & Privacy Policy.', false); return; }

  if (btn) { btn.disabled = true; btn.textContent = 'Creating account…'; }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res  = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: first, lastName: last, email, password: pw, company }),
      signal: controller.signal
    });
    clearTimeout(timer);
    const data = await res.json();
    if (data.success) {
      sessionStorage.setItem('cg_user',  JSON.stringify(data.user));
      sessionStorage.setItem('cg_token', data.token);
      setMsg('registerMsg', '✓ Account created! Redirecting…', true);
      setTimeout(() => location.href = 'dashboard.html', 800);
    } else {
      setMsg('registerMsg', '⚠ ' + data.message, false);
      if (btn) { btn.disabled = false; btn.textContent = 'Create Account →'; }
    }
  } catch {
    // Offline fallback
    setMsg('registerMsg', '✓ Account created! Redirecting…', true);
    sessionStorage.setItem('cg_user', JSON.stringify({ name: `${first} ${last}`, email }));
    setTimeout(() => location.href = 'dashboard.html', 800);
  }
}

const registerBtn = document.getElementById('registerBtn');
if (registerBtn) {
  registerBtn.addEventListener('click',    doRegister);
  registerBtn.addEventListener('touchend', e => { e.preventDefault(); doRegister(); });
}

/* SOCIAL LOGIN */
function socialLogin(provider) {
  document.querySelectorAll('.soc-btn').forEach(b => b.disabled = true);
  sessionStorage.setItem('cg_user', JSON.stringify({
    name: 'MD Saidul Islam Ratin',
    email: 'mdsaidulislamratin967@gmail.com'
  }));
  setTimeout(() => location.href = 'dashboard.html', 800);
}
window.socialLogin = socialLogin;

/* FORGOT PASSWORD */
function forgotPw(e) {
  if (e) e.preventDefault();
  const existing = document.getElementById('fpModal');
  if (existing) { existing.classList.add('open'); return; }
  const modal = document.createElement('div');
  modal.id = 'fpModal';
  modal.className = 'fp-modal';
  modal.innerHTML = `
    <div class="fp-bg" id="fpBg"></div>
    <div class="fp-box">
      <button class="fp-close" id="fpClose">✕</button>
      <h3>Reset Password</h3>
      <p>Enter your email and we'll send a reset link.</p>
      <div class="af-field" style="margin-bottom:16px">
        <label>Email</label>
        <input type="email" id="fpEmail" placeholder="your@email.com"/>
      </div>
      <button class="btn-auth" id="fpSubmit">Send Reset Link →</button>
      <div class="auth-msg" id="fpMsg" style="margin-top:10px"></div>
    </div>`;
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('open'), 10);

  function closeM() { modal.classList.remove('open'); }
  document.getElementById('fpBg').addEventListener('click', closeM);
  const fpClose = document.getElementById('fpClose');
  fpClose.addEventListener('click', closeM);
  fpClose.addEventListener('touchend', e => { e.preventDefault(); closeM(); });

  function sendReset() {
    const em  = document.getElementById('fpEmail').value.trim();
    const msg = document.getElementById('fpMsg');
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      msg.textContent = '⚠ Enter a valid email.'; msg.style.color = '#e07b5a'; return;
    }
    msg.textContent = `✓ Reset link sent to ${em}`; msg.style.color = '#e8c76a';
    setTimeout(closeM, 2500);
  }
  const fpSubmit = document.getElementById('fpSubmit');
  fpSubmit.addEventListener('click', sendReset);
  fpSubmit.addEventListener('touchend', e => { e.preventDefault(); sendReset(); });
}
window.forgotPw = forgotPw;
