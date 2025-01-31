import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import MatchService from "@/services/matcheService"

interface MatchState {
    match: any | null
    loading: boolean
    error: string | null
}

const initialState: MatchState = {
    match: null,
    loading: false,
    error: null
}

export const getMatches = createAsyncThunk('match/getMatches', async (_, { rejectWithValue }) => {
    try {
        const response = await MatchService.getMatches()
        return response.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

const matchSlice = createSlice({
    name: "match",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getMatches.pending, (state) => {
            state.loading = true
        })
        .addCase(getMatches.fulfilled, (state, action) => {
            state.loading = false
            state.match = action.payload
        })
        .addCase(getMatches.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
    }
})

export default matchSlice.reducer

