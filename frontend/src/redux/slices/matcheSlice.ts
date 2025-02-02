import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import MatchService from "@/services/matcheService"

interface Match {
    id: string;
    userId: string;
    name: string;
    avatar: string;
}

interface MatchState {
    matches: Match[];
    loading: boolean;
    error: string | null;
}

const initialState: MatchState = {
    matches: [],
    loading: false,
    error: null
};
export const getMatches = createAsyncThunk('match/getMatches', async (_, { rejectWithValue }) => {
    try {
        const response = await MatchService.getMatches()
        return response.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

const matchSlice = createSlice({
    name: "matches",
    initialState,
    reducers: {
        removeMatch: (state, action: PayloadAction<string>) => {
            state.matches = state.matches.filter(match => match.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMatches.fulfilled, (state, action) => {
            let matches = action.payload
            console.log(' 📥 Réponse du service de matches:', matches)
            state.matches  = matches.map((match: any) => ({
                id: match.match_id,
                userId: match.user.id,
                name: match.user.firstName + " " + match.user.lastName,
                avatar: match.user.photos[0].photoUrl
            }))
        });
    },
});

export const { removeMatch } = matchSlice.actions;
export default matchSlice.reducer;