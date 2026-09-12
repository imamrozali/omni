import type { FastifyInstance } from 'fastify';
import { storageService } from '../../storage/service.js';
import { formatSuccessResponse, formatErrorResponse, AuthorizationError, ValidationError } from '../../app/errors.js';
import { config } from '../../app/config.js';

export async function fileRoutes(fastify: FastifyInstance) {
  // Direct Data Plane upload endpoint
  fastify.post('/upload/:token', async (req, reply) => {
    const { token } = req.params as { token: string };

    const data = await req.file();
    if (!data) {
      throw new ValidationError('No file binary stream received');
    }

    const result = await storageService.uploadWithToken(token, data.file, {
      filename: data.filename,
      mimeType: data.mimetype,
    });

    return reply.status(201).send(formatSuccessResponse(result));
  });

  // Controlled media delivery endpoint (GET /cdn/originals/2026/09/uuid.png)
  fastify.get('/cdn/*', async (req, reply) => {
    const rawKey = (req.params as { '*': string })['*'];
    if (!rawKey) {
      return reply.status(400).send(formatErrorResponse('INVALID_KEY', 'Storage key is required'));
    }

    const { stream, size } = storageService.getFileStream(rawKey);

    // Apply security headers
    reply.header('Content-Length', size);
    reply.header('X-Content-Type-Options', 'nosniff');
    reply.header('Cache-Control', 'public, max-age=31536000, immutable');

    return reply.status(200).send(stream);
  });

  // Internal deletion endpoint (protected by internal token)
  fastify.delete('/internal/v1/files/*', async (req, reply) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${config.INTERNAL_AUTH_SECRET}`) {
      throw new AuthorizationError('Invalid internal service token');
    }

    const storageKey = (req.params as { '*': string })['*'];
    const success = await storageService.deleteFile(storageKey);

    return reply.status(200).send(formatSuccessResponse({ deleted: success, storageKey }));
  });

  // Internal storage disk stats endpoint (protected by internal token)
  fastify.get('/internal/v1/storage/stats', async (req, reply) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${config.INTERNAL_AUTH_SECRET}`) {
      throw new AuthorizationError('Invalid internal service token');
    }

    const stats = await storageService.getStorageStats();
    return reply.status(200).send(formatSuccessResponse(stats));
  });
}
