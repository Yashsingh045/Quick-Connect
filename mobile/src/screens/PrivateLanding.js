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
  SafeAreaView,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons, MaterialIcons, Feather, FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

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

  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar style="dark" />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <MaterialIcons name="video-call" size={24} color="#1677ff" />
            </View>
            <Text style={styles.headerTitle}>Quick Connect</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            Welcome Back, <Text style={styles.userName}>{auth?.user?.name || auth?.user?.username || 'User'}</Text>!
          </Text>
        </View>

        {/* Start a New Meeting Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Start a New Meeting</Text>
          <TouchableOpacity 
            style={styles.hostBtn} 
            onPress={handleHostMeeting}
            activeOpacity={0.9}
          >
            <Ionicons name="videocam" size={24} color="white" style={styles.hostBtnIcon} />
            <Text style={styles.hostBtnText}>Host a Meeting</Text>
          </TouchableOpacity>
          
          <Text style={styles.joinLabel}>Or, enter a meeting ID to join</Text>
          <View style={styles.joinSection}>
            <TextInput
              style={styles.meetingIdInput}
              placeholder="Enter Meeting ID"
              value={meetingId}
              onChangeText={setMeetingId}
              placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity 
              style={styles.joinBtn} 
              onPress={handleJoinMeeting}
              activeOpacity={0.9}
            >
              <Text style={styles.joinBtnText}>Join</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Schedule Meeting Card */}
        <View style={[styles.card, { marginTop: 16 }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Schedule Meeting</Text>
            <TouchableOpacity onPress={handleViewAllMeetings}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.scheduleContent}>
            <View style={styles.scheduleInfo}>
              <View style={styles.scheduleIconContainer}>
                <Ionicons name="calendar-outline" size={20} color="#0f172a" />
              </View>
              <Text style={styles.scheduleText}>Today, 10:00 AM</Text>
            </View>
            <TouchableOpacity 
              style={styles.scheduleBtn} 
              onPress={handleScheduleMeeting}
              activeOpacity={0.9}
            >
              <Text style={styles.scheduleBtnText}>Schedule New</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.upcomingText}>Upcoming</Text>
        </View>

        {/* My Meetings Card */}
        <View style={[styles.card, { marginTop: 16 }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>My Meetings</Text>
            <TouchableOpacity onPress={onViewMeetings}>
              <Text style={styles.viewMoreText}>View More</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.meetingItem}>
            <View style={styles.meetingIconContainer}>
              <Ionicons name="time-outline" size={18} color="#0f172a" />
            </View>
            <View style={styles.meetingInfo}>
              <Text style={styles.meetingName}>Project Sync</Text>
              <Text style={styles.meetingTime}>Today, 2:00 PM</Text>
            </View>
          </View>
          
          <View style={[styles.meetingItem, { borderBottomWidth: 0 }]}>
            <View style={styles.meetingIconContainer}>
              <Ionicons name="time-outline" size={18} color="#0f172a" />
            </View>
            <View style={styles.meetingInfo}>
              <Text style={styles.meetingName}>Client Demo</Text>
              <Text style={styles.meetingTime}>Tomorrow, 11:00 AM</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions Card */}
        <View style={[styles.card, { marginTop: 16, marginBottom: 24 }]}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionItem} 
              onPress={handleInviteParticipants}
              activeOpacity={0.9}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#f0f7ff' }]}>
                <Ionicons name="person-add" size={20} color="#1677ff" />
              </View>
              <Text style={styles.actionText}>Invite</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionItem} 
              onPress={handleStartBroadcast}
              activeOpacity={0.9}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#f0f7ff' }]}>
                <Ionicons name="radio" size={20} color="#1677ff" />
              </View>
              <Text style={styles.actionText}>Broadcast</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderBottomTabs = () => {
    const tabs = [
      { id: 'home', icon: 'home-outline', label: 'Home' },
      { id: 'calendar', icon: 'calendar-outline', label: 'Calendar' },
      { id: 'contacts', icon: 'people-outline', label: 'Contacts' },
      { id: 'settings', icon: 'settings-outline', label: 'Settings' },
    ];

    return (
      <View style={styles.bottomNav}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={tab.icon} 
                size={24} 
                color={isActive ? '#1677ff' : '#94a3b8'} 
              />
              <Text style={[
                styles.navLabel, 
                isActive && styles.navLabelActive
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderContent()}
      {renderBottomTabs()}
    </SafeAreaView>
  );
}

// Colors
const COLORS = {
  primary: '#1677ff',
  primaryLight: '#e6f7ff',
  text: '#0f172a',
  textSecondary: '#334155',
  muted: '#94a3b8',
  border: '#e2e8f0',
  background: '#f8fafc',
  white: '#ffffff',
  yellow: '#facc15',
  cardBg: '#ffffff',
  cardShadow: 'rgba(0, 0, 0, 0.05)',
  tabInactive: '#94a3b8',
  tabActive: '#1677ff',
};

// Spacing
const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Typography
const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    color: COLORS.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    color: COLORS.text,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    color: COLORS.text,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.muted,
  },
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingBottom: Platform.OS === 'android' ? 16 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    paddingBottom: 80, // Space for bottom tabs
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
    color: COLORS.text,
  },
  notificationBtn: {
    padding: 8,
  },
  notificationIcon: {
    fontSize: 20,
    color: COLORS.primary,
  },
  welcomeSection: {
    marginBottom: SPACING.lg,
  },
  welcomeText: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
  },
  userName: {
    color: COLORS.primary,
  },
  // Cards
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: 0,
  },
  // Buttons
  hostBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  hostBtnIcon: {
    marginRight: SPACING.sm,
  },
  hostBtnText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.white,
  },
  // Input and Join Section
  joinLabel: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    color: COLORS.muted,
  },
  joinSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meetingIdInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  joinBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  joinBtnText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.white,
  },
  // Schedule Section
  scheduleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  scheduleText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  scheduleBtn: {
    backgroundColor: COLORS.yellow,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleBtnText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.text,
  },
  upcomingText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  viewAllText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
  viewMoreText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '500',
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  // Meeting Items
  meetingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  meetingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  meetingInfo: {
    flex: 1,
  },
  meetingName: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    marginBottom: 2,
  },
  meetingTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.muted,
  },
  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  actionItem: {
    alignItems: 'center',
    width: '48%',
    padding: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  actionText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  navItem: {
    alignItems: 'center',
    padding: SPACING.xs,
    flex: 1,
  },
  navItemActive: {
    alignItems: 'center',
    padding: SPACING.xs,
    flex: 1,
  },
  navIcon: {
    marginBottom: SPACING.xs / 2,
  },
  navLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.tabInactive,
    fontSize: 10,
    marginTop: 2,
  },
  navLabelActive: {
    ...TYPOGRAPHY.caption,
    color: COLORS.tabActive,
    fontWeight: '600',
    fontSize: 10,
    marginTop: 2,
  },
});
