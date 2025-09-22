import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const FriendSelectionScreen = ({ route, navigation }) => {
  const { challenge } = route.params;
  const { friendsList, sendChallenge, theme } = useApp();

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'away': return '#f59e0b';
      case 'offline': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const handleSendChallenge = (friend) => {
    const success = sendChallenge(challenge.id, friend.id);
    if (success) {
      navigation.navigate('Confirmation', { 
        type: 'challenge_sent',
        challenge,
        friend
      });
    }
  };

  const renderFriend = ({ item: friend }) => (
    <TouchableOpacity
      style={[styles.friendCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={() => handleSendChallenge(friend)}
      activeOpacity={0.7}
    >
      <View style={styles.friendInfo}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: friend.avatar }} style={styles.avatar} />
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(friend.status) }]} />
        </View>
        
        <View style={styles.textInfo}>
          <Text style={[styles.friendName, { color: theme.colors.text }]}>{friend.name}</Text>
          <Text style={[styles.friendStatus, { color: theme.colors.textSecondary }]}>
            {friend.status.charAt(0).toUpperCase() + friend.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.actionContainer}>
        <View style={[styles.levelBadge, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.levelText}>Lv {friend.level}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Send Challenge</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>{challenge.title}</Text>
        </View>
      </View>

      {/* Challenge Preview */}
      <View style={styles.challengePreview}>
        <Image source={{ uri: challenge.image }} style={styles.challengeImage} />
        <View style={styles.challengeInfo}>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          <Text style={styles.challengePoints}>{challenge.points} points</Text>
        </View>
      </View>

      {/* Friends List */}
      <FlatList
        data={friendsList}
        renderItem={renderFriend}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Friends Yet</Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
              Add friends to start sending challenges!
            </Text>
          </View>
        )}
      />
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
  },
  challengePreview: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  challengeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  challengePoints: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    paddingVertical: 20,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  textInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
  },
  friendStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadge: {
    padding: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  levelText: {
    fontSize: 12,
    color: 'white',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default FriendSelectionScreen;
