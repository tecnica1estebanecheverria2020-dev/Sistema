import { useState, useRef, useEffect } from 'react';
import {
  FiX, FiSave, FiBold, FiItalic, FiUnderline, FiList, FiAlignLeft,
  FiAlignCenter, FiAlignRight, FiLink, FiFileText, FiCalendar,
  FiImage, FiEye, FiPlus, FiChevronDown, FiUpload, FiTrash2, FiDroplet
} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import './style.css';
import useNotification from '../../shared/hooks/useNotification.jsx';
import { comunicadosService } from './services/comunicadosService';

// Plantillas de contenido con configuración completa
const TEMPLATES = {
  informativo: {
    titulo: 'Comunicado Oficial',
    content: `<div class="doc-badge badge-blue">📋 Comunicado Oficial</div>
<h1 class="doc-title">Actualización Normativa Institucional</h1>
<p class="doc-lead"><strong>Estimada Comunidad Educativa:</strong> Se informa sobre las nuevas disposiciones vigentes a partir del próximo ciclo lectivo.</p>
<div class="doc-alert alert-info">
  <strong>ℹ️ Información importante:</strong> Las nuevas normativas entran en vigencia a partir del 1 de Marzo de 2025.
</div>
<h3>Principales Cambios</h3>
<ul class="doc-list">
  <li>✓ Uso de dispositivos móviles durante horario lectivo</li>
  <li>✓ Protocolo de comunicación digital estudiante-docente</li>
  <li>✓ Normas de comportamiento en plataformas virtuales</li>
</ul>`,
    headerImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    bgColor: '#ffffff',
    bgOpacity: 0,
    links: []
  },

  previas: {
    titulo: 'Inscripciones a Previas',
    content: `<div class="doc-badge badge-purple">📚 Exámenes Previas</div>
<h1 class="doc-title">Inscripción a Exámenes de Previas - Marzo 2025</h1>
<p class="doc-lead">Período de inscripción abierto para el turno de exámenes complementarios.</p>

<div class="doc-alert alert-warning">
  <strong>⚠️ Importante:</strong> La inscripción cierra el 25 de Febrero de 2025 a las 18:00 hs.
</div>

<h3>Cronograma de Exámenes</h3>
<div class="exam-grid">
  <div class="exam-card">
    <div class="exam-header">
      <span class="exam-subject">Matemática I</span>
      <span class="doc-badge badge-red" style="margin:0; font-size:0.7rem">3er Año</span>
    </div>
    <div class="exam-details">
      <div class="exam-detail-item">📅 05/03/2025</div>
      <div class="exam-detail-item">🕐 09:00 hs</div>
      <div class="exam-detail-item">📍 Lab 2</div>
      <div class="exam-detail-item">👨‍🏫 Prof. Pérez</div>
    </div>
    <a href="#" class="doc-button btn-sm">Inscribirse al Examen</a>
  </div>

  <div class="exam-card">
    <div class="exam-header">
      <span class="exam-subject">Física II</span>
      <span class="doc-badge badge-red" style="margin:0; font-size:0.7rem">4to Año</span>
    </div>
    <div class="exam-details">
      <div class="exam-detail-item">📅 08/03/2025</div>
      <div class="exam-detail-item">🕐 14:00 hs</div>
      <div class="exam-detail-item">📍 Aula 15</div>
      <div class="exam-detail-item">👨‍🏫 Prof. Gómez</div>
    </div>
    <a href="#" class="doc-button btn-sm">Inscribirse al Examen</a>
  </div>
  
  <div class="exam-card">
    <div class="exam-header">
      <span class="exam-subject">Química</span>
      <span class="doc-badge badge-red" style="margin:0; font-size:0.7rem">5to Año</span>
    </div>
    <div class="exam-details">
      <div class="exam-detail-item">📅 10/03/2025</div>
      <div class="exam-detail-item">🕐 10:00 hs</div>
      <div class="exam-detail-item">📍 Lab Química</div>
      <div class="exam-detail-item">👨‍🏫 Prof. Díaz</div>
    </div>
    <a href="#" class="doc-button btn-sm">Inscribirse al Examen</a>
  </div>
</div>

<h3>Requisitos</h3>
<p>Para inscribirse, los alumnos deben presentar la solicitud en secretaría o completar el formulario online.</p>`,
    headerImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    bgColor: '#f8f9fa',
    bgOpacity: 0,
    links: [{ label: 'Formulario de Inscripción', url: 'https://forms.google.com/example' }]
  },

  social: {
    titulo: 'Evento Social',
    content: `<div class="doc-badge badge-pink">🎉 Evento Social</div>
<h1 class="doc-title">Semana de la Cultura y el Deporte 2025</h1>
<p class="doc-lead">¡Nos complace invitarlos a participar de nuestra tradicional semana de integración!</p>

<div class="info-grid">
  <div class="info-card">
    <span class="info-card-icon">🎭</span>
    <span class="info-card-title">Cultura</span>
    <p class="info-card-text">Teatro, música y arte en vivo.</p>
  </div>
  <div class="info-card">
    <span class="info-card-icon">⚽</span>
    <span class="info-card-title">Deportes</span>
    <p class="info-card-text">Torneos intercolegiales.</p>
  </div>
  <div class="info-card">
    <span class="info-card-icon">🤝</span>
    <span class="info-card-title">Comunidad</span>
    <p class="info-card-text">Espacios de encuentro.</p>
  </div>
</div>

<h3>Agenda Destacada</h3>
<div class="agenda-item">
  <div class="agenda-time">Lun 15</div>
  <div class="agenda-content">
    <h5>Apertura Oficial</h5>
    <p>Acto de inicio y presentación de equipos.</p>
  </div>
</div>
<div class="agenda-item">
  <div class="agenda-time">Mie 17</div>
  <div class="agenda-content">
    <h5>Finales Deportivas</h5>
    <p>Partidos decisivos de fútbol y vóley.</p>
  </div>
</div>
<div class="agenda-item">
  <div class="agenda-time">Vie 19</div>
  <div class="agenda-content">
    <h5>Fiesta de Cierre</h5>
    <p>Entrega de premios y música en vivo.</p>
  </div>
</div>`,
    headerImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    bgColor: '#fff0f6',
    bgOpacity: 0,
    galeria: [
      { id: 'img-1', src: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=400&q=60', w: 200, h: 150, x: 20, y: 400, z: 10 },
      { id: 'img-2', src: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=400&q=60', w: 200, h: 150, x: 240, y: 400, z: 11 }
    ],
    links: []
  },

  urgente: {
    titulo: 'Aviso Urgente',
    content: `<div class="doc-alert alert-warning"><strong>⚠️ AVISO URGENTE:</strong> Suspensión de actividades.</div>
<h1 class="doc-title">Suspensión de Clases por Clima Severo</h1>
<p>Debido a la alerta meteorológica emitida por el Servicio Meteorológico Nacional, se suspenden todas las actividades presenciales para el día de la fecha.</p>
<p>Se solicita a las familias permanecer atentas a los canales oficiales de comunicación para futuras actualizaciones.</p>`,
    headerImage: 'https://images.unsplash.com/photo-1454789476662-53eb23ba5907?auto=format&fit=crop&w=1200&q=80',
    bgColor: '#fff5f5',
    bgOpacity: 0,
    links: [{ label: 'Servicio Meteorológico Nacional', url: 'https://www.smn.gob.ar' }]
  },

  institucional: {
    titulo: 'Comunicado Institucional',
    content: `<div class="doc-badge badge-blue">🏛️ Institucional</div>
<h1 class="doc-title">Aniversario de la Institución</h1>
<p>Celebramos 50 años de excelencia educativa formando líderes del mañana.</p>
<blockquote class="doc-quote">"La educación es el arma más poderosa que puedes usar para cambiar el mundo."<footer>— Nelson Mandela</footer></blockquote>
<p>Invitamos a toda la comunidad a los actos conmemorativos.</p>
<div class="doc-footer" style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; font-size: 0.9rem; color: #666;"><p><strong>Contacto:</strong> direccion@institucion.edu.ar</p><p><em>Equipo Directivo</em></p></div>`,
    headerImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    bgColor: '#ffffff',
    bgOpacity: 0.1,
    bgImage: 'https://www.transparenttextures.com/patterns/cube-coat.png',
    links: []
  },

  deportivo: {
    titulo: 'Noticias Deportivas',
    content: `<div class="doc-badge badge-green">🏆 Deportes</div>
<h1 class="doc-title">Resultados Intercolegiales 2025</h1>
<p>Felicitamos a nuestros equipos representativos por su destacado desempeño en las competencias regionales.</p>
<div class="doc-card">
  <h4>🥇 Primer Puesto - Vóley Masculino</h4>
  <p>El equipo sub-18 se consagró campeón invicto del torneo regional.</p>
</div>
<div style="text-align: center; margin: 1.5rem 0;"><a href="#" class="doc-button" style="display: inline-block; padding: 0.75rem 1.5rem; background-color: #2b8a3e; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">Ver Tabla de Posiciones</a></div>`,
    headerImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    bgColor: '#ebfbee',
    bgOpacity: 0,
    galeria: [
      { id: 'img-sport-1', src: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=400&q=60', w: 220, h: 160, x: 30, y: 350, z: 10 }
    ],
    links: []
  }
};

// Componentes insertables
const INSERTABLE_COMPONENTS = [
  {
    id: 'alert-info',
    label: 'Alerta Info',
    icon: 'ℹ️',
    html: '<div class="doc-alert alert-info"><strong>ℹ️ Información:</strong> Escribe aquí tu mensaje informativo.</div>'
  },
  {
    id: 'alert-success',
    label: 'Alerta Éxito',
    icon: '✅',
    html: '<div class="doc-alert alert-success"><strong>✅ Éxito:</strong> Operación completada correctamente.</div><p><br></p>'
  },
  {
    id: 'alert-warning',
    label: 'Alerta Advertencia',
    icon: '⚠️',
    html: '<div class="doc-alert alert-warning"><strong>⚠️ Importante:</strong> Presta atención a este mensaje.</div><p><br></p>'
  },
  {
    id: 'card',
    label: 'Card',
    icon: '📄',
    html: '<div class="doc-card"><h4>Título del Card</h4><p>Contenido del card aquí.</p></div><p><br></p>'
  },
  {
    id: 'badge',
    label: 'Badge',
    icon: '🏷️',
    html: '<span class="doc-badge badge-blue">Badge</span> '
  },
  {
    id: 'quote',
    label: 'Cita',
    icon: '💬',
    html: '<blockquote class="doc-quote">"Esta es una cita destacada"<footer>— Autor</footer></blockquote><p><br></p>'
  },
  {
    id: 'footer',
    label: 'Footer',
    icon: '🦶',
    html: '<div class="doc-footer" style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; font-size: 0.9rem; color: #666;"><p><strong>Contacto:</strong> info@institucion.edu.ar | Tel: (011) 1234-5678</p><p><em>Departamento de Comunicación Institucional</em></p></div><p><br></p>'
  },
  {
    id: 'button',
    label: 'Botón',
    icon: '🔗',
    html: '<div style="text-align: center; margin: 1.5rem 0;"><a href="#" class="doc-button" style="display: inline-block; padding: 0.75rem 1.5rem; background-color: #6b1426; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">Ver más información</a></div><p><br></p>'
  }
];

function RichTextEditor({ value, onChange, onImageUploadRequest }) {
  const editorRef = useRef(null);
  const [showInsert, setShowInsert] = useState(false);
  const [fontSize, setFontSize] = useState('16px');
  const [foreColor, setForeColor] = useState('#000000');

  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      const isEditorFocused = document.activeElement === editorRef.current;
      const currentContent = editorRef.current.innerHTML;
      
      // Solo actualizar si:
      // 1. El editor no tiene el foco (cambio de plantilla externo)
      // 2. O el editor está vacío (carga inicial)
      // 3. O el contenido es muy diferente (cambio de plantilla mientras está vacío)
      if (!isEditorFocused || currentContent === '' || currentContent === '<br>') {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleChange();
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    setForeColor(color);
    execCommand('foreColor', color);
  };

  const handleChange = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // ... (insertComponent remains same)

  return (
    <div className="rich-editor">
      <div className="editor-toolbar">
        <div className="toolbar-group">
          <button onClick={() => execCommand('bold')} title="Negrita" className="toolbar-btn" type="button">
            <FiBold />
          </button>
          <button onClick={() => execCommand('italic')} title="Cursiva" className="toolbar-btn" type="button">
            <FiItalic />
          </button>
          <button onClick={() => execCommand('underline')} title="Subrayado" className="toolbar-btn" type="button">
            <FiUnderline />
          </button>
          <div className="color-picker-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button className="toolbar-btn" type="button" title="Color de texto" style={{ color: foreColor }}>
              <FiDroplet />
            </button>
            <input
              type="color"
              value={foreColor}
              onChange={handleColorChange}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer'
              }}
            />
          </div>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <select
            value={fontSize}
            onChange={handleFontSizeChange}
            title="Tamaño de fuente"
            style={{
              padding: '0.375rem 0.5rem',
              border: '2px solid #e9ecef',
              borderRadius: '6px',
              fontSize: '0.875rem',
              cursor: 'pointer',
              outline: 'none',
              fontWeight: 500
            }}
          >
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
            <option value="28px">28px</option>
            <option value="32px">32px</option>
            <option value="36px">36px</option>
            <option value="42px">42px</option>
            <option value="48px">48px</option>
          </select>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button onClick={() => execCommand('insertUnorderedList')} title="Lista" className="toolbar-btn" type="button">
            <FiList />
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button onClick={() => execCommand('justifyLeft')} title="Alinear izquierda" className="toolbar-btn" type="button">
            <FiAlignLeft />
          </button>
          <button onClick={() => execCommand('justifyCenter')} title="Centrar" className="toolbar-btn" type="button">
            <FiAlignCenter />
          </button>
          <button onClick={() => execCommand('justifyRight')} title="Alinear derecha" className="toolbar-btn" type="button">
            <FiAlignRight />
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button
            onClick={onImageUploadRequest}
            title="Subir imagen"
            className="toolbar-btn"
            type="button"
          >
            <FiUpload />
          </button>
        </div>

        <div className="toolbar-spacer" />

        <div className="toolbar-insert">
          <button
            type="button"
            className={`toolbar-insert-btn ${showInsert ? 'active' : ''}`}
            onClick={() => setShowInsert(!showInsert)}
          >
            <FiPlus />
            Insertar
            <FiChevronDown className={showInsert ? 'rotated' : ''} />
          </button>

          {showInsert && (
            <div className="insert-menu">
              {INSERTABLE_COMPONENTS.map(comp => (
                <button
                  key={comp.id}
                  type="button"
                  className="insert-menu-item"
                  onClick={() => insertComponent(comp.html)}
                >
                  <span className="insert-icon">{comp.icon}</span>
                  {comp.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className="editor-content"
        onInput={handleChange}
        suppressContentEditableWarning
        data-placeholder="Comienza a escribir tu comunicado..."
      />
    </div>
  );
}

// Componente para imagen arrastrable y redimensionable
function DraggableImage({ image, onUpdate, onSelect, isSelected, previewRef }) {
  const handleMouseDown = (e) => {
    if (e.target.classList.contains('resize-handle')) return;

    e.preventDefault();
    e.stopPropagation();
    onSelect(image.id);

    const previewRect = previewRef.current.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = image.x;
    const startTop = image.y;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newX = startLeft + deltaX;
      let newY = startTop + deltaY;

      newX = Math.max(0, Math.min(newX, previewRect.width - image.w));
      newY = Math.max(0, Math.min(newY, previewRect.height - image.h));

      onUpdate(image.id, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startW = image.w;
    const startH = image.h;
    const aspectRatio = startW / startH;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      let newW = startW + deltaX;
      newW = Math.max(50, Math.min(newW, 800));
      let newH = newW / aspectRatio;

      onUpdate(image.id, { w: newW, h: newH });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: image.x,
        top: image.y,
        width: image.w,
        height: image.h,
        cursor: 'grab',
        border: isSelected ? '3px solid #6b1426' : '2px solid transparent',
        borderRadius: '8px',
        overflow: 'hidden',
        zIndex: image.z || 10,
        boxShadow: isSelected ? '0 4px 12px rgba(107, 20, 38, 0.4)' : 'none'
      }}
      onMouseDown={handleMouseDown}
    >
      <img
        src={image.src}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none',
          userSelect: 'none'
        }}
        draggable={false}
      />

      {isSelected && (
        <>
          <div
            className="resize-handle"
            onMouseDown={handleResizeMouseDown}
            style={{
              position: 'absolute',
              bottom: -6,
              right: -6,
              width: 20,
              height: 20,
              background: '#6b1426',
              border: '3px solid white',
              borderRadius: '50%',
              cursor: 'se-resize',
              zIndex: 1000
            }}
          />
          <div style={{
            position: 'absolute',
            top: 6,
            right: 6,
            background: 'rgba(0,0,0,0.75)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
            pointerEvents: 'none'
          }}>
            {Math.round(image.w)} × {Math.round(image.h)}
          </div>
        </>
      )}
    </div>
  );
}

export default function CreateComunicado() {
  const navigate = useNavigate();
  const { template } = useParams();
  const notify = useNotification();
  const previewRef = useRef(null);
  const fileInputRef = useRef(null);

  // Estados principales
  const [content, setContent] = useState('');
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('Publicado');

  // Imagen de header predefinida
  const [headerImage, setHeaderImage] = useState('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80');
  const [headerImageUrl, setHeaderImageUrl] = useState('');

  // Estados para imágenes
  const [imagenesFlotantes, setImagenesFlotantes] = useState([]); // Draggable
  const [galeriaGrid, setGaleriaGrid] = useState([]); // Static footer gallery
  
  const [newFloatingUrl, setNewFloatingUrl] = useState('');
  const [newGridUrl, setNewGridUrl] = useState('');
  
  const [selectedImageId, setSelectedImageId] = useState(null);

  // Estados para links
  const [links, setLinks] = useState([]);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // Estados para exámenes (previas)
  const [examenes, setExamenes] = useState([]);
  const [newExamen, setNewExamen] = useState({
    materia: '',
    fecha: '',
    hora: '',
    aula: '',
    profesor: '',
    año: ''
  });

  // Estados para fondo
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgImageUrl, setBgImageUrl] = useState('');
  const [bgOpacity, setBgOpacity] = useState(0);

  // Estados para modal de selección de imagen
  const [showImageModal, setShowImageModal] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState('');

  // Use 'template' as 'tipo'
  const tipo = template;

  useEffect(() => {
    if (tipo && tipo !== 'blank' && TEMPLATES[tipo]) {
      const tmpl = TEMPLATES[tipo];
      
      // Cargar estado completo desde la plantilla
      setTitulo(tmpl.titulo || 'Nuevo Comunicado');
      setContent(tmpl.content || '');
      setHeaderImage(tmpl.headerImage || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80');
      setBgColor(tmpl.bgColor || '#ffffff');
      setBgImageUrl(tmpl.bgImage || '');
      setBgOpacity(tmpl.bgOpacity || 0);
      
      // Map template gallery to floating images if they have coordinates, otherwise to grid?
      // Assuming template.galeria are floating images based on previous structure {x,y,w,h}
      setImagenesFlotantes(tmpl.galeria || []);
      setGaleriaGrid([]); // Templates don't have grid gallery defined yet in constants, but we could add it
      
      setLinks(tmpl.links || []);
      
    } else {
      setContent('');
      setTitulo('Nuevo Comunicado');
      setHeaderImage('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80');
      setBgColor('#ffffff');
      setBgImageUrl('');
      setBgOpacity(0);
      setImagenesFlotantes([]);
      setGaleriaGrid([]);
      setLinks([]);
    }
  }, [tipo]);

  // ... (getTemplateInfo, templateInfo, etc. remain same)

  // Añadir imagen flotante
  const addFloatingImage = () => {
    if (newFloatingUrl.trim()) {
      const newImage = {
        id: `img-${Date.now()}`,
        src: newFloatingUrl,
        w: 200,
        h: 150,
        x: 20 + (imagenesFlotantes.length * 30),
        y: 280 + (imagenesFlotantes.length * 30),
        z: 10 + imagenesFlotantes.length
      };
      setImagenesFlotantes([...imagenesFlotantes, newImage]);
      setNewFloatingUrl('');
    }
  };

  // Añadir imagen a grid
  const addGridImage = () => {
    if (newGridUrl.trim()) {
      setGaleriaGrid([...galeriaGrid, newGridUrl]);
      setNewGridUrl('');
    }
  };

  // Actualizar imagen flotante
  const updateFloatingImage = (id, updates) => {
    setImagenesFlotantes(imagenesFlotantes.map(img =>
      img.id === id ? { ...img, ...updates } : img
    ));
  };

  // Eliminar imagen flotante
  const removeFloatingImage = (id) => {
    setImagenesFlotantes(imagenesFlotantes.filter(img => img.id !== id));
    if (selectedImageId === id) {
      setSelectedImageId(null);
    }
  };

  // Eliminar imagen de grid
  const removeGridImage = (index) => {
    setGaleriaGrid(galeriaGrid.filter((_, i) => i !== index));
  };

  // Funciones para links
  const addLink = () => {
    if (newLinkLabel.trim() && newLinkUrl.trim()) {
      setLinks([...links, { label: newLinkLabel, url: newLinkUrl }]);
      setNewLinkLabel('');
      setNewLinkUrl('');
    }
  };

  const removeLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  // Funciones para exámenes (previas)
  const addExamen = () => {
    if (newExamen.materia.trim() && newExamen.fecha.trim()) {
      setExamenes([...examenes, { ...newExamen }]);
      setNewExamen({
        materia: '',
        fecha: '',
        hora: '',
        aula: '',
        profesor: '',
        año: ''
      });
    }
  };

  const removeExamen = (index) => {
    setExamenes(examenes.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      if (!titulo.trim()) {
        notify('El título es requerido', 'error');
        return;
      }

      let payload = {
        tipo: (['informativo', 'previas', 'social'].includes(tipo) ? tipo : 'informativo'),
        titulo: titulo,
        contenido: content,
        bgColor,
        bgImage: bgImageUrl,
        bgOpacity,
        headerImage,
        fecha,
        // Floating images mapped to 'imagenes'
        imagenes: imagenesFlotantes.map(img => ({
          src: img.src,
          w: img.w,
          h: img.h,
          x: img.x,
          y: img.y,
          z: img.z
        })),
        // Grid images mapped to 'galeria' (array of objects as per backend expectation)
        galeria: galeriaGrid.map(src => ({
           src: src,
           w: 0, h: 0, x: 0, y: 0, z: 0 // Dummy values for grid images
        })),
        links,
        // Previas specific
        examenes: tipo === 'previas' ? examenes : [],
        requisitos: (tipo === 'previas' ? content : ''),
        contacto: { nombre: '', email: '', telefono: '' },
        // Social specific
        mensaje: (tipo === 'social' ? content : ''),
        etiquetas: []
      };

      await comunicadosService.createComunicado(payload);
      notify('Comunicado creado exitosamente', 'success');
      navigate('/comunicados');
    } catch (error) {
      notify(error?.message || 'Error al crear el comunicado', 'error');
    }
  };

  return (
    <div className="editor-page">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelected}
        accept="image/*"
      />
      {/* Header */}
      <div className="editor-header">
        <div className="editor-header-left">
          <button className="btn-back" onClick={() => navigate('/comunicados/crear')} type="button">
            <FiX />
          </button>
          <div className="template-icon" style={{ background: templateInfo.color }}>
            <TemplateIcon />
          </div>
          <div>
            <h1 className="editor-page-title">{templateInfo.title}</h1>
            <p className="editor-page-subtitle">Edita y personaliza tu comunicado</p>
          </div>
        </div>

        <div className="editor-header-right">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="status-select"
          >
            <option value="Publicado">Publicado</option>
            <option value="Borrador">Borrador</option>
          </select>

          <button className="btn-save" onClick={handleSave} type="button">
            <FiSave />
            Guardar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="editor-main">
        {/* Preview - Left */}
        <div className="preview-panel">
          <div className="panel-label">
            <FiEye />
            Vista Previa
          </div>
          <div
            ref={previewRef}
            className="preview-box"
            style={{
              backgroundColor: bgColor,
              backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              minHeight: '700px',
              overflow: 'hidden'
            }}
            onClick={() => setSelectedImageId(null)}
          >
            {/* Overlay de opacidad */}
            {bgImageUrl && bgOpacity > 0 && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: bgColor,
                opacity: bgOpacity,
                pointerEvents: 'none',
                zIndex: 1
              }} />
            )}

            {/* Imagen de header */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <img
                src={headerImage}
                alt="Header"
                style={{
                  width: '100%',
                  height: '220px',
                  objectFit: 'cover',
                  borderRadius: '12px 12px 0 0',
                  marginBottom: '1.5rem'
                }}
              />
            </div>

            {/* Título y fecha */}
            <div style={{ position: 'relative', zIndex: 2, padding: '0 1.5rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#212529', marginBottom: '0.5rem' }}>
                {titulo || 'Título del comunicado'}
              </h2>
              {fecha && (
                <p style={{ fontSize: '0.9rem', color: '#868e96', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiCalendar size={16} />
                  {new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              )}
            </div>

            {/* Contenido del editor */}
            <div style={{ position: 'relative', zIndex: 2, padding: '0 1.5rem' }}>
              {content ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <div className="preview-empty">
                  <FiFileText />
                  <p>Tu comunicado aparecerá aquí</p>
                </div>
              )}

              {/* Links */}
              {links.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Enlaces relacionados</h3>
                  {links.map((link, idx) => (
                    <div key={idx} style={{ marginBottom: '0.5rem' }}>
                      <a href={link.url} style={{ color: '#6b1426', textDecoration: 'underline', fontWeight: 600 }}>
                        {link.label}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Imágenes arrastrables */}
            {galeria.map(image => (
              <DraggableImage
                key={image.id}
                image={image}
                onUpdate={updateImage}
                onSelect={setSelectedImageId}
                isSelected={selectedImageId === image.id}
                previewRef={previewRef}
              />
            ))}
          </div>
        </div>

        {/* Editor - Right */}
        <div className="editor-panel">
          <div className="panel-label">
            <FiFileText />
            Editor
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Campo de título */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#495057', marginBottom: '0.5rem' }}>
                Título *
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título del comunicado"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#6b1426'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
              />
            </div>

            {/* Campo de fecha */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#495057', marginBottom: '0.5rem' }}>
                Fecha
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#6b1426'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
              />
            </div>
          </div>

          {/* Editor de texto */}
          <div style={{ marginTop: '1.5rem' }}>
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          {/* Controles adicionales */}
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Imagen de Header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <FiImage style={{ color: '#6b1426', fontSize: '1.25rem' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#212529' }}>Imagen de Header</span>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <img src={headerImage} alt="Header preview" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '10px', border: '2px solid #e9ecef' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="url"
                  value={headerImageUrl}
                  onChange={(e) => setHeaderImageUrl(e.target.value)}
                  placeholder="https://ejemplo.com/header.jpg"
                  style={{
                    flex: 1,
                    padding: '0.625rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleChangeHeaderImage}
                  type="button"
                  style={{
                    padding: '0.625rem 1.25rem',
                    background: '#6b1426',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#8b1a33'}
                  onMouseLeave={(e) => e.target.style.background = '#6b1426'}
                >
                  Cambiar
                </button>
              </div>
            </div>

            {/* Imágenes Flotantes (Drag & Drop) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <FiImage style={{ color: '#6b1426', fontSize: '1.25rem' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#212529' }}>
                  Imágenes Flotantes <span style={{ fontSize: '0.75rem', color: '#868e96', fontWeight: 400 }}>(Arrastra en el preview)</span>
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="url"
                  value={newFloatingUrl}
                  onChange={(e) => setNewFloatingUrl(e.target.value)}
                  placeholder="https://ejemplo.com/flotante.jpg"
                  style={{
                    flex: 1,
                    padding: '0.625rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={addFloatingImage}
                  type="button"
                  style={{
                    padding: '0.625rem',
                    background: '#6b1426',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <FiPlus size={20} />
                </button>
              </div>
              
              <div className="gallery-thumbnails" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {imagenesFlotantes.map(img => (
                  <div key={img.id} style={{ position: 'relative', width: '60px', height: '60px' }}>
                    <img
                      src={img.src}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px', border: selectedImageId === img.id ? '2px solid #6b1426' : '1px solid #dee2e6' }}
                      onClick={() => setSelectedImageId(img.id)}
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFloatingImage(img.id); }}
                      style={{
                        position: 'absolute',
                        top: -5,
                        right: -5,
                        background: '#fa5252',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '10px'
                      }}
                    >
                      <FiTrash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Galería (Pie de página) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <FiImage style={{ color: '#6b1426', fontSize: '1.25rem' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#212529' }}>
                  Galería (Pie de página) <span style={{ fontSize: '0.75rem', color: '#868e96', fontWeight: 400 }}>(Estática)</span>
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="url"
                  value={newGridUrl}
                  onChange={(e) => setNewGridUrl(e.target.value)}
                  placeholder="https://ejemplo.com/grid.jpg"
                  style={{
                    flex: 1,
                    padding: '0.625rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={addGridImage}
                  type="button"
                  style={{
                    padding: '0.625rem',
                    background: '#6b1426',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <FiPlus size={20} />
                </button>
              </div>
              
              <div className="gallery-thumbnails" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {galeriaGrid.map((src, index) => (
                  <div key={index} style={{ position: 'relative', width: '60px', height: '60px' }}>
                    <img
                      src={src}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px', border: '1px solid #dee2e6' }}
                    />
                    <button
                      onClick={() => removeGridImage(index)}
                      style={{
                        position: 'absolute',
                        top: -5,
                        right: -5,
                        background: '#fa5252',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '10px'
                      }}
                    >
                      <FiTrash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <FiLink style={{ color: '#6b1426', fontSize: '1.25rem' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#212529' }}>Enlaces</span>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  value={newLinkLabel}
                  onChange={(e) => setNewLinkLabel(e.target.value)}
                  placeholder="Texto del enlace"
                  style={{
                    flex: 1,
                    padding: '0.625rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                <input
                  type="url"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="URL"
                  style={{
                    flex: 1,
                    padding: '0.625rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={addLink}
                  type="button"
                  style={{
                    padding: '0.625rem',
                    background: '#6b1426',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <FiPlus size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {links.map((link, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8f9fa', padding: '0.5rem', borderRadius: '6px' }}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem', color: '#6b1426', textDecoration: 'underline' }}>
                      {link.label}
                    </a>
                    <button
                      onClick={() => removeLink(index)}
                      style={{ background: 'none', border: 'none', color: '#868e96', cursor: 'pointer' }}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Exámenes (solo para previas) */}
            {tipo === 'previas' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <FiCalendar style={{ color: '#6b1426', fontSize: '1.25rem' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#212529' }}>Exámenes</span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={newExamen.materia}
                    onChange={(e) => setNewExamen({...newExamen, materia: e.target.value})}
                    placeholder="Materia"
                    style={{
                      padding: '0.625rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="text"
                    value={newExamen.año}
                    onChange={(e) => setNewExamen({...newExamen, año: e.target.value})}
                    placeholder="Año (ej: 3er Año)"
                    style={{
                      padding: '0.625rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="date"
                    value={newExamen.fecha}
                    onChange={(e) => setNewExamen({...newExamen, fecha: e.target.value})}
                    style={{
                      padding: '0.625rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="time"
                    value={newExamen.hora}
                    onChange={(e) => setNewExamen({...newExamen, hora: e.target.value})}
                    style={{
                      padding: '0.625rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={newExamen.aula}
                    onChange={(e) => setNewExamen({...newExamen, aula: e.target.value})}
                    placeholder="Aula"
                    style={{
                      padding: '0.625rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="text"
                    value={newExamen.profesor}
                    onChange={(e) => setNewExamen({...newExamen, profesor: e.target.value})}
                    placeholder="Profesor"
                    style={{
                      padding: '0.625rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <button
                  onClick={addExamen}
                  type="button"
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    background: '#7950f2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    marginBottom: '1rem'
                  }}
                >
                  <FiPlus size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  Agregar Examen
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {examenes.map((examen, index) => (
                    <div key={index} style={{ background: '#f8f9fa', padding: '0.75rem', borderRadius: '8px', borderLeft: '4px solid #7950f2' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: '#212529', marginBottom: '0.25rem' }}>
                            {examen.materia} {examen.año && <span style={{ fontSize: '0.75rem', color: '#868e96' }}>({examen.año})</span>}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#495057' }}>
                            📅 {examen.fecha} | 🕐 {examen.hora} | 📍 {examen.aula} | 👨‍🏫 {examen.profesor}
                          </div>
                        </div>
                        <button
                          onClick={() => removeExamen(index)}
                          style={{ background: 'none', border: 'none', color: '#868e96', cursor: 'pointer' }}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sección de Fondo */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <FiDroplet style={{ color: '#6b1426', fontSize: '1.25rem' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#212529' }}>Fondo del Comunicado</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#868e96', marginBottom: '0.5rem', fontWeight: 600 }}>Color de fondo</label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '6px', border: '1px solid #dee2e6', cursor: 'pointer' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#868e96', marginBottom: '0.5rem', fontWeight: 600 }}>Opacidad de Imagen</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={bgOpacity}
                    onChange={(e) => setBgOpacity(parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#868e96', marginBottom: '0.5rem', fontWeight: 600 }}>Imagen de Fondo (URL)</label>
                  <input
                    type="url"
                    value={bgImageUrl}
                    onChange={(e) => setBgImageUrl(e.target.value)}
                    placeholder="https://ejemplo.com/fondo.jpg"
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modal de selección de imagen (simple) */}
      {showImageModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '400px', padding: '2rem' }}>
            <h3>Insertar Imagen</h3>
            <p>¿Cómo deseas usar esta imagen?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              <button onClick={addImageToContent} className="modal-btn-primary">Insertar en contenido</button>
              <button onClick={addImageAsHeader} className="modal-btn-secondary">Establecer como header</button>
              <button onClick={() => setShowImageModal(false)} className="modal-btn-secondary">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
