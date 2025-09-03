import { useQuery } from '@tanstack/react-query';
import { Trophy, Target, Skull, Award, Crosshair, Zap, User, Crown, TrendingUp, Shield, Timer, Frown, Mountain } from 'lucide-react';
import { useState, useEffect } from 'react';

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

// Steam Avatar Component
function SteamAvatar({ steamId, playerName, size = 32 }: { steamId?: string, playerName: string, size?: number }) {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!steamId) {
      setIsLoading(false);
      return;
    }

    fetch(`/api/steam/avatar/${steamId}`)
      .then(res => res.json())
      .then(data => {
        setAvatarUrl(data.avatarUrl);
        setIsLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
  }, [steamId]);

  if (isLoading) {
    return (
      <div 
        className="rounded-full bg-gray-700 animate-pulse"
        style={{ width: size, height: size }}
      />
    );
  }

  if (!steamId || hasError || !avatarUrl) {
    return (
      <div 
        className="rounded-full bg-gray-700 flex items-center justify-center"
        style={{ width: size, height: size }}
        title={playerName}
      >
        <User size={size * 0.6} className="text-gray-400" />
      </div>
    );
  }

  return (
    <img 
      src={avatarUrl}
      alt={`${playerName}'s avatar`}
      className="rounded-full border-2 border-yellow-500/50"
      style={{ width: size, height: size }}
      title={playerName}
      onError={() => setHasError(true)}
    />
  );
}

interface WeaponStats {
  weapon: string;
  kills: number;
  avgDistance: number;
  users: number;
}

type LeaderboardTab = 'killers' | 'snipers' | 'headshots' | 'streaks' | 'kdr' | 'deaths' | 'falls' | 'weapons';

export default function LeaderboardSection() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('killers');
  
  const { data: killFeed = [], isLoading } = useQuery<KillFeedEntry[]>({
    queryKey: ['/api/killfeed'],
    queryFn: () => fetch('/api/killfeed?limit=1000').then(res => res.json()),
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  const calculatePlayerStats = (): PlayerStats[] => {
    const playerData: Record<string, {
      kills: number;
      deaths: number;
      longestShot: number;
      weapons: Record<string, number>;
      lastSeen: string;
      steamId?: string;
    }> = {};

    killFeed.forEach(kill => {
      const killer = kill.killer;
      const victim = kill.victim.replace(' (Suicide)', '');
      const distance = parseFloat(kill.distance.replace('m', '')) || 0;
      const weapon = kill.weapon;
      const timestamp = kill.timestamp;

      // Initialize killer if not exists
      if (!playerData[killer]) {
        playerData[killer] = {
          kills: 0,
          deaths: 0,
          longestShot: 0,
          weapons: {},
          lastSeen: timestamp,
          steamId: kill.killerSteamId
        };
      }

      // Initialize victim if not exists
      if (!playerData[victim]) {
        playerData[victim] = {
          kills: 0,
          deaths: 0,
          longestShot: 0,
          weapons: {},
          lastSeen: timestamp,
          steamId: kill.victimSteamId
        };
      }

      // Update Steam IDs if they weren't previously available
      if (kill.killerSteamId && !playerData[killer].steamId) {
        playerData[killer].steamId = kill.killerSteamId;
      }
      if (kill.victimSteamId && !playerData[victim].steamId) {
        playerData[victim].steamId = kill.victimSteamId;
      }

      // Skip self-kills for stats
      if (killer !== victim && !kill.victim.includes('Suicide')) {
        playerData[killer].kills++;
        playerData[victim].deaths++;
        
        if (distance > playerData[killer].longestShot) {
          playerData[killer].longestShot = distance;
        }
        
        playerData[killer].weapons[weapon] = (playerData[killer].weapons[weapon] || 0) + 1;
      }

      // Update last seen
      if (new Date(timestamp) > new Date(playerData[killer].lastSeen)) {
        playerData[killer].lastSeen = timestamp;
      }
      if (new Date(timestamp) > new Date(playerData[victim].lastSeen)) {
        playerData[victim].lastSeen = timestamp;
      }
    });

    return Object.entries(playerData)
      .map(([player, data]) => {
        const favoriteWeapon = Object.entries(data.weapons).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';
        const kdr = data.deaths > 0 ? Number((data.kills / data.deaths).toFixed(2)) : data.kills;
        
        return {
          player,
          steamId: data.steamId,
          kills: data.kills,
          deaths: data.deaths,
          kdr,
          longestShot: data.longestShot,
          favoriteWeapon,
          lastSeen: data.lastSeen
        };
      })
      .filter(p => p.kills > 0 || p.deaths > 0)
      .sort((a, b) => b.kills - a.kills);
  };

  const calculateWeaponStats = (): WeaponStats[] => {
    const weaponData: Record<string, { kills: number; distances: number[]; users: Set<string> }> = {};

    killFeed.forEach(kill => {
      if (kill.killer !== kill.victim.replace(' (Suicide)', '') && !kill.victim.includes('Suicide')) {
        const weapon = kill.weapon;
        const distance = parseFloat(kill.distance.replace('m', '')) || 0;
        
        if (!weaponData[weapon]) {
          weaponData[weapon] = { kills: 0, distances: [], users: new Set() };
        }
        
        weaponData[weapon].kills++;
        weaponData[weapon].distances.push(distance);
        weaponData[weapon].users.add(kill.killer);
      }
    });

    return Object.entries(weaponData)
      .map(([weapon, data]) => ({
        weapon,
        kills: data.kills,
        avgDistance: data.distances.length > 0 
          ? Math.round(data.distances.reduce((a, b) => a + b, 0) / data.distances.length)
          : 0,
        users: data.users.size
      }))
      .filter(w => w.kills > 0)
      .sort((a, b) => b.kills - a.kills);
  };

  const playerStats = calculatePlayerStats();
  const weaponStats = calculateWeaponStats();

  // Tab configuration with competitive and funny categories
  const leaderboardTabs = [
    { id: 'killers', label: 'Top Killers', icon: Crown, color: 'text-red-400', description: 'Most player eliminations' },
    { id: 'snipers', label: 'Longest Shots', icon: Target, color: 'text-purple-400', description: 'Sniper flex zone' },
    { id: 'kdr', label: 'Best K/D', icon: TrendingUp, color: 'text-green-400', description: 'Sweatlord showcase' },
    { id: 'streaks', label: 'Kill Streaks', icon: Shield, color: 'text-blue-400', description: 'Most kills without dying' },
    { id: 'deaths', label: 'Mr. Respawn', icon: Frown, color: 'text-gray-400', description: 'Most deaths (RIP)' },
    { id: 'weapons', label: 'Weapon Meta', icon: Crosshair, color: 'text-yellow-400', description: 'Popular gear' },
  ] as const;

  // Get leaderboard data based on active tab
  const getLeaderboardData = () => {
    switch (activeTab) {
      case 'killers':
        return playerStats.sort((a, b) => b.kills - a.kills).slice(0, 10);
      case 'snipers':
        return playerStats.filter(p => p.longestShot > 0).sort((a, b) => b.longestShot - a.longestShot).slice(0, 10);
      case 'kdr':
        return playerStats.filter(p => p.deaths > 0).sort((a, b) => b.kdr - a.kdr).slice(0, 10);
      case 'streaks':
        // For now, use kills as proxy for streaks (would need real streak tracking)
        return playerStats.sort((a, b) => b.kills - a.kills).slice(0, 10);
      case 'deaths':
        return playerStats.filter(p => p.deaths > 0).sort((a, b) => b.deaths - a.deaths).slice(0, 10);
      case 'weapons':
        return weaponStats.slice(0, 10);
      default:
        return playerStats.slice(0, 10);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Award className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="h-5 w-5 text-orange-600" />;
    return <span className="text-gray-500 font-bold">#{rank}</span>;
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <section id="leaderboard" className="py-20 bg-gradient-to-b from-gray-900 via-black to-gray-900 scroll-mt-16 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.1)_0%,transparent_50%)]"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full mb-6 shadow-lg shadow-yellow-500/20">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-rajdhani font-black text-white mb-6 tracking-tight">
            CHERNARUS <span className="text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">LEADERBOARD</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            The most feared survivors in the wasteland. Survival of the deadliest.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-800 border-t-yellow-500 mx-auto mb-6"></div>
              <div className="absolute inset-0 rounded-full border-4 border-yellow-500/20 animate-pulse"></div>
            </div>
            <p className="text-gray-400 text-lg">Calculating survivor statistics...</p>
          </div>
        ) : (
          <div>
            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {leaderboardTabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as LeaderboardTab)}
                    className={`group relative flex items-center space-x-3 px-6 py-4 rounded-xl font-rajdhani font-bold text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105 ${
                      isActive 
                        ? `bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500/50 ${tab.color} shadow-lg shadow-yellow-500/20` 
                        : 'bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-white hover:border-gray-600/50 hover:bg-gray-700/50'
                    }`}
                    title={tab.description}
                  >
                    <IconComponent className={`h-5 w-5 transition-colors ${isActive ? tab.color : 'text-gray-400 group-hover:text-white'}`} />
                    <span>{tab.label}</span>
                    
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Tab Content */}
            <div className="max-w-4xl mx-auto">
              {/* Tab Header */}
              <div className="text-center mb-8">
                {(() => {
                  const currentTab = leaderboardTabs.find(tab => tab.id === activeTab);
                  const IconComponent = currentTab?.icon || Crown;
                  return (
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <IconComponent className={`h-8 w-8 ${currentTab?.color || 'text-yellow-500'}`} />
                      <h3 className="text-3xl font-rajdhani font-bold text-white uppercase tracking-wider">
                        {currentTab?.label || 'Leaderboard'}
                      </h3>
                    </div>
                  );
                })()}
                <p className="text-gray-400 text-lg">
                  {leaderboardTabs.find(tab => tab.id === activeTab)?.description}
                </p>
              </div>

              {/* Dynamic Content Based on Active Tab */}
              {activeTab === 'weapons' ? (
                // Weapon Stats Display
                <div className="space-y-4">
                  {weaponStats.slice(0, 10).map((weapon, index) => (
                    <div 
                      key={weapon.weapon}
                      className="bg-gradient-to-r from-black/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/30 rounded-xl p-5 hover:border-yellow-500/30 transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'slideInUp 0.6s ease-out forwards'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getRankIcon(index + 1)}
                          <div>
                            <div className="text-white font-bold text-xl">{weapon.weapon}</div>
                            <div className="text-gray-400 text-sm">{weapon.users} user{weapon.users !== 1 ? 's' : ''}</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="text-center">
                              <div className="text-red-400 font-bold text-lg">{weapon.kills}</div>
                              <div className="text-gray-500">Kills</div>
                            </div>
                            <div className="text-center">
                              <div className="text-orange-400 font-bold text-lg">{weapon.avgDistance}m</div>
                              <div className="text-gray-500">Avg Range</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Player Stats Display
                <div className="space-y-4">
                  {getLeaderboardData().map((player: any, index: number) => (
                    <div 
                      key={player.player}
                    className="bg-gradient-to-r from-black/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/30 rounded-xl p-5 hover:border-yellow-500/30 transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'slideInUp 0.6s ease-out forwards'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getRankIcon(index + 1)}
                        <SteamAvatar steamId={player.steamId} playerName={player.player} size={48} />
                        <div>
                          <div className="text-white font-bold text-lg">{player.player}</div>
                          <div className="text-gray-400 text-sm">{formatTimeAgo(player.lastSeen)}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="text-center">
                            <div className="text-green-400 font-bold">{player.kills}</div>
                            <div className="text-gray-500">Kills</div>
                          </div>
                          <div className="text-center">
                            <div className="text-red-400 font-bold">{player.deaths}</div>
                            <div className="text-gray-500">Deaths</div>
                          </div>
                          <div className="text-center">
                            <div className="text-yellow-400 font-bold">{player.kdr}</div>
                            <div className="text-gray-500">K/D</div>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-400">
                          {player.longestShot > 0 && (
                            <span className="inline-flex items-center space-x-1">
                              <Target className="h-3 w-3" />
                              <span>{player.longestShot}m shot</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {playerStats.length === 0 && (
                  <div className="text-center py-12">
                    <Skull className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">No survivor statistics available yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Weapon Statistics */}
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <Crosshair className="h-6 w-6 text-yellow-500" />
                <h3 className="text-2xl font-rajdhani font-bold text-white">WEAPON META</h3>
              </div>
              
              <div className="space-y-4">
                {weaponStats.slice(0, 10).map((weapon, index) => (
                  <div 
                    key={weapon.weapon}
                    className="bg-gradient-to-r from-black/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/30 rounded-xl p-5 hover:border-yellow-500/30 transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'slideInUp 0.6s ease-out forwards'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold text-lg">{weapon.weapon}</div>
                        <div className="text-gray-400 text-sm">{weapon.users} users</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="text-center">
                            <div className="text-red-400 font-bold">{weapon.kills}</div>
                            <div className="text-gray-500">Kills</div>
                          </div>
                          {weapon.avgDistance > 0 && (
                            <div className="text-center">
                              <div className="text-orange-400 font-bold">{weapon.avgDistance}m</div>
                              <div className="text-gray-500">Avg Range</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {weaponStats.length === 0 && (
                  <div className="text-center py-12">
                    <Zap className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">No weapon statistics available yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400">{killFeed.filter(k => !k.victim.includes('Suicide')).length}</div>
            <div className="text-gray-400 text-sm mt-1">Total Eliminations</div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400">{playerStats.length}</div>
            <div className="text-gray-400 text-sm mt-1">Active Survivors</div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400">{weaponStats.length}</div>
            <div className="text-gray-400 text-sm mt-1">Weapons Used</div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-orange-400">
              {Math.max(...killFeed.map(k => parseFloat(k.distance.replace('m', '')) || 0))}m
            </div>
            <div className="text-gray-400 text-sm mt-1">Longest Shot</div>
          </div>
        </div>
      </div>
    </section>
  );
}