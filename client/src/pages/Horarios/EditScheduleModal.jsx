import { useEffect, useState, useMemo } from 'react';
import { FiEdit, FiX, FiSave } from 'react-icons/fi';
import { catalogsService } from '../../shared/services/catalogsService';
import { schedulesService } from '../../shared/services/schedulesServices';
import Modal from '../../shared/components/Modal/Modal';

const ES_TO_EN = {
  Lunes: 'Monday',
  Martes: 'Tuesday',
  Miércoles: 'Wednesday',
  Jueves: 'Thursday',
  Viernes: 'Friday',
  Sábado: 'Saturday',
  Domingo: 'Sunday',
};

export default function EditScheduleModal({ isOpen, schedule, onClose, onSaved }) {
  const [classrooms, setClassrooms] = useState([]);
  const [workshopGroups, setWorkshopGroups] = useState([]);
  const [subjectUsers, setSubjectUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  const [form, setForm] = useState({
    id_classroom: '',
    id_workshop_group: '',
    id_subject_user: '',
    day_of_week: 'Monday',
    start_time: '07:00',
    end_time: '09:00',
    shift: 'Mañana',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const loadCatalogs = async () => {
      try {
        const [cls, wgs, sus, subs, tchs] = await Promise.all([
          catalogsService.getClassrooms(),
          catalogsService.getWorkshopGroups(),
          catalogsService.getSubjectUsers(),
          catalogsService.getSubjects(),
          catalogsService.getTeachers(),
        ]);
        setClassrooms(Array.isArray(cls) ? cls : []);
        setWorkshopGroups(Array.isArray(wgs) ? wgs : []);
        setSubjectUsers(Array.isArray(sus) ? sus : []);
        setSubjects(Array.isArray(subs) ? subs : []);
        setTeachers(Array.isArray(tchs) ? tchs : []);
      } catch (e) {
        console.error(e);
        setError('Error al cargar catálogos');
      }
    };
    loadCatalogs();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !schedule) return;
    // Derivar subjectId y teacherId desde subjectUsers usando id_subject_user del horario
    let initialSubjectId = '';
    let initialTeacherId = '';
    const suMatch = subjectUsers.find((su) => su.id_subject_user === schedule.idSubjectUser);
    if (suMatch) {
      initialSubjectId = suMatch.id_subject;
      initialTeacherId = suMatch.id_user;
    }
    setForm({
      id_classroom: schedule.idClassroom ?? '',
      id_workshop_group: schedule.idWorkshopGroup ?? '',
      id_subject_user: schedule.idSubjectUser ?? '',
      day_of_week: ES_TO_EN[schedule.diaSemana] || 'Monday',
      start_time: schedule.horaInicio || '07:00',
      end_time: schedule.horaFin || '09:00',
      shift: schedule.turno || 'Mañana',
    });
    setSelectedSubjectId(initialSubjectId ? String(initialSubjectId) : '');
    setSelectedTeacherId(initialTeacherId ? String(initialTeacherId) : '');
    setError('');
  }, [isOpen, schedule, subjectUsers]);

  // Filtrados dependientes para selects separados
  const availableSubjects = useMemo(() => {
    if (!selectedTeacherId) return subjects;
    const tid = parseInt(selectedTeacherId, 10);
    const subjectIds = new Set(subjectUsers.filter((su) => su.id_user === tid).map((su) => su.id_subject));
    return subjects.filter((s) => subjectIds.has(s.id));
  }, [selectedTeacherId, subjects, subjectUsers]);

  const availableTeachers = useMemo(() => {
    if (!selectedSubjectId) return teachers;
    const sid = parseInt(selectedSubjectId, 10);
    const teacherIds = new Set(subjectUsers.filter((su) => su.id_subject === sid).map((su) => su.id_user));
    return teachers.filter((t) => teacherIds.has(t.id));
  }, [selectedSubjectId, teachers, subjectUsers]);

  const toHHMMSS = (hhmm) => {
    if (!hhmm) return null;
    const [h, m] = String(hhmm).split(':');
    if (!h || !m) return null;
    return `${h.padStart(2, '0')}:${m.padStart(2, '0')}:00`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!schedule) return;
    setLoading(true);
    setError('');
    try {
      // Resolver id_subject_user desde las selecciones de Materia y Docente
      let idSubjectUser = null;
      const tid = parseInt(selectedTeacherId || '0', 10);
      const sid = parseInt(selectedSubjectId || '0', 10);
      if (tid && sid) {
        const match = subjectUsers.find((su) => su.id_user === tid && su.id_subject === sid);
        idSubjectUser = match ? match.id_subject_user : null;
      }
      if (!idSubjectUser) {
        setError('Selecciona una combinación válida de Docente y Materia');
        setLoading(false);
        return;
      }

      const payload = {
        id_classroom: parseInt(form.id_classroom, 10),
        id_workshop_group: parseInt(form.id_workshop_group, 10),
        id_subject_user: idSubjectUser,
        day_of_week: form.day_of_week,
        start_time: toHHMMSS(form.start_time),
        end_time: toHHMMSS(form.end_time),
        shift: form.shift,
      };

      const res = await schedulesService.updateSchedule(schedule.id, payload);
      if (res?.success) {
        if (onSaved) onSaved(res.data);
      } else {
        setError(res?.message || 'No se pudo actualizar el horario');
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Error al actualizar el horario';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const footer = (
    <>
      <button type="button" onClick={onClose} className="modal-btn modal-btn-secondary">
        <FiX />
        Cancelar
      </button>
      <button type="submit" form="edit-schedule-form" className="modal-btn modal-btn-primary" disabled={loading}>
        <FiSave />
        {loading ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Editar Horario"
      icon={FiEdit}
      footer={footer}
    >
      <form id="edit-schedule-form" onSubmit={handleSubmit} className="modal-body">
        {error && <div className="modal-error">{error}</div>}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Aula</label>
              <select name="id_classroom" value={form.id_classroom} onChange={handleChange} required className="form-select">
                <option value="">Selecciona aula</option>
                {classrooms.map((c) => (
                  <option key={c.id_classroom || c.id || c.name} value={c.id_classroom || c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Curso/Grupo Taller</label>
              <select name="id_workshop_group" value={form.id_workshop_group} onChange={handleChange} required className="form-select">
                <option value="">Selecciona curso/grupo</option>
                {workshopGroups.map((wg) => (
                  <option key={wg.id_workshop_group || wg.id || wg.name} value={wg.id_workshop_group || wg.id}>{wg.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Docente</label>
              <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(e.target.value)} className="form-select" required>
                <option value="">Selecciona docente</option>
                {availableTeachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Materia</label>
              <select value={selectedSubjectId} onChange={(e) => setSelectedSubjectId(e.target.value)} className="form-select" required>
                <option value="">Selecciona materia</option>
                {availableSubjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Día</label>
              <select name="day_of_week" value={form.day_of_week} onChange={handleChange} required className="form-select">
                <option value="Monday">Lunes</option>
                <option value="Tuesday">Martes</option>
                <option value="Wednesday">Miércoles</option>
                <option value="Thursday">Jueves</option>
                <option value="Friday">Viernes</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Inicio</label>
              <input type="time" name="start_time" value={form.start_time} onChange={handleChange} step="60" required className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Fin</label>
              <input type="time" name="end_time" value={form.end_time} onChange={handleChange} step="60" required className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Turno</label>
              <select name="shift" value={form.shift} onChange={handleChange} required className="form-select">
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
              </select>
            </div>
          </div>
        </form>
    </Modal>
  );
}