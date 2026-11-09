import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type {
  Account,
  Budget,
  Card,
  CardStatus,
  Payee,
  TierInfo,
  Transaction,
  User,
  UserTier,
} from '../types';
import {
  payeeToInsert,
  rowToAccount,
  rowToBudget,
  rowToCard,
  rowToPayee,
  rowToTier,
  rowToTransaction,
  rowToUser,
  transactionToInsert,
  userToInsert,
  type AccountRow,
  type BudgetCategoryRow,
  type BudgetRow,
  type CardRow,
  type PayeeRow,
  type SavingsGoalRow,
  type TierRow,
  type TransactionRow,
  type UserRow,
} from './mappers';
import type {
  AccountRepository,
  BudgetRepository,
  CardRepository,
  NewPayee,
  NewTransaction,
  NewUser,
  PayeeRepository,
  Repositories,
  TransactionRepository,
  UserRepository,
} from './types';

/**
 * Supabase-backed repository implementations.
 *
 * These compile and are wired into `createRepositories({ mode: "supabase" })`
 * but have not been exercised against a running Supabase instance — the
 * project's first-class data store is still the JSON fixtures at `db/*.json`.
 *
 * Flip the apps onto these by running `pnpm db:setup` to start a local
 * Supabase stack and setting `GOLDLINK_DATA_MODE=supabase` (plus
 * `SUPABASE_URL` and `SUPABASE_ANON_KEY`) in `.env.local`. See
 * `supabase/README.md` for the full playbook.
 */
function unwrap<T>(data: T | null, error: { message: string } | null): T {
  if (error) {
    throw new Error(`Supabase: ${error.message}`);
  }
  if (data === null) {
    throw new Error('Supabase: empty response with no error');
  }
  return data;
}

class SupabaseUserRepository implements UserRepository {
  constructor(private readonly client: SupabaseClient) {}

  async getAll(): Promise<User[]> {
    const { data, error } = await this.client.from('users').select('*');
    return unwrap(data, error).map((row) => rowToUser(row as UserRow));
  }

  async getById(id: string): Promise<User | null> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(`Supabase: ${error.message}`);
    return data ? rowToUser(data as UserRow) : null;
  }

  async findByCredentials(
    usernameOrEmail: string,
    password: string
  ): Promise<User | null> {
    // NOTE: Once Supabase Auth is the source of truth for credentials, this
    // method becomes a lookup-by-id call (using auth.uid()) rather than a
    // password comparison. Kept here so the JSON and Supabase repos satisfy
    // the same interface during the migration.
    const normalized = usernameOrEmail.trim().toLowerCase();
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .or(`username.ilike.${normalized},email.ilike.${normalized}`)
      .eq('password', password)
      .maybeSingle();
    if (error) throw new Error(`Supabase: ${error.message}`);
    return data ? rowToUser(data as UserRow) : null;
  }

  async create(input: NewUser): Promise<User> {
    const { data, error } = await this.client
      .from('users')
      .insert(userToInsert(input))
      .select('*')
      .single();
    return rowToUser(unwrap(data, error) as UserRow);
  }

  async getTierInfo(tier: UserTier): Promise<TierInfo | null> {
    const { data, error } = await this.client
      .from('tiers')
      .select('*')
      .eq('tier', tier)
      .maybeSingle();
    if (error) throw new Error(`Supabase: ${error.message}`);
    return data ? rowToTier(data as TierRow) : null;
  }
}

class SupabaseAccountRepository implements AccountRepository {
  constructor(private readonly client: SupabaseClient) {}

  async getAllForUser(userId: string): Promise<Account[]> {
    const { data, error } = await this.client
      .from('accounts')
      .select('*')
      .eq('user_id', userId);
    return unwrap(data, error).map((row) => rowToAccount(row as AccountRow));
  }

  async getById(id: string): Promise<Account | null> {
    const { data, error } = await this.client
      .from('accounts')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(`Supabase: ${error.message}`);
    return data ? rowToAccount(data as AccountRow) : null;
  }

  async updateBalance(id: string, newBalance: number): Promise<void> {
    const { error } = await this.client
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', id);
    if (error) throw new Error(`Supabase: ${error.message}`);
  }

  async getTotalBalanceForUser(userId: string): Promise<number> {
    const accounts = await this.getAllForUser(userId);
    return accounts.reduce((sum, a) => sum + a.balance, 0);
  }
}

class SupabaseTransactionRepository implements TransactionRepository {
  constructor(private readonly client: SupabaseClient) {}

  async getForAccount(accountId: string): Promise<Transaction[]> {
    const { data, error } = await this.client
      .from('transactions')
      .select('*')
      .eq('account_id', accountId)
      .order('date', { ascending: false });
    return unwrap(data, error).map((row) =>
      rowToTransaction(row as TransactionRow)
    );
  }

  async getForUser(userId: string, limit?: number): Promise<Transaction[]> {
    let query = this.client
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    if (typeof limit === 'number') {
      query = query.limit(limit);
    }
    const { data, error } = await query;
    return unwrap(data, error).map((row) =>
      rowToTransaction(row as TransactionRow)
    );
  }

  async create(input: NewTransaction): Promise<Transaction> {
    const { data, error } = await this.client
      .from('transactions')
      .insert(transactionToInsert(input))
      .select('*')
      .single();
    return rowToTransaction(unwrap(data, error) as TransactionRow);
  }
}

class SupabaseCardRepository implements CardRepository {
  constructor(private readonly client: SupabaseClient) {}

  async getForUser(userId: string): Promise<Card[]> {
    const { data, error } = await this.client
      .from('cards')
      .select('*')
      .eq('user_id', userId);
    return unwrap(data, error).map((row) => rowToCard(row as CardRow));
  }

  async updateStatus(id: string, status: CardStatus): Promise<void> {
    const { error } = await this.client
      .from('cards')
      .update({ status })
      .eq('id', id);
    if (error) throw new Error(`Supabase: ${error.message}`);
  }
}

class SupabasePayeeRepository implements PayeeRepository {
  constructor(private readonly client: SupabaseClient) {}

  async getForUser(userId: string): Promise<Payee[]> {
    const { data, error } = await this.client
      .from('payees')
      .select('*')
      .eq('user_id', userId);
    return unwrap(data, error).map((row) => rowToPayee(row as PayeeRow));
  }

  async create(input: NewPayee): Promise<Payee> {
    const { data, error } = await this.client
      .from('payees')
      .insert(payeeToInsert(input))
      .select('*')
      .single();
    return rowToPayee(unwrap(data, error) as PayeeRow);
  }
}

class SupabaseBudgetRepository implements BudgetRepository {
  constructor(private readonly client: SupabaseClient) {}

  async getForUser(userId: string): Promise<Budget | null> {
    const { data: budget, error: budgetErr } = await this.client
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (budgetErr) throw new Error(`Supabase: ${budgetErr.message}`);
    if (!budget) return null;
    const row = budget as BudgetRow;

    const [categoriesRes, goalsRes] = await Promise.all([
      this.client
        .from('budget_categories')
        .select('*')
        .eq('budget_id', row.id),
      this.client.from('savings_goals').select('*').eq('budget_id', row.id),
    ]);
    if (categoriesRes.error)
      throw new Error(`Supabase: ${categoriesRes.error.message}`);
    if (goalsRes.error)
      throw new Error(`Supabase: ${goalsRes.error.message}`);

    return rowToBudget(
      row,
      (categoriesRes.data ?? []) as BudgetCategoryRow[],
      (goalsRes.data ?? []) as SavingsGoalRow[]
    );
  }

  async upsert(input: Budget): Promise<Budget> {
    const { data: budget, error: budgetErr } = await this.client
      .from('budgets')
      .upsert(
        { user_id: input.userId, monthly_budget: input.monthlyBudget },
        { onConflict: 'user_id' }
      )
      .select('*')
      .single();
    if (budgetErr) throw new Error(`Supabase: ${budgetErr.message}`);
    const row = budget as BudgetRow;

    await this.client
      .from('budget_categories')
      .delete()
      .eq('budget_id', row.id);
    await this.client.from('savings_goals').delete().eq('budget_id', row.id);

    if (input.categories.length > 0) {
      const { error } = await this.client.from('budget_categories').insert(
        input.categories.map((c) => ({
          budget_id: row.id,
          name: c.name,
          budget: c.budget,
          spent: c.spent,
          color: c.color,
        }))
      );
      if (error) throw new Error(`Supabase: ${error.message}`);
    }

    if (input.savingsGoals.length > 0) {
      const { error } = await this.client.from('savings_goals').insert(
        input.savingsGoals.map((g) => ({
          budget_id: row.id,
          name: g.name,
          target: g.target,
          current: g.current,
          color: g.color,
        }))
      );
      if (error) throw new Error(`Supabase: ${error.message}`);
    }

    const refreshed = await this.getForUser(input.userId);
    if (!refreshed) {
      throw new Error(
        `Budget upsert succeeded but lookup for ${input.userId} returned null`
      );
    }
    return refreshed;
  }
}

export function createSupabaseRepositories(
  supabaseUrl: string,
  supabaseAnonKey: string
): Repositories {
  const client = createClient(supabaseUrl, supabaseAnonKey);
  return createSupabaseRepositoriesFromClient(client);
}

export function createSupabaseRepositoriesFromClient(
  client: SupabaseClient
): Repositories {
  return {
    users: new SupabaseUserRepository(client),
    accounts: new SupabaseAccountRepository(client),
    transactions: new SupabaseTransactionRepository(client),
    cards: new SupabaseCardRepository(client),
    payees: new SupabasePayeeRepository(client),
    budgets: new SupabaseBudgetRepository(client),
  };
}
