import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';

export default function PublicLanding({ onJoin }) {
  const navigation = useNavigation();

  const onJoinPress = () => {
    if (onJoin) {
      onJoin();
    } else {
      // Default behavior if onJoin is not provided
      navigation.navigate('Login');
    }
  };

  const onSignInPress = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar style="dark" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>Quick Connect</Text>
          <Image source={require('../../assets/icon.png')} style={styles.avatar} />
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
            onPress={onSignInPress}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryBtnText}>Sign In</Text>
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
const LIGHT_BG = '#f8fafc';
const DARK_TEXT = '#0f172a';
const MUTED_TEXT = '#64748b';
const SPACING = 16;

PublicLanding.propTypes = {
  onJoin: PropTypes.func,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },
  container: {
    flex: 1,
    backgroundColor: LIGHT_BG,
    paddingHorizontal: SPACING * 1.5,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING,
    marginBottom: SPACING * 10,
    marginTop: SPACING * 4,
  },
  appTitle: {
    color: DARK_TEXT,
    fontWeight: '700',
    fontSize: 22,
    letterSpacing: 0.5,

  },
  avatar: {
    padding: SPACING / 2,
    height: 50,
    width: 50,
  },
  secureText: {
    color: BLUE,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: SPACING * 2,
  },
  mainHeading: {
    color: DARK_TEXT,
    fontWeight: '800',
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  highlight: {
    color: BLUE,
  },
  description: {
    color: MUTED_TEXT,
    fontSize: 15,
    lineHeight: 24,
    marginTop: SPACING * 2,
    marginBottom: SPACING * 5,
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
    marginTop: SPACING * 1.4,
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
    borderColor: '#e2e8f0',
    borderWidth: 1.5,
    paddingVertical: SPACING + 2,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginBottom: SPACING * 3,
  },
  secondaryBtnText: {
    color: DARK_TEXT,
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.3,
  },
});