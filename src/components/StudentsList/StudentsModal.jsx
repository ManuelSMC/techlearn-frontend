import { useCallback } from 'react';
import Modal from '../Modal/Modal';
import { ActiveBadge } from '../StatusBadge/StatusBadge';
import { useQuery } from '../../hooks/useQuery';
import { getCourseStudents } from '../../api/courses.api';

const dateFormatter = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' });

/** Estudiantes inscritos en un curso (lo usan el instructor dueño y el admin). */
export default function StudentsModal({ course, onClose }) {
  const fetchStudents = useCallback(() => getCourseStudents(course.id), [course.id]);
  const { data: students, error, isLoading } = useQuery(fetchStudents);

  const activeCount = students?.filter((student) => student.status === 'active').length ?? 0;

  return (
    <Modal isOpen onClose={onClose} title={`Estudiantes de "${course.title}"`} size="large">
      {isLoading && !students && <p className="status">Cargando estudiantes...</p>}
      {error && <p className="status status--error">{error}</p>}
      {students && students.length === 0 && <p className="status">Este curso todavía no tiene estudiantes.</p>}
      {students && students.length > 0 && (
        <>
          <p className="modal__text">
            {activeCount} {activeCount === 1 ? 'inscripción activa' : 'inscripciones activas'} de {students.length} en
            total.
          </p>
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Estudiante</th>
                <th scope="col">Inscripción</th>
                <th scope="col">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.enrollmentId}>
                  <td>
                    <p className="data-table__title">{student.name}</p>
                    <p className="data-table__sub">{student.email}</p>
                  </td>
                  <td data-label="Inscripción">
                    <ActiveBadge isActive={student.status === 'active'} inactiveLabel="Cancelada" activeLabel="Activa" />
                  </td>
                  <td data-label="Fecha">{dateFormatter.format(new Date(student.enrolledAt))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Modal>
  );
}
