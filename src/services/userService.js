// src/services/userService.js
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;
const API_URL = `${API}/users`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getProfile = () => axios.get(`${API_URL}/me`, getAuthHeaders());
export const updateProfile = (profileData) => axios.put(`${API_URL}/me`, profileData, getAuthHeaders());
export const changePassword = (passwordData) => axios.put(`${API_URL}/password`, passwordData, getAuthHeaders());