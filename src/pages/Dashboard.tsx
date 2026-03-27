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

  // ── Toast notification system ────────────────────────────────────────────
  const [toasts, setToasts] = React.useState<{id:string; msg:string; type:'success'|'info'|'error'}[]>([]);
  const showToast = React.useCallback((msg: string, type: 'success'|'info'|'error' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  // ── Chat modal state ──────────────────────────────────────────────────────
  const [chatModal, setChatModal] = React.useState<{open:boolean; friendName:string; msg:string}>({open:false, friendName:'', msg:''});

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      setUserChallenges(prev =>
        prev.map(challenge =>
          challenge.id === parseInt(challengeId)
            ? { ...challenge, userStatus: 'in_progress' }
            : challenge
        )
      );
      showToast('🚀 Successfully joined the challenge!', 'success');
    } catch (error) {
      console.error('Error joining challenge:', error);
      showToast('Failed to join challenge', 'error');
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
      setRewards(prev => prev.map(r => r.id === rewardId ? { ...r, claimed: true } : r));
      setStats(prev => ({ ...prev, points: prev.points - reward.points }));
      showToast(`🎁 Successfully claimed: ${reward.title}!`, 'success');
    } else {
      showToast('Not enough points to claim this reward!', 'error');
    }
  };

  const startChat = (friendName: string) => {
    setChatModal({ open: true, friendName, msg: '' });
  };

  const sendChatMessage = () => {
    if (chatModal.msg.trim()) {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: 'friend',
        title: 'Message Sent',
        message: `Your message was sent to ${chatModal.friendName}`,
        timestamp: 'Just now',
        read: false,
        icon: '💬'
      };
      setNotifications(prev => [newNotification, ...prev]);
      showToast(`💬 Message sent to ${chatModal.friendName}!`, 'success');
    }
    setChatModal({ open: false, friendName: '', msg: '' });
  };

  const findFriends = () => {
    const potentialFriends = [
      { name: 'John Smith', level: 12, points: 1850, mutualFriends: 3 },
      { name: 'Maria Garcia', level: 16, points: 2100, mutualFriends: 2 },
      { name: 'David Wilson', level: 14, points: 1950, mutualFriends: 5 },
      { name: 'Sophie Taylor', level: 18, points: 2300, mutualFriends: 1 }
    ];
    const randomFriend = potentialFriends[Math.floor(Math.random() * potentialFriends.length)];
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
    setNotifications(prev => [{
      id: Date.now().toString(),
      type: 'friend',
      title: 'Friend Request Sent',
      message: `Friend request sent to ${randomFriend.name}`,
      timestamp: 'Just now',
      read: false,
      icon: '👥'
    }, ...prev]);
    showToast(`👥 Friend request sent to ${randomFriend.name}!`, 'success');
  };

  const refreshChallenges = async () => {
    setLoading(true);
    await loadChallengesFromBusinessAPI();
    setLoading(false);
    showToast('✅ Challenges refreshed!', 'success');
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B0F14' }}>
        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div className="animate-orb-drift" style={{ position: 'absolute', top: '20%', left: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div className="animate-orb-drift delay-700" style={{ position: 'absolute', top: '50%', right: '10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>
        <div className="text-center" style={{ position: 'relative', zIndex: 1 }}>
          <div className="animate-glow-ring" style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid transparent', background: 'linear-gradient(#0B0F14, #0B0F14) padding-box, linear-gradient(135deg, #7C3AED, #06B6D4) border-box', margin: '0 auto 1.5rem', animation: 'spinRing 1s linear infinite' }} />
          <h2 className="text-2xl font-bold mb-2 gradient-text">Loading Dashboard</h2>
          <p style={{ color: '#64748B' }}>Preparing your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0B0F14', fontFamily: "'Outfit', sans-serif", position: 'relative' }}>
      {/* Gradient orb background */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div className="animate-orb-drift" style={{ position: 'absolute', top: '10%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="animate-orb-drift delay-1000" style={{ position: 'absolute', top: '60%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="animate-orb-drift delay-500" style={{ position: 'absolute', bottom: '10%', left: '40%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(250,204,21,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>
      {/* XP progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 100, background: 'rgba(255,255,255,0.03)' }}>
        <div className="xp-bar-fill" style={{ width: `${Math.min(100, ((stats.points % 1000) / 1000) * 100)}%` }} />
      </div>
      {/* Sidebar */}
      <div style={{ width: 240, minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(24px)', borderRight: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, zIndex: 50, flexShrink: 0 }}>
        {/* User Profile Section */}
        <div style={{ padding: '1.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div className="animate-glow-ring" style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 3px rgba(124,58,237,0.3), 0 0 20px rgba(124,58,237,0.25)', flexShrink: 0 }}>
              <span style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>{user?.name?.charAt(0) || 'U'}</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ color: '#F1F5F9', fontWeight: 700, fontSize: '0.95rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name?.split(' ')[0] || 'User'}</h3>
              <p style={{ color: '#7C3AED', fontSize: '0.78rem', margin: 0, fontWeight: 600 }}>Level {stats.level} · {stats.points} XP</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {[
            { id: 'dashboard', icon: '⬡', label: 'Dashboard' },
            { id: 'challenges', icon: '⚡', label: 'Challenges' },
            { id: 'notifications', icon: '🔔', label: 'Notifications', badge: stats.notifications },
            { id: 'friends', icon: '👥', label: 'Friends', badge: stats.friends },
            { id: 'leaderboard', icon: '🏆', label: 'Leaderboard' },
            { id: 'rewards', icon: '🎁', label: 'Rewards', badge: stats.rewards },
            { id: 'profile', icon: '👤', label: 'Profile' },
          ].map(({ id, icon, label, badge }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.65rem 0.875rem', borderRadius: '0.75rem', border: 'none',
                cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '0.9rem',
                transition: 'all 0.2s ease',
                background: activeTab === id
                  ? 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))'
                  : 'transparent',
                color: activeTab === id ? '#F1F5F9' : '#64748B',
                boxShadow: activeTab === id ? 'inset 0 0 0 1px rgba(124,58,237,0.4)' : 'none',
              }}
            >
              <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{icon}</span>
              <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
              {badge > 0 && (
                <span style={{ background: id === 'friends' ? 'rgba(100,116,139,0.4)' : 'linear-gradient(135deg,#7C3AED,#06B6D4)', color: 'white', borderRadius: '999px', padding: '1px 8px', fontSize: '0.7rem', fontWeight: 700 }}>{badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* Logout */}
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.875rem', borderRadius: '0.75rem', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#F87171', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s ease' }}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(11,15,20,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="animate-stagger-fade">
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F1F5F9', margin: 0 }}>
                Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'User'}</span> ⚡
              </h1>
              <p style={{ color: '#475569', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>Ready to take on some challenges?</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '999px' }}>
                <span>⭐</span>
                <span className="gradient-text" style={{ fontWeight: 800, fontSize: '0.95rem' }}>{stats.points.toLocaleString()} pts</span>
              </div>
              <div className="rank-badge-shimmer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.35)', borderRadius: '999px' }}>
                <span>🏆</span>
                <span className="gradient-text-gold" style={{ fontWeight: 800, fontSize: '0.95rem' }}>#{stats.rank}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '2rem' }}>
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
                {[
                  { label: 'Total Challenges', value: stats.totalChallenges, icon: '🏆', color: '#7C3AED', glow: 'rgba(124,58,237,0.3)' },
                  { label: 'Completed', value: stats.completedChallenges, icon: '⚡', color: '#10B981', glow: 'rgba(16,185,129,0.3)' },
                  { label: 'Points', value: stats.points.toLocaleString(), icon: '⭐', color: '#06B6D4', glow: 'rgba(6,182,212,0.3)', isPoints: true },
                  { label: 'Rank', value: `#${stats.rank}`, icon: '🎖️', color: '#FACC15', glow: 'rgba(250,204,21,0.3)' },
                ].map(({ label, value, icon, color, glow, isPoints }) => (
                  <div key={label} className="glass-card-hover" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.5rem', cursor: 'default' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.5rem' }}>{label}</p>
                        <p style={{ color: '#F1F5F9', fontSize: isPoints ? '1.75rem' : '2rem', fontWeight: 800, margin: 0, lineHeight: 1 }}>{value}</p>
                      </div>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', border: `1px solid ${color}33`, boxShadow: `0 0 16px ${glow}` }}>
                        {icon}
                      </div>
                    </div>
                    {isPoints && (
                      <div style={{ marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#475569', marginBottom: '0.4rem' }}>
                          <span>Level progress</span>
                          <span>{Math.round((stats.points % 1000) / 10)}%</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${(stats.points % 1000) / 10}%`, background: 'linear-gradient(90deg, #7C3AED, #06B6D4)', borderRadius: 999 }} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Recent Activity & Quick Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Recent Activity — Timeline */}
                <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.5rem' }}>
                  <h3 style={{ color: '#F1F5F9', fontWeight: 700, fontSize: '1.05rem', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', borderRadius: '50%', width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>📊</span>
                    Recent Activity
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {[
                      { icon: '✓', label: 'Completed Coffee Art Challenge', sub: '+180 points · 3 hours ago', dotColor: '#10B981', dotGlow: 'rgba(16,185,129,0.5)' },
                      { icon: '🏆', label: 'Earned Challenge Master badge', sub: 'Achievement unlocked · 1 day ago', dotColor: '#FACC15', dotGlow: 'rgba(250,204,21,0.5)' },
                      { icon: '👥', label: 'Connected with Sarah Johnson', sub: 'New friend · 2 days ago', dotColor: '#7C3AED', dotGlow: 'rgba(124,58,237,0.5)' },
                      { icon: '🎁', label: 'Claimed Coffee Discount reward', sub: '-500 points · 3 days ago', dotColor: '#FACC15', dotGlow: 'rgba(250,204,21,0.4)' },
                    ].map(({ icon, label, sub, dotColor, dotGlow }, i, arr) => (
                      <div key={i} className="timeline-item" style={{ marginBottom: i < arr.length - 1 ? '1.25rem' : 0 }}>
                        <div className="timeline-dot" style={{ background: `radial-gradient(circle, ${dotGlow} 0%, ${dotColor}44 100%)`, border: `1px solid ${dotColor}88`, boxShadow: `0 0 12px ${dotGlow}`, color: dotColor, fontSize: '0.65rem', fontWeight: 800 }}>{icon}</div>
                        <div style={{ paddingBottom: '0.25rem' }}>
                          <p style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '0.9rem', margin: '0 0 0.2rem' }}>{label}</p>
                          <p style={{ color: '#475569', fontSize: '0.78rem', margin: 0 }}>{sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.5rem' }}>
                  <h3 style={{ color: '#F1F5F9', fontWeight: 700, fontSize: '1.05rem', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', borderRadius: '50%', width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>🎯</span>
                    Quick Actions
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                    {[
                      { icon: '🎯', label: 'Browse Challenges', tab: 'challenges', accent: '#7C3AED' },
                      { icon: '👥', label: 'Find Friends', tab: 'friends', accent: '#06B6D4' },
                      { icon: '🏆', label: 'View Rankings', tab: 'leaderboard', accent: '#FACC15' },
                      { icon: '🎁', label: 'Claim Rewards', tab: 'rewards', accent: '#10B981' },
                    ].map(({ icon, label, tab, accent }) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="gradient-btn"
                        style={{ height: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', border: 'none', cursor: 'pointer' }}
                      >
                        <span style={{ position: 'relative', zIndex: 1, fontSize: '1.4rem', lineHeight: 1 }}>{icon}</span>
                        <span style={{ position: 'relative', zIndex: 1, fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Featured Challenges */}
              {userChallenges.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <h2 style={{ color: '#F1F5F9', fontWeight: 800, fontSize: '1.3rem', margin: 0 }}>🌟 Featured Challenges</h2>
                    <button onClick={() => setActiveTab('challenges')} style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)', color: '#A78BFA', borderRadius: '0.5rem', padding: '0.4rem 1rem', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: '0.85rem' }}>View All</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
                    {userChallenges.slice(0, 3).map((challenge) => {
                      const diffColor = challenge.difficulty === 'easy' ? '#10B981' : challenge.difficulty === 'medium' ? '#FACC15' : '#EF4444';
                      const diffGlow = challenge.difficulty === 'easy' ? 'rgba(16,185,129,0.4)' : challenge.difficulty === 'medium' ? 'rgba(250,204,21,0.4)' : 'rgba(239,68,68,0.4)';
                      return (
                        <div key={challenge.id} className="glass-card-hover" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.4rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '1.5rem' }}>{challenge.category === 'Social Media' ? '📱' : challenge.category === 'Photography' ? '📸' : challenge.category === 'creativity' ? '🎨' : challenge.category === 'Fitness' ? '💪' : '🏆'}</span>
                              <span style={{ padding: '2px 10px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, color: diffColor, background: diffColor + '22', border: '1px solid ' + diffColor + '55', boxShadow: '0 0 8px ' + diffGlow }}>{challenge.difficulty}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p className="gradient-text-gold" style={{ fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>{challenge.points}</p>
                              <p style={{ color: '#475569', fontSize: '0.7rem', margin: 0 }}>points</p>
                            </div>
                          </div>
                          <h3 style={{ color: '#F1F5F9', fontWeight: 700, fontSize: '1rem', margin: '0 0 0.4rem' }}>{challenge.title}</h3>
                          <p style={{ color: '#64748B', fontSize: '0.82rem', margin: '0 0 0.875rem', lineHeight: 1.5 }}>{challenge.description}</p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                            <span style={{ color: '#475569', fontSize: '0.78rem' }}>👥 {challenge.participants || 0}</span>
                            <span style={{ color: challenge.userStatus === 'completed' ? '#10B981' : '#94A3B8', fontSize: '0.78rem', fontWeight: 600 }}>{challenge.userStatus === 'completed' ? '✅ Completed' : challenge.userStatus === 'in_progress' ? '🔄 In Progress' : '⭐ Available'}</span>
                          </div>
                          {(challenge.userStatus === 'available' || challenge.userStatus === 'not_joined') ? (
                            <button onClick={() => handleJoinChallenge(challenge.id.toString())} className="gradient-btn" style={{ width: '100%', padding: '0.6rem', border: 'none', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: '0.88rem', borderRadius: '0.75rem' }}><span style={{ position: 'relative', zIndex: 1 }}>🚀 Start Challenge</span></button>
                          ) : challenge.userStatus === 'in_progress' ? (
                            <button onClick={() => navigate('/dashboard')} style={{ width: '100%', padding: '0.6rem', background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.4)', color: '#06B6D4', borderRadius: '0.75rem', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: '0.88rem' }}>▶ Continue</button>
                          ) : (
                            <button disabled style={{ width: '100%', padding: '0.6rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', borderRadius: '0.75rem', cursor: 'not-allowed', fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: '0.88rem' }}>✅ Completed ({challenge.userPointsEarned} pts)</button>
                          )}
                        </div>
                      );
                    })}
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
                    <h2 className="text-2xl font-bold" style={{ color: '#F1F5F9' }}>
                      🌐 Available Challenges
                    </h2>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm" style={{ color: '#64748B' }}>
                        {userChallenges.length} challenges available
                      </div>
                      <button onClick={refreshChallenges} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', color:'#94A3B8', borderRadius:'0.5rem', padding:'0.4rem 0.875rem', cursor:'pointer', fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:'0.85rem' }}>🔄 Refresh</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userChallenges.map((challenge) => (
                      <div key={challenge.id} className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow" 
                           style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">
                              {challenge.category === 'Social Media' ? '📱' :
                               challenge.category === 'Photography' ? '📸' :
                               challenge.category === 'creativity' ? '🎨' :
                               challenge.category === 'Fitness' ? '💪' : '🏆'}
                            </span>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 10px', borderRadius: 999, color: challenge.difficulty === 'easy' ? '#10B981' : challenge.difficulty === 'medium' ? '#FACC15' : '#EF4444', background: challenge.difficulty === 'easy' ? '#10B98122' : challenge.difficulty === 'medium' ? '#FACC1522' : '#EF444422', border: '1px solid', borderColor: challenge.difficulty === 'easy' ? '#10B98155' : challenge.difficulty === 'medium' ? '#FACC1555' : '#EF444455', boxShadow: challenge.difficulty === 'easy' ? '0 0 8px rgba(16,185,129,0.4)' : challenge.difficulty === 'medium' ? '0 0 8px rgba(250,204,21,0.4)' : '0 0 8px rgba(239,68,68,0.4)' }}>{challenge.difficulty}</span>
                          </div>
                          <div className="text-right">
                            <p className="gradient-text-gold" style={{ fontWeight: 800, fontSize: "1.1rem", margin: 0 }}>{challenge.points}</p>
                            <p className="text-xs" style={{ color: '#64748B' }}>points</p>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2" style={{ color: '#F1F5F9' }}>
                          {challenge.title}
                        </h3>
                        <p className="text-sm mb-4 line-clamp-2" style={{ color: '#64748B' }}>
                          {challenge.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm mb-4">
                          <div className="flex items-center space-x-1" style={{ color: '#64748B' }}>
                            👥
                            <span>{challenge.participants || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1" style={{ color: '#64748B' }}>
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
                          <button onClick={() => handleJoinChallenge(challenge.id.toString())} className="gradient-btn" style={{ width: '100%', padding: '0.6rem', border: 'none', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: '0.88rem', borderRadius: '0.75rem' }}><span style={{ position: 'relative', zIndex: 1 }}>🚀 Join Challenge</span></button>
                        ) : challenge.userStatus === 'in_progress' ? (
                          <button onClick={() => navigate('/dashboard')} style={{ width: '100%', padding: '0.6rem', background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.35)', color: '#06B6D4', borderRadius: '0.75rem', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: '0.88rem' }}>▶ Continue</button>
                        ) : (
                          <button disabled style={{ width: '100%', padding: '0.6rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', borderRadius: '0.75rem', cursor: 'not-allowed', fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: '0.88rem' }}>✅ Completed ({challenge.userPointsEarned} pts)</button>
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
              <div className="rounded-xl p-6 shadow-lg mb-8" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: '#F1F5F9' }}>
                      User Profile
                    </h2>
                    <p className="text-sm" style={{ color: '#64748B' }}>
                      Manage your account settings and preferences
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    👨‍👩‍👧‍👦
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#F1F5F9' }}>
                      Name
                    </label>
                    <div className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <span style={{ color: '#F1F5F9' }}>{user?.name || 'Demo User'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#F1F5F9' }}>
                      Email
                    </label>
                    <div className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <span style={{ color: '#F1F5F9' }}>{user?.email || 'demo@user.com'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="gradient-text" style={{ fontSize: "1.5rem", fontWeight: 800 }}>{stats.totalChallenges}</div>
                    <div className="text-sm" style={{ color: '#64748B' }}>Total Challenges</div>
                  </div>
                  <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#10B981" }}>{stats.completedChallenges}</div>
                    <div className="text-sm" style={{ color: '#64748B' }}>Completed</div>
                  </div>
                  <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#A78BFA" }}>{stats.points}</div>
                    <div className="text-sm" style={{ color: '#64748B' }}>Points</div>
                  </div>
                  <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FACC15" }}>#{stats.rank}</div>
                    <div className="text-sm" style={{ color: '#64748B' }}>Rank</div>
                  </div>
                </div>

                <div style={{ display:'flex', gap:'0.75rem' }}>
                  <button onClick={() => alert('Profile editing coming soon!')} className="gradient-btn" style={{ padding:'0.5rem 1.25rem' }}><span style={{ position:'relative', zIndex:1 }}>👤 Edit Profile</span></button>
                  <button onClick={() => alert('Settings coming soon!')} style={{ padding:'0.5rem 1.25rem', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', color:'#94A3B8', borderRadius:'0.75rem', cursor:'pointer', fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:'0.9rem' }}>⚙️ Settings</button>
                </div>
              </div>

              {/* Achievements Section */}
              <div className="rounded-xl p-6 shadow-lg" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: '#F1F5F9' }}>
                  🏆 Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(user?.achievements || ['Early Adopter', 'Video Creator', 'Community Helper', 'Challenge Master']).map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                        🏆
                      </div>
                      <div>
                        <div className="font-medium" style={{ color: '#F1F5F9' }}>{achievement}</div>
                        <div className="text-sm" style={{ color: '#64748B' }}>Unlocked</div>
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
                <h2 className="text-2xl font-bold" style={{ color: '#F1F5F9' }}>
                  🔔 Notifications
                </h2>
                <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))} style={{ background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.35)', color:'#A78BFA', borderRadius:'0.5rem', padding:'0.4rem 0.875rem', cursor:'pointer', fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:'0.85rem' }}>✓ Mark All Read</button>
              </div>

              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-xl p-4 shadow-lg cursor-pointer transition-all ${
                      !notification.read ? 'border-l-4 border-l-violet-500' : ''
                    }`}
                    style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">{notification.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold" style={{ color: '#F1F5F9' }}>
                            {notification.title}
                          </h3>
                          <span className="text-xs" style={{ color: '#64748B' }}>
                            {notification.timestamp}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: '#64748B' }}>
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
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#06B6D4)", boxShadow: "0 0 6px rgba(124,58,237,0.7)" }}></div>
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
                <h2 className="text-2xl font-bold" style={{ color: '#F1F5F9' }}>
                  👥 Friends ({friends.length})
                </h2>
                <button onClick={() => findFriends()} className="gradient-btn" style={{ padding:'0.5rem 1.25rem' }}><span style={{ position:'relative', zIndex:1 }}>👥 Find Friends</span></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                    style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}
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
                        <h3 className="font-semibold" style={{ color: '#F1F5F9' }}>
                          {friend.name}
                        </h3>
                        <p className="text-sm" style={{ color: '#64748B' }}>
                          Level {friend.level} • {friend.points} pts
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#64748B' }}>Status:</span>
                        <span className={`font-medium ${friend.status === 'online' ? 'text-green-600' : 'text-gray-600'}`}>
                          {friend.status === 'online' ? '🟢 Online' : '⚫ Offline'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#64748B' }}>Mutual Friends:</span>
                        <span style={{ color: '#F1F5F9' }}>{friend.mutualFriends}</span>
                      </div>
                    </div>

                    <div style={{ display:'flex', gap:'0.5rem' }}>
                      <button onClick={() => startChat(friend.name)} className="gradient-btn" style={{ flex:1, padding:'0.5rem', fontSize:'0.85rem', border:'none', cursor:'pointer', borderRadius:'0.75rem' }}><span style={{ position:'relative', zIndex:1 }}>💬 Chat</span></button>
                      <button onClick={() => alert(`Viewing ${friend.name}'s profile...`)} style={{ padding:'0.5rem 0.75rem', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', color:'#94A3B8', borderRadius:'0.75rem', cursor:'pointer', fontSize:'1rem' }}>👤</button>
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
                <h2 className="text-2xl font-bold" style={{ color: '#F1F5F9' }}>
                  📊 Interactive Leaderboard
                </h2>
                <div className="flex space-x-2">
                  <button style={{ padding:'0.35rem 0.875rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#64748B', borderRadius:'0.5rem', cursor:'pointer', fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:'0.82rem' }}>Weekly</button>
                  <button style={{ padding:'0.35rem 0.875rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#64748B', borderRadius:'0.5rem', cursor:'pointer', fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:'0.82rem' }}>Monthly</button>
                  <button className="gradient-btn" style={{ padding:'0.35rem 0.875rem' }}><span style={{ position:'relative', zIndex:1 }}>All Time</span></button>
                </div>
              </div>

              {/* Current User Position - Enhanced */}
              <div className="rounded-xl p-6 mb-6 border-2 border-emerald-500 bg-gradient-to-r from-emerald-500/10 to-teal-500/10" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}>
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
                      <h3 className="text-xl font-bold" style={{ color: '#F1F5F9' }}>
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
                    <div className="text-sm" style={{ color: '#64748B' }}>
                      {stats.points.toLocaleString()} points
                    </div>
                    <div className="text-xs text-emerald-500 font-medium">
                      +{Math.floor(Math.random() * 200) + 50} this week
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar for Current User */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2" style={{ color: '#64748B' }}>
                    <span>Progress to next rank</span>
                    <span>75%</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 999, overflow: "hidden", height: 12, width: "100%" }}>
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
                        entry.rank === 1 ? 'border-yellow-400 ' :
                        entry.rank === 2 ? 'border-gray-400 ' :
                        entry.rank === 3 ? 'border-orange-400 ' :
                        ''
                      }`}
                      style={{ background: entry.rank > 3 ? 'rgba(255,255,255,0.04)' : undefined, border: entry.rank > 3 ? '1px solid rgba(255,255,255,0.08)' : undefined, backdropFilter: 'blur(20px)' }}
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
                              <h3 className="text-xl font-bold" style={{ color: '#F1F5F9' }}>
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
                          <div className="text-sm" style={{ color: '#64748B' }}>
                            points
                          </div>
                          <div className="text-xs text-emerald-500 font-medium">
                            +{entry.weeklyPoints} this week
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Bar Visualization */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2" style={{ color: '#64748B' }}>
                          <span>Progress to #1</span>
                          <span>{progressPercentage.toFixed(1)}%</span>
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 999, overflow: "hidden", height: 12, width: "100%" }}>
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
                <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="text-2xl font-bold text-yellow-500">{leaderboard[0]?.points.toLocaleString() || '0'}</div>
                  <div className="text-sm" style={{ color: '#64748B' }}>
                    Highest Score
                  </div>
                </div>
                
                <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="text-2xl mb-2">📈</div>
                  <div className="text-2xl font-bold text-emerald-500">{Math.round(leaderboard.reduce((acc, entry) => acc + (entry.level * 0.8), 0) / leaderboard.length) || 0}</div>
                  <div className="text-sm" style={{ color: '#64748B' }}>
                    Avg. Completed
                  </div>
                </div>
                
                <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="text-2xl mb-2">⚡</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#A78BFA" }}>{Math.round(leaderboard.reduce((acc, entry) => acc + entry.level, 0) / leaderboard.length) || 0}</div>
                  <div className="text-sm" style={{ color: '#64748B' }}>
                    Avg. Level
                  </div>
                </div>

                <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="text-2xl mb-2">👥</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FACC15" }}>{leaderboard.length}</div>
                  <div className="text-sm" style={{ color: '#64748B' }}>
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
                <h2 className="text-2xl font-bold" style={{ color: '#F1F5F9' }}>
                  🎁 Rewards Store
                </h2>
                <div className="flex items-center space-x-2 px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}>
                  ⭐️
                  <span className="font-bold" style={{ color: '#F1F5F9' }}>
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
                    style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}
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

                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#F1F5F9' }}>
                      {reward.title}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: '#64748B' }}>
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
                        <button disabled style={{ padding:'0.5rem 1.25rem', background:'rgba(100,116,139,0.15)', border:'1px solid rgba(100,116,139,0.25)', color:'#475569', borderRadius:'0.75rem', cursor:'not-allowed', fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:'0.85rem' }}>🎁 Claimed</button>
                      ) : reward.available ? (
                        <button onClick={() => claimReward(reward.id)} disabled={stats.points < reward.points} className={stats.points >= reward.points ? 'gradient-btn' : ''} style={stats.points < reward.points ? { padding:'0.5rem 1.25rem', background:'rgba(100,116,139,0.1)', border:'1px solid rgba(100,116,139,0.2)', color:'#475569', borderRadius:'0.75rem', cursor:'not-allowed', fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:'0.85rem' } : { padding:'0.5rem 1.25rem', border:'none', cursor:'pointer', borderRadius:'0.75rem' }}><span style={{ position:'relative', zIndex:1 }}>🎁 {stats.points >= reward.points ? 'Claim' : 'Not Enough Points'}</span></button>
                      ) : (
                        <button disabled style={{ padding:'0.5rem 1.25rem', background:'rgba(100,116,139,0.1)', border:'1px solid rgba(100,116,139,0.2)', color:'#475569', borderRadius:'0.75rem', cursor:'not-allowed', fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:'0.85rem' }}>🏆 Locked</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Toast Notifications ──────────────────────────────────────────── */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem', pointerEvents: 'none' }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{
            pointerEvents: 'auto',
            padding: '0.85rem 1.25rem',
            borderRadius: '0.875rem',
            backdropFilter: 'blur(20px)',
            background: toast.type === 'success' ? 'rgba(16,185,129,0.2)' : toast.type === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(124,58,237,0.2)',
            border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : toast.type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(124,58,237,0.4)'}`,
            color: toast.type === 'success' ? '#10B981' : toast.type === 'error' ? '#F87171' : '#A78BFA',
            fontWeight: 700,
            fontSize: '0.9rem',
            fontFamily: "'Outfit', sans-serif",
            boxShadow: `0 8px 32px ${toast.type === 'success' ? 'rgba(16,185,129,0.25)' : toast.type === 'error' ? 'rgba(239,68,68,0.25)' : 'rgba(124,58,237,0.25)'}`,
            animation: 'fadeSlideUp 0.3s ease',
            maxWidth: 320,
            minWidth: 220,
          }}>
            {toast.msg}
          </div>
        ))}
      </div>

      {/* ── Chat Modal ────────────────────────────────────────────────────── */}
      {chatModal.open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setChatModal({ open: false, friendName: '', msg: '' })}>
          <div style={{ background: 'rgba(15,20,30,0.95)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: '1.25rem', padding: '2rem', width: 380, boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#F1F5F9', fontWeight: 800, fontSize: '1.2rem', margin: '0 0 0.5rem' }}>💬 Chat with {chatModal.friendName}</h3>
            <p style={{ color: '#475569', fontSize: '0.85rem', margin: '0 0 1.25rem' }}>Send a quick message</p>
            <textarea
              autoFocus
              value={chatModal.msg}
              onChange={e => setChatModal(prev => ({ ...prev, msg: e.target.value }))}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
              placeholder={`Message ${chatModal.friendName}...`}
              style={{ width: '100%', minHeight: 100, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.75rem', padding: '0.75rem', color: '#F1F5F9', resize: 'none', fontFamily: "'Outfit', sans-serif", fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', marginBottom: '1rem' }}
            />
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setChatModal({ open: false, friendName: '', msg: '' })} style={{ flex: 1, padding: '0.65rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#94A3B8', borderRadius: '0.75rem', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>Cancel</button>
              <button onClick={sendChatMessage} className="gradient-btn" style={{ flex: 1, padding: '0.65rem', border: 'none', cursor: 'pointer', borderRadius: '0.75rem' }}><span style={{ position: 'relative', zIndex: 1, fontWeight: 700 }}>Send ✉️</span></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
