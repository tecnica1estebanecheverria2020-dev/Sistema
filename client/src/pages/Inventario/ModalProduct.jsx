import { FiBox } from "react-icons/fi";
import CustomSelect from "./CustomSelect";

export default function ModalProduct({ setIsModalOpen, currentItem, handleSubmit, formData, setFormData }) {

    return (
        <div className="inventory-modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="inventory-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="inventory-modal-header">
                    <div className="inventory-modal-header-content">
                        <FiBox className="inventory-modal-icon" />
                        <div className="inventory-modal-header-text">
                            <h2 className="inventory-modal-title">
                                {currentItem ? 'Editar Ítem' : 'Agregar Ítem'}
                            </h2>
                            <p className="inventory-modal-subtitle">
                                {currentItem ? 'Modifica los datos del ítem' : 'Completa los datos del nuevo ítem'}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="inventory-modal-form">
                    <div className="inventory-form-grid">
                        <div className="inventory-form-group">
                            <label className="inventory-form-label">Código</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                                className="inventory-form-input"
                                placeholder="Ej: NB-001"
                                required
                            />
                        </div>

                        <div className="inventory-form-group">
                            <label className="inventory-form-label">Nombre del Ítem</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="inventory-form-input"
                                placeholder="Ej: Notebook HP ProBook"
                                required
                            />
                        </div>

                        <div className="inventory-form-group">
                            <label className="inventory-form-label">Categoría</label>
                            <CustomSelect
                                value={formData.category}
                                onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                                options={[
                                    { value: '', label: 'Seleccionar categoría' },
                                    { value: 'Computadoras', label: 'Computadoras' },
                                    { value: 'Periféricos', label: 'Periféricos' },
                                    { value: 'Mobiliario', label: 'Mobiliario' },
                                    { value: 'Electrónicos', label: 'Electrónicos' },
                                    { value: 'Otros', label: 'Otros' }
                                ]}
                                placeholder="Seleccionar categoría"
                                className="inventory-form-select"
                            />
                        </div>

                        <div className="inventory-form-group">
                            <label className="inventory-form-label">Estado</label>
                            <CustomSelect
                                value={formData.state}
                                onChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                                options={[
                                    { value: 'Disponible', label: 'Disponible' },
                                    { value: 'Mantenimiento', label: 'Mantenimiento' },
                                    { value: 'No disponible', label: 'No disponible' }
                                ]}
                                placeholder="Seleccionar estado"
                                className="inventory-form-select"
                            />
                        </div>

                        <div className="inventory-form-group">
                            <label className="inventory-form-label">Cantidad Total</label>
                            <input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                                className="inventory-form-input"
                                min="0"
                                required
                            />
                        </div>

                        <div className="inventory-form-group">
                            <label className="inventory-form-label">Cantidad Disponible</label>
                            <input
                                type="number"
                                value={formData.available}
                                onChange={(e) => setFormData(prev => ({ ...prev, available: parseInt(e.target.value) || 0 }))}
                                className="inventory-form-input"
                                min="0"
                                max={formData.amount}
                                required
                            />
                        </div>

                        <div className="inventory-form-group inventory-form-group-full">
                            <label className="inventory-form-label">Ubicación</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                className="inventory-form-input"
                                placeholder="Ej: Oficina 201, Estante A"
                            />
                        </div>

                        <div className="inventory-form-group inventory-form-group-full">
                            <label className="inventory-form-label">Descripción</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="inventory-form-textarea"
                                placeholder="Descripción detallada del ítem..."
                                rows="3"
                            />
                        </div>
                    </div>

                    <div className="inventory-modal-actions">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="inventory-cancel-button"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="inventory-submit-button"
                        >
                            {currentItem ? 'Actualizar' : 'Agregar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
