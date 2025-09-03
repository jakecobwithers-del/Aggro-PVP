import { Request, Response } from 'express';
import crypto from 'crypto';

interface SteamUser {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
}

/**
 * Generate Steam OpenID authentication URL
 */
export function getSteamAuthUrl(req: Request): string {
  const realm = `${req.protocol}://${req.get('host')}`;
  const returnTo = `${realm}/auth/steam/callback`;
  
  const params = new URLSearchParams({
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'checkid_setup',
    'openid.return_to': returnTo,
    'openid.realm': realm,
    'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select'
  });

  return `https://steamcommunity.com/openid/login?${params.toString()}`;
}

/**
 * Verify Steam OpenID response and extract Steam ID
 */
export async function verifySteamCallback(req: Request): Promise<string | null> {
  const params = new URLSearchParams();
  
  // Copy all query parameters
  Object.keys(req.query).forEach(key => {
    if (req.query[key]) {
      params.append(key, req.query[key] as string);
    }
  });
  
  // Change mode to check_authentication
  params.set('openid.mode', 'check_authentication');
  
  try {
    const response = await fetch('https://steamcommunity.com/openid/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });
    
    const text = await response.text();
    
    if (text.includes('is_valid:true')) {
      const identity = req.query['openid.identity'] as string;
      const steamIdMatch = identity?.match(/\/id\/(\d+)$/);
      return steamIdMatch ? steamIdMatch[1] : null;
    }
    
    return null;
  } catch (error) {
    console.error('Steam verification error:', error);
    return null;
  }
}

/**
 * Get Steam user profile data
 */
export async function getSteamUserProfile(steamId: string): Promise<SteamUser | null> {
  if (!process.env.STEAM_API_KEY) {
    throw new Error('STEAM_API_KEY environment variable is required');
  }
  
  try {
    const response = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${steamId}`
    );
    
    const data = await response.json();
    
    if (data.response?.players?.length > 0) {
      return data.response.players[0];
    }
    
    return null;
  } catch (error) {
    console.error('Steam API error:', error);
    return null;
  }
}

/**
 * Steam login route handler
 */
export function steamLogin(req: Request, res: Response) {
  const authUrl = getSteamAuthUrl(req);
  res.redirect(authUrl);
}

/**
 * Steam callback route handler
 */
export async function steamCallback(req: Request, res: Response) {
  try {
    const steamId = await verifySteamCallback(req);
    
    if (!steamId) {
      return res.redirect('/dashboard?error=steam_auth_failed');
    }
    
    const userProfile = await getSteamUserProfile(steamId);
    
    if (!userProfile) {
      return res.redirect('/dashboard?error=steam_profile_failed');
    }
    
    // Store Steam user in session
    req.session.steamUser = {
      steamId: userProfile.steamid,
      username: userProfile.personaname,
      avatar: userProfile.avatarfull,
      profileUrl: userProfile.profileurl
    };
    
    res.redirect('/dashboard?success=steam_connected');
  } catch (error) {
    console.error('Steam callback error:', error);
    res.redirect('/dashboard?error=steam_callback_failed');
  }
}

/**
 * Get current Steam user from session
 */
export function getCurrentSteamUser(req: Request, res: Response) {
  const steamUser = req.session.steamUser;
  
  if (!steamUser) {
    return res.status(401).json({ error: 'Not authenticated with Steam' });
  }
  
  res.json(steamUser);
}

/**
 * Steam logout route handler
 */
export function steamLogout(req: Request, res: Response) {
  req.session.steamUser = null;
  res.json({ success: true });
}