import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import './index.css';

// Lazy load components for better performance
const Welcome = React.lazy(() => import('./pages/Welcome'));
const Login = React.lazy(() => import('./pages/Login'));
const BusinessAuth = React.lazy(() => import('./pages/BusinessAuth'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const BusinessDashboard = React.lazy(() => import('./pages/BusinessDashboard'));
const BusinessChallenges = React.lazy(() => import('./pages/BusinessChallenges'));

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    color: '#f1f5f9',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* Animated background particles */}
    <div style={{
      position: 'absolute',
      top: '20%',
      left: '20%',
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
      borderRadius: '50%',
      opacity: 0.15,
      animation: 'float 3s ease-in-out infinite'
    }}></div>
    
    <div style={{
      position: 'absolute',
      top: '70%',
      right: '25%',
      width: '120px',
      height: '120px',
      background: 'linear-gradient(135deg, #10b981, #059669)',
      borderRadius: '50%',
      opacity: 0.1,
      animation: 'float 4s ease-in-out infinite reverse'
    }}></div>

    <div style={{ 
      textAlign: 'center',
      animation: 'fadeInScale 1s ease-out forwards'
    }}>
      <div style={{ 
        fontSize: '4rem', 
        marginBottom: '2rem',
        animation: 'bounce 2s infinite',
        filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))'
      }}>🎬</div>
      
      <h1 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '1rem',
        background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: 'bold',
        animation: 'glow 2s ease-in-out infinite alternate'
      }}>
        Loading Reel to Reality...
      </h1>
      
      <div style={{
        width: '300px',
        height: '6px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '3px',
        margin: '2rem auto',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, #3b82f6, #a855f7, #10b981)',
          borderRadius: '3px',
          animation: 'loadingBar 2s infinite ease-in-out',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
        }}></div>
      </div>
      
      <p style={{ 
        fontSize: '1.2rem', 
        color: '#94a3b8',
        animation: 'pulse 2s infinite ease-in-out'
      }}>
        Preparing your social challenge experience...
      </p>
    </div>

    {/* Add enhanced CSS animations */}
    <style>{`
      @keyframes fadeInScale {
        from { 
          opacity: 0; 
          transform: scale(0.8) translateY(20px); 
        }
        to { 
          opacity: 1; 
          transform: scale(1) translateY(0); 
        }
      }
      
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-20px);
        }
        60% {
          transform: translateY(-10px);
        }
      }
      
      @keyframes glow {
        from {
          text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }
        to {
          text-shadow: 0 0 30px rgba(168, 85, 247, 0.8);
        }
      }
      
      @keyframes loadingBar {
        0% {
          transform: translateX(-100%);
        }
        50% {
          transform: translateX(0%);
        }
        100% {
          transform: translateX(100%);
        }
      }
      
      @keyframes float {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-20px) rotate(180deg);
        }
      }
      
      @keyframes pulse {
        0%, 100% {
          opacity: 0.7;
        }
        50% {
          opacity: 1;
        }
      }
    `}</style>
  </div>
);

// Home component with system status
const Home: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<string>('Checking...');
  const [frontendStatus, setFrontendStatus] = useState<string>('✅ Running');
  const [systemHealth, setSystemHealth] = useState<'healthy' | 'warning' | 'error'>('healthy');
  const [apiEndpoints, setApiEndpoints] = useState<any>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBusinesses: 0,
    activeChallenges: 0,
    completedChallenges: 0
  });
  
  useEffect(() => {
    // Test backend connection and get system info
    const checkBackend = async () => {
      try {
        const apiBase = window.location.port === '8081' ? 'http://localhost:3001' : '';
        const response = await fetch(`${apiBase}/api/health`);
        if (response.ok) {
          const data = await response.json();
          setBackendStatus('✅ Connected');
          setApiEndpoints(data.endpoints);
          setSystemHealth('healthy');
          
          // Get system stats
          try {
            const statsResponse = await fetch(`${apiBase}/api/business/analytics/stats`);
            if (statsResponse.ok) {
              const statsData = await statsResponse.json();
              setStats(prev => ({
                ...prev,
                activeChallenges: statsData.data?.activeChallenges || 0,
                completedChallenges: statsData.data?.completedChallenges || 0
              }));
            }
          } catch (error) {
            console.log('Stats not available');
          }
        } else {
          setBackendStatus('❌ Error');
          setSystemHealth('error');
        }
      } catch (error) {
        setBackendStatus('❌ Offline');
        setSystemHealth('error');
      }
    };
    
    checkBackend();
    // Check every 30 seconds
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: '#f1f5f9',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Enhanced animated background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '100px',
        height: '100px',
        background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
        borderRadius: '50%',
        opacity: 0.1,
        animation: 'pulse 4s infinite ease-in-out'
      }}></div>
      
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '15%',
        width: '150px',
        height: '150px',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        borderRadius: '50%',
        opacity: 0.1,
        animation: 'pulse 6s infinite ease-in-out'
      }}></div>

      <div style={{
        position: 'absolute',
        top: '30%',
        right: '5%',
        width: '80px',
        height: '80px',
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        borderRadius: '50%',
        opacity: 0.08,
        animation: 'float 5s infinite ease-in-out'
      }}></div>

      <div style={{ 
        textAlign: 'center', 
        maxWidth: '900px',
        animation: 'fadeIn 1s ease-out forwards',
        zIndex: 1,
        width: '100%'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '1rem',
          animation: 'bounceIn 1.2s ease-out forwards'
        }}>
          🎬
        </div>
        
        <h1 style={{ 
          fontSize: '3.5rem', 
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 'bold',
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          animation: 'slideUp 1s ease-out 0.3s forwards',
          opacity: 0
        }}>
          Reel to Reality
        </h1>
        
        <p style={{ 
          fontSize: '1.4rem', 
          marginBottom: '3rem', 
          color: '#94a3b8',
          animation: 'slideUp 1s ease-out 0.6s forwards',
          opacity: 0
        }}>
          Social Challenge Web Platform
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            to="/login"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
              color: 'white',
              border: 'none',
              padding: '1.5rem 2rem',
              borderRadius: '1rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
              position: 'relative',
              overflow: 'hidden',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
            }}
          >
            <span style={{ fontSize: '2rem' }}>👤</span>
            <span style={{ position: 'relative', zIndex: 1 }}>User Login</span>
            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Access challenges & rewards</span>
          </Link>
          
          <Link
            to="/business-auth"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              padding: '1.5rem 2rem',
              borderRadius: '1rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
              position: 'relative',
              overflow: 'hidden',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
            }}
          >
            <span style={{ fontSize: '2rem' }}>🏢</span>
            <span style={{ position: 'relative', zIndex: 1 }}>Business Dashboard</span>
            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Manage challenges & analytics</span>
          </Link>
        </div>

        {/* Recent Activity Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
          animation: 'slideUp 1s ease-out 0.8s forwards',
          opacity: 0
        }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '1rem',
            padding: '1.5rem',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>12</div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Active Challenges</div>
          </div>

          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '1rem',
            padding: '1.5rem',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>2.4K</div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Total Rewards</div>
          </div>

          <div style={{
            background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '1rem',
            padding: '1.5rem',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#a855f7' }}>10K+</div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Active Users</div>
          </div>

          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '1rem',
            padding: '1.5rem',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📈</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>95%</div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Success Rate</div>
          </div>
        </div>

        {/* Productive Platform Features Section */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          padding: '2.5rem', 
          borderRadius: '1.5rem',
          marginBottom: '3rem',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          animation: 'slideUp 1s ease-out 1.1s forwards',
          opacity: 0
        }}>
          <h2 style={{ 
            marginBottom: '2rem', 
            color: '#f1f5f9',
            fontSize: '1.8rem',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            🚀 Productive Platform Features
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              padding: '2rem',
              borderRadius: '1rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
            }}
          >
            <span style={{ fontSize: '3rem' }}>📊</span>
            <span>Analytics Dashboard</span>
            <span style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: '1.4' }}>
              Get insights into your challenge performance and optimize your strategy
            </span>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
            color: 'white',
            border: 'none',
            padding: '2rem',
            borderRadius: '1rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
          }}
          >
            <span style={{ fontSize: '3rem' }}>📈</span>
            <span>Challenge Management</span>
            <span style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: '1.4' }}>
              Create, manage, and track challenges with ease
            </span>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
            color: 'white',
            border: 'none',
            padding: '2rem',
            borderRadius: '1rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 25px rgba(168, 85, 247, 0.4)',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(168, 85, 247, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(168, 85, 247, 0.4)';
          }}
          >
            <span style={{ fontSize: '3rem' }}>🏆</span>
            <span>Rewards System</span>
            <span style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: '1.4' }}>
              Earn points, unlock achievements, and redeem exclusive rewards
            </span>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            border: 'none',
            padding: '2rem',
            borderRadius: '1rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(245, 158, 11, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.4)';
          }}
          >
            <span style={{ fontSize: '3rem' }}>👥</span>
            <span>Social Features</span>
            <span style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: '1.4' }}>
              Connect with friends, compete on leaderboards, and share achievements
            </span>
          </div>
        </div>
          
          <div style={{ 
            marginTop: '2rem', 
            padding: '1.5rem',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💡</div>
            <p style={{ 
              color: '#f59e0b', 
              fontSize: '1rem', 
              fontWeight: '600',
              margin: '0 0 0.5rem 0'
            }}>
              New to Reel to Reality?
            </p>
            <p style={{ 
              color: '#fbbf24', 
              fontSize: '0.9rem',
              margin: 0,
              lineHeight: '1.4'
            }}>
              Sign up to unlock exclusive challenges, earn points, and connect with a community of creators and businesses.
            </p>
          </div>
        </div>

        {/* Trending Challenges Section */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          padding: '2.5rem', 
          borderRadius: '1.5rem',
          marginBottom: '3rem',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          animation: 'slideUp 1s ease-out 1.3s forwards',
          opacity: 0
        }}>
          <h2 style={{ 
            marginBottom: '2rem', 
            color: '#f1f5f9',
            fontSize: '1.8rem',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            🔥 Trending This Week
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div style={{ 
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem', marginRight: '1rem' }}>🎨</div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f1f5f9', margin: 0 }}>
                    Creative Video Challenge
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>
                    1.2K participants • 250 points
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                Show your creativity in a 30-second video. Top submissions win exclusive rewards!
              </p>
            </div>

            <div style={{ 
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem', marginRight: '1rem' }}>☕</div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f1f5f9', margin: 0 }}>
                    Coffee Art Challenge
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>
                    890 participants • 180 points
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                Create beautiful latte art and share your masterpiece. Win free coffee for a month!
              </p>
            </div>

            <div style={{ 
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(168, 85, 247, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem', marginRight: '1rem' }}>💪</div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f1f5f9', margin: 0 }}>
                    Fitness Transformation
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>
                    654 participants • 500 points
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                Document your 30-day fitness journey. Win gym memberships and fitness gear!
              </p>
            </div>
          </div>
        </div>

        <div style={{ 
          fontSize: '1rem', 
          color: '#64748b',
          padding: '1.5rem',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '1rem',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          animation: 'slideUp 1s ease-out 1.5s forwards',
          opacity: 0
        }}>
          <p style={{ margin: '0.5rem 0', fontWeight: '500' }}>
            <strong style={{ color: '#10b981' }}>App:</strong> {typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'}
          </p>
          <p style={{ margin: '0.5rem 0', fontWeight: '500' }}>
            <strong style={{ color: '#a855f7' }}>Business Dashboard:</strong> /business-dashboard
          </p>
        </div>
      </div>

      {/* Enhanced CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.1); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  console.log('🚀 Reel to Reality App Starting...');
  
  return (
    <AppProvider>
      <Router>
        <React.Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/business-auth" element={<BusinessAuth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/business-dashboard" element={<BusinessDashboard />} />
            <Route path="/business-challenges" element={<BusinessChallenges />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </Router>
    </AppProvider>
  );
};

export default App;
