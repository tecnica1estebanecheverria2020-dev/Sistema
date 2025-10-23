// Rutas
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Notificaciones

// Layout
import Layout from './Layout.jsx';

// Paginas
import Inventario from './pages/Inventario/Inventario.jsx';

// Provedor del usuario
import { UserProvider } from './contexts/UserContext.jsx';

export default function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          {/* Rutas del Cliente */}
          <Route path="/" element={<Layout />}>
            {/* <Route path="*" element={<NotFound />} /> */}
            <Route path="/inventario" element={<Inventario />} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}