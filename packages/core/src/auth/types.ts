import type { User } from '../types';
import type { NewUser } from '../repositories/types';

export interface AuthSession {
  userId: string;
  accessToken?: string;
  expiresAt?: string;
}

export interface SignInResult {
  user: User;
  session: AuthSession;
}

export interface AuthProvider {
  signInWithPassword(input: {
    email: string;
    password: string;
  }): Promise<SignInResult>;
  signUp(input: NewUser & { password: string }): Promise<SignInResult>;
  sendOtp(input: { phone?: string; email?: string }): Promise<void>;
  verifyOtp(input: { code: string }): Promise<boolean>;
  signOut(): Promise<void>;
  getCurrentSession(): Promise<AuthSession | null>;
}
