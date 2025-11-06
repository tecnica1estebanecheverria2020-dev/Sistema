import { useState } from 'react';
import { useEffect } from 'react';
import axios from '../../shared/api/axios'
import useNotification from '../../shared/hooks/useNotification.jsx'
import { 
  FiPackage, 
  FiCheckCircle, 
  FiClock, 
  FiAlertTriangle,
  FiTrendingUp,
  FiUsers,
  FiCalendar,
  FiSettings,
  FiSearch,
  FiPlus,
  FiArrowRight,
  FiActivity
} from 'react-icons/fi';
import { FaBox, FaCube, FaLayerGroup } from 'react-icons/fa';
import './style.css';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const notify = useNotification();
  const [serverStatus, setServerStatus] = useState({
    success: false,
    message: '',
    connection: false
  });
  const [dashboardData, setDashboardData] = useState({
    inventoryTotal: 0,
    inventoryAvailable: 0,
    activeLoans: 0,
    schedulesCount: 0,
  });
  const [todayLoans, setTodayLoans] = useState([]);

  //para que no moleste
  useEffect(() => {

  }, [loading, serverStatus]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Obtener datos del dashboard al montar el componente
  useEffect(() => {
    fetchData();
    fetchTodayLoans();
    checkApi();
  }, []);

  // Actualizar cada 10 segundos (datos del dashboard y estado de API)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
      fetchTodayLoans();
      checkApi();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

   const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/dashboard/data');
      const data = response?.data?.data || {};
      setDashboardData(prev => ({
        ...prev,
        inventoryTotal: Number(data.totalInventoryItems || 0),
        inventoryAvailable: Number(data.availableInventoryItems || 0),
        activeLoans: Number(data.activeLoans || 0),
        schedulesCount: Number(data.totalSchedules || 0),
      }));  
    } catch (error) {
      notify(error?.message || 'Error al obtener los datos del dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayLoans = async () => {
    try {
      const resp = await axios.get('/dashboard/today-loans');
      const loans = resp?.data?.loans || [];
      setTodayLoans(loans.map((l, idx) => ({
        id: idx + 1,
        item: l.item_name,
        professor: l.user_name,
        time: l.time,
      })));
    } catch (error) {
      notify(error?.message || 'Error al obtener préstamos de hoy', 'error');
    }
  };

  const checkApi = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/test');
      if (response.data?.success) {
        setServerStatus({
          success: true,
          message: response.data?.message || 'Servidor operativo',
          connection: true
        });
      } else {
        notify(response.data?.message || 'El servidor está caído', 'error');
      }
    } catch (err) {
      console.error(err?.response?.data?.message || 'El servidor está caído:', err);
      setServerStatus({
        success: false,
        message: err?.response?.data?.message || 'El servidor está caído',
        connection: false
      });
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      id: 1,
      title: 'Total Inventario',
      value: String(dashboardData.inventoryTotal),
      subtitle: 'items registrados',
      icon: FaBox,
      category: 'inventory'
    },
    {
      id: 2,
      title: 'Disponibles',
      value: String(dashboardData.inventoryAvailable),
      subtitle: 'items disponibles',
      icon: FiCheckCircle,
      category: 'available'
    },
    {
      id: 3,
      title: 'Préstamos Activos',
      value: String(dashboardData.activeLoans),
      subtitle: 'en curso',
      icon: FiClock,
      category: 'loans'
    },
    {
      id: 4,
      title: 'No Devueltos',
      value: String(dashboardData.activeLoans),
      subtitle: 'pendientes',
      icon: FiAlertTriangle,
      category: 'pending'
    },
    {
      id: 5,
      title: 'Horarios',
      value: String(dashboardData.schedulesCount),
      subtitle: 'programados',
      icon: FiCalendar,
      category: 'returned'
    }
  ];


  const quickActions = [
    {
      id: 1,
      title: 'Gestionar Inventario',
      subtitle: 'Agregar o editar items',
      icon: FaLayerGroup,
      action: 'inventory'
    },
    {
      id: 2,
      title: 'Nuevo Préstamo',
      subtitle: 'Registrar préstamo',
      icon: FiPlus,
      action: 'loan'
    },
    {
      id: 3,
      title: 'Ver Horarios',
      subtitle: 'Calendario y agenda',
      icon: FiCalendar,
      action: 'schedule'
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Bienvenido al panel de control de TecniStock</p>
        <div className="dashboard-time">
          {currentTime.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })} - {currentTime.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div key={card.id} className={`stat-card ${card.category}`}>
              <div className="stat-header">
                <span className="stat-title">{card.title}</span>
                <IconComponent className="stat-icon" />
              </div>
              <h3 className="stat-value">{card.value}</h3>
              <p className="stat-label">{card.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="main-content">
        {/* Today's Loans */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Préstamos del Día</h2>
            <a href="#" className="section-link">Ver todos</a>
          </div>
          
          <div className="loans-list">
            {todayLoans.map((loan) => (
              <div key={loan.id} className="loan-item">
                <div className="loan-info">
                  <h4>{loan.item}</h4>
                  <p>{loan.professor}</p>
                </div>
                <div className="loan-time">{loan.time}</div>
              </div>
            ))}
          </div>

          {todayLoans.length === 0 && (
            <div className="no-loans">
              No hay items pendientes
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Acciones Rápidas</h2>
          </div>
          
          <div className="actions-grid">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <a key={action.id} href="#" className="action-card">
                  <IconComponent className="action-icon" />
                  <h4 className="action-title">{action.title}</h4>
                  <p className="action-subtitle">{action.subtitle}</p>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="activity-summary">
        <div className="section-header">
          <h2 className="section-title">Resumen de Actividad</h2>
        </div>
        
        <div className="activity-stats">
          <div className="activity-stat">
            <div className="activity-stat-value">24</div>
            <div className="activity-stat-label">Préstamos esta semana</div>
          </div>
          <div className="activity-stat">
            <div className="activity-stat-value">8</div>
            <div className="activity-stat-label">Items más solicitados</div>
          </div>
          <div className="activity-stat">
            <div className="activity-stat-value">12</div>
            <div className="activity-stat-label">Profesores activos</div>
          </div>
        </div>
      </div>
    </div>
  );
}