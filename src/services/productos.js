import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'clinica-id': user?.clinica_id, // lo mandas como extra por si te sirve
    },
  };
};

// ============================
// ✅ PRODUCTOS (Stock)
// ============================

// Listar productos (admin + veterinario lectura)
export const obtenerProductos = async () => {
  return axios.get(`${API}/productos`, getHeaders());
};

// Crear producto (solo admin)
export const crearProducto = async (producto) => {
  return axios.post(`${API}/productos`, producto, getHeaders());
};

// Editar producto (solo admin)
export const actualizarProducto = async (id, datos) => {
  return axios.put(`${API}/productos/${id}`, datos, getHeaders());
};

// Desactivar producto (solo admin) - soft delete
export const desactivarProducto = async (id) => {
  return axios.delete(`${API}/productos/${id}`, getHeaders());
};

// Mover stock (solo admin)
// body: { producto_id, tipo_movimiento: 'ENTRADA'|'SALIDA'|'AJUSTE', cantidad, observacion }
export const moverStockProducto = async (data) => {
  return axios.post(`${API}/productos/movimiento`, data, getHeaders());
};

// Ver movimientos de un producto (admin + veterinario lectura)
export const obtenerMovimientosProducto = async (productoId) => {
  return axios.get(`${API}/productos/${productoId}/movimientos`, getHeaders());
};