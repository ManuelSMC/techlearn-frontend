import { request } from './client';

// Público
export const getCategories = () => request('/categories');

// Admin
export const getAllCategories = () => request('/categories/all');
export const createCategory = (data) => request('/categories', { method: 'POST', body: data });
export const updateCategory = (id, data) => request(`/categories/${id}`, { method: 'PUT', body: data });
export const deleteCategory = (id) => request(`/categories/${id}`, { method: 'DELETE' });
export const restoreCategory = (id) => request(`/categories/${id}/restore`, { method: 'PATCH' });
