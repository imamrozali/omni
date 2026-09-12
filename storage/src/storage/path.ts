import path from 'path';
import crypto from 'crypto';
import { SecurityError } from '../app/errors.js';

/**
 * Validates that a storage key is safe and prevents path traversal attacks.
 * Throws SecurityError if malicious path components are detected.
 */
export function validateStorageKey(key: string): void {
  if (!key || typeof key !== 'string') {
    throw new SecurityError('Invalid or empty storage key');
  }

  // Reject null bytes, backslashes, and URL-encoded traversal attempts
  if (key.includes('\0') || key.includes('\\') || key.includes('%00') || key.includes('%2e%2e')) {
    throw new SecurityError('Malicious characters detected in storage key');
  }

  // Reject directory traversal steps
  const normalizedParts = key.split('/');
  for (const part of normalizedParts) {
    if (part === '..' || part === '.') {
      throw new SecurityError('Path traversal sequence detected in storage key');
    }
  }
}

/**
 * Resolves a storage key to an absolute physical file path safely within baseRootDir.
 * Guarantees that the resolved path never escapes baseRootDir.
 */
export function resolveSafePath(baseRootDir: string, storageKey: string): string {
  validateStorageKey(storageKey);

  const absoluteRoot = path.resolve(baseRootDir);
  const resolvedTarget = path.resolve(absoluteRoot, storageKey);

  // Enforce boundary check
  if (!resolvedTarget.startsWith(absoluteRoot + path.sep) && resolvedTarget !== absoluteRoot) {
    throw new SecurityError('Resolved path escapes storage root boundary');
  }

  return resolvedTarget;
}

/**
 * Generates an opaque, non-reversible, clean storage key:
 * format: <category>/<YYYY>/<MM>/<uuid>.<ext>
 */
export function generateStorageKey(category: string, extension: string): string {
  const safeCategory = category.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const cleanExt = extension.toLowerCase().replace(/[^a-z0-9]/g, '');
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const uuid = crypto.randomUUID();

  return `${safeCategory}/${year}/${month}/${uuid}.${cleanExt}`;
}
