import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    // In production mode, we want to hard fail if configuration is missing.
    // This prevents the app from launching in an invalid state.
    throw new Error('Missing Supabase Environment Variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
