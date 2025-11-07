import { useState, useEffect, useMemo } from "react";
import { FiFilter, FiX, FiPlus, FiEdit, FiTrash2, FiChevronDown, FiClock, FiUser, FiBook, FiMapPin } from "react-icons/fi";
import AddScheduleModal from "./AddScheduleModal";
import EditScheduleModal from "./EditScheduleModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import "./style.css";
import { schedulesService } from "../../shared/services/schedulesServices";
import { catalogsService } from "../../shared/services/catalogsService";

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

// Etiquetas más amigables y horarios típicos (manteniendo valores exactos para filtrado backend)
const TIME_SLOTS_MANANA = [
  { label: "7 a 9", start: "07:00", end: "09:00" },
  { label: "9 a 10", start: "09:00", end: "10:00" },
  { label: "10 a 12", start: "10:00", end: "12:00" },
];

const TIME_SLOTS_TARDE = [
  { label: "13 a 15:30", start: "13:00", end: "15:30" },
  { label: "15:30 a 17:30", start: "15:30", end: "17:30" },
];

const EN_TO_ES = {
  Monday: "Lunes",
  Tuesday: "Martes",
  Wednesday: "Miércoles",
  Thursday: "Jueves",
  Friday: "Viernes",
  Saturday: "Sábado",
  Sunday: "Domingo",
};

const ES_TO_EN = {
  Lunes: "Monday",
  Martes: "Tuesday",
  Miércoles: "Wednesday",
  Jueves: "Thursday",
  Viernes: "Friday",
  Sábado: "Saturday",
  Domingo: "Sunday",
};

function mapBackendSchedule(s) {
  return {
    id: s.id_schedule,
    idClassroom: s.id_classroom,
    idWorkshopGroup: s.id_workshop_group,
    idSubjectUser: s.id_subject_user,
    aula: s.classroom || "",
    materia: s.subject || "",
    grupoTaller: s.workshop_group || "",
    profesor: s.teacher || "",
    diaSemana: EN_TO_ES[s.day_of_week] || s.day_of_week,
    horaInicio: (s.start_time || "").slice(0, 5),
    horaFin: (s.end_time || "").slice(0, 5),
    turno: s.shift,
  };
}

export default function Horarios() {
  const [schedules, setSchedules] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState("Mañana");
  const [selectedCurso, setSelectedCurso] = useState("all");
  const [selectedHorario, setSelectedHorario] = useState("all");
  const [viewMode, setViewMode] = useState("aulas");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [workshopGroups, setWorkshopGroups] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  const clearFilters = () => {
    setSelectedCurso("all");
    setSelectedHorario("all");
  };

  const toHHMMSS = (hhmm) => {
    if (!hhmm) return null;
    const [h, m] = String(hhmm).split(":");
    if (!h || !m) return null;
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}:00`;
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError("");
      // Construir filtros para el backend según selección
      const params = {};
      // Turno
      if (selectedTurno) params.shift = selectedTurno;
      // Curso/Taller (nombre de grupo). El backend acepta filtro por nombre (compatibilidad)
      if (selectedCurso && selectedCurso !== "all") params.workshop_group = selectedCurso;
      // Horario (rango exacto). El backend requiere HH:MM:SS.
      if (selectedHorario && selectedHorario !== "all") {
        const slot = timeSlots.find((t) => t.label === selectedHorario);
        if (slot) {
          params.start_time = toHHMMSS(slot.start);
          params.end_time = toHHMMSS(slot.end);
        }
      }

      const res = await schedulesService.getSchedules(params);
      // schedulesService retorna el objeto { success, message, data }
      const data = res?.data || [];
      const mapped = Array.isArray(data) ? data.map(mapBackendSchedule) : [];
      setSchedules(mapped);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Error al cargar horarios';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Cargar todos los cursos/grupos desde catálogos
  useEffect(() => {
    const loadWorkshopGroups = async () => {
      try {
        const res = await catalogsService.getWorkshopGroups();
        // catalogsService devuelve directamente el array de grupos (sin envolver)
        setWorkshopGroups(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error(err);
        // No bloquea la página, pero mostramos mensaje
        setError((prev) => prev || 'Error al cargar cursos/grupos');
      }
    };
    loadWorkshopGroups();
  }, []);

  useEffect(() => {
    fetchSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTurno, selectedCurso, selectedHorario]);

  const cursos = useMemo(() => {
    // Preferimos catálogos para mostrar todos los cursos
    if (workshopGroups.length > 0) {
      return workshopGroups.map((wg) => wg.name).sort();
    }
    // Fallback: derivar de los horarios cargados
    const uniqueCursos = new Set(schedules.map((s) => s.grupoTaller));
    return Array.from(uniqueCursos).sort();
  }, [workshopGroups, schedules]);

  const timeSlots = selectedTurno === "Mañana" ? TIME_SLOTS_MANANA : TIME_SLOTS_TARDE;

  const toMin = (hhmm) => {
    if (!hhmm) return null;
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };

  const rangesOverlap = (aStart, aEnd, bStart, bEnd) => {
    return aStart < bEnd && bStart < aEnd;
  };

  const filteredSchedules = useMemo(() => {
    // Aun si filtramos en backend, mantenemos este filtro en cliente para asegurar consistencia visual
    return schedules.filter((s) => {
      if (s.turno !== selectedTurno) return false;
      if (selectedCurso !== "all" && s.grupoTaller !== selectedCurso) return false;
      if (selectedHorario !== "all") {
        const timeSlot = timeSlots.find((t) => t.label === selectedHorario);
        if (timeSlot) {
          const slotStart = toMin(timeSlot.start);
          const slotEnd = toMin(timeSlot.end);
          const schStart = toMin(s.horaInicio);
          const schEnd = toMin(s.horaFin);
          if (slotStart == null || slotEnd == null || schStart == null || schEnd == null) return false;
          // Mostrar el horario si su rango se solapa con el del slot seleccionado
          if (!rangesOverlap(schStart, schEnd, slotStart, slotEnd)) return false;
        }
      }
      return true;
    });
  }, [schedules, selectedTurno, selectedCurso, selectedHorario, timeSlots]);

  const getSchedulesForSlot = (dia, timeSlot) => {
    const slotStart = toMin(timeSlot.start);
    const slotEnd = toMin(timeSlot.end);
    return filteredSchedules.filter((s) => {
      if (s.diaSemana !== dia || s.turno !== selectedTurno) return false;
      const schStart = toMin(s.horaInicio);
      const schEnd = toMin(s.horaFin);
      if (slotStart == null || slotEnd == null || schStart == null || schEnd == null) return false;
      return rangesOverlap(schStart, schEnd, slotStart, slotEnd);
    });
  };

  const handleAddSchedule = () => {
    // Luego de crear, refrescamos desde backend con filtros vigentes
    fetchSchedules();
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await schedulesService.deleteSchedule(scheduleId);
      setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Error al eliminar horario';
      alert(msg);
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
                                  <div className="schedule-materia">
                                    <span className="materia-name">{schedule.materia}</span>
                                    <span className="profesor-badge">{schedule.profesor}</span>
                                  </div>
                                  <div className="schedule-grupo">{schedule.grupoTaller}</div>
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
          {loading ? (
            <div className="no-schedules"><p>Cargando horarios...</p></div>
          ) : filteredSchedules.length === 0 ? (
            <div className="no-schedules">
              <p>{error || 'No hay horarios que coincidan con los filtros'}</p>
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
                      <span className="profesor-badge">{schedule.profesor}</span>
                      <span className="grupo-badge">{schedule.grupoTaller}</span>
                    </div>
                    <div className="schedule-details">
                      <span>{schedule.diaSemana}</span>
                      <span className="separator">•</span>
                      <span className="time-range">{schedule.horaInicio} - {schedule.horaFin}</span>
                      <span className="separator">•</span>
                      <span className="turno-badge">{schedule.turno}</span>
                    </div>
                  </div>
                </div>
                <div className="schedule-actions">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => { setScheduleToEdit(schedule); setShowEditModal(true); }}
                    title="Editar horario"
                  >
                    <FiEdit />
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => { setScheduleToDelete(schedule); setShowDeleteModal(true); }}
                    title="Eliminar horario"
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

      <EditScheduleModal
        isOpen={showEditModal}
        schedule={scheduleToEdit}
        onClose={() => { setShowEditModal(false); setScheduleToEdit(null); }}
        onSaved={() => { setShowEditModal(false); setScheduleToEdit(null); fetchSchedules(); }}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        schedule={scheduleToDelete}
        onCancel={() => { setShowDeleteModal(false); setScheduleToDelete(null); }}
        onConfirm={() => {
          if (!scheduleToDelete) return;
          handleDeleteSchedule(scheduleToDelete.id);
          setShowDeleteModal(false);
          setScheduleToDelete(null);
        }}
      />
    </div>
  );
}