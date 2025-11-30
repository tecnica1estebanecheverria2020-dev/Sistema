import React, { useState } from 'react';
import './style.css';
import { useComunicados } from './hooks/useComunicados';
import Section from '../../shared/components/Section/Section.jsx';
import Stats from './components/Stats.jsx';
import Filters from './components/Filters.jsx';
import Card from './components/Card.jsx';
import ViewModal from './components/ViewModal.jsx';
import Modal from '../../shared/components/Modal/Modal.jsx';
import useNotification from '../../shared/hooks/useNotification.jsx';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiTrash2, FiAlertTriangle } from 'react-icons/fi';

export default function Comunicados() {
  const navigate = useNavigate();
  const notify = useNotification();
  
  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [verificationWord, setVerificationWord] = useState('');
  const [userInputWord, setUserInputWord] = useState('');

  const {
    comunicados,
    filteredComunicados,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    isViewModalOpen,
    setIsViewModalOpen,
    selectedComunicado,
    expandedCards,
    toggleCardExpansion,
    openViewModal,
    stripHtml,
    deleteComunicado
  } = useComunicados();

  const publishedCount = comunicados.filter((c) => c.tipo === 'Publicado').length;
  const draftCount = comunicados.filter((c) => c.tipo === 'Borrador').length;
  const totalCount = comunicados.length;

  const handleDeleteRequest = (id) => {
    const words = ['CONFIRMAR', 'BORRAR', 'ELIMINAR', 'SEGURIDAD', 'SISTEMA', 'TECNISTOCK'];
    const word = words[Math.floor(Math.random() * words.length)];
    setVerificationWord(word);
    setUserInputWord('');
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userInputWord.toUpperCase() !== verificationWord) {
      notify('La palabra de verificación no coincide', 'error');
      return;
    }
    
    const success = await deleteComunicado(deleteId);
    if (success) {
      notify('Comunicado eliminado correctamente', 'success');
      setIsDeleteModalOpen(false);
    } else {
      notify('Error al eliminar el comunicado', 'error');
    }
  };

  return (
    <Section
      title="Comunicados"
      subtitle="Gestión de anuncios y publicaciones"
      icon={FiBell}
      onAdd={() => navigate('/comunicados/crear')}
      addButtonText="Nuevo Comunicado"
    >
      <Stats publishedCount={publishedCount} draftCount={draftCount} totalCount={totalCount} />
      <Filters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterType={filterType}
        onFilterChange={setFilterType}
      />
      <div className="comunicados-list">
        {filteredComunicados.length === 0 ? (
          <div className="comunicados-empty-state">
            <p>No se encontraron comunicados</p>
            <p className="comunicados-empty-subtitle">
              {searchTerm || filterType !== 'todos' ? 'Intenta ajustar los filtros' : 'Comienza creando un comunicado'}
            </p>
          </div>
        ) : (
          filteredComunicados.map((comunicado) => (
            <Card
              key={comunicado.id}
              comunicado={comunicado}
              isExpanded={expandedCards.has(comunicado.id)}
              onToggle={() => toggleCardExpansion(comunicado.id)}
              onView={() => openViewModal(comunicado)}
              onDelete={() => handleDeleteRequest(comunicado.id)}
              stripHtml={stripHtml}
            />
          ))
        )}
      </div>
      <ViewModal isOpen={isViewModalOpen} comunicado={selectedComunicado} onClose={() => setIsViewModalOpen(false)} />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Eliminar Comunicado"
        icon={FiAlertTriangle}
      >
        <div style={{ padding: '1rem' }}>
          <p style={{ marginBottom: '1rem', color: '#495057' }}>
            ¿Estás seguro de que deseas eliminar este comunicado? Esta acción no se puede deshacer.
          </p>
          
          <div style={{ background: '#fff5f5', padding: '1rem', borderRadius: '8px', border: '1px solid #ffc9c9', marginBottom: '1.5rem' }}>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#c92a2a', fontWeight: 600 }}>
              Para confirmar, escribe la siguiente palabra:
            </p>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e03131', letterSpacing: '2px', textAlign: 'center', margin: '0.5rem 0' }}>
              {verificationWord}
            </div>
          </div>

          <input
            type="text"
            value={userInputWord}
            onChange={(e) => setUserInputWord(e.target.value.toUpperCase())}
            placeholder="Escribe la palabra aquí"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              marginBottom: '1.5rem',
              textAlign: 'center',
              textTransform: 'uppercase'
            }}
          />

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                color: '#495057',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={userInputWord !== verificationWord}
              style={{
                padding: '0.75rem 1.5rem',
                background: userInputWord === verificationWord ? '#fa5252' : '#ffc9c9',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: 600,
                cursor: userInputWord === verificationWord ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s'
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>
    </Section>
  );
}
