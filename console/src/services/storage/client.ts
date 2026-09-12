export interface UploadOptions {
  serverUrl?: string;
  storageUrl?: string;
  category?: 'originals' | 'previews' | 'prints';
  allowedMimeTypes?: string[];
  maxSize?: number;
}

export interface StorageUploadResult {
  key: string;
  filename: string;
  mimeType: string;
  size: number;
  hash: string;
  url: string;
}

export class DirectStorageClient {
  private serverUrl: string;
  private storageUrl: string;

  constructor(serverUrl = 'http://localhost:4000', storageUrl = 'http://localhost:4001') {
    this.serverUrl = serverUrl;
    this.storageUrl = storageUrl;
  }

  async requestToken(options: UploadOptions = {}): Promise<string> {
    const res = await fetch(`${this.serverUrl}/api/v1/media/upload-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: options.category || 'originals',
        allowedMimeTypes: options.allowedMimeTypes,
        maxSize: options.maxSize,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to request upload token: ${res.statusText}`);
    }

    const payload = (await res.json()) as { success?: boolean; data?: { token?: string } };
    if (!payload.success || !payload.data?.token) {
      throw new Error('Invalid token response from server');
    }

    return payload.data.token;
  }

  async uploadFile(file: Blob | File, filename: string, token: string): Promise<StorageUploadResult> {
    const formData = new FormData();
    formData.append('file', file, filename);

    const res = await fetch(`${this.storageUrl}/upload/${token}`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errJson = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
      throw new Error(errJson?.error?.message || `Upload failed with status ${res.status}`);
    }

    const payload = (await res.json()) as { success?: boolean; data?: StorageUploadResult };
    if (!payload.success || !payload.data) {
      throw new Error('Invalid upload response from storage');
    }

    return payload.data;
  }

  async directUpload(file: Blob | File, filename: string, options: UploadOptions = {}): Promise<StorageUploadResult> {
    const token = await this.requestToken(options);
    return this.uploadFile(file, filename, token);
  }
}
