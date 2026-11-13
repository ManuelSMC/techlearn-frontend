import { useCallback, useState } from 'react';
import { BookOpen, CheckCircle2, Clock, Eye, Pencil, Plus, Trash2, Users } from 'lucide-react';
import { deleteCourse, getMyCourses } from '../../api/courses.api';
import CourseFormModal from '../../components/CourseForm/CourseFormModal';
import StudentsModal from '../../components/StudentsList/StudentsModal';
import DetailDialog from '../../components/DetailDialog/DetailDialog';
import CourseDetailLoader from '../../components/DetailDialog/CourseDetailLoader';
import SearchBox from '../../components/SearchBox/SearchBox';
import { CourseStatusBadge } from '../../components/StatusBadge/StatusBadge';
import { useQuery } from '../../hooks/useQuery';
import { useToast } from '../../hooks/useToast';
import { useConfirm } from '../../hooks/useConfirm';
import { formatPrice } from '../../utils/format';

/** Cursos del instructor: crear, editar, ver estudiantes y dar de baja. */
export default function InstructorCourses() {
  const [search, setSearch] = useState('');
  // El máximo que acepta la API por página; un instructor no suele tener más cursos.
  const { data: courses, error, isLoading, reload } = useQuery(getMyCourses, { limit: 50, search });
  const toast = useToast();
  const confirm = useConfirm();

  // Ventana abierta: { type: 'form' | 'students' | 'detail', course }
  const [dialog, setDialog] = useState(null);
  const closeDialog = useCallback(() => setDialog(null), []);

  const handleSaved = () => {
    setDialog(null);
    reload();
  };

  const handleDelete = async (course) => {
    const confirmed = await confirm({
      title: 'Dar de baja el curso',
      message: `"${course.title}" dejará de mostrarse en el catálogo. Solo el administrador podrá reactivarlo.`,
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

  const list = courses ?? [];
  const stats = [
    { icon: BookOpen, label: 'Cursos', value: list.length },
    { icon: CheckCircle2, label: 'Publicados', value: list.filter((c) => c.status === 'published').length },
    { icon: Clock, label: 'En borrador', value: list.filter((c) => c.status === 'draft').length },
    { icon: Users, label: 'Estudiantes', value: list.reduce((sum, c) => sum + c.studentsCount, 0) },
  ];

  return (
    <>
      <ul className="stats">
        {stats.map(({ icon: Icon, label, value }) => (
          <li key={label} className="stats__card">
            <Icon className="stats__icon" size={22} aria-hidden="true" />
            <div>
              <p className="stats__value">{value}</p>
              <p className="stats__label">{label}</p>
            </div>
          </li>
        ))}
      </ul>

      <section className="panel" aria-labelledby="my-courses-title">
        <header className="panel__header">
          <h2 id="my-courses-title" className="panel__title">
            Mis cursos
          </h2>
          <button type="button" className="button button--primary button--small" onClick={() => setDialog({ type: 'form' })}>
            <Plus size={16} aria-hidden="true" />
            Nuevo curso
          </button>
        </header>

        <div className="toolbar">
          <SearchBox placeholder="Buscar por título o descripción" onSearch={setSearch} />
          {isLoading && courses && <span className="toolbar__loading">Actualizando...</span>}
        </div>

        {isLoading && !courses && <p className="status">Cargando tus cursos...</p>}
        {error && <p className="status status--error">{error}</p>}

        {courses && (
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Curso</th>
                <th scope="col">Estado</th>
                <th scope="col">Precio</th>
                <th scope="col">Estudiantes</th>
                <th scope="col">
                  <span className="visually-hidden">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 && (
                <tr>
                  <td colSpan={5} className="data-table__empty">
                    {search ? 'No hay cursos que coincidan con la búsqueda.' : 'Aún no has creado cursos. Empieza con "Nuevo curso".'}
                  </td>
                </tr>
              )}
              {list.map((course) => (
                <tr key={course.id}>
                  <td>
                    <div className="data-table__main">
                      <div className="data-table__thumb">{course.imageUrl && <img src={course.imageUrl} alt="" />}</div>
                      <div>
                        <p className="data-table__title">{course.title}</p>
                        <p className="data-table__sub">{course.category.name}</p>
                      </div>
                    </div>
                  </td>
                  <td data-label="Estado">
                    <CourseStatusBadge course={course} />
                  </td>
                  <td data-label="Precio">{formatPrice(course.price)}</td>
                  <td data-label="Estudiantes">{course.studentsCount}</td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="icon-button" title="Ver detalle" aria-label={`Ver ${course.title}`} onClick={() => setDialog({ type: 'detail', course })}>
                        <Eye size={16} />
                      </button>
                      <button type="button" className="icon-button" title="Ver estudiantes" aria-label={`Estudiantes de ${course.title}`} onClick={() => setDialog({ type: 'students', course })}>
                        <Users size={16} />
                      </button>
                      <button type="button" className="icon-button" title="Editar" aria-label={`Editar ${course.title}`} onClick={() => setDialog({ type: 'form', course })}>
                        <Pencil size={16} />
                      </button>
                      <button type="button" className="icon-button icon-button--danger" title="Dar de baja" aria-label={`Dar de baja ${course.title}`} onClick={() => handleDelete(course)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {dialog?.type === 'form' && (
        <CourseFormModal key={dialog.course?.id ?? 'new'} course={dialog.course} onClose={closeDialog} onSaved={handleSaved} />
      )}
      {dialog?.type === 'students' && <StudentsModal course={dialog.course} onClose={closeDialog} />}
      <DetailDialog isOpen={dialog?.type === 'detail'} onClose={closeDialog} label="Detalle del curso">
        {dialog?.type === 'detail' && <CourseDetailLoader courseId={dialog.course.id} />}
      </DetailDialog>
    </>
  );
}
