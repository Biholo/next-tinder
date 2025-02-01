import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from "@/services/authService";
import { api } from "@/services/interceptor";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    user: any | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    accessToken: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    accessToken: null
};


// Auto login
export const autoLogin = createAsyncThunk(
    'auth/autoLogin',
    async (_, { rejectWithValue }) => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const refreshToken = await AsyncStorage.getItem('refreshToken');

            if (!accessToken && !refreshToken) {
                return rejectWithValue('');
            }

            if (accessToken) {
                try {
                    const user = await authService.getUserByToken(accessToken);
                    return { user, tokens: { accessToken, refreshToken: refreshToken || '' } };
                } catch (error) {
                    if (!refreshToken) throw new Error('Pas de refresh token');
                }
            }

            if(refreshToken) {
                const newTokens = await api.getNewAccessToken(refreshToken);
                if (newTokens) {
                    const user = await authService.getUserByToken(newTokens.access_token);
                    // Sauvegarder les nouveaux tokens
                    await AsyncStorage.setItem('accessToken', newTokens.access_token);
                    await AsyncStorage.setItem('refreshToken', newTokens.refresh_token);
                    return { user, tokens: newTokens };
                }
            }
            throw new Error('Authentification échouée');
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Login
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await authService.loginUser(credentials);
            if (!response.access_token) {
                throw new Error('Token non reçu du serveur');
            }
            // Sauvegarder les tokens
            await AsyncStorage.setItem('accessToken', response.access_token);
            await AsyncStorage.setItem('refreshToken', response.refresh_token);
            
            const user = await authService.getUserByToken(response.access_token);
            return { user, tokens: { 
                accessToken: response.access_token, 
                refreshToken: response.refresh_token 
            }};
        } catch (error: any) {
            console.error('Login error:', error);
            return rejectWithValue(error.message || 'Erreur lors de la connexion');
        }
    }
);

// Register
export const register = createAsyncThunk(
    'auth/register',
    async (userData: any, { rejectWithValue }) => {
        try {
            const response = await authService.registerUser(userData);
            await AsyncStorage.setItem('accessToken', response.access_token);
            await AsyncStorage.setItem('refreshToken', response.refresh_token);
            
            const user = await authService.getUserByToken(response.access_token);
            return { user, tokens: { 
                accessToken: response.access_token, 
                refreshToken: response.refresh_token 
            }};
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors de l\'inscription');
        }
    }
);

// Logout
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
            if(refreshToken) {
                await authService.logout(refreshToken);
            }
            return null;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetError: (state) => {
            state.error = null;
        },
        updateUser: (state, action: PayloadAction<any>) => {
            state.user = {
                ...state.user,
                ...action.payload
            };
            state.isAuthenticated = true;

        }
    },
    extraReducers: (builder) => {
        builder
            // Auto Login
            .addCase(autoLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(autoLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.accessToken = action.payload.tokens.accessToken;
            })
            .addCase(autoLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
                state.user = null;
            })
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.accessToken = action.payload.tokens.accessToken;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            });
    },
});

export const { resetError, updateUser } = authSlice.actions;
export default authSlice.reducer;