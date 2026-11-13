import { useCallback, useState } from 'react';
import { ArrowLeft, BookOpen, Users } from 'lucide-react';
import CourseCard from '../CourseCard/CourseCard';
import CourseDetail from '../CourseDetail/CourseDetail';
import EnrollAction from '../EnrollAction/EnrollAction';
import { useQuery } from '../../hooks/useQuery';
import { useAuth } from '../../hooks/useAuth';
import { useEnrollment } from '../../hooks/useEnrollment';
import { getInstructor } from '../../api/instructors.api';
import { getCatalog } from '../../api/courses.api';
import { getInitials } from '../../utils/format';
import './InstructorProfileView.css';

/**
 * Perfil público de un instructor con sus cursos publicados.
 * Al elegir un curso, su detalle se muestra en el mismo panel con un botón para regresar.
 */
export default function InstructorProfileView({ instructorId }) {
  const { user } = useAuth();
  const enrollment = useEnrollment(user);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchInstructor = useCallback(() => getInstructor(instructorId), [instructorId]);
  const { data: instructor, error } = useQuery(fetchInstructor);
  const { data: courses } = useQuery(getCatalog, { instructor: instructorId, limit: 50 });

  if (error) return <p className="status status--error">{error}</p>;
  if (!instructor) return <p className="status">Cargando perfil...</p>;

  if (selectedCourse) {
    return (
      <div className="instructor-profile">
        <button type="button" className="instructor-profile__back" onClick={() => setSelectedCourse(null)}>
          <ArrowLeft size={18} aria-hidden="true" />
          Volver al perfil de {instructor.name}
        </button>
        <CourseDetail
          course={selectedCourse}
          actions={<EnrollAction course={selectedCourse} enrollment={enrollment} />}
        />
      </div>
    );
  }

  return (
    <article className="instructor-profile" aria-labelledby={`instructor-${instructor.id}-name`}>
      <header className="instructor-profile__header">
        <div className="instructor-profile__photo">
          {instructor.photoUrl ? (
            <img src={instructor.photoUrl} alt={`Foto de ${instructor.name}`} />
          ) : (
            <span aria-hidden="true">{getInitials(instructor.name)}</span>
          )}
        </div>
        <div>
          <h2 id={`instructor-${instructor.id}-name`} className="instructor-profile__name">
            {instructor.name}
          </h2>
          {instructor.specialty && <p className="instructor-profile__specialty">{instructor.specialty}</p>}
        </div>
      </header>

      <div className="instructor-profile__body">
        <ul className="instructor-profile__stats">
          <li>
            <BookOpen size={18} aria-hidden="true" />
            <strong>{instructor.publishedCourses}</strong> {instructor.publishedCourses === 1 ? 'curso' : 'cursos'}
          </li>
          <li>
            <Users size={18} aria-hidden="true" />
            <strong>{instructor.students}</strong> {instructor.students === 1 ? 'estudiante' : 'estudiantes'}
          </li>
        </ul>

        <section>
          <h3 className="instructor-profile__subtitle">Acerca de</h3>
          <p className="instructor-profile__bio">{instructor.bio || 'Este instructor aún no ha escrito su biografía.'}</p>
        </section>

        <section>
          <h3 className="instructor-profile__subtitle">Cursos de {instructor.name.split(' ')[0]}</h3>
          {!courses && <p className="status">Cargando cursos...</p>}
          {courses?.length === 0 && <p className="instructor-profile__bio">Todavía no tiene cursos publicados.</p>}
          {courses?.length > 0 && (
            <ul className="instructor-profile__courses">
              {courses.map((course) => (
                <li key={course.id}>
                  <CourseCard course={course} onSelect={() => setSelectedCourse(course)} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </article>
  );
}
