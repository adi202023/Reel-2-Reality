import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ChallengeFeedScreen from '../screens/ChallengeFeedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddFriendsScreen from '../screens/AddFriendsScreen';
import { useApp } from '../context/AppContext';

const TabNavigator = ({ navigation }) => {
  const { unreadCount, logout, isDarkMode, toggleTheme, theme } = useApp();
  const [activeTab, setActiveTab] = useState('Home');
  const [currentScreen, setCurrentScreen] = useState('Home');

  const handleLogout = () => {
    logout();
  };

  const handleNotifications = () => {
    navigation.navigate('Notifications');
  };

  const navigateToAddFriends = () => {
    setCurrentScreen('AddFriends');
  };

  const navigateBack = () => {
    setCurrentScreen('Home');
    setActiveTab('Profile');
  };

  const renderActiveScreen = () => {
    if (currentScreen === 'AddFriends') {
      return <AddFriendsScreen navigation={{ ...navigation, goBack: navigateBack }} />;
    }
    
    switch (activeTab) {
      case 'Home':
        return <HomeScreen navigation={navigation} onTabChange={setActiveTab} />;
      case 'Challenges':
        return <ChallengeFeedScreen navigation={navigation} />;
      case 'Profile':
        return <ProfileScreen navigation={{ ...navigation, navigate: navigateToAddFriends }} />;
      default:
        return <HomeScreen navigation={navigation} onTabChange={setActiveTab} />;
    }
  };

  const tabs = [
    { id: 'Home', label: 'Home', icon: 'home' },
    { id: 'Challenges', label: 'Challenges', icon: 'flash' },
    { id: 'Profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Custom Header with Navigation Tabs */}
      <LinearGradient
        colors={theme.colors.gradient}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {/* Top Row - Branding and Actions */}
        <View style={styles.topRow}>
          <View style={styles.brandingSection}>
            <View style={styles.logoContainer}>
              <Ionicons name="videocam" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.appTitle}>Reel to Reality</Text>
          </View>
          
          <View style={styles.actionsSection}>
            {/* Friend Requests Quick Access */}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={navigateToAddFriends}
            >
              <Ionicons 
                name="person-add" 
                size={20} 
                color="white" 
              />
            </TouchableOpacity>
            
            {/* Real-Time Notifications */}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('RealTimeNotifications')}
            >
              <Ionicons 
                name="pulse" 
                size={20} 
                color="white" 
              />
            </TouchableOpacity>
            
            {/* Analytics Dashboard */}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Analytics')}
            >
              <Ionicons 
                name="analytics" 
                size={20} 
                color="white" 
              />
            </TouchableOpacity>
            
            {/* Dark Mode Toggle */}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={toggleTheme}
            >
              <Ionicons 
                name={isDarkMode ? "sunny" : "moon"} 
                size={20} 
                color="white" 
              />
            </TouchableOpacity>
            
            {/* Notifications */}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleNotifications}
            >
              <Ionicons name="notifications" size={20} color="white" />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            
            {/* Logout */}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Row - Navigation Tabs */}
        <View style={styles.tabsRow}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                activeTab === tab.id && styles.activeTabButton
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Ionicons 
                name={activeTab === tab.id ? tab.icon : `${tab.icon}-outline`} 
                size={20} 
                color={activeTab === tab.id ? '#1e3a8a' : 'rgba(255,255,255,0.7)'} 
              />
              <Text style={[
                styles.tabLabel,
                activeTab === tab.id && styles.activeTabLabel
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {/* Screen Content */}
      <View style={styles.screenContainer}>
        {renderActiveScreen()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  brandingSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    letterSpacing: -0.5,
  },
  actionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    gap: 8,
  },
  activeTabButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  activeTabLabel: {
    color: '#1e3a8a',
  },
  screenContainer: {
    flex: 1,
  },
});

export default TabNavigator;
