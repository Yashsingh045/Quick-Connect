// In authService.js
import api from './api';

// Request OTP for registration
export const requestOTP = async (email) => {
  try {
    const response = await api.post('/auth/request-otp', { email });
    return { 
      success: true, 
      data: response.data 
    };
  } catch (error) {
    console.error('OTP request error:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to send OTP' 
    };
  }
};

// Verify OTP
export const verifyOTP = async (email, otp) => {
  try {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return { 
      success: true, 
      data: response.data 
    };
  } catch (error) {
    console.error('OTP verification error:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Invalid OTP' 
    };
  }
};

// Register user with OTP verification
export const register = async (userData) => {
  try {
    // This will be called after OTP is verified
    const response = await api.post('/auth/register', userData);
    return { 
      success: true, 
      data: response.data,
      message: 'Registration successful! Please log in.'
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Registration failed' 
    };
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return { 
      success: true, 
      data: response.data 
    };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Login failed' 
    };
  }
};