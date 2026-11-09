/**
 * Legacy synchronous data accessors.
 *
 * These exist purely for backwards compatibility with `apps/web` and
 * `apps/mobile` components that import named functions from `@goldlink/core`.
 * They are thin wrappers over the shared in-memory `jsonStore` (the same
 * store `JsonRepository` reads from). Consumers should migrate to the
 * Repositories interface for any new code:
 *
 *     import { createRepositories } from "@goldlink/core";
 *     const repos = createRepositories({ mode: "json" });
 *     const accounts = await repos.accounts.getAllForUser(user.id);
 *
 * The legacy API remains synchronous so existing callers don't need to be
 * threaded through `await`. Mutation methods are intentionally absent here —
 * use the repositories for writes.
 */
import { jsonStore } from './repositories/jsonStore';
import type {
  Account,
  Budget,
  Card,
  Payee,
  TierInfo,
  Transaction,
  User,
  UserTier,
} from './types';

export function getAllUsers(): User[] {
  return jsonStore.users;
}

export function getUserById(userId: string): User | undefined {
  return jsonStore.users.find((u) => u.id === userId);
}

export function findUserByCredentials(
  username: string,
  password: string
): User | undefined {
  const normalized = username.trim().toLowerCase();
  return jsonStore.users.find(
    (u) =>
      (u.username.toLowerCase() === normalized ||
        u.email.toLowerCase() === normalized) &&
      u.password === password
  );
}

export function getTierInfo(tier: UserTier): TierInfo | undefined {
  return jsonStore.tiers[tier];
}

export function getAccountsForUser(userId: string): Account[] {
  return jsonStore.accounts.filter((a) => a.userId === userId);
}

export function getAccountById(accountId: string): Account | undefined {
  return jsonStore.accounts.find((a) => a.id === accountId);
}

export function getTotalBalanceForUser(userId: string): number {
  return getAccountsForUser(userId).reduce((sum, a) => sum + a.balance, 0);
}

export function getTransactionsForAccount(accountId: string): Transaction[] {
  return jsonStore.transactions
    .filter((t) => t.accountId === accountId)
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getTransactionsForUser(
  userId: string,
  limit?: number
): Transaction[] {
  const sorted = jsonStore.transactions
    .filter((t) => t.userId === userId)
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
}

export function getCardsForUser(userId: string): Card[] {
  return jsonStore.cards.filter((c) => c.userId === userId);
}

export function getPayeesForUser(userId: string): Payee[] {
  return jsonStore.payees.filter((p) => p.userId === userId);
}

export function getBudgetsForUser(userId: string): Budget | undefined {
  return jsonStore.budgets.find((b) => b.userId === userId);
}
