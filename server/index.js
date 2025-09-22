const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Data storage paths
const DATA_DIR = path.join(__dirname, 'data');
const BUSINESSES_FILE = path.join(DATA_DIR, 'businesses.json');
const CHALLENGES_FILE = path.join(DATA_DIR, 'challenges.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const USER_CHALLENGES_FILE = path.join(DATA_DIR, 'userChallenges.json');
const PARTICIPANTS_FILE = path.join(DATA_DIR, 'participants.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Persistent storage functions
const loadData = (filePath, defaultValue = {}) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error loading data from ${filePath}:`, error);
  }
  return defaultValue;
};

const saveData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error saving data to ${filePath}:`, error);
  }
};

// Convert Map to Object for JSON storage
const mapToObject = (map) => {
  const obj = {};
  for (let [key, value] of map) {
    obj[key] = value;
  }
  return obj;
};

// Convert Object to Map
const objectToMap = (obj) => {
  const map = new Map();
  for (let key in obj) {
    map.set(key, obj[key]);
  }
  return map;
};

// Load persistent data
let businessesData = loadData(BUSINESSES_FILE, {});
let challengesData = loadData(CHALLENGES_FILE, {});
let usersData = loadData(USERS_FILE, {});
let userChallengesData = loadData(USER_CHALLENGES_FILE, {});
let participantsData = loadData(PARTICIPANTS_FILE, {});
let submissionsData = loadData(SUBMISSIONS_FILE, {});

// In-memory storage (replace with database in production)
const businesses = objectToMap(businessesData);
const challenges = objectToMap(challengesData);
const participants = objectToMap(participantsData);
const users = objectToMap(usersData);
const userChallenges = objectToMap(userChallengesData);
const submissions = objectToMap(submissionsData);

// Save data to files
const persistData = () => {
  saveData(BUSINESSES_FILE, mapToObject(businesses));
  saveData(CHALLENGES_FILE, mapToObject(challenges));
  saveData(USERS_FILE, mapToObject(users));
  saveData(USER_CHALLENGES_FILE, mapToObject(userChallenges));
  saveData(PARTICIPANTS_FILE, mapToObject(participants));
  saveData(SUBMISSIONS_FILE, mapToObject(submissions));
};

// Mock data initialization
const initializeMockData = () => {
  // Only initialize if no data exists (first run)
  if (businesses.size === 0) {
    console.log('Initializing mock data for first run...');
    
    // Create demo business
    const demoBusinessId = 'demo-business-1';
    const hashedPassword = bcrypt.hashSync('password123', 10);
    
    businesses.set(demoBusinessId, {
      id: demoBusinessId,
      email: 'demo@business.com',
      password: hashedPassword,
      businessName: 'Demo Cafe',
      businessType: 'cafe',
      address: '123 Main St, Demo City',
      phone: '+1234567890',
      createdAt: new Date().toISOString(),
      isVerified: true,
    });

    // Create demo challenges only if none exist
    if (challenges.size === 0) {
      const challenge1 = {
        id: 'challenge-1',
        businessId: demoBusinessId,
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const challenge2 = {
        id: 'challenge-2',
        businessId: demoBusinessId,
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      challenges.set(challenge1.id, challenge1);
      challenges.set(challenge2.id, challenge2);
    }

    // Create demo users only if none exist
    if (users.size === 0) {
      const demoUser1 = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        password: bcrypt.hashSync('password123', 10),
        username: 'johndoe',
        avatar: '👨‍💻',
        points: 2450,
        level: 15,
        completedChallenges: 8,
        joinDate: new Date().toISOString(),
        achievements: ['Early Adopter', 'Video Creator', 'Community Helper'],
        rank: 15,
        isActive: true,
      };

      const demoUser2 = {
        id: 'user-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: bcrypt.hashSync('password123', 10),
        username: 'janesmith',
        avatar: '👩‍🎨',
        points: 3200,
        level: 22,
        completedChallenges: 12,
        joinDate: new Date().toISOString(),
        achievements: ['Top Performer', 'Creative Genius', 'Social Star'],
        rank: 8,
        isActive: true,
      };

      users.set(demoUser1.id, demoUser1);
      users.set(demoUser2.id, demoUser2);
    }

    // Create user challenge participations only if none exist
    if (userChallenges.size === 0) {
      userChallenges.set('user-1-challenge-1', {
        id: 'user-1-challenge-1',
        userId: 'user-1',
        challengeId: 'challenge-1',
        status: 'completed',
        submissionDate: new Date().toISOString(),
        pointsEarned: 100,
        rating: 4.5,
      });

      userChallenges.set('user-2-challenge-2', {
        id: 'user-2-challenge-2',
        userId: 'user-2',
        challengeId: 'challenge-2',
        status: 'in_progress',
        submissionDate: null,
        pointsEarned: 0,
        rating: null,
      });
    }

    // Save initial data
    persistData();
    console.log('Mock data initialized and persisted.');
  } else {
    console.log('Existing data found. Skipping mock data initialization.');
    console.log(`Loaded: ${businesses.size} businesses, ${challenges.size} challenges, ${users.size} users`);
  }
};

// Initialize mock data
initializeMockData();

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      businessName: user.businessName 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Business API is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Reel-to-Reality Business API',
    endpoints: {
      auth: {
        register: 'POST /api/business/auth/register',
        login: 'POST /api/business/auth/login',
        logout: 'POST /api/business/auth/logout'
      },
      challenges: {
        list: 'GET /api/business/challenges',
        get: 'GET /api/business/challenges/:id',
        create: 'POST /api/business/challenges',
        update: 'PUT /api/business/challenges/:id',
        delete: 'DELETE /api/business/challenges/:id'
      },
      analytics: {
        stats: 'GET /api/business/analytics/stats'
      },
      profile: {
        get: 'GET /api/business/profile'
      }
    }
  });
});

// Authentication Routes
app.post('/api/business/auth/register', async (req, res) => {
  try {
    const { email, password, businessName, businessType, address, phone } = req.body;

    // Check if business already exists
    const existingBusiness = Array.from(businesses.values()).find(b => b.email === email);
    if (existingBusiness) {
      return res.status(400).json({ 
        success: false, 
        message: 'Business with this email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new business
    const businessId = uuidv4();
    const newBusiness = {
      id: businessId,
      email,
      password: hashedPassword,
      businessName,
      businessType,
      address,
      phone,
      createdAt: new Date().toISOString(),
      isVerified: false,
    };

    businesses.set(businessId, newBusiness);

    // Generate token
    const token = generateToken(newBusiness);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newBusiness;

    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
      message: 'Business account created successfully',
    });

    persistData();
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

app.post('/api/business/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find business by email
    const business = Array.from(businesses.values()).find(b => b.email === email);
    if (!business) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, business.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken(business);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = business;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

app.post('/api/business/auth/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// Challenge Routes
app.get('/api/business/challenges', authenticateToken, (req, res) => {
  try {
    const businessId = req.user.id;
    const { status, category, difficulty, page = 1, limit = 10 } = req.query;

    // Filter challenges by business
    let businessChallenges = Array.from(challenges.values()).filter(
      c => c.businessId === businessId
    );

    console.log(`📋 Fetching challenges for business ${businessId}: Found ${businessChallenges.length} total challenges`);

    // Apply filters
    if (status) {
      businessChallenges = businessChallenges.filter(c => c.status === status);
      console.log(`🔍 Filtered by status '${status}': ${businessChallenges.length} challenges`);
    }
    if (category) {
      businessChallenges = businessChallenges.filter(c => c.category === category);
    }
    if (difficulty) {
      businessChallenges = businessChallenges.filter(c => c.difficulty === difficulty);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedChallenges = businessChallenges.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        challenges: paginatedChallenges,
        total: businessChallenges.length,
        page: parseInt(page),
      },
    });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

app.get('/api/business/challenges/:id', authenticateToken, (req, res) => {
  try {
    const challengeId = req.params.id;
    const businessId = req.user.id;

    const challenge = challenges.get(challengeId);
    if (!challenge || challenge.businessId !== businessId) {
      return res.status(404).json({ 
        success: false, 
        message: 'Challenge not found' 
      });
    }

    res.json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

app.post('/api/business/challenges', authenticateToken, (req, res) => {
  try {
    const businessId = req.user.id;
    const {
      title,
      description,
      points,
      difficulty,
      category,
      startDate,
      endDate,
      rewards,
      requirements,
    } = req.body;

    const challengeId = uuidv4();
    const newChallenge = {
      id: challengeId,
      businessId,
      title,
      description,
      points: parseInt(points),
      difficulty,
      category,
      status: 'active', // Make new challenges active by default so they appear in user dashboard
      participants: 0,
      completions: 0,
      startDate,
      endDate,
      rewards: rewards || [],
      requirements: requirements || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    challenges.set(challengeId, newChallenge);
    
    // Immediately persist data
    persistData();
    
    console.log(`✅ New challenge created: "${title}" (ID: ${challengeId}) - Status: active`);

    res.status(201).json({
      success: true,
      data: newChallenge,
      message: 'Challenge created successfully',
    });
  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

app.put('/api/business/challenges/:id', authenticateToken, (req, res) => {
  try {
    const challengeId = req.params.id;
    const businessId = req.user.id;

    const challenge = challenges.get(challengeId);
    if (!challenge || challenge.businessId !== businessId) {
      return res.status(404).json({ 
        success: false, 
        message: 'Challenge not found' 
      });
    }

    // Update challenge
    const updatedChallenge = {
      ...challenge,
      ...req.body,
      id: challengeId,
      businessId,
      updatedAt: new Date().toISOString(),
    };

    challenges.set(challengeId, updatedChallenge);

    res.json({
      success: true,
      data: updatedChallenge,
      message: 'Challenge updated successfully',
    });

    persistData();
  } catch (error) {
    console.error('Update challenge error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

app.delete('/api/business/challenges/:id', authenticateToken, (req, res) => {
  try {
    const challengeId = req.params.id;
    const businessId = req.user.id;

    const challenge = challenges.get(challengeId);
    if (!challenge || challenge.businessId !== businessId) {
      return res.status(404).json({ 
        success: false, 
        message: 'Challenge not found' 
      });
    }

    challenges.delete(challengeId);

    res.json({
      success: true,
      message: 'Challenge deleted successfully',
    });

    persistData();
  } catch (error) {
    console.error('Delete challenge error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Public endpoint for user dashboard to get all active challenges
app.get('/api/challenges/public', (req, res) => {
  try {
    // Get all active challenges from all businesses
    const allChallenges = Array.from(challenges.values()).filter(
      c => c.status === 'active'
    );

    console.log(`🌐 Public challenges request: Found ${allChallenges.length} active challenges`);

    res.json({
      success: true,
      data: {
        challenges: allChallenges,
        total: allChallenges.length,
      },
    });
  } catch (error) {
    console.error('Get public challenges error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Analytics Routes
app.get('/api/business/analytics/stats', authenticateToken, (req, res) => {
  try {
    const businessId = req.user.id;
    const businessChallenges = Array.from(challenges.values()).filter(
      c => c.businessId === businessId
    );

    const stats = {
      totalChallenges: businessChallenges.length,
      activeChallenges: businessChallenges.filter(c => c.status === 'active').length,
      draftChallenges: businessChallenges.filter(c => c.status === 'draft').length,
      completedChallenges: businessChallenges.filter(c => c.status === 'completed').length,
      totalParticipants: businessChallenges.reduce((sum, c) => sum + c.participants, 0),
      totalCompletions: businessChallenges.reduce((sum, c) => sum + c.completions, 0),
      averageCompletionRate: businessChallenges.length > 0 
        ? businessChallenges.reduce((sum, c) => sum + (c.participants > 0 ? (c.completions / c.participants) * 100 : 0), 0) / businessChallenges.length
        : 0,
      revenue: 15420, // Mock data
      engagement: 78, // Mock data
      topPerformingChallenge: businessChallenges.length > 0 ? businessChallenges[0].title : 'No challenges',
      recentActivity: [
        {
          id: '1',
          type: 'challenge_completed',
          message: 'John Doe completed Coffee Art Challenge',
          timestamp: new Date().toISOString(),
          challengeId: businessChallenges.length > 0 ? businessChallenges[0].id : null,
        },
      ],
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Business Profile Routes
app.get('/api/business/profile', authenticateToken, (req, res) => {
  try {
    const businessId = req.user.id;
    const business = businesses.get(businessId);

    if (!business) {
      return res.status(404).json({ 
        success: false, 
        message: 'Business not found' 
      });
    }

    const { password: _, ...businessWithoutPassword } = business;

    res.json({
      success: true,
      data: businessWithoutPassword,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// User Authentication Routes
app.post('/api/user/auth/register', async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    // Check if user already exists
    const existingUser = Array.from(users.values()).find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: existingUser.email === email ? 'User with this email already exists' : 'Username already taken'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const userId = uuidv4();
    const newUser = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      username: username || email.split('@')[0],
      avatar: '👤',
      points: 0,
      level: 1,
      completedChallenges: 0,
      joinDate: new Date().toISOString(),
      achievements: ['New Member'],
      rank: 999,
      isActive: true,
    };

    users.set(userId, newUser);

    // Generate token
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email, 
        name: newUser.name,
        type: 'user'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
      message: 'User account created successfully',
    });

    persistData();
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

app.post('/api/user/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email or username
    const user = Array.from(users.values()).find(u => u.email === email || u.username === email);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email/username or password' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email/username or password' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        type: 'user'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

app.post('/api/user/auth/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// User Profile Routes
app.get('/api/user/profile', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const user = users.get(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

app.put('/api/user/profile', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const user = users.get(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Update user profile (excluding sensitive fields)
    const allowedUpdates = ['name', 'username', 'avatar'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    users.set(userId, updatedUser);

    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      data: userWithoutPassword,
      message: 'Profile updated successfully',
    });

    persistData();
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// User Stats Routes
app.get('/api/user/stats', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const user = users.get(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Calculate user stats
    const userChallengesList = Array.from(userChallenges.values()).filter(uc => uc.userId === userId);
    const completedChallenges = userChallengesList.filter(uc => uc.status === 'completed');
    const totalPointsEarned = completedChallenges.reduce((sum, uc) => sum + (uc.pointsEarned || 0), 0);

    const stats = {
      points: user.points,
      level: user.level,
      completedChallenges: user.completedChallenges,
      rank: user.rank,
      achievements: user.achievements || [],
      totalChallengesJoined: userChallengesList.length,
      averageRating: completedChallenges.length > 0 
        ? completedChallenges.reduce((sum, uc) => sum + (uc.rating || 0), 0) / completedChallenges.length
        : 0,
      joinDate: user.joinDate,
      recentActivity: [
        {
          id: '1',
          type: 'challenge_completed',
          message: 'Completed Coffee Art Challenge',
          timestamp: new Date().toISOString(),
          points: 100,
        },
        {
          id: '2',
          type: 'level_up',
          message: `Reached Level ${user.level}`,
          timestamp: new Date().toISOString(),
          points: 0,
        },
      ],
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// User Challenges Routes
app.get('/api/user/challenges', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const { status, category, difficulty, page = 1, limit = 10 } = req.query;

    // Get all active challenges from businesses
    let availableChallenges = Array.from(challenges.values()).filter(c => c.status === 'active');

    // Apply filters
    if (category) {
      availableChallenges = availableChallenges.filter(c => c.category === category);
    }
    if (difficulty) {
      availableChallenges = availableChallenges.filter(c => c.difficulty === difficulty);
    }

    // Get user's challenge participations
    const userParticipations = Array.from(userChallenges.values()).filter(uc => uc.userId === userId);
    
    // Add participation status to challenges
    const challengesWithStatus = availableChallenges.map(challenge => {
      const participation = userParticipations.find(uc => uc.challengeId === challenge.id);
      return {
        ...challenge,
        userStatus: participation ? participation.status : 'not_joined',
        userSubmissionDate: participation ? participation.submissionDate : null,
        userPointsEarned: participation ? participation.pointsEarned : 0,
        userRating: participation ? participation.rating : null,
      };
    });

    // Filter by status if requested
    let filteredChallenges = challengesWithStatus;
    if (status) {
      filteredChallenges = challengesWithStatus.filter(c => c.userStatus === status);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedChallenges = filteredChallenges.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        challenges: paginatedChallenges,
        total: filteredChallenges.length,
        page: parseInt(page),
        userStats: {
          totalJoined: userParticipations.length,
          completed: userParticipations.filter(uc => uc.status === 'completed').length,
          inProgress: userParticipations.filter(uc => uc.status === 'in_progress').length,
        }
      },
    });
  } catch (error) {
    console.error('Get user challenges error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

app.post('/api/user/challenges/:id/join', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const challengeId = req.params.id;

    // Check if challenge exists
    const challenge = challenges.get(challengeId);
    if (!challenge) {
      return res.status(404).json({ 
        success: false, 
        message: 'Challenge not found' 
      });
    }

    // Check if user already joined
    const existingParticipation = Array.from(userChallenges.values()).find(
      uc => uc.userId === userId && uc.challengeId === challengeId
    );

    if (existingParticipation) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already joined this challenge' 
      });
    }

    // Create participation record
    const participationId = uuidv4();
    const participation = {
      id: participationId,
      userId,
      challengeId,
      status: 'in_progress',
      joinDate: new Date().toISOString(),
      submissionDate: null,
      pointsEarned: 0,
      rating: null,
    };

    userChallenges.set(participationId, participation);

    // Update challenge participant count
    challenge.participants += 1;
    challenges.set(challengeId, challenge);

    res.json({
      success: true,
      data: participation,
      message: 'Successfully joined the challenge',
    });

    persistData();
  } catch (error) {
    console.error('Join challenge error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

app.post('/api/user/challenges/:id/submit', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const challengeId = req.params.id;
    const { submissionData, videoUrl, description } = req.body;

    // Check if user has joined the challenge
    const participation = Array.from(userChallenges.values()).find(
      uc => uc.userId === userId && uc.challengeId === challengeId
    );

    if (!participation) {
      return res.status(400).json({ 
        success: false, 
        message: 'You must join the challenge first' 
      });
    }

    if (participation.status === 'completed') {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already completed this challenge' 
      });
    }

    // Get challenge details
    const challenge = challenges.get(challengeId);
    if (!challenge) {
      return res.status(404).json({ 
        success: false, 
        message: 'Challenge not found' 
      });
    }

    // Update participation
    const updatedParticipation = {
      ...participation,
      status: 'completed',
      submissionDate: new Date().toISOString(),
      pointsEarned: challenge.points,
      submissionData,
      videoUrl,
      description,
    };

    userChallenges.set(participation.id, updatedParticipation);

    // Update user points and stats
    const user = users.get(userId);
    if (user) {
      user.points += challenge.points;
      user.completedChallenges += 1;
      user.level = Math.floor(user.points / 200) + 1; // Level up every 200 points
      users.set(userId, user);
    }

    // Update challenge completion count
    challenge.completions += 1;
    challenges.set(challengeId, challenge);

    res.json({
      success: true,
      data: {
        participation: updatedParticipation,
        pointsEarned: challenge.points,
        newLevel: user?.level,
        newTotalPoints: user?.points,
      },
      message: 'Challenge completed successfully!',
    });

    persistData();
  } catch (error) {
    console.error('Submit challenge error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Business API server running on port ${PORT}`);
  console.log(`📊 Data persistence enabled - challenges will be saved to disk`);
  console.log(`🔗 API endpoints available at http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Saving data and shutting down gracefully...`);
  
  // Save all data before shutdown
  persistData();
  console.log('✅ Data saved successfully');
  
  server.close(() => {
    console.log('🛑 Server closed');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.log('⚠️  Forcing shutdown');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Auto-save data every 5 minutes
setInterval(() => {
  persistData();
  console.log('📁 Auto-saved data to disk');
}, 5 * 60 * 1000);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  persistData();
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  persistData();
});

module.exports = app;
