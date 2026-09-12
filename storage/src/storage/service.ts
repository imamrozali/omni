import { Readable } from 'stream';
import { filesystemStorage, FilesystemStorageProvider } from './filesystem.js';
import { generateStorageKey } from './path.js';
import { storageSessionManager, StorageSessionManager } from '../security/session.js';
import { ValidationError } from '../app/errors.js';
import { formatBytes, FormattedByteUnits } from './utils.js';

export interface StorageUploadResult {
  assetId: string;
  storageKey: string;
  size: number;
  mimeType: string;
}

export interface StorageStatsInfo {
  totalBytes: number;
  freeBytes: number;
  usedBytes: number;
  storageUsedBytes: number;
  usedPercentage: number;
  used: FormattedByteUnits;
  free: FormattedByteUnits;
  storageUsed: FormattedByteUnits;
  total: FormattedByteUnits;
}

export class StorageService {
  private provider: FilesystemStorageProvider;
  private sessionManager: StorageSessionManager;

  constructor(
    provider: FilesystemStorageProvider = filesystemStorage,
    sessionManager: StorageSessionManager = storageSessionManager,
  ) {
    this.provider = provider;
    this.sessionManager = sessionManager;
  }

  /**
   * Processes a direct media upload from an authorized token.
   */
  public async uploadWithToken(
    uploadToken: string,
    fileStream: Readable,
    options: { filename: string; mimeType: string },
  ): Promise<StorageUploadResult> {
    const session = this.sessionManager.verifyUploadToken(uploadToken);

    // Validate MIME type
    if (
      session.allowedMimeTypes.length > 0 &&
      !session.allowedMimeTypes.includes(options.mimeType.toLowerCase())
    ) {
      throw new ValidationError(`MIME type '${options.mimeType}' is not allowed for this upload session`);
    }

    // Determine extension
    const extMatch = options.filename.match(/\.([a-zA-Z0-9]+)$/);
    const extension = extMatch ? extMatch[1] : 'bin';

    // Generate safe opaque storage key
    const storageKey = generateStorageKey(session.category, extension);

    // Save atomically via stream
    const { size } = await this.provider.saveStream(storageKey, fileStream);

    // Validate size limit
    if (session.maxSize > 0 && size > session.maxSize) {
      await this.provider.deleteFile(storageKey);
      throw new ValidationError(`Uploaded file size (${size} bytes) exceeds maximum limit (${session.maxSize} bytes)`);
    }

    return {
      assetId: session.assetId,
      storageKey,
      size,
      mimeType: options.mimeType,
    };
  }

  /**
   * Retrieves a file read stream for media delivery.
   */
  public getFileStream(storageKey: string): { stream: Readable; size: number } {
    return this.provider.getReadStream(storageKey);
  }

  /**
   * Deletes a file.
   */
  public async deleteFile(storageKey: string): Promise<boolean> {
    return this.provider.deleteFile(storageKey);
  }

  /**
   * Gets storage disk metrics with formatted byte units.
   */
  public async getStorageStats(): Promise<StorageStatsInfo> {
    const stats = await this.provider.getStorageStats();
    return {
      ...stats,
      used: formatBytes(stats.usedBytes),
      free: formatBytes(stats.freeBytes),
      storageUsed: formatBytes(stats.storageUsedBytes),
      total: formatBytes(stats.totalBytes),
    };
  }
}

export const storageService = new StorageService();
