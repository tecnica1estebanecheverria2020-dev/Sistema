import { useState, useEffect, useMemo } from "react";
import { FiX, FiClock, FiSave, FiPlus } from "react-icons/fi";
import { schedulesService } from "../../shared/services/schedulesServices";
import { catalogsService } from "../../shared/services/catalogsService";
import useNotification from "../../shared/hooks/useNotification";
import Modal from "../../shared/components/Modal/Modal";

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const TURNOS = ["Mañana", "Tarde"];

const DAY_TO_EN = {
  "Lunes": "Monday",
  "Martes": "Tuesday",
  "Miércoles": "Wednesday",
  "Jueves": "Thursday",
  "Viernes": "Friday",
};

export default function AddScheduleModal({ isOpen, onClose, onSave }) {
  const notify = useNotification();

  const [formData, setFormData] = useState({
    id_classroom: "",
    id_workshop_group: "",
    diaSemana: "",
    turno: "",
    horaInicio: "",
    horaFin: "",
  });

  // Catálogos y estados para selects
  const [classrooms, setClassrooms] = useState([]);
  const [workshopGroups, setWorkshopGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjectUsers, setSubjectUsers] = useState([]);

  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const loadCatalogs = async () => {
      try {
        const [cls, wgs, subs, tchs, sus] = await Promise.all([
          catalogsService.getClassrooms(),
          catalogsService.getWorkshopGroups(),
          catalogsService.getSubjects(),
          catalogsService.getTeachers(),
          catalogsService.getSubjectUsers(),
        ]);
        setClassrooms(cls);
        setWorkshopGroups(wgs);
        setSubjects(subs);
        setTeachers(tchs);
        setSubjectUsers(sus);
      } catch (error) {
        console.error(error);
        notify('Error al cargar catálogos', 'error');
      }
    };
    loadCatalogs();
  }, [isOpen, notify]);

  const availableSubjects = useMemo(() => {
    if (!selectedTeacherId) return subjects;
    const tid = parseInt(selectedTeacherId, 10);
    const subjectIds = new Set(subjectUsers.filter(su => su.id_user === tid).map(su => su.id_subject));
    return subjects.filter(s => subjectIds.has(s.id));
  }, [selectedTeacherId, subjects, subjectUsers]);

  const availableTeachers = useMemo(() => {
    if (!selectedSubjectId) return teachers;
    const sid = parseInt(selectedSubjectId, 10);
    const teacherIds = new Set(subjectUsers.filter(su => su.id_subject === sid).map(su => su.id_user));
    return teachers.filter(t => teacherIds.has(t.id));
  }, [selectedSubjectId, teachers, subjectUsers]);

  const subjectUserId = useMemo(() => {
    const tid = parseInt(selectedTeacherId || '0', 10);
    const sid = parseInt(selectedSubjectId || '0', 10);
    if (!tid || !sid) return null;
    const match = subjectUsers.find(su => su.id_user === tid && su.id_subject === sid);
    return match ? match.id_subject_user : null;
  }, [selectedTeacherId, selectedSubjectId, subjectUsers]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos requeridos para backend
    const requiredFields = ['id_classroom', 'id_workshop_group', 'diaSemana', 'turno', 'horaInicio', 'horaFin'];
    const missing = requiredFields.filter((f) => !formData[f]);
    if (missing.length > 0) {
      notify(`Por favor completa todos los campos requeridos: ${missing.join(', ')}`, 'warning');
      return;
    }

    if (!selectedTeacherId || !selectedSubjectId) {
      notify('Selecciona docente y materia', 'warning');
      return;
    }

    if (!subjectUserId) {
      notify('La combinación Docente + Materia no está registrada', 'warning');
      return;
    }

    // Construir payload para API
    const payload = {
      id_classroom: parseInt(formData.id_classroom, 10),
      id_subject_user: subjectUserId,
      day_of_week: DAY_TO_EN[formData.diaSemana] || formData.diaSemana,
      start_time: `${formData.horaInicio}:00`,
      end_time: `${formData.horaFin}:00`,
      shift: formData.turno,
    };
    payload.id_workshop_group = parseInt(formData.id_workshop_group, 10);

    try {
      const created = await schedulesService.createSchedule(payload);
      // Notificar al padre para refrescar
      onSave(created);
      handleClose();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Error al crear el horario';
      notify(msg, 'error');
    }
  };

  const handleClose = () => {
    setFormData({
      id_classroom: "",
      id_workshop_group: "",
      diaSemana: "",
      turno: "",
      horaInicio: "",
      horaFin: "",
    });
    setSelectedTeacherId("");
    setSelectedSubjectId("");
    onClose();
  };

  if (!isOpen) return null;

  const footer = (
    <>
      <button type="button" onClick={handleClose} className="modal-btn modal-btn-secondary">
        <FiX />
        Cancelar
      </button>
      <button type="submit" form="add-schedule-form" className="modal-btn modal-btn-primary">
        <FiSave />
        Agregar Horario
      </button>
    </>
  );

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title="Agregar Horario"
      icon={FiPlus}
      footer={footer}
    >
      <form id="add-schedule-form" onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            {/* Aula */}
            <div className="form-group">
              <label className="form-label">Aula</label>
              <select
                value={formData.id_classroom}
                onChange={(e) => handleInputChange('id_classroom', e.target.value)}
                className="form-select"
                required
              >
                <option value="">Seleccionar aula</option>
                {classrooms.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Docente */}
            <div className="form-group">
              <label className="form-label">Docente</label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="form-select"
                required
              >
                <option value="">Seleccionar docente</option>
                {availableTeachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Materia */}
            <div className="form-group">
              <label className="form-label">Materia</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="form-select"
                required
              >
                <option value="">Seleccionar materia</option>
                {availableSubjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Grupo de Taller */}
            <div className="form-group">
              <label className="form-label">
                Grupo de Taller
              </label>
              <select
                value={formData.id_workshop_group}
                onChange={(e) => handleInputChange('id_workshop_group', e.target.value)}
                className="form-select"
                required
              >
                <option value="">Seleccionar grupo</option>
                {workshopGroups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            {/* Día de la Semana */}
            <div className="form-group">
              <label className="form-label">
                <FiClock className="label-icon" />
                Día de la Semana
              </label>
              <select
                value={formData.diaSemana}
                onChange={(e) => handleInputChange('diaSemana', e.target.value)}
                className="form-select"
                required
              >
                <option value="">Seleccionar día</option>
                {DIAS.map(dia => (
                  <option key={dia} value={dia}>{dia}</option>
                ))}
              </select>
            </div>

            {/* Turno */}
            <div className="form-group">
              <label className="form-label">
                <FiClock className="label-icon" />
                Turno
              </label>
              <select
                value={formData.turno}
                onChange={(e) => handleInputChange('turno', e.target.value)}
                className="form-select"
                required
              >
                <option value="">Seleccionar turno</option>
                {TURNOS.map(turno => (
                  <option key={turno} value={turno}>{turno}</option>
                ))}
              </select>
            </div>

            {/* Hora Inicio */}
            <div className="form-group">
              <label className="form-label">
                <FiClock className="label-icon" />
                Hora Inicio
              </label>
              <input
                type="time"
                value={formData.horaInicio}
                onChange={(e) => handleInputChange('horaInicio', e.target.value)}
                className="form-input"
                required
              />
            </div>

            {/* Hora Fin */}
            <div className="form-group">
              <label className="form-label">
                <FiClock className="label-icon" />
                Hora Fin
              </label>
              <input
                type="time"
                value={formData.horaFin}
                onChange={(e) => handleInputChange('horaFin', e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>
        </form>
    </Modal>
  );
}