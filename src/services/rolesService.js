import axios from 'axios';

const rawApi = import.meta.env.VITE_API_URL || '';

const normalizeBase = (base) => {
  const clean = String(base || '').trim().replace(/\/+$/, '');
  return clean.replace(/\/api$/i, '');
};

const API = `${normalizeBase(rawApi)}/api`;

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const getAllRoles = () => axios.get(`${API}/roles`, getAuthHeaders());
export const createRol = (rolData) => axios.post(`${API}/roles`, rolData, getAuthHeaders());
export const updateRol = (rolId, rolData) => axios.put(`${API}/roles/${rolId}`, rolData, getAuthHeaders());
export const deleteRol = (rolId) => axios.delete(`${API}/roles/${rolId}`, getAuthHeaders());

export const getAllPermisos = () => axios.get(`${API}/roles/permisos`, getAuthHeaders());

export const updateRolPermisos = (rolId, permisosIds) =>
  axios.put(`${API}/roles/${rolId}/permisos`, { permisosIds }, getAuthHeaders());