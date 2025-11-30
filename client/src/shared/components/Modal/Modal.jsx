import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiX } from 'react-icons/fi';
import './style.css';

const Modal = ({ isOpen, onClose, title, children, footer, icon: Icon }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Fijo */}
        <div className="modal-header">
          <div className="modal-header-content">
            {Icon && (
              <div className="modal-icon-wrapper">
                <Icon className="modal-icon" />
              </div>
            )}
            <h2 className="modal-title">{title}</h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <FiX />
          </button>
        </div>

        {/* Contenido con Scroll */}
        <div className="modal-content">
          {children}
        </div>

        {/* Footer Fijo (si existe) */}
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  icon: PropTypes.elementType,
};

export default Modal;
