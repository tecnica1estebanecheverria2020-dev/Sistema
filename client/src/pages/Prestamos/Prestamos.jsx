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
  FiMinus,
  FiTruck,
  FiRefreshCw,
  FiRepeat
} from 'react-icons/fi';
import './style.css';
import { loansService } from '../../shared/services/loansService';
import { rolesService } from '../../shared/services/rolesService';
import { usersService } from '../../shared/services/usersService';
import { inventarioService } from '../../shared/services/inventarioService';
import useNotification from '../../shared/hooks/useNotification';
import LoanModal from './LoanModal';
import Section from '../../shared/components/Section/Section.jsx';
import DataTable from '../../shared/components/DataTable/DataTable.jsx';

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

  const [scannerEnabled, setScannerEnabled] = useState(true);
  const [barcodeBuffer, setBarcodeBuffer] = useState('');
  const [lastKeyTime, setLastKeyTime] = useState(0);

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // formato 24 horas
    });
  };

  // Utilidad: mapear préstamos del backend a la UI
  const mapLoans = (data = []) => {
    return (data || []).map((l) => ({
      id: l.id_loan,
      item: l.item_name,
      cantidad: l.quantity,
      solicitante: l.applicant || '-',
      profesor: l.user_name || '-',
      fechaPrestamo: formatDateTime(l.date_loan),
      fechaDevolucion: l.date_return ? formatDateTime(l.date_return) : null,
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

        // Primero obtener todos los roles para verificar el nombre exacto
        const rolesResp = await rolesService.getRoles();
        console.log('Todos los roles disponibles:', rolesResp);

        // Buscar el rol "Profesor" (case-insensitive)
        const professorRole = rolesResp.find(r =>
          r.name?.toLowerCase() === 'profesor' || r.name?.toLowerCase() === 'teacher'
        );

        if (!professorRole) {
          console.warn('No se encontró el rol Profesor');
          setProfessors([]);
          return;
        }

        console.log('Rol Profesor encontrado:', professorRole);

        // Obtener todos los usuarios
        const usersResp = await usersService.getUsers();
        console.log('Respuesta de usuarios:', usersResp);

        // Normalizar respuesta de usuarios
        let allUsers = [];
        if (Array.isArray(usersResp)) {
          allUsers = usersResp;
        } else if (usersResp?.data) {
          allUsers = Array.isArray(usersResp.data) ? usersResp.data : [usersResp.data];
        } else if (usersResp?.users) {
          allUsers = Array.isArray(usersResp.users) ? usersResp.users : [usersResp.users];
        }

        console.log('Usuarios totales:', allUsers.length);

        // Filtrar usuarios que tienen el rol de profesor
        const professorsData = [];
        for (const user of allUsers) {
          try {
            const userId = user.id_user || user.id;
            const userRoles = await rolesService.getUserRoles(userId);
            console.log(`Roles de usuario ${user.name}:`, userRoles);

            // Verificar si tiene el rol de profesor
            const hasProfesorRole = userRoles.some(role =>
              Number(role.id_role) === Number(professorRole.id_role)
            );

            if (hasProfesorRole) {
              professorsData.push({
                value: userId,
                label: user.name || user.username || 'Sin nombre'
              });
            }
          } catch (err) {
            console.error(`Error al obtener roles del usuario ${user.name}:`, err);
          }
        }

        console.log('Profesores encontrados:', professorsData);
        setProfessors(professorsData);

        if (professorsData.length === 0) {
          notify('No se encontraron usuarios con rol Profesor', 'warn');
        }
      } catch (error) {
        console.error('Error al cargar profesores:', error);
        notify(error?.message || 'Error al cargar profesores', 'error');
      } finally {
        setLoadingProfessors(false);
      }
    };
    loadProfessors();
  }, [notify]);

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

  // Función para restaurar un préstamo devuelto (en caso de error)
  const handleRestoreLoan = async (loan) => {
    if (!window.confirm(`¿Restaurar el préstamo del ítem "${loan.item}" para "${loan.solicitante}"?`)) {
      return;
    }

    try {
      // Encontrar el inventario por nombre del item
      const inventoryItems = await inventarioService.getInventario();
      const inventoryItem = inventoryItems.find(item => item.name === loan.item);

      if (!inventoryItem) {
        notify(`No se encontró el ítem "${loan.item}" en el inventario`, 'error');
        return;
      }

      // Crear un nuevo préstamo con los mismos datos
      await loansService.createLoan({
        id_inventory: inventoryItem.id_inventory,
        quantity: loan.cantidad,
        applicant: loan.solicitante,
        observations_loan: `Préstamo restaurado del registro anterior | Autorizado por: ${loan.profesor}`,
      });

      notify('Préstamo restaurado correctamente', 'success');
      await fetchLoans();
    } catch (error) {
      notify(error?.message || 'Error al restaurar el préstamo', 'error');
    }
  };

  // Componente de acciones para DataTable
  const LoanActions = ({ row }) => {
    return (
      <div className="action-buttons">
        {row.estado === 'Activo' ? (
          <button
            className="action-btn return-btn"
            title="Registrar devolución"
            onClick={() => {
              setSelectedLoan(row);
              setReturnObservations(row.observacionesDevolucion || '');
              setIsReturnModalOpen(true);
            }}
          >
            <FiRotateCcw />
            <span>Devolver</span>
          </button>
        ) : (
          <button
            className="action-btn restore-btn"
            title="Restaurar préstamo (en caso de error)"
            onClick={() => handleRestoreLoan(row)}
          >
            <FiRepeat />
            <span>Restaurar</span>
          </button>
        )}
      </div>
    );
  };

  // Configuración de columnas según el modo
  const getColumns = () => {
    const baseColumns = [
      {
        key: 'item',
        label: 'Ítem',
        type: 'string',
        render: (value) => <span className="item-name">{value}</span>
      },
      {
        key: 'cantidad',
        label: 'Cantidad',
        type: 'number',
        render: (value) => <span className="quantity">{value}</span>
      },
      {
        key: 'solicitante',
        label: 'Solicitante',
        type: 'string',
        render: (value) => <span className="requester">{value}</span>
      },
      {
        key: 'profesor',
        label: 'Profesor',
        type: 'string',
        render: (value) => <span className="professor">{value}</span>
      }
    ];

    if (mode === 'activos') {
      baseColumns.push({
        key: 'fechaPrestamo',
        label: 'Fecha Préstamo',
        type: 'date',
        render: (value) => <span className="date-time">{value}</span>
      });
    } else if (mode === 'devueltos') {
      baseColumns.push(
        {
          key: 'fechaPrestamo',
          label: 'Fecha Préstamo',
          type: 'date',
          render: (value) => <span className="date-time">{value}</span>
        },
        {
          key: 'fechaDevolucion',
          label: 'Fecha Devolución',
          type: 'date',
          render: (value) => <span className="date-time">{value || '-'}</span>
        }
      );
    } else {
      baseColumns.push({
        key: 'fechaPrestamo',
        label: 'Fecha',
        type: 'date',
        render: (value, row) => (
          <span className="date-time">
            {row.estado === 'Devuelto' ? (row.fechaDevolucion || '-') : (row.fechaPrestamo || '-')}
          </span>
        )
      });
    }

    baseColumns.push({
      key: 'estado',
      label: 'Estado',
      type: 'string',
      render: (value) => (
        <span className={`status-badge ${getStatusClass(value)}`}>
          {value}
        </span>
      )
    });

    return baseColumns;
  };

  return (
    <Section
      title="Préstamos"
      subtitle="Gestión de préstamos de equipamiento"
      icon={FiTruck}
      onAdd={() => {
        resetForm();
        setIsModalOpen(true);
      }}
      addButtonText="Nuevo Préstamo"
    >

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
      <DataTable
        data={filteredLoans}
        columns={getColumns()}
        actions={<LoanActions />}
        itemsPerPage={10}
        keyField="id"
        emptyState={
          <div className="empty-state">
            <FiTruck className="empty-icon" />
            <p>No se encontraron préstamos</p>
            <p className="empty-subtitle">
              {searchTerm || statusFilter ? 'Intenta ajustar los filtros' : 'Comienza creando un préstamo'}
            </p>
          </div>
        }
      />

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
        scannerEnabled={scannerEnabled}
        setScannerEnabled={setScannerEnabled}
        onScanCode={onScanCode}
        inventoryByCode={inventoryByCode}
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
    </Section>
  );
}