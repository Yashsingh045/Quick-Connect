import React, { useState, useEffect } from 'react';
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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
// Import the new components
import MeetingScheduleCard from '../components/MeetingScheduleCard';
import ScheduledMeetingsModal from '../components/ScheduledMeetingsModal';
import RecentMeetingsCard from '../components/RecentMeetingsCard';
import RecentMeetingsModal from '../components/RecentMeetingsModal';
import ScheduleMeetingModal from '../components/ScheduleMeetingModal';
import { getRecentMeetings, getUpcomingMeetings, createMeeting } from '../services/meetingsService';

const PrivateLanding = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [meetingCode, setMeetingCode] = useState('');

  // State for the modals
  const [isScheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [isRecentModalVisible, setRecentModalVisible] = useState(false);
  const [isCreateMeetingModalVisible, setCreateMeetingModalVisible] = useState(false);

  const [recentMeetings, setRecentMeetings] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const fetchMeetings = async () => {
    const [recentResult, upcomingResult] = await Promise.all([
      getRecentMeetings(),
      getUpcomingMeetings()
    ]);

    if (recentResult.success) {
      setRecentMeetings(recentResult.data);
    }
    if (upcomingResult.success) {
      setUpcomingMeetings(upcomingResult.data);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchMeetings();
    }, [])
  );

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
    setCreateMeetingModalVisible(true);
  };

  const handleCreateMeeting = async (meetingData) => {
    setIsCreating(true);

    // Format date and time to ISO string for backend
    // Assuming date is YYYY-MM-DD and time is HH:MM
    const meetingFrom = new Date(`${meetingData.date}T${meetingData.time}:00`);
    const meetingTo = new Date(meetingFrom.getTime() + meetingData.duration * 60000);

    const payload = {
      title: meetingData.title,
      meetingFrom: meetingFrom.toISOString(),
      meetingTo: meetingTo.toISOString(),
      participantIds: [] // Add logic for participants if needed later
    };

    const result = await createMeeting(payload);
    setIsCreating(false);

    if (result.success) {
      setCreateMeetingModalVisible(false);
      Alert.alert('Success', 'Meeting scheduled successfully!');
      fetchMeetings(); // Refresh both lists
    } else {
      Alert.alert('Error', result.message || 'Failed to schedule meeting');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 18) return 'Good Afternoon,';
    return 'Good Evening,';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header Section */}
      <View>
        <Text style={styles.headerTitle}>Quick Connect</Text>
      </View>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.userName}>
            {user?.userName || user?.name || 'User'}
          </Text>
        </View>

        <View style={styles.headerRight}>

          <TouchableOpacity>
            <Image source={require('../../assets/icon.png')} style={styles.profileImage} />
          </TouchableOpacity>
        </View>
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

            {/* <TouchableOpacity style={styles.actionBtn} activeOpacity={0.9}>
              <View style={[styles.iconCircle, styles.secondaryIconCircle]}>
                <Ionicons name="share-social" size={24} color="#0f172a" />
              </View>
              <Text style={[styles.actionBtnText, { color: '#0f172a' }]}>Share Invite</Text>
            </TouchableOpacity> */}
          </View>
        </View>

        {/* NEW: Reusable Schedule Component */}
        <MeetingScheduleCard
          nextMeeting={upcomingMeetings[0]}
          onViewAll={() => setScheduleModalVisible(true)}
          onScheduleNew={handleScheduleNew}
        />

        {/* Recent Meetings Component */}
        <RecentMeetingsCard
          recentMeetings={recentMeetings}
          onViewAll={() => setRecentModalVisible(true)}
        />

      </ScrollView>

      {/* Modal for Viewing All Scheduled Meetings */}
      <ScheduledMeetingsModal
        visible={isScheduleModalVisible}
        onClose={() => setScheduleModalVisible(false)}
        meetings={upcomingMeetings}
      />

      {/* Modal for Viewing All Recent Meetings */}
      <RecentMeetingsModal
        visible={isRecentModalVisible}
        onClose={() => setRecentModalVisible(false)}
        meetings={recentMeetings}
      />

      {/* Modal for Scheduling New Meeting */}
      <ScheduleMeetingModal
        visible={isCreateMeetingModalVisible}
        onClose={() => setCreateMeetingModalVisible(false)}
        onSchedule={handleCreateMeeting}
        loading={isCreating}
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
    paddingTop: 30,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    paddingTop: 50,
    textAlign: 'center',
    backgroundColor: '#fff',
    paddingBottom: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    width: 45,
    height: 45,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#fff',
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
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingLeft: 60,
    paddingTop: 15,
    paddingBottom: 8,
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
    marginBottom: 10,
  },
  secondaryIconCircle: {
    backgroundColor: '#e2e8f0',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    paddingHorizontal: 40,
    marginTop: -8,
  },
});

export default PrivateLanding;