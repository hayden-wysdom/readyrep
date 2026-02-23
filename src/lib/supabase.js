import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://luoxyuddebfovbdmaxhj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1b3h5dWRkZWJmb3ZiZG1heGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTMwOTcsImV4cCI6MjA4NzE4OTA5N30.YYfKGZkB1k9LZ1uKlSUJQlLAjTYIwekEcCKCz_XKvO8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
