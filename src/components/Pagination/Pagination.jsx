import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Paginación de las tablas de los paneles. */
export default function Pagination({ meta, onChange }) {
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Paginación">
      <button
        type="button"
        className="button button--outline button--small"
        onClick={() => onChange(meta.page - 1)}
        disabled={meta.page <= 1}
      >
        <ChevronLeft size={16} aria-hidden="true" />
        Anterior
      </button>
      <span className="pagination__info">
        Página {meta.page} de {meta.totalPages}
      </span>
      <button
        type="button"
        className="button button--outline button--small"
        onClick={() => onChange(meta.page + 1)}
        disabled={!meta.hasMore}
      >
        Siguiente
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}
