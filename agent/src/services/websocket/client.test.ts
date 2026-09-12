import { describe, it, expect, vi } from 'vitest';
import { AgentWebSocketClient } from './client';

describe('Agent AgentWebSocketClient Unit Tests', () => {
  it('should register and unregister event handlers correctly', () => {
    const client = new AgentWebSocketClient('ws://localhost:4000/ws');
    const handler = vi.fn();

    client.on('test.event', handler);
    // @ts-expect-error accessing private property for verification
    expect(client.handlers.get('test.event')?.has(handler)).toBe(true);

    client.off('test.event', handler);
    // @ts-expect-error accessing private property for verification
    expect(client.handlers.get('test.event')?.has(handler)).toBe(false);
  });
});
