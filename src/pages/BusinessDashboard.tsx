import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { apiService } from '../services/api';
import { useApp } from '../context/AppContext';

interface Challenge {
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
}

interface BusinessStats {
  totalChallenges: number;
  activeChallenges: number;
  totalParticipants: number;
  totalCompletions: number;
  revenue: number;
  engagement: number;
}

const BusinessDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [businessUser, setBusinessUser] = useState<any>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [stats, setStats] = useState<BusinessStats>({
    totalChallenges: 0,
    activeChallenges: 0,
    totalParticipants: 0,
    totalCompletions: 0,
    revenue: 0,
    engagement: 0
  });

  const [newChallenge, setNewChallenge] = useState<{
    title: string;
    description: string;
    points: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    startDate: string;
    endDate: string;
    rewards: string[];
  }>({
    title: '',
    description: '',
    points: '',
    difficulty: 'medium',
    category: 'Social Media',
    startDate: '',
    endDate: '',
    rewards: ['Free Coffee', 'Discount Coupon']
  });

  const [rewards, setRewards] = useState([
    { id: '1', name: 'Free Coffee', description: 'Any size coffee drink', category: 'Food', value: '$5.00', usage: 45, available: true },
    { id: '2', name: 'Free Dessert', description: 'Any dessert from our menu', category: 'Food', value: '$8.00', usage: 32, available: true },
    { id: '3', name: '20% Discount', description: 'On your entire order', category: 'Discount', value: '20%', usage: 67, available: true },
    { id: '4', name: '$10 Gift Card', description: 'Digital gift card', category: 'Merchandise', value: '$10.00', usage: 12, available: false },
    { id: '5', name: 'VIP Experience', description: 'Priority seating and service', category: 'Experience', value: 'Priceless', usage: 8, available: true },
    { id: '6', name: 'Free Lunch', description: 'Any lunch item under $15', category: 'Food', value: '$15.00', usage: 23, available: true }
  ]);

  const [showAddReward, setShowAddReward] = useState(false);
  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    category: 'Food',
    value: '',
    available: true
  });

  const [videoSubmissions, setVideoSubmissions] = useState([
    {
      id: '1',
      user: 'Sarah Johnson',
      avatar: '👩‍💼',
      challenge: 'Coffee Art Challenge',
      submittedAt: '2 hours ago',
      status: 'pending',
      videoUrl: 'https://example.com/video1.mp4',
      description: 'Check out my amazing latte art creation! Spent 20 minutes perfecting this design.',
      rating: 0,
      priority: 'high',
      reward: null
    },
    {
      id: '2',
      user: 'Mike Chen',
      avatar: '👨‍💻',
      challenge: 'Breakfast Photo Contest',
      submittedAt: '5 hours ago',
      status: 'pending',
      videoUrl: 'https://example.com/video2.mp4',
      description: 'My delicious breakfast spread with your amazing pancakes!',
      rating: 0,
      priority: 'medium',
      reward: null
    },
    {
      id: '3',
      user: 'Emma Davis',
      avatar: '👩‍🎨',
      challenge: 'Review Challenge',
      submittedAt: '1 day ago',
      status: 'approved',
      videoUrl: 'https://example.com/video3.mp4',
      description: 'Honest review of my dining experience - absolutely loved it!',
      rating: 5,
      priority: 'low',
      reward: 'Free Dessert'
    },
    {
      id: '4',
      user: 'Alex Rodriguez',
      avatar: '👨‍🍳',
      challenge: 'Coffee Art Challenge',
      submittedAt: '2 days ago',
      status: 'approved',
      videoUrl: 'https://example.com/video4.mp4',
      description: 'My first attempt at latte art - thanks for the inspiration!',
      rating: 4,
      priority: 'low',
      reward: 'Free Coffee'
    }
  ]);

  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterChallenge, setFilterChallenge] = useState('all');
  const [searchUser, setSearchUser] = useState('');

  useEffect(() => {
    // Check authentication
    const businessAuthToken = localStorage.getItem('businessAuthToken');
    const businessUserData = localStorage.getItem('businessUser');

    if (!businessAuthToken || !businessUserData) {
      navigate('/business-auth');
      return;
    }

    try {
      const userData = JSON.parse(businessUserData);
      setBusinessUser(userData);
      
      // Load real data from backend
      loadBusinessData();
    } catch (error) {
      console.error('Error parsing business user data:', error);
      navigate('/business-auth');
    }
  }, [navigate]);

  const loadBusinessData = async () => {
    try {
      // Load challenges from backend
      const challengesResponse = await apiService.getBusinessChallenges();
      if (challengesResponse.success && challengesResponse.data) {
        setChallenges(challengesResponse.data.challenges || []);
      }

      // Load stats from backend
      const statsResponse = await apiService.getBusinessStats();
      if (statsResponse.success && statsResponse.data) {
        setStats({
          totalChallenges: statsResponse.data.totalChallenges,
          activeChallenges: statsResponse.data.activeChallenges,
          totalParticipants: statsResponse.data.totalParticipants,
          totalCompletions: statsResponse.data.totalCompletions,
          revenue: statsResponse.data.revenue,
          engagement: statsResponse.data.engagement
        });
      }
    } catch (error) {
      console.error('Error loading business data:', error);
      // Fall back to mock data if API fails
      loadMockData();
    }
  };

  const loadMockData = () => {
    // Load mock challenges with professional content (fallback)
    const mockChallenges: Challenge[] = [
      {
        id: '1',
        title: 'Create the most creative latte art and share it on social media',
        description: 'Show your artistic skills by creating beautiful latte art designs',
        points: 150,
        difficulty: 'medium',
        category: 'Social Media',
        status: 'active',
        participants: 45,
        completions: 32,
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        rewards: ['Free Coffee', '20% Discount'],
        successRate: 71
      },
      {
        id: '2',
        title: 'Share your best breakfast photo with our hashtag',
        description: 'Capture and share your most appetizing breakfast moment',
        points: 100,
        difficulty: 'easy',
        category: 'Photography',
        status: 'active',
        participants: 67,
        completions: 54,
        startDate: '2024-01-10',
        endDate: '2024-02-28',
        rewards: ['Free Pastry', 'Instagram Feature'],
        successRate: 81
      },
      {
        id: '3',
        title: 'Leave a detailed review on Google and social media',
        description: 'Help us grow by sharing your experience with others',
        points: 200,
        difficulty: 'easy',
        category: 'Reviews',
        status: 'active',
        participants: 89,
        completions: 76,
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        rewards: ['Free Meal', 'VIP Status'],
        successRate: 85
      },
      {
        id: '4',
        title: 'Coffee Tasting Challenge',
        description: 'Try our new seasonal blend and share your thoughts',
        points: 120,
        difficulty: 'medium',
        category: 'Tasting',
        status: 'draft',
        participants: 0,
        completions: 0,
        startDate: '2024-02-01',
        endDate: '2024-02-29',
        rewards: ['Free Coffee Bag', 'Tasting Certificate'],
        successRate: 0
      },
      {
        id: '5',
        title: 'Bring a Friend Challenge',
        description: 'Introduce a friend to our cafe and both get rewards',
        points: 250,
        difficulty: 'hard',
        category: 'Referral',
        status: 'completed',
        participants: 23,
        completions: 18,
        startDate: '2023-12-01',
        endDate: '2023-12-31',
        rewards: ['Free Lunch', 'Friend Gets 50% Off'],
        successRate: 78
      }
    ];

    setChallenges(mockChallenges);
  };

  const handleLogout = () => {
    localStorage.removeItem('businessAuthToken');
    localStorage.removeItem('businessUser');
    navigate('/business-auth');
  };

  const handleCreateChallenge = async () => {
    if (!newChallenge.title || !newChallenge.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // For now, create challenge locally since backend create endpoint needs auth token
      const challenge: Challenge = {
        id: Date.now().toString(),
        title: newChallenge.title,
        description: newChallenge.description,
        points: parseInt(newChallenge.points) || 100,
        difficulty: newChallenge.difficulty,
        category: newChallenge.category,
        status: 'draft',
        participants: 0,
        completions: 0,
        startDate: newChallenge.startDate,
        endDate: newChallenge.endDate,
        rewards: newChallenge.rewards,
        successRate: 0
      };

      // Add the new challenge to the local state
      setChallenges(prev => [...prev, challenge]);
      
      // Reset form
      setNewChallenge({
        title: '',
        description: '',
        points: '',
        difficulty: 'medium',
        category: 'Social Media',
        startDate: '',
        endDate: '',
        rewards: ['Free Coffee', 'Discount Coupon']
      });
      setActiveTab('challenges');
      
      alert('Challenge created successfully!');
    } catch (error) {
      console.error('Error creating challenge:', error);
      alert('Failed to create challenge. Please try again.');
    }
  };

  const handleCreateReward = async () => {
    if (!newReward.name || !newReward.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // For now, create reward locally since backend create endpoint needs auth token
      const reward = {
        id: Date.now().toString(),
        name: newReward.name,
        description: newReward.description,
        category: newReward.category,
        value: newReward.value,
        available: newReward.available,
        usage: 0
      };

      // Add the new reward to the local state
      setRewards(prev => [...prev, reward]);
      
      // Reset form
      setNewReward({
        name: '',
        description: '',
        category: 'Food',
        value: '',
        available: true
      });
      setShowAddReward(false);
      
      alert('Reward created successfully!');
    } catch (error) {
      console.error('Error creating reward:', error);
      alert('Failed to create reward. Please try again.');
    }
  };

  const handleApproveSubmission = async (submissionId: string) => {
    try {
      // For now, approve submission locally since backend approve endpoint needs auth token
      const updatedSubmissions = videoSubmissions.map(submission => {
        if (submission.id === submissionId) {
          return { ...submission, status: 'approved' as const };
        }
        return submission;
      });
      setVideoSubmissions(updatedSubmissions);
      
      // Remove from selected submissions if it was selected
      setSelectedSubmissions(prev => prev.filter(id => id !== submissionId));
      
      // Show success notification
      const submissionUser = videoSubmissions.find(s => s.id === submissionId)?.user;
      alert(`✅ Submission by ${submissionUser} has been approved successfully!`);
    } catch (error) {
      console.error('Error approving submission:', error);
      alert('Failed to approve submission. Please try again.');
    }
  };

  const handleRejectSubmission = async (submissionId: string) => {
    try {
      // For now, reject submission locally since backend reject endpoint needs auth token
      const updatedSubmissions = videoSubmissions.map(submission => {
        if (submission.id === submissionId) {
          return { ...submission, status: 'rejected' as const };
        }
        return submission;
      });
      setVideoSubmissions(updatedSubmissions);
      
      // Remove from selected submissions if it was selected
      setSelectedSubmissions(prev => prev.filter(id => id !== submissionId));
      
      // Show success notification
      const submissionUser = videoSubmissions.find(s => s.id === submissionId)?.user;
      alert(`❌ Submission by ${submissionUser} has been rejected.`);
    } catch (error) {
      console.error('Error rejecting submission:', error);
      alert('Failed to reject submission. Please try again.');
    }
  };

  const handleExportReport = async () => {
    try {
      // For now, export report locally since backend export endpoint needs auth token
      const reportData = videoSubmissions.map(submission => ({
        id: submission.id,
        user: submission.user,
        challenge: submission.challenge,
        status: submission.status,
        videoUrl: submission.videoUrl,
        description: submission.description,
        rating: submission.rating,
        priority: submission.priority,
        reward: submission.reward
      }));
      const csvContent = `data:text/csv;charset=utf-8,${reportData.map(row => Object.values(row).join(',')).join('\n')}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'video_submissions_report.csv');
      link.click();
      alert('Report exported successfully!');
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report. Please try again.');
    }
  };

  const handleBatchApprove = async () => {
    try {
      const updatedSubmissions = videoSubmissions.map(submission => {
        if (selectedSubmissions.includes(submission.id)) {
          return { ...submission, status: 'approved' as const };
        }
        return submission;
      });
      setVideoSubmissions(updatedSubmissions);
      setSelectedSubmissions([]);
      alert('Selected submissions approved successfully!');
    } catch (error) {
      console.error('Error approving submissions:', error);
      alert('Failed to approve submissions. Please try again.');
    }
  };

  const handleBatchReject = async () => {
    try {
      const updatedSubmissions = videoSubmissions.map(submission => {
        if (selectedSubmissions.includes(submission.id)) {
          return { ...submission, status: 'rejected' as const };
        }
        return submission;
      });
      setVideoSubmissions(updatedSubmissions);
      setSelectedSubmissions([]);
      alert('Selected submissions rejected successfully!');
    } catch (error) {
      console.error('Error rejecting submissions:', error);
      alert('Failed to reject submissions. Please try again.');
    }
  };

  if (!businessUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const StatCard: React.FC<any> = ({ icon, title, value, change, color }) => (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-1 flex items-center ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              <span>📈</span>
              {change > 0 ? '+' : ''}
              {change}%
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          <span className="text-white">{icon}</span>
        </div>
      </div>
    </div>
  );

  const ChallengeCard: React.FC<{ challenge: Challenge }> = ({ challenge }) => (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{challenge.title}</h3>
          <p className="text-gray-400 text-sm">{challenge.description}</p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700">
            <span>👀</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700">
            <span>⭐️</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-gray-400 text-xs">Points</p>
          <p className="font-semibold text-emerald-400">{challenge.points}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Participants</p>
          <p className="font-semibold text-white">{challenge.participants}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Completions</p>
          <p className="font-semibold text-white">{challenge.completions}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Success Rate</p>
          <p className="font-semibold text-white">{challenge.successRate}%</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              challenge.status === 'active'
                ? 'bg-green-900 text-green-300'
                : challenge.status === 'draft'
                ? 'bg-yellow-900 text-yellow-300'
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            {challenge.status}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              challenge.difficulty === 'easy' ? 'bg-blue-900 text-blue-300' :
              challenge.difficulty === 'medium' ? 'bg-orange-900 text-orange-300' :
              'bg-red-900 text-red-300'
            }`}
          >
            {challenge.difficulty}
          </span>
        </div>
        <div className="text-sm text-gray-400">
          <span>📆</span>
          {challenge.endDate ? new Date(challenge.endDate).toLocaleDateString() : '—'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 shadow-lg border-r border-gray-700 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-3 p-6 border-b border-gray-700">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span>☕️</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">COFFEE CAFE</h1>
              <p className="text-sm text-gray-400">Business Hub</p>
            </div>
          </div>

          <nav className="p-4 space-y-2 flex-1">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'challenges', label: 'Challenges', icon: '🏆' },
              { id: 'create-challenge', label: 'Create Challenge', icon: '➕' },
              { id: 'video-reviews', label: 'Video Reviews', icon: '🎬' },
              { id: 'rewards', label: 'Rewards', icon: '🎁' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
              { id: 'social-media', label: 'Social Media', icon: '📱' },
              { id: 'settings', label: 'Settings', icon: '🎯' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-700">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-red-400 hover:bg-red-900 hover:text-red-300"
            >
              <span>🚫</span>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-gray-800 shadow-lg border-b border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" className="lg:hidden text-white" onClick={() => setSidebarOpen(true)}>
                  <span>👥</span>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </h1>
                  <p className="text-gray-400">Manage your business challenges and engagement</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {activeTab === 'challenges' && (
                  <Button
                    onClick={() => setActiveTab('create-challenge')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <span>➕</span>
                    New Challenge
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon="🏆"
                  title="Total Challenges"
                  value={stats.totalChallenges}
                  change={12}
                  color="bg-blue-600"
                />
                <StatCard
                  icon="👥"
                  title="Total Participants"
                  value={stats.totalParticipants}
                  change={8}
                  color="bg-green-600"
                />
                <StatCard
                  icon="🏅"
                  title="Completions"
                  value={stats.totalCompletions}
                  change={15}
                  color="bg-purple-600"
                />
                <StatCard
                  icon="📈"
                  title="Revenue Impact"
                  value={`$${stats.revenue.toLocaleString()}`}
                  change={22}
                  color="bg-emerald-600"
                />
                <StatCard
                  icon="📊"
                  title="Engagement Rate"
                  value={`${stats.engagement}%`}
                  change={5}
                  color="bg-orange-600"
                />
                <StatCard
                  icon="🔥"
                  title="Active Challenges"
                  value={stats.activeChallenges}
                  change={-2}
                  color="bg-red-600"
                />
              </div>

              {/* Recent Challenges */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Recent Challenges</h2>
                <div className="grid gap-4">
                  {challenges.slice(0, 3).map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'challenges' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">All Challenges</h2>
              </div>
              <div className="grid gap-4">
                {challenges.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'create-challenge' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Create New Challenge</h2>
                <Button
                  onClick={() => setActiveTab('challenges')}
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  ← Back to Challenges
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Challenge Form */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-6">Challenge Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">Challenge Title *</label>
                      <input
                        type="text"
                        value={newChallenge.title}
                        onChange={(e) => setNewChallenge(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter an engaging challenge title"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">Description *</label>
                      <textarea
                        value={newChallenge.description}
                        onChange={(e) => setNewChallenge(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe what participants need to do..."
                        rows={4}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Points Reward</label>
                        <input
                          type="number"
                          value={newChallenge.points}
                          onChange={(e) => setNewChallenge(prev => ({ ...prev, points: e.target.value }))}
                          placeholder="100"
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Difficulty</label>
                        <select
                          value={newChallenge.difficulty}
                          onChange={(e) => setNewChallenge(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="easy">🟢 Easy</option>
                          <option value="medium">🟡 Medium</option>
                          <option value="hard">🔴 Hard</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">Category</label>
                      <select
                        value={newChallenge.category}
                        onChange={(e) => setNewChallenge(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="Social Media">📱 Social Media</option>
                        <option value="Photography">📸 Photography</option>
                        <option value="Reviews">⭐ Reviews</option>
                        <option value="Tasting">🍽️ Tasting</option>
                        <option value="Referral">👥 Referral</option>
                        <option value="Creative">🎨 Creative</option>
                        <option value="Fitness">💪 Fitness</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Start Date</label>
                        <input
                          type="date"
                          value={newChallenge.startDate}
                          onChange={(e) => setNewChallenge(prev => ({ ...prev, startDate: e.target.value }))}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">End Date</label>
                        <input
                          type="date"
                          value={newChallenge.endDate}
                          onChange={(e) => setNewChallenge(prev => ({ ...prev, endDate: e.target.value }))}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">Rewards (comma separated)</label>
                      <input
                        type="text"
                        value={newChallenge.rewards.join(', ')}
                        onChange={(e) => setNewChallenge(prev => ({ ...prev, rewards: e.target.value.split(', ').filter(r => r.trim()) }))}
                        placeholder="Free Coffee, 20% Discount, Gift Card"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <Button
                        onClick={handleCreateChallenge}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        disabled={!newChallenge.title || !newChallenge.description}
                      >
                        🚀 Create Challenge
                      </Button>
                      <Button
                        onClick={() => setActiveTab('challenges')}
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Challenge Preview */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-6">Preview</h3>
                  
                  <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white">
                        {newChallenge.title || 'Challenge Title'}
                      </h4>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          newChallenge.difficulty === 'easy' ? 'bg-green-900 text-green-300' :
                          newChallenge.difficulty === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                          'bg-red-900 text-red-300'
                        }`}>
                          {newChallenge.difficulty}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
                          {newChallenge.category}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-4">
                      {newChallenge.description || 'Challenge description will appear here...'}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-xs">Points</p>
                        <p className="font-semibold text-emerald-400">{newChallenge.points || '0'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Duration</p>
                        <p className="font-semibold text-white">
                          {newChallenge.startDate && newChallenge.endDate 
                            ? `${Math.ceil((new Date(newChallenge.endDate).getTime() - new Date(newChallenge.startDate).getTime()) / (1000 * 60 * 60 * 24))} days`
                            : 'Not set'
                          }
                        </p>
                      </div>
                    </div>
                    
                    {newChallenge.rewards.length > 0 && (
                      <div>
                        <p className="text-gray-400 text-xs mb-2">Rewards</p>
                        <div className="flex flex-wrap gap-2">
                          {newChallenge.rewards.map((reward, index) => (
                            <span key={index} className="px-2 py-1 bg-emerald-900 text-emerald-300 rounded text-xs">
                              🎁 {reward}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Templates */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Quick Templates</h4>
                    <div className="space-y-2">
                      {[
                        {
                          name: 'Social Media Post',
                          title: 'Share your experience with us!',
                          description: 'Post a photo of your visit and tag us on social media',
                          category: 'Social Media',
                          points: '150',
                          rewards: ['Free Drink', '10% Off Next Visit']
                        },
                        {
                          name: 'Photo Contest',
                          title: 'Best Food Photo Contest',
                          description: 'Take the most appetizing photo of our signature dish',
                          category: 'Photography',
                          points: '200',
                          rewards: ['Free Meal', 'Featured on Our Wall']
                        },
                        {
                          name: 'Review Challenge',
                          title: 'Leave us a detailed review',
                          description: 'Share your honest feedback on Google or Yelp',
                          category: 'Reviews',
                          points: '100',
                          rewards: ['Free Dessert', 'VIP Status']
                        }
                      ].map((template, index) => (
                        <button
                          key={index}
                          onClick={() => setNewChallenge(prev => ({
                            ...prev,
                            title: template.title,
                            description: template.description,
                            category: template.category,
                            points: template.points,
                            rewards: template.rewards
                          }))}
                          className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 transition-colors"
                        >
                          <div className="text-sm font-medium text-white">{template.name}</div>
                          <div className="text-xs text-gray-400">{template.title}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'video-reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Video Submissions</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleExportReport}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      📊 Export Report
                    </Button>
                    <Button variant="ghost" className="text-gray-400 hover:text-white">
                      🔄 Refresh
                    </Button>
                  </div>
                  <div className="text-sm text-gray-400">
                    <span className="text-yellow-400">⏳ {videoSubmissions.filter(s => s.status === 'pending').length} Pending</span> • 
                    <span className="text-green-400 ml-2">✅ {videoSubmissions.filter(s => s.status === 'approved').length} Approved</span>
                  </div>
                  {selectedSubmissions.length > 0 && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleBatchApprove}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        ✅ Approve Selected
                      </Button>
                      <Button
                        onClick={handleBatchReject}
                        variant="ghost"
                        className="text-red-400 hover:text-red-300"
                      >
                        ❌ Reject Selected
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Filter and Batch Actions */}
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="p-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending Only</option>
                      <option value="approved">Approved Only</option>
                      <option value="rejected">Rejected Only</option>
                    </select>
                    <select
                      value={filterChallenge}
                      onChange={(e) => setFilterChallenge(e.target.value)}
                      className="p-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                    >
                      <option value="all">All Challenges</option>
                      <option value="coffee-art">Coffee Art Challenge</option>
                      <option value="breakfast">Breakfast Photo Contest</option>
                      <option value="review">Review Challenge</option>
                    </select>
                    <input
                      type="text"
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      placeholder="Search by user name..."
                      className="p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handleExportReport}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm"
                    >
                      ✅ Export Selected
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 text-sm"
                      disabled={selectedSubmissions.length === 0}
                    >
                      ❌ Reject Selected
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Today's Submissions</p>
                      <p className="text-xl font-bold text-white">8</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">📥</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Avg. Rating</p>
                      <p className="text-xl font-bold text-yellow-400">4.2</p>
                    </div>
                    <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">⭐</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Response Time</p>
                      <p className="text-xl font-bold text-emerald-400">2.4h</p>
                    </div>
                    <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">⚡</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Rewards Granted</p>
                      <p className="text-xl font-bold text-purple-400">23</p>
                    </div>
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">🎁</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {videoSubmissions
                  .filter((submission) => {
                    if (filterStatus === 'all') return true;
                    return submission.status === filterStatus;
                  })
                  .filter((submission) => {
                    if (filterChallenge === 'all') return true;
                    return submission.challenge === filterChallenge;
                  })
                  .filter((submission) => {
                    if (!searchUser) return true;
                    return submission.user.toLowerCase().includes(searchUser.toLowerCase());
                  })
                  .map((submission) => (
                    <div key={submission.id} className={`bg-gray-800 rounded-xl border transition-colors ${
                      submission.status === 'approved' ? 'border-green-600 bg-green-900/10' :
                      submission.status === 'rejected' ? 'border-red-600 bg-red-900/10' :
                      'border-gray-700 hover:border-gray-600'
                    }`}>
                      {/* Streamlined Header */}
                      <div className="p-4">
                        {/* Status Banner for Approved/Rejected */}
                        {submission.status !== 'pending' && (
                          <div className={`mb-3 p-2 rounded-lg text-center ${
                            submission.status === 'approved' 
                              ? 'bg-green-600/20 border border-green-600/50' 
                              : 'bg-red-600/20 border border-red-600/50'
                          }`}>
                            <span className={`font-medium text-sm ${
                              submission.status === 'approved' ? 'text-green-300' : 'text-red-300'
                            }`}>
                              {submission.status === 'approved' ? '✅ SUBMISSION APPROVED' : '❌ SUBMISSION REJECTED'}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={selectedSubmissions.includes(submission.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedSubmissions((prev) => [...prev, submission.id]);
                                } else {
                                  setSelectedSubmissions((prev) => prev.filter((id) => id !== submission.id));
                                }
                              }}
                              className="w-4 h-4 bg-gray-700 border border-gray-600 rounded"
                            />
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl">
                              {submission.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="text-white font-semibold">{submission.user}</h3>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  submission.priority === 'high' ? 'bg-red-900 text-red-300' :
                                  submission.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                                  'bg-gray-700 text-gray-300'
                                }`}>
                                  {submission.priority}
                                </div>
                              </div>
                              <p className="text-gray-400 text-sm">{submission.challenge}</p>
                              <p className="text-gray-500 text-xs">{submission.submittedAt}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              submission.status === 'pending' 
                                ? 'bg-yellow-900 text-yellow-300' 
                                : submission.status === 'approved'
                                ? 'bg-green-900 text-green-300'
                                : 'bg-red-900 text-red-300'
                            }`}>
                              {submission.status === 'pending' ? '⏳ Pending' : 
                               submission.status === 'approved' ? '✅ Approved' : 
                               '❌ Rejected'}
                            </span>
                            {submission.status === 'approved' && (
                              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium border border-green-300">
                                ✅ APPROVED
                              </div>
                            )}
                            {submission.status === 'rejected' && (
                              <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium border border-red-300">
                                ❌ REJECTED
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Compact Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                          {/* Video Preview - Smaller */}
                          <div className="bg-gray-700 rounded-lg p-3 text-center border border-gray-600">
                            <div className="text-xl mb-1">🎬</div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-400 hover:text-blue-300 text-xs"
                              onClick={() => window.open(submission.videoUrl, '_blank')}
                            >
                              ▶️ Play
                            </Button>
                          </div>

                          {/* Description - Truncated */}
                          <div className="lg:col-span-2">
                            <p className="text-gray-300 text-sm line-clamp-2 mb-2">{submission.description}</p>
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-400 text-xs">Rating:</span>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    className={`text-sm ${
                                      star <= (submission.rating || 0) 
                                        ? 'text-yellow-400' 
                                        : 'text-gray-600'
                                    }`}
                                  >
                                    ⭐
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Quick Actions - Compact */}
                          <div className="space-y-2">
                            {submission.status === 'pending' && (
                              <>
                                <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-xs">
                                  <option value="">Select reward...</option>
                                  <option value="free-coffee">Free Coffee</option>
                                  <option value="free-dessert">Free Dessert</option>
                                  <option value="discount-20">20% Discount</option>
                                </select>
                                <div className="flex space-x-1">
                                  <Button
                                    size="sm"
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1"
                                    onClick={() => handleApproveSubmission(submission.id)}
                                  >
                                    ✅
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-1 text-red-400 hover:text-red-300 text-xs py-1"
                                    onClick={() => handleRejectSubmission(submission.id)}
                                  >
                                    ❌
                                  </Button>
                                </div>
                              </>
                            )}
                            
                            {submission.reward && (
                              <div className="bg-emerald-900/20 border border-emerald-700 rounded p-2">
                                <p className="text-emerald-300 text-xs">
                                  🎁 {submission.reward}
                                </p>
                              </div>
                            )}

                            {submission.status === 'approved' && (
                              <div className="bg-green-900/20 border border-green-700 rounded p-3 text-center">
                                <div className="text-green-300 font-medium text-sm mb-1">
                                  ✅ APPROVED
                                </div>
                                <p className="text-green-400 text-xs">
                                  This submission has been approved
                                </p>
                                {submission.reward && (
                                  <div className="mt-2 bg-emerald-800/30 rounded p-2">
                                    <p className="text-emerald-300 text-xs">
                                      🎁 Reward: {submission.reward}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}

                            {submission.status === 'rejected' && (
                              <div className="bg-red-900/20 border border-red-700 rounded p-3 text-center">
                                <div className="text-red-300 font-medium text-sm mb-1">
                                  ❌ REJECTED
                                </div>
                                <p className="text-red-400 text-xs">
                                  This submission has been rejected
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Rewards Management</h2>
                <Button
                  onClick={() => setShowAddReward(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <span>➕</span>
                  Add New Reward
                </Button>
              </div>

              {/* Rewards Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Rewards</p>
                      <p className="text-2xl font-bold text-white">24</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">🎁</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Available</p>
                      <p className="text-2xl font-bold text-emerald-400">18</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">✅</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Times Used</p>
                      <p className="text-2xl font-bold text-purple-400">156</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">📊</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Categories</p>
                      <p className="text-2xl font-bold text-orange-400">5</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">🏷️</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rewards List */}
              <div className="grid gap-4">
                {rewards.map((reward) => (
                  <div key={reward.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                            <span className="text-white">
                              {reward.category === 'Food' ? '🍽️' : 
                               reward.category === 'Discount' ? '💰' : 
                               reward.category === 'Merchandise' ? '🎁' : '⭐'}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{reward.name}</h3>
                            <p className="text-gray-400 text-sm">{reward.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                reward.category === 'Food' ? 'bg-blue-900 text-blue-300' :
                                reward.category === 'Discount' ? 'bg-green-900 text-green-300' :
                                reward.category === 'Merchandise' ? 'bg-purple-900 text-purple-300' :
                                'bg-orange-900 text-orange-300'
                              }`}>
                                {reward.category}
                              </span>
                              <span className="text-emerald-400 font-semibold">{reward.value}</span>
                              <span className="text-gray-500 text-sm">Used {reward.usage} times</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className={`w-3 h-3 rounded-full ${reward.available ? 'bg-green-400' : 'bg-red-400'}`}></div>
                          <p className="text-xs text-gray-400 mt-1">
                            {reward.available ? 'Available' : 'Disabled'}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            ✏️
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            📊
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                            🗑️
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {showAddReward && (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-6">Create New Reward</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">Reward Name *</label>
                      <input
                        type="text"
                        value={newReward.name}
                        onChange={(e) => setNewReward(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter a descriptive reward name"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">Description *</label>
                      <textarea
                        value={newReward.description}
                        onChange={(e) => setNewReward(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the reward..."
                        rows={4}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">Category</label>
                      <select
                        value={newReward.category}
                        onChange={(e) => setNewReward(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="Food">🍽️ Food</option>
                        <option value="Discount">💰 Discount</option>
                        <option value="Merchandise">🎁 Merchandise</option>
                        <option value="Experience">⭐ Experience</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">Value</label>
                      <input
                        type="text"
                        value={newReward.value}
                        onChange={(e) => setNewReward(prev => ({ ...prev, value: e.target.value }))}
                        placeholder="Enter the reward value"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">Available</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newReward.available}
                          onChange={(e) => setNewReward(prev => ({ ...prev, available: e.target.checked }))}
                          className="w-4 h-4 bg-gray-700 border border-gray-600 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                        <span className="text-gray-400 text-sm">Make this reward available for challenges</span>
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <Button
                        onClick={handleCreateReward}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        disabled={!newReward.name || !newReward.description}
                      >
                        🚀 Create Reward
                      </Button>
                      <Button
                        onClick={() => setShowAddReward(false)}
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'social-media' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Social Media Tracking</h2>
                <div className="flex space-x-3">
                  <Button variant="ghost" className="text-gray-400 hover:text-white">
                    🔄 Refresh Data
                  </Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    📊 Generate Report
                  </Button>
                </div>
              </div>

              {/* Social Media Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Instagram Mentions</p>
                      <p className="text-2xl font-bold text-pink-400">1,247</p>
                      <p className="text-green-400 text-sm">+12% this week</p>
                    </div>
                    <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">📷</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Facebook Shares</p>
                      <p className="text-2xl font-bold text-blue-400">892</p>
                      <p className="text-green-400 text-sm">+8% this week</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">👥</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">TikTok Views</p>
                      <p className="text-2xl font-bold text-purple-400">15.2K</p>
                      <p className="text-green-400 text-sm">+25% this week</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">🎵</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Reach</p>
                      <p className="text-2xl font-bold text-emerald-400">28.5K</p>
                      <p className="text-green-400 text-sm">+15% this week</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">🌐</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Social Media Activity */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-6">Recent Social Media Activity</h3>
                
                <div className="space-y-4">
                  {[
                    {
                      platform: 'Instagram',
                      user: '@sarah_foodie',
                      action: 'posted a story featuring your latte art',
                      time: '2 hours ago',
                      engagement: '156 views',
                      icon: '📷',
                      color: 'text-pink-400'
                    },
                    {
                      platform: 'Facebook',
                      user: 'Mike Chen',
                      action: 'shared your breakfast photo contest',
                      time: '4 hours ago',
                      engagement: '23 likes, 5 shares',
                      icon: '👥',
                      color: 'text-blue-400'
                    },
                    {
                      platform: 'TikTok',
                      user: '@coffee_lover_emma',
                      action: 'created a video about your coffee challenge',
                      time: '6 hours ago',
                      engagement: '2.1K views, 89 likes',
                      icon: '🎵',
                      color: 'text-purple-400'
                    },
                    {
                      platform: 'Twitter',
                      user: '@alex_reviews',
                      action: 'tweeted a review of your service',
                      time: '1 day ago',
                      engagement: '45 retweets, 78 likes',
                      icon: '🐦',
                      color: 'text-cyan-400'
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-lg">{activity.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${activity.color}`}>{activity.platform}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-white font-medium">{activity.user}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{activity.action}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-gray-500 text-xs">{activity.time}</span>
                          <span className="text-emerald-400 text-xs">{activity.engagement}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        👀 View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hashtag Performance */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-6">Hashtag Performance</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { tag: '#CoffeeArt', uses: 234, reach: '12.5K' },
                    { tag: '#BreakfastGoals', uses: 189, reach: '8.9K' },
                    { tag: '#CoffeeCafe', uses: 156, reach: '7.2K' },
                    { tag: '#FoodieLife', uses: 98, reach: '4.8K' },
                    { tag: '#LocalCafe', uses: 67, reach: '3.1K' },
                    { tag: '#MorningBoost', uses: 45, reach: '2.3K' }
                  ].map((hashtag, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-emerald-400 font-medium">{hashtag.tag}</span>
                        <span className="text-gray-400 text-sm">{hashtag.uses} uses</span>
                      </div>
                      <div className="text-white font-semibold">{hashtag.reach} reach</div>
                      <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full" 
                          style={{ width: `${Math.min((hashtag.uses / 234) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Analytics Dashboard</h2>
                <div className="flex space-x-3">
                  <select className="p-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm">
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="1y">Last Year</option>
                  </select>
                  <Button variant="ghost" className="text-gray-400 hover:text-white">
                    📊 Export Report
                  </Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    📈 Generate Insights
                  </Button>
                </div>
              </div>

              {/* Key Performance Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">📈</span>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 text-sm font-medium">+15.2%</p>
                      <p className="text-gray-500 text-xs">vs last month</p>
                    </div>
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium">Total Revenue</h3>
                  <p className="text-2xl font-bold text-white">$24,680</p>
                  <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">👥</span>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 text-sm font-medium">+8.7%</p>
                      <p className="text-gray-500 text-xs">vs last month</p>
                    </div>
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium">Active Users</h3>
                  <p className="text-2xl font-bold text-white">2,847</p>
                  <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">🏆</span>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 text-sm font-medium">+22.1%</p>
                      <p className="text-gray-500 text-xs">vs last month</p>
                    </div>
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium">Challenge Completions</h3>
                  <p className="text-2xl font-bold text-white">1,234</p>
                  <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">⭐</span>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 text-sm font-medium">+5.3%</p>
                      <p className="text-gray-500 text-xs">vs last month</p>
                    </div>
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium">Avg. Rating</h3>
                  <p className="text-2xl font-bold text-white">4.8</p>
                  <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>
              </div>

              {/* Charts and Trends */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Revenue Trend</h3>
                  <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <p className="text-gray-400">Interactive Chart</p>
                      <p className="text-gray-500 text-sm">Revenue growth over time</p>
                      <div className="mt-4 flex justify-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-400 text-sm">This Month</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                          <span className="text-gray-400 text-sm">Last Month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Challenge Performance */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Challenge Performance</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Coffee Art Challenge', completion: 89, participants: 156, color: 'bg-blue-500' },
                      { name: 'Breakfast Photo Contest', completion: 76, participants: 134, color: 'bg-emerald-500' },
                      { name: 'Review Challenge', completion: 92, participants: 98, color: 'bg-purple-500' },
                      { name: 'Social Media Share', completion: 67, participants: 87, color: 'bg-orange-500' }
                    ].map((challenge, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{challenge.name}</span>
                          <div className="text-right">
                            <span className="text-white font-semibold">{challenge.completion}%</span>
                            <p className="text-gray-400 text-xs">{challenge.participants} participants</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className={`${challenge.color} h-2 rounded-full`} style={{ width: `${challenge.completion}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Detailed Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Customer Insights */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Customer Insights</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">New Customers</span>
                      <span className="text-emerald-400 font-semibold">+156 this month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Retention Rate</span>
                      <span className="text-white font-semibold">85.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Avg. Session Time</span>
                      <span className="text-white font-semibold">12m 34s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Repeat Visitors</span>
                      <span className="text-white font-semibold">67.8%</span>
                    </div>
                  </div>
                </div>

                {/* Revenue Breakdown */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Revenue Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Challenge Rewards</span>
                      <span className="text-emerald-400 font-semibold">$8,420</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">New Acquisitions</span>
                      <span className="text-emerald-400 font-semibold">$12,180</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Repeat Business</span>
                      <span className="text-emerald-400 font-semibold">$4,080</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-700 pt-2">
                      <span className="text-white font-medium">Total Revenue</span>
                      <span className="text-emerald-400 font-bold">$24,680</span>
                    </div>
                  </div>
                </div>

                {/* Peak Performance */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Peak Performance</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Best Day</span>
                      <span className="text-white font-semibold">Saturday</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Peak Hours</span>
                      <span className="text-white font-semibold">2-4 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Top Category</span>
                      <span className="text-white font-semibold">Social Media</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Best Challenge</span>
                      <span className="text-white font-semibold">Coffee Art</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actionable Insights */}
              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-blue-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">🔍 AI-Powered Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Opportunity */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">💡</span>
                      </div>
                      <h4 className="text-green-400 font-medium">Opportunity</h4>
                    </div>
                    <p className="text-gray-300 text-sm">Your Coffee Art Challenge has 89% completion rate. Consider creating similar creative challenges to boost engagement.</p>
                  </div>

                  {/* Attention Needed */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">⚠️</span>
                      </div>
                      <h4 className="text-yellow-400 font-medium">Attention Needed</h4>
                    </div>
                    <p className="text-gray-300 text-sm">Social Media Share challenge has lower completion (67%). Consider adjusting rewards or simplifying requirements.</p>
                  </div>

                  {/* Growth Trend */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">📈</span>
                      </div>
                      <h4 className="text-blue-400 font-medium">Growth Trend</h4>
                    </div>
                    <p className="text-gray-300 text-sm">Weekend participation is 40% higher. Schedule premium challenges on Fridays-Sundays for maximum impact.</p>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🎯</span>
                      </div>
                      <h4 className="text-purple-400 font-medium">Recommendation</h4>
                    </div>
                    <p className="text-gray-300 text-sm">Your 2-4 PM peak hours align with afternoon coffee breaks. Launch time-sensitive challenges during this window.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">Business Settings</h2>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Business Name</label>
                    <input
                      type="text"
                      value={businessUser?.businessName || 'Coffee Cafe'}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Business Type</label>
                    <input
                      type="text"
                      value={businessUser?.businessType || 'Cafe & Restaurant'}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={businessUser?.email || 'demo@business.com'}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      value={businessUser?.phone || '+1 (555) 123-4567'}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

    </div>
  );
};

export default BusinessDashboard;
