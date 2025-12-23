// src/services/api.ts
import axios from 'axios';

// Determine the base API URL based on environment
const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side (browser)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      // Development
      return 'https://localhost:7000/api';
    } else {
      // Production (Render) - use the same origin for API calls
      // This means API calls will go to https://product-services-3nof.onrender.com/api
      return `${window.location.protocol}//${window.location.host}/api`;
    }
  }
  // Server-side (fallback)
  return process.env.REACT_APP_API_URL || 'https://localhost:7000/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Ensure we're using the correct base URL
    config.baseURL = getApiBaseUrl();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, clear it and redirect to login
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;