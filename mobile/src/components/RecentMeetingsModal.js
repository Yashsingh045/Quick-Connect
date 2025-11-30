import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RecentMeetingsModal = ({ visible, onClose, meetings }) => {
    const renderItem = ({ item }) => (
        <View style={styles.meetingItem}>
            <View style={styles.meetingIcon}>
                <Ionicons name="time-outline" size={20} color="#64748b" />
            </View>
            <View style={styles.meetingDetails}>
                <Text style={styles.meetingTitle}>{item.roomName || `Meeting ${item.id}`}</Text>
                <Text style={styles.meetingTime}>{new Date(item.date).toLocaleString()}</Text>
                {item.duration && (
                    <Text style={styles.meetingDuration}>Duration: {item.duration}</Text>
                )}
            </View>
        </View>
    );

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <Text style={styles.modalTitle}>Recent Meetings</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    {meetings.length > 0 ? (
                        <FlatList
                            data={meetings}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={styles.listContent}
                        />
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No recent meetings found.</Text>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        height: '60%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    listContent: {
        paddingBottom: 20,
    },
    meetingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        marginBottom: 12,
    },
    meetingIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
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
    meetingDuration: {
        fontSize: 11,
        color: '#94a3b8',
        marginTop: 2,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#94a3b8',
        fontSize: 16,
    },
});

export default RecentMeetingsModal;
