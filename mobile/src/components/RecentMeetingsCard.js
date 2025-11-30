import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RecentMeetingsCard = ({ recentMeetings, onViewAll }) => {
    // Show only the 5 most recent meetings
    const displayedMeetings = recentMeetings.slice(0, 5);

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Recent Meetings</Text>
                {recentMeetings.length > 5 && (
                    <TouchableOpacity onPress={onViewAll}>
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                )}
            </View>

            {displayedMeetings.length > 0 ? (
                displayedMeetings.map((meeting, index) => (
                    <View key={meeting.id} style={[styles.meetingItem, index !== displayedMeetings.length - 1 && styles.meetingItemBorder]}>
                        <View style={styles.meetingIcon}>
                            <Ionicons name="time-outline" size={20} color="#64748b" />
                        </View>
                        <View style={styles.meetingDetails}>
                            <Text style={styles.meetingTitle}>{meeting.title || `Meeting ${meeting.meetingId}`}</Text>
                            <Text style={styles.meetingTime}>
                                {new Date(meeting.meetingFrom).toLocaleDateString(undefined, {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                })}
                            </Text>
                        </View>
                    </View>
                ))
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No recent meetings</Text>
                </View>
            )}
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
        marginBottom: 50,
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
    meetingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    meetingItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    meetingIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    meetingDetails: {
        flex: 1,
    },
    meetingTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
    },
    meetingTime: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    emptyState: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: '#94a3b8',
        fontSize: 14,
    },
});

export default RecentMeetingsCard;
