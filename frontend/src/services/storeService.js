import api from './api.js';

export async function getStores({ page = 1, limit = 10, search = '' } = {}) {
  const params = { page, limit };
  if (search.trim()) {
    params.search = search.trim();
  }
  const response = await api.get('/stores', { params });
  return response.data;
}

export async function submitRating(storeId, rating) {
  const response = await api.post('/ratings', { storeId, rating });
  return response.data;
}
