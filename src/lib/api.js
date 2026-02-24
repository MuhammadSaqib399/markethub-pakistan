/**
 * API Client
 * Centralized HTTP client for all API calls
 * Handles token injection and error formatting
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

// Get auth token from localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("markethub_token");
  }
  return null;
};

// Generic fetch wrapper with auth header injection
const fetchAPI = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // Don't set Content-Type for FormData (let browser set boundary)
  if (options.body instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// ==================== AUTH API ====================
export const authAPI = {
  register: (userData) =>
    fetchAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  getMe: () => fetchAPI("/auth/me"),

  updateProfile: (data) =>
    fetchAPI("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  changePassword: (data) =>
    fetchAPI("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  toggleSaveAd: (adId) =>
    fetchAPI(`/auth/save-ad/${adId}`, { method: "POST" }),

  deleteAccount: () =>
    fetchAPI("/auth/delete-account", { method: "DELETE" }),

  forgotPassword: (email) =>
    fetchAPI("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token, password) =>
    fetchAPI("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),
};

// ==================== ADS API ====================
export const adsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/ads?${query}`);
  },

  getFeatured: () => fetchAPI("/ads/featured"),

  getRecent: () => fetchAPI("/ads/recent"),

  getByCategory: (category, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/ads/category/${encodeURIComponent(category)}?${query}`);
  },

  getById: (id) => fetchAPI(`/ads/${id}`),

  create: (formData) =>
    fetchAPI("/ads", {
      method: "POST",
      body: formData, // FormData for file uploads
    }),

  update: (id, formData) =>
    fetchAPI(`/ads/${id}`, {
      method: "PUT",
      body: formData,
    }),

  delete: (id) =>
    fetchAPI(`/ads/${id}`, { method: "DELETE" }),

  markSold: (id) =>
    fetchAPI(`/ads/${id}/sold`, { method: "PATCH" }),

  getMyAds: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/ads/user/my-ads?${query}`);
  },

  getSaved: () => fetchAPI("/ads/saved"),
};

// ==================== MESSAGES API ====================
export const messagesAPI = {
  getConversations: () => fetchAPI("/messages/conversations"),

  startConversation: (adId, sellerId) =>
    fetchAPI("/messages/conversations", {
      method: "POST",
      body: JSON.stringify({ adId, sellerId }),
    }),

  getMessages: (conversationId, page = 1) =>
    fetchAPI(`/messages/conversations/${conversationId}?page=${page}`),

  sendMessage: (conversationId, text) =>
    fetchAPI(`/messages/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  markRead: (conversationId) =>
    fetchAPI(`/messages/conversations/${conversationId}/read`, {
      method: "PATCH",
    }),
};

// ==================== ADMIN API ====================
export const adminAPI = {
  getAnalytics: () => fetchAPI("/admin/analytics"),
  getUsers: (params) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/admin/users?${query}`);
  },
  toggleUserActive: (id) =>
    fetchAPI(`/admin/users/${id}/toggle-active`, { method: "PATCH" }),
  verifySeller: (id) =>
    fetchAPI(`/admin/users/${id}/verify-seller`, { method: "PATCH" }),
  getAds: (params) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/admin/ads?${query}`);
  },
  approveAd: (id) =>
    fetchAPI(`/admin/ads/${id}/approve`, { method: "PATCH" }),
  rejectAd: (id, reason) =>
    fetchAPI(`/admin/ads/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    }),
  deleteAd: (id) =>
    fetchAPI(`/admin/ads/${id}`, { method: "DELETE" }),
  getReports: (params) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/admin/reports?${query}`);
  },
  reviewReport: (id, data) =>
    fetchAPI(`/admin/reports/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// ==================== REPORTS API ====================
export const reportsAPI = {
  submit: (data) =>
    fetchAPI("/reports", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ==================== LOCATIONS API ====================
export const getLocations = () => fetchAPI("/locations");
