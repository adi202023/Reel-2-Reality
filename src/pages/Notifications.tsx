import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  User, 
  
  Trophy, 
  Play, 
  Film, 
  ArrowLeft,
  Users,
  Zap
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useTheme } from '../context/ThemeContext';

interface Notification {
  id: string;
  type: 'friend_request' | 'challenge_received' | 'challenge_completed' | 'achievement' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable?: boolean;
  data?: any;
}

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'friend_requests' | 'challenges'>('all');

  useEffect(() => {
    // Load mock notifications
    setNotifications([
      {
        id: '1',
        type: 'friend_request',
        title: 'New Friend Request',
        message: 'Emma Wilson wants to be your friend',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        actionable: true,
        data: { userId: 'emma_artist', userName: 'Emma Wilson' }
      },
      {
        id: '2',
        type: 'challenge_received',
        title: 'Challenge Received',
        message: 'Alex Johnson challenged you to "Creative Video Challenge"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        actionable: true,
        data: { challengeId: '1', challengeName: 'Creative Video Challenge', fromUser: 'Alex Johnson' }
      },
      {
        id: '3',
        type: 'challenge_completed',
        title: 'Challenge Completed',
        message: 'Sarah Chen completed your "Speed Challenge" and earned 150 points!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        read: true,
        actionable: false
      },
      {
        id: '4',
        type: 'achievement',
        title: 'Achievement Unlocked',
        message: 'You earned the "Challenge Master" badge for completing 10 challenges!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
        actionable: false
      },
      {
        id: '5',
        type: 'system',
        title: 'Welcome to Reel to Reality',
        message: 'Start your creative journey by exploring challenges and connecting with friends!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        read: true,
        actionable: false
      }
    ]);
  }, []);

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'friend_requests':
        return notifications.filter(n => n.type === 'friend_request');
      case 'challenges':
        return notifications.filter(n => n.type === 'challenge_received' || n.type === 'challenge_completed');
      default:
        return notifications;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleAcceptFriendRequest = (notificationId: string, userData: any) => {
    markAsRead(notificationId);
    // Here you would typically call an API to accept the friend request
    console.log('Accepting friend request from:', userData.userName);
  };

  const handleRejectFriendRequest = (notificationId: string) => {
    deleteNotification(notificationId);
  };

  const handleAcceptChallenge = (notificationId: string, challengeData: any) => {
    markAsRead(notificationId);
    // Here you would typically call an API to accept the challenge
    console.log('Accepting challenge:', challengeData.challengeName);
  };

  const handleRejectChallenge = (notificationId: string) => {
    deleteNotification(notificationId);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friend_request':
        return <User className="w-5 h-5" />;
      case 'challenge_received':
      case 'challenge_completed':
        return '🎯';
      case 'achievement':
        return <Trophy className="w-5 h-5" />;
      default:
        return '⭐';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'friend_request':
        return isDark ? 'from-blue-500 to-purple-600' : 'from-green-500 to-blue-500';
      case 'challenge_received':
        return isDark ? 'from-yellow-500 to-orange-500' : 'from-orange-500 to-red-500';
      case 'challenge_completed':
        return isDark ? 'from-green-500 to-emerald-500' : 'from-green-500 to-emerald-500';
      case 'achievement':
        return isDark ? 'from-purple-500 to-pink-500' : 'from-purple-500 to-pink-500';
      default:
        return isDark ? 'from-gray-500 to-gray-600' : 'from-gray-400 to-gray-500';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Header */}
      <header className={`px-4 py-4 ${
        isDark ? 'bg-black/20' : 'bg-white/20'
      } backdrop-blur-sm border-b ${
        isDark ? 'border-white/10' : 'border-gray-200/30'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className={`${isDark ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              ⬅️
              Back to Dashboard
            </Button>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Notifications
              </h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={markAllAsRead}
                className={`${
                  isDark 
                    ? 'border-white/20 text-white hover:bg-white/10' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                ⭐
                Mark All Read
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={toggleTheme}
              className={`${isDark ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              {isDark ? '⭐' : '⭐'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Filter Tabs */}
        <div className={`flex space-x-1 p-1 rounded-xl mb-8 ${
          isDark ? 'bg-slate-800/50' : 'bg-gray-100'
        }`}>
          {[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'friend_requests', label: 'Friend Requests', count: notifications.filter(n => n.type === 'friend_request').length },
            { id: 'challenges', label: 'Challenges', count: notifications.filter(n => n.type === 'challenge_received' || n.type === 'challenge_completed').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                filter === tab.id
                  ? isDark
                    ? 'bg-slate-700 text-white shadow-lg'
                    : 'bg-white text-gray-900 shadow-lg'
                  : isDark
                    ? 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  filter === tab.id
                    ? isDark
                      ? 'bg-yellow-500 text-black'
                      : 'bg-blue-500 text-white'
                    : isDark
                      ? 'bg-slate-600 text-gray-300'
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {getFilteredNotifications().map((notification) => (
            <div
              key={notification.id}
              className={`p-6 rounded-xl border transition-all duration-200 ${
                notification.read
                  ? isDark 
                    ? 'bg-slate-800/30 border-slate-700/30' 
                    : 'bg-gray-50 border-gray-200'
                  : isDark 
                    ? 'bg-slate-800/50 border-slate-700/50 shadow-lg' 
                    : 'bg-white border-gray-200 shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getNotificationColor(notification.type)} flex items-center justify-center text-white`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className={`w-2 h-2 rounded-full ${
                          isDark ? 'bg-yellow-400' : 'bg-blue-500'
                        }`} />
                      )}
                    </div>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Zap className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {notification.actionable && notification.type === 'friend_request' && (
                    <>
                      <Button
                        onClick={() => handleAcceptFriendRequest(notification.id, notification.data)}
                        className="bg-green-600 hover:bg-green-500 text-white"
                        size="sm"
                      >
                        ⭐
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleRejectFriendRequest(notification.id)}
                        variant="outline"
                        className={`${
                          isDark 
                            ? 'border-red-500/50 text-red-400 hover:bg-red-500/10' 
                            : 'border-red-300 text-red-600 hover:bg-red-50'
                        }`}
                        size="sm"
                      >
                        <Users className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}

                  {notification.actionable && notification.type === 'challenge_received' && (
                    <>
                      <Button
                        onClick={() => handleAcceptChallenge(notification.id, notification.data)}
                        className={`${
                          isDark
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                        }`}
                        size="sm"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleRejectChallenge(notification.id)}
                        variant="outline"
                        className={`${
                          isDark 
                            ? 'border-red-500/50 text-red-400 hover:bg-red-500/10' 
                            : 'border-red-300 text-red-600 hover:bg-red-50'
                        }`}
                        size="sm"
                      >
                        🎬
                        Decline
                      </Button>
                    </>
                  )}

                  {!notification.read && !notification.actionable && (
                    <Button
                      onClick={() => markAsRead(notification.id)}
                      variant="ghost"
                      size="sm"
                      className={`${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                      ⭐
                    </Button>
                  )}

                  <Button
                    onClick={() => deleteNotification(notification.id)}
                    variant="ghost"
                    size="sm"
                    className={`${isDark ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-600 hover:text-red-600 hover:bg-red-50'}`}
                  >
                    <Users className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {getFilteredNotifications().length === 0 && (
            <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              ⭐
              <p>No notifications found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;
