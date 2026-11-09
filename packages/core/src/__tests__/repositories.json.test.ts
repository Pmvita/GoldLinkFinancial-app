import { describe, expect, it } from 'vitest';

import { createJsonRepositories } from '../repositories/json';
import type { Budget, NewPayee, NewTransaction, NewUser } from '../index';

// USR-003 (demo@bank.com / John Smith) is a stable demo fixture in db/users.json.
const USER_ID = 'USR-003';

describe('JsonUserRepository', () => {
  it('returns the seeded demo user by id', async () => {
    const repos = createJsonRepositories();
    const user = await repos.users.getById(USER_ID);
    expect(user).not.toBeNull();
    expect(user?.email).toBe('demo@bank.com');
  });

  it('returns null for an unknown id', async () => {
    const repos = createJsonRepositories();
    expect(await repos.users.getById('USR-DOES-NOT-EXIST')).toBeNull();
  });

  it('finds the demo user by email + password', async () => {
    const repos = createJsonRepositories();
    const user = await repos.users.findByCredentials(
      'demo@bank.com',
      'demo123'
    );
    expect(user?.id).toBe(USER_ID);
  });

  it('returns null for bad credentials', async () => {
    const repos = createJsonRepositories();
    expect(
      await repos.users.findByCredentials('demo@bank.com', 'wrong')
    ).toBeNull();
  });

  it('returns platinum tier metadata via the user repo', async () => {
    const repos = createJsonRepositories();
    const tier = await repos.users.getTierInfo('platinum');
    expect(tier?.name).toBe('Platinum');
  });

  it('inserts a new user in memory and is then findable by id', async () => {
    const repos = createJsonRepositories();
    const input: NewUser = {
      username: 'unit.test',
      password: 'pw',
      firstName: 'Unit',
      lastName: 'Test',
      fullName: 'Unit Test',
      email: 'unit.test@example.com',
      phone: '+1 (555) 000-0001',
      tier: 'standard',
      tierName: 'Standard',
      relationshipManager: null,
      relationshipManagerPhone: null,
      memberSince: '2026-05-12',
      dateOfBirth: '1995-01-01',
      address: {
        street: '1 Test Way',
        city: 'Testville',
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
    const created = await repos.users.create(input);
    expect(created.id).toMatch(/^USR-/);
    expect(await repos.users.getById(created.id)).toEqual(created);
  });
});

describe('JsonAccountRepository', () => {
  it('returns the two seeded accounts for the demo user', async () => {
    const repos = createJsonRepositories();
    const accounts = await repos.accounts.getAllForUser(USER_ID);
    expect(accounts).toHaveLength(2);
  });

  it('sums total balance across all accounts for a user', async () => {
    const repos = createJsonRepositories();
    const accounts = await repos.accounts.getAllForUser(USER_ID);
    const expected = accounts.reduce((sum, a) => sum + a.balance, 0);
    expect(await repos.accounts.getTotalBalanceForUser(USER_ID)).toBeCloseTo(
      expected,
      2
    );
  });

  it('updateBalance mutates the in-memory balance', async () => {
    const repos = createJsonRepositories();
    const accounts = await repos.accounts.getAllForUser(USER_ID);
    const first = accounts[0];
    await repos.accounts.updateBalance(first.id, 1.23);
    const refreshed = await repos.accounts.getById(first.id);
    expect(refreshed?.balance).toBe(1.23);
  });

  it('updateBalance throws for unknown account ids', async () => {
    const repos = createJsonRepositories();
    await expect(
      repos.accounts.updateBalance('ACC-NOPE', 1)
    ).rejects.toThrow(/not found/i);
  });
});

describe('JsonTransactionRepository', () => {
  it('returns the seeded demo transactions newest-first', async () => {
    const repos = createJsonRepositories();
    const txns = await repos.transactions.getForUser(USER_ID);
    expect(txns).toHaveLength(5);
    for (let i = 1; i < txns.length; i += 1) {
      expect(new Date(txns[i - 1].date).getTime()).toBeGreaterThanOrEqual(
        new Date(txns[i].date).getTime()
      );
    }
  });

  it('honors the limit argument', async () => {
    const repos = createJsonRepositories();
    expect(await repos.transactions.getForUser(USER_ID, 2)).toHaveLength(2);
  });

  it('inserts a new transaction in memory', async () => {
    const repos = createJsonRepositories();
    const input: NewTransaction = {
      userId: USER_ID,
      accountId: 'ACC-003-CHK',
      cardId: null,
      type: 'debit',
      category: 'misc',
      merchant: 'Unit Test',
      description: 'Test',
      amount: -10,
      balance: 0,
      date: '2026-05-12T00:00:00Z',
      status: 'completed',
      location: null,
    };
    const before = (await repos.transactions.getForUser(USER_ID)).length;
    const created = await repos.transactions.create(input);
    expect(created.id).toMatch(/^TXN-/);
    expect((await repos.transactions.getForUser(USER_ID)).length).toBe(
      before + 1
    );
  });
});

describe('JsonCardRepository', () => {
  it('returns the two seeded cards for the demo user', async () => {
    const repos = createJsonRepositories();
    expect(await repos.cards.getForUser(USER_ID)).toHaveLength(2);
  });

  it('updateStatus mutates the in-memory card status', async () => {
    const repos = createJsonRepositories();
    const [card] = await repos.cards.getForUser(USER_ID);
    await repos.cards.updateStatus(card.id, 'frozen');
    const refreshed = (await repos.cards.getForUser(USER_ID)).find(
      (c) => c.id === card.id
    );
    expect(refreshed?.status).toBe('frozen');
  });
});

describe('JsonPayeeRepository', () => {
  it('returns the four seeded payees for the demo user', async () => {
    const repos = createJsonRepositories();
    expect(await repos.payees.getForUser(USER_ID)).toHaveLength(4);
  });

  it('inserts a new payee in memory', async () => {
    const repos = createJsonRepositories();
    const input: NewPayee = {
      userId: USER_ID,
      name: 'Test Payee',
      accountNumber: 'TP-001',
      category: 'utilities',
      defaultAmount: 12.34,
      recurringPayment: {
        enabled: false,
        frequency: 'monthly',
        dayOfMonth: 1,
        nextDue: '2026-06-01',
      },
      lastPayment: { amount: 0, date: '2026-05-01' },
    };
    const created = await repos.payees.create(input);
    expect(created.id).toMatch(/^PAY-/);
    expect((await repos.payees.getForUser(USER_ID)).length).toBe(5);
  });
});

describe('JsonBudgetRepository', () => {
  it('returns a single budget scoped to the demo user', async () => {
    const repos = createJsonRepositories();
    const budget = await repos.budgets.getForUser(USER_ID);
    expect(budget?.userId).toBe(USER_ID);
    expect(budget?.categories.length).toBeGreaterThan(0);
  });

  it('upsert overwrites the in-memory budget for the user', async () => {
    const repos = createJsonRepositories();
    const next: Budget = {
      userId: USER_ID,
      monthlyBudget: 9999,
      categories: [
        { name: 'Tests', budget: 100, spent: 0, color: '#000000' },
      ],
      savingsGoals: [],
    };
    const result = await repos.budgets.upsert(next);
    expect(result.monthlyBudget).toBe(9999);
    const refreshed = await repos.budgets.getForUser(USER_ID);
    expect(refreshed?.monthlyBudget).toBe(9999);
    expect(refreshed?.categories).toHaveLength(1);
  });

  it('upsert inserts a new budget for a previously unseen user', async () => {
    const repos = createJsonRepositories();
    const next: Budget = {
      userId: 'USR-NEW-001',
      monthlyBudget: 1234,
      categories: [],
      savingsGoals: [],
    };
    await repos.budgets.upsert(next);
    const refreshed = await repos.budgets.getForUser('USR-NEW-001');
    expect(refreshed?.monthlyBudget).toBe(1234);
  });
});
