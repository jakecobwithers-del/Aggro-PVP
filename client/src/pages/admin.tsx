import { useState, useEffect } from 'react';
import Navigation from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Trash2, RotateCcw, Settings, Database, Webhook, Trophy, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrls, setWebhookUrls] = useState({
    primary: 'https://21e02ca3-034e-4ab1-a380-bf982e579b5a-00-1x6ko0tufs4hk.janeway.replit.dev/api/webhook/dayz-players',
    backup: 'https://21e02ca3-034e-4ab1-a380-bf982e579b5a-00-1x6ko0tufs4hk.janeway.replit.dev/api/webhook/dayz-alt1',
    server: 'https://21e02ca3-034e-4ab1-a380-bf982e579b5a-00-1x6ko0tufs4hk.janeway.replit.dev/api/webhook/dayz'
  });
  const { toast } = useToast();

  // Check for stored authentication
  useEffect(() => {
    const storedAuth = localStorage.getItem('admin_authenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === 'FuckAround') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      toast({
        title: "Access Granted",
        description: "Welcome to the admin control panel",
        variant: "default"
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid password",
        variant: "destructive"
      });
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setPassword('');
    toast({
      title: "Logged Out",
      description: "Admin session ended",
      variant: "default"
    });
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-md border-red-500/20 bg-red-950/10">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Lock className="w-12 h-12 text-red-400" />
              </div>
              <CardTitle className="text-2xl font-mono text-red-400">
                RESTRICTED ACCESS
              </CardTitle>
              <CardDescription>
                Admin credentials required for system access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    Admin Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="mt-1 font-mono"
                    autoFocus
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={!password}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  ACCESS SYSTEM
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleWipeReset = async () => {
    if (!confirm('This will permanently delete ALL kill feed entries and leaderboard data. Are you sure?')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/wipe-reset', { 
        method: 'POST',
        headers: {
          'Authorization': 'Bearer FuckAround'
        }
      });
      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Wipe Reset Complete",
          description: `Deleted ${result.deletedEntries} kill feed entries`,
          variant: "default"
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: error instanceof Error ? error.message : "Failed to reset wipe data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanupInvalidEntries = async () => {
    if (!confirm('This will remove entries without valid Steam IDs. Continue?')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/cleanup-invalid', { 
        method: 'POST',
        headers: {
          'Authorization': 'Bearer FuckAround'
        }
      });
      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Cleanup Complete",
          description: `Removed ${result.deletedEntries} invalid entries`,
          variant: "default"
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Cleanup Failed",
        description: error instanceof Error ? error.message : "Failed to cleanup data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsolidatePlayers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/consolidate-players', { 
        method: 'POST',
        headers: {
          'Authorization': 'Bearer FuckAround'
        }
      });
      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Consolidation Complete",
          description: `Updated ${result.updatedEntries} entries`,
          variant: "default"
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Consolidation Failed",
        description: error instanceof Error ? error.message : "Failed to consolidate players",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testWebhook = async (webhookType: 'primary' | 'backup' | 'server') => {
    setIsLoading(true);
    try {
      const testData = webhookType === 'server' ? {
        embeds: [{
          title: 'Server FPS',
          fields: [
            { name: 'Players', value: '1', inline: true },
            { name: 'FPS', value: '60', inline: true }
          ]
        }]
      } : {
        embeds: [{
          title: 'Kill / Death Report:',
          fields: [
            { name: 'Victim:', value: 'TestPlayer\n[76561199999999999]', inline: 1 },
            { name: 'Killer:', value: 'TestKiller', inline: 1 }
          ]
        }]
      };

      const response = await fetch(webhookUrls[webhookType], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      if (response.ok) {
        toast({
          title: `${webhookType.charAt(0).toUpperCase() + webhookType.slice(1)} Webhook Test`,
          description: "Webhook is working correctly",
          variant: "default"
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      toast({
        title: "Webhook Test Failed",
        description: error instanceof Error ? error.message : "Failed to test webhook",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 font-mono">
              ADMIN CONTROL PANEL
            </h1>
            <p className="text-muted-foreground">
              Manage server data, leaderboards, and webhook configurations
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-red-500/20 hover:bg-red-950/20"
          >
            <Lock className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="database" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Database
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <Webhook className="w-4 h-4" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="leaderboards" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Leaderboards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="database" className="space-y-6">
            <Card className="border-red-500/20 bg-red-950/10">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Destructive operations that permanently modify server data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-500/20 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-red-400">Complete Wipe Reset</h3>
                    <p className="text-sm text-muted-foreground">
                      Delete all kill feed entries and reset leaderboards
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={handleWipeReset}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Reset Wipe
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-orange-500/20 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-orange-400">Cleanup Invalid Entries</h3>
                    <p className="text-sm text-muted-foreground">
                      Remove entries without valid Steam IDs
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleCleanupInvalidEntries}
                    disabled={isLoading}
                    className="border-orange-500/20 hover:bg-orange-950/20"
                  >
                    Cleanup
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Data Management
                </CardTitle>
                <CardDescription>
                  Safe operations to improve data quality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Consolidate Player Names</h3>
                    <p className="text-sm text-muted-foreground">
                      Merge duplicate player entries using Steam ID matching
                    </p>
                  </div>
                  <Button 
                    onClick={handleConsolidatePlayers}
                    disabled={isLoading}
                  >
                    Consolidate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Webhook Configuration</CardTitle>
                <CardDescription>
                  Current webhook endpoints for DayZ server integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Primary Webhook (dayz-players)</label>
                    <div className="flex gap-2 mt-1">
                      <Input 
                        value={webhookUrls.primary} 
                        onChange={(e) => setWebhookUrls(prev => ({ ...prev, primary: e.target.value }))}
                        className="font-mono text-xs"
                      />
                      <Button 
                        size="sm" 
                        onClick={() => testWebhook('primary')}
                        disabled={isLoading}
                      >
                        Test
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Handles kill/death reports and player events
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Backup Webhook (dayz-alt1)</label>
                    <div className="flex gap-2 mt-1">
                      <Input 
                        value={webhookUrls.backup} 
                        onChange={(e) => setWebhookUrls(prev => ({ ...prev, backup: e.target.value }))}
                        className="font-mono text-xs"
                      />
                      <Button 
                        size="sm" 
                        onClick={() => testWebhook('backup')}
                        disabled={isLoading}
                      >
                        Test
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Backup processing for missed events
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Server Events (dayz)</label>
                    <div className="flex gap-2 mt-1">
                      <Input 
                        value={webhookUrls.server} 
                        onChange={(e) => setWebhookUrls(prev => ({ ...prev, server: e.target.value }))}
                        className="font-mono text-xs"
                      />
                      <Button 
                        size="sm" 
                        onClick={() => testWebhook('server')}
                        disabled={isLoading}
                      >
                        Test
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Server FPS, restarts, and status updates
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Webhook Status</h4>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="border-green-500/20 text-green-400">
                      Primary: Active
                    </Badge>
                    <Badge variant="outline" className="border-blue-500/20 text-blue-400">
                      Backup: Standby
                    </Badge>
                    <Badge variant="outline" className="border-purple-500/20 text-purple-400">
                      Server: Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Leaderboard Management</CardTitle>
                <CardDescription>
                  Control leaderboard categories and data integrity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold">Most Kills</h4>
                    <p className="text-sm text-muted-foreground">PvP eliminations only</p>
                    <Badge variant="outline" className="mt-2 border-green-500/20 text-green-400">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold">Most Deaths</h4>
                    <p className="text-sm text-muted-foreground">All death types included</p>
                    <Badge variant="outline" className="mt-2 border-green-500/20 text-green-400">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold">Longest Shots</h4>
                    <p className="text-sm text-muted-foreground">Distance-based rankings</p>
                    <Badge variant="outline" className="mt-2 border-green-500/20 text-green-400">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold">K/D Ratio</h4>
                    <p className="text-sm text-muted-foreground">Kill to death ratio</p>
                    <Badge variant="outline" className="mt-2 border-yellow-500/20 text-yellow-400">
                      Checking
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Data Consolidation</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Steam ID consolidation ensures players with name changes appear as single entries
                  </p>
                  <Button 
                    onClick={handleConsolidatePlayers}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Refresh Leaderboard Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}