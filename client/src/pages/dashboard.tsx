import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Activity, Target, Crosshair, Trophy, Clock, Zap, Search, ChevronLeft, Shield, Skull, Award } from 'lucide-react';


interface PlayerStats {
  player: string;
  steamId?: string;
  kills: number;
  deaths: number;
  kdr: number;
  longestShot: number;
  favoriteWeapon: string;
  lastSeen: string;
  totalDamage?: number;
  headshotKills?: number;
  survivalTime?: number;
}

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

export default function Dashboard() {
  const [searchPlayer, setSearchPlayer] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState<PlayerStats | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Get kill feed data for calculations
  const { data: killFeedData } = useQuery<KillFeedEntry[]>({
    queryKey: ['/api/killfeed'],
    refetchInterval: 5000
  });

  const handlePlayerSearch = async () => {
    if (!searchPlayer.trim()) return;
    
    setIsSearching(true);
    setSearchError('');
    
    try {
      // Add cache busting to ensure fresh data
      const response = await fetch(`/api/player/stats?player=${encodeURIComponent(searchPlayer.trim())}&t=${Date.now()}`);
      const data = await response.json();
      
      if (data.error) {
        setSearchError(data.error);
        setCurrentPlayer(null);
      } else {
        setCurrentPlayer(data);
        setSearchError('');
      }
    } catch (error) {
      setSearchError('Failed to search player stats');
      setCurrentPlayer(null);
    } finally {
      setIsSearching(false);
    }
  };

  if (!currentPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600/20 border border-red-600/30 mb-6">
              <Activity className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-wider font-mono">
              SURVIVOR DASHBOARD
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Enter your player name or Steam ID to view your combat statistics from the Aggro PVP server.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-white font-mono">Player Statistics Search</CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your player name or Steam ID to view your server stats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchPlayer}
                    onChange={(e) => setSearchPlayer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handlePlayerSearch()}
                    placeholder="Enter player name or Steam ID..."
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-red-500 font-mono"
                  />
                  <Button
                    onClick={handlePlayerSearch}
                    disabled={isSearching || !searchPlayer.trim()}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6"
                  >
                    {isSearching ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      "SEARCH"
                    )}
                  </Button>
                </div>
                {searchError && (
                  <p className="text-red-400 text-sm text-center">{searchError}</p>
                )}
                <div className="text-xs text-gray-500 text-center space-y-1">
                  <p>Examples: "PlayerName", "76561198123456789"</p>
                  <p>Only players with combat history will be found</p>
                </div>
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="w-full border-red-600 text-red-400 hover:bg-red-900/20 mt-4"
                >
                  ← Back to Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Enhanced Header with Military Styling */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-gray-900/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-gray-900/90 backdrop-blur-md border-2 border-red-500/30 rounded-3xl p-8 overflow-hidden">
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 left-4 w-32 h-32 border border-red-500 rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-24 h-24 border border-red-500 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-red-500/20"></div>
            </div>
            
            <div className="relative z-10">
              {/* Status Indicator */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-mono text-sm tracking-wider">SURVIVOR STATUS: ACTIVE</span>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Main Profile Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-600/30 to-red-800/30 border-2 border-red-500/50 mb-6 relative">
                  <Activity className="h-10 w-10 text-red-400" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{currentPlayer.kills}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-bold text-white tracking-wider font-mono bg-gradient-to-r from-white to-gray-300 bg-clip-text">
                    SURVIVOR PROFILE
                  </h1>
                  
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-1 h-8 bg-red-500"></div>
                    <h2 className="text-3xl text-red-400 font-mono font-bold tracking-wide">
                      {currentPlayer.player}
                    </h2>
                    <div className="w-1 h-8 bg-red-500"></div>
                  </div>
                  
                  <p className="text-gray-400 font-mono text-sm max-w-2xl mx-auto">
                    [ CLASSIFIED DOSSIER ] Combat intelligence gathered from Chernarus operational zones
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  onClick={() => setCurrentPlayer(null)}
                  variant="outline"
                  className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 font-mono tracking-wide px-6 py-3"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search Another Survivor
                </Button>
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="bg-red-900/20 border-red-600 text-red-400 hover:bg-red-800/30 hover:border-red-500 font-mono tracking-wide px-6 py-3"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Return to Base
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Eliminations Card */}
          <Card className="bg-gradient-to-br from-red-900/20 to-gray-900/50 border-red-500/30 backdrop-blur-sm hover:border-red-400/50 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-red-300 font-mono tracking-wider">ELIMINATIONS</CardTitle>
              <div className="relative">
                <Target className="h-6 w-6 text-red-400 group-hover:text-red-300 transition-colors" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white font-mono mb-2">{currentPlayer.kills}</div>
              <p className="text-sm text-red-400/80 font-mono">CONFIRMED TARGETS ELIMINATED</p>
              <div className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full" style={{width: `${Math.min(currentPlayer.kills * 5, 100)}%`}}></div>
              </div>
            </CardContent>
          </Card>

          {/* Deaths Card */}
          <Card className="bg-gradient-to-br from-gray-900/20 to-gray-800/50 border-gray-600/30 backdrop-blur-sm hover:border-gray-500/50 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-300 font-mono tracking-wider">CASUALTIES</CardTitle>
              <Skull className="h-6 w-6 text-gray-400 group-hover:text-gray-300 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white font-mono mb-2">{currentPlayer.deaths}</div>
              <p className="text-sm text-gray-400/80 font-mono">TIMES ELIMINATED</p>
              <div className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gray-600 to-gray-400 rounded-full" style={{width: `${Math.min(currentPlayer.deaths * 10, 100)}%`}}></div>
              </div>
            </CardContent>
          </Card>

          {/* K/D Ratio Card */}
          <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/50 border-yellow-500/30 backdrop-blur-sm hover:border-yellow-400/50 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-yellow-300 font-mono tracking-wider">EFFICIENCY RATING</CardTitle>
              <Award className="h-6 w-6 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white font-mono mb-2">{currentPlayer.kdr}</div>
              <p className="text-sm text-yellow-400/80 font-mono">KILL TO DEATH RATIO</p>
              <div className="mt-3 flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-400">PERFORMANCE:</span>
                <span className={`text-xs font-mono px-2 py-1 rounded ${
                  currentPlayer.kdr >= 2 ? 'bg-green-500/20 text-green-400' :
                  currentPlayer.kdr >= 1 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {currentPlayer.kdr >= 2 ? 'ELITE' : currentPlayer.kdr >= 1 ? 'AVERAGE' : 'TRAINING'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Longest Shot Card */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/50 border-blue-500/30 backdrop-blur-sm hover:border-blue-400/50 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-blue-300 font-mono tracking-wider">PRECISION RECORD</CardTitle>
              <Zap className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white font-mono mb-2">{currentPlayer.longestShot}<span className="text-xl text-blue-400">m</span></div>
              <p className="text-sm text-blue-400/80 font-mono">MAXIMUM ELIMINATION DISTANCE</p>
              <div className="mt-3 flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-400">RANGE:</span>
                <span className={`text-xs font-mono px-2 py-1 rounded ${
                  currentPlayer.longestShot >= 500 ? 'bg-purple-500/20 text-purple-400' :
                  currentPlayer.longestShot >= 200 ? 'bg-blue-500/20 text-blue-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {currentPlayer.longestShot >= 500 ? 'SNIPER' : currentPlayer.longestShot >= 200 ? 'MARKSMAN' : 'CLOSE QUARTERS'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Favorite Weapon Card */}
          <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/50 border-green-500/30 backdrop-blur-sm hover:border-green-400/50 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-green-300 font-mono tracking-wider">PREFERRED ARMAMENT</CardTitle>
              <Shield className="h-6 w-6 text-green-400 group-hover:text-green-300 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white font-mono mb-2">{currentPlayer.favoriteWeapon || 'UNKNOWN'}</div>
              <p className="text-sm text-green-400/80 font-mono">MOST UTILIZED WEAPON</p>
              <div className="mt-3 text-xs text-gray-400 font-mono">
                {currentPlayer.favoriteWeapon ? 'LOADOUT CONFIRMED' : 'DATA CLASSIFIED'}
              </div>
            </CardContent>
          </Card>

          {/* Last Activity Card */}
          <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/50 border-purple-500/30 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-purple-300 font-mono tracking-wider">LAST TRANSMISSION</CardTitle>
              <Clock className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white font-mono mb-2">
                {currentPlayer.lastSeen !== 'Never' 
                  ? new Date(currentPlayer.lastSeen).toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric'
                    })
                  : 'UNKNOWN'
                }
              </div>
              <p className="text-sm text-purple-400/80 font-mono">LAST COMBAT TRANSMISSION</p>
              <div className="mt-3 flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-400">STATUS:</span>
                <span className={`text-xs font-mono px-2 py-1 rounded ${
                  currentPlayer.lastSeen === 'Never' ? 'bg-gray-500/20 text-gray-400' : 'bg-green-500/20 text-green-400'
                }`}>
                  {currentPlayer.lastSeen === 'Never' ? 'UNTRACKED' : 'LOGGED'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Combat Performance */}
        <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white font-mono">COMBAT PERFORMANCE</CardTitle>
            <CardDescription className="text-gray-400">
              Statistical analysis of your combat effectiveness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">

              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-mono">Combat Efficiency</span>
                <span className="text-white font-mono">
                  {currentPlayer.kills > 0 ? 
                    `${Math.round((currentPlayer.kills / (currentPlayer.kills + currentPlayer.deaths)) * 100)}%` : 
                    '0%'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-mono">Combat Engagements</span>
                <span className="text-white font-mono">{currentPlayer.kills + currentPlayer.deaths}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}