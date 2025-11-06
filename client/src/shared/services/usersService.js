import axios from '../api/axios';

export const usersService = {
  getUsers: async () => {
    const response = await axios.get(`/users`);
    return response.data;
  },

  createUser: async (item) => {
    const response = await axios.post(`/users`, item);
    return response.data;
  },

  updateUser: async (id, item) => {
    const response = await axios.put(`/users/${id}`, item);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axios.delete(`/users/${id}`);
    return response.data;
  },
};