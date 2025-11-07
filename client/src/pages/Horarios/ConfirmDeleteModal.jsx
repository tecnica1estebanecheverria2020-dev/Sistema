import { FiTrash2 } from 'react-icons/fi';

export default function ConfirmDeleteModal({ isOpen, schedule, onCancel, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <FiTrash2 className="modal-icon" />
          <h3>Eliminar Horario</h3>
        </div>
        <div className="modal-body">
          <p>
            ¿Querés eliminar este horario?
          </p>
          {schedule && (
            <div className="modal-summary">
              <strong>{schedule.materia}</strong> • {schedule.profesor}
              <br />
              {schedule.aula} • {schedule.grupoTaller}
              <br />
              {schedule.diaSemana} • {schedule.horaInicio} - {schedule.horaFin} • {schedule.turno}
            </div>
          )}
        </div>
        <div className="modal-actions">
          <button type="button" className="btn cancel" onClick={onCancel}>Cancelar</button>
          <button type="button" className="btn danger" onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}