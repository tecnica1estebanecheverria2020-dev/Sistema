import { useState } from 'react';
import './style.css';
import useAuth from '../../shared/hooks/useAuth.js';
import axios from '../../shared/api/axios';
import { 
  FaBox, 
  FaUser, 
  FaLock, 
  FaBoxes, 
  FaHandHoldingHeart, 
  FaClock, 
  FaBullhorn,
  FaPlay,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

export default function Auth() {
  const { handleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Ingrese un email válido';
      }
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const { data } = await axios.post('/auth/login', { email, password });
      if (data?.success && data?.user) {
        handleLogin(data.user);
      } else {
        setServerError(data?.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Credenciales inválidas o error del servidor';
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setSubmitting(true);
    setServerError('');
    try {
      // Llamar al endpoint demo del backend para obtener un token real
      const { data } = await axios.post('/auth/demo');
      handleLogin(data.user);
    } catch (err) {
      setServerError('Error al iniciar sesión demo');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        {/* Sección izquierda - Formulario */}
        <div className="auth-form-section">
          <form className="auth-form" onSubmit={onSubmit} noValidate>
            <h2>Iniciar Sesión</h2>
            <p className="form-subtitle">Accede a tu cuenta TecniStock</p>

            {serverError && <div className="error-banner">{serverError}</div>}

            <div className="input-group">
              <label htmlFor="email">
                <FaUser className="input-icon" />
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="password">
                <FaLock className="input-icon" />
                Contraseña
              </label>
              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!errors.password}
                  className={errors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="field-error">{errors.password}</p>}
            </div>

            <button type="submit" className="login-button" disabled={submitting}>
              {submitting ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        {/* Sección derecha - Información */}
        <div className="auth-info">
          <div className="logo-section">
            <div className="logo">
              <FaBox className="logo-icon" />
              <h1>TecniStock</h1>
            </div>
            <p className="tagline">Sistema integral de gestión empresarial</p>
          </div>

          <div className="features-container">
            <div className="features-row">
              <div className="feature">
                <FaBoxes className="feature-icon" />
                <div className="feature-content">
                  <h3>Gestión de Inventarios</h3>
                  <p>Control completo de stock y productos</p>
                </div>
              </div>
              <div className="feature">
                <FaHandHoldingHeart className="feature-icon" />
                <div className="feature-content">
                  <h3>Control de Préstamos</h3>
                  <p>Seguimiento detallado de préstamos</p>
                </div>
              </div>
            </div>
            
            <div className="features-row">
              <div className="feature">
                <FaClock className="feature-icon" />
                <div className="feature-content">
                  <h3>Gestión de Horarios</h3>
                  <p>Administración optimizada de tiempos</p>
                </div>
              </div>
              <div className="feature">
                <FaBullhorn className="feature-icon" />
                <div className="feature-content">
                  <h3>Sistema de Comunicados</h3>
                  <p>Comunicación efectiva en tiempo real</p>
                </div>
              </div>
            </div>
          </div>

          <div className="demo-section">
            <button 
              type="button" 
              className="demo-button"
              onClick={handleDemoLogin}
              disabled={submitting}
            >
              <FaPlay className="demo-icon" />
              Prueba Demo
            </button>
            <p className="demo-text">Explora todas las funcionalidades sin registro</p>
          </div>
        </div>
      </div>
    </div>
  );
}