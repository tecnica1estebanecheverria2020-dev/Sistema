import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiCheckCircle, 
  FiClock, 
  FiAlertTriangle,
  FiCalendar,
  FiPlus,
} from 'react-icons/fi';
import { FaBox, FaLayerGroup } from 'react-icons/fa';
import './style.css';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const statsCards = [
    {
      id: 1,
      title: 'Total Inventario',
      value: '212',
      subtitle: 'items registrados',
      icon: FaBox,
      category: 'inventory'
    },
    {
      id: 2,
      title: 'Disponibles',
      value: '158',
      subtitle: 'items disponibles',
      icon: FiCheckCircle,
      category: 'available'
    },
    {
      id: 3,
      title: 'Préstamos Activos',
      value: '3',
      subtitle: 'en curso',
      icon: FiClock,
      category: 'loans'
    },
    {
      id: 4,
      title: 'No Devueltos',
      value: '0',
      subtitle: 'pendientes',
      icon: FiAlertTriangle,
      category: 'pending'
    },
    {
      id: 5,
      title: 'Horarios',
      value: '120',
      subtitle: 'programados',
      icon: FiCalendar,
      category: 'returned'
    }
  ];

  const todayLoans = [
    {
      id: 1,
      item: 'Alargue 5m',
      professor: 'Prof. Fernández',
      time: '10:00',
      status: 'active',
      room: 'Lab A'
    },
    {
      id: 2,
      item: 'Proyector Epson',
      professor: 'Prof. Rodríguez',
      time: '09:15',
      status: 'returned',
      room: 'Aula 3'
    },
    {
      id: 3,
      item: 'Netbook HP ProBook',
      professor: 'Prof. García',
      time: '08:30',
      status: 'active',
      room: 'Lab B'
    }
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Gestionar Inventario',
      subtitle: 'Agregar o editar items',
      icon: FaLayerGroup,
      action: () => {
        navigate('/inventario');
      }
    },
    {
      id: 2,
      title: 'Nuevo Préstamo',
      subtitle: 'Registrar préstamo',
      icon: FiPlus,
      action: () => {
        navigate('/prestamos');
      }
    },
    {
      id: 3,
      title: 'Ver Horarios',
      subtitle: 'Calendario y agenda',
      icon: FiCalendar,
      action: () => {
        navigate('/horarios');
      }
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
                <a key={action.id} href="#" className="action-card" onClick={() => action.action()}>
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
            <div className="activity-stat-value">95%</div>
            <div className="activity-stat-label">Tasa de devolución</div>
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