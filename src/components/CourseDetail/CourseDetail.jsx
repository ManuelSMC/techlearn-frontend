import { BarChart3, BookOpen, Tag, Users } from 'lucide-react';
import { formatPrice, getInitials, LEVEL_LABELS } from '../../utils/format';
import './CourseDetail.css';

/**
 * Información completa de un curso. Se usa en el catálogo (panel derecho o hoja deslizable),
 * en "Mis cursos" y en los paneles. Los botones de acción se reciben en "actions"
 * porque cambian según la pantalla. Con onInstructorClick aparece "Ver perfil".
 */
export default function CourseDetail({ course, actions, onInstructorClick }) {
  return (
    <article className="course-detail" aria-labelledby={`course-${course.id}-title`}>
      <div className="course-detail__media">
        {course.imageUrl ? (
          <img className="course-detail__image" src={course.imageUrl} alt="" />
        ) : (
          <BookOpen className="course-detail__placeholder" size={56} aria-hidden="true" />
        )}
      </div>

      <div className="course-detail__body">
        <div className="course-detail__tags">
          <span className="chip">{course.category.name}</span>
          <span className="chip chip--muted">{LEVEL_LABELS[course.level]}</span>
        </div>

        <h2 id={`course-${course.id}-title`} className="course-detail__title">
          {course.title}
        </h2>

        <div className="course-detail__instructor">
          <div className="course-detail__avatar">
            {course.instructor.photoUrl ? (
              <img src={course.instructor.photoUrl} alt="" />
            ) : (
              <span aria-hidden="true">{getInitials(course.instructor.name)}</span>
            )}
          </div>
          <div>
            <p className="course-detail__label">Instructor</p>
            <p className="course-detail__instructor-name">{course.instructor.name}</p>
          </div>
          {onInstructorClick && (
            <button
              type="button"
              className="button button--outline button--small course-detail__profile"
              onClick={() => onInstructorClick(course.instructor)}
            >
              Ver perfil
            </button>
          )}
        </div>

        <ul className="course-detail__stats">
          <li className="course-detail__stat">
            <Tag size={18} aria-hidden="true" />
            <span>
              <span className="course-detail__label">Precio</span>
              <strong>{formatPrice(course.price)}</strong>
            </span>
          </li>
          <li className="course-detail__stat">
            <BarChart3 size={18} aria-hidden="true" />
            <span>
              <span className="course-detail__label">Nivel</span>
              <strong>{LEVEL_LABELS[course.level]}</strong>
            </span>
          </li>
          <li className="course-detail__stat">
            <Users size={18} aria-hidden="true" />
            <span>
              <span className="course-detail__label">Estudiantes</span>
              <strong>{course.studentsCount}</strong>
            </span>
          </li>
        </ul>

        {actions && <div className="course-detail__actions">{actions}</div>}

        <section className="course-detail__section">
          <h3 className="course-detail__subtitle">Acerca de este curso</h3>
          <p className="course-detail__description">{course.description}</p>
        </section>
      </div>
    </article>
  );
}
