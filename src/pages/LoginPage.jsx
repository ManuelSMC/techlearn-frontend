import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard/AuthCard';
import FormField from '../components/FormField/FormField';
import { useAuth } from '../hooks/useAuth';
import { getFieldErrors, getHomeByRole } from '../utils/errors';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Si ya hay sesión (y no es la que se acaba de iniciar aquí), no tiene sentido mostrar el formulario.
  if (user && !isSubmitting) return <Navigate to={getHomeByRole(user.role)} replace />;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setFieldErrors({});
    try {
      const loggedUser = await login(form);
      // Regresa a la página que intentaba ver; si no había, va al inicio de su rol.
      navigate(location.state?.from ?? getHomeByRole(loggedUser.role), { replace: true });
    } catch (err) {
      setFieldErrors(getFieldErrors(err));
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Iniciar sesión"
      subtitle="Bienvenido de nuevo a TechLearn."
      footer={
        <>
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </>
      }
    >
      <form className="form" onSubmit={handleSubmit} noValidate>
        {error && Object.keys(fieldErrors).length === 0 && (
          <p className="alert alert--error" role="alert">
            {error}
          </p>
        )}
        <FormField
          id="email"
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
          required
        />
        <FormField
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          required
        />
        <button type="submit" className="button button--primary button--block" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Iniciar sesión'}
        </button>
      </form>
    </AuthCard>
  );
}
