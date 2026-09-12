import { config } from '../../app/config.js';
import type { HealthStatus } from './types.js';

export class HealthService {
  public getHealth(): HealthStatus {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.NODE_ENV,
    };
  }
}

export const healthService = new HealthService();
