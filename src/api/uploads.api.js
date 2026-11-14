import { request } from './client';

/**
 * Sube una imagen desde el dispositivo del usuario y devuelve su URL.
 * folder: 'courses' | 'categories' | 'instructors'
 */
export function uploadImage(file, folder) {
  const formData = new FormData();
  formData.append('folder', folder);
  formData.append('image', file);
  return request('/uploads/images', { method: 'POST', body: formData });
}
