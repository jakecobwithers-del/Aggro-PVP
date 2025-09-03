import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const handleConnect = () => {
    const serverIP = '103.15.237.192:2302';
    const steamUrl = `steam://run/221100`;
    
    // Copy IP to clipboard and launch Steam
    navigator.clipboard.writeText(serverIP).then(() => {
      console.log('Server IP copied to clipboard');
    }).catch(() => {
      console.log('Failed to copy IP to clipboard');
    });
    
    // Try to open Steam protocol
    const steamLink = document.createElement('a');
    steamLink.href = steamUrl;
    steamLink.click();
  };

  const handleDiscord = () => {
    window.open('https://discord.gg/aggropvp', '_blank');
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center parallax-bg blood-splatter overflow-hidden scroll-mt-16"
    >
      {/* Apocalyptic wasteland background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(40,20,0,0.3) 25%, rgba(0,0,0,0.7) 50%, rgba(20,10,0,0.2) 75%, rgba(0,0,0,0.9) 100%),
            url('/attached_assets/dayz_loading_screen1_1756774704485.webp')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: 'apocalyptic-drift 15s ease-in-out infinite alternate'
        }}
      >
        {/* Enhanced apocalyptic atmospheric layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-red-950/20 to-black/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-950/15 via-transparent to-red-950/20"></div>
        
        {/* Static interference and dust particles */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(255,100,100,0.4) 0.5px, transparent 1px),
            radial-gradient(circle at 85% 75%, rgba(200,80,80,0.3) 0.5px, transparent 1px),
            radial-gradient(circle at 45% 60%, rgba(150,60,60,0.4) 0.5px, transparent 1px),
            radial-gradient(circle at 75% 30%, rgba(180,70,70,0.2) 0.5px, transparent 1px)
          `,
          backgroundSize: '150px 150px, 250px 250px, 100px 100px, 200px 200px',
          animation: 'static-drift 20s linear infinite'
        }}></div>
        
        {/* Emergency broadcast interference */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            radial-gradient(ellipse at 30% 70%, rgba(255,0,0,0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 30%, rgba(255,165,0,0.2) 0%, transparent 40%)
          `,
          animation: 'emergency-pulse 6s ease-in-out infinite alternate'
        }}></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        {/* Logo Only */}
        <div className="mb-12">
          <img 
            src="/attached_assets/AggroNewest-modified_1750723004646.png" 
            alt="Server Logo" 
            className="mx-auto h-40 md:h-64 w-auto drop-shadow-2xl" 
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={handleConnect}
            className="tactical-button px-8 py-4 text-lg font-rajdhani font-bold"
          >
            <i className="fab fa-steam mr-2"></i>
            ENTER CHERNARUS
          </Button>
          <Button 
            variant="outline"
            onClick={handleDiscord}
            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-4 text-lg font-rajdhani font-bold transition-all"
          >
            <i className="fab fa-discord mr-2"></i>
            JOIN DISCORD
          </Button>
        </div>
      </div>
    </section>
  );
}