import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Ionicons, Feather } from "@expo/vector-icons"

export default function ConversationScreen() {
  const router = useRouter()
  const [isTyping, setIsTyping] = useState(true)
  const [isOnline, setIsOnline] = useState(true)
  const [message, setMessage] = useState("")
  const dotAnimation = useRef(new Animated.Value(0)).current
  const scrollViewRef = useRef<ScrollView>(null)

  // Simulate typing animation
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnimation, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnimation, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ]),
    )

    if (isTyping) {
      animation.start()
    } else {
      animation.stop()
      dotAnimation.setValue(0)
    }

    return () => animation.stop()
  }, [isTyping, dotAnimation])

  // Simulate user typing status
  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      setIsTyping(message.length > 0)
    }, 300)

    return () => clearTimeout(typingTimeout)
  }, [message])

  const dots = [0, 1, 2].map((index) => (
    <Animated.View
      key={index}
      style={{
        opacity: dotAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.3, 1],
        }),
        transform: [
          {
            scale: dotAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
          },
        ],
      }}
      className="w-1.5 h-1.5 bg-white rounded-full mx-0.5"
    />
  ))

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      {/* Header */}
      <View className="flex-row items-center px-4 py-2 border-b border-zinc-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>

        {/* Profile Info */}
        <TouchableOpacity
          onPress={() => router.push("/stack/details-profile")}
          className="flex-1 flex-row items-center"
        >
          <View className="relative">
            <Image source={{ uri: "/placeholder.svg" }} className="w-8 h-8 rounded-full" />
            {isOnline && (
              <View className="absolute right-0 bottom-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-zinc-950" />
            )}
          </View>
          <Text className="text-white text-lg font-semibold ml-3">Emilie</Text>
        </TouchableOpacity>

      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4"
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {/* Date Header */}
        <View className="items-center my-4">
          <Text className="text-zinc-500 text-sm">mer., 31 juil. 2024, 11:41</Text>
        </View>

        {/* Message */}
        <View className="flex-row items-end mb-4">
          <Image source={{ uri: "/placeholder.svg" }} className="w-8 h-8 rounded-full mr-2" />
          <View className="bg-zinc-800 rounded-2xl rounded-bl-none px-4 py-3 max-w-[80%]">
            <Text className="text-white">Salut cv</Text>
          </View>
        </View>

        {/* Typing Indicator */}
        {isTyping && (
          <View className="flex-row items-center mb-4">
            <Image source={{ uri: "/placeholder.svg" }} className="w-8 h-8 rounded-full mr-2" />
            <View className="bg-zinc-800 rounded-2xl rounded-bl-none px-4 py-3">
              <View className="flex-row items-center">{dots}</View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Message Input */}
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
              onChangeText={setMessage}
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
                onPress={() => {
                  // Handle send message
                  setMessage("")
                }}
              >
                <Text className={`${message.length > 0 ? "text-[#0095f6]" : "text-zinc-500"}`}>Envoyer</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

