import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  
  Star, 
  Trophy, 
  Users, 
  User, 
  Play, 
  ArrowLeft,
  Zap,
  Camera,
  Award
} from 'lucide-react';
import { Button } from '../components/ui/button';
import ChallengeCard from '../components/ChallengeCard';
import { challengeAPI, Challenge } from '../services/api';

const Challenges: React.FC = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  useEffect(() => {
    loadChallenges();
  }, []);

  useEffect(() => {
    filterChallenges();
  }, [challenges, searchTerm, selectedDifficulty, selectedCategory, showFeaturedOnly]);

  const loadChallenges = async () => {
    try {
      const response = await challengeAPI.getChallenges();
      if (response.success && response.data) {
        setChallenges(response.data);
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterChallenges = () => {
    let filtered = [...challenges];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(challenge =>
        challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(challenge => challenge.difficulty === selectedDifficulty);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(challenge => challenge.category === selectedCategory);
    }

    // Featured filter
    if (showFeaturedOnly) {
      filtered = filtered.filter(challenge => challenge.featured);
    }

    setFilteredChallenges(filtered);
  };

  const handleSendChallenge = async (challengeId: string) => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    // Store selected challenge in localStorage for Friends page
    localStorage.setItem('selectedChallenge', challengeId);
    
    // Navigate to Friends page to select who to send challenge to
    navigate('/friends?tab=friends&action=send-challenge');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'hard': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'creativity': return Camera;
      case 'teamwork': return Users;
      case 'speed': return Zap;
      case 'photography': return Camera;
      case 'innovation': return Award;
      case 'storytelling': return Award;
      default: return Star;
    }
  };

  const categories = [...new Set(challenges.map(c => c.category))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="backdrop-blur-sm bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                ⬅️
                Back to Dashboard
              </Button>
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">Challenges</h1>
              <p className="text-gray-400">Discover and send exciting challenges to friends</p>
            </div>
            
            <div className="w-32" /> {/* Spacer for centering */}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              🎯
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Difficulty Filter */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="all">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={String(category)}>
                    {String(category).charAt(0).toUpperCase() + String(category).slice(1)}
                  </option>
                ))}
              </select>

              {/* Featured Toggle */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="w-4 h-4 text-yellow-400 bg-white/5 border-white/20 rounded focus:ring-yellow-400 focus:ring-2"
                />
                <span className="text-white text-sm">Featured Only</span>
              </label>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-2">{challenges.length}</div>
            <div className="text-gray-300 font-medium">Total Challenges</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-2">
              {challenges.filter(c => c.featured).length}
            </div>
            <div className="text-gray-300 font-medium">Featured</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-2xl font-bold text-pink-400 mb-2">{categories.length}</div>
            <div className="text-gray-300 font-medium">Categories</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-2xl font-bold text-cyan-400 mb-2">{filteredChallenges.length}</div>
            <div className="text-gray-300 font-medium">Showing</div>
          </div>
        </div>

        {/* Challenges Grid */}
        {filteredChallenges.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredChallenges.map((challenge) => {
              const IconComponent = getCategoryIcon(challenge.category);
              return (
                <div
                  key={challenge.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
                >
                  {/* Challenge Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        {React.createElement(IconComponent, { className: "w-6 h-6 text-white" })}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
                          {challenge.title}
                        </h3>
                        <p className="text-sm text-gray-400 capitalize">{challenge.category}</p>
                      </div>
                    </div>
                    {challenge.featured && (
                      <div className="bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        ⭐
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {challenge.description}
                  </p>

                  {/* Challenge Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-gray-300">{challenge.points} pts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-300">{challenge.participants.toLocaleString()}</span>
                    </div>
                    {challenge.timeLimit && (
                      <div className="flex items-center space-x-2">
                        🎯
                        <span className="text-sm text-gray-300">
                          {Math.floor(challenge.timeLimit / 60)}m
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      🎯
                      <span className="text-sm text-gray-300">{challenge.completionRate}%</span>
                    </div>
                  </div>

                  {/* Difficulty Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty.toUpperCase()}
                    </span>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleSendChallenge(challenge.id)}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 font-semibold"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Send Challenge
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              🎯
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No challenges found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search terms or filters to find more challenges.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedDifficulty('all');
                setSelectedCategory('all');
                setShowFeaturedOnly(false);
              }}
              variant="ghost"
              className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Challenges;
