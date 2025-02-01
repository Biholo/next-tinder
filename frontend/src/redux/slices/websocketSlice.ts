import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypingEvent, MessageEvent, MatchEvent, MessageReadEvent } from '@/models/websocket';

interface WebSocketState {
  typingUsers: Record<string, boolean>;
  onlineUsers: Record<string, boolean>;
  readMessages: Record<string, string[]>; // matchId -> messageIds[]
  lastMessages: Record<string, {
    content: string;
    timestamp: string;
    senderId: string;
  }>;
  isConnected: boolean;
}

const initialState: WebSocketState = {
  typingUsers: {},
  onlineUsers: {},
  readMessages: {},
  lastMessages: {},
  isConnected: false
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    setTypingStatus: (state, action: PayloadAction<{ matchId: string; isTyping: boolean }>) => {
      state.typingUsers = {
        ...state.typingUsers,
        [action.payload.matchId]: action.payload.isTyping
      };
    },
    setUserOnlineStatus: (state, action: PayloadAction<{ userId: string; isOnline: boolean }>) => {
      state.onlineUsers = {
        ...state.onlineUsers,
        [action.payload.userId]: action.payload.isOnline
      };
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
      const { [action.payload]: _, ...rest } = state.typingUsers;
      state.typingUsers = rest;
    }
  }
});

export const {
  setTypingStatus,
  setUserOnlineStatus,
  addReadMessage,
  setLastMessage,
  setConnectionStatus,
  clearTypingStatus
} = websocketSlice.actions;

export default websocketSlice.reducer;
