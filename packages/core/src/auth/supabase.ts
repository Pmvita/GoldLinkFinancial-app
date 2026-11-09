import type { SupabaseClient } from '@supabase/supabase-js';

import type { Repositories } from '../repositories/types';
import type { AuthProvider, AuthSession, SignInResult } from './types';

/**
 * Supabase Auth provider.
 *
 * Wraps `supabase.auth.*` and maps the returned Supabase user objects to our
 * domain `User` via the configured `UserRepository`. This is a compiling stub:
 * it has not been exercised against a live Supabase project yet. When the
 * apps flip from JSON to Supabase, every method here will need real
 * end-to-end testing (see `docs/supabase.md`).
 */
export class SupabaseAuthProvider implements AuthProvider {
  constructor(
    private readonly client: SupabaseClient,
    private readonly repos: Repositories
  ) {}

  async signInWithPassword(input: {
    email: string;
    password: string;
  }): Promise<SignInResult> {
    const { data, error } = await this.client.auth.signInWithPassword(input);
    if (error || !data.session || !data.user) {
      throw new Error(error?.message ?? 'Supabase sign-in failed');
    }
    const user = await this.repos.users.getById(data.user.id);
    if (!user) {
      throw new Error(
        `Supabase auth user ${data.user.id} has no matching row in public.users`
      );
    }
    return {
      user,
      session: this.mapSession(data.session),
    };
  }

  async signUp(
    input: Parameters<AuthProvider['signUp']>[0]
  ): Promise<SignInResult> {
    const { data, error } = await this.client.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          username: input.username,
          full_name: input.fullName,
        },
      },
    });
    if (error || !data.user) {
      throw new Error(error?.message ?? 'Supabase sign-up failed');
    }

    const user = await this.repos.users.create(input);

    if (!data.session) {
      // Email confirmation flow — Supabase sent a verification email and the
      // caller still has no session. Surface that to the UI explicitly.
      throw new Error(
        'Supabase sign-up succeeded but no session was returned (email confirmation may be required)'
      );
    }

    return {
      user,
      session: this.mapSession(data.session),
    };
  }

  async sendOtp(input: { phone?: string; email?: string }): Promise<void> {
    if (input.email) {
      const { error } = await this.client.auth.signInWithOtp({
        email: input.email,
      });
      if (error) throw new Error(error.message);
      return;
    }
    if (input.phone) {
      const { error } = await this.client.auth.signInWithOtp({
        phone: input.phone,
      });
      if (error) throw new Error(error.message);
      return;
    }
    throw new Error('sendOtp requires either email or phone');
  }

  async verifyOtp(input: { code: string }): Promise<boolean> {
    // Supabase's verifyOtp requires the email/phone the code was issued for.
    // Until the calling UI is wired up to thread that through, we treat this
    // as an interface stub: a real impl will need (token, type, email|phone).
    void input;
    throw new Error(
      'SupabaseAuthProvider.verifyOtp needs the email/phone the code was issued for — extend the AuthProvider interface before wiring this up'
    );
  }

  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async getCurrentSession(): Promise<AuthSession | null> {
    const { data, error } = await this.client.auth.getSession();
    if (error) throw new Error(error.message);
    return data.session ? this.mapSession(data.session) : null;
  }

  private mapSession(session: {
    access_token: string;
    expires_at?: number;
    user: { id: string };
  }): AuthSession {
    return {
      userId: session.user.id,
      accessToken: session.access_token,
      expiresAt:
        typeof session.expires_at === 'number'
          ? new Date(session.expires_at * 1000).toISOString()
          : undefined,
    };
  }
}

export function createSupabaseAuthProvider(
  client: SupabaseClient,
  repos: Repositories
): AuthProvider {
  return new SupabaseAuthProvider(client, repos);
}
