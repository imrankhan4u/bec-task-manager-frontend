import axios from 'axios';
import { logout } from '../contexts/AuthContext'; // ✅ we'll export logout from context

const instance = axios.create({
  baseURL: 'http://localhost:5000',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Global error interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      logout(); // Call the logout function from AuthContext
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default instance;
