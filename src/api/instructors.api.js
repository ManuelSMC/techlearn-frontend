import { request } from './client';

// Público
export const getInstructors = (params) => request('/instructors', { params });
export const getInstructor = (id) => request(`/instructors/${id}`);

// Instructor
export const getMyProfile = () => request('/instructors/me');
export const updateMyProfile = (data) => request('/instructors/me', { method: 'PUT', body: data });
