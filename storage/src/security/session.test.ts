import { describe, it, expect } from 'vitest';
import { StorageSessionManager } from './session.js';
import { AuthorizationError } from '../app/errors.js';

describe('StorageSessionManager Security Unit Tests', () => {
  const manager = new StorageSessionManager('test-secret');

  it('should create and verify valid upload token', () => {
    const token = manager.createUploadToken({
      uploadId: 'upl_123',
      assetId: 'asset_456',
      category: 'originals',
      allowedMimeTypes: ['image/png', 'image/jpeg'],
      maxSize: 10485760,
    });

    const data = manager.verifyUploadToken(token);
    expect(data.uploadId).toBe('upl_123');
    expect(data.assetId).toBe('asset_456');
    expect(data.category).toBe('originals');
    expect(data.maxSize).toBe(10485760);
  });

  it('should reject token with tampered signature', () => {
    const token = manager.createUploadToken({
      uploadId: 'upl_123',
      assetId: 'asset_456',
      category: 'originals',
      allowedMimeTypes: ['image/png'],
      maxSize: 10485760,
    });

    const tampered = token.substring(0, token.length - 4) + 'abcd';
    expect(() => manager.verifyUploadToken(tampered)).toThrow(AuthorizationError);
  });

  it('should reject expired upload token', () => {
    const expiredToken = manager.createUploadToken(
      {
        uploadId: 'upl_exp',
        assetId: 'asset_exp',
        category: 'originals',
        allowedMimeTypes: ['image/png'],
        maxSize: 10485760,
      },
      -1000, // expired 1 sec ago
    );

    expect(() => manager.verifyUploadToken(expiredToken)).toThrow(AuthorizationError);
  });
});
