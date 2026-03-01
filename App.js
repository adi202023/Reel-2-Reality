import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { AppProvider, useApp } from './context/AppContext';
import TabNavigator from './navigation/TabNavigator';
import WelcomeScreen from './screens/WelcomeScreen';
import SignupScreen from './screens/SignupScreen';
import SignInScreen from './screens/SignInScreen';
import ChallengeDetailsScreen from './screens/ChallengeDetailsScreen';
import FriendSelectionScreen from './screens/FriendSelectionScreen';
import CameraScreen from './screens/CameraScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import NotificationScreen from './screens/NotificationScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import RealTimeNotificationScreen from './screens/RealTimeNotificationScreen';

const WebApp = () => {
  try {
    // Import the React web app directly
    const AppModule = require('./src/App');
    return AppModule.default();
  } catch (error) {
    console.error('Error loading React web app:', error);
    return <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Error Loading App</h1>
      <p>There was an error loading the web application. Please check the console for details.</p>
    </div>;
  }
};

// Native App Components
const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useApp();

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{
                cardStyleInterpolator: ({ current }) => ({
                  cardStyle: {
                    opacity: current.progress,
                  },
                }),
              }}
            />
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
            />
          </>
        ) : (
          // Main App Stack
          <>
            <Stack.Screen
              name="MainApp"
              component={TabNavigator}
              options={{
                cardStyleInterpolator: ({ current }) => ({
                  cardStyle: {
                    opacity: current.progress,
                  },
                }),
              }}
            />
            <Stack.Screen
              name="ChallengeDetails"
              component={ChallengeDetailsScreen}
            />
            <Stack.Screen
              name="FriendSelection"
              component={FriendSelectionScreen}
            />
            <Stack.Screen
              name="CameraScreen"
              component={CameraScreen}
            />
            <Stack.Screen
              name="Confirmation"
              component={ConfirmationScreen}
              options={{
                gestureEnabled: false,
                cardStyleInterpolator: ({ current }) => ({
                  cardStyle: {
                    opacity: current.progress,
                    transform: [
                      {
                        scale: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.9, 1],
                        }),
                      },
                    ],
                  },
                }),
              }}
            />
            <Stack.Screen
              name="Notifications"
              component={NotificationScreen}
            />
            <Stack.Screen
              name="RealTimeNotifications"
              component={RealTimeNotificationScreen}
            />
            <Stack.Screen
              name="Analytics"
              component={AnalyticsScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Main App Component
const App = () => {
  // Use web version for web platform, native version for native platforms
  if (Platform.OS === 'web') {
    return <WebApp />;
  } else {
    return (
      <AppProvider>
        <AppNavigator />
      </AppProvider>
    );
  }
};

export default App;
