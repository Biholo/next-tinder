import React from 'react';
import { View, Image, FlatList, Dimensions } from "react-native";

const { width } = Dimensions.get("window")

interface PhotoCarouselProps {
  photos: string[];
  currentPhotoIndex: number;
  onPhotoChange: (index: number) => void;
}

export const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ 
  photos, 
  currentPhotoIndex, 
  onPhotoChange 
}) => {
  const renderPhoto = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={{ width, aspectRatio: 1 }} className="h-full" />
  );

  return (
    <View className="w-full aspect-square">
      <FlatList
        data={photos}
        renderItem={renderPhoto}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          onPhotoChange(newIndex);
        }}
      />
      <View className="absolute top-4 w-full flex-row justify-center space-x-1">
        {photos.map((_, index) => (
          <View
            key={index}
            className={`h-1 rounded-full w-16 ${index === currentPhotoIndex ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </View>
    </View>
  );
}; 