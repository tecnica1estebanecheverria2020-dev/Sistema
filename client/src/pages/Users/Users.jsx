import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiX, FiUsers } from 'react-icons/fi';
import { useUsers } from '../../shared/hooks/useUsers';
import { rolesService } from '../../shared/services/rolesService';
import './style.css';

export default function Users() {
    const { users, loading, error, fetchUsers, createUser, updateUser, deleteUser, toggleUser, getUserById } = useUsers();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [availableRoles, setAvailableRoles] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        tel: '',
        active: 1,
        password: '', // requerido solo en creación
        roles: []
    });

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        const loadRoles = async () => {
            try {
                const roles = await rolesService.getRoles();
                setAvailableRoles(roles);
            } catch (e) {
                // En caso de error, dejamos la lista vacía. El error global del hook cubrirá feedback.
                setAvailableRoles([]);
            }
        };
        loadRoles();
    }, []);

    const filteredUsers = users.filter(user => {
        const rolesText = Array.isArray(user.roles_names) ? user.roles_names.join(', ') : '';
        return (
            String(user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            rolesText.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        let ok = false;
        if (editingUser) {
            const payload = { ...formData };
            // no enviar password vacía en actualización
            if (!payload.password) delete payload.password;
            ok = await updateUser(editingUser.id_user, payload);
        } else {
            const payload = { ...formData };
            ok = await createUser(payload);
        }
        if (ok) {
            resetForm();
            setIsModalOpen(false);
        }
    };

    const handleEdit = async (user) => {
        setEditingUser(user);
        // Intentamos obtener el detalle con IDs de roles
        let rolesIds = [];
        try {
            const detail = await getUserById(user.id_user);
            if (detail && Array.isArray(detail.roles_ids)) {
                rolesIds = detail.roles_ids.map((r) => Number(r));
            } else if (Array.isArray(user.roles_names) && availableRoles.length > 0) {
                // Fallback: mapear por nombre si no hay roles_ids
                const nameSet = new Set(user.roles_names);
                rolesIds = availableRoles
                    .filter((r) => nameSet.has(r.name))
                    .map((r) => Number(r.id_role));
            }
        } catch (_) {
            // Si falla, dejamos roles vacío
            rolesIds = [];
        }

        setFormData({
            name: user.name,
            email: user.email,
            tel: user.tel || '',
            active: Number(user.active) ? 1 : 0,
            password: '',
            roles: rolesIds
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (user) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${user.name}?`)) {
            await deleteUser(user.id_user);
        }
    };

    const handleToggle = async (user) => {
        await toggleUser(user.id_user);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            tel: '',
            active: 1,
            password: '',
            roles: []
        });
        setEditingUser(null);
    };

    const getEstadoLabel = (active) => (Number(active) ? 'Activo' : 'Inactivo');
    const getEstadoClass = (active) => (Number(active) ? 'active' : 'inactive');

    const handleRoleToggle = (roleId) => {
        const id = Number(roleId);
        setFormData((prev) => {
            const exists = prev.roles.includes(id);
            return {
                ...prev,
                roles: exists ? prev.roles.filter((r) => r !== id) : [...prev.roles, id]
            };
        });
    };

    return (
        <div className="config-container">
            {/* Gestión de Usuarios */}
            <div className="config-section">
                <div className="section-header">
                    <div className="section-title-container">
                        <FiUsers className="section-icon" />
                        <div>
                            <h2 className="section-title">Gestión de Usuarios</h2>
                            <p className="section-subtitle">Administra la lista de usuarios autorizados</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setIsModalOpen(true);
                        }}
                        className="config-add-button"
                    >
                        <FiPlus className="config-add-icon" />
                        Agregar user
                    </button>
                </div>

                {/* Filtros */}
                <div className="config-filters">
                    <div className="config-search-container">
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o roles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="config-search-input"
                        />
                    </div>

                    <div className="config-results-count">
                        <span className="config-count-text">Total: {filteredUsers.length} usuarios</span>
                    </div>
                </div>

                {loading && (
                    <div className="config-info">
                        <span>Cargando usuarios...</span>
                    </div>
                )}
                {error && (
                    <div className="config-error">
                        <span>Error: {error}</span>
                    </div>
                )}

                {/* Tabla de Usuarios */}
                <div className="config-table-container">
                    {filteredUsers.length === 0 ? (
                        <div className="config-empty-state">
                            <FiUsers className="config-empty-icon" />
                            <p>No se encontraron usuarios</p>
                            <p className="config-empty-subtitle">
                                {searchTerm ? 'Intenta ajustar los filtros' : 'Comienza agregando un usuario'}
                            </p>
                        </div>
                    ) : (
                        <table className="config-table">
                            <thead className="config-table-header">
                                <tr className="config-table-row">
                                    <th className="config-table-cell config-header-cell">name</th>
                                    <th className="config-table-cell config-header-cell">Email</th>
                                    <th className="config-table-cell config-header-cell">Teléfono</th>
                                    <th className="config-table-cell config-header-cell">Roles</th>
                                    <th className="config-table-cell config-header-cell">Estado</th>
                                    <th className="config-table-cell config-header-cell">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="config-table-body">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id_user} className="config-table-row">
                                        <td className="config-table-cell">
                                            <div className="config-user-name">
                                                <span className="config-name-text">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="config-table-cell">
                                            <span className="config-email-text">{user.email}</span>
                                        </td>
                                        <td className="config-table-cell">
                                            <span className="config-phone-text">{user.tel || ''}</span>
                                        </td>
                                        <td className="config-table-cell">
                                            <span className="config-specialty-badge">{Array.isArray(user.roles_names) ? user.roles_names.join(', ') : ''}</span>
                                        </td>
                                        <td className="config-table-cell">
                                            <span className={`config-state-badge ${getEstadoClass(user.active)}`}>
                                                {getEstadoLabel(user.active)}
                                            </span>
                                        </td>
                                        <td className="config-table-cell">
                                            <div className="config-actions-container">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="config-action-button config-edit-button"
                                                    title="Editar"
                                                >
                                                    <FiEdit2 />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user)}
                                                    className="config-action-button config-delete-button"
                                                    title="Eliminar"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                                <button
                                                    onClick={() => handleToggle(user)}
                                                    className="config-action-button"
                                                    title="Activar/Desactivar"
                                                >
                                                    {Number(user.active) ? 'Desactivar' : 'Activar'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal para Agregar/Editar usuario */}
            {isModalOpen && (
                <div className="config-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="config-modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="config-modal-header">
                            <div className="config-modal-header-content">
                                <div className="config-modal-icon">
                                    <FiUser />
                                </div>
                                <div className="config-modal-header-text">
                                    <h3 className="config-modal-title">
                                        {editingUser ? 'Editar usuario' : 'Agregar usuario'}
                                    </h3>
                                    <p className="config-modal-subtitle">
                                        {editingUser ? 'Modifica los datos del usuario' : 'Completa la información del nuevo usuario'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="config-close-button"
                            >
                                <FiX />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="config-modal-form">
                            <div className="config-form-grid">
                                <div className="config-form-group">
                                    <label className="config-form-label">name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="config-form-input"
                                        required
                                    />
                                </div>

                                <div className="config-form-group config-form-group-full">
                                    <label className="config-form-label">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="config-form-input"
                                        required
                                    />
                                </div>

                                <div className="config-form-group">
                                    <label className="config-form-label">Teléfono</label>
                                    <input
                                        type="tel"
                                        value={formData.tel}
                                        onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                                        className="config-form-input"
                                    />
                                </div>

                                <div className="config-form-group config-form-group-full">
                                    <label className="config-form-label">Roles</label>
                                    <div className="roles-select-container">
                                        <div className="roles-list">
                                            {availableRoles.length === 0 ? (
                                                <span style={{ color: '#64748b', fontSize: '12px' }}>
                                                    No hay roles disponibles
                                                </span>
                                            ) :
                                                availableRoles.map((role) => {
                                                    const id = Number(role.id_role);
                                                    const checked = formData.roles.includes(id);
                                                    return (
                                                        <label key={id} className="role-chip">
                                                            <input
                                                                type="checkbox"
                                                                className="role-checkbox"
                                                                checked={checked}
                                                                onChange={() => handleRoleToggle(id)}
                                                            />
                                                            {role.name}
                                                        </label>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>

                                <div className="config-form-group config-form-group-full">
                                    <label className="config-form-label">Estado</label>
                                    <select
                                        value={String(formData.active)}
                                        onChange={(e) => setFormData({ ...formData, active: Number(e.target.value) })}
                                        className="config-form-select"
                                        required
                                    >
                                        <option value="1">Activo</option>
                                        <option value="0">Inactivo</option>
                                    </select>
                                </div>

                                {/* Password: requerido solo en creación */}
                                {!editingUser && (
                                    <div className="config-form-group config-form-group-full">
                                        <label className="config-form-label">Contraseña</label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="config-form-input"
                                            required
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="config-modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="config-cancel-button"
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="config-submit-button">
                                    {editingUser ? 'Actualizar' : 'Agregar'} usuario
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
