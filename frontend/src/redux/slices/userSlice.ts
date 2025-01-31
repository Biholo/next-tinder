import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "@/services/userService";

interface UserState {
    user: any | null;
    loading: boolean;
    error: string | null;
    profiles: any[] | null;
}

const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
    profiles: null
}

export const getUsersToSwipe = createAsyncThunk('user/getUsersToSwipe', async (_, { rejectWithValue }) => {
    try {
        const response = await UserService.getUsersToSwipe()
        return response.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const updateUser = createAsyncThunk('user/updateUser', async (user: any, { rejectWithValue }) => {
    try {
        const response = await UserService.updateUser(user)
        return response.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const addUserPhotos = createAsyncThunk('user/addUserPhotos', async (photos: any, { rejectWithValue }) => {
    try {
        const response = await UserService.addUserPhotos(photos)
        return response.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUsersToSwipe.pending, (state) => {
            state.loading = true
        })
            .addCase(getUsersToSwipe.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload.data
            state.profiles = action.payload?.data || []
        })
        .addCase(getUsersToSwipe.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
        .addCase(updateUser.pending, (state) => {
            state.loading = true
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload.data
        })
        .addCase(updateUser.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
        .addCase(addUserPhotos.pending, (state) => {
            state.loading = true
        })
        .addCase(addUserPhotos.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload.data
            
        })
        .addCase(addUserPhotos.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
    }
})

export default userSlice.reducer
