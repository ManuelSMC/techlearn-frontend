import { useState } from 'react';
import { getMyProfile, updateMyProfile } from '../../api/instructors.api';
import FormField from '../../components/FormField/FormField';
import { useQuery } from '../../hooks/useQuery';
import { useToast } from '../../hooks/useToast';
import { getFieldErrors } from '../../utils/errors';
import { getInitials } from '../../utils/format';

/** Perfil público del instructor (se muestra en "Instructores destacados" y en sus cursos). */
export default function InstructorProfile() {
  const { data: profile, error, reload } = useQuery(getMyProfile);

  if (error) return <p className="status status--error">{error}</p>;
  if (!profile) return <p className="status">Cargando tu perfil...</p>;

  // El formulario se monta cuando ya llegaron los datos, para iniciar con ellos.
  return <ProfileForm profile={profile} onSaved={reload} />;
}

function ProfileForm({ profile, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState({
    specialty: profile.specialty ?? '',
    bio: profile.bio ?? '',
    photoUrl: profile.photoUrl ?? '',
  });
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
      // Los campos vacíos se guardan como null para borrar el dato.
      await updateMyProfile({
        specialty: form.specialty.trim() || null,
        bio: form.bio.trim() || null,
        photoUrl: form.photoUrl.trim() || null,
      });
      toast.success('Perfil actualizado.');
      onSaved();
    } catch (err) {
      const errors = getFieldErrors(err);
      setFieldErrors(errors);
      if (Object.keys(errors).length === 0) toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile">
      <section className="panel" aria-labelledby="profile-title">
        <header className="panel__header">
          <h2 id="profile-title" className="panel__title">
            Mi perfil de instructor
          </h2>
        </header>
        <form className="form panel__body" onSubmit={handleSubmit} noValidate>
          <div className="profile__readonly">
            <p>
              <span className="profile__label">Nombre</span>
              {profile.name}
            </p>
            <p>
              <span className="profile__label">Correo</span>
              {profile.email}
            </p>
          </div>
          <FormField
            id="specialty"
            label="Especialidad"
            placeholder="Ej. Desarrollo Frontend"
            value={form.specialty}
            onChange={handleChange}
            error={fieldErrors.specialty}
          />
          <FormField
            id="bio"
            label="Biografía"
            as="textarea"
            rows={4}
            value={form.bio}
            onChange={handleChange}
            error={fieldErrors.bio}
            hint="Cuéntale a tus estudiantes sobre tu experiencia."
          />
          <FormField
            id="photoUrl"
            label="URL de tu foto"
            type="url"
            placeholder="https://..."
            value={form.photoUrl}
            onChange={handleChange}
            error={fieldErrors.photoUrl}
          />
          <div>
            <button type="submit" className="button button--primary" disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </section>

      <aside className="panel profile__preview" aria-label="Vista previa del perfil">
        <p className="profile__label">Así te ven los estudiantes</p>
        <div className="profile__photo">
          {form.photoUrl ? <img src={form.photoUrl} alt="" /> : <span>{getInitials(profile.name)}</span>}
        </div>
        <p className="profile__name">{profile.name}</p>
        {form.specialty && <p className="profile__specialty">{form.specialty}</p>}
        {form.bio && <p className="profile__bio">{form.bio}</p>}
      </aside>
    </div>
  );
}
