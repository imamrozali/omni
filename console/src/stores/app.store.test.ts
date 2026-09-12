import { describe, it, expect } from 'vitest';
import { useAppStore } from './app.store';

describe('Console AppStore Unit Tests', () => {
  it('should initialize with default state values', () => {
    const state = useAppStore.getState();
    expect(state.theme).toBe('dark');
    expect(state.serverStatus).toBe('unknown');
  });

  it('should update theme state via setTheme action', () => {
    useAppStore.getState().setTheme('light');
    expect(useAppStore.getState().theme).toBe('light');
  });

  it('should update serverStatus state via setServerStatus action', () => {
    useAppStore.getState().setServerStatus('connected');
    expect(useAppStore.getState().serverStatus).toBe('connected');
  });
});
