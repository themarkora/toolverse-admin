import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase credentials. Please ensure you have set both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your project settings.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);