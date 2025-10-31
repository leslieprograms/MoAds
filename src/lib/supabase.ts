import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Campaign {
  id: string;
  campaign_name: string;
  google_ads_text: string;
  meta_ads_caption: string;
  budget: number;
  start_date: string;
  end_date: string;
  audience: string;
  status: string;
  created_at: string;
  updated_at: string;
}
