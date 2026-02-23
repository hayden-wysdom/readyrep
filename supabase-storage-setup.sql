-- =============================================
-- Supabase Storage Setup
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('device-images', 'device-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('rep-avatars', 'rep-avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('video-thumbnails', 'video-thumbnails', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('company-logos', 'company-logos', true);

-- 2. Storage policies - authenticated users can upload/update/delete
-- Device images
CREATE POLICY "Authenticated users can upload device images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'device-images');

CREATE POLICY "Authenticated users can update device images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'device-images');

CREATE POLICY "Authenticated users can delete device images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'device-images');

CREATE POLICY "Anyone can view device images"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'device-images');

-- Rep avatars
CREATE POLICY "Authenticated users can upload rep avatars"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'rep-avatars');

CREATE POLICY "Authenticated users can update rep avatars"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'rep-avatars');

CREATE POLICY "Authenticated users can delete rep avatars"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'rep-avatars');

CREATE POLICY "Anyone can view rep avatars"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'rep-avatars');

-- Video thumbnails
CREATE POLICY "Authenticated users can upload video thumbnails"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'video-thumbnails');

CREATE POLICY "Authenticated users can update video thumbnails"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'video-thumbnails');

CREATE POLICY "Authenticated users can delete video thumbnails"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'video-thumbnails');

CREATE POLICY "Anyone can view video thumbnails"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'video-thumbnails');

-- Company logos
CREATE POLICY "Authenticated users can upload company logos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'company-logos');

CREATE POLICY "Authenticated users can update company logos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'company-logos');

CREATE POLICY "Authenticated users can delete company logos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'company-logos');

CREATE POLICY "Anyone can view company logos"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'company-logos');

-- 3. Add RLS policies for authenticated users to UPDATE rows
-- (needed so admin can update image_url fields)
CREATE POLICY "Authenticated users can update devices"
  ON devices FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can update representatives"
  ON representatives FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can update device_videos"
  ON device_videos FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can update companies"
  ON companies FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- 4. Also allow INSERT and DELETE for full admin control
CREATE POLICY "Authenticated users can insert devices"
  ON devices FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete devices"
  ON devices FOR DELETE TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert representatives"
  ON representatives FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete representatives"
  ON representatives FOR DELETE TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert device_videos"
  ON device_videos FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete device_videos"
  ON device_videos FOR DELETE TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert companies"
  ON companies FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete companies"
  ON companies FOR DELETE TO authenticated
  USING (true);
