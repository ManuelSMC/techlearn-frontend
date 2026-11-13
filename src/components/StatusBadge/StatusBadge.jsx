import './StatusBadge.css';

const COURSE_STATUS = {
  draft: { label: 'Borrador', tone: 'warning' },
  published: { label: 'Publicado', tone: 'success' },
  hidden: { label: 'Oculto', tone: 'muted' },
};

/** Etiqueta de estado de un curso; si está dado de baja, eso tiene prioridad. */
export function CourseStatusBadge({ course }) {
  if (!course.isActive) return <span className="status-badge status-badge--danger">Dado de baja</span>;
  const { label, tone } = COURSE_STATUS[course.status];
  return <span className={`status-badge status-badge--${tone}`}>{label}</span>;
}

/** Etiqueta activo / inactivo para usuarios y categorías. */
export function ActiveBadge({ isActive, activeLabel = 'Activo', inactiveLabel = 'Inactivo' }) {
  return (
    <span className={`status-badge status-badge--${isActive ? 'success' : 'danger'}`}>
      {isActive ? activeLabel : inactiveLabel}
    </span>
  );
}
