import './style.css';
import { FiPlus } from 'react-icons/fi';

export default function Section({
  title,
  subtitle,
  icon: Icon,
  children,
  onAdd,
  addButtonText = 'Agregar',
  showAddButton = true,
  headerAction
}) {
  return (
    <div className="section-container">
      <div className="section-header">
        <div className="section-header-content">
          <div className="section-title-wrapper">
            {Icon && <Icon className="section-title-icon" />}
            <h1 className="section-title">{title}</h1>
          </div>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        {headerAction ? (
          headerAction
        ) : showAddButton && onAdd ? (
          <button onClick={onAdd} className="section-add-button">
            <FiPlus className="section-add-icon" />
            {addButtonText}
          </button>
        ) : null}
      </div>
      <div className="section-content">
        {children}
      </div>
    </div>
  );
}
