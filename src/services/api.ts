// Mock API service for Reel-to-Reality Challenge Platform
// This provides a complete backend simulation for the web app

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatar?: string | null;
  points: number;
  level: number;
  completedChallenges: number;
  joinDate: Date;
  achievements: string[];
  rank?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit?: number;
  participants: number;
  completionRate: number;
  featured?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  level: number;
  rank: number;
  avatar?: string;
  completedChallenges: number;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// API Configuration
const API_BASE_URL = 'http://localhost:3001';

// API Service for both User and Business authentication
export class APIService {
  private static instance: APIService;
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  // Generic API call method
  private async apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken') || localStorage.getItem('businessAuthToken');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // User Authentication
  async userLogin(email: string, password: string) {
    try {
      const response = await this.apiCall<any>('/api/user/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('authToken', response.data.token);
      }

      return response;
    } catch (error) {
      console.error('User login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unable to connect to server. Please ensure the backend is running on port 3001.'
      };
    }
  }

  async userRegister(name: string, email: string, password: string) {
    try {
      const response = await this.apiCall<any>('/api/user/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('authToken', response.data.token);
      }

      return response;
    } catch (error) {
      console.error('User registration error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unable to connect to server. Please ensure the backend is running on port 3001.'
      };
    }
  }

  // Business Authentication - Connect to real backend
  async businessLogin(email: string, password: string) {
    try {
      const response = await this.apiCall<any>('/api/business/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.success) {
        localStorage.setItem('businessUser', JSON.stringify(response.data.user));
        localStorage.setItem('businessAuthToken', response.data.token);
      }

      return response;
    } catch (error) {
      console.error('Business login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unable to connect to server. Please ensure the backend is running on port 3001.'
      };
    }
  }

  async businessRegister(businessData: any) {
    try {
      const response = await this.apiCall<any>('/api/business/auth/register', {
        method: 'POST',
        body: JSON.stringify(businessData),
      });

      if (response.success) {
        localStorage.setItem('businessUser', JSON.stringify(response.data.user));
        localStorage.setItem('businessAuthToken', response.data.token);
      }

      return response;
    } catch (error) {
      console.error('Business registration error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unable to connect to server. Please ensure the backend is running on port 3001.'
      };
    }
  }

  // Get Business Challenges
  async getBusinessChallenges() {
    try {
      const response = await this.apiCall<any>('/api/business/challenges');
      return response;
    } catch (error) {
      console.error('Get challenges error:', error);
      // Return mock data as fallback
      return {
        success: true,
        data: {
          challenges: [
            {
              id: '1',
              title: 'Coffee Art Challenge',
              description: 'Create the most creative latte art and share it on social media',
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
              title: 'Breakfast Photo Contest',
              description: 'Share your best breakfast photo with our hashtag',
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
            }
          ]
        }
      };
    }
  }

  // Get Business Stats
  async getBusinessStats() {
    try {
      const response = await this.apiCall<any>('/api/business/analytics/stats');
      return response;
    } catch (error) {
      console.error('Get business stats error:', error);
      // Return mock stats as fallback
      return {
        success: true,
        data: {
          totalChallenges: 12,
          activeChallenges: 8,
          draftChallenges: 2,
          completedChallenges: 2,
          totalParticipants: 245,
          totalCompletions: 189,
          averageCompletionRate: 77.1,
          revenue: 15420,
          engagement: 78,
          topPerformingChallenge: 'Coffee Art Challenge'
        }
      };
    }
  }

  // User Challenges
  async getUserChallenges() {
    try {
      const response = await this.apiCall<any>('/api/user/challenges');
      return response;
    } catch (error) {
      console.error('Get user challenges error:', error);
      // Return mock data as fallback
      return {
        success: true,
        data: {
          challenges: [
            {
              id: '1',
              title: 'Creative Video Challenge',
              description: 'Create a 30-second creative video showcasing your talent.',
              points: 250,
              difficulty: 'medium',
              category: 'creativity',
              participants: 1250,
              completionRate: 68,
              userStatus: 'not_joined'
            },
            {
              id: '2',
              title: 'Team Collaboration',
              description: 'Work with 3 other creators on a group project.',
              points: 500,
              difficulty: 'hard',
              category: 'teamwork',
              participants: 890,
              completionRate: 45,
              userStatus: 'not_joined'
            }
          ]
        }
      };
    }
  }

  async getUserStats(userId: string) {
    try {
      const response = await this.apiCall<any>('/api/user/stats');
      return response;
    } catch (error) {
      console.error('Get user stats error:', error);
      // Fallback to localStorage data
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return {
        success: true,
        data: {
          points: user.points || 0,
          level: user.level || 1,
          completedChallenges: user.completedChallenges || 0,
          rank: user.rank || 999,
          achievements: user.achievements || ['New Member'],
          totalChallengesJoined: 0,
          averageRating: 0,
          joinDate: user.joinDate || new Date().toISOString(),
          recentActivity: []
        }
      };
    }
  }

  async updateProfile(userId: string, profileData: any) {
    try {
      const response = await this.apiCall<any>('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      if (response.success) {
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unable to update profile.'
      };
    }
  }

  async joinChallenge(challengeId: string) {
    try {
      const response = await this.apiCall<any>(`/api/user/challenges/${challengeId}/join`, {
        method: 'POST',
      });
      return response;
    } catch (error) {
      console.error('Join challenge error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unable to join challenge.'
      };
    }
  }

  async submitChallenge(challengeId: string, submissionData: any) {
    try {
      const response = await this.apiCall<any>(`/api/user/challenges/${challengeId}/submit`, {
        method: 'POST',
        body: JSON.stringify(submissionData),
      });

      if (response.success) {
        // Update user data in localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (response.data.newTotalPoints) {
          user.points = response.data.newTotalPoints;
          user.level = response.data.newLevel;
          user.completedChallenges = (user.completedChallenges || 0) + 1;
          localStorage.setItem('user', JSON.stringify(user));
        }
      }

      return response;
    } catch (error) {
      console.error('Submit challenge error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unable to submit challenge.'
      };
    }
  }

  // Leaderboard methods
  async getLeaderboard(limit: number = 50) {
    try {
      const response = await this.apiCall<any>(`/api/leaderboard?limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Get leaderboard error:', error);
      // Return mock leaderboard data as fallback
      return {
        success: true,
        data: [
          {
            id: '1',
            name: 'Jessica Martinez',
            points: 5420,
            level: 24,
            rank: 1,
            avatar: null,
            completedChallenges: 18
          },
          {
            id: '2',
            name: 'David Kim',
            points: 4890,
            level: 22,
            rank: 2,
            avatar: null,
            completedChallenges: 16
          },
          {
            id: '3',
            name: 'Rachel Green',
            points: 4350,
            level: 21,
            rank: 3,
            avatar: null,
            completedChallenges: 15
          },
          {
            id: '4',
            name: 'Tom Wilson',
            points: 3980,
            level: 20,
            rank: 4,
            avatar: null,
            completedChallenges: 14
          },
          {
            id: '5',
            name: 'Sophie Brown',
            points: 3650,
            level: 19,
            rank: 5,
            avatar: null,
            completedChallenges: 13
          },
          {
            id: '6',
            name: 'Alex Johnson',
            points: 3200,
            level: 18,
            rank: 6,
            avatar: null,
            completedChallenges: 12
          },
          {
            id: '7',
            name: 'Maria Garcia',
            points: 2950,
            level: 17,
            rank: 7,
            avatar: null,
            completedChallenges: 11
          },
          {
            id: '8',
            name: 'James Chen',
            points: 2700,
            level: 16,
            rank: 8,
            avatar: null,
            completedChallenges: 10
          },
          {
            id: '9',
            name: 'Emma Davis',
            points: 2450,
            level: 15,
            rank: 9,
            avatar: null,
            completedChallenges: 9
          },
          {
            id: '10',
            name: 'Michael Lee',
            points: 2200,
            level: 14,
            rank: 10,
            avatar: null,
            completedChallenges: 8
          }
        ]
      };
    }
  }

  async getUserRank(userId: string) {
    try {
      const response = await this.apiCall<any>(`/api/leaderboard/user/${userId}/rank`);
      return response;
    } catch (error) {
      console.error('Get user rank error:', error);
      // Return mock rank data as fallback
      return {
        success: true,
        data: {
          rank: Math.floor(Math.random() * 100) + 1,
          totalUsers: 1247
        }
      };
    }
  }

  // Logout methods
  userLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  }

  businessLogout() {
    localStorage.removeItem('businessUser');
    localStorage.removeItem('businessAuthToken');
  }
}

// Export singleton instance
export const apiService = APIService.getInstance();

// Legacy exports for compatibility
export const authAPI = {
  login: (email: string, password: string) => apiService.userLogin(email, password),
  register: (name: string, email: string, password: string) => apiService.userRegister(name, email, password),
  logout: () => apiService.userLogout()
};

export const userAPI = {
  getUserStats: (userId: string) => apiService.getUserStats(userId),
  updateProfile: (userId: string, profileData: any) => apiService.updateProfile(userId, profileData),
};

export const challengeAPI = {
  getChallenges: () => apiService.getUserChallenges(), // Alias for getUserChallenges
  getUserChallenges: () => apiService.getUserChallenges(),
  joinChallenge: (challengeId: string) => apiService.joinChallenge(challengeId),
  submitChallenge: (challengeId: string, submissionData: any) => apiService.submitChallenge(challengeId, submissionData)
};

export const leaderboardAPI = {
  getLeaderboard: (limit: number = 50) => apiService.getLeaderboard(limit),
  getUserRank: (userId: string) => apiService.getUserRank(userId)
};

export const businessAPI = {
  login: (email: string, password: string) => apiService.businessLogin(email, password),
  register: (businessData: any) => apiService.businessRegister(businessData),
  getChallenges: () => apiService.getBusinessChallenges(),
  getStats: () => apiService.getBusinessStats(),
  logout: () => apiService.businessLogout()
};
