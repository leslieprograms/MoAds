import { useState, useEffect } from 'react';
import { Edit2, Trash2, Grid, List, Calendar, DollarSign, Users, X, Save } from 'lucide-react';
import { supabase, Campaign } from '../lib/supabase';

interface CampaignListProps {
  refreshTrigger: number;
}

export default function CampaignList({ refreshTrigger }: CampaignListProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [editForm, setEditForm] = useState<Partial<Campaign>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, [refreshTrigger]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const { error } = await supabase.from('campaigns').delete().eq('id', id);

      if (error) throw error;
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const openEditModal = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setEditForm({
      campaign_name: campaign.campaign_name,
      google_ads_text: campaign.google_ads_text,
      meta_ads_caption: campaign.meta_ads_caption,
      budget: campaign.budget,
      start_date: campaign.start_date,
      end_date: campaign.end_date,
      audience: campaign.audience,
      status: campaign.status,
    });
  };

  const closeEditModal = () => {
    setEditingCampaign(null);
    setEditForm({});
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateCampaign = async () => {
    if (!editingCampaign) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({
          campaign_name: editForm.campaign_name,
          google_ads_text: editForm.google_ads_text,
          meta_ads_caption: editForm.meta_ads_caption,
          budget: editForm.budget,
          start_date: editForm.start_date,
          end_date: editForm.end_date,
          audience: editForm.audience,
          status: editForm.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingCampaign.id);

      if (error) throw error;

      // Update local state
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === editingCampaign.id
            ? { ...c, ...editForm, updated_at: new Date().toISOString() }
            : c
        )
      );

      closeEditModal();
    } catch (error) {
      console.error('Error updating campaign:', error);
      alert('Failed to update campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCampaigns =
    filterStatus === 'all'
      ? campaigns
      : campaigns.filter((c) => c.status === filterStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2663eb]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
          >
            <option value="all">All Campaigns</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>

          <p className="text-gray-400 text-sm">
            {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-[#2663eb] text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'table'
                ? 'bg-[#2663eb] text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {filteredCampaigns.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No campaigns found</p>
          <p className="text-gray-500 text-sm mt-2">Create your first campaign to get started</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-[#2663eb]/50 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {campaign.campaign_name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
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

                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(campaign)}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => deleteCampaign(campaign.id)}
                    className="p-2 bg-gray-800 hover:bg-red-900/50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-400">
                  <DollarSign className="w-4 h-4 mr-2 text-[#2663eb]" />
                  <span>${campaign.budget.toLocaleString()}</span>
                </div>

                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="w-4 h-4 mr-2 text-[#2663eb]" />
                  <span>
                    {new Date(campaign.start_date).toLocaleDateString()} -{' '}
                    {new Date(campaign.end_date).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-400">
                  <Users className="w-4 h-4 mr-2 text-[#2663eb]" />
                  <span className="truncate">{campaign.audience}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-xs text-gray-500 line-clamp-2">
                  {campaign.google_ads_text}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                    Campaign
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                    Budget
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                    Duration
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                    Audience
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{campaign.campaign_name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          campaign.status === 'active'
                            ? 'bg-green-900/30 text-green-400'
                            : campaign.status === 'paused'
                            ? 'bg-yellow-900/30 text-yellow-400'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      ${campaign.budget.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      {new Date(campaign.start_date).toLocaleDateString()} -{' '}
                      {new Date(campaign.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm max-w-xs truncate">
                      {campaign.audience}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(campaign)}
                          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => deleteCampaign(campaign.id)}
                          className="p-2 bg-gray-800 hover:bg-red-900/50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCampaign && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Edit Campaign</h2>
              <button
                onClick={closeEditModal}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  name="campaign_name"
                  value={editForm.campaign_name || ''}
                  onChange={handleEditChange}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Google Ads Text
                </label>
                <textarea
                  name="google_ads_text"
                  value={editForm.google_ads_text || ''}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2663eb] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meta Ads Caption
                </label>
                <textarea
                  name="meta_ads_caption"
                  value={editForm.meta_ads_caption || ''}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2663eb] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Budget ($)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={editForm.budget || ''}
                  onChange={handleEditChange}
                  step="0.01"
                  min="0"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={editForm.start_date || ''}
                    onChange={handleEditChange}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={editForm.end_date || ''}
                    onChange={handleEditChange}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  name="audience"
                  value={editForm.audience || ''}
                  onChange={handleEditChange}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={editForm.status || 'active'}
                  onChange={handleEditChange}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={closeEditModal}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateCampaign}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#2663eb] hover:bg-[#1d4fbf] text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
