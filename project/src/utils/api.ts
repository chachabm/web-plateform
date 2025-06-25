// API utility functions for making authenticated requests
const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Create headers with authentication
const createAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Generic API request function
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = createAuthHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Auth API functions
export const authAPI = {
  login: (email: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
    
  register: (name: string, email: string, password: string, role: string) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    }),
    
  getProfile: () => apiRequest('/auth/me'),
  
  refreshToken: () => apiRequest('/auth/refresh', { method: 'POST' })
};

// Course API functions
export const courseAPI = {
  getAllCourses: (params?: URLSearchParams) =>
    apiRequest(`/courses${params ? `?${params}` : ''}`),
    
  getCourse: (id: string) => apiRequest(`/courses/${id}`),
  
  enrollInCourse: (id: string) =>
    apiRequest(`/courses/${id}/enroll`, { method: 'POST' }),
    
  createCourse: (courseData: any) =>
    apiRequest('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData)
    }),
    
  updateCourse: (id: string, courseData: any) =>
    apiRequest(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData)
    }),
    
  deleteCourse: (id: string) =>
    apiRequest(`/courses/${id}`, { method: 'DELETE' }),
    
  getCurriculum: (id: string) => apiRequest(`/courses/${id}/curriculum`),
    
  completeLesson: (courseId: string, lessonId: string, data: any) =>
    apiRequest(`/courses/${courseId}/lessons/${lessonId}/complete`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    
  addReview: (id: string, rating: number, comment: string) =>
    apiRequest(`/courses/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment })
    })
};

// User API functions
export const userAPI = {
  updateProfile: (profileData: any) =>
    apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    }),
    
  updateAvatar: (avatarUrl: string) =>
    apiRequest('/users/avatar', {
      method: 'PUT',
      body: JSON.stringify({ avatarUrl })
    }),
    
  getStats: () => apiRequest('/users/stats'),
    
  getInstructorCourses: () => apiRequest('/users/courses')
};

// Enrollment API functions
export const enrollmentAPI = {
  getEnrollments: () => apiRequest('/enrollments'),
    
  getEnrollment: (id: string) => apiRequest(`/enrollments/${id}`),
    
  updateProgress: (id: string, data: any) =>
    apiRequest(`/enrollments/${id}/progress`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    
  addNotes: (id: string, lessonId: string, notes: string) =>
    apiRequest(`/enrollments/${id}/notes`, {
      method: 'PUT',
      body: JSON.stringify({ lessonId, notes })
    }),
    
  getCourseStudents: (courseId: string) => apiRequest(`/enrollments/course/${courseId}`)
};

// Message API functions
export const messageAPI = {
  getConversations: () => apiRequest('/messages/conversations'),
    
  getMessages: (userId: string) => apiRequest(`/messages/${userId}`),
    
  sendMessage: (data: any) =>
    apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    
  markAsRead: (id: string) =>
    apiRequest(`/messages/${id}/read`, { method: 'PUT' }),
    
  deleteMessage: (id: string) =>
    apiRequest(`/messages/${id}`, { method: 'DELETE' }),
    
  getUnreadCount: () => apiRequest('/messages/unread/count')
};

export default {
  auth: authAPI,
  courses: courseAPI,
  users: userAPI,
  enrollments: enrollmentAPI,
  messages: messageAPI
};