import { useState } from "react";
import { FiX, FiClock, FiUser, FiBook, FiMapPin } from "react-icons/fi";

const AULAS = [
  "AULA 1", "AULA 2", "AULA 3", "AULA 4", "AULA 5", "AULA 6", "AULA 7", "AULA 8", 
  "AULA 9", "AULA 10", "AULA 11", "AULA 12", "AULA 13", "AULA 14", "AULA 15", 
  "AULA 16", "AULA 17", "AULA 18", "AULA 19", "AULA 20", "AULA 21", 
  "TALLER GRANDE", "LABORATORIO"
];

const MATERIAS = [
  "LENGUAJES TECNOLOGICOS",
  "PROCEDIMIENTOS TECNICOS", 
  "LABORATORIO HARDWARE",
  "LABORATORIO DE DISEÑO WEB",
  "SISTEMAS TECNOLOGICOS IMRSC",
  "LABORATORIO DE PROGRAMACION",
  "SISTEMAS TECNOLOGICOS"
];

const GRUPOS = [
  "1.1", "1.2", "1.3", "1.4", "1.5",
  "2.1", "2.2", "2.3", "2.4", "2.5",
  "3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7",
  "4.1", "4.2", "4.3", "4.4", "4.5",
  "5.1", "5.2", "5.3", "5.4", "5.5",
  "6.1", "6.2", "6.3", "6.4", "6.5",
  "7.1", "7.2", "7.3", "7.4", "7.5"
];

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const TURNOS = ["Mañana", "Tarde"];

export default function AddScheduleModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    aula: "",
    materia: "",
    grupoTaller: "",
    profesor: "",
    diaSemana: "",
    turno: "",
    horaInicio: "",
    horaFin: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar campos requeridos
    const requiredFields = ['aula', 'materia', 'grupoTaller', 'profesor', 'diaSemana', 'turno', 'horaInicio', 'horaFin'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    // Crear nuevo horario
    const newSchedule = {
      id: crypto.randomUUID(),
      ...formData
    };

    onSave(newSchedule);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      aula: "",
      materia: "",
      grupoTaller: "",
      profesor: "",
      diaSemana: "",
      turno: "",
      horaInicio: "",
      horaFin: ""
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Agregar Horario</h2>
          <p className="modal-subtitle">Completa los datos del nuevo horario</p>
          <button className="modal-close-btn" onClick={handleClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            {/* Aula */}
            <div className="form-group">
              <label className="form-label">
                <FiMapPin className="label-icon" />
                Aula
              </label>
              <select
                value={formData.aula}
                onChange={(e) => handleInputChange('aula', e.target.value)}
                className="form-select"
                required
              >
                <option value="">Seleccionar aula</option>
                {AULAS.map(aula => (
                  <option key={aula} value={aula}>{aula}</option>
                ))}
              </select>
            </div>

            {/* Materia */}
            <div className="form-group">
              <label className="form-label">
                <FiBook className="label-icon" />
                Materia
              </label>
              <select
                value={formData.materia}
                onChange={(e) => handleInputChange('materia', e.target.value)}
                className="form-select"
                required
              >
                <option value="">Seleccionar materia</option>
                {MATERIAS.map(materia => (
                  <option key={materia} value={materia}>{materia}</option>
                ))}
              </select>
            </div>

            {/* Grupo de Taller */}
            <div className="form-group">
              <label className="form-label">
                <FiUser className="label-icon" />
                Grupo de Taller
              </label>
              <select
                value={formData.grupoTaller}
                onChange={(e) => handleInputChange('grupoTaller', e.target.value)}
                className="form-select"
                required
              >
                <option value="">Seleccionar grupo</option>
                {GRUPOS.map(grupo => (
                  <option key={grupo} value={grupo}>{grupo}</option>
                ))}
              </select>
            </div>

            {/* Profesor */}
            <div className="form-group">
              <label className="form-label">
                <FiUser className="label-icon" />
                Profesor
              </label>
              <input
                type="text"
                value={formData.profesor}
                onChange={(e) => handleInputChange('profesor', e.target.value)}
                className="form-input"
                placeholder="Nombre del profesor"
                required
              />
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

          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="cancel-btn">
              Cancelar
            </button>
            <button type="submit" className="submit-btn">
              Agregar Horario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}