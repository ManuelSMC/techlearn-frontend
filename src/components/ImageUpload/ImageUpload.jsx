import { useId, useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2, UserRound } from 'lucide-react';
import { uploadImage } from '../../api/uploads.api';
import { useToast } from '../../hooks/useToast';
import './ImageUpload.css';

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB, el mismo límite que la API
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Campo para subir una imagen desde el dispositivo.
 * La imagen se sube en cuanto se elige y el formulario solo guarda la URL resultante.
 * shape: 'wide' (portadas) | 'round' (fotos de perfil)
 */
export default function ImageUpload({ label, value, onChange, folder, error, shape = 'wide' }) {
  const inputId = useId();
  const inputRef = useRef(null);
  const toast = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (event) => {
    const file = event.target.files[0];
    event.target.value = ''; // permite volver a elegir el mismo archivo
    if (!file) return;

    // Validación rápida en el navegador; la API vuelve a validar todo.
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Formato no permitido. Usa JPG, PNG o WEBP.');
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error('La imagen no puede pesar más de 2 MB.');
      return;
    }

    setIsUploading(true);
    try {
      const { data } = await uploadImage(file, folder);
      onChange(data.url);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const Placeholder = shape === 'round' ? UserRound : ImagePlus;

  return (
    <div className="form__field">
      <span className="form__label" id={`${inputId}-label`}>
        {label}
      </span>

      <div className={`image-upload image-upload--${shape}`}>
        <div className={`image-upload__preview ${error ? 'image-upload__preview--invalid' : ''}`}>
          {value ? <img src={value} alt="Vista previa" /> : <Placeholder size={32} aria-hidden="true" />}
          {isUploading && (
            <div className="image-upload__overlay">
              <Loader2 className="image-upload__spinner" size={28} aria-hidden="true" />
              <span>Subiendo...</span>
            </div>
          )}
        </div>

        <div className="image-upload__actions">
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            className="visually-hidden"
            aria-labelledby={`${inputId}-label`}
            onChange={handleFile}
            disabled={isUploading}
          />
          <button
            type="button"
            className="button button--outline button--small"
            onClick={() => inputRef.current.click()}
            disabled={isUploading}
          >
            <ImagePlus size={16} aria-hidden="true" />
            {value ? 'Cambiar imagen' : 'Subir imagen'}
          </button>
          {value && (
            <button
              type="button"
              className="button button--ghost button--small"
              onClick={() => onChange('')}
              disabled={isUploading}
            >
              <Trash2 size={16} aria-hidden="true" />
              Quitar
            </button>
          )}
          <p className="form__hint">JPG, PNG o WEBP, máximo 2 MB.</p>
        </div>
      </div>

      {error && <p className="form__error">{error}</p>}
    </div>
  );
}
