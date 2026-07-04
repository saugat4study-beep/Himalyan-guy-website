// Browser-side Supabase client. Safe to use in client components ("use client").
// Uses the public anon key — access is controlled by Row Level Security policies.
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
