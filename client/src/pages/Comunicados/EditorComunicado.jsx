import { useParams, useNavigate } from 'react-router-dom';
import { useState, useRef, useCallback, useEffect } from 'react';
import { FiBold, FiItalic, FiUnderline, FiList, FiAlignLeft, FiAlignCenter, FiAlignRight, FiImage, FiTag, FiLink, FiInfo, FiBook, FiAlertTriangle } from 'react-icons/fi';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDropzone } from 'react-dropzone';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './style.css';
import useNotification from '../../shared/hooks/useNotification.jsx';
import { comunicadosService } from './services/comunicadosService';

const quillModules = {
  toolbar: [[{ font: [] }, { size: [] }], ['bold', 'italic', 'underline'], [{ color: [] }, { background: [] }], [{ align: [] }], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
};

function QuillEditor({ value, onChange }) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  useEffect(() => {
    if (!editorRef.current && containerRef.current) {
      editorRef.current = new Quill(containerRef.current, { theme: 'snow', modules: { toolbar: quillModules.toolbar } });
      editorRef.current.clipboard.dangerouslyPasteHTML(value || '');
      editorRef.current.on('text-change', () => {
        const html = editorRef.current.root.innerHTML;
        onChange(html);
      });
    }
  }, [onChange, value]);
  useEffect(() => {
    if (editorRef.current) {
      const current = editorRef.current.root.innerHTML;
      if (value !== undefined && value !== current) {
        editorRef.current.clipboard.dangerouslyPasteHTML(value);
      }
    }
  }, [value]);
  return <div ref={containerRef} />;
}

function DraggableImage({ item, index, moveItem, updateSize, remove }) {
  const ref = useRef(null);
  const [, drag] = useDrag({ type: 'IMAGE', item: { index } });
  const [, drop] = useDrop({ accept: 'IMAGE', hover(dragItem) { if (dragItem.index !== index) { moveItem(dragItem.index, index); dragItem.index = index; } } });
  drag(drop(ref));
  return (
    <div ref={ref} className="image-item">
      <img src={item.src} alt="" style={{ width: item.size, height: 'auto' }} />
      <input type="range" min={60} max={320} value={item.size} onChange={(e) => updateSize(index, Number(e.target.value))} className="image-size-slider" />
      <button type="button" className="comunicados-remove-image" onClick={() => remove(index)}>×</button>
    </div>
  );
}

function ImagesDropzone({ images, setImages }) {
  const onDrop = useCallback((acceptedFiles) => {
    const newItems = acceptedFiles.map((file) => ({ id: `${Date.now()}-${Math.random()}`, src: URL.createObjectURL(file), file, size: 160 }));
    setImages((prev) => [...prev, ...newItems]);
  }, [setImages]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });
  const moveItem = (from, to) => { const next = [...images]; const [m] = next.splice(from, 1); next.splice(to, 0, m); setImages(next); };
  const updateSize = (idx, size) => setImages((prev) => prev.map((it, i) => (i === idx ? { ...it, size } : it)));
  const remove = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));
  return (
    <div className="image-upload-container">
      <div {...getRootProps({ className: 'image-dropzone' })}>
        <input {...getInputProps()} />
        <span>{isDragActive ? 'Suelta la imagen aquí' : 'Arrastra la imagen o haz clic aquí'}</span>
      </div>
      <div className="image-preview-panel">
        {images.map((item, index) => (
          <DraggableImage key={item.id || index} item={item} index={index} moveItem={moveItem} updateSize={updateSize} remove={remove} />
        ))}
      </div>
    </div>
  );
}

function InformativoEditor() {
  const [titulo, setTitulo] = useState('Comunicado Oficial');
  const [contenido, setContenido] = useState('<p>Se informa a la comunidad educativa...</p>');
  const [imagenes, setImagenes] = useState([{ id: 'init-1', src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=60', w: 160, h: 100, x: 16, y: 220, z: 10, lock: true }]);
  const [links, setLinks] = useState([{ label: 'Sitio Oficial', url: 'https://www.ejemplo.edu' }]);
  const [icons, setIcons] = useState(['info']);
  const [iconUrls, setIconUrls] = useState([]);
  const [errors, setErrors] = useState({});
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgImage, setBgImage] = useState('');
  const [bgOpacity, setBgOpacity] = useState(0.0);
  const [cardWidth, setCardWidth] = useState(640);
  const [cardHeight, setCardHeight] = useState(360);
  const [selectedId, setSelectedId] = useState(null);
  const [pendingImage, setPendingImage] = useState(null);
  const [importMode, setImportMode] = useState('content');
  const notify = useNotification();
  const navigate = useNavigate();

  const addImage = (url) => { if (url) setImagenes((prev) => [...prev, { id: `${Date.now()}`, src: url, size: 160 }]); };
  const removeImage = (idx) => setImagenes((prev) => prev.filter((_, i) => i !== idx));
  const addLink = (label, url) => { if (label && url) setLinks((prev) => [...prev, { label, url }]); };
  const removeLink = (idx) => setLinks((prev) => prev.filter((_, i) => i !== idx));
  const addIcon = (key) => setIcons((prev) => [...prev, key]);
  const removeIcon = (idx) => setIcons((prev) => prev.filter((_, i) => i !== idx));
  const addIconUrl = (url) => { if (url) setIconUrls((p) => [...p, url]); };
  const removeIconUrl = (idx) => setIconUrls((p) => p.filter((_, i) => i !== idx));
  const validate = async () => {
    const e = {};
    if (!titulo.trim()) e.titulo = 'Requerido';
    if (!contenido.trim()) e.contenido = 'Requerido';
    setErrors(e);
    if (Object.keys(e).length === 0) {
      try {
        const payload = {
          tipo: 'informativo',
          titulo,
          contenido,
          bgColor,
          bgImage,
          bgOpacity,
          imagenes,
          links,
          icons,
          iconUrls
        };
        await comunicadosService.createComunicado(payload);
        notify('Comunicado creado exitosamente', 'success');
        navigate('/comunicados');
      } catch (error) {
        notify(error?.message || 'Error al crear el comunicado', 'error');
      }
    }
  };
  const iconMap = { info: <FiInfo />, book: <FiBook />, alert: <FiAlertTriangle /> };
  const previewStyle = { backgroundColor: bgColor, backgroundImage: bgImage ? `url(${bgImage})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' };

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const snap = (v) => Math.round(v / 4) * 4;
  const setImagePosition = (id, nx, ny) => {
    setImagenes((prev) => prev.map((it) => (it.id === id ? { ...it, x: nx, y: ny } : it)));
  };
  const setImageSize = (id, w, h) => {
    setImagenes((prev) => prev.map((it) => (it.id === id ? { ...it, w, h } : it)));
  };
  const setImageLayer = (id, z) => {
    setImagenes((prev) => prev.map((it) => (it.id === id ? { ...it, z } : it)));
  };

  function CanvasImage({ item, canvasRef, textRef }) {
    const onPointerDown = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const textRect = textRef.current ? textRef.current.getBoundingClientRect() : null;
      const startX = e.clientX;
      const startY = e.clientY;
      const offX = (item.x || 0);
      const offY = (item.y || 0);
      setSelectedId(item.id);
      const move = (ev) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        let nx = clamp(snap(offX + dx), 0, rect.width - (item.w || 120));
        let ny = clamp(snap(offY + dy), 0, rect.height - (item.h || 80));
        if (textRect) {
          const safe = {
            left: textRect.left - rect.left,
            top: textRect.top - rect.top,
            right: textRect.right - rect.left,
            bottom: textRect.bottom - rect.top,
          };
          const overlaps = nx < safe.right && nx + (item.w || 120) > safe.left && ny < safe.bottom && ny + (item.h || 80) > safe.top;
          if (overlaps) {
            const pushDown = safe.bottom + 8;
            const pushUp = safe.top - (item.h || 80) - 8;
            const pushRight = safe.right + 8;
            const pushLeft = safe.left - (item.w || 120) - 8;
            const roomBelow = rect.height - pushDown;
            const roomAbove = pushUp;
            if (roomBelow >= 0) {
              ny = clamp(pushDown, 0, rect.height - (item.h || 80));
            } else if (roomAbove >= 0) {
              ny = clamp(pushUp, 0, rect.height - (item.h || 80));
            } else if (rect.width - pushRight >= 0) {
              nx = clamp(pushRight, 0, rect.width - (item.w || 120));
            } else if (pushLeft >= 0) {
              nx = clamp(pushLeft, 0, rect.width - (item.w || 120));
            }
          }
        }
        setImagePosition(item.id, nx, ny);
      };
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    };
    return (
      <img
        src={item.src}
        alt=""
        style={{ position: 'absolute', left: item.x || 0, top: item.y || 0, width: item.w || 120, height: item.h || 'auto', zIndex: item.z || 10, cursor: 'grab' }}
        onPointerDown={onPointerDown}
        onClick={() => setSelectedId(item.id)}
      />
    );
  }

  function PreviewCanvas() {
    const canvasRef = useRef(null);
    const textRef = useRef(null);
    const onCanvasDrop = useCallback((acceptedFiles) => {
      const f = acceptedFiles[0];
      if (!f) return;
      if (!f.type.startsWith('image/')) return;
      const url = URL.createObjectURL(f);
      const img = new Image();
      img.onload = () => {
        if (importMode === 'background') {
          setBgImage(url);
        } else {
          const initW = Math.min(200, img.width);
          const initH = Math.round(initW * (img.height / img.width));
          const initY = Math.max(16, cardHeight - (initH + 24));
          setImagenes((p) => [...p, { id: `${Date.now()}`, src: url, w: initW, h: initH, x: 16, y: initY, z: 10, lock: true }]);
        }
      };
      img.src = url;
    }, [importMode, cardHeight]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: onCanvasDrop, accept: { 'image/*': [] }, multiple: false, noClick: true });
    const [resizing, setResizing] = useState(false);
    const onResizeStart = (e) => {
      e.preventDefault();
      setResizing(true);
      const rect = canvasRef.current.getBoundingClientRect();
      const startX = e.clientX;
      const startY = e.clientY;
      const baseW = rect.width;
      const baseH = rect.height;
      const move = (ev) => {
        const dw = ev.clientX - startX;
        const dh = ev.clientY - startY;
        setCardWidth((w) => clamp(baseW + dw, 280, 1200));
        setCardHeight((h) => clamp(baseH + dh, 180, 900));
      };
      const up = () => {
        setResizing(false);
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    };
    return (
      <div className="comunicados-preview-canvas" style={{ width: cardWidth, height: cardHeight }} ref={canvasRef} {...getRootProps()}>
        <input {...getInputProps()} />
        {bgImage && <div className="comunicados-bg" style={{ backgroundImage: `url(${bgImage})` }} />}
        <div className="preview-bg-overlay" style={{ background: bgColor, opacity: bgOpacity }} />
        <div className="comunicados-images-layer">
          {imagenes.map((img) => (<CanvasImage key={img.id} item={img} canvasRef={canvasRef} textRef={textRef} />))}
        </div>
        <div className="comunicados-canvas-text" ref={textRef} style={{ position: 'absolute', left: 16, top: 16, right: 16 }}>
          <div className="comunicados-preview-header"><span className="comunicados-type-badge publicado">Informativo</span></div>
          <h3 className="comunicados-card-title">{titulo}</h3>
          <div className="comunicados-view-text" dangerouslySetInnerHTML={{ __html: contenido }} />
          {icons.length > 0 && (<div className="comunicados-preview-icons">{icons.map((k, i) => (<div key={i} className="comunicados-preview-icon" onClick={() => removeIcon(i)}>{iconMap[k]}</div>))}</div>)}
          {iconUrls.length > 0 && (<div className="comunicados-preview-icons">{iconUrls.map((u, i) => (<img key={i} src={u} alt="icon" className="comunicados-icon-preview" onClick={() => removeIconUrl(i)} />))}</div>)}
          {links.length > 0 && (
            <div className="comunicados-preview-links">
              {links.map((l, i) => (
                <a key={i} href={l.url} className="comunicados-link" onClick={(e) => e.preventDefault()}>{l.label}<button type="button" className="comunicados-remove-image" onClick={() => removeLink(i)}>×</button></a>
              ))}
            </div>
          )}
        </div>
        {isDragActive && <div className="comunicados-canvas-drop-hint">Suelta aquí para {importMode === 'background' ? 'fondo' : 'agregar'}</div>}
      </div>
    );
  }

  function ImageManager() {
    const [localPreview, setLocalPreview] = useState(null);
    const [error, setError] = useState('');
    const onDrop = useCallback((acceptedFiles) => {
      const f = acceptedFiles[0];
      if (!f) return;
      if (!f.type.startsWith('image/')) { setError('Formato inválido'); return; }
      if (f.size > 6 * 1024 * 1024) { setError('Archivo muy grande'); return; }
      const url = URL.createObjectURL(f);
      const img = new Image();
      img.onload = () => {
        setError('');
        if (importMode === 'background') {
          setBgImage(url);
        } else {
          const initW = Math.min(200, img.width);
          const initH = Math.round(initW * (img.height / img.width));
          const initY = Math.max(16, cardHeight - (initH + 24));
          setImagenes((p) => [...p, { id: `${Date.now()}`, src: url, w: initW, h: initH, x: 16, y: initY, z: 10, lock: true }]);
        }
      };
      img.onerror = () => setError('No se pudo leer la imagen');
      img.src = url;
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });
    return (
      <div className="comunicados-image-manager">
        <div className="comunicados-inline">
          <label className="comunicados-form-label">Modo</label>
          <select className="comunicados-form-select" value={importMode} onChange={(e) => setImportMode(e.target.value)}>
            <option value="content">Contenido</option>
            <option value="background">Fondo</option>
          </select>
        </div>
        <div {...getRootProps({ className: 'image-dropzone' })}>
          <input {...getInputProps()} />
          <span>{isDragActive ? 'Suelta la imagen aquí' : 'Arrastra o haz clic para importar'}</span>
        </div>
        <div className="comunicados-inline">
          <input type="url" placeholder="https://..." id="info-img-url-unified" className="comunicados-form-input" />
          <button type="button" className="comunicados-add-image-button" onClick={() => {
            const url = document.getElementById('info-img-url-unified').value;
            if (!url) return;
            const img = new Image();
            img.onload = () => {
              if (importMode === 'background') {
                setBgImage(url);
              } else {
                const initW = Math.min(200, img.width);
                const initH = Math.round(initW * (img.height / img.width));
                const initY = Math.max(16, cardHeight - (initH + 24));
                setImagenes((p) => [...p, { id: `${Date.now()}`, src: url, w: initW, h: initH, x: 16, y: initY, z: 10, lock: true }]);
              }
            };
            img.src = url;
          }}>Previsualizar</button>
        </div>
        {error && <span className="comunicados-error-text">{error}</span>}
      </div>
    );
  }

  return (
    <div className="comunicados-template-card">
      <div className="comunicados-template-header"><h3 className="comunicados-template-title">Informativo</h3></div>
      <div className="comunicados-template-body">
        <div className="comunicados-template-form">
          <div className="comunicados-form-group">
            <label className="comunicados-form-label">Título</label>
            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="comunicados-form-input" />
            {errors.titulo && <span className="comunicados-error-text">{errors.titulo}</span>}
          </div>
          <div className="comunicados-form-group"><label className="comunicados-form-label">Contenido</label><QuillEditor value={contenido} onChange={setContenido} />{errors.contenido && <span className="comunicados-error-text">{errors.contenido}</span>}</div>
          <div className="comunicados-form-row">
            <div className="comunicados-form-group"><label className="comunicados-form-label">Fondo</label><input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="comunicados-form-input" /></div>
            <div className="comunicados-form-group"><label className="comunicados-form-label">Opacidad fondo</label><input type="range" min={0} max={1} step={0.05} value={bgOpacity} onChange={(e) => setBgOpacity(parseFloat(e.target.value))} className="comunicados-range" /></div>
          </div>
          
          <div className="comunicados-form-group">
            <label className="comunicados-form-label">Importar imágenes</label>
            <ImageManager />
          </div>
          <div className="comunicados-form-group"><label className="comunicados-form-label">Agregar link</label><div className="comunicados-inline"><input type="text" placeholder="Texto" id="info-link-label" className="comunicados-form-input" /><input type="url" placeholder="https://..." id="info-link-url" className="comunicados-form-input" /><button type="button" className="comunicados-submit-button" onClick={() => addLink(document.getElementById('info-link-label').value, document.getElementById('info-link-url').value)}>Agregar</button></div></div>
          <div className="comunicados-form-group"><label className="comunicados-form-label">URL de icono</label><div className="comunicados-inline"><input type="url" id="icon-url" className="comunicados-form-input" placeholder="https://.../icon.png" /><button type="button" className="comunicados-submit-button" onClick={() => addIconUrl(document.getElementById('icon-url').value)}>Agregar</button></div></div>
          <div className="comunicados-form-group"><label className="comunicados-form-label">Agregar icono</label><div className="comunicados-inline"><button type="button" className="comunicados-submit-button" onClick={() => addIcon('info')}>Info</button><button type="button" className="comunicados-submit-button" onClick={() => addIcon('book')}>Libro</button><button type="button" className="comunicados-submit-button" onClick={() => addIcon('alert')}>Alerta</button></div></div>
          {selectedId && (
            <div className="comunicados-form-group">
              <label className="comunicados-form-label">Controles del elemento seleccionado</label>
              <div className="comunicados-inline">
                <input type="number" min={20} max={1200} step={5} value={imagenes.find((i) => i.id === selectedId)?.w || 120} onChange={(e) => {
                  const img = imagenes.find((i) => i.id === selectedId);
                  const nw = clamp(parseInt(e.target.value || '0', 10), 20, 1200);
                  const nh = img.lock && img.h ? Math.round(nw * (img.h / (img.w || nw))) : img.h || 80;
                  setImageSize(selectedId, nw, nh);
                }} className="comunicados-form-input" />
                <input type="number" min={20} max={900} step={5} value={imagenes.find((i) => i.id === selectedId)?.h || 80} onChange={(e) => {
                  const img = imagenes.find((i) => i.id === selectedId);
                  const nh = clamp(parseInt(e.target.value || '0', 10), 20, 900);
                  const nw = img.lock && img.w ? Math.round(nh * (img.w / (img.h || nh))) : img.w || 120;
                  setImageSize(selectedId, nw, nh);
                }} className="comunicados-form-input" />
                <input type="number" min={0} max={cardWidth} value={imagenes.find((i) => i.id === selectedId)?.x || 0} onChange={(e) => setImagePosition(selectedId, clamp(parseInt(e.target.value || '0', 10), 0, cardWidth), imagenes.find((i) => i.id === selectedId)?.y || 0)} className="comunicados-form-input" />
                <input type="number" min={0} max={cardHeight} value={imagenes.find((i) => i.id === selectedId)?.y || 0} onChange={(e) => setImagePosition(selectedId, imagenes.find((i) => i.id === selectedId)?.x || 0, clamp(parseInt(e.target.value || '0', 10), 0, cardHeight))} className="comunicados-form-input" />
                <input type="number" min={0} max={50} value={imagenes.find((i) => i.id === selectedId)?.z || 1} onChange={(e) => setImageLayer(selectedId, clamp(parseInt(e.target.value || '0', 10), 0, 50))} className="comunicados-form-input" />
                <label className="comunicados-form-label"><input type="checkbox" checked={imagenes.find((i) => i.id === selectedId)?.lock || false} onChange={(e) => setImagenes((prev) => prev.map((it) => (it.id === selectedId ? { ...it, lock: e.target.checked } : it)))} /> Mantener proporción</label>
                <button type="button" className="comunicados-cancel-button" onClick={() => setSelectedId(null)}>Cerrar</button>
              </div>
            </div>
          )}
          <div className="comunicados-form-actions"><button type="button" className="comunicados-submit-button" onClick={validate}>Validar</button></div>
        </div>
        <div className="comunicados-template-preview" style={previewStyle}>
          <PreviewCanvas />
        </div>
      </div>
    </div>
  );
}

function PreviasEditor() {
  const [fechas, setFechas] = useState(['2025-03-01']);
  const [materias, setMaterias] = useState(['Matemática I']);
  const [requisitos, setRequisitos] = useState('DNI, Libreta, Constancia de alumno regular');
  const [contacto, setContacto] = useState({ nombre: 'Secretaría', email: 'secretaria@ejemplo.edu', telefono: '123456789' });
  const [errors, setErrors] = useState({});
  const notify = useNotification();
  const navigate = useNavigate();
  const addFecha = (v) => { if (v) setFechas((p) => [...p, v]); };
  const removeFecha = (i) => setFechas((p) => p.filter((_, idx) => idx !== i));
  const addMateria = (v) => { if (v) setMaterias((p) => [...p, v]); };
  const removeMateria = (i) => setMaterias((p) => p.filter((_, idx) => idx !== i));
  const validate = async () => {
    const e = {};
    if (fechas.length === 0) e.fechas = 'Agregar al menos una fecha';
    if (materias.length === 0) e.materias = 'Agregar al menos una materia';
    setErrors(e);
    if (Object.keys(e).length === 0) {
      try {
        const payload = {
          tipo: 'previas',
          titulo: 'Inscripciones a Previas',
          fechas,
          materias,
          requisitos,
          contacto
        };
        await comunicadosService.createComunicado(payload);
        notify('Comunicado creado exitosamente', 'success');
        navigate('/comunicados');
      } catch (error) {
        notify(error?.message || 'Error al crear el comunicado', 'error');
      }
    }
  };
  return (
    <div className="comunicados-template-card">
      <div className="comunicados-template-header"><h3 className="comunicados-template-title">Previas</h3></div>
      <div className="comunicados-template-body">
        <div className="comunicados-template-form">
          <div className="comunicados-form-group">
            <label className="comunicados-form-label">Fecha</label>
            <div className="comunicados-inline"><input type="date" id="previas-fecha" className="comunicados-form-input" /><button type="button" className="comunicados-submit-button" onClick={() => addFecha(document.getElementById('previas-fecha').value)}>Agregar</button></div>
            {errors.fechas && <span className="comunicados-error-text">{errors.fechas}</span>}
          </div>
          <div className="comunicados-form-group">
            <label className="comunicados-form-label">Materia</label>
            <div className="comunicados-inline"><input type="text" id="previas-materia" placeholder="Nombre" className="comunicados-form-input" /><button type="button" className="comunicados-submit-button" onClick={() => addMateria(document.getElementById('previas-materia').value)}>Agregar</button></div>
            {errors.materias && <span className="comunicados-error-text">{errors.materias}</span>}
          </div>
          <div className="comunicados-form-group"><label className="comunicados-form-label">Requisitos</label><textarea value={requisitos} onChange={(e) => setRequisitos(e.target.value)} className="comunicados-form-input" /></div>
          <div className="comunicados-form-group">
            <label className="comunicados-form-label">Contacto</label>
            <div className="comunicados-inline"><input type="text" value={contacto.nombre} onChange={(e) => setContacto({ ...contacto, nombre: e.target.value })} className="comunicados-form-input" placeholder="Nombre" /><input type="email" value={contacto.email} onChange={(e) => setContacto({ ...contacto, email: e.target.value })} className="comunicados-form-input" placeholder="Email" /><input type="text" value={contacto.telefono} onChange={(e) => setContacto({ ...contacto, telefono: e.target.value })} className="comunicados-form-input" placeholder="Teléfono" /></div>
          </div>
          <div className="comunicados-form-actions"><button type="button" className="comunicados-submit-button" onClick={validate}>Validar</button></div>
        </div>
        <div className="comunicados-template-preview">
          <div className="comunicados-preview-header"><span className="comunicados-type-badge publicado">Inscripciones a Previas</span></div>
          <h3 className="comunicados-card-title">Fechas</h3>
          <ul className="comunicados-list-simple">{fechas.map((f, i) => (<li key={i} className="comunicados-list-item" onClick={() => removeFecha(i)}>{f}</li>))}</ul>
          <h3 className="comunicados-card-title">Materias</h3>
          <ul className="comunicados-list-simple">{materias.map((m, i) => (<li key={i} className="comunicados-list-item" onClick={() => removeMateria(i)}>{m}</li>))}</ul>
          <h3 className="comunicados-card-title">Requisitos</h3>
          <p className="comunicados-view-text">{requisitos}</p>
          <div className="comunicados-contact"><div>{contacto.nombre}</div><div>{contacto.email}</div><div>{contacto.telefono}</div></div>
        </div>
      </div>
    </div>
  );
}

function SocialEditor() {
  const [mensaje, setMensaje] = useState('¡Mirá las fotos del evento!');
  const [etiquetas, setEtiquetas] = useState(['evento', 'comunidad', 'escuela']);
  const [galeria, setGaleria] = useState([
    { id: 's-1', src: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=600&q=60', size: 160 },
    { id: 's-2', src: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=60', size: 160 },
  ]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgImage, setBgImage] = useState('');
  const [bgOpacity, setBgOpacity] = useState(0.0);
  const [errors, setErrors] = useState({});
  const notify = useNotification();
  const navigate = useNavigate();
  const addImagen = (url) => { if (url) setGaleria((p) => [...p, { id: `${Date.now()}`, src: url, size: 160 }]); };
  const removeImagen = (i) => setGaleria((p) => p.filter((_, idx) => idx !== i));
  const addEtiqueta = (tag) => { if (tag) setEtiquetas((p) => [...p, tag]); };
  const removeEtiqueta = (i) => setEtiquetas((p) => p.filter((_, idx) => idx !== i));
  const validate = async () => {
    const e = {};
    if (!mensaje.trim()) e.mensaje = 'Requerido';
    setErrors(e);
    if (Object.keys(e).length === 0) {
      try {
        const payload = {
          tipo: 'social',
          titulo: 'Social',
          mensaje,
          etiquetas,
          bgColor,
          bgImage,
          bgOpacity,
          galeria: galeria.map((g) => ({ src: g.src }))
        };
        await comunicadosService.createComunicado(payload);
        notify('Comunicado creado exitosamente', 'success');
        navigate('/comunicados');
      } catch (error) {
        notify(error?.message || 'Error al crear el comunicado', 'error');
      }
    }
  };
  const previewStyle = { backgroundColor: bgColor, backgroundImage: bgImage ? `url(${bgImage})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' };
  return (
    <div className="comunicados-template-card">
      <div className="comunicados-template-header"><h3 className="comunicados-template-title">Social</h3></div>
      <div className="comunicados-template-body">
        <div className="comunicados-template-form">
          <div className="comunicados-form-group"><label className="comunicados-form-label">Mensaje</label><input type="text" value={mensaje} onChange={(e) => setMensaje(e.target.value)} className="comunicados-form-input" />{errors.mensaje && <span className="comunicados-error-text">{errors.mensaje}</span>}</div>
          <div className="comunicados-form-group"><label className="comunicados-form-label">Agregar etiqueta</label><div className="comunicados-inline"><input type="text" id="social-tag" className="comunicados-form-input" /><button type="button" className="comunicados-submit-button" onClick={() => addEtiqueta(document.getElementById('social-tag').value)}>Agregar</button></div></div>
          <div className="comunicados-form-group"><label className="comunicados-form-label">Agregar imagen (URL)</label><div className="comunicados-inline"><input type="url" id="social-img" className="comunicados-form-input" placeholder="https://..." /><button type="button" className="comunicados-add-image-button" onClick={() => addImagen(document.getElementById('social-img').value)}>Agregar</button></div></div>
          <ImagesDropzone images={galeria} setImages={setGaleria} />
          <div className="comunicados-form-row">
            <div className="comunicados-form-group"><label className="comunicados-form-label">Fondo</label><input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="comunicados-form-input" /></div>
            <div className="comunicados-form-group"><label className="comunicados-form-label">Imagen de fondo (URL)</label><input type="url" value={bgImage} onChange={(e) => setBgImage(e.target.value)} className="comunicados-form-input" placeholder="https://..." /></div>
            <div className="comunicados-form-group"><label className="comunicados-form-label">Opacidad fondo</label><input type="range" min={0} max={1} step={0.05} value={bgOpacity} onChange={(e) => setBgOpacity(parseFloat(e.target.value))} className="comunicados-range" /></div>
          </div>
          <div className="comunicados-form-actions"><button type="button" className="comunicados-submit-button" onClick={validate}>Validar</button></div>
        </div>
        <div className="comunicados-template-preview" style={previewStyle}>
          <div className="preview-bg-overlay" style={{ background: bgColor, opacity: bgOpacity }} />
          <div className="comunicados-preview-header"><span className="comunicados-type-badge publicado">Social</span></div>
          <p className="comunicados-view-text">{mensaje}</p>
          {etiquetas.length > 0 && (<div className="comunicados-tags">{etiquetas.map((t, i) => (<span key={i} className="comunicados-tag" onClick={() => removeEtiqueta(i)}>#{t}</span>))}</div>)}
          {galeria.length > 0 && (<div className="comunicados-gallery-preview-grid">{galeria.map((img, i) => (<div key={img.id || i} className="comunicados-gallery-item"><img src={img.src} alt="" style={{ width: img.size, height: 'auto' }} /><button type="button" className="comunicados-remove-image" onClick={() => removeImagen(i)}>×</button></div>))}</div>)}
        </div>
      </div>
    </div>
  );
}

export default function EditorComunicado() {
  const { tipo } = useParams();
  const navigate = useNavigate();
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="comunicados-container">
        <div className="comunicados-header">
          <button className="volver-button" onClick={() => navigate('/comunicados/crear')}>Volver</button>
          <div className="comunicados-header-content">
            <h1 className="comunicados-title">Crear Comunicado</h1>
            <p className="comunicados-subtitle">Edición en tiempo real</p>
          </div>
        </div>
        {tipo === 'informativo' && <InformativoEditor />}
        {tipo === 'previas' && <PreviasEditor />}
        {tipo === 'social' && <SocialEditor />}
      </div>
    </DndProvider>
  );
}
