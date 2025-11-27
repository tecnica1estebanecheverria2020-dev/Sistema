import { createContext, useContext, useMemo, useState } from 'react';

// Tipos válidos de carga
const VALID_TYPES = ['none', 'app', 'section'];

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [type, setType] = useState('none'); // 'none' | 'app' | 'section'
  const [active, setActive] = useState(false);
  const [error, setError] = useState(null);

  const safeSetLoading = (nextType, nextActive) => {
    try {
      const t = String(nextType || 'none');
      const a = Boolean(nextActive);
      if (!VALID_TYPES.includes(t)) {
        throw new Error(`Tipo de carga inválido: ${nextType}`);
      }
      setType(t);
      setActive(a);
      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  const startAppLoading = () => safeSetLoading('app', true);
  const stopAppLoading = () => safeSetLoading('app', false);
  const startSectionLoading = () => safeSetLoading('section', true);
  const stopSectionLoading = () => safeSetLoading('section', false);
  const clearLoading = () => safeSetLoading('none', false);

  const clearError = () => setError(null);

  const value = useMemo(() => ({
    type,
    active,
    error,
    setLoading: safeSetLoading,
    startAppLoading,
    stopAppLoading,
    startSectionLoading,
    stopSectionLoading,
    clearLoading,
    setError,
    clearError,
  }), [type, active, error]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoadingContext() {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error('useLoadingContext debe usarse dentro de <LoadingProvider>');
  }
  return ctx;
}

