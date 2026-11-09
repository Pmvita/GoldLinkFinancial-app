import { createJsonRepositories } from './json';
import { createSupabaseRepositories } from './supabase';
import type { Repositories } from './types';

export type RepositoryMode = 'json' | 'supabase';

export interface CreateRepositoriesOptions {
  mode: RepositoryMode;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

/**
 * Returns the configured repository implementations.
 *
 *   - `"json"`    → reads from `db/*.json`, writes go to an in-memory layer
 *                   that is lost on reload. Default for development.
 *   - `"supabase"` → reads/writes against a live Supabase project. Requires
 *                   both `supabaseUrl` and `supabaseAnonKey` to be set;
 *                   throws otherwise.
 */
export function createRepositories(
  opts: CreateRepositoriesOptions
): Repositories {
  if (opts.mode === 'supabase') {
    if (!opts.supabaseUrl || !opts.supabaseAnonKey) {
      throw new Error(
        'createRepositories({ mode: "supabase" }) requires both ' +
          'supabaseUrl and supabaseAnonKey. Set SUPABASE_URL and ' +
          'SUPABASE_ANON_KEY in your environment, or pass them explicitly.'
      );
    }
    return createSupabaseRepositories(opts.supabaseUrl, opts.supabaseAnonKey);
  }
  return createJsonRepositories();
}

/**
 * Resolves the default mode from the `GOLDLINK_DATA_MODE` env var. Anything
 * other than `"supabase"` (including unset) falls back to `"json"`.
 *
 * Both Vite (`import.meta.env.VITE_*`) and Expo (`process.env.EXPO_PUBLIC_*`)
 * have their own conventions for exposing env vars to client code; the apps
 * are expected to pick the appropriate one and forward it into this function
 * explicitly. We only read `process.env` directly because Node-side scripts
 * (tests, seed regeneration) can use it freely.
 */
export function resolveDefaultMode(): RepositoryMode {
  const raw =
    typeof process !== 'undefined' && process.env
      ? process.env.GOLDLINK_DATA_MODE
      : undefined;
  return raw === 'supabase' ? 'supabase' : 'json';
}
