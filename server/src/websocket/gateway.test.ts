import { describe, it, expect } from 'vitest';
import { wsMessageSchema } from './gateway.js';

describe('WebSocket Protocol Schema Validation Unit Tests', () => {
  it('should validate correctly formatted WebSocket envelope', () => {
    const validMessage = {
      id: 'msg-123',
      type: 'ping',
      timestamp: Date.now(),
      payload: { key: 'value' },
    };
    const result = wsMessageSchema.safeParse(validMessage);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe('msg-123');
      expect(result.data.type).toBe('ping');
    }
  });

  it('should reject WebSocket payload without id or type', () => {
    const invalidMessage = {
      timestamp: Date.now(),
    };
    const result = wsMessageSchema.safeParse(invalidMessage);
    expect(result.success).toBe(false);
  });
});
