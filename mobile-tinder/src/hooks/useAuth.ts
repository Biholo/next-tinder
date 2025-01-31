import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setUser, setToken, logout, setError } from '../store/slices/authSlice';
import api from '../services/api';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Helper pour le stockage selon la plateforme
const storage = {
  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  async getItem(key: string) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  async removeItem(key: string) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  }
};

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isLoading, error } = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    try {
      console.log('Début de la connexion...');
      const response = await api.login(email, password);
      console.log('Réponse reçue:', response);
      
      if (response.access_token && response.refresh_token) {
        await storage.setItem('accessToken', response.access_token);
        await storage.setItem('refreshToken', response.refresh_token);
        
        dispatch(setToken(response.access_token));
        if (response.user) {
          dispatch(setUser(response.user));
        }
      } else {
        throw new Error('Tokens manquants dans la réponse');
      }
    } catch (error: any) {
      console.error('Erreur dans useAuth:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur de connexion';
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  const logoutUser = async () => {
    await storage.removeItem('accessToken');
    await storage.removeItem('refreshToken');
    dispatch(logout());
  };

  return {
    user,
    token,
    isLoading,
    error,
    login,
    logout: logoutUser,
    isAuthenticated: !!token,
  };
};
