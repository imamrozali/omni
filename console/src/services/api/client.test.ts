import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiClient } from './client';

describe('Console ApiClient Unit Tests', () => {
  let client: ApiClient;

  beforeEach(() => {
    client = new ApiClient('http://localhost:4000');
    vi.restoreAllMocks();
  });

  it('should fetch data successfully via GET', async () => {
    const mockData = { success: true, data: { status: 'ok' } };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockData),
    }));

    const res = await client.get('/health');
    expect(res).toEqual(mockData);
  });

  it('should handle network errors gracefully on GET failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network offline')));

    const res = await client.get('/health');
    expect(res.success).toBe(false);
    expect(res.error?.code).toBe('NETWORK_ERROR');
    expect(res.error?.message).toBe('Network offline');
  });
});
