// src/services/expediente.js
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

// ====== NOTAS CLÍNICAS (tu historial actual) ======
export const exp_obtenerNotas = () => axios.get(`${API}/historial`, getHeaders());
export const exp_crearNota = (data) => axios.post(`${API}/historial`, data, getHeaders());
export const exp_actualizarNota = (id, data) => axios.put(`${API}/historial/${id}`, data, getHeaders());
export const exp_eliminarNota = (id) => axios.delete(`${API}/historial/${id}`, getHeaders());

// ====== RESULTADOS / ARCHIVOS (tu laboratorio) ======
export const exp_obtenerResultados = (mascota_id = '') =>
  axios.get(`${API}/laboratorio${mascota_id ? `?mascota_id=${mascota_id}` : ''}`, getHeaders());

export const exp_crearResultado = (formData) =>
  axios.post(`${API}/laboratorio`, formData, {
    ...getHeaders(),
    headers: {
      ...getHeaders().headers,
      'Content-Type': 'multipart/form-data',
    },
  });

export const exp_actualizarResultado = (id, formData) =>
  axios.put(`${API}/laboratorio/${id}`, formData, {
    ...getHeaders(),
    headers: {
      ...getHeaders().headers,
      'Content-Type': 'multipart/form-data',
    },
  });

export const exp_eliminarResultado = (id) =>
  axios.delete(`${API}/laboratorio/${id}`, getHeaders());

// ===== Mascotas (para selector) =====
export const exp_obtenerMascotas = () => axios.get(`${API}/mascotas`, getHeaders());