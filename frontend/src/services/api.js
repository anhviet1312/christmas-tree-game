// Tự động nhận biến môi trường VITE_API_BASE_URL khi deploy Vercel kết nối Render
const API_BASE = (import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '') : '') + '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.detail || 'Có lỗi xảy ra, vui lòng thử lại!';
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Auth
  register: (username, password, displayName) =>
    fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, display_name: displayName })
    }).then(handleResponse),

  login: (username, password) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }).then(handleResponse),

  getMe: () =>
    fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    }).then(handleResponse),

  // Resources
  getResources: () =>
    fetch(`${API_BASE}/resources`, {
      headers: getHeaders()
    }).then(handleResponse),

  claimResource: () =>
    fetch(`${API_BASE}/resources/claim`, {
      method: 'POST',
      headers: getHeaders()
    }).then(handleResponse),

  dailyCheckin: () =>
    fetch(`${API_BASE}/resources/daily-checkin`, {
      method: 'POST',
      headers: getHeaders()
    }).then(handleResponse),

  // Shop & Inventory
  getShopItems: () =>
    fetch(`${API_BASE}/shop/items`).then(handleResponse),

  buyItem: (itemId, quantity = 1) =>
    fetch(`${API_BASE}/shop/buy`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ item_id: itemId, quantity })
    }).then(handleResponse),

  getInventory: () =>
    fetch(`${API_BASE}/shop/inventory`, {
      headers: getHeaders()
    }).then(handleResponse),

  // Tree & Decoration
  getMyTree: () =>
    fetch(`${API_BASE}/tree`, {
      headers: getHeaders()
    }).then(handleResponse),

  getPublicTree: (username) =>
    fetch(`${API_BASE}/tree/public/${username}`).then(handleResponse),

  upgradeLayer: () =>
    fetch(`${API_BASE}/tree/upgrade-layer`, {
      method: 'POST',
      headers: getHeaders()
    }).then(handleResponse),

  equipSlot: (layerIndex, slotIndex, itemId) =>
    fetch(`${API_BASE}/tree/slot/equip`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ layer_index: layerIndex, slot_index: slotIndex, item_id: itemId })
    }).then(handleResponse),

  unequipSlot: (layerIndex, slotIndex) =>
    fetch(`${API_BASE}/tree/slot/unequip`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ layer_index: layerIndex, slot_index: slotIndex })
    }).then(handleResponse)
};
