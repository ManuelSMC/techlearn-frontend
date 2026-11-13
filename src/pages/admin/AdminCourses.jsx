import { useCallback, useState } from 'react';
import { Eye, RotateCcw, Trash2, Users } from 'lucide-react';
import { deleteCourse, getAllCourses, restoreCourse, setCourseStatus } from '../../api/courses.api';
import StudentsModal from '../../components/StudentsList/StudentsModal';
import DetailDialog from '../../components/DetailDialog/DetailDialog';
import CourseDetailLoader from '../../components/DetailDialog/CourseDetailLoader';
import SearchBox from '../../components/SearchBox/SearchBox';
import Pagination from '../../components/Pagination/Pagination';
import { CourseStatusBadge } from '../../components/StatusBadge/StatusBadge';
import { useQuery } from '../../hooks/useQuery';
import { useToast } from '../../hooks/useToast';
import { useConfirm } from '../../hooks/useConfirm';
import { formatPrice } from '../../utils/format';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Borrador' },
  { value: 'published', label: 'Publicado' },
  { value: 'hidden', label: 'Oculto' },
];

/** Moderación de cursos: publicar, ocultar, dar de baja y reactivar. */
export default function AdminCourses({ initialStatus = '' }) {
  const [filters, setFilters] = useState({ status: initialStatus, search: '', includeInactive: false, page: 1 });
  const { data: courses, meta, error, isLoading, reload } = useQuery(getAllCourses, { ...filters, limit: 10 });
  const toast = useToast();
  const confirm = useConfirm();

  const [dialog, setDialog] = useState(null);
  const closeDialog = useCallback(() => setDialog(null), []);

  // Al cambiar un filtro se regresa a la primera página.
  const updateFilter = (changes) => setFilters((current) => ({ ...current, ...changes, page: 1 }));

  const handleStatusChange = async (course, status) => {
    try {
      await setCourseStatus(course.id, status);
      const label = STATUS_OPTIONS.find((option) => option.value === status).label.toLowerCase();
      toast.success(`"${course.title}" ahora está ${label}.`);
      setDialog(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (course) => {
    const confirmed = await confirm({
      title: 'Dar de baja el curso',
      message:
        `"${course.title}" dejará de mostrarse en el catálogo. Podrás reactivarlo después.` +
        (course.studentsCount > 0
          ? ` Tiene ${course.studentsCount} ${course.studentsCount === 1 ? 'estudiante inscrito' : 'estudiantes inscritos'}: conservarán su inscripción en el historial, pero ya no podrán ver el contenido.`
          : ''),
      confirmLabel: 'Dar de baja',
      tone: 'danger',
    });
    if (!confirmed) return;
    try {
      await deleteCourse(course.id);
      toast.success('Curso dado de baja.');
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRestore = async (course) => {
    try {
      await restoreCourse(course.id);
      toast.success(`"${course.title}" fue reactivado.`);
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Botones de revisión que aparecen dentro del detalle del curso
  const renderReviewActions = (course) =>
    course.isActive && (
      <div className="row-actions row-actions--start">
        {course.status !== 'published' && (
          <button type="button" className="button button--primary" onClick={() => handleStatusChange(course, 'published')}>
            Publicar curso
          </button>
        )}
        {course.status === 'published' && (
          <button type="button" className="button button--outline" onClick={() => handleStatusChange(course, 'hidden')}>
            Ocultar del catálogo
          </button>
        )}
      </div>
    );

  return (
    <section className="panel" aria-labelledby="admin-courses-title">
      <header className="panel__header">
        <h2 id="admin-courses-title" className="panel__title">
          Cursos {meta && <span className="data-table__sub">({meta.total})</span>}
        </h2>
      </header>

      <div className="toolbar">
        <SearchBox placeholder="Buscar curso" onSearch={(search) => updateFilter({ search })} />
        <select
          className="form__input toolbar__select"
          aria-label="Filtrar por estado"
          value={filters.status}
          onChange={(event) => updateFilter({ status: event.target.value })}
        >
          <option value="">Todos los estados</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label className="toolbar__check">
          <input
            type="checkbox"
            checked={filters.includeInactive}
            onChange={(event) => updateFilter({ includeInactive: event.target.checked })}
          />
          Incluir dados de baja
        </label>
        {isLoading && courses && <span className="toolbar__loading">Actualizando...</span>}
      </div>

      {isLoading && !courses && <p className="status">Cargando cursos...</p>}
      {error && <p className="status status--error">{error}</p>}

      {courses && (
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Curso</th>
              <th scope="col">Categoría</th>
              <th scope="col">Precio</th>
              <th scope="col">Estado</th>
              <th scope="col">
                <span className="visually-hidden">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 && (
              <tr>
                <td colSpan={5} className="data-table__empty">
                  No hay cursos con estos filtros.
                </td>
              </tr>
            )}
            {courses.map((course) => (
              <tr key={course.id}>
                <td>
                  <div className="data-table__main">
                    <div className="data-table__thumb">{course.imageUrl && <img src={course.imageUrl} alt="" />}</div>
                    <div>
                      <p className="data-table__title">{course.title}</p>
                      <p className="data-table__sub">
                        {course.instructor.name} · {course.studentsCount} estudiantes
                      </p>
                    </div>
                  </div>
                </td>
                <td data-label="Categoría">{course.category.name}</td>
                <td data-label="Precio">{formatPrice(course.price)}</td>
                <td data-label="Estado">
                  {course.isActive ? (
                    <select
                      className="form__input data-table__select"
                      aria-label={`Estado de ${course.title}`}
                      value={course.status}
                      onChange={(event) => handleStatusChange(course, event.target.value)}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <CourseStatusBadge course={course} />
                  )}
                </td>
                <td>
                  <div className="row-actions">
                    <button type="button" className="icon-button" title="Ver detalle" aria-label={`Ver ${course.title}`} onClick={() => setDialog({ type: 'detail', course })}>
                      <Eye size={16} />
                    </button>
                    <button type="button" className="icon-button" title="Ver estudiantes" aria-label={`Estudiantes de ${course.title}`} onClick={() => setDialog({ type: 'students', course })}>
                      <Users size={16} />
                    </button>
                    {course.isActive ? (
                      <button type="button" className="icon-button icon-button--danger" title="Dar de baja" aria-label={`Dar de baja ${course.title}`} onClick={() => handleDelete(course)}>
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <button type="button" className="icon-button" title="Reactivar" aria-label={`Reactivar ${course.title}`} onClick={() => handleRestore(course)}>
                        <RotateCcw size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {meta?.totalPages > 1 && (
        <div className="panel__footer">
          <Pagination meta={meta} onChange={(page) => setFilters((current) => ({ ...current, page }))} />
        </div>
      )}

      {dialog?.type === 'students' && <StudentsModal course={dialog.course} onClose={closeDialog} />}
      <DetailDialog isOpen={dialog?.type === 'detail'} onClose={closeDialog} label="Detalle del curso">
        {dialog?.type === 'detail' && <CourseDetailLoader courseId={dialog.course.id} actions={renderReviewActions} />}
      </DetailDialog>
    </section>
  );
}
