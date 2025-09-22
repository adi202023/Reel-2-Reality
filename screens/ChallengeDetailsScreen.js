import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

const ChallengeDetailsScreen = ({ route, navigation }) => {
  const { challenge } = route.params;
  const { theme } = useApp();

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'dance': return 'musical-notes';
      case 'food': return 'restaurant';
      case 'art': return 'color-palette';
      case 'fitness': return 'fitness';
      default: return 'star';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: challenge.image }} style={styles.challengeImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageOverlay}
        />
        
        {/* Header Controls */}
        <View style={styles.headerControls}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Challenge Header Info */}
        <View style={styles.headerInfo}>
          <View style={styles.badgeContainer}>
            <View style={[styles.categoryBadge, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name={getCategoryIcon(challenge.category)} size={16} color="white" />
              <Text style={styles.categoryText}>{challenge.category}</Text>
            </View>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
              <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
            </View>
          </View>
          
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.statText}>{challenge.participants} participants</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.statText}>{challenge.duration}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Challenge Description */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About This Challenge</Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            {challenge.description}
          </Text>
        </View>

        {/* Challenge Requirements */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Requirements</Text>
          <View style={styles.requirementsList}>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
              <Text style={[styles.requirementText, { color: theme.colors.textSecondary }]}>
                Record a video between 30-60 seconds
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
              <Text style={[styles.requirementText, { color: theme.colors.textSecondary }]}>
                Follow the challenge guidelines
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
              <Text style={[styles.requirementText, { color: theme.colors.textSecondary }]}>
                Submit before the deadline
              </Text>
            </View>
          </View>
        </View>

        {/* Rewards */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Rewards</Text>
          <View style={styles.rewardsContainer}>
            <View style={styles.rewardItem}>
              <LinearGradient
                colors={['#f59e0b', '#d97706']}
                style={styles.rewardIcon}
              >
                <Ionicons name="star" size={24} color="white" />
              </LinearGradient>
              <View style={styles.rewardInfo}>
                <Text style={[styles.rewardTitle, { color: theme.colors.text }]}>XP Points</Text>
                <Text style={[styles.rewardValue, { color: theme.colors.textSecondary }]}>+{challenge.points || 150} XP</Text>
              </View>
            </View>
            
            <View style={styles.rewardItem}>
              <LinearGradient
                colors={['#8b5cf6', '#7c3aed']}
                style={styles.rewardIcon}
              >
                <Ionicons name="trophy" size={24} color="white" />
              </LinearGradient>
              <View style={styles.rewardInfo}>
                <Text style={[styles.rewardTitle, { color: theme.colors.text }]}>Achievement</Text>
                <Text style={[styles.rewardValue, { color: theme.colors.textSecondary }]}>Challenge Master</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('FriendSelection', { challenge })}
          >
            <LinearGradient
              colors={theme.colors.gradient}
              style={styles.actionGradient}
            >
              <Ionicons name="paper-plane" size={20} color="white" />
              <Text style={styles.actionText}>Send Challenge</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Camera', { challenge })}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.actionGradient}
            >
              <Ionicons name="videocam" size={20} color="white" />
              <Text style={styles.actionText}>Record Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: height * 0.4,
    position: 'relative',
  },
  challengeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerControls: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  categoryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  challengeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  requirementsList: {
    gap: 16,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  requirementText: {
    flex: 1,
    fontSize: 16,
  },
  rewardsContainer: {
    gap: 16,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rewardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rewardValue: {
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChallengeDetailsScreen;
