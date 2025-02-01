import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// En dev, utilisez l'IP de votre machine locale pour que l'iPhone puisse accéder au backend
// Exemple : http://192.168.1.10:3000/api
const BASE_URL = 'http://192.168.1.41:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class ApiService {
  async testConnection() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error: any) {
      throw new Error('Impossible de se connecter au backend');
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur de connexion');
    }
  }

  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    dateOfBirth: string;
    gender: 'male' | 'female';
  }) {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const response = await api.post('/auth/refresh', { token: refreshToken });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors du rafraîchissement du token');
    }
  }

  async logout(refreshToken: string) {
    try {
      await api.post('/auth/logout', { token: refreshToken });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la déconnexion');
    }
  }

  // Nouvelles méthodes pour les profils et les swipes
  async getProfilesToSwipe() {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des profils');
    }
  }

  async createSwipe(data: { target_user_id: string; direction: 'LIKE' | 'DISLIKE' }) {
    try {
      const response = await api.post('/swipes', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors du swipe');
    }
  }

  async getMatches() {
    try {
      const response = await api.get('/matches');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des matches');
    }
  }

  async getMessages(matchId: string) {
    try {
      const response = await api.get(`/messages/${matchId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des messages');
    }
  }

  async sendMessage(matchId: string, content: string) {
    try {
      const response = await api.post('/messages', { match_id: matchId, content });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'envoi du message');
    }
  }
}

export default new ApiService(); 