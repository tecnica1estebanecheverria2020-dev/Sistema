import { useMemo } from 'react';
import { useLoadingContext } from '../contexts/LoadingContext.jsx';
import AppLoading from '../components/AppLoading/AppLoading.jsx';

export default function useGlobalLoading() {
  const ctx = useLoadingContext();
  const { type, active, error } = ctx;

  // Derivados
  const isLoading = Boolean(active);
  const isAppLoading = isLoading && type === 'app';
  const isSectionLoading = isLoading && type === 'section';

  // Decide el componente de carga adecuado - solo AppLoading
  const LoadingComponent = useMemo(() => {
    if (!isLoading) return null;
    if (isAppLoading) return AppLoading;
    // No mostrar SectionLoading
    return null;
  }, [isLoading, isAppLoading]);

  const renderLoading = () => {
    if (!LoadingComponent) return null;
    const Comp = LoadingComponent;
    return <Comp />;
  };

  return {
    // estado
    type,
    active,
    isLoading,
    isAppLoading,
    isSectionLoading,
    error,
    // acciones
    setLoading: ctx.setLoading,
    startAppLoading: ctx.startAppLoading,
    stopAppLoading: ctx.stopAppLoading,
    startSectionLoading: ctx.startSectionLoading,
    stopSectionLoading: ctx.stopSectionLoading,
    clearLoading: ctx.clearLoading,
    setError: ctx.setError,
    clearError: ctx.clearError,
    // render dinámico
    LoadingComponent,
    renderLoading,
  };
}

