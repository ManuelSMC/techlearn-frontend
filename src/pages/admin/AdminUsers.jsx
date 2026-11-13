import { useCallback, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { createInstructor, getUsers, setUserStatus } from '../../api/admin.api';
import Modal from '../../components/Modal/Modal';
import FormField from '../../components/FormField/FormField';
import SearchBox from '../../components/SearchBox/SearchBox';
import Pagination from '../../components/Pagination/Pagination';
import { ActiveBadge } from '../../components/StatusBadge/StatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { useQuery } from '../../hooks/useQuery';
import { useToast } from '../../hooks/useToast';
import { useConfirm } from '../../hooks/useConfirm';
import { getFieldErrors } from '../../utils/errors';

const ROLE_LABELS = { admin: 'Administrador', instructor: 'Instructor', user: 'Estudiante' };
const dateFormatter = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' });

/** Gestión de usuarios: listado, alta de instructores y habilitar / deshabilitar cuentas. */
export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [filters, setFilters] = useState({ role: '', search: '', page: 1 });
  const { data: users, meta, error, isLoading, reload } = useQuery(getUsers, { ...filters, limit: 10 });
  const toast = useToast();
  const confirm = useConfirm();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const closeForm = useCallback(() => setIsFormOpen(false), []);

  const updateFilter = (changes) => setFilters((current) => ({ ...current, ...changes, page: 1 }));

  const handleToggle = async (user) => {
    const willEnable = !user.isActive;
    const confirmed = await confirm({
      title: willEnable ? 'Habilitar cuenta' : 'Deshabilitar cuenta',
      message: willEnable
        ? `${user.name} podrá volver a iniciar sesión.`
        : `${user.name} no podrá iniciar sesión y su sesión actual dejará de funcionar de inmediato.`,
      confirmLabel: willEnable ? 'Habilitar' : 'Deshabilitar',
      tone: willEnable ? undefined : 'danger',
    });
    if (!confirmed) return;
    try {
      await setUserStatus(user.id, willEnable);
      toast.success(willEnable ? `${user.name} fue habilitado.` : `${user.name} fue deshabilitado.`);
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <section className="panel" aria-labelledby="admin-users-title">
      <header className="panel__header">
        <h2 id="admin-users-title" className="panel__title">
          Usuarios {meta && <span className="data-table__sub">({meta.total})</span>}
        </h2>
        <button type="button" className="button button--primary button--small" onClick={() => setIsFormOpen(true)}>
          <UserPlus size={16} aria-hidden="true" />
          Nuevo instructor
        </button>
      </header>

      <div className="toolbar">
        <SearchBox placeholder="Buscar por nombre o correo" onSearch={(search) => updateFilter({ search })} />
        <select
          className="form__input toolbar__select"
          aria-label="Filtrar por rol"
          value={filters.role}
          onChange={(event) => updateFilter({ role: event.target.value })}
        >
          <option value="">Todos los roles</option>
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {isLoading && users && <span className="toolbar__loading">Actualizando...</span>}
      </div>

      {isLoading && !users && <p className="status">Cargando usuarios...</p>}
      {error && <p className="status status--error">{error}</p>}

      {users && (
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Usuario</th>
              <th scope="col">Rol</th>
              <th scope="col">Registro</th>
              <th scope="col">Estado</th>
              <th scope="col">
                <span className="visually-hidden">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="data-table__empty">
                  No hay usuarios con estos filtros.
                </td>
              </tr>
            )}
            {users.map((user) => {
              // La API no permite cambiar la propia cuenta ni deshabilitar administradores.
              const canToggle = user.id !== currentUser.id && user.role !== 'admin';
              return (
                <tr key={user.id}>
                  <td>
                    <p className="data-table__title">{user.name}</p>
                    <p className="data-table__sub">{user.email}</p>
                  </td>
                  <td data-label="Rol">
                    <span className={`chip ${user.role === 'user' ? 'chip--muted' : ''}`}>{ROLE_LABELS[user.role]}</span>
                  </td>
                  <td data-label="Registro">{dateFormatter.format(new Date(user.createdAt))}</td>
                  <td data-label="Estado">
                    <ActiveBadge isActive={user.isActive} />
                  </td>
                  <td>
                    <div className="row-actions">
                      {canToggle && (
                        <button
                          type="button"
                          className={`button button--small ${user.isActive ? 'button--outline' : 'button--primary'}`}
                          onClick={() => handleToggle(user)}
                        >
                          {user.isActive ? 'Deshabilitar' : 'Habilitar'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {meta?.totalPages > 1 && (
        <div className="panel__footer">
          <Pagination meta={meta} onChange={(page) => setFilters((current) => ({ ...current, page }))} />
        </div>
      )}

      {isFormOpen && (
        <InstructorFormModal
          onClose={closeForm}
          onSaved={() => {
            closeForm();
            reload();
          }}
        />
      )}
    </section>
  );
}

const EMPTY_INSTRUCTOR = { name: '', email: '', password: '', specialty: '', bio: '', photoUrl: '' };

/** Alta de instructor: la API crea la cuenta y su perfil en una sola transacción. */
function InstructorFormModal({ onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(EMPTY_INSTRUCTOR);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setFieldErrors({});
    try {
      await createInstructor({
        name: form.name,
        email: form.email,
        password: form.password,
        specialty: form.specialty.trim() || null,
        bio: form.bio.trim() || null,
        photoUrl: form.photoUrl.trim() || null,
      });
      toast.success(`Instructor ${form.name} registrado.`);
      onSaved();
    } catch (err) {
      const errors = getFieldErrors(err);
      setFieldErrors(errors);
      if (Object.keys(errors).length === 0) toast.error(err.message);
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Nuevo instructor"
      footer={
        <>
          <button type="button" className="button button--outline" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="instructor-form" className="button button--primary" disabled={isSaving}>
            {isSaving ? 'Registrando...' : 'Registrar instructor'}
          </button>
        </>
      }
    >
      <form id="instructor-form" className="form" onSubmit={handleSubmit} noValidate>
        <FormField id="name" label="Nombre completo" value={form.name} onChange={handleChange} error={fieldErrors.name} />
        <FormField id="email" label="Correo electrónico" type="email" value={form.email} onChange={handleChange} error={fieldErrors.email} />
        <FormField
          id="password"
          label="Contraseña temporal"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          hint="Mínimo 8 caracteres, con mayúscula, minúscula y número."
        />
        <FormField id="specialty" label="Especialidad (opcional)" value={form.specialty} onChange={handleChange} error={fieldErrors.specialty} />
        <FormField id="bio" label="Biografía (opcional)" as="textarea" rows={3} value={form.bio} onChange={handleChange} error={fieldErrors.bio} />
        <FormField id="photoUrl" label="URL de la foto (opcional)" type="url" value={form.photoUrl} onChange={handleChange} error={fieldErrors.photoUrl} />
      </form>
    </Modal>
  );
}
