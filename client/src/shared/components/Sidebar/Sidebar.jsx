import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './style.css';
import useAuth from '../../hooks/useAuth.js';
import usePermisos from '../../hooks/usePermisos.js';
import { 
    FiHome, 
    FiPackage, 
    FiBook, 
    FiClock, 
    FiMessageSquare, 
    FiSettings,
    FiLogOut,
    FiSearch,
    FiBell,
    FiChevronDown,
    FiUsers
} from 'react-icons/fi';
import { FaBox } from 'react-icons/fa';

export default function Sidebar() {
    const { user, handleLogout } = useAuth();
    const { canAccessTo } = usePermisos();
    const location = useLocation();
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const menuItems = [
        { path: '/', icon: FiHome, label: 'Dashboard', badge: null, permission: 'dashboard.view' },
        { path: '/Inventario', icon: FiPackage, label: 'Inventario', badge: null, permission: 'inventario.view' },
        { path: '/Prestamos', icon: FiBook, label: 'Préstamos', badge: null, permission: 'prestamos.view' },
        { path: '/Horarios', icon: FiClock, label: 'Horarios', badge: null, permission: 'horarios.view' },
        { path: '/Comunicados', icon: FiMessageSquare, label: 'Comunicados', badge: null, permission: 'comunicados.view' },
        { path: '/Usuarios', icon: FiUsers, label: 'Usuarios', badge: null, permission: 'usuarios.view' },
    ];

    const visibleMenuItems = menuItems.filter(item => canAccessTo(item.permission));

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const getInitials = (name) => {
        const names = name.split(' ');
        return names.map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="sidebar-main">
            {/* Header del Sidebar */}
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        <FaBox />
                    </div>
                    <span className="sidebar-logo-text">TecniStock</span>
                </div>
            </div>

            {/* Navegación Principal */}
            <nav className="sidebar-nav">
                <div className="sidebar-nav-section">
                    {visibleMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        
                        return (
                            <Link 
                                key={item.path}
                                to={item.path} 
                                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                            >
                                <Icon className="sidebar-nav-icon" />
                                <span className="sidebar-nav-label">{item.label}</span>
                                {item.badge && <span className="sidebar-nav-badge">{item.badge}</span>}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* 
                Acciones Rápidas 
                
                De momento no habran
            */}
            {/* <div className="sidebar-actions">
                <h4 className="sidebar-actions-title">ACCIONES RÁPIDAS</h4>
                <div className="sidebar-action-buttons">
                    <button className="sidebar-action-btn">
                        <FiSearch />
                    </button>
                    <button className="sidebar-action-btn">
                        <FiBell />
                    </button>
                </div>
            </div> */}

            {/* Footer del Sidebar - Usuario con Dropdown */}
            <div className="sidebar-footer">
                <div className="sidebar-user-section">
                    <button 
                        className="sidebar-user-button" 
                        onClick={toggleUserDropdown}
                    >
                        <div className="sidebar-user-avatar">
                            <span>{getInitials(user?.name || 'User')}</span>
                        </div>
                        <div className="sidebar-user-info">
                            <span className="sidebar-user-name">{user?.name || 'User'}</span>
                            <span className="sidebar-user-email">{user?.email || 'user@tecnistock.edu'}</span>
                        </div>
                        <FiChevronDown className={`sidebar-user-chevron ${isUserDropdownOpen ? 'open' : ''}`} />
                    </button>
                    
                    {isUserDropdownOpen && (
                        <div className="sidebar-user-dropdown">
                            <button className="sidebar-dropdown-item" onClick={handleLogout}>
                                <FiLogOut className="sidebar-dropdown-icon" />
                                <span>Cerrar Sesión</span>
                            </button>
                            <span className="sidebar-dropdown-title">Roles:</span>
                            <div className="sidebar-card-roles">
                                {user.roles.map((role) => (
                                    <div key={role} className="sidebar-card-role">
                                        {role.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
