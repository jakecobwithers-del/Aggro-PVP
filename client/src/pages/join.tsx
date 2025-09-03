import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/navigation';

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



export default function JoinPage() {
  const { data: stats, isLoading } = useQuery<ServerStats>({
    queryKey: ['/api/server/stats'],
    queryFn: async () => {
      const response = await fetch('/api/server/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch server stats');
      }
      return await response.json();
    },
    refetchInterval: 2000,
  });



  const handleConnect = () => {
    const serverIP = '103.15.237.192:2302';
    const steamUrl = `steam://run/221100`;
    
    navigator.clipboard.writeText(serverIP);
    const steamLink = document.createElement('a');
    steamLink.href = steamUrl;
    steamLink.click();
  };

  const handleBattleMetrics = () => {
    window.open('https://www.battlemetrics.com/servers/dayz/34959071', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20">
      {/* Join background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,40,0,0.7) 25%, rgba(0,0,0,0.8) 50%, rgba(10,20,0,0.9) 75%, rgba(0,0,0,0.95) 100%),
            url('/attached_assets/generated_images/DayZ_Join_Background_d8b57c31.png')
          `,
          backgroundAttachment: 'fixed'
        }}
      />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-rajdhani font-black text-white mb-4 apocalyptic-glow">
            JOIN SERVER
          </h1>
          <p className="text-xl text-gray-400 font-mono">
            [SURVIVAL PROTOCOL ACTIVATED]
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Server Stats */}
          <div className="glass-card p-10 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-red-600/30 to-transparent rounded-bl-3xl"></div>
            <h2 className="text-4xl font-rajdhani font-black text-white mb-8 tracking-wider">
              SERVER STATUS
            </h2>
            
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="h-6 bg-gray-700 rounded w-32 animate-pulse"></div>
                    <div className="h-6 bg-gray-600 rounded w-24 animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : stats ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-800/30 to-transparent rounded-lg border border-gray-600/40">
                  <span className="text-gray-300 font-rajdhani font-bold">Players Online:</span>
                  <span className="text-white font-mono text-2xl font-bold">
                    {stats.players.online}/{stats.players.max}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-800/30 to-transparent rounded-lg border border-gray-600/40">
                  <span className="text-gray-300 font-rajdhani font-bold">Server Status:</span>
                  <span className={`font-mono text-xl font-bold ${
                    stats.server.status === 'online' ? 'text-white' : 
                    stats.server.status === 'offline' ? 'text-red-500' : 'text-gray-400'
                  }`}>
                    ● {stats.server.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-800/30 to-transparent rounded-lg border border-gray-600/40">
                  <span className="text-gray-300 font-rajdhani font-bold">Map:</span>
                  <span className="text-gray-200 font-mono text-xl font-bold">{stats.server.map}</span>
                </div>


              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-red-400 text-xl font-rajdhani font-bold mb-2">Connection Failed</div>
                <p className="text-gray-500">Unable to fetch server statistics</p>
              </div>
            )}
          </div>

          {/* Connection Details */}
          <div className="glass-card p-10 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-red-600/30 to-transparent rounded-bl-3xl"></div>
            <h2 className="text-4xl font-rajdhani font-black text-white mb-8 tracking-wider">
              CONNECTION DETAILS
            </h2>
            
            <div className="space-y-6 mb-8">
              <div className="bg-gradient-to-r from-red-900/30 to-transparent p-6 rounded-lg border border-red-600/50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-orange-400 font-rajdhani font-bold text-lg">Server IP:</span>
                    <div className="text-green-400 font-mono text-2xl font-bold mt-2">103.193.80.64:3436</div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🌐</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleConnect}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-6 text-xl font-rajdhani font-bold transition-all duration-300 transform hover:scale-105"
                >
                  <span className="mr-3 text-2xl">🚀</span>
                  LAUNCH DAYZ & CONNECT
                </Button>
                
                <Button 
                  onClick={handleBattleMetrics}
                  variant="outline"
                  className="w-full border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white py-4 text-lg font-rajdhani font-bold transition-all duration-300 transform hover:scale-105"
                >
                  <span className="mr-2 text-xl">📊</span>
                  VIEW BATTLEMETRICS
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-900/30 to-transparent rounded-lg border border-green-600/40">
                <div className="text-green-400 font-rajdhani font-bold text-xl mb-2">Map</div>
                <div className="text-white text-2xl font-black">Chernarus</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-900/30 to-transparent rounded-lg border border-blue-600/40">
                <div className="text-blue-400 font-rajdhani font-bold text-xl mb-2">Version</div>
                <div className="text-white text-2xl font-black">1.26</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-yellow-900/30 to-transparent rounded-lg border border-yellow-600/40">
                <div className="text-yellow-400 font-rajdhani font-bold text-xl mb-2">Perspective</div>
                <div className="text-white text-2xl font-black">1st/3rd</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-red-900/30 to-transparent rounded-lg border border-red-600/40">
                <div className="text-red-400 font-rajdhani font-bold text-xl mb-2">Difficulty</div>
                <div className="text-white text-2xl font-black">Veteran</div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 glass-card p-8 rounded-lg">
          <h2 className="text-2xl font-rajdhani font-bold text-amber-400 mb-4">
            SURVIVAL INSTRUCTIONS
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-gray-300">
            <div className="text-center">
              <div className="text-3xl mb-2">🎮</div>
              <h3 className="font-bold text-green-400 mb-2">STEP 1</h3>
              <p>Click "Launch DayZ & Connect" to automatically open Steam and copy the server IP</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="font-bold text-yellow-400 mb-2">STEP 2</h3>
              <p>Paste the server IP in DayZ's server browser or use direct connect</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⚔️</div>
              <h3 className="font-bold text-red-400 mb-2">STEP 3</h3>
              <p>Enter the contaminated zone and fight for survival</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}