// src/services/auth.js
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const login = async (email, password) => {
  return axios.post(`${API}/auth/login`, { email, password });
};

export const register = async (email, password) => {
  return axios.post(`${API}/auth/register`, { email, password });
};
