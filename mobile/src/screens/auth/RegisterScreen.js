// mobile/src/screens/auth/RegisterScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Registration form, 2: OTP verification
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleRequestOTP = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/request-otp', { email });
      if (response.data.success) {
        setStep(2);
        setCountdown(60); // 60 seconds countdown
        Alert.alert('Success', 'OTP sent to your email');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('OTP request error:', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        otp
      });

      if (response.data.success) {
        Alert.alert(
          'Success',
          'Registration successful! You can now log in.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (countdown > 0) return;

    try {
      const response = await api.post('/auth/request-otp', { email });
      if (response.data.success) {
        setCountdown(60);
        Alert.alert('Success', 'A new OTP has been sent to your email');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  if (step === 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <Button
          title={isLoading ? 'Sending OTP...' : 'Send OTP'}
          onPress={handleRequestOTP}
          disabled={isLoading}
        />
        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            Login
          </Text>
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Email</Text>
      <Text style={styles.subtitle}>Enter the OTP sent to {email}</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
      />
      
      <Button
        title={isLoading ? 'Verifying...' : 'Verify & Register'}
        onPress={handleRegister}
        disabled={isLoading || !otp}
      />
      
      <Text style={styles.resendText}>
        Didn't receive the code?{' '}
        <Text 
          style={[styles.resendLink, countdown > 0 && styles.disabledLink]}
          onPress={resendOTP}
          disabled={countdown > 0}
        >
          {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
        </Text>
      </Text>
      
      <Text 
        style={styles.backLink}
        onPress={() => setStep(1)}
      >
        Back to Registration
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  loginText: {
    marginTop: 20,
    textAlign: 'center',
  },
  loginLink: {
    color: 'blue',
    fontWeight: 'bold',
  },
  resendText: {
    marginTop: 20,
    textAlign: 'center',
  },
  resendLink: {
    color: 'blue',
    fontWeight: 'bold',
  },
  disabledLink: {
    color: '#999',
  },
  backLink: {
    marginTop: 15,
    textAlign: 'center',
    color: 'blue',
  },
});

export default RegisterScreen;