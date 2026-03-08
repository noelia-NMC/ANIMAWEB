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

// ====== NOTAS CLÍNICAS ======
export const exp_obtenerNotas = () => axios.get(`${API}/historial`, getHeaders());
export const exp_crearNota = (data) => axios.post(`${API}/historial`, data, getHeaders());
export const exp_actualizarNota = (id, data) => axios.put(`${API}/historial/${id}`, data, getHeaders());
export const exp_eliminarNota = (id) => axios.delete(`${API}/historial/${id}`, getHeaders());

// ====== RESULTADOS / ARCHIVOS ======
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

// ===== Mascotas =====
export const exp_obtenerMascotas = () => axios.get(`${API}/mascotas`, getHeaders());