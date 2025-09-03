import Navigation from '@/components/navigation';

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20">
      {/* Rules background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(40,20,0,0.7) 25%, rgba(0,0,0,0.8) 50%, rgba(20,10,0,0.9) 75%, rgba(0,0,0,0.95) 100%),
            url('/attached_assets/generated_images/DayZ_Rules_Background_70cf554a.png')
          `,
          backgroundAttachment: 'fixed'
        }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-rajdhani font-black text-white mb-4 apocalyptic-glow">
            SERVER RULES
          </h1>
          <p className="text-xl text-gray-400 font-mono">
            [SURVIVAL PROTOCOL GUIDELINES]
          </p>
        </div>

        <div className="grid gap-12">
          {/* General Rules */}
          <div className="glass-card p-10 rounded-xl border-l-8 border-red-600 relative">
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/20 rounded-bl-3xl flex items-center justify-center">
              <span className="text-red-400 text-2xl font-bold">01</span>
            </div>
            <h2 className="text-4xl font-rajdhani font-black text-white mb-8 tracking-wider">
              GENERAL CONDUCT
            </h2>
            <div className="grid gap-6">
              <div className="bg-gradient-to-r from-gray-800/30 to-transparent p-6 rounded-lg border-l-4 border-gray-500 hover:border-gray-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-gray-500 transition-colors">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-white mb-3">External Modifications</h3>
                    <p className="text-gray-300 leading-relaxed">External mods, hacks, glitches, duping, scripts, or NVinspect are strictly prohibited. <span className="text-gray-200">Filters and external crosshairs are permitted.</span></p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-800/30 to-transparent p-6 rounded-lg border-l-4 border-gray-500 hover:border-gray-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-gray-500 transition-colors">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-white mb-3">Account Policy</h3>
                    <p className="text-gray-300 leading-relaxed">No alternative accounts or stream sniping permitted. One account per player.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-900/20 to-transparent p-6 rounded-lg border-l-4 border-yellow-500 hover:border-yellow-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500 transition-colors">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-yellow-400 mb-3">Combat Logging</h3>
                    <p className="text-gray-300 leading-relaxed">No combat logging allowed. Wait <span className="text-red-400 font-bold">10 minutes</span> after PVP encounters before logging out or entering safe zones, unless combat cannot realistically continue.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-900/20 to-transparent p-6 rounded-lg border-l-4 border-purple-500 hover:border-purple-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500 transition-colors">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-purple-400 mb-3">Unauthorized Access</h3>
                    <p className="text-gray-300 leading-relaxed">If you log into someone else's base or locked room unexpectedly, <span className="text-orange-400">create a ticket immediately</span> and do not touch anything. This includes discovering your base has been raided.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-900/20 to-transparent p-6 rounded-lg border-l-4 border-blue-500 hover:border-blue-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 transition-colors">
                    <span className="text-white font-bold text-sm">5</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-blue-400 mb-3">Movement Exploits</h3>
                    <p className="text-gray-300 leading-relaxed">Glitch movements such as vortexing, meatballing, headglitching, etc. are banned at all times.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-900/20 to-transparent p-6 rounded-lg border-l-4 border-green-500 hover:border-green-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 transition-colors">
                    <span className="text-white font-bold text-sm">6</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-green-400 mb-3">Bug Reporting</h3>
                    <p className="text-gray-300 leading-relaxed">Report all bugs and glitches immediately. Abuse of unreported bugs will result in punishment. This includes base de-rendering exploits.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Base Building Rules */}
          <div className="glass-card p-10 rounded-xl border-l-8 border-green-600 relative">
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-600/20 rounded-bl-3xl flex items-center justify-center">
              <span className="text-green-400 text-2xl font-bold">02</span>
            </div>
            <h2 className="text-4xl font-rajdhani font-black text-white mb-8 tracking-wider">
              BASE CONSTRUCTION
            </h2>
            <div className="grid gap-6">
              <div className="bg-gradient-to-r from-green-900/20 to-transparent p-6 rounded-lg border-l-4 border-green-500 hover:border-green-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 transition-colors">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-green-400 mb-3">Base Limitations</h3>
                    <p className="text-gray-300 leading-relaxed">Maximum of <span className="text-green-400 font-bold">one main base</span> and <span className="text-cyan-400 font-bold">one stash base/FOB</span> per player or group.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-900/20 to-transparent p-6 rounded-lg border-l-4 border-blue-500 hover:border-blue-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 transition-colors">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-blue-400 mb-3">Code-locked Structures</h3>
                    <p className="text-gray-300 leading-relaxed">Limited to <span className="text-blue-400 font-bold">25 code-locked</span> doors, hatches, hangers, and windows per base.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-900/20 to-transparent p-6 rounded-lg border-l-4 border-yellow-500 hover:border-yellow-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500 transition-colors">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-yellow-400 mb-3">Raid Accessibility</h3>
                    <p className="text-gray-300 leading-relaxed">All base areas must be raidable on foot. <span className="text-red-400">No walling off loot</span> or using windows as sole access points. <span className="text-orange-400">Windows are not raidable.</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-900/20 to-transparent p-6 rounded-lg border-l-4 border-orange-500 hover:border-orange-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 transition-colors">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-orange-400 mb-3">Realistic Construction</h3>
                    <p className="text-gray-300 leading-relaxed">Bases must be physically realistic. No unsupported structures. Maximum <span className="text-orange-400 font-bold">2 floor kits</span> extension from any structure.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-900/20 to-transparent p-6 rounded-lg border-l-4 border-red-500 hover:border-red-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-red-500 transition-colors">
                    <span className="text-white font-bold text-sm">5</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-red-400 mb-3">BBP Kit Placement</h3>
                    <p className="text-gray-300 leading-relaxed">BBP Kits must not overlap in ways that prevent access or block raid tool usage.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-900/20 to-transparent p-6 rounded-lg border-l-4 border-purple-500 hover:border-purple-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500 transition-colors">
                    <span className="text-white font-bold text-sm">6</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-purple-400 mb-3">Complete Construction</h3>
                    <p className="text-gray-300 leading-relaxed">All mesh kits and fence kits must be fully constructed with floors, walls, fences, and gates.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-900/20 to-transparent p-6 rounded-lg border-l-4 border-cyan-500 hover:border-cyan-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500 transition-colors">
                    <span className="text-white font-bold text-sm">7</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-cyan-400 mb-3">Municipal Buildings</h3>
                    <p className="text-gray-300 leading-relaxed">When building on tall structures (Municipal, Silo, Radio Tower): Maximum <span className="text-cyan-400 font-bold">2 floor kits out</span> or <span className="text-cyan-400 font-bold">2 kits above</span> structure top.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-900/20 to-transparent p-6 rounded-lg border-l-4 border-pink-500 hover:border-pink-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-pink-500 transition-colors">
                    <span className="text-white font-bold text-sm">8</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-pink-400 mb-3">Base Security</h3>
                    <p className="text-gray-300 leading-relaxed">Secure your base and protect your codes. <span className="text-red-400">No compensation for security breaches</span> due to sharing codes with untrusted players.</p>
                    <div className="mt-3 p-3 bg-black/30 rounded border border-pink-600/30">
                      <p className="text-sm text-gray-400">No base size limit currently enforced, but don't abuse this privilege. Excessive bases will be addressed by administration.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Base Storage Limit */}
          <div className="glass-card p-10 rounded-xl border-l-8 border-blue-600 relative">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-600/20 rounded-bl-3xl flex items-center justify-center">
              <span className="text-blue-400 text-2xl font-bold">03</span>
            </div>
            <h2 className="text-4xl font-rajdhani font-black text-white mb-8 tracking-wider">
              STORAGE REGULATIONS
            </h2>
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/20 p-8 rounded-lg border border-blue-600/50">
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">📦</span>
                </div>
                <div>
                  <h3 className="text-2xl font-rajdhani font-bold text-blue-400 mb-2">Storage Allocation</h3>
                  <p className="text-gray-300">Base storage container limitations per group</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black/40 p-6 rounded-lg border border-blue-600/40">
                  <div className="text-center">
                    <div className="text-4xl font-black text-blue-400 mb-2">20</div>
                    <div className="text-blue-300 font-rajdhani font-bold">Base Storage Kits</div>
                    <div className="text-sm text-gray-400 mt-2">Lockers • Boxes • Safes • Gun Walls</div>
                  </div>
                </div>
                
                <div className="bg-black/40 p-6 rounded-lg border border-green-600/40">
                  <div className="text-center">
                    <div className="text-4xl font-black text-green-400 mb-2">+5</div>
                    <div className="text-green-300 font-rajdhani font-bold">Per Team Member</div>
                    <div className="text-sm text-gray-400 mt-2">Additional storage allowance</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-lg border border-yellow-600/30">
                <p className="text-gray-300 leading-relaxed">
                  <span className="text-yellow-400 font-bold">Example:</span> A 4-person team receives <span className="text-blue-400 font-bold">20 base storage</span> + <span className="text-green-400 font-bold">20 additional</span> (4 × 5) = <span className="text-purple-400 font-bold">40 total storage containers</span>
                </p>
              </div>
            </div>
          </div>

          {/* Raiding Rules */}
          <div className="glass-card p-10 rounded-xl border-l-8 border-orange-600 relative">
            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-600/20 rounded-bl-3xl flex items-center justify-center">
              <span className="text-orange-400 text-2xl font-bold">04</span>
            </div>
            <h2 className="text-4xl font-rajdhani font-black text-white mb-8 tracking-wider">
              RAIDING PROTOCOLS
            </h2>
            <div className="grid gap-6">
              <div className="bg-gradient-to-r from-orange-900/20 to-transparent p-6 rounded-lg border-l-4 border-orange-500 hover:border-orange-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 transition-colors">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-orange-400 mb-3">Raid Tool Requirements</h3>
                    <p className="text-gray-300 leading-relaxed">All raids must use proper raid tools. <span className="text-red-400">No glitching, exploiting, or circumventing</span> intended raid mechanics. Crowbars, hacksaws, and explosives only.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-900/20 to-transparent p-6 rounded-lg border-l-4 border-red-500 hover:border-red-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-red-500 transition-colors">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-red-400 mb-3">No Offline Raiding Windows</h3>
                    <p className="text-gray-300 leading-relaxed">Raids are permitted <span className="text-green-400">24/7</span>. No protected offline hours. Plan base security accordingly and use multiple layers of defense.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-900/20 to-transparent p-6 rounded-lg border-l-4 border-yellow-500 hover:border-yellow-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500 transition-colors">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-yellow-400 mb-3">Raid Damage Limits</h3>
                    <p className="text-gray-300 leading-relaxed">Maximum <span className="text-yellow-400 font-bold">10 walls/doors</span> may be destroyed per raid. Plan your entry route carefully. No excessive base destruction beyond loot access.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-900/20 to-transparent p-6 rounded-lg border-l-4 border-purple-500 hover:border-purple-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500 transition-colors">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-purple-400 mb-3">No Griefing</h3>
                    <p className="text-gray-300 leading-relaxed">Take what you need, leave the rest. <span className="text-red-400">No destroying items</span> you cannot carry. <span className="text-purple-400">No blocking base entrances</span> with objects after raiding.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Safezone Rules */}
          <div className="glass-card p-10 rounded-xl border-l-8 border-cyan-600 relative">
            <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-600/20 rounded-bl-3xl flex items-center justify-center">
              <span className="text-cyan-400 text-2xl font-bold">05</span>
            </div>
            <h2 className="text-4xl font-rajdhani font-black text-cyan-500 mb-8 tracking-wider">
              SAFEZONE REGULATIONS
            </h2>
            <div className="grid gap-6">
              <div className="bg-gradient-to-r from-cyan-900/20 to-transparent p-6 rounded-lg border-l-4 border-cyan-500 hover:border-cyan-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500 transition-colors">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-cyan-400 mb-3">Trader Zone Location</h3>
                    <p className="text-gray-300 leading-relaxed">The safezone is located at <span className="text-green-400">Green Mountain</span>. This area is clearly marked with zone boundaries and warning messages.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-900/20 to-transparent p-6 rounded-lg border-l-4 border-green-500 hover:border-green-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 transition-colors">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-green-400 mb-3">No Combat Policy</h3>
                    <p className="text-gray-300 leading-relaxed"><span className="text-red-400">Absolutely no combat</span> within safezone boundaries. This includes <span className="text-orange-400">weapons drawn, hostile actions, or threats</span>. Immediate punishment for violations.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-900/20 to-transparent p-6 rounded-lg border-l-4 border-blue-500 hover:border-blue-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 transition-colors">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-blue-400 mb-3">Entry/Exit Protocols</h3>
                    <p className="text-gray-300 leading-relaxed">Wait <span className="text-blue-400 font-bold">30 seconds</span> after leaving safezone before engaging in combat. <span className="text-yellow-400">No camping</span> safezone entrances or pursuing players who entered.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-900/20 to-transparent p-6 rounded-lg border-l-4 border-purple-500 hover:border-purple-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500 transition-colors">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-purple-400 mb-3">Vehicle & Storage Rules</h3>
                    <p className="text-gray-300 leading-relaxed">No long-term vehicle parking in safezones. <span className="text-red-400">Maximum 15 minutes</span> for trading purposes. No storage containers or base building within safezone areas.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-900/20 to-transparent p-6 rounded-lg border-l-4 border-yellow-500 hover:border-yellow-400 transition-all group">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500 transition-colors">
                    <span className="text-white font-bold text-sm">5</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-rajdhani font-bold text-yellow-400 mb-3">Respect & Conduct</h3>
                    <p className="text-gray-300 leading-relaxed">Maintain respectful behavior in safezones. <span className="text-cyan-400">No spam, trolling, or disruptive conduct</span>. These areas are for peaceful trading and community interaction.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}