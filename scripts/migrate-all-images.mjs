/**
 * Migrate ALL external images to Supabase Storage
 * Covers: devices, representatives, video thumbnails, and company logos.
 *
 * Run with: node scripts/migrate-all-images.mjs <service-role-key>
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://luoxyuddebfovbdmaxhj.supabase.co';
const SERVICE_ROLE_KEY = process.argv[2];

if (!SERVICE_ROLE_KEY) {
  console.error('\nUsage: node scripts/migrate-all-images.mjs <service-role-key>\n');
  console.error('Find your service_role key in Supabase Dashboard → Settings → API\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, SERVICE_ROLE_KEY);

async function downloadAndUpload(bucket, id, currentUrl, label) {
  if (!currentUrl) {
    console.log(`  ${label} — No image, skipping`);
    return { status: 'skipped' };
  }
  if (currentUrl.includes('supabase.co/storage')) {
    console.log(`  ${label} — Already stored, skipping`);
    return { status: 'skipped' };
  }

  try {
    const response = await fetch(currentUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const ext = contentType.includes('png') ? 'png'
              : contentType.includes('webp') ? 'webp'
              : contentType.includes('avif') ? 'avif'
              : 'jpg';

    const blob = await response.blob();
    const buffer = new Uint8Array(await blob.arrayBuffer());
    const filePath = `${id}.${ext}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, { contentType, cacheControl: '31536000', upsert: true });

    if (error) throw error;

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${data.path}`;
    console.log(`  ${label} — Uploaded`);

    await new Promise(r => setTimeout(r, 200));
    return { status: 'migrated', url: publicUrl };

  } catch (err) {
    console.error(`  ${label} — FAILED: ${err.message}`);
    return { status: 'failed' };
  }
}

async function main() {
  console.log('\nUsing service role key (admin access)...\n');

  const totals = { migrated: 0, skipped: 0, failed: 0 };

  // --- DEVICES ---
  console.log('=== DEVICES ===');
  const { data: devices } = await supabase.from('devices').select('id, name, image_url').order('name');
  for (const d of (devices || [])) {
    const result = await downloadAndUpload('device-images', d.id, d.image_url, d.name);
    totals[result.status]++;
    if (result.url) {
      await supabase.from('devices').update({ image_url: result.url }).eq('id', d.id);
    }
  }

  // --- REPRESENTATIVES ---
  console.log('\n=== REPRESENTATIVES ===');
  const { data: reps } = await supabase.from('representatives').select('id, name, avatar_url').order('name');
  for (const r of (reps || [])) {
    const result = await downloadAndUpload('rep-avatars', r.id, r.avatar_url, r.name);
    totals[result.status]++;
    if (result.url) {
      await supabase.from('representatives').update({ avatar_url: result.url }).eq('id', r.id);
    }
  }

  // --- VIDEO THUMBNAILS ---
  console.log('\n=== VIDEO THUMBNAILS ===');
  const { data: videos } = await supabase.from('device_videos').select('id, title, thumbnail_url').order('title');
  for (const v of (videos || [])) {
    const result = await downloadAndUpload('video-thumbnails', v.id, v.thumbnail_url, v.title);
    totals[result.status]++;
    if (result.url) {
      await supabase.from('device_videos').update({ thumbnail_url: result.url }).eq('id', v.id);
    }
  }

  // --- COMPANY LOGOS ---
  console.log('\n=== COMPANY LOGOS ===');
  const { data: companies } = await supabase.from('companies').select('id, name, logo_url').order('name');
  for (const c of (companies || [])) {
    const result = await downloadAndUpload('company-logos', c.id, c.logo_url, c.name);
    totals[result.status]++;
    if (result.url) {
      await supabase.from('companies').update({ logo_url: result.url }).eq('id', c.id);
    }
  }

  console.log('\n========== COMPLETE ==========');
  console.log(`Migrated: ${totals.migrated}`);
  console.log(`Skipped:  ${totals.skipped}`);
  console.log(`Failed:   ${totals.failed}`);
  console.log('==============================\n');
}

main();
