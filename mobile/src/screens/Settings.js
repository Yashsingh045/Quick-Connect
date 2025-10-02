import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';

export default function Settings({ auth, onBack, onNavigate }) {
  const [meetingNotifications, setMeetingNotifications] = useState(false);
  const [chatNotifications, setChatNotifications] = useState(false);

  const handleMicrophonePress = () => {
    Alert.alert('Microphone Settings', 'Microphone selection feature coming soon!');
  };

  const handleSpeakerPress = () => {
    Alert.alert('Speaker Settings', 'Speaker selection feature coming soon!');
  };

  const handleCameraPress = () => {
    Alert.alert('Camera Settings', 'Camera selection feature coming soon!');
  };

  const handlePrivacyPress = () => {
    Alert.alert('Privacy', 'Privacy settings feature coming soon!');
  };

  const handleTermsPress = () => {
    Alert.alert('Terms of Service', 'Terms of Service feature coming soon!');
  };

  const handleMeetingNotificationsToggle = (value) => {
    setMeetingNotifications(value);
    Alert.alert(
      'Meeting Notifications', 
      value ? 'Meeting notifications enabled' : 'Meeting notifications disabled'
    );
  };

  const handleChatNotificationsToggle = (value) => {
    setChatNotifications(value);
    Alert.alert(
      'Chat Notifications', 
      value ? 'Chat notifications enabled' : 'Chat notifications disabled'
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: onBack }
      ]
    );
  };

  const renderSettingItem = (icon, title, subtitle, onPress, showArrow = false) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIconContainer}>
          <Text style={styles.settingIcon}>{icon}</Text>
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && <Text style={styles.arrow}>›</Text>}
    </TouchableOpacity>
  );

  const renderToggleItem = (title, value, onToggle) => (
    <View style={styles.settingItem}>
      <Text style={styles.settingTitle}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#e2e8f0', true: '#1677ff' }}
        thumbColor={value ? '#ffffff' : '#ffffff'}
      />
    </View>
  );

  const renderSection = (title, children) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>
        {children}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* heading */}

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* audio & video section */}

        {renderSection('Audio & Video', (
          <>
            {renderSettingItem('🎤', 'Microphone', 'Default', handleMicrophonePress, true)}
            <View style={styles.separator} />
            {renderSettingItem('🔊', 'Speaker', 'Default', handleSpeakerPress, true)}
            <View style={styles.separator} />
            {renderSettingItem('📹', 'Camera', 'Default', handleCameraPress, true)}
          </>
        ))}

        {/* notifications section */}

        {renderSection('Notifications', (
          <>
            {renderToggleItem('Meeting notifications', meetingNotifications, handleMeetingNotificationsToggle)}
            <View style={styles.separator} />
            {renderToggleItem('Chat notifications', chatNotifications, handleChatNotificationsToggle)}
          </>
        ))}

        {/* general section */}
        
        {renderSection('General', (
          <>
            {renderSettingItem('', 'Privacy', '', handlePrivacyPress, true)}
            <View style={styles.separator} />
            {renderSettingItem('', 'Terms of Service', '', handleTermsPress, true)}
          </>
        ))}

        {/* logout section */}

        {renderSection('Account', (
          <>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </>
        ))}

        {/* bottom extra space */}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* bottom navigation */}

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => onNavigate && onNavigate('meetings')}
        >
          <Text style={styles.navIcon}>▶️</Text>
          <Text style={styles.navLabel}>Meetings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => onNavigate && onNavigate('contacts')}
        >
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navLabel}>Contacts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItemActive}>
          <Text style={styles.navIconActive}>⚙️</Text>
          <Text style={styles.navLabelActive}>Settings</Text>
          <View style={styles.activeIndicator} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const BLUE = '#1677ff';
const TEXT = '#0f172a';
const MUTED = '#64748b';
const LIGHT_GREY = '#f1f5f9';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
    width: 40,
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
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: LIGHT_GREY,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingIcon: {
    fontSize: 20,
    color: BLUE,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: TEXT,
  },
  settingSubtitle: {
    fontSize: 14,
    color: MUTED,
    marginTop: 2,
  },
  arrow: {
    fontSize: 20,
    color: MUTED,
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginLeft: 52,
  },
  logoutButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4d4f',
  },
  bottomSpacing: {
    height: 100,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e2e8f0',
    position: 'relative',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 4,
  },
  navItemActive: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 4,
    position: 'relative',
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
  activeIndicator: {
    position: 'absolute',
    bottom: -12,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 3,
    backgroundColor: BLUE,
    borderRadius: 2,
  },
});
