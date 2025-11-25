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
      return Array.isArray(data) ? data : [];
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'No se pudieron cargar los roles');
    }
  }
};

