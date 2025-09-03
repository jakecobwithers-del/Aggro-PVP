import { Router } from 'express';
import { db } from './db';
import { killFeed, serverEvents, serverStatus, playerEvents } from '@shared/schema';
import { z } from 'zod';
import { sql } from 'drizzle-orm';

const router = Router();

// Webhook payload schemas
const killAnyPlayerWebhookSchema = z.object({
  event: z.literal('kill_any_player'),
  killer: z.string(),
  victim: z.string(),
  weapon: z.string(),
  distance: z.string().optional().default('Unknown'),
  killerSteamId: z.string().optional(),
  victimSteamId: z.string().optional(),
  timestamp: z.string().optional(),
});

const weatherChangedWebhookSchema = z.object({
  event: z.literal('weather_changed'),
  weather: z.string(),
  timestamp: z.string().optional(),
});

const playerJoinedWebhookSchema = z.object({
  event: z.literal('player_joined'),
  player: z.string(),
  steamId: z.string().optional(),
  timestamp: z.string().optional(),
});

const serverStatusWebhookSchema = z.object({
  event: z.enum(['status_startup', 'status_shutdown', 'status_fps', 'server_restart']),
  fps: z.number().optional(),
  playerCount: z.number().optional(),
  timestamp: z.string().optional(),
});

// Main webhook endpoint for DayZ LB Master
router.post('/dayz', async (req, res) => {
  try {
    const body = req.body;
    console.log('Received DayZ webhook:', body);
    
    // Enhanced logging for debugging
    if (body.embeds && Array.isArray(body.embeds) && body.embeds.length > 0) {
      const embed = body.embeds[0];
      console.log('Embed title:', embed.title);
      console.log('Embed fields:', embed.fields);
    }

    // Handle Discord embed format from LB Master
    if (body.embeds && Array.isArray(body.embeds) && body.embeds.length > 0) {
      const embed = body.embeds[0];
      const title = embed.title?.toLowerCase() || '';
      
      // Convert Discord embed to our event format
      if (title.includes('player joined') || title.includes('joined')) {
        const playerName = embed.fields?.find((f: any) => f.name === 'Player')?.value || 'Unknown';
        const playersField = embed.fields?.find((f: any) => f.name === 'Players' || f.name === 'Online' || f.name === 'Current Players');
        body.event = 'player_joined';
        body.player = playerName;
        body.playerCount = playersField ? parseInt(playersField.value.split('/')[0]) : undefined;
        
        console.log('Player joined detected:', playerName);
        console.log('Current players from join event:', body.playerCount);
      } else if (title.includes('server fps')) {
        const fpsField = embed.fields?.find((f: any) => f.name === 'Average' || f.name === 'FPS');
        const playersField = embed.fields?.find((f: any) => f.name === 'Players');
        const uptimeField = embed.fields?.find((f: any) => f.name === 'Uptime');
        
        body.event = 'status_fps';
        body.fps = fpsField ? parseInt(fpsField.value) : 0;
        body.playerCount = playersField ? parseInt(playersField.value) : 0;
        body.uptime = uptimeField?.value || '0s';
        
        // Determine server status from uptime - if uptime exists, server is online
        const isServerOnline = uptimeField && uptimeField.value && !uptimeField.value.includes('0s');
        body.serverStatus = isServerOnline ? 'online' : 'offline';
        
        console.log('Server Status Analysis:');
        console.log('- FPS:', body.fps);
        console.log('- Players:', body.playerCount);
        console.log('- Uptime:', body.uptime);
        console.log('- Status:', body.serverStatus);

      } else if (title.includes('server restart') || title.includes('restart')) {
        body.event = 'server_restart';
        console.log('Server restart detected');
      } else if (title.includes('shutdown')) {
        body.event = 'status_shutdown';
        console.log('Server shutdown detected');
      } else if (title.includes('startup')) {
        body.event = 'status_startup';
        console.log('Server startup detected');
      } else if (title.includes('killed player')) {
        // Skip "Killed Player" events - these are admin kills, not natural gameplay
        console.log('🚫 Skipping "Killed Player" admin event');
        return res.status(200).json({ success: true, message: 'Admin kill event ignored' });
      } else if (title.includes('kill') || title.includes('eliminated') || title.includes('death report')) {
        const killerField = embed.fields?.find((f: any) => f.name === 'Killer' || f.name === 'Killer:' || f.name === 'Admin');
        const victimField = embed.fields?.find((f: any) => f.name === 'Victim' || f.name === 'Victim:' || f.name === 'Player');
        const weaponField = embed.fields?.find((f: any) => f.name === 'Weapon');
        const distanceField = embed.fields?.find((f: any) => f.name === 'Distance');
        const detailsField = embed.fields?.find((f: any) => f.name === 'Details' || f.name === 'Details:');
        
        // Helper function to extract Steam ID and name from Discord field value
        const extractPlayerInfo = (fieldValue: string) => {
          if (!fieldValue) return { name: 'Unknown', steamId: null };
          
          // Handle format like "[sloppywet](https://steamcommunity.com/profiles/76561199090623011)"
          const profileLinkMatch = fieldValue.match(/\[([^\]]+)\]\(https:\/\/steamcommunity\.com\/profiles\/(\d+)\)/);
          if (profileLinkMatch) {
            return { name: profileLinkMatch[1], steamId: profileLinkMatch[2] };
          }
          
          // Handle format like "sloppywet\n[76561199090623011]\n[Steam Profile]..."
          if (fieldValue.includes('[') && fieldValue.includes(']')) {
            const steamIdMatch = fieldValue.match(/\[(\d+)\]/);
            if (steamIdMatch) {
              const name = fieldValue.split('\n')[0].trim();
              return { name, steamId: steamIdMatch[1] };
            }
          }
          
          return { name: fieldValue.trim(), steamId: null };
        };

        // Extract victim info
        const victimInfo = extractPlayerInfo(victimField?.value || '');
        let victimName = victimInfo.name;
        let victimSteamId = victimInfo.steamId;

        // Extract killer info
        const killerInfo = extractPlayerInfo(killerField?.value || '');
        let killerName = killerInfo.name;
        let killerSteamId = killerInfo.steamId;
        
        // Handle suicide cases where killer is "Suicide"
        if (killerName === 'Suicide' && victimSteamId) {
          killerName = victimName;
          killerSteamId = victimSteamId;
        }
        
        body.event = 'kill_any_player';
        body.killer = killerName;
        body.victim = victimName;
        body.weapon = weaponField?.value || (killerName === 'Suicide' ? 'Self-inflicted' : 'Unknown');
        body.distance = distanceField?.value || (killerName === 'Suicide' ? 'Suicide' : '0m');
        // Only set steam IDs if we actually found them, otherwise don't set Unknown
        if (killerSteamId) body.killerSteamId = killerSteamId;
        if (victimSteamId) body.victimSteamId = victimSteamId;
        
        console.log('Kill/Death Report parsed:');
        console.log('- Killer:', body.killer, '(Steam ID:', body.killerSteamId, ')');
        console.log('- Victim:', body.victim, '(Steam ID:', body.victimSteamId, ')');
        console.log('- Weapon:', body.weapon);
        console.log('- Distance:', body.distance);
      } else {
        console.log('=== UNKNOWN WEBHOOK TYPE ===');
        console.log('Title:', title);
        console.log('Fields:', embed.fields);
        console.log('Description:', embed.description);
        console.log('Timestamp:', embed.timestamp);
        console.log('Color:', embed.color);
        console.log('Full embed:', JSON.stringify(embed, null, 2));
        console.log('============================');
        
        // Check if this might be a kill/death report with different formatting
        if (embed.fields && Array.isArray(embed.fields)) {
          const hasPlayerNames = embed.fields.some((f: any) => 
            f.name?.toLowerCase().includes('player') || 
            f.name?.toLowerCase().includes('victim') || 
            f.name?.toLowerCase().includes('killer')
          );
          if (hasPlayerNames) {
            console.log('⚠️  POTENTIAL MISSED KILL/DEATH EVENT - Please check Discord format!');
          }
        }
      }
    }

    // Validate the event type
    if (!body.event) {
      return res.status(400).json({ error: 'Event type is required' });
    }

    switch (body.event) {
      case 'kill_any_player':
        const killData = killAnyPlayerWebhookSchema.parse(body);
        
        // Enhanced suicide filtering using multiple criteria
        const isSuicide = killData.killer.toLowerCase().includes('suicide') || 
                         killData.victim.toLowerCase().includes('suicide') ||
                         killData.killer === killData.victim ||
                         (killData.killerSteamId && killData.victimSteamId && killData.killerSteamId === killData.victimSteamId) ||
                         killData.weapon?.toLowerCase().includes('suicide') ||
                         killData.weapon?.toLowerCase().includes('fall') ||
                         killData.weapon?.toLowerCase().includes('environment');
        
        // Steam ID consolidation: Update player names with Steam IDs
        const storage = await import('./storage');
        if (killData.killerSteamId) {
          await storage.storage.updatePlayerBySteamId(killData.killerSteamId, killData.killer);
          killData.killer = await storage.storage.getCanonicalPlayerName(killData.killerSteamId, killData.killer);
        }
        if (killData.victimSteamId) {
          await storage.storage.updatePlayerBySteamId(killData.victimSteamId, killData.victim);
          killData.victim = await storage.storage.getCanonicalPlayerName(killData.victimSteamId, killData.victim);
        }

        // Auto-cleanup "Unknown" entries every 5 kills processed
        if (Math.random() < 0.2) { // 20% chance per webhook
          storage.storage.autoCleanupUnknownEntries();
        }

        // Check for duplicate kill events to prevent webhook reprocessing (for ALL events including suicides)
        const timestamp = killData.timestamp ? new Date(killData.timestamp) : new Date();
        const existingKill = await db.execute(sql`
          SELECT id FROM kill_feed 
          WHERE killer = ${killData.killer} 
          AND victim = ${killData.victim} 
          AND weapon = ${killData.weapon || 'Unknown'}
          AND distance = ${killData.distance || '0m'}
          AND timestamp = ${timestamp}
          AND wipe_id = 'wipe_1'
          LIMIT 1
        `);
        
        if (existingKill.rows.length === 0) {
            await db.insert(killFeed).values({
              killer: killData.killer,
              victim: killData.victim,
              weapon: killData.weapon || 'Unknown',
              distance: killData.distance || '0m',
              killerSteamId: killData.killerSteamId,
              victimSteamId: killData.victimSteamId,
              timestamp: timestamp,
            });
            
            if (isSuicide) {
              console.log(`✅ Suicide recorded in kill feed: ${killData.killer} -> ${killData.victim} (${killData.weapon})`);
              // Track suicide for Mr. Respawn leaderboard
              await storage.storage.trackSuicide(killData.victim, killData.victimSteamId);
            } else {
              console.log(`✅ Valid kill recorded: ${killData.killer} eliminated ${killData.victim} with ${killData.weapon}`);
            }
          } else {
            console.log(`⚠️  Duplicate kill event skipped: ${killData.killer} -> ${killData.victim}`);
          }
        
        break;



      case 'player_joined':
        const playerData = playerJoinedWebhookSchema.parse(body);
        console.log('Player joined:', playerData.player);
        
        // Steam ID consolidation for player join
        const storage2 = await import('./storage');
        if (playerData.steamId) {
          await storage2.storage.updatePlayerBySteamId(playerData.steamId, playerData.player);
          playerData.player = await storage2.storage.getCanonicalPlayerName(playerData.steamId, playerData.player);
        }
        
        await db.insert(playerEvents).values({
          playerName: playerData.player,
          steamId: playerData.steamId,
          eventType: 'join',
          timestamp: playerData.timestamp ? new Date(playerData.timestamp) : new Date(),
        });
        
        // Update server stats if player count is provided
        if (body.playerCount !== undefined) {
          const storage = await import('./storage');
          await storage.storage.updateServerStats({
            playersOnline: body.playerCount,
            maxPlayers: 30,
            serverStatus: 'online',
            lastActivity: new Date()
          });
          console.log('Updated server stats with player count:', body.playerCount);
        }
        break;

      case 'status_startup':
      case 'status_shutdown':
      case 'status_fps':
      case 'server_restart':
        const statusData = serverStatusWebhookSchema.parse(body);
        
        // Log the server event
        await db.insert(serverEvents).values({
          eventType: statusData.event,
          data: JSON.stringify({ 
            fps: statusData.fps,
            playerCount: statusData.playerCount 
          }),
          timestamp: statusData.timestamp ? new Date(statusData.timestamp) : new Date(),
        });

        // Update server status table based on event type and uptime
        if (statusData.event === 'status_startup') {
          await db.insert(serverStatus).values({
            isOnline: true,
            playerCount: statusData.playerCount || 0,
            maxPlayers: 40,
            fps: statusData.fps || 0,
            lastUpdate: new Date(),
          }).onConflictDoNothing();
        } else if (statusData.event === 'status_shutdown') {
          await db.insert(serverStatus).values({
            isOnline: false,
            playerCount: 0,
            maxPlayers: 40,
            fps: 0,
            lastUpdate: new Date(),
          }).onConflictDoNothing();
        } else if (statusData.event === 'status_fps') {
          // Use uptime to determine if server is online (from body.serverStatus)
          const isOnline = body.serverStatus === 'online';
          const currentPlayers = statusData.playerCount || 0;
          
          await db.insert(serverStatus).values({
            isOnline: isOnline,
            playerCount: currentPlayers,
            maxPlayers: 40,
            fps: statusData.fps || 0,
            lastUpdate: new Date(),
          }).onConflictDoNothing();
          
          // Also update the storage with current player count for server stats API
          const storage = await import('./storage');
          await storage.storage.updateServerStats({
            playersOnline: currentPlayers,
            maxPlayers: 40,
            serverStatus: isOnline ? 'online' : 'offline',
            lastActivity: new Date()
          });
          
          console.log(`Server status updated: ${isOnline ? 'ONLINE' : 'OFFLINE'} (FPS: ${statusData.fps}, Players: ${currentPlayers}, Uptime: ${body.uptime})`);
        } else if (statusData.fps) {
          await db.insert(serverStatus).values({
            isOnline: true,
            playerCount: statusData.playerCount || 0,
            maxPlayers: 40,
            fps: statusData.fps,
            lastUpdate: new Date(),
          }).onConflictDoNothing();
        }

        // Update storage for all status events with player count
        if (statusData.playerCount !== undefined) {
          const storage = await import('./storage');
          await storage.storage.updateServerStats({
            playersOnline: statusData.playerCount,
            maxPlayers: 30,
            serverStatus: statusData.event === 'status_startup' ? 'online' : 
                         statusData.event === 'status_shutdown' ? 'offline' : 'online',
            lastActivity: new Date()
          });
          console.log('Updated storage with player count:', statusData.playerCount);
        }
        break;

      default:
        return res.status(400).json({ error: 'Unknown event type' });
    }

    res.json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Alternative webhook endpoint #1 - BACKUP KILL/DEATH EVENTS
router.post('/dayz-alt1', async (req, res) => {
  console.log('=== BACKUP WEBHOOK: KILL/DEATH EVENTS ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Full payload:', JSON.stringify(req.body, null, 2));
  console.log('==========================================');
  
  try {
    const body = req.body;
    
    // Backup processing for kill/death events that miss primary webhook
    if (body.embeds && Array.isArray(body.embeds) && body.embeds.length > 0) {
      const embed = body.embeds[0];
      const title = embed.title?.toLowerCase() || '';
      
      console.log('Processing backup embed - Title:', title);
      
      if (title.includes('kill') || title.includes('death') || title.includes('eliminated') || 
          title.includes('player') || title === 'error') {
        
        console.log('🔄 BACKUP EVENT - Processing through main webhook logic');
        
        // Process through main webhook as backup
        req.body = { ...body };
        const processedReq = { ...req, url: '/dayz' };
        return router.handle(processedReq, res, () => {});
      } else {
        console.log('Non-relevant backup event - ignoring');
        return res.json({ success: true, message: 'Backup event ignored' });
      }
    }
    
    res.json({ success: true, message: 'No valid backup data found' });
  } catch (error) {
    console.error('Backup webhook error:', error);
    res.status(500).json({ error: 'Backup webhook processing failed' });
  }
});

// Alternative webhook endpoint #2 - PLAYER/KILL EVENTS (PRIMARY)
router.post('/dayz-players', async (req, res) => {
  console.log('=== PRIMARY WEBHOOK: PLAYER/KILL EVENTS ===');
  console.log('Time:', new Date().toISOString());
  console.log('Event data:', JSON.stringify(req.body, null, 2));
  console.log('===========================================');
  
  try {
    const body = req.body;
    
    // Enhanced processing for ALL player-related events including kills/deaths
    if (body.embeds && Array.isArray(body.embeds) && body.embeds.length > 0) {
      const embed = body.embeds[0];
      const title = embed.title?.toLowerCase() || '';
      
      console.log('Processing primary embed - Title:', title);
      
      // Process both player events AND kill/death events
      if (title.includes('player') || title.includes('joined') || title.includes('left') || 
          title.includes('disconnected') || title.includes('kill') || title.includes('death') || 
          title.includes('eliminated') || title.includes('report')) {
        
        console.log('✅ VALID EVENT - Processing through main webhook logic');
        
        // Process through main webhook with full kill feed and leaderboard updates
        req.body = { ...body };
        const processedReq = { ...req, url: '/dayz' };
        return router.handle(processedReq, res, () => {});
      } else {
        console.log('Non-relevant event received - ignoring');
        return res.json({ success: true, message: 'Event ignored - not relevant' });
      }
    }
    
    res.json({ success: true, message: 'No valid event data found' });
  } catch (error) {
    console.error('Primary webhook error:', error);
    res.status(500).json({ error: 'Primary webhook processing failed' });
  }
});

// Test endpoint to verify webhook is working
router.get('/test', (req, res) => {
  res.json({ 
    message: 'DayZ webhook endpoint is active',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/webhook/dayz (server events)',
      '/api/webhook/dayz-alt1 (kill/death events)',
      '/api/webhook/dayz-players (player events)'
    ],
    supportedEvents: [
      'kill_any_player',
      'weather_changed', 
      'player_joined',
      'status_startup',
      'status_shutdown', 
      'status_fps',
      'server_restart'
    ]
  });
});

export { router as webhookRouter };