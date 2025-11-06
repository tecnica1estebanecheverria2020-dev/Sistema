import React, { useState, useEffect } from 'react';
import { FiSettings, FiPlus, FiEdit2, FiTrash2, FiUser, FiX, FiUsers } from 'react-icons/fi';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        telefono: '',
        especialidad: '',
        estado: 'Activo'
    });

    // Datos de ejemplo para users
    useEffect(() => {
        setUsers([
            {
                id: 1,
                name: 'Juan',
                apellido: 'Pérez',
                email: 'juan.perez@escuela.edu',
                telefono: '123-456-7890',
                especialidad: 'Matemáticas',
                estado: 'Activo'
            },
            {
                id: 2,
                name: 'María',
                apellido: 'García',
                email: 'maria.garcia@escuela.edu',
                telefono: '098-765-4321',
                especialidad: 'Ciencias',
                estado: 'Activo'
            },
            {
                id: 3,
                name: 'Carlos',
                apellido: 'López',
                email: 'carlos.lopez@escuela.edu',
                telefono: '555-123-4567',
                especialidad: 'Historia',
                estado: 'Inactivo'
            }
        ]);
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingUser) {
            // Editar user existente
            setUsers(users.map(user =>
                user.id === editingUser.id
                    ? { ...formData, id: editingUser.id }
                    : user
            ));
        } else {
            // Agregar nuevo usuario
            const newUser = {
                ...formData,
                id: Math.max(...users.map(p => p.id), 0) + 1
            };
            setUsers([...users, newUser]);
        }

        resetForm();
        setIsModalOpen(false);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            telefono: user.telefono,
            especialidad: user.especialidad,
            estado: user.estado
        });
        setIsModalOpen(true);
    };

    const handleDelete = (user) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${user.name}?`)) {
            setUsers(users.filter(p => p.id !== user.id));
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            telefono: '',
            especialidad: '',
            estado: 'Activo'
        });
        setEditingUser(null);
    };

    const getEstadoClass = (estado) => {
        switch (estado.toLowerCase()) {
            case 'activo':
                return 'active';
            case 'inactivo':
                return 'inactive';
            default:
                return '';
        }
    };

    return (
        <div>
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
                            placeholder="Buscar por name, email o especialidad..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="config-search-input"
                        />
                    </div>

                    <div className="config-results-count">
                        <span className="config-count-text">Total: {filteredUsers.length} usuarios</span>
                    </div>
                </div>

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
                                    <th className="config-table-cell config-header-cell">Especialidad</th>
                                    <th className="config-table-cell config-header-cell">Estado</th>
                                    <th className="config-table-cell config-header-cell">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="config-table-body">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="config-table-row">
                                        <td className="config-table-cell">
                                            <div className="config-user-name">
                                                <span className="config-name-text">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="config-table-cell">
                                            <span className="config-email-text">{user.email}</span>
                                        </td>
                                        <td className="config-table-cell">
                                            <span className="config-phone-text">{user.telefono}</span>
                                        </td>
                                        <td className="config-table-cell">
                                            <span className="config-specialty-badge">{user.especialidad}</span>
                                        </td>
                                        <td className="config-table-cell">
                                            <span className={`config-state-badge ${getEstadoClass(user.estado)}`}>
                                                {user.estado}
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
                                        value={formData.telefono}
                                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                        className="config-form-input"
                                        required
                                    />
                                </div>

                                <div className="config-form-group">
                                    <label className="config-form-label">Especialidad</label>
                                    <input
                                        type="text"
                                        value={formData.especialidad}
                                        onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                                        className="config-form-input"
                                        required
                                    />
                                </div>

                                <div className="config-form-group config-form-group-full">
                                    <label className="config-form-label">Estado</label>
                                    <select
                                        value={formData.estado}
                                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                        className="config-form-select"
                                        required
                                    >
                                        <option value="Activo">Activo</option>
                                        <option value="Inactivo">Inactivo</option>
                                    </select>
                                </div>
                            </div>

                            <div className="config-modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="config-cancel-button"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="config-submit-button"
                                >
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