import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  TextInput,
  ScrollView 
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const API_BASE = 'http://localhost:3000';

export default function Login({ onSuccess }) {
  const extra = Constants.expoConfig?.extra || {};
  
  // Configure Google OAuth with proper fallbacks
  const googleConfig = {
    expoClientId: extra.googleExpoClientId,
    iosClientId: extra.googleIosClientId,
    androidClientId: extra.googleAndroidClientId || extra.googleExpoClientId,
    webClientId: extra.googleWebClientId || extra.googleExpoClientId,
    scopes: ['profile', 'email'],
    responseType: 'id_token',
    selectAccount: true,
  };

  const [request, response, promptAsync] = Google.useAuthRequest(googleConfig);

  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const run = async () => {
      if (response?.type === 'success') {
        setLoading(true);
        try {
          const idToken = response?.authentication?.idToken || response?.params?.id_token;
          if (!idToken) throw new Error('No idToken from Google');

          const res = await fetch(`${API_BASE}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
          });

          if (!res.ok) {
            const msg = await res.text();
            throw new Error(msg || 'Auth failed');
          }

          const data = await res.json();
          // data: { token, user }
          onSuccess?.(data);
        } catch (e) {
          console.error('Google login error:', e, '\nresponse:', response);
          Alert.alert('Login failed', e.message);
        } finally {
          setLoading(false);
        }
      } else if (response?.type === 'error') {
        console.error('Google OAuth error:', response);
        Alert.alert('Authorization Error', 'Google sign-in was cancelled or failed. Please try again or use email/password login.');
        setLoading(false);
      }
    };
    run();
  }, [response]);

  const handleManualLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.email,
          password: formData.password
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await res.json();
      onSuccess?.(data);
    } catch (error) {
      console.error('Manual login error:', error);
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualRegister = async () => {
    if (!formData.email || !formData.password || !formData.name) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.email,
          email: formData.email,
          password: formData.password,
          name: formData.name
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      // Auto-login after successful registration
      const loginRes = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.email,
          password: formData.password
        }),
      });

      if (!loginRes.ok) {
        throw new Error('Registration successful, but auto-login failed');
      }

      const data = await loginRes.json();
      onSuccess?.(data);
    } catch (error) {
      console.error('Manual registration error:', error);
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {isRegistering ? 'Create Account' : 'Sign in to continue'}
        </Text>

        {/* Google Login */}
        <TouchableOpacity
          disabled={!request || loading}
          onPress={() => {
            console.log('Google OAuth Config:', googleConfig);
            console.log('Request object:', request);
            promptAsync({ useProxy: true });
          }}
          style={[styles.googleBtn, (!request || loading) && styles.disabled]}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Continue with Google</Text>}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Manual Login/Register Form */}
        {isRegistering && (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formData.name}
            onChangeText={(text) => setFormData({...formData, name: text})}
            autoCapitalize="words"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({...formData, email: text})}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(text) => setFormData({...formData, password: text})}
          secureTextEntry
        />

        {isRegistering && (
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
            secureTextEntry
          />
        )}

        <TouchableOpacity
          style={styles.manualBtn}
          onPress={isRegistering ? handleManualRegister : handleManualLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>
              {isRegistering ? 'Create Account' : 'Sign In'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleMode} style={styles.toggleBtn}>
          <Text style={styles.toggleText}>
            {isRegistering 
              ? 'Already have an account? Sign In' 
              : "Don't have an account? Create one"
            }
          </Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          {isRegistering 
            ? 'Create your account to start connecting'
            : 'If you are new, we will create your account automatically with Google.'
          }
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 60,
  },
  title: { 
    fontSize: 24, 
    fontWeight: '700', 
    marginBottom: 32,
    textAlign: 'center',
    color: '#0f172a'
  },
  googleBtn: { 
    backgroundColor: '#1677ff', 
    paddingVertical: 16, 
    paddingHorizontal: 20, 
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center'
  },
  manualBtn: {
    backgroundColor: '#0f172a',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'center'
  },
  btnText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '700' 
  },
  disabled: { 
    opacity: 0.6 
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#64748b',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  toggleBtn: {
    marginBottom: 16,
  },
  toggleText: {
    color: '#1677ff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  hint: { 
    color: '#64748b', 
    fontSize: 12, 
    textAlign: 'center',
    lineHeight: 18,
  },
});
