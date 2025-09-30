import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';

const API_BASE = 'http://localhost:3000';

export default function MeetingsList({ auth, onBack, onJoinMeeting }) {
  const [meetings, setMeetings] = useState({
    ongoing: [],
    upcoming: [],
    past: []
  });
  const [loading, setLoading] = useState(true);
  const [recordingEnabled, setRecordingEnabled] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/meetings`, {
        headers: {
          'Authorization': auth?.token,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch meetings');
      }

      const allMeetings = await response.json();
      
      // Categorize meetings
      const now = new Date();
      const categorized = {
        ongoing: [],
        upcoming: [],
        past: []
      };

      allMeetings.forEach(meeting => {
        const startTime = new Date(meeting.startTime);
        const endTime = meeting.endTime ? new Date(meeting.endTime) : null;

        if (meeting.status === 'live' || (startTime <= now && (!endTime || endTime > now))) {
          categorized.ongoing.push(meeting);
        } else if (startTime > now) {
          categorized.upcoming.push(meeting);
        } else {
          categorized.past.push(meeting);
        }
      });

      setMeetings(categorized);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      Alert.alert('Error', 'Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMeeting = async (meetingId) => {
    try {
      const response = await fetch(`${API_BASE}/meetings/${meetingId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': auth?.token,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to join meeting');
      }

      // Find the meeting object to pass to MeetingRoom
      const allMeetings = [...meetings.ongoing, ...meetings.upcoming, ...meetings.past];
      const meeting = allMeetings.find(m => m.meetingId === meetingId);
      
      if (meeting) {
        onJoinMeeting(meeting);
      }
    } catch (error) {
      console.error('Error joining meeting:', error);
      Alert.alert('Error', 'Failed to join meeting');
    }
  };

  const handleScheduleMeeting = () => {
    Alert.alert('Schedule Meeting', 'Meeting scheduling feature coming soon!');
  };

  const handleMeetingDetails = (meeting) => {
    Alert.alert('Meeting Details', `${meeting.title}\n\nStart: ${new Date(meeting.startTime).toLocaleString()}`);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays > 1 && diffDays <= 7) {
      return `${date.toLocaleDateString([], { weekday: 'short' })}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatPastTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `${diffDays} days ago, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };

  const renderMeetingItem = (meeting, type) => {
    const isOngoing = type === 'ongoing';
    const isPast = type === 'past';
    
    return (
      <View key={meeting._id} style={[
        styles.meetingItem,
        isOngoing ? styles.ongoingMeetingItem : styles.regularMeetingItem
      ]}>
        <View style={styles.meetingContent}>
          {isOngoing && (
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          )}
          
          <View style={styles.meetingInfo}>
            <Text style={styles.meetingTitle}>{meeting.title}</Text>
            <Text style={styles.meetingTime}>
              {isOngoing 
                ? `Started at ${new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : isPast 
                ? formatPastTime(meeting.startTime)
                : formatTime(meeting.startTime)
              }
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.actionButton,
            isPast ? styles.detailsButton : styles.joinButton
          ]}
          onPress={() => isPast ? handleMeetingDetails(meeting) : handleJoinMeeting(meeting.meetingId)}
        >
          <Text style={[
            styles.actionButtonText,
            isPast ? styles.detailsButtonText : styles.joinButtonText
          ]}>
            {isPast ? 'Details' : 'Join'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1677ff" />
        <Text style={styles.loadingText}>Loading meetings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meetings</Text>
        <View style={styles.headerRight}>
          <Switch
            value={recordingEnabled}
            onValueChange={setRecordingEnabled}
            trackColor={{ false: '#e2e8f0', true: '#1677ff' }}
            thumbColor={recordingEnabled ? '#ffffff' : '#ffffff'}
          />
          <Text style={styles.recordLabel}>Record</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Ongoing Meetings */}
        {meetings.ongoing.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ongoing</Text>
            {meetings.ongoing.map(meeting => renderMeetingItem(meeting, 'ongoing'))}
          </View>
        )}

        {/* Upcoming Meetings */}
        {meetings.upcoming.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            {meetings.upcoming.map(meeting => renderMeetingItem(meeting, 'upcoming'))}
          </View>
        )}

        {/* Past Meetings */}
        {meetings.past.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Past</Text>
            {meetings.past.map(meeting => renderMeetingItem(meeting, 'past'))}
          </View>
        )}

        {/* Empty State */}
        {meetings.ongoing.length === 0 && meetings.upcoming.length === 0 && meetings.past.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No meetings yet</Text>
            <Text style={styles.emptySubtitle}>Schedule your first meeting to get started</Text>
          </View>
        )}

        {/* Bottom Spacing for FAB */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleScheduleMeeting}>
        <Text style={styles.fabIcon}>+</Text>
        <Text style={styles.fabText}>Schedule New Meeting</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive}>
          <Text style={styles.navIconActive}>📹</Text>
          <Text style={styles.navLabelActive}>Meetings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navLabel}>Contacts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const BLUE = '#1677ff';
const BLUE_LIGHT = '#e6f0ff';
const GREEN = '#52c41a';
const TEXT = '#0f172a';
const MUTED = '#64748b';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: MUTED,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: TEXT,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: TEXT,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: MUTED,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 12,
  },
  meetingItem: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ongoingMeetingItem: {
    backgroundColor: BLUE_LIGHT,
    borderWidth: 1,
    borderColor: BLUE,
  },
  regularMeetingItem: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  meetingContent: {
    flex: 1,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GREEN,
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '600',
    color: GREEN,
  },
  meetingInfo: {
    flex: 1,
  },
  meetingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 2,
  },
  meetingTime: {
    fontSize: 14,
    color: MUTED,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: BLUE,
  },
  detailsButton: {
    backgroundColor: BLUE_LIGHT,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  joinButtonText: {
    color: '#fff',
  },
  detailsButtonText: {
    color: BLUE,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: MUTED,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 20,
    color: '#fff',
    marginRight: 8,
    fontWeight: '600',
  },
  fabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e2e8f0',
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
