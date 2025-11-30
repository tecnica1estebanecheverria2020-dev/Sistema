import { FiPackage, FiSave, FiX } from "react-icons/fi";
import Modal from "../../shared/components/Modal/Modal";
import CustomSelect from "./CustomSelect";

export default function ModalProduct({ setIsModalOpen, currentItem, handleSubmit, formData, setFormData }) {

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
            <button
                type="submit"
                form="inventory-form"
                className="modal-btn modal-btn-primary"
            >
                <FiSave />
                {currentItem ? 'Actualizar' : 'Agregar'}
            </button>
        </>
    );

    return (
        <Modal
            isOpen={true}
            onClose={() => setIsModalOpen(false)}
            title={currentItem ? 'Editar Ítem del Inventario' : 'Agregar Nuevo Ítem'}
            icon={FiPackage}
            footer={footer}
        >
            <form id="inventory-form" onSubmit={onSubmit} className="inventory-modal-form">
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
                            rows="4"
                        />
                    </div>
                </div>
            </form>
        </Modal>
    )
}
