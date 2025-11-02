import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Create a safe Supabase client that won't crash the app if env vars are missing in production
function createSafeSupabase() {
  if (supabaseUrl && supabaseAnonKey) {
    return createClient(supabaseUrl, supabaseAnonKey);
  }

  // Minimal no-op mock to avoid runtime crashes on missing env vars (e.g., Vercel preview)
  // Calls will resolve with an error that components can handle gracefully.
  // eslint-disable-next-line no-console
  console.warn('[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. Using mock client.');

  const notConfigured = new Error('Supabase is not configured: missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');

  const mock = {
    from: (_table: string) => ({
      select: (_cols?: string) => ({
        order: (_column: string, _opts?: unknown) => ({
          limit: async (_n: number) => ({ data: [], error: notConfigured }),
        }),
      }),
      insert: async (_values: unknown) => ({ data: null, error: notConfigured }),
      delete: () => ({
        eq: async (_col: string, _val: unknown) => ({ data: null, error: notConfigured }),
      }),
    }),
  } as unknown as ReturnType<typeof createClient>;

  return mock;
}

export const supabase = createSafeSupabase();

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
