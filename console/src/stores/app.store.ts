import { create } from 'zustand';

interface AppState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  serverStatus: 'unknown' | 'connected' | 'error';
  setServerStatus: (status: 'unknown' | 'connected' | 'error') => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
  serverStatus: 'unknown',
  setServerStatus: (serverStatus) => set({ serverStatus }),
}));
