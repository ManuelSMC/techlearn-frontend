import { useNavigate } from 'react-router-dom';
import CourseCard from '../../components/CourseCard/CourseCard';
import { useAuth } from '../../hooks/useAuth';
import { useEnrollment } from '../../hooks/useEnrollment';
import './Catalog.css';

/**
 * Sección llenada con la API: catálogo de cursos publicados,
 * con filtro por categoría y botón "Cargar más".
 */
export default function Catalog({ catalog, categories }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const enrollment = useEnrollment(user);

  const { courses, category, status, error, total, hasMore, changeCategory, loadMore, retry } = catalog;

  // Visitantes: el botón los lleva al login. Admin e instructor no se inscriben.
  const canSeeEnrollButton = !user || enrollment.isStudent;
  const handleEnroll = (course) => {
    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }
    enrollment.enrollInCourse(course);
  };

  const filters = [{ slug: '', name: 'Todas' }, ...categories.filter((item) => item.publishedCourses > 0)];

  return (
    <section id="cursos" className="section catalog" aria-labelledby="catalog-title">
      <div className="container">
        <header className="section__header">
          <h2 id="catalog-title" className="section__title">
            Cursos disponibles
          </h2>
          <p className="section__subtitle">Elige una categoría y encuentra tu próximo curso.</p>
        </header>

        <div className="catalog__filters" role="group" aria-label="Filtrar por categoría">
          {filters.map((item) => (
            <button
              key={item.slug}
              type="button"
              className={`catalog__filter ${category === item.slug ? 'catalog__filter--active' : ''}`}
              aria-pressed={category === item.slug}
              onClick={() => changeCategory(item.slug)}
            >
              {item.name}
            </button>
          ))}
        </div>

        {enrollment.notice && (
          <p className={`catalog__notice catalog__notice--${enrollment.notice.type}`} role="status">
            {enrollment.notice.text}
            <button type="button" className="catalog__notice-close" onClick={enrollment.clearNotice} aria-label="Cerrar">
              ×
            </button>
          </p>
        )}

        {status === 'loading' && <p className="status">Cargando cursos...</p>}

        {status === 'error' && (
          <div className="status status--error" role="alert">
            <p>{error}</p>
            <button type="button" className="button button--outline button--small catalog__retry" onClick={retry}>
              Reintentar
            </button>
          </div>
        )}

        {status !== 'loading' && status !== 'error' && courses.length === 0 && (
          <p className="status">Aún no hay cursos publicados en esta categoría.</p>
        )}

        {courses.length > 0 && (
          <>
            <ul className="catalog__grid">
              {courses.map((course) => (
                <li key={course.id}>
                  <CourseCard
                    course={course}
                    onEnroll={canSeeEnrollButton ? handleEnroll : undefined}
                    isEnrolled={enrollment.enrolledIds.has(course.id)}
                    isEnrolling={enrollment.pendingId === course.id}
                  />
                </li>
              ))}
            </ul>

            <div className="catalog__more">
              <p className="catalog__count">
                Mostrando {courses.length} de {total} cursos
              </p>
              {hasMore && (
                <button
                  type="button"
                  className="button button--primary"
                  onClick={loadMore}
                  disabled={status === 'loadingMore'}
                >
                  {status === 'loadingMore' ? 'Cargando...' : 'Cargar más'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
