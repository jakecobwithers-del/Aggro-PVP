import { Button } from '@/components/ui/button';

export default function DonateSection() {
  const handlePayPalDonate = () => {
    window.open('https://www.paypal.com/ncp/payment/4X5Y2LV8EEVCC', '_blank');
  };

  return (
    <section id="donate" className="py-20 bg-gradient-to-b from-black to-red-950/20 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4 font-mono tracking-wider">
            <i className="fas fa-heart mr-3 text-red-500"></i>
            DONATION TIERS - SUPPORT THE SERVER &amp; STAND OUT!
          </h2>
          <p className="text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed font-mono">
            Support our DayZ server with exclusive cosmetic perks that help you stand out in Chernarus. 
            Choose your tier and get priority access, custom weapon skins, or personalized clothing loadouts!
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Important Notice */}
          <div className="bg-red-950/30 border border-red-500/40 rounded-xl p-6 mb-12 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-3"></div>
              <h3 className="text-xl text-red-400 font-mono font-bold tracking-wider">IMPORTANT NOTICE</h3>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-3"></div>
            </div>
            <p className="text-gray-300 font-mono text-sm leading-relaxed">
              All donation perks are <span className="text-red-400 font-bold">cosmetic only</span> and do not provide any in-game advantage.<br />
              All mods used are approved for monetized servers per <span className="text-yellow-400">Bohemia Interactive's Monetization Policy</span>.
            </p>
          </div>

          {/* Donation Tiers */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            
            {/* Tier 1 - $5 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-green-800/10 rounded-xl blur-xl group-hover:blur-lg transition-all duration-300"></div>
              <div className="relative bg-black/80 border-2 border-green-500/30 rounded-xl p-8 hover:border-green-400/50 transition-all duration-300 transform hover:scale-[1.02]">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 border border-green-500/40 rounded-full mb-4">
                    <span className="text-green-400 font-mono font-bold text-lg">1</span>
                  </div>
                  <h3 className="text-2xl font-bold text-green-400 font-mono mb-2">TIER 1</h3>
                  <div className="text-4xl font-bold text-white font-mono">$5</div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-mono font-bold text-sm">PRIORITY QUEUE</h4>
                      <p className="text-gray-400 font-mono text-xs">Skip the wait! Donators are placed ahead of non-donators in the server queue.</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handlePayPalDonate}
                  className="w-full mt-8 vintage-metal-button"
                >
                  <div className="vintage-metal-inner">
                    DONATE $5
                  </div>
                </button>
              </div>
            </div>

            {/* Tier 2 - $10 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-blue-800/10 rounded-xl blur-xl group-hover:blur-lg transition-all duration-300"></div>
              <div className="relative bg-black/80 border-2 border-blue-500/30 rounded-xl p-8 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-[1.02]">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 border border-blue-500/40 rounded-full mb-4">
                    <span className="text-blue-400 font-mono font-bold text-lg">2</span>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-400 font-mono mb-2">TIER 2</h3>
                  <div className="text-4xl font-bold text-white font-mono">$10</div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-mono font-bold text-sm">EVERYTHING IN TIER 1</h4>
                      <p className="text-gray-400 font-mono text-xs">All previous tier benefits included</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-mono font-bold text-sm">DONATOR WEAPON SKINS</h4>
                      <p className="text-gray-400 font-mono text-xs">Choose custom gun textures to apply using the in-game spraycan system. (Skins are purely cosmetic and visible to everyone.)</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handlePayPalDonate}
                  className="w-full mt-8 vintage-metal-button"
                >
                  <div className="vintage-metal-inner">
                    DONATE $10
                  </div>
                </button>
              </div>
            </div>

            {/* Tier 3 - $15 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-purple-800/10 rounded-xl blur-xl group-hover:blur-lg transition-all duration-300"></div>
              <div className="relative bg-black/80 border-2 border-purple-500/30 rounded-xl p-8 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-[1.02]">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 border border-purple-500/40 rounded-full mb-4">
                    <span className="text-purple-400 font-mono font-bold text-lg">3</span>
                  </div>
                  <h3 className="text-2xl font-bold text-purple-400 font-mono mb-2">TIER 3</h3>
                  <div className="text-4xl font-bold text-white font-mono">$15</div>
                  <div className="text-xs text-yellow-400 font-mono mt-2">★ PREMIUM ★</div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-mono font-bold text-sm">EVERYTHING IN TIERS 1 &amp; 2</h4>
                      <p className="text-gray-400 font-mono text-xs">All previous tier benefits included</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-mono font-bold text-sm">CUSTOM CLOTHING LOADOUT</h4>
                      <p className="text-gray-400 font-mono text-xs">Get your own personalized outfit added to the game! (Available for everyone to access via traders/markets—no gameplay advantage.)</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handlePayPalDonate}
                  className="w-full mt-8 vintage-metal-button"
                >
                  <div className="vintage-metal-inner">
                    DONATE $15
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Alternative Donation Option */}
          <div className="bg-black/60 border border-red-500/30 rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold text-white font-mono mb-4">CUSTOM AMOUNT DONATION</h3>
            <p className="text-gray-400 font-mono mb-6">
              Want to support with a different amount? Use our general donation link below.
            </p>
            <button
              onClick={handlePayPalDonate}
              className="vintage-metal-button px-8"
            >
              <div className="vintage-metal-inner">
                <i className="fab fa-paypal mr-3"></i>
                CUSTOM DONATION
              </div>
            </button>
          </div>

          {/* Server Impact */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-white mb-6">How Your Donation Helps</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-red-950/20 rounded-lg p-6 border border-red-600/20">
                <i className="fas fa-server text-2xl text-red-400 mb-3"></i>
                <h4 className="text-white font-medium mb-2">Server Hosting</h4>
                <p className="text-gray-400 text-sm">High-performance dedicated servers</p>
              </div>
              <div className="bg-red-950/20 rounded-lg p-6 border border-red-600/20">
                <i className="fas fa-tools text-2xl text-red-400 mb-3"></i>
                <h4 className="text-white font-medium mb-2">Maintenance</h4>
                <p className="text-gray-400 text-sm">Regular updates and optimizations</p>
              </div>
              <div className="bg-red-950/20 rounded-lg p-6 border border-red-600/20">
                <i className="fas fa-headset text-2xl text-red-400 mb-3"></i>
                <h4 className="text-white font-medium mb-2">Support</h4>
                <p className="text-gray-400 text-sm">24/7 community assistance</p>
              </div>
              <div className="bg-red-950/20 rounded-lg p-6 border border-red-600/20">
                <i className="fas fa-plus text-2xl text-red-400 mb-3"></i>
                <h4 className="text-white font-medium mb-2">New Features</h4>
                <p className="text-gray-400 text-sm">Enhanced gameplay experiences</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}