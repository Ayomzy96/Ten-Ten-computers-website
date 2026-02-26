import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Centralized Supabase client used by other modules.
// Vite inlines VITE_* env vars at build time (import.meta.env).
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env?.VITE_SUPABASE_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized');
  } catch (err) {
    console.error('Failed to initialize Supabase client in supabaseClient.js:', err);
  }
} else {
  console.warn('VITE_SUPABASE_URL or VITE_SUPABASE_KEY missing at build time. Supabase client not initialized.');
}

export default supabase;
