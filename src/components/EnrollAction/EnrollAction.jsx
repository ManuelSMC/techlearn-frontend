import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice } from '../../utils/format';

/** Botón de inscripción del catálogo; cambia según quién está viendo el curso. */
export default function EnrollAction({ course, enrollment }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <button
        type="button"
        className="button button--primary course-detail__action"
        onClick={() => navigate('/login', { state: { from: '/' } })}
      >
        Inicia sesión para inscribirte
      </button>
    );
  }

  if (!enrollment.isStudent) {
    return <p className="course-detail__hint">Las inscripciones están disponibles solo para estudiantes.</p>;
  }

  if (enrollment.enrolledIds.has(course.id)) {
    return (
      <div className="course-detail__enrolled">
        <span className="course-detail__enrolled-label">
          <CheckCircle2 size={18} aria-hidden="true" />
          Ya estás inscrito
        </span>
        <Link to="/mis-cursos" className="button button--outline button--small">
          Ver mis cursos
        </Link>
      </div>
    );
  }

  const isEnrolling = enrollment.pendingId === course.id;
  return (
    <button
      type="button"
      className="button button--primary course-detail__action"
      onClick={() => enrollment.enrollInCourse(course)}
      disabled={isEnrolling}
    >
      {isEnrolling ? 'Inscribiendo...' : course.isFree ? 'Inscribirme gratis' : `Inscribirme por ${formatPrice(course.price)}`}
    </button>
  );
}
