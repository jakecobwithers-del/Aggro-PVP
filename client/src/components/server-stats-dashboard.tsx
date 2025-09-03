import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  performance: {
    cpu: number;
    memory: number;
    disk: number;
    network: {
      in: number;
      out: number;
    };
  };
  events: {
    restarts: number;
    crashes: number;
    lastRestart: string;
  };
}

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const formatBytes = (bytes: number): string => {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

export default function ServerStatsDashboard() {
  const { data: stats, isLoading, error } = useQuery<ServerStats>({
    queryKey: ['/api/server/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Server Statistics</h2>
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-red-900/20 rounded-lg h-32"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !stats) {
    return (
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Server Statistics</h2>
            <p className="text-red-400">Unable to load server statistics</p>
          </div>
        </div>
      </section>
    );
  }

  const playerPercentage = (stats.players.online / stats.players.max) * 100;

  return (
    <section id="stats" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            <i className="fas fa-chart-line mr-3 text-red-500"></i>
            Server Statistics
          </h2>
          <p className="text-gray-400 text-lg">Real-time server performance and player data</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-red-900/20 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-red-600">Overview</TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-red-600">Performance</TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-red-600">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-red-900/20 border-red-600/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Server Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      stats.server.status === 'online' ? 'bg-green-500' :
                      stats.server.status === 'restarting' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <Badge variant={stats.server.status === 'online' ? 'default' : 'destructive'}>
                      {stats.server.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-900/20 border-red-600/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Players Online</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-white">
                      {stats.players.online}/{stats.players.max}
                    </div>
                    <Progress value={playerPercentage} className="h-2" />
                    <p className="text-xs text-gray-400">
                      {stats.players.queue > 0 && `${stats.players.queue} in queue`}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-900/20 border-red-600/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Server FPS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.server.fps}</div>
                  <p className="text-xs text-gray-400">Frames per second</p>
                </CardContent>
              </Card>

              <Card className="bg-red-900/20 border-red-600/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Uptime</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{formatUptime(stats.server.uptime)}</div>
                  <p className="text-xs text-gray-400">Since last restart</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-red-900/20 border-red-600/30">
                <CardHeader>
                  <CardTitle className="text-white">Server Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Map:</span>
                    <span className="text-white">{stats.server.map}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Game Mode:</span>
                    <span className="text-white">{stats.server.gamemode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Version:</span>
                    <span className="text-white">{stats.server.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ping:</span>
                    <span className="text-white">{stats.server.ping}ms</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-900/20 border-red-600/30">
                <CardHeader>
                  <CardTitle className="text-white">Network Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Incoming:</span>
                    <span className="text-white">{formatBytes(stats.performance.network.in)}/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Outgoing:</span>
                    <span className="text-white">{formatBytes(stats.performance.network.out)}/s</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-red-900/20 border-red-600/30">
                <CardHeader>
                  <CardTitle className="text-white">CPU Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-white">{stats.performance.cpu}%</div>
                    <Progress value={stats.performance.cpu} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-900/20 border-red-600/30">
                <CardHeader>
                  <CardTitle className="text-white">Memory Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-white">{stats.performance.memory}%</div>
                    <Progress value={stats.performance.memory} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-900/20 border-red-600/30">
                <CardHeader>
                  <CardTitle className="text-white">Disk Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-white">{stats.performance.disk}%</div>
                    <Progress value={stats.performance.disk} className="h-3" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-red-900/20 border-red-600/30">
                <CardHeader>
                  <CardTitle className="text-white">Total Restarts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{stats.events.restarts}</div>
                  <p className="text-xs text-gray-400">Since server launch</p>
                </CardContent>
              </Card>

              <Card className="bg-red-900/20 border-red-600/30">
                <CardHeader>
                  <CardTitle className="text-white">Crashes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{stats.events.crashes}</div>
                  <p className="text-xs text-gray-400">Unexpected shutdowns</p>
                </CardContent>
              </Card>

              <Card className="bg-red-900/20 border-red-600/30">
                <CardHeader>
                  <CardTitle className="text-white">Last Restart</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-white">{stats.events.lastRestart}</div>
                  <p className="text-xs text-gray-400">Server maintenance</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}