import { Rocket, TrendingUp, Target } from 'lucide-react';

interface HeroSectionProps {
  onStartBuilding: () => void;
}

export default function HeroSection({ onStartBuilding }: HeroSectionProps) {
  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(38,99,235,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(38,99,235,0.05),transparent_50%)]"></div>

      <div className="max-w-7xl mx-auto px-6 py-24 relative">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            Build High-Impact Ad Campaigns{' '}
            <span className="text-[#2663eb]">in Minutes</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create, manage, and optimize campaigns across Google Ads and Meta platforms
            with precision and speed.
          </p>

          <button
            onClick={onStartBuilding}
            className="bg-[#2663eb] hover:bg-[#1d4fbf] text-white font-semibold px-10 py-4 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-[#2663eb]/50"
          >
            Start Building
          </button>

          <div className="mt-20 grid grid-cols-3 gap-8">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-[#2663eb]/50 transition-colors">
              <Rocket className="w-10 h-10 text-[#2663eb] mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Fast Deployment</h3>
              <p className="text-gray-400 text-sm">Launch campaigns across platforms instantly</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-[#2663eb]/50 transition-colors">
              <Target className="w-10 h-10 text-[#2663eb] mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Precision Targeting</h3>
              <p className="text-gray-400 text-sm">Reach your exact audience with smart tools</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-[#2663eb]/50 transition-colors">
              <TrendingUp className="w-10 h-10 text-[#2663eb] mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Real-Time Insights</h3>
              <p className="text-gray-400 text-sm">Track performance and optimize on the fly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
