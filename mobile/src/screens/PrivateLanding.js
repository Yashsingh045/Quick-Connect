import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';

export default function PrivateLanding({ auth, onLogout, onViewMeetings, onNavigate }) {
  const [meetingId, setMeetingId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleHostMeeting = () => {
    Alert.alert('Host Meeting', 'Meeting hosting feature coming soon!');
  };

  const handleJoinMeeting = () => {
    if (!meetingId.trim()) {
      Alert.alert('Error', 'Please enter a meeting ID');
      return;
    }
    Alert.alert('Join Meeting', `Joining meeting: ${meetingId}`);
  };

  const handleScheduleMeeting = () => {
    Alert.alert('Schedule Meeting', 'Meeting scheduling feature coming soon!');
  };

  const handleInviteParticipants = () => {
    Alert.alert('Invite Participants', 'Invite feature coming soon!');
  };

  const handleStartBroadcast = () => {
    Alert.alert('Start Broadcast', 'Broadcast feature coming soon!');
  };

  const handleViewAllMeetings = () => {
    Alert.alert('View All Meetings', 'Meeting list feature coming soon!');
  };

  const handleViewMoreMeetings = () => {
    Alert.alert('View More Meetings', 'Meeting details feature coming soon!');
  };

  const handleCalendar = () => {
    Alert.alert('Calendar', 'Calendar feature coming soon!');
  };

  const handleContacts = () => {
    Alert.alert('Contacts', 'Contacts feature coming soon!');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings feature coming soon!');
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>💼</Text>
          <Text style={styles.headerTitle}>Business Connect</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Welcome Message */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome Back, {auth?.user?.name || auth?.user?.username || 'User'}!</Text>
      </View>

      {/* Start a New Meeting */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Start a New Meeting</Text>
        <TouchableOpacity style={styles.hostBtn} onPress={handleHostMeeting}>
          <Text style={styles.hostBtnIcon}>📹</Text>
          <Text style={styles.hostBtnText}>Host a Meeting</Text>
        </TouchableOpacity>
        
        <Text style={styles.joinLabel}>Or, enter a meeting ID to join</Text>
        <View style={styles.joinSection}>
          <TextInput
            style={styles.meetingIdInput}
            placeholder="Enter Meeting ID"
            value={meetingId}
            onChangeText={setMeetingId}
            placeholderTextColor="#64748b"
          />
          <TouchableOpacity style={styles.joinBtn} onPress={handleJoinMeeting}>
            <Text style={styles.joinBtnText}>Join</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Schedule Meeting */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Schedule Meeting</Text>
        <View style={styles.scheduleInfo}>
          <Text style={styles.scheduleIcon}>📅</Text>
          <Text style={styles.scheduleText}>Today, 10:00 AM</Text>
        </View>
        <TouchableOpacity style={styles.scheduleBtn} onPress={handleScheduleMeeting}>
          <Text style={styles.scheduleBtnText}>Schedule New</Text>
        </TouchableOpacity>
        <View style={styles.scheduleFooter}>
          <Text style={styles.upcomingText}>Upcoming</Text>
          <TouchableOpacity onPress={handleViewAllMeetings}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* My Meetings */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>My Meetings</Text>
        
        <View style={styles.meetingItem}>
          <Text style={styles.meetingIcon}>🕐</Text>
          <View style={styles.meetingInfo}>
            <Text style={styles.meetingName}>Project Sync</Text>
            <Text style={styles.meetingTime}>Today, 2:00 PM</Text>
          </View>
        </View>
        
        <View style={styles.meetingItem}>
          <Text style={styles.meetingIcon}>🕐</Text>
          <View style={styles.meetingInfo}>
            <Text style={styles.meetingName}>Client Demo</Text>
            <Text style={styles.meetingTime}>Tomorrow, 11:00 AM</Text>
          </View>
        </View>
        
        <TouchableOpacity onPress={onViewMeetings}>
          <Text style={styles.viewMoreText}>View More</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionItem} onPress={handleInviteParticipants}>
            <Text style={styles.actionIcon}>👤+</Text>
            <Text style={styles.actionText}>Invite Participants</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleStartBroadcast}>
            <Text style={styles.actionIcon}>📡</Text>
            <Text style={styles.actionText}>Start Broadcast</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive}>
          <Text style={styles.navIconActive}>🏠</Text>
          <Text style={styles.navLabelActive}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={handleCalendar}>
          <Text style={styles.navIcon}>📅</Text>
          <Text style={styles.navLabel}>Calendar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={handleContacts}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navLabel}>Contacts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={onNavigate}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const BLUE = '#1677ff';
const BLUE_LIGHT = '#e6f0ff';
const YELLOW = '#fadb14';
const TEXT = '#0f172a';
const MUTED = '#64748b';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT,
  },
  notificationBtn: {
    padding: 8,
  },
  notificationIcon: {
    fontSize: 20,
    color: BLUE,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: TEXT,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 16,
  },
  hostBtn: {
    backgroundColor: BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  hostBtnIcon: {
    fontSize: 18,
    marginRight: 8,
    color: '#fff',
  },
  hostBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  joinLabel: {
    fontSize: 14,
    color: MUTED,
    marginBottom: 12,
  },
  joinSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meetingIdInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 16,
  },
  joinBtn: {
    backgroundColor: BLUE_LIGHT,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  joinBtnText: {
    color: BLUE,
    fontSize: 16,
    fontWeight: '600',
  },
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scheduleIcon: {
    fontSize: 20,
    marginRight: 8,
    color: YELLOW,
  },
  scheduleText: {
    fontSize: 16,
    color: TEXT,
    fontWeight: '500',
  },
  scheduleBtn: {
    backgroundColor: YELLOW,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  scheduleBtnText: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '700',
  },
  scheduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upcomingText: {
    fontSize: 14,
    color: MUTED,
  },
  viewAllText: {
    fontSize: 14,
    color: BLUE,
    fontWeight: '600',
  },
  meetingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  meetingIcon: {
    fontSize: 18,
    marginRight: 12,
    color: BLUE,
  },
  meetingInfo: {
    flex: 1,
  },
  meetingName: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT,
  },
  meetingTime: {
    fontSize: 14,
    color: MUTED,
  },
  viewMoreText: {
    fontSize: 14,
    color: BLUE,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionItem: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
    color: BLUE,
  },
  actionText: {
    fontSize: 12,
    color: TEXT,
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e2e8f0',
    marginTop: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navItemActive: {
    flex: 1,
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: MUTED,
  },
  navIconActive: {
    fontSize: 20,
    marginBottom: 4,
    color: BLUE,
  },
  navLabel: {
    fontSize: 12,
    color: MUTED,
  },
  navLabelActive: {
    fontSize: 12,
    color: BLUE,
    fontWeight: '600',
  },
});
