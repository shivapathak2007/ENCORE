import axios from 'axios';
const isDev = import.meta.env.MODE === 'development';
const API_URL = isDev ? 'http://localhost:5001/api' : 'https://encore-va72.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default {
  // Auth
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  demoLogin: () => api.post('/auth/demo'),
  getMe: () => api.get('/auth/me'),

  // Documents
  uploadDocument: (formData) => api.post('/documents', formData),
  getDocuments: () => api.get('/documents'),
  getDocument: (id) => api.get(`/documents/${id}`),
  deleteDocument: (id) => api.delete(`/documents/${id}`),
  processDocument: (id) => api.post(`/documents/${id}/process`),
  
  // Knowledge Generation
  generateSummary: (id, type) => api.post(`/documents/${id}/summary`, { type }),
  getSummaries: (id) => api.get(`/documents/${id}/summary`),
  
  generateMindMap: (id) => api.post(`/documents/${id}/mindmap`),
  getMindMaps: (id) => api.get(`/documents/${id}/mindmap`),

  generateFlashcards: (id, count) => api.post(`/documents/${id}/flashcards`, { count }),
  getFlashcards: (id) => api.get(`/documents/${id}/flashcards`),

  generateQuiz: (id, count) => api.post(`/documents/${id}/quiz`, { count }),
  getQuizzes: (id) => api.get(`/documents/${id}/quiz`),

  askQuestion: (id, question) => api.post(`/documents/${id}/ask`, { question }),
  generateTTS: (id, text) => api.post(`/documents/${id}/tts`, { text }),
};
