import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import SwipeService from "@/services/swipeService"

export const createSwipe = createAsyncThunk('swipe/createSwipe', async (swipe: any, { rejectWithValue }) => {
    try {
        const response = await SwipeService.swipe(swipe)
        return response.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

interface SwipeState {
    swipe: any | null
    loading: boolean
    error: string | null
}

const initialState: SwipeState = {
    swipe: null,
    loading: false,
    error: null
}

const swipeSlice = createSlice({
    name: "swipe",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createSwipe.pending, (state) => {
            state.loading = true
        })
        .addCase(createSwipe.fulfilled, (state, action) => {
            state.loading = false
            state.swipe = action.payload
        })
        .addCase(createSwipe.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
    }
})

export default swipeSlice.reducer

