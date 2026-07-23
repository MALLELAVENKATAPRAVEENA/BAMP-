import axios from 'axios';

// Create a preconfigured Axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to format errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred during communication with the server.';
    return Promise.reject(new Error(message));
  }
);

export default api;
