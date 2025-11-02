type Page = 'home' | 'create' | 'campaigns' | 'insights';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <img src={new URL('../assets/mofloicon.png', import.meta.url).href} alt="MoAds Logo" className="w-8 h-8" />
            <span className="text-2xl font-bold text-white tracking-tight">MoAds</span>
          </div>

          <div className="flex items-center space-x-8">
            <button
              onClick={() => onNavigate('create')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'create'
                  ? 'text-[#2663eb]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Create Campaign
            </button>
            <button
              onClick={() => onNavigate('campaigns')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'campaigns'
                  ? 'text-[#2663eb]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              View Campaigns
            </button>
            <button
              onClick={() => onNavigate('insights')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'insights'
                  ? 'text-[#2663eb]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Insights
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
