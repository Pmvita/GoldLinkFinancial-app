import { describe, expect, it } from 'vitest';

import { createSimulatedAuthProvider } from '../auth/simulated';
import { createJsonRepositories } from '../repositories/json';
import type { NewUser } from '../index';

const USER_ID = 'USR-003';

describe('SimulatedAuthProvider', () => {
  it('signInWithPassword returns a session for valid credentials', async () => {
    const repos = createJsonRepositories();
    const auth = createSimulatedAuthProvider(repos);
    const result = await auth.signInWithPassword({
      email: 'demo@bank.com',
      password: 'demo123',
    });
    expect(result.user.id).toBe(USER_ID);
    expect(result.session.userId).toBe(USER_ID);
    expect(result.session.accessToken).toBe('simulated-jwt');
    expect(typeof result.session.expiresAt).toBe('string');
  });

  it('signInWithPassword throws for invalid credentials', async () => {
    const repos = createJsonRepositories();
    const auth = createSimulatedAuthProvider(repos);
    await expect(
      auth.signInWithPassword({
        email: 'demo@bank.com',
        password: 'wrong',
      })
    ).rejects.toThrow(/invalid email or password/i);
  });

  it('verifyOtp returns true for a 6-digit numeric code', async () => {
    const repos = createJsonRepositories();
    const auth = createSimulatedAuthProvider(repos);
    expect(await auth.verifyOtp({ code: '123456' })).toBe(true);
    expect(await auth.verifyOtp({ code: ' 654321 ' })).toBe(true);
  });

  it('verifyOtp returns false for non-numeric or wrong-length codes', async () => {
    const repos = createJsonRepositories();
    const auth = createSimulatedAuthProvider(repos);
    expect(await auth.verifyOtp({ code: 'abc' })).toBe(false);
    expect(await auth.verifyOtp({ code: '12345' })).toBe(false);
    expect(await auth.verifyOtp({ code: '1234567' })).toBe(false);
    expect(await auth.verifyOtp({ code: 'abc123' })).toBe(false);
  });

  it('getCurrentSession reflects sign-in / sign-out', async () => {
    const repos = createJsonRepositories();
    const auth = createSimulatedAuthProvider(repos);
    expect(await auth.getCurrentSession()).toBeNull();
    await auth.signInWithPassword({
      email: 'demo@bank.com',
      password: 'demo123',
    });
    expect((await auth.getCurrentSession())?.userId).toBe(USER_ID);
    await auth.signOut();
    expect(await auth.getCurrentSession()).toBeNull();
  });

  it('signUp persists the new user via the user repo and mints a session', async () => {
    const repos = createJsonRepositories();
    const auth = createSimulatedAuthProvider(repos);
    const input: NewUser & { password: string } = {
      username: 'newbie',
      password: 'hunter2',
      firstName: 'New',
      lastName: 'Bie',
      fullName: 'New Bie',
      email: 'newbie@example.com',
      phone: '+1 (555) 999-9999',
      tier: 'standard',
      tierName: 'Standard',
      relationshipManager: null,
      relationshipManagerPhone: null,
      memberSince: '2026-05-12',
      dateOfBirth: '2000-01-01',
      address: {
        street: '1 Newbie Ln',
        city: 'Town',
        state: 'NY',
        zipCode: '00000',
        country: 'USA',
      },
      preferences: {
        biometricEnabled: false,
        twoFactorEnabled: false,
        notifications: {
          largePurchases: false,
          allPurchases: false,
          deposits: false,
          lowBalance: false,
          billReminders: false,
          budgetAlerts: false,
          loginAlerts: false,
          passwordChanges: false,
          suspicious: false,
        },
      },
      lastLogin: '2026-05-12T00:00:00Z',
    };
    const { user, session } = await auth.signUp(input);
    expect(user.email).toBe('newbie@example.com');
    expect(session.userId).toBe(user.id);
    expect(await repos.users.getById(user.id)).toEqual(user);
  });
});
