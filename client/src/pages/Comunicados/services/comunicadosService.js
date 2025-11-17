import axios from '../../../shared/api/axios';

export const comunicadosService = {
  getComunicados: async (params = {}) => {
    const response = await axios.get('/comunicados', { params });
    return response.data;
  },

  getComunicadoById: async (id) => {
    const response = await axios.get(`/comunicados/${id}`);
    return response.data;
  },

  createComunicado: async (payload) => {
    const response = await axios.post('/comunicados', payload);
    return response.data;
  },

  updateComunicado: async (id, payload) => {
    const response = await axios.put(`/comunicados/${id}`, payload);
    return response.data;
  },

  deleteComunicado: async (id) => {
    const response = await axios.delete(`/comunicados/${id}`);
    return response.data;
  },
};