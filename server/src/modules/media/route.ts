import type { FastifyInstance } from 'fastify';
import { mediaControlPlaneService } from './service.js';
import { storageClient } from '../../services/storage.client.js';
import { formatSuccessResponse } from '../../app/errors.js';

export async function mediaRoutes(fastify: FastifyInstance) {
  // Control Plane endpoint: Issue upload session token for direct Storage Data Plane transfer
  fastify.post('/api/v1/media/upload-token', async (req, reply) => {
    const body = (req.body as Record<string, unknown>) || {};
    const session = mediaControlPlaneService.createUploadSession({
      category: typeof body.category === 'string' ? body.category : 'originals',
      allowedMimeTypes: Array.isArray(body.allowedMimeTypes) ? (body.allowedMimeTypes as string[]) : undefined,
      maxSize: typeof body.maxSize === 'number' ? body.maxSize : undefined,
    });

    return reply.status(201).send(formatSuccessResponse(session));
  });

  // Whitelisted Control Plane endpoint: Get storage space usage & free space stats
  fastify.get('/api/v1/storage/stats', async (_req, reply) => {
    const stats = await storageClient.getStorageStats();
    return reply.status(200).send(formatSuccessResponse(stats));
  });
}
