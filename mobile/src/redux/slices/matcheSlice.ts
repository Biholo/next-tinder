import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import matcheService from "@/services/matcheService"

interface MatchState {
    loading: boolean
    error: string | null
    matches: any[]
}

const initialState: MatchState = {
    loading: false,
    error: null,
    matches: []
}

export const getMatches = createAsyncThunk('matches/getMatches', async (_, { rejectWithValue }) => {
    try {
        const response = await matcheService.getMatches()
        console.log('📥 Réponse du service de matches:', response)
        return response.data
    } catch (error) {
        console.error('❌ Erreur dans getMatches:', error)
        return rejectWithValue(error)
    }
})

const matchesSlice = createSlice({
    name: "matches",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMatches.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getMatches.fulfilled, (state, action) => {
                console.log('✅ Matches mis à jour dans le state:', action.payload)
                state.matches = action.payload
                state.loading = false
            })
            .addCase(getMatches.rejected, (state, action) => {
                console.error('❌ Erreur dans le reducer matches:', action.payload)
                state.loading = false
                state.error = action.payload
            })
    }
})

export default matchesSlice.reducer

