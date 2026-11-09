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

/**
 * "New" input shapes for create()/upsert() — domain entity minus the
 * server-assigned identifier. Use these everywhere a caller needs to insert
 * a row without knowing the eventual primary key.
 */
export type NewUser = Omit<User, 'id'>;
export type NewTransaction = Omit<Transaction, 'id'>;
export type NewPayee = Omit<Payee, 'id'>;

export interface UserRepository {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  findByCredentials(
    usernameOrEmail: string,
    password: string
  ): Promise<User | null>;
  create(input: NewUser): Promise<User>;
  /**
   * Tier metadata is keyed by tier name, not user id, but it conceptually
   * lives alongside users so we expose it here to avoid a one-method repo.
   */
  getTierInfo(tier: UserTier): Promise<TierInfo | null>;
}

export interface AccountRepository {
  getAllForUser(userId: string): Promise<Account[]>;
  getById(id: string): Promise<Account | null>;
  updateBalance(id: string, newBalance: number): Promise<void>;
  getTotalBalanceForUser(userId: string): Promise<number>;
}

export interface TransactionRepository {
  getForAccount(accountId: string): Promise<Transaction[]>;
  getForUser(userId: string, limit?: number): Promise<Transaction[]>;
  create(input: NewTransaction): Promise<Transaction>;
}

export interface CardRepository {
  getForUser(userId: string): Promise<Card[]>;
  updateStatus(id: string, status: CardStatus): Promise<void>;
}

export interface PayeeRepository {
  getForUser(userId: string): Promise<Payee[]>;
  create(input: NewPayee): Promise<Payee>;
}

export interface BudgetRepository {
  getForUser(userId: string): Promise<Budget | null>;
  upsert(input: Budget): Promise<Budget>;
}

export interface Repositories {
  users: UserRepository;
  accounts: AccountRepository;
  transactions: TransactionRepository;
  cards: CardRepository;
  payees: PayeeRepository;
  budgets: BudgetRepository;
}
