import { FiX, FiBold, FiItalic, FiUnderline, FiList, FiAlignLeft, FiAlignCenter, FiAlignRight, FiImage, FiMessageSquare, FiSave } from 'react-icons/fi';
import Modal from '../../../shared/components/Modal/Modal';

export default function CreateModal({
  isOpen,
  formData,
  setFormData,
  onClose,
  onSubmit,
  contentRef,
  applyFormat,
  addImageToGallery,
  removeImageFromGallery,
  handleContentChange,
}) {
  if (!isOpen) return null;

  const handleSubmitForm = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  const footer = (
    <>
      <button type="button" onClick={onClose} className="modal-btn modal-btn-secondary">
        <FiX />
        Cancelar
      </button>
      <button type="submit" form="comunicado-form" className="modal-btn modal-btn-primary">
        <FiSave />
        Crear Comunicado
      </button>
    </>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Nuevo Comunicado"
      icon={FiMessageSquare}
      footer={footer}
    >
      <form id="comunicado-form" onSubmit={handleSubmitForm} className="comunicados-create-form">
          <div className="comunicados-form-row">
            <div className="comunicados-form-group">
              <label className="comunicados-form-label">Título</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="comunicados-form-input"
                placeholder="Título del comunicado"
                required
              />
            </div>
            <div className="comunicados-form-group">
              <label className="comunicados-form-label">Autor</label>
              <input
                type="text"
                value={formData.autor}
                onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                className="comunicados-form-input"
                required
              />
            </div>
          </div>
          <div className="comunicados-form-row">
            <div className="comunicados-form-group">
              <label className="comunicados-form-label">Fecha Programada (opcional)</label>
              <input
                type="date"
                value={formData.fechaProgramada}
                onChange={(e) => setFormData({ ...formData, fechaProgramada: e.target.value })}
                className="comunicados-form-input"
              />
            </div>
            <div className="comunicados-form-group">
              <label className="comunicados-form-label">Estado</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="comunicados-form-select"
              >
                <option value="Publicado">Publicado</option>
                <option value="Borrador">Guardar como Borrador</option>
              </select>
            </div>
          </div>
          <div className="comunicados-form-group">
            <label className="comunicados-form-label">Imagen Header (URL)</label>
            <input
              type="url"
              value={formData.imagenHeader}
              onChange={(e) => setFormData({ ...formData, imagenHeader: e.target.value })}
              className="comunicados-form-input"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
          <div className="comunicados-form-group">
            <label className="comunicados-form-label">Contenido</label>
            <div className="comunicados-editor">
              <div className="comunicados-editor-toolbar">
                <button type="button" onClick={() => applyFormat('bold')} className="comunicados-toolbar-button">
                  <FiBold />
                </button>
                <button type="button" onClick={() => applyFormat('italic')} className="comunicados-toolbar-button">
                  <FiItalic />
                </button>
                <button type="button" onClick={() => applyFormat('underline')} className="comunicados-toolbar-button">
                  <FiUnderline />
                </button>
                <div className="comunicados-toolbar-separator"></div>
                <button type="button" onClick={() => applyFormat('insertUnorderedList')} className="comunicados-toolbar-button">
                  <FiList />
                </button>
                <button type="button" onClick={() => applyFormat('justifyLeft')} className="comunicados-toolbar-button">
                  <FiAlignLeft />
                </button>
                <button type="button" onClick={() => applyFormat('justifyCenter')} className="comunicados-toolbar-button">
                  <FiAlignCenter />
                </button>
                <button type="button" onClick={() => applyFormat('justifyRight')} className="comunicados-toolbar-button">
                  <FiAlignRight />
                </button>
              </div>
              <div
                ref={contentRef}
                contentEditable
                onInput={handleContentChange}
                className="comunicados-editor-content"
                placeholder="Escribe el contenido del comunicado aquí..."
                dangerouslySetInnerHTML={{ __html: formData.contenido }}
              />
            </div>
          </div>
          <div className="comunicados-form-group">
            <label className="comunicados-form-label">Galería de Imágenes</label>
            <div className="comunicados-gallery-manager">
              <button type="button" onClick={addImageToGallery} className="comunicados-add-image-button">
                <FiImage />
                Agregar Imagen
              </button>
              {formData.galeria.length > 0 && (
                <div className="comunicados-gallery-preview-grid">
                  {formData.galeria.map((img, index) => (
                    <div key={index} className="comunicados-gallery-item">
                      <img src={img} alt={`Galería ${index + 1}`} />
                      <button type="button" onClick={() => removeImageFromGallery(index)} className="comunicados-remove-image">
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>
    </Modal>
  );
}