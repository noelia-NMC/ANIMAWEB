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

export const obtenerProductos = async () => {
  return axios.get(`${API}/productos`, getHeaders());
};

export const crearProducto = async (producto) => {
  return axios.post(`${API}/productos`, producto, getHeaders());
};

export const actualizarProducto = async (id, datos) => {
  return axios.put(`${API}/productos/${id}`, datos, getHeaders());
};

export const desactivarProducto = async (id) => {
  return axios.delete(`${API}/productos/${id}`, getHeaders());
};

export const moverStockProducto = async (data) => {
  return axios.post(`${API}/productos/movimiento`, data, getHeaders());
};

export const obtenerMovimientosProducto = async (productoId) => {
  return axios.get(`${API}/productos/${productoId}/movimientos`, getHeaders());
};