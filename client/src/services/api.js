import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000/api`,
});

// Request interceptor to automatically add authorization header
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/400x300';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const backendBase = `${window.location.protocol}//${window.location.hostname}:5000`;
  return `${backendBase}${imagePath}`;
};

export default API;
