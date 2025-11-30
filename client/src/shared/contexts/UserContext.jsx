import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './../api/axios';
import useGlobalLoading from '../hooks/useGlobalLoading.jsx';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const navigate = useNavigate();
  const { startAppLoading, stopAppLoading } = useGlobalLoading();

  const checkSession = async () => {
    const startTime = Date.now();
    const MIN_LOADING_TIME = 2000; // 2 segundos mínimo

    // Solo mostrar loading en la carga inicial
    if (!initialLoadDone) {
      startAppLoading();
    }

    if (window.location.pathname === '/auth') {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed);

      await new Promise(resolve => setTimeout(resolve, remainingTime));
      setLoading(false);
      if (!initialLoadDone) {
        stopAppLoading();
        setInitialLoadDone(true);
      }
      return;
    }

    try {
      // Verificar que las fuentes estén cargadas
      await document.fonts.ready;

      const response = await axios.get('/auth/me');

      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (err) {
      if (err?.response?.status === 403) console.warn(err?.response?.data?.message || 'Error al verificar sesión', 'error');
      console.error(err?.response?.data?.message || 'Error al verificar sesión:', err);
      handleLogout();
    } finally {
      // Asegurar tiempo mínimo de carga solo en la carga inicial
      if (!initialLoadDone) {
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed);
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

      setLoading(false);
      if (!initialLoadDone) {
        stopAppLoading();
        setInitialLoadDone(true);
      }
    }
  };

  const handleLogin = (user) => {
    setUser(user);
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.error('Error al cerrar sesión:', err?.response?.data?.message || 'Error al cerrar sesión');
    } finally {
      setUser(null);
      navigate('/auth');
      window.location.reload();
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    startAppLoading();
  }, []);

  return (
    <UserContext.Provider value={{ user, handleLogin, handleLogout, loading, checkSession }}>
      {children}
    </UserContext.Provider>
  );
};

