import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FilesystemStorageProvider } from './filesystem.js';
import fs from 'fs';
import path from 'path';

describe('FilesystemStorageProvider Unit Tests', () => {
  const testDir = path.resolve(process.cwd(), '.test-data');
  let provider: FilesystemStorageProvider;

  beforeAll(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    provider = new FilesystemStorageProvider(testDir);
  });

  afterAll(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should save buffer atomically and read stream back', async () => {
    const key = 'test/2026/09/sample.txt';
    const content = Buffer.from('Hello Omni Storage System');

    const result = await provider.saveBuffer(key, content);
    expect(result.storageKey).toBe(key);
    expect(result.size).toBe(content.length);

    expect(provider.fileExists(key)).toBe(true);

    const { stream, size } = provider.getReadStream(key);
    expect(size).toBe(content.length);

    let readData = '';
    for await (const chunk of stream) {
      readData += chunk.toString();
    }
    expect(readData).toBe('Hello Omni Storage System');
  });

  it('should delete stored file safely', async () => {
    const key = 'test/2026/09/to-delete.txt';
    await provider.saveBuffer(key, Buffer.from('delete me'));

    expect(provider.fileExists(key)).toBe(true);
    const deleted = await provider.deleteFile(key);
    expect(deleted).toBe(true);
    expect(provider.fileExists(key)).toBe(false);
  });
});
