import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiEye, 
  FiRotateCcw, 
  FiX,
  FiUser,
  FiBook,
  FiCalendar,
  FiClock,
  FiCamera,
  FiChevronDown
} from 'react-icons/fi';
import './style.css';

export default function Prestamos() {
  const [loans, setLoans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    profesorAutorizante: '',
    solicitante: '',
    observaciones: ''
  });
  const [requestedItems, setRequestedItems] = useState([]);

  // Datos de ejemplo para préstamos
  useEffect(() => {
    setLoans([
      {
        id: 1,
        item: 'Notebook HP ProBook',
        cantidad: 1,
        solicitante: 'María Martínez',
        profesor: 'Prof. García',
        fechaHora: '2023-10-28 08:30',
        estado: 'Activo',
        acciones: 'Devolver'
      },
      {
        id: 2,
        item: 'Proyector Epson',
        cantidad: 2,
        solicitante: 'Carlos García',
        profesor: 'Prof. Rodríguez',
        fechaHora: '2023-10-28 09:15',
        estado: 'Activo',
        acciones: 'Devolver'
      },
      {
        id: 3,
        item: 'Alargue 5m',
        cantidad: 3,
        solicitante: 'Ana López',
        profesor: 'Prof. Fernández',
        fechaHora: '2023-10-28 10:00',
        estado: 'Activo',
        acciones: 'Devolver'
      }
    ]);
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para crear el préstamo
    console.log('Datos del préstamo:', formData);
    console.log('Items solicitados:', requestedItems);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      profesorAutorizante: '',
      solicitante: '',
      observaciones: ''
    });
    setRequestedItems([]);
  };

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = 
      loan.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.solicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.profesor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || loan.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (estado) => {
    switch (estado.toLowerCase()) {
      case 'activo':
        return 'status-active';
      case 'devuelto':
        return 'status-returned';
      case 'vencido':
        return 'status-overdue';
      default:
        return '';
    }
  };

  return (
    <div className="prestamos-container">
      {/* Header */}
      <div className="prestamos-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="page-title">Préstamos</h1>
            <p className="page-subtitle">Gestión de préstamos de equipamiento</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="add-button"
          >
            <FiPlus className="add-icon" />
            Nuevo Préstamo
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-number">6</div>
            <div className="stat-label">Total Préstamos</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-number">3</div>
            <div className="stat-label">Activos</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-number">3</div>
            <div className="stat-label">Devueltos</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="prestamos-filters">
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por ítem, solicitante o profesor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters-row">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${statusFilter === '' ? 'active' : ''}`}
              onClick={() => setStatusFilter('')}
            >
              Todos
            </button>
            <button 
              className={`filter-tab ${statusFilter === 'Activo' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Activo')}
            >
              Activos
            </button>
            <button 
              className={`filter-tab ${statusFilter === 'Devuelto' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Devuelto')}
            >
              Devueltos
            </button>
          </div>
        </div>
      </div>

      {/* Loans Table */}
      <div className="loans-table-container">
        <div className="table-header">
          <div className="table-cell">Ítem</div>
          <div className="table-cell">Cantidad</div>
          <div className="table-cell">Solicitante</div>
          <div className="table-cell">Profesor</div>
          <div className="table-cell">Fecha/Hora</div>
          <div className="table-cell">Estado</div>
          <div className="table-cell">Acciones</div>
        </div>
        
        <div className="table-body">
          {filteredLoans.map((loan) => (
            <div key={loan.id} className="table-row">
              <div className="table-cell">
                <span className="item-name">{loan.item}</span>
              </div>
              <div className="table-cell">
                <span className="quantity">{loan.cantidad}</span>
              </div>
              <div className="table-cell">
                <span className="requester">{loan.solicitante}</span>
              </div>
              <div className="table-cell">
                <span className="professor">{loan.profesor}</span>
              </div>
              <div className="table-cell">
                <span className="date-time">{loan.fechaHora}</span>
              </div>
              <div className="table-cell">
                <span className={`status-badge ${getStatusClass(loan.estado)}`}>
                  {loan.estado}
                </span>
              </div>
              <div className="table-cell">
                <div className="action-buttons">
                  <button className="action-btn return-btn" title="Devolver">
                    <FiRotateCcw />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <div className="modal-header-content">
                <div className="modal-icon">
                  <FiPlus />
                </div>
                <div className="modal-title-section">
                  <h2 className="modal-title">Registrar Préstamo</h2>
                  <p className="modal-subtitle">Escanea los ítems con código QR y completa los datos del préstamo</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="modal-close"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-sections">
                {/* Left Section - Form */}
                <div className="form-section">
                  <h3 className="section-title">
                    <FiUser className="section-icon" />
                    Información del Préstamo
                  </h3>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Profesor Autorizante</label>
                      <CustomSelect
                        value={formData.profesorAutorizante}
                        onChange={(value) => setFormData(prev => ({ ...prev, profesorAutorizante: value }))}
                        options={[
                          { value: 'prof-garcia', label: 'Prof. García' },
                          { value: 'prof-rodriguez', label: 'Prof. Rodríguez' },
                          { value: 'prof-fernandez', label: 'Prof. Fernández' }
                        ]}
                        placeholder="Selecciona un profesor"
                        className="form-select"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Solicitante</label>
                      <input
                        type="text"
                        name="solicitante"
                        value={formData.solicitante}
                        onChange={handleInputChange}
                        placeholder="Nombre del alumno o persona"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Observaciones (opcional)</label>
                      <textarea
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleInputChange}
                        placeholder="Notas adicionales sobre el préstamo"
                        className="form-textarea"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Section - QR Scanner */}
                <div className="qr-section">
                  <h3 className="section-title">
                    <FiCamera className="section-icon" />
                    Ítems Solicitados
                  </h3>
                  
                  <div className="qr-scanner">
                    <div className="qr-icon">
                      <div className="qr-squares">
                        <div className="qr-square"></div>
                        <div className="qr-square"></div>
                        <div className="qr-square"></div>
                        <div className="qr-square"></div>
                      </div>
                    </div>
                    <h4 className="qr-title">Escanear Código QR</h4>
                    <p className="qr-description">
                      Acerca el código QR del equipo al escáner para agregarlo al préstamo
                    </p>
                    <button type="button" className="scan-button">
                      <FiCamera />
                      Activar Escáner
                    </button>
                    <p className="qr-note">
                      Sin préstamos, será activado el escáner QR real
                    </p>
                  </div>

                  <div className="requested-items">
                    {requestedItems.length === 0 ? (
                      <div className="no-items">
                        <FiBook className="no-items-icon" />
                        <p className="no-items-text">No hay ítems agregados</p>
                        <p className="no-items-subtext">Escanea un código QR para comenzar</p>
                      </div>
                    ) : (
                      <div className="items-list">
                        {requestedItems.map((item, index) => (
                          <div key={index} className="requested-item">
                            <span className="item-name">{item.name}</span>
                            <button
                              type="button"
                              onClick={() => setRequestedItems(prev => prev.filter((_, i) => i !== index))}
                              className="remove-item"
                            >
                              <FiX />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cancel-button"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="submit-button"
                >
                  Registrar Préstamo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}