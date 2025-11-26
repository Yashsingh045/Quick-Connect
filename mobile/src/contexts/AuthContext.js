// mobile/src/contexts/AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (name, email, password, otp) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        otp
      });

      if (response.data.success) {
        // Optionally log the user in after successful registration
        const { user, tokens } = response.data.data;
        if (tokens) {
          await AsyncStorage.setItem('accessToken', tokens.accessToken);
          if (tokens.refreshToken) {
            await AsyncStorage.setItem('refreshToken', tokens.refreshToken);
          }
          setUser(user);
        }
        return response.data;
      }
      throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };
const login = async (email, password) => {
  setIsLoading(true);
  setError(null);
  try {
    console.log('Login attempt with:', { email, passwordLength: password.length });
    
    const response = await api.post('/auth/login', {
      email: email.trim().toLowerCase(),
      password: password
    });

    console.log('Login response:', response.data);

    if (response.data.success) {
      const { user, tokens } = response.data.data;
      if (tokens) {
        await AsyncStorage.setItem('accessToken', tokens.accessToken);
        if (tokens.refreshToken) {
          await AsyncStorage.setItem('refreshToken', tokens.refreshToken);
        }
        setUser(user);
      }
      return { success: true, data: response.data.data };
    }
    throw new Error(response.data.message || 'Login failed');
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    const message = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
    setError(message);
    return { success: false, error: message };
  } finally {
    setIsLoading(false);
  }
};


  const logout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};