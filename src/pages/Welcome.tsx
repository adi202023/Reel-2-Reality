import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Film,
  Trophy,
  Users,
  Star,
  Sparkles,
  Video,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Zap,
  Camera,
  Award,
} from 'lucide-react';
import ReelBackground from '../components/ReelBackground';
import { Button } from '../components/ui/button';
import { useApp } from '../context/AppContext';

const Welcome = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<string>('Checking...');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/health');
        const data = await response.json();
        if (data.status === 'ok') {
          setBackendStatus('✅ Backend Connected');
        } else {
          setBackendStatus('⚠️ Backend Unreachable');
        }
      } catch {
        setBackendStatus('❌ Backend Offline');
      }
    };
    checkBackend();
  }, []);

  const handleDemoLogin = (role: string) => {
    setIsLoading(true);
    setNotification({
      type: 'info',
      message: `Logging in as ${role}...`,
    });
    setTimeout(() => {
      setIsLoading(false);
      setNotification({
        type: 'success',
        message: `${role} demo login successful!`,
      });
      navigate('/dashboard');
    }, 1500);
  };

  const challenges = [
    {
      icon: Trophy,
      title: 'Daily Coding',
      desc: 'Solve problems & earn rewards',
    },
    {
      icon: Users,
      title: 'Compete Globally',
      desc: 'Join hackathons & leaderboards',
    },
    {
      icon: Star,
      title: 'Earn Badges',
      desc: 'Showcase achievements',
    },
    {
      icon: Video,
      title: 'Live Tutorials',
      desc: 'Watch & learn interactively',
    },
  ];

  const features = [
    {
      icon: '✨',
      title: 'Gamified Learning',
      desc: 'XP, levels & ranks',
    },
    {
      icon: '🏆',
      title: 'Skill Certifications',
      desc: 'Industry recognition',
    },
    {
      icon: '📦',
      title: 'Reward Store',
      desc: 'Redeem your points',
    },
    {
      icon: '📊',
      title: 'Smart Insights',
      desc: 'Track progress & growth',
    },
    {
      icon: '⬆️',
      title: 'Career Growth',
      desc: 'Skill-based progression',
    },
  ];

  const demoAccounts = [
    {
      role: 'Student',
      icon: Users,
      desc: 'Learn & solve challenges',
    },
    {
      role: 'Mentor',
      icon: Star,
      desc: 'Guide and create content',
    },
    {
      role: 'Admin',
      icon: Award,
      desc: 'Manage the ecosystem',
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-purple-900/10 to-pink-900/15" />

      {/* Animated Mesh Gradient Overlays */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-emerald-500/15 via-transparent to-transparent rounded-full animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent rounded-full animate-pulse delay-3000" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-radial from-purple-500/10 via-transparent to-transparent rounded-full animate-pulse delay-5000" />
      </div>

      {/* Background Animation */}
      <ReelBackground />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-bold flex items-center space-x-2">
          <Film className="text-emerald-500" />
          <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
            CineLearn
          </span>
        </h1>
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className="text-sm px-3"
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </Button>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg transition-all duration-300
            ${
              notification.type === 'success'
                ? 'bg-emerald-600 text-white'
                : notification.type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
        >
          {notification.message}
        </div>
      )}

      {/* Hero Section */}
      <main className="relative z-10 text-center py-24 px-6">
        <h2
          className={`text-5xl font-extrabold mb-6 leading-tight ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Learn Through Movies, <br />
          Code Through Challenges
        </h2>
        <p
          className={`max-w-2xl mx-auto text-lg mb-10 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          CineLearn turns your favorite films into interactive learning
          experiences. Watch, play, and earn rewards while mastering new skills.
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => navigate('/auth')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2"
          >
            <Play size={18} />
            <span>Get Started</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/about')}
            className="border-gray-400 text-gray-700 hover:bg-gray-100 px-6 py-3 rounded-xl"
          >
            Learn More
          </Button>
        </div>
        <div className="mt-6 text-sm text-gray-400">{backendStatus}</div>
      </main>

      {/* Demo Accounts */}
      <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto">
        <h3
          className={`text-3xl font-bold mb-8 text-center ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Try Demo Accounts
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {demoAccounts.map((demo, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl shadow-lg text-center transition hover:scale-105 cursor-pointer
                ${
                  isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-700'
                    : 'bg-white hover:bg-gray-100'
                }
                ${isDarkMode ? 'shadow-emerald-500/20' : 'shadow-emerald-500/10'}
              `}
              onClick={() => handleDemoLogin(demo.role)}
            >
              <demo.icon className="w-10 h-10 text-emerald-500 mb-4 mx-auto" />
              <h4
                className={`text-xl font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {demo.role}
              </h4>
              <p
                className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {demo.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto">
        <h3
          className={`text-3xl font-bold mb-8 text-center ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Features
        </h3>
        <div className="grid md:grid-cols-5 gap-6">
          {features.map((f, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl shadow-lg text-center transition hover:scale-105
                ${
                  isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-700'
                    : 'bg-white hover:bg-gray-100'
                }`}
            >
              <span className="w-10 h-10 text-emerald-500 mb-4 mx-auto">{f.icon}</span>
              <h4
                className={`text-lg font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {f.title}
              </h4>
              <p
                className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Challenges */}
      <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto">
        <h3
          className={`text-3xl font-bold mb-8 text-center ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Challenges
        </h3>
        <div className="grid md:grid-cols-4 gap-6">
          {challenges.map((c, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl shadow-lg text-center transition hover:scale-105
                ${
                  isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-700'
                    : 'bg-white hover:bg-gray-100'
                }`}
            >
              <c.icon className="w-10 h-10 text-emerald-500 mb-4 mx-auto" />
              <h4
                className={`text-lg font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {c.title}
              </h4>
              <p
                className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`relative z-10 text-center py-8 text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}
      >
        &copy; 2025 CineLearn. All rights reserved.
      </footer>
    </div>
  );
};

export default Welcome;
