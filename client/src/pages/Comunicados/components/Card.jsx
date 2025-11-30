import { FiUser, FiCalendar, FiChevronDown, FiChevronUp, FiEye, FiImage, FiTrash2 } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';

export default function Card({ comunicado, isExpanded, onToggle, onView, onDelete, stripHtml }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isExpanded, comunicado.contenido]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={`comunicados-card ${isExpanded ? 'expanded' : ''}`}>
      {comunicado.imagenHeader && (
        <div className="comunicados-card-header-image">
          <img
            src={comunicado.imagenHeader}
            alt={comunicado.titulo}
            onLoad={() => setImageLoaded(true)}
            className={imageLoaded ? 'loaded' : ''}
          />
          <div className="comunicados-card-image-overlay">
            <div className="comunicados-card-image-badge">
              <FiImage />
            </div>
          </div>
        </div>
      )}
      <div className="comunicados-card-content">
        <div className="comunicados-card-meta">
          <span className={`comunicados-type-badge ${comunicado.tipo.toLowerCase()}`}>
            {comunicado.tipo}
          </span>
          <div className="comunicados-card-info">
            <div className="comunicados-info-item">
              <FiUser className="comunicados-info-icon" />
              <span>{comunicado.autor}</span>
            </div>
            <div className="comunicados-info-divider" />
            <div className="comunicados-info-item">
              <FiCalendar className="comunicados-info-icon" />
              <span>{formatDate(comunicado.fecha)}</span>
            </div>
          </div>
        </div>

        <h3 className="comunicados-card-title">{comunicado.titulo}</h3>

        <div
          ref={contentRef}
          className="comunicados-card-preview"
          style={{
            maxHeight: isExpanded ? `${contentHeight}px` : '80px',
            overflow: 'hidden',
            transition: 'max-height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: isExpanded ? comunicado.contenido : stripHtml(comunicado.contenido).substring(0, 200) + '...'
            }}
          />
        </div>

        {comunicado.galeria && comunicado.galeria.length > 0 && (
          <div
            className={`comunicados-gallery-preview ${isExpanded ? 'visible' : 'hidden'}`}
            style={{
              maxHeight: isExpanded ? '400px' : '0',
              opacity: isExpanded ? 1 : 0,
              marginTop: isExpanded ? '1.25rem' : '0',
              transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            {comunicado.galeria.slice(0, 4).map((img, index) => (
              <div
                key={index}
                className="comunicados-gallery-item"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <img src={img} alt={`Galería ${index + 1}`} />
              </div>
            ))}
            {comunicado.galeria.length > 4 && (
              <div
                className="comunicados-gallery-more"
                style={{
                  animationDelay: '0.4s'
                }}
              >
                <span>+{comunicado.galeria.length - 4}</span>
                <small>más imágenes</small>
              </div>
            )}
          </div>
        )}

        <div className="comunicados-card-actions">
          <button
            onClick={onToggle}
            className="comunicados-expand-button"
            aria-expanded={isExpanded}
          >
            <span className={`comunicados-button-icon ${isExpanded ? 'rotated' : ''}`}>
              {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
            </span>
            <span>{isExpanded ? 'Contraer' : 'Expandir'}</span>
          </button>
          <button onClick={onView} className="comunicados-view-button">
            <FiEye />
            <span>Vista Previa</span>
          </button>
          <button onClick={onDelete} className="comunicados-delete-button" title="Eliminar">
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
}