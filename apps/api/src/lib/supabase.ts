import { createClient, SupabaseClient } from '@supabase/supabase-js';
import "dotenv/config";

let _supabase: SupabaseClient | undefined;

const getSupabase = () => {
  if (!_supabase) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      throw new Error('Missing Supabase credentials');
    }
    _supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
  }
  return _supabase;
};

export default getSupabase;
