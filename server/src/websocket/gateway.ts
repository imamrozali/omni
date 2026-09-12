import type { FastifyInstance } from 'fastify';
import type { WebSocket } from 'ws';
import { z } from 'zod';
import { logger } from '../app/logger.js';

export const wsMessageSchema = z.object({
  id: z.string(),
  type: z.string(),
  timestamp: z.number(),
  payload: z.record(z.unknown()).default({}),
});

export type WsMessage = z.infer<typeof wsMessageSchema>;

export function registerWebSocketGateway(fastify: FastifyInstance) {
  fastify.get('/ws', { websocket: true }, (connection: any, req) => {
    const socket: WebSocket = connection.socket || connection;
    const clientId = req.id;

    logger.info({ clientId }, 'WebSocket client connected');

    socket.on('message', (rawData: Buffer | string) => {
      try {
        const rawString = rawData.toString();
        const json = JSON.parse(rawString);
        const parseResult = wsMessageSchema.safeParse(json);

        if (!parseResult.success) {
          logger.warn({ clientId, error: parseResult.error }, 'Invalid WebSocket payload received');
          socket.send(
            JSON.stringify({
              id: 'err-' + Date.now(),
              type: 'error',
              timestamp: Date.now(),
              payload: { message: 'Invalid payload format' },
            }),
          );
          return;
        }

        const message = parseResult.data;
        logger.debug({ clientId, messageType: message.type, messageId: message.id }, 'WebSocket message received');

        // Handle ping / heartbeat
        if (message.type === 'ping') {
          socket.send(
            JSON.stringify({
              id: message.id,
              type: 'pong',
              timestamp: Date.now(),
              payload: {},
            }),
          );
        }
      } catch (err) {
        logger.error({ clientId, err }, 'Failed to process WebSocket message');
      }
    });

    socket.on('close', () => {
      logger.info({ clientId }, 'WebSocket client disconnected');
    });
  });
}
