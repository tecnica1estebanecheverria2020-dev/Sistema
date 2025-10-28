import React, { useState, useEffect, useRef } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiCalendar, 
  FiUser, 
  FiX, 
  FiImage, 
  FiEye,
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import './style.css';

export default function Comunicados() {
  const [comunicados, setComunicados] = useState([]);
  const [filteredComunicados, setFilteredComunicados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedComunicado, setSelectedComunicado] = useState(null);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [formData, setFormData] = useState({
    titulo: '',
    autor: 'Admin',
    contenido: '',
    fechaProgramada: '',
    imagenHeader: '',
    galeria: [],
    tipo: 'Publicado'
  });
  
  const contentRef = useRef(null);

  // Datos de ejemplo con URLs de imágenes
  useEffect(() => {
    const comunicadosEjemplo = [
      {
        id: 1,
        titulo: 'Bienvenida al Nuevo Sistema TecniStock',
        autor: 'Dirección Técnica',
        contenido: `<p>Estimados estudiantes y docentes,</p>
        <p>Nos complace anunciar el lanzamiento de nuestro nuevo <strong>Sistema de Gestión de Inventario TecniStock</strong>. Este sistema revolucionario nos permitirá:</p>
        <ul>
          <li>Gestión completa de inventarios</li>
          <li>Sistema de préstamos con código QR</li>
          <li>Seguimiento en tiempo real</li>
          <li>Reportes automatizados</li>
        </ul>
        <p>Los invitamos a explorar todas las funcionalidades disponibles.</p>`,
        fecha: '15 de enero, 2024',
        fechaProgramada: '2024-01-15',
        tipo: 'Publicado',
        imagenHeader: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&h=400',
        galeria: [
          'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
          'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
        ]
      },
      {
        id: 2,
        titulo: 'Actualización Importante: Nuevos Equipos Disponibles',
        autor: 'Departamento de Inventario',
        contenido: `<p>Estimada comunidad educativa,</p>
        <p>Nos complace informar que hemos incorporado <strong>nuevos equipos tecnológicos</strong> a nuestro inventario:</p>
        <ul>
          <li><strong>20 Laptops</strong> - Lenovo ThinkPad E15</li>
          <li><strong>15 Tablets</strong> - Samsung Galaxy Tab A8</li>
          <li><strong>10 Proyectores</strong> - Epson PowerLite</li>
          <li><strong>5 Cámaras</strong> - Canon EOS Rebel</li>
        </ul>
        <p>Estos equipos están disponibles para préstamo a partir del <em>20 de marzo de 2024</em>.</p>`,
        fecha: '20 de marzo, 2024',
        fechaProgramada: '2024-03-20',
        tipo: 'Publicado',
        imagenHeader: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&h=400',
        galeria: [
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
          'https://images.unsplash.com/photo-1542393545-10f5cde2c810?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
          'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
        ]
      },
      {
        id: 3,
        titulo: 'Taller de Programación: Inscripciones Abiertas',
        autor: 'Coordinación Académica',
        contenido: `<p>¡Atención estudiantes!</p>
        <p>Están abiertas las inscripciones para el <strong>Taller de Programación Avanzada</strong>:</p>
        <h3>Detalles del Taller:</h3>
        <ul>
          <li><strong>Duración:</strong> 8 semanas</li>
          <li><strong>Modalidad:</strong> Presencial</li>
          <li><strong>Horarios:</strong> Martes y Jueves 14:00-16:00</li>
          <li><strong>Cupos:</strong> Limitados a 25 estudiantes</li>
        </ul>
        <p>Los temas incluyen <em>React, Node.js, bases de datos</em> y desarrollo de aplicaciones web modernas.</p>`,
        fecha: '10 de febrero, 2024',
        fechaProgramada: '2024-02-10',
        tipo: 'Borrador',
        imagenHeader: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&h=400',
        galeria: [
          'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
          'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
        ]
      }
    ];
    
    setComunicados(comunicadosEjemplo);
    setFilteredComunicados(comunicadosEjemplo);
  }, []);

  // Filtrar comunicados
  useEffect(() => {
    let filtered = comunicados;
    
    if (searchTerm) {
      filtered = filtered.filter(comunicado =>
        comunicado.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comunicado.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comunicado.contenido.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== 'todos') {
      filtered = filtered.filter(comunicado => comunicado.tipo === filterType);
    }
    
    setFilteredComunicados(filtered);
  }, [searchTerm, filterType, comunicados]);

  const toggleCardExpansion = (id) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const openViewModal = (comunicado) => {
    setSelectedComunicado(comunicado);
    setIsViewModalOpen(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newComunicado = {
      ...formData,
      id: Math.max(...comunicados.map(c => c.id), 0) + 1,
      fecha: new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
    
    setComunicados([newComunicado, ...comunicados]);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      autor: 'Admin',
      contenido: '',
      fechaProgramada: '',
      imagenHeader: '',
      galeria: [],
      tipo: 'Publicado'
    });
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      setFormData({ ...formData, contenido: contentRef.current.innerHTML });
    }
  };

  const addImageToGallery = () => {
    const url = prompt('Ingresa la URL de la imagen:');
    if (url) {
      setFormData({
        ...formData,
        galeria: [...formData.galeria, url]
      });
    }
  };

  const removeImageFromGallery = (index) => {
    const newGaleria = formData.galeria.filter((_, i) => i !== index);
    setFormData({ ...formData, galeria: newGaleria });
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <div className="comunicados-container">
      {/* Header */}
      <div className="comunicados-header">
        <div className="comunicados-header-content">
          <h1 className="comunicados-title">Comunicados</h1>
          <p className="comunicados-subtitle">Gestión de anuncios y publicaciones</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsCreateModalOpen(true);
          }}
          className="comunicados-add-button"
        >
          <FiPlus className="comunicados-add-icon" />
          Nuevo Comunicado
        </button>
      </div>

      {/* Estadísticas */}
      <div className="comunicados-stats">
        <div className="comunicados-stat-card">
          <div className="comunicados-stat-number">
            {comunicados.filter(c => c.tipo === 'Publicado').length}
          </div>
          <div className="comunicados-stat-label">Publicados</div>
        </div>
        <div className="comunicados-stat-card">
          <div className="comunicados-stat-number">
            {comunicados.filter(c => c.tipo === 'Borrador').length}
          </div>
          <div className="comunicados-stat-label">Borradores</div>
        </div>
        <div className="comunicados-stat-card">
          <div className="comunicados-stat-number">{comunicados.length}</div>
          <div className="comunicados-stat-label">Total</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="comunicados-filters">
        <div className="comunicados-search-container">
          <FiSearch className="comunicados-search-icon" />
          <input
            type="text"
            placeholder="Buscar comunicados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="comunicados-search-input"
          />
        </div>
        
        <div className="comunicados-filter-container">
          <FiFilter className="comunicados-filter-icon" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="comunicados-filter-select"
          >
            <option value="todos">Todos</option>
            <option value="Publicado">Publicados</option>
            <option value="Borrador">Borradores</option>
          </select>
        </div>
      </div>

      {/* Lista de Comunicados */}
      <div className="comunicados-list">
        {filteredComunicados.length === 0 ? (
          <div className="comunicados-empty-state">
            <FiSearch className="comunicados-empty-icon" />
            <p>No se encontraron comunicados</p>
            <p className="comunicados-empty-subtitle">
              {searchTerm || filterType !== 'todos' 
                ? 'Intenta ajustar los filtros' 
                : 'Comienza creando un comunicado'}
            </p>
          </div>
        ) : (
          filteredComunicados.map((comunicado) => (
            <div key={comunicado.id} className="comunicados-card">
              {comunicado.imagenHeader && (
                <div className="comunicados-card-header-image">
                  <img src={comunicado.imagenHeader} alt={comunicado.titulo} />
                </div>
              )}
              
              <div className="comunicados-card-content">
                <div className="comunicados-card-meta">
                  <span className={`comunicados-type-badge ${comunicado.tipo.toLowerCase()}`}>
                    {comunicado.tipo}
                  </span>
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
                      __html: expandedCards.has(comunicado.id) 
                        ? comunicado.contenido 
                        : stripHtml(comunicado.contenido).substring(0, 200) + '...'
                    }}
                  />
                </div>

                {comunicado.galeria && comunicado.galeria.length > 0 && expandedCards.has(comunicado.id) && (
                  <div className="comunicados-gallery-preview">
                    {comunicado.galeria.slice(0, 3).map((img, index) => (
                      <img key={index} src={img} alt={`Galería ${index + 1}`} />
                    ))}
                    {comunicado.galeria.length > 3 && (
                      <div className="comunicados-gallery-more">
                        +{comunicado.galeria.length - 3} más
                      </div>
                    )}
                  </div>
                )}
                
                <div className="comunicados-card-actions">
                  <button
                    onClick={() => toggleCardExpansion(comunicado.id)}
                    className="comunicados-expand-button"
                  >
                    {expandedCards.has(comunicado.id) ? (
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
                  
                  <button
                    onClick={() => openViewModal(comunicado)}
                    className="comunicados-view-button"
                  >
                    <FiEye />
                    Vista Previa
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Vista Previa */}
      {isViewModalOpen && selectedComunicado && (
        <div className="comunicados-modal-overlay" onClick={() => setIsViewModalOpen(false)}>
          <div className="comunicados-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="comunicados-view-header">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="comunicados-close-button"
              >
                <FiX />
              </button>
            </div>
            
            {selectedComunicado.imagenHeader && (
              <div className="comunicados-view-header-image">
                <img src={selectedComunicado.imagenHeader} alt={selectedComunicado.titulo} />
              </div>
            )}
            
            <div className="comunicados-view-content">
              <div className="comunicados-view-meta">
                <span className={`comunicados-type-badge ${selectedComunicado.tipo.toLowerCase()}`}>
                  {selectedComunicado.tipo}
                </span>
                <div className="comunicados-view-info">
                  <FiUser className="comunicados-info-icon" />
                  <span>{selectedComunicado.autor}</span>
                  <FiCalendar className="comunicados-info-icon" />
                  <span>{selectedComunicado.fecha}</span>
                </div>
              </div>
              
              <h2 className="comunicados-view-title">{selectedComunicado.titulo}</h2>
              
              <div 
                className="comunicados-view-text"
                dangerouslySetInnerHTML={{ __html: selectedComunicado.contenido }}
              />
              
              {selectedComunicado.galeria && selectedComunicado.galeria.length > 0 && (
                <div className="comunicados-view-gallery">
                  <h3>Galería de Imágenes</h3>
                  <div className="comunicados-gallery-grid">
                    {selectedComunicado.galeria.map((img, index) => (
                      <img key={index} src={img} alt={`Galería ${index + 1}`} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Crear/Editar */}
      {isCreateModalOpen && (
        <div className="comunicados-modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="comunicados-create-modal" onClick={(e) => e.stopPropagation()}>
            <div className="comunicados-create-header">
              <h3 className="comunicados-create-title">Nuevo Comunicado</h3>
              <p className="comunicados-create-subtitle">Crea un anuncio con formato enriquecido e imágenes</p>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="comunicados-close-button"
              >
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="comunicados-create-form">
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
                  <button
                    type="button"
                    onClick={addImageToGallery}
                    className="comunicados-add-image-button"
                  >
                    <FiImage />
                    Agregar Imagen
                  </button>
                  
                  {formData.galeria.length > 0 && (
                    <div className="comunicados-gallery-preview-grid">
                      {formData.galeria.map((img, index) => (
                        <div key={index} className="comunicados-gallery-item">
                          <img src={img} alt={`Galería ${index + 1}`} />
                          <button
                            type="button"
                            onClick={() => removeImageFromGallery(index)}
                            className="comunicados-remove-image"
                          >
                            <FiX />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="comunicados-form-actions">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="comunicados-cancel-button"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="comunicados-submit-button"
                >
                  Crear Comunicado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
