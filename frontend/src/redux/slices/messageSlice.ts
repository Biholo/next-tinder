import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Match, Message, User } from '@/models'
import MessageService from '@/services/messageService'
import { createAsyncThunk } from '@reduxjs/toolkit'

interface ChatState {
  currentUser: User | null
  matches: Match[]
  messages: Record<string, Message[]>
  selectedMatchId: string | null
  isLoading: boolean
  error: string | null
}

const initialState: ChatState = {
  currentUser: {
    id: "1",
    name: "Kilian",
    avatar: "/placeholder.svg",
  },
  matches: [],
  messages: {},
  selectedMatchId: null,
  isLoading: false,
  error: null
}

export const getMessages = createAsyncThunk('message/getMessages', async (matchId: string, { rejectWithValue }) => {
  try {
    const response = await MessageService.getMessages(matchId)
    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const chatSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setSelectedMatch: (state, action: PayloadAction<string>) => {
      state.selectedMatchId = action.payload
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const matchId = action.payload.receiverId
      if (!state.messages[matchId]) {
        state.messages[matchId] = []
      }
      state.messages[matchId].push(action.payload)
    },
    setMatches: (state, action: PayloadAction<Match[]>) => {
      state.matches = action.payload
      state.isLoading = false
    },
    setMessages: (state, action: PayloadAction<{ matchId: string, messages: Message[] }>) => {
      state.messages[action.payload.matchId] = action.payload.messages
    }
  }
})

export const { 
  setSelectedMatch, 
  addMessage, 
  setMatches,
  setMessages 
} = chatSlice.actions

export default chatSlice.reducer 