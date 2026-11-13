import { useCallback, useState } from 'react';
import { Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  restoreCategory,
  updateCategory,
} from '../../api/categories.api';
import Modal from '../../components/Modal/Modal';
import FormField from '../../components/FormField/FormField';
import { ActiveBadge } from '../../components/StatusBadge/StatusBadge';
import { useQuery } from '../../hooks/useQuery';
import { useToast } from '../../hooks/useToast';
import { useConfirm } from '../../hooks/useConfirm';
import { getFieldErrors } from '../../utils/errors';

/** Gestión de categorías: crear, editar, dar de baja y reactivar. */
export default function AdminCategories() {
  const { data: categories, error, isLoading, reload } = useQuery(getAllCategories);
  const toast = useToast();
  const confirm = useConfirm();

  // undefined: cerrado · null: nueva categoría · objeto: editar esa categoría
  const [editing, setEditing] = useState(undefined);
  const closeForm = useCallback(() => setEditing(undefined), []);

  const handleDelete = async (category) => {
    const confirmed = await confirm({
      title: 'Dar de baja la categoría',
      message: `"${category.name}" dejará de aparecer en el catálogo. Solo es posible si no tiene cursos activos.`,
      confirmLabel: 'Dar de baja',
      tone: 'danger',
    });
    if (!confirmed) return;
    try {
      await deleteCategory(category.id);
      toast.success('Categoría dada de baja.');
      reload();
    } catch (err) {
      // Ej. 409: la categoría todavía tiene cursos activos
      toast.error(err.message);
    }
  };

  const handleRestore = async (category) => {
    try {
      await restoreCategory(category.id);
      toast.success(`"${category.name}" fue reactivada.`);
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <section className="panel" aria-labelledby="admin-categories-title">
      <header className="panel__header">
        <h2 id="admin-categories-title" className="panel__title">
          Categorías
        </h2>
        <button type="button" className="button button--primary button--small" onClick={() => setEditing(null)}>
          <Plus size={16} aria-hidden="true" />
          Nueva categoría
        </button>
      </header>

      {isLoading && !categories && <p className="status">Cargando categorías...</p>}
      {error && <p className="status status--error">{error}</p>}

      {categories && (
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Categoría</th>
              <th scope="col">Cursos publicados</th>
              <th scope="col">Estado</th>
              <th scope="col">
                <span className="visually-hidden">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>
                  <div className="data-table__main">
                    <div className="data-table__thumb">{category.imageUrl && <img src={category.imageUrl} alt="" />}</div>
                    <div>
                      <p className="data-table__title">{category.name}</p>
                      <p className="data-table__sub">/{category.slug}</p>
                    </div>
                  </div>
                </td>
                <td data-label="Cursos publicados">{category.publishedCourses}</td>
                <td data-label="Estado">
                  <ActiveBadge isActive={category.isActive} activeLabel="Activa" inactiveLabel="Dada de baja" />
                </td>
                <td>
                  <div className="row-actions">
                    <button type="button" className="icon-button" title="Editar" aria-label={`Editar ${category.name}`} onClick={() => setEditing(category)}>
                      <Pencil size={16} />
                    </button>
                    {category.isActive ? (
                      <button type="button" className="icon-button icon-button--danger" title="Dar de baja" aria-label={`Dar de baja ${category.name}`} onClick={() => handleDelete(category)}>
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <button type="button" className="icon-button" title="Reactivar" aria-label={`Reactivar ${category.name}`} onClick={() => handleRestore(category)}>
                        <RotateCcw size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing !== undefined && (
        <CategoryFormModal
          key={editing?.id ?? 'new'}
          category={editing}
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

function CategoryFormModal({ category, onClose, onSaved }) {
  const isEditing = Boolean(category);
  const toast = useToast();
  const [form, setForm] = useState({
    name: category?.name ?? '',
    description: category?.description ?? '',
    imageUrl: category?.imageUrl ?? '',
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
    const payload = {
      name: form.name,
      description: form.description.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
    };
    try {
      if (isEditing) {
        await updateCategory(category.id, payload);
        toast.success('Categoría actualizada.');
      } else {
        await createCategory(payload);
        toast.success('Categoría creada.');
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
      title={isEditing ? 'Editar categoría' : 'Nueva categoría'}
      footer={
        <>
          <button type="button" className="button button--outline" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="category-form" className="button button--primary" disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </>
      }
    >
      <form id="category-form" className="form" onSubmit={handleSubmit} noValidate>
        <FormField
          id="name"
          label="Nombre"
          value={form.name}
          onChange={handleChange}
          error={fieldErrors.name}
          hint={isEditing ? undefined : 'El slug para la URL se genera automáticamente a partir del nombre.'}
        />
        <FormField
          id="description"
          label="Descripción"
          as="textarea"
          rows={3}
          value={form.description}
          onChange={handleChange}
          error={fieldErrors.description}
        />
        <FormField
          id="imageUrl"
          label="URL de la imagen"
          type="url"
          placeholder="https://..."
          value={form.imageUrl}
          onChange={handleChange}
          error={fieldErrors.imageUrl}
        />
      </form>
    </Modal>
  );
}
