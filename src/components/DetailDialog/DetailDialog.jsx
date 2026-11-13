import Modal from '../Modal/Modal';
import BottomSheet from '../BottomSheet/BottomSheet';
import { useMediaQuery } from '../../hooks/useMediaQuery';

/**
 * Muestra un detalle encima de la página sin salir de ella:
 * ventana modal en escritorio y hoja deslizable en móvil.
 * aside (opcional): segundo panel. En escritorio va a la derecha del detalle;
 * en móvil se abre como otra hoja encima.
 */
export default function DetailDialog({ isOpen, onClose, label, children, aside, asideLabel, onAsideClose }) {
  const isDesktop = useMediaQuery('(min-width: 960px)');

  if (isDesktop) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="large" aside={aside} asideLabel={asideLabel} onAsideClose={onAsideClose}>
        {children}
      </Modal>
    );
  }

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose} label={label}>
        {children}
      </BottomSheet>
      <BottomSheet isOpen={isOpen && Boolean(aside)} onClose={onAsideClose} label={asideLabel}>
        {aside}
      </BottomSheet>
    </>
  );
}
