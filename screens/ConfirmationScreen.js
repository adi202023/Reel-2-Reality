import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

const ConfirmationScreen = ({ route, navigation }) => {
  const { type, challenge, friend, pointsEarned } = route.params;
  const { theme } = useApp();
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const confettiAnims = useRef(
    Array.from({ length: 20 }, () => ({
      translateY: new Animated.Value(-50),
      translateX: new Animated.Value(Math.random() * width),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(1),
    }))
  ).current;

  useEffect(() => {
    // Scale animation for the icon
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Fade in the content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Confetti animation for achievements
    if (type === 'proof_submitted') {
      const confettiAnimations = confettiAnims.map((anim, index) => 
        Animated.parallel([
          Animated.timing(anim.translateY, {
            toValue: height + 100,
            duration: 2000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(anim.rotate, {
            toValue: Math.random() * 720,
            duration: 2000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(1500),
            Animated.timing(anim.opacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      
      Animated.parallel(confettiAnimations).start();
    }
  }, []);

  const getConfirmationContent = () => {
    if (type === 'challenge_sent') {
      return {
        icon: 'send',
        title: 'Challenge Sent!',
        message: `Your challenge has been sent to ${friend?.name}. They'll receive a notification and can start the challenge right away.`,
        buttonText: 'Send Another',
        buttonAction: () => navigation.navigate('MainApp'),
        gradient: ['#6366f1', '#8b5cf6']
      };
    } else if (type === 'proof_submitted') {
      return {
        icon: 'trophy',
        title: 'Proof Submitted!',
        message: `Congratulations! You've earned ${pointsEarned} points for completing "${challenge?.title}". Keep up the great work!`,
        buttonText: 'Continue Exploring',
        buttonAction: () => navigation.navigate('MainApp'),
        gradient: ['#10b981', '#059669']
      };
    }
  };

  const content = getConfirmationContent();

  const handleContinue = () => {
    // Navigate back to the main tab navigator (Home tab)
    navigation.navigate('MainApp', { screen: 'Home' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <LinearGradient
        colors={content.gradient}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
          alwaysBounceVertical={true}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Success Animation */}
            <Animated.View 
              style={[
                styles.iconContainer,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: fadeAnim
                }
              ]}
            >
              <View style={styles.iconCircle}>
                <Ionicons name={content.icon} size={60} color="white" />
              </View>
            </Animated.View>

            {/* Title and Message */}
            <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
              <Text style={styles.title}>{content.title}</Text>
              <Text style={styles.message}>{content.message}</Text>
            </Animated.View>

            {/* Challenge Info */}
            {challenge && (
              <Animated.View style={[styles.challengeCard, { opacity: fadeAnim }]}>
                <Text style={styles.challengeName}>{challenge.title}</Text>
                {pointsEarned && (
                  <View style={styles.pointsContainer}>
                    <Ionicons name="star" size={20} color="#f59e0b" />
                    <Text style={styles.pointsText}>+{pointsEarned} points earned!</Text>
                  </View>
                )}
                {friend && (
                  <View style={styles.friendContainer}>
                    <Ionicons name="person" size={20} color="#6366f1" />
                    <Text style={styles.friendText}>Sent to {friend.name}</Text>
                  </View>
                )}
              </Animated.View>
            )}

            {/* Action Buttons */}
            <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={content.buttonAction}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>{content.buttonText}</Text>
                <Ionicons name="arrow-forward" size={20} color={content.gradient[0]} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleContinue}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryButtonText}>Back to Home</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Confetti */}
            {type === 'proof_submitted' && (
              <View style={styles.confettiContainer}>
                {confettiAnims.map((anim, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.confetti,
                      {
                        transform: [
                          { translateY: anim.translateY },
                          { translateX: anim.translateX },
                          { rotate: `${anim.rotate}deg` },
                        ],
                        opacity: anim.opacity,
                      },
                    ]}
                  />
                ))}
              </View>
            )}

            {/* Decorative Elements */}
            <View style={styles.decorativeElements}>
              <View style={[styles.floatingCircle, styles.circle1]} />
              <View style={[styles.floatingCircle, styles.circle2]} />
              <View style={[styles.floatingCircle, styles.circle3]} />
              <View style={[styles.floatingCircle, styles.circle4]} />
            </View>
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    position: 'relative',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    position: 'relative',
  },
  iconContainer: {
    marginBottom: 30,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  challengeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    minWidth: '80%',
    alignItems: 'center',
  },
  challengeName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
    gap: 6,
  },
  pointsText: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: '600',
  },
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  friendText: {
    color: '#a5b4fc',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  floatingCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
  },
  circle1: {
    width: 80,
    height: 80,
    top: '15%',
    right: '10%',
  },
  circle2: {
    width: 60,
    height: 60,
    top: '25%',
    left: '5%',
  },
  circle3: {
    width: 100,
    height: 100,
    bottom: '20%',
    right: '5%',
  },
  circle4: {
    width: 40,
    height: 40,
    bottom: '30%',
    left: '15%',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
});

export default ConfirmationScreen;
