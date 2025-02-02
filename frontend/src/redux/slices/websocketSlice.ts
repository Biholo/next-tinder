import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypingEvent, MessageEvent, MatchEvent, MessageReadEvent } from '@/models/websocket';

interface WebSocketState {
  typingUsers: Record<string, boolean>;
  onlineUsers: Record<string, boolean>;
  readMessages: Record<string, string[]>; // matchId -> messageIds[]
  newMatches: Record<string, boolean>; // matchId -> boolean
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
  newMatches: {},
  lastMessages: {},
  isConnected: false
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    setTypingStatus: (state, action: PayloadAction<{ matchId: string; isTyping: boolean }>) => {
      console.log('🔹 setTypingStatus:', action.payload)
      state.typingUsers = {
        ...state.typingUsers,
        [action.payload.match_id]: true
      };
    },
    setUserOnlineStatus: (state, action: PayloadAction<{ userId: string; isOnline: boolean }>) => {
      console.log('🔹 setUserOnlineStatus:', action.payload)
      state.onlineUsers = {
        ...state.onlineUsers,
        [action.payload.userId]: true
      };
    },
    removeUserOnlineStatus: (state, action: PayloadAction<string>) => {
      const { [action.payload]: _, ...rest } = state.onlineUsers;
      state.onlineUsers = rest;
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
    setNewMatch: (state, action: PayloadAction<{ matchId: string }>) => {
      state.newMatches = {
        ...state.newMatches,
        [action.payload.matchId]: true
      };
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    clearTypingStatus: (state, action: PayloadAction<string>) => {
      const { [action.payload]: _, ...rest } = state.typingUsers;
      state.typingUsers = rest;
    },
    

  }
});

export const {
  setTypingStatus,
  addReadMessage,
  setLastMessage,
  setConnectionStatus,
  setUserOnlineStatus,
  removeUserOnlineStatus,
  setNewMatch,
  clearTypingStatus
} = websocketSlice.actions;

export default websocketSlice.reducer;
