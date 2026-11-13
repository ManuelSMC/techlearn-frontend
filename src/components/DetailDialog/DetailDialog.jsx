import Modal from '../Modal/Modal';
import BottomSheet from '../BottomSheet/BottomSheet';
import { useMediaQuery } from '../../hooks/useMediaQuery';

/**
 * Muestra un detalle encima de la página sin salir de ella:
 * ventana modal en escritorio y hoja deslizable en móvil.
 */
export default function DetailDialog({ isOpen, onClose, label, children }) {
  const isDesktop = useMediaQuery('(min-width: 960px)');

  if (isDesktop) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="large">
        {children}
      </Modal>
    );
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} label={label}>
      {children}
    </BottomSheet>
  );
}
