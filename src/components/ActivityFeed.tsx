import { useState, useEffect } from 'react';
import { Calendar, DollarSign } from 'lucide-react';
import { supabase, Campaign } from '../lib/supabase';

export default function ActivityFeed() {
  const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentCampaigns();
  }, []);

  const fetchRecentCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching recent campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2663eb]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentCampaigns.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400">No recent activity</p>
        </div>
      ) : (
        recentCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-[#2663eb]/50 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-1">{campaign.campaign_name}</h4>
                <p className="text-sm text-gray-400 line-clamp-1">
                  {campaign.google_ads_text}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ml-3 ${
                  campaign.status === 'active'
                    ? 'bg-green-900/30 text-green-400'
                    : campaign.status === 'paused'
                    ? 'bg-yellow-900/30 text-yellow-400'
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                {campaign.status}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center">
                <DollarSign className="w-3 h-3 mr-1" />
                <span>${campaign.budget.toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{new Date(campaign.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
