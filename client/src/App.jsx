// Rutas
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Notificaciones

// Layout
import Layout from './Layout.jsx';

// Paginas
import Inventario from './pages/Inventario/Inventario.jsx';
import Auth from './pages/Auth/Auth.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Prestamos from './pages/Prestamos/Prestamos.jsx';
import Horarios from './pages/Horarios/Horarios.jsx';
import Comunicados from './pages/Comunicados/Comunicados.jsx';
import TemplatesGallery from './pages/Comunicados/TemplatesGallery.jsx';
import EditorComunicado from './pages/Comunicados/EditorComunicado.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import Users from './pages/Users/Users.jsx';
import usePermisos from './shared/hooks/usePermisos.js';

// Provedor del usuario
import { UserProvider } from './shared/contexts/UserContext.jsx';

export default function App() {
  return (
    <Router>
      <UserProvider>
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
        <AppRoutes/>
      </UserProvider>
    </Router>
  );
}

const AppRoutes = () => {

  // Componente guard que valida permisos por ruta
  const RequirePermission = ({ permission, children }) => {
    const { canAccessTo } = usePermisos();
    if (!canAccessTo(permission)) {
      return <NotFound />;
    }
    return children;
  };

  
  return (
    <Routes>
      {/* Rutas del Cliente */}
      <Route path="/" element={<Layout />}>
        <Route index element={
          <RequirePermission permission="dashboard.view">
            <Dashboard />
          </RequirePermission>
        } />
        
        <Route path="/auth" element={<Auth />} />
        
        <Route path="/prestamos" element={
          <RequirePermission permission="prestamos.view">
            <Prestamos />
          </RequirePermission>
        } />
        
        <Route path="/horarios" element={
          <RequirePermission permission="horarios.view">
            <Horarios />
          </RequirePermission>
        } />
        
        <Route path="/comunicados" element={
          <RequirePermission permission="comunicados.view">
            <Comunicados />
          </RequirePermission>
        } />
        
        <Route path="/comunicados/crear" element={
          <RequirePermission permission="comunicados.view">
            <TemplatesGallery />
          </RequirePermission>
        } />
        
        <Route path="/comunicados/crear/:tipo" element={
          <RequirePermission permission="comunicados.view">
            <EditorComunicado />
          </RequirePermission>
        } />

        <Route path="/usuarios" element={
          <RequirePermission permission="usuarios.view">
            <Users />
          </RequirePermission>
        } />

        <Route path="/inventario" element={
          <RequirePermission permission="inventario.view">
            <Inventario />
          </RequirePermission>
        } />

        <Route path="/*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
