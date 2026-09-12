import { pgTable, varchar, timestamp, text } from 'drizzle-orm/pg-core';

export const systemLogs = pgTable('system_logs', {
  id: varchar('id', { length: 36 }).primaryKey(),
  level: varchar('level', { length: 20 }).notNull(),
  module: varchar('module', { length: 100 }).notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
