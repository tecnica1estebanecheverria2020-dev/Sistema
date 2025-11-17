import { FiX, FiUser, FiCalendar } from 'react-icons/fi';

export default function ViewModal({ isOpen, comunicado, onClose }) {
  if (!isOpen || !comunicado) return null;
  return (
    <div className="comunicados-modal-overlay" onClick={onClose}>
      <div className="comunicados-view-modal" onClick={(e) => e.stopPropagation()}>
        <div className="comunicados-view-header">
          <button onClick={onClose} className="comunicados-close-button">
            <FiX />
          </button>
        </div>
        {comunicado.imagenHeader && (
          <div className="comunicados-view-header-image">
            <img src={comunicado.imagenHeader} alt={comunicado.titulo} />
          </div>
        )}
        <div className="comunicados-view-content">
          <div className="comunicados-view-meta">
            <span className={`comunicados-type-badge ${comunicado.tipo.toLowerCase()}`}>{comunicado.tipo}</span>
            <div className="comunicados-view-info">
              <FiUser className="comunicados-info-icon" />
              <span>{comunicado.autor}</span>
              <FiCalendar className="comunicados-info-icon" />
              <span>{comunicado.fecha}</span>
            </div>
          </div>
          <h2 className="comunicados-view-title">{comunicado.titulo}</h2>
          <div className="comunicados-view-text" dangerouslySetInnerHTML={{ __html: comunicado.contenido }} />
          {comunicado.galeria && comunicado.galeria.length > 0 && (
            <div className="comunicados-view-gallery">
              <h3>Galería de Imágenes</h3>
              <div className="comunicados-gallery-grid">
                {comunicado.galeria.map((img, index) => (
                  <img key={index} src={img} alt={`Galería ${index + 1}`} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}