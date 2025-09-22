import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const { currentUser, theme } = useApp();
  const scaleAnim = new Animated.Value(1);

  const getProgressToNextLevel = () => {
    const pointsPerLevel = 500;
    const currentLevelPoints = (currentUser?.level - 1) * pointsPerLevel;
    const progress = ((currentUser?.points - currentLevelPoints) / pointsPerLevel) * 100;
    return Math.min(progress, 100);
  };

  const getAchievements = () => [
    { id: 'first_challenge', name: 'First Steps', icon: 'footsteps', earned: true, color: '#10b981' },
    { id: 'social_butterfly', name: 'Social Butterfly', icon: 'people', earned: true, color: '#3b82f6' },
    { id: 'point_collector', name: 'Point Collector', icon: 'star', earned: currentUser?.points >= 1000, color: '#f59e0b' },
    { id: 'challenge_master', name: 'Challenge Master', icon: 'trophy', earned: currentUser?.completedChallenges >= 20, color: '#ef4444' },
    { id: 'level_up', name: 'Level Up!', icon: 'trending-up', earned: currentUser?.level >= 5, color: '#8b5cf6' },
    { id: 'friend_magnet', name: 'Friend Magnet', icon: 'heart', earned: false, color: '#ec4899' },
  ];

  const getRecentActivity = () => [
    { id: 1, type: 'challenge_completed', text: 'Completed "Creative Video Storytelling" challenge', time: '2 hours ago', icon: 'checkmark-circle', color: '#10b981' },
    { id: 2, type: 'level_up', text: `Reached Level ${currentUser?.level}!`, time: '1 day ago', icon: 'trending-up', color: '#3b82f6' },
    { id: 3, type: 'challenge_sent', text: 'Sent "Tech Innovation" to Mark', time: '3 days ago', icon: 'paper-plane', color: '#8b5cf6' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <View style={styles.headerLeft} />
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profile</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={true}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={true}
        nestedScrollEnabled={true}
      >
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, shadowColor: theme.colors.shadow }]}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {currentUser?.avatar ? (
                <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
              ) : (
                <LinearGradient
                  colors={['#ff6b6b', '#feca57', '#48dbfb']}
                  style={styles.avatarGradient}
                >
                  <Ionicons name="person" size={32} color="white" />
                </LinearGradient>
              )}
              <View style={[styles.levelBadge, { backgroundColor: theme.colors.primary, borderColor: theme.colors.surface }]}>
                <Text style={styles.levelText}>{currentUser?.level || 1}</Text>
              </View>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: theme.colors.text }]}>{currentUser?.name || 'User'}</Text>
              <Text style={[styles.userHandle, { color: theme.colors.primary }]}>@{currentUser?.username || 'username'}</Text>
              <Text style={[styles.userBio, { color: theme.colors.textSecondary }]}>Challenge enthusiast 🎮</Text>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <LinearGradient colors={['#ff6b6b', '#ff8e8e']} style={styles.statGradient}>
                <Ionicons name="star" size={20} color="white" />
                <Text style={styles.statValue}>{currentUser?.points || 0}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </LinearGradient>
            </View>

            <View style={styles.statItem}>
              <LinearGradient colors={['#48dbfb', '#7dd3fc']} style={styles.statGradient}>
                <Ionicons name="checkmark-circle" size={20} color="white" />
                <Text style={styles.statValue}>{currentUser?.completedChallenges || 0}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </LinearGradient>
            </View>

            <View style={styles.statItem}>
              <LinearGradient colors={['#feca57', '#ff9ff3']} style={styles.statGradient}>
                <Ionicons name="trophy" size={20} color="white" />
                <Text style={styles.statValue}>{currentUser?.level || 1}</Text>
                <Text style={styles.statLabel}>Level</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Level Progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressTitle, { color: theme.colors.text }]}>Level {currentUser?.level || 1} Progress</Text>
              <Text style={[styles.progressPercentage, { color: theme.colors.primary }]}>{Math.round(getProgressToNextLevel())}%</Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
              <LinearGradient
                colors={theme.colors.gradient}
                style={[styles.progressFill, { width: `${getProgressToNextLevel()}%` }]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
              {500 - ((currentUser?.points || 0) % 500)} points to Level {(currentUser?.level || 1) + 1}
            </Text>
          </View>
        </View>

        {/* Achievements Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>🏆 Achievements</Text>
          <View style={styles.achievementsGrid}>
            {getAchievements().map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementItem,
                  !achievement.earned && styles.achievementLocked,
                  { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }
                ]}
              >
                <View style={[
                  styles.achievementIcon,
                  { backgroundColor: achievement.earned ? achievement.color : theme.colors.border }
                ]}>
                  <Ionicons
                    name={achievement.icon}
                    size={16}
                    color="white"
                  />
                </View>
                <Text style={[
                  styles.achievementName,
                  { color: achievement.earned ? theme.colors.text : theme.colors.textSecondary }
                ]}>
                  {achievement.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Friends Management Button */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>👥 Friends & Community</Text>
            <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
              Connect with creators and share challenges
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.addFriendsButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('AddFriends')}
          >
            <Ionicons name="person-add" size={20} color="white" />
            <Text style={styles.addFriendsButtonText}>Find & Add Friends</Text>
            <Ionicons name="chevron-forward" size={16} color="white" />
          </TouchableOpacity>
          
          <View style={styles.friendsPreview}>
            <Text style={[styles.friendsCount, { color: theme.colors.textSecondary }]}>
              Ready to build your creator network!
            </Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>📈 Recent Activity</Text>
          {getRecentActivity().map((activity, index) => (
            <View key={activity.id} style={[
              styles.activityItem, 
              { borderBottomColor: theme.colors.border },
              index === getRecentActivity().length - 1 && { borderBottomWidth: 0 }
            ]}>
              <View style={[styles.activityIcon, { backgroundColor: activity.color }]}>
                <Ionicons name={activity.icon} size={14} color="white" />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityText, { color: theme.colors.text }]}>{activity.text}</Text>
                <Text style={[styles.activityTime, { color: theme.colors.textSecondary }]}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  headerLeft: {
    width: 24,
  },
  headerRight: {
    width: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingBottom: 100,
  },
  profileCard: {
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  levelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileInfo: {
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  userHandle: {
    fontSize: 16,
  },
  userBio: {
    fontSize: 14,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  statItem: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 15,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  achievementItem: {
    alignItems: 'center',
    width: (width - 100) / 3,
    gap: 8,
    padding: 12,
    borderRadius: 12,
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  activityIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    marginTop: 2,
  },
  addFriendsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  addFriendsButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  friendsPreview: {
    padding: 12,
  },
  friendsCount: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ProfileScreen;
