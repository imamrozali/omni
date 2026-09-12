import { describe, it, expect } from 'vitest';
import { loadConfig } from './config.js';

describe('Server Config Validation Unit Tests', () => {
  it('should load default configuration when environment variables are set', () => {
    const config = loadConfig();
    expect(config.PORT).toBeTypeOf('number');
    expect(config.HOST).toBeTypeOf('string');
    expect(['development', 'production', 'test']).toContain(config.NODE_ENV);
  });
});
