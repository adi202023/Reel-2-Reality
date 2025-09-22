import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

const SignInScreen = ({ navigation }) => {
  const { signIn, theme } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signIn(username, password);
    } catch (error) {
      Alert.alert('Sign In Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Design */}
      <LinearGradient
        colors={theme.colors.gradient}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Floating Background Elements */}
        <View style={styles.floatingElements}>
          <View style={[styles.floatingCircle, styles.circle1]} />
          <View style={[styles.floatingCircle, styles.circle2]} />
          <View style={[styles.floatingCircle, styles.circle3]} />
          <View style={[styles.floatingCircle, styles.circle4]} />
          <View style={[styles.floatingCircle, styles.circle5]} />
          <View style={[styles.floatingCircle, styles.circle6]} />
        </View>

        {/* Animated Background Icons */}
        <View style={styles.backgroundIcons}>
          <Animated.View style={[styles.floatingIcon, styles.icon1, { opacity: fadeAnim }]}>
            <Ionicons name="videocam" size={40} color="rgba(255,255,255,0.1)" />
          </Animated.View>
          <Animated.View style={[styles.floatingIcon, styles.icon2, { opacity: fadeAnim }]}>
            <Ionicons name="play-circle" size={60} color="rgba(255,255,255,0.08)" />
          </Animated.View>
          <Animated.View style={[styles.floatingIcon, styles.icon3, { opacity: fadeAnim }]}>
            <Ionicons name="camera" size={35} color="rgba(255,255,255,0.12)" />
          </Animated.View>
          <Animated.View style={[styles.floatingIcon, styles.icon4, { opacity: fadeAnim }]}>
            <Ionicons name="film" size={45} color="rgba(255,255,255,0.09)" />
          </Animated.View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <SafeAreaView style={styles.safeArea}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={true}
              alwaysBounceVertical={false}
            >
              <Animated.View
                style={[
                  styles.content,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                {/* Header */}
                <View style={styles.header}>
                  <View style={styles.logoContainer}>
                    <View style={styles.logoBackground}>
                      <Ionicons name="videocam" size={32} color="#3b82f6" />
                    </View>
                  </View>
                  <Text style={styles.appTitle}>Reel to Reality</Text>
                  <Text style={styles.subtitle}>Welcome back! Sign in to continue your journey</Text>
                </View>

                {/* Sign In Form */}
                <View style={[styles.formContainer, { 
                  backgroundColor: theme.isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255,255,255,0.95)',
                  borderColor: theme.colors.border,
                }]}>
                  <Text style={[styles.formTitle, { color: theme.colors.text }]}>Sign In</Text>
                  
                  <View style={styles.form}>
                    {/* Username Field */}
                    <View style={styles.inputContainer}>
                      <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Username</Text>
                      <View style={[
                        styles.inputWrapper, 
                        { 
                          backgroundColor: theme.isDark ? 'rgba(51, 65, 85, 0.8)' : '#f9fafb',
                          borderColor: theme.colors.border 
                        }, 
                        errors.username && styles.inputError
                      ]}>
                        <Ionicons name="person" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                          style={[styles.input, { color: theme.colors.text }]}
                          placeholder="Enter your username"
                          placeholderTextColor={theme.colors.textSecondary}
                          value={username}
                          onChangeText={(text) => {
                            setUsername(text);
                            if (errors.username) {
                              setErrors(prev => ({ ...prev, username: null }));
                            }
                          }}
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                      </View>
                      {errors.username && (
                        <View style={styles.errorContainer}>
                          <Ionicons name="alert-circle" size={16} color="#ef4444" />
                          <Text style={styles.errorText}>{errors.username}</Text>
                        </View>
                      )}
                    </View>

                    {/* Password Field */}
                    <View style={styles.inputContainer}>
                      <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Password</Text>
                      <View style={[
                        styles.inputWrapper, 
                        { 
                          backgroundColor: theme.isDark ? 'rgba(51, 65, 85, 0.8)' : '#f9fafb',
                          borderColor: theme.colors.border 
                        }, 
                        errors.password && styles.inputError
                      ]}>
                        <Ionicons name="lock-closed" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                          style={[styles.input, { color: theme.colors.text }]}
                          placeholder="Enter your password"
                          placeholderTextColor={theme.colors.textSecondary}
                          value={password}
                          onChangeText={(text) => {
                            setPassword(text);
                            if (errors.password) {
                              setErrors(prev => ({ ...prev, password: null }));
                            }
                          }}
                          secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                          style={styles.eyeIcon}
                        >
                          <Ionicons
                            name={showPassword ? "eye-off" : "eye"}
                            size={20}
                            color={theme.colors.textSecondary}
                          />
                        </TouchableOpacity>
                      </View>
                      {errors.password && (
                        <View style={styles.errorContainer}>
                          <Ionicons name="alert-circle" size={16} color="#ef4444" />
                          <Text style={styles.errorText}>{errors.password}</Text>
                        </View>
                      )}
                    </View>

                    {/* Sign In Button */}
                    <TouchableOpacity
                      style={[styles.signInButton, loading && styles.buttonDisabled]}
                      onPress={handleSignIn}
                      disabled={loading}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={theme.isDark ? ['#3b82f6', '#1d4ed8'] : ['#3b82f6', '#1d4ed8']}
                        style={styles.buttonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        {loading ? (
                          <Text style={styles.buttonText}>Signing In...</Text>
                        ) : (
                          <>
                            <Text style={styles.buttonText}>Sign In</Text>
                            <Ionicons name="arrow-forward" size={20} color="white" />
                          </>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>

                    {/* Sign Up Link */}
                    <View style={styles.signUpContainer}>
                      <Text style={[styles.signUpText, { color: theme.colors.textSecondary }]}>Don't have an account? </Text>
                      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={[styles.signUpLink, { color: theme.colors.primary }]}>Create Account</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Animated.View>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  floatingElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  floatingCircle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  circle1: {
    width: 200,
    height: 200,
    top: -100,
    right: -100,
  },
  circle2: {
    width: 150,
    height: 150,
    top: '20%',
    left: -75,
  },
  circle3: {
    width: 100,
    height: 100,
    top: '30%',
    right: -50,
  },
  circle4: {
    width: 120,
    height: 120,
    top: '60%',
    right: -60,
  },
  circle5: {
    width: 80,
    height: 80,
    bottom: '20%',
    left: -40,
  },
  circle6: {
    width: 60,
    height: 60,
    bottom: '10%',
    right: -30,
  },
  backgroundIcons: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  floatingIcon: {
    position: 'absolute',
  },
  icon1: {
    top: '15%',
    left: '10%',
  },
  icon2: {
    top: '25%',
    right: '15%',
  },
  icon3: {
    top: '70%',
    left: '5%',
  },
  icon4: {
    top: '80%',
    right: '10%',
  },
  keyboardView: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '400',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    width: '100%',
    borderRadius: 20,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 16,
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  eyeIcon: {
    padding: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
  },
  signInButton: {
    borderRadius: 12,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginTop: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signUpText: {
    fontSize: 16,
    fontWeight: '400',
  },
  signUpLink: {
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default SignInScreen;
