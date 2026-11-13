import { useCallback, useEffect, useRef, useState } from 'react';
import { getCatalog } from '../api/courses.api';

const PAGE_SIZE = 6;
const EMPTY_RESULT = { courses: [], page: 0, total: 0, hasMore: false };

/**
 * Lógica del catálogo: filtro por categoría y "Cargar más".
 * status: 'loading' (primera carga) | 'loadingMore' | 'ready' | 'error'
 */
export function useCatalog() {
  const [category, setCategory] = useState('');
  const [result, setResult] = useState(EMPTY_RESULT);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  // Identifica la petición más reciente. Si el usuario cambia rápido de categoría,
  // las respuestas viejas se descartan para no mezclar cursos de otra categoría.
  const lastRequest = useRef(0);

  const fetchPage = useCallback((selectedCategory, page) => {
    const requestId = ++lastRequest.current;
    const isLatest = () => requestId === lastRequest.current;

    getCatalog({ category: selectedCategory, page, limit: PAGE_SIZE })
      .then(({ data, meta }) => {
        if (!isLatest()) return;
        setResult((previous) => ({
          courses: page === 1 ? data : [...previous.courses, ...data],
          page,
          total: meta.total,
          hasMore: meta.hasMore,
        }));
        setStatus('ready');
      })
      .catch((err) => {
        if (!isLatest()) return;
        setError(err.message);
        setStatus('error');
      });
  }, []);

  // Primera carga: todas las categorías
  useEffect(() => {
    fetchPage('', 1);
  }, [fetchPage]);

  const changeCategory = (slug) => {
    if (slug === category && status !== 'error') return;
    setCategory(slug);
    setResult(EMPTY_RESULT);
    setStatus('loading');
    fetchPage(slug, 1);
  };

  const loadMore = () => {
    setStatus('loadingMore');
    fetchPage(category, result.page + 1);
  };

  const retry = () => {
    setStatus('loading');
    fetchPage(category, 1);
  };

  return { ...result, category, status, error, changeCategory, loadMore, retry };
}
