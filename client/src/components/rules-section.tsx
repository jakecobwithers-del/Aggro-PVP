import { serverRules } from '@/lib/server-rules';

export default function RulesSection() {
  return (
    <section id="rules" className="py-20 bg-gradient-to-b from-gray-900 to-black scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-rajdhani font-black text-white mb-6">
            SURVIVOR <span className="text-red-500">CODE</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            These laws keep Chernarus from descending into total chaos. Break them, and you'll be permanently exiled from the wasteland.
          </p>
        </div>
        
        <div className="space-y-8">
          {serverRules.map((category, index) => (
            <div 
              key={index} 
              className="bg-black/40 rounded-lg border border-gray-700/50 overflow-hidden"
            >
              <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-700/50">
                <h3 className="text-2xl font-rajdhani font-bold text-white flex items-center">
                  <i className={`${category.icon} mr-4 text-red-500`}></i>
                  {category.title}
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                {category.rules.map((rule, ruleIndex) => (
                  <div key={rule.id} className="flex items-start space-x-4">
                    <span className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {rule.id}
                    </span>
                    <p className="text-gray-300 leading-relaxed">
                      {rule.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
