import axios from '../api/axios';

export const inventarioService = {
  getItems: async () => {
    const response = await axios.get(`/inventario`);
    return response.data;
  },

  createItem: async (item) => {
    const response = await axios.post(`/inventario`, item);
    return response.data;
  },

  updateItem: async (id, item) => {
    const response = await axios.put(`/inventario/${id}`, item);
    return response.data;
  },

  deleteItem: async (id) => {
    const response = await axios.delete(`/inventario/${id}`);
    return response.data;
  },
};