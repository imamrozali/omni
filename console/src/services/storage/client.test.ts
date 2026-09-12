import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DirectStorageClient } from './client.js';

describe('DirectStorageClient (Console)', () => {
  let client: DirectStorageClient;

  beforeEach(() => {
    client = new DirectStorageClient('http://localhost:4000', 'http://localhost:4001');
    vi.restoreAllMocks();
  });

  it('requests upload token successfully', async () => {
    const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { token: 'mock-upload-token-123' },
      }),
    } as Response);

    const token = await client.requestToken({ category: 'originals' });
    expect(token).toBe('mock-upload-token-123');
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/v1/media/upload-token',
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });

  it('uploads file directly to storage data plane using token', async () => {
    const mockFileResult = {
      key: 'originals/test.jpg',
      filename: 'test.jpg',
      mimeType: 'image/jpeg',
      size: 100,
      hash: 'abc123hash',
      url: '/cdn/originals/test.jpg',
    };

    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { token: 'token-abc' },
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockFileResult,
        }),
      } as Response);

    const blob = new Blob(['test image content'], { type: 'image/jpeg' });
    const result = await client.directUpload(blob, 'test.jpg', { category: 'originals' });

    expect(result).toEqual(mockFileResult);
  });

  it('throws error when server fails to issue token', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      statusText: 'Bad Request',
    } as Response);

    await expect(client.requestToken()).rejects.toThrow('Failed to request upload token: Bad Request');
  });
});
