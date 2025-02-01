import React from 'react';
import { LinearGradient } from "expo-linear-gradient";

interface GradientBackgroundProps {
  children: React.ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ children }) => {
  return (
    <LinearGradient 
      colors={["#ec4899", "#f97316"]} 
      start={{ x: 0, y: 0 }} 
      end={{ x: 1, y: 1 }} 
      className="flex-1"
    >
      {children}
    </LinearGradient>
  );
}; 