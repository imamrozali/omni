import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env.dev if available, fallback to .env
const envFile = path.resolve(process.cwd(), '.env.dev');
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
} else {
  dotenv.config();
}

const configSchema = z.object({
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  DATABASE_URL: z.string().default('postgres://postgres:postgres@localhost:5432/omni_db'),
});

export type Config = z.infer<typeof configSchema>;

export function loadConfig(): Config {
  const result = configSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid server configuration:', result.error.flatten().fieldErrors);
    throw new Error('Failed to load server environment configuration');
  }
  return result.data;
}

export const config = loadConfig();
