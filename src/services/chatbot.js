import axios from 'axios';

const rawApi = import.meta.env.VITE_API_URL || '';

const normalizeBase = (base) => {
  const clean = String(base || '').trim().replace(/\/+$/, '');
  return clean.replace(/\/api$/i, '');
};

const API = `${normalizeBase(rawApi)}/api`;

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No autenticado');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  return { headers };
};

export const sendVeterinaryQuery = async (query, history = [], imageFile = null) => {
  try {
    if (imageFile) {
      const formData = new FormData();
      formData.append('query', query.trim());
      formData.append('history', JSON.stringify(history));
      formData.append('image', imageFile);

      const response = await axios.post(
        `${API}/chatbot/query-image`,
        formData,
        getHeaders(true)
      );
      return response.data;
    }

    const response = await axios.post(
      `${API}/chatbot/query-text`,
      { query, history },
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error en el servicio de chatbot:', error);
    const errorMessage =
      error.response?.data?.error || 'Hubo un problema de conexión con Dr. AnimBot. 🐾';
    throw new Error(errorMessage);
  }
};

export const validateImage = (file) => {
  if (!file) return { valid: true };

  const maxSize = 10 * 1024 * 1024;
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (file.size > maxSize) {
    return { valid: false, error: 'Imagen muy grande (máx 10MB).' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Formato no permitido.' };
  }

  return { valid: true };
};