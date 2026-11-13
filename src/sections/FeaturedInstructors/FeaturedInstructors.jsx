import { useQuery } from '../../hooks/useQuery';
import { getInstructors } from '../../api/instructors.api';
import { getInitials } from '../../utils/format';
import './FeaturedInstructors.css';

/** Instructores con más cursos publicados (la API devuelve los 3 principales). */
export default function FeaturedInstructors() {
  const { data: instructors } = useQuery(getInstructors);

  if (!instructors || instructors.length === 0) return null;

  return (
    <section id="instructores" className="section featured-instructors" aria-labelledby="instructors-title">
      <div className="container">
        <header className="section__header">
          <h2 id="instructors-title" className="section__title">
            Instructores destacados
          </h2>
        </header>

        <ul className="featured-instructors__list">
          {instructors.map((instructor) => (
            <li key={instructor.id} className="featured-instructors__item">
              <div className="featured-instructors__photo">
                {instructor.photoUrl ? (
                  <img src={instructor.photoUrl} alt={`Foto de ${instructor.name}`} loading="lazy" />
                ) : (
                  <span aria-hidden="true">{getInitials(instructor.name)}</span>
                )}
              </div>
              <h3 className="featured-instructors__name">{instructor.name}</h3>
              {instructor.specialty && <p className="featured-instructors__specialty">{instructor.specialty}</p>}
              <p className="featured-instructors__courses">
                {instructor.publishedCourses} {instructor.publishedCourses === 1 ? 'curso' : 'cursos'}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
