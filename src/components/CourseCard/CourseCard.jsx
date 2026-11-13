import { BookOpen, Users } from 'lucide-react';
import { formatPrice, LEVEL_LABELS } from '../../utils/format';
import './CourseCard.css';

/** Tarjeta compacta de la lista del catálogo. Al seleccionarla se muestra su detalle. */
export default function CourseCard({ course, isSelected = false, onSelect }) {
  return (
    <article className={`course-card ${isSelected ? 'course-card--selected' : ''}`}>
      <div className="course-card__media">
        {course.imageUrl ? (
          <img className="course-card__image" src={course.imageUrl} alt="" loading="lazy" />
        ) : (
          <BookOpen className="course-card__placeholder" size={28} aria-hidden="true" />
        )}
      </div>

      <div className="course-card__body">
        <div className="course-card__tags">
          <span className="chip">{course.category.name}</span>
          <span className="chip chip--muted">{LEVEL_LABELS[course.level]}</span>
        </div>

        <h3 className="course-card__title">
          {/* El botón cubre toda la tarjeta (ver ::after en el CSS) */}
          <button
            type="button"
            className="course-card__select"
            onClick={() => onSelect(course)}
            aria-pressed={isSelected}
          >
            {course.title}
          </button>
        </h3>
        <p className="course-card__instructor">{course.instructor.name}</p>

        <div className="course-card__footer">
          <span className={`course-card__price ${course.isFree ? 'course-card__price--free' : ''}`}>
            {formatPrice(course.price)}
          </span>
          <span className="course-card__students" title="Estudiantes inscritos">
            <Users size={14} aria-hidden="true" />
            {course.studentsCount}
          </span>
        </div>
      </div>
    </article>
  );
}
