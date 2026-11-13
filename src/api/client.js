const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'techlearn_token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

/** Error con el estado HTTP y los detalles de validación que devuelve la API. */
export class ApiError extends Error {
  constructor(message, status, details = []) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/** Convierte { category: 'web', page: 2, level: '' } en "?category=web&page=2" (ignora vacíos). */
function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.append(key, value);
  });
  const text = query.toString();
  return text ? `?${text}` : '';
}

/**
 * Hace la petición a la API y devuelve { data, meta, message }.
 * Agrega el token automáticamente si hay sesión iniciada.
 */
export async function request(path, { method = 'GET', body, params } = {}) {
  const headers = {};
  const token = tokenStorage.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';

  let response;
  try {
    response = await fetch(`${API_URL}${path}${buildQuery(params)}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. Intenta de nuevo más tarde', 0);
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(payload.message || 'Ocurrió un error inesperado', response.status, payload.details);
  }
  return { data: payload.data, meta: payload.meta, message: payload.message };
}
