import { create } from 'zustand';

interface UiState {
  isServerWaking: boolean;
  isSettingOpen: boolean;
  isHelpOpen: boolean;
  speechText: string | null;
  setServerWaking: (value: boolean) => void;
  setSettingOpen: (value: boolean) => void;
  setHelpOpen: (value: boolean) => void;
  setSpeechText: (text: string | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isServerWaking: false,
  isSettingOpen: false,
  isHelpOpen: false,
  speechText: null,
  setServerWaking: (value) => set({ isServerWaking: value }),
  setSettingOpen: (value) => set({ isSettingOpen: value }),
  setHelpOpen: (value) => set({ isHelpOpen: value }),
  setSpeechText: (text) => set({ speechText: text }),
}));
