import { defineConfig } from 'drizzle-kit';
import { config } from './src/app/config.js';

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.DATABASE_URL,
  },
});
