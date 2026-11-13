const priceFormatter = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

export function formatPrice(price) {
  return Number(price) === 0 ? 'Gratis' : priceFormatter.format(price);
}

export const LEVEL_LABELS = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

/** "Laura Martínez" -> "LM" (se usa cuando no hay foto). */
export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}
