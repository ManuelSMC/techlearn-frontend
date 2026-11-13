import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import './BottomSheet.css';

// Distancia (px) que hay que arrastrar hacia abajo para cerrar la hoja.
const CLOSE_THRESHOLD = 120;

/**
 * Hoja que sube desde abajo (móvil). Se cierra arrastrándola hacia abajo,
 * tocando el fondo, con el botón de cerrar o con la tecla Escape.
 * La página de atrás no se mueve, así el usuario no pierde su lugar en la lista.
 */
export default function BottomSheet({ isOpen, onClose, label, children }) {
  const [dragOffset, setDragOffset] = useState(0);
  const dragStart = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; // evita que la lista de atrás haga scroll
    const handleKey = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTouchStart = (event) => {
    // Solo se arrastra la hoja si su contenido está hasta arriba; si no, el gesto es scroll normal.
    const isAtTop = !contentRef.current || contentRef.current.scrollTop <= 0;
    dragStart.current = isAtTop ? event.touches[0].clientY : null;
  };

  const handleTouchMove = (event) => {
    if (dragStart.current === null) return;
    const distance = event.touches[0].clientY - dragStart.current;
    setDragOffset(Math.max(0, distance));
  };

  const handleTouchEnd = () => {
    if (dragOffset > CLOSE_THRESHOLD) onClose();
    setDragOffset(0);
    dragStart.current = null;
  };

  const isDragging = dragOffset > 0;

  return createPortal(
    <div className="bottom-sheet">
      <div className="bottom-sheet__backdrop" onClick={onClose} aria-hidden="true" />
      <div
        className={`bottom-sheet__panel ${isDragging ? 'bottom-sheet__panel--dragging' : ''}`}
        style={{ transform: `translateY(${dragOffset}px)` }}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="bottom-sheet__header">
          <span className="bottom-sheet__handle" aria-hidden="true" />
          <button type="button" className="bottom-sheet__close" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
        <div ref={contentRef} className="bottom-sheet__content">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
