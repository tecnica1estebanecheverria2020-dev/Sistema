// Rutas
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import Configuracion from './pages/Configuracion/Configuracion.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import Users from './pages/Users/Users.jsx';

// Provedor del usuario
import { UserProvider } from './shared/contexts/UserContext.jsx';

export default function App() {
  return (
    <Router>
      <UserProvider>
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
        <Routes>
          {/* Rutas del Cliente */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/prestamos" element={<Prestamos />} />
            <Route path="/horarios" element={<Horarios />} />
            <Route path="/comunicados" element={<Comunicados />} />
            <Route path="/usuarios" element={<Users />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/inventario" element={<Inventario />} />

            <Route path="/*" element={<NotFound />} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}