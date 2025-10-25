import { useState, useCallback } from 'react';
import { inventarioService } from '../services/inventarioService';

export const useInventario = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await inventarioService.getItems();
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = useCallback(async (item) => {
    try {
      setLoading(true);
      await inventarioService.createItem(item);
      await fetchItems();
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchItems]);

  const updateItem = useCallback(async (id, item) => {
    try {
      setLoading(true);
      await inventarioService.updateItem(id, item);
      await fetchItems();
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchItems]);

  const deleteItem = useCallback(async (id) => {
    try {
      setLoading(true);
      await inventarioService.deleteItem(id);
      await fetchItems();
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  };
};