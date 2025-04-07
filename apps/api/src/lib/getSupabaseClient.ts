import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import "dotenv/config";

let _supabaseClient: SupabaseClient | undefined;

export const getSupabaseClient = () => {
  if (!_supabaseClient) {
    if (!process.env.SUPABASE_URL) {
      throw new Error('Missing Supabase URL');
    }
    if (!process.env.SUPABASE_KEY) {
      throw new Error('Missing Supabase Key');
    }
    _supabaseClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
  }
  return _supabaseClient;
};
