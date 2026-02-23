/**
 * Migrate Representative Avatars to Supabase Storage
 *
 * This script downloads all external rep avatar images and
 * re-uploads them to your Supabase Storage bucket so they're
 * permanently stored and won't go down.
 *
 * Run with: node scripts/migrate-rep-images.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://luoxyuddebfovbdmaxhj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1b3h5dWRkZWJmb3ZiZG1heGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMwOTcsImV4cCI6MjA4NzE4OTA5N30.YYfKGZkB1k9LZ1uKlSUJQlLAjTYIwekEcCKCz_XKvO8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// You need to sign in first so RLS policies allow uploads
const EMAIL = process.argv[2];
const PASSWORD = process.argv[3];

if (!EMAIL || !PASSWORD) {
  console.error('\nUsage: node scripts/migrate-rep-images.mjs <your-email> <your-password>\n');
  console.error('Example: node scripts/migrate-rep-images.mjs you@hospital.com mypassword123\n');
  process.exit(1);
}

async function main() {
  // Sign in
  console.log(`\nSigning in as ${EMAIL}...`);
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: EMAIL,
    password: PASSWORD
  });
  if (authError) {
    console.error('Auth failed:', authError.message);
    process.exit(1);
  }
  console.log('Signed in successfully.\n');

  // Fetch all reps
  const { data: reps, error: fetchError } = await supabase
    .from('representatives')
    .select('id, name, avatar_url')
    .order('name');

  if (fetchError) {
    console.error('Failed to fetch reps:', fetchError.message);
    process.exit(1);
  }

  console.log(`Found ${reps.length} representatives.\n`);

  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (const rep of reps) {
    const label = `[${rep.name}]`;

    // Skip if already in Supabase Storage
    if (rep.avatar_url?.includes('supabase.co/storage')) {
      console.log(`${label} Already in Supabase Storage — skipping`);
      skipped++;
      continue;
    }

    // Skip if no avatar
    if (!rep.avatar_url) {
      console.log(`${label} No avatar URL — skipping`);
      skipped++;
      continue;
    }

    try {
      // Download the image
      console.log(`${label} Downloading from ${rep.avatar_url.substring(0, 60)}...`);
      const response = await fetch(rep.avatar_url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const ext = contentType.includes('png') ? 'png'
                : contentType.includes('webp') ? 'webp'
                : 'jpg';
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      // Upload to Supabase Storage
      const filePath = `${rep.id}.${ext}`;
      console.log(`${label} Uploading to rep-avatars/${filePath}...`);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('rep-avatars')
        .upload(filePath, buffer, {
          contentType,
          cacheControl: '31536000',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Build public URL and update database
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/rep-avatars/${uploadData.path}`;

      const { error: updateError } = await supabase
        .from('representatives')
        .update({ avatar_url: publicUrl })
        .eq('id', rep.id);

      if (updateError) throw updateError;

      console.log(`${label} Done!\n`);
      migrated++;

    } catch (err) {
      console.error(`${label} FAILED: ${err.message}\n`);
      failed++;
    }

    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n========== MIGRATION COMPLETE ==========');
  console.log(`Migrated: ${migrated}`);
  console.log(`Skipped:  ${skipped}`);
  console.log(`Failed:   ${failed}`);
  console.log('=========================================\n');
}

main();
