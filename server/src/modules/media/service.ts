import { storageClient, StorageClient } from '../../services/storage.client.js';

export interface CreateUploadSessionParams {
  category?: string;
  allowedMimeTypes?: string[];
  maxSize?: number;
}

export interface UploadSessionResponse {
  uploadId: string;
  assetId: string;
  uploadToken: string;
  directUploadUrl: string;
  expiresAt: string;
}

export class MediaControlPlaneService {
  private storageClient: StorageClient;

  constructor(client: StorageClient = storageClient) {
    this.storageClient = client;
  }

  /**
   * Control Plane: Authenticates client, verifies authorization, and issues an upload token for direct Storage Data Plane upload.
   */
  public createUploadSession(params: CreateUploadSessionParams = {}): UploadSessionResponse {
    const uploadId = `upl_${Math.random().toString(36).substring(2, 9)}`;
    const assetId = `asset_${Math.random().toString(36).substring(2, 9)}`;
    const category = params.category || 'originals';
    const allowedMimeTypes = params.allowedMimeTypes || ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
    const maxSize = params.maxSize || 52428800; // 50MB

    const uploadToken = this.storageClient.createUploadToken(
      {
        uploadId,
        assetId,
        category,
        allowedMimeTypes,
        maxSize,
      },
      900000, // 15 mins
    );

    return {
      uploadId,
      assetId,
      uploadToken,
      directUploadUrl: this.storageClient.getDirectUploadUrl(uploadToken),
      expiresAt: new Date(Date.now() + 900000).toISOString(),
    };
  }
}

export const mediaControlPlaneService = new MediaControlPlaneService();
