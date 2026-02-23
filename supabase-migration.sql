-- =============================================
-- MIGRATION: Run this if you already have the
-- previous schema. This adds the new columns,
-- tables, and updates seed data.
-- =============================================

-- Drop existing data to re-seed
DELETE FROM representatives;
DELETE FROM devices;
DELETE FROM companies;

-- Add new columns to devices
ALTER TABLE devices ADD COLUMN IF NOT EXISTS specs_url TEXT;
ALTER TABLE devices ADD COLUMN IF NOT EXISTS specifications TEXT[] DEFAULT '{}';

-- Create device_videos table
CREATE TABLE IF NOT EXISTS device_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT,
  thumbnail_url TEXT,
  author TEXT,
  author_title TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_videos_device ON device_videos(device_id);

ALTER TABLE device_videos ENABLE ROW LEVEL SECURITY;

-- Drop policy if it exists, then create
DO $$
BEGIN
  DROP POLICY IF EXISTS "Authenticated users can view device_videos" ON device_videos;
  CREATE POLICY "Authenticated users can view device_videos"
    ON device_videos FOR SELECT TO authenticated USING (true);
END $$;

-- =============================================
-- Now re-run the full seed data from supabase-schema.sql
-- Copy everything from the "SEED DATA" section onwards
-- =============================================
