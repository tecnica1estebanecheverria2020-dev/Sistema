import React, { useState, useEffect } from 'react';
import './style.css';
import { FaBoxOpen, FaBolt, FaRocket, FaCogs, FaNetworkWired } from 'react-icons/fa';

const MESSAGES = [
  "Inicializando sistema...",
  "Cargando recursos...",
  "Sincronizando datos...",
  "Optimizando inventario...",
  "Estableciendo conexiones...",
  "Preparando interfaz...",
  "¡Todo listo!"
];

const ICONS = [FaBoxOpen, FaBolt, FaNetworkWired, FaCogs, FaRocket];

export default function AppLoading() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [iconIndex, setIconIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
      setIconIndex((prev) => (prev + 1) % ICONS.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = ICONS[iconIndex];

  return (
    <div className="app-loading-overlay">
      <div className="loading-bg-animated"></div>
      
      {/* Particles */}
      <div className="particles-container">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`particle p-${i + 1}`}></div>
        ))}
      </div>

      <div className="app-loading-content">
        <div className="loading-icon-wrapper">
          <div className="loading-ring ring-1"></div>
          <div className="loading-ring ring-2"></div>
          <div className="loading-ring ring-3"></div>
          <div className="icon-container">
            <CurrentIcon className="main-icon" />
          </div>
        </div>
        
        <div className="loading-text-wrapper">
          <div key={messageIndex} className="app-loading-title">
            {MESSAGES[messageIndex]}
          </div>
          <div className="loading-dots">
            <span>.</span><span>.</span><span>.</span>
          </div>
        </div>
        
        <div className="loading-bar-container">
          <div className="loading-bar-fill"></div>
        </div>
      </div>
    </div>
  );
}