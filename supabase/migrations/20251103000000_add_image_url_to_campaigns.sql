-- Add image_url column to campaigns table
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS image_url text;

-- Create a storage bucket for campaign images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('campaign-images', 'campaign-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to campaign images
-- Drop policies if they exist and recreate them
DROP POLICY IF EXISTS "Public Access to campaign images" ON storage.objects;
CREATE POLICY "Public Access to campaign images"
ON storage.objects FOR SELECT
USING (bucket_id = 'campaign-images');

DROP POLICY IF EXISTS "Authenticated users can upload campaign images" ON storage.objects;
CREATE POLICY "Authenticated users can upload campaign images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'campaign-images');

DROP POLICY IF EXISTS "Users can update their campaign images" ON storage.objects;
CREATE POLICY "Users can update their campaign images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'campaign-images');

DROP POLICY IF EXISTS "Users can delete campaign images" ON storage.objects;
CREATE POLICY "Users can delete campaign images"
ON storage.objects FOR DELETE
USING (bucket_id = 'campaign-images');
