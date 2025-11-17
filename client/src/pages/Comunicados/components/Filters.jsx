import { FiSearch, FiFilter } from 'react-icons/fi';

export default function Filters({ searchTerm, onSearchChange, filterType, onFilterChange }) {
  return (
    <div className="comunicados-filters">
      <div className="comunicados-search-container">
        <FiSearch className="comunicados-search-icon" />
        <input
          type="text"
          placeholder="Buscar comunicados..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="comunicados-search-input"
        />
      </div>
      <div className="comunicados-filter-container">
        <FiFilter className="comunicados-filter-icon" />
        <select
          value={filterType}
          onChange={(e) => onFilterChange(e.target.value)}
          className="comunicados-filter-select"
        >
          <option value="todos">Todos</option>
          <option value="Publicado">Publicados</option>
          <option value="Borrador">Borradores</option>
        </select>
      </div>
    </div>
  );
}