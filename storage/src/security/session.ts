import crypto from 'crypto';
import { config } from '../app/config.js';
import { AuthenticationError, AuthorizationError, ValidationError } from '../app/errors.js';

export interface UploadSessionData {
  uploadId: string;
  assetId: string;
  category: string;
  allowedMimeTypes: string[];
  maxSize: number;
  expiresAt: number; // unix timestamp ms
}

export class StorageSessionManager {
  private secret: string;

  constructor(secret: string = config.INTERNAL_AUTH_SECRET) {
    this.secret = secret;
  }

  /**
   * Generates a signed, scoped, time-limited upload token.
   */
  public createUploadToken(data: Omit<UploadSessionData, 'expiresAt'>, ttlMs: number = 900000 /* 15 mins */): string {
    const session: UploadSessionData = {
      ...data,
      expiresAt: Date.now() + ttlMs,
    };
    const json = JSON.stringify(session);
    const payloadBase64 = Buffer.from(json).toString('base64url');
    const signature = crypto.createHmac('sha256', this.secret).update(payloadBase64).digest('base64url');

    return `${payloadBase64}.${signature}`;
  }

  /**
   * Verifies and decodes an upload token.
   */
  public verifyUploadToken(token: string): UploadSessionData {
    if (!token || !token.includes('.')) {
      throw new AuthenticationError('Invalid storage upload token format');
    }

    const [payloadBase64, signature] = token.split('.');
    const expectedSignature = crypto.createHmac('sha256', this.secret).update(payloadBase64).digest('base64url');

    if (signature !== expectedSignature) {
      throw new AuthorizationError('Invalid upload token signature');
    }

    try {
      const json = Buffer.from(payloadBase64, 'base64url').toString('utf8');
      const session: UploadSessionData = JSON.parse(json);

      if (Date.now() > session.expiresAt) {
        throw new AuthorizationError('Upload session has expired');
      }

      return session;
    } catch (err) {
      if (err instanceof AuthorizationError) throw err;
      throw new ValidationError('Failed to parse upload session payload');
    }
  }
}

export const storageSessionManager = new StorageSessionManager();
