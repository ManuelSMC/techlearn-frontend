import { useCallback } from 'react';
import CourseDetail from '../CourseDetail/CourseDetail';
import { useQuery } from '../../hooks/useQuery';
import { getCourse } from '../../api/courses.api';

/** Consulta un curso por id a la API y muestra su detalle. */
export default function CourseDetailLoader({ courseId, actions, onInstructorClick }) {
  const fetchCourse = useCallback(() => getCourse(courseId), [courseId]);
  const { data: course, error, isLoading } = useQuery(fetchCourse);

  if (isLoading && !course) return <p className="status detail-loader">Cargando curso...</p>;
  if (error) return <p className="status status--error detail-loader">{error}</p>;
  return (
    <CourseDetail
      course={course}
      actions={typeof actions === 'function' ? actions(course) : actions}
      onInstructorClick={onInstructorClick}
    />
  );
}
