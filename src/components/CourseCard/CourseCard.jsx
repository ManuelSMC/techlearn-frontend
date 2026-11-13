import { BookOpen, Users } from 'lucide-react';
import { formatPrice, LEVEL_LABELS } from '../../utils/format';
import './CourseCard.css';

/**
 * Tarjeta de un curso del catálogo.
 * El botón de inscripción es opcional: solo se muestra si se recibe onEnroll.
 */
export default function CourseCard({ course, onEnroll, isEnrolled = false, isEnrolling = false }) {
  return (
    <article className="course-card">
      <div className="course-card__media">
        {course.imageUrl ? (
          <img className="course-card__image" src={course.imageUrl} alt="" loading="lazy" />
        ) : (
          <BookOpen className="course-card__placeholder" size={48} aria-hidden="true" />
        )}
      </div>

      <div className="course-card__body">
        <div className="course-card__tags">
          <span className="course-card__tag">{course.category.name}</span>
          <span className="course-card__level">{LEVEL_LABELS[course.level]}</span>
        </div>

        <h3 className="course-card__title">{course.title}</h3>
        <p className="course-card__description">{course.description}</p>
        <p className="course-card__instructor">Por {course.instructor.name}</p>
      </div>

      <footer className="course-card__footer">
        <span className={`course-card__price ${course.isFree ? 'course-card__price--free' : ''}`}>
          {formatPrice(course.price)}
        </span>

        <span className="course-card__students" title="Estudiantes inscritos">
          <Users size={16} aria-hidden="true" />
          {course.studentsCount}
        </span>

        {onEnroll && (
          <button
            type="button"
            className="button button--primary button--small course-card__action"
            onClick={() => onEnroll(course)}
            disabled={isEnrolled || isEnrolling}
          >
            {isEnrolled ? 'Inscrito' : isEnrolling ? 'Inscribiendo...' : 'Inscribirme'}
          </button>
        )}
      </footer>
    </article>
  );
}
