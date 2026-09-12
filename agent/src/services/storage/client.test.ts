import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DirectStorageClient } from './client.js';

describe('DirectStorageClient (Agent)', () => {
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
        data: { token: 'agent-token-123' },
      }),
    } as Response);

    const token = await client.requestToken({ category: 'prints' });
    expect(token).toBe('agent-token-123');
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/v1/media/upload-token',
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });

  it('uploads print asset directly to storage data plane using token', async () => {
    const mockFileResult = {
      key: 'prints/photo_print.pdf',
      filename: 'photo_print.pdf',
      mimeType: 'application/pdf',
      size: 2048,
      hash: 'pdfhash987',
      url: '/cdn/prints/photo_print.pdf',
    };

    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { token: 'token-pdf' },
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockFileResult,
        }),
      } as Response);

    const blob = new Blob(['dummy pdf data'], { type: 'application/pdf' });
    const result = await client.directUpload(blob, 'photo_print.pdf', { category: 'prints' });

    expect(result).toEqual(mockFileResult);
  });
});
