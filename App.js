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

// Simple Web Welcome Component
const SimpleWelcome = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
      color: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '800px' }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🎬 REEL TO REALITY
        </h1>

        <p style={{
          fontSize: '1.25rem',
          marginBottom: '2rem',
          color: '#64748b',
          lineHeight: '1.6'
        }}>
          Join the ultimate challenge platform where creativity meets competition.
          Create, compete, and connect with a global community of passionate creators.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: '#3b82f6',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              fontSize: '1.5rem'
            }}>
              🎥
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Video Challenges
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Create stunning videos with our guided challenge system.
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: '#10b981',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              fontSize: '1.5rem'
            }}>
              👥
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Global Community
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Connect with creators from around the world.
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: '#f59e0b',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              fontSize: '1.5rem'
            }}>
              🏆
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Achievement System
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Unlock badges and climb the leaderboard.
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: '#8b5cf6',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              fontSize: '1.5rem'
            }}>
              💡
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Innovation Hub
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Showcase your creative solutions.
            </p>
          </div>
        </div>

        <div style={{
          background: '#3b82f6',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.75rem',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '600',
          display: 'inline-block',
          textDecoration: 'none'
        }}>
          Get Started
        </div>
      </div>
    </div>
  );
};

// Web App Component - Direct React Web App
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
