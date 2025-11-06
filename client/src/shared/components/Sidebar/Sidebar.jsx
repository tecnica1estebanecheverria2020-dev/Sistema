import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './style.css';
import useAuth from '../../hooks/useAuth.js';
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
    const location = useLocation();
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const menuItems = [
        { path: '/', icon: FiHome, label: 'Dashboard', badge: null },
        { path: '/Inventario', icon: FiPackage, label: 'Inventario', badge: null },
        { path: '/Prestamos', icon: FiBook, label: 'Préstamos', badge: null },
        { path: '/Horarios', icon: FiClock, label: 'Horarios', badge: null },
        { path: '/Comunicados', icon: FiMessageSquare, label: 'Comunicados', badge: null },
        { path: '/Usuarios', icon: FiUsers, label: 'Usuarios', badge: null },
        { path: '/Configuracion', icon: FiSettings, label: 'Configuración', badge: null }
    ];

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
                    {menuItems.map((item) => {
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

            {/* Acciones Rápidas */}
            <div className="sidebar-actions">
                <h4 className="sidebar-actions-title">ACCIONES RÁPIDAS</h4>
                <div className="sidebar-action-buttons">
                    <button className="sidebar-action-btn">
                        <FiSearch />
                    </button>
                    <button className="sidebar-action-btn">
                        <FiBell />
                    </button>
                </div>
            </div>

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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}