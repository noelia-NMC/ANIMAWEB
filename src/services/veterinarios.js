import axios from 'axios';
const API = import.meta.env.VITE_API_URL;

const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'clinica-id': user?.clinica_id
    }
  };
};

export const obtenerVeterinarios = () => axios.get(`${API}/veterinarios`, getHeaders());
export const registrarVeterinario = (data) => axios.post(`${API}/veterinarios`, data, getHeaders());
export const actualizarVeterinario = (id, data) => axios.put(`${API}/veterinarios/${id}`, data, getHeaders());
export const eliminarVeterinario = (id) => axios.delete(`${API}/veterinarios/${id}`, getHeaders());
