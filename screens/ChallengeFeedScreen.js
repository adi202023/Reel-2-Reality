import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

const ChallengeFeedScreen = ({ navigation }) => {
  const { challengesList, currentUser, theme } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Video Production', 'Technology', 'Sustainability', 'Business', 'Culture', 'Health & Fitness', 'Culinary Arts', 'Social Impact', 'Art & Design', 'Education', 'Photography', 'Music', 'Wellness', 'DIY & Crafts', 'Science', 'Fashion', 'Gaming', 'Travel', 'Literature', 'Pets & Animals'];

  const filteredChallenges = challengesList.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || challenge.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Video Production': 'videocam',
      'Technology': 'hardware-chip',
      'Sustainability': 'leaf',
      'Business': 'briefcase',
      'Culture': 'library',
      'Health & Fitness': 'fitness',
      'Culinary Arts': 'restaurant',
      'Social Impact': 'people',
      'Art & Design': 'color-palette',
      'Education': 'school',
      'Photography': 'camera',
      'Music': 'musical-notes',
      'Wellness': 'heart',
      'DIY & Crafts': 'hammer',
      'Science': 'flask',
      'Fashion': 'shirt',
      'Gaming': 'game-controller',
      'Travel': 'airplane',
      'Literature': 'book',
      'Pets & Animals': 'paw'
    };
    return icons[category] || 'flash';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        bounces={true}
        alwaysBounceVertical={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{'Discover Challenges'}</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            Join {challengesList.reduce((sum, c) => sum + c.participants, 0).toLocaleString()}+ creators worldwide
          </Text>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.searchBar, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
            <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search challenges..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                selectedCategory === category && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                { color: theme.colors.text },
                selectedCategory === category && { color: 'white' }
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stats Bar */}
        <View style={[styles.statsBar, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>{filteredChallenges.length}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Available</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>{currentUser?.completedChallenges || 0}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Completed</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>{currentUser?.points || 0}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Total XP</Text>
          </View>
        </View>

        {/* Challenge Cards */}
        <View style={[styles.challengesContainer]}>
          {filteredChallenges.map((challenge, index) => (
            <TouchableOpacity
              key={challenge.id}
              style={[
                styles.challengeCard,
                { marginHorizontal: 20, marginBottom: 20, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
              ]}
              onPress={() => navigation.navigate('ChallengeDetails', { challenge })}
              activeOpacity={0.95}
            >
              <View style={styles.cardImageContainer}>
                <Image source={{ uri: challenge.image }} style={styles.cardImage} />
                <LinearGradient
                  colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                  style={styles.cardOverlay}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.categoryBadge, { backgroundColor: theme.colors.primary }]}>
                      <Ionicons name={getCategoryIcon(challenge.category)} size={12} color="white" />
                      <Text style={styles.categoryBadgeText}>{challenge.category}</Text>
                    </View>
                    <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
                      <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>

              <View style={styles.cardContent}>
                <Text style={[styles.challengeTitle, { color: 'white' }]}>{challenge.title}</Text>
                <Text style={[styles.sponsorText, { color: 'rgba(255,255,255,0.9)' }]}>{challenge.sponsor}</Text>
                <Text style={[styles.challengeDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                  {challenge.description}
                </Text>

                <View style={styles.cardFooter}>
                  <View style={styles.rewardSection}>
                    <Ionicons name="trophy" size={16} color="#f59e0b" />
                    <Text style={[styles.pointsText, { color: theme.colors.text }]}>{challenge.points} XP</Text>
                  </View>
                  <View style={styles.statsSection}>
                    <View style={styles.statGroup}>
                      <Ionicons name="people" size={14} color={theme.colors.textSecondary} />
                      <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>{challenge.participants}</Text>
                    </View>
                    <View style={styles.statGroup}>
                      <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                      <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>{challenge.completionRate}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.timeSection}>
                  <Ionicons name="time" size={14} color={theme.colors.textSecondary} />
                  <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>{challenge.timeLimit}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
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
    paddingBottom: 80,
    paddingTop: 20,
  },
  headerSection: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryContent: {
    paddingRight: 20,
  },
  categoryChip: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  challengesContainer: {
    marginTop: 8,
  },
  cardImageContainer: {
    position: 'relative',
    height: 200,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  difficultyText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardContent: {
    padding: 16,
    paddingBottom: 20,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sponsorText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  challengeDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    marginBottom: 20,
    gap: 12,
  },
  rewardSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
  },
  timeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ChallengeFeedScreen;
