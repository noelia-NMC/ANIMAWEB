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

export const obtenerTurnos = () => axios.get(`${API}/turnos`, getHeaders());
export const registrarTurno = (data) => axios.post(`${API}/turnos`, data, getHeaders());
export const actualizarTurno = (id, data) => axios.put(`${API}/turnos/${id}`, data, getHeaders());
export const eliminarTurno = (id) => axios.delete(`${API}/turnos/${id}`, getHeaders());

export const obtenerVeterinariosParaTurnos = () =>
  axios.get(`${API}/veterinarios/para-turnos`, getHeaders());