import logoImage from '@assets/AggroNewest-modified_1750723004646.png';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-red-600/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <img src={logoImage} alt="Aggro PvP Logo" className="h-8 w-auto" />
            <div>
              <div className="text-white font-rajdhani font-bold">AGGRO PVP</div>
              <div className="text-gray-400 text-sm">© 2024 - Hardcore DayZ Experience</div>
            </div>
          </div>
          
          <div className="flex space-x-6">
            <a 
              href="https://discord.gg/aggropvp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <i className="fab fa-discord text-xl"></i>
            </a>
            <button 
              onClick={() => {
                const steamUrl = 'steam://run/221100';
                const steamLink = document.createElement('a');
                steamLink.href = steamUrl;
                steamLink.click();
              }}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <i className="fab fa-steam text-xl"></i>
            </button>
            <a 
              href="https://www.battlemetrics.com/servers/dayz/33681997" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <i className="fab fa-youtube text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
