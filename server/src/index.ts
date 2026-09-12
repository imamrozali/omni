import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import { config } from './app/config.js';
import { logger } from './app/logger.js';
import { AppError, formatErrorResponse } from './app/errors.js';
import { healthRoutes } from './modules/health/route.js';
import { mediaRoutes } from './modules/media/route.js';
import { registerWebSocketGateway } from './websocket/gateway.js';

async function bootstrap() {
  const app = Fastify({
    loggerInstance: logger as any,
  });

  // Security Headers
  app.addHook('onSend', async (_request, reply) => {
    reply.header('X-Content-Type-Options', 'nosniff');
    reply.header('X-Frame-Options', 'DENY');
    reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  });

  // Plugins
  await app.register(cors, {
    origin: true,
  });

  await app.register(websocket);

  // Global Error Handler
  app.setErrorHandler((error: Error & { validation?: unknown }, _request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send(formatErrorResponse(error.code, error.message));
    }

    // Fastify validation errors
    if (error.validation) {
      return reply.status(400).send(formatErrorResponse('VALIDATION_ERROR', error.message));
    }

    logger.error({ err: error }, 'Unhandled application error');

    // Production safe response
    return reply.status(500).send(formatErrorResponse('INTERNAL_SERVER_ERROR', 'An unexpected error occurred'));
  });

  // Register HTTP Routes
  await app.register(healthRoutes);
  await app.register(mediaRoutes);

  // Register WebSocket Gateway
  registerWebSocketGateway(app);

  // Listen
  try {
    await app.listen({ port: config.PORT, host: config.HOST });
    logger.info(`Server running on http://${config.HOST}:${config.PORT}`);
  } catch (err) {
    logger.fatal({ err }, 'Failed to start server');
    process.exit(1);
  }
}

bootstrap();
