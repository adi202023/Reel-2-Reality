import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const RealTimeNotificationScreen = ({ navigation }) => {
  const { theme, isDarkMode, notificationsList, markNotificationAsRead } = useApp();
  const [liveNotifications, setLiveNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnims = useRef({}).current;

  // Simulate real-time notifications
  useEffect(() => {
    const simulateRealTimeNotifications = () => {
      const notificationTypes = [
        {
          type: 'challenge_completed',
          title: 'Challenge Completed!',
          message: 'Sarah just completed "Tech Innovation Sprint"',
          icon: 'checkmark-circle',
          color: '#10b981',
        },
        {
          type: 'new_challenge',
          title: 'New Challenge Available',
          message: 'AI Art Creation challenge is now live!',
          icon: 'flash',
          color: '#3b82f6',
        },
        {
          type: 'friend_activity',
          title: 'Friend Activity',
          message: 'Alex started "Sustainable Living Challenge"',
          icon: 'people',
          color: '#8b5cf6',
        },
        {
          type: 'achievement_unlocked',
          title: 'Achievement Unlocked!',
          message: 'You earned "Social Butterfly" badge',
          icon: 'trophy',
          color: '#f59e0b',
        },
        {
          type: 'level_up',
          title: 'Level Up!',
          message: 'Congratulations! You reached Level 5',
          icon: 'trending-up',
          color: '#ef4444',
        },
      ];

      const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      const newNotification = {
        id: Date.now(),
        ...randomNotification,
        timestamp: new Date(),
        isRead: false,
        isLive: true,
      };

      setLiveNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
      
      // Animate new notification
      slideAnims[newNotification.id] = new Animated.Value(-100);
      Animated.spring(slideAnims[newNotification.id], {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();

      // Show system notification simulation
      Alert.alert(
        randomNotification.title,
        randomNotification.message,
        [{ text: 'OK', style: 'default' }],
        { cancelable: true }
      );
    };

    // Start real-time simulation
    const interval = setInterval(simulateRealTimeNotifications, 8000);
    
    // Initial notification after 2 seconds
    const timeout = setTimeout(simulateRealTimeNotifications, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Connection status pulse animation
  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, []);

  const handleNotificationPress = (notification) => {
    if (notification.isLive) {
      setLiveNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      );
    } else {
      markNotificationAsRead(notification.id);
    }
  };

  const clearAllLiveNotifications = () => {
    setLiveNotifications([]);
    Alert.alert('Success', 'All live notifications cleared!');
  };

  const toggleConnection = () => {
    setIsConnected(!isConnected);
    Alert.alert(
      isConnected ? 'Disconnected' : 'Connected',
      isConnected ? 'Real-time notifications paused' : 'Real-time notifications resumed'
    );
  };

  const allNotifications = [...liveNotifications, ...notificationsList];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Live Notifications</Text>
        <TouchableOpacity onPress={toggleConnection}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Ionicons 
              name={isConnected ? "wifi" : "wifi-outline"} 
              size={24} 
              color={isConnected ? theme.colors.success : theme.colors.error} 
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Connection Status */}
      <View style={[styles.statusBar, { backgroundColor: isConnected ? theme.colors.success : theme.colors.error }]}>
        <View style={styles.statusContent}>
          <Ionicons name={isConnected ? "checkmark-circle" : "alert-circle"} size={16} color="white" />
          <Text style={styles.statusText}>
            {isConnected ? 'Connected - Receiving live updates' : 'Disconnected - No live updates'}
          </Text>
        </View>
      </View>

      {/* Live Notifications Counter */}
      <View style={[styles.counterSection, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.counterItem}>
          <Text style={[styles.counterNumber, { color: theme.colors.primary }]}>{liveNotifications.length}</Text>
          <Text style={[styles.counterLabel, { color: theme.colors.textSecondary }]}>Live</Text>
        </View>
        <View style={styles.counterDivider} />
        <View style={styles.counterItem}>
          <Text style={[styles.counterNumber, { color: theme.colors.text }]}>{allNotifications.length}</Text>
          <Text style={[styles.counterLabel, { color: theme.colors.textSecondary }]}>Total</Text>
        </View>
        <View style={styles.counterDivider} />
        <TouchableOpacity style={styles.counterItem} onPress={clearAllLiveNotifications}>
          <Ionicons name="trash" size={20} color={theme.colors.error} />
          <Text style={[styles.counterLabel, { color: theme.colors.error }]}>Clear Live</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={true}
        keyboardShouldPersistTaps="handled"
      >
        {allNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Notifications</Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
              Live notifications will appear here when available
            </Text>
          </View>
        ) : (
          allNotifications.map((notification, index) => (
            <Animated.View
              key={notification.id}
              style={[
                styles.notificationItem,
                { 
                  backgroundColor: theme.colors.surface,
                  borderLeftColor: notification.color || theme.colors.primary,
                  opacity: notification.isRead ? 0.7 : 1,
                  transform: notification.isLive && slideAnims[notification.id] 
                    ? [{ translateX: slideAnims[notification.id] }] 
                    : []
                }
              ]}
            >
              <TouchableOpacity
                style={styles.notificationContent}
                onPress={() => handleNotificationPress(notification)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: notification.color || theme.colors.primary }]}>
                  <Ionicons name={notification.icon} size={20} color="white" />
                </View>
                
                <View style={styles.textContainer}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.notificationTitle, { color: theme.colors.text }]}>
                      {notification.title}
                    </Text>
                    {notification.isLive && (
                      <View style={styles.liveBadge}>
                        <Text style={styles.liveBadgeText}>LIVE</Text>
                      </View>
                    )}
                    {!notification.isRead && <View style={styles.unreadDot} />}
                  </View>
                  
                  <Text style={[styles.notificationMessage, { color: theme.colors.textSecondary }]}>
                    {notification.message}
                  </Text>
                  
                  <Text style={[styles.notificationTime, { color: theme.colors.textSecondary }]}>
                    {notification.isLive 
                      ? 'Just now' 
                      : new Date(notification.timestamp).toLocaleTimeString()
                    }
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  statusBar: {
    paddingVertical: 8,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  counterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
  },
  counterItem: {
    flex: 1,
    alignItems: 'center',
  },
  counterNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  counterLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  counterDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  notificationItem: {
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  liveBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  liveBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
});

export default RealTimeNotificationScreen;
