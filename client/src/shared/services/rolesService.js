import axios from '../api/axios';

/**
 * rolesService
 * Capa de acceso para Roles.
 */
export const rolesService = {
  /** Obtener todos los roles */
  getRoles: async () => {
    try {
      const { data } = await axios.get('/roles');
      const payload = data?.data ?? data;
      return Array.isArray(payload) ? payload : [];
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'No se pudieron cargar los roles');
    }
  },

  /** Obtener roles de un usuario */
  getUserRoles: async (userId) => {
    try {
      const { data } = await axios.get(`/roles/users/${userId}/roles`);
      const payload = data?.data ?? data;
      return Array.isArray(payload) ? payload : [];
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'No se pudieron obtener los roles del usuario');
    }
  },

  /** Asignar roles a un usuario (agrega sin duplicados) */
  assignRolesToUser: async (userId, roles) => {
    try {
      const { data } = await axios.post(`/roles/users/${userId}/roles`, { roles });
      const payload = data?.data ?? data;
      return Array.isArray(payload) ? payload : [];
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'No se pudieron asignar roles al usuario');
    }
  },

  /** Remover roles de un usuario (si roles vacío, remueve todos) */
  removeRolesFromUser: async (userId, roles = []) => {
    try {
      const { data } = await axios.delete(`/roles/users/${userId}/roles`, { data: { roles } });
      const payload = data?.data ?? data;
      return Array.isArray(payload) ? payload : [];
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'No se pudieron remover roles del usuario');
    }
  },
};
