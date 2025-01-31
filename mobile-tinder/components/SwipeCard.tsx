import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import type { Profile } from '@/store/slices/userSlice';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.7;

export interface SwipeCardProps {
  profile: Profile;
  currentImageIndex: number;
  onNextImage: () => void;
  onPrevImage: () => void;
  isFirst?: boolean;
}

export function SwipeCard({ profile, currentImageIndex, onNextImage, onPrevImage, isFirst = false }: SwipeCardProps) {
  const mainPhoto = profile.photos[currentImageIndex]?.photoUrl || 'https://picsum.photos/500/600';

  return (
    <Animated.View style={[styles.card, isFirst && styles.firstCard]}>
      <Image source={{ uri: mainPhoto }} style={styles.image} />
      
      {profile.photos.length > 1 && (
        <>
          <TouchableOpacity style={[styles.imageButton, styles.prevButton]} onPress={onPrevImage}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.imageButton, styles.nextButton]} onPress={onNextImage}>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>
              {currentImageIndex + 1}/{profile.photos.length}
            </Text>
          </View>
        </>
      )}
      
      <View style={styles.infoContainer}>
        <Text style={styles.name}>
          {profile.firstName}, {profile.age}
        </Text>
        
        <Text style={styles.location}>
          {profile.location}
        </Text>
        
        <Text style={styles.bio} numberOfLines={3}>
          {profile.bio}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: 'white',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  firstCard: {
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  imageButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevButton: {
    left: 10,
  },
  nextButton: {
    right: 10,
  },
  imageCounter: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCounterText: {
    color: 'white',
    fontSize: 12,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  name: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  location: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  bio: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
  },
}); 