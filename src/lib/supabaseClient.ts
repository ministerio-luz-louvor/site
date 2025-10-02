import { createClient } from "@supabase/supabase-js";

// Supabase client using env vars (server and client)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default supabase;
