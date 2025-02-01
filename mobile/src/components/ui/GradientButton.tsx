import React from 'react';
import { TouchableOpacity, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface GradientButtonProps {
  onPress: () => void;
  title: string;
}

export const GradientButton: React.FC<GradientButtonProps> = ({ onPress, title }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={["#ec4899", "#f97316"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="py-3 rounded-full overflow-hidden"
      >
        <Text className="text-white font-bold text-center">{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}; 