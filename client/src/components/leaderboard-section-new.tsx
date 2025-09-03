import { useQuery } from '@tanstack/react-query';
import { Trophy, Target, Skull, Award, Crosshair, Zap, User, Crown, TrendingUp, Shield, Timer, Frown, Mountain } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';

interface KillFeedEntry {
  id: number;
  killer: string;
  victim: string;
  weapon: string;
  distance: string;
  killerSteamId?: string;
  victimSteamId?: string;
  timestamp: string;
}

interface PlayerStats {
  player: string;
  steamId?: string;
  kills: number;
  deaths: number;
  kdr: number;
  longestShot: number;
  favoriteWeapon: string;
  lastSeen: string;
}

interface WeaponStats {
  weapon: string;
  kills: number;
  avgDistance: number;
  users: number;
}

// Simple player name display for terminal interface
function PlayerNameDisplay({ playerName, rank }: { playerName: string, rank: number }) {
  return (
    <div className="flex items-center space-x-3">
      <span className="text-accent font-mono font-bold">#{rank}</span>
      <span className="text-foreground font-mono uppercase tracking-wider">
        {playerName}
      </span>
    </div>
  );
}

type LeaderboardTab = 'killers' | 'snipers' | 'kdr' | 'streaks' | 'deaths' | 'respawn' | 'weapons';

export default function LeaderboardSection() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('killers');

  // Separate queries for each leaderboard category
  const { data: mostKills = [], isLoading: killersLoading } = useQuery({
    queryKey: ['leaderboard', 'most_kills'],
    queryFn: () => fetch('/api/leaderboard?category=most_kills').then(res => res.json()),
    refetchInterval: 30000
  });

  const { data: longestShots = [], isLoading: snipersLoading } = useQuery({
    queryKey: ['leaderboard', 'longest_shots'],
    queryFn: () => fetch('/api/leaderboard?category=longest_shots').then(res => res.json()),
    refetchInterval: 30000
  });

  const { data: kdRatio = [], isLoading: kdrLoading } = useQuery({
    queryKey: ['leaderboard', 'kd_ratio'],
    queryFn: () => fetch('/api/leaderboard?category=kd_ratio').then(res => res.json()),
    refetchInterval: 30000
  });

  const { data: mostDeaths = [], isLoading: deathsLoading } = useQuery({
    queryKey: ['leaderboard', 'most_deaths'],
    queryFn: () => fetch('/api/leaderboard?category=most_deaths').then(res => res.json()),
    refetchInterval: 30000
  });

  const { data: mrRespawn = [], isLoading: respawnLoading } = useQuery({
    queryKey: ['leaderboard', 'mr_respawn'],
    queryFn: () => fetch('/api/leaderboard?category=mr_respawn').then(res => res.json()),
    refetchInterval: 30000
  });

  const { data: killFeed = [], isLoading: killFeedLoading } = useQuery<KillFeedEntry[]>({
    queryKey: ['/api/killfeed'],
    queryFn: () => fetch('/api/killfeed').then(res => res.json()),
    refetchInterval: 15000
  });

  // Calculate player statistics from kill feed data
  const playerStats = useMemo(() => {
    const stats: Record<string, PlayerStats> = {};
    
    // Function to normalize player names (remove suicide suffix)
    const normalizePlayerName = (name: string) => {
      return name.replace(/\s*\(Suicide\)$/i, '').trim();
    };
    
    killFeed.forEach(entry => {
      // Normalize player names
      const normalizedKiller = normalizePlayerName(entry.killer);
      const normalizedVictim = normalizePlayerName(entry.victim);
      
      // Initialize killer stats
      if (!stats[normalizedKiller]) {
        stats[normalizedKiller] = {
          player: normalizedKiller,
          steamId: entry.killerSteamId,
          kills: 0,
          deaths: 0,
          kdr: 0,
          longestShot: 0,
          favoriteWeapon: '',
          lastSeen: entry.timestamp
        };
      }
      
      // Initialize victim stats
      if (!stats[normalizedVictim]) {
        stats[normalizedVictim] = {
          player: normalizedVictim,
          steamId: entry.victimSteamId,
          kills: 0,
          deaths: 0,
          kdr: 0,
          longestShot: 0,
          favoriteWeapon: '',
          lastSeen: entry.timestamp
        };
      }
      
      // Update stats - exclude self-inflicted deaths from kill count
      const isSelfInflicted = normalizedKiller.toLowerCase() === normalizedVictim.toLowerCase();
      
      if (!isSelfInflicted) {
        stats[normalizedKiller].kills++;
      }
      stats[normalizedVictim].deaths++;
      
      // Track longest shot (only for actual kills, not self-inflicted)
      if (!isSelfInflicted) {
        const distance = parseInt(entry.distance.replace('m', '')) || 0;
        if (distance > stats[normalizedKiller].longestShot) {
          stats[normalizedKiller].longestShot = distance;
        }
      }
      
      // Update last seen
      if (new Date(entry.timestamp) > new Date(stats[normalizedKiller].lastSeen)) {
        stats[normalizedKiller].lastSeen = entry.timestamp;
      }
      if (new Date(entry.timestamp) > new Date(stats[normalizedVictim].lastSeen)) {
        stats[normalizedVictim].lastSeen = entry.timestamp;
      }
    });
    
    // Calculate KDR and find favorite weapons
    Object.values(stats).forEach(stat => {
      stat.kdr = stat.deaths > 0 ? parseFloat((stat.kills / stat.deaths).toFixed(2)) : stat.kills;
      
      // Find favorite weapon (exclude self-inflicted deaths)
      const weaponCounts: Record<string, number> = {};
      killFeed.filter(k => {
        const normalizedKiller = k.killer.replace(/\s*\(Suicide\)$/i, '').trim();
        const normalizedVictim = k.victim.replace(/\s*\(Suicide\)$/i, '').trim();
        return normalizedKiller === stat.player && normalizedKiller.toLowerCase() !== normalizedVictim.toLowerCase();
      }).forEach(k => {
        weaponCounts[k.weapon] = (weaponCounts[k.weapon] || 0) + 1;
      });
      stat.favoriteWeapon = Object.entries(weaponCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';
    });
    
    return Object.values(stats);
  }, [killFeed]);

  // Calculate weapon statistics (exclude self-inflicted deaths)
  const weaponStats = useMemo(() => {
    const weapons: Record<string, WeaponStats> = {};
    
    killFeed.forEach(entry => {
      // Skip self-inflicted deaths using normalized names
      const normalizedKiller = entry.killer.replace(/\s*\(Suicide\)$/i, '').trim();
      const normalizedVictim = entry.victim.replace(/\s*\(Suicide\)$/i, '').trim();
      const isSelfInflicted = normalizedKiller.toLowerCase() === normalizedVictim.toLowerCase();
      if (isSelfInflicted) return;
      
      if (!weapons[entry.weapon]) {
        weapons[entry.weapon] = {
          weapon: entry.weapon,
          kills: 0,
          avgDistance: 0,
          users: 0
        };
      }
      
      weapons[entry.weapon].kills++;
      const distance = parseInt(entry.distance.replace('m', '')) || 0;
      weapons[entry.weapon].avgDistance = (weapons[entry.weapon].avgDistance + distance) / 2;
    });
    
    // Calculate unique users per weapon (exclude self-inflicted deaths)
    Object.values(weapons).forEach(weapon => {
      const uniqueUsers = new Set(killFeed.filter(k => {
        const normalizedKiller = k.killer.replace(/\s*\(Suicide\)$/i, '').trim();
        const normalizedVictim = k.victim.replace(/\s*\(Suicide\)$/i, '').trim();
        return k.weapon === weapon.weapon && normalizedKiller.toLowerCase() !== normalizedVictim.toLowerCase();
      }).map(k => k.killer.replace(/\s*\(Suicide\)$/i, '').trim()));
      weapon.users = uniqueUsers.size;
    });
    
    return Object.values(weapons).sort((a, b) => b.kills - a.kills);
  }, [killFeed]);

  // API data already formatted - no calculations needed

  const getSortedData = () => {
    const result = (() => {
      switch (activeTab) {
        case 'killers': return mostKills.slice(0, 10);
        case 'snipers': return longestShots.slice(0, 10);  
        case 'kdr': return kdRatio.slice(0, 10);
        case 'streaks': return mostKills.slice(0, 10); // Simplified - using most kills
        case 'deaths': return mostDeaths.slice(0, 10);
        case 'respawn': return mrRespawn.slice(0, 10);
        case 'weapons': return weaponStats.slice(0, 10);
        default: return [];
      }
    })();
    console.log(`LeaderBoard Tab: ${activeTab}`, result);
    return result;
  };

  const tabs: { id: LeaderboardTab; label: string; icon: any }[] = [
    { id: 'killers', label: 'TOP KILLERS', icon: Skull },
    { id: 'snipers', label: 'LONG SHOTS', icon: Target },
    { id: 'kdr', label: 'K/D RATIO', icon: Trophy },
    { id: 'streaks', label: 'KILL STREAKS', icon: Zap },
    { id: 'deaths', label: 'MOST DEATHS', icon: Skull },
    { id: 'respawn', label: 'MR. RESPAWN', icon: Frown },
    { id: 'weapons', label: 'WEAPON META', icon: Crosshair }
  ];

  return (
    <section id="leaderboard" className="py-20 terminal-container static-overlay scroll-mt-16">
      {/* Atmospheric fog overlay */}
      <div className="fog-overlay"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Terminal Header */}
        <div className="text-center mb-16">
          <div className="survival-ui inline-flex items-center justify-center w-16 h-16 rounded-full mb-6">
            <Trophy className="h-8 w-8" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4 tracking-wider terminal-glow cursor-blink">
            CHERNARUS SURVIVORS
          </h2>
          <div className="mb-6 mx-auto max-w-2xl px-4 py-2 bg-yellow-900/30 border border-yellow-500/50 rounded text-yellow-300 text-sm font-mono">
            ⚠️ BETA VERSION - Leaderboard statistics may contain bugs or inaccuracies
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-mono">
            &gt; ACCESSING FIELD REPORTS... SURVIVOR STATUS: AUTHENTICATED
          </p>
        </div>

        {/* Terminal Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-1 bg-card border border-border rounded-lg p-1 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-md font-mono text-sm uppercase tracking-wider transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-accent text-accent-foreground shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Terminal Content */}
        <div className="terminal-container rounded-lg p-6">
          {(killersLoading || snipersLoading || kdrLoading || deathsLoading || respawnLoading || killFeedLoading) ? (
            <div className="text-center py-16">
              <div className="skeleton h-16 w-16 rounded-full mx-auto mb-6"></div>
              <p className="text-muted-foreground font-mono">&gt; LOADING SURVIVOR DATA...</p>
            </div>
          ) : getSortedData().length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">💀</div>
              <h3 className="text-2xl font-mono font-bold text-muted-foreground mb-4">NO DATA AVAILABLE</h3>
              <p className="text-muted-foreground font-mono">
                &gt; NO SURVIVORS TRACKED. AWAITING FIELD REPORTS...
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {getSortedData().map((item, index) => (
                <div
                  key={activeTab === 'weapons' ? (item as WeaponStats).weapon : (item as any).playerName || (item as any).rank}
                  className="survival-ui flex items-center justify-between p-4 rounded-lg hover:bg-muted/20 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    {activeTab === 'weapons' ? (
                      <>
                        <span className="text-accent font-mono font-bold text-lg">#{index + 1}</span>
                        <span className="text-foreground font-mono uppercase tracking-wider">
                          {(item as WeaponStats).weapon}
                        </span>
                      </>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <span className="text-accent font-mono font-bold">#{(item as any).rank || index + 1}</span>
                        <div>
                          <span className="text-foreground font-mono uppercase tracking-wider">
                            {(item as any).playerName}
                          </span>
                          {(item as any).details && (
                            <div className="text-muted-foreground text-xs mt-1">
                              {(item as any).details}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    {activeTab === 'weapons' ? (
                      <>
                        <div className="text-accent font-mono font-bold text-xl">
                          {(item as WeaponStats).kills}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {Math.round((item as WeaponStats).avgDistance)}m avg
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-accent font-mono font-bold text-xl">
                          {(item as any).value}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {(item as any).secondaryValue}
                        </div>

                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Terminal Footer */}
        <div className="text-center mt-12">
          <div className="survival-ui inline-flex items-center space-x-3 px-6 py-3 rounded-full">
            <div className="relative">
              <div className="w-3 h-3 bg-accent rounded-full danger-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-accent rounded-full animate-ping"></div>
            </div>
            <span className="text-sm font-mono uppercase tracking-wider">
              LIVE TRACKING • {getSortedData().length} SURVIVORS MONITORED
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}