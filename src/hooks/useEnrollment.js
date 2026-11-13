import { useEffect, useState } from 'react';
import { enroll, getMyEnrollments } from '../api/enrollments.api';
import { formatPrice } from '../utils/format';

/**
 * Inscripciones del usuario (rol "user") desde el catálogo.
 * Carga los cursos en los que ya está inscrito para mostrar "Inscrito" en su tarjeta.
 */
export function useEnrollment(user) {
  const isStudent = user?.role === 'user';
  const [enrolledIds, setEnrolledIds] = useState(() => new Set());
  const [pendingId, setPendingId] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!isStudent) return;
    let isActive = true;
    getMyEnrollments()
      .then(({ data }) => {
        if (!isActive) return;
        const activeIds = data.filter((item) => item.status === 'active').map((item) => item.courseId);
        setEnrolledIds(new Set(activeIds));
      })
      .catch(() => {});
    return () => {
      isActive = false;
    };
  }, [isStudent]);

  const enrollInCourse = async (course) => {
    setPendingId(course.id);
    setNotice(null);
    try {
      const { data } = await enroll(course.id);
      setEnrolledIds((ids) => new Set(ids).add(course.id));
      // Sin pasarela de pago: en cursos de pago la API registra un pago simulado.
      const payment = data.paymentSimulated ? ` Pago simulado de ${formatPrice(course.price)}.` : '';
      setNotice({ type: 'success', text: `Te inscribiste a "${course.title}".${payment}` });
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
    } finally {
      setPendingId(null);
    }
  };

  return {
    isStudent,
    enrolledIds: isStudent ? enrolledIds : new Set(),
    pendingId,
    notice,
    clearNotice: () => setNotice(null),
    enrollInCourse,
  };
}
