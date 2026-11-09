import type { SupabaseClient } from '@supabase/supabase-js';

import type { Repositories } from '../repositories/types';
import { createSimulatedAuthProvider } from './simulated';
import { createSupabaseAuthProvider } from './supabase';
import type { AuthProvider } from './types';

export type AuthMode = 'simulated' | 'supabase';

export interface CreateAuthProviderOptions {
  mode: AuthMode;
  repos: Repositories;
  supabaseClient?: SupabaseClient;
}

/**
 * Returns the configured auth provider.
 *
 *   - `"simulated"` → JSON-backed auth. Delegates credential checks to the
 *                     UserRepository, accepts any 6-digit OTP, mints a fake
 *                     "simulated-jwt" session.
 *   - `"supabase"`  → real Supabase Auth. Requires a SupabaseClient.
 */
export function createAuthProvider(
  opts: CreateAuthProviderOptions
): AuthProvider {
  if (opts.mode === 'supabase') {
    if (!opts.supabaseClient) {
      throw new Error(
        'createAuthProvider({ mode: "supabase" }) requires a supabaseClient ' +
          '(pass a client created via createClient(SUPABASE_URL, SUPABASE_ANON_KEY))'
      );
    }
    return createSupabaseAuthProvider(opts.supabaseClient, opts.repos);
  }
  return createSimulatedAuthProvider(opts.repos);
}

export function resolveDefaultAuthMode(): AuthMode {
  const raw =
    typeof process !== 'undefined' && process.env
      ? process.env.GOLDLINK_AUTH_MODE
      : undefined;
  return raw === 'supabase' ? 'supabase' : 'simulated';
}
