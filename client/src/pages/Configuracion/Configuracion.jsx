import React, { useState, useEffect } from 'react';
import { FiSettings, FiPlus, FiEdit2, FiTrash2, FiUser, FiX, FiUsers } from 'react-icons/fi';
import './style.css';

export default function Configuracion() {
  return (
    <div className="config-container">
      {/* Header */}
      <div className="config-header">
        <div className="header-content">
          <h1 className="config-title">Configuración</h1>
          <p className="config-subtitle">Gestiona las opciones del sistema</p>
        </div>
      </div>
    </div>
  );
}