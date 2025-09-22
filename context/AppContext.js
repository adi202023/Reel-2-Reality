import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockChallenges, mockFriends, mockNotifications } from '../data/mockData';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [challengesList, setChallengesList] = useState(mockChallenges);
  const [friendsList, setFriendsList] = useState(mockFriends);
  const [notificationsList, setNotificationsList] = useState(mockNotifications);
  const [sentChallenges, setSentChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme configuration
  const lightTheme = {
    colors: {
      background: '#f8fafc',
      surface: '#ffffff',
      primary: '#3b82f6',
      secondary: '#6366f1',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      gradient: ['#1e3a8a', '#3b82f6'],
    },
  };

  const darkTheme = {
    colors: {
      background: '#0f172a',
      surface: '#1e293b',
      primary: '#60a5fa',
      secondary: '#818cf8',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      gradient: ['#1e1b4b', '#3730a3'],
    },
  };

  const theme = isDarkMode ? darkTheme : lightTheme;
  theme.isDark = isDarkMode;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const signUp = async (name, username, password, avatar = null) => {
    try {
      // Check if username already exists
      const existingUser = registeredUsers.find(user => user.username.toLowerCase() === username.toLowerCase());
      if (existingUser) {
        throw new Error('Username already exists');
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser = {
        id: Date.now(),
        name: name.trim(),
        username: username.trim(),
        password,
        points: 0,
        level: 1,
        completedChallenges: 0,
        avatar: avatar,
        joinDate: new Date(),
        achievements: [],
        friends: friendsList.map(friend => ({ ...friend, isFriend: false }))
      };

      // Add to registered users
      setRegisteredUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setIsAuthenticated(true);

      const welcomeNotification = {
        id: Date.now(),
        type: 'welcome',
        title: 'Welcome to Reel to Reality!',
        message: `Hey ${name}! Ready to take on some challenges?`,
        timestamp: new Date(),
        read: false
      };
      setNotificationsList(prev => [welcomeNotification, ...prev]);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const signIn = async (username, password) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if any users are registered
      if (registeredUsers.length === 0) {
        throw new Error('No accounts found. Please create an account first.');
      }

      // Find user with matching credentials
      const user = registeredUsers.find(u => 
        u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );

      if (!user) {
        // Check if username exists but password is wrong
        const userExists = registeredUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (userExists) {
          throw new Error('Invalid password. Please try again.');
        } else {
          throw new Error('Account not found. Please create an account first.');
        }
      }

      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('SignIn error:', error);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setNotificationsList([]);
    setSentChallenges([]);
    setCompletedChallenges([]);
  };

  const sendChallenge = (challengeId, friendId) => {
    const challenge = challengesList.find(c => c.id === challengeId);
    const friend = friendsList.find(f => f.id === friendId);
    
    if (challenge && friend) {
      const newSentChallenge = {
        id: Date.now(),
        challenge,
        friend,
        sentAt: new Date(),
        status: 'sent'
      };
      
      setSentChallenges(prev => [...prev, newSentChallenge]);
      
      // Add notification for sent challenge
      const sentNotification = {
        id: Date.now(),
        type: 'challenge_sent',
        title: 'Challenge Sent!',
        message: `You challenged ${friend.name} to "${challenge.title}"`,
        timestamp: new Date(),
        read: false
      };
      
      setNotificationsList(prev => [sentNotification, ...prev]);
      return true;
    }
    return false;
  };

  const completeChallenge = (challengeId, proofData) => {
    const challenge = challengesList.find(c => c.id === challengeId);
    
    if (challenge) {
      const newCompletedChallenge = {
        id: Date.now(),
        challenge,
        proofData,
        completedAt: new Date(),
        pointsEarned: challenge.points
      };
      
      setCompletedChallenges(prev => [...prev, newCompletedChallenge]);
      
      // Update user points and level
      const newPoints = currentUser.points + challenge.points;
      const newLevel = Math.floor(newPoints / 500) + 1;
      const newCompletedCount = currentUser.completedChallenges + 1;
      
      setCurrentUser(prev => ({
        ...prev,
        points: newPoints,
        completedChallenges: newCompletedCount,
        level: newLevel
      }));
      
      // Add completion notification
      const completionNotification = {
        id: Date.now(),
        type: 'challenge_completed',
        title: 'Challenge Completed! 🎉',
        message: `You earned ${challenge.points} points for "${challenge.title}"`,
        timestamp: new Date(),
        read: false
      };
      
      // Check for level up
      if (newLevel > currentUser.level) {
        const levelUpNotification = {
          id: Date.now() + 1,
          type: 'level_up',
          title: 'Level Up! 🚀',
          message: `Congratulations! You reached Level ${newLevel}`,
          timestamp: new Date(),
          read: false
        };
        setNotificationsList(prev => [levelUpNotification, completionNotification, ...prev]);
      } else {
        setNotificationsList(prev => [completionNotification, ...prev]);
      }
      
      return true;
    }
    return false;
  };

  const markNotificationAsRead = (notificationId) => {
    setNotificationsList(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotificationsList(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getUnreadNotificationCount = () => {
    return notificationsList.filter(n => !n.read).length;
  };

  const addFriend = (friendData) => {
    const newFriend = {
      id: Date.now(),
      ...friendData,
      status: 'online'
    };
    setFriendsList(prev => [...prev, newFriend]);
    
    setCurrentUser(prev => ({
      ...prev,
      totalFriends: prev.totalFriends + 1
    }));
  };

  const value = {
    isAuthenticated,
    currentUser,
    challengesList,
    friendsList,
    notificationsList,
    sentChallenges,
    completedChallenges,
    registeredUsers,
    unreadCount: getUnreadNotificationCount(),
    signUp,
    signIn,
    logout,
    sendChallenge,
    completeChallenge,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationCount,
    addFriend,
    isDarkMode,
    toggleTheme,
    theme
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
