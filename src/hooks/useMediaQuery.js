import { useSyncExternalStore } from 'react';

/**
 * Indica si la pantalla cumple una media query, y se actualiza al redimensionar.
 * Ejemplo: useMediaQuery('(min-width: 960px)') -> true en escritorio.
 */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches
  );
}
