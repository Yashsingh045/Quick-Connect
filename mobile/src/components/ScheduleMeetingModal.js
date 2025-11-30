import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ScheduleMeetingModal = ({ visible, onClose, onSchedule, loading }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(''); // YYYY-MM-DD
    const [time, setTime] = useState(''); // HH:MM
    const [duration, setDuration] = useState('60'); // minutes

    const handleSchedule = () => {
        if (!title || !date || !time) {
            alert('Please fill in all required fields');
            return;
        }

        // Basic validation
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const timeRegex = /^\d{2}:\d{2}$/;

        if (!dateRegex.test(date)) {
            alert('Invalid date format. Use YYYY-MM-DD');
            return;
        }
        if (!timeRegex.test(time)) {
            alert('Invalid time format. Use HH:MM (24h)');
            return;
        }

        onSchedule({
            title,
            date,
            time,
            duration: parseInt(duration) || 60,
        });
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalContainer}
            >
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.modalTitle}>Schedule Meeting</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Meeting Title</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., Weekly Team Sync"
                                placeholderTextColor="#94a3b8"
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="2023-12-25"
                                    placeholderTextColor="#94a3b8"
                                    value={date}
                                    onChangeText={setDate}
                                    keyboardType="numbers-and-punctuation"
                                />
                            </View>

                            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                                <Text style={styles.label}>Time (HH:MM)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="14:30"
                                    placeholderTextColor="#94a3b8"
                                    value={time}
                                    onChangeText={setTime}
                                    keyboardType="numbers-and-punctuation"
                                />
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Duration (minutes)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="60"
                                placeholderTextColor="#94a3b8"
                                value={duration}
                                onChangeText={setDuration}
                                keyboardType="numeric"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.submitBtn, loading && styles.disabledBtn]}
                            onPress={handleSchedule}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.submitBtnText}>Schedule Meeting</Text>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    closeButton: {
        padding: 4,
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748b',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: '#0f172a',
    },
    row: {
        flexDirection: 'row',
    },
    submitBtn: {
        backgroundColor: '#2563eb',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    disabledBtn: {
        opacity: 0.7,
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ScheduleMeetingModal;
