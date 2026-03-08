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

export const obtenerHistorial = () => axios.get(`${API}/historial`, getHeaders());
export const registrarHistorial = (data) => axios.post(`${API}/historial`, data, getHeaders());
export const actualizarHistorial = (id, data) => axios.put(`${API}/historial/${id}`, data, getHeaders());
export const eliminarHistorial = (id) => axios.delete(`${API}/historial/${id}`, getHeaders());
export const obtenerMascotas = () => axios.get(`${API}/mascotas`, getHeaders());