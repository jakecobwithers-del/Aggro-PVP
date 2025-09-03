import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  playtime: text("playtime"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const killFeed = pgTable("kill_feed", {
  id: serial("id").primaryKey(),
  killer: text("killer").notNull(),
  victim: text("victim").notNull(),
  weapon: text("weapon").notNull(),
  distance: text("distance").notNull(),
  killerSteamId: text("killer_steam_id"),
  victimSteamId: text("victim_steam_id"),
  wipeId: text("wipe_id").default("wipe_1").notNull(), // Track server wipes
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const playerStats = pgTable("player_stats", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  steamId: text("steam_id"),
  totalKills: integer("total_kills").default(0).notNull(),
  totalDeaths: integer("total_deaths").default(0).notNull(),
  longestKillStreak: integer("longest_kill_streak").default(0).notNull(),
  bestWeapon: text("best_weapon"),
  longestShot: integer("longest_shot").default(0).notNull(),
  firstSeen: timestamp("first_seen").defaultNow().notNull(),
  lastSeen: timestamp("last_seen").defaultNow().notNull(),
  totalPlaytime: integer("total_playtime").default(0).notNull(), // in minutes
});

export const playerEvents = pgTable("player_events", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  steamId: text("steam_id"),
  eventType: text("event_type").notNull(), // 'join' | 'leave'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const serverEvents = pgTable("server_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(), // 'weather_changed', 'status_startup', etc.
  data: text("data").notNull(), // JSON string with event details
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Steam ID to Player Name mapping for consolidation
export const steamPlayers = pgTable("steam_players", {
  id: serial("id").primaryKey(),
  steamId: text("steam_id").notNull().unique(),
  currentName: text("current_name").notNull(),
  previousNames: text("previous_names").array().default([]),
  firstSeen: timestamp("first_seen").defaultNow(),
  lastSeen: timestamp("last_seen").defaultNow(),
  wipeId: text("wipe_id").default("wipe_1").notNull(),
});

export const suicideTracker = pgTable("suicide_tracker", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  steamId: text("steam_id"),
  suicideCount: integer("suicide_count").default(0).notNull(),
  lastSuicide: timestamp("last_suicide").defaultNow().notNull(),
  wipeId: text("wipe_id").default("wipe_1").notNull(),
});

export const serverStatus = pgTable("server_status", {
  id: serial("id").primaryKey(),
  isOnline: boolean("is_online").default(false).notNull(),
  playerCount: integer("player_count").default(0).notNull(),
  maxPlayers: integer("max_players").default(40).notNull(),
  fps: integer("fps").default(0),
  lastUpdate: timestamp("last_update").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSuicideTrackerSchema = createInsertSchema(suicideTracker).omit({
  id: true,
});

export type SuicideTracker = typeof suicideTracker.$inferSelect;
export type InsertSuicideTracker = z.infer<typeof insertSuicideTrackerSchema>;

export const insertReviewSchema = createInsertSchema(reviews).pick({
  playerName: true,
  rating: true,
  comment: true,
  playtime: true,
});

export const insertKillFeedSchema = createInsertSchema(killFeed).pick({
  killer: true,
  victim: true,
  weapon: true,
  distance: true,
  killerSteamId: true,
  victimSteamId: true,
  wipeId: true,
});

export const insertPlayerStatsSchema = createInsertSchema(playerStats).omit({
  id: true,
});

export const insertPlayerEventSchema = createInsertSchema(playerEvents).pick({
  playerName: true,
  steamId: true,
  eventType: true,
});

export const insertServerEventSchema = createInsertSchema(serverEvents).omit({
  id: true,
  createdAt: true,
});

export const insertServerStatusSchema = createInsertSchema(serverStatus).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertKillFeed = z.infer<typeof insertKillFeedSchema>;
export type KillFeed = typeof killFeed.$inferSelect;
export type InsertPlayerStats = z.infer<typeof insertPlayerStatsSchema>;
export type PlayerStats = typeof playerStats.$inferSelect;
export type InsertPlayerEvent = z.infer<typeof insertPlayerEventSchema>;
export type PlayerEvent = typeof playerEvents.$inferSelect;
export type InsertServerEvent = z.infer<typeof insertServerEventSchema>;
export type ServerEvent = typeof serverEvents.$inferSelect;
export type InsertServerStatus = z.infer<typeof insertServerStatusSchema>;
export type ServerStatus = typeof serverStatus.$inferSelect;
