import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const getHeaders = (token) => ({
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

// Ruta corregida. Ya no se pasa el veterinarioId, el backend lo sabe por el token.
export const obtenerTeleconsultasDelVeterinario = async (token) => {
  return axios.get(`${API}/teleconsultas/veterinario/mis-consultas`, getHeaders(token));
};

// En esta función, el backend ahora toma el veterinario_id del token,
// así que no necesitamos enviarlo en el body.
export const aceptarTeleconsulta = async (consultaId, data, token) => {
  // data debería contener solo { meet_link: '...' }
  return axios.put(`${API}/teleconsultas/${consultaId}/aceptar`, data, getHeaders(token));
};

export const finalizarTeleconsulta = async (consultaId, token) => {
  return axios.put(`${API}/teleconsultas/${consultaId}/finalizar`, {}, getHeaders(token));
};