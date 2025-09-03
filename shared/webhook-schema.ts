import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Kill Feed Events
export const killFeedEvents = pgTable('kill_feed_events', {
  id: serial('id').primaryKey(),
  killer: text('killer').notNull(),
  victim: text('victim').notNull(),
  weapon: text('weapon').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Server Events (weather, status, etc.)
export const serverEvents = pgTable('server_events', {
  id: serial('id').primaryKey(),
  eventType: text('event_type').notNull(), // 'weather_changed', 'player_joined', 'status_startup', etc.
  data: text('data').notNull(), // JSON string with event details
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Server Status
export const serverStatus = pgTable('server_status', {
  id: serial('id').primaryKey(),
  isOnline: boolean('is_online').default(false).notNull(),
  playerCount: integer('player_count').default(0).notNull(),
  maxPlayers: integer('max_players').default(40).notNull(),
  fps: integer('fps').default(0),
  lastUpdate: timestamp('last_update').defaultNow().notNull(),
});

// Zod schemas for validation
export const insertKillFeedEventSchema = createInsertSchema(killFeedEvents).omit({
  id: true,
  createdAt: true,
});

export const insertServerEventSchema = createInsertSchema(serverEvents).omit({
  id: true,
  createdAt: true,
});

export const insertServerStatusSchema = createInsertSchema(serverStatus).omit({
  id: true,
});

// Types
export type KillFeedEvent = typeof killFeedEvents.$inferSelect;
export type InsertKillFeedEvent = z.infer<typeof insertKillFeedEventSchema>;
export type ServerEvent = typeof serverEvents.$inferSelect;
export type InsertServerEvent = z.infer<typeof insertServerEventSchema>;
export type ServerStatus = typeof serverStatus.$inferSelect;
export type InsertServerStatus = z.infer<typeof insertServerStatusSchema>;

// Webhook payload schemas
export const killAnyPlayerWebhookSchema = z.object({
  event: z.literal('kill_any_player'),
  killer: z.string(),
  victim: z.string(),
  weapon: z.string(),
  distance: z.string().default('0m'),
  killerSteamId: z.string().default('Unknown'),
  victimSteamId: z.string().default('Unknown'),
  timestamp: z.string().optional(),
});

export const weatherChangedWebhookSchema = z.object({
  event: z.literal('weather_changed'),
  weather: z.string(),
  timestamp: z.string().optional(),
});

export const playerJoinedWebhookSchema = z.object({
  event: z.literal('player_joined'),
  player: z.string(),
  steamId: z.string().optional(),
  playerCount: z.number().optional(),
  timestamp: z.string().optional(),
});

export const serverStatusWebhookSchema = z.object({
  event: z.enum(['status_startup', 'status_shutdown', 'status_fps', 'server_restart']),
  fps: z.number().optional(),
  playerCount: z.number().optional(),
  uptime: z.string().optional(),
  serverStatus: z.string().optional(),
  timestamp: z.string().optional(),
});

export type KillAnyPlayerWebhook = z.infer<typeof killAnyPlayerWebhookSchema>;
export type WeatherChangedWebhook = z.infer<typeof weatherChangedWebhookSchema>;
export type PlayerJoinedWebhook = z.infer<typeof playerJoinedWebhookSchema>;
export type ServerStatusWebhook = z.infer<typeof serverStatusWebhookSchema>;