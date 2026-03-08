import axios from 'axios';

const rawApi = import.meta.env.VITE_API_URL || '';

const normalizeBase = (base) => {
  const clean = String(base || '').trim().replace(/\/+$/, '');
  return clean.replace(/\/api$/i, '');
};

const API = `${normalizeBase(rawApi)}/api`;

export const login = async (email, password) => {
  return axios.post(`${API}/auth/login`, { email, password });
};

export const register = async (email, password) => {
  return axios.post(`${API}/auth/register`, { email, password });
};