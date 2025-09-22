import React, { createContext, useContext, useState, useEffect } from 'react';

// Type definitions
interface User {
  id: number;
  name: string;
  username?: string;
  email?: string;
  password?: string;
  points: number;
  level: number;
  completedChallenges: number;
  avatar?: string | null;
  joinDate: Date;
  achievements: string[];
  friends?: Friend[];
  totalFriends?: number;
}

interface Friend {
  id: number;
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
  isFriend?: boolean;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit?: number;
}

interface BusinessChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  status: 'active' | 'draft' | 'completed';
  participants: number;
  completions: number;
  startDate: string;
  endDate: string;
  rewards: string[];
  successRate: number;
  businessName: string;
  businessType: string;
  location?: string;
}

interface UserSubmission {
  id: string;
  userId: number;
  challengeId: string;
  challengeTitle: string;
  submissionType: 'video' | 'photo' | 'social_media';
  content: string;
  mediaUrl?: string;
  instagramUrl?: string;
  hashtags?: string[];
  likes?: number;
  comments?: number;
  shares?: number;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  businessReview?: string;
  rewardGranted?: string;
  pointsEarned?: number;
}

interface Notification {
  id: number;
  type: 'welcome' | 'challenge_sent' | 'challenge_completed' | 'level_up' | 'business_challenge_submission' | 'business_reward_granted';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface SentChallenge {
  id: number;
  challenge: Challenge;
  friend: Friend;
  sentAt: Date;
  status: 'sent' | 'accepted' | 'completed';
}

interface CompletedChallenge {
  id: number;
  challenge: Challenge;
  proofData: any;
  completedAt: Date;
  pointsEarned: number;
}

interface Theme {
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    gradient: string[];
  };
  isDark?: boolean;
}

interface AppContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  challengesList: Challenge[];
  businessChallengesList: BusinessChallenge[];
  userSubmissions: UserSubmission[];
  friendsList: Friend[];
  notificationsList: Notification[];
  sentChallenges: SentChallenge[];
  completedChallenges: CompletedChallenge[];
  registeredUsers: User[];
  unreadCount: number;
  signUp: (name: string, username: string, password: string, avatar?: string | null) => Promise<boolean>;
  signIn: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  sendChallenge: (challengeId: number, friendId: number) => boolean;
  completeChallenge: (challengeId: number, proofData: any) => boolean;
  markNotificationAsRead: (notificationId: number) => void;
  markAllNotificationsAsRead: () => void;
  getUnreadNotificationCount: () => number;
  addFriend: (friendData: Partial<Friend>) => void;
  submitToBusinessChallenge: (challengeId: string, submissionData: Partial<UserSubmission>) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: Theme;
}

// Mock data
const mockChallenges: Challenge[] = [
  {
    id: 1,
    title: "Creative Video Challenge",
    description: "Create a 30-second creative video showcasing your talent.",
    points: 250,
    difficulty: 'medium',
    category: 'creativity'
  },
  {
    id: 2,
    title: "Team Collaboration",
    description: "Work with 3 other creators on a group project.",
    points: 500,
    difficulty: 'hard',
    category: 'teamwork'
  },
  {
    id: 3,
    title: "Speed Challenge",
    description: "Complete this challenge in under 10 minutes.",
    points: 150,
    difficulty: 'easy',
    category: 'speed'
  }
];

const initializeBusinessChallenges = (): BusinessChallenge[] => [
  {
    id: 'bc-1',
    title: 'Create the most creative latte art and share it on social media',
    description: 'Show your artistic skills by creating beautiful latte art designs. Share your creation on Instagram with our hashtag and tag our location for a chance to win amazing rewards!',
    points: 150,
    difficulty: 'medium',
    category: 'Social Media',
    status: 'active',
    participants: 45,
    completions: 32,
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    rewards: ['Free Coffee for a Week', '20% Discount on All Items', 'Featured on Our Instagram'],
    successRate: 71,
    businessName: 'Artisan Coffee House',
    businessType: 'cafe',
    location: 'Downtown District'
  },
  {
    id: 'bc-2',
    title: 'Share your best breakfast photo with our hashtag',
    description: 'Capture and share your most appetizing breakfast moment at our restaurant. Use #BreakfastGoals and show the world why our breakfast is the best in town!',
    points: 100,
    difficulty: 'easy',
    category: 'Photography',
    status: 'active',
    participants: 67,
    completions: 54,
    startDate: '2024-01-10',
    endDate: '2024-02-28',
    rewards: ['Free Breakfast Item', 'Instagram Feature', '$10 Gift Card'],
    successRate: 81,
    businessName: 'Morning Glory Diner',
    businessType: 'restaurant',
    location: 'City Center'
  },
  {
    id: 'bc-3',
    title: 'Leave a detailed review on Google and social media',
    description: 'Help us grow by sharing your experience with others! Write a detailed review on Google and share your visit on your social media. Your honest feedback helps us improve!',
    points: 200,
    difficulty: 'easy',
    category: 'Reviews',
    status: 'active',
    participants: 89,
    completions: 76,
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    rewards: ['Free Appetizer', 'VIP Status', '15% Lifetime Discount'],
    successRate: 85,
    businessName: 'Gourmet Bistro',
    businessType: 'restaurant',
    location: 'Uptown'
  },
  {
    id: 'bc-4',
    title: 'Fashion Challenge: Style Our Latest Collection',
    description: 'Create a unique outfit using items from our latest collection. Share your styling tips and fashion inspiration with our community!',
    points: 300,
    difficulty: 'hard',
    category: 'Fashion',
    status: 'active',
    participants: 23,
    completions: 18,
    startDate: '2024-01-20',
    endDate: '2024-02-20',
    rewards: ['$50 Store Credit', 'Personal Styling Session', 'Featured in Newsletter'],
    successRate: 78,
    businessName: 'Trendy Threads Boutique',
    businessType: 'retail',
    location: 'Fashion District'
  },
  {
    id: 'bc-5',
    title: 'Fitness Challenge: 30-Day Transformation',
    description: 'Join our 30-day fitness transformation challenge! Document your journey, share your progress, and inspire others to achieve their fitness goals.',
    points: 500,
    difficulty: 'hard',
    category: 'Fitness',
    status: 'active',
    participants: 156,
    completions: 89,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    rewards: ['Free Month Membership', 'Personal Training Session', 'Fitness Gear Package'],
    successRate: 57,
    businessName: 'PowerFit Gym',
    businessType: 'fitness',
    location: 'Sports Complex'
  },
  {
    id: 'bc-6',
    title: 'Create a TikTok dance with our signature smoothie',
    description: 'Show off your dance moves while enjoying our signature smoothie! Create a fun TikTok video and use our branded hashtag for a chance to go viral!',
    points: 175,
    difficulty: 'medium',
    category: 'Social Media',
    status: 'active',
    participants: 78,
    completions: 45,
    startDate: '2024-01-12',
    endDate: '2024-02-12',
    rewards: ['Free Smoothie Daily for a Week', 'TikTok Collaboration', '$25 Gift Card'],
    successRate: 58,
    businessName: 'Fresh Juice Bar',
    businessType: 'cafe',
    location: 'Beach Front'
  }
];

const mockFriends: Friend[] = [
  { id: 1, name: "Alex Johnson", status: 'online' },
  { id: 2, name: "Sarah Chen", status: 'offline' },
  { id: 3, name: "Mike Rodriguez", status: 'online' }
];

const mockNotifications: Notification[] = [];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [challengesList, setChallengesList] = useState<Challenge[]>(mockChallenges);
  const [businessChallengesList, setBusinessChallengesList] = useState<BusinessChallenge[]>(initializeBusinessChallenges());
  const [userSubmissions, setUserSubmissions] = useState<UserSubmission[]>([]);
  const [friendsList, setFriendsList] = useState<Friend[]>(mockFriends);
  const [notificationsList, setNotificationsList] = useState<Notification[]>(mockNotifications);
  const [sentChallenges, setSentChallenges] = useState<SentChallenge[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<CompletedChallenge[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Theme configuration
  const lightTheme: Theme = {
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

  const darkTheme: Theme = {
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

  const signUp = async (name: string, username: string, password: string, avatar: string | null = null): Promise<boolean> => {
    try {
      const existingUser = registeredUsers.find(user => user.username?.toLowerCase() === username.toLowerCase());
      if (existingUser) {
        throw new Error('Username already exists');
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser: User = {
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

      setRegisteredUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setIsAuthenticated(true);

      const welcomeNotification: Notification = {
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

  const signIn = async (username: string, password: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (registeredUsers.length === 0) {
        throw new Error('No accounts found. Please create an account first.');
      }

      const user = registeredUsers.find(u => 
        u.username?.toLowerCase() === username.toLowerCase() && u.password === password
      );

      if (!user) {
        const userExists = registeredUsers.find(u => u.username?.toLowerCase() === username.toLowerCase());
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

  const sendChallenge = (challengeId: number, friendId: number): boolean => {
    const challenge = challengesList.find(c => c.id === challengeId);
    const friend = friendsList.find(f => f.id === friendId);
    
    if (challenge && friend) {
      const newSentChallenge: SentChallenge = {
        id: Date.now(),
        challenge,
        friend,
        sentAt: new Date(),
        status: 'sent'
      };
      
      setSentChallenges(prev => [...prev, newSentChallenge]);
      
      const sentNotification: Notification = {
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

  const completeChallenge = (challengeId: number, proofData: any): boolean => {
    const challenge = challengesList.find(c => c.id === challengeId);
    
    if (challenge && currentUser) {
      const newCompletedChallenge: CompletedChallenge = {
        id: Date.now(),
        challenge,
        proofData,
        completedAt: new Date(),
        pointsEarned: challenge.points
      };
      
      setCompletedChallenges(prev => [...prev, newCompletedChallenge]);
      
      const newPoints = currentUser.points + challenge.points;
      const newLevel = Math.floor(newPoints / 500) + 1;
      const newCompletedCount = currentUser.completedChallenges + 1;
      
      setCurrentUser(prev => prev ? ({
        ...prev,
        points: newPoints,
        completedChallenges: newCompletedCount,
        level: newLevel
      }) : null);
      
      const completionNotification: Notification = {
        id: Date.now(),
        type: 'challenge_completed',
        title: 'Challenge Completed! 🎉',
        message: `You earned ${challenge.points} points for "${challenge.title}"`,
        timestamp: new Date(),
        read: false
      };
      
      if (newLevel > currentUser.level) {
        const levelUpNotification: Notification = {
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

  const submitToBusinessChallenge = (challengeId: string, submissionData: Partial<UserSubmission>) => {
    const challenge = businessChallengesList.find(c => c.id === challengeId);
    
    if (challenge && currentUser) {
      const newSubmission: UserSubmission = {
        id: Date.now().toString(),
        userId: currentUser.id,
        challengeId,
        challengeTitle: challenge.title,
        submissionType: submissionData.submissionType || 'video',
        content: submissionData.content || '',
        mediaUrl: submissionData.mediaUrl,
        instagramUrl: submissionData.instagramUrl,
        hashtags: submissionData.hashtags,
        likes: 0,
        comments: 0,
        shares: 0,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };
      
      setUserSubmissions(prev => [...prev, newSubmission]);
      
      const submissionNotification: Notification = {
        id: Date.now(),
        type: 'business_challenge_submission',
        title: 'Submission Received!',
        message: `You submitted to "${challenge.title}"`,
        timestamp: new Date(),
        read: false
      };
      
      setNotificationsList(prev => [submissionNotification, ...prev]);
    }
  };

  const markNotificationAsRead = (notificationId: number) => {
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

  const getUnreadNotificationCount = (): number => {
    return notificationsList.filter(n => !n.read).length;
  };

  const addFriend = (friendData: Partial<Friend>) => {
    const newFriend: Friend = {
      id: Date.now(),
      name: friendData.name || 'Unknown',
      status: friendData.status || 'offline',
      ...friendData
    };
    setFriendsList(prev => [...prev, newFriend]);
    
    if (currentUser) {
      setCurrentUser(prev => prev ? ({
        ...prev,
        totalFriends: (prev.totalFriends || 0) + 1
      }) : null);
    }
  };

  const value: AppContextType = {
    isAuthenticated,
    currentUser,
    challengesList,
    businessChallengesList,
    userSubmissions,
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
    submitToBusinessChallenge,
    isDarkMode,
    toggleTheme,
    theme
  };

  return React.createElement(AppContext.Provider, { value }, children);
};
