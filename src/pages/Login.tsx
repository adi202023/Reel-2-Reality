import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import ReelBackground from '../components/ReelBackground';
import { authAPI } from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
  }>({});

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Name validation for signup
    if (!isLogin && !formData.name) {
      newErrors.name = 'Username is required';
    }

    // Confirm password validation for signup
    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification('error', 'Please fix the errors below');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // Use the new API service for login
        const response = await authAPI.login(formData.email, formData.password);
        
        if (response.success) {
          showNotification('success', 'Login successful! Redirecting to dashboard...');
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          showNotification('error', response.message || 'Login failed');
        }
      } else {
        // Use the new API service for registration
        const response = await authAPI.register(formData.name, formData.email, formData.password);
        
        if (response.success) {
          showNotification('success', 'Account created successfully! Redirecting to dashboard...');
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          showNotification('error', response.message || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      showNotification('error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', confirmPassword: '', name: '' });
    setErrors({});
    setNotification(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <ReelBackground />

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className={`
            px-6 py-4 rounded-lg shadow-2xl backdrop-blur-sm border flex items-center space-x-3 max-w-md
            ${notification.type === 'success' ? 'bg-green-500/20 border-green-500/30 text-green-100' : ''}
            ${notification.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-100' : ''}
            ${notification.type === 'info' ? 'bg-blue-500/20 border-blue-500/30 text-blue-100' : ''}
          `}>
            {notification.type === 'success' && <span>⭐️</span>}
            {notification.type === 'error' && <span>⚠️</span>}
            {notification.type === 'info' && <span>✨</span>}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          disabled={isLoading}
          className="absolute top-6 left-6 text-gray-400 hover:text-white hover:bg-white/10"
        >
          <span>⬅️</span>
          Back to Home
        </Button>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="relative">
                <span>🎬</span>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping" />
              </div>
              <div>
                <span className="text-3xl font-bold text-white">Reel to Reality</span>
                <p className="text-sm text-gray-400 -mt-1">Challenge Platform</p>
              </div>
            </div>

            <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <span>✨</span>
              <span className="text-white font-medium">Secure Authentication</span>
            </div>

            <h1 className="text-4xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Join the Community'}
            </h1>
            <p className="text-gray-400">
              {isLogin
                ? 'Sign in to continue your creative journey'
                : 'Create an account to start your adventure'
              }
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.name 
                        ? 'border-red-400 focus:ring-red-400' 
                        : 'border-white/20 focus:ring-yellow-400 focus:border-transparent'
                    }`}
                    placeholder="Enter your Username"
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <span>⚠️</span>
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span>📨</span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.email 
                        ? 'border-red-400 focus:ring-red-400' 
                        : 'border-white/20 focus:ring-yellow-400 focus:border-transparent'
                    }`}
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <span>⚠️</span>
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <span>🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-12 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.password 
                        ? 'border-red-400 focus:ring-red-400' 
                        : 'border-white/20 focus:ring-yellow-400 focus:border-transparent'
                    }`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <span>👀</span> : <span>🙈</span>}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <span>⚠️</span>
                    {errors.password}
                  </p>
                )}
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span>🔒</span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-12 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.confirmPassword 
                          ? 'border-red-400 focus:ring-red-400' 
                          : 'border-white/20 focus:ring-yellow-400 focus:border-transparent'
                      }`}
                      placeholder="Confirm your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <span>👀</span> : <span>🙈</span>}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <span>⚠️</span>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-yellow-400 bg-white/5 border-white/20 rounded focus:ring-yellow-400 focus:ring-2"
                      disabled={isLoading}
                    />
                    <span className="ml-2 text-sm text-gray-400">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
                    disabled={isLoading}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 text-lg py-4 font-semibold shadow-2xl hover:shadow-yellow-400/25 transform hover:scale-105 transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-3">
                    <span>🔄</span>
                    <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                  </div>
                ) : (
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                )}
              </Button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={toggleMode}
                  disabled={isLoading}
                  className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
