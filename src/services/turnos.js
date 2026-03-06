import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'clinica-id': user?.clinica_id
    }
  };
};

export const obtenerTurnos = () => axios.get(`${API}/turnos`, getHeaders());
export const registrarTurno = (data) => axios.post(`${API}/turnos`, data, getHeaders());
export const actualizarTurno = (id, data) => axios.put(`${API}/turnos/${id}`, data, getHeaders());
export const eliminarTurno = (id) => axios.delete(`${API}/turnos/${id}`, getHeaders());
