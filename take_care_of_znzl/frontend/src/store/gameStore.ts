import { create } from 'zustand';
import * as gameApi from '@/api/game';
import type { ActivityResult, PublicUser } from '@/types/user';

interface GameState {
  user: PublicUser | null;
  lastActivity: ActivityResult | null;
  isLoading: boolean;
  fetchGameState: () => Promise<PublicUser>;
  performActivity: () => Promise<ActivityResult>;
  requestSticker: () => Promise<PublicUser>;
  setUser: (user: PublicUser) => void;
  clearActivity: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  user: null,
  lastActivity: null,
  isLoading: false,

  fetchGameState: async () => {
    set({ isLoading: true });
    try {
      const user = await gameApi.fetchGameState();
      set({ user, isLoading: false });
      return user;
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  performActivity: async () => {
    const result = await gameApi.performActivity();
    set({ user: result.user, lastActivity: result });
    return result;
  },

  requestSticker: async () => {
    const user = await gameApi.requestSticker();
    set({ user });
    return user;
  },

  setUser: (user) => set({ user }),
  clearActivity: () => set({ lastActivity: null }),
}));
