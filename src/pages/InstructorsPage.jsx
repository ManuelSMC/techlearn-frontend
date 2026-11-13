import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Users } from 'lucide-react';
import { getInstructors } from '../api/instructors.api';
import InstructorProfileView from '../components/InstructorProfile/InstructorProfileView';
import BottomSheet from '../components/BottomSheet/BottomSheet';
import SearchBox from '../components/SearchBox/SearchBox';
import Pagination from '../components/Pagination/Pagination';
import { useQuery } from '../hooks/useQuery';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { getInitials } from '../utils/format';
import './InstructorsPage.css';

/**
 * Directorio de instructores: buscador y lista a la izquierda, perfil a la derecha
 * (en móvil el perfil se abre en una hoja deslizable).
 * El instructor elegido se guarda en la URL (?id=), así los "destacados" del inicio
 * pueden enlazar directo a su perfil.
 */
export default function InstructorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({ search: '', page: 1 });
  const { data: instructors, meta, error, isLoading } = useQuery(getInstructors, { ...filters, limit: 12 });
  const isDesktop = useMediaQuery('(min-width: 960px)');

  const urlId = Number(searchParams.get('id')) || null;
  // En escritorio siempre se muestra un perfil: el elegido o el primero de la lista.
  const selectedId = urlId ?? (isDesktop ? instructors?.[0]?.id : null);

  const selectInstructor = (id) => setSearchParams({ id: String(id) }, { replace: true });
  const closeProfile = useCallback(() => setSearchParams({}, { replace: true }), [setSearchParams]);

  return (
    <main>
      <header className="page-header">
        <div className="container">
          <h1 className="page-header__title">Instructores</h1>
          <p className="page-header__text">Conoce a quienes imparten los cursos y explora lo que enseñan.</p>
        </div>
      </header>

      <div className="container page-content">
        <div className="instructors">
          <div>
            <div className="instructors__search">
              <SearchBox
                placeholder="Buscar por nombre o especialidad"
                onSearch={(search) => setFilters({ search, page: 1 })}
              />
            </div>

            {isLoading && !instructors && <p className="status">Cargando instructores...</p>}
            {error && <p className="status status--error">{error}</p>}
            {instructors?.length === 0 && <p className="status">No encontramos instructores con esa búsqueda.</p>}

            {instructors?.length > 0 && (
              <>
                <p className="instructors__count">
                  {meta.total} {meta.total === 1 ? 'instructor' : 'instructores'}
                </p>
                <ul className="instructors__list">
                  {instructors.map((instructor) => (
                    <li key={instructor.id}>
                      <button
                        type="button"
                        className={`instructor-card ${selectedId === instructor.id ? 'instructor-card--selected' : ''}`}
                        aria-pressed={selectedId === instructor.id}
                        onClick={() => selectInstructor(instructor.id)}
                      >
                        <span className="instructor-card__photo">
                          {instructor.photoUrl ? (
                            <img src={instructor.photoUrl} alt="" loading="lazy" />
                          ) : (
                            getInitials(instructor.name)
                          )}
                        </span>
                        <span className="instructor-card__info">
                          <span className="instructor-card__name">{instructor.name}</span>
                          {instructor.specialty && (
                            <span className="instructor-card__specialty">{instructor.specialty}</span>
                          )}
                          <span className="instructor-card__meta">
                            <BookOpen size={14} aria-hidden="true" /> {instructor.publishedCourses}
                            <Users size={14} aria-hidden="true" /> {instructor.students}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="instructors__pagination">
                  <Pagination meta={meta} onChange={(page) => setFilters((current) => ({ ...current, page }))} />
                </div>
              </>
            )}
          </div>

          {isDesktop && selectedId && (
            <aside className="instructors__detail" aria-label="Perfil del instructor">
              <InstructorProfileView key={selectedId} instructorId={selectedId} />
            </aside>
          )}
        </div>
      </div>

      {!isDesktop && (
        <BottomSheet isOpen={Boolean(selectedId)} onClose={closeProfile} label="Perfil del instructor">
          {selectedId && <InstructorProfileView key={selectedId} instructorId={selectedId} />}
        </BottomSheet>
      )}
    </main>
  );
}
