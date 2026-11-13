import { request } from './client';

export const enroll = (courseId) => request('/enrollments', { method: 'POST', body: { courseId } });

export const getMyEnrollments = () => request('/enrollments/me');

export const cancelEnrollment = (id) => request(`/enrollments/${id}/cancel`, { method: 'PATCH' });
