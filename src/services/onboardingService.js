import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const registerClinicAndAdmin = (payload) => {
  return axios.post(`${API}/onboarding/register-clinic-admin`, payload);
};