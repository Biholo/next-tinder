import { authService } from "@/services/authService";
import { api } from "@/services/interceptor";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

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
            const accessToken = Cookies.get('accessToken');
            const refreshToken = Cookies.get('refreshToken');

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
            const user = await authService.getUserByToken(response.access_token);
            return { user, tokens: { 
                accessToken: response.access_token, 
                refreshToken: response.refresh_token 
            }};
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Logout
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const refreshInCookie = Cookies.get('refreshToken');
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            if(refreshInCookie) {
                await authService.logout(refreshInCookie);
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
                toast.success("Connexion réussie");
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
                toast.success("Connexion réussie");
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(state.error || 'Erreur lors de la connexion');
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
                toast.success("Inscription réussie");
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(state.error);
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
                toast.success("Déconnexion réussie");
            });
    },
});

export const { resetError, updateUser } = authSlice.actions;
export default authSlice.reducer;