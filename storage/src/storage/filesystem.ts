import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { resolveSafePath } from './path.js';
import { config } from '../app/config.js';
import { NotFoundError } from '../app/errors.js';

export class FilesystemStorageProvider {
  private baseDir: string;

  constructor(baseDir: string = config.STORAGE_ROOT) {
    this.baseDir = path.resolve(baseDir);
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  /**
   * Saves a readable stream atomically to the target storage key.
   * Writes to a .tmp file first, then atomically renames to the final path.
   */
  public async saveStream(storageKey: string, stream: Readable): Promise<{ storageKey: string; size: number }> {
    const finalPath = resolveSafePath(this.baseDir, storageKey);
    const parentDir = path.dirname(finalPath);

    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    const tmpPath = `${finalPath}.tmp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    let bytesWritten = 0;

    try {
      const writeStream = fs.createWriteStream(tmpPath);
      stream.on('data', (chunk: Buffer) => {
        bytesWritten += chunk.length;
      });

      await pipeline(stream, writeStream);

      // Atomic rename
      await fs.promises.rename(tmpPath, finalPath);

      return {
        storageKey,
        size: bytesWritten,
      };
    } catch (err) {
      // Clean up temporary file on failure
      if (fs.existsSync(tmpPath)) {
        await fs.promises.unlink(tmpPath).catch(() => {});
      }
      throw err;
    }
  }

  /**
   * Saves a Buffer atomically to the target storage key.
   */
  public async saveBuffer(storageKey: string, buffer: Buffer): Promise<{ storageKey: string; size: number }> {
    const readable = Readable.from(buffer);
    return this.saveStream(storageKey, readable);
  }

  /**
   * Reads a stored file as a readable stream.
   */
  public getReadStream(storageKey: string): { stream: Readable; size: number } {
    const filePath = resolveSafePath(this.baseDir, storageKey);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundError(`File not found for key: ${storageKey}`);
    }

    const stat = fs.statSync(filePath);
    const stream = fs.createReadStream(filePath);
    return { stream, size: stat.size };
  }

  /**
   * Deletes a file safely from storage.
   */
  public async deleteFile(storageKey: string): Promise<boolean> {
    const filePath = resolveSafePath(this.baseDir, storageKey);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  }

  /**
   * Checks if a file exists.
   */
  public fileExists(storageKey: string): boolean {
    const filePath = resolveSafePath(this.baseDir, storageKey);
    return fs.existsSync(filePath);
  }

  /**
   * Calculates total directory size recursively.
   */
  private async getDirectorySize(dirPath: string): Promise<number> {
    let size = 0;
    if (!fs.existsSync(dirPath)) return 0;
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        size += await this.getDirectorySize(fullPath);
      } else if (entry.isFile()) {
        const stat = await fs.promises.stat(fullPath);
        size += stat.size;
      }
    }
    return size;
  }

  /**
   * Returns disk space statistics for storage.
   */
  public async getStorageStats(): Promise<{
    totalBytes: number;
    freeBytes: number;
    usedBytes: number;
    storageUsedBytes: number;
    usedPercentage: number;
  }> {
    let totalBytes = 0;
    let freeBytes = 0;

    try {
      if (typeof fs.promises.statfs === 'function') {
        const stats = await fs.promises.statfs(this.baseDir);
        const bsize = stats.bsize || 4096;
        totalBytes = stats.blocks * bsize;
        freeBytes = stats.bavail * bsize;
      }
    } catch (_e) {
      // Fallback if statfs is unavailable
    }

    const storageUsedBytes = await this.getDirectorySize(this.baseDir);

    if (totalBytes === 0) {
      totalBytes = 100 * 1024 * 1024 * 1024; // 100 GB fallback
      freeBytes = Math.max(0, totalBytes - storageUsedBytes);
    }

    const usedBytes = Math.max(0, totalBytes - freeBytes);
    const usedPercentage = totalBytes > 0 ? parseFloat(((usedBytes / totalBytes) * 100).toFixed(2)) : 0;

    return {
      totalBytes,
      freeBytes,
      usedBytes,
      storageUsedBytes,
      usedPercentage,
    };
  }
}

export const filesystemStorage = new FilesystemStorageProvider();
