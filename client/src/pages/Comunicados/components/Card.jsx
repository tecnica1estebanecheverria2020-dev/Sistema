import { FiUser, FiCalendar, FiChevronDown, FiChevronUp, FiEye } from 'react-icons/fi';

export default function Card({ comunicado, isExpanded, onToggle, onView, stripHtml }) {
  return (
    <div className="comunicados-card">
      {comunicado.imagenHeader && (
        <div className="comunicados-card-header-image">
          <img src={comunicado.imagenHeader} alt={comunicado.titulo} />
        </div>
      )}
      <div className="comunicados-card-content">
        <div className="comunicados-card-meta">
          <span className={`comunicados-type-badge ${comunicado.tipo.toLowerCase()}`}>{comunicado.tipo}</span>
          <div className="comunicados-card-info">
            <FiUser className="comunicados-info-icon" />
            <span>{comunicado.autor}</span>
            <FiCalendar className="comunicados-info-icon" />
            <span>{comunicado.fecha}</span>
          </div>
        </div>
        <h3 className="comunicados-card-title">{comunicado.titulo}</h3>
        <div className="comunicados-card-preview">
          <div
            dangerouslySetInnerHTML={{
              __html: isExpanded ? comunicado.contenido : stripHtml(comunicado.contenido).substring(0, 200) + '...'
            }}
          />
        </div>
        {comunicado.galeria && comunicado.galeria.length > 0 && isExpanded && (
          <div className="comunicados-gallery-preview">
            {comunicado.galeria.slice(0, 3).map((img, index) => (
              <img key={index} src={img} alt={`Galería ${index + 1}`} />
            ))}
            {comunicado.galeria.length > 3 && (
              <div className="comunicados-gallery-more">+{comunicado.galeria.length - 3} más</div>
            )}
          </div>
        )}
        <div className="comunicados-card-actions">
          <button onClick={onToggle} className="comunicados-expand-button">
            {isExpanded ? (
              <>
                <FiChevronUp />
                Contraer
              </>
            ) : (
              <>
                <FiChevronDown />
                Expandir
              </>
            )}
          </button>
          <button onClick={onView} className="comunicados-view-button">
            <FiEye />
            Vista Previa
          </button>
        </div>
      </div>
    </div>
  );
}