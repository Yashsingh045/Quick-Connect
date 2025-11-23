// mobile/App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';

// Import screens
import PublicLanding from './src/screens/PublicLanding';
import PrivateLanding from './src/screens/PrivateLanding';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';


import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ErrorBoundary from './src/components/ErrorBoundary';


const Stack = createStackNavigator();

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
    {/* Add other private screens here */}
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
          <RootNavigator />
        </GestureHandlerRootView>
      </AuthProvider>
    </ErrorBoundary>
  );
}