import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getSteamAvatarEndpoint, getMultipleSteamAvatars } from "./steam";
import express from "express";
import path from "path";

import { webhookRouter } from './webhook';

export async function registerRoutes(app: Express): Promise<Server> {
  // Add CORS headers for all webhook endpoints to fix "unreachable" issue
  app.use('/api/webhook', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, User-Agent');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Register webhook routes
  app.use('/api/webhook', webhookRouter);

  // Kill feed endpoint
  app.get("/api/killfeed", async (req, res) => {
    try {
      const killFeed = await storage.getKillFeed(50);
      res.json(killFeed);
    } catch (error) {
      console.error('Kill feed error:', error);
      res.status(500).json({ error: 'Failed to fetch kill feed' });
    }
  });





  // DayZ server stats endpoint - uses webhook data for real-time info
  app.get("/api/server/stats", async (req, res) => {
    try {
      // Calculate estimated player count from recent kill feed activity
      const recentKills = await storage.getKillFeed(20);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const recentActivity = recentKills.filter(kill => new Date(kill.timestamp) > fiveMinutesAgo);
      
      // Get unique players from recent activity
      const activePlayers = new Set();
      recentActivity.forEach(kill => {
        // Normalize player names to avoid duplicates from suicide entries
        const normalizedKiller = kill.killer.replace(/\s*\(Suicide\)$/i, '').trim();
        const normalizedVictim = kill.victim.replace(/\s*\(Suicide\)$/i, '').trim();
        activePlayers.add(normalizedKiller);
        activePlayers.add(normalizedVictim);
      });
      
      const estimatedPlayers = Math.max(activePlayers.size, recentActivity.length > 0 ? 2 : 0);
      
      // Get server stats from webhook data instead of external APIs
      const webhookStats = await storage.getServerStats();
      
      if (webhookStats) {
        // Use webhook player count directly - it's the most accurate source
        const playerCount = webhookStats.playersOnline;
        
        // Calculate if server is considered active (recent activity within 5 minutes)
        const isRecentlyActive = webhookStats.lastActivity && 
          (Date.now() - webhookStats.lastActivity.getTime()) < 5 * 60 * 1000;
        
        const serverStats = {
          players: { 
            online: playerCount,
            max: webhookStats.maxPlayers,
            queue: 0 
          },
          server: { 
            status: isRecentlyActive ? webhookStats.serverStatus : 'offline' as const,
            uptime: Math.floor((Date.now() - webhookStats.uptime) / 1000),
            version: '1.28',
            map: 'Chernarus',
            gamemode: 'Aggro PvP Enhanced Survival',
            fps: 60,
            ping: 25
          },
          performance: { 
            cpu: playerCount > 0 ? Math.min(playerCount * 2 + 15, 80) : 15,
            memory: playerCount > 0 ? Math.min(playerCount * 3 + 40, 85) : 40,
            disk: 35, 
            network: { 
              in: playerCount * 10 + 50,
              out: playerCount * 15 + 75
            }
          },
          events: { 
            restarts: 0, 
            crashes: 0, 
            lastRestart: webhookStats.lastActivity?.toISOString() || new Date().toISOString()
          }
        };
        

        
        return res.json(serverStats);
      }
      
      // Fallback to default stats showing server ready for players
      const serverStats = {
        players: { 
          online: 0, // Will update when webhook data arrives
          max: 30,
          queue: 0 
        },
        server: { 
          status: 'online' as const,
          uptime: Math.floor((Date.now() - 1750700000000) / 1000),
          version: '1.28', 
          map: 'Chernarus', 
          gamemode: 'Aggro PvP Enhanced Survival',
          fps: 60,
          ping: 25
        },
        performance: { 
          cpu: 15,
          memory: 40,
          disk: 35, 
          network: { 
            in: 50,
            out: 75
          }
        },
        events: { 
          restarts: 0, 
          crashes: 0, 
          lastRestart: new Date().toISOString()
        }
      };


      res.json(serverStats);
    } catch (error) {
      console.error('Server stats error:', error);
      res.status(500).json({ error: 'Failed to fetch server stats' });
    }
  });



  // Serve static assets from attached_assets directory
  app.use('/attached_assets', (req, res, next) => {
    // Security: prevent directory traversal
    if (req.path.includes('..')) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  }, express.static(path.join(process.cwd(), 'attached_assets')));

  // Admin authentication middleware
  const adminAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || authHeader !== 'Bearer FuckAround') {
      return res.status(401).json({ error: 'Unauthorized - Admin access required' });
    }
    
    next();
  };

  // Admin API routes
  app.post('/api/admin/wipe-reset', adminAuth, async (req, res) => {
    try {
      const result = await storage.resetWipeData();
      res.json(result);
    } catch (error) {
      console.error('Wipe reset error:', error);
      res.status(500).json({ error: 'Failed to reset wipe data' });
    }
  });

  app.post('/api/admin/cleanup-invalid', adminAuth, async (req, res) => {
    try {
      const result = await storage.cleanupInvalidEntries();
      res.json(result);
    } catch (error) {
      console.error('Cleanup error:', error);
      res.status(500).json({ error: 'Failed to cleanup invalid entries' });
    }
  });

  app.post('/api/admin/consolidate-players', adminAuth, async (req, res) => {
    try {
      const result = await storage.consolidatePlayers();
      res.json(result);
    } catch (error) {
      console.error('Consolidation error:', error);
      res.status(500).json({ error: 'Failed to consolidate players' });
    }
  });

  // Kill feed API endpoints
  app.get("/api/killfeed", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const killFeed = await storage.getKillFeed(limit);
      res.json(killFeed);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch kill feed" });
    }
  });

  // Leaderboard API endpoint
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const category = (req.query.category as string) || 'most_kills';
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 10); // Max 10 entries
      
      console.log(`🎯 Leaderboard request: category=${category}, limit=${limit}`);
      const leaderboard = await storage.getLeaderboard(category, limit);
      console.log(`📊 Leaderboard result for ${category}: ${leaderboard.length} entries found`);
      
      res.json(leaderboard);
    } catch (error) {
      console.error('❌ Leaderboard error:', error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });



  // Data integrity verification endpoint
  app.get("/api/admin/data-integrity", async (req, res) => {
    try {
      const integrity = await storage.verifyDataIntegrity();
      res.json(integrity);
    } catch (error) {
      console.error('❌ Data integrity check error:', error);
      res.status(500).json({ error: 'Failed to check data integrity' });
    }
  });

  // Steam player search API
  app.get("/api/player/search", async (req, res) => {
    const { query, type } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query required' });
    }

    try {
      if (type === 'steamid') {
        // Validate Steam ID format (76561198xxxxxxxxx)
        const steamIdPattern = /^76561\d{12}$/;
        if (!steamIdPattern.test(query)) {
          return res.status(400).json({ error: 'Invalid Steam ID format' });
        }
        
        const player = await storage.searchPlayerBySteamId(query);
        if (!player) {
          return res.status(404).json({ error: 'Player not found' });
        }
        res.json([player]);
      } else {
        // Search by name (default)
        const players = await storage.searchPlayerByName(query);
        res.json(players);
      }
    } catch (error) {
      console.error('❌ Player search error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  });

  // Player statistics API
  app.get("/api/player/stats", async (req, res) => {
    const { player } = req.query;
    
    if (!player || typeof player !== 'string') {
      return res.status(400).json({ error: 'Player name or Steam ID required' });
    }

    try {
      const killFeedData = await storage.getKillFeed(1000); // Get more data for accurate stats
      
      if (!killFeedData || killFeedData.length === 0) {
        return res.status(404).json({ error: 'No combat data available' });
      }

      const playerName = player.trim();
      const stats = {
        player: playerName,
        kills: 0,
        deaths: 0,
        kdr: 0,
        longestShot: 0,
        favoriteWeapon: 'None',
        lastSeen: 'Never'
      };

      const weaponCounts: Record<string, number> = {};
      const distances: number[] = [];
      let foundPlayer = false;

      killFeedData.forEach(kill => {
        // Check if searching by Steam ID (all digits) or player name
        const isSearchingSteamId = /^\d+$/.test(playerName);
        
        let killerMatch = false;
        let victimMatch = false;
        
        if (isSearchingSteamId) {
          // If searching by Steam ID, only match Steam IDs
          killerMatch = kill.killerSteamId === playerName;
          victimMatch = kill.victimSteamId === playerName;
        } else {
          // If searching by name, only match exact player names (case insensitive)
          killerMatch = kill.killer.toLowerCase() === playerName.toLowerCase();
          victimMatch = kill.victim.toLowerCase() === playerName.toLowerCase();
        }

        // Skip self-inflicted and suicide kills
        const isSelfInflicted = kill.weapon === 'Self-inflicted' || 
                               kill.distance === 'Suicide' || 
                               kill.killer.includes('(Suicide)') ||
                               kill.victim.includes('(Suicide)');

        if (killerMatch && !isSelfInflicted) {
          foundPlayer = true;
          stats.kills++;
          stats.lastSeen = new Date(kill.timestamp).toISOString();
          stats.player = kill.killer; // Use exact name from server
          
          if (kill.weapon && kill.weapon !== 'Self-inflicted') {
            weaponCounts[kill.weapon] = (weaponCounts[kill.weapon] || 0) + 1;
          }
          
          if (kill.distance) {
            const distanceNum = parseFloat(kill.distance.replace('m', ''));
            if (!isNaN(distanceNum)) {
              distances.push(distanceNum);
            }
          }
        }
        
        if (victimMatch && !isSelfInflicted) {
          foundPlayer = true;
          stats.deaths++;
          stats.lastSeen = new Date(kill.timestamp).toISOString();
          if (!stats.player || stats.player === playerName) {
            stats.player = kill.victim; // Use exact name from server
          }
        }

        // Still mark player as found even for self-inflicted deaths (but don't count them in stats)
        if ((killerMatch || victimMatch) && isSelfInflicted) {
          foundPlayer = true;
          stats.lastSeen = new Date(kill.timestamp).toISOString();
          if (!stats.player || stats.player === playerName) {
            stats.player = killerMatch ? kill.killer : kill.victim;
          }
        }
      });

      if (!foundPlayer) {
        return res.status(404).json({ 
          error: `No combat data found for "${playerName}". Player must have participated in combat on the server.` 
        });
      }

      // Calculate derived stats
      stats.kdr = stats.deaths > 0 ? parseFloat((stats.kills / stats.deaths).toFixed(2)) : stats.kills;
      stats.longestShot = distances.length > 0 ? Math.max(...distances) : 0;
      stats.favoriteWeapon = Object.entries(weaponCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

      res.json(stats);
    } catch (error) {
      console.error('Error calculating player stats:', error);
      res.status(500).json({ error: 'Failed to calculate player statistics' });
    }
  });

  // Steam API endpoints
  app.get("/api/steam/avatar/:steamId", getSteamAvatarEndpoint);

  app.get("/api/steam/avatars", async (req, res) => {
    try {
      const steamIds = (req.query.steamIds as string)?.split(',') || [];
      const avatars = await getMultipleSteamAvatars(steamIds);
      res.json(avatars);
    } catch (error) {
      console.error('Steam avatars endpoint error:', error);
      res.status(500).json({ error: 'Failed to fetch Steam avatars' });
    }
  });





  // Server info webhook - receives server status updates
  app.post("/api/webhook/server", async (req, res) => {
    try {
      let body = req.body;
      
      // Handle different data formats
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {
          // Silent fallback for string data
        }
      }
      
      // Extract server data from webhook
      let playersOnline = 0;
      let maxPlayers = 40;
      let serverStatus = 'online';
      
      // Parse from direct fields
      if (body.players !== undefined) {
        playersOnline = parseInt(body.players) || 0;
      }
      if (body.maxPlayers !== undefined) {
        maxPlayers = parseInt(body.maxPlayers) || 40;
      }
      if (body.status !== undefined) {
        serverStatus = body.status;
      }
      
      // Parse from Discord embed format
      if (body.embeds && body.embeds.length > 0) {
        const embed = body.embeds[0];
        
        // Look for player count in title or description
        const text = (embed.title || '') + ' ' + (embed.description || '');
        const playerMatch = text.match(/(\d+)\/(\d+)\s*players?/i);
        if (playerMatch) {
          playersOnline = parseInt(playerMatch[1]) || 0;
          maxPlayers = parseInt(playerMatch[2]) || 40;
        }
        
        // Look for status in fields
        if (embed.fields) {
          for (const field of embed.fields) {
            const fieldName = field.name?.toLowerCase() || '';
            const fieldValue = field.value?.toLowerCase() || '';
            
            if (fieldName.includes('players') || fieldName.includes('online')) {
              const match = fieldValue.match(/(\d+)/);
              if (match) {
                playersOnline = parseInt(match[1]) || 0;
              }
            }
            
            if (fieldName.includes('status')) {
              if (fieldValue.includes('online')) serverStatus = 'online';
              else if (fieldValue.includes('offline')) serverStatus = 'offline';
              else if (fieldValue.includes('restart')) serverStatus = 'restarting';
            }
          }
        }
      }
      

      
      // Update server stats in storage
      await storage.updateServerStats({
        playersOnline,
        maxPlayers,
        serverStatus: serverStatus as 'online' | 'offline' | 'restarting',
        lastActivity: new Date()
      });
      
      res.status(200).json({
        message: "Server info updated successfully",
        data: { playersOnline, maxPlayers, serverStatus }
      });
      
    } catch (error) {
      console.error('❌ Server info webhook error:', error);
      res.status(500).json({ 
        error: "Failed to process server info webhook",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Player join/leave webhook - tracks connection events
  app.post("/api/webhook/player", async (req, res) => {
    try {
      let body = req.body;
      
      // Handle different data formats
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {
          // Silent fallback for string data
        }
      }
      
      // Extract player event data
      let playerName = '';
      let steamId = null;
      let eventType = 'join';
      
      // Parse from direct fields
      if (body.playerName !== undefined) {
        playerName = body.playerName;
      }
      if (body.steamId !== undefined) {
        steamId = body.steamId;
      }
      if (body.eventType !== undefined) {
        eventType = body.eventType;
      }
      
      // Parse from Discord embed format
      if (body.embeds && body.embeds.length > 0) {
        const embed = body.embeds[0];
        
        // Look for player info in title or description
        const text = (embed.title || '') + ' ' + (embed.description || '');
        
        // Patterns for join/leave events
        const joinPattern = /(.+?)\s+(joined|connected)/i;
        const leavePattern = /(.+?)\s+(left|disconnected|quit)/i;
        
        let match = text.match(joinPattern);
        if (match) {
          playerName = match[1].trim();
          eventType = 'join';
        } else {
          match = text.match(leavePattern);
          if (match) {
            playerName = match[1].trim();
            eventType = 'leave';
          }
        }
        
        // Extract Steam ID if present
        const steamIdMatch = text.match(/7656119[0-9]{10}/);
        if (steamIdMatch) {
          steamId = steamIdMatch[0];
        }
        
        // Parse from embed fields
        if (embed.fields) {
          for (const field of embed.fields) {
            const fieldName = field.name?.toLowerCase() || '';
            const fieldValue = field.value || '';
            
            if (fieldName.includes('player') || fieldName.includes('name')) {
              playerName = fieldValue.replace(/[^a-zA-Z0-9.\s_-]/g, '').trim();
            }
            
            if (fieldName.includes('steam') || fieldName.includes('id')) {
              const steamMatch = fieldValue.match(/7656119[0-9]{10}/);
              if (steamMatch) {
                steamId = steamMatch[0];
              }
            }
            
            if (fieldName.includes('event') || fieldName.includes('action')) {
              if (fieldValue.toLowerCase().includes('join') || fieldValue.toLowerCase().includes('connect')) {
                eventType = 'join';
              } else if (fieldValue.toLowerCase().includes('leave') || fieldValue.toLowerCase().includes('disconnect')) {
                eventType = 'leave';
              }
            }
          }
        }
      }
      
      // Clean up player name
      if (playerName) {
        playerName = playerName.replace(/7656119[0-9]{10}/g, '').replace(/[()[\]{}<>]/g, '').trim();
      }
      
      console.log('👤 Parsed player event:');
      console.log(`  Player: "${playerName}"`);
      console.log(`  Steam ID: "${steamId}"`);
      console.log(`  Event: "${eventType}"`);
      
      // Validate required data
      if (!playerName) {
        console.log('❌ Missing player name');
        return res.status(400).json({ 
          error: 'Missing player name',
          received: { playerName, steamId, eventType }
        });
      }
      
      // Store player event in database
      const playerEvent = {
        playerName,
        steamId,
        eventType,
        timestamp: new Date()
      };
      
      const savedEvent = await storage.createPlayerEvent(playerEvent);
      
      // Update server stats when players join/leave
      if (eventType === 'join' || eventType === 'leave') {
        await storage.updateServerStats({
          serverStatus: 'online',
          lastActivity: new Date()
        });
      }
      
      res.status(200).json({
        message: "Player event logged successfully",
        data: savedEvent
      });
      
    } catch (error) {
      console.error('❌ Player event webhook error:', error);
      res.status(500).json({ 
        error: "Failed to process player event webhook",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });



  // Webhook endpoint for DayZ server kill/death events
  app.post("/api/webhook/kill", async (req, res) => {
    try {
      console.log('=== KILL WEBHOOK RECEIVED ===');
      console.log('Headers:', JSON.stringify(req.headers, null, 2));
      console.log('Body:', JSON.stringify(req.body, null, 2));
      
      const { killer, victim, weapon, distance, message, content, embeds } = req.body;
      
      // Parse DayZ webhook format - may come as 'message', 'content', or in Discord embeds
      let killerName = killer || null;
      let victimName = victim || null;
      let weaponName = weapon || 'Unknown';
      let distanceValue = distance || '0m';
      let killerSteamId = '';
      let victimSteamId = '';
      
      // Check if this is a Discord embed format
      if (embeds && embeds.length > 0) {
        const embed = embeds[0];
        
        // Look for kill data in embed title or description
        const text = embed.title || embed.description || '';
        // If this looks like a server status report, ignore it
        if (text.includes('SERVER STATUS REPORT') || text.includes('Up-Time:')) {
          return res.status(200).json({ message: "Server status ignored" });
        }
        
        // Handle VPPAdminTools kill/death format
        if (text.includes('Kill / Death Report:') && embed.fields) {
          let victimField = '';
          let killerField = '';
          let detailsField = '';
          
          for (const field of embed.fields) {
            if (field.name === "Victim:") {
              victimField = field.value;
            } else if (field.name === "Killer:") {
              killerField = field.value;
            } else if (field.name === "Details:") {
              detailsField = field.value;
            }
          }
          


          
          // Extract clean player names and Steam IDs
          
          if (victimField) {
            victimName = victimField.split('\n')[0].trim() || 'Unknown';
            // Extract Steam ID from format: [76561199090623011]
            const steamIdMatch = victimField.match(/\[(\d{17})\]/);
            if (steamIdMatch) {
              victimSteamId = steamIdMatch[1];
              console.log('🎮 Victim Steam ID extracted:', victimSteamId);
            }
          }
          if (killerField) {
            const cleanKiller = killerField.split('\n')[0].trim();
            killerName = cleanKiller || 'Unknown';
            // Extract Steam ID for killer if present
            const killerSteamIdMatch = killerField.match(/\[(\d{17})\]/);
            if (killerSteamIdMatch) {
              killerSteamId = killerSteamIdMatch[1];
              console.log('🎮 Killer Steam ID extracted:', killerSteamId);
            }
          }
          
          // Extract weapon and distance from Details field
          if (detailsField) {
            // Look for weapon pattern like "Weapon: M200" or "with [M200 CheyTac Black]" 
            const weaponMatch = detailsField.match(/with\s+\[([^\]]+)\]|Weapon:\s*([A-Za-z0-9\-\s]+)/i);
            if (weaponMatch) {
              weaponName = (weaponMatch[1] || weaponMatch[2]).trim();
              console.log('🔫 Weapon extracted:', weaponName);
            }
            
            // Look for distance pattern like "Distance: 150m", "at 150m", or "from [41.4249] meters"
            const distanceMatch = detailsField.match(/from\s+\[(\d+\.?\d*)\]\s*meters?|Distance:\s*(\d+\.?\d*)\s*m?|at\s+(\d+\.?\d*)\s*m?/i);
            if (distanceMatch) {
              const distance = distanceMatch[1] || distanceMatch[2] || distanceMatch[3];
              distanceValue = Math.round(parseFloat(distance)) + 'm';
              console.log('📏 Distance extracted:', distanceValue);
            }
          }
          
          // Handle suicide cases
          if (killerName === 'Suicide') {
            weaponName = 'Self-inflicted';
            distanceValue = 'Suicide';
            const originalVictim = victimName;
            killerName = originalVictim; // For display purposes
            victimName = originalVictim + ' (Suicide)';
          }
          // For non-suicide cases, keep the extracted weapon and distance values
          
          console.log(`🎯 VPPAdminTools kill parsed: ${killerName} -> ${victimName} with ${weaponName}`);
        }
        
        // Parse kill message from embed - including suicide formats
        const killMatch = text.match(/(.+)\s+killed\s+(.+)\s+with\s+(.+)/i) ||
                         text.match(/(.+)\s+eliminated\s+(.+)\s+using\s+(.+)/i) ||
                         text.match(/(.+)\s+murdered\s+(.+)\s+\[(.+)\]/i);
        
        const suicideMatch = text.match(/(.+)\s+died/i) ||
                            text.match(/(.+)\s+committed suicide/i) ||
                            text.match(/(.+)\s+killed themselves/i);
        
        if (killMatch) {
          killerName = killMatch[1].trim();
          victimName = killMatch[2].trim();
          weaponName = killMatch[3].trim();
        } else if (suicideMatch) {
          killerName = "Environment";
          victimName = suicideMatch[1].trim();
          weaponName = "Suicide/Environment";
        }
      }
      
      // If data comes in message format, try to parse it
      if (!killer && (message || content)) {
        const text = message || content;
        // Try to parse common DayZ kill message formats
        const killMatch = text.match(/(.+)\s+killed\s+(.+)\s+with\s+(.+)/i) ||
                         text.match(/(.+)\s+eliminated\s+(.+)\s+using\s+(.+)/i) ||
                         text.match(/(.+)\s+murdered\s+(.+)\s+\[(.+)\]/i);
        
        if (killMatch) {
          killerName = killMatch[1].trim();
          victimName = killMatch[2].trim();
          weaponName = killMatch[3].trim();
        }
      }
      
      if (!killerName || !victimName) {
        console.log('Missing killer or victim, raw data:', req.body);
        return res.status(400).json({ 
          error: "Missing killer or victim", 
          received: req.body 
        });
      }

      console.log('💾 About to save:', { killer: killerName, victim: victimName, weapon: weaponName, distance: distanceValue, killerSteamId, victimSteamId });
      
      const killFeedEntry = await storage.createKillFeedEntry({
        killer: killerName,
        victim: victimName,
        weapon: weaponName || "Unknown weapon",
        distance: distanceValue || "Unknown",
        killerSteamId: killerSteamId || null,
        victimSteamId: victimSteamId || null
      });

      console.log('✅ Kill recorded successfully:', killFeedEntry);
      res.status(201).json(killFeedEntry);
    } catch (error) {
      console.error('Kill webhook error:', error);
      res.status(500).json({ error: "Failed to record kill" });
    }
  });

  // Alternative webhook endpoint for different kill event formats
  app.post("/api/webhook/deaths", async (req, res) => {
    try {
      console.log('Deaths webhook received:', JSON.stringify(req.body, null, 2));
      
      // Process the same way as main kill handler
      const { killer, victim, weapon, distance, message, content, embeds } = req.body;
      
      let killerName = killer;
      let victimName = victim;
      let weaponName = weapon;
      let distanceValue = distance;
      
      if (embeds && embeds.length > 0) {
        const embed = embeds[0];
        const text = embed.title || embed.description || '';
        
        if (text.includes('SERVER STATUS REPORT') || text.includes('Up-Time:')) {
          console.log('Ignoring server status webhook');
          return res.status(200).json({ message: "Server status ignored" });
        }
        
        const killMatch = text.match(/(.+)\s+killed\s+(.+)\s+with\s+(.+)/i) ||
                         text.match(/(.+)\s+eliminated\s+(.+)\s+using\s+(.+)/i) ||
                         text.match(/(.+)\s+murdered\s+(.+)\s+\[(.+)\]/i);
        
        if (killMatch) {
          killerName = killMatch[1].trim();
          victimName = killMatch[2].trim();
          weaponName = killMatch[3].trim();
        }
      }
      
      if (!killer && (message || content)) {
        const text = message || content;
        const killMatch = text.match(/(.+)\s+killed\s+(.+)\s+with\s+(.+)/i) ||
                         text.match(/(.+)\s+eliminated\s+(.+)\s+using\s+(.+)/i) ||
                         text.match(/(.+)\s+murdered\s+(.+)\s+\[(.+)\]/i);
        
        if (killMatch) {
          killerName = killMatch[1].trim();
          victimName = killMatch[2].trim();
          weaponName = killMatch[3].trim();
        }
      }
      
      if (!killerName || !victimName) {
        console.log('Deaths webhook: Missing killer or victim, raw data:', req.body);
        return res.status(400).json({ 
          error: "Missing killer or victim", 
          received: req.body 
        });
      }

      const killFeedEntry = await storage.createKillFeedEntry({
        killer: killerName,
        victim: victimName,
        weapon: weaponName || "Unknown weapon",
        distance: distanceValue || "Unknown"
      });

      console.log('✅ Death recorded successfully:', killFeedEntry);
      res.status(201).json(killFeedEntry);
    } catch (error) {
      console.error('Deaths webhook error:', error);
      res.status(500).json({ error: "Failed to process death event" });
    }
  });

  const httpServer = createServer(app);

  // Catch-all webhook endpoint for any path
  app.all("/api/webhook/*", (req, res) => {
    const timestamp = new Date().toISOString();
    console.log(`\n🌐 [${timestamp}] === CATCH-ALL WEBHOOK (${req.method}) ===`);
    console.log('Full URL:', req.originalUrl);
    console.log('Path:', req.path);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Query:', req.query);
    console.log('IP:', req.ip || req.connection.remoteAddress);
    console.log('================================\n');
    res.status(200).json({ 
      message: "Webhook received", 
      path: req.path,
      method: req.method,
      timestamp,
      data: req.body 
    });
  });

  return httpServer;
}
