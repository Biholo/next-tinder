import type { User } from './user.types';

// Données d'inscription
export interface RegisterCredentials {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    dateOfBirth: string;
    gender: 'male' | 'female';
}

// Données de connexion
export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  // Réponse de l'API après authentification
  export interface AuthResponse {
    access_token: string;
    refresh_token: string;
  }
  
  // Réponse complète incluant l'utilisateur
  export interface AuthResponseWithUser extends AuthResponse {
    user: User;
  }
  
  // Type pour le refresh token
  export interface RefreshTokenRequest {
    token: string;
  }