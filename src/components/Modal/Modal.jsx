import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import './Modal.css';

/**
 * Ventana modal propia. Se cierra con la X, tocando el fondo o con Escape.
 * size: 'small' | 'medium' | 'large'
 *
 * aside (opcional): un segundo panel que se abre a la derecha del principal,
 * por ejemplo el perfil del instructor mientras se revisa un curso.
 * Escape cierra primero el panel lateral y después el principal.
 */
export default function Modal({ isOpen, onClose, title, children, footer, size = 'medium', aside, asideLabel, onAsideClose }) {
  const panelRef = useRef(null);
  const hasAside = Boolean(aside);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event) => {
      if (event.key !== 'Escape') return;
      if (hasAside && onAsideClose) onAsideClose();
      else onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, hasAside, onAsideClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={`modal ${hasAside ? 'modal--with-aside' : ''}`}>
      <div className="modal__backdrop" onClick={onClose} aria-hidden="true" />
      <div className="modal__group">
        <div
          ref={panelRef}
          className={`modal__panel modal__panel--${size}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          tabIndex={-1}
        >
          <header className="modal__header">
            {title && (
              <h2 id="modal-title" className="modal__title">
                {title}
              </h2>
            )}
            <button type="button" className="modal__close" onClick={onClose} aria-label="Cerrar">
              <X size={20} />
            </button>
          </header>
          <div className="modal__body">{children}</div>
          {footer && <footer className="modal__footer">{footer}</footer>}
        </div>

        {hasAside && (
          <section className="modal__panel modal__panel--aside" role="dialog" aria-label={asideLabel}>
            <header className="modal__header">
              <h2 className="modal__title">{asideLabel}</h2>
              <button type="button" className="modal__close" onClick={onAsideClose} aria-label={`Cerrar ${asideLabel}`}>
                <X size={20} />
              </button>
            </header>
            <div className="modal__body modal__body--flush">{aside}</div>
          </section>
        )}
      </div>
    </div>,
    document.body
  );
}
