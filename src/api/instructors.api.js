import { request } from './client';

// Público
export const getInstructors = () => request('/instructors');

// Instructor
export const getMyProfile = () => request('/instructors/me');
export const updateMyProfile = (data) => request('/instructors/me', { method: 'PUT', body: data });
