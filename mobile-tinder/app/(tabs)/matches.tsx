import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../src/store/store';
import { getMatches, type MatchWithDetails } from '../../src/store/slices/matchSlice';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MatchesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { matches, isLoading } = useSelector((state: RootState) => state.match);

  useEffect(() => {
    dispatch(getMatches());
  }, [dispatch]);

  // Ajout des logs pour déboguer
  useEffect(() => {
    if (matches.length > 0) {
      console.log('Matches reçus:', matches);
      console.log('Premier match:', matches[0]);
      console.log('Infos utilisateur du premier match:', matches[0].user);
    }
  }, [matches]);

  const newMatches = matches
    .filter(match => !match.lastMessage)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const renderItem = ({ item: match }: { item: MatchWithDetails }) => {
    // Log en dehors du JSX
    console.log('Rendu du match:', {
      id: match._id,
      user: match.user,
      firstName: match.user.firstName
    });

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/chat/${match._id}`)}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          {match.user.photos && match.user.photos[0] ? (
            <Image
              source={{ uri: match.user.photos[0].photoUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.image, styles.imageFallback]}>
              <Text style={styles.imageFallbackText}>
                {match.user.firstName ? match.user.firstName[0] : '?'}
              </Text>
            </View>
          )}
          <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {match.user.firstName || 'Utilisateur'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.messageButton}
          onPress={() => router.push(`/chat/${match._id}`)}
          activeOpacity={0.7}
        >
          <Ionicons name="chatbubble-outline" size={18} color="#FF4458" />
          <Text style={styles.messageButtonText}>
            Envoyer un message
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {newMatches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="heart-outline" size={48} color="#FF4458" />
          </View>
          <Text style={styles.emptyTitle}>
            Aucun nouveau match
          </Text>
          <Text style={styles.emptyText}>
            Continuez à swiper pour{'\n'}trouver de nouveaux matchs !
          </Text>
        </View>
      ) : (
        <FlatList
          data={newMatches}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          numColumns={2}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    width: '48%',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
  },
  imageFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageFallbackText: {
    color: '#9CA3AF',
    fontSize: 32,
    fontWeight: '500',
  },
  nameContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    gap: 6,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
  },
  messageButtonText: {
    color: '#FF4458',
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF4458',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
