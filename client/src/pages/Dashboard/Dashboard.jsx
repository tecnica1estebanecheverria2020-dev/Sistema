import './style.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiCalendar,
  FiPlus,
  FiLoader,
  FiGrid,
  FiTrendingUp,
  FiActivity
} from 'react-icons/fi';
import { FaBox, FaLayerGroup } from 'react-icons/fa';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import useData from './hooks/useData';
import Section from '../../shared/components/Section/Section.jsx';

// Mini icono de carga
const loadingIcon = () => {
  return <FiLoader className="loading-icon-mini" />
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  const {
    fetchData,
    fetchTodayLoans,
    fetchActivitySummary,
    fetchMostRequestedItems,
    fetchLoansByTime,
    dashboardData,
    todayLoans,
    activitySummary,
    mostRequestedItems,
    loansByTime,
    loading,
  } = useData();

  const getAllData = async (background = false) => {
    await fetchData(background);
    await fetchTodayLoans(background);
    await fetchActivitySummary(background);
    await fetchMostRequestedItems(background);
    await fetchLoansByTime(background);
  }

  const getIcon = (category) => {
    if (loading) return loadingIcon;

    switch (category) {
      case 'inventory':
        return FaBox;
      case 'available':
        return FiCheckCircle;
      case 'loans':
        return FiClock;
      case 'pending':
        return FiAlertTriangle;
      case 'returned':
        return FiCalendar;
      default:
        return null;
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Obtener datos del dashboard al montar el componente
  useEffect(() => {
    getAllData();
  }, []);

  // Actualizar cada 5 segundos (datos del dashboard y estado de API)
  useEffect(() => {
    const interval = setInterval(() => {
      getAllData(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const statsCards = [
    {
      id: 1,
      title: 'Total Inventario',
      value: String(dashboardData?.inventoryTotal || '0'),
      subtitle: 'items registrados',
      icon: getIcon('inventory'),
      category: 'inventory'
    },
    {
      id: 2,
      title: 'Disponibles',
      value: String(dashboardData?.inventoryAvailable || '0'),
      subtitle: 'items disponibles',
      icon: getIcon('available'),
      category: 'available'
    },
    {
      id: 3,
      title: 'Préstamos Activos',
      value: String(dashboardData?.activeLoans || '0'),
      subtitle: 'en curso',
      icon: getIcon('loans'),
      category: 'loans'
    },
    {
      id: 4,
      title: 'No Devueltos',
      value: String(dashboardData?.pendingReturns || '0'),
      subtitle: 'pendientes',
      icon: getIcon('pending'),
      category: 'pending'
    },
    {
      id: 5,
      title: 'Horarios',
      value: String(dashboardData?.schedulesCount) || '0',
      subtitle: 'programados',
      icon: getIcon('returned'),
      category: 'returned'
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
    <Section
      title="Dashboard"
      subtitle="Bienvenido al panel de control de TecniStock"
      icon={FiGrid}
      showAddButton={false}
      headerAction={
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
      }
    >

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div key={card.id} className={`stat-card ${card.category}`}>
              <div className="stat-header">
                <div className="stat-icon-wrapper">
                  <IconComponent className="stat-icon" />
                </div>
              </div>
              <div className="stat-body">
                <h3 className="stat-value">{card.value}</h3>
                <span className="stat-title">{card.title}</span>
                <p className="stat-label">{card.subtitle}</p>
              </div>
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
                <button
                  key={action.id}
                  className="action-card"
                  onClick={action.action}
                >
                  <div className="action-icon-wrapper">
                    <IconComponent className="action-icon" />
                  </div>
                  <div className="action-content">
                    <h4 className="action-title">{action.title}</h4>
                    <p className="action-subtitle">{action.subtitle}</p>
                  </div>
                </button>
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
            <div className="activity-stat-value">{activitySummary.weeklyLoansCount}</div>
            <div className="activity-stat-label">Préstamos esta semana</div>
          </div>
          <div className="activity-stat">
            <div className="activity-stat-value">{activitySummary.mostRequestedItemsCount}</div>
            <div className="activity-stat-label">Items más solicitados</div>
          </div>
          <div className="activity-stat">
            <div className="activity-stat-value">{activitySummary.activeProfessorsCount}</div>
            <div className="activity-stat-label">Profesores activos</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Most Requested Items Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title-wrapper">
              <FiTrendingUp className="chart-icon" />
              <h3 className="chart-title">Ítems Más Solicitados</h3>
            </div>
            <span className="chart-badge">Top 10</span>
          </div>
          <div className="chart-container">
            {mostRequestedItems.length === 0 ? (
              <div className="no-chart-data">
                <FiTrendingUp className="no-data-icon" />
                <p>No hay datos disponibles</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mostRequestedItems} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="item_name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      padding: '12px'
                    }}
                    labelStyle={{ color: '#1e293b', fontWeight: 600, marginBottom: '4px' }}
                    itemStyle={{ color: '#64748b', fontSize: '13px' }}
                  />
                  <Bar dataKey="total_loans" name="Préstamos" radius={[8, 8, 0, 0]}>
                    {mostRequestedItems.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`hsl(${350 - index * 5}, ${70 + index * 2}%, ${45 + index * 3}%)`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Loans by Time Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title-wrapper">
              <FiActivity className="chart-icon" />
              <h3 className="chart-title">Préstamos por Hora del Día</h3>
            </div>
            <span className="chart-badge">Últimos 30 días</span>
          </div>
          <div className="chart-container">
            {loansByTime.length === 0 ? (
              <div className="no-chart-data">
                <FiActivity className="no-data-icon" />
                <p>No hay datos disponibles</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={loansByTime} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="hour"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    label={{ value: 'Hora del día', position: 'insideBottom', offset: -10, fill: '#64748b' }}
                  />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      padding: '12px'
                    }}
                    labelStyle={{ color: '#1e293b', fontWeight: 600, marginBottom: '4px' }}
                    itemStyle={{ color: '#64748b', fontSize: '13px' }}
                    labelFormatter={(value) => `Hora: ${value}:00`}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Préstamos"
                    stroke="#dc2626"
                    strokeWidth={3}
                    dot={{ fill: '#dc2626', r: 5 }}
                    activeDot={{ r: 7, fill: '#b91c1c' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
