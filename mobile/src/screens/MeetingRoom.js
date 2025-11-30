import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ZegoUIKitPrebuiltVideoConference from '@zegocloud/zego-uikit-prebuilt-video-conference-rn';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const MeetingRoom = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { roomName = 'default-room' } = route.params || {};
  const { user } = useAuth();
  const componentMounted = useRef(true);

  const [zegoConfig, setZegoConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch config only once when component mounts
  useEffect(() => {
    let isMounted = true;

    const fetchConfig = async () => {
      try {
        if (!isMounted) return;
        
        setLoading(true);
        setError(null);

        // Check if user is authenticated
        if (!user) {
          throw new Error('You must be logged in to join a meeting');
        }

        // Fetch Zego config with token from server
        // Optionally use room-specific token endpoint for better security
        const endpoint = roomName && roomName !== 'default-room'
          ? `/zego/token/${roomName}`
          : '/zego/config';

        const response = await api.get(endpoint);

        if (!isMounted) return;

        if (response.data && response.data.success && response.data.data) {
          const { appID, token } = response.data.data;

          if (!appID || !token) {
            throw new Error('Invalid config response from server');
          }

          setZegoConfig({
            appID: appID,
            token: token,
          });
        } else {
          throw new Error('Invalid response format from server');
        }
      } catch (error) {
        if (!isMounted) return;
        
        console.error('Failed to fetch Zego config:', error);

        let errorMessage = error.response?.data?.message ||
          error.message ||
          'Could not load video conference configuration.';

        // Provide more specific error messages
        if (error.response?.status === 401) {
          errorMessage = 'Authentication required. Please log in and try again.';
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (!error.response) {
          errorMessage = 'Network error. Please check your internet connection.';
        }

        setError(errorMessage);

        // Show user-friendly error alert
        Alert.alert(
          'Connection Error',
          errorMessage + '\n\nPlease make sure you are logged in and try again.',
          [
            {
              text: 'Go Back',
              onPress: () => {
                componentMounted.current = false;
                navigation.goBack();
              },
              style: 'cancel'
            },
            {
              text: 'Retry',
              onPress: () => {
                setError(null);
                fetchConfig();
              }
            }
          ]
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchConfig();

    return () => {
      isMounted = false;
      componentMounted.current = false;
    };
  }, [user?.id, roomName]); // Removed navigation from dependencies

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1677ff" />
        <Text style={styles.loadingText}>Preparing meeting room...</Text>
        <Text style={styles.loadingSubtext}>Please wait</Text>
      </View>
    );
  }

  if (error && !zegoConfig) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Unable to Join Meeting</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setLoading(true);
              // Retry fetching config
              const fetchConfig = async () => {
                try {
                  const response = await api.get('/zego/config');
                  if (response.data && response.data.success && response.data.data) {
                    setZegoConfig({
                      appID: response.data.data.appID,
                      token: response.data.data.token,
                    });
                  }
                } catch (err) {
                  setError(err.response?.data?.message || err.message);
                } finally {
                  setLoading(false);
                }
              };
              fetchConfig();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!zegoConfig) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load configuration.</Text>
      </View>
    );
  }

  // Use authenticated user ID or generate a unique one
  const userID = user?.id ? String(user.id) : String(Math.floor(Math.random() * 100000));
  const userName = user?.name || user?.userName || user?.username || `User_${userID}`;

  // Ensure roomName is valid - must be a non-empty string
  const validRoomName = roomName && roomName !== 'default-room' && String(roomName).trim()
    ? String(roomName).trim()
    : `room-${Date.now()}`;

  // Don't render until we have config
  if (!zegoConfig || !zegoConfig.appID || !zegoConfig.token) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1677ff" />
        <Text style={styles.loadingText}>Loading meeting configuration...</Text>
      </View>
    );
  }

  // Memoize callbacks to prevent re-renders
  const handleLeave = useCallback(() => {
    console.log('User left the meeting');
    componentMounted.current = false;
    navigation.goBack();
  }, [navigation]);

  const handleError = useCallback((errorCode, errorMessage) => {
    console.error('Zego SDK Error:', errorCode, errorMessage);
    Alert.alert(
      'Meeting Error',
      `Error code: ${errorCode}\n${errorMessage || 'Unknown error'}`,
      [{ text: 'OK', onPress: () => {
        componentMounted.current = false;
        navigation.goBack();
      }}]
    );
  }, [navigation]);

  const handleRoomStateChanged = useCallback((state) => {
    console.log('Room state changed:', state);
  }, []);

  const handleUserCountChanged = useCallback((userList) => {
    console.log('Users in room:', userList.length, userList.map(u => u.userID));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ZegoUIKitPrebuiltVideoConference
        key={`zego-${zegoConfig.appID}-${validRoomName}-${userID}`}
        appID={zegoConfig.appID}
        token={zegoConfig.token}
        userID={userID}
        userName={userName}
        conferenceID={validRoomName}
        config={{
          turnOnCameraWhenJoining: true,
          turnOnMicrophoneWhenJoining: true,
          useFrontFacingCamera: true,
          onLeave: handleLeave,
          onError: handleError,
          onRoomStateChanged: handleRoomStateChanged,
          onUserCountOrPropertyChanged: handleUserCountChanged,
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  loadingSubtext: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    color: '#64748b',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#1677ff',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    minWidth: 120,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: 120,
  },
  backButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default MeetingRoom;