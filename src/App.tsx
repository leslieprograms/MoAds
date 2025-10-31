import { useState } from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import ActivityFeed from './components/ActivityFeed';
import CampaignForm from './components/CampaignForm';
import CampaignList from './components/CampaignList';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'create' | 'campaigns' | 'insights'>('home');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCampaignCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setCurrentPage('campaigns');
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

      {currentPage === 'home' && (
        <>
          <HeroSection onStartBuilding={() => setCurrentPage('create')} />

          <div className="max-w-7xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-bold text-white mb-8">Recent Activity</h2>
            <ActivityFeed />
          </div>
        </>
      )}

      {currentPage === 'create' && (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Create New Campaign</h1>
            <p className="text-gray-400">
              Build your campaign and preview how it will look on different platforms
            </p>
          </div>
          <CampaignForm onSuccess={handleCampaignCreated} />
        </div>
      )}

      {currentPage === 'campaigns' && (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Manage Campaigns</h1>
            <p className="text-gray-400">
              View, edit, and manage all your advertising campaigns
            </p>
          </div>
          <CampaignList refreshTrigger={refreshTrigger} />
        </div>
      )}

      {currentPage === 'insights' && (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Campaign Insights</h1>
            <p className="text-gray-400">
              Analytics and performance metrics coming soon
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-16 text-center">
            <p className="text-gray-500 text-lg">
              Advanced analytics and insights will be available here
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
