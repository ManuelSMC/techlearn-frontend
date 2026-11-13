/**
 * Convierte los detalles de validación de la API en un objeto por campo:
 * [{ field: 'email', message: '...' }] -> { email: '...' }
 */
export function getFieldErrors(error) {
  const fieldErrors = {};
  (error?.details ?? []).forEach(({ field, message }) => {
    if (!fieldErrors[field]) fieldErrors[field] = message;
  });
  return fieldErrors;
}

/** Ruta de inicio según el rol del usuario. */
export function getHomeByRole(role) {
  if (role === 'admin') return '/admin';
  if (role === 'instructor') return '/instructor';
  return '/';
}
