// Temporary server to handle webhooks while config is broken
const express = require('express');
const { Pool } = require('@neondatabase/serverless');
const ws = require('ws');

const app = express();
app.use(express.json());

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Simple webhook endpoint to receive kill events
app.post('/api/webhook/dayz-players', async (req, res) => {
  console.log('Webhook received:', JSON.stringify(req.body, null, 2));
  
  try {
    const body = req.body;
    if (body.embeds && Array.isArray(body.embeds) && body.embeds.length > 0) {
      const embed = body.embeds[0];
      const title = embed.title?.toLowerCase() || '';
      
      if (title.includes('kill') || title.includes('death report')) {
        const killerField = embed.fields?.find(f => f.name === 'Killer' || f.name === 'Killer:');
        const victimField = embed.fields?.find(f => f.name === 'Victim' || f.name === 'Victim:');
        
        let victimName = victimField?.value || 'Unknown';
        let victimSteamId = null;
        
        if (victimName.includes('[') && victimName.includes(']')) {
          const steamIdMatch = victimName.match(/\[(\d+)\]/);
          if (steamIdMatch) {
            victimSteamId = steamIdMatch[1];
            victimName = victimName.split('\n')[0].trim();
          }
        }
        
        let killerName = killerField?.value || 'Unknown';
        let killerSteamId = null;
        
        if (killerName === 'Suicide' && victimSteamId) {
          killerName = victimName;
          killerSteamId = victimSteamId;
        }
        
        if (killerName !== 'Unknown' && victimName !== 'Unknown') {
          // Insert into database
          const timestamp = new Date();
          await pool.query(`
            INSERT INTO kill_feed (killer, victim, weapon, distance, killer_steam_id, victim_steam_id, wipe_id, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [
            killerName,
            victimName, 
            killerName === victimName ? 'Self-inflicted' : 'Unknown',
            killerName === victimName ? 'Suicide' : '0m',
            killerSteamId,
            victimSteamId,
            'wipe_1',
            timestamp
          ]);
          
          console.log(`Kill recorded: ${killerName} -> ${victimName}`);
        }
      }
    }
    
    res.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Simple API to get kill feed
app.get('/api/killfeed', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, killer, victim, weapon, distance, killer_steam_id, victim_steam_id, timestamp
      FROM kill_feed 
      WHERE wipe_id = 'wipe_1'
      ORDER BY timestamp DESC
      LIMIT 20
    `);
    
    const kills = result.rows.map(row => ({
      id: row.id,
      killer: row.killer,
      victim: row.victim,
      weapon: row.weapon,
      distance: row.distance,
      killerSteamId: row.killer_steam_id,
      victimSteamId: row.victim_steam_id,
      timestamp: row.timestamp,
      wipeId: 'wipe_1'
    }));
    
    res.json(kills);
  } catch (error) {
    console.error('Kill feed error:', error);
    res.status(500).json({ error: 'Failed to get kill feed' });
  }
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Temporary server running on port ${PORT}`);
  console.log('Webhook endpoints active for kill feed updates');
});