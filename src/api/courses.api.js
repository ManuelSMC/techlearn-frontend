import { request } from './client';

// Público
export const getCatalog = (filters) => request('/courses', { params: filters });
export const getCourse = (id) => request(`/courses/${id}`);

// Instructor
export const getMyCourses = (filters) => request('/courses/mine', { params: filters });
export const createCourse = (data) => request('/courses', { method: 'POST', body: data });
export const updateCourse = (id, data) => request(`/courses/${id}`, { method: 'PUT', body: data });
export const getCourseStudents = (id) => request(`/courses/${id}/students`);

// Instructor o admin
export const deleteCourse = (id) => request(`/courses/${id}`, { method: 'DELETE' });

// Admin
export const getAllCourses = (filters) => request('/courses/admin', { params: filters });
export const setCourseStatus = (id, status) => request(`/courses/${id}/status`, { method: 'PATCH', body: { status } });
export const restoreCourse = (id) => request(`/courses/${id}/restore`, { method: 'PATCH' });
