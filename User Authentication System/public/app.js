// User Authentication System Client
const API_BASE = window.location.origin;

// State
let currentToken = localStorage.getItem('auth_token') || null;
let currentUser = null;

// DOM Elements
const statusIndicator = document.getElementById('api-status');
const alertBanner = document.getElementById('alert-banner');

const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const tabDashboard = document.getElementById('tab-dashboard');

const viewLogin = document.getElementById('view-login');
const viewRegister = document.getElementById('view-register');
const viewDashboard = document.getElementById('view-dashboard');

const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');

const gotoRegister = document.getElementById('goto-register');
const gotoLogin = document.getElementById('goto-login');

const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const userRoleBadge = document.getElementById('user-role-badge');
const userId = document.getElementById('user-id');
const userCreated = document.getElementById('user-created');
const userTokenPreview = document.getElementById('user-token-preview');

const btnTestAdmin = document.getElementById('btn-test-admin');
const adminResult = document.getElementById('admin-result');
const btnLogout = document.getElementById('btn-logout');

// Check API Health
async function checkApiHealth() {
  try {
    const res = await fetch(`${API_BASE}/`);
    const data = await res.json();
    if (data.success) {
      statusIndicator.textContent = 'API Online (Port ' + (window.location.port || '80') + ')';
      statusIndicator.classList.add('online');
    }
  } catch (err) {
    statusIndicator.textContent = 'API Offline';
    statusIndicator.classList.remove('online');
  }
}

// Show Alert
function showAlert(message, type = 'error') {
  alertBanner.textContent = message;
  alertBanner.className = `alert ${type}`;
  alertBanner.classList.remove('hidden');
}

function clearAlert() {
  alertBanner.textContent = '';
  alertBanner.className = 'alert hidden';
}

// Tab Switching
function switchTab(target) {
  clearAlert();
  [tabLogin, tabRegister, tabDashboard].forEach((tab) => {
    tab.classList.remove('active');
    tab.setAttribute('aria-selected', 'false');
  });

  [viewLogin, viewRegister, viewDashboard].forEach((view) => {
    view.hidden = true;
    view.classList.remove('active');
  });

  if (target === 'login') {
    tabLogin.classList.add('active');
    tabLogin.setAttribute('aria-selected', 'true');
    viewLogin.hidden = false;
    viewLogin.classList.add('active');
  } else if (target === 'register') {
    tabRegister.classList.add('active');
    tabRegister.setAttribute('aria-selected', 'true');
    viewRegister.hidden = false;
    viewRegister.classList.add('active');
  } else if (target === 'dashboard') {
    tabDashboard.classList.remove('hidden');
    tabDashboard.classList.add('active');
    tabDashboard.setAttribute('aria-selected', 'true');
    viewDashboard.hidden = false;
    viewDashboard.classList.add('active');
  }
}

// Toggle password visibility
document.querySelectorAll('.btn-toggle-pw').forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const input = document.getElementById(targetId);
    if (input.type === 'password') {
      input.type = 'text';
      btn.textContent = 'Hide';
    } else {
      input.type = 'password';
      btn.textContent = 'Show';
    }
  });
});

// Switch links
gotoRegister.addEventListener('click', () => switchTab('register'));
gotoLogin.addEventListener('click', () => switchTab('login'));
tabLogin.addEventListener('click', () => switchTab('login'));
tabRegister.addEventListener('click', () => switchTab('register'));
tabDashboard.addEventListener('click', () => switchTab('dashboard'));

// Register Handler
formRegister.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAlert();

  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;

  if (!name || !email || !password) {
    showAlert('Please fill in all required fields.', 'error');
    return;
  }
  if (password.length < 6) {
    showAlert('Password must be at least 6 characters long.', 'error');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      showAlert(data.message || 'Registration failed.', 'error');
      return;
    }

    formRegister.reset();
    showAlert(`Account created successfully for ${data.user.name}! Please log in.`, 'success');
    switchTab('login');
    document.getElementById('login-email').value = email;
  } catch (err) {
    showAlert('Network error: Could not reach auth server.', 'error');
  }
});

// Login Handler
formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAlert();

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    showAlert('Email and password are required.', 'error');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      showAlert(data.message || 'Login failed.', 'error');
      return;
    }

    currentToken = data.token;
    localStorage.setItem('auth_token', currentToken);
    renderDashboard(data.user);
    switchTab('dashboard');
    showAlert(`Welcome back, ${data.user.name}!`, 'success');
  } catch (err) {
    showAlert('Network error: Could not reach auth server.', 'error');
  }
});

// Render Dashboard
function renderDashboard(user) {
  currentUser = user;
  userAvatar.textContent = (user.name || 'U').charAt(0).toUpperCase();
  userName.textContent = user.name;
  userEmail.textContent = user.email;

  userRoleBadge.textContent = user.role;
  userRoleBadge.className = `badge ${user.role}`;

  userId.textContent = user._id;
  userCreated.textContent = user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A';
  userTokenPreview.textContent = currentToken;

  adminResult.className = 'admin-result-box hidden';
  adminResult.textContent = '';
}

// Fetch Profile
async function fetchProfile() {
  if (!currentToken) return;

  try {
    const res = await fetch(`${API_BASE}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    });
    const data = await res.json();
    if (res.ok && data.success) {
      renderDashboard(data.user);
      switchTab('dashboard');
    } else {
      // Token invalid or expired
      logout();
    }
  } catch (err) {
    console.error('Failed to restore session:', err);
  }
}

// Test Admin Route
btnTestAdmin.addEventListener('click', async () => {
  adminResult.className = 'admin-result-box';
  adminResult.textContent = 'Testing route...';

  try {
    const res = await fetch(`${API_BASE}/api/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    });
    const data = await res.json();

    if (res.ok && data.success) {
      adminResult.className = 'admin-result-box success';
      adminResult.innerHTML = `<strong>200 OK - Authorized!</strong><br>${data.message}`;
    } else {
      adminResult.className = 'admin-result-box error';
      adminResult.innerHTML = `<strong>${res.status} Forbidden / Unauthorized</strong><br>${data.message}`;
    }
  } catch (err) {
    adminResult.className = 'admin-result-box error';
    adminResult.textContent = 'Error contacting /api/admin/dashboard';
  }
});

// Logout
function logout() {
  currentToken = null;
  currentUser = null;
  localStorage.removeItem('auth_token');
  tabDashboard.classList.add('hidden');
  switchTab('login');
  showAlert('You have been logged out.', 'success');
}

btnLogout.addEventListener('click', logout);

// Initialize
checkApiHealth();
fetchProfile();
