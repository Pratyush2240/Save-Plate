const USERS_KEY = 'demo_users';
const CURRENT_USER_KEY = 'demo_current_user';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getAllUsers() {
  return readJson(USERS_KEY, []);
}

export function saveAllUsers(users) {
  writeJson(USERS_KEY, users);
}

export function signupWithEmail(email, _password, role) {
  const users = getAllUsers();
  const existing = users.find(u => u.email === email);
  if (existing) throw new Error('Account already exists. Please log in.');
  const user = { uid: crypto.randomUUID(), email, role };
  users.push(user);
  saveAllUsers(users);
  writeJson(CURRENT_USER_KEY, user);
  return user;
}

export function loginWithEmail(email, _password) {
  const users = getAllUsers();
  const user = users.find(u => u.email === email);
  if (!user) throw new Error('No account found. Please sign up.');
  writeJson(CURRENT_USER_KEY, user);
  return user;
}

export function signupWithGoogle(selectedRole) {
  const email = `demo+${Math.floor(Math.random() * 100000)}@example.com`;
  return signupWithEmail(email, 'google', selectedRole);
}

export function loginWithGoogle() {
  const users = getAllUsers();
  if (users.length === 0) throw new Error('No account found. Please sign up first.');
  const user = users[0];
  writeJson(CURRENT_USER_KEY, user);
  return user;
}

export function getCurrentUser() {
  return readJson(CURRENT_USER_KEY, null);
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function isDemo() {
  return true;
}


