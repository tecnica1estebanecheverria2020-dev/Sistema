import React, { useState, useEffect } from 'react';
import { FiSettings, FiPlus, FiEdit2, FiTrash2, FiUser, FiX, FiUsers } from 'react-icons/fi';
import './style.css';

export default function Configuracion() {
  const [profesores, setProfesores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfesor, setEditingProfesor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    especialidad: '',
    estado: 'Activo'
  });

  // Datos de ejemplo para profesores
  useEffect(() => {
    setProfesores([
      {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@escuela.edu',
        telefono: '123-456-7890',
        especialidad: 'Matemáticas',
        estado: 'Activo'
      },
      {
        id: 2,
        nombre: 'María',
        apellido: 'García',
        email: 'maria.garcia@escuela.edu',
        telefono: '098-765-4321',
        especialidad: 'Ciencias',
        estado: 'Activo'
      },
      {
        id: 3,
        nombre: 'Carlos',
        apellido: 'López',
        email: 'carlos.lopez@escuela.edu',
        telefono: '555-123-4567',
        especialidad: 'Historia',
        estado: 'Inactivo'
      }
    ]);
  }, []);

  const filteredProfesores = profesores.filter(profesor =>
    profesor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profesor.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profesor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profesor.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingProfesor) {
      // Editar profesor existente
      setProfesores(profesores.map(profesor =>
        profesor.id === editingProfesor.id
          ? { ...formData, id: editingProfesor.id }
          : profesor
      ));
    } else {
      // Agregar nuevo profesor
      const newProfesor = {
        ...formData,
        id: Math.max(...profesores.map(p => p.id), 0) + 1
      };
      setProfesores([...profesores, newProfesor]);
    }
    
    resetForm();
    setIsModalOpen(false);
  };

  const handleEdit = (profesor) => {
    setEditingProfesor(profesor);
    setFormData({
      nombre: profesor.nombre,
      apellido: profesor.apellido,
      email: profesor.email,
      telefono: profesor.telefono,
      especialidad: profesor.especialidad,
      estado: profesor.estado
    });
    setIsModalOpen(true);
  };

  const handleDelete = (profesor) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar al profesor ${profesor.nombre} ${profesor.apellido}?`)) {
      setProfesores(profesores.filter(p => p.id !== profesor.id));
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      especialidad: '',
      estado: 'Activo'
    });
    setEditingProfesor(null);
  };

  const getEstadoClass = (estado) => {
    switch (estado.toLowerCase()) {
      case 'activo':
        return 'active';
      case 'inactivo':
        return 'inactive';
      default:
        return '';
    }
  };

  return (
    <div className="config-container">
      {/* Header */}
      <div className="config-header">
        <div className="header-content">
          <h1 className="config-title">Configuración</h1>
          <p className="config-subtitle">Gestiona las opciones del sistema</p>
        </div>
      </div>

      {/* Gestión de Profesores */}
      <div className="config-section">
        <div className="section-header">
          <div className="section-title-container">
            <FiUsers className="section-icon" />
            <div>
              <h2 className="section-title">Gestión de Profesores</h2>
              <p className="section-subtitle">Administra la lista de profesores autorizados</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="config-add-button"
          >
            <FiPlus className="config-add-icon" />
            Agregar Profesor
          </button>
        </div>

        {/* Filtros */}
        <div className="config-filters">
          <div className="config-search-container">
            <input
              type="text"
              placeholder="Buscar por nombre, email o especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="config-search-input"
            />
          </div>
          
          <div className="config-results-count">
            <span className="config-count-text">Total: {filteredProfesores.length} profesores</span>
          </div>
        </div>

        {/* Tabla de Profesores */}
        <div className="config-table-container">
          {filteredProfesores.length === 0 ? (
            <div className="config-empty-state">
              <FiUsers className="config-empty-icon" />
              <p>No se encontraron profesores</p>
              <p className="config-empty-subtitle">
                {searchTerm ? 'Intenta ajustar los filtros' : 'Comienza agregando un profesor'}
              </p>
            </div>
          ) : (
            <table className="config-table">
              <thead className="config-table-header">
                <tr className="config-table-row">
                  <th className="config-table-cell config-header-cell">Nombre</th>
                  <th className="config-table-cell config-header-cell">Email</th>
                  <th className="config-table-cell config-header-cell">Teléfono</th>
                  <th className="config-table-cell config-header-cell">Especialidad</th>
                  <th className="config-table-cell config-header-cell">Estado</th>
                  <th className="config-table-cell config-header-cell">Acciones</th>
                </tr>
              </thead>
              <tbody className="config-table-body">
                {filteredProfesores.map((profesor) => (
                  <tr key={profesor.id} className="config-table-row">
                    <td className="config-table-cell">
                      <div className="config-profesor-name">
                        <span className="config-name-text">{profesor.nombre} {profesor.apellido}</span>
                      </div>
                    </td>
                    <td className="config-table-cell">
                      <span className="config-email-text">{profesor.email}</span>
                    </td>
                    <td className="config-table-cell">
                      <span className="config-phone-text">{profesor.telefono}</span>
                    </td>
                    <td className="config-table-cell">
                      <span className="config-specialty-badge">{profesor.especialidad}</span>
                    </td>
                    <td className="config-table-cell">
                      <span className={`config-state-badge ${getEstadoClass(profesor.estado)}`}>
                        {profesor.estado}
                      </span>
                    </td>
                    <td className="config-table-cell">
                      <div className="config-actions-container">
                        <button
                          onClick={() => handleEdit(profesor)}
                          className="config-action-button config-edit-button"
                          title="Editar"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(profesor)}
                          className="config-action-button config-delete-button"
                          title="Eliminar"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal para Agregar/Editar Profesor */}
      {isModalOpen && (
        <div className="config-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="config-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="config-modal-header">
              <div className="config-modal-header-content">
                <div className="config-modal-icon">
                  <FiUser />
                </div>
                <div className="config-modal-header-text">
                  <h3 className="config-modal-title">
                    {editingProfesor ? 'Editar Profesor' : 'Agregar Profesor'}
                  </h3>
                  <p className="config-modal-subtitle">
                    {editingProfesor ? 'Modifica los datos del profesor' : 'Completa la información del nuevo profesor'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="config-close-button"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="config-modal-form">
              <div className="config-form-grid">
                <div className="config-form-group">
                  <label className="config-form-label">Nombre</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="config-form-input"
                    required
                  />
                </div>

                <div className="config-form-group">
                  <label className="config-form-label">Apellido</label>
                  <input
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    className="config-form-input"
                    required
                  />
                </div>

                <div className="config-form-group config-form-group-full">
                  <label className="config-form-label">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="config-form-input"
                    required
                  />
                </div>

                <div className="config-form-group">
                  <label className="config-form-label">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="config-form-input"
                    required
                  />
                </div>

                <div className="config-form-group">
                  <label className="config-form-label">Especialidad</label>
                  <input
                    type="text"
                    value={formData.especialidad}
                    onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                    className="config-form-input"
                    required
                  />
                </div>

                <div className="config-form-group config-form-group-full">
                  <label className="config-form-label">Estado</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    className="config-form-select"
                    required
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="config-modal-actions">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="config-cancel-button"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="config-submit-button"
                >
                  {editingProfesor ? 'Actualizar' : 'Agregar'} Profesor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}