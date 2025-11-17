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

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        register,
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