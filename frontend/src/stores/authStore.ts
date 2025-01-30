import { create } from 'zustand';

interface AuthState {
    user: any;
    setUser: (userData: any) => void;
    clearUser: () => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
  }

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),
  clearUser: () => set({ user: null }),
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated})
}));