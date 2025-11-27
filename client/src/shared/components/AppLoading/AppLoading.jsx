import './style.css';

export default function AppLoading() {
  return (
    <div className="app-loading-overlay">
      <div className="app-loading-spinner"></div>
      <div className="app-loading-text">Cargando aplicación...</div>
    </div>
  )
}