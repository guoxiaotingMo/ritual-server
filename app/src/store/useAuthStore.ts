import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
  init: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) => set({ user, isLoggedIn: true }),
  logout: async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    set({ user: null, isLoggedIn: false });
  },
  init: async () => {
    const userStr = await AsyncStorage.getItem('user');
    const token = await AsyncStorage.getItem('accessToken');
    if (userStr && token) {
      set({ user: JSON.parse(userStr), isLoggedIn: true });
    }
  },
}));
