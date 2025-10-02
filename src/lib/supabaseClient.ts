import { createBrowserSupabaseClient } from "@supabase/supabase-js";

// Client-side Supabase instance. Uses NEXT_PUBLIC env vars.
const supabase = createBrowserSupabaseClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
});

export default supabase;
