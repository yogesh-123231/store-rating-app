import api from './api.js';

export async function getDashboard() {
  const response = await api.get('/admin/dashboard');
  return response.data;
}

export async function getUsers({
  page = 1,
  limit = 10,
  search = '',
  role = '',
  sortBy = '',
  sortOrder = '',
} = {}) {
  const params = { page, limit };
  if (search.trim()) params.search = search.trim();
  if (role) params.role = role;
  if (sortBy) params.sortBy = sortBy;
  if (sortOrder) params.sortOrder = sortOrder;

  const response = await api.get('/admin/users', { params });
  return response.data;
}

export async function createUser(userData) {
  const response = await api.post('/admin/users', userData);
  return response.data;
}

export async function getAdminStores({
  page = 1,
  limit = 10,
  search = '',
  sortBy = '',
  sortOrder = '',
} = {}) {
  const params = { page, limit };
  if (search.trim()) params.search = search.trim();
  if (sortBy) params.sortBy = sortBy;
  if (sortOrder) params.sortOrder = sortOrder;

  const response = await api.get('/admin/stores', { params });
  return response.data;
}

export async function createStore(storeData) {
  const response = await api.post('/admin/stores', storeData);
  return response.data;
}
