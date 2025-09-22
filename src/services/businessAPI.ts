// Business API Service for Reel-to-Reality Business Dashboard

interface BusinessUser {
  id: string;
  email: string;
  businessName: string;
  businessType: string;
  address: string;
  phone: string;
  createdAt: string;
  isVerified: boolean;
}

interface Challenge {
  id: string;
  businessId: string;
  title: string;
  description: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  status: 'active' | 'draft' | 'completed' | 'paused';
  participants: number;
  completions: number;
  startDate: string;
  endDate: string;
  rewards: string[];
  requirements: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface BusinessStats {
  totalChallenges: number;
  activeChallenges: number;
  draftChallenges: number;
  completedChallenges: number;
  totalParticipants: number;
  totalCompletions: number;
  averageCompletionRate: number;
  revenue: number;
  engagement: number;
  topPerformingChallenge: string;
  recentActivity: ActivityLog[];
}

interface ActivityLog {
  id: string;
  type: 'challenge_created' | 'challenge_completed' | 'user_joined' | 'reward_claimed';
  message: string;
  timestamp: string;
  challengeId?: string;
  userId?: string;
}

interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class BusinessAPIService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = 'http://localhost:3001/api/business';
    this.token = localStorage.getItem('businessAuthToken');
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { Authorization: `Bearer ${this.token}` }),
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Authentication Methods
  async login(email: string, password: string): Promise<APIResponse<{ user: BusinessUser; token: string }>> {
    const response = await this.request<{ user: BusinessUser; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      this.token = response.data.token;
      localStorage.setItem('businessAuthToken', response.data.token);
      localStorage.setItem('businessUser', JSON.stringify(response.data.user));
    }

    return response;
  }

  async register(businessData: {
    email: string;
    password: string;
    businessName: string;
    businessType: string;
    address: string;
    phone: string;
  }): Promise<APIResponse<{ user: BusinessUser; token: string }>> {
    const response = await this.request<{ user: BusinessUser; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(businessData),
    });

    if (response.success && response.data) {
      this.token = response.data.token;
      localStorage.setItem('businessAuthToken', response.data.token);
      localStorage.setItem('businessUser', JSON.stringify(response.data.user));
    }

    return response;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
    this.token = null;
    localStorage.removeItem('businessAuthToken');
    localStorage.removeItem('businessUser');
  }

  async refreshToken(): Promise<APIResponse<{ token: string }>> {
    const response = await this.request<{ token: string }>('/auth/refresh', {
      method: 'POST',
    });

    if (response.success && response.data) {
      this.token = response.data.token;
      localStorage.setItem('businessAuthToken', response.data.token);
    }

    return response;
  }

  // Challenge Management Methods
  async getChallenges(filters?: {
    status?: string;
    category?: string;
    difficulty?: string;
    page?: number;
    limit?: number;
  }): Promise<APIResponse<{ challenges: Challenge[]; total: number; page: number }>> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return this.request<{ challenges: Challenge[]; total: number; page: number }>(
      `/challenges?${queryParams.toString()}`
    );
  }

  async getChallenge(id: string): Promise<APIResponse<Challenge>> {
    return this.request<Challenge>(`/challenges/${id}`);
  }

  async createChallenge(challengeData: {
    title: string;
    description: string;
    points: number;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    startDate: string;
    endDate: string;
    rewards: string[];
    requirements?: string[];
    imageUrl?: string;
  }): Promise<APIResponse<Challenge>> {
    return this.request<Challenge>('/challenges', {
      method: 'POST',
      body: JSON.stringify(challengeData),
    });
  }

  async updateChallenge(id: string, challengeData: Partial<Challenge>): Promise<APIResponse<Challenge>> {
    return this.request<Challenge>(`/challenges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(challengeData),
    });
  }

  async deleteChallenge(id: string): Promise<APIResponse<void>> {
    return this.request<void>(`/challenges/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleChallengeStatus(id: string, status: 'active' | 'paused' | 'draft'): Promise<APIResponse<Challenge>> {
    return this.request<Challenge>(`/challenges/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Analytics and Statistics Methods
  async getBusinessStats(period?: '7d' | '30d' | '90d' | '1y'): Promise<APIResponse<BusinessStats>> {
    const queryParams = period ? `?period=${period}` : '';
    return this.request<BusinessStats>(`/analytics/stats${queryParams}`);
  }

  async getChallengeAnalytics(challengeId: string): Promise<APIResponse<{
    participants: number;
    completions: number;
    completionRate: number;
    averageTimeToComplete: number;
    participantDemographics: any;
    dailyStats: any[];
  }>> {
    return this.request(`/analytics/challenges/${challengeId}`);
  }

  async getRevenueAnalytics(period?: '7d' | '30d' | '90d' | '1y'): Promise<APIResponse<{
    totalRevenue: number;
    revenueByChallenge: any[];
    revenueGrowth: number;
    averageRevenuePerUser: number;
  }>> {
    const queryParams = period ? `?period=${period}` : '';
    return this.request(`/analytics/revenue${queryParams}`);
  }

  async getEngagementMetrics(): Promise<APIResponse<{
    totalEngagement: number;
    engagementByChallenge: any[];
    engagementTrends: any[];
    topEngagingContent: any[];
  }>> {
    return this.request('/analytics/engagement');
  }

  // User Management Methods
  async getChallengeParticipants(challengeId: string): Promise<APIResponse<{
    participants: any[];
    total: number;
  }>> {
    return this.request(`/challenges/${challengeId}/participants`);
  }

  async approveChallengeCompletion(challengeId: string, userId: string): Promise<APIResponse<void>> {
    return this.request(`/challenges/${challengeId}/participants/${userId}/approve`, {
      method: 'POST',
    });
  }

  async rejectChallengeCompletion(challengeId: string, userId: string, reason?: string): Promise<APIResponse<void>> {
    return this.request(`/challenges/${challengeId}/participants/${userId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Notification Methods
  async getNotifications(): Promise<APIResponse<{
    notifications: any[];
    unreadCount: number;
  }>> {
    return this.request('/notifications');
  }

  async markNotificationAsRead(notificationId: string): Promise<APIResponse<void>> {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }

  async sendNotificationToParticipants(challengeId: string, message: string): Promise<APIResponse<void>> {
    return this.request(`/challenges/${challengeId}/notify`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Business Profile Methods
  async getBusinessProfile(): Promise<APIResponse<BusinessUser>> {
    return this.request<BusinessUser>('/profile');
  }

  async updateBusinessProfile(profileData: Partial<BusinessUser>): Promise<APIResponse<BusinessUser>> {
    return this.request<BusinessUser>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async uploadBusinessLogo(file: File): Promise<APIResponse<{ logoUrl: string }>> {
    const formData = new FormData();
    formData.append('logo', file);

    return this.request<{ logoUrl: string }>('/profile/logo', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  }

  // Rewards and Points Methods
  async getRewardsSettings(): Promise<APIResponse<{
    pointsPerDollar: number;
    rewardTiers: any[];
    customRewards: any[];
  }>> {
    return this.request('/rewards/settings');
  }

  async updateRewardsSettings(settings: {
    pointsPerDollar?: number;
    rewardTiers?: any[];
    customRewards?: any[];
  }): Promise<APIResponse<void>> {
    return this.request('/rewards/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async getRewardsHistory(): Promise<APIResponse<{
    rewards: any[];
    totalRewardsGiven: number;
    totalPointsAwarded: number;
  }>> {
    return this.request('/rewards/history');
  }

  // Export and Reporting Methods
  async exportChallengeData(challengeId: string, format: 'csv' | 'xlsx'): Promise<APIResponse<{ downloadUrl: string }>> {
    return this.request<{ downloadUrl: string }>(`/export/challenges/${challengeId}?format=${format}`);
  }

  async exportAnalyticsReport(period: string, format: 'pdf' | 'csv'): Promise<APIResponse<{ downloadUrl: string }>> {
    return this.request<{ downloadUrl: string }>(`/export/analytics?period=${period}&format=${format}`);
  }

  // Mock Data Methods (for development/demo)
  async getMockData(): Promise<{
    challenges: Challenge[];
    stats: BusinessStats;
    user: BusinessUser;
  }> {
    // Mock data for development
    const mockUser: BusinessUser = {
      id: '1',
      email: 'demo@business.com',
      businessName: 'Demo Cafe',
      businessType: 'cafe',
      address: '123 Main St, City, State',
      phone: '+1234567890',
      createdAt: '2024-01-01T00:00:00Z',
      isVerified: true,
    };

    const mockChallenges: Challenge[] = [
      {
        id: '1',
        businessId: '1',
        title: 'Coffee Art Challenge',
        description: 'Create the most creative latte art and share it on social media',
        points: 100,
        difficulty: 'medium',
        category: 'Social Media',
        status: 'active',
        participants: 45,
        completions: 32,
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        rewards: ['Free Coffee', '10% Discount'],
        requirements: ['Share on Instagram', 'Use hashtag #CoffeeArt'],
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z',
      },
      {
        id: '2',
        businessId: '1',
        title: 'Breakfast Photo Contest',
        description: 'Share your best breakfast photo with our hashtag',
        points: 75,
        difficulty: 'easy',
        category: 'Photography',
        status: 'active',
        participants: 67,
        completions: 54,
        startDate: '2024-01-10',
        endDate: '2024-01-31',
        rewards: ['Free Breakfast', 'Gift Card'],
        requirements: ['Upload photo', 'Use hashtag #BreakfastGoals'],
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-05T00:00:00Z',
      },
    ];

    const mockStats: BusinessStats = {
      totalChallenges: 12,
      activeChallenges: 8,
      draftChallenges: 2,
      completedChallenges: 2,
      totalParticipants: 245,
      totalCompletions: 189,
      averageCompletionRate: 77.1,
      revenue: 15420,
      engagement: 78,
      topPerformingChallenge: 'Coffee Art Challenge',
      recentActivity: [
        {
          id: '1',
          type: 'challenge_completed',
          message: 'John Doe completed Coffee Art Challenge',
          timestamp: '2024-01-20T10:30:00Z',
          challengeId: '1',
          userId: 'user1',
        },
        {
          id: '2',
          type: 'user_joined',
          message: 'New user joined Breakfast Photo Contest',
          timestamp: '2024-01-20T09:15:00Z',
          challengeId: '2',
          userId: 'user2',
        },
      ],
    };

    return {
      challenges: mockChallenges,
      stats: mockStats,
      user: mockUser,
    };
  }
}

// Export singleton instance
export const businessAPI = new BusinessAPIService();

// Export types for use in components
export type {
  BusinessUser,
  Challenge,
  BusinessStats,
  ActivityLog,
  APIResponse,
};

export default BusinessAPIService;
