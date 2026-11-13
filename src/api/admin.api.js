import { request } from './client';

export const getUsers = (filters) => request('/users', { params: filters });

export const createInstructor = (data) => request('/users/instructors', { method: 'POST', body: data });

export const setUserStatus = (id, isActive) => request(`/users/${id}/status`, { method: 'PATCH', body: { isActive } });

export const getStats = () => request('/stats');
