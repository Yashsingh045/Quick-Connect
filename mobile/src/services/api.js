import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Determine the correct base URL based on the platform
const getBaseUrl = () => {
  if (__DEV__) {
    // For Android emulator, use 10.0.2.2 to access localhost
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000/api';
    }
    // For iOS simulator, use localhost
    return 'http://localhost:3000/api';
  }
  // In production, use your production API URL
  return 'https://your-production-api.com/api';
};

// Create axios instance with base URL
const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Helper function to handle API errors
const handleApiError = (error) => {
  // Default error message
  let errorMessage = 'An unexpected error occurred. Please try again.';
  let statusCode = null;
  let errorData = null;

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    statusCode = error.response.status;
    errorData = error.response.data;
    
    // Handle specific status codes
    switch (statusCode) {
      case 400:
        errorMessage = errorData?.message || 'Bad request. Please check your input.';
        break;
      case 401:
        errorMessage = 'Your session has expired. Please log in again.';
        // Clear auth tokens
        AsyncStorage.removeItem('accessToken');
        break;
      case 403:
        errorMessage = 'You do not have permission to perform this action.';
        break;
      case 404:
        errorMessage = 'The requested resource was not found.';
        break;
      case 422: // Validation error
        errorMessage = 'Validation failed. Please check your input.';
        if (errorData?.errors) {
          // Join all validation error messages
          errorMessage = Object.values(errorData.errors)
            .flat()
            .join('\n');
        }
        break;
      case 500:
        errorMessage = 'A server error occurred. Please try again later.';
        break;
      default:
        errorMessage = errorData?.message || `Error: ${statusCode}`;
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
    errorMessage = 'Unable to connect to the server. Please check your internet connection.';
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Request setup error:', error.message);
    errorMessage = error.message || 'Network error. Please try again.';
  }

  // Log the full error in development
  if (__DEV__) {
    console.error('API Error Details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
      },
    });
  }

  // Return a standardized error object
  return {
    success: false,
    message: errorMessage,
    status: statusCode,
    data: errorData,
    originalError: __DEV__ ? error : undefined, // Only include in development
  };
};

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (__DEV__) {
        console.log('API Request:', {
          url: config.url,
          method: config.method,
          data: config.data,
        });
      }
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return Promise.reject(handleApiError(error));
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(handleApiError(error));
  }
);

// Response interceptor to handle errors and transform responses
api.interceptors.response.use(
  (response) => {
    // Transform successful responses to include success flag
    const transformedResponse = {
      ...response,
      data: {
        success: true,
        ...(response.data || {})
      }
    };

    if (__DEV__) {
      console.log('API Response:', {
        status: response.status,
        data: response.data,
      });
    }
    return transformedResponse;
  },
  (error) => {
    const errorResponse = handleApiError(error);
    return Promise.reject(errorResponse);
  }
);

export default api;