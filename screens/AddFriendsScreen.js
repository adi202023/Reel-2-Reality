import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

const AddFriendsScreen = ({ navigation }) => {
  const { currentUser, theme } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock users for search results
  const mockUsers = [
    { id: 'u1', username: 'alex_creator', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=1', isOnline: true, level: 5, points: 2340 },
    { id: 'u2', username: 'sarah_filmmaker', name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?img=2', isOnline: false, level: 8, points: 4120 },
    { id: 'u3', username: 'mike_storyteller', name: 'Mike Rodriguez', avatar: 'https://i.pravatar.cc/150?img=3', isOnline: true, level: 3, points: 1580 },
    { id: 'u4', username: 'emma_creative', name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?img=4', isOnline: false, level: 12, points: 6750 },
    { id: 'u5', username: 'david_challenger', name: 'David Kim', avatar: 'https://i.pravatar.cc/150?img=5', isOnline: true, level: 7, points: 3290 },
    { id: 'u6', username: 'lisa_artist', name: 'Lisa Thompson', avatar: 'https://i.pravatar.cc/150?img=6', isOnline: true, level: 4, points: 1950 },
    { id: 'u7', username: 'james_gamer', name: 'James Miller', avatar: 'https://i.pravatar.cc/150?img=7', isOnline: false, level: 15, points: 8420 },
    { id: 'u8', username: 'anna_designer', name: 'Anna Davis', avatar: 'https://i.pravatar.cc/150?img=8', isOnline: true, level: 6, points: 2870 },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setIsSearching(true);
      // Simulate API call delay
      setTimeout(() => {
        const results = mockUsers.filter(user => 
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
        setIsSearching(false);
      }, 800);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const sendFriendRequest = (user) => {
    Alert.alert(
      'Friend Request Sent! 🚀',
      `Your friend request has been sent to ${user.name}. They'll receive a notification and can accept your request.`,
      [{ text: 'Awesome!', style: 'default' }]
    );
    
    // Add to friend requests (mock)
    setFriendRequests(prev => [...prev, { ...user, status: 'pending', sentAt: new Date() }]);
    
    // Remove from search results
    setSearchResults(prev => prev.filter(u => u.id !== user.id));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Find & Add Friends</Text>
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
        {/* Search Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>🔍 Discover Creators</Text>
            <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
              Find and connect with amazing creators worldwide
            </Text>
          </View>
          
          {/* Search Bar */}
          <View style={[styles.searchContainer, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
            <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              value={searchQuery}
              onChangeText={handleSearch}
              placeholder="Search by username or name..."
              placeholderTextColor={theme.colors.textSecondary}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Loading State */}
          {isSearching && (
            <View style={styles.loadingContainer}>
              <LinearGradient
                colors={theme.colors.gradient}
                style={styles.loadingIndicator}
              >
                <Ionicons name="search" size={24} color="white" />
              </LinearGradient>
              <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Searching creators...</Text>
            </View>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <View style={styles.searchResultsContainer}>
              <Text style={[styles.resultsHeader, { color: theme.colors.text }]}>
                Found {searchResults.length} creator{searchResults.length > 1 ? 's' : ''}
              </Text>
              {searchResults.map((user) => (
                <View key={user.id} style={[styles.userCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                  <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                      <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                      {user.isOnline && <View style={styles.onlineIndicator} />}
                      <View style={[styles.levelBadge, { backgroundColor: theme.colors.primary }]}>
                        <Text style={styles.levelText}>{user.level}</Text>
                      </View>
                    </View>
                    <View style={styles.userDetails}>
                      <Text style={[styles.userName, { color: theme.colors.text }]}>{user.name}</Text>
                      <Text style={[styles.userUsername, { color: theme.colors.primary }]}>@{user.username}</Text>
                      <View style={styles.userStats}>
                        <View style={styles.statItem}>
                          <Ionicons name="star" size={12} color={theme.colors.primary} />
                          <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>{user.points} XP</Text>
                        </View>
                        <View style={[styles.statusDot, { backgroundColor: user.isOnline ? '#10b981' : '#6b7280' }]} />
                        <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
                          {user.isOnline ? 'Online' : 'Offline'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={[styles.addFriendButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => sendFriendRequest(user)}
                  >
                    <Ionicons name="person-add" size={16} color="white" />
                    <Text style={styles.addFriendText}>Add</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Empty Search State */}
          {searchQuery.length > 0 && searchResults.length === 0 && !isSearching && (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>No creators found</Text>
              <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                Try searching with a different username or name
              </Text>
            </View>
          )}

          {/* Default State */}
          {searchQuery.length === 0 && (
            <View style={styles.defaultState}>
              <LinearGradient
                colors={theme.colors.gradient}
                style={styles.defaultIcon}
              >
                <Ionicons name="people" size={32} color="white" />
              </LinearGradient>
              <Text style={[styles.defaultTitle, { color: theme.colors.text }]}>Ready to Connect?</Text>
              <Text style={[styles.defaultText, { color: theme.colors.textSecondary }]}>
                Start typing to search for creators by username or name
              </Text>
            </View>
          )}
        </View>

        {/* Pending Friend Requests */}
        {friendRequests.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                📤 Pending Requests ({friendRequests.length})
              </Text>
              <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
                Friend requests you've sent
              </Text>
            </View>
            {friendRequests.map((request) => (
              <View key={request.id} style={[styles.pendingCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                <Image source={{ uri: request.avatar }} style={styles.pendingAvatar} />
                <View style={styles.pendingInfo}>
                  <Text style={[styles.pendingName, { color: theme.colors.text }]}>{request.name}</Text>
                  <Text style={[styles.pendingStatus, { color: theme.colors.textSecondary }]}>Request sent</Text>
                </View>
                <View style={[styles.pendingBadge, { backgroundColor: theme.colors.primary }]}>
                  <Ionicons name="time" size={12} color="white" />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Tips Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>💡 Tips for Making Friends</Text>
          </View>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
                Search for creators with similar interests
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
                Send challenges to new friends to break the ice
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
                Be active and engage with the community
              </Text>
            </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingBottom: 100,
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
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
  },
  clearButton: {
    marginLeft: 10,
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
  },
  loadingIndicator: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  loadingText: {
    fontSize: 16,
  },
  searchResultsContainer: {
    marginBottom: 20,
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: 'white',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userUsername: {
    fontSize: 14,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
  },
  addFriendButton: {
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addFriendText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
  },
  defaultState: {
    padding: 40,
    alignItems: 'center',
  },
  defaultIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  defaultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  defaultText: {
    fontSize: 14,
    textAlign: 'center',
  },
  pendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  pendingAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  pendingInfo: {
    flex: 1,
  },
  pendingName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pendingStatus: {
    fontSize: 14,
    marginTop: 2,
  },
  pendingBadge: {
    padding: 8,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tipText: {
    fontSize: 14,
    flex: 1,
  },
});

export default AddFriendsScreen;
