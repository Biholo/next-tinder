import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import MatchService from "@/services/matcheService";

interface Conversation {
    matchId: string;
    user: {
        id: string;
        name: string;
        avatar: string;
    };
    lastMessage: {
        content: string;
        senderId: string;
        timestamp: string;
    } | null;
}

interface ConversationState {
    conversations: Conversation[];
    loading: boolean;
}

const initialState: ConversationState = {
    conversations: [],
    loading: false,
};

// Charger les conversations (matchs avec messages)
export const fetchConversations = createAsyncThunk("conversations/fetchConversations", async () => {
    const response = await MatchService.getMatches(); // Même route API
    return response.data.filter((match: any) => match.lastMessage !== null); // Filtrer ceux qui ont un message
});

const conversationSlice = createSlice({
    name: "conversations",
    initialState,
    reducers: {
        addConversation: (state, action: PayloadAction<Conversation>) => {
            const existingConversation = state.conversations.find(conv => conv.matchId === action.payload.matchId);
            if (!existingConversation) {
                state.conversations.push(action.payload);
            }
        },
        updateLastMessage: (state, action: PayloadAction<{ matchId: string; message: any }>) => {
            const conversation = state.conversations.find(conv => conv.matchId === action.payload.matchId);
            if (conversation) {
                conversation.lastMessage = action.payload.message;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchConversations.fulfilled, (state, action) => {
            state.conversations = action.payload;
        });
    },
});

export const { addConversation, updateLastMessage } = conversationSlice.actions;
export default conversationSlice.reducer;
