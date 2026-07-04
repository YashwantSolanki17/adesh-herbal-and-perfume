// ── API Helper ──────────────────────────────────────────────────
// Central place that talks to your Express backend.
// Change API_URL if your backend runs on a different port/host.
const API_URL = 'http://localhost:5000/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('token')

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  // Backend always responds with JSON, even on errors
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`)
  }
  return data
}

export const api = {
  // ── Auth ──
  register: (name, email, password) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/auth/me'),

  // ── Addresses ──
  getAddresses: () => request('/addresses'),
  addAddress: (address) => request('/addresses', { method: 'POST', body: JSON.stringify(address) }),
  deleteAddress: (id) => request(`/addresses/${id}`, { method: 'DELETE' }),

  // ── Orders / Payment ──
  createOrder: (items, address, totalAmount, paymentMethod) =>
    request('/orders/create', {
      method: 'POST',
      body: JSON.stringify({ items, address, totalAmount, paymentMethod }),
    }),
  verifyPayment: (payload) =>
    request('/orders/verify', { method: 'POST', body: JSON.stringify(payload) }),
  getOrders: () => request('/orders'),
}
