import axios from '../api/axios';

const API_URL = import.meta.env.VITE_API_URL;

export const inventarioService = {
  getItems: async () => {
    const response = await axios.get(`${API_URL}/inventario`);
    return response.data;
  },

  createItem: async (item) => {
    const response = await axios.post(`${API_URL}/inventario`, item);
    return response.data;
  },

  updateItem: async (id, item) => {
    const response = await axios.put(`${API_URL}/inventario/${id}`, item);
    return response.data;
  },

  deleteItem: async (id) => {
    const response = await axios.delete(`${API_URL}/inventario/${id}`);
    return response.data;
  },
};