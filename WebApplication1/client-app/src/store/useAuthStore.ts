// src/store/useAuthStore.ts
import { create } from 'zustand';
import { authService } from '../services/authService';
import { LoginDto, RegisterDto } from '../types/Auth';

interface AuthState {
  token: string | null;
  user: any;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginDto) => Promise<void>;
  register: (userData: RegisterDto) => Promise<void>;
  logout: () => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
  
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(credentials);
      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        set({
          token: response.token,
          isAuthenticated: true,
          loading: false,
        });
      } else {
        set({ error: response.message || 'Login failed', loading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Login failed', loading: false });
    }
  },
  
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.register(userData);
      if (response.success) {
        set({ loading: false });
      } else {
        set({ error: response.message || 'Registration failed', loading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Registration failed', loading: false });
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, isAuthenticated: false });
  },
  
  setError: (error) => set({ error }),
}));