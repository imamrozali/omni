import { describe, it, expect } from 'vitest';
import { healthService } from './service.js';

describe('HealthService Unit Tests', () => {
  it('should return valid health status structure', () => {
    const health = healthService.getHealth();
    expect(health.status).toBe('ok');
    expect(typeof health.timestamp).toBe('string');
    expect(typeof health.uptime).toBe('number');
    expect(health.uptime).toBeGreaterThanOrEqual(0);
  });
});
