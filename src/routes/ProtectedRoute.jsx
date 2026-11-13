import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Protege rutas por sesión y rol.
 * - Sin sesión: redirige al login y recuerda a dónde quería ir el usuario.
 * - Con sesión pero sin el rol permitido: regresa al inicio.
 * La seguridad real está en la API; esto solo evita mostrar pantallas que no le corresponden.
 */
export function ProtectedRoute({ roles }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
}
