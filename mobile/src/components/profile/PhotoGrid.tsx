import React from 'react';
import { View, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface PhotoGridProps {
  photos: string[];
  onDeletePhoto: (index: number) => void;
  onAddPhoto: () => void;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onDeletePhoto, onAddPhoto }) => {
  return (
    <View className="flex-row flex-wrap" style={{ gap: 4 }}>
      {photos.map((photo, index) => (
        <View key={index} className="relative" style={{ width: "32%", aspectRatio: 1 }}>
          <Image source={{ uri: photo }} className="w-full h-full rounded-lg" />
          <TouchableOpacity
            onPress={() => onDeletePhoto(index)}
            className="absolute top-2 right-2 bg-black/60 rounded-full p-1"
          >
            <Feather name="x" size={20} color="white" />
          </TouchableOpacity>
        </View>
      ))}

      {photos.length < 9 && (
        <TouchableOpacity
          onPress={onAddPhoto}
          style={{ width: "32%", aspectRatio: 1 }}
          className="bg-zinc-800/40 rounded-lg border-2 border-dashed border-zinc-700 items-center justify-center"
        >
          <View className="bg-[#FF4458] rounded-full p-2">
            <Feather name="plus" size={24} color="white" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}; 