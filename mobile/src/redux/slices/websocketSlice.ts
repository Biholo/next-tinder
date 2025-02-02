import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypingEvent, MessageEvent, MatchEvent, MessageReadEvent } from '@/models/websocket';

interface WebsocketState {
  onlineUsers: { [key: string]: boolean };
  typingStates: { [key: string]: boolean };
  readMessages: Record<string, string[]>; // matchId -> messageIds[]
  lastMessages: Record<string, {
    content: string;
    timestamp: string;
    senderId: string;
  }>;
  isConnected: boolean;
}

const initialState: WebsocketState = {
  onlineUsers: {},
  typingStates: {},
  readMessages: {},
  lastMessages: {},
  isConnected: false
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    setOnlineUsers: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.onlineUsers = action.payload;
    },
    updateOnlineStatus: (state, action: PayloadAction<{ userId: string; isOnline: boolean }>) => {
      state.onlineUsers[action.payload.userId] = action.payload.isOnline;
    },
    setTypingState: (state, action: PayloadAction<{ matchId: string; isTyping: boolean }>) => {
      state.typingStates[action.payload.matchId] = action.payload.isTyping;
    },
    addReadMessage: (state, action: PayloadAction<{ matchId: string; messageId: string }>) => {
      const currentMessages = state.readMessages[action.payload.matchId] || [];
      state.readMessages = {
        ...state.readMessages,
        [action.payload.matchId]: [...currentMessages, action.payload.messageId]
      };
    },
    setLastMessage: (state, action: PayloadAction<{
      matchId: string;
      content: string;
      timestamp: string;
      senderId: string;
    }>) => {
      state.lastMessages = {
        ...state.lastMessages,
        [action.payload.matchId]: {
          content: action.payload.content,
          timestamp: action.payload.timestamp,
          senderId: action.payload.senderId
        }
      };
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    clearTypingStatus: (state, action: PayloadAction<string>) => {
      console.log('🔹 clearTypingStatus:', action.payload)
      const { [action.payload]: _, ...rest } = state.typingStates;
      state.typingStates = rest;
    }
  }
});

export const {
  setOnlineUsers,
  updateOnlineStatus,
  setTypingState,
  addReadMessage,
  setLastMessage,
  setConnectionStatus,
  clearTypingStatus
} = websocketSlice.actions;

export default websocketSlice.reducer;
