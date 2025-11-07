import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using the service role key (must be kept secret)
// Service role bypasses RLS by default
const serverSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export default serverSupabase;
