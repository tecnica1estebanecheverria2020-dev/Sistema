import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiFileText, FiBookOpen, FiImage, FiArrowRight, FiCheck, FiCalendar, FiMail, FiPhone, FiMapPin, FiClock, FiUsers } from 'react-icons/fi';
import './style.css';

function TemplateCard({ title, description, icon: Icon, children, onClick, delay = 0 }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`template-select-card ${isHovered ? 'hovered' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="template-card-header">
        <div className="template-icon-wrapper">
          <Icon className="template-icon" />
        </div>
        <div className="template-info">
          <h3 className="template-name">{title}</h3>
          <p className="template-description">{description}</p>
        </div>
      </div>

      <div className="template-preview-wrapper">
        {children}
      </div>

      <div className="template-action-overlay">
        <div className="template-action-content">
          <span className="template-action-text">Usar plantilla</span>
          <FiArrowRight className="template-action-icon" />
        </div>
      </div>
    </div>
  );
}

export default function TemplatesGallery() {
  const navigate = useNavigate();

  const info = {
    titulo: 'Actualización Normativa Institucional',
    content: `<div class="doc-badge badge-blue">📋 Comunicado Oficial</div>
<h1 class="doc-title">Actualización Normativa Institucional</h1>
<p><strong>Estimada Comunidad Educativa:</strong></p>
<p>Se informa que a partir del próximo ciclo lectivo, se implementarán nuevas normativas de convivencia digital y uso responsable de tecnología en el ámbito educativo.</p>
<div class="doc-alert alert-info">
  <strong>ℹ️ Información importante:</strong> Las nuevas normativas entran en vigencia a partir del 1 de Marzo de 2025.
</div>
<h3>Principales Cambios</h3>
<ul class="doc-list">
  <li>✓ Uso de dispositivos móviles durante horario lectivo</li>
  <li>✓ Protocolo de comunicación digital estudiante-docente</li>
  <li>✓ Normas de comportamiento en plataformas virtuales</li>
</ul>`
  };

  const previas = {
    titulo: 'Inscripciones a Previas',
    content: `<div class="doc-badge badge-purple">📚 Exámenes Previas</div>
<h1 class="doc-title">Inscripción a Exámenes de Previas - Marzo 2025</h1>
<p>Se informa a todos los estudiantes que el período de inscripción a exámenes de materias previas correspondientes al turno de Marzo 2025 se encuentra abierto.</p>
<div class="doc-alert alert-warning">
  <strong>⚠️ Importante:</strong> La inscripción cierra el 25 de Febrero de 2025 a las 18:00 hs.
</div>
<h3>Requisitos</h3>
<p>Para inscribirse, los alumnos deben presentar la solicitud en secretaría o completar el formulario online.</p>`
  };

  const social = {
    titulo: 'Evento Social',
    content: `<div class="doc-badge badge-pink">🎉 Evento Social</div>
<h1 class="doc-title">Semana de la Cultura y el Deporte 2025</h1>
<p>¡Nos complace invitarlos a participar de nuestra tradicional Semana de la Cultura y el Deporte!</p>
<div class="doc-card">
  <h4>🎭 Actividades Culturales</h4>
  <p>Exposiciones de arte, obras de teatro y conciertos musicales protagonizados por nuestros estudiantes.</p>
</div>
<div class="doc-card">
  <h4>⚽ Torneos Deportivos</h4>
  <p>Fútbol, vóley, básquet y atletismo. ¡Inscribe a tu equipo!</p>
</div>`
  };

  const urgente = {
    titulo: 'Aviso Urgente',
    content: `<div class="doc-alert alert-warning"><strong>⚠️ AVISO URGENTE:</strong> Suspensión de actividades.</div>
<h1 class="doc-title">Suspensión de Clases por Clima Severo</h1>
<p>Debido a la alerta meteorológica emitida por el Servicio Meteorológico Nacional, se suspenden todas las actividades presenciales para el día de la fecha.</p>
<p>Se solicita a las familias permanecer atentas a los canales oficiales de comunicación para futuras actualizaciones.</p>`
  };

  const institucional = {
    titulo: 'Comunicado Institucional',
    content: `<div class="doc-badge badge-blue">🏛️ Institucional</div>
<h1 class="doc-title">Aniversario de la Institución</h1>
<p>Celebramos 50 años de excelencia educativa formando líderes del mañana.</p>
<blockquote class="doc-quote">"La educación es el arma más poderosa que puedes usar para cambiar el mundo."<footer>— Nelson Mandela</footer></blockquote>
<p>Invitamos a toda la comunidad a los actos conmemorativos.</p>
<div class="doc-footer" style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; font-size: 0.9rem; color: #666;"><p><strong>Contacto:</strong> direccion@institucion.edu.ar</p><p><em>Equipo Directivo</em></p></div>`
  };

  const deportivo = {
    titulo: 'Noticias Deportivas',
    content: `<div class="doc-badge badge-green">🏆 Deportes</div>
<h1 class="doc-title">Resultados Intercolegiales 2025</h1>
<p>Felicitamos a nuestros equipos representativos por su destacado desempeño en las competencias regionales.</p>
<div class="doc-card">
  <h4>🥇 Primer Puesto - Vóley Masculino</h4>
  <p>El equipo sub-18 se consagró campeón invicto del torneo regional.</p>
</div>
<div style="text-align: center; margin: 1.5rem 0;"><a href="#" class="doc-button" style="display: inline-block; padding: 0.75rem 1.5rem; background-color: #2b8a3e; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">Ver Tabla de Posiciones</a></div>`
  };

  return (
    <div className="templates-gallery-container">
      <div className="templates-hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Crear Comunicado</h1>
          <p className="hero-subtitle">Elige una plantilla para comenzar o crea desde cero</p>
        </div>
      </div>

      <div className="templates-showcase">
        <div className="template-card-wrapper">
          <TemplateCard
            title="Sin Plantilla"
            description="Comienza desde cero con un documento en blanco"
            icon={FiFileText}
            onClick={() => navigate('/comunicados/crear/blank')}
            delay={0}
          >
          <div className="template-content-preview">
            <div className="preview-empty-template">
              <FiFileText className="empty-icon" />
              <p className="empty-text">Documento en blanco</p>
              <p className="empty-hint">Máxima libertad creativa</p>
            </div>
          </div>
          </TemplateCard>
        </div>

        <div className="template-card-wrapper">
          <TemplateCard
            title="Informativo"
            description="Para anuncios oficiales y actualizaciones"
            icon={FiFileText}
            onClick={() => navigate('/comunicados/crear/informativo')}
            delay={0.1}
          >
          <div className="template-content-preview">
            <div className="preview-text" dangerouslySetInnerHTML={{ __html: info.content }} />
          </div>
          </TemplateCard>
        </div>

        <div className="template-card-wrapper">
          <TemplateCard
            title="Previas"
            description="Inscripciones y cronogramas de exámenes"
            icon={FiBookOpen}
            onClick={() => navigate('/comunicados/crear/previas')}
            delay={0.2}
          >
          <div className="template-content-preview">
            <div className="preview-text" dangerouslySetInnerHTML={{ __html: previas.content }} />
          </div>
          </TemplateCard>
        </div>

        <div className="template-card-wrapper">
          <TemplateCard
            title="Social"
            description="Eventos y actividades recreativas"
            icon={FiImage}
            onClick={() => navigate('/comunicados/crear/social')}
            delay={0.3}
          >
          <div className="template-content-preview">
            <div className="preview-text" dangerouslySetInnerHTML={{ __html: social.content }} />
          </div>
          </TemplateCard>
        </div>

        <div className="template-card-wrapper">
          <TemplateCard
            title="Urgente"
            description="Avisos importantes y suspensiones"
            icon={FiCheck}
            onClick={() => navigate('/comunicados/crear/urgente')}
            delay={0.4}
          >
          <div className="template-content-preview">
            <div className="preview-text" dangerouslySetInnerHTML={{ __html: urgente.content }} />
          </div>
          </TemplateCard>
        </div>

        <div className="template-card-wrapper">
          <TemplateCard
            title="Institucional"
            description="Comunicaciones formales de dirección"
            icon={FiUsers}
            onClick={() => navigate('/comunicados/crear/institucional')}
            delay={0.5}
          >
          <div className="template-content-preview">
            <div className="preview-text" dangerouslySetInnerHTML={{ __html: institucional.content }} />
          </div>
          </TemplateCard>
        </div>

        <div className="template-card-wrapper">
          <TemplateCard
            title="Deportivo"
            description="Resultados y noticias deportivas"
            icon={FiCheck}
            onClick={() => navigate('/comunicados/crear/deportivo')}
            delay={0.6}
          >
          <div className="template-content-preview">
            <div className="preview-text" dangerouslySetInnerHTML={{ __html: deportivo.content }} />
          </div>
          </TemplateCard>
        </div>

      </div>
    </div>
  );
}