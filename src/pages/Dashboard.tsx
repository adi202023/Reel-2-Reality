import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Zap, Star, LogOut, User, Play, Film, Camera, Target } from 'lucide-react';
import { Button } from '../components/ui/button';
import ChallengeCard from '../components/ChallengeCard';
import { useApp } from '../context/AppContext';

interface DashboardStats {
  totalChallenges: number;
  completedChallenges: number;
  points: number;
  rank: number;
  level?: number;
  totalChallengesJoined?: number;
  averageRating?: number;
  friends?: number;
  notifications?: number;
  rewards?: number;
}

interface Notification {
  id: string;
  type: 'challenge' | 'friend' | 'reward' | 'achievement';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: string;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  points: number;
  level: number;
  status: 'online' | 'offline';
  mutualFriends: number;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  level: number;
  rank: number;
  avatar: string;
  badge: string;
  weeklyPoints: number;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'discount' | 'badge' | 'item' | 'experience';
  category: string;
  available: boolean;
  claimed: boolean;
  icon: string;
  expiryDate?: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, businessChallengesList, userSubmissions, theme, isDarkMode, toggleTheme } = useApp();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalChallenges: 12,
    completedChallenges: 8,
    points: 2450,
    rank: 999,
    friends: 24,
    notifications: 5,
    rewards: 3
  });
  const [userChallenges, setUserChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    loadUserData();
    loadNotifications();
    loadFriends();
    loadLeaderboard();
    loadRewards();
  }, [currentUser]);

  const loadUserData = async () => {
    try {
      setLoading(true);

      // Load user data from localStorage or create demo user
      const userData = localStorage.getItem('user');
      const authToken = localStorage.getItem('authToken');

      if (userData && authToken) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setStats({
          totalChallenges: 12,
          completedChallenges: parsedUser.completedChallenges || 8,
          points: parsedUser.points || 2450,
          rank: parsedUser.rank || 999,
          level: parsedUser.level || 15,
          friends: parsedUser.friends || 24,
          notifications: parsedUser.notifications || 5,
          rewards: parsedUser.rewards || 3
        });
      } else {
        // Create demo user if no user data exists
        const demoUser = {
          id: 'demo-user-' + Date.now(),
          name: 'Aditya Sheregar',
          email: 'aditya@example.com',
          points: 2450,
          level: 15,
          completedChallenges: 8,
          rank: 999,
          achievements: ['Early Adopter', 'Video Creator', 'Community Helper', 'Challenge Master'],
          joinDate: new Date().toISOString(),
          friends: 24,
          notifications: 5,
          rewards: 3
        };
        
        setUser(demoUser);
        localStorage.setItem('user', JSON.stringify(demoUser));
        localStorage.setItem('authToken', 'demo-token-' + Date.now());
        
        setStats({
          totalChallenges: 12,
          completedChallenges: 8,
          points: 2450,
          rank: 999,
          level: 15,
          friends: 24,
          notifications: 5,
          rewards: 3
        });
      }

      // Load challenges from business API
      await loadChallengesFromBusinessAPI();

    } catch (error) {
      console.error('Error loading user data:', error);
      // Create fallback user data
      const fallbackUser = {
        id: 'fallback-user',
        name: 'Aditya Sheregar',
        email: 'aditya@example.com',
        points: 2450,
        level: 15,
        completedChallenges: 8,
        rank: 999,
        achievements: ['New Member'],
        friends: 24,
        notifications: 5,
        rewards: 3
      };
      
      setUser(fallbackUser);
      setStats({
        totalChallenges: 12,
        completedChallenges: 8,
        points: 2450,
        rank: 999,
        level: 15,
        friends: 24,
        notifications: 5,
        rewards: 3
      });

      // Load fallback challenges
      setUserChallenges([
        {
          id: 1,
          title: 'Creative Video Challenge',
          description: 'Create a 30-second creative video showcasing your talent.',
          points: 250,
          difficulty: 'medium',
          category: 'creativity',
          participants: 1200,
          userStatus: 'available'
        },
        {
          id: 2,
          title: 'Coffee Art Challenge',
          description: 'Create beautiful latte art and share your masterpiece.',
          points: 180,
          difficulty: 'easy',
          category: 'Social Media',
          participants: 890,
          userStatus: 'in_progress'
        },
        {
          id: 3,
          title: 'Fitness Transformation',
          description: 'Document your 30-day fitness journey.',
          points: 500,
          difficulty: 'hard',
          category: 'Fitness',
          participants: 654,
          userStatus: 'completed',
          userPointsEarned: 500
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadChallengesFromBusinessAPI = async () => {
    try {
      console.log('🔄 Loading challenges from business API...');
      
      // Try multiple endpoints to get challenges
      const endpoints = [
        (window.location.port === '8081' ? 'http://localhost:3001' : '') + '/api/challenges/public',
        (window.location.port === '8081' ? 'http://localhost:3001' : '') + '/api/business/challenges'
      ];

      let response = null;
      let data = null;

      // Try public endpoint first (no auth required)
      try {
        response = await fetch(endpoints[0], {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          data = await response.json();
          console.log('✅ Successfully fetched from public endpoint:', data);
        }
      } catch (error) {
        console.log('⚠️ Public endpoint failed, trying authenticated endpoint...');
      }

      // If public endpoint failed, try authenticated endpoint
      if (!data || !data.success) {
        const businessToken = localStorage.getItem('businessAuthToken');
        const headers = {
          'Content-Type': 'application/json',
          ...(businessToken && { 'Authorization': `Bearer ${businessToken}` })
        };

        try {
          response = await fetch(endpoints[1], {
            method: 'GET',
            headers: headers,
          });

          if (response.ok) {
            data = await response.json();
            console.log('✅ Successfully fetched from authenticated endpoint:', data);
          }
        } catch (error) {
          console.log('⚠️ Authenticated endpoint also failed');
        }
      }

      if (data && data.success && data.data && data.data.challenges) {
        // Convert ALL business challenges to user challenge format
        const businessChallenges = data.data.challenges
          .map(challenge => ({
            id: challenge.id,
            title: challenge.title,
            description: challenge.description,
            points: challenge.points,
            difficulty: challenge.difficulty,
            category: challenge.category,
            participants: challenge.participants || 0,
            userStatus: challenge.status === 'active' ? 'available' : 'unavailable',
            businessId: challenge.businessId,
            rewards: challenge.rewards,
            requirements: challenge.requirements,
            startDate: challenge.startDate,
            endDate: challenge.endDate,
            status: challenge.status
          }));

        // Combine with existing mock challenges
        const mockChallenges = [
          {
            id: 'mock-1',
            title: 'Creative Video Challenge',
            description: 'Create a 30-second creative video showcasing your talent.',
            points: 250,
            difficulty: 'medium',
            category: 'creativity',
            participants: 1200,
            userStatus: 'available'
          },
          {
            id: 'mock-2',
            title: 'Fitness Transformation',
            description: 'Document your 30-day fitness journey.',
            points: 500,
            difficulty: 'hard',
            category: 'Fitness',
            participants: 654,
            userStatus: 'completed',
            userPointsEarned: 500
          }
        ];

        setUserChallenges([...businessChallenges, ...mockChallenges]);
        console.log(`✅ Successfully loaded ${businessChallenges.length} business challenges + ${mockChallenges.length} mock challenges`);
        
        // Update stats with actual challenge count
        setStats(prev => ({
          ...prev,
          totalChallenges: businessChallenges.length + mockChallenges.length
        }));

        // Show success message if challenges were loaded
        if (businessChallenges.length > 0) {
          console.log(`🎉 Found ${businessChallenges.length} business challenges!`);
        }
      } else {
        console.log('⚠️ No valid data received, loading mock business challenges...');
        await loadMockBusinessChallenges();
      }
    } catch (error) {
      console.error('❌ Error loading challenges from business API:', error);
      // Fallback to mock business challenges
      await loadMockBusinessChallenges();
    }
  };

  const loadMockBusinessChallenges = async () => {
    // Simulate business challenges for demo
    const mockBusinessChallenges = [
      {
        id: 'business-1',
        title: 'Coffee Art Challenge',
        description: 'Create beautiful latte art and share your masterpiece.',
        points: 150,
        difficulty: 'easy',
        category: 'Social Media',
        participants: 890,
        userStatus: 'available', // User hasn't joined yet
        status: 'active',
        businessId: 'demo-business',
        rewards: ['Free Coffee', '20% Discount'],
        requirements: ['Share on Instagram', 'Use hashtag #CoffeeArt']
      },
      {
        id: 'business-2',
        title: 'Breakfast Photo Contest',
        description: 'Share your best breakfast photo with our hashtag.',
        points: 100,
        difficulty: 'easy',
        category: 'Photography',
        participants: 567,
        userStatus: 'available', // User hasn't joined yet
        status: 'active',
        businessId: 'demo-business',
        rewards: ['Free Breakfast', 'Gift Card'],
        requirements: ['Upload photo', 'Use hashtag #BreakfastGoals']
      },
      {
        id: 'business-3',
        title: 'Review Challenge',
        description: 'Leave a detailed review and social media post.',
        points: 200,
        difficulty: 'easy',
        category: 'Reviews',
        participants: 234,
        userStatus: 'available', // User hasn't joined yet
        status: 'active',
        businessId: 'demo-business',
        rewards: ['10% Discount', 'Loyalty Points'],
        requirements: ['Write review', 'Rate 4+ stars']
      }
    ];

    const standardMockChallenges = [
      {
        id: 'mock-1',
        title: 'Creative Video Challenge',
        description: 'Create a 30-second creative video showcasing your talent.',
        points: 250,
        difficulty: 'medium',
        category: 'creativity',
        participants: 1200,
        userStatus: 'available' // User hasn't joined yet
      },
      {
        id: 'mock-2',
        title: 'Team Collaboration',
        description: 'Work with 3 other creators on a group project.',
        points: 500,
        difficulty: 'hard',
        category: 'Teamwork',
        participants: 654,
        userStatus: 'available' // User hasn't joined yet
      },
      {
        id: 'mock-3',
        title: 'Creative Video Challenge',
        description: 'Create a 30-second creative video showcasing your talent.',
        points: 250,
        difficulty: 'medium',
        category: 'creativity',
        participants: 1200,
        userStatus: 'available' // User hasn't joined yet
      },
      {
        id: 'mock-4',
        title: 'Fitness Transformation',
        description: 'Document your 30-day fitness journey.',
        points: 500,
        difficulty: 'hard',
        category: 'Fitness',
        participants: 654,
        userStatus: 'completed', // This one is actually completed
        userPointsEarned: 500
      }
    ];

    setUserChallenges([...mockBusinessChallenges, ...standardMockChallenges]);
    console.log('Loaded mock business challenges:', mockBusinessChallenges);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalChallenges: mockBusinessChallenges.length + standardMockChallenges.length
    }));
  };

  const loadNotifications = () => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'achievement',
        title: 'New Achievement Unlocked!',
        message: 'You earned the "Challenge Master" badge for completing 5 challenges this week!',
        timestamp: '2 minutes ago',
        read: false,
        icon: '🏆'
      },
      {
        id: '2',
        type: 'friend',
        title: 'Friend Request',
        message: 'Sarah Johnson wants to be your friend',
        timestamp: '1 hour ago',
        read: false,
        icon: '👥'
      },
      {
        id: '3',
        type: 'challenge',
        title: 'Challenge Completed',
        message: 'You completed the "Coffee Art Challenge" and earned 180 points!',
        timestamp: '3 hours ago',
        read: true,
        icon: '✅'
      },
      {
        id: '4',
        type: 'reward',
        title: 'New Reward Available',
        message: 'You can now redeem a 20% discount at participating cafes!',
        timestamp: '1 day ago',
        read: false,
        icon: '🎁'
      },
      {
        id: '5',
        type: 'challenge',
        title: 'New Challenge Available',
        message: 'Photography Challenge: Capture the perfect sunset',
        timestamp: '2 days ago',
        read: true,
        icon: '📸'
      }
    ];
    setNotifications(mockNotifications);
  };

  const loadFriends = () => {
    const mockFriends: Friend[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        avatar: '👩‍💼',
        points: 3200,
        level: 18,
        status: 'online',
        mutualFriends: 5
      },
      {
        id: '2',
        name: 'Mike Chen',
        avatar: '👨‍💻',
        points: 2800,
        level: 16,
        status: 'online',
        mutualFriends: 3
      },
      {
        id: '3',
        name: 'Emma Davis',
        avatar: '👩‍🎨',
        points: 2100,
        level: 14,
        status: 'offline',
        mutualFriends: 7
      },
      {
        id: '4',
        name: 'Alex Rodriguez',
        avatar: '👨‍🏫',
        points: 1950,
        level: 13,
        status: 'online',
        mutualFriends: 2
      },
      {
        id: '5',
        name: 'Lisa Wang',
        avatar: '👩‍🔬',
        points: 1800,
        level: 12,
        status: 'offline',
        mutualFriends: 4
      }
    ];
    setFriends(mockFriends);
  };

  const loadLeaderboard = () => {
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        id: '1',
        name: 'Jessica Martinez',
        points: 5420,
        level: 24,
        rank: 1,
        avatar: '👑',
        badge: 'Champion',
        weeklyPoints: 850
      },
      {
        id: '2',
        name: 'David Kim',
        points: 4890,
        level: 22,
        rank: 2,
        avatar: '🥈',
        badge: 'Master',
        weeklyPoints: 720
      },
      {
        id: '3',
        name: 'Rachel Green',
        points: 4350,
        level: 21,
        rank: 3,
        avatar: '🥉',
        badge: 'Expert',
        weeklyPoints: 680
      },
      {
        id: '4',
        name: 'Tom Wilson',
        points: 3980,
        level: 20,
        rank: 4,
        avatar: '🏅',
        badge: 'Pro',
        weeklyPoints: 590
      },
      {
        id: '5',
        name: 'Sophie Brown',
        points: 3650,
        level: 19,
        rank: 5,
        avatar: '⭐',
        badge: 'Advanced',
        weeklyPoints: 520
      }
    ];
    setLeaderboard(mockLeaderboard);
  };

  const loadRewards = () => {
    const mockRewards: Reward[] = [
      {
        id: '1',
        title: '20% Off Coffee',
        description: 'Get 20% discount at participating coffee shops',
        points: 500,
        type: 'discount',
        category: 'Food & Drink',
        available: true,
        claimed: false,
        icon: '☕',
        expiryDate: '2024-12-31'
      },
      {
        id: '2',
        title: 'Premium Badge',
        description: 'Exclusive golden badge for your profile',
        points: 1000,
        type: 'badge',
        category: 'Profile',
        available: true,
        claimed: false,
        icon: '🏆'
      },
      {
        id: '3',
        title: 'VIP Event Access',
        description: 'Access to exclusive community events',
        points: 2000,
        type: 'experience',
        category: 'Events',
        available: false,
        claimed: false,
        icon: '🎟️'
      },
      {
        id: '4',
        title: 'Challenge Master Kit',
        description: 'Special tools and resources for challenges',
        points: 1500,
        type: 'item',
        category: 'Tools',
        available: true,
        claimed: true,
        icon: '🎒'
      }
    ];
    setRewards(mockRewards);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      alert('Successfully joined the challenge!');
      setUserChallenges(prev => 
        prev.map(challenge => 
          challenge.id === parseInt(challengeId) 
            ? { ...challenge, userStatus: 'in_progress' }
            : challenge
        )
      );
    } catch (error) {
      console.error('Error joining challenge:', error);
      alert('Failed to join challenge');
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const sendFriendRequest = (friendId: string) => {
    alert('Friend request sent!');
  };

  const claimReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward && stats.points >= reward.points) {
      setRewards(prev => 
        prev.map(r => 
          r.id === rewardId ? { ...r, claimed: true } : r
        )
      );
      setStats(prev => ({ ...prev, points: prev.points - reward.points }));
      alert(`Successfully claimed: ${reward.title}!`);
    } else {
      alert('Not enough points to claim this reward!');
    }
  };

  const startChat = (friendName: string) => {
    // Create a simple chat modal
    const message = prompt(`Send a message to ${friendName}:`);
    if (message) {
      alert(`Message sent to ${friendName}: "${message}"`);
      
      // Add a notification for the chat
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: 'friend',
        title: 'Message Sent',
        message: `Your message was sent to ${friendName}`,
        timestamp: 'Just now',
        read: false,
        icon: '💬'
      };
      
      setNotifications(prev => [newNotification, ...prev]);
    }
  };

  const findFriends = () => {
    // Simulate finding new friends
    const potentialFriends = [
      { name: 'John Smith', level: 12, points: 1850, mutualFriends: 3 },
      { name: 'Maria Garcia', level: 16, points: 2100, mutualFriends: 2 },
      { name: 'David Wilson', level: 14, points: 1950, mutualFriends: 5 },
      { name: 'Sophie Taylor', level: 18, points: 2300, mutualFriends: 1 }
    ];
    
    const randomFriend = potentialFriends[Math.floor(Math.random() * potentialFriends.length)];
    
    const shouldAdd = confirm(`Found ${randomFriend.name} (Level ${randomFriend.level}, ${randomFriend.points} points, ${randomFriend.mutualFriends} mutual friends). Send friend request?`);
    
    if (shouldAdd) {
      // Add to friends list
      const newFriend: Friend = {
        id: Date.now().toString(),
        name: randomFriend.name,
        avatar: '👤',
        points: randomFriend.points,
        level: randomFriend.level,
        status: Math.random() > 0.5 ? 'online' : 'offline',
        mutualFriends: randomFriend.mutualFriends
      };
      
      setFriends(prev => [newFriend, ...prev]);
      setStats(prev => ({ ...prev, friends: prev.friends + 1 }));
      
      // Add notification
      const notification: Notification = {
        id: Date.now().toString(),
        type: 'friend',
        title: 'Friend Request Sent',
        message: `Friend request sent to ${randomFriend.name}`,
        timestamp: 'Just now',
        read: false,
        icon: '👥'
      };
      
      setNotifications(prev => [notification, ...prev]);
      alert(`Friend request sent to ${randomFriend.name}!`);
    }
  };

  const refreshChallenges = async () => {
    setLoading(true);
    await loadChallengesFromBusinessAPI();
    setLoading(false);
    alert('Challenges refreshed! New challenges from businesses are now available.');
  };

  const activeChallenges = businessChallengesList?.filter(c => c.status === 'active') || [];
  const userPendingSubmissions = userSubmissions?.filter(s => s.status === 'pending') || [];

  // Safety check for theme
  const safeTheme = theme && theme.colors ? theme : {
    colors: {
      background: isDarkMode ? '#0f172a' : '#ffffff',
      surface: isDarkMode ? '#1e293b' : '#f8fafc',
      border: isDarkMode ? '#334155' : '#e2e8f0',
      text: isDarkMode ? '#f1f5f9' : '#0f172a',
      textSecondary: isDarkMode ? '#94a3b8' : '#64748b'
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-4">Loading Dashboard...</h2>
          <p className="text-gray-400">Please wait while we load your data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: safeTheme.colors.background }}>
      {/* Sidebar */}
      <div className="w-64 flex flex-col" style={{ backgroundColor: safeTheme.colors.surface, borderRight: `1px solid ${safeTheme.colors.border}` }}>
        {/* User Profile Section */}
        <div className="p-6 border-b" style={{ borderColor: safeTheme.colors.border }}>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: safeTheme.colors.text }}>
                {user?.name || 'User'}
              </h3>
              <p className="text-sm" style={{ color: safeTheme.colors.textSecondary }}>
                Level {stats.level}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation - Scrollable Area */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'dashboard' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                  : 'hover:bg-blue-50 hover:text-blue-700'
              }`}
              style={{ color: activeTab === 'dashboard' ? 'white' : safeTheme.colors.text }}
            >
              🏠
              <span className="font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('challenges')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'challenges' 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg' 
                  : 'hover:bg-emerald-50 hover:text-emerald-700'
              }`}
              style={{ color: activeTab === 'challenges' ? 'white' : safeTheme.colors.text }}
            >
              🎯
              <span className="font-medium">Challenges</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'notifications' 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' 
                  : 'hover:bg-orange-50 hover:text-orange-700'
              }`}
              style={{ color: activeTab === 'notifications' ? 'white' : safeTheme.colors.text }}
            >
              🔔
              <span className="font-medium">Notifications</span>
              {stats.notifications > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {stats.notifications}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('friends')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'friends' 
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg' 
                  : 'hover:bg-purple-50 hover:text-purple-700'
              }`}
              style={{ color: activeTab === 'friends' ? 'white' : safeTheme.colors.text }}
            >
              👥
              <span className="font-medium">Friends</span>
              <span className="ml-auto bg-gray-500 text-white text-xs rounded-full px-2 py-1">
                {stats.friends}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'leaderboard' 
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg' 
                  : 'hover:bg-yellow-50 hover:text-yellow-700'
              }`}
              style={{ color: activeTab === 'leaderboard' ? 'white' : safeTheme.colors.text }}
            >
              🏆
              <span className="font-medium">Leaderboard</span>
            </button>

            <button
              onClick={() => setActiveTab('rewards')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'rewards' 
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg' 
                  : 'hover:bg-pink-50 hover:text-pink-700'
              }`}
              style={{ color: activeTab === 'rewards' ? 'white' : safeTheme.colors.text }}
            >
              🎁
              <span className="font-medium">Rewards</span>
              {stats.rewards > 0 && (
                <span className="ml-auto bg-green-500 text-white text-xs rounded-full px-2 py-1">
                  {stats.rewards}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'profile' 
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg' 
                  : 'hover:bg-indigo-50 hover:text-indigo-700'
              }`}
              style={{ color: activeTab === 'profile' ? 'white' : safeTheme.colors.text }}
            >
              👤
              <span className="font-medium">Profile</span>
            </button>
          </nav>
        </div>

        {/* Logout Section - Fixed at Bottom */}
        <div className="p-4 border-t" style={{ borderColor: safeTheme.colors.border }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl"
          >
            🚪
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b" style={{ backgroundColor: safeTheme.colors.surface, borderColor: safeTheme.colors.border }}>
          <div className="px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold" style={{ color: safeTheme.colors.text }}>
                  Welcome back, {user?.name?.split(' ')[0] || 'User'}! ⭐
                </h1>
                <p style={{ color: safeTheme.colors.textSecondary }}>
                  Ready to take on some challenges?
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-4 py-2 rounded-lg" style={{ backgroundColor: safeTheme.colors.background }}>
                  ⭐️
                  <span className="font-bold" style={{ color: safeTheme.colors.text }}>
                    {stats.points} pts
                  </span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 rounded-lg" style={{ backgroundColor: safeTheme.colors.background }}>
                  🏆
                  <span className="font-bold" style={{ color: safeTheme.colors.text }}>
                    #{stats.rank}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: safeTheme.colors.surface, border: `1px solid ${safeTheme.colors.border}` }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium" style={{ color: safeTheme.colors.textSecondary }}>
                        Total Challenges
                      </p>
                      <p className="text-2xl font-bold" style={{ color: safeTheme.colors.text }}>
                        {stats.totalChallenges}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      🏆
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: safeTheme.colors.surface, border: `1px solid ${safeTheme.colors.border}` }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium" style={{ color: safeTheme.colors.textSecondary }}>
                        Completed
                      </p>
                      <p className="text-2xl font-bold" style={{ color: safeTheme.colors.text }}>
                        {stats.completedChallenges}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      ⚡
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: safeTheme.colors.surface, border: `1px solid ${safeTheme.colors.border}` }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium" style={{ color: safeTheme.colors.textSecondary }}>
                        Points
                      </p>
                      <p className="text-2xl font-bold" style={{ color: safeTheme.colors.text }}>
                        {stats.points}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                      ⭐️
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: safeTheme.colors.surface, border: `1px solid ${safeTheme.colors.border}` }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium" style={{ color: safeTheme.colors.textSecondary }}>
                        Rank
                      </p>
                      <p className="text-2xl font-bold" style={{ color: safeTheme.colors.text }}>
                        #{stats.rank}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                      👥
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: safeTheme.colors.surface, border: `1px solid ${safeTheme.colors.border}` }}>
                  <h3 className="text-xl font-bold mb-4" style={{ color: safeTheme.colors.text }}>
                    📊 Recent Activity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: safeTheme.colors.background }}>
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                      <div className="flex-1">
                        <p className="font-medium" style={{ color: safeTheme.colors.text }}>Completed Coffee Art Challenge</p>
                        <p className="text-sm" style={{ color: safeTheme.colors.textSecondary }}>+180 points • 3 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: safeTheme.colors.background }}>
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">🏆</div>
                      <div className="flex-1">
                        <p className="font-medium" style={{ color: safeTheme.colors.text }}>Earned Challenge Master badge</p>
                        <p className="text-sm" style={{ color: safeTheme.colors.textSecondary }}>Achievement unlocked • 1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: safeTheme.colors.background }}>
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">👥</div>
                      <div className="flex-1">
                        <p className="font-medium" style={{ color: safeTheme.colors.text }}>Connected with Sarah Johnson</p>
                        <p className="text-sm" style={{ color: safeTheme.colors.textSecondary }}>New friend • 2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: safeTheme.colors.background }}>
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm">🎁</div>
                      <div className="flex-1">
                        <p className="font-medium" style={{ color: safeTheme.colors.text }}>Claimed Coffee Discount reward</p>
                        <p className="text-sm" style={{ color: safeTheme.colors.textSecondary }}>-500 points • 3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: safeTheme.colors.surface, border: `1px solid ${safeTheme.colors.border}` }}>
                  <h3 className="text-xl font-bold mb-4" style={{ color: safeTheme.colors.text }}>
                    🎯 Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => setActiveTab('challenges')}
                      className="h-20 bg-emerald-600 hover:bg-emerald-700 text-white flex flex-col items-center justify-center"
                    >
                      🎯
                      <span className="text-sm">Browse Challenges</span>
                    </Button>
                    <Button
                      onClick={() => setActiveTab('friends')}
                      className="h-20 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center"
                    >
                      👥
                      <span className="text-sm">Find Friends</span>
                    </Button>
                    <Button
                      onClick={() => setActiveTab('leaderboard')}
                      className="h-20 bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center justify-center"
                    >
                      🏆
                      <span className="text-sm">View Rankings</span>
                    </Button>
                    <Button
                      onClick={() => setActiveTab('rewards')}
                      className="h-20 bg-orange-600 hover:bg-orange-700 text-white flex flex-col items-center justify-center"
                    >
                      🎁
                      <span className="text-sm">Claim Rewards</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Featured Challenges */}
              {userChallenges.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold" style={{ color: safeTheme.colors.text }}>
                      🌟 Featured Challenges
                    </h2>
                    <Button
                      onClick={() => setActiveTab('challenges')}
                      variant="outline"
                      size="sm"
                    >
                      View All
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userChallenges.slice(0, 3).map((challenge) => (
                      <div key={challenge.id} className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow" 
                           style={{ backgroundColor: safeTheme.colors.surface, border: `1px solid ${safeTheme.colors.border}` }}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">
                              {challenge.category === 'Social Media' ? '📱' :
                               challenge.category === 'Photography' ? '📸' :
                               challenge.category === 'creativity' ? '🎨' :
                               challenge.category === 'Fitness' ? '💪' : '🏆'}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              challenge.difficulty === 'easy' ? 'text-green-600 bg-green-100' :
                              challenge.difficulty === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                              'text-red-600 bg-red-100'
                            }`}>
                              {challenge.difficulty}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-emerald-600 font-bold text-lg">{challenge.points}</p>
                            <p className="text-xs" style={{ color: safeTheme.colors.textSecondary }}>points</p>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2" style={{ color: safeTheme.colors.text }}>
                          {challenge.title}
                        </h3>
                        <p className="text-sm mb-4 line-clamp-2" style={{ color: safeTheme.colors.textSecondary }}>
                          {challenge.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm mb-4">
                          <div className="flex items-center space-x-1" style={{ color: safeTheme.colors.textSecondary }}>
                            👥
                            <span>{challenge.participants || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1" style={{ color: safeTheme.colors.textSecondary }}>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              challenge.userStatus === 'completed' ? 'bg-green-100 text-green-800' :
                              challenge.userStatus === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              challenge.userStatus === 'not_joined' ? 'bg-gray-100 text-gray-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {challenge.userStatus === 'completed' ? '✅ Completed' :
                               challenge.userStatus === 'in_progress' ? '🔄 In Progress' :
                               challenge.userStatus === 'not_joined' ? '⭐ Available' :
                               '⭐ Available'}
                            </span>
                          </div>
                        </div>
                        
                        {challenge.userStatus === 'not_joined' || challenge.userStatus === 'available' ? (
                          <Button 
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleJoinChallenge(challenge.id.toString())}
                          >
                            🏆
                            Join Challenge
                          </Button>
                        ) : challenge.userStatus === 'in_progress' ? (
                          <Button 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => navigate('/dashboard')}
                          >
                            ▶️
                            Continue Challenge
                          </Button>
                        ) : (
                          <Button 
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            disabled
                          >
                            🏆
                            Completed ({challenge.userPointsEarned} pts)
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Challenges Tab */}
          {activeTab === 'challenges' && (
            <div>
              {/* Available Challenges */}
              {userChallenges.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold" style={{ color: safeTheme.colors.text }}>
                      🌐 Available Challenges
                    </h2>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm" style={{ color: safeTheme.colors.textSecondary }}>
                        {userChallenges.length} challenges available
                      </div>
                      <Button
                        onClick={refreshChallenges}
                        variant="outline"
                        size="sm"
                      >
                        🔄 Refresh
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userChallenges.map((challenge) => (
                      <div key={challenge.id} className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow" 
                           style={{ backgroundColor: safeTheme.colors.surface, border: `1px solid ${safeTheme.colors.border}` }}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">
                              {challenge.category === 'Social Media' ? '📱' :
                               challenge.category === 'Photography' ? '📸' :
                               challenge.category === 'creativity' ? '🎨' :
                               challenge.category === 'Fitness' ? '💪' : '🏆'}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              challenge.difficulty === 'easy' ? 'text-green-600 bg-green-100' :
                              challenge.difficulty === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                              'text-red-600 bg-red-100'
                            }`}>
                              {challenge.difficulty}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-emerald-600 font-bold text-lg">{challenge.points}</p>
                            <p className="text-xs" style={{ color: safeTheme.colors.textSecondary }}>points</p>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2" style={{ color: safeTheme.colors.text }}>
                          {challenge.title}
                        </h3>
                        <p className="text-sm mb-4 line-clamp-2" style={{ color: safeTheme.colors.textSecondary }}>
                          {challenge.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm mb-4">
                          <div className="flex items-center space-x-1" style={{ color: safeTheme.colors.textSecondary }}>
                            👥
                            <span>{challenge.participants || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1" style={{ color: safeTheme.colors.textSecondary }}>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              challenge.userStatus === 'completed' ? 'bg-green-100 text-green-800' :
                              challenge.userStatus === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              challenge.userStatus === 'not_joined' ? 'bg-gray-100 text-gray-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {challenge.userStatus === 'completed' ? '✅ Completed' :
                               challenge.userStatus === 'in_progress' ? '🔄 In Progress' :
                               challenge.userStatus === 'not_joined' ? '⭐ Available' :
                               '⭐ Available'}
                            </span>
                          </div>
                        </div>
                        
                        {challenge.userStatus === 'not_joined' ? (
                          <Button 
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleJoinChallenge(challenge.id.toString())}
                          >
                            🏆
                            Join Challenge
                          </Button>
                        ) : challenge.userStatus === 'in_progress' ? (
                          <Button 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => navigate('/dashboard')}
                          >
                            ▶️
                            Continue Challenge
                          </Button>
                        ) : (
                          <Button 
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            disabled
                          >
                            🏆
                            Completed ({challenge.userPointsEarned} pts)
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              {/* User Profile Section */}
              <div className="rounded-xl p-6 shadow-lg mb-8" style={{ backgroundColor: safeTheme.colors.surface, border: `1px solid ${safeTheme.colors.border}` }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: safeTheme.colors.text }}>
                      User Profile
                    </h2>
                    <p className="text-sm" style={{ color: safeTheme.colors.textSecondary }}>
                      Manage your account settings and preferences
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    👨‍👩‍👧‍👦
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: safeTheme.colors.text }}>
                      Name
                    </label>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: safeTheme.colors.background, border: `1px solid ${safeTheme.colors.border}` }}>
                      <span style={{ color: safeTheme.colors.text }}>{user?.name || 'Demo User'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: safeTheme.colors.text }}>
                      Email
                    </label>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: safeTheme.colors.background, border: `1px solid ${safeTheme.colors.border}` }}>
                      <span style={{ color: safeTheme.colors.text }}>{user?.email || 'demo@user.com'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 rounded-lg" style={{ backgroundColor: safeTheme.colors.background, border: `1px solid ${safeTheme.colors.border}` }}>
                    <div className="text-2xl font-bold text-blue-600">{stats.totalChallenges}</div>
                    <div className="text-sm" style={{ color: safeTheme.colors.textSecondary }}>Total Challenges</div>
                  </div>
                  <div className="text-center p-4 rounded-lg" style={{ backgroundColor: safeTheme.colors.background, border: `1px solid ${safeTheme.colors.border}` }}>
                    <div className="text-2xl font-bold text-green-600">{stats.completedChallenges}</div>
                    <div className="text-sm" style={{ color: safeTheme.colors.textSecondary }}>Completed</div>
                  </div>
                  <div className="text-center p-4 rounded-lg" style={{ backgroundColor: safeTheme.colors.background, border: `1px solid ${safeTheme.colors.border}` }}>
                    <div className="text-2xl font-bold text-purple-600">{stats.points}</div>
                    <div className="text-sm" style={{ color: safeTheme.colors.textSecondary }}>Points</div>
                  </div>
                  <div className="text-center p-4 rounded-lg" style={{ backgroundColor: safeTheme.colors.background, border: `1px solid ${safeTheme.colors.border}` }}>
                    <div className="text-2xl font-bold text-orange-600">#{stats.rank}</div>
                    <div className="text-sm" style={{ color: safeTheme.colors.textSecondary }}>Rank</div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={() => alert('Profile editing coming soon!')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    👨‍👩‍👧‍👦
                    Edit Profile
                  </Button>
                  <Button
                    onClick={() => alert('Settings coming soon!')}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    ⚙️ Settings
                  </Button>
                </div>
              </div>

              {/* Achievements Section */}
              <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: safeTheme.colors.surface, border: `1px solid ${safeTheme.colors.border}` }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: safeTheme.colors.text }}>
                  🏆 Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(user?.achievements || ['Early Adopter', 'Video Creator', 'Community Helper', 'Challenge Master']).map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: safeTheme.colors.background, border: `1px solid ${safeTheme.colors.border}` }}>
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                        🏆
                      </div>
                      <div>
                        <div className="font-medium" style={{ color: safeTheme.colors.text }}>{achievement}</div>
                        <div className="text-sm" style={{ color: safeTheme.colors.textSecondary }}>Unlocked</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: safeTheme.colors.text }}>
                  🔔 Notifications
                </h2>
                <Button
                  onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                  variant="outline"
                  size="sm"
                >
                  Mark All as Read
                </Button>
              </div>

              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-xl p-4 shadow-lg cursor-pointer transition-all ${
                      !notification.read ? 'border-l-4 border-l-emerald-500' : ''
                    }`}
                    style={{ backgroundColor: safeTheme.colors.surface, border: `1px solid ${safeTheme.colors.border}` }}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">{notification.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold" style={{ color: safeTheme.colors.text }}>
                            {notification.title}
                          </h3>
                          <span className="text-xs" style={{ color: safeTheme.colors.textSecondary }}>
                            {notification.timestamp}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: safeTheme.colors.textSecondary }}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            notification.type === 'achievement' ? 'bg-yellow-100 text-yellow-800' :
                            notification.type === 'friend' ? 'bg-blue-100 text-blue-800' :
                            notification.type === 'challenge' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {notification.type}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Friends Tab */}
          {activeTab === 'friends' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: safeTheme.colors.text }}>
                  👥 Friends ({friends.length})
                </h2>
                <Button
                  onClick={() => findFriends()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  👥
                  Find Friends
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                    style={{ backgroundColor: safeTheme.colors.surface, border: `1px solid ${safeTheme.colors.border}` }}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          {friend.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold" style={{ color: safeTheme.colors.text }}>
                          {friend.name}
                        </h3>
                        <p className="text-sm" style={{ color: safeTheme.colors.textSecondary }}>
                          Level {friend.level} • {friend.points} pts
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: safeTheme.colors.textSecondary }}>Status:</span>
                        <span className={`font-medium ${friend.status === 'online' ? 'text-green-600' : 'text-gray-600'}`}>
                          {friend.status === 'online' ? '🟢 Online' : '⚫ Offline'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: safeTheme.colors.textSecondary }}>Mutual Friends:</span>
                        <span style={{ color: safeTheme.colors.text }}>{friend.mutualFriends}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => startChat(friend.name)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        💬
                        Chat
                      </Button>
                      <Button
                        onClick={() => alert(`Viewing ${friend.name}'s profile...`)}
                        variant="outline"
                        size="sm"
                      >
                        👨‍👩‍👧‍👦
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: safeTheme.colors.text }}>
                  📊 Interactive Leaderboard
                </h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Weekly</Button>
                  <Button variant="outline" size="sm">Monthly</Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" size="sm">All Time</Button>
                </div>
              </div>

              {/* Current User Position - Enhanced */}
              <div className="rounded-xl p-6 mb-6 border-2 border-emerald-500 bg-gradient-to-r from-emerald-500/10 to-teal-500/10" style={{ backgroundColor: safeTheme.colors.surface }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center ring-4 ring-emerald-500/30">
                        <span className="text-2xl">👤</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: safeTheme.colors.text }}>
                        {user?.name} (You)
                      </h3>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center space-x-1">
                          <span>⚡</span>
                          <span className="font-bold text-purple-500">Level {stats.level}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>🎯</span>
                          <span className="font-bold text-emerald-500">{stats.completedChallenges} completed</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>🔥</span>
                          <span className="font-bold text-orange-500">7 day streak</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">#{stats.rank}</div>
                    <div className="text-sm" style={{ color: safeTheme.colors.textSecondary }}>
                      {stats.points.toLocaleString()} points
                    </div>
                    <div className="text-xs text-emerald-500 font-medium">
                      +{Math.floor(Math.random() * 200) + 50} this week
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar for Current User */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2" style={{ color: safeTheme.colors.textSecondary }}>
                    <span>Progress to next rank</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000 ease-out"
                      style={{ width: '75%', boxShadow: '0 0 10px #10b981' }}
                    />
                  </div>
                </div>
              </div>

              {/* Enhanced Top Performers */}
              <div className="space-y-4">
                {leaderboard.map((entry, index) => {
                  const maxPoints = leaderboard[0]?.points || 1;
                  const progressPercentage = (entry.points / maxPoints) * 100;
                  const isTopThree = entry.rank <= 3;
                  
                  return (
                    <div
                      key={entry.id}
                      className={`rounded-xl p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] ${
                        entry.rank <= 3 ? 'border-2' : 'border'
                      } ${
                        entry.rank === 1 ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-yellow-100' :
                        entry.rank === 2 ? 'border-gray-400 bg-gradient-to-r from-gray-50 to-gray-100' :
                        entry.rank === 3 ? 'border-orange-400 bg-gradient-to-r from-orange-50 to-orange-100' :
                        ''
                      }`}
                      style={{ backgroundColor: entry.rank > 3 ? safeTheme.colors.surface : undefined, border: entry.rank > 3 ? `1px solid ${safeTheme.colors.border}` : undefined }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          {/* Enhanced Rank with Animation */}
                          <div className="w-16 flex justify-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                              entry.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-400/50' :
                              entry.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black shadow-lg shadow-gray-400/50' :
                              entry.rank === 3 ? 'bg-gradient-to-br from-orange-600 to-orange-800 text-white shadow-lg shadow-orange-600/50' :
                              'bg-gradient-to-br from-slate-600 to-slate-800 text-white'
                            }`}>
                              {entry.rank <= 3 ? (
                                <span className="text-2xl">
                                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                                </span>
                              ) : (
                                `#${entry.rank}`
                              )}
                            </div>
                          </div>
                          
                          {/* Enhanced Avatar with Status Ring */}
                          <div className="relative">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ring-4 transition-all duration-300 ${
                              entry.rank === 1 ? 'ring-yellow-400/50 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20' :
                              entry.rank === 2 ? 'ring-gray-400/50 bg-gradient-to-br from-gray-400/20 to-gray-600/20' :
                              entry.rank === 3 ? 'ring-orange-600/50 bg-gradient-to-br from-orange-600/20 to-orange-800/20' :
                              'ring-purple-500/30 bg-gradient-to-br from-purple-500/20 to-pink-500/20'
                            }`}>
                              <span className="text-2xl">{entry.avatar}</span>
                            </div>
                            {/* Activity Status Indicator */}
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            </div>
                          </div>
                          
                          {/* Enhanced User Info */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-bold" style={{ color: safeTheme.colors.text }}>
                                {entry.name}
                              </h3>
                              {entry.rank <= 3 && (
                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  entry.rank === 1 ? 'bg-yellow-400 text-black' :
                                  entry.rank === 2 ? 'bg-gray-400 text-black' :
                                  'bg-orange-600 text-white'
                                }`}>
                                  {entry.rank === 1 ? 'CHAMPION' : entry.rank === 2 ? 'RUNNER-UP' : 'BRONZE'}
                                </div>
                              )}
                            </div>
                            
                            {/* Stats Row */}
                            <div className="flex items-center space-x-6 text-sm">
                              <div className="flex items-center space-x-2">
                                <span className="text-xl">⚡</span>
                                <span className="font-bold text-purple-500">Level {entry.level}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xl">🎯</span>
                                <span className="font-bold text-emerald-500">{Math.floor(entry.level * 0.8)} completed</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xl">🔥</span>
                                <span className="font-bold text-orange-500">{Math.floor(Math.random() * 30) + 1} day streak</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Enhanced Points Display */}
                        <div className="text-right">
                          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-1">
                            {entry.points.toLocaleString()}
                          </div>
                          <div className="text-sm" style={{ color: safeTheme.colors.textSecondary }}>
                            points
                          </div>
                          <div className="text-xs text-emerald-500 font-medium">
                            +{entry.weeklyPoints} this week
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Bar Visualization */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2" style={{ color: safeTheme.colors.textSecondary }}>
                          <span>Progress to #1</span>
                          <span>{progressPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${
                              entry.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                              entry.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                              entry.rank === 3 ? 'bg-gradient-to-r from-orange-600 to-orange-800' :
                              'bg-gradient-to-r from-purple-500 to-pink-500'
                            }`}
                            style={{ 
                              width: `${progressPercentage}%`,
                              boxShadow: entry.rank <= 3 ? `0 0 10px ${
                                entry.rank === 1 ? '#facc15' :
                                entry.rank === 2 ? '#9ca3af' :
                                '#ea580c'
                              }` : 'none'
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Mini Achievement Badges */}
                      <div className="flex items-center space-x-2">
                        {entry.level >= 20 && (
                          <div className="px-2 py-1 bg-blue-500/20 text-blue-600 rounded-full text-xs font-medium border border-blue-500/30">
                            🏆 Challenger
                          </div>
                        )}
                        {entry.level >= 15 && (
                          <div className="px-2 py-1 bg-purple-500/20 text-purple-600 rounded-full text-xs font-medium border border-purple-500/30">
                            ⭐ Expert
                          </div>
                        )}
                        {entry.rank <= 10 && (
                          <div className="px-2 py-1 bg-emerald-500/20 text-emerald-600 rounded-full text-xs font-medium border border-emerald-500/30">
                            🔥 Top 10
                          </div>
                        )}
                        {Math.random() > 0.7 && (
                          <div className="px-2 py-1 bg-orange-500/20 text-orange-600 rounded-full text-xs font-medium border border-orange-500/30">
                            ⚡ Rising Star
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Performance Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="rounded-xl p-4 text-center" style={{ backgroundColor: safeTheme.colors.surface, border: `1px solid ${safeTheme.colors.border}` }}>
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="text-2xl font-bold text-yellow-500">{leaderboard[0]?.points.toLocaleString() || '0'}</div>
                  <div className="text-sm" style={{ color: safeTheme.colors.textSecondary }}>
                    Highest Score
                  </div>
                </div>
                
                <div className="rounded-xl p-4 text-center" style={{ backgroundColor: safeTheme.colors.surface, border: `1px solid ${safeTheme.colors.border}` }}>
                  <div className="text-2xl mb-2">📈</div>
                  <div className="text-2xl font-bold text-emerald-500">{Math.round(leaderboard.reduce((acc, entry) => acc + (entry.level * 0.8), 0) / leaderboard.length) || 0}</div>
                  <div className="text-sm" style={{ color: safeTheme.colors.textSecondary }}>
                    Avg. Completed
                  </div>
                </div>
                
                <div className="rounded-xl p-4 text-center" style={{ backgroundColor: safeTheme.colors.surface, border: `1px solid ${safeTheme.colors.border}` }}>
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="text-2xl font-bold text-purple-600">{Math.round(leaderboard.reduce((acc, entry) => acc + entry.level, 0) / leaderboard.length) || 0}</div>
                  <div className="text-sm" style={{ color: safeTheme.colors.textSecondary }}>
                    Avg. Level
                  </div>
                </div>

                <div className="rounded-xl p-4 text-center" style={{ backgroundColor: safeTheme.colors.surface, border: `1px solid ${safeTheme.colors.border}` }}>
                  <div className="text-2xl mb-2">👥</div>
                  <div className="text-2xl font-bold text-orange-600">{leaderboard.length}</div>
                  <div className="text-sm" style={{ color: safeTheme.colors.textSecondary }}>
                    Active Players
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rewards Tab */}
          {activeTab === 'rewards' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: safeTheme.colors.text }}>
                  🎁 Rewards Store
                </h2>
                <div className="flex items-center space-x-2 px-4 py-2 rounded-lg" style={{ backgroundColor: safeTheme.colors.surface }}>
                  ⭐️
                  <span className="font-bold" style={{ color: safeTheme.colors.text }}>
                    {stats.points} points available
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map((reward) => (
                  <div
                    key={reward.id}
                    className={`rounded-xl p-6 shadow-lg transition-all ${
                      reward.claimed ? 'opacity-60' : 'hover:shadow-xl'
                    } ${
                      !reward.available ? 'opacity-40' : ''
                    }`}
                    style={{ backgroundColor: safeTheme.colors.surface, border: `1px solid ${safeTheme.colors.border}` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">{reward.icon}</div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-emerald-600">
                          {reward.points} pts
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          reward.type === 'discount' ? 'bg-green-100 text-green-800' :
                          reward.type === 'badge' ? 'bg-yellow-100 text-yellow-800' :
                          reward.type === 'item' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {reward.category}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-2" style={{ color: safeTheme.colors.text }}>
                      {reward.title}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: safeTheme.colors.textSecondary }}>
                      {reward.description}
                    </p>

                    {reward.expiryDate && (
                      <div className="text-xs text-orange-600 mb-4">
                        Expires: {reward.expiryDate}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        reward.claimed ? 'bg-gray-100 text-gray-800' :
                        reward.available ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {reward.claimed ? 'Claimed' : reward.available ? 'Available' : 'Locked'}
                      </span>
                      
                      {reward.claimed ? (
                        <Button disabled size="sm" className="bg-gray-400 text-white">
                          🎁
                          Claimed
                        </Button>
                      ) : reward.available ? (
                        <Button
                          onClick={() => claimReward(reward.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          size="sm"
                          disabled={stats.points < reward.points}
                        >
                          🎁
                          {stats.points >= reward.points ? 'Claim' : 'Not Enough Points'}
                        </Button>
                      ) : (
                        <Button disabled size="sm" className="bg-gray-400 text-white">
                          🏆
                          Locked
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
