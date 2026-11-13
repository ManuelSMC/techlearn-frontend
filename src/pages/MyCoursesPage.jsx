import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { cancelEnrollment, enroll, getMyEnrollments } from '../api/enrollments.api';
import DetailDialog from '../components/DetailDialog/DetailDialog';
import CourseDetailLoader from '../components/DetailDialog/CourseDetailLoader';
import { useQuery } from '../hooks/useQuery';
import { useToast } from '../hooks/useToast';
import { useConfirm } from '../hooks/useConfirm';
import { formatPrice, LEVEL_LABELS } from '../utils/format';
import './MyCoursesPage.css';

const dateFormatter = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' });

export default function MyCoursesPage() {
  const { data: enrollments, error, isLoading, reload } = useQuery(getMyEnrollments);
  const toast = useToast();
  const confirm = useConfirm();
  const [pendingId, setPendingId] = useState(null);
  const [detailItem, setDetailItem] = useState(null);

  const closeDetail = useCallback(() => setDetailItem(null), []);

  const handleCancel = async (item) => {
    const confirmed = await confirm({
      title: 'Cancelar inscripción',
      message: `¿Seguro que quieres cancelar tu inscripción a "${item.course.title}"? Podrás volver a inscribirte cuando quieras.`,
      confirmLabel: 'Sí, cancelar',
      cancelLabel: 'No, mantener',
      tone: 'danger',
    });
    if (!confirmed) return;

    setPendingId(item.id);
    try {
      await cancelEnrollment(item.id);
      toast.success(`Cancelaste tu inscripción a "${item.course.title}".`);
      setDetailItem(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPendingId(null);
    }
  };

  // Al reinscribirse, la API reactiva la misma inscripción (no crea otra).
  const handleReenroll = async (item) => {
    setPendingId(item.id);
    try {
      await enroll(item.course.id);
      toast.success(`Te inscribiste de nuevo a "${item.course.title}".`);
      setDetailItem(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPendingId(null);
    }
  };

  const renderActionButton = (item) =>
    item.status === 'cancelled' ? (
      <button
        type="button"
        className="button button--primary button--small"
        onClick={() => handleReenroll(item)}
        disabled={pendingId === item.id}
      >
        Volver a inscribirme
      </button>
    ) : (
      <button
        type="button"
        className="button button--outline button--small"
        onClick={() => handleCancel(item)}
        disabled={pendingId === item.id}
      >
        Cancelar inscripción
      </button>
    );

  const list = enrollments ?? [];
  const active = list.filter((item) => item.status === 'active');
  const cancelled = list.filter((item) => item.status === 'cancelled');

  const renderItem = (item) => {
    const { course } = item;
    return (
      <li key={item.id} className={`enrollment ${item.status === 'cancelled' ? 'enrollment--cancelled' : ''}`}>
        <div className="enrollment__media">
          {course.imageUrl ? <img src={course.imageUrl} alt="" loading="lazy" /> : <BookOpen size={28} aria-hidden="true" />}
        </div>
        <div className="enrollment__body">
          <div className="enrollment__tags">
            <span className="chip">{course.categoryName}</span>
            <span className="chip chip--muted">{LEVEL_LABELS[course.level]}</span>
          </div>
          <h3 className="enrollment__title">{course.title}</h3>
          <p className="enrollment__meta">
            {course.instructorName} · {formatPrice(course.price)} · Inscrito el{' '}
            {dateFormatter.format(new Date(item.enrolledAt))}
          </p>
        </div>
        <div className="enrollment__actions">
          <button type="button" className="button button--ghost button--small" onClick={() => setDetailItem(item)}>
            Ver detalle
          </button>
          {renderActionButton(item)}
        </div>
      </li>
    );
  };

  return (
    <main>
      <header className="page-header">
        <div className="container">
          <h1 className="page-header__title">Mis cursos</h1>
          <p className="page-header__text">Consulta y administra los cursos en los que estás inscrito.</p>
        </div>
      </header>

      <div className="container page-content">
        {isLoading && !enrollments && <p className="status">Cargando tus cursos...</p>}
        {error && <p className="status status--error">{error}</p>}

        {enrollments && list.length === 0 && (
          <div className="empty-state">
            <BookOpen size={40} aria-hidden="true" />
            <p>Todavía no te has inscrito a ningún curso.</p>
            <Link to="/#cursos" className="button button--primary">
              Explorar cursos
            </Link>
          </div>
        )}

        {active.length > 0 && (
          <section aria-labelledby="active-title">
            <h2 id="active-title" className="my-courses__subtitle">
              Activos ({active.length})
            </h2>
            <ul className="my-courses__list">{active.map(renderItem)}</ul>
          </section>
        )}

        {cancelled.length > 0 && (
          <section aria-labelledby="cancelled-title">
            <h2 id="cancelled-title" className="my-courses__subtitle">
              Cancelados ({cancelled.length})
            </h2>
            <ul className="my-courses__list">{cancelled.map(renderItem)}</ul>
          </section>
        )}
      </div>

      <DetailDialog isOpen={Boolean(detailItem)} onClose={closeDetail} label="Detalle del curso">
        {detailItem && (
          <CourseDetailLoader courseId={detailItem.course.id} actions={renderActionButton(detailItem)} />
        )}
      </DetailDialog>
    </main>
  );
}
