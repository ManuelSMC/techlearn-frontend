import { useSearchParams } from 'react-router-dom';

/**
 * Pestaña activa guardada en la URL (?tab=...), así al recargar
 * o compartir el enlace se abre la misma sección.
 */
export function useTab(defaultTab) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') ?? defaultTab;

  const setTab = (nextTab, extraParams = {}) => setSearchParams({ tab: nextTab, ...extraParams });

  return [tab, setTab, searchParams];
}
