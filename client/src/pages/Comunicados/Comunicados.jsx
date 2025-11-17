import React from 'react';
import './style.css';
import { useComunicados } from './hooks/useComunicados';
import Header from './components/Header.jsx';
import Stats from './components/Stats.jsx';
import Filters from './components/Filters.jsx';
import Card from './components/Card.jsx';
import ViewModal from './components/ViewModal.jsx';
import { useNavigate } from 'react-router-dom';

export default function Comunicados() {
  const navigate = useNavigate();
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
  } = useComunicados();

  const publishedCount = comunicados.filter((c) => c.tipo === 'Publicado').length;
  const draftCount = comunicados.filter((c) => c.tipo === 'Borrador').length;
  const totalCount = comunicados.length;

  return (
    <div className="comunicados-container">
      <Header onAdd={() => navigate('/comunicados/crear')} />
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
              stripHtml={stripHtml}
            />
          ))
        )}
      </div>
      <ViewModal isOpen={isViewModalOpen} comunicado={selectedComunicado} onClose={() => setIsViewModalOpen(false)} />
      
    </div>
  );
}
