// Componentes
import Nav from './shared/components/Nav/Nav.jsx';
// import Footer from './components/Footer/Footer.jsx';
// Dependencias
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import useUser from './shared/hooks/useUser.js';

export default function Layout() {
  const location = useLocation();
  const { user, loading } = useUser();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Si esta cargando podriamos mostrar una pantalla de carga
    if (loading) return;
    // checkSession();
  }, [location, loading, user]);

  return (
    <>
      <header>
        <Nav />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        {/* <Footer /> */}
      </footer>
    </>
  );
};