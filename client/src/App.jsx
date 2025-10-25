// Rutas
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Notificaciones

// Layout
import Layout from './Layout.jsx';

// Paginas
import Inventario from './pages/Inventario/Inventario.jsx';
import Auth from './pages/Auth/Auth.jsx';

// Provedor del usuario
import { UserProvider } from './shared/contexts/UserContext.jsx';

export default function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          {/* Rutas del Cliente */}
          <Route path="/" element={<Layout />}>
            {/* <Route path="*" element={<NotFound />} /> */}
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/*" element={<h2>404 Not Found</h2>} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}