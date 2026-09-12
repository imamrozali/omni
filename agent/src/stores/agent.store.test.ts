import { describe, it, expect } from 'vitest';
import { useAgentStore } from './agent.store';

describe('Agent AgentStore Unit Tests', () => {
  it('should initialize with default disconnected state', () => {
    const state = useAgentStore.getState();
    expect(state.wsStatus).toBe('disconnected');
    expect(state.systemInfo).toBeNull();
  });

  it('should update wsStatus state via setWsStatus action', () => {
    useAgentStore.getState().setWsStatus('connected');
    expect(useAgentStore.getState().wsStatus).toBe('connected');
  });

  it('should update systemInfo state via setSystemInfo action', () => {
    useAgentStore.getState().setSystemInfo({ osName: 'macOS', arch: 'arm64' });
    expect(useAgentStore.getState().systemInfo).toEqual({ osName: 'macOS', arch: 'arm64' });
  });
});
