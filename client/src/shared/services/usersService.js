import axios from '../api/axios';

/**
 * usersService
 * Capa de acceso a datos para Usuarios. Encapsula llamadas HTTP y normaliza errores.
 */
export const usersService = {
  /** Obtener todos los usuarios */
  getUsers: async () => {
    try {
      const { data } = await axios.get(`/users`);
      return data;
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'No se pudieron cargar los usuarios');
    }
  },

  /** Obtener usuario por ID */
  getUserById: async (id) => {
    try {
      const { data } = await axios.get(`/users/${id}`);
      return data;
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'Usuario no encontrado');
    }
  },

  /** Crear usuario */
  createUser: async (payload) => {
    try {
      const { data } = await axios.post(`/users`, payload);
      return data;
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'No se pudo crear el usuario');
    }
  },

  /** Actualizar usuario */
  updateUser: async (id, payload) => {
    try {
      const { data } = await axios.put(`/users/${id}`, payload);
      return data;
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'No se pudo actualizar el usuario');
    }
  },

  /** Eliminar usuario */
  deleteUser: async (id) => {
    try {
      const { data } = await axios.delete(`/users/${id}`);
      return data;
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'No se pudo eliminar el usuario');
    }
  },

  /** Alternar estado activo/inactivo del usuario */
  toggleUser: async (id) => {
    try {
      const { data } = await axios.patch(`/users/${id}/toggle`);
      return data;
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'No se pudo cambiar el estado del usuario');
    }
  }
};
