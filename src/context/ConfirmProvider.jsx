import { useCallback, useMemo, useRef, useState } from 'react';
import Modal from '../components/Modal/Modal';
import { ConfirmContext } from './ConfirmContext';

/**
 * Diálogo de confirmación propio (sustituye a window.confirm).
 * Uso: const confirmed = await confirm({ title, message, confirmLabel, tone: 'danger' });
 */
export function ConfirmProvider({ children }) {
  const [options, setOptions] = useState(null);
  const resolver = useRef(null);

  const confirm = useCallback((dialogOptions) => {
    setOptions(dialogOptions);
    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = useCallback((answer) => {
    resolver.current?.(answer);
    resolver.current = null;
    setOptions(null);
  }, []);

  const handleCancel = useCallback(() => close(false), [close]);
  const value = useMemo(() => confirm, [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <Modal
        isOpen={Boolean(options)}
        onClose={handleCancel}
        title={options?.title}
        size="small"
        footer={
          <>
            <button type="button" className="button button--outline" onClick={handleCancel}>
              {options?.cancelLabel ?? 'Cancelar'}
            </button>
            <button
              type="button"
              className={`button ${options?.tone === 'danger' ? 'button--danger' : 'button--primary'}`}
              onClick={() => close(true)}
            >
              {options?.confirmLabel ?? 'Confirmar'}
            </button>
          </>
        }
      >
        <p className="modal__text">{options?.message}</p>
      </Modal>
    </ConfirmContext.Provider>
  );
}
