import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue,
  withSpring 
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.7;

interface Profile {
  _id: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  location: string;
  bio: string;
  preferences: {
    gender: string;
    ageRange: {
      min: number;
      max: number;
    };
  };
  photos: {
    _id: string;
    photoUrl: string;
  }[];
  age: number;
}

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right') => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ profile, onSwipe }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate.value}deg` },
      ],
    };
  });

  const nextPhoto = () => {
    if (currentPhotoIndex < profile.photos.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1);
    }
  };

  return (
    <Animated.View style={[styles.card, cardStyle]}>
      <View style={styles.photoContainer}>
        <Image
          source={{ uri: profile.photos[currentPhotoIndex].photoUrl }}
          style={styles.photo}
        />
        
        {/* Navigation des photos */}
        <View style={styles.photoNavigation}>
          {profile.photos.map((_, index) => (
            <View
              key={index}
              style={[
                styles.photoIndicator,
                index === currentPhotoIndex && styles.photoIndicatorActive,
              ]}
            />
          ))}
        </View>

        {/* Boutons précédent/suivant */}
        <TouchableOpacity style={styles.prevButton} onPress={prevPhoto}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={nextPhoto}>
          <Ionicons name="chevron-forward" size={30} color="white" />
        </TouchableOpacity>

        {/* Informations de base */}
        <View style={styles.profileInfo}>
          <Text style={styles.name}>
            {profile.firstName}, {profile.age}
          </Text>
          <Text style={styles.location}>{profile.location}</Text>
        </View>

        {/* Bouton pour afficher plus d'informations */}
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => setShowDetails(!showDetails)}
        >
          <Ionicons
            name={showDetails ? 'chevron-down' : 'chevron-up'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* Détails du profil */}
      {showDetails && (
        <View style={styles.details}>
          <Text style={styles.bioTitle}>Bio</Text>
          <Text style={styles.bioText}>{profile.bio}</Text>
          
          <Text style={styles.preferencesTitle}>Préférences</Text>
          <View style={styles.preferences}>
            <View style={styles.preference}>
              <Text>Genre : {profile.preferences.gender}</Text>
            </View>
            <View style={styles.preference}>
              <Text>
                Âge : {profile.preferences.ageRange.min} - {profile.preferences.ageRange.max} ans
              </Text>
            </View>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
  },
  photoContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoNavigation: {
    position: 'absolute',
    top: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  photoIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  photoIndicatorActive: {
    backgroundColor: 'white',
  },
  prevButton: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -15 }],
  },
  nextButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -15 }],
  },
  profileInfo: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
  },
  name: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  location: {
    color: 'white',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  infoButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  details: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  preferencesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  preferences: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  preference: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
}); 