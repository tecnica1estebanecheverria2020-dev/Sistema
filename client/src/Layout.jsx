// Componentes
import Sidebar from './shared/components/Sidebar/Sidebar.jsx';
// import Footer from './components/Footer/Footer.jsx';
// Dependencias
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import useUser from './shared/hooks/useUser.js';

export default function Layout() {
  const location = useLocation();
  const { loading, checkSession } = useUser();
  const isAuthPage = location.pathname.startsWith('/auth');

  useEffect(() => {
    window.scrollTo(0, 0);

    // Si esta cargando podriamos mostrar una pantalla de carga
    if (loading) return;
    checkSession();
  }, [location, loading]);

  return (
    <div className={`layout ${!isAuthPage ? 'with-sidebar' : ''}`}>
       { !isAuthPage && <Sidebar /> }
      <main>
        <Outlet />
      </main>
    </div>
  );
};