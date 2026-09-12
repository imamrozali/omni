import { create } from 'zustand';

interface AgentState {
  wsStatus: 'disconnected' | 'connecting' | 'connected';
  setWsStatus: (status: 'disconnected' | 'connecting' | 'connected') => void;
  systemInfo: { osName: string; arch: string } | null;
  setSystemInfo: (info: { osName: string; arch: string } | null) => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  wsStatus: 'disconnected',
  setWsStatus: (wsStatus) => set({ wsStatus }),
  systemInfo: null,
  setSystemInfo: (systemInfo) => set({ systemInfo }),
}));
