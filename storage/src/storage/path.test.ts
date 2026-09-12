import { describe, it, expect } from 'vitest';
import { validateStorageKey, resolveSafePath, generateStorageKey } from './path.js';
import { SecurityError } from '../app/errors.js';
import path from 'path';

describe('Storage Path Traversal Security Unit Tests', () => {
  it('should allow valid opaque storage keys', () => {
    expect(() => validateStorageKey('originals/2026/09/asset-123.webp')).not.toThrow();
  });

  it('should reject path traversal with ../', () => {
    expect(() => validateStorageKey('../../../etc/passwd')).toThrow(SecurityError);
    expect(() => validateStorageKey('originals/../../secret.txt')).toThrow(SecurityError);
  });

  it('should reject null byte injection', () => {
    expect(() => validateStorageKey('originals/asset.png\0.exe')).toThrow(SecurityError);
  });

  it('should reject backslash traversal', () => {
    expect(() => validateStorageKey('originals\\..\\..\\windows')).toThrow(SecurityError);
  });

  it('should resolve safe absolute paths inside base root directory', () => {
    const baseDir = '/tmp/omni-storage';
    const target = resolveSafePath(baseDir, 'photos/2026/09/test.jpg');
    expect(target).toBe(path.resolve(baseDir, 'photos/2026/09/test.jpg'));
  });

  it('should throw SecurityError when resolved target escapes storage root boundary', () => {
    const baseDir = '/tmp/omni-storage';
    expect(() => resolveSafePath(baseDir, '../outside.txt')).toThrow(SecurityError);
  });

  it('should generate correctly formatted opaque storage keys', () => {
    const key = generateStorageKey('originals', 'png');
    expect(key).toMatch(/^originals\/\d{4}\/\d{2}\/[a-f0-9-]+\.png$/);
  });
});
