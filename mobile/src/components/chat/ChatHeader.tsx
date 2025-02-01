import React from 'react';
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface ChatHeaderProps {
  name: string;
  isOnline: boolean;
  photoUrl: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ name, isOnline, photoUrl }) => {
  const router = useRouter();
  
  return (
    <View className="flex-row items-center px-4 py-2 border-b border-zinc-800">
      <TouchableOpacity onPress={() => router.back()} className="mr-3">
        <Ionicons name="chevron-back" size={28} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/stack/details-profile")}
        className="flex-1 flex-row items-center"
      >
        <View className="relative">
          <Image source={{ uri: photoUrl }} className="w-8 h-8 rounded-full" />
          {isOnline && (
            <View className="absolute right-0 bottom-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-zinc-950" />
          )}
        </View>
        <Text className="text-white text-lg font-semibold ml-3">{name}</Text>
      </TouchableOpacity>
    </View>
  );
}; 