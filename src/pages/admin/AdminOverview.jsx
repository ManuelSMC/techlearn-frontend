import { BookOpen, CheckCircle2, Clock, FolderTree, GraduationCap, UserCheck, Users } from 'lucide-react';
import { getStats } from '../../api/admin.api';
import { useQuery } from '../../hooks/useQuery';

/** Resumen del administrador con los números principales de la plataforma. */
export default function AdminOverview({ onReviewPending }) {
  const { data: stats, error } = useQuery(getStats);

  if (error) return <p className="status status--error">{error}</p>;
  if (!stats) return <p className="status">Cargando estadísticas...</p>;

  const { totals, coursesByCategory, topCourses } = stats;
  const cards = [
    { icon: Users, label: 'Estudiantes', value: totals.students },
    { icon: GraduationCap, label: 'Instructores', value: totals.instructors },
    { icon: BookOpen, label: 'Cursos', value: totals.courses },
    { icon: CheckCircle2, label: 'Publicados', value: totals.publishedCourses },
    { icon: UserCheck, label: 'Inscripciones activas', value: totals.activeEnrollments },
    { icon: FolderTree, label: 'Categorías', value: totals.categories },
  ];
  const maxCourses = Math.max(1, ...coursesByCategory.map((row) => row.courses));

  return (
    <>
      {totals.pendingReview > 0 && (
        <div className="callout" role="status">
          <span className="callout__text">
            <Clock size={18} aria-hidden="true" />
            {totals.pendingReview} {totals.pendingReview === 1 ? 'curso espera' : 'cursos esperan'} revisión para publicarse.
          </span>
          <button type="button" className="button button--dark button--small" onClick={onReviewPending}>
            Revisar cursos
          </button>
        </div>
      )}

      <ul className="stats">
        {cards.map(({ icon: Icon, label, value }) => (
          <li key={label} className="stats__card">
            <Icon className="stats__icon" size={22} aria-hidden="true" />
            <div>
              <p className="stats__value">{value}</p>
              <p className="stats__label">{label}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="dashboard-grid">
        <section className="panel" aria-labelledby="by-category-title">
          <header className="panel__header">
            <h2 id="by-category-title" className="panel__title">
              Cursos publicados por categoría
            </h2>
          </header>
          <ul className="bars panel__body">
            {coursesByCategory.map((row) => (
              <li key={row.category} className="bars__row">
                <span className="bars__label">{row.category}</span>
                <span className="bars__track" aria-hidden="true">
                  <span className="bars__fill" style={{ display: 'block', width: `${(row.courses / maxCourses) * 100}%` }} />
                </span>
                <span className="bars__value">{row.courses}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel" aria-labelledby="top-courses-title">
          <header className="panel__header">
            <h2 id="top-courses-title" className="panel__title">
              Cursos más populares
            </h2>
          </header>
          <div className="panel__body">
            {topCourses.length === 0 ? (
              <p className="status">Todavía no hay inscripciones.</p>
            ) : (
              <ol className="rank">
                {topCourses.map((course) => (
                  <li key={course.id} className="rank__item">
                    <span className="rank__title">{course.title}</span>
                    <span className="rank__value">
                      {course.students} {course.students === 1 ? 'estudiante' : 'estudiantes'}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
