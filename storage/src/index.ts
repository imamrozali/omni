import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { config } from './app/config.js';
import { logger } from './app/logger.js';
import { AppError, formatErrorResponse } from './app/errors.js';
import { healthRoutes } from './modules/health/route.js';
import { fileRoutes } from './modules/files/route.js';

async function bootstrap() {
  const app = Fastify({
    loggerInstance: logger as any,
  });

  // CORS Policy
  await app.register(cors, {
    origin: true,
  });

  // Multipart support for binary uploads
  await app.register(multipart, {
    limits: {
      fileSize: config.STORAGE_MAX_FILE_SIZE,
    },
  });

  // Global Error Handler
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send(formatErrorResponse(error.code, error.message));
    }

    logger.error({ err: error }, 'Unhandled storage error');

    return reply.status(500).send(formatErrorResponse('INTERNAL_STORAGE_ERROR', 'An unexpected storage error occurred'));
  });

  // Register Routes
  await app.register(healthRoutes);
  await app.register(fileRoutes);

  // Start Server
  try {
    await app.listen({ port: config.PORT, host: config.HOST });
    logger.info(`Storage service running on http://${config.HOST}:${config.PORT}`);
  } catch (err) {
    logger.fatal({ err }, 'Failed to start storage service');
    process.exit(1);
  }
}

bootstrap();
