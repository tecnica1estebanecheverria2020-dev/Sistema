import { FiPlus } from 'react-icons/fi';

export default function Header({ onAdd }) {
  return (
    <div className="comunicados-header">
      <div className="comunicados-header-content">
        <h1 className="comunicados-title">Comunicados</h1>
        <p className="comunicados-subtitle">Gestión de anuncios y publicaciones</p>
      </div>
      <button onClick={onAdd} className="comunicados-add-button">
        <FiPlus className="comunicados-add-icon" />
        Nuevo Comunicado
      </button>
    </div>
  );
}