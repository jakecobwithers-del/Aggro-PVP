export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-rajdhani font-bold mb-6">
            <span className="text-red-600">ABOUT</span> AGGRO PVP
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="DayZ Zombie Apocalypse" 
              className="rounded-xl shadow-2xl w-full h-auto border border-red-600/30"
            />
          </div>
          
          <div className="space-y-6">
            <h3 className="text-3xl font-rajdhani font-bold text-red-500">COMMUNITY DRIVEN</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Welcome to Aggro PVP - a community-run DayZ server where players have a voice. Whether you donate or just love to play, your feedback shapes the server experience. Featuring safe zones, traders, and black market.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-red-600/30 infected-glow">
                <i className="fas fa-shield-alt text-red-500 text-2xl mb-2"></i>
                <h4 className="font-rajdhani font-bold text-white">SAFE ZONES</h4>
                <p className="text-sm text-gray-400">Protected trading areas</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-red-600/30 infected-glow">
                <i className="fas fa-store text-red-500 text-2xl mb-2"></i>
                <h4 className="font-rajdhani font-bold text-white">TRADERS</h4>
                <p className="text-sm text-gray-400">Buy & sell gear</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-red-600/30 infected-glow">
                <i className="fas fa-home text-red-500 text-2xl mb-2"></i>
                <h4 className="font-rajdhani font-bold text-white">BASE BUILDING</h4>
                <p className="text-sm text-gray-400">Fortify your territory</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-red-600/30 infected-glow">
                <i className="fas fa-mask text-red-500 text-2xl mb-2"></i>
                <h4 className="font-rajdhani font-bold text-white">BLACK MARKET</h4>
                <p className="text-sm text-gray-400">Rare items & deals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
