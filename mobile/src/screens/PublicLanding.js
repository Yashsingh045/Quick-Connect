import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, SafeAreaView, Platform } from 'react-native';

export default function PublicLanding({ onJoin, onStart }) {
  const onJoinPress = () => {
    Alert.alert('kaam chal raha hai\nTab Tak aap or screens ko dekh sakte hain.\nBy just uncommenting the code in return part only in App.js');
  };
  
  const onStartPress = () => {
    Alert.alert('kaam chal raha hai\nTab Tak aap or screens ko dekh sakte hain.\nBy just uncommenting the code in return part only in App.js');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar style="light" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>Quick Connect</Text>
          <TouchableOpacity style={styles.menuIcon} activeOpacity={0.7}>
            <View style={styles.menuIconLine} />
            <View style={[styles.menuIconLine, { width: 18 }]} />
            <View style={styles.menuIconLine} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Subtitle */}
          <Text style={styles.secureText}>SECURE VIDEO CONFERENCING</Text>

          {/* Main Heading */}
          <Text style={styles.mainHeading}>
            Collaborate{' '}
            <Text style={[styles.mainHeading, styles.highlight]}>without</Text>
          </Text>
          <Text style={[styles.mainHeading, { marginTop: -10 }]}>Compromise</Text>

          {/* Description */}
          <Text style={styles.description}>
            Enterprise-grade video calls, messaging, and file sharing protected by invisible, always-on end-to-end encryption.
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryBtn} 
            onPress={onStartPress}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryBtnText}>Start New Meeting</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryBtn} 
            onPress={onJoinPress}
            activeOpacity={0.9}
          >
            <Text style={styles.secondaryBtnText}>Join Meeting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const BLUE = '#1677ff';
const WHITE = '#fff';
const DARK = '#0a0a0a';
const MUTED = '#9ca3af';
const SPACING = 16;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DARK,
  },
  container: {
    flex: 1,
    backgroundColor: DARK,
    paddingHorizontal: SPACING * 1.5,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING,
    marginBottom: SPACING * 2,
  },
  appTitle: {
    color: WHITE,
    fontWeight: '700',
    fontSize: 22,
    letterSpacing: 0.5,
  },
  menuIcon: {
    padding: SPACING / 2,
  },
  menuIconLine: {
    width: 24,
    height: 2,
    backgroundColor: WHITE,
    marginVertical: 3,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -SPACING * 4,
  },
  secureText: {
    color: BLUE,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: SPACING * 2,
  },
  mainHeading: {
    color: WHITE,
    fontWeight: '800',
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  highlight: {
    color: BLUE,
  },
  description: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 24,
    marginTop: SPACING * 2,
    marginBottom: SPACING * 3,
    paddingRight: SPACING * 2,
  },
  buttonContainer: {
    paddingBottom: SPACING * 2,
  },
  primaryBtn: {
    backgroundColor: BLUE,
    paddingVertical: SPACING + 2,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: SPACING,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryBtnText: {
    color: WHITE,
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1.5,
    paddingVertical: SPACING + 2,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  secondaryBtnText: {
    color: WHITE,
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.3,
  },
});