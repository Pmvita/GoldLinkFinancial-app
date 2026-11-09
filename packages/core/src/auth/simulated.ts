import type { Repositories } from '../repositories/types';
import type { AuthProvider, AuthSession, SignInResult } from './types';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const OTP_REGEX = /^\d{6}$/;
const SIMULATED_OTP_DELAY_MS = 200;

/**
 * Simulated auth provider used while the app is still backed by JSON
 * fixtures. It defers credential lookups to the `UserRepository` so any
 * "fake user" added at runtime still works for the rest of the session.
 *
 * Notable behaviour:
 *   - `sendOtp` resolves after a short delay; no code is generated.
 *   - `verifyOtp` accepts any 6-digit numeric string (matches the existing
 *     web/mobile UX where the 2FA step is cosmetic).
 *   - Session state lives in memory; there is no token persistence.
 */
export class SimulatedAuthProvider implements AuthProvider {
  private currentSession: AuthSession | null = null;

  constructor(private readonly repos: Repositories) {}

  async signInWithPassword(input: {
    email: string;
    password: string;
  }): Promise<SignInResult> {
    const user = await this.repos.users.findByCredentials(
      input.email,
      input.password
    );
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const session = this.buildSession(user.id);
    this.currentSession = session;
    return { user, session };
  }

  async signUp(input: Parameters<AuthProvider['signUp']>[0]): Promise<SignInResult> {
    const user = await this.repos.users.create(input);
    const session = this.buildSession(user.id);
    this.currentSession = session;
    return { user, session };
  }

  async sendOtp(_input: { phone?: string; email?: string }): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_OTP_DELAY_MS));
  }

  async verifyOtp(input: { code: string }): Promise<boolean> {
    return OTP_REGEX.test(input.code.trim());
  }

  async signOut(): Promise<void> {
    this.currentSession = null;
  }

  async getCurrentSession(): Promise<AuthSession | null> {
    return this.currentSession;
  }

  private buildSession(userId: string): AuthSession {
    return {
      userId,
      accessToken: 'simulated-jwt',
      expiresAt: new Date(Date.now() + SEVEN_DAYS_MS).toISOString(),
    };
  }
}

export function createSimulatedAuthProvider(
  repos: Repositories
): AuthProvider {
  return new SimulatedAuthProvider(repos);
}
