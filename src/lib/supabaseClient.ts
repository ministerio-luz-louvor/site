import { createClient } from "@supabase/supabase-js";

// Create Supabase client only in the browser to avoid server-side prerender errors
const isBrowser = typeof window !== "undefined";

let supabase: any = null;
if (isBrowser) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    supabase = createClient(url, key);
  } else {
    // If env vars are missing in dev, we still don't want the build to fail here.
    supabase = null;
  }
}

export default supabase;
