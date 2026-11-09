import accountsJson from '../../../../db/accounts.json';
import budgetsJson from '../../../../db/budgets.json';
import cardsJson from '../../../../db/cards.json';
import payeesJson from '../../../../db/payees.json';
import transactionsJson from '../../../../db/transactions.json';
import usersJson from '../../../../db/users.json';

import type {
  Account,
  Budget,
  Card,
  Payee,
  TierInfo,
  Transaction,
  User,
  UserTier,
} from '../types';

/**
 * Module-scoped, mutable in-memory mirror of `db/*.json`.
 *
 * Loaded ONCE at module init from disk. All repository write methods mutate
 * THIS object — they do NOT write back to the JSON files. That is intentional:
 *
 *   - the JSON files are checked-in seed data and must not be churned
 *   - in the browser (and Expo Go) we have no filesystem to write to anyway
 *   - this gives the apps "session persistence" — writes stick until reload
 *
 * To get real persistence, swap the JSON repos for `SupabaseRepository`. See
 * `packages/core/src/repositories/factory.ts` and `supabase/README.md`.
 *
 * Object identity is stable for the lifetime of the module — the data.ts
 * legacy accessors and the JsonRepository share the same arrays.
 */
export const jsonStore: {
  users: User[];
  tiers: Record<UserTier, TierInfo>;
  accounts: Account[];
  transactions: Transaction[];
  cards: Card[];
  payees: Payee[];
  budgets: Budget[];
} = {
  users: (usersJson.users as unknown as User[]).map((u) => ({ ...u })),
  tiers: usersJson.tiers as unknown as Record<UserTier, TierInfo>,
  accounts: (accountsJson.accounts as unknown as Account[]).map((a) => ({
    ...a,
  })),
  transactions: (transactionsJson.transactions as unknown as Transaction[]).map(
    (t) => ({ ...t })
  ),
  cards: (cardsJson.cards as unknown as Card[]).map((c) => ({ ...c })),
  payees: (payeesJson.payees as unknown as Payee[]).map((p) => ({ ...p })),
  budgets: (budgetsJson.budgets as unknown as Budget[]).map((b) => ({
    ...b,
    categories: b.categories.map((c) => ({ ...c })),
    savingsGoals: b.savingsGoals.map((g) => ({ ...g })),
  })),
};

/**
 * Internal counter used to mint stable-ish IDs for entities inserted at
 * runtime via the JSON repositories. The format mirrors the existing JSON
 * fixtures (USR-XXX, ACC-XXX, etc.) so the app rendering doesn't see surprises.
 */
let idCounter = 1000;

export function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter.toString().padStart(4, '0')}`;
}
