import { useState } from 'react';
import Navigation from '@/components/navigation';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';

interface KillFeedEvent {
  id: number;
  killer: string;
  victim: string;
  weapon: string;
  distance: string;
  timestamp: string;
}

interface LeaderboardEntry {
  rank: number;
  playerName: string;
  value: number | string;
  secondaryValue?: string;
  details?: string;
  lastActivity?: string;
  category: string;
}

export default function KillFeedPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard'>('feed');
  const [timeframe, setTimeframe] = useState<'most_kills' | 'longest_shots' | 'most_deaths' | 'kd_ratio' | 'mr_respawn'>('most_kills');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'steamid'>('name');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const { data: killFeed, isLoading } = useQuery<KillFeedEvent[]>({
    queryKey: ['/api/killfeed'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const { data: leaderboard, isLoading: isLeaderboardLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['killfeed-leaderboard', timeframe],
    queryFn: () => fetch(`/api/leaderboard?category=${timeframe}`).then(res => res.json()),
    refetchInterval: 30000,
    enabled: activeTab === 'leaderboard'
  });

  const handlePlayerSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchError('');
    setSearchResults([]);
    
    try {
      const response = await fetch(`/api/player/search?query=${encodeURIComponent(searchQuery.trim())}&type=${searchType}`);
      const data = await response.json();
      
      if (data.error) {
        setSearchError(data.error);
      } else {
        setSearchResults(data);
        if (data.length === 0) {
          setSearchError('No players found');
        }
      }
    } catch (error) {
      setSearchError('Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20">
        {/* Kill Feed background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `
              linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(40,20,20,0.8) 25%, rgba(0,0,0,0.85) 50%, rgba(20,10,10,0.9) 75%, rgba(0,0,0,0.95) 100%),
              url('/attached_assets/generated_images/DayZ_Killfeed_Background_d0c8f87c.png')
            `,
            backgroundAttachment: 'fixed'
          }}
        />
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-rajdhani font-black text-white mb-4 apocalyptic-glow">
              KILL FEED
            </h1>
            <p className="text-xl text-gray-400 font-mono">
              [ELIMINATION TRACKER ACTIVE]
            </p>
            <div className="mt-4 mx-auto max-w-2xl px-4 py-2 bg-yellow-900/30 border border-yellow-500/50 rounded text-yellow-300 text-sm font-mono">
              ⚠️ BETA VERSION - Kill feed and leaderboard features may contain bugs or inaccuracies
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="glass-card p-2 rounded-lg flex space-x-2">
              <Button
                onClick={() => setActiveTab('feed')}
                className={`px-6 py-3 font-rajdhani font-bold transition-all duration-300 ${
                  activeTab === 'feed'
                    ? 'bg-red-600 text-white'
                    : 'bg-transparent text-gray-400 hover:text-white'
                }`}
              >
                LIVE FEED
              </Button>
              <Button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-6 py-3 font-rajdhani font-bold transition-all duration-300 ${
                  activeTab === 'leaderboard'
                    ? 'bg-red-600 text-white'
                    : 'bg-transparent text-gray-400 hover:text-white'
                }`}
              >
                LEADERBOARD
              </Button>
            </div>
          </div>

          {/* Steam Player Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="glass-card p-6 rounded-xl border border-red-500/20">
              <h3 className="text-xl font-rajdhani font-bold text-white mb-4 text-center">
                STEAM PLAYER SEARCH
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchType === 'steamid' ? 'Enter Steam ID (76561198...)' : 'Enter player name'}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none font-mono"
                    onKeyPress={(e) => e.key === 'Enter' && handlePlayerSearch()}
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value as 'name' | 'steamid')}
                    className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                  >
                    <option value="name">Name</option>
                    <option value="steamid">Steam ID</option>
                  </select>
                  <Button
                    onClick={handlePlayerSearch}
                    disabled={isSearching || !searchQuery.trim()}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-rajdhani font-bold"
                  >
                    {isSearching ? 'SEARCHING...' : 'SEARCH'}
                  </Button>
                </div>
              </div>
              
              {searchError && (
                <p className="text-red-400 text-sm mt-3 font-mono text-center">{searchError}</p>
              )}
              
              {searchResults.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h4 className="text-lg font-rajdhani font-bold text-white text-center">
                    SEARCH RESULTS ({searchResults.length})
                  </h4>
                  {searchResults.map((player, index) => (
                    <div key={index} className="bg-gray-900/30 border border-gray-700 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h5 className="text-white font-bold text-lg">{player.currentName}</h5>
                            <span className="text-xs text-gray-400 font-mono bg-gray-800 px-2 py-1 rounded">
                              {player.steamId}
                            </span>
                          </div>
                          {player.previousNames && player.previousNames.length > 0 && (
                            <p className="text-gray-400 text-sm">
                              Previous names: {player.previousNames.join(', ')}
                            </p>
                          )}
                          <p className="text-gray-500 text-xs font-mono">
                            First seen: {new Date(player.firstSeen).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
                          <div>
                            <div className="text-red-400 font-bold text-lg">{player.statistics.totalKills}</div>
                            <div className="text-gray-400 text-xs">Kills</div>
                          </div>
                          <div>
                            <div className="text-red-300 font-bold text-lg">{player.statistics.totalDeaths}</div>
                            <div className="text-gray-400 text-xs">Deaths</div>
                          </div>
                          <div>
                            <div className="text-yellow-400 font-bold text-lg">{player.statistics.kdRatio}</div>
                            <div className="text-gray-400 text-xs">K/D</div>
                          </div>
                          <div>
                            <div className="text-blue-400 font-bold text-lg">{player.statistics.longestShot}m</div>
                            <div className="text-gray-400 text-xs">Shot</div>
                          </div>
                          <div className="sm:col-span-2 lg:col-span-1">
                            <div className="text-green-400 font-bold text-sm truncate">{player.statistics.favoriteWeapon}</div>
                            <div className="text-gray-400 text-xs">Weapon</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Leaderboard Timeframe Selector */}
          {activeTab === 'leaderboard' && (
            <div className="flex justify-center mb-6">
              <div className="glass-card p-2 rounded-lg flex space-x-2">
                {[
                  { key: 'most_kills', label: 'MOST KILLS' },
                  { key: 'longest_shots', label: 'LONGEST SHOTS' },
                  { key: 'kd_ratio', label: 'K/D RATIO' },
                  { key: 'most_deaths', label: 'MOST DEATHS' },
                  { key: 'mr_respawn', label: 'MR. RESPAWN' }
                ].map(({ key, label }) => (
                  <Button
                    key={key}
                    onClick={() => setTimeframe(key as typeof timeframe)}
                    className={`px-4 py-2 font-rajdhani font-bold text-sm transition-all duration-300 ${
                      timeframe === key
                        ? 'bg-orange-600 text-white'
                        : 'bg-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Content Display */}
          <div className="glass-card p-8 rounded-lg">
            {activeTab === 'feed' ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-rajdhani font-bold text-white flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    REAL-TIME ELIMINATIONS
                  </h2>
                  <p className="text-gray-400 font-mono text-sm">
                    Live updates every 5 seconds
                  </p>
                </div>

                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="bg-gray-800/50 rounded-lg p-4 animate-pulse">
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : killFeed && killFeed.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {killFeed.map((event) => (
                      <div key={event.id} className="kill-feed-entry bg-gray-900/50 border border-gray-700 rounded-lg p-4 hover:border-red-500/50 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-red-400 font-rajdhani font-bold text-lg">
                              {event.killer}
                            </span>
                            <span className="text-gray-400">eliminated</span>
                            <span className="text-orange-400 font-rajdhani font-bold text-lg">
                              {event.victim}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-gray-300 text-sm font-mono">
                              {event.weapon} • {event.distance}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-2">No recent eliminations</div>
                    <div className="text-gray-500 text-sm">Waiting for action...</div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-rajdhani font-bold text-white flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    ELIMINATION LEADERBOARD
                  </h2>
                  <p className="text-gray-400 font-mono text-sm">
                    {timeframe.replace('_', ' ').toUpperCase()} LEADERBOARD
                  </p>
                </div>

                {isLeaderboardLoading ? (
                  <div className="space-y-4">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="bg-gray-800/50 rounded-lg p-4 animate-pulse">
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : leaderboard && leaderboard.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {leaderboard.map((entry) => (
                      <div key={entry.rank} className={`leaderboard-entry border rounded-lg p-4 transition-all duration-300 ${
                        entry.rank === 1 ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/50' :
                        entry.rank === 2 ? 'bg-gradient-to-r from-gray-700/30 to-gray-600/30 border-gray-400/50' :
                        entry.rank === 3 ? 'bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-600/50' :
                        'bg-gray-900/50 border-gray-700 hover:border-red-500/50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`rank-badge w-8 h-8 rounded-full flex items-center justify-center font-rajdhani font-black text-sm ${
                              entry.rank === 1 ? 'bg-yellow-500 text-black' :
                              entry.rank === 2 ? 'bg-gray-400 text-black' :
                              entry.rank === 3 ? 'bg-orange-600 text-white' :
                              'bg-red-600 text-white'
                            }`}>
                              {entry.rank}
                            </div>
                            <div>
                              <div className="text-white font-rajdhani font-bold text-lg">
                                {entry.playerName}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {entry.details}
                              </div>
                              <div className="text-gray-500 text-xs">
                                {entry.lastActivity ? `Last activity: ${formatDistanceToNow(new Date(entry.lastActivity), { addSuffix: true })}` : ''}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-red-400 font-rajdhani font-bold text-xl">
                              {entry.value}
                            </div>
                            <div className="text-orange-400 text-sm">
                              {entry.secondaryValue}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-2">No data for this timeframe</div>
                    <div className="text-gray-500 text-sm">Check other time periods</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}