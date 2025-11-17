import { useState, useEffect, useRef, useCallback } from 'react';

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
  };
};