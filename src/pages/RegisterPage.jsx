import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard/AuthCard';
import FormField from '../components/FormField/FormField';
import { useAuth } from '../hooks/useAuth';
import { getFieldErrors, getHomeByRole } from '../utils/errors';

const INITIAL_FORM = { name: '', email: '', password: '', confirmPassword: '' };

export default function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
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
    setError('');

    // Esta validación es solo del formulario; las reglas de la contraseña las valida la API.
    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: 'Las contraseñas no coinciden' });
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    try {
      const { name, email, password } = form;
      await register({ name, email, password });
      navigate('/', { replace: true });
    } catch (err) {
      setFieldErrors(getFieldErrors(err));
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Crear cuenta"
      subtitle="Regístrate gratis y empieza a aprender hoy."
      footer={
        <>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
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
          id="name"
          label="Nombre completo"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          error={fieldErrors.name}
          required
        />
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
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          hint="Mínimo 8 caracteres, con mayúscula, minúscula y número."
          required
        />
        <FormField
          id="confirmPassword"
          label="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={fieldErrors.confirmPassword}
          required
        />
        <button type="submit" className="button button--primary button--block" disabled={isSubmitting}>
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>
    </AuthCard>
  );
}
