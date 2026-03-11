import { createClient } from '@supabase/supabase-js';

// Use the main Wysdom Supabase project (shared auth)
const supabaseUrl = 'https://ivmotsqairwwkxmntqaw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2bW90c3FhaXJ3d2t4bW50cWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNTUzMDIsImV4cCI6MjA4ODczMTMwMn0.jBfN9CgUjuGQBCcr6D9eGTRsK7Ajsi4WmSBZG1cOHw0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
