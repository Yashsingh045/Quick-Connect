import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
  Share,
  TouchableOpacity,
} from 'react-native';
import ZegoUIKitPrebuiltVideoConference, { ZegoMenuBarButtonName } from '@zegocloud/zego-uikit-prebuilt-video-conference-rn';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const MeetingRoom = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { roomName, title } = route.params || {};
  const { user } = useAuth();

  const [zegoConfig, setZegoConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  const cleanRoomName = (roomName || '').trim();
  const currentUserLabel = user?.userName || user?.name || user?.email || 'Guest';

  // Simple leave handler used both by header button and config.onLeave
  const handleLeave = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (!cleanRoomName) {
      Alert.alert('Error', 'No meeting room ID provided.');
      navigation.goBack();
    }
  }, [cleanRoomName, navigation]);

  const onShare = async () => {
    try {
      await Share.share({
        message: `Join my video meeting on Quick Connect!\n\nTitle: ${title || 'Instant Meeting'
          }\nCode: ${cleanRoomName}\n\nEnter this code in the app to join.`,
        title: 'Join Quick Connect Meeting',
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const conferenceConfig = useMemo(
    () => ({
      onLeave: handleLeave,
      turnOnCameraWhenJoining: true,
      turnOnMicrophoneWhenJoining: true,
      useSpeakerWhenJoining: true,
      layout: { mode: 1 }, // Gallery
      audioVideoViewConfig: {
        showUserNameOnView: true,
        showSoundWavesInAudioMode: true,
      },
      bottomMenuBarConfig: {
        buttons: [
          ZegoMenuBarButtonName.toggleCameraButton,
          ZegoMenuBarButtonName.toggleMicrophoneButton,
          ZegoMenuBarButtonName.switchCameraButton,
          ZegoMenuBarButtonName.switchAudioOutputButton,
          ZegoMenuBarButtonName.showMemberListButton,
          ZegoMenuBarButtonName.hangUpButton,
        ],
        maxCount: 6,
      },
      topMenuBarConfig: {
        buttons: [],
        isVisible: false,
      },
      // Disable reporting to prevent NullPointerException
      disableReporting: true,
    }),
    [handleLeave],
  );

  // Permissions
  useEffect(() => {
    const checkPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          const permissions = [
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ];
          if (Platform.Version >= 31) {
            permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
          }
          const granted = await PermissionsAndroid.requestMultiple(permissions);
          const cameraGranted =
            granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED;
          const audioGranted =
            granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED;

          if (cameraGranted && audioGranted) {
            setPermissionsGranted(true);
          } else {
            Alert.alert(
              'Permissions Required',
              'Camera and Microphone permissions are needed to join the call.',
              [{ text: 'OK', onPress: () => navigation.goBack() }],
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

  // Fetch Zego token/config ONCE per open of this screen
  useEffect(() => {
    if (!permissionsGranted || !cleanRoomName) return;

    let isMounted = true;

    const fetchConfig = async () => {
      try {
        setLoading(true);
        setError(null);

        const authToken = await AsyncStorage.getItem('accessToken');
        if (!authToken) {
          Alert.alert('Session Expired', 'Please log in again.');
          navigation.goBack();
          return;
        }

        const resp = await api.get(`/zego/token/${cleanRoomName}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (!isMounted) return;

        if (resp.data?.success && resp.data.data) {
          const { appID, token, userID, userName } = resp.data.data;

          // Validate all required fields
          if (!appID || !token || !userID || !userName) {
            console.error('Missing Zego config fields:', { appID, token, userID, userName });
            throw new Error('Incomplete Zego configuration received from server');
          }

          const parsedAppID = Number(appID);
          if (isNaN(parsedAppID) || parsedAppID === 0) {
            console.error('Invalid appID:', appID);
            throw new Error('Invalid Zego App ID');
          }

          setZegoConfig({
            appID: parsedAppID,
            token: String(token),
            userID: String(userID),
            userName: String(userName),
            conferenceID: cleanRoomName,
          });
        } else {
          throw new Error('Failed to fetch Zego configuration');
        }
      } catch (err) {
        if (isMounted) {
          console.error('Zego Config Error:', err);
          setError(err.message || 'Failed to initialize meeting');
          Alert.alert('Error', 'Could not join the meeting room.');
          navigation.goBack();
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchConfig();

    return () => {
      isMounted = false;
    };
  }, [permissionsGranted, cleanRoomName, navigation]);

  if (loading || !permissionsGranted) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>
          {!permissionsGranted ? 'Checking permissions...' : 'Preparing your meeting...'}
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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title || 'Instant Meeting'}</Text>
          <Text style={styles.subtitle}>Code: {cleanRoomName}</Text>
          <Text style={styles.subtitle}>You: {currentUserLabel}</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => Alert.alert('Screen Share', 'Feature coming soon')} style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Share Screen</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onShare} style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLeave} style={styles.leaveButton}>
            <Text style={styles.leaveButtonText}>Leave</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Zego video area */}
      <View style={styles.videoContainer}>
        <ZegoUIKitPrebuiltVideoConference
          appID={zegoConfig.appID}
          token={zegoConfig.token}
          userID={zegoConfig.userID}
          userName={zegoConfig.userName}
          conferenceID={zegoConfig.conferenceID}
          config={conferenceConfig}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f1a' },
  videoContainer: { flex: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b0f1a',
  },
  loadingText: { marginTop: 10, fontSize: 16, color: '#ccc' },
  errorText: { color: '#ff4d4f', fontSize: 16 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#f9fafb' },
  subtitle: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  shareButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3b82f6',
    marginRight: 8,
  },
  shareButtonText: { color: '#3b82f6', fontWeight: '600', fontSize: 12 },
  leaveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#ef4444',
  },
  leaveButtonText: { color: '#fff', fontWeight: '600', fontSize: 12 },
});

export default MeetingRoom;