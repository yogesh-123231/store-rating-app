import api from './api';

export const getOwnerStore = () => api.get('/owner/store');
export const getOwnerRatings = (params) => api.get('/owner/ratings', { params });
