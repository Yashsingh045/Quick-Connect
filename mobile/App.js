// mobile/App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import { LogBox } from 'react-native';


LogBox.ignoreLogs([
  'You are not join in any room, no need to leave room.',
  'Remove callback for: [ GalleryLayout',
  '[ZegoUIKit]',
]);
LogBox.ignoreAllLogs(true);


// LogBox.ignoreLogs([
//   'You are not join in any room, no need to leave room.',
//   'Remove callback for: [ GalleryLayout',
//   '[ZegoUIKit]',
// ]);

const originalConsoleInfo = console.info;
console.info = (...args) => {
  const msg = args[0];
  if (
    typeof msg === 'string' &&
    (msg.includes('[ZegoUIKit]') ||
      msg.includes('You are not join in any room, no need to leave room.') ||
      msg.includes('Remove callback for: [ GalleryLayout'))
  ) {
    return; // swallow Zego info logs
  }
  originalConsoleInfo(...args);
};





// Import screens
import PublicLanding from './src/screens/PublicLanding';
import PrivateLanding from './src/screens/PrivateLanding';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import MeetingRoom from './src/screens/MeetingRoom';

import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ErrorBoundary from './src/components/ErrorBoundary';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PublicLanding" component={PublicLanding} />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{
        title: 'Sign In',
        headerShown: true,
        headerBackTitle: 'Back'
      }}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
      options={{
        title: 'Create Account',
        headerShown: true,
        headerBackTitle: 'Back'
      }}
    />
    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPasswordScreen}
      options={{
        title: 'Reset Password',
        headerShown: true,
        headerBackTitle: 'Back'
      }}
    />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="PrivateLanding"
      component={PrivateLanding}
      options={{
        title: 'Home',
        headerShown: true
      }}
    />
    <Stack.Screen
      name="MeetingRoom"
      component={MeetingRoom}
      options={{
        title: 'Meeting Room',
        headerShown: true
      }}
    />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>

        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <RootNavigator />
          </SafeAreaProvider>
        </GestureHandlerRootView>

      </AuthProvider>
    </ErrorBoundary>
  );
}

