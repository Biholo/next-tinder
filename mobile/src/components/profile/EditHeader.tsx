import React from 'react';
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface EditHeaderProps {
  title: string;
  onSave: () => void;
}

export const EditHeader: React.FC<EditHeaderProps> = ({ title, onSave }) => {
  const router = useRouter();
  
  return (
    <View className="flex-row items-center justify-between px-4 py-2 border-b border-zinc-800">
      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="chevron-back" size={28} color="#FF4458" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-semibold">{title}</Text>
      </View>
      <TouchableOpacity onPress={onSave}>
        <Text className="text-[#FF4458] text-lg font-semibold">Terminé</Text>
      </TouchableOpacity>
    </View>
  );
}; 