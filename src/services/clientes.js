// src/services/clientes.js
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const getHeaders = () => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {
    user = null;
  }

  const token = localStorage.getItem('token');

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'clinica-id': user?.clinica_id ?? '',
    },
  };
};

export const obtenerClientes = () => axios.get(`${API}/clientes`, getHeaders());
export const crearCliente = (data) => axios.post(`${API}/clientes`, data, getHeaders());
export const actualizarCliente = (id, data) => axios.put(`${API}/clientes/${id}`, data, getHeaders());
export const eliminarCliente = (id) => axios.delete(`${API}/clientes/${id}`, getHeaders());