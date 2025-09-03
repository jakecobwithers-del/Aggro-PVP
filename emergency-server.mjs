import express from 'express';
import { Pool } from '@neondatabase/serverless';
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

console.log('Emergency server starting...');

// Kill feed API
app.get('/api/killfeed', async (req, res) => {
  try {
    console.log('Kill feed requested');
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await pool.query(`
      SELECT 
        id, killer, victim, weapon, distance, 
        killer_steam_id, victim_steam_id, timestamp, wipe_id
      FROM kill_feed 
      WHERE wipe_id = 'wipe_1'
      ORDER BY timestamp DESC
      LIMIT $1
    `, [limit]);
    
    const kills = result.rows.map(row => ({
      id: row.id,
      killer: row.killer,
      victim: row.victim,
      weapon: row.weapon,
      distance: row.distance,
      killerSteamId: row.killer_steam_id,
      victimSteamId: row.victim_steam_id,
      timestamp: row.timestamp,
      wipeId: row.wipe_id
    }));
    
    console.log(`Returned ${kills.length} kill entries`);
    res.json(kills);
  } catch (error) {
    console.error('Kill feed error:', error);
    res.status(500).json({ error: 'Failed to get kill feed' });
  }
});

// Webhook endpoint
app.post('/api/webhook/dayz-players', async (req, res) => {
  try {
    console.log('=== WEBHOOK RECEIVED ===');
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
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
          const steamIdMatch = victimName.match(/\\[(\\d+)\\]/);
          if (steamIdMatch) {
            victimSteamId = steamIdMatch[1];
            victimName = victimName.split('\\n')[0].trim();
          }
        }
        
        let killerName = killerField?.value || 'Unknown';
        let killerSteamId = null;
        
        if (killerName === 'Suicide' && victimSteamId) {
          killerName = victimName;
          killerSteamId = victimSteamId;
        }
        
        if (killerName !== 'Unknown' && victimName !== 'Unknown') {
          const timestamp = new Date();
          const weapon = killerName === victimName ? 'Self-inflicted' : 'Unknown';
          const distance = killerName === victimName ? 'Suicide' : '0m';
          
          await pool.query(`
            INSERT INTO kill_feed (killer, victim, weapon, distance, killer_steam_id, victim_steam_id, wipe_id, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [killerName, victimName, weapon, distance, killerSteamId, victimSteamId, 'wipe_1', timestamp]);
          
          console.log(`✅ NEW KILL RECORDED: ${killerName} -> ${victimName} (${weapon})`);
        } else {
          console.log('❌ Skipped Unknown kill event');
        }
      }
    }
    
    res.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Emergency server running on port ${PORT}`);
  console.log('✅ Kill feed API active: GET /api/killfeed');
  console.log('✅ Webhook active: POST /api/webhook/dayz-players');
});