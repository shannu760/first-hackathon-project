const API_BASE = '/api/v1';

async function request(endpoint, options = {}) {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include',
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  signup: (userData) => request('/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me'),
  verifyEmail: (token) => request('/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) }),

  // Profile & Questionnaire
  getProfile: () => request('/profile'),
  updateProfile: (profile) => request('/profile', { method: 'PUT', body: JSON.stringify(profile) }),
  getQuestionnaire: () => request('/questionnaire'),
  autosaveQuestionnaire: (section, data) => request('/questionnaire/autosave', { method: 'POST', body: JSON.stringify({ section, data }) }),
  exportData: () => `${API_BASE}/profile/export`,
  deleteAccount: () => request('/profile/account', { method: 'DELETE' }),

  // Opportunities (Schemes)
  getOpportunities: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/opportunities${qs ? `?${qs}` : ''}`);
  },
  getOpportunity: (id) => request(`/opportunities/${id}`),
  toggleSaveOpportunity: (id) => request(`/opportunities/${id}/save`, { method: 'POST' }),

  // Internships
  getInternships: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/internships${qs ? `?${qs}` : ''}`);
  },
  getInternship: (id) => request(`/internships/${id}`),
  toggleSaveInternship: (id) => request(`/internships/${id}/save`, { method: 'POST' }),

  // Courses
  getCourses: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/courses${qs ? `?${qs}` : ''}`);
  },
  updateCourseProgress: (id, status, progress_pct) => request(`/courses/${id}/progress`, {
    method: 'POST',
    body: JSON.stringify({ status, progress_pct })
  }),

  // Skills & Gap
  getSkills: () => request('/skills'),
  addSkill: (skill) => request('/skills', { method: 'POST', body: JSON.stringify(skill) }),
  removeSkill: (name) => request(`/skills/${encodeURIComponent(name)}`, { method: 'DELETE' }),

  // Recommendations
  getRecommendations: () => request('/recommendations'),
  sendRecommendationFeedback: (opportunity_id, event_type, metadata) => request('/recommendations/feedback', {
    method: 'POST',
    body: JSON.stringify({ opportunity_id, event_type, metadata })
  }),

  // Copilot (Plans)
  getPlan: () => request('/copilot/plan'),
  generatePlan: (duration_days, target_role) => request('/copilot/generate-plan', {
    method: 'POST',
    body: JSON.stringify({ duration_days, target_role })
  }),
  toggleTask: (id) => request(`/copilot/tasks/${id}/toggle`, { method: 'POST' }),

  // Resume
  getResume: () => request('/resume'),
  updateResume: (resume) => request('/resume', { method: 'PUT', body: JSON.stringify(resume) }),
  getPdfUrl: () => `${API_BASE}/resume/pdf`,

  // Applications (Kanban)
  getApplications: () => request('/applications'),
  addApplication: (appData) => request('/applications', { method: 'POST', body: JSON.stringify(appData) }),
  updateApplicationStatus: (id, status, notes) => request(`/applications/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, notes })
  }),
  deleteApplication: (id) => request(`/applications/${id}`, { method: 'DELETE' }),

  // Notifications
  getNotifications: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/notifications${qs ? `?${qs}` : ''}`);
  },
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'POST' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'POST' }),

  // AI Layer
  getAiStatus: () => request('/ai/status'),
  explainResult: (payload) => request('/ai/explain', { method: 'POST', body: JSON.stringify(payload) }),
  aiChat: (payload) => request('/ai/chat', { method: 'POST', body: JSON.stringify(payload) }),
  reviewResume: (payload) => request('/ai/resume-review', { method: 'POST', body: JSON.stringify(payload) }),
  summarizeNotice: (notice_text) => request('/ai/notice-summarizer', { method: 'POST', body: JSON.stringify({ notice_text }) }),
};
