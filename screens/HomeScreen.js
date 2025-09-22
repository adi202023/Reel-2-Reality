import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation, onTabChange }) => {
  const { currentUser, challengesList, theme } = useApp();

  const quickStats = [
    { label: 'Active Challenges', value: '3', icon: 'flash', color: '#3b82f6' },
    { label: 'Completed', value: currentUser?.completedChallenges || '0', icon: 'checkmark-circle', color: '#10b981' },
    { label: 'Total XP', value: currentUser?.points || '0', icon: 'trophy', color: '#f59e0b' },
    { label: 'Current Level', value: currentUser?.level || '1', icon: 'trending-up', color: '#8b5cf6' },
  ];

  const recentChallenges = challengesList.slice(0, 3);

  const handleViewAllChallenges = () => {
    if (onTabChange) {
      onTabChange('Challenges');
    }
  };

  const handleViewProfile = () => {
    if (onTabChange) {
      onTabChange('Profile');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
        alwaysBounceVertical={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeText, { color: theme.colors.textSecondary }]}>Welcome back,</Text>
          <Text style={[styles.userName, { color: theme.colors.text }]}>{currentUser?.name || 'User'}!</Text>
          <Text style={[styles.welcomeSubtext, { color: theme.colors.textSecondary }]}>Ready to take on new challenges?</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            {quickStats.map((stat, index) => (
              <View key={index} style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
                <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                  <Ionicons name={stat.icon} size={20} color="white" />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Challenges */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Challenges</Text>
            <TouchableOpacity 
              onPress={handleViewAllChallenges}
              style={styles.viewAllButton}
            >
              <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>View All</Text>
              <Ionicons name="arrow-forward" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          
          {recentChallenges.map((challenge) => (
            <TouchableOpacity
              key={challenge.id}
              style={[styles.challengeItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              onPress={() => navigation.navigate('ChallengeDetails', { challenge })}
            >
              <View style={styles.challengeInfo}>
                <View style={styles.challengeHeader}>
                  <Text style={[styles.challengeTitle, { color: theme.colors.text }]}>{challenge.title}</Text>
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
                    <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
                  </View>
                </View>
                <Text style={[styles.challengeDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                  {challenge.description}
                </Text>
                <View style={styles.challengeFooter}>
                  <View style={styles.challengeReward}>
                    <Ionicons name="trophy" size={14} color="#f59e0b" />
                    <Text style={[styles.rewardText, { color: theme.colors.text }]}>{challenge.points} XP</Text>
                  </View>
                  <Text style={[styles.challengeTime, { color: theme.colors.textSecondary }]}>{challenge.timeLimit}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleViewAllChallenges}
            >
              <LinearGradient
                colors={['#3b82f6', '#1d4ed8']}
                style={styles.actionGradient}
              >
                <Ionicons name="flash" size={24} color="white" />
                <Text style={styles.actionText}>Browse Challenges</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleViewProfile}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.actionGradient}
              >
                <Ionicons name="person" size={24} color="white" />
                <Text style={styles.actionText}>View Profile</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100,
  },
  welcomeSection: {
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
  },
  welcomeSubtext: {
    fontSize: 16,
    fontWeight: '400',
  },
  statsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  recentSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  challengeItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  difficultyText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  challengeDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '600',
  },
  challengeTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionsSection: {
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: 'white',
  },
});

export default HomeScreen;