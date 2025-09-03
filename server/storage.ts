import { users, killFeed, playerEvents, playerStats, suicideTracker, steamPlayers, type User, type InsertUser, type KillFeed, type InsertKillFeed, type PlayerEvent, type InsertPlayerEvent, type PlayerStats, type InsertPlayerStats, type SuicideTracker, type InsertSuicideTracker } from "@shared/schema";
import { db } from "./db";
import { eq, desc, gte, sql, and, or, isNull } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createKillFeedEntry(killFeed: InsertKillFeed): Promise<KillFeed>;
  getKillFeed(limit?: number): Promise<KillFeed[]>;
  getLeaderboard(timeframe?: string, limit?: number): Promise<any[]>;
  updateServerStats(stats: ServerStatsUpdate): Promise<void>;
  getServerStats(): Promise<ServerStats | null>;
  createPlayerEvent(playerEvent: InsertPlayerEvent): Promise<PlayerEvent>;
  getPlayerEvents(limit?: number): Promise<PlayerEvent[]>;
  trackSuicide(playerName: string, steamId?: string): Promise<SuicideTracker>;
  getSuicideStats(playerName?: string): Promise<SuicideTracker[]>;
  getMrRespawnLeaderboard(limit?: number): Promise<any[]>;
  updatePlayerBySteamId(steamId: string, playerName: string): Promise<void>;
  getCanonicalPlayerName(steamId: string, fallbackName: string): Promise<string>;
  searchPlayerBySteamId(steamId: string): Promise<any>;
  searchPlayerByName(playerName: string): Promise<any[]>;

}

interface ServerStatsUpdate {
  playersOnline?: number;
  maxPlayers?: number;
  serverStatus?: 'online' | 'offline' | 'restarting';
  lastActivity?: Date;
}

interface ServerStats {
  playersOnline: number;
  maxPlayers: number;
  serverStatus: 'online' | 'offline' | 'restarting';
  lastActivity: Date;
  uptime: number;
}



export class DatabaseStorage implements IStorage {
  private serverStats: ServerStats = {
    playersOnline: 0,
    maxPlayers: 30,
    serverStatus: 'online',
    lastActivity: new Date(),
    uptime: Date.now()
  };



  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createKillFeedEntry(insertKillFeed: InsertKillFeed): Promise<KillFeed> {
    const [killFeedEntry] = await db
      .insert(killFeed)
      .values(insertKillFeed)
      .returning();
    return killFeedEntry;
  }

  async getKillFeed(limit: number = 50): Promise<KillFeed[]> {
    const currentWipeId = 'wipe_1';
    
    // Get kill feed with Steam ID consolidation for consistent player names
    const results = await db
      .select({
        id: killFeed.id,
        killer: sql<string>`coalesce(killer_sp.current_name, ${killFeed.killer})`,
        victim: sql<string>`coalesce(victim_sp.current_name, ${killFeed.victim})`,
        weapon: killFeed.weapon,
        distance: killFeed.distance,
        killerSteamId: killFeed.killerSteamId,
        victimSteamId: killFeed.victimSteamId,
        wipeId: killFeed.wipeId,
        timestamp: killFeed.timestamp,
      })
      .from(killFeed)
      .leftJoin(sql`${steamPlayers} killer_sp`, sql`killer_sp.steam_id = ${killFeed.killerSteamId} AND killer_sp.wipe_id = ${currentWipeId}`)
      .leftJoin(sql`${steamPlayers} victim_sp`, sql`victim_sp.steam_id = ${killFeed.victimSteamId} AND victim_sp.wipe_id = ${currentWipeId}`)
      .orderBy(desc(killFeed.timestamp))
      .limit(limit);

    return results;
  }

  async getLeaderboard(category: string = 'most_kills', limit: number = 10) {
    const currentWipeId = 'wipe_1'; // This would be updated when server wipes
    
    switch (category) {
      case 'most_kills':
        const killResults = await db
          .select({
            killer: sql<string>`coalesce(killer_sp.current_name, ${killFeed.killer})`,
            totalKills: sql<number>`count(*)`,
            longestShot: sql<number>`max(case when ${killFeed.distance} ~ '^[0-9]+' then cast(regexp_replace(${killFeed.distance}, '[^0-9]', '', 'g') as integer) else 0 end)`,
            favoriteWeapon: sql<string>`mode() within group (order by ${killFeed.weapon})`,
            lastKill: sql<string>`max(${killFeed.timestamp})::text`,
          })
          .from(killFeed)
          .leftJoin(sql`${steamPlayers} killer_sp`, sql`killer_sp.steam_id = ${killFeed.killerSteamId} AND killer_sp.wipe_id = ${currentWipeId}`)
          .where(sql`${killFeed.wipeId} = ${currentWipeId}
            AND ${killFeed.killer} != ${killFeed.victim}
            AND (${killFeed.killerSteamId} IS NULL OR ${killFeed.victimSteamId} IS NULL OR ${killFeed.killerSteamId} != ${killFeed.victimSteamId})
            AND ${killFeed.weapon} NOT ILIKE '%suicide%'
            AND ${killFeed.weapon} NOT ILIKE '%fall%'
            AND ${killFeed.weapon} NOT ILIKE '%environment%'
            AND ${killFeed.weapon} NOT ILIKE '%self-inflicted%'`)
          .groupBy(sql`coalesce(killer_sp.current_name, ${killFeed.killer})`)
          .having(sql`count(*) > 0`)
          .orderBy(sql`count(*) desc`)
          .limit(limit);
        
        return killResults.map((row, index) => ({
          rank: index + 1,
          playerName: row.killer,
          value: Number(row.totalKills),
          secondaryValue: `${Number(row.longestShot) || 0}m shot`,
          details: row.favoriteWeapon || 'Unknown',
          lastActivity: row.lastKill,
          category: 'Most Kills'
        }));

      case 'longest_shots':
        const shotResults = await db
          .select({
            killer: sql<string>`coalesce(killer_sp.current_name, ${killFeed.killer})`,
            longestShot: sql<number>`max(case when ${killFeed.distance} ~ '^[0-9]+' then cast(regexp_replace(${killFeed.distance}, '[^0-9]', '', 'g') as integer) else 0 end)`,
            totalKills: sql<number>`count(*)`,
            shotWeapon: sql<string>`(array_agg(${killFeed.weapon} order by case when ${killFeed.distance} ~ '^[0-9]+' then cast(regexp_replace(${killFeed.distance}, '[^0-9]', '', 'g') as integer) else 0 end desc))[1]`,
            lastKill: sql<string>`max(${killFeed.timestamp})::text`,
          })
          .from(killFeed)
          .leftJoin(sql`${steamPlayers} killer_sp`, sql`killer_sp.steam_id = ${killFeed.killerSteamId} AND killer_sp.wipe_id = ${currentWipeId}`)
          .where(sql`${killFeed.wipeId} = ${currentWipeId} 
            AND ${killFeed.distance} ~ '^[0-9]+'
            AND ${killFeed.killer} != ${killFeed.victim}
            AND (${killFeed.killerSteamId} IS NULL OR ${killFeed.victimSteamId} IS NULL OR ${killFeed.killerSteamId} != ${killFeed.victimSteamId})
            AND ${killFeed.weapon} NOT ILIKE '%suicide%'
            AND ${killFeed.weapon} NOT ILIKE '%fall%'
            AND ${killFeed.weapon} NOT ILIKE '%environment%'
            AND ${killFeed.weapon} NOT ILIKE '%self-inflicted%'`)
          .groupBy(sql`coalesce(killer_sp.current_name, ${killFeed.killer})`)
          .having(sql`max(case when ${killFeed.distance} ~ '^[0-9]+' then cast(regexp_replace(${killFeed.distance}, '[^0-9]', '', 'g') as integer) else 0 end) > 0`)
          .orderBy(sql`max(case when ${killFeed.distance} ~ '^[0-9]+' then cast(regexp_replace(${killFeed.distance}, '[^0-9]', '', 'g') as integer) else 0 end) desc`)
          .limit(limit);
        
        return shotResults.map((row, index) => ({
          rank: index + 1,
          playerName: row.killer,
          value: `${Number(row.longestShot)}m`,
          secondaryValue: `${row.shotWeapon || 'Unknown'}`,
          details: `${Number(row.longestShot)}m shot`,
          lastActivity: row.lastKill,
          category: 'Longest Shots'
        }));

      case 'most_deaths':
        // Count deaths by looking at victims in kill feed (including suicide deaths) with Steam ID consolidation
        const deathResults = await db
          .select({
            victim: sql<string>`coalesce(victim_sp.current_name, ${killFeed.victim})`,
            totalDeaths: sql<number>`count(*)`,
            mostKilledBy: sql<string>`mode() within group (order by coalesce(killer_sp.current_name, ${killFeed.killer}))`,
            lastDeath: sql<string>`max(${killFeed.timestamp})::text`,
          })
          .from(killFeed)
          .leftJoin(sql`${steamPlayers} victim_sp`, sql`victim_sp.steam_id = ${killFeed.victimSteamId} AND victim_sp.wipe_id = ${currentWipeId}`)
          .leftJoin(sql`${steamPlayers} killer_sp`, sql`killer_sp.steam_id = ${killFeed.killerSteamId} AND killer_sp.wipe_id = ${currentWipeId}`)
          .where(sql`${killFeed.wipeId} = ${currentWipeId}`)
          .groupBy(sql`coalesce(victim_sp.current_name, ${killFeed.victim})`)
          .having(sql`count(*) > 0`)
          .orderBy(sql`count(*) desc`)
          .limit(limit);
        
        return deathResults.map((row, index) => ({
          rank: index + 1,
          playerName: row.victim,
          value: Number(row.totalDeaths),
          secondaryValue: `deaths`,
          details: row.mostKilledBy || 'Unknown',
          lastActivity: row.lastDeath,
          category: 'Most Deaths'
        }));

      case 'kd_ratio':
        // Calculate K/D ratio using Steam players table for reliable consolidation
        const kdResults = await db.execute(sql`
          WITH player_stats AS (
            SELECT 
              current_name as player_name,
              COALESCE(kill_stats.total_kills, 0) as total_kills,
              COALESCE(death_stats.total_deaths, 0) as total_deaths,
              CASE 
                WHEN COALESCE(death_stats.total_deaths, 0) > 0 
                THEN ROUND(CAST(COALESCE(kill_stats.total_kills, 0) AS DECIMAL) / CAST(death_stats.total_deaths AS DECIMAL), 3)
                ELSE COALESCE(kill_stats.total_kills, 0)
              END as kd_ratio,
              GREATEST(COALESCE(kill_stats.last_kill, '1970-01-01'), COALESCE(death_stats.last_death, '1970-01-01')) as last_activity
            FROM steam_players sp
            LEFT JOIN (
              SELECT 
                killer_steam_id,
                COUNT(*) as total_kills,
                MAX(timestamp) as last_kill
              FROM kill_feed 
              WHERE wipe_id = ${currentWipeId}
              AND killer != victim
              AND weapon NOT ILIKE '%suicide%'
              AND weapon NOT ILIKE '%self-inflicted%'
              GROUP BY killer_steam_id
            ) kill_stats ON sp.steam_id = kill_stats.killer_steam_id
            LEFT JOIN (
              SELECT 
                victim_steam_id,
                COUNT(*) as total_deaths,
                MAX(timestamp) as last_death
              FROM kill_feed 
              WHERE wipe_id = ${currentWipeId}
              GROUP BY victim_steam_id
            ) death_stats ON sp.steam_id = death_stats.victim_steam_id
            WHERE sp.wipe_id = ${currentWipeId}
            AND (COALESCE(kill_stats.total_kills, 0) > 0 OR COALESCE(death_stats.total_deaths, 0) > 0)
          )
          SELECT * FROM player_stats
          ORDER BY kd_ratio DESC
          LIMIT ${limit}
        `);
        
        return (kdResults.rows as any[]).map((row: any, index: number) => ({
          rank: index + 1,
          playerName: row.player_name,
          value: Number(row.kd_ratio).toFixed(2),
          secondaryValue: `${Number(row.total_kills)}K/${Number(row.total_deaths)}D`,
          details: Number(row.kd_ratio) >= 2 ? 'Elite PvP' : Number(row.kd_ratio) >= 1 ? 'Positive' : 'Learning',
          lastActivity: row.last_activity,
          category: 'K/D Ratio'
        }));

      case 'mr_respawn':
        return await this.getMrRespawnLeaderboard(limit);

      default:
        return [];
    }
  }

  async updateServerStats(stats: ServerStatsUpdate): Promise<void> {
    if (stats.playersOnline !== undefined) {
      this.serverStats.playersOnline = stats.playersOnline;
    }
    if (stats.maxPlayers !== undefined) {
      this.serverStats.maxPlayers = stats.maxPlayers;
    }
    if (stats.serverStatus !== undefined) {
      this.serverStats.serverStatus = stats.serverStatus;
    }
    if (stats.lastActivity !== undefined) {
      this.serverStats.lastActivity = stats.lastActivity;
    }
  }

  async getServerStats(): Promise<ServerStats | null> {
    return this.serverStats;
  }

  async trackSuicide(playerName: string, steamId?: string): Promise<SuicideTracker> {
    const currentWipeId = "wipe_1"; // Same as kill feed wipe tracking
    
    // Check if player already has suicide tracking record
    const [existingRecord] = await db
      .select()
      .from(suicideTracker)
      .where(sql`${suicideTracker.playerName} = ${playerName} AND ${suicideTracker.wipeId} = ${currentWipeId}`)
      .limit(1);

    if (existingRecord) {
      // Update existing record - just increment count
      const newSuicideCount = existingRecord.suicideCount + 1;

      const [updated] = await db
        .update(suicideTracker)
        .set({
          suicideCount: newSuicideCount,
          lastSuicide: new Date(),
          steamId: steamId || existingRecord.steamId,
        })
        .where(eq(suicideTracker.id, existingRecord.id))
        .returning();

      console.log(`Mr. Respawn: ${playerName} suicide #${newSuicideCount} (leaderboard only)`);
      return updated;
    } else {
      // Create new suicide tracking record
      const [newRecord] = await db
        .insert(suicideTracker)
        .values({
          playerName,
          steamId,
          suicideCount: 1,
          lastSuicide: new Date(),
          wipeId: currentWipeId,
        })
        .returning();

      console.log(`Mr. Respawn: First suicide tracked for ${playerName}`);
      return newRecord;
    }
  }

  async getSuicideStats(playerName?: string): Promise<SuicideTracker[]> {
    const currentWipeId = "wipe_1";
    
    if (playerName) {
      return await db
        .select()
        .from(suicideTracker)
        .where(sql`${suicideTracker.playerName} = ${playerName} AND ${suicideTracker.wipeId} = ${currentWipeId}`)
        .limit(1);
    } else {
      return await db
        .select()
        .from(suicideTracker)
        .where(sql`${suicideTracker.wipeId} = ${currentWipeId}`)
        .orderBy(desc(suicideTracker.suicideCount))
        .limit(50);
    }
  }

  async getMrRespawnLeaderboard(limit: number = 10): Promise<any[]> {
    const currentWipeId = "wipe_1";
    
    // Mr. Respawn: Count only suicide deaths from kill_feed
    const results = await db
      .select({
        victim: killFeed.victim,
        suicideCount: sql<number>`count(*)`,
        lastSuicide: sql<string>`max(${killFeed.timestamp})::text`,
        favoriteMethod: sql<string>`mode() within group (order by ${killFeed.weapon})`,
      })
      .from(killFeed)
      .where(sql`${killFeed.wipeId} = ${currentWipeId}
        AND (
          ${killFeed.killer} = ${killFeed.victim}
          OR (${killFeed.killerSteamId} IS NOT NULL AND ${killFeed.victimSteamId} IS NOT NULL AND ${killFeed.killerSteamId} = ${killFeed.victimSteamId})
          OR ${killFeed.weapon} ILIKE '%suicide%'
          OR ${killFeed.weapon} ILIKE '%fall%'
          OR ${killFeed.weapon} ILIKE '%environment%'
          OR ${killFeed.weapon} ILIKE '%self-inflicted%'
        )`)
      .groupBy(killFeed.victim)
      .having(sql`count(*) > 0`)
      .orderBy(sql`count(*) desc`)
      .limit(limit);

    return results.map((row, index) => ({
      rank: index + 1,
      playerName: row.victim,
      value: Number(row.suicideCount),
      secondaryValue: `suicides`,
      details: row.favoriteMethod || 'Self-harm specialist',
      lastActivity: row.lastSuicide,
      category: 'Mr. Respawn'
    }));
  }



  async createPlayerEvent(insertPlayerEvent: InsertPlayerEvent): Promise<PlayerEvent> {
    const [playerEvent] = await db
      .insert(playerEvents)
      .values(insertPlayerEvent)
      .returning();
    return playerEvent;
  }

  async getPlayerEvents(limit: number = 50): Promise<PlayerEvent[]> {
    return await db
      .select()
      .from(playerEvents)
      .orderBy(desc(playerEvents.timestamp))
      .limit(limit);
  }

  // Steam ID management for player consolidation
  async updatePlayerBySteamId(steamId: string, playerName: string): Promise<void> {
    const currentWipeId = "wipe_1";
    
    // Check if Steam ID already exists
    const [existingPlayer] = await db
      .select()
      .from(steamPlayers)
      .where(sql`${steamPlayers.steamId} = ${steamId} AND ${steamPlayers.wipeId} = ${currentWipeId}`)
      .limit(1);

    if (existingPlayer) {
      // Update existing player - check if name changed
      const previousNames = existingPlayer.previousNames || [];
      if (existingPlayer.currentName !== playerName && !previousNames.includes(existingPlayer.currentName)) {
        previousNames.push(existingPlayer.currentName);
      }

      await db
        .update(steamPlayers)
        .set({
          currentName: playerName,
          previousNames: previousNames,
          lastSeen: new Date(),
        })
        .where(eq(steamPlayers.id, existingPlayer.id));

      console.log(`Steam ID consolidation: ${steamId} name updated from "${existingPlayer.currentName}" to "${playerName}"`);
    } else {
      // Create new Steam ID record
      await db
        .insert(steamPlayers)
        .values({
          steamId,
          currentName: playerName,
          previousNames: [],
          wipeId: currentWipeId,
        });

      console.log(`Steam ID consolidation: New player registered - ${playerName} (${steamId})`);
    }
  }

  async getCanonicalPlayerName(steamId: string, fallbackName: string): Promise<string> {
    const currentWipeId = "wipe_1";
    
    if (!steamId) {
      return fallbackName; // No Steam ID available, use fallback
    }

    // Get the most recent name for this Steam ID
    const [player] = await db
      .select()
      .from(steamPlayers)
      .where(sql`${steamPlayers.steamId} = ${steamId} AND ${steamPlayers.wipeId} = ${currentWipeId}`)
      .limit(1);

    return player ? player.currentName : fallbackName;
  }

  async searchPlayerBySteamId(steamId: string): Promise<any> {
    const currentWipeId = "wipe_1";
    
    // Get player info from steam_players table
    const [steamPlayer] = await db
      .select()
      .from(steamPlayers)
      .where(sql`${steamPlayers.steamId} = ${steamId} AND ${steamPlayers.wipeId} = ${currentWipeId}`)
      .limit(1);

    if (!steamPlayer) {
      return null;
    }

    // Get player statistics from kill feed (excluding suicides)
    const killStats = await db.execute(sql`
      SELECT 
        COUNT(*) FILTER (WHERE killer_steam_id = ${steamId} 
          AND killer != victim 
          AND (killer_steam_id IS NULL OR victim_steam_id IS NULL OR killer_steam_id != victim_steam_id)
          AND weapon NOT ILIKE '%suicide%' 
          AND weapon NOT ILIKE '%fall%' 
          AND weapon NOT ILIKE '%environment%'
          AND weapon NOT ILIKE '%self-inflicted%') as total_kills,
        COUNT(*) FILTER (WHERE victim_steam_id = ${steamId}) as total_deaths,
        MAX(CASE WHEN killer_steam_id = ${steamId} AND distance ~ '^[0-9]+' 
            AND killer != victim
            AND (killer_steam_id IS NULL OR victim_steam_id IS NULL OR killer_steam_id != victim_steam_id)
            AND weapon NOT ILIKE '%suicide%'
            AND weapon NOT ILIKE '%fall%'
            AND weapon NOT ILIKE '%environment%'
            AND weapon NOT ILIKE '%self-inflicted%'
            THEN CAST(REGEXP_REPLACE(distance, '[^0-9]', '', 'g') AS INTEGER) ELSE 0 END) as longest_shot,
        MODE() WITHIN GROUP (ORDER BY weapon) FILTER (WHERE killer_steam_id = ${steamId} 
          AND killer != victim 
          AND (killer_steam_id IS NULL OR victim_steam_id IS NULL OR killer_steam_id != victim_steam_id)
          AND weapon NOT ILIKE '%suicide%' 
          AND weapon NOT ILIKE '%fall%' 
          AND weapon NOT ILIKE '%environment%'
          AND weapon NOT ILIKE '%self-inflicted%') as favorite_weapon,
        MAX(timestamp) FILTER (WHERE killer_steam_id = ${steamId} OR victim_steam_id = ${steamId}) as last_seen
      FROM kill_feed 
      WHERE wipe_id = ${currentWipeId} 
      AND (killer_steam_id = ${steamId} OR victim_steam_id = ${steamId})
    `);

    const stats = killStats.rows[0] as any;
    const totalKills = Number(stats.total_kills) || 0;
    const totalDeaths = Number(stats.total_deaths) || 0;
    const kdRatio = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : totalKills.toString();

    return {
      steamId: steamPlayer.steamId,
      currentName: steamPlayer.currentName,
      previousNames: steamPlayer.previousNames,
      firstSeen: steamPlayer.firstSeen,
      lastSeen: stats.last_seen || steamPlayer.lastSeen,
      statistics: {
        totalKills: totalKills,
        totalDeaths: totalDeaths,
        kdRatio: Number(kdRatio) || 0,
        longestShot: Number(stats.longest_shot) || 0,
        favoriteWeapon: String(stats.favorite_weapon) || 'None'
      }
    };
  }

  async searchPlayerByName(playerName: string): Promise<any[]> {
    const currentWipeId = "wipe_1";
    const searchTerm = `%${playerName.toLowerCase()}%`;
    
    // Search in steam_players table for current and previous names
    const steamResults = await db.execute(sql`
      SELECT DISTINCT steam_id, current_name, previous_names, first_seen, last_seen
      FROM steam_players 
      WHERE wipe_id = ${currentWipeId}
      AND (LOWER(current_name) LIKE ${searchTerm} 
           OR EXISTS (
             SELECT 1 FROM UNNEST(previous_names) AS prev_name 
             WHERE LOWER(prev_name) LIKE ${searchTerm}
           ))
      ORDER BY current_name
    `);

    const results = [];
    const seenSteamIds = new Set<string>();
    
    for (const player of steamResults.rows) {
      // Prevent duplicates by checking if we've already processed this Steam ID
      if (!seenSteamIds.has(String(player.steam_id))) {
        seenSteamIds.add(String(player.steam_id));
        const playerData = await this.searchPlayerBySteamId(String(player.steam_id));
        if (playerData) {
          results.push(playerData);
        }
      }
    }

    return results;
  }

  // Data integrity verification
  async verifyDataIntegrity(): Promise<{ consistent: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    // Check for kill_feed entries without proper Steam ID consolidation
    const unconsolidatedKills = await db.execute(sql`
      SELECT killer, COUNT(*) as count
      FROM kill_feed 
      WHERE wipe_id = 'wipe_1' 
      AND killer_steam_id IS NULL 
      AND EXISTS (
        SELECT 1 FROM steam_players 
        WHERE current_name = killer OR killer = ANY(previous_names)
      )
      GROUP BY killer
    `);
    
    if (unconsolidatedKills.rows.length > 0) {
      issues.push(`Found ${unconsolidatedKills.rows.length} kill_feed entries with missing Steam ID consolidation`);
    }

    // Check for duplicate kill events
    const duplicateKills = await db.execute(sql`
      SELECT killer, victim, weapon, distance, timestamp, COUNT(*) as duplicate_count
      FROM kill_feed 
      WHERE wipe_id = 'wipe_1'
      GROUP BY killer, victim, weapon, distance, timestamp
      HAVING COUNT(*) > 1
    `);
    
    if (duplicateKills.rows.length > 0) {
      issues.push(`Found ${duplicateKills.rows.length} duplicate kill events`);
    }

    // Check leaderboard consistency
    const leaderboardData = await this.getLeaderboard('most_kills', 10);
    const killFeedTotals = await db.execute(sql`
      SELECT 
        coalesce(sp.current_name, kf.killer) as player_name,
        COUNT(*) as total_kills
      FROM kill_feed kf
      LEFT JOIN steam_players sp ON sp.steam_id = kf.killer_steam_id AND sp.wipe_id = 'wipe_1'
      WHERE kf.wipe_id = 'wipe_1'
      GROUP BY coalesce(sp.current_name, kf.killer), kf.killer_steam_id
      ORDER BY COUNT(*) DESC
    `);

    for (const leaderEntry of leaderboardData) {
      const killFeedEntry = killFeedTotals.rows.find(row => row.player_name === leaderEntry.playerName);
      if (!killFeedEntry || killFeedEntry.total_kills !== leaderEntry.value) {
        issues.push(`Leaderboard mismatch for ${leaderEntry.playerName}: leaderboard=${leaderEntry.value}, kill_feed=${killFeedEntry?.total_kills || 0}`);
      }
    }

    return {
      consistent: issues.length === 0,
      issues
    };
  }

  // Admin management methods
  async resetWipeData(): Promise<{ success: boolean; deletedEntries: number; details?: any }> {
    try {
      const wipeId = 'wipe_1';
      
      // Count before deletion for accurate reporting
      const killFeedCount = await db.execute(sql`SELECT COUNT(*) as count FROM kill_feed WHERE wipe_id = ${wipeId}`);
      const steamPlayersCount = await db.execute(sql`SELECT COUNT(*) as count FROM steam_players WHERE wipe_id = ${wipeId}`);
      const suicideCount = await db.execute(sql`SELECT COUNT(*) as count FROM suicide_tracker WHERE wipe_id = ${wipeId}`);
      
      const kfCount = Number((killFeedCount.rows[0] as any).count);
      const spCount = Number((steamPlayersCount.rows[0] as any).count);
      const sCount = Number((suicideCount.rows[0] as any).count);
      
      // Delete all data for current wipe
      await db.execute(sql`DELETE FROM kill_feed WHERE wipe_id = ${wipeId}`);
      await db.execute(sql`DELETE FROM steam_players WHERE wipe_id = ${wipeId}`);
      await db.execute(sql`DELETE FROM suicide_tracker WHERE wipe_id = ${wipeId}`);
      
      const totalDeleted = kfCount + spCount + sCount;
      
      console.log(`🗑️ WIPE RESET COMPLETE: Deleted ${kfCount} kill feed entries, ${spCount} steam players, ${sCount} suicide entries`);
      
      return { 
        success: true, 
        deletedEntries: totalDeleted,
        details: {
          killFeed: kfCount,
          steamPlayers: spCount,
          suicides: sCount
        }
      };
    } catch (error) {
      console.error('Failed to reset wipe data:', error);
      throw error;
    }
  }

  async cleanupInvalidEntries(): Promise<{ success: boolean; deletedEntries: number }> {
    try {
      let totalDeleted = 0;

      // Remove "Unknown" killer/victim entries (admin kills and parsing failures)
      const deleteUnknownResult = await db.execute(sql`
        DELETE FROM kill_feed 
        WHERE wipe_id = 'wipe_1'
        AND (killer = 'Unknown' OR victim = 'Unknown')
      `);
      totalDeleted += deleteUnknownResult.rowCount || 0;

      // Remove entries without proper Steam IDs
      const deleteNoSteamIdResult = await db.execute(sql`
        DELETE FROM kill_feed 
        WHERE wipe_id = 'wipe_1'
        AND (killer_steam_id = 'Unknown' OR victim_steam_id = 'Unknown')
      `);
      totalDeleted += deleteNoSteamIdResult.rowCount || 0;

      // Fix suicide entries with "Unknown" weapon
      await db.execute(sql`
        UPDATE kill_feed 
        SET weapon = 'Self-inflicted', distance = 'Suicide'
        WHERE wipe_id = 'wipe_1'
        AND killer = victim 
        AND weapon = 'Unknown' 
        AND distance = '0m'
      `);

      if (totalDeleted > 0) {
        console.log(`🧹 Auto-cleanup: Removed ${totalDeleted} invalid "Unknown" entries`);
      }
      
      return { success: true, deletedEntries: totalDeleted };
    } catch (error) {
      console.error('Failed to cleanup invalid entries:', error);
      throw error;
    }
  }

  // Auto-cleanup function that runs periodically
  async autoCleanupUnknownEntries(): Promise<void> {
    try {
      const result = await this.cleanupInvalidEntries();
      if (result.deletedEntries > 0) {
        console.log(`🔄 Auto-cleanup completed: ${result.deletedEntries} entries removed`);
      }
    } catch (error) {
      console.error('Auto-cleanup failed:', error);
    }
  }

  async consolidatePlayers(): Promise<{ success: boolean; updatedEntries: number }> {
    try {
      // This method already runs on every webhook, so just return current state
      const allPlayers = await db.select().from(steamPlayers).where(eq(steamPlayers.wipeId, 'wipe_1'));
      return { success: true, updatedEntries: allPlayers.length };
    } catch (error) {
      console.error('Failed to consolidate players:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
