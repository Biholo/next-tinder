import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import images from '@/constants/image';

interface HeaderProps {
  showBackButton?: boolean;
  showSettingsButton?: boolean;
  title?: string;
  rightComponent?: React.ReactNode;
}

export const Header = ({ 
  showBackButton = false, 
  showSettingsButton = false,
  title,
  rightComponent
}: HeaderProps) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-4 py-2 border-b border-zinc-800">
      <View className="flex-row items-center">
        {showBackButton && (
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="chevron-back" size={28} color="#FF4458" />
          </TouchableOpacity>
        )}
        
        {title ? (
          <Text className="text-white text-xl font-semibold">{title}</Text>
        ) : (
          <Image
            source={images.logo}
            className="w-[24px] h-[24px]"
            resizeMode="contain"
          />
        )}
      </View>

      <View className="flex-row items-center">
        {showSettingsButton && (
          <TouchableOpacity 
            onPress={() => router.push("/stack/edit-profile")}
            className="ml-4"
          >
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        )}
        {rightComponent}
      </View>
    </View>
  );
}; 