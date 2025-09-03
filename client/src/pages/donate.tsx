import { Button } from '@/components/ui/button';
import Navigation from '@/components/navigation';

export default function DonatePage() {
  const handlePayPal = () => {
    window.open('https://paypal.me/aggropvp', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20">
      {/* Donation background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(40,20,40,0.7) 25%, rgba(0,0,0,0.8) 50%, rgba(20,10,20,0.9) 75%, rgba(0,0,0,0.95) 100%),
            url('/attached_assets/generated_images/DayZ_Donate_Background_0dab2203.png')
          `,
          backgroundAttachment: 'fixed'
        }}
      />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-rajdhani font-black text-red-500 mb-4 apocalyptic-glow">
            DONATE
          </h1>
          <p className="text-xl text-orange-300 font-mono">
            [SUPPORT SERVER OPERATIONS]
          </p>
        </div>

        {/* Donation Tiers */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Survivor Tier */}
          <div className="glass-card p-10 rounded-xl border-l-8 border-red-600 relative group hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/20 rounded-bl-3xl flex items-center justify-center">
              <span className="text-red-400 text-xl font-bold">01</span>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h2 className="text-3xl font-rajdhani font-black text-red-500 mb-4 tracking-wider">
                SURVIVOR
              </h2>
              <div className="text-5xl font-black text-white mb-6 font-rajdhani">$5</div>
              <div className="space-y-4 text-gray-300 mb-8">
                <div className="flex items-center p-3 bg-gradient-to-r from-red-900/20 to-transparent rounded-lg border-l-4 border-red-500">
                  <span className="text-red-400 mr-3 text-xl">⚡</span>
                  <span className="font-rajdhani">Priority Queue Access</span>
                </div>
                <div className="flex items-center p-3 bg-gradient-to-r from-orange-900/20 to-transparent rounded-lg border-l-4 border-orange-500">
                  <span className="text-orange-400 mr-3 text-xl">🛡️</span>
                  <span className="font-rajdhani">Supporter Badge</span>
                </div>
                <div className="flex items-center p-3 bg-gradient-to-r from-yellow-900/20 to-transparent rounded-lg border-l-4 border-yellow-500">
                  <span className="text-yellow-400 mr-3 text-xl">👑</span>
                  <span className="font-rajdhani">Discord VIP Role</span>
                </div>
              </div>
              <Button 
                onClick={handlePayPal}
                className="w-full py-4 text-lg font-rajdhani font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
              >
                SUPPORT $5
              </Button>
            </div>
          </div>

          {/* Veteran Tier */}
          <div className="glass-card p-10 rounded-xl border-l-8 border-orange-600 relative group hover:scale-110 transition-all duration-300 transform scale-105">
            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-600/20 rounded-bl-3xl flex items-center justify-center">
              <span className="text-orange-400 text-xl font-bold">02</span>
            </div>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-orange-600 to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-black">
                MOST POPULAR
              </div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-orange-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⚔️</span>
              </div>
              <h2 className="text-3xl font-rajdhani font-black text-orange-500 mb-4 tracking-wider">
                VETERAN
              </h2>
              <div className="text-5xl font-black text-white mb-6 font-rajdhani">$15</div>
              <div className="space-y-4 text-gray-300 mb-8">
                <div className="flex items-center p-3 bg-gradient-to-r from-orange-900/20 to-transparent rounded-lg border-l-4 border-orange-500">
                  <span className="text-orange-400 mr-3 text-xl">🔥</span>
                  <span className="font-rajdhani">All Survivor Benefits</span>
                </div>
                <div className="flex items-center p-3 bg-gradient-to-r from-red-900/20 to-transparent rounded-lg border-l-4 border-red-500">
                  <span className="text-red-400 mr-3 text-xl">💀</span>
                  <span className="font-rajdhani">Custom Weapon Skins</span>
                </div>
                <div className="flex items-center p-3 bg-gradient-to-r from-purple-900/20 to-transparent rounded-lg border-l-4 border-purple-500">
                  <span className="text-purple-400 mr-3 text-xl">👕</span>
                  <span className="font-rajdhani">Exclusive Clothing</span>
                </div>
                <div className="flex items-center p-3 bg-gradient-to-r from-green-900/20 to-transparent rounded-lg border-l-4 border-green-500">
                  <span className="text-green-400 mr-3 text-xl">🎮</span>
                  <span className="font-rajdhani">Reserved Slot</span>
                </div>
              </div>
              <Button 
                onClick={handlePayPal}
                className="w-full py-4 text-lg font-rajdhani font-bold bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500 text-black transition-all duration-300 transform hover:scale-105"
              >
                SUPPORT $15
              </Button>
            </div>
          </div>

          {/* Elite Tier */}
          <div className="glass-card p-10 rounded-xl border-l-8 border-red-600 relative group hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/20 rounded-bl-3xl flex items-center justify-center">
              <span className="text-red-400 text-xl font-bold">03</span>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">💎</span>
              </div>
              <h2 className="text-3xl font-rajdhani font-black text-red-500 mb-4 tracking-wider">
                ELITE
              </h2>
              <div className="text-5xl font-black text-white mb-6 font-rajdhani">$30</div>
              <div className="space-y-4 text-gray-300 mb-8">
                <div className="flex items-center p-3 bg-gradient-to-r from-red-900/20 to-transparent rounded-lg border-l-4 border-red-500">
                  <span className="text-red-400 mr-3 text-xl">💯</span>
                  <span className="font-rajdhani">All Veteran Benefits</span>
                </div>
                <div className="flex items-center p-3 bg-gradient-to-r from-purple-900/20 to-transparent rounded-lg border-l-4 border-purple-500">
                  <span className="text-purple-400 mr-3 text-xl">🚗</span>
                  <span className="font-rajdhani">Rare Vehicle Spawns</span>
                </div>
                <div className="flex items-center p-3 bg-gradient-to-r from-yellow-900/20 to-transparent rounded-lg border-l-4 border-yellow-500">
                  <span className="text-yellow-400 mr-3 text-xl">🎯</span>
                  <span className="font-rajdhani">Premium Support</span>
                </div>
                <div className="flex items-center p-3 bg-gradient-to-r from-cyan-900/20 to-transparent rounded-lg border-l-4 border-cyan-500">
                  <span className="text-cyan-400 mr-3 text-xl">🔬</span>
                  <span className="font-rajdhani">Beta Features Access</span>
                </div>
              </div>
              <Button 
                onClick={handlePayPal}
                className="w-full py-4 text-lg font-rajdhani font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
              >
                SUPPORT $30
              </Button>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="glass-card p-8 rounded-lg bg-yellow-900/20 border border-yellow-600/50">
          <h2 className="text-2xl font-rajdhani font-bold text-yellow-400 mb-4">
            IMPORTANT NOTICE
          </h2>
          <div className="text-gray-300 space-y-2">
            <p>• All donations are completely voluntary and help keep the server running</p>
            <p>• Perks are cosmetic only and do not provide gameplay advantages</p>
            <p>• Server complies with Bohemia Interactive's monetization policy</p>
            <p>• Donations are non-refundable but greatly appreciated</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}