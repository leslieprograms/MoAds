/*
  # Create campaigns table for MoAds

  1. New Tables
    - `campaigns`
      - `id` (uuid, primary key) - Unique identifier for each campaign
      - `campaign_name` (text) - Name of the advertising campaign
      - `google_ads_text` (text) - Text content for Google Ads
      - `meta_ads_caption` (text) - Caption for Meta/Facebook Ads
      - `budget` (numeric) - Campaign budget amount
      - `start_date` (date) - Campaign start date
      - `end_date` (date) - Campaign end date
      - `audience` (text) - Target audience description
      - `status` (text) - Campaign status (active, paused, completed)
      - `created_at` (timestamptz) - Timestamp of campaign creation
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `campaigns` table
    - Add policy for public access (for demo purposes)
    
  3. Notes
    - This schema supports the full campaign creation and management workflow
    - Budget is stored as numeric for precise decimal handling
    - Status field allows tracking campaign lifecycle
*/

CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name text NOT NULL,
  google_ads_text text NOT NULL,
  meta_ads_caption text NOT NULL,
  budget numeric(10, 2) NOT NULL DEFAULT 0,
  start_date date NOT NULL,
  end_date date NOT NULL,
  audience text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to campaigns"
  ON campaigns
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated access to campaigns"
  ON campaigns
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);