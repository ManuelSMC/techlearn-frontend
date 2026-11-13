import { request } from './client';

export const login = (credentials) => request('/auth/login', { method: 'POST', body: credentials });

export const register = (data) => request('/auth/register', { method: 'POST', body: data });

export const getMe = () => request('/auth/me');
