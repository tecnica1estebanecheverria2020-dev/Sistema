import { useState, useCallback } from 'react';
import { usersService } from '../services/usersService';

/**
 * useUsers
 * Hook de estado y lógica para Usuarios.
 * Pasa los datos del backend sin mapeos ni transformaciones.
 * Maneja errores y estados de carga.
 */
export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await usersService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (form) => {
    try {
      setLoading(true);
      await usersService.createUser(form);
      await fetchUsers();
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const updateUser = useCallback(async (id, form) => {
    try {
      setLoading(true);
      await usersService.updateUser(id, form);
      await fetchUsers();
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const deleteUser = useCallback(async (id) => {
    try {
      setLoading(true);
      await usersService.deleteUser(id);
      await fetchUsers();
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const toggleUser = useCallback(async (id) => {
    try {
      setLoading(true);
      await usersService.toggleUser(id);
      await fetchUsers();
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const getUserById = useCallback(async (id) => {
    try {
      setLoading(true);
      const data = await usersService.getUserById(id);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUser,
    getUserById,
  };
};
