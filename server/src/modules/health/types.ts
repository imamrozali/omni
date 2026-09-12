export interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
}
