import { describe, it, expect } from 'vitest';
import { formatBytes } from './utils.js';

describe('formatBytes', () => {
  it('formats 0 bytes correctly', () => {
    const res = formatBytes(0);
    expect(res.bytes).toBe(0);
    expect(res.b).toBe('0 B');
    expect(res.kb).toBe('0.00 KB');
    expect(res.mb).toBe('0.00 MB');
    expect(res.gb).toBe('0.00 GB');
    expect(res.human).toBe('0 B');
  });

  it('formats byte numbers into B, KB, MB, GB, TB units correctly', () => {
    // 1.5 GB = 1.5 * 1024 * 1024 * 1024 = 1610612736 bytes
    const bytes = 1610612736;
    const res = formatBytes(bytes);

    expect(res.bytes).toBe(bytes);
    expect(res.b).toBe('1610612736 B');
    expect(res.kb).toBe('1572864.00 KB');
    expect(res.mb).toBe('1536.00 MB');
    expect(res.gb).toBe('1.50 GB');
    expect(res.human).toBe('1.5 GB');
  });

  it('handles small byte amounts correctly', () => {
    const res = formatBytes(512);
    expect(res.b).toBe('512 B');
    expect(res.human).toBe('512 B');
  });
});
