import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Methods

/**
 * Signup - Register a new user
 */
export const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

/**
 * Login - Authenticate user
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify({
      userId: response.data.userId,
      username: response.data.username,
      email: response.data.email,
      role: response.data.role
    }));
  }
  return response.data;
};

/**
 * Logout - Clear authentication data
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Get all users
 */
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

/**
 * Get user by ID
 */
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

/**
 * Update user
 */
export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

/**
 * Delete user
 */
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

/**
 * Get stored user data
 */
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Check if current user is admin
 */
export const isAdmin = () => {
  const user = getStoredUser();
  return user && user.role === 'ADMIN';
};

export default api;
