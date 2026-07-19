import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create the axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401s and token refreshing
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops if the refresh endpoint itself fails
    if (error.response?.status === 401 && originalRequest.url === '/auth/token/refresh/') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          // Send request to refresh the token
          const { data } = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh_token: refreshToken,
          });

          // Store new tokens
          localStorage.setItem('access_token', data.data.access_token);
          if (data.data.refresh_token) {
             localStorage.setItem('refresh_token', data.data.refresh_token);
          }

          // Update the original request's header and retry
          originalRequest.headers.Authorization = `Bearer ${data.data.access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, purge tokens and redirect
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
