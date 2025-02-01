import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MatchUser {
  _id: string;
  firstName: string;
  photos: Array<{ photoUrl: string }>;
  online?: boolean;
}

interface Match {
  _id: string;
  createdAt: string | Date;
  user: MatchUser;
  lastMessage?: any;
}

interface NewMatchProps {
  match: Match;
  onPress: () => void;
}

export const NewMatch = ({ match, onPress }: NewMatchProps) => {
  const defaultImage = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-mJXBl7iepu0PcsBCV3p2hq90HAMcku.png";
  
  const photoUrl = match.user?.photos?.[0]?.photoUrl || defaultImage;
  const firstName = match.user?.firstName || "Utilisateur";
  const matchDate = match.createdAt ? format(new Date(match.createdAt), "dd/MM", { locale: fr }) : "";

  return (
    <TouchableOpacity 
      onPress={onPress}
      className="mr-4 items-center"
    >
      <View className="relative w-16 h-16">
        <Image 
          source={{ uri: photoUrl }}
          className="w-full h-full rounded-full"
        />
        {match.user?.online && (
          <View className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
        )}
      </View>
      <Text className="text-white text-sm mt-1">{firstName}</Text>
      <Text className="text-xs text-gray-400">{matchDate}</Text>
    </TouchableOpacity>
  );
}; 