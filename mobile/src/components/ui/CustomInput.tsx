import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface CustomInputProps extends TextInputProps {
  className?: string;
  error?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({ className, error, ...props }) => {
  return (
    <TextInput
      className={`px-4 py-3 rounded-full border ${error ? 'border-red-500' : 'border-gray-300'} mb-4 ${className || ''}`}
      {...props}
    />
  );
}; 