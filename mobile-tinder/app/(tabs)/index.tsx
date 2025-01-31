import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { getUsersToSwipe } from '@/store/slices/userSlice';
import { createSwipe } from '@/store/slices/swipeSlice';
import { SwipeCard } from '@/components/SwipeCard';
import { Ionicons } from '@expo/vector-icons';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export default function SwipeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const profiles = useSelector((state: RootState) => state.user.profiles);
  const isLoading = useSelector((state: RootState) => state.user.isLoading);

  useEffect(() => {
    dispatch(getUsersToSwipe());
  }, [dispatch]);

  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const rotate = useSharedValue(0);

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: x.value },
        { translateY: y.value },
        { rotate: `${rotate.value}deg` },
      ],
    };
  });

  const handleSwipe = async (direction: 'LIKE' | 'DISLIKE') => {
    if (currentIndex >= profiles.length) return;

    const currentProfile = profiles[currentIndex];
    await dispatch(createSwipe({
      target_user_id: currentProfile._id,
      direction,
    }));

    setCurrentIndex(prev => prev + 1);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    const currentProfile = profiles[currentIndex];
    const photos = currentProfile?.photos || [];
    
    setCurrentImageIndex(prev => 
      photos.length === 1 ? 0 : (prev + 1) % photos.length
    );
  };

  const prevImage = () => {
    const currentProfile = profiles[currentIndex];
    const photos = currentProfile?.photos || [];
    
    setCurrentImageIndex(prev => 
      photos.length === 1 ? 0 : (prev - 1 + photos.length) % photos.length
    );
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      x.value = event.translationX;
      y.value = event.translationY;
      rotate.value = interpolate(
        event.translationX,
        [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
        [-15, 0, 15]
      );
    })
    .onEnd((event) => {
      const shouldSwipe = Math.abs(event.velocityX) > 400 || Math.abs(x.value) > SWIPE_THRESHOLD;
      
      if (shouldSwipe) {
        const direction = (event.velocityX > 0 || x.value > SWIPE_THRESHOLD) ? 'LIKE' : 'DISLIKE';
        x.value = withSpring(direction === 'LIKE' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5, {
          velocity: event.velocityX
        });
        y.value = withSpring(0);
        runOnJS(handleSwipe)(direction);
      } else {
        x.value = withSpring(0);
        y.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#EC4899" />
      </View>
    );
  }

  if (!profiles.length || currentIndex >= profiles.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.noProfilesText}>
          Plus aucun profil disponible pour le moment !
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {profiles.slice(currentIndex, currentIndex + 2).map((profile, index) => {
        const isFirst = index === 0;
        
        return (
          <View key={profile._id} style={StyleSheet.absoluteFill}>
            {isFirst ? (
              <GestureDetector gesture={panGesture}>
                <Animated.View style={[StyleSheet.absoluteFill, cardStyle]}>
                  <SwipeCard
                    profile={profile}
                    currentImageIndex={currentImageIndex}
                    onNextImage={nextImage}
                    onPrevImage={prevImage}
                    isFirst={true}
                  />
                </Animated.View>
              </GestureDetector>
            ) : (
              <SwipeCard
                profile={profile}
                currentImageIndex={0}
                onNextImage={() => {}}
                onPrevImage={() => {}}
              />
            )}
          </View>
        );
      })}

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.dislikeButton]}
          onPress={() => handleSwipe('DISLIKE')}
        >
          <Ionicons name="close" size={30} color="#F43F5E" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.likeButton]}
          onPress={() => handleSwipe('LIKE')}
        >
          <Ionicons name="heart" size={30} color="#10B981" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  noProfilesText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dislikeButton: {
    borderWidth: 2,
    borderColor: '#F43F5E',
  },
  likeButton: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
});
