import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ServerStats {
  players: {
    online: number;
    max: number;
    queue: number;
  };
  server: {
    status: 'online' | 'offline' | 'restarting';
    uptime: number;
    version: string;
    map: string;
    gamemode: string;
    fps: number;
    ping: number;
  };
}

export default function JoinSection() {
  const { data: stats, isLoading, error } = useQuery<ServerStats>({
    queryKey: ['/api/server/stats'],
    queryFn: async () => {
      const response = await fetch('/api/server/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch server stats');
      }
      return await response.json();
    },
    refetchInterval: 2000, // Update every 2 seconds
    staleTime: 0,
    retry: 3,
    refetchOnWindowFocus: true,
  });
  const handleSteamConnect = () => {
    const serverIP = '103.193.80.64:3436';
    
    // Copy IP to clipboard
    navigator.clipboard.writeText(serverIP).then(() => {
      console.log('Server IP copied to clipboard');
    }).catch(() => {
      console.log('Failed to copy IP to clipboard');
    });
    
    // Try Steam protocol directly
    const steamUrl = `steam://run/221100`;
    window.location.href = steamUrl;
  };

  const handleBattleMetrics = () => {
    window.open('https://www.battlemetrics.com/servers/dayz/6228', '_blank');
  };

  return (
    <section id="join" className="py-20 scroll-mt-16" style={{
      background: `
        radial-gradient(ellipse at 20% 20%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 80%, rgba(139, 0, 0, 0.08) 0%, transparent 60%),
        linear-gradient(135deg, rgba(10, 8, 8, 0.95) 0%, rgba(20, 15, 15, 0.9) 50%, rgba(15, 10, 10, 0.95) 100%)
      `
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-rajdhani font-black text-white mb-6 apocalyptic-glow">
            ENTER THE <span className="text-red-500">WASTELAND</span>
          </h2>
          <div className="text-xl text-gray-300 max-w-2xl mx-auto mb-6 terminal-output font-mono">
            <p className="text-green-400 mb-2">[SURVIVOR PROTOCOL INITIATED]</p>
            <p className="mb-2">Community-driven wasteland where only the strongest survive.</p>
            <p className="text-yellow-400 mb-2">WARNING: No advantages, no mercy - pure survival instinct required.</p>
            <p className="text-red-400">Your skills determine your fate in the contaminated zone.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span className="px-4 py-2 bg-red-950/30 border border-red-600/50 rounded-lg text-red-300 font-mono">
              [QUARANTINE ZONE]
            </span>
            <span className="px-4 py-2 bg-yellow-950/30 border border-yellow-600/50 rounded-lg text-yellow-300 font-mono">
              [NO ADVANTAGES]
            </span>
            <span className="px-4 py-2 bg-green-950/30 border border-green-600/50 rounded-lg text-green-300 font-mono">
              [SURVIVOR COUNCIL]
            </span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* DayZ Survivor Image */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative">
              <img 
                src="/attached_assets/generated_images/Apocalyptic_survivor_character_8866c628.png" 
                alt="DayZ Survivor in Chernarus"
                className="max-w-full h-auto rounded-lg shadow-2xl border-2 border-red-900/30"
                style={{
                  filter: 'sepia(0.2) contrast(1.1) brightness(0.9) saturate(1.2)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 rounded-lg"></div>
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-yellow-400 font-mono text-sm font-bold apocalyptic-glow">
                  GEAR UP. SURVIVE. DOMINATE.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="glass-card p-6 rounded-xl transition-all duration-300 border-2 border-orange-900/30 bg-black/60">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-rajdhani font-bold text-orange-400 flex items-center terminal-text">
                  [SERVER STATUS]
                  <div className={`ml-3 w-3 h-3 rounded-full ${
                    isLoading ? 'bg-yellow-500 animate-pulse' :
                    stats?.server.status === 'online' ? 'bg-green-500' :
                    stats?.server.status === 'restarting' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                </h3>
                <div className="flex items-center text-sm text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <span>LIVE 2s</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Server Name:</span>
                  <span className="text-white font-rajdhani">AGGRO PVP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Player Count:</span>
                  <span className="text-white font-rajdhani font-bold">
                    {isLoading ? (
                      <span className="animate-pulse text-yellow-400">Loading...</span>
                    ) : error ? (
                      <span className="text-red-400">Error: {error.message}</span>
                    ) : stats ? (
                      <span className={stats.players.online > 0 ? 'text-green-400' : 'text-white'}>
                        {stats.players.online}/30
                      </span>
                    ) : (
                      <span className="text-gray-400">No data</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Address:</span>
                  <div className="text-right">
                    <div className="text-white font-mono text-sm">103.193.80.64:3436 (Game Port)</div>
                    <div className="text-gray-400 font-mono text-xs">103.193.80.64:3437 (Query Port)</div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`font-rajdhani font-bold ${
                    stats?.server.status === 'online' ? 'text-green-400' :
                    stats?.server.status === 'restarting' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {isLoading ? 'CHECKING...' : (stats?.server.status || 'ONLINE').toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Distance:</span>
                  <span className="text-white">713 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Country:</span>
                  <span className="text-white">Australia</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Uptime:</span>
                  <div className="text-right">
                    <div className="text-white text-sm">7 Days: 91%, 30 Days: 78%</div>
                  </div>
                </div>
                {stats?.server.status === 'offline' && (
                  <div className="mt-3 p-2 bg-red-900/30 border border-red-600/50 rounded text-sm text-red-300">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    Server appears offline - check your DayZ server is running and ports are open
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={handleSteamConnect}
                className="vintage-metal-button w-full group"
              >
                <div className="vintage-metal-inner">
                  <i className="fab fa-steam mr-3 text-lg"></i>
                  CONNECT VIA STEAM
                </div>
              </button>
              
              <button 
                onClick={handleBattleMetrics}
                className="vintage-metal-button w-full group"
              >
                <div className="vintage-metal-inner">
                  <i className="fas fa-chart-bar mr-3 text-lg"></i>
                  VIEW ON BATTLEMETRICS
                </div>
              </button>
            </div>
            
            <div className="text-gray-400 text-sm mt-4">
              <p className="text-center">Steam connection with manual fallback</p>
              <p className="text-xs text-gray-500 text-center mt-1">Server IP: 103.193.80.64:3436</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
