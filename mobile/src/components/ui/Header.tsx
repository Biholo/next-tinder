import { View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type HeaderProps = {
  showBackButton?: boolean;
  showSettingsButton?: boolean;
  logoUrl?: string;
};

export function Header({ showBackButton, showSettingsButton, logoUrl }: HeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-2">
      {logoUrl && (
        <Image 
          source={{ uri: logoUrl }}
          className="h-8 w-24 object-contain"
        />
      )}
      {showSettingsButton && (
        <TouchableOpacity>
          <Ionicons name="shield-outline" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
} 