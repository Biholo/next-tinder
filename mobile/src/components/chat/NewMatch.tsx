import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface NewMatchProps {
  match: any;
  onPress: () => void;
}

export const NewMatch = ({ match, onPress }: NewMatchProps) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="mr-4 items-center"
    >
      <View className="relative w-16 h-16">
        <Image 
          source={{ uri: match.otherUser.photos[0]?.photoUrl || "/placeholder.svg" }}
          className="w-full h-full rounded-full"
        />
        {match.otherUser.online && (
          <View className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
        )}
      </View>
      <Text className="text-white text-sm mt-1">{match.otherUser.firstName}</Text>
      <Text className="text-xs text-gray-400">
        {format(new Date(match.createdAt), "dd/MM", { locale: fr })}
      </Text>
    </TouchableOpacity>
  );
}; 