import axios from 'axios';

const rawApi = import.meta.env.VITE_API_URL || '';

const normalizeBase = (base) => {
  const clean = String(base || '').trim().replace(/\/+$/, '');
  return clean.replace(/\/api$/i, '');
};

const API = `${normalizeBase(rawApi)}/api`;

const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'clinica-id': user?.clinica_id,
    },
  };
};

export const obtenerVeterinarios = () => axios.get(`${API}/veterinarios`, getHeaders());
export const registrarVeterinario = (data) => axios.post(`${API}/veterinarios`, data, getHeaders());
export const actualizarVeterinario = (id, data) => axios.put(`${API}/veterinarios/${id}`, data, getHeaders());
export const eliminarVeterinario = (id) => axios.delete(`${API}/veterinarios/${id}`, getHeaders());