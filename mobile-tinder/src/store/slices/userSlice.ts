import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';
import { User } from '@/types';

// Étend le type User avec les champs supplémentaires nécessaires pour l'affichage
export interface Profile extends Omit<User, 'location' | 'bio' | 'photos' | 'preferences'> {
  age: number; // L'âge est calculé et toujours présent
  location: string; // On s'assure que location est toujours présent (avec une valeur par défaut si nécessaire)
  bio: string; // On s'assure que bio est toujours présent (avec une valeur par défaut si nécessaire)
  photos: {
    _id: string;
    photoUrl: string;
  }[]; // On s'assure que photos est toujours présent (au moins un tableau vide)
  preferences: {
    gender: 'male' | 'female' | 'both';
    ageRange: {
      min: number;
      max: number;
    };
  }; // On s'assure que preferences est toujours présent
}

interface UserState {
  profiles: Profile[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profiles: [],
  isLoading: false,
  error: null,
};

export const getUsersToSwipe = createAsyncThunk(
  'user/getUsersToSwipe',
  async () => {
    const response = await api.getProfilesToSwipe();
    // Transformer les utilisateurs en profils avec des valeurs par défaut pour les champs optionnels
    const profilesWithDefaults = response.map((user: User) => ({
      ...user,
      age: new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear(),
      location: user.location || 'Quelque part',
      bio: user.bio || 'Aucune bio disponible',
      photos: user.photos || [],
      preferences: user.preferences || {
        gender: 'both',
        ageRange: { min: 18, max: 99 }
      }
    }));
    return profilesWithDefaults;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsersToSwipe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUsersToSwipe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profiles = action.payload;
      })
      .addCase(getUsersToSwipe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      });
  },
});

export default userSlice.reducer; 