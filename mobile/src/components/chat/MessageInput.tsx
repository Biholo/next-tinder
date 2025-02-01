import React from 'react';
import { View, TextInput, TouchableOpacity, Text, Animated, KeyboardAvoidingView, Platform } from "react-native";

interface MessageInputProps {
  message: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ message, onChangeText, onSend }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="border-t border-zinc-800"
    >
      <View className="flex-row items-center p-2">
        <View className="flex-1 flex-row items-center bg-zinc-800 rounded-full px-4 py-2">
          <TextInput
            placeholder="Rédiger un message..."
            placeholderTextColor="#666"
            className="flex-1 text-white"
            value={message}
            onChangeText={onChangeText}
          />
          <Animated.View
            style={{
              opacity: message.length > 0 ? 1 : 0.5,
              transform: [
                {
                  scale: message.length > 0 ? 1 : 0.9,
                },
              ],
            }}
          >
            <TouchableOpacity
              disabled={message.length === 0}
              onPress={onSend}
            >
              <Text className={`${message.length > 0 ? "text-[#0095f6]" : "text-zinc-500"}`}>
                Envoyer
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}; 