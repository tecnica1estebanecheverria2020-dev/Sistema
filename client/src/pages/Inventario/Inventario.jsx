import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiPackage, FiFilter, FiBox, FiChevronDown, FiLoader } from 'react-icons/fi';
import './style.css';
import { useInventario } from '../../shared/hooks/useInventario';
import ModalProduct from './ModalProduct';
import CustomSelect from './CustomSelect';
import Section from '../../shared/components/Section/Section.jsx';
import DataTable from '../../shared/components/DataTable/DataTable.jsx';

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
    name: '',
    category: '',
    amount: 0,
    available: 0,
    state: 'Disponible',
    location: '',
    description: ''
  });

  const { items, loading, error, fetchItems, createItem, updateItem, deleteItem } = useInventario();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Obtener categorías únicas para el filtro
  const categories = [...new Set(items.map(item => item.category))].filter(Boolean);

  // Filtrar y ordenar items
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      name: item.name || '',
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
      name: formData.name,
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
      name: '',
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

  // Componente de acciones para DataTable
  const InventoryActions = ({ row }) => (
    <div className="inventory-actions-container">
      <button
        onClick={() => handleEdit(row)}
        className="inventory-action-button inventory-edit-button"
        title="Editar"
      >
        <FiEdit2 />
      </button>
      <button
        onClick={() => handleDelete(row)}
        className="inventory-action-button inventory-delete-button"
        title="Eliminar"
      >
        <FiTrash2 />
      </button>
    </div>
  );

  if (loading) {
    return (
      <Section
        title="Inventario"
        subtitle="Administración de ítems del servidor"
        icon={FiPackage}
        showAddButton={false}
      >
        <div className="inventory-loading-state">
          <div className="inventory-spinner-wrapper">
            <FiLoader className="inventory-spinner" />
          </div>
          <p className="inventory-loading-text">Cargando inventario...</p>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section
        title="Inventario"
        subtitle="Administración de ítems del servidor"
        icon={FiPackage}
        showAddButton={false}
      >
        <div className="inventory-error-state">
          <p>Error: {error}</p>
        </div>
      </Section>
    );
  }

  return (
    <Section
      title="Inventario"
      subtitle="Administración de ítems del servidor"
      icon={FiPackage}
      onAdd={() => {
        setCurrentItem(null);
        resetForm();
        setIsModalOpen(true);
      }}
      addButtonText="Agregar Ítem"
    >

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
            placeholder="Todas las categorías"
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
            placeholder="Todos los estados"
            className="inventory-filter-select"
          />
          
          
          <CustomSelect
            showValue={false}
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
              { value: 'category-desc', label: 'Categoría Z-A' },
              { value: 'amount-desc', label: 'Cantidad mayor' },
              { value: 'amount-asc', label: 'Cantidad menor' }
            ]}
            placeholder="Ordenar por..."
            className="inventory-sort-select"
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

        </div>

        <div className="inventory-results-count">
          <span className="inventory-count-text">Total: {filteredItems.length} ítems</span>
        </div>
      </div>

      {/* Inventory Table */}
      <DataTable
        data={filteredItems}
        columns={[
          {
            key: 'code',
            label: 'Código',
            type: 'string',
            render: (value) => <span className="inventory-code-text">{value}</span>
          },
          {
            key: 'name',
            label: 'Nombre',
            type: 'string',
            render: (value, row) => (
              <div className="inventory-item-name">
                <span className="inventory-name-text">{value}</span>
                {row.description && (
                  <span className="inventory-description-text">{row.description}</span>
                )}
              </div>
            )
          },
          {
            key: 'category',
            label: 'Categoría',
            type: 'string',
            render: (value) => <span className="inventory-category-badge">{value}</span>
          },
          {
            key: 'amount',
            label: 'Cantidad',
            type: 'number',
            render: (value) => <span className="inventory-quantity-text">{value}</span>
          },
          {
            key: 'available',
            label: 'Disponible',
            type: 'number',
            render: (value) => <span className="inventory-available-text">{value}</span>
          },
          {
            key: 'state',
            label: 'Estado',
            type: 'string',
            render: (value) => (
              <span className={`inventory-state-badge ${getStateClass(value)}`}>
                {value}
              </span>
            )
          },
          {
            key: 'location',
            label: 'Ubicación',
            type: 'string',
            render: (value) => <span className="inventory-location-text">{value}</span>
          }
        ]}
        actions={<InventoryActions />}
        itemsPerPage={10}
        keyField="id_inventory"
        emptyState={
          <div className="inventory-empty-state">
            <FiPackage className="inventory-empty-icon" />
            <p>No se encontraron ítems</p>
            <p className="inventory-empty-subtitle">
              {searchTerm || categoryFilter ? 'Intenta ajustar los filtros' : 'Comienza agregando un ítem'}
            </p>
          </div>
        }
      />

      {/* Modal */}
      {isModalOpen && (
        <ModalProduct
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          currentItem={currentItem}
          handleSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
        />
      )}
    </Section>
  );
};

export default Inventario;