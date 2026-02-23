/**
 * Fix Christopher Lee's avatar with a replacement stock photo
 * Run with: node scripts/fix-christopher-lee.mjs <service-role-key>
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://luoxyuddebfovbdmaxhj.supabase.co';
const SERVICE_ROLE_KEY = process.argv[2];

if (!SERVICE_ROLE_KEY) {
  console.error('\nUsage: node scripts/fix-christopher-lee.mjs <service-role-key>\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, SERVICE_ROLE_KEY);

async function main() {
  // Find Christopher Lee
  const { data: reps, error: fetchError } = await supabase
    .from('representatives')
    .select('id, name, avatar_url')
    .eq('name', 'Christopher Lee');

  if (fetchError || !reps?.length) {
    console.error('Could not find Christopher Lee:', fetchError?.message);
    process.exit(1);
  }

  const rep = reps[0];
  console.log(`Found: ${rep.name} (${rep.id})`);

  // Download replacement photo - Asian male professional headshot
  const imageUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face';
  console.log('Downloading replacement image...');

  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error(`Download failed: HTTP ${response.status}`);

  const contentType = response.headers.get('content-type') || 'image/jpeg';
  const blob = await response.blob();
  const buffer = new Uint8Array(await blob.arrayBuffer());
  const filePath = `${rep.id}.jpg`;

  console.log('Uploading to Supabase Storage...');
  const { data, error: uploadError } = await supabase.storage
    .from('rep-avatars')
    .upload(filePath, buffer, { contentType, cacheControl: '31536000', upsert: true });

  if (uploadError) throw uploadError;

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/rep-avatars/${data.path}`;

  // Update the database record
  const { error: updateError } = await supabase
    .from('representatives')
    .update({ avatar_url: publicUrl })
    .eq('id', rep.id);

  if (updateError) throw updateError;

  console.log(`\nDone! Updated Christopher Lee's avatar.`);
  console.log(`New URL: ${publicUrl}\n`);
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
