import { Button } from '@/components/ui/button';
import Navigation from '@/components/navigation';

export default function SupportPage() {
  const handleDiscord = () => {
    window.open('https://discord.gg/aggropvp', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20">
      {/* Support background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,20,40,0.7) 25%, rgba(0,0,0,0.8) 50%, rgba(0,10,20,0.9) 75%, rgba(0,0,0,0.95) 100%),
            url('/attached_assets/generated_images/Radio_terminal_interface_245aca20.png')
          `,
          backgroundAttachment: 'fixed'
        }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-rajdhani font-black text-white mb-4 apocalyptic-glow">
            SUPPORT
          </h1>
          <p className="text-xl text-gray-400 font-mono">
            [COMMUNICATION HUB]
          </p>
        </div>

        {/* Discord Section */}
        <div className="glass-card p-12 rounded-xl mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-600/30 to-transparent rounded-bl-3xl"></div>
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-6xl">💬</span>
            </div>
            <h2 className="text-4xl font-rajdhani font-black text-white mb-6 tracking-wider">
              JOIN OUR DISCORD
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
              Connect with fellow survivors, get real-time updates, report issues, and participate in community events. 
              Create a support ticket in Discord for assistance from our staff team.
            </p>
            <Button 
              onClick={handleDiscord}
              className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-12 py-6 text-xl font-rajdhani font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <span className="mr-3 text-2xl">🚀</span>
              JOIN DISCORD SERVER
            </Button>
          </div>
        </div>

        {/* Support Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="glass-card p-8 rounded-xl border-l-8 border-red-600 group hover:scale-105 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">🎧</span>
              </div>
              <h3 className="text-2xl font-rajdhani font-black text-white tracking-wider">
                DISCORD SUPPORT
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Create a support ticket in Discord for assistance with technical issues, 
              rule clarifications, and general questions from our staff team.
            </p>
          </div>
          
          <div className="glass-card p-8 rounded-xl border-l-8 border-orange-600 group hover:scale-105 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-800 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-2xl font-rajdhani font-black text-orange-500 tracking-wider">
                GROWING COMMUNITY
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Join our growing community of survivors sharing tips, organizing groups, 
              and building the ultimate DayZ experience together.
            </p>
          </div>
          
          <div className="glass-card p-8 rounded-xl border-l-8 border-yellow-600 group hover:scale-105 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-2xl font-rajdhani font-black text-yellow-500 tracking-wider">
                ANTI-CHEAT PROTECTION
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Advanced monitoring systems and active moderation ensure a fair 
              and competitive environment for all players at all times.
            </p>
          </div>
          
          <div className="glass-card p-8 rounded-xl border-l-8 border-purple-600 group hover:scale-105 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-rajdhani font-black text-purple-500 tracking-wider">
                REGULAR EVENTS
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Participate in special events, tournaments, and community challenges 
              with exclusive rewards and recognition for top performers.
            </p>
          </div>
        </div>


      </div>
    </div>
    </div>
  );
}