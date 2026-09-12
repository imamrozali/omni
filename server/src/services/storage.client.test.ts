import { describe, it, expect, vi } from 'vitest';
import { StorageClient } from './storage.client.js';

describe('Server StorageClient Unit Tests', () => {
  const client = new StorageClient('secret-omni-storage-token-key-2026', 'http://localhost:4001');

  it('should generate valid upload token and direct upload URL', () => {
    const token = client.createUploadToken({
      uploadId: 'upl_789',
      assetId: 'asset_789',
      category: 'originals',
      allowedMimeTypes: ['image/jpeg', 'image/png'],
      maxSize: 20971520,
    });

    expect(token).toContain('.');
    const uploadUrl = client.getDirectUploadUrl(token);
    expect(uploadUrl).toBe(`http://localhost:4001/upload/${token}`);
  });

  it('should generate CDN URL for storageKey', () => {
    const cdnUrl = client.getCdnUrl('originals/2026/09/sample.png');
    expect(cdnUrl).toBe('http://localhost:4001/cdn/originals/2026/09/sample.png');
  });

  it('should fetch storage stats from internal storage endpoint', async () => {
    const mockStats = {
      totalBytes: 107374182400,
      freeBytes: 96636764160,
      usedBytes: 10737418240,
      storageUsedBytes: 1048576,
      usedPercentage: 10,
      used: { bytes: 10737418240, b: '10737418240 B', kb: '10485760.00 KB', mb: '10240.00 MB', gb: '10.00 GB', tb: '0.01 TB', human: '10 GB' },
      free: { bytes: 96636764160, b: '96636764160 B', kb: '94371840.00 KB', mb: '92160.00 MB', gb: '90.00 GB', tb: '0.09 TB', human: '90 GB' },
      storageUsed: { bytes: 1048576, b: '1048576 B', kb: '1024.00 KB', mb: '1.00 MB', gb: '0.00 GB', tb: '0.00 TB', human: '1 MB' },
      total: { bytes: 107374182400, b: '107374182400 B', kb: '104857600.00 KB', mb: '102400.00 MB', gb: '100.00 GB', tb: '0.10 TB', human: '100 GB' },
    };

    const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockStats }),
    } as Response);

    const stats = await client.getStorageStats();
    expect(stats).toEqual(mockStats);
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:4001/internal/v1/storage/stats',
      expect.objectContaining({
        headers: {
          Authorization: 'Bearer secret-omni-storage-token-key-2026',
        },
      }),
    );
  });
});
