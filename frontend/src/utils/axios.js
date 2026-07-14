import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Proxy will be setup in vite.config.js
  withCredentials: true, // Important for cookies
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add headers here if needed, but since we use httpOnly cookies,
    // the browser will automatically attach them.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized globally if needed
    if (error.response && error.response.status === 401) {
      // e.g., dispatch a logout action, redirect to login
      console.log('Unauthorized, logging out...');
    }
    return Promise.reject(error);
  }
);

export default api;
