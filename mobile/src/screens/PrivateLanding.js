import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
// Import the new components
import MeetingScheduleCard from '../components/MeetingScheduleCard';
import ScheduledMeetingsModal from '../components/ScheduledMeetingsModal';

const PrivateLanding = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [meetingCode, setMeetingCode] = useState('');
  
  // State for the modal
  const [isScheduleModalVisible, setScheduleModalVisible] = useState(false);

  // Dummy data for meetings (replace with API data later)
  const scheduledMeetings = [
    { id: '1', title: 'Team Standup', time: 'Today, 10:00 AM' },
    { id: '2', title: 'Project Review', time: 'Tomorrow, 2:00 PM' },
    { id: '3', title: 'Client Call', time: 'Fri, 11:30 AM' },
  ];

  const handleJoinMeeting = () => {
    if (!meetingCode.trim()) {
      Alert.alert('Error', 'Please enter a meeting code');
      return;
    }
    navigation.navigate('MeetingRoom', { roomName: meetingCode.trim() });
  };

  const handleNewMeeting = () => {
    const randomRoomId = Math.floor(10000000 + Math.random() * 90000000).toString();
    navigation.navigate('MeetingRoom', { roomName: randomRoomId });
  };

  const handleScheduleNew = () => {
    Alert.alert('Coming Soon', 'Schedule meeting feature will be available soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>{user?.name || user?.username || 'User'}</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <Image
            source={{ uri: 'https://ui-avatars.com/api/?name=' + (user?.name || 'User') + '&background=0D8ABC&color=fff' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Join Meeting Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Join a Meeting</Text>
          <Text style={styles.cardSubtitle}>Enter the code shared by the host</Text>
          
          <View style={styles.inputContainer}>
            <Ionicons name="keypad-outline" size={20} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter meeting code"
              placeholderTextColor="#94a3b8"
              value={meetingCode}
              onChangeText={setMeetingCode}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            style={styles.joinBtn}
            onPress={handleJoinMeeting}
            activeOpacity={0.9}
          >
            <Text style={styles.joinBtnText}>Join Meeting</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Host Meeting Card */}
        <View style={[styles.card, { marginTop: 16 }]}>
          <Text style={styles.cardTitle}>Host a Meeting</Text>
          <Text style={styles.cardSubtitle}>Start an instant meeting and invite others</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.primaryActionBtn]}
              onPress={handleNewMeeting}
              activeOpacity={0.9}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="videocam" size={24} color="#fff" />
              </View>
              <Text style={styles.actionBtnText}>Instant Meeting</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.9}>
              <View style={[styles.iconCircle, styles.secondaryIconCircle]}>
                <Ionicons name="share-social" size={24} color="#0f172a" />
              </View>
              <Text style={[styles.actionBtnText, { color: '#0f172a' }]}>Share Invite</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* NEW: Reusable Schedule Component */}
        <MeetingScheduleCard 
          nextMeeting={scheduledMeetings[0]} 
          onViewAll={() => setScheduleModalVisible(true)}
          onScheduleNew={handleScheduleNew}
        />

        {/* My Meetings Card (Placeholder for history or other features) */}
        <View style={[styles.card, { marginTop: 16 }]}>
           <Text style={styles.cardTitle}>Recent History</Text>
           <Text style={styles.cardSubtitle}>No recent meetings</Text>
        </View>

      </ScrollView>

      {/* Modal for Viewing All Scheduled Meetings */}
      <ScheduledMeetingsModal 
        visible={isScheduleModalVisible}
        onClose={() => setScheduleModalVisible(false)}
        meetings={scheduledMeetings}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  profileBtn: {
    padding: 2,
    backgroundColor: '#fff',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
  },
  joinBtn: {
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
  },
  joinBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  primaryActionBtn: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryIconCircle: {
    backgroundColor: '#e2e8f0',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default PrivateLanding;