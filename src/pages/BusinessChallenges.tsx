import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Trophy, Star, Camera } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useApp } from '../context/AppContext';

const BusinessChallenges: React.FC = () => {
  const navigate = useNavigate();
  const { businessChallengesList, currentUser, submitToBusinessChallenge } = useApp();
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    content: '',
    mediaUrl: '',
    instagramUrl: '',
    hashtags: '',
    submissionType: 'video' as 'video' | 'photo' | 'social_media'
  });

  const handleSubmit = () => {
    if (selectedChallenge && submissionData.content) {
      submitToBusinessChallenge(selectedChallenge.id, {
        ...submissionData,
        hashtags: submissionData.hashtags.split(',').map(tag => tag.trim()).filter(tag => tag)
      });
      
      setShowSubmissionModal(false);
      setSubmissionData({
        content: '',
        mediaUrl: '',
        instagramUrl: '',
        hashtags: '',
        submissionType: 'video'
      });
      
      alert(`🎉 Successfully submitted to "${selectedChallenge.title}"!\n\nYour submission is now pending review. You'll be notified once it's approved and you'll earn ${selectedChallenge.points} points!`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-900';
      case 'medium': return 'text-yellow-400 bg-yellow-900';
      case 'hard': return 'text-red-400 bg-red-900';
      default: return 'text-gray-400 bg-gray-900';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'social media': return '📱';
      case 'photography': return '📸';
      case 'reviews': return '⭐';
      case 'fashion': return '👗';
      case 'fitness': return '💪';
      case 'technology': return '💻';
      default: return '🏆';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Business Challenges</h1>
              <p className="text-gray-400">Discover challenges from local businesses and earn rewards</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Welcome back,</p>
            <p className="font-semibold text-emerald-400">{currentUser?.name}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Available Challenges</p>
                <p className="text-2xl font-bold text-white">{businessChallengesList.filter(c => c.status === 'active').length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Participants</p>
                <p className="text-2xl font-bold text-white">{businessChallengesList.reduce((sum, c) => sum + c.participants, 0)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Potential Points</p>
                <p className="text-2xl font-bold text-white">{businessChallengesList.reduce((sum, c) => sum + c.points, 0)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Your Points</p>
                <p className="text-2xl font-bold text-emerald-400">{currentUser?.points || 0}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessChallengesList.filter(challenge => challenge.status === 'active').map((challenge) => (
            <div key={challenge.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-emerald-500 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getCategoryIcon(challenge.category)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold text-lg">{challenge.points}</p>
                  <p className="text-gray-400 text-xs">points</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">{challenge.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">{challenge.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Business:</span>
                  <span className="text-white font-medium">{challenge.businessName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white">{challenge.businessType}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white flex items-center">
                  <span className="mr-1">📍</span>
                    {challenge.location}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Participants:</span>
                  <span className="text-white">{challenge.participants}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">Rewards:</p>
                <div className="flex flex-wrap gap-1">
                  {challenge.rewards.map((reward, index) => (
                    <span key={index} className="bg-emerald-600 text-white px-2 py-1 rounded-full text-xs">
                      🎁 {reward}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span>Ends: {new Date(challenge.endDate).toLocaleDateString()}</span>
                <span>Success: {challenge.successRate}%</span>
              </div>

              <Button
                onClick={() => {
                  setSelectedChallenge(challenge);
                  setShowSubmissionModal(true);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Participate Now
              </Button>
            </div>
          ))}
        </div>

        {businessChallengesList.filter(c => c.status === 'active').length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-white mb-2">No Active Challenges</h3>
            <p className="text-gray-400">Check back later for new business challenges!</p>
          </div>
        )}
      </div>

      {/* Submission Modal */}
      {showSubmissionModal && selectedChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Submit to Challenge</h2>
              <Button
                variant="ghost"
                onClick={() => setShowSubmissionModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-emerald-400 mb-2">{selectedChallenge.title}</h3>
              <p className="text-gray-300 text-sm">{selectedChallenge.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <span className="text-emerald-400 font-semibold">{selectedChallenge.points} points</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">{selectedChallenge.businessName}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Submission Type</label>
                <select
                  value={submissionData.submissionType}
                  onChange={(e) => setSubmissionData(prev => ({ ...prev, submissionType: e.target.value as any }))}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="video">📹 Video</option>
                  <option value="photo">📸 Photo</option>
                  <option value="social_media">📱 Social Media Post</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Description *</label>
                <textarea
                  value={submissionData.content}
                  onChange={(e) => setSubmissionData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Describe your submission..."
                  rows={3}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
              </div>

              {submissionData.submissionType === 'social_media' && (
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Instagram URL</label>
                  <input
                    type="url"
                    value={submissionData.instagramUrl}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, instagramUrl: e.target.value }))}
                    placeholder="https://www.instagram.com/p/..."
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Media URL (Optional)</label>
                <input
                  type="url"
                  value={submissionData.mediaUrl}
                  onChange={(e) => setSubmissionData(prev => ({ ...prev, mediaUrl: e.target.value }))}
                  placeholder="Link to your video/photo..."
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Hashtags (Optional)</label>
                <input
                  type="text"
                  value={submissionData.hashtags}
                  onChange={(e) => setSubmissionData(prev => ({ ...prev, hashtags: e.target.value }))}
                  placeholder="#challenge, #business, #creative"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <Button
                variant="ghost"
                onClick={() => setShowSubmissionModal(false)}
                className="flex-1 text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!submissionData.content}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-gray-600"
              >
                <span className="mr-2">📤</span>
                Submit Challenge
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessChallenges;
