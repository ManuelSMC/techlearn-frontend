import { useEffect, useState } from 'react';

/**
 * Ejecuta una petición al montar el componente y expone su estado.
 * status: 'loading' | 'success' | 'error'
 */
export function useApi(apiCall) {
  const [state, setState] = useState({ data: null, status: 'loading', error: '' });

  useEffect(() => {
    let isActive = true;
    apiCall()
      .then(({ data }) => isActive && setState({ data, status: 'success', error: '' }))
      .catch((error) => isActive && setState({ data: null, status: 'error', error: error.message }));

    // Si el componente se desmonta antes de que responda la API, se ignora la respuesta.
    return () => {
      isActive = false;
    };
  }, [apiCall]);

  return state;
}
