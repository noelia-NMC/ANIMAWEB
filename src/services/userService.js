import axios from 'axios';

const rawApi = import.meta.env.VITE_API_URL || '';

const normalizeBase = (base) => {
  const clean = String(base || '').trim().replace(/\/+$/, '');
  return clean.replace(/\/api$/i, '');
};

const API = `${normalizeBase(rawApi)}/api`;
const API_URL = `${API}/users`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getProfile = () => axios.get(`${API_URL}/me`, getAuthHeaders());
export const updateProfile = (profileData) => axios.put(`${API_URL}/me`, profileData, getAuthHeaders());
export const changePassword = (passwordData) => axios.put(`${API_URL}/password`, passwordData, getAuthHeaders());