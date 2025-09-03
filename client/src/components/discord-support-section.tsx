import { Button } from '@/components/ui/button';

export default function DiscordSupportSection() {
  const handleDiscordClick = () => {
    window.open('https://discord.gg/aggropvp', '_blank');
  };

  return (
    <section id="discord" className="py-20 bg-gradient-to-b from-black to-red-950/20 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            <i className="fas fa-headset mr-3 text-red-500"></i>
            Community & Support
          </h2>
          <p className="text-gray-400 text-lg">Connect with fellow survivors and get help when you need it</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Discord Community */}
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-8 border border-blue-600/30 mb-8">
            <div className="text-center">
              <i className="fab fa-discord text-6xl text-blue-400 mb-6"></i>
              <h3 className="text-3xl font-bold text-white mb-4">Join Our Discord Community</h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                Join our community-driven Discord where players vote on server changes, share feedback, 
                organize events, and help shape the server's future. Your voice matters here.
              </p>
              <button 
                onClick={handleDiscordClick}
                className="vintage-metal-button px-12 py-4"
              >
                <div className="vintage-metal-inner text-lg">
                  <i className="fab fa-discord mr-3"></i>
                  JOIN DISCORD NOW
                </div>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <i className="fas fa-users text-2xl text-blue-400 mb-2"></i>
                <div className="text-white font-semibold">Community</div>
                <div className="text-gray-400 text-sm">Growing Community</div>
              </div>
              <div className="text-center">
                <i className="fas fa-bolt text-2xl text-yellow-400 mb-2"></i>
                <div className="text-white font-semibold">Live Updates</div>
                <div className="text-gray-400 text-sm">Server Status & Events</div>
              </div>
              <div className="text-center">
                <i className="fas fa-shield-alt text-2xl text-green-400 mb-2"></i>
                <div className="text-white font-semibold">24/7 Support</div>
                <div className="text-gray-400 text-sm">Community Moderators</div>
              </div>
            </div>
          </div>

          {/* Support Channels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-950/20 rounded-lg p-6 border border-red-600/30">
              <h4 className="text-xl font-semibold text-white mb-4">
                <i className="fas fa-bug mr-2 text-red-400"></i>
                Report Issues
              </h4>
              <p className="text-gray-300 mb-4">
                Found a bug or experiencing problems? Our support team is here to help.
              </p>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li>• Server connectivity issues</li>
                <li>• Gameplay bugs and glitches</li>
                <li>• Account-related problems</li>
                <li>• Feature requests</li>
              </ul>
            </div>

            <div className="bg-green-950/20 rounded-lg p-6 border border-green-600/30">
              <h4 className="text-xl font-semibold text-white mb-4">
                <i className="fas fa-question-circle mr-2 text-green-400"></i>
                Get Help
              </h4>
              <p className="text-gray-300 mb-4">
                New to DayZ or need gameplay tips? Our community is ready to assist.
              </p>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li>• Beginner guides and tutorials</li>
                <li>• Server rules clarification</li>
                <li>• Gameplay tips and strategies</li>
                <li>• Community events info</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
