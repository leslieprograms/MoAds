import { useState } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CampaignFormProps {
  onSuccess: () => void;
}

export default function CampaignForm({ onSuccess }: CampaignFormProps) {
  const [formData, setFormData] = useState({
    campaign_name: '',
    google_ads_text: '',
    meta_ads_caption: '',
    budget: '',
    start_date: '',
    end_date: '',
    audience: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.campaign_name.trim()) {
      newErrors.campaign_name = 'Campaign name is required';
    }
    if (!formData.google_ads_text.trim()) {
      newErrors.google_ads_text = 'Google Ads text is required';
    }
    if (!formData.meta_ads_caption.trim()) {
      newErrors.meta_ads_caption = 'Meta Ads caption is required';
    }
    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Valid budget is required';
    }
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }
    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
      newErrors.end_date = 'End date must be after start date';
    }
    if (!formData.audience.trim()) {
      newErrors.audience = 'Audience is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('campaigns').insert([
        {
          campaign_name: formData.campaign_name,
          google_ads_text: formData.google_ads_text,
          meta_ads_caption: formData.meta_ads_caption,
          budget: parseFloat(formData.budget),
          start_date: formData.start_date,
          end_date: formData.end_date,
          audience: formData.audience,
          status: 'active',
        },
      ]);

      if (error) throw error;

      setFormData({
        campaign_name: '',
        google_ads_text: '',
        meta_ads_caption: '',
        budget: '',
        start_date: '',
        end_date: '',
        audience: '',
      });

      onSuccess();
    } catch (error) {
      console.error('Error creating campaign:', error);
      setErrors({ submit: 'Failed to create campaign. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Campaign Details</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Campaign Name
            </label>
            <input
              type="text"
              name="campaign_name"
              value={formData.campaign_name}
              onChange={handleChange}
              className="w-full bg-white text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2663eb] transition-all"
              placeholder="End of Year Sale 2025"
            />
            {errors.campaign_name && (
              <p className="text-red-400 text-sm mt-1">{errors.campaign_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Google Ads Text
            </label>
            <textarea
              name="google_ads_text"
              value={formData.google_ads_text}
              onChange={handleChange}
              rows={3}
              className="w-full bg-white text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2663eb] transition-all resize-none"
              placeholder="Discover amazing deals on premium products. Shop now and save up to 50%!"
            />
            {errors.google_ads_text && (
              <p className="text-red-400 text-sm mt-1">{errors.google_ads_text}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Meta Ads Caption
            </label>
            <textarea
              name="meta_ads_caption"
              value={formData.meta_ads_caption}
              onChange={handleChange}
              rows={3}
              className="w-full bg-white text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2663eb] transition-all resize-none"
              placeholder="🔥 End of year deals are here! Don't miss out on incredible savings. Link in bio! #Sale #Shopping"
            />
            {errors.meta_ads_caption && (
              <p className="text-red-400 text-sm mt-1">{errors.meta_ads_caption}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Budget ($)
            </label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full bg-white text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2663eb] transition-all"
              placeholder="5000.00"
            />
            {errors.budget && (
              <p className="text-red-400 text-sm mt-1">{errors.budget}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full bg-white text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2663eb] transition-all"
              />
              {errors.start_date && (
                <p className="text-red-400 text-sm mt-1">{errors.start_date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full bg-white text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2663eb] transition-all"
              />
              {errors.end_date && (
                <p className="text-red-400 text-sm mt-1">{errors.end_date}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Target Audience
            </label>
            <input
              type="text"
              name="audience"
              value={formData.audience}
              onChange={handleChange}
              className="w-full bg-white text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2663eb] transition-all"
              placeholder="Ages 25-45, interested in fashion and lifestyle"
            />
            {errors.audience && (
              <p className="text-red-400 text-sm mt-1">{errors.audience}</p>
            )}
          </div>

          {errors.submit && (
            <p className="text-red-400 text-sm">{errors.submit}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#2663eb] hover:bg-[#1d4fbf] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            <span>{isSubmitting ? 'Creating...' : 'Create Campaign'}</span>
          </button>
        </form>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Live Preview</h2>

        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                Ad • Google
              </span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">
              {formData.campaign_name || 'Campaign Name'}
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {formData.google_ads_text || 'Your Google Ads text will appear here...'}
            </p>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">example.com</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[#2663eb] rounded-full flex items-center justify-center text-white font-bold">
                M
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {formData.campaign_name || 'Campaign Name'}
                </p>
                <p className="text-xs text-gray-500">Sponsored</p>
              </div>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed mb-4">
              {formData.meta_ads_caption || 'Your Meta Ads caption will appear here...'}
            </p>
            <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Ad Image</span>
            </div>
          </div>

          {formData.budget && (
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-xs mb-1">Total Budget</p>
              <p className="text-white text-2xl font-bold">
                ${parseFloat(formData.budget).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
