import { FiX, FiBold, FiItalic, FiUnderline, FiList, FiAlignLeft, FiAlignCenter, FiAlignRight, FiImage } from 'react-icons/fi';

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
  return (
    <div className="comunicados-modal-overlay" onClick={onClose}>
      <div className="comunicados-create-modal" onClick={(e) => e.stopPropagation()}>
        <div className="comunicados-create-header">
          <h3 className="comunicados-create-title">Nuevo Comunicado</h3>
          <p className="comunicados-create-subtitle">Crea un anuncio con formato enriquecido e imágenes</p>
          <button onClick={onClose} className="comunicados-close-button">
            <FiX />
          </button>
        </div>
        <form onSubmit={onSubmit} className="comunicados-create-form">
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
          <div className="comunicados-form-actions">
            <button type="button" onClick={onClose} className="comunicados-cancel-button">Cancelar</button>
            <button type="submit" className="comunicados-submit-button">Crear Comunicado</button>
          </div>
        </form>
      </div>
    </div>
  );
}