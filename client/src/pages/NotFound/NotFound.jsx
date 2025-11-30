import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import { FaCloud, FaPlug, FaHome } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      
      <div className="not-found-content">
        <div className="error-code">404</div>
        
        <div className="icon-wrapper">
          <FaCloud className="not-found-icon" />
          <FaPlug className="plug-icon" />
        </div>
        
        <h2 className="not-found-title">¡Oops! Algo se desconectó</h2>
        <p className="not-found-text">
          La página que buscas parece haberse perdido en el ciberespacio, 
          o tal vez nunca existió. No te preocupes, es solo un pequeño cortocircuito.
        </p>
        
        <Link to="/" className="home-button">
          <FaHome className="btn-icon" />
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}