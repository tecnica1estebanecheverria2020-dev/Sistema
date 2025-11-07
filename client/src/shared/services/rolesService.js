import axios from '../api/axios';

export const rolesService = {
  getRoles: async () => {
    const response = await axios.get(`/roles`);
    return response.data;
  },

  getRoleById: async (id) => {
    const response = await axios.get(`/roles/${id}`);
    return response.data;
  },

  getUsersByRole: async (id) => {
    const response = await axios.get(`/roles/${id}/users`);
    return response.data;
  },

  getUsersByRoleName: async (name) => {
    const response = await axios.get(`/roles/name/${encodeURIComponent(name)}/users`);
    return response.data;
  },

  getRolesStats: async () => {
    const response = await axios.get(`/roles/stats`);
    return response.data;
  },
};