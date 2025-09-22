import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Award, 
  Star, 
  
  User, 
  ArrowLeft,
  Play,
  Zap
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { leaderboardAPI, LeaderboardEntry } from '../services/api';

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentUserRank, setCurrentUserRank] = useState<{ rank: number; totalUsers: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current user
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setCurrentUser(user);
        }

        // Load leaderboard
        const response = await leaderboardAPI.getLeaderboard(50);
        if (response.success && response.data) {
          setLeaderboard(response.data);
        }

        // Get current user's rank
        if (userData) {
          const user = JSON.parse(userData);
          const rankResponse = await leaderboardAPI.getUserRank(user.id);
          if (rankResponse.success && rankResponse.data) {
            setCurrentUserRank(rankResponse.data);
          }
        }
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Award className="w-6 h-6 text-yellow-400" />;
      case 2: return <Award className="w-6 h-6 text-gray-300" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <div className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">#{rank}</div>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500 text-black';
      case 3: return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
      default: return 'bg-white/10 text-gray-300';
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'text-purple-400';
    if (level >= 7) return 'text-blue-400';
    if (level >= 5) return 'text-green-400';
    if (level >= 3) return 'text-yellow-400';
    return 'text-gray-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="backdrop-blur-sm bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              ⬅️
              Back to Dashboard
            </Button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white flex items-center justify-center">
                <Trophy className="w-8 h-8 mr-3 text-yellow-400" />
                Leaderboard
              </h1>
              <p className="text-gray-400">Top creators in the community</p>
            </div>
            
            <div className="w-32" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Current User Rank Card */}
        {currentUserRank && (
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Your Current Rank</h3>
                  <p className="text-gray-300">Keep climbing to reach the top!</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-yellow-400">#{currentUserRank.rank}</div>
                <div className="text-gray-400">out of {currentUserRank.totalUsers.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white text-center mb-8">🏆 Top Champions 🏆</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* 2nd Place */}
              <div className="order-1 md:order-1">
                <div className="bg-gradient-to-br from-gray-300/20 to-gray-500/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center">
                      {leaderboard[1].avatar ? (
                        <img src={leaderboard[1].avatar} alt={leaderboard[1].name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-white" />
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-sm">2</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{leaderboard[1].name}</h3>
                  <div className="text-2xl font-bold text-gray-300 mb-1">{leaderboard[1].points.toLocaleString()}</div>
                  <div className="text-sm text-gray-400 mb-3">points</div>
                  <div className="flex justify-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className={`font-bold ${getLevelColor(leaderboard[1].level)}`}>Lv.{leaderboard[1].level}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400 font-bold">{leaderboard[1].completedChallenges}</div>
                      <div className="text-gray-500 text-xs">completed</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1st Place */}
              <div className="order-2 md:order-2">
                <div className="bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Award className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div className="relative mb-4 mt-4">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                      {leaderboard[0].avatar ? (
                        <img src={leaderboard[0].avatar} alt={leaderboard[0].name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-black" />
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold">1</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{leaderboard[0].name}</h3>
                  <div className="text-3xl font-bold text-yellow-400 mb-1">{leaderboard[0].points.toLocaleString()}</div>
                  <div className="text-sm text-gray-400 mb-3">points</div>
                  <div className="flex justify-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className={`font-bold ${getLevelColor(leaderboard[0].level)}`}>Lv.{leaderboard[0].level}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400 font-bold">{leaderboard[0].completedChallenges}</div>
                      <div className="text-gray-500 text-xs">completed</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="order-3 md:order-3">
                <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center">
                      {leaderboard[2].avatar ? (
                        <img src={leaderboard[2].avatar} alt={leaderboard[2].name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-white" />
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-600 to-amber-800 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{leaderboard[2].name}</h3>
                  <div className="text-2xl font-bold text-amber-600 mb-1">{leaderboard[2].points.toLocaleString()}</div>
                  <div className="text-sm text-gray-400 mb-3">points</div>
                  <div className="flex justify-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className={`font-bold ${getLevelColor(leaderboard[2].level)}`}>Lv.{leaderboard[2].level}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400 font-bold">{leaderboard[2].completedChallenges}</div>
                      <div className="text-gray-500 text-xs">completed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard with Graph-like Visualization */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white flex items-center">
              📊
              Interactive Rankings
            </h2>
            <p className="text-gray-400 mt-2">Visual representation of top performers</p>
          </div>
          
          <div className="divide-y divide-white/10">
            {leaderboard.map((entry, index) => {
              const maxPoints = leaderboard[0]?.points || 1;
              const progressPercentage = (entry.points / maxPoints) * 100;
              const isTopThree = index < 3;
              
              return (
                <div
                  key={entry.id}
                  className={`p-6 hover:bg-white/5 transition-all duration-300 transform hover:scale-[1.02] ${
                    isTopThree ? 'bg-gradient-to-r from-white/10 to-transparent' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {/* Enhanced Rank with Animation */}
                      <div className="w-16 flex justify-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                          entry.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-400/50' :
                          entry.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black shadow-lg shadow-gray-400/50' :
                          entry.rank === 3 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-lg shadow-amber-600/50' :
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
                          entry.rank === 3 ? 'ring-amber-600/50 bg-gradient-to-br from-amber-600/20 to-amber-800/20' :
                          'ring-purple-500/30 bg-gradient-to-br from-purple-500/20 to-pink-500/20'
                        }`}>
                          {entry.avatar ? (
                            <img src={entry.avatar} alt={entry.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-2xl">
                              {entry.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        {/* Activity Status Indicator */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      
                      {/* Enhanced User Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{entry.name}</h3>
                          {entry.rank <= 3 && (
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                              entry.rank === 1 ? 'bg-yellow-400 text-black' :
                              entry.rank === 2 ? 'bg-gray-400 text-black' :
                              'bg-amber-600 text-white'
                            }`}>
                              {entry.rank === 1 ? 'CHAMPION' : entry.rank === 2 ? 'RUNNER-UP' : 'BRONZE'}
                            </div>
                          )}
                        </div>
                        
                        {/* Stats Row */}
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">⚡</span>
                            <span className={`font-bold ${getLevelColor(entry.level)}`}>Level {entry.level}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">🎯</span>
                            <span className="text-emerald-400 font-bold">{entry.completedChallenges} completed</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">🔥</span>
                            <span className="text-orange-400 font-bold">{Math.floor(Math.random() * 30) + 1} day streak</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Points Display */}
                    <div className="text-right">
                      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-1">{entry.points.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">points</div>
                      <div className="text-xs text-emerald-400 font-medium">+{Math.floor(Math.random() * 500) + 100} this week</div>
                    </div>
                  </div>
                  
                  {/* Progress Bar Visualization */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <span>Progress to #1</span>
                      <span>{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          entry.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                          entry.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                          entry.rank === 3 ? 'bg-gradient-to-r from-amber-600 to-amber-800' :
                          'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}
                        style={{ 
                          width: `${progressPercentage}%`,
                          boxShadow: entry.rank <= 3 ? `0 0 10px ${
                            entry.rank === 1 ? '#facc15' :
                            entry.rank === 2 ? '#9ca3af' :
                            '#d97706'
                          }` : 'none'
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Mini Achievement Badges */}
                  <div className="flex items-center space-x-2">
                    {entry.completedChallenges >= 10 && (
                      <div className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/30">🏆 Challenger</div>
                    )}
                    {entry.level >= 15 && (
                      <div className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium border border-purple-500/30">⭐ Expert</div>
                    )}
                    {entry.rank <= 10 && (
                      <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/30">🔥 Top 10</div>
                    )}
                    {Math.random() > 0.7 && (
                      <div className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium border border-orange-500/30">⚡ Rising Star</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Stats Summary with Visual Elements */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300">
            <div className="relative mb-4">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">👑</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-yellow-400 mb-2">{leaderboard.length > 0 ? leaderboard[0].points.toLocaleString() : '0'}</div>
            <div className="text-gray-300 font-medium mb-2">Highest Score</div>
            <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
              <div className="w-full h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
            </div>
            <div className="text-xs text-yellow-400">🔥 Champion Level</div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300">
            <div className="relative mb-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-3xl">🎯</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-emerald-400 mb-2">{Math.round(leaderboard.reduce((acc, entry) => acc + entry.completedChallenges, 0) / leaderboard.length) || 0}</div>
            <div className="text-gray-300 font-medium mb-2">Avg. Completed</div>
            <div className="flex justify-center space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-2 h-8 rounded-full ${i < 3 ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
              ))}
            </div>
            <div className="text-xs text-emerald-400">📈 Growing Strong</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300">
            <div className="relative mb-4">
              <Zap className="w-16 h-16 text-purple-400 mx-auto" />
              <div className="absolute inset-0 bg-purple-400/20 rounded-full animate-ping"></div>
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-2">{Math.round(leaderboard.reduce((acc, entry) => acc + entry.level, 0) / leaderboard.length) || 0}</div>
            <div className="text-gray-300 font-medium mb-2">Avg. Level</div>
            <div className="relative w-16 h-16 mx-auto mb-2">
              <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-purple-500 rounded-full" style={{
                clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)'
              }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-purple-400">75%</span>
              </div>
            </div>
            <div className="text-xs text-purple-400">⚡ Power Level</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300">
            <div className="relative mb-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-3xl">🔥</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-orange-400 mb-2">{leaderboard.length}</div>
            <div className="text-gray-300 font-medium mb-2">Active Players</div>
            <div className="grid grid-cols-4 gap-1 mb-2">
              {[...Array(16)].map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${
                  Math.random() > 0.3 ? 'bg-orange-500' : 'bg-slate-700'
                }`}></div>
              ))}
            </div>
            <div className="text-xs text-orange-400">🌟 Community</div>
          </div>
        </div>

        {/* Performance Trends Chart */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mt-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            📈 Performance Trends
            <span className="ml-2 text-sm text-gray-400 font-normal">Last 7 days</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Points Distribution Chart */}
            <div>
              <h4 className="text-lg font-semibold text-gray-300 mb-4">Points Distribution</h4>
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((entry, index) => {
                  const maxPoints = leaderboard[0]?.points || 1;
                  const percentage = (entry.points / maxPoints) * 100;
                  
                  return (
                    <div key={entry.id} className="flex items-center space-x-3">
                      <div className="w-12 text-sm text-gray-400">#{entry.rank}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-white">{entry.name}</span>
                          <span className="text-sm text-yellow-400">{entry.points.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${
                              index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                              index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                              index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-800' :
                              'bg-gradient-to-r from-purple-500 to-pink-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity Heatmap */}
            <div>
              <h4 className="text-lg font-semibold text-gray-300 mb-4">Weekly Activity</h4>
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="text-center">
                    <div className="text-xs text-gray-400 mb-2">{day}</div>
                    <div className="space-y-1">
                      {[...Array(6)].map((_, i) => {
                        const intensity = Math.random();
                        return (
                          <div
                            key={i}
                            className={`w-4 h-4 rounded-sm ${
                              intensity > 0.8 ? 'bg-emerald-500' :
                              intensity > 0.6 ? 'bg-emerald-400' :
                              intensity > 0.4 ? 'bg-emerald-300' :
                              intensity > 0.2 ? 'bg-emerald-200' :
                              'bg-slate-700'
                            }`}
                            title={`${day} - ${Math.floor(intensity * 100)}% activity`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
                <span>Less</span>
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-slate-700 rounded-sm"></div>
                  <div className="w-3 h-3 bg-emerald-200 rounded-sm"></div>
                  <div className="w-3 h-3 bg-emerald-300 rounded-sm"></div>
                  <div className="w-3 h-3 bg-emerald-400 rounded-sm"></div>
                  <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                </div>
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
