/**
 * Supabase browser client (Milestone 2 backend, Q25).
 *
 * Lazily constructed and env-gated: nothing is created unless both
 * NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are present, so the
 * static export builds and the app runs on the local stub until the project is
 * provisioned. The anon key is public by design; row-level security (see
 * supabase-setup.md) is what actually protects data.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function supabaseUrl(): string | undefined {
  return typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_SUPABASE_URL : undefined;
}

export function supabaseAnonKey(): string | undefined {
  return typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined;
}

/** True when both public Supabase env vars are configured. */
export function isSupabaseConfigured(): boolean {
  return !!supabaseUrl() && !!supabaseAnonKey();
}

/** The shared browser client, or null when Supabase is not configured. */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(supabaseUrl()!, supabaseAnonKey()!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true, // supports magic-link return
        flowType: 'pkce',
      },
    });
  }
  return client;
}
