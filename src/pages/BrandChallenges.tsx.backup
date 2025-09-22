import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  Trophy, 
  Film, 
  Camera, 
  ArrowLeft,
  Users,
  Play,
  Zap,
  User,
  Mail
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useTheme } from '../context/ThemeContext';

interface BrandChallenge {
  id: string;
  title: string;
  description: string;
  brandName: string;
  brandLogo?: string;
  category: 'cafe' | 'restaurant' | 'retail' | 'entertainment';
  location: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
    distance?: string;
  };
  points: number;
  rewardPoints: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in minutes
  requirements: string[];
  rewards: {
    description: string;
    pointsRequired: number;
    type: 'discount' | 'freeItem' | 'voucher';
  }[];
  participants: number;
  completionRate: number;
  status: 'available' | 'completed' | 'expired';
  expiresAt: Date;
}

const BrandChallenges: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [challenges, setChallenges] = useState<BrandChallenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<BrandChallenge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userPoints, setUserPoints] = useState(1250); // User's current reward points

  useEffect(() => {
    loadBrandChallenges();
    getUserLocation();
  }, []);

  useEffect(() => {
    filterChallenges();
  }, [challenges, selectedCategory]);

  const loadBrandChallenges = () => {
    // Mock brand challenges data
    const mockChallenges: BrandChallenge[] = [
      {
        id: 'brand-1',
        title: 'Coffee Review Challenge',
        description: 'Visit Brew & Beans cafe, order their signature latte, take a photo, and write a detailed review about the taste, ambiance, and service.',
        brandName: 'Brew & Beans',
        category: 'cafe',
        location: {
          name: 'Brew & Beans - Downtown',
          address: '123 Main St, Downtown',
          coordinates: { lat: 40.7128, lng: -74.0060 },
          distance: '0.5 km'
        },
        points: 150,
        rewardPoints: 200,
        difficulty: 'easy',
        timeLimit: 60,
        requirements: [
          'Visit the location during business hours',
          'Order at least one item',
          'Take a photo of your order',
          'Write a 50+ word review',
          'Rate the experience (1-5 stars)'
        ],
        rewards: [
          {
            description: 'Free coffee on next visit',
            pointsRequired: 500,
            type: 'freeItem'
          },
          {
            description: '20% off any purchase',
            pointsRequired: 300,
            type: 'discount'
          }
        ],
        participants: 89,
        completionRate: 92,
        status: 'available',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'brand-2',
        title: 'Fashion Store Experience',
        description: 'Visit TrendHub fashion store, try on their new collection, create a styling video, and share your fashion tips.',
        brandName: 'TrendHub',
        category: 'retail',
        location: {
          name: 'TrendHub - Mall Plaza',
          address: '456 Shopping Ave, Mall Plaza',
          coordinates: { lat: 40.7589, lng: -73.9851 },
          distance: '1.2 km'
        },
        points: 300,
        rewardPoints: 400,
        difficulty: 'medium',
        timeLimit: 90,
        requirements: [
          'Visit during store hours',
          'Try on at least 3 items',
          'Create a 30-second styling video',
          'Share fashion tips',
          'Tag the store in social media'
        ],
        rewards: [
          {
            description: '$50 shopping voucher',
            pointsRequired: 1000,
            type: 'voucher'
          },
          {
            description: '15% off entire purchase',
            pointsRequired: 600,
            type: 'discount'
          }
        ],
        participants: 156,
        completionRate: 78,
        status: 'available',
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'brand-3',
        title: 'Restaurant Food Review',
        description: 'Dine at Taste Paradise restaurant, order their chef special, document your dining experience, and create a food review video.',
        brandName: 'Taste Paradise',
        category: 'restaurant',
        location: {
          name: 'Taste Paradise - City Center',
          address: '789 Food Court, City Center',
          coordinates: { lat: 40.7505, lng: -73.9934 },
          distance: '2.1 km'
        },
        points: 400,
        rewardPoints: 500,
        difficulty: 'hard',
        timeLimit: 120,
        requirements: [
          'Make a reservation',
          'Order the chef special',
          'Document the full dining experience',
          'Create a 60-second review video',
          'Rate food, service, and ambiance'
        ],
        rewards: [
          {
            description: 'Free dessert on next visit',
            pointsRequired: 400,
            type: 'freeItem'
          },
          {
            description: 'Complimentary appetizer',
            pointsRequired: 600,
            type: 'freeItem'
          }
        ],
        participants: 67,
        completionRate: 85,
        status: 'available',
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      }
    ];

    setChallenges(mockChallenges);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied');
        }
      );
    }
  };

  const filterChallenges = () => {
    let filtered = [...challenges];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(challenge => challenge.category === selectedCategory);
    }

    setFilteredChallenges(filtered);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cafe': return <Star className="w-4 h-4" />;
      case 'restaurant': return <Film className="w-4 h-4" />;
      case 'retail': return <User className="w-5 h-5" />;
      case 'entertainment': return <Play className="w-5 h-5" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'hard': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const handleStartChallenge = (challengeId: string) => {
    // In a real app, this would start the challenge and track location
    console.log('Starting brand challenge:', challengeId);
    // Navigate to challenge execution page or show instructions
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Header */}
      <header className={`border-b ${
        isDark ? 'border-slate-700/50 bg-slate-900/50' : 'border-gray-200 bg-white/50'
      } backdrop-blur-sm sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                ⬅️
                Back to Dashboard
              </Button>
              <div>
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Brand Challenges
                </h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Complete challenges at partner locations and earn rewards
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-lg ${
                isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
              }`}>
                <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4" />  // Change Award to Trophy
                  <span className="font-semibold">{userPoints} Points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Categories', icon: Star },
              { id: 'cafe', label: 'Cafes', icon: Star },
              { id: 'restaurant', label: 'Restaurants', icon: Film },
              { id: 'retail', label: 'Retail', icon: User },
              { id: 'entertainment', label: 'Entertainment', icon: Play }
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? isDark
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                    : isDark
                      ? 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
                isDark 
                  ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600' 
                  : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Challenge Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full ${
                    isDark ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-green-500 to-blue-500'
                  } flex items-center justify-center`}>
                    {getCategoryIcon(challenge.category)}
                  </div>
                  <div>
                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {challenge.title}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {challenge.brandName}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-2 mb-3">
              <Star className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {challenge.location.name}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {challenge.location.distance} away
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {challenge.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Trophy className={`w-4 h-4 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
                    <span className={`text-sm font-medium ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      {challenge.rewardPoints} pts
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                  <Zap className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {challenge.timeLimit}m
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {challenge.participants}
                  </span>
                </div>
              </div>

              {/* Rewards Preview */}
              <div className="mb-4">
                <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Available Rewards:
                </p>
                <div className="space-y-1">
                  {challenge.rewards.slice(0, 2).map((reward, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {reward.description}
                      </span>
                      <span className={`text-xs font-medium ${
                        userPoints >= reward.pointsRequired 
                          ? isDark ? 'text-green-400' : 'text-green-600'
                          : isDark ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {reward.pointsRequired} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={() => handleStartChallenge(challenge.id)}
                className={`w-full ${
                  isDark
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                }`}
              >
                <Camera className="w-4 h-4 mr-2" />
                Start Challenge
              </Button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BrandChallenges;
