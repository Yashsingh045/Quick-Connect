import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const API_BASE = 'http://localhost:3000';

export default function Login({ onSuccess }) {
  const extra = Constants.expoConfig?.extra || {};
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: extra.googleExpoClientId,
    iosClientId: extra.googleIosClientId,
    androidClientId: extra.googleAndroidClientId,
    webClientId: extra.googleWebClientId,
    scopes: ['profile', 'email'],
    responseType: 'id_token',
    selectAccount: true,
  });

  const [loading, setLoading] = useState(false);

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
      }
    };
    run();
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in to continue</Text>
      <TouchableOpacity
        disabled={!request || loading}
        onPress={() => promptAsync({ useProxy: true })}
        style={[styles.googleBtn, (!request || loading) && styles.disabled]}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Continue with Google</Text>}
      </TouchableOpacity>
      <Text style={styles.hint}>
        If you are new, we will create your account automatically with Google.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
  googleBtn: { backgroundColor: '#1677ff', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 10 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  disabled: { opacity: 0.6 },
  hint: { color: '#64748b', fontSize: 12, marginTop: 12, textAlign: 'center' },
});
