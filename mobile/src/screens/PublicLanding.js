import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function PublicLanding({ onJoin, onStart }) {
  const onJoinPress = () => {
    onJoin?.();
  };
  const onStartPress = () => {
    onStart?.();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header Title */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>Quick Connect</Text>
      </View>

      {/* Center Icon and Subtitle */}
      <View style={styles.hero}>
        <Text accessibilityRole="image" style={styles.icon}>🔄</Text>
        <Text style={styles.subtitle}>Connect instantly, collaborate{"\n"}seamlessly</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity accessibilityRole="button" style={styles.primaryBtn} onPress={onJoinPress}>
          <Text style={styles.primaryBtnText}>Join Meeting</Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          style={[styles.secondaryBtn, styles.secondaryBtnDisabled]}
          onPress={onStartPress}
        >
          <Text style={styles.secondaryBtnText}>Start New Meeting</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Tab Bar (mock) */}
      <View style={styles.tabBar}>
        <View style={styles.tabItemActive}>
          <Text style={styles.tabIcon}>🎥</Text>
          <Text style={styles.tabLabelActive}>Meetings</Text>
        </View>
        <View style={styles.tabItem}>
          <Text style={styles.tabIcon}>👥</Text>
          <Text style={styles.tabLabel}>Contacts</Text>
        </View>
        <View style={styles.tabItem}>
          <Text style={styles.tabIcon}>⚙️</Text>
          <Text style={styles.tabLabel}>Settings</Text>
        </View>
      </View>
    </View>
  );
}

const BLUE = '#1677ff';
const BLUE_LIGHT = '#e6f0ff';
const TEXT = '#0f172a';
const MUTED = '#64748b';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 54,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: TEXT,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 64,
    color: BLUE,
    marginBottom: 12,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: TEXT,
  },
  actions: {
    paddingHorizontal: 20,
    paddingBottom: 90,
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: BLUE,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: BLUE_LIGHT,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryBtnDisabled: {
    opacity: 0.6,
  },
  secondaryBtnText: {
    color: BLUE,
    fontSize: 16,
    fontWeight: '700',
  },
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
  },
  tabItemActive: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 12,
    color: MUTED,
    marginTop: 4,
  },
  tabLabelActive: {
    fontSize: 12,
    color: BLUE,
    marginTop: 4,
    fontWeight: '600',
  },
});