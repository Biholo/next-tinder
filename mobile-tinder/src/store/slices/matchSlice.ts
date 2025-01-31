import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';
import type { Match, Message } from '@/types';
import { RootState } from '../store';

export interface MatchWithDetails extends Omit<Match, 'user1_id' | 'user2_id'> {
  match_id: string;
  user: {
    _id: string;
    firstName: string;
    photos: {
      _id: string;
      photoUrl: string;
    }[];
    age: number;
    isOnline?: boolean;
  };
  lastMessage: Message | null;
  unreadCount: number;
}

interface MatchState {
  matches: MatchWithDetails[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MatchState = {
  matches: [],
  isLoading: false,
  error: null,
};

export const getMatches = createAsyncThunk(
  'match/getMatches',
  async () => {
    const response = await api.getMatches();
    console.log('Données brutes du backend:', JSON.stringify(response.data, null, 2));
    
    return response.data.map((match: any) => {
      console.log('Match individuel:', JSON.stringify(match, null, 2));
      
      if (!match.user) {
        console.error('Utilisateur manquant dans le match:', match);
        return null;
      }

      return {
        _id: match.match_id,
        createdAt: match.createdAt,
        updatedAt: match.updatedAt || match.createdAt,
        user: {
          _id: match.user._id || match.match_id,
          firstName: match.user.firstName || 'Utilisateur',
          photos: match.user.photos || [],
          age: match.user.age || 0,
          isOnline: false,
        },
        lastMessage: match.lastMessage || null,
        unreadCount: 0
      };
    }).filter(Boolean);
  }
);

const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    setUnreadCount: (state, action) => {
      const { matchId, count } = action.payload;
      const match = state.matches.find(m => m._id === matchId);
      if (match) {
        match.unreadCount = count;
      }
    },
    setUserOnline: (state, action) => {
      const { userId, isOnline } = action.payload;
      state.matches.forEach(match => {
        if (match.user._id === userId) {
          match.user.isOnline = isOnline;
        }
      });
    },
    updateLastMessage: (state, action) => {
      const { matchId, message } = action.payload;
      const match = state.matches.find(m => m._id === matchId);
      if (match) {
        match.lastMessage = message;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMatches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.matches = action.payload;
      })
      .addCase(getMatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      });
  },
});

export const { setUnreadCount, setUserOnline, updateLastMessage } = matchSlice.actions;
export default matchSlice.reducer; 