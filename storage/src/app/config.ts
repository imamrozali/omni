import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envFile = path.resolve(process.cwd(), '.env.dev');
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
} else {
  dotenv.config();
}

const configSchema = z.object({
  PORT: z.coerce.number().default(4001),
  HOST: z.string().default('0.0.0.0'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  STORAGE_ROOT: z.string().default('./.data'),
  STORAGE_MAX_FILE_SIZE: z.coerce.number().default(52428800), // 50MB
  STORAGE_PUBLIC_BASE_URL: z.string().default('http://localhost:4001'),
  INTERNAL_AUTH_SECRET: z.string().default('secret-omni-storage-token-key-2026'),
});

export type StorageConfig = z.infer<typeof configSchema>;

export function loadConfig(): StorageConfig {
  const result = configSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid storage configuration:', result.error.flatten().fieldErrors);
    throw new Error('Failed to load storage environment configuration');
  }
  return result.data;
}

export const config = loadConfig();
