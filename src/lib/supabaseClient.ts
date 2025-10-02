import { createClient } from "@supabase/supabase-js";

// Client-side Supabase instance. Uses NEXT_PUBLIC env vars.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default supabase;
