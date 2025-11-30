import { FiX, FiUser, FiCalendar, FiEye } from 'react-icons/fi';
import Modal from '../../../shared/components/Modal/Modal';

export default function ViewModal({ isOpen, comunicado, onClose }) {
  if (!isOpen || !comunicado) return null;

  const footer = (
    <button type="button" onClick={onClose} className="modal-btn modal-btn-secondary">
      <FiX />
      Cerrar
    </button>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={comunicado.titulo}
      icon={FiEye}
      footer={footer}
    >
      <div 
        className="comunicados-view-wrapper"
        style={{
          backgroundColor: comunicado.bgColor || '#ffffff',
          backgroundImage: comunicado.bgImage ? `url(${comunicado.bgImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
      {comunicado.bgImage && comunicado.bgOpacity > 0 && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: comunicado.bgColor || '#ffffff',
          opacity: comunicado.bgOpacity,
          pointerEvents: 'none',
          zIndex: 1
        }} />
      )}
      <div style={{ position: 'relative', zIndex: 2 }}>
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
        <div className="comunicados-view-text" dangerouslySetInnerHTML={{ __html: comunicado.contenido }} />
        
        {/* Exámenes (previas) */}
        {comunicado.examenes && comunicado.examenes.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#212529' }}>Cronograma de Exámenes</h3>
            <div className="exam-grid">
              {comunicado.examenes.map((examen, idx) => (
                <div key={idx} className="exam-card">
                  <div className="exam-header">
                    <span className="exam-subject">{examen.materia}</span>
                    {examen.año && <span className="doc-badge badge-red" style={{ margin: 0, fontSize: '0.7rem' }}>{examen.año}</span>}
                  </div>
                  <div className="exam-details">
                    <div className="exam-detail-item"> {examen.fecha}</div>
                    <div className="exam-detail-item"> {examen.hora}</div>
                    <div className="exam-detail-item"> {examen.aula}</div>
                    <div className="exam-detail-item"> {examen.profesor}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Imágenes Flotantes */}
        {comunicado.imagenes && comunicado.imagenes.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt=""
            style={{
              position: 'absolute',
              left: img.x,
              top: img.y,
              width: img.w,
              height: img.h,
              objectFit: 'cover',
              borderRadius: '8px',
              zIndex: img.z || 10,
              pointerEvents: 'none'
            }}
          />
        ))}

        {comunicado.links && comunicado.links.length > 0 && (
          <div className="comunicados-view-links" style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Enlaces relacionados</h3>
            {comunicado.links.map((link, idx) => (
              <div key={idx} style={{ marginBottom: '0.5rem' }}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#6b1426', textDecoration: 'underline', fontWeight: 600 }}>
                  {link.label}
                </a>
              </div>
            ))}
          </div>
        )}

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
    </Modal>
  );
}