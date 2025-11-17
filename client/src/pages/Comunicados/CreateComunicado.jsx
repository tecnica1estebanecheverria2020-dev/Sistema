import { useState, useRef } from 'react';
import { FiPlus, FiBold, FiItalic, FiUnderline, FiList, FiAlignLeft, FiAlignCenter, FiAlignRight, FiInfo, FiBook, FiAlertTriangle, FiImage, FiTag, FiLink } from 'react-icons/fi';
import './style.css';

function TemplateContainer({ title, children }) {
  return (
    <div className="comunicados-template-card">
      <div className="comunicados-template-header">
        <h3 className="comunicados-template-title">{title}</h3>
      </div>
      <div className="comunicados-template-body">
        {children}
      </div>
    </div>
  );
}

function EditorToolbar({ onFormat }) {
  return (
    <div className="comunicados-editor-toolbar">
      <button type="button" onClick={() => onFormat('bold')} className="comunicados-toolbar-button"><FiBold /></button>
      <button type="button" onClick={() => onFormat('italic')} className="comunicados-toolbar-button"><FiItalic /></button>
      <button type="button" onClick={() => onFormat('underline')} className="comunicados-toolbar-button"><FiUnderline /></button>
      <div className="comunicados-toolbar-separator"></div>
      <button type="button" onClick={() => onFormat('insertUnorderedList')} className="comunicados-toolbar-button"><FiList /></button>
      <button type="button" onClick={() => onFormat('justifyLeft')} className="comunicados-toolbar-button"><FiAlignLeft /></button>
      <button type="button" onClick={() => onFormat('justifyCenter')} className="comunicados-toolbar-button"><FiAlignCenter /></button>
      <button type="button" onClick={() => onFormat('justifyRight')} className="comunicados-toolbar-button"><FiAlignRight /></button>
    </div>
  );
}

function InformativoTemplate() {
  const [titulo, setTitulo] = useState('Comunicado Oficial');
  const [contenido, setContenido] = useState('<p>Se informa a la comunidad educativa...</p>');
  const [imagenes, setImagenes] = useState([
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=60',
  ]);
  const [links, setLinks] = useState([
    { label: 'Sitio Oficial', url: 'https://www.ejemplo.edu' },
  ]);
  const [icons, setIcons] = useState(['info']);
  const [errors, setErrors] = useState({});
  const contentRef = useRef(null);

  const applyFormat = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    contentRef.current?.focus();
    setContenido(contentRef.current?.innerHTML || '');
  };

  const addImage = (url) => {
    if (!url) return;
    setImagenes((prev) => [...prev, url]);
  };

  const removeImage = (idx) => {
    setImagenes((prev) => prev.filter((_, i) => i !== idx));
  };

  const addLink = (label, url) => {
    if (!label || !url) return;
    setLinks((prev) => [...prev, { label, url }]);
  };

  const removeLink = (idx) => {
    setLinks((prev) => prev.filter((_, i) => i !== idx));
  };

  const addIcon = (key) => {
    setIcons((prev) => [...prev, key]);
  };

  const removeIcon = (idx) => {
    setIcons((prev) => prev.filter((_, i) => i !== idx));
  };

  const validate = () => {
    const e = {};
    if (!titulo.trim()) e.titulo = 'Requerido';
    if (!contenido || !contenido.trim()) e.contenido = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const iconMap = {
    info: <FiInfo />,
    book: <FiBook />,
    alert: <FiAlertTriangle />,
  };

  return (
    <TemplateContainer title="Informativo">
      <div className="comunicados-template-form">
        <div className="comunicados-form-group">
          <label className="comunicados-form-label">Título</label>
          <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="comunicados-form-input" />
          {errors.titulo && <span className="comunicados-error-text">{errors.titulo}</span>}
        </div>
        <div className="comunicados-form-group">
          <label className="comunicados-form-label">Contenido</label>
          <div className="comunicados-editor">
            <EditorToolbar onFormat={applyFormat} />
            <div ref={contentRef} contentEditable className="comunicados-editor-content" onInput={() => setContenido(contentRef.current?.innerHTML || '')} dangerouslySetInnerHTML={{ __html: contenido }} />
          </div>
          {errors.contenido && <span className="comunicados-error-text">{errors.contenido}</span>}
        </div>
        <div className="comunicados-form-group">
          <label className="comunicados-form-label">Agregar imagen (URL)</label>
          <div className="comunicados-inline">
            <input type="url" placeholder="https://..." id="info-img-url" className="comunicados-form-input" />
            <button type="button" className="comunicados-add-image-button" onClick={() => addImage(document.getElementById('info-img-url').value)}><FiImage />Agregar</button>
          </div>
        </div>
        <div className="comunicados-form-group">
          <label className="comunicados-form-label">Agregar link</label>
          <div className="comunicados-inline">
            <input type="text" placeholder="Texto" id="info-link-label" className="comunicados-form-input" />
            <input type="url" placeholder="https://..." id="info-link-url" className="comunicados-form-input" />
            <button type="button" className="comunicados-submit-button" onClick={() => addLink(document.getElementById('info-link-label').value, document.getElementById('info-link-url').value)}><FiLink />Agregar</button>
          </div>
        </div>
        <div className="comunicados-form-group">
          <label className="comunicados-form-label">Agregar icono</label>
          <div className="comunicados-inline">
            <button type="button" className="comunicados-submit-button" onClick={() => addIcon('info')}><FiInfo />Info</button>
            <button type="button" className="comunicados-submit-button" onClick={() => addIcon('book')}><FiBook />Libro</button>
            <button type="button" className="comunicados-submit-button" onClick={() => addIcon('alert')}><FiAlertTriangle />Alerta</button>
          </div>
        </div>
        <div className="comunicados-form-actions">
          <button type="button" className="comunicados-submit-button" onClick={validate}>Validar</button>
        </div>
      </div>
      <div className="comunicados-template-preview">
        <div className="comunicados-preview-header">
          <span className="comunicados-type-badge publicado">Informativo</span>
        </div>
        <h3 className="comunicados-card-title">{titulo}</h3>
        <div className="comunicados-view-text" dangerouslySetInnerHTML={{ __html: contenido }} />
        {icons.length > 0 && (
          <div className="comunicados-preview-icons">
            {icons.map((k, i) => (
              <div key={i} className="comunicados-preview-icon" onClick={() => removeIcon(i)}>{iconMap[k]}</div>
            ))}
          </div>
        )}
        {links.length > 0 && (
          <div className="comunicados-preview-links">
            {links.map((l, i) => (
              <a key={i} href={l.url} className="comunicados-link" target="_blank" rel="noreferrer" onClick={(e) => e.preventDefault()}>
                {l.label}
                <button type="button" className="comunicados-remove-image" onClick={() => removeLink(i)}>×</button>
              </a>
            ))}
          </div>
        )}
        {imagenes.length > 0 && (
          <div className="comunicados-gallery-preview-grid">
            {imagenes.map((img, i) => (
              <div key={i} className="comunicados-gallery-item">
                <img src={img} alt="" />
                <button type="button" className="comunicados-remove-image" onClick={() => removeImage(i)}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </TemplateContainer>
  );
}

function PreviasTemplate() {
  const [fechas, setFechas] = useState(['2025-03-01']);
  const [materias, setMaterias] = useState(['Matemática I']);
  const [requisitos, setRequisitos] = useState('DNI, Libreta, Constancia de alumno regular');
  const [contacto, setContacto] = useState({ nombre: 'Secretaría', email: 'secretaria@ejemplo.edu', telefono: '123456789' });
  const [errors, setErrors] = useState({});

  const addFecha = (v) => {
    if (!v) return;
    setFechas((p) => [...p, v]);
  };
  const removeFecha = (i) => setFechas((p) => p.filter((_, idx) => idx !== i));
  const addMateria = (v) => {
    if (!v) return;
    setMaterias((p) => [...p, v]);
  };
  const removeMateria = (i) => setMaterias((p) => p.filter((_, idx) => idx !== i));

  const validate = () => {
    const e = {};
    if (fechas.length === 0) e.fechas = 'Agregar al menos una fecha';
    if (materias.length === 0) e.materias = 'Agregar al menos una materia';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <TemplateContainer title="Previas">
      <div className="comunicados-template-form">
        <div className="comunicados-form-group">
          <label className="comunicados-form-label">Fecha</label>
          <div className="comunicados-inline">
            <input type="date" id="previas-fecha" className="comunicados-form-input" />
            <button type="button" className="comunicados-submit-button" onClick={() => addFecha(document.getElementById('previas-fecha').value)}>Agregar</button>
          </div>
          {errors.fechas && <span className="comunicados-error-text">{errors.fechas}</span>}
        </div>
        <div className="comunicados-form-group">
          <label className="comunicados-form-label">Materia</label>
          <div className="comunicados-inline">
            <input type="text" id="previas-materia" placeholder="Nombre" className="comunicados-form-input" />
            <button type="button" className="comunicados-submit-button" onClick={() => addMateria(document.getElementById('previas-materia').value)}>Agregar</button>
          </div>
          {errors.materias && <span className="comunicados-error-text">{errors.materias}</span>}
        </div>
        <div className="comunicados-form-group">
          <label className="comunicados-form-label">Requisitos</label>
          <textarea value={requisitos} onChange={(e) => setRequisitos(e.target.value)} className="comunicados-form-input" />
        </div>
        <div className="comunicados-form-group">
          <label className="comunicados-form-label">Contacto</label>
          <div className="comunicados-inline">
            <input type="text" value={contacto.nombre} onChange={(e) => setContacto({ ...contacto, nombre: e.target.value })} className="comunicados-form-input" placeholder="Nombre" />
            <input type="email" value={contacto.email} onChange={(e) => setContacto({ ...contacto, email: e.target.value })} className="comunicados-form-input" placeholder="Email" />
            <input type="text" value={contacto.telefono} onChange={(e) => setContacto({ ...contacto, telefono: e.target.value })} className="comunicados-form-input" placeholder="Teléfono" />
          </div>
        </div>
        <div className="comunicados-form-actions">
          <button type="button" className="comunicados-submit-button" onClick={validate}>Validar</button>
        </div>
      </div>
      <div className="comunicados-template-preview">
        <div className="comunicados-preview-header">
          <span className="comunicados-type-badge publicado">Inscripciones a Previas</span>
        </div>
        <h3 className="comunicados-card-title">Fechas</h3>
        <ul className="comunicados-list-simple">
          {fechas.map((f, i) => (
            <li key={i} className="comunicados-list-item" onClick={() => removeFecha(i)}>{f}</li>
          ))}
        </ul>
        <h3 className="comunicados-card-title">Materias</h3>
        <ul className="comunicados-list-simple">
          {materias.map((m, i) => (
            <li key={i} className="comunicados-list-item" onClick={() => removeMateria(i)}>{m}</li>
          ))}
        </ul>
        <h3 className="comunicados-card-title">Requisitos</h3>
        <p className="comunicados-view-text">{requisitos}</p>
        <div className="comunicados-contact">
          <div>{contacto.nombre}</div>
          <div>{contacto.email}</div>
          <div>{contacto.telefono}</div>
        </div>
      </div>
    </TemplateContainer>
  );
}

function SocialTemplate() {
  const [mensaje, setMensaje] = useState('¡Mirá las fotos del evento!');
  const [etiquetas, setEtiquetas] = useState(['evento', 'comunidad', 'escuela']);
  const [galeria, setGaleria] = useState([
    'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=600&q=60',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=60',
  ]);
  const [errors, setErrors] = useState({});

  const addImagen = (url) => {
    if (!url) return;
    setGaleria((p) => [...p, url]);
  };
  const removeImagen = (i) => setGaleria((p) => p.filter((_, idx) => idx !== i));
  const addEtiqueta = (tag) => {
    if (!tag) return;
    setEtiquetas((p) => [...p, tag]);
  };
  const removeEtiqueta = (i) => setEtiquetas((p) => p.filter((_, idx) => idx !== i));

  const validate = () => {
    const e = {};
    if (!mensaje.trim()) e.mensaje = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <TemplateContainer title="Social">
      <div className="comunicados-template-form">
        <div className="comunicados-form-group">
          <label className="comunicados-form-label">Mensaje</label>
          <input type="text" value={mensaje} onChange={(e) => setMensaje(e.target.value)} className="comunicados-form-input" />
          {errors.mensaje && <span className="comunicados-error-text">{errors.mensaje}</span>}
        </div>
        <div className="comunicados-form-group">
          <label className="comunicados-form-label">Agregar etiqueta</label>
          <div className="comunicados-inline">
            <input type="text" id="social-tag" className="comunicados-form-input" />
            <button type="button" className="comunicados-submit-button" onClick={() => addEtiqueta(document.getElementById('social-tag').value)}><FiTag />Agregar</button>
          </div>
        </div>
        <div className="comunicados-form-group">
          <label className="comunicados-form-label">Agregar imagen (URL)</label>
          <div className="comunicados-inline">
            <input type="url" id="social-img" className="comunicados-form-input" placeholder="https://..." />
            <button type="button" className="comunicados-add-image-button" onClick={() => addImagen(document.getElementById('social-img').value)}><FiImage />Agregar</button>
          </div>
        </div>
        <div className="comunicados-form-actions">
          <button type="button" className="comunicados-submit-button" onClick={validate}>Validar</button>
        </div>
      </div>
      <div className="comunicados-template-preview">
        <div className="comunicados-preview-header">
          <span className="comunicados-type-badge publicado">Social</span>
        </div>
        <p className="comunicados-view-text">{mensaje}</p>
        {etiquetas.length > 0 && (
          <div className="comunicados-tags">
            {etiquetas.map((t, i) => (
              <span key={i} className="comunicados-tag" onClick={() => removeEtiqueta(i)}>#{t}</span>
            ))}
          </div>
        )}
        {galeria.length > 0 && (
          <div className="comunicados-gallery-preview-grid">
            {galeria.map((img, i) => (
              <div key={i} className="comunicados-gallery-item">
                <img src={img} alt="" />
                <button type="button" className="comunicados-remove-image" onClick={() => removeImagen(i)}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </TemplateContainer>
  );
}

function CreateCard() {
  return (
    <div className="comunicados-template-card create-card">
      <div className="create-card-content">
        <FiPlus className="create-card-icon" />
        <div className="create-card-text">Crear uno</div>
      </div>
    </div>
  );
}

export default function CreateComunicado() {
  return (
    <div className="comunicados-container">
      <div className="comunicados-header">
        <div className="comunicados-header-content">
          <h1 className="comunicados-title">Crear Comunicado</h1>
          <p className="comunicados-subtitle">Selecciona una plantilla y edita en tiempo real</p>
        </div>
      </div>
      <div className="comunicados-create-grid">
        <CreateCard />
        <InformativoTemplate />
        <PreviasTemplate />
        <SocialTemplate />
      </div>
    </div>
  );
}