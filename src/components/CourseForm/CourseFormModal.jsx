import { useState } from 'react';
import Modal from '../Modal/Modal';
import FormField from '../FormField/FormField';
import ImageUpload from '../ImageUpload/ImageUpload';
import { useQuery } from '../../hooks/useQuery';
import { useToast } from '../../hooks/useToast';
import { getCategories } from '../../api/categories.api';
import { createCourse, updateCourse } from '../../api/courses.api';
import { LEVEL_LABELS } from '../../utils/format';
import { getFieldErrors } from '../../utils/errors';
import './CourseFormModal.css';

function toFormState(course) {
  return {
    title: course?.title ?? '',
    description: course?.description ?? '',
    price: course ? String(course.price) : '0',
    level: course?.level ?? 'beginner',
    categoryId: course ? String(course.category.id) : '',
    imageUrl: course?.imageUrl ?? '',
  };
}

/** Formulario para crear (course = null) o editar un curso. */
export default function CourseFormModal({ course, onClose, onSaved }) {
  const isEditing = Boolean(course);
  const toast = useToast();
  const { data: categories } = useQuery(getCategories);

  const [form, setForm] = useState(() => toFormState(course));
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

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      level: form.level,
      categoryId: Number(form.categoryId),
      imageUrl: form.imageUrl.trim() || null,
    };

    try {
      if (isEditing) {
        await updateCourse(course.id, payload);
        toast.success('Curso actualizado.');
      } else {
        await createCourse(payload);
        toast.success('Curso creado como borrador. El administrador lo revisará para publicarlo.');
      }
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
      title={isEditing ? 'Editar curso' : 'Nuevo curso'}
      size="large"
      footer={
        <>
          <button type="button" className="button button--outline" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="course-form" className="button button--primary" disabled={isSaving}>
            {isSaving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear curso'}
          </button>
        </>
      }
    >
      <form id="course-form" className="form course-form" onSubmit={handleSubmit} noValidate>
        <div className="course-form__main">
          <FormField id="title" label="Título" value={form.title} onChange={handleChange} error={fieldErrors.title} />
          <FormField
            id="description"
            label="Descripción"
            as="textarea"
            rows={5}
            value={form.description}
            onChange={handleChange}
            error={fieldErrors.description}
            hint="Explica qué aprenderá el estudiante (mínimo 10 caracteres)."
          />
          <div className="course-form__row">
            <FormField
              id="price"
              label="Precio (MXN)"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              error={fieldErrors.price}
              hint="Escribe 0 para un curso gratis."
            />
            <FormField id="level" label="Nivel" as="select" value={form.level} onChange={handleChange} error={fieldErrors.level}>
              {Object.entries(LEVEL_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </FormField>
          </div>
          <FormField
            id="categoryId"
            label="Categoría"
            as="select"
            value={form.categoryId}
            onChange={handleChange}
            error={fieldErrors.categoryId}
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>
            {(categories ?? []).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </FormField>
        </div>

        <div className="course-form__side">
          <ImageUpload
            label="Portada del curso"
            folder="courses"
            value={form.imageUrl}
            onChange={(imageUrl) => setForm((current) => ({ ...current, imageUrl }))}
            error={fieldErrors.imageUrl}
          />
        </div>
      </form>
    </Modal>
  );
}
