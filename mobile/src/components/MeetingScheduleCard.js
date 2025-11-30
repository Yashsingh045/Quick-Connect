import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MeetingScheduleCard = ({ nextMeeting, onViewAll, onScheduleNew }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Schedule Meeting</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scheduleContent}>
        <View style={styles.scheduleInfo}>
          <View style={styles.scheduleIconContainer}>
            <Ionicons name="calendar-outline" size={20} color="#0f172a" />
          </View>

          <View>
            {nextMeeting ? (
              <>
                <Text style={styles.scheduleText}>{nextMeeting.title}</Text>
                <Text style={styles.upcomingText}>
                  {new Date(nextMeeting.meetingFrom).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </Text>
              </>
            ) : (
              <Text style={styles.scheduleText}>No upcoming meetings</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.scheduleBtn}
          onPress={onScheduleNew}
          activeOpacity={0.9}
        >
          <Text style={styles.scheduleBtnText}>Schedule New</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  viewAllText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  scheduleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scheduleIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  scheduleText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  scheduleBtn: {
    backgroundColor: '#0f172a',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  scheduleBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  upcomingText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
});

export default MeetingScheduleCard;