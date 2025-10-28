import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiPackage, FiFilter, FiBox, FiChevronDown } from 'react-icons/fi';
import { useInventario } from '../../shared/hooks/useInventario';
import './style.css';

const Inventario = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [formData, setFormData] = useState({
    code: '',
    category: '',
    amount: 0,
    available: 0,
    state: 'Disponible',
    location: '',
    description: ''
  });

  const { items, loading, error, fetchItems, createItem, updateItem, deleteItem } = useInventario();

  // Componente Select personalizado
  const CustomSelect = ({ value, onChange, options, placeholder, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className={`custom-select ${className} ${isOpen ? 'open' : ''}`}>
        <div 
          className="select-trigger"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="select-value">
            {value || placeholder}
          </span>
          <FiChevronDown className="select-arrow" />
        </div>
        {isOpen && (
          <div className="select-dropdown">
            {options.map((option, index) => (
              <div
                key={index}
                className={`select-option ${value === option.value ? 'selected' : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Obtener categorías únicas para el filtro
  const categories = [...new Set(items.map(item => item.category))].filter(Boolean);

  // Filtrar y ordenar items
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesState = !stateFilter || item.state === stateFilter;
    const matchesLocation = !locationFilter || item.location?.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesState && matchesLocation;
  }).sort((a, b) => {
    let aValue = a[sortBy] || '';
    let bValue = b[sortBy] || '';
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormData({
      code: item.code || '',
      category: item.category || '',
      amount: Number(item.amount ?? 0),
      available: Number(item.available ?? 0),
      state: item.state || 'Disponible',
      location: item.location || '',
      description: item.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este item?')) {
      await deleteItem(item.id_inventory);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      code: formData.code,
      category: formData.category,
      amount: Number(formData.amount),
      available: Number(formData.available),
      state: formData.state,
      location: formData.location,
      description: formData.description
    };

    if (currentItem?.id_inventory) {
      await updateItem(currentItem.id_inventory, payload);
    } else {
      await createItem(payload);
    }

    setIsModalOpen(false);
    setCurrentItem(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      code: '',
      category: '',
      amount: 0,
      available: 0,
      state: 'Disponible',
      location: '',
      description: ''
    });
  };

  const getStateClass = (state) => {
    switch (state?.toLowerCase()) {
      case 'disponible':
        return 'disponible';
      case 'mantenimiento':
        return 'mantenimiento';
      case 'no disponible':
        return 'no-disponible';
      default:
        return 'disponible';
    }
  };

  if (loading) {
    return (
      <div className="inventory-container">
        <div className="loading-state">
          <FiPackage className="loading-icon" />
          <p>Cargando inventario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inventory-container">
        <div className="error-state">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-container">
      {/* Header */}
      <div className="inventory-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="inventory-title">Inventario</h1>
            <p className="inventory-subtitle">Administración de ítems del servidor</p>
          </div>
          <button
            onClick={() => {
              setCurrentItem(null);
              resetForm();
              setIsModalOpen(true);
            }}
            className="inventory-add-button"
          >
            <FiPlus className="inventory-add-icon" />
            Agregar Ítem
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="inventory-filters">
        <div className="inventory-search-container">
          <FiSearch className="inventory-search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre, código o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="inventory-search-input"
          />
        </div>
        
        <div className="inventory-filters-row">
          <CustomSelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { value: '', label: 'Todas las categorías' },
              ...categories.map(cat => ({ value: cat, label: cat }))
            ]}
            placeholder="Categoría"
            className="inventory-filter-select"
          />
          
          <CustomSelect
            value={stateFilter}
            onChange={setStateFilter}
            options={[
              { value: '', label: 'Todos los estados' },
              { value: 'Disponible', label: 'Disponible' },
              { value: 'Mantenimiento', label: 'Mantenimiento' },
              { value: 'No disponible', label: 'No disponible' }
            ]}
            placeholder="Estado"
            className="inventory-filter-select"
          />
          
          <div className="inventory-location-filter">
            <input
              type="text"
              placeholder="Filtrar por ubicación..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="inventory-location-input"
            />
          </div>
          
          <CustomSelect
            value={`${sortBy}-${sortOrder}`}
            onChange={(value) => {
              const [field, order] = value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            options={[
              { value: 'name-asc', label: 'Nombre A-Z' },
              { value: 'name-desc', label: 'Nombre Z-A' },
              { value: 'category-asc', label: 'Categoría A-Z' },
              { value: 'amount-desc', label: 'Cantidad mayor' },
              { value: 'amount-asc', label: 'Cantidad menor' }
            ]}
            placeholder="Ordenar por"
            className="inventory-sort-select"
          />
        </div>

        <div className="inventory-results-count">
          <span className="inventory-count-text">Total: {filteredItems.length} ítems</span>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="inventory-table-container">
        {filteredItems.length === 0 ? (
          <div className="inventory-empty-state">
            <FiPackage className="inventory-empty-icon" />
            <p>No se encontraron ítems</p>
            <p className="inventory-empty-subtitle">
              {searchTerm || categoryFilter ? 'Intenta ajustar los filtros' : 'Comienza agregando un ítem'}
            </p>
          </div>
        ) : (
          <table className="inventory-table">
            <thead className="inventory-table-header">
              <tr className="inventory-table-row">
                <th className="inventory-table-cell inventory-header-cell">Nombre</th>
                <th className="inventory-table-cell inventory-header-cell">Categoría</th>
                <th className="inventory-table-cell inventory-header-cell">Cantidad</th>
                <th className="inventory-table-cell inventory-header-cell">Disponible</th>
                <th className="inventory-table-cell inventory-header-cell">Estado</th>
                <th className="inventory-table-cell inventory-header-cell">Ubicación</th>
                <th className="inventory-table-cell inventory-header-cell">Acciones</th>
              </tr>
            </thead>
            <tbody className="inventory-table-body">
              {filteredItems.map((item) => (
                <tr key={item.id_inventory} className="inventory-table-row">
                  <td className="inventory-table-cell">
                    <div className="inventory-item-name">
                      <span className="inventory-name-text">{item.code}</span>
                      {item.description && (
                        <span className="inventory-description-text">{item.description}</span>
                      )}
                    </div>
                  </td>
                  <td className="inventory-table-cell">
                    <span className="inventory-category-badge">{item.category}</span>
                  </td>
                  <td className="inventory-table-cell">
                    <span className="inventory-quantity-text">{item.amount}</span>
                  </td>
                  <td className="inventory-table-cell">
                    <span className="inventory-available-text">{item.available}</span>
                  </td>
                  <td className="inventory-table-cell">
                    <span className={`inventory-state-badge ${getStateClass(item.state)}`}>
                      {item.state}
                    </span>
                  </td>
                  <td className="inventory-table-cell">
                    <span className="inventory-location-text">{item.location}</span>
                  </td>
                  <td className="inventory-table-cell">
                    <div className="inventory-actions-container">
                      <button
                        onClick={() => handleEdit(item)}
                        className="inventory-action-button inventory-edit-button"
                        title="Editar"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="inventory-action-button inventory-delete-button"
                        title="Eliminar"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="inventory-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="inventory-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="inventory-modal-header">
              <div className="inventory-modal-header-content">
                <FiBox className="inventory-modal-icon" />
                <div className="inventory-modal-header-text">
                  <h2 className="inventory-modal-title">
                    {currentItem ? 'Editar Ítem' : 'Agregar Ítem'}
                  </h2>
                  <p className="inventory-modal-subtitle">
                    {currentItem ? 'Modifica los datos del ítem' : 'Completa los datos del nuevo ítem'}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="inventory-modal-form">
              <div className="inventory-form-grid">
                <div className="inventory-form-group">
                  <label className="inventory-form-label">Código</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    className="inventory-form-input"
                    placeholder="Ej: NB-001"
                    required
                  />
                </div>

                <div className="inventory-form-group">
                  <label className="inventory-form-label">Nombre del Ítem</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="inventory-form-input"
                    placeholder="Ej: Notebook HP ProBook"
                    required
                  />
                </div>

                <div className="inventory-form-group">
                  <label className="inventory-form-label">Categoría</label>
                  <CustomSelect
                    value={formData.category}
                    onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    options={[
                      { value: '', label: 'Seleccionar categoría' },
                      { value: 'Computadoras', label: 'Computadoras' },
                      { value: 'Periféricos', label: 'Periféricos' },
                      { value: 'Mobiliario', label: 'Mobiliario' },
                      { value: 'Electrónicos', label: 'Electrónicos' },
                      { value: 'Otros', label: 'Otros' }
                    ]}
                    placeholder="Seleccionar categoría"
                    className="inventory-form-select"
                  />
                </div>

                <div className="inventory-form-group">
                  <label className="inventory-form-label">Estado</label>
                  <CustomSelect
                    value={formData.state}
                    onChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                    options={[
                      { value: 'Disponible', label: 'Disponible' },
                      { value: 'Mantenimiento', label: 'Mantenimiento' },
                      { value: 'No disponible', label: 'No disponible' }
                    ]}
                    placeholder="Seleccionar estado"
                    className="inventory-form-select"
                  />
                </div>

                <div className="inventory-form-group">
                  <label className="inventory-form-label">Cantidad Total</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                    className="inventory-form-input"
                    min="0"
                    required
                  />
                </div>

                <div className="inventory-form-group">
                  <label className="inventory-form-label">Cantidad Disponible</label>
                  <input
                    type="number"
                    value={formData.available}
                    onChange={(e) => setFormData(prev => ({ ...prev, available: parseInt(e.target.value) || 0 }))}
                    className="inventory-form-input"
                    min="0"
                    max={formData.amount}
                    required
                  />
                </div>

                <div className="inventory-form-group inventory-form-group-full">
                  <label className="inventory-form-label">Ubicación</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="inventory-form-input"
                    placeholder="Ej: Oficina 201, Estante A"
                  />
                </div>

                <div className="inventory-form-group inventory-form-group-full">
                  <label className="inventory-form-label">Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="inventory-form-textarea"
                    placeholder="Descripción detallada del ítem..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="inventory-modal-actions">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="inventory-cancel-button"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inventory-submit-button"
                >
                  {currentItem ? 'Actualizar' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventario;