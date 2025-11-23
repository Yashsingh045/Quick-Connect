// mobile/src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://your-api-url.com/api', // Replace with your API URL
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error status is 401 and we haven't tried to refresh the token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const response = await axios.post(`${baseURL}/auth/refresh-token`, { refreshToken });
        const { accessToken } = response.data;
        
        await AsyncStorage.setItem('accessToken', accessToken);
        
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (error) {
        // If refresh token fails, log the user out
        await Promise.all([
          AsyncStorage.removeItem('accessToken'),
          AsyncStorage.removeItem('refreshToken'),
        ]);
        // You might want to redirect to login here
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;