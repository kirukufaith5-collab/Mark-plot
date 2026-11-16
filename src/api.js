// ALL talking to storage/back-end happens in this file.
// false = save in this browser only (good for building the screens)
// true  = use the real Mark-Plot server (switch on when the back-end is ready)
const USE_SERVER = false;

// ---------- helpers for browser storage ----------
const read = (key, fallback) => JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const me = () => read('mp_session', null);
const plotsKey = () => 'mp_plots_' + me();

// ---------- helper for the real server ----------
async function server(path, method = 'GET', body) {
  const res = await fetch('/api' + path, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('mp_token') },
    body: body ? JSON.stringify(body) : undefined
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Something went wrong');
  return json;
}

// ---------- accounts ----------
export function isLoggedIn() {
  return USE_SERVER ? !!localStorage.getItem('mp_token') : !!me();
}

export async function signIn(kind, email, password) { // kind = 'login' or 'register'
  if (USE_SERVER) {
    const { token } = await server('/' + kind, 'POST', { email, password });
    localStorage.setItem('mp_token', token);
    return;
  }
  // Browser-only version (NOT secure, only for building the screens)
  const users = read('mp_users', []);
  const found = users.find((u) => u.email === email.toLowerCase());
  if (kind === 'register') {
    if (found) throw new Error('That email is already registered.');
    users.push({ email: email.toLowerCase(), password });
    write('mp_users', users);
  } else if (!found || found.password !== password) {
    throw new Error('Wrong email or password.');
  }
  write('mp_session', email.toLowerCase());
}

export function signOut() {
  localStorage.removeItem('mp_token');
  localStorage.removeItem('mp_session');
}

// ---------- maps (plots) ----------
export async function listPlots() {
  if (USE_SERVER) return server('/plots');
  return read(plotsKey(), []).map(({ id, name }) => ({ id, name }));
}

export async function getPlot(id) {
  if (USE_SERVER) return server('/plots/' + id);
  return read(plotsKey(), []).find((p) => p.id === id);
}

export async function savePlot(id, name, data) { // returns the plot id
  if (USE_SERVER) {
    if (id) { await server('/plots/' + id, 'PUT', { name, data }); return id; }
    return (await server('/plots', 'POST', { name, data })).id;
  }
  const plots = read(plotsKey(), []);
  const plot = plots.find((p) => p.id === id);
  if (plot) { plot.name = name; plot.data = data; }
  else { id = Date.now(); plots.push({ id, name, data }); }
  write(plotsKey(), plots);
  return id;
}

export async function deletePlot(id) {
  if (USE_SERVER) return server('/plots/' + id, 'DELETE');
  write(plotsKey(), read(plotsKey(), []).filter((p) => p.id !== id));
}