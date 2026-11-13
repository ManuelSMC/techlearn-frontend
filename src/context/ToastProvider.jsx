import { useCallback, useMemo, useState } from 'react';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import { ToastContext } from './ToastContext';
import './Toast.css';

const DURATION = 4500;
let nextId = 1;

/** Notificaciones propias de la aplicación (sustituyen a alert()). */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (type, message) => {
      const id = nextId++;
      setToasts((list) => [...list, { id, type, message }]);
      setTimeout(() => dismiss(id), DURATION);
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      success: (message) => show('success', message),
      error: (message) => show('error', message),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast--${toast.type}`} role="status">
            {toast.type === 'success' ? (
              <CheckCircle2 className="toast__icon" size={20} aria-hidden="true" />
            ) : (
              <XCircle className="toast__icon" size={20} aria-hidden="true" />
            )}
            <p className="toast__message">{toast.message}</p>
            <button type="button" className="toast__close" onClick={() => dismiss(toast.id)} aria-label="Cerrar">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
