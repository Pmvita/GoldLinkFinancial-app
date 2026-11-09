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
import { jsonStore, nextId } from './jsonStore';
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

class JsonUserRepository implements UserRepository {
  async getAll(): Promise<User[]> {
    return jsonStore.users.slice();
  }

  async getById(id: string): Promise<User | null> {
    return jsonStore.users.find((u) => u.id === id) ?? null;
  }

  async findByCredentials(
    usernameOrEmail: string,
    password: string
  ): Promise<User | null> {
    const normalized = usernameOrEmail.trim().toLowerCase();
    return (
      jsonStore.users.find(
        (u) =>
          (u.username.toLowerCase() === normalized ||
            u.email.toLowerCase() === normalized) &&
          u.password === password
      ) ?? null
    );
  }

  async create(input: NewUser): Promise<User> {
    const user: User = { id: nextId('USR'), ...input };
    jsonStore.users.push(user);
    return user;
  }

  async getTierInfo(tier: UserTier): Promise<TierInfo | null> {
    return jsonStore.tiers[tier] ?? null;
  }
}

class JsonAccountRepository implements AccountRepository {
  async getAllForUser(userId: string): Promise<Account[]> {
    return jsonStore.accounts.filter((a) => a.userId === userId);
  }

  async getById(id: string): Promise<Account | null> {
    return jsonStore.accounts.find((a) => a.id === id) ?? null;
  }

  async updateBalance(id: string, newBalance: number): Promise<void> {
    const account = jsonStore.accounts.find((a) => a.id === id);
    if (!account) {
      throw new Error(`Account ${id} not found`);
    }
    account.balance = newBalance;
  }

  async getTotalBalanceForUser(userId: string): Promise<number> {
    return jsonStore.accounts
      .filter((a) => a.userId === userId)
      .reduce((sum, a) => sum + a.balance, 0);
  }
}

class JsonTransactionRepository implements TransactionRepository {
  async getForAccount(accountId: string): Promise<Transaction[]> {
    return jsonStore.transactions
      .filter((t) => t.accountId === accountId)
      .slice()
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }

  async getForUser(userId: string, limit?: number): Promise<Transaction[]> {
    const sorted = jsonStore.transactions
      .filter((t) => t.userId === userId)
      .slice()
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
  }

  async create(input: NewTransaction): Promise<Transaction> {
    const txn: Transaction = { id: nextId('TXN'), ...input };
    jsonStore.transactions.push(txn);
    return txn;
  }
}

class JsonCardRepository implements CardRepository {
  async getForUser(userId: string): Promise<Card[]> {
    return jsonStore.cards.filter((c) => c.userId === userId);
  }

  async updateStatus(id: string, status: CardStatus): Promise<void> {
    const card = jsonStore.cards.find((c) => c.id === id);
    if (!card) {
      throw new Error(`Card ${id} not found`);
    }
    card.status = status;
  }
}

class JsonPayeeRepository implements PayeeRepository {
  async getForUser(userId: string): Promise<Payee[]> {
    return jsonStore.payees.filter((p) => p.userId === userId);
  }

  async create(input: NewPayee): Promise<Payee> {
    const payee: Payee = { id: nextId('PAY'), ...input };
    jsonStore.payees.push(payee);
    return payee;
  }
}

class JsonBudgetRepository implements BudgetRepository {
  async getForUser(userId: string): Promise<Budget | null> {
    return jsonStore.budgets.find((b) => b.userId === userId) ?? null;
  }

  async upsert(input: Budget): Promise<Budget> {
    const idx = jsonStore.budgets.findIndex((b) => b.userId === input.userId);
    const copy: Budget = {
      ...input,
      categories: input.categories.map((c) => ({ ...c })),
      savingsGoals: input.savingsGoals.map((g) => ({ ...g })),
    };
    if (idx >= 0) {
      jsonStore.budgets[idx] = copy;
    } else {
      jsonStore.budgets.push(copy);
    }
    return copy;
  }
}

export function createJsonRepositories(): Repositories {
  return {
    users: new JsonUserRepository(),
    accounts: new JsonAccountRepository(),
    transactions: new JsonTransactionRepository(),
    cards: new JsonCardRepository(),
    payees: new JsonPayeeRepository(),
    budgets: new JsonBudgetRepository(),
  };
}
