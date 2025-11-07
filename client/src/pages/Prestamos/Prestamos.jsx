import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiRotateCcw, 
  FiX,
  FiUser,
  FiBook,
  FiCamera,
  FiChevronDown,
  FiTrash,
  FiMinus
} from 'react-icons/fi';
import './style.css';
import { loansService } from '../../shared/services/loansService';
import { rolesService } from '../../shared/services/rolesService';
import { inventarioService } from '../../shared/services/inventarioService';
import useNotification from '../../shared/hooks/useNotification';
import LoanModal from './LoanModal';

export default function Prestamos() {
  const { notify } = useNotification();
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
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [returnObservations, setReturnObservations] = useState('');

  const [professors, setProfessors] = useState([]);

  const [loadingProfessors, setLoadingProfessors] = useState(false);

  const [inventoryByCode, setInventoryByCode] = useState({});

  const [scannerEnabled] = useState(true);
  const [barcodeBuffer, setBarcodeBuffer] = useState('');
  const [lastKeyTime, setLastKeyTime] = useState(0);

  // Utilidad: mapear préstamos del backend a la UI
  const mapLoans = (data = []) => {
    return (data || []).map((l) => ({
      id: l.id_loan,
      item: l.item_name,
      cantidad: l.quantity,
      solicitante: l.applicant || '-',
      profesor: l.authorizer_name || l.user_name || '-',
      fechaPrestamo: l.date_loan ? new Date(l.date_loan).toLocaleString() : '-',
      fechaDevolucion: l.date_return ? new Date(l.date_return).toLocaleString() : null,
      estado: l.state === 'devuelto' ? 'Devuelto' : 'Activo',
      observacionesDevolucion: l.observations_return || ''
    }));
  };

  // Cargar/Refrescar préstamos desde el servidor
  const fetchLoans = async () => {
    try {
      const resp = await loansService.getLoans();
      setLoans(mapLoans(resp?.loans));
    } catch (error) {
      notify(error?.message || 'Error al cargar préstamos', 'error');
    }
  };

  // Cargar préstamos al montar
  useEffect(() => {
    fetchLoans();
    const onFocus = () => fetchLoans();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // Cargar profesores (usuarios con rol Profesor)
  useEffect(() => {
    const loadProfessors = async () => {
      try {
        setLoadingProfessors(true);
        const rolesResp = await rolesService.getRoles();
        const roles = rolesResp?.data || [];
        const profesorRole = roles.find(r => (r.name || '').toLowerCase() === 'profesor');
        if (!profesorRole) {
          setProfessors([]);
          return;
        }
        const usersResp = await rolesService.getUsersByRole(profesorRole.id_role);
        const users = usersResp?.data || [];
        setProfessors(users.map(u => ({ value: u.id_user, label: u.name })));
      } catch (error) {
        notify(error?.message || 'Error al cargar profesores', 'error');
      } finally {
        setLoadingProfessors(false);
      }
    };
    loadProfessors();
  }, []);

  // Cargar inventario y construir índice por código
  useEffect(() => {
    const loadInventory = async () => {
      try {
        const invResp = await inventarioService.getItems();
        const items = invResp?.data || invResp || [];
        const index = {};
        items.forEach(item => {
          if (item.code) index[item.code] = item;
        });
        setInventoryByCode(index);
      } catch (error) {
        notify(error?.message || 'Error al cargar inventario', 'error');
      }
    };
    loadInventory();
  }, []);

  // Detección de escáner de código de barras (HID teclado)
  useEffect(() => {
    if (!scannerEnabled) return;
    const thresholdMs = 300; 
    const handler = (e) => {
      const now = Date.now();
      if (!lastKeyTime) setLastKeyTime(now);
      // Capturar caracteres imprimibles y Enter
      if (e.key === 'Enter') {
        const duration = now - lastKeyTime;
        const code = barcodeBuffer.trim();
        setBarcodeBuffer('');
        setLastKeyTime(0);
        // Si fue rápido, asumimos escáner
        if (code && duration <= thresholdMs) {
          onScanCode(code);
        }
      } else if (e.key.length === 1) {
        setBarcodeBuffer(prev => prev + e.key);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [scannerEnabled, barcodeBuffer, lastKeyTime]);

  const onScanCode = (code) => {
    const item = inventoryByCode[code];
    if (!item) {
      notify(`Código ${code} no encontrado en inventario`, 'warn');
      return;
    }
    // Agregar automáticamente al listado o incrementar la cantidad si ya existe
    setRequestedItems(prev => {
      const idx = prev.findIndex(p => p.id_inventory === item.id_inventory);
      if (idx >= 0) {
        const existing = prev[idx];
        const max = item.available ?? existing.available ?? 1;
        const updated = [...prev];
        updated[idx] = {
          ...existing,
          // suma 1 pero no superes el disponible
          quantity: Math.min(existing.quantity + 1, max),
          available: max
        };
        return updated;
      }
      return [
        ...prev,
        {
          id_inventory: item.id_inventory,
          name: item.name,
          quantity: 1,
          available: item.available ?? 1,
        }
      ];
    });
    notify('Producto agregado al pedido', 'success');
  };

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
    // Crear un préstamo por cada ítem solicitado
    const run = async () => {
      try {
        if (!formData.profesorAutorizante) {
          notify('Selecciona el profesor autorizante', 'warn');
          return;
        }
        if (!formData.solicitante) {
          notify('Completa el nombre del solicitante', 'warn');
          return;
        }
        if (requestedItems.length === 0) {
          notify('Agrega al menos un ítem al pedido', 'warn');
          return;
        }
        // Cerrar el modal inmediatamente como en Inventario
        setIsModalOpen(false);
        // Optimista: reflejar inmediatamente en la UI
        const optimistics = requestedItems.map(req => ({
          id: `temp-${Date.now()}-${req.id_inventory}`,
          item: req.name,
          cantidad: req.quantity,
          solicitante: formData.solicitante || '-',
          profesor: getProfessorNameById(formData.profesorAutorizante) || '-',
          fechaPrestamo: new Date().toLocaleString(),
          fechaDevolucion: null,
          estado: 'Activo',
          observacionesDevolucion: ''
        }));
        setLoans(prev => [...optimistics, ...prev]);

        // Registrar préstamos en el servidor
        for (const req of requestedItems) {
          await loansService.createLoan({
            id_inventory: req.id_inventory,
            quantity: req.quantity,
            applicant: formData.solicitante,
            observations_loan: `Autorizado por: ${getProfessorNameById(formData.profesorAutorizante)}${formData.observaciones ? ' | ' + formData.observaciones : ''}`,
            id_authorizer: formData.profesorAutorizante,
          });
        }
        notify('Préstamo(s) registrado(s) correctamente', 'success');
        resetForm();
        // Reconciliar con datos reales del servidor
        await fetchLoans();
      } catch (error) {
        notify(error?.message || 'Error al registrar el préstamo', 'error');
      } finally {
        // Asegurar cierre y limpieza incluso si hubo fallo
        setIsModalOpen(false);
        resetForm();
      }
    };
    run();
  };

  const resetForm = () => {
    setFormData({
      profesorAutorizante: '',
      solicitante: '',
      observaciones: ''
    });
    setRequestedItems([]);
  };

  const getProfessorNameById = (id) => {
    const prof = professors.find(p => p.value === id);
    return prof ? prof.label : '-';
  };

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = 
      loan.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.solicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.profesor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || loan.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const mode = statusFilter === 'Activo' ? 'activos' : (statusFilter === 'Devuelto' ? 'devueltos' : 'todos');

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
        {(() => {
          const total = loans.length;
          const activos = loans.filter(l => l.estado === 'Activo').length;
          const devueltos = loans.filter(l => l.estado === 'Devuelto').length;
          return (
            <>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">{total}</div>
                  <div className="stat-label">Total Préstamos</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">{activos}</div>
                  <div className="stat-label">Activos</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">{devueltos}</div>
                  <div className="stat-label">Devueltos</div>
                </div>
              </div>
            </>
          );
        })()}
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
        <div className={`table-header header-${mode}`}>
          <div className="table-cell">Ítem</div>
          <div className="table-cell">Cantidad</div>
          <div className="table-cell">Solicitante</div>
          <div className="table-cell">Profesor</div>
          {mode === 'activos' && (<div className="table-cell">Fecha Préstamo</div>)}
          {mode === 'devueltos' && (
            <>
              <div className="table-cell">Fecha Préstamo</div>
              <div className="table-cell">Fecha Devolución</div>
            </>
          )}
          {mode === 'todos' && (<div className="table-cell">Fecha</div>)}
          <div className="table-cell">Estado</div>
          {mode === 'activos' && (<div className="table-cell">Acciones</div>)}
        </div>
        
        <div className="table-body">
          {filteredLoans.map((loan) => (
            <div key={loan.id} className={`table-row row-${mode}`}>
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
              {mode === 'activos' && (
                <div className="table-cell">
                  <span className="date-time">{loan.fechaPrestamo}</span>
                </div>
              )}
              {mode === 'devueltos' && (
                <>
                  <div className="table-cell">
                    <span className="date-time">{loan.fechaPrestamo}</span>
                  </div>
                  <div className="table-cell">
                    <span className="date-time">{loan.fechaDevolucion || '-'}</span>
                  </div>
                </>
              )}
              {mode === 'todos' && (
                <div className="table-cell">
                  <span className="date-time">{loan.estado === 'Devuelto' ? (loan.fechaDevolucion || '-') : (loan.fechaPrestamo || '-')}</span>
                </div>
              )}
              <div className="table-cell">
                <span className={`status-badge ${getStatusClass(loan.estado)}`}>
                  {loan.estado}
                </span>
              </div>
              {mode === 'activos' && (
                <div className="table-cell">
                  <div className="action-buttons">
                    <button
                      className="action-btn return-btn"
                      title="Registrar devolución"
                      onClick={() => {
                        setSelectedLoan(loan);
                        setReturnObservations(loan.observacionesDevolucion || '');
                        setIsReturnModalOpen(true);
                      }}
                    >
                      <FiRotateCcw />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal de nuevo préstamo (LoanModal unificado) */}
      <LoanModal
        type="new"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        professors={professors}
        loadingProfessors={loadingProfessors}
        requestedItems={requestedItems}
        setRequestedItems={setRequestedItems}
        onSubmit={handleSubmit}
      />

      {/* Modal de devolución (LoanModal unificado) */}
      <LoanModal
        type="return"
        isOpen={isReturnModalOpen}
        loan={selectedLoan}
        returnObservations={returnObservations}
        setReturnObservations={setReturnObservations}
        onClose={() => setIsReturnModalOpen(false)}
        onConfirmReturn={async () => {
          try {
            // Cerrar inmediatamente como en Inventario
            setIsReturnModalOpen(false);
            const closingLoan = selectedLoan; // snapshot para refrescar luego
            setSelectedLoan(null);
            const notes = returnObservations;
            setReturnObservations('');
            // Optimista: marcar devuelto inmediatamente
            setLoans(prev => prev.map(l => l.id === closingLoan.id ? {
              ...l,
              estado: 'Devuelto',
              fechaDevolucion: new Date().toLocaleString()
            } : l));

            // Confirmar devolución en el servidor
            await loansService.returnLoan(closingLoan.id, { observations_return: notes });
            notify('Préstamo devuelto correctamente', 'success');
            // Recargar lista desde el servidor para mantener consistencia
            await fetchLoans();
          } catch (error) {
            notify(error?.message || 'Error al registrar la devolución', 'error');
          } finally {
            // Asegurar que el modal queda cerrado
            setIsReturnModalOpen(false);
          }
        }}
      />
    </div>
  );
}