import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootState, AppDispatch } from '../../../src/store/store';
import { getMatches } from '../../../src/store/slices/matchSlice';
import api from '../../../src/services/api';
import ws from '../../../src/services/websocket';

interface Message {
  _id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isOwnMessage?: boolean;
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const match = useSelector((state: RootState) => 
    state.match.matches.find(m => m._id === id)
  );

  useEffect(() => {
    if (!match) {
      dispatch(getMatches());
    }
    loadMessages();
    ws.connect();

    // S'abonner aux événements WebSocket
    const unsubscribeMessage = ws.onMessage((data) => {
      if (data.match_id === id) {
        const newMessage = {
          _id: data.message_id,
          content: data.content,
          senderId: data.sender_id,
          createdAt: data.created_at,
          isOwnMessage: false
        };
        setMessages(prev => [...prev, newMessage]);
        flatListRef.current?.scrollToEnd();
      }
    });

    const unsubscribeTyping = ws.onTyping((data) => {
      if (data.match_id === id) {
        setIsTyping(data.is_typing);
      }
    });

    return () => {
      unsubscribeMessage();
      unsubscribeTyping();
      ws.disconnect();
    };
  }, [id, dispatch]);

  const loadMessages = async () => {
    try {
      const response = await api.getMessages(id as string);
      console.log('Réponse du backend (messages):', response);
      setMessages(response.data.data.messages || []);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTyping = (text: string) => {
    setNewMessage(text);

    // Envoyer l'événement "typing" avec debounce
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (match) {
      ws.sendTyping(id as string, match.user._id, true);
      typingTimeoutRef.current = setTimeout(() => {
        ws.sendTyping(id as string, match.user._id, false);
      }, 1000);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !match) return;

    try {
      // Envoyer via WebSocket
      ws.sendMessage(id as string, newMessage.trim(), match.user._id);
      
      // Envoyer via API REST (backup)
      const response = await api.sendMessage(id as string, newMessage.trim());
      console.log('Réponse du backend (envoi):', response);
      
      // Ajouter le message localement
      const newMsg = {
        _id: response.data.data._id,
        content: newMessage.trim(),
        senderId: response.data.data.senderId,
        createdAt: response.data.data.createdAt,
        isOwnMessage: true
      };
      setMessages(prev => [...prev, newMsg]);
      
      setNewMessage('');
      flatListRef.current?.scrollToEnd();
      
      // Arrêter l'indicateur de frappe
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        ws.sendTyping(id as string, match.user._id, false);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isOwnMessage ? styles.ownMessage : styles.otherMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.isOwnMessage ? styles.ownMessageText : styles.otherMessageText
      ]}>
        {item.content}
      </Text>
      <Text style={styles.messageTime}>
        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  if (!match) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { paddingTop: insets.top }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          {match.user.photos && match.user.photos[0] ? (
            <Image 
              source={{ uri: match.user.photos[0].photoUrl }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarText}>
                {match.user.firstName ? match.user.firstName[0] : '?'}
              </Text>
            </View>
          )}
          <Text style={styles.userName}>{match.user.firstName || 'Utilisateur'}</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
      />

      {isTyping && (
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>{match.user.firstName} est en train d'écrire...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={handleTyping}
          placeholder="Écrivez votre message..."
          placeholderTextColor="#666"
          multiline
        />
        <TouchableOpacity 
          onPress={sendMessage}
          style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
          disabled={!newMessage.trim()}
        >
          <Ionicons 
            name="send" 
            size={24} 
            color={newMessage.trim() ? '#FF4458' : '#999'} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatarFallback: {
    backgroundColor: '#FF4458',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
  },
  messagesList: {
    padding: 15,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 5,
    padding: 12,
    borderRadius: 20,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF4458',
    borderBottomRightRadius: 5,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  ownMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#000',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    padding: 10,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  typingContainer: {
    padding: 8,
    backgroundColor: '#f8f8f8',
  },
  typingText: {
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
  },
});
