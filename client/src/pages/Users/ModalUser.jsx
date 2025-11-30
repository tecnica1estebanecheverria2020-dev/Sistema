import { FiUser, FiX, FiSave } from "react-icons/fi";
import Modal from "../../shared/components/Modal/Modal";

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
    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit(e);
    };

    const footer = (
        <>
            <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="modal-btn modal-btn-secondary"
            >
                <FiX />
                Cancelar
            </button>
            <button type="submit" form="user-form" className="modal-btn modal-btn-primary">
                <FiSave />
                {editingUser ? 'Actualizar' : 'Agregar'} usuario
            </button>
        </>
    );

    return (
        <Modal
            isOpen={true}
            onClose={() => setIsModalOpen(false)}
            title={editingUser ? 'Editar Usuario' : 'Agregar Usuario'}
            icon={FiUser}
            footer={footer}
        >
            <form id="user-form" onSubmit={onSubmit} className="config-modal-form">
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
                </form>
        </Modal>
    )
};
