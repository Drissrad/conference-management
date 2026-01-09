import axios from 'axios';

// Configuration - Choisir le mode de connexion
// Option 1: Via Gateway (production) ✅ ACTIF
const GATEWAY_URL = 'http://localhost:9999';
const conferenceBaseURL = `${GATEWAY_URL}/conference-service/api`;
const keynoteBaseURL = `${GATEWAY_URL}/keynote-service/api`;

// Option 2: Appels directs (développement) - DÉSACTIVÉ
// const conferenceBaseURL = 'http://localhost:8082/api';
// const keynoteBaseURL = 'http://localhost:8081/api';

// API instances
const conferenceApi = axios.create({
  baseURL: conferenceBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const keynoteApi = axios.create({
  baseURL: keynoteBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== Conference Service ====================

export const conferenceService = {
  // Get all conferences
  getAll: () => conferenceApi.get('/conferences'),

  // Get conference by ID
  getById: (id) => conferenceApi.get(`/conferences/${id}`),

  // Get conference with keynote details
  getByIdWithKeynote: (id) => conferenceApi.get(`/conferences/${id}/full`),

  // Get conferences by type
  getByType: (type) => conferenceApi.get(`/conferences/type/${type}`),

  // Get conferences by keynote
  getByKeynoteId: (keynoteId) => conferenceApi.get(`/conferences/keynote/${keynoteId}`),

  // Create conference
  create: (conference) => conferenceApi.post('/conferences', conference),

  // Update conference
  update: (id, conference) => conferenceApi.put(`/conferences/${id}`, conference),

  // Delete conference
  delete: (id) => conferenceApi.delete(`/conferences/${id}`),

  // Get reviews for a conference
  getReviews: (conferenceId) => conferenceApi.get(`/conferences/${conferenceId}/reviews`),

  // Add review to a conference
  addReview: (conferenceId, review) => conferenceApi.post(`/conferences/${conferenceId}/reviews`, review),

  // Delete review
  deleteReview: (reviewId) => conferenceApi.delete(`/conferences/reviews/${reviewId}`),
};

// ==================== Keynote Service ====================

export const keynoteService = {
  // Get all keynotes
  getAll: () => keynoteApi.get('/keynotes'),

  // Get keynote by ID
  getById: (id) => keynoteApi.get(`/keynotes/${id}`),

  // Create keynote
  create: (keynote) => keynoteApi.post('/keynotes', keynote),

  // Update keynote
  update: (id, keynote) => keynoteApi.put(`/keynotes/${id}`, keynote),

  // Delete keynote
  delete: (id) => keynoteApi.delete(`/keynotes/${id}`),
};

// Export par défaut
const api = { conferenceService, keynoteService };
export default api;

