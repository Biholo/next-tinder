import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { getMatches, type MatchWithDetails } from '@/store/slices/matchSlice';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChatListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { matches, isLoading } = useSelector((state: RootState) => state.match);

  useEffect(() => {
    dispatch(getMatches());
  }, [dispatch]);

  const renderItem = ({ item: match }: { item: MatchWithDetails }) => (
    <TouchableOpacity
      style={styles.matchItem}
      onPress={() => router.push(`/chat/${match._id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        {match.user.photos && match.user.photos[0] ? (
          <Image
            source={{ uri: match.user.photos[0].photoUrl }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarFallbackText}>
              {match.user.firstName[0]}
            </Text>
          </View>
        )}
        {match.user.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.messageInfo}>
        <Text style={styles.name}>{match.user.firstName}</Text>
        {match.lastMessage ? (
          <Text style={styles.lastMessage} numberOfLines={1}>
            {match.lastMessage.content}
          </Text>
        ) : (
          <Text style={styles.noMessage}>C'est un match ! Démarrez la conversation</Text>
        )}
      </View>

      <View style={styles.timeContainer}>
        {match.lastMessage && (
          <Text style={styles.time}>
            {new Date(match.lastMessage.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        )}
        {match.unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{match.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#FF4458" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>

      {matches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#FF4458" />
          </View>
          <Text style={styles.emptyTitle}>Aucune conversation</Text>
          <Text style={styles.emptyText}>
            Commencez à swiper et matcher{'\n'}pour démarrer des conversations !
          </Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF4458',
    letterSpacing: 0.5,
  },
  list: {
    padding: 12,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingVertical: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
    minHeight: 88,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
    width: 60,
    height: 60,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
  },
  avatarFallback: {
    backgroundColor: '#FF4458',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarFallbackText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#34D399',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  messageInfo: {
    flex: 1,
    marginRight: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  lastMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  noMessage: {
    fontSize: 14,
    color: '#FF4458',
    fontStyle: 'italic',
    opacity: 0.8,
  },
  timeContainer: {
    alignItems: 'flex-end',
    minWidth: 65,
    height: '100%',
    justifyContent: 'flex-start',
    paddingTop: 3,
  },
  time: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  badge: {
    backgroundColor: '#FF4458',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 68, 88, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
