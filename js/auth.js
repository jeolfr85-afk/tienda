async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

function getRegisteredUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
}

function saveRegisteredUser(user) {
  const users = getRegisteredUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function findUserByEmail(email, password) {
  const normalizedEmail = email.toLowerCase();

  const demo = demoUsers.find(u =>
    (u.email?.toLowerCase() === normalizedEmail || u.usuario === email) &&
    u.password === password
  );
  if (demo) return { ...demo, source: 'demo' };

  const registered = getRegisteredUsers().find(u => u.email.toLowerCase() === normalizedEmail);
  if (!registered) return null;

  if (registered.passwordHash) {
    return hashPassword(password).then(hash =>
      hash === registered.passwordHash ? { ...registered, source: 'registered' } : null
    );
  }

  if (registered.password === password) {
    return Promise.resolve({ ...registered, source: 'registered' });
  }

  return Promise.resolve(null);
}

function emailExists(email) {
  const normalizedEmail = email.toLowerCase();
  if (demoUsers.some(u => u.email?.toLowerCase() === normalizedEmail)) return true;
  return getRegisteredUsers().some(u => u.email.toLowerCase() === normalizedEmail);
}

function login(email, password) {
  return findUserByEmail(email, password);
}

async function register(datos) {
  const { password, nombre, email } = datos;
  const normalizedEmail = email.toLowerCase();

  if (emailExists(normalizedEmail)) {
    return { success: false, error: 'Este correo electrónico ya está registrado' };
  }

  const passwordHash = await hashPassword(password);
  const newUser = {
    email: normalizedEmail,
    passwordHash,
    nombre
  };

  saveRegisteredUser(newUser);
  return { success: true, user: newUser };
}

function createSession(user) {
  const session = {
    email: user.email || '',
    nombre: user.nombre,
    usuario: user.email || user.usuario || ''
  };
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  return session;
}

async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector('#login-email').value.trim();
  const password = form.querySelector('#login-pass').value;
  const errorEl = document.getElementById('login-error');

  errorEl.classList.remove('visible');
  errorEl.textContent = '';

  if (!email || !password) {
    errorEl.textContent = 'Completa todos los campos';
    errorEl.classList.add('visible');
    return;
  }

  if (!isValidEmail(email)) {
    errorEl.textContent = 'Ingresa un correo electrónico válido';
    errorEl.classList.add('visible');
    return;
  }

  const user = await findUserByEmail(email, password);
  if (!user) {
    errorEl.textContent = 'Correo o contraseña incorrectos';
    errorEl.classList.add('visible');
    return;
  }

  createSession(user);
  showToast(`¡Bienvenido, ${user.nombre}!`, 'success');

  const redirect = getQueryParam('redirect') || 'index.html';
  setTimeout(() => window.location.href = redirect, 500);
}

async function handleRegister(e) {
  e.preventDefault();
  const form = e.target;
  const nombre = form.querySelector('#reg-name').value.trim();
  const email = form.querySelector('#reg-email').value.trim();
  const password = form.querySelector('#reg-pass').value;
  const confirm = form.querySelector('#reg-confirm').value;
  const errorEl = document.getElementById('register-error');

  errorEl.classList.remove('visible');
  errorEl.textContent = '';

  if (!nombre || !email || !password || !confirm) {
    errorEl.textContent = 'Completa todos los campos';
    errorEl.classList.add('visible');
    return;
  }

  if (!isValidEmail(email)) {
    errorEl.textContent = 'Ingresa un correo electrónico válido';
    errorEl.classList.add('visible');
    return;
  }

  if (password.length < 6) {
    errorEl.textContent = 'La contraseña debe tener al menos 6 caracteres';
    errorEl.classList.add('visible');
    return;
  }

  if (password !== confirm) {
    errorEl.textContent = 'Las contraseñas no coinciden';
    errorEl.classList.add('visible');
    return;
  }

  const result = await register({ nombre, email, password });
  if (!result.success) {
    errorEl.textContent = result.error;
    errorEl.classList.add('visible');
    return;
  }

  createSession(result.user);
  showToast('¡Cuenta creada exitosamente!', 'success');
  const redirect = getQueryParam('redirect') || 'index.html';
  setTimeout(() => window.location.href = redirect, 500);
}

function initAuthTabs() {
  const tabs = document.querySelectorAll('.auth-tab');
  const panels = document.querySelectorAll('.auth-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`panel-${target}`)?.classList.add('active');
    });
  });
}

async function initAuthPage() {
  await loadDemoUsers();
  initAuthTabs();

  if (getSession()) {
    const redirect = getQueryParam('redirect') || 'index.html';
    window.location.href = redirect;
    return;
  }

  document.getElementById('login-form')?.addEventListener('submit', handleLogin);
  document.getElementById('register-form')?.addEventListener('submit', handleRegister);

  const message = getQueryParam('message');
  if (message) {
    showToast(decodeURIComponent(message), 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('login-form')) {
    initAuthPage();
  }
});
