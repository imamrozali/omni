import { describe, it, expect } from 'vitest';
import { mediaControlPlaneService } from './service.js';

describe('MediaControlPlaneService Unit Tests', () => {
  it('should generate upload session with valid directUploadUrl and uploadToken', () => {
    const session = mediaControlPlaneService.createUploadSession({
      category: 'photos',
      maxSize: 10485760,
    });

    expect(session.uploadId).toContain('upl_');
    expect(session.assetId).toContain('asset_');
    expect(session.uploadToken).toContain('.');
    expect(session.directUploadUrl).toContain('/upload/');
    expect(typeof session.expiresAt).toBe('string');
  });
});
