import { describe, expect, it } from 'vitest';

import {
  createAuthProvider,
  createRepositories,
  resolveDefaultAuthMode,
  resolveDefaultMode,
} from '../index';

describe('createRepositories', () => {
  it('returns working JSON repositories in "json" mode', async () => {
    const repos = createRepositories({ mode: 'json' });
    const user = await repos.users.getById('USR-003');
    expect(user?.email).toBe('demo@bank.com');
  });

  it('throws in "supabase" mode when keys are missing', () => {
    expect(() => createRepositories({ mode: 'supabase' })).toThrow(
      /supabaseUrl/i
    );
    expect(() =>
      createRepositories({ mode: 'supabase', supabaseUrl: 'http://x' })
    ).toThrow(/supabaseAnonKey/i);
  });

  it('does not throw in "supabase" mode when both keys are present', () => {
    expect(() =>
      createRepositories({
        mode: 'supabase',
        supabaseUrl: 'https://example.supabase.co',
        supabaseAnonKey: 'dummy-anon-key',
      })
    ).not.toThrow();
  });
});

describe('createAuthProvider', () => {
  it('returns a working simulated provider', async () => {
    const repos = createRepositories({ mode: 'json' });
    const auth = createAuthProvider({ mode: 'simulated', repos });
    expect(await auth.verifyOtp({ code: '111111' })).toBe(true);
  });

  it('throws in "supabase" mode without a client', () => {
    const repos = createRepositories({ mode: 'json' });
    expect(() =>
      createAuthProvider({ mode: 'supabase', repos })
    ).toThrow(/supabaseClient/i);
  });
});

describe('resolveDefaultMode / resolveDefaultAuthMode', () => {
  it('defaults to json + simulated when env vars are unset', () => {
    delete process.env.GOLDLINK_DATA_MODE;
    delete process.env.GOLDLINK_AUTH_MODE;
    expect(resolveDefaultMode()).toBe('json');
    expect(resolveDefaultAuthMode()).toBe('simulated');
  });

  it('honors GOLDLINK_DATA_MODE=supabase', () => {
    process.env.GOLDLINK_DATA_MODE = 'supabase';
    expect(resolveDefaultMode()).toBe('supabase');
    delete process.env.GOLDLINK_DATA_MODE;
  });

  it('honors GOLDLINK_AUTH_MODE=supabase', () => {
    process.env.GOLDLINK_AUTH_MODE = 'supabase';
    expect(resolveDefaultAuthMode()).toBe('supabase');
    delete process.env.GOLDLINK_AUTH_MODE;
  });
});
