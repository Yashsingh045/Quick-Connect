import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert, PermissionsAndroid, Platform, Share } from 'react-native';
import ZegoUIKitPrebuiltVideoConference from '@zegocloud/zego-uikit-prebuilt-video-conference-rn';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const MeetingRoom = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { roomName } = route.params || {};
  const { user } = useAuth();
  
  const [zegoConfig, setZegoConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  const cleanRoomName = roomName ? roomName.trim() : '';

  useEffect(() => {
    if (!cleanRoomName) {
      Alert.alert('Error', 'No meeting room ID provided.');
      navigation.goBack();
    }
  }, [cleanRoomName, navigation]);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Join my video meeting on Quick Connect!\n\nMeeting Code: ${cleanRoomName}\n\nEnter this code in the app to join.`,
        title: 'Join Quick Connect Meeting',
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const conferenceConfig = useMemo(() => {
    return {
      onLeave: () => {
        navigation.goBack();
      },
      // Audio/Video Defaults
      turnOnCameraWhenJoining: true,
      turnOnMicrophoneWhenJoining: true,
      useSpeakerWhenJoining: true, // CRITICAL: Ensures audio comes out of the loudspeaker

      // Layout & UI
      layout: {
        mode: 1, // Gallery/Grid View
      },
      
      // Visual Feedback for Audio
      audioVideoViewConfig: {
        showUserNameOnView: true,
        showSoundWavesInAudioMode: true, // Shows waves when someone speaks
      },

      bottomMenuBarConfig: {
        buttons: [
          'toggleCamera',
          'toggleMicrophone',
          'switchCamera',
          'switchAudioOutput', // Allows user to toggle Speaker/Earpiece/Bluetooth manually
          'chat',
          'memberList',
          'leave'
        ],
        maxCount: 7,
      },
      topMenuBarConfig: {
        buttons: [], 
        isVisible: false 
      }
    };
  }, [navigation]);

  // Enhanced Permission Check (Includes Bluetooth for Audio Routing)
  useEffect(() => {
    const checkPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          const permissions = [
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ];

          // Android 12+ (API 31+) requires Bluetooth Connect for audio routing
          if (Platform.Version >= 31) {
            permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
          }

          const granted = await PermissionsAndroid.requestMultiple(permissions);
          
          const cameraGranted = granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED;
          const audioGranted = granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED;

          if (cameraGranted && audioGranted) {
            setPermissionsGranted(true);
          } else {
            Alert.alert(
              'Permissions Required',
              'Camera and Microphone permissions are needed to join the call.',
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
          }
        } catch (err) {
          console.warn(err);
          navigation.goBack();
        }
      } else {
        setPermissionsGranted(true);
      }
    };

    checkPermissions();
  }, [navigation]);

  useEffect(() => {
    if (!permissionsGranted || !cleanRoomName) return;

    let isMounted = true;

    const fetchConfig = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await AsyncStorage.getItem('accessToken');
        
        if (!token) {
          Alert.alert('Session Expired', 'Please log in again.');
          navigation.goBack();
          return;
        }

        if (!user) {
          throw new Error('You must be logged in to join a meeting');
        }

        const endpoint = `/zego/token/${cleanRoomName}`;

        const response = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!isMounted) return;

        if (response.data && response.data.success && response.data.data) {
          const { appID, appSign } = response.data.data;

          if (!appID || !appSign) {
             throw new Error('Invalid config response from server');
          }

          const uniqueUserID = `${String(user._id || user.id)}_${Math.floor(Math.random() * 10000)}`;

          setZegoConfig({
            appID: parseInt(appID),
            appSign: appSign,
            userID: uniqueUserID, 
            userName: user.name || user.username || 'Guest',
            conferenceID: cleanRoomName,
          });
        } else {
          throw new Error('Failed to fetch Zego configuration');
        }
      } catch (err) {
        if (isMounted) {
          console.error('Zego Config Error:', err);
          
          if (err.response && err.response.status === 401) {
             Alert.alert('Session Expired', 'Your session has expired. Please log out and log in again.');
             navigation.goBack();
          } else {
             setError(err.message || 'Failed to initialize meeting');
             Alert.alert('Error', 'Could not join the meeting room.');
             navigation.goBack();
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchConfig();

    return () => {
      isMounted = false;
    };
  }, [user, cleanRoomName, navigation, permissionsGranted]);

  if (loading || !permissionsGranted) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>
          {!permissionsGranted ? 'Checking permissions...' : 'Preparing meeting room...'}
        </Text>
      </View>
    );
  }

  if (error || !zegoConfig) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Configuration failed'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.shareContainer}>
        <Text style={styles.roomIdText}>Code: {cleanRoomName}</Text>
        <Text style={styles.shareBtn} onPress={onShare}>Share</Text>
      </View>

      <ZegoUIKitPrebuiltVideoConference
        appID={zegoConfig.appID}
        appSign={zegoConfig.appSign}
        userID={zegoConfig.userID}
        userName={zegoConfig.userName}
        conferenceID={zegoConfig.conferenceID}
        config={conferenceConfig}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  shareContainer: {
    position: 'absolute',
    top: 50, 
    left: 20,
    right: 20,
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 8,
  },
  roomIdText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  shareBtn: {
    color: '#000',
    fontWeight: 'bold',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  }
});

export default MeetingRoom;