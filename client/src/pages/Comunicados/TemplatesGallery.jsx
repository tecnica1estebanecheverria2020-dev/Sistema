import { useNavigate } from 'react-router-dom';
import './style.css';

function TemplateCard({ title, children, onClick }) {
  return (
    <div className="comunicados-template-card template-select-card" onClick={onClick} role="button">
      <div className="comunicados-template-header">
        <h3 className="comunicados-template-title">{title}</h3>
      </div>
      <div className="comunicados-template-body">
        {children}
      </div>
    </div>
  );
}

export default function TemplatesGallery() {
  const navigate = useNavigate();
  const info = {
    titulo: 'Comunicado Oficial',
    contenido: '<p>Se informa a la comunidad educativa...</p>',
    links: [{ label: 'Sitio Oficial', url: 'https://www.ejemplo.edu' }],
    imagenes: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=60'],
  };
  const previas = {
    fechas: ['2025-03-01'],
    materias: ['Matemática I'],
    requisitos: 'DNI, Libreta, Constancia de alumno regular',
    contacto: { nombre: 'Secretaría', email: 'secretaria@ejemplo.edu', telefono: '123456789' },
  };
  const social = {
    mensaje: '¡Mirá las fotos del evento!',
    etiquetas: ['evento', 'comunidad', 'escuela'],
    galeria: [
      'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=600&q=60',
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=60',
    ],
  };

  return (
    <div className="comunicados-container">
      <div className="comunicados-header">
        <div className="comunicados-header-content">
          <h1 className="comunicados-title">Elige una plantilla</h1>
          <p className="comunicados-subtitle">Toca una card para comenzar a editar</p>
        </div>
      </div>
      <div className="comunicados-create-grid">
        <div className="comunicados-template-card create-card">
          <div className="create-card-content">
            <span className="create-card-icon">+</span>
            <div className="create-card-text">Crear uno</div>
          </div>
        </div>

        <TemplateCard title="Informativo" onClick={() => navigate('/comunicados/crear/informativo')}>
          <div className="comunicados-template-preview">
            <div className="comunicados-preview-header">
              <span className="comunicados-type-badge publicado">Informativo</span>
            </div>
            <h3 className="comunicados-card-title">{info.titulo}</h3>
            <div className="comunicados-view-text" dangerouslySetInnerHTML={{ __html: info.contenido }} />
            <div className="comunicados-preview-links">
              {info.links.map((l, i) => (
                <a key={i} href={l.url} className="comunicados-link" onClick={(e) => e.preventDefault()}>{l.label}</a>
              ))}
            </div>
            <div className="comunicados-gallery-preview-grid">
              {info.imagenes.map((img, i) => (
                <div key={i} className="comunicados-gallery-item">
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
        </TemplateCard>

        <TemplateCard title="Previas" onClick={() => navigate('/comunicados/crear/previas')}>
          <div className="comunicados-template-preview">
            <div className="comunicados-preview-header">
              <span className="comunicados-type-badge publicado">Inscripciones a Previas</span>
            </div>
            <h3 className="comunicados-card-title">Fechas</h3>
            <ul className="comunicados-list-simple">
              {previas.fechas.map((f, i) => (
                <li key={i} className="comunicados-list-item">{f}</li>
              ))}
            </ul>
            <h3 className="comunicados-card-title">Materias</h3>
            <ul className="comunicados-list-simple">
              {previas.materias.map((m, i) => (
                <li key={i} className="comunicados-list-item">{m}</li>
              ))}
            </ul>
            <h3 className="comunicados-card-title">Requisitos</h3>
            <p className="comunicados-view-text">{previas.requisitos}</p>
            <div className="comunicados-contact">
              <div>{previas.contacto.nombre}</div>
              <div>{previas.contacto.email}</div>
              <div>{previas.contacto.telefono}</div>
            </div>
          </div>
        </TemplateCard>

        <TemplateCard title="Social" onClick={() => navigate('/comunicados/crear/social')}>
          <div className="comunicados-template-preview">
            <div className="comunicados-preview-header">
              <span className="comunicados-type-badge publicado">Social</span>
            </div>
            <p className="comunicados-view-text">{social.mensaje}</p>
            <div className="comunicados-tags">
              {social.etiquetas.map((t, i) => (
                <span key={i} className="comunicados-tag">#{t}</span>
              ))}
            </div>
            <div className="comunicados-gallery-preview-grid">
              {social.galeria.map((img, i) => (
                <div key={i} className="comunicados-gallery-item">
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
        </TemplateCard>
      </div>
    </div>
  );
}