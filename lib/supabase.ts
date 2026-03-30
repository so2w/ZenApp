import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Ensure you replace these with your actual URL and anon key if they change.
const supabaseUrl = 'https://zdcclmnyoeymiiwhupcm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkY2NsbW55b2V5bWlpd2h1cGNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NzczMDUsImV4cCI6MjA5MDQ1MzMwNX0.PZE0s-pha9IgOXZeMYcqzVk3HzQy23nyauisYuXASpU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
