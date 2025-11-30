import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './style.css';
import useAuth from '../../hooks/useAuth.js';
import usePermisos from '../../hooks/usePermisos.js';
import useGlobalLoading from '../../hooks/useGlobalLoading.jsx';
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
    FiUsers,
    FiMenu,
    FiChevronLeft,
    FiShield
} from 'react-icons/fi';
import { FaBox } from 'react-icons/fa';

export default function Sidebar() {
    const { user, handleLogout } = useAuth();
    const { canAccessTo } = usePermisos();
    const { startSectionLoading } = useGlobalLoading();
    const location = useLocation();
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

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
        // Si está colapsado, primero expandir el sidebar
        if (isCollapsed) {
            setIsCollapsed(false);
            // Esperar a que se expanda antes de abrir el dropdown
            setTimeout(() => {
                setIsUserDropdownOpen(true);
            }, 300); // Tiempo de la transición del sidebar
        } else {
            setIsUserDropdownOpen(!isUserDropdownOpen);
        }
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
        // Cerrar dropdown de usuario al colapsar
        if (!isCollapsed) {
            setIsUserDropdownOpen(false);
        }
    };

    const getInitials = (name) => {
        const names = name.split(' ');
        return names.map(n => n[0]).join('').toUpperCase();
    };

    // Comunicar el estado de colapso al documento para que el main se ajuste
    useEffect(() => {
        document.documentElement.setAttribute('data-sidebar-collapsed', isCollapsed);
    }, [isCollapsed]);

    return (
        <div className={`sidebar-main ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Header del Sidebar */}
            <div className="sidebar-header">
                {!isCollapsed ? (
                    <>
                        <div className="sidebar-logo">
                            <div className="sidebar-logo-icon">
                                <FaBox />
                            </div>
                            <span className="sidebar-logo-text">TecniStock</span>
                        </div>
                        <button className="sidebar-collapse-btn" onClick={toggleSidebar} title="Colapsar sidebar">
                            <FiChevronLeft className="collapse-icon" />
                        </button>
                    </>
                ) : (
                    <button className="sidebar-collapse-btn centered" onClick={toggleSidebar} title="Expandir sidebar">
                        <FiChevronLeft className="collapse-icon collapsed" />
                    </button>
                )}
            </div>

            {/* Navegación Principal */}
            <nav className="sidebar-nav">
                <div className="sidebar-nav-section">
                    {visibleMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <div key={item.path} className="sidebar-nav-item-wrapper">
                                <Link
                                    to={item.path}
                                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                                    onClick={() => { if (!isActive) startSectionLoading(); }}
                                >
                                    <Icon className="sidebar-nav-icon" />
                                    {!isCollapsed && <span className="sidebar-nav-label">{item.label}</span>}
                                    {!isCollapsed && item.badge && <span className="sidebar-nav-badge">{item.badge}</span>}
                                </Link>
                                {isCollapsed && (
                                    <div className="sidebar-tooltip">
                                        {item.label}
                                        {item.badge && <span className="tooltip-badge">{item.badge}</span>}
                                    </div>
                                )}
                            </div>
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
                        {!isCollapsed && (
                            <>
                                <div className="sidebar-user-info">
                                    <span className="sidebar-user-name">{user?.name || 'User'}</span>
                                    <span className="sidebar-user-role">
                                        <FiShield className="role-icon" />
                                        {user?.roles?.[0]?.name || 'Usuario'}
                                    </span>
                                </div>
                                <FiChevronDown className={`sidebar-user-chevron ${isUserDropdownOpen ? 'open' : ''}`} />
                            </>
                        )}
                    </button>

                    {isCollapsed && (
                        <div className="sidebar-tooltip user-tooltip">
                            <div className="tooltip-user-name">{user?.name || 'User'}</div>
                            <div className="tooltip-user-email">{user?.email || 'user@tecnistock.edu'}</div>
                        </div>
                    )}

                    {isUserDropdownOpen && !isCollapsed && (
                        <div className="sidebar-user-dropdown">
                            <div className="sidebar-dropdown-header">
                                <div className="dropdown-user-avatar">
                                    <span>{getInitials(user?.name || 'User')}</span>
                                </div>
                                <div className="dropdown-user-info">
                                    <span className="dropdown-user-name">{user?.name || 'User'}</span>
                                    <span className="dropdown-user-email">{user?.email || 'user@tecnistock.edu'}</span>
                                </div>
                            </div>

                            <div className="sidebar-dropdown-divider"></div>

                            <div className="sidebar-dropdown-section">
                                <span className="sidebar-dropdown-title">
                                    <FiShield className="section-icon" />
                                    Roles asignados
                                </span>
                                <div className="sidebar-card-roles">
                                    {user?.roles?.map((role, index) => (
                                        <div key={index} className="sidebar-card-role">
                                            <span className="role-dot"></span>
                                            {role.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="sidebar-dropdown-divider"></div>

                            <button className="sidebar-dropdown-item logout-item" onClick={handleLogout}>
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
