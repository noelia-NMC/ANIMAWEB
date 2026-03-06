// src/services/auditoria.js
import axios from 'axios';
const API = import.meta.env.VITE_API_URL;

const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'clinica-id': user?.clinica_id,
    },
  };
};

export const obtenerAuditoria = (params = {}) =>
  axios.get(`${API}/auditoria`, { ...getHeaders(), params });