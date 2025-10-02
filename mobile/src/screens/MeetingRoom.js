import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function MeetingRoom({ meeting, auth, onBack, onEndMeeting }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [participants, setParticipants] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      isYou: true,
      avatar: '🎤',
      isMuted: false,
      isVideoOn: true,
    },
    {
      id: 2,
      name: 'Sarah',
      avatar: '☂️',
      isMuted: false,
      isVideoOn: true,
    },
    {
      id: 3,
      name: 'Maria',
      avatar: '👤',
      isMuted: true,
      isVideoOn: true,
    },
  ]);

  const [additionalParticipants, setAdditionalParticipants] = useState(5);

  const handleMute = () => {
    setIsMuted(!isMuted);

    // update local participant
    setParticipants(prev => 
      prev.map(p => p.isYou ? { ...p, isMuted: !isMuted } : p)
    );
  };

  const handleVideoToggle = () => {
    setIsVideoOff(!isVideoOff);

    // update local participant
    setParticipants(prev => 
      prev.map(p => p.isYou ? { ...p, isVideoOn: !isVideoOff } : p)
    );
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
    Alert.alert(
      'Recording', 
      isRecording ? 'Recording stopped' : 'Recording started'
    );
  };

  const handleShare = () => {
    setIsSharing(!isSharing);
    Alert.alert('Share Screen', isSharing ? 'Screen sharing stopped' : 'Screen sharing started');
  };

  const handleEndMeeting = () => {
    Alert.alert(
      'End Meeting',
      'Are you sure you want to end the meeting for everyone?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End Meeting', style: 'destructive', onPress: onEndMeeting }
      ]
    );
  };

  const handleChat = () => {
    Alert.alert('Chat', 'Chat feature coming soon!');
  };

  const renderParticipantThumbnail = (participant, index) => {
    if (index === participants.length) {

      return (
        <View key="more" style={styles.participantTile}>
          <View style={styles.moreParticipants}>
            <Text style={styles.moreText}>+{additionalParticipants} more</Text>
          </View>
          <Text style={styles.participantLabel}>More</Text>
        </View>
      );
    }

    return (
      <View key={participant.id} style={styles.participantTile}>
        <View style={[
          styles.participantVideo,
          participant.avatar === '☂️' && styles.greenBackground,
          participant.avatar === '👤' && styles.darkGreenBackground,
          participant.avatar === '🎤' && styles.greyBackground,
        ]}>
          {participant.isVideoOn ? (
            <Text style={styles.participantAvatar}>{participant.avatar}</Text>
          ) : (
            <View style={styles.videoOffPlaceholder}>
              <Text style={styles.videoOffIcon}>📹</Text>
            </View>
          )}
          {participant.isMuted && (
            <View style={styles.muteIndicator}>
              <Text style={styles.muteIcon}>🔇</Text>
            </View>
          )}
        </View>
        <Text style={styles.participantLabel}>{participant.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* heading */}
      
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.meetingTitle}>{meeting?.title || 'Team Sync'}</Text>
        <TouchableOpacity onPress={handleChat} style={styles.chatButton}>
          <Text style={styles.chatIcon}>💬</Text>
        </TouchableOpacity>
      </View>


      {/* main video display */}
      
      <View style={styles.mainVideoContainer}>
        <View style={styles.mainVideo}>
          
          {/* simulated video content */}
          
          <View style={styles.videoContent}>
            <Text style={styles.speakerText}>JANGONIA</Text>
          </View>
          
          
          {/* local participant overlay */}
          
          <View style={styles.localParticipantOverlay}>
            <Text style={styles.localParticipantText}>
              Alex Johnson (You)
            </Text>
          </View>
        </View>
      </View>


      {/* participant thumbnails */}
      
      <View style={styles.participantsContainer}>
        {participants.slice(0, 3).map((participant, index) => 
          renderParticipantThumbnail(participant, index)
        )}
        {renderParticipantThumbnail(null, 3)}
      </View>


      {/* control bar */}
      
      <View style={styles.controlBar}>
        <TouchableOpacity 
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={handleMute}
        >
          <Text style={styles.controlIcon}>🎤</Text>
          <Text style={styles.controlLabel}>Mute</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, isVideoOff && styles.controlButtonActive]}
          onPress={handleVideoToggle}
        >
          <Text style={styles.controlIcon}>📹</Text>
          <Text style={styles.controlLabel}>Stop Video</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, styles.recordButton, isRecording && styles.recordingActive]}
          onPress={handleRecord}
        >
          <View style={[styles.recordIcon, isRecording && styles.recordingDot]} />
          <Text style={styles.controlLabel}>Record</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, isSharing && styles.controlButtonActive]}
          onPress={handleShare}
        >
          <Text style={styles.controlIcon}>↗️</Text>
          <Text style={styles.controlLabel}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, styles.endButton]}
          onPress={handleEndMeeting}
        >
          <Text style={styles.controlIcon}>📞</Text>
          <Text style={styles.controlLabel}>End</Text>
        </TouchableOpacity>
      </View>


      {/* bottom navigation */}
      
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📹</Text>
          <Text style={styles.navLabel}>Meetings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navLabel}>Participants</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#fff',
  },
  meetingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  chatButton: {
    padding: 8,
  },
  chatIcon: {
    fontSize: 20,
  },
  mainVideoContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  mainVideo: {
    flex: 1,
    backgroundColor: '#f5f5dc',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  videoContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5dc',
  },
  speakerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  localParticipantOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  localParticipantText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  participantsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  participantTile: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  participantVideo: {
    width: 80,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  greenBackground: {
    backgroundColor: '#52c41a',
  },
  darkGreenBackground: {
    backgroundColor: '#389e0d',
  },
  greyBackground: {
    backgroundColor: '#8c8c8c',
  },
  participantAvatar: {
    fontSize: 24,
    color: '#fff',
  },
  videoOffPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoOffIcon: {
    fontSize: 20,
    color: '#fff',
  },
  muteIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  muteIcon: {
    fontSize: 10,
  },
  participantLabel: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  moreParticipants: {
    width: 80,
    height: 60,
    backgroundColor: '#595959',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  moreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  controlButton: {
    alignItems: 'center',
    minWidth: 60,
  },
  controlButtonActive: {
    opacity: 0.7,
  },
  controlIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  controlLabel: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  recordButton: {
    // Special styling for record button
  },
  recordIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1677ff',
    marginBottom: 4,
    alignSelf: 'center',
  },
  recordingDot: {
    backgroundColor: '#ff4d4f',
  },
  recordingActive: {
    // Additional styling when recording
  },
  endButton: {
    // Special styling for end button
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: '#8c8c8c',
  },
  navLabel: {
    fontSize: 12,
    color: '#8c8c8c',
  },
});
