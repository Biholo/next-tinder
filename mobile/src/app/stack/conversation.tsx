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
import { useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { wsService } from "@/services/websocketService"
import { getMessages } from "@/redux/slices/messageSlice"
import { Message } from "@/models"
import { format } from "date-fns"

interface Message {
  _id: string;
  matchId: string;
  senderId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isOwnMessage: boolean;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  photos: Array<{ photoUrl: string }>;
  age: number;
  bio: string;
}

interface Match {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  // États locaux
  const [messages, setMessages] = useState<Message[]>([])
  const [otherUser, setOtherUser] = useState<User | null>(null)
  const [match, setMatch] = useState<Match | null>(null)
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  
  const dotAnimation = useRef(new Animated.Value(0)).current
  const scrollViewRef = useRef<ScrollView>(null)
  const { user: currentUser } = useAppSelector((state) => state.auth)

  console.log('🎯 ID de la conversation:', id);

  // Charger les messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!id) {
          console.error('❌ Pas d\'ID de conversation trouvé');
          router.back();
          return;
        }

        const response = await dispatch(getMessages(id)).unwrap();
        console.log('✅ Messages récupérés:', response);
        
        if (response) {
          setMessages(response.messages);
          setOtherUser(response.otherUser);
          setMatch(response.match);
        }
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des messages:', error);
        router.back();
      }
    };

    fetchMessages();
  }, [id, dispatch]);

  // Gestion du WebSocket
  useEffect(() => {
    if (id) {
      const handleNewMessage = (data: any) => {
        if (data.match_id === id) {
          const newMessage: Message = {
            _id: data.message_id || Date.now().toString(),
            matchId: id,
            senderId: data.sender_id,
            content: data.content,
            createdAt: data.created_at || new Date().toISOString(),
            updatedAt: data.created_at || new Date().toISOString(),
            isOwnMessage: data.sender_id === currentUser?._id
          };
          setMessages(prev => [...prev, newMessage]);
          setIsTyping(false);
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }
      };

      const handleTyping = (data: any) => {
        if (data.match_id === id && data.sender_id !== currentUser?._id) {
          setIsTyping(true)
          startDotAnimation()
          setTimeout(() => setIsTyping(false), 3000)
        }
      }

      wsService.addEventListener('receive_message', handleNewMessage)
      wsService.addEventListener('user_typing_display', handleTyping)

      return () => {
        wsService.removeEventListener('receive_message', handleNewMessage)
        wsService.removeEventListener('user_typing_display', handleTyping)
      }
    }
  }, [id, currentUser?._id])

  // Animation des points de typing
  const startDotAnimation = () => {
    Animated.loop(
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
    ).start()
  }

  const handleSend = () => {
    if (!message.trim() || !id) return

    wsService.sendMessage(id.toString(), message)
    setMessage("")
  }

  const handleInputChange = (text: string) => {
    setMessage(text)
    if (id) {
      wsService.sendTypingStatus(id.toString(), currentUser?._id)
    }
  }

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
          onPress={() => router.push(`/stack/details-profile?id=${otherUser?._id}`)}
          className="flex-1 flex-row items-center"
        >
          <View className="relative">
            <Image 
              source={{ uri: otherUser?.photos?.[0]?.photoUrl }} 
              className="w-8 h-8 rounded-full" 
            />
          </View>
          <View className="ml-3">
            <Text className="text-white text-lg font-semibold">
              {otherUser?.firstName}, {otherUser?.age}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4"
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => (
          <View 
            key={msg._id}
            className={`flex-row items-end mb-4 ${
              msg.isOwnMessage ? "justify-end" : "justify-start"
            }`}
          >
            {!msg.isOwnMessage && (
              <Image 
                source={{ uri: otherUser?.photos?.[0]?.photoUrl }} 
                className="w-8 h-8 rounded-full mr-2" 
              />
            )}
            <View 
              className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                msg.isOwnMessage 
                  ? "bg-[#0095f6] rounded-br-none" 
                  : "bg-zinc-800 rounded-bl-none"
              }`}
            >
              <Text className="text-white">{msg.content}</Text>
              <Text className="text-xs text-white/60 mt-1">
                {format(new Date(msg.createdAt), "HH:mm")}
              </Text>
            </View>
          </View>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <View className="flex-row items-center mb-4">
            <Image 
              source={{ uri: otherUser?.photos?.[0]?.photoUrl }} 
              className="w-8 h-8 rounded-full mr-2" 
            />
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
              onChangeText={handleInputChange}
            />
            <Animated.View
              style={{
                opacity: message.length > 0 ? 1 : 0.5,
                transform: [{ scale: message.length > 0 ? 1 : 0.9 }],
              }}
            >
              <TouchableOpacity
                disabled={message.length === 0}
                onPress={handleSend}
              >
                <Text className={`${message.length > 0 ? "text-[#0095f6]" : "text-zinc-500"}`}>
                  Envoyer
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

