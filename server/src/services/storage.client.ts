import crypto from 'crypto';

export interface CreateUploadTokenParams {
  uploadId: string;
  assetId: string;
  category: string;
  allowedMimeTypes: string[];
  maxSize: number;
}

export interface FormattedByteUnits {
  bytes: number;
  b: string;
  kb: string;
  mb: string;
  gb: string;
  tb: string;
  human: string;
}

export interface StorageStatsData {
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

export class StorageClient {
  private secret: string;
  private storageBaseUrl: string;

  constructor(
    secret: string = process.env.INTERNAL_AUTH_SECRET || 'secret-omni-storage-token-key-2026',
    storageBaseUrl: string = process.env.STORAGE_BASE_URL || 'http://localhost:4001',
  ) {
    this.secret = secret;
    this.storageBaseUrl = storageBaseUrl;
  }

  /**
   * Generates a signed upload session token for direct client-to-storage Data Plane upload.
   */
  public createUploadToken(params: CreateUploadTokenParams, ttlMs: number = 900000 /* 15 mins */): string {
    const session = {
      ...params,
      expiresAt: Date.now() + ttlMs,
    };
    const json = JSON.stringify(session);
    const payloadBase64 = Buffer.from(json).toString('base64url');
    const signature = crypto.createHmac('sha256', this.secret).update(payloadBase64).digest('base64url');

    return `${payloadBase64}.${signature}`;
  }

  /**
   * Gets the public Data Plane upload URL for a token.
   */
  public getDirectUploadUrl(token: string): string {
    return `${this.storageBaseUrl}/upload/${token}`;
  }

  /**
   * Gets the public Data Plane media delivery CDN URL for a storage key.
   */
  public getCdnUrl(storageKey: string): string {
    return `${this.storageBaseUrl}/cdn/${storageKey}`;
  }

  /**
   * Fetches storage capacity and usage stats from Storage internal API.
   */
  public async getStorageStats(): Promise<StorageStatsData> {
    const res = await fetch(`${this.storageBaseUrl}/internal/v1/storage/stats`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.secret}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch storage stats: ${res.statusText}`);
    }

    const payload = (await res.json()) as { success?: boolean; data?: StorageStatsData };
    if (!payload.success || !payload.data) {
      throw new Error('Invalid storage stats response');
    }

    return payload.data;
  }
}

export const storageClient = new StorageClient();
