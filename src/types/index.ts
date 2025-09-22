// Common types for the application
export interface User {
  id: string | number;
  name: string;
  username?: string;
  email?: string;
  password?: string;
  points: number;
  level: number;
  completedChallenges: number;
  avatar?: string | null;
  joinDate: Date;
  achievements: string[];
  friends?: Friend[];
  totalFriends?: number;
}

export interface Friend {
  id: number;
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
  isFriend?: boolean;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit?: number;
}

export interface Notification {
  id: number;
  type: 'welcome' | 'challenge_sent' | 'challenge_completed' | 'level_up';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface SentChallenge {
  id: number;
  challenge: Challenge;
  friend: Friend;
  sentAt: Date;
  status: 'sent' | 'accepted' | 'completed';
}

export interface CompletedChallenge {
  id: number;
  challenge: Challenge;
  proofData: any;
  completedAt: Date;
  pointsEarned: number;
}

export interface Theme {
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    gradient: string[];
  };
  isDark?: boolean;
}

// Component prop types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'hero' | 'reel-primary' | 'glass' | 'challenge';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

export interface ChallengeCardProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  className?: string;
}

export interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData extends LoginFormData {
  name: string;
  confirmPassword?: string;
}

// Route types
export interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Context types
export interface AppContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  challengesList: Challenge[];
  friendsList: Friend[];
  notificationsList: Notification[];
  sentChallenges: SentChallenge[];
  completedChallenges: CompletedChallenge[];
  registeredUsers: User[];
  unreadCount: number;
  signUp: (name: string, username: string, password: string, avatar?: string | null) => Promise<boolean>;
  signIn: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  sendChallenge: (challengeId: number, friendId: number) => boolean;
  completeChallenge: (challengeId: number, proofData: any) => boolean;
  markNotificationAsRead: (notificationId: number) => void;
  markAllNotificationsAsRead: () => void;
  getUnreadNotificationCount: () => number;
  addFriend: (friendData: Partial<Friend>) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: Theme;
}
