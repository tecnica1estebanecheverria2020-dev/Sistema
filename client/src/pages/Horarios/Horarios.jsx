import { useState, useEffect, useMemo } from "react";
import { FiFilter, FiX, FiPlus, FiEdit, FiTrash2, FiChevronDown, FiClock, FiUser, FiBook, FiMapPin } from "react-icons/fi";
import AddScheduleModal from "./AddScheduleModal";
import "./style.css";

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const TIME_SLOTS_MANANA = [
  { label: "07:10 a 09:10", start: "07:10", end: "09:10" },
  { label: "07:30 a 09:30", start: "07:30", end: "09:30" },
  { label: "09:20 a 11:20", start: "09:20", end: "11:20" },
  { label: "09:40 a 11:40", start: "09:40", end: "11:40" },
];

const TIME_SLOTS_TARDE = [
  { label: "13:00 a 15:30", start: "13:00", end: "15:30" },
  { label: "13:30 a 15:30", start: "13:30", end: "15:30" },
  { label: "15:10 a 17:10", start: "15:10", end: "17:10" },
  { label: "15:30 a 17:30", start: "15:30", end: "17:30" },
];

export default function Horarios() {
  const [schedules, setSchedules] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState("Mañana");
  const [selectedCurso, setSelectedCurso] = useState("all");
  const [selectedHorario, setSelectedHorario] = useState("all");
  const [viewMode, setViewMode] = useState("aulas");

  // Initialize with sample data
  useEffect(() => {
    const sampleSchedules = [
      // ========== MAÑANA - LUNES ==========
      {
        id: crypto.randomUUID(),
        aula: "AULA 12",
        materia: "LENGUAJES TECNOLOGICOS",
        grupoTaller: "1.3",
        profesor: "Prof. García",
        diaSemana: "Lunes",
        horaInicio: "07:10",
        horaFin: "09:10",
        turno: "Mañana",
      },
      {
        id: crypto.randomUUID(),
        aula: "AULA 4",
        materia: "PROCEDIMIENTOS TECNICOS",
        grupoTaller: "1.1",
        profesor: "Prof. Martínez",
        diaSemana: "Lunes",
        horaInicio: "07:10",
        horaFin: "09:10",
        turno: "Mañana",
      },
      {
        id: crypto.randomUUID(),
        aula: "AULA 12",
        materia: "LABORATORIO HARDWARE",
        grupoTaller: "4.5",
        profesor: "Prof. López",
        diaSemana: "Lunes",
        horaInicio: "07:10",
        horaFin: "09:10",
        turno: "Mañana",
      },
      {
        id: crypto.randomUUID(),
        aula: "AULA 7",
        materia: "PROCEDIMIENTOS TECNICOS",
        grupoTaller: "3.7",
        profesor: "Prof. Fernández",
        diaSemana: "Lunes",
        horaInicio: "07:30",
        horaFin: "09:30",
        turno: "Mañana",
      },
      {
        id: crypto.randomUUID(),
        aula: "AULA 11",
        materia: "LABORATORIO DE DISEÑO WEB",
        grupoTaller: "5.5",
        profesor: "Prof. Rodríguez",
        diaSemana: "Lunes",
        horaInicio: "07:30",
        horaFin: "09:30",
        turno: "Mañana",
      },
      {
        id: crypto.randomUUID(),
        aula: "AULA 8",
        materia: "SISTEMAS TECNOLOGICOS IMRSC",
        grupoTaller: "7.3",
        profesor: "Prof. Sánchez",
        diaSemana: "Lunes",
        horaInicio: "09:20",
        horaFin: "11:20",
        turno: "Mañana",
      },
      // ========== MAÑANA - MARTES ==========
      {
        id: crypto.randomUUID(),
        aula: "AULA 21",
        materia: "LENGUAJES TECNOLOGICOS",
        grupoTaller: "3.1",
        profesor: "Prof. García",
        diaSemana: "Martes",
        horaInicio: "07:10",
        horaFin: "09:10",
        turno: "Mañana",
      },
      {
        id: crypto.randomUUID(),
        aula: "AULA 11",
        materia: "LABORATORIO DE PROGRAMACION",
        grupoTaller: "5.3",
        profesor: "Prof. López",
        diaSemana: "Martes",
        horaInicio: "07:10",
        horaFin: "09:10",
        turno: "Mañana",
      },
      // ========== TARDE - LUNES ==========
      {
        id: crypto.randomUUID(),
        aula: "TALLER GRANDE",
        materia: "SISTEMAS TECNOLOGICOS",
        grupoTaller: "1.4",
        profesor: "Prof. García",
        diaSemana: "Lunes",
        horaInicio: "13:00",
        horaFin: "15:30",
        turno: "Tarde",
      },
      {
        id: crypto.randomUUID(),
        aula: "AULA 7",
        materia: "SISTEMAS TECNOLOGICOS",
        grupoTaller: "3.2",
        profesor: "Prof. López",
        diaSemana: "Lunes",
        horaInicio: "13:00",
        horaFin: "15:30",
        turno: "Tarde",
      },
    ];
    setSchedules(sampleSchedules);
  }, []);

  const cursos = useMemo(() => {
    const uniqueCursos = new Set(schedules.map((s) => s.grupoTaller));
    return Array.from(uniqueCursos).sort();
  }, [schedules]);

  const timeSlots = selectedTurno === "Mañana" ? TIME_SLOTS_MANANA : TIME_SLOTS_TARDE;

  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      if (s.turno !== selectedTurno) return false;
      if (selectedCurso !== "all" && s.grupoTaller !== selectedCurso) return false;
      if (selectedHorario !== "all") {
        const timeSlot = timeSlots.find((t) => t.label === selectedHorario);
        if (timeSlot && (s.horaInicio !== timeSlot.start || s.horaFin !== timeSlot.end)) return false;
      }
      return true;
    });
  }, [schedules, selectedTurno, selectedCurso, selectedHorario, timeSlots]);

  const getSchedulesForSlot = (dia, timeSlot) => {
    return filteredSchedules.filter((s) => {
      if (s.diaSemana !== dia || s.turno !== selectedTurno) return false;
      return s.horaInicio === timeSlot.start && s.horaFin === timeSlot.end;
    });
  };

  const handleAddSchedule = (newSchedule) => {
    setSchedules(prev => [...prev, newSchedule]);
  };

  const handleDeleteSchedule = (scheduleId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este horario?')) {
      setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
    }
  };

  const hasActiveFilters = selectedCurso !== "all" || selectedHorario !== "all";

  return (
    <div className="horarios-container">
      {/* Header */}
      <div className="horarios-header">
        <div className="header-content">
          <div>
            <h1 className="page-title">Horarios</h1>
            <p className="page-subtitle">Calendario de talleres y aulas</p>
          </div>
          <button className="add-button" onClick={() => setShowAddModal(true)}>
            <FiPlus className="button-icon" />
            Agregar Horario
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-card">
        <div className="filters-header">
          <div className="filters-title">
            <FiFilter className="filter-icon" />
            <span>Filtros</span>
          </div>
          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              <FiX className="clear-icon" />
              Limpiar filtros
            </button>
          )}
        </div>
        
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Curso/Taller</label>
            <div className="custom-select">
              <select 
                value={selectedCurso} 
                onChange={(e) => setSelectedCurso(e.target.value)}
                className="select-input"
              >
                <option value="all">Todos los cursos</option>
                {cursos.map((curso) => (
                  <option key={curso} value={curso}>{curso}</option>
                ))}
              </select>
              <FiChevronDown className="select-icon" />
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Horario</label>
            <div className="custom-select">
              <select 
                value={selectedHorario} 
                onChange={(e) => setSelectedHorario(e.target.value)}
                className="select-input"
              >
                <option value="all">Todos los horarios</option>
                {timeSlots.map((slot) => (
                  <option key={slot.label} value={slot.label}>{slot.label}</option>
                ))}
              </select>
              <FiChevronDown className="select-icon" />
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Vista</label>
            <div className="custom-select">
              <select 
                value={viewMode} 
                onChange={(e) => setViewMode(e.target.value)}
                className="select-input"
              >
                <option value="aulas">Ver Aulas</option>
                <option value="materias">Ver Materias</option>
              </select>
              <FiChevronDown className="select-icon" />
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="active-filters">
            {selectedCurso !== "all" && (
              <div className="filter-badge">
                Curso: {selectedCurso}
                <button onClick={() => setSelectedCurso("all")} className="remove-filter">
                  <FiX />
                </button>
              </div>
            )}
            {selectedHorario !== "all" && (
              <div className="filter-badge">
                Horario: {selectedHorario}
                <button onClick={() => setSelectedHorario("all")} className="remove-filter">
                  <FiX />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs-list">
          <button 
            className={`tab-button ${selectedTurno === "Mañana" ? "active" : ""}`}
            onClick={() => setSelectedTurno("Mañana")}
          >
            Mañana
          </button>
          <button 
            className={`tab-button ${selectedTurno === "Tarde" ? "active" : ""}`}
            onClick={() => setSelectedTurno("Tarde")}
          >
            Tarde
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-card">
        <div className="calendar-header">
          <h2 className="calendar-title">Calendario Semanal - {selectedTurno}</h2>
        </div>
        <div className="calendar-content">
          <div className="calendar-grid">
            {/* Header row */}
            <div className="time-header">Horario</div>
            {DIAS.map((dia) => (
              <div key={dia} className="day-header">{dia}</div>
            ))}

            {/* Time slots */}
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot.label} className="time-row">
                <div className="time-slot">{timeSlot.label}</div>
                {DIAS.map((dia) => {
                  const schedulesForSlot = getSchedulesForSlot(dia, timeSlot);
                  return (
                    <div key={`${dia}-${timeSlot.label}`} className="schedule-cell">
                      {schedulesForSlot.map((schedule) => (
                        <div key={schedule.id} className="schedule-item">
                          <div className="schedule-aula">{schedule.aula}</div>
                          <div className="schedule-materia">{schedule.materia}</div>
                          <div className="schedule-grupo">{schedule.grupoTaller}</div>
                          <div className="schedule-profesor">{schedule.profesor}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule List */}
      <div className="schedule-list-card">
        <div className="list-header">
          <h2 className="list-title">Lista de Horarios</h2>
        </div>
        <div className="schedule-list">
          {filteredSchedules.length === 0 ? (
            <div className="no-schedules">
              <p>No hay horarios que coincidan con los filtros</p>
              {hasActiveFilters && (
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            filteredSchedules.map((schedule) => (
              <div key={schedule.id} className="schedule-list-item">
                <div className="schedule-info">
                  <div className="schedule-main">
                    <div className="schedule-badges">
                      <span className="aula-badge">{schedule.aula}</span>
                      <span className="materia-name">{schedule.materia}</span>
                      <span className="grupo-badge">{schedule.grupoTaller}</span>
                    </div>
                    <div className="schedule-details">
                      <span className="profesor-name">{schedule.profesor}</span>
                      <span className="separator">•</span>
                      <span>{schedule.diaSemana}</span>
                      <span className="separator">•</span>
                      <span className="time-range">{schedule.horaInicio} - {schedule.horaFin}</span>
                      <span className="separator">•</span>
                      <span className="turno-badge">{schedule.turno}</span>
                    </div>
                  </div>
                </div>
                <div className="schedule-actions">
                          <button className="action-btn edit-btn">
                            <FiEdit />
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteSchedule(schedule.id)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AddScheduleModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddSchedule}
      />
    </div>
  );
}