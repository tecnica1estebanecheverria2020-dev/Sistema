import React, { useState, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import './style.css';

/**
 * DataTable - Componente reutilizable para mostrar datos en tabla
 *
 * @param {Array} data - Array de objetos con los datos a mostrar
 * @param {Array} columns - Configuración de columnas:
 *   - key: string - Clave del objeto para acceder al valor
 *   - label: string - Etiqueta a mostrar en el header
 *   - sortable: boolean - Si la columna es ordenable (default: true)
 *   - type: 'string' | 'number' | 'date' - Tipo de dato para ordenamiento
 *   - render: function - Función opcional para renderizar el valor personalizado
 * @param {React.Component} actions - Componente de acciones para cada fila (recibe row como prop)
 * @param {number} itemsPerPage - Cantidad de items por página (default: 10)
 * @param {React.Component} emptyState - Componente a mostrar cuando no hay datos
 * @param {string} keyField - Campo que se usará como key de React (default: 'id')
 */
export default function DataTable({
  data = [],
  columns = [],
  actions = null,
  itemsPerPage = 10,
  emptyState = null,
  keyField = 'id',
  itemsPerPageOptions = [5, 10, 25, 50, 100]
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(itemsPerPage);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Ordenamiento de datos
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return data;
    }

    const sorted = [...data].sort((a, b) => {
      const column = columns.find(col => col.key === sortConfig.key);
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Manejo de valores nulos o undefined
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Ordenamiento según el tipo de dato
      if (column?.type === 'number') {
        return sortConfig.direction === 'asc'
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }
      else if (column?.type === 'date') {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        return sortConfig.direction === 'asc'
          ? dateA - dateB
          : dateB - dateA;
      }
      else {
        // String (default)
        const strA = String(aValue).toLowerCase();
        const strB = String(bValue).toLowerCase();
        if (sortConfig.direction === 'asc') {
          return strA > strB ? 1 : strA < strB ? -1 : 0;
        } else {
          return strA < strB ? 1 : strA > strB ? -1 : 0;
        }
      }
    });

    return sorted;
  }, [data, sortConfig, columns]);

  // Paginación
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = sortedData.slice(startIndex, endIndex);

  // Manejo del cambio de items por página
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset a la primera página cuando cambia el tamaño
  };

  // Manejo del ordenamiento
  const handleSort = (columnKey) => {
    const column = columns.find(col => col.key === columnKey);
    if (column?.sortable === false) return;

    let direction = 'asc';
    if (sortConfig.key === columnKey) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }

    setSortConfig({
      key: direction ? columnKey : null,
      direction
    });
    setCurrentPage(1); // Reset a la primera página cuando se ordena
  };

  // Iconos de ordenamiento
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />;
  };

  // Navegación de páginas
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Generar números de página visibles
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Si no hay datos, mostrar estado vacío
  if (data.length === 0 && emptyState) {
    return <div className="datatable-empty">{emptyState}</div>;
  }

  return (
    <div className="datatable-wrapper">
      <div className="datatable-container">
        <table className="datatable">
          <thead className="datatable-header">
            <tr className="datatable-row">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`datatable-header-cell ${column.sortable !== false ? 'sortable' : ''}`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="datatable-header-content">
                    <span>{column.label}</span>
                    {column.sortable !== false && (
                      <span className="datatable-sort-icon">
                        {getSortIcon(column.key)}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="datatable-header-cell datatable-actions-header">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="datatable-body">
            {currentData.map((row) => (
              <tr key={row[keyField]} className="datatable-row">
                {columns.map((column) => (
                  <td key={column.key} className="datatable-cell">
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
                {actions && (
                  <td className="datatable-cell datatable-actions-cell">
                    {React.cloneElement(actions, { row })}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer con Paginación */}
      <div className="datatable-footer">
        <div className="datatable-footer-left">
          <div className="datatable-items-per-page">
            <span className="datatable-items-label">Mostrar</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="datatable-items-select"
            >
              {itemsPerPageOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <span className="datatable-items-label">items por página</span>
          </div>
          <div className="datatable-pagination-info">
            Mostrando {sortedData.length === 0 ? 0 : startIndex + 1} - {Math.min(endIndex, sortedData.length)} de {sortedData.length} items
          </div>
        </div>

        {totalPages > 1 && (
          <div className="datatable-pagination-controls">
            <button
              className="datatable-page-button"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              title="Primera página"
            >
              <FiChevronsLeft />
            </button>

            <button
              className="datatable-page-button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              title="Página anterior"
            >
              <FiChevronLeft />
            </button>

            <div className="datatable-page-numbers">
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  className={`datatable-page-number ${currentPage === page ? 'active' : ''}`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              className="datatable-page-button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Página siguiente"
            >
              <FiChevronRight />
            </button>

            <button
              className="datatable-page-button"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              title="Última página"
            >
              <FiChevronsRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
