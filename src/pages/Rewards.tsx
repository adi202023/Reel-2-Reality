import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy,
  Award,
  Star,
  ArrowLeft,
  Film,
  Zap,
  Play,
  Users
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useTheme } from '../context/ThemeContext';

interface Reward {
  id: string;
  title: string;
  description: string;
  brandName: string;
  brandLogo?: string;
  category: 'cafe' | 'restaurant' | 'retail' | 'entertainment';
  type: 'discount' | 'freeItem' | 'voucher';
  pointsRequired: number;
  value: string;
  expiresAt: Date;
  termsAndConditions: string[];
  locations: string[];
  isRedeemed?: boolean;
  redeemedAt?: Date;
}

interface UserReward {
  id: string;
  rewardId: string;
  reward: Reward;
  redeemedAt: Date;
  expiresAt: Date;
  status: 'active' | 'used' | 'expired';
  qrCode?: string;
}

const Rewards: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);
  const [userRewards, setUserRewards] = useState<UserReward[]>([]);
  const [userPoints, setUserPoints] = useState(1250);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'available' | 'myRewards'>('available');

  useEffect(() => {
    loadRewards();
    loadUserRewards();
  }, []);

  const loadRewards = () => {
    const mockRewards: Reward[] = [
      {
        id: 'reward-1',
        title: 'Free Coffee',
        description: 'Get a free coffee of your choice (up to $5 value)',
        brandName: 'Brew & Beans',
        category: 'cafe',
        type: 'freeItem',
        pointsRequired: 500,
        value: '$5',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        termsAndConditions: [
          'Valid for one free coffee up to $5 value',
          'Cannot be combined with other offers',
          'Valid at all Brew & Beans locations',
          'Must be redeemed within 30 days'
        ],
        locations: ['Downtown', 'Mall Plaza', 'City Center']
      },
      {
        id: 'reward-2',
        title: '20% Off Purchase',
        description: '20% discount on your entire purchase',
        brandName: 'Brew & Beans',
        category: 'cafe',
        type: 'discount',
        pointsRequired: 300,
        value: '20%',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        termsAndConditions: [
          '20% off entire purchase',
          'Minimum purchase of $10 required',
          'Valid once per customer',
          'Cannot be combined with other discounts'
        ],
        locations: ['All locations']
      },
      {
        id: 'reward-3',
        title: '$50 Shopping Voucher',
        description: '$50 voucher for any purchase at TrendHub',
        brandName: 'TrendHub',
        category: 'retail',
        type: 'voucher',
        pointsRequired: 1000,
        value: '$50',
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        termsAndConditions: [
          '$50 off any purchase',
          'Minimum purchase of $100 required',
          'Valid for 60 days from redemption',
          'Non-transferable'
        ],
        locations: ['Mall Plaza', 'Fashion District']
      },
      {
        id: 'reward-4',
        title: 'Free Dessert',
        description: 'Complimentary dessert with any main course',
        brandName: 'Taste Paradise',
        category: 'restaurant',
        type: 'freeItem',
        pointsRequired: 400,
        value: '$8',
        expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        termsAndConditions: [
          'Free dessert with main course purchase',
          'Dine-in only',
          'Valid Monday-Thursday',
          'Reservation recommended'
        ],
        locations: ['City Center']
      }
    ];

    setAvailableRewards(mockRewards);
  };

  const loadUserRewards = () => {
    const mockUserRewards: UserReward[] = [
      {
        id: 'user-reward-1',
        rewardId: 'reward-2',
        reward: {
          id: 'reward-2',
          title: '20% Off Purchase',
          description: '20% discount on your entire purchase',
          brandName: 'Brew & Beans',
          category: 'cafe',
          type: 'discount',
          pointsRequired: 300,
          value: '20%',
          expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          termsAndConditions: [],
          locations: ['All locations']
        },
        redeemedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: 'active',
        qrCode: 'QR123456789'
      }
    ];

    setUserRewards(mockUserRewards);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cafe': return <Award />;
      case 'restaurant': return <Film />;
      case 'retail': return <Zap />;
      case 'entertainment': return <Play />;
      default: return <Star />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'discount': return <Award />;
      case 'voucher': return <Trophy />;
      case 'freeItem': return <Award />;
      default: return <Award />;
    }
  };

  const handleRedeemReward = (rewardId: string) => {
    const reward = availableRewards.find(r => r.id === rewardId);
    if (!reward) return;

    if (userPoints < reward.pointsRequired) {
      alert('Insufficient points!');
      return;
    }

    // Deduct points
    setUserPoints(prev => prev - reward.pointsRequired);

    // Add to user rewards
    const newUserReward: UserReward = {
      id: `user-reward-${Date.now()}`,
      rewardId: reward.id,
      reward: reward,
      redeemedAt: new Date(),
      expiresAt: reward.expiresAt,
      status: 'active',
      qrCode: `QR${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };

    setUserRewards(prev => [...prev, newUserReward]);
    alert(`Successfully redeemed ${reward.title}! Check "My Rewards" tab.`);
  };

  const filteredRewards = selectedCategory === 'all' 
    ? availableRewards 
    : availableRewards.filter(reward => reward.category === selectedCategory);

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
                <ArrowLeft />
                Back to Dashboard
              </Button>
              <div>
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Rewards Store
                </h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Redeem your points for amazing rewards
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-lg ${
                isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
              }`}>
                <div className="flex items-center space-x-2">
                  <Trophy />
                  <span className="font-semibold">{userPoints} Points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg w-fit">
            {[
              { id: 'available', label: 'Available Rewards' },
              { id: 'myRewards', label: 'My Rewards' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'available' | 'myRewards')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? isDark
                      ? 'bg-yellow-500 text-black'
                      : 'bg-blue-600 text-white'
                    : isDark
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Available Rewards Tab */}
        {activeTab === 'available' && (
          <>
            {/* Category Filter */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All Categories', icon: Award },
                  { id: 'cafe', label: 'Cafes', icon: Award },
                  { id: 'restaurant', label: 'Restaurants', icon: Film },
                  { id: 'retail', label: 'Retail', icon: Zap }
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

            {/* Rewards Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRewards.map((reward) => (
                <div
                  key={reward.id}
                  className={`p-6 rounded-xl border transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-800/50 border-slate-700/50' 
                      : 'bg-white border-gray-200 shadow-sm'
                  }`}
                >
                  {/* Reward Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full ${
                        isDark ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      } flex items-center justify-center`}>
                        {getCategoryIcon(reward.category)}
                      </div>
                      <div>
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {reward.title}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {reward.brandName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getTypeIcon(reward.type)}
                      <span className={`text-lg font-bold ${isDark ? 'text-yellow-400' : 'text-green-600'}`}>
                        {reward.value}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {reward.description}
                  </p>

                  {/* Points Required */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Trophy className={`w-4 h-4 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
                      <span className={`text-sm font-medium ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                        {reward.pointsRequired} points
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Expires {reward.expiresAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-1 mb-1">
                      <Users className={`w-3 h-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Locations:
                      </span>
                    </div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {reward.locations.join(', ')}
                    </p>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleRedeemReward(reward.id)}
                    disabled={userPoints < reward.pointsRequired}
                    className={`w-full ${
                      userPoints >= reward.pointsRequired
                        ? isDark
                          ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white'
                          : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white'
                        : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    {userPoints >= reward.pointsRequired ? 'Redeem Now' : 'Insufficient Points'}
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* My Rewards Tab */}
        {activeTab === 'myRewards' && (
          <div className="space-y-6">
            {userRewards.length === 0 ? (
              <div className="text-center py-12">
                <Award className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  No rewards yet
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Complete brand challenges to earn points and redeem rewards!
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {userRewards.map((userReward) => (
                  <div
                    key={userReward.id}
                    className={`p-6 rounded-xl border ${
                      isDark 
                        ? 'bg-slate-800/50 border-slate-700/50' 
                        : 'bg-white border-gray-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {userReward.reward.title}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {userReward.reward.brandName}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        userReward.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        userReward.status === 'used' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {userReward.status}
                      </span>
                    </div>

                    <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {userReward.reward.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Redeemed:</span>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                          {userReward.redeemedAt.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Expires:</span>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                          {userReward.expiresAt.toLocaleDateString()}
                        </span>
                      </div>
                      {userReward.qrCode && (
                        <div className="flex justify-between text-sm">
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Code:</span>
                          <span className={`font-mono ${isDark ? 'text-yellow-400' : 'text-blue-600'}`}>
                            {userReward.qrCode}
                          </span>
                        </div>
                      )}
                    </div>

                    {userReward.status === 'active' && (
                      <Button
                        className={`w-full ${
                          isDark
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                        }`}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Show at Store
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Rewards;
