/**
 * Row <-> domain entity mappers for the Supabase backend.
 *
 * Postgres conventionally uses snake_case column names; our domain types use
 * camelCase. These helpers keep that conversion in one place so the repo
 * implementations read like data flow rather than naming gymnastics.
 *
 * NOTE: This module is type-only at the schema layer. The actual Supabase
 * tables are defined in `supabase/migrations/*_initial_schema.sql`.
 */
import type {
  Account,
  AccountStatus,
  AccountType,
  Budget,
  BudgetCategory,
  Card,
  CardStatus,
  CardType,
  Payee,
  PayeeLastPayment,
  PayeeRecurringPayment,
  SavingsGoal,
  TierInfo,
  Transaction,
  TransactionStatus,
  TransactionType,
  User,
  UserAddress,
  UserPreferences,
  UserTier,
} from '../types';

// ---- row types ---------------------------------------------------------

export interface UserRow {
  id: string;
  username: string;
  password: string | null;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  tier: UserTier;
  tier_name: string;
  relationship_manager: string | null;
  relationship_manager_phone: string | null;
  member_since: string;
  date_of_birth: string;
  address: UserAddress;
  preferences: UserPreferences;
  last_login: string;
}

export interface TierRow {
  tier: UserTier;
  name: string;
  min_balance: string | number;
  max_balance: string | number | null;
  benefits: string[];
  fees: { monthlyMaintenance: number; wireTransfer: number; overdraft: number };
}

export interface AccountRow {
  id: string;
  user_id: string;
  account_number: string;
  routing_number: string;
  type: AccountType;
  name: string;
  balance: string | number;
  currency: string;
  status: AccountStatus;
  opened_date: string;
  interest_rate: string | number | null;
}

export interface TransactionRow {
  id: string;
  user_id: string;
  account_id: string;
  card_id: string | null;
  type: TransactionType;
  category: string;
  merchant: string;
  description: string;
  amount: string | number;
  balance: string | number;
  date: string;
  status: TransactionStatus;
  location: string | null;
}

export interface CardRow {
  id: string;
  user_id: string;
  account_id: string;
  card_number: string;
  last_four: string;
  type: CardType;
  network: string;
  name: string;
  status: CardStatus;
  expiry_date: string;
  cvv: string;
  credit_limit: string | number | null;
  balance: string | number | null;
  available_credit: string | number | null;
  rewards_points: number | null;
  issued_date: string;
  billing_cycle: number | null;
  next_payment_due: string | null;
  minimum_payment: string | number | null;
}

export interface PayeeRow {
  id: string;
  user_id: string;
  name: string;
  account_number: string;
  category: string;
  default_amount: string | number;
  recurring_payment: PayeeRecurringPayment;
  last_payment: PayeeLastPayment;
}

export interface BudgetRow {
  id: string;
  user_id: string;
  monthly_budget: string | number;
}

export interface BudgetCategoryRow {
  id: string;
  budget_id: string;
  name: string;
  budget: string | number;
  spent: string | number;
  color: string;
}

export interface SavingsGoalRow {
  id: string;
  budget_id: string;
  name: string;
  target: string | number;
  current: string | number;
  color: string;
}

// ---- helpers -----------------------------------------------------------

const num = (v: string | number | null | undefined): number => {
  if (v === null || v === undefined) return 0;
  return typeof v === 'string' ? Number.parseFloat(v) : v;
};
const numOrNull = (v: string | number | null | undefined): number | null => {
  if (v === null || v === undefined) return null;
  return typeof v === 'string' ? Number.parseFloat(v) : v;
};

// ---- row -> domain -----------------------------------------------------

export function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    username: row.username,
    password: row.password ?? '',
    firstName: row.first_name,
    lastName: row.last_name,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    tier: row.tier,
    tierName: row.tier_name,
    relationshipManager: row.relationship_manager,
    relationshipManagerPhone: row.relationship_manager_phone,
    memberSince: row.member_since,
    dateOfBirth: row.date_of_birth,
    address: row.address,
    preferences: row.preferences,
    lastLogin: row.last_login,
  };
}

export function rowToTier(row: TierRow): TierInfo {
  return {
    name: row.name,
    minBalance: num(row.min_balance),
    maxBalance: row.max_balance == null ? null : num(row.max_balance),
    benefits: row.benefits,
    fees: row.fees,
  };
}

export function rowToAccount(row: AccountRow): Account {
  return {
    id: row.id,
    userId: row.user_id,
    accountNumber: row.account_number,
    routingNumber: row.routing_number,
    type: row.type,
    name: row.name,
    balance: num(row.balance),
    currency: row.currency,
    status: row.status,
    openedDate: row.opened_date,
    interestRate: numOrNull(row.interest_rate),
  };
}

export function rowToTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    userId: row.user_id,
    accountId: row.account_id,
    cardId: row.card_id,
    type: row.type,
    category: row.category,
    merchant: row.merchant,
    description: row.description,
    amount: num(row.amount),
    balance: num(row.balance),
    date: row.date,
    status: row.status,
    location: row.location,
  };
}

export function rowToCard(row: CardRow): Card {
  return {
    id: row.id,
    userId: row.user_id,
    accountId: row.account_id,
    cardNumber: row.card_number,
    lastFour: row.last_four,
    type: row.type,
    network: row.network,
    name: row.name,
    status: row.status,
    expiryDate: row.expiry_date,
    cvv: row.cvv,
    creditLimit: numOrNull(row.credit_limit),
    balance: numOrNull(row.balance),
    availableCredit: numOrNull(row.available_credit),
    rewardsPoints: row.rewards_points,
    issuedDate: row.issued_date,
    billingCycle: row.billing_cycle,
    nextPaymentDue: row.next_payment_due,
    minimumPayment: numOrNull(row.minimum_payment),
  };
}

export function rowToPayee(row: PayeeRow): Payee {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    accountNumber: row.account_number,
    category: row.category,
    defaultAmount: num(row.default_amount),
    recurringPayment: row.recurring_payment,
    lastPayment: row.last_payment,
  };
}

export function rowToBudget(
  row: BudgetRow,
  categories: BudgetCategoryRow[],
  goals: SavingsGoalRow[]
): Budget {
  return {
    userId: row.user_id,
    monthlyBudget: num(row.monthly_budget),
    categories: categories.map<BudgetCategory>((c) => ({
      name: c.name,
      budget: num(c.budget),
      spent: num(c.spent),
      color: c.color,
    })),
    savingsGoals: goals.map<SavingsGoal>((g) => ({
      id: g.id,
      name: g.name,
      target: num(g.target),
      current: num(g.current),
      color: g.color,
    })),
  };
}

// ---- domain -> row (inserts) -------------------------------------------

export function userToInsert(
  user: Omit<User, 'id'>
): Omit<UserRow, 'id'> & { password: string | null } {
  return {
    username: user.username,
    password: user.password,
    first_name: user.firstName,
    last_name: user.lastName,
    full_name: user.fullName,
    email: user.email,
    phone: user.phone,
    tier: user.tier,
    tier_name: user.tierName,
    relationship_manager: user.relationshipManager,
    relationship_manager_phone: user.relationshipManagerPhone,
    member_since: user.memberSince,
    date_of_birth: user.dateOfBirth,
    address: user.address,
    preferences: user.preferences,
    last_login: user.lastLogin,
  };
}

export function transactionToInsert(
  txn: Omit<Transaction, 'id'>
): Omit<TransactionRow, 'id'> {
  return {
    user_id: txn.userId,
    account_id: txn.accountId,
    card_id: txn.cardId,
    type: txn.type,
    category: txn.category,
    merchant: txn.merchant,
    description: txn.description,
    amount: txn.amount,
    balance: txn.balance,
    date: txn.date,
    status: txn.status,
    location: txn.location,
  };
}

export function payeeToInsert(
  payee: Omit<Payee, 'id'>
): Omit<PayeeRow, 'id'> {
  return {
    user_id: payee.userId,
    name: payee.name,
    account_number: payee.accountNumber,
    category: payee.category,
    default_amount: payee.defaultAmount,
    recurring_payment: payee.recurringPayment,
    last_payment: payee.lastPayment,
  };
}
