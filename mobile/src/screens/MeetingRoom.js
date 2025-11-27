import React, { useState, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert, PermissionsAndroid, Platform, Share, Dimensions } from 'react-native';
import ZegoUIKitPrebuiltVideoConference, { ZegoMenuBarButtonName } from '@zegocloud/zego-uikit-prebuilt-video-conference-rn';
import { ZegoLayoutMode } from '@zegocloud/zego-uikit-rn';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const { width, height } = Dimensions.get('window');

const MeetingRoom = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { roomName } = route.params || {};
  const { user } = useAuth();

  const [zegoConfig, setZegoConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);
  const zegoRef = useRef(null);


  const cleanRoomName = roomName ? roomName.trim().toLowerCase().replace(/\s+/g, '-') : '';
  console.log('Joining room with code:', cleanRoomName);
  useEffect(() => {
    if (!cleanRoomName) {
      Alert.alert('Error', 'No meeting room ID provided.');
      navigation.goBack();
    }
  }, [cleanRoomName, navigation]);

  const onShare = async () => {
    try {
      await Share.share({
        message: `Join my video meeting on Quick Connect!\n\nMeeting Code: ${cleanRoomName}\n\nEnter this code in the app to join.`,
        title: 'Join Quick Connect Meeting',
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const calculateLayout = useMemo(() => {
    if (!participantCount || participantCount <= 1) {
      return {
        mode: 1, // GALLERY mode
        itemSize: { width: '100%', height: '100%' },
        itemSpacing: 0,
        scrollDirection: 'horizontal',
        maxPerRow: 1,
        maxPerColumn: 1,
        aspectRatio: 16 / 9
      };
    }

    if (participantCount === 2) {
      return {
        mode: 2, // GRID mode
        itemSize: {
          width: '50%',
          height: '100%'
        },
        itemSpacing: 2,
        maxPerRow: 2,
        maxPerColumn: 1,
        aspectRatio: 9 / 16
      };
    }

    if (participantCount <= 4) {
      return {
        mode: 2,
        itemSize: {
          width: '50%',
          height: '50%'
        },
        itemSpacing: 2,
        maxPerRow: 2,
        maxPerColumn: 2,
        aspectRatio: 1
      };
    }

    if (participantCount <= 9) {
      return {
        mode: 2,
        itemSize: {
          width: '33.33%',
          height: '33.33%'
        },
        itemSpacing: 2,
        maxPerRow: 3,
        maxPerColumn: 3,
        aspectRatio: 1
      };
    }

    if (participantCount <= 16) {
      return {
        mode: 2,
        itemSize: {
          width: '25%',
          height: '25%'
        },
        itemSpacing: 1,
        maxPerRow: 4,
        maxPerColumn: 4,
        aspectRatio: 1
      };
    }

    return {
      mode: 2,
      itemSize: {
        width: '20%',
        height: '20%'
      },
      itemSpacing: 1,
      maxPerRow: 5,
      maxPerColumn: Math.ceil(participantCount / 5),
      aspectRatio: 1
    };
  }, [participantCount]);

  const conferenceConfig = useMemo(() => {
    return {
      onLeave: () => {
        navigation.goBack();
      },
      turnOnCameraWhenJoining: true,
      turnOnMicrophoneWhenJoining: true,
      useSpeakerWhenJoining: true,

      roomConfig: {
        role: 'Host',
        enableUserInRoomNotification: true,
        enableUserJoinNotification: true,
        enableUserLeaveNotification: true,
      },

      layout: calculateLayout,

      audioVideoViewConfig: {
        showUserNameOnView: true,
        showSoundWavesInAudioMode: true,
        useVideoViewAspectFill: true,
        videoViewConfig: {
          fullscreenButtonBackgroundColor: 'rgba(0,0,0,0.3)',
        },
      },

      bottomMenuBarConfig: {
        buttons: [
          ZegoMenuBarButtonName.toggleCameraButton,
          ZegoMenuBarButtonName.toggleMicrophoneButton,
          ZegoMenuBarButtonName.switchCameraButton,
          ZegoMenuBarButtonName.switchAudioOutputButton,
          ZegoMenuBarButtonName.chatButton,
          ZegoMenuBarButtonName.showMemberListButton,
          ZegoMenuBarButtonName.leaveButton,
          ZegoMenuBarButtonName.screenSharingButton
        ],
        maxCount: 8,
        backgroundColor: '#1B1B1B',
        buttonColor: '#FFFFFF',
        buttonHoverColor: '#2B5BFF',
        buttonDisable: false,
      },

      topMenuBarConfig: {
        title: `Room: ${cleanRoomName}`,
        buttons: [
          {
            icon: 'icon-share',
            onClick: onShare,
          },
        ],
        isVisible: true,
        backgroundColor: '#1B1B1B',
        height: 50,
        titleTextColor: '#FFFFFF',
        buttonColor: '#FFFFFF',
        buttonHoverColor: '#2B5BFF',
      },

      participantConfig: {
        muteAllVideo: false,
        muteAllAudio: false,
        showUserJoinConfirm: true,
        showRemoveUserConfirm: true,
        onUserJoin: (userList) => {
          setParticipantCount(prev => prev + userList.length);
        },
        onUserLeave: (userList) => {
          setParticipantCount(prev => Math.max(1, prev - userList.length));
        },
      },
      onJoinRoom: (roomID, error, extendedData) => {
        if (error === 0) {
          if (zegoRef.current) {
            zegoRef.current.getUserList().then(users => {
              setParticipantCount(users.length);
            });
          }
        }
      },
      ref: (conference) => {
        zegoRef.current = conference;
      }
    };
  }, [navigation, cleanRoomName, calculateLayout]);

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

        if (response.data?.success && response.data.data) {
          const { appID, token: zegoToken, roomID } = response.data.data;

          if (!appID || !zegoToken) {
            throw new Error('Invalid config response from server');
          }

          const uniqueUserID = `${String(user._id || user.id)}_${Math.floor(Math.random() * 10000)}`;

          setZegoConfig({
            appID: parseInt(appID),
            token: zegoToken,
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
          if (err.response?.status === 401) {
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

  if (loading || !permissionsGranted || !zegoConfig) {
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
      <View style={styles.participantCountContainer}>
        <Text style={styles.participantCountText}>
          {participantCount} {participantCount === 1 ? 'Participant' : 'Participants'}
        </Text>
      </View>

      <ZegoUIKitPrebuiltVideoConference
        appID={zegoConfig.appID}
        userID={zegoConfig.userID}
        userName={zegoConfig.userName}
        conferenceID={cleanRoomName}
        config={conferenceConfig}
        token={zegoConfig.token}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B1B1B',
  },
  loadingText: {
    marginTop: 10,
    color: '#FFFFFF',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  participantCountContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    zIndex: 100,
  },
  participantCountText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MeetingRoom;