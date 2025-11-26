import { FiUser, FiX } from "react-icons/fi";

export default function ModalUser({
    setIsModalOpen,
    editingUser,
    formData,
    setFormData,
    handleSubmit,
    availableRoles,
    rolesLoading,
    rolesError,
    onToggleRole,
}) {

    return (
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
                                    {rolesLoading ? (
                                        <span style={{ color: '#64748b', fontSize: '12px' }}>
                                            Cargando roles...
                                        </span>
                                    ) : rolesError ? (
                                        <span style={{ color: '#ef4444', fontSize: '12px' }}>
                                            Error al cargar roles: {rolesError}
                                        </span>
                                    ) : availableRoles.length === 0 ? (
                                        <span style={{ color: '#64748b', fontSize: '12px' }}>
                                            No hay roles disponibles
                                        </span>
                                    ) : (
                                        <>
                                            {availableRoles.map((role) => {
                                                const id = Number(role.id_role);
                                                const checked = Array.isArray(formData.roles) && formData.roles.some(r => Number(r?.id_role) === id);
                                                return (
                                                    <label key={id} className="role-chip">
                                                        <input
                                                            type="checkbox"
                                                            className="role-checkbox"
                                                            checked={checked}
                                                            onChange={() => onToggleRole(id)}
                                                            disabled={rolesLoading}
                                                        />
                                                        {role.name}
                                                    </label>
                                                );
                                            })}
                                        </>
                                    )}
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
    )
};
