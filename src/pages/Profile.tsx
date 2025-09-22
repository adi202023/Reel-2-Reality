import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Trophy, 
  Star, 
  
  Play, 
  Camera,
  Mail,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { userAPI, User as UserType } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface UserStats {
  totalChallenges?: number;
  completedChallenges?: number;
  points?: number;
  rank?: number;
  level?: number;
  achievements?: string[];
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [user, setUser] = useState<UserType | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    bio: ''
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      console.log('🔍 Profile: Starting to load user profile...');

      const userData = localStorage.getItem('user');
      const authToken = localStorage.getItem('authToken');

      console.log('🔍 Profile: userData exists:', !!userData);
      console.log('🔍 Profile: authToken exists:', !!authToken);

      if (!userData || !authToken) {
        console.log('🔍 Profile: No user data or auth token found, redirecting to dashboard');
        navigate('/dashboard');
        return;
      }

      const user = JSON.parse(userData);
      console.log('🔍 Profile: Parsed user data:', user);
      setUser(user);

      // Set edit form with user data
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || ''
      });

      console.log('🔍 Profile: Set user state, now loading stats...');

      // Load user stats - handle API errors gracefully
      try {
        console.log('🔍 Profile: Calling userAPI.getUserStats for user ID:', user.id);
        const statsResponse = await userAPI.getUserStats(user.id);
        console.log('🔍 Profile: API response:', statsResponse);

        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
          console.log('🔍 Profile: Set stats from API:', statsResponse.data);
        } else {
          console.log('🔍 Profile: API failed, using fallback stats');
          // Set default stats if API fails
          setStats({
            totalChallenges: 12,
            completedChallenges: user.completedChallenges || 8,
            points: user.points || 2450,
            rank: user.rank || 15,
            level: user.level || 5,
            achievements: user.achievements || []
          });
        }
      } catch (apiError) {
        console.error('🔍 Profile: API error:', apiError);
        // Set default stats if API fails
        setStats({
          totalChallenges: 12,
          completedChallenges: user.completedChallenges || 8,
          points: user.points || 2450,
          rank: user.rank || 15,
          level: user.level || 5,
          achievements: user.achievements || []
        });
      }
    } catch (error) {
      console.error('🔍 Profile: Error loading profile:', error);
      navigate('/dashboard');
    } finally {
      console.log('🔍 Profile: Finished loading, setting isLoading to false');
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await userAPI.updateProfile(user.id, {
        name: editForm.name,
        email: editForm.email,
        // bio: editForm.bio
      });

      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const achievementIcons: { [key: string]: any } = {
    "First Challenge": Trophy,
    "Speed Demon": Star,
    "Team Player": User,
    "Rising Star": Star,
    "Master Creator": Trophy,
    "Challenge Champion": Star,
    "Creative Genius": Camera,
    "Collaboration Expert": User
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      } flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={`${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user || !stats) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      } flex items-center justify-center`}>
        <div className="text-center">
          <p className={`${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>Profile not found</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Header */}
      <header className={`backdrop-blur-sm border-b ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white/70 border-gray-200/50 shadow-lg'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className={`${
                isDark
                  ? 'text-gray-400 hover:text-white hover:bg-white/10'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              ⬅️
              Back to Dashboard
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setIsEditing(!isEditing)}
              className={`${
                isDark
                  ? 'text-gray-300 hover:text-white hover:bg-white/10'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Play className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={`${
                isDark
                  ? 'text-gray-300 hover:text-white hover:bg-white/10'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className={`max-w-6xl mx-auto px-6 py-8 ${
        isDark ? 'bg-white/5' : 'bg-white/70'
      }`}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className={`backdrop-blur-sm border rounded-2xl p-8 text-center ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white/70 border-gray-200/50 shadow-lg'
            }`}>
              {/* Avatar */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                <button className="absolute bottom-2 right-1/2 transform translate-x-1/2 translate-y-1/2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-300 transition-colors">
                  <Camera className="w-5 h-5 text-black" />
                </button>
              </div>

              {/* User Info */}
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                      isDark 
                        ? 'bg-white/5 border-white/20 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Full Name"
                  />
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                      isDark 
                        ? 'bg-white/5 border-white/20 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Email"
                  />
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none ${
                      isDark 
                        ? 'bg-white/5 border-white/20 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                  <Button onClick={handleSaveProfile} className="w-full bg-yellow-400 hover:bg-yellow-300 text-black">
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div>
                  <h2 className={`text-2xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {user.name || 'Adi'}
                  </h2>
                  <p className={`${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  } mb-4`}>
                    {user.email || 'adieo2024@gmail.com'}
                  </p>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  } mb-6`}>
                    {user.bio || 'Creative enthusiast passionate about challenges and innovation. Always ready to push boundaries and create amazing content!'}
                  </p>

                  {/* Level & Rank */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`p-3 rounded-lg ${
                      isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'
                    }`}>
                      <div className="text-2xl font-bold text-yellow-600">Level {stats.level || 1}</div>
                      <div className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>Current Level</div>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      isDark ? 'bg-purple-500/20' : 'bg-purple-100'
                    }`}>
                      <div className="text-2xl font-bold text-purple-600">#{stats.rank || 4}</div>
                      <div className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>Global Rank</div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <Button 
                      onClick={() => navigate('/challenges')}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      🎯 Join New Challenge
                    </Button>
                    <Button 
                      onClick={() => navigate('/friends')}
                      variant="outline"
                      className={`w-full ${
                        isDark 
                          ? 'border-white/20 text-white hover:bg-white/10' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      👥 Find Friends
                    </Button>
                  </div>
                </div>
              )}

              {/* Join Date */}
              <div className={`mt-6 pt-6 border-t ${
                isDark ? 'border-white/10' : 'border-gray-200'
              }`}>
                <p className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  📅 Joined September 2024
                </p>
              </div>
            </div>

            {/* Skills & Interests */}
            <div className={`backdrop-blur-sm border rounded-2xl p-6 mt-6 ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white/70 border-gray-200/50 shadow-lg'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                🎨 Skills & Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Video Editing', 'Photography', 'Creative Writing', 'Design', 'Social Media', 'Content Creation'].map((skill) => (
                  <span key={skill} className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isDark 
                      ? 'bg-blue-500/20 text-blue-300' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {skill}
                  </span>
                ))}
              </div>
              <Button 
                variant="ghost" 
                className={`w-full mt-3 text-sm ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                + Add Skills
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`backdrop-blur-sm border rounded-xl p-4 text-center ${
                isDark 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white/70 border-gray-200/50 shadow-lg'
              }`}>
                <div className="text-2xl font-bold text-yellow-500">{stats.points || 0}</div>
                <div className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Total Points</div>
              </div>
              <div className={`backdrop-blur-sm border rounded-xl p-4 text-center ${
                isDark 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white/70 border-gray-200/50 shadow-lg'
              }`}>
                <div className="text-2xl font-bold text-green-500">{stats.completedChallenges || 0}</div>
                <div className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Completed</div>
              </div>
              <div className={`backdrop-blur-sm border rounded-xl p-4 text-center ${
                isDark 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white/70 border-gray-200/50 shadow-lg'
              }`}>
                <div className="text-2xl font-bold text-blue-500">6</div>
                <div className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Available</div>
              </div>
              <div className={`backdrop-blur-sm border rounded-xl p-4 text-center ${
                isDark 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white/70 border-gray-200/50 shadow-lg'
              }`}>
                <div className="text-2xl font-bold text-purple-500">{stats.achievements?.length || 0}</div>
                <div className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Achievements</div>
              </div>
            </div>

            {/* Progress Overview */}
            <div className={`backdrop-blur-sm border rounded-2xl p-6 ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white/70 border-gray-200/50 shadow-lg'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                📊 Progress Overview
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>Challenge Completion Rate</span>
                    <span className={`text-sm font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>75%</span>
                  </div>
                  <div className={`w-full bg-gray-200 rounded-full h-2 ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>Level 1 Progress</span>
                    <span className={`text-sm font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>450 / 500 XP</span>
                  </div>
                  <div className={`w-full bg-gray-200 rounded-full h-2 ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full" style={{width: '90%'}}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>Weekly Goal</span>
                    <span className={`text-sm font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>3 / 5 Challenges</span>
                  </div>
                  <div className={`w-full bg-gray-200 rounded-full h-2 ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`backdrop-blur-sm border rounded-2xl p-6 ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white/70 border-gray-200/50 shadow-lg'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                🕐 Recent Activity
              </h3>
              
              <div className="space-y-4">
                {[
                  { icon: '🏆', action: 'Completed "Creative Latte Art Challenge"', time: '2 hours ago', points: '+150 XP' },
                  { icon: '📸', action: 'Uploaded submission for "Photo Contest"', time: '1 day ago', points: '+50 XP' },
                  { icon: '⭐', action: 'Earned "Rising Star" achievement', time: '2 days ago', points: '+100 XP' },
                  { icon: '👥', action: 'Connected with 3 new creators', time: '3 days ago', points: '+25 XP' },
                  { icon: '🎯', action: 'Started "Video Challenge Series"', time: '1 week ago', points: '+10 XP' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className={`text-sm ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {activity.action}
                      </p>
                      <p className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {activity.time}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-green-500">
                      {activity.points}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className={`backdrop-blur-sm border rounded-2xl p-6 ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white/70 border-gray-200/50 shadow-lg'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  🏅 Achievements
                </h3>
                <Button 
                  variant="ghost" 
                  className={`text-sm ${
                    isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  View All
                </Button>
              </div>
              
              {stats.achievements && stats.achievements.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {stats.achievements.slice(0, 6).map((achievement, index) => (
                    <div key={index} className={`p-4 rounded-lg text-center border ${
                      isDark 
                        ? 'bg-white/5 border-white/10' 
                        : 'bg-white border-gray-200'
                    }`}>
                      <div className="text-2xl mb-2">🏆</div>
                      <div className={`text-sm font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {achievement}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🏆</div>
                  <p className={`${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    No achievements yet. Complete challenges to earn your first badge!
                  </p>
                  <Button 
                    onClick={() => navigate('/challenges')}
                    className="mt-4 bg-yellow-400 hover:bg-yellow-300 text-black"
                  >
                    Start Your Journey
                  </Button>
                </div>
              )}
            </div>

            {/* Goals & Streaks */}
            <div className={`backdrop-blur-sm border rounded-2xl p-6 ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white/70 border-gray-200/50 shadow-lg'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                🎯 Goals & Streaks
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`text-sm font-medium mb-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Current Goals
                  </h4>
                  <div className="space-y-3">
                    <div className={`p-3 rounded-lg ${
                      isDark ? 'bg-white/5' : 'bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>Complete 5 challenges this week</span>
                        <span className="text-xs text-green-500">3/5</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      isDark ? 'bg-white/5' : 'bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>Reach Level 2</span>
                        <span className="text-xs text-yellow-500">90%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className={`text-sm font-medium mb-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Streaks
                  </h4>
                  <div className="space-y-3">
                    <div className={`p-3 rounded-lg ${
                      isDark ? 'bg-white/5' : 'bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>🔥 Daily Login Streak</span>
                        <span className="text-sm font-bold text-orange-500">7 days</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      isDark ? 'bg-white/5' : 'bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>⚡ Challenge Streak</span>
                        <span className="text-sm font-bold text-blue-500">3 days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
