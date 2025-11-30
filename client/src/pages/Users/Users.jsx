import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import { useUsers } from '../../shared/hooks/useUsers';
import { useRoles } from '../../shared/hooks/useRoles';
import ModalUser from './ModalUser';
import './style.css';
import Section from '../../shared/components/Section/Section.jsx';
import DataTable from '../../shared/components/DataTable/DataTable.jsx';

export default function Users() {
    const { users, loading, error, fetchUsers, createUser, updateUser, deleteUser, toggleUser, getUserById } = useUsers();
    const { roles, rolesLoading, rolesError, fetchRoles } = useRoles();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
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
        fetchRoles();
    }, [fetchRoles]);

    const filteredUsers = users.filter(user => {
        const rolesText = Array.isArray(user.roles) ? user.roles.map(r => r.name).join(', ') : '';
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
            if (!payload.password) delete payload.password; // no enviar password vacía
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
        let rolesObjs = [];
        try {
            const detail = await getUserById(user.id_user);
            if (detail && Array.isArray(detail.roles)) {
                rolesObjs = detail.roles;
            } else if (Array.isArray(user.roles)) {
                rolesObjs = user.roles;
            }
        } catch (_) {
            rolesObjs = Array.isArray(user.roles) ? user.roles : [];
        }

        setFormData({
            name: user.name,
            email: user.email,
            tel: user.tel || '',
            active: Number(user.active) ? 1 : 0,
            password: '',
            roles: rolesObjs
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

    // Componente de acciones para DataTable
    const UserActions = ({ row }) => (
        <div className="config-actions-container">
            <button
                onClick={() => handleEdit(row)}
                className="config-action-button config-edit-button"
                title="Editar"
            >
                <FiEdit2 />
            </button>
            <button
                onClick={() => handleDelete(row)}
                className="config-action-button config-delete-button"
                title="Eliminar"
            >
                <FiTrash2 />
            </button>
            <button
                onClick={() => handleToggle(row)}
                className="config-action-button"
                title="Activar/Desactivar"
            >
                {Number(row.active) ? 'Desactivar' : 'Activar'}
            </button>
        </div>
    );

    const handleRoleToggle = (roleId) => {
        const id = Number(roleId);
        setFormData((prev) => {
            const exists = prev.roles.some((r) => Number(r?.id_role) === id);
            const nextRoles = exists
                ? prev.roles.filter((r) => Number(r?.id_role) !== id)
                : (() => {
                    const obj = roles.find((rr) => Number(rr?.id_role) === id);
                    return obj ? [...prev.roles, obj] : prev.roles;
                })();
            return { ...prev, roles: nextRoles };
        });
    };

    return (
        <Section
            title="Gestión de Usuarios"
            subtitle="Administra la lista de usuarios autorizados"
            icon={FiUsers}
            onAdd={() => {
                resetForm();
                setIsModalOpen(true);
            }}
            addButtonText="Agregar Usuario"
        >
            <div className="config-section">

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
                <DataTable
                    data={filteredUsers}
                    columns={[
                        {
                            key: 'name',
                            label: 'Nombre',
                            type: 'string',
                            render: (value) => (
                                <div className="config-user-name">
                                    <span className="config-name-text">{value}</span>
                                </div>
                            )
                        },
                        {
                            key: 'email',
                            label: 'Email',
                            type: 'string',
                            render: (value) => <span className="config-email-text">{value}</span>
                        },
                        {
                            key: 'tel',
                            label: 'Teléfono',
                            type: 'string',
                            render: (value) => <span className="config-phone-text">{value || ''}</span>
                        },
                        {
                            key: 'roles',
                            label: 'Roles',
                            type: 'string',
                            sortable: false,
                            render: (value) => (
                                <span className="config-specialty-badge">
                                    {Array.isArray(value) ? value.map(r => r.name).join(', ') : ''}
                                </span>
                            )
                        },
                        {
                            key: 'active',
                            label: 'Estado',
                            type: 'number',
                            render: (value) => (
                                <span className={`config-state-badge ${getEstadoClass(value)}`}>
                                    {getEstadoLabel(value)}
                                </span>
                            )
                        }
                    ]}
                    actions={<UserActions />}
                    itemsPerPage={10}
                    keyField="id_user"
                    emptyState={
                        <div className="config-empty-state">
                            <FiUsers className="config-empty-icon" />
                            <p>No se encontraron usuarios</p>
                            <p className="config-empty-subtitle">
                                {searchTerm ? 'Intenta ajustar los filtros' : 'Comienza agregando un usuario'}
                            </p>
                        </div>
                    }
                />
            </div>

            {/* Modal para Agregar/Editar usuario */}
            {isModalOpen && (
                <ModalUser
                    setIsModalOpen={setIsModalOpen}
                    editingUser={editingUser}
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                    availableRoles={roles}
                    rolesLoading={rolesLoading}
                    rolesError={rolesError}
                    onToggleRole={handleRoleToggle}
                />
            )}
        </Section>
    );
}
