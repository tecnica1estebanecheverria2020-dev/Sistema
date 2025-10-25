import { useState } from 'react';
import './style.css';
import useUser from '../../shared/hooks/useUser.js';
import axios from '../../shared/api/axios';

export default function Auth() {
  const { handleLogin } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

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

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <h1>Iniciar sesión</h1>

        {serverError && <div className="error-banner">{serverError}</div>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className="field-error">{errors.email}</p>}

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          placeholder="••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!errors.password}
        />
        {errors.password && <p className="field-error">{errors.password}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}