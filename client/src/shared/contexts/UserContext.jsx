import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './../api/axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkSession = async () => {      
    if (window.location.pathname === '/auth') return;
    try {
      const response = await axios.get('/auth/me');
      
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (err) {
      if (err?.response?.status === 403) console.warn(err?.response?.data?.message || 'Error al verificar sesión', 'error');
      console.error(err?.response?.data?.message || 'Error al verificar sesión:', err);
      handleLogout();
    } finally {
      setLoading(false);
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

  return (
    <UserContext.Provider value={{ user, handleLogin, handleLogout, loading, checkSession }}>
      {children}
    </UserContext.Provider>
  );
};
