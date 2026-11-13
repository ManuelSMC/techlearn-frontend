import { useCallback, useEffect, useState } from 'react';

/**
 * Consulta a la API con estado de carga, error y recarga.
 * - Se vuelve a ejecutar cuando cambian los parámetros.
 * - reload() repite la consulta (por ejemplo, después de crear o editar algo).
 * - Mientras recarga, conserva los datos anteriores para que la pantalla no parpadee.
 */
export function useQuery(apiCall, params) {
  const paramsKey = JSON.stringify(params ?? null);
  const [version, setVersion] = useState(0);
  const requestKey = `${paramsKey}#${version}`;
  const [result, setResult] = useState({ key: null, data: null, meta: null, error: '' });

  useEffect(() => {
    let isActive = true;
    const currentParams = JSON.parse(paramsKey);
    apiCall(currentParams ?? undefined)
      .then(({ data, meta }) => isActive && setResult({ key: requestKey, data, meta, error: '' }))
      .catch((err) => isActive && setResult((prev) => ({ ...prev, key: requestKey, error: err.message })));

    // Si cambian los parámetros antes de que responda la API, se ignora la respuesta vieja.
    return () => {
      isActive = false;
    };
  }, [apiCall, paramsKey, requestKey]);

  const reload = useCallback(() => setVersion((value) => value + 1), []);

  return {
    data: result.data,
    meta: result.meta,
    error: result.error,
    isLoading: result.key !== requestKey,
    reload,
  };
}
