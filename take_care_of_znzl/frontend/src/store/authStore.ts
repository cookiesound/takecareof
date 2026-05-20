import { create } from 'zustand';
import * as authApi from '@/api/auth';
import { getToken, setToken, clearToken } from '@/utils/storage';
import type { PublicUser } from '@/types/user';

interface AuthState {
  user: PublicUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  checkAuth: () => Promise<boolean>;
  login: (nickname: string, password: string) => Promise<PublicUser>;
  logout: () => Promise<void>;
  setUser: (user: PublicUser | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  checkAuth: async () => {
    const token = getToken();
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return false;
    }

    try {
      const user = await authApi.fetchMe();
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch {
      clearToken();
      set({ user: null, isAuthenticated: false, isLoading: false });
      return false;
    }
  },

  login: async (nickname, password) => {
    const { token, user } = await authApi.login(nickname, password);
    setToken(token);
    set({ user, isAuthenticated: true, isLoading: false });
    return user;
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      clearToken();
      set({ user: null, isAuthenticated: false });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));
