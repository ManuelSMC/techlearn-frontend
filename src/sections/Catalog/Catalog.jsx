import { useCallback, useState } from 'react';
import CourseCard from '../../components/CourseCard/CourseCard';
import CourseDetail from '../../components/CourseDetail/CourseDetail';
import EnrollAction from '../../components/EnrollAction/EnrollAction';
import BottomSheet from '../../components/BottomSheet/BottomSheet';
import { useAuth } from '../../hooks/useAuth';
import { useEnrollment } from '../../hooks/useEnrollment';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import './Catalog.css';

/**
 * Sección llenada con la API: catálogo de cursos publicados.
 * Escritorio: lista a la izquierda y detalle del curso seleccionado a la derecha.
 * Móvil: lista, y el detalle se abre en una hoja deslizable encima.
 * En ambos casos el usuario no pierde su lugar en la lista.
 */
export default function Catalog({ catalog, categories }) {
  const { user } = useAuth();
  const enrollment = useEnrollment(user);
  const isDesktop = useMediaQuery('(min-width: 960px)');
  const [selectedId, setSelectedId] = useState(null);

  const { courses, category, status, error, total, hasMore, changeCategory, loadMore, retry } = catalog;

  // En escritorio siempre hay un curso visible en el panel: si no se ha elegido uno, el primero.
  const selectedCourse =
    courses.find((course) => course.id === selectedId) ?? (isDesktop ? courses[0] : null);

  const closeDetail = useCallback(() => setSelectedId(null), []);

  const filters = [{ slug: '', name: 'Todas' }, ...categories.filter((item) => item.publishedCourses > 0)];

  return (
    <section id="cursos" className="section catalog" aria-labelledby="catalog-title">
      <div className="container">
        <header className="section__header">
          <h2 id="catalog-title" className="section__title">
            Cursos disponibles
          </h2>
          <p className="section__subtitle">Elige una categoría y selecciona un curso para ver su información.</p>
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

        {status === 'loading' && <p className="status">Cargando cursos...</p>}

        {status === 'error' && (
          <div className="status status--error" role="alert">
            <p>{error}</p>
            <button type="button" className="button button--outline button--small catalog__retry" onClick={retry}>
              Reintentar
            </button>
          </div>
        )}

        {status === 'ready' && courses.length === 0 && (
          <p className="status">Aún no hay cursos publicados en esta categoría.</p>
        )}

        {courses.length > 0 && (
          <div className="catalog__layout">
            <div>
              <p className="catalog__count">
                {total} {total === 1 ? 'curso encontrado' : 'cursos encontrados'}
              </p>

              <ul className="catalog__list">
                {courses.map((course) => (
                  <li key={course.id}>
                    <CourseCard
                      course={course}
                      isSelected={selectedCourse?.id === course.id}
                      onSelect={() => setSelectedId(course.id)}
                    />
                  </li>
                ))}
              </ul>

              {hasMore && (
                <div className="catalog__more">
                  <button
                    type="button"
                    className="button button--dark"
                    onClick={loadMore}
                    disabled={status === 'loadingMore'}
                  >
                    {status === 'loadingMore' ? 'Cargando...' : 'Cargar más cursos'}
                  </button>
                  <p className="catalog__count">
                    Mostrando {courses.length} de {total}
                  </p>
                </div>
              )}
            </div>

            {isDesktop && selectedCourse && (
              // key: al cambiar de curso el panel se vuelve a montar y su scroll regresa arriba
              <aside key={selectedCourse.id} className="catalog__detail" aria-label="Detalle del curso">
                <CourseDetail
                  course={selectedCourse}
                  actions={<EnrollAction course={selectedCourse} enrollment={enrollment} />}
                />
              </aside>
            )}
          </div>
        )}
      </div>

      {!isDesktop && (
        <BottomSheet isOpen={Boolean(selectedCourse)} onClose={closeDetail} label="Detalle del curso">
          {selectedCourse && (
            <CourseDetail
              course={selectedCourse}
              actions={<EnrollAction course={selectedCourse} enrollment={enrollment} />}
            />
          )}
        </BottomSheet>
      )}
    </section>
  );
}
