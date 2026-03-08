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

export const obtenerMascotas = async () => {
  return axios.get(`${API}/mascotas`, getHeaders());
};

export const registrarMascota = async (mascota) => {
  return axios.post(`${API}/mascotas`, mascota, getHeaders());
};

export const actualizarMascota = async (id, datos) => {
  return axios.put(`${API}/mascotas/${id}`, datos, getHeaders());
};

export const eliminarMascota = async (id) => {
  return axios.delete(`${API}/mascotas/${id}`, getHeaders());
};