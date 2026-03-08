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

export const obtenerResultadosLab = (mascota_id = '') =>
  axios.get(`${API}/laboratorio${mascota_id ? `?mascota_id=${mascota_id}` : ''}`, getHeaders());

export const crearResultadoLab = (formData) =>
  axios.post(`${API}/laboratorio`, formData, {
    ...getHeaders(),
    headers: {
      ...getHeaders().headers,
      'Content-Type': 'multipart/form-data',
    },
  });

export const actualizarResultadoLab = (id, formData) =>
  axios.put(`${API}/laboratorio/${id}`, formData, {
    ...getHeaders(),
    headers: {
      ...getHeaders().headers,
      'Content-Type': 'multipart/form-data',
    },
  });

export const eliminarResultadoLab = (id) =>
  axios.delete(`${API}/laboratorio/${id}`, getHeaders());