import { useQuery } from '@tanstack/react-query';
import { Skull, Target, Clock, User } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

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

// Simple player name display for terminal interface
function PlayerNameDisplay({ playerName }: { playerName: string }) {
  return (
    <span className="text-foreground font-mono uppercase tracking-wider">
      {playerName}
    </span>
  );
}

export default function KillFeedSection() {
  const { data: killFeed = [], isLoading } = useQuery<KillFeedEntry[]>({
    queryKey: ['/api/killfeed'],
    queryFn: () => fetch('/api/killfeed?limit=50').then(res => res.json()),
    refetchInterval: 3000 // Refresh every 3 seconds for real-time updates
  });

  // Calculate consistent player statistics once for all players
  const playerStatsCache = useMemo(() => {
    const stats: { [key: string]: { kills: number; deaths: number; kdr: number } } = {};
    
    killFeed.forEach(entry => {
      // Initialize stats if not exists
      if (!stats[entry.killer]) {
        stats[entry.killer] = { kills: 0, deaths: 0, kdr: 0 };
      }
      if (!stats[entry.victim]) {
        stats[entry.victim] = { kills: 0, deaths: 0, kdr: 0 };
      }
      
      // Only count non-suicide kills for statistics
      if (entry.killer !== entry.victim && !entry.victim.includes('Suicide')) {
        stats[entry.killer].kills++;
        stats[entry.victim].deaths++;
      }
    });
    
    // Calculate K/D ratios
    Object.keys(stats).forEach(player => {
      const { kills, deaths } = stats[player];
      stats[player].kdr = deaths > 0 ? kills / deaths : kills;
    });
    
    return stats;
  }, [killFeed]);

  // Get player statistics from cache
  const getPlayerStats = (playerName: string) => {
    return playerStatsCache[playerName] || { kills: 0, deaths: 0, kdr: 0 };
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getWeaponCategory = (weapon: string) => {
    if (weapon === 'Self-inflicted') return 'suicide';
    if (weapon === 'Unknown') return 'unknown';
    if (weapon.includes('M200') || weapon.includes('SVD') || weapon.includes('Mosin') || weapon.includes('Winchester')) return 'sniper';
    if (weapon.includes('AK') || weapon.includes('M4A1') || weapon.includes('KA-M') || weapon.includes('LAR')) return 'rifle';
    return 'other';
  };

  const getWeaponIcon = (category: string) => {
    switch (category) {
      case 'sniper': return <Target className="h-5 w-5 text-purple-400" />;
      case 'rifle': return <Skull className="h-5 w-5 text-orange-400" />;
      case 'suicide': return <Skull className="h-5 w-5 text-gray-400" />;
      default: return <Skull className="h-5 w-5 text-blue-400" />;
    }
  };

  return (
    <section id="killfeed" className="py-20 bg-gradient-to-b from-black via-gray-900 to-black scroll-mt-16 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0%,transparent_50%)]"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-30"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full mb-6 shadow-lg shadow-red-500/20">
            <Skull className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-rajdhani font-black text-white mb-6 tracking-tight">
            LIVE <span className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">KILLFEED</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Real-time elimination reports streaming directly from Chernarus. Every shot fired, every life taken.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-800 border-t-red-500 mx-auto mb-6"></div>
                <div className="absolute inset-0 rounded-full border-4 border-red-500/20 animate-pulse"></div>
              </div>
              <p className="text-gray-400 text-lg">Establishing connection to field reports...</p>
            </div>
          ) : killFeed.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 rounded-2xl p-12 shadow-2xl">
                <Skull className="h-20 w-20 text-gray-600 mx-auto mb-6" />
                <h3 className="text-3xl font-rajdhani font-bold text-gray-400 mb-4">Silence in the Wasteland</h3>
                <p className="text-gray-500 text-lg">
                  No recent eliminations reported. The calm before the storm...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {killFeed.slice(0, 20).map((kill, index) => {
                const weaponCategory = getWeaponCategory(kill.weapon);
                const isRecent = index < 3;
                
                return (
                  <div 
                    key={kill.id}
                    className={`group relative bg-gradient-to-r from-black/60 to-gray-900/60 backdrop-blur-sm border rounded-xl p-5 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl transform hover:-translate-y-1 ${
                      isRecent 
                        ? 'border-red-500/40 shadow-red-500/10 shadow-lg animate-pulse' 
                        : 'border-gray-700/30 hover:border-red-500/30'
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'slideInUp 0.6s ease-out forwards'
                    }}
                  >
                    {isRecent && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    )}
                    
                    {/* Glowing border effect on hover */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                            <Clock className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                            <span className="font-medium">{formatTime(kill.timestamp)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          {kill.distance !== "Unknown" && kill.distance !== "Suicide" && kill.distance !== "0m" && (
                            <div className="flex items-center space-x-1 bg-gray-800/50 px-3 py-1 rounded-full group-hover:bg-orange-900/30 transition-colors transform group-hover:scale-110">
                              <Target className="h-4 w-4 text-orange-400 group-hover:animate-pulse" />
                              <span className="text-orange-400 font-bold text-sm">{kill.distance}</span>
                            </div>
                          )}
                          
                          <div className="transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                            {getWeaponIcon(weaponCategory)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center space-y-3">
                        <div className="flex items-center justify-center text-xl font-medium space-x-3">
                          {/* Killer section */}
                          <div className="flex items-center space-x-3">
                            <PlayerNameDisplay playerName={kill.killer} />
                          </div>
                          
                          <span className="text-gray-500 mx-2 text-lg group-hover:text-red-400 transition-colors">eliminated</span>
                          
                          {/* Victim section */}
                          <div className="flex items-center space-x-3">
                            <PlayerNameDisplay playerName={kill.victim} />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-gray-400 group-hover:text-gray-300 transition-colors">using</span>
                          <span className={`font-bold px-3 py-1 rounded-full text-sm transition-all duration-300 group-hover:scale-105 ${
                            weaponCategory === 'sniper' ? 'bg-purple-500/20 text-purple-300 group-hover:bg-purple-500/30 group-hover:shadow-lg group-hover:shadow-purple-500/20' :
                            weaponCategory === 'rifle' ? 'bg-orange-500/20 text-orange-300 group-hover:bg-orange-500/30 group-hover:shadow-lg group-hover:shadow-orange-500/20' :
                            weaponCategory === 'suicide' ? 'bg-gray-500/20 text-gray-300 group-hover:bg-gray-500/30' :
                            'bg-blue-500/20 text-blue-300 group-hover:bg-blue-500/30 group-hover:shadow-lg group-hover:shadow-blue-500/20'
                          }`}>
                            {kill.weapon}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-full shadow-lg">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <span className="text-gray-300 font-medium">Live webhook feed from VPPAdminTools</span>
          </div>
        </div>
      </div>
    </section>
  );
}