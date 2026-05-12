import accountsJson from '../../../db/accounts.json';
import budgetsJson from '../../../db/budgets.json';
import cardsJson from '../../../db/cards.json';
import payeesJson from '../../../db/payees.json';
import transactionsJson from '../../../db/transactions.json';
import usersJson from '../../../db/users.json';

import type { Account, Budget, Card, Payee, TierInfo, Transaction, User, UserTier } from './types';

const users = usersJson.users as unknown as User[];
const tiers = usersJson.tiers as unknown as Record<UserTier, TierInfo>;
const accounts = accountsJson.accounts as unknown as Account[];
const transactions = transactionsJson.transactions as unknown as Transaction[];
const cards = cardsJson.cards as unknown as Card[];
const payees = payeesJson.payees as unknown as Payee[];
const budgets = budgetsJson.budgets as unknown as Budget[];

export function getAllUsers(): User[] {
  return users;
}

export function getUserById(userId: string): User | undefined {
  return users.find((u) => u.id === userId);
}

export function findUserByCredentials(username: string, password: string): User | undefined {
  const normalized = username.trim().toLowerCase();
  return users.find(
    (u) =>
      (u.username.toLowerCase() === normalized || u.email.toLowerCase() === normalized) &&
      u.password === password
  );
}

export function getTierInfo(tier: UserTier): TierInfo | undefined {
  return tiers[tier];
}

export function getAccountsForUser(userId: string): Account[] {
  return accounts.filter((a) => a.userId === userId);
}

export function getAccountById(accountId: string): Account | undefined {
  return accounts.find((a) => a.id === accountId);
}

export function getTotalBalanceForUser(userId: string): number {
  return getAccountsForUser(userId).reduce((sum, a) => sum + a.balance, 0);
}

export function getTransactionsForAccount(accountId: string): Transaction[] {
  return transactions
    .filter((t) => t.accountId === accountId)
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getTransactionsForUser(userId: string, limit?: number): Transaction[] {
  const sorted = transactions
    .filter((t) => t.userId === userId)
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
}

export function getCardsForUser(userId: string): Card[] {
  return cards.filter((c) => c.userId === userId);
}

export function getPayeesForUser(userId: string): Payee[] {
  return payees.filter((p) => p.userId === userId);
}

export function getBudgetsForUser(userId: string): Budget | undefined {
  return budgets.find((b) => b.userId === userId);
}
