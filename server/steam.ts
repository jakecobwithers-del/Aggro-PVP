import { Request, Response } from "express";

// Steam API configuration
const STEAM_API_BASE = 'https://api.steampowered.com';

// Default Steam avatar (used when no Steam ID or API fails)
const DEFAULT_AVATAR = 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg';

/**
 * Get Steam player avatar from Steam ID
 * Uses Steam Web API to fetch player profile data
 */
export async function getSteamAvatar(steamId: string): Promise<string> {
  if (!steamId || steamId.length !== 17) {
    return DEFAULT_AVATAR;
  }

  try {
    // Steam's public API endpoint for player summaries
    // This endpoint doesn't require an API key for basic avatar data
    const response = await fetch(`${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v0002/?steamids=${steamId}&format=json`);
    
    if (!response.ok) {
      console.log(`Steam API request failed: ${response.status}`);
      return DEFAULT_AVATAR;
    }

    const data = await response.json();
    
    if (data.response && data.response.players && data.response.players.length > 0) {
      const player = data.response.players[0];
      // Use the full-size avatar (184x184px)
      return player.avatarfull || player.avatarmedium || player.avatar || DEFAULT_AVATAR;
    }
    
    return DEFAULT_AVATAR;
  } catch (error) {
    console.error('Steam API error:', error);
    return DEFAULT_AVATAR;
  }
}

/**
 * API endpoint to get Steam avatar for a Steam ID
 */
export async function getSteamAvatarEndpoint(req: Request, res: Response) {
  try {
    const { steamId } = req.params;
    
    if (!steamId) {
      return res.status(400).json({ error: 'Steam ID required' });
    }

    const avatarUrl = await getSteamAvatar(steamId);
    
    res.json({ 
      steamId,
      avatarUrl,
      isDefault: avatarUrl === DEFAULT_AVATAR
    });
  } catch (error) {
    console.error('Steam avatar endpoint error:', error);
    res.status(500).json({ error: 'Failed to fetch Steam avatar' });
  }
}

/**
 * Get multiple Steam avatars in a single request
 */
export async function getMultipleSteamAvatars(steamIds: string[]): Promise<Record<string, string>> {
  const avatars: Record<string, string> = {};
  
  // Filter valid Steam IDs
  const validSteamIds = steamIds.filter(id => id && id.length === 17);
  
  if (validSteamIds.length === 0) {
    return avatars;
  }

  try {
    // Steam API supports multiple Steam IDs in a single request
    const steamIdList = validSteamIds.join(',');
    const response = await fetch(`${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v0002/?steamids=${steamIdList}&format=json`);
    
    if (!response.ok) {
      console.log(`Steam API batch request failed: ${response.status}`);
      // Return default avatars for all requested IDs
      validSteamIds.forEach(id => {
        avatars[id] = DEFAULT_AVATAR;
      });
      return avatars;
    }

    const data = await response.json();
    
    if (data.response && data.response.players) {
      // Map Steam IDs to avatars
      data.response.players.forEach((player: any) => {
        avatars[player.steamid] = player.avatarfull || player.avatarmedium || player.avatar || DEFAULT_AVATAR;
      });
    }
    
    // Fill in defaults for any missing players
    validSteamIds.forEach(id => {
      if (!avatars[id]) {
        avatars[id] = DEFAULT_AVATAR;
      }
    });
    
    return avatars;
  } catch (error) {
    console.error('Steam API batch error:', error);
    // Return default avatars for all requested IDs
    validSteamIds.forEach(id => {
      avatars[id] = DEFAULT_AVATAR;
    });
    return avatars;
  }
}