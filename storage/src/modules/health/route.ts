import type { FastifyInstance } from 'fastify';
import { config } from '../../app/config.js';
import { formatSuccessResponse } from '../../app/errors.js';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (_req, reply) => {
    return reply.status(200).send(
      formatSuccessResponse({
        service: 'omni-storage',
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.NODE_ENV,
      }),
    );
  });
}
