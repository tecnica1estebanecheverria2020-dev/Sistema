import { FiTrash2, FiX } from 'react-icons/fi';
import Modal from '../../shared/components/Modal/Modal';

export default function ConfirmDeleteModal({ isOpen, schedule, onCancel, onConfirm }) {
  if (!isOpen) return null;

  const footer = (
    <>
      <button type="button" onClick={onCancel} className="modal-btn modal-btn-secondary">
        <FiX />
        Cancelar
      </button>
      <button type="button" onClick={onConfirm} className="modal-btn modal-btn-danger">
        <FiTrash2 />
        Eliminar
      </button>
    </>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title="Eliminar Horario"
      icon={FiTrash2}
      footer={footer}
    >
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
    </Modal>
  );
}