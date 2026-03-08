import axios from 'axios';

const rawApi = import.meta.env.VITE_API_URL || '';

const normalizeBase = (base) => {
  const clean = String(base || '').trim().replace(/\/+$/, '');
  return clean.replace(/\/api$/i, '');
};

const API = `${normalizeBase(rawApi)}/api`;

const getHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const obtenerTeleconsultasDelVeterinario = async (token) => {
  return axios.get(`${API}/teleconsultas/veterinario/mis-consultas`, getHeaders(token));
};

export const aceptarTeleconsulta = async (consultaId, data, token) => {
  return axios.put(`${API}/teleconsultas/${consultaId}/aceptar`, data, getHeaders(token));
};

export const finalizarTeleconsulta = async (consultaId, token) => {
  return axios.put(`${API}/teleconsultas/${consultaId}/finalizar`, {}, getHeaders(token));
};