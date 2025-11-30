import { useState, useEffect, useRef, useCallback } from 'react';
import { comunicadosService } from '../services/comunicadosService';

export const useComunicados = () => {
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

  const mapRecords = useCallback((rows = []) => {
    return (rows || []).map((r) => {
      const tipoT = String(r.tipo || '').toLowerCase();
      const p = r.payload || {};
      // Prioritize header_image from payload, then bg_image_url, then fallback
      const headerImg = p.header_image || r.bg_image_url || (tipoT === 'informativo' ? (Array.isArray(p.imagenes) ? (p.imagenes[0]?.src || '') : '') : tipoT === 'social' ? (Array.isArray(p.galeria) ? (p.galeria[0]?.src || '') : '') : '');
      
      const galeria = tipoT === 'informativo' ? (Array.isArray(p.imagenes) ? p.imagenes.map((it) => it.src).filter(Boolean) : []) : tipoT === 'social' ? (Array.isArray(p.galeria) ? p.galeria.map((it) => it.src).filter(Boolean) : []) : [];
      let contenido = '';
      if (tipoT === 'informativo') contenido = r.contenido_html || '';
      if (tipoT === 'previas') {
        const fechas = Array.isArray(p.fechas) ? p.fechas : [];
        const materias = Array.isArray(p.materias) ? p.materias : [];
        const requisitos = p.requisitos || '';
        contenido = `<h3>Fechas</h3><ul>${fechas.map((f) => `<li>${f}</li>`).join('')}</ul><h3>Materias</h3><ul>${materias.map((m) => `<li>${m}</li>`).join('')}</ul><h3>Requisitos</h3><p>${requisitos}</p>`;
      }
      if (tipoT === 'social') {
        const mensaje = p.mensaje || '';
        const etiquetas = Array.isArray(p.etiquetas) ? p.etiquetas : [];
        contenido = `<p>${mensaje}</p>${etiquetas.length ? `<div>${etiquetas.map((t) => `#${t}`).join(' ')}</div>` : ''}`;
      }
      
      // Use fecha from payload if available, otherwise created_at
      let fecha = '';
      if (p.fecha) {
        fecha = new Date(p.fecha + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
      } else if (r.created_at) {
        fecha = new Date(r.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
      }

      return {
        id: r.id_comunicado,
        titulo: r.titulo,
        autor: r.author_name || 'Usuario',
        contenido,
        fecha,
        tipo: 'Publicado', // Assuming default or mapped from r.tipo? The original code hardcoded 'Publicado' in return, but r.tipo exists. Original code: tipo: 'Publicado'
        imagenHeader: headerImg,
        galeria,
        imagenes: p.imagenes || [],
        bgColor: r.bg_color,
        bgImage: r.bg_image_url,
        bgOpacity: r.bg_opacity,
        links: p.links || [],
        examenes: p.examenes || []
      };
    });
  }, []);

  const fetchComunicados = useCallback(async () => {
    try {
      const data = await comunicadosService.getComunicados();
      const list = mapRecords(data);
      setComunicados(list);
      setFilteredComunicados(list);
    } catch {
      setComunicados([]);
      setFilteredComunicados([]);
    }
  }, [mapRecords]);

  useEffect(() => {
    fetchComunicados();
  }, [fetchComunicados]);

  useEffect(() => {
    let filtered = comunicados;
    if (searchTerm) {
      filtered = filtered.filter((comunicado) =>
        comunicado.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comunicado.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comunicado.contenido.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterType !== 'todos') {
      filtered = filtered.filter((comunicado) => comunicado.tipo === filterType);
    }
    setFilteredComunicados(filtered);
  }, [searchTerm, filterType, comunicados]);

  const toggleCardExpansion = useCallback((id) => {
    const next = new Set(expandedCards);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpandedCards(next);
  }, [expandedCards]);

  const openViewModal = useCallback((comunicado) => {
    setSelectedComunicado(comunicado);
    setIsViewModalOpen(true);
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      titulo: '',
      autor: 'Admin',
      contenido: '',
      fechaProgramada: '',
      imagenHeader: '',
      galeria: [],
      tipo: 'Publicado',
    });
  }, []);

  const handleCreateSubmit = useCallback((e) => {
    e.preventDefault();
    const newComunicado = {
      ...formData,
      id: Math.max(...comunicados.map((c) => c.id), 0) + 1,
      fecha: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };
    setComunicados([newComunicado, ...comunicados]);
    resetForm();
    setIsCreateModalOpen(false);
  }, [formData, comunicados, resetForm]);

  const openCreateModal = useCallback(() => {
    resetForm();
    setIsCreateModalOpen(true);
  }, [resetForm]);

  const applyFormat = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  }, []);

  const handleContentChange = useCallback(() => {
    if (contentRef.current) {
      setFormData({ ...formData, contenido: contentRef.current.innerHTML });
    }
  }, [formData]);

  const addImageToGallery = useCallback(() => {
    const url = prompt('Ingresa la URL de la imagen:');
    if (url) {
      setFormData({
        ...formData,
        galeria: [...formData.galeria, url],
      });
    }
  }, [formData]);

  const removeImageFromGallery = useCallback((index) => {
    const next = formData.galeria.filter((_, i) => i !== index);
    setFormData({ ...formData, galeria: next });
  }, [formData]);

  const stripHtml = useCallback((html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }, []);

  const deleteComunicado = useCallback(async (id) => {
    try {
      await comunicadosService.deleteComunicado(id);
      setComunicados((prev) => prev.filter((c) => c.id !== id));
      setFilteredComunicados((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, []);

  return {
    comunicados,
    filteredComunicados,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isViewModalOpen,
    setIsViewModalOpen,
    selectedComunicado,
    setSelectedComunicado,
    expandedCards,
    toggleCardExpansion,
    formData,
    setFormData,
    contentRef,
    openViewModal,
    handleCreateSubmit,
    resetForm,
    openCreateModal,
    applyFormat,
    handleContentChange,
    addImageToGallery,
    removeImageFromGallery,
    stripHtml,
    fetchComunicados,
    deleteComunicado,
  };
};
