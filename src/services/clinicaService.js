// src/services/clinicaService.js
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;
const API_URL = `${API}/clinicas`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getMiClinica = () => axios.get(`${API_URL}/me`, getAuthHeaders());
export const updateMiClinica = (data) => axios.put(`${API_URL}/me`, data, getAuthHeaders());