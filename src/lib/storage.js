import { supabase } from './supabase';

const SUPABASE_URL = 'https://ivmotsqairwwkxmntqaw.supabase.co';

/**
 * Normalize file extension (e.g. .jpeg -> .jpg)
 */
function normalizeExt(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  if (ext === 'jpeg') return 'jpg';
  return ext;
}

/**
 * Delete any existing files for this ID in the bucket (handles extension mismatches)
 */
async function cleanupOldFiles(bucket, id) {
  const { data: files } = await supabase.storage.from(bucket).list('', {
    search: id
  });
  if (files && files.length > 0) {
    const toRemove = files.filter(f => f.name.startsWith(id)).map(f => f.name);
    if (toRemove.length > 0) {
      await supabase.storage.from(bucket).remove(toRemove);
    }
  }
}

/**
 * Upload an image to a Supabase storage bucket.
 * Returns the public URL of the uploaded image.
 */
export async function uploadImage(bucket, file, path) {
  const ext = normalizeExt(file.name);
  const filePath = path || `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  console.log('[Storage] Uploading:', { bucket, filePath, fileSize: file.size, fileType: file.type });

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '0',
      upsert: true
    });

  console.log('[Storage] Upload response:', { data, error });

  if (error) throw error;

  const url = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${data.path}?t=${Date.now()}`;
  console.log('[Storage] Public URL:', url);
  return url;
}

/**
 * Delete an image from a Supabase storage bucket.
 */
export async function deleteImage(bucket, url) {
  if (!url || !url.includes(SUPABASE_URL)) return;

  let path = url.split(`/storage/v1/object/public/${bucket}/`)[1];
  if (!path) return;

  // Strip query params like ?t=123456
  path = path.split('?')[0];

  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) console.error('Error deleting image:', error);
}

/**
 * Upload a device image and update the database record.
 */
export async function uploadDeviceImage(deviceId, file) {
  const ext = normalizeExt(file.name);
  const path = `${deviceId}.${ext}`;

  // Remove old files first (in case extension changed)
  await cleanupOldFiles('device-images', deviceId);

  const url = await uploadImage('device-images', file, path);

  const { error } = await supabase
    .from('dw_devices')
    .update({ image_url: url })
    .eq('id', deviceId);

  if (error) throw error;
  return url;
}

/**
 * Upload a rep avatar and update the database record.
 */
export async function uploadRepAvatar(repId, file) {
  const ext = normalizeExt(file.name);
  const path = `${repId}.${ext}`;

  await cleanupOldFiles('rep-avatars', repId);

  const url = await uploadImage('rep-avatars', file, path);

  const { error } = await supabase
    .from('dw_representatives')
    .update({ avatar_url: url })
    .eq('id', repId);

  if (error) throw error;
  return url;
}

/**
 * Upload a video thumbnail and update the database record.
 */
export async function uploadVideoThumbnail(videoId, file) {
  const ext = normalizeExt(file.name);
  const path = `${videoId}.${ext}`;

  await cleanupOldFiles('video-thumbnails', videoId);

  const url = await uploadImage('video-thumbnails', file, path);

  const { error } = await supabase
    .from('dw_device_videos')
    .update({ thumbnail_url: url })
    .eq('id', videoId);

  if (error) throw error;
  return url;
}

/**
 * Upload a company logo and update the database record.
 */
export async function uploadCompanyLogo(companyId, file) {
  const ext = normalizeExt(file.name);
  const path = `${companyId}.${ext}`;

  await cleanupOldFiles('company-logos', companyId);

  const url = await uploadImage('company-logos', file, path);

  const { error } = await supabase
    .from('dw_companies')
    .update({ logo_url: url })
    .eq('id', companyId);

  if (error) throw error;
  return url;
}
