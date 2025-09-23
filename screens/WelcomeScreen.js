import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

const FloatingIcon = ({ name, size, color, style, delay = 0 }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial fade in
    Animated.timing(opacityValue, {
      toValue: 1,
      duration: 1000,
      delay,
      useNativeDriver: true,
    }).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 3000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 3000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.8, 0.3],
  });

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ translateY }],
          opacity: Animated.multiply(opacity, opacityValue),
        },
      ]}
    >
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
};

const WelcomeScreen = ({ navigation }) => {
  const { theme } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#1e3a8a', '#3b82f6', '#60a5fa']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Floating Background Icons */}
        <FloatingIcon
          name="videocam"
          size={40}
          color="rgba(255,255,255,0.1)"
          style={styles.floatingIcon1}
          delay={0}
        />
        <FloatingIcon
          name="trophy"
          size={35}
          color="rgba(255,255,255,0.1)"
          style={styles.floatingIcon2}
          delay={500}
        />
        <FloatingIcon
          name="people"
          size={30}
          color="rgba(255,255,255,0.1)"
          style={styles.floatingIcon3}
          delay={1000}
        />
        <FloatingIcon
          name="flash"
          size={25}
          color="rgba(255,255,255,0.1)"
          style={styles.floatingIcon4}
          delay={1500}
        />
        <FloatingIcon
          name="star"
          size={20}
          color="rgba(255,255,255,0.1)"
          style={styles.floatingIcon5}
          delay={2000}
        />

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
          alwaysBounceVertical={true}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            {/* Logo Section */}
            <View style={styles.logoSection}>
              <View style={styles.logoContainer}>
                <View style={styles.logoBackground}>
                  <Ionicons name="videocam" size={48} color="#1e3a8a" />
                </View>
                <View style={styles.logoGlow} />
              </View>
              
              <Text style={styles.appName}>Reel to Reality</Text>
              <Text style={styles.tagline}>Transform challenges into achievements</Text>
              
              <View style={styles.featuresContainer}>
                <View style={styles.feature}>
                  <View style={[styles.featureIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                    <Ionicons name="trophy" size={20} color="white" />
                  </View>
                  <Text style={styles.featureText}>Earn Rewards</Text>
                </View>
                <View style={styles.feature}>
                  <View style={[styles.featureIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                    <Ionicons name="people" size={20} color="white" />
                  </View>
                  <Text style={styles.featureText}>Connect</Text>
                </View>
                <View style={styles.feature}>
                  <View style={[styles.featureIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                    <Ionicons name="flash" size={20} color="white" />
                  </View>
                  <Text style={styles.featureText}>Challenge</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate('SignIn')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                  <Ionicons name="arrow-forward" size={20} color="#1e3a8a" />
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>New user? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text style={styles.signupLink}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: height,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  logoSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.2)',
    top: -10,
    left: -10,
    zIndex: -1,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
    textShadow: '0px 2px 4px rgba(0,0,0,0.3)',
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  featureText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 40,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 12,
  },
  primaryButtonText: {
    color: '#1e3a8a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
  signupLink: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  // Floating icons positions
  floatingIcon1: {
    position: 'absolute',
    top: height * 0.15,
    left: width * 0.1,
  },
  floatingIcon2: {
    position: 'absolute',
    top: height * 0.25,
    right: width * 0.15,
  },
  floatingIcon3: {
    position: 'absolute',
    top: height * 0.45,
    left: width * 0.05,
  },
  floatingIcon4: {
    position: 'absolute',
    top: height * 0.65,
    right: width * 0.1,
  },
  floatingIcon5: {
    position: 'absolute',
    top: height * 0.8,
    left: width * 0.2,
  },
});

export default WelcomeScreen;
