import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { getInstructors } from '../../api/instructors.api';
import { getInitials } from '../../utils/format';
import './FeaturedInstructors.css';

/** Los 3 instructores con más cursos publicados. Cada uno enlaza a su perfil. */
export default function FeaturedInstructors() {
  const { data: instructors } = useQuery(getInstructors, { limit: 3 });

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
            <li key={instructor.id}>
              <Link to={`/instructores?id=${instructor.id}`} className="featured-instructors__item">
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
                <span className="featured-instructors__link">Ver perfil</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="featured-instructors__more">
          <Link to="/instructores" className="button button--dark">
            Ver todos los instructores
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
