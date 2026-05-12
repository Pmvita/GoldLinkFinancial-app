import { describe, expect, it } from 'vitest';

import {
  findUserByCredentials,
  getAccountsForUser,
  getBudgetsForUser,
  getCardsForUser,
  getPayeesForUser,
  getTierInfo,
  getTotalBalanceForUser,
  getTransactionsForUser,
  getUserById,
} from '../data';

// USR-003 (demo@bank.com / John Smith) is a stable demo fixture in db/users.json.
const USER_ID = 'USR-003';

describe('user lookups', () => {
  it('returns the seeded demo user by id', () => {
    const user = getUserById(USER_ID);
    expect(user).toBeDefined();
    expect(user?.email).toBe('demo@bank.com');
    expect(user?.tier).toBe('platinum');
  });

  it('finds the demo user by email + password credentials', () => {
    const user = findUserByCredentials('demo@bank.com', 'demo123');
    expect(user?.id).toBe(USER_ID);
  });

  it('returns undefined for bad credentials', () => {
    expect(findUserByCredentials('demo@bank.com', 'wrong')).toBeUndefined();
  });
});

describe('tier metadata', () => {
  it('looks up the platinum tier info', () => {
    const tier = getTierInfo('platinum');
    expect(tier).toBeDefined();
    expect(tier?.name).toBe('Platinum');
  });
});

describe('per-user accessors', () => {
  it('returns the expected number of accounts, cards, transactions, and payees', () => {
    expect(getAccountsForUser(USER_ID)).toHaveLength(2);
    expect(getCardsForUser(USER_ID)).toHaveLength(2);
    expect(getTransactionsForUser(USER_ID)).toHaveLength(5);
    expect(getPayeesForUser(USER_ID)).toHaveLength(4);
  });

  it('returns a single budget object scoped to the user', () => {
    const budget = getBudgetsForUser(USER_ID);
    expect(budget).toBeDefined();
    expect(budget?.userId).toBe(USER_ID);
    expect(budget?.categories.length).toBeGreaterThan(0);
  });

  it('honors the transaction limit argument', () => {
    expect(getTransactionsForUser(USER_ID, 2)).toHaveLength(2);
  });

  it("sums total balance across all of a user's accounts", () => {
    const accounts = getAccountsForUser(USER_ID);
    const expected = accounts.reduce((sum, a) => sum + a.balance, 0);
    expect(getTotalBalanceForUser(USER_ID)).toBeCloseTo(expected, 2);
  });

  it('returns empty collections for an unknown user', () => {
    expect(getAccountsForUser('USR-DOES-NOT-EXIST')).toHaveLength(0);
    expect(getTransactionsForUser('USR-DOES-NOT-EXIST')).toHaveLength(0);
  });
});
