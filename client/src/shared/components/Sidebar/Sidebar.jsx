import { Link } from 'react-router-dom';
import './style.css';
import useUser from '../../hooks/useUser';

export default function Sidebar() {
    const { user, handleLogout } = useUser();

    return (
        <div className="sidebar">
            <h1>Sidebar</h1>

            <div className="sidebar_links">
                <Link to="/">Dashboard</Link>
                <Link to="/Inventario">Inventario</Link>
                <Link to="/Prestamos">Prestamos</Link>
                <Link to="/Horarios">Horarios</Link>
                <Link to="/Comunicados">Comunicados</Link>
                <Link to="/Configuracion">Configuracion</Link>
            </div>

            <div className="sidebar_user">
                <p>{user?.name}</p>
                <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
        </div>
    );
}