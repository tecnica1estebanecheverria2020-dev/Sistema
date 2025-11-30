import { useCallback, useState } from 'react';
import { rolesService } from '../services/rolesService';

export const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState(null);

  const fetchRoles = useCallback(async () => {
    try {
      setRolesLoading(true);
      setRolesError(null);

      const data = await rolesService.getRoles();
      setRoles(data);
      return data;
    } catch (err) {
      setRolesError(err.message);
      return [];
    } finally {
      setRolesLoading(false);
    }
  }, []);

  const getUserRoles = useCallback(async (userId) => {
    try {
      setRolesLoading(true);
      setRolesError(null);

      const data = await rolesService.getUserRoles(userId);
      return data;
    } catch (err) {
      setRolesError(err.message);
      return [];
    } finally {
      setRolesLoading(false);
    }
  }, []);

  const assignRolesToUser = useCallback(async (userId, roleIds) => {
    try {
      setRolesLoading(true);
      setRolesError(null);
      await rolesService.assignRolesToUser(userId, roleIds);
      return true;
    } catch (err) {
      setRolesError(err.message);
      return false;
    } finally {
      setRolesLoading(false);
    }
  }, []);

  const removeRolesFromUser = useCallback(async (userId, roleIds) => {
    try {
      setRolesLoading(true);
      setRolesError(null);
      await rolesService.removeRolesFromUser(userId, roleIds);
      return true;
    } catch (err) {
      setRolesError(err.message);
      return false;
    } finally {
      setRolesLoading(false);
    }
  }, []);

  return {
    roles,
    rolesLoading,
    rolesError,
    fetchRoles,
    getUserRoles,
    assignRolesToUser,
    removeRolesFromUser,
  };
};

