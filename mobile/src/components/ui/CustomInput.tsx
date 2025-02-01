import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface CustomInputProps extends TextInputProps {
  className?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({ className, ...props }) => {
  return (
    <TextInput
      className={`px-4 py-3 rounded-full border border-gray-300 mb-4 ${className}`}
      {...props}
    />
  );
}; 