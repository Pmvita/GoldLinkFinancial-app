# @goldlink/core

The shared TypeScript package for the GoldLink Bank monorepo. Provides typed accessors and formatters over the JSON mock backend at [`db/`](../../db/README.md). Zero runtime dependencies.

Currently consumed by [`apps/mobile`](../../apps/mobile/README.md). [`apps/web`](../../apps/web) is a planned follow-up.

---

## 📦 Installation

The package is wired into the workspace via the `workspace:*` protocol:

```json
{
  "dependencies": {
    "@goldlink/core": "workspace:*"
  }
}
```

No build step — `package.json` points `main` and `types` directly at `src/index.ts`. Consumers compile it as part of their own TypeScript build.

---

## 🔌 What's exported

Three files, all re-exported from `src/index.ts`:

```ts
export * from './types';
export * from './data';
export * from './format';
```

### Types (`src/types.ts`)

```ts
export type UserTier = 'standard' | 'premium' | 'platinum' | 'private' | 'ultra_high_net_worth';
export type AccountType = 'checking' | 'savings' | 'investment' | 'money_market';
export type AccountStatus = 'active' | 'frozen' | 'closed';
export type CardType = 'credit' | 'debit';
export type CardStatus = 'active' | 'frozen' | 'closed';
export type TransactionType = 'debit' | 'credit';
export type TransactionStatus = 'completed' | 'pending' | 'failed';
export type RecurringFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';

export interface User { /* id, username, password, firstName, lastName, fullName, email, phone, tier, tierName, relationshipManager, … */ }
export interface UserAddress { /* street, city, state, zipCode, country */ }
export interface UserPreferences { /* biometricEnabled, twoFactorEnabled, notifications */ }
export interface UserNotificationPreferences { /* … */ }
export interface TierInfo { /* name, minBalance, maxBalance, benefits, fees */ }

export interface Account { /* id, userId, accountNumber, routingNumber, type, name, balance, currency, status, openedDate, interestRate */ }
export interface Transaction { /* id, userId, accountId, cardId, type, category, merchant, description, amount, balance, date, status, location */ }
export interface Card { /* id, userId, accountId, cardNumber, lastFour, type, network, name, status, expiryDate, cvv, creditLimit, balance, availableCredit, rewardsPoints, … */ }
export interface Payee { /* id, userId, name, accountNumber, category, defaultAmount, recurringPayment, lastPayment */ }
export interface PayeeRecurringPayment { /* enabled, frequency, dayOfMonth, nextDue */ }
export interface PayeeLastPayment { /* amount, date */ }
export interface Budget { /* userId, monthlyBudget, categories[], savingsGoals[] */ }
export interface BudgetCategory { /* name, budget, spent, color */ }
export interface SavingsGoal { /* id, name, target, current, color */ }
```

Full field lists are in [`src/types.ts`](src/types.ts) — read the source for the authoritative shape.

### Data accessors (`src/data.ts`)

| Function                                          | Returns                       |
| ------------------------------------------------- | ----------------------------- |
| `getAllUsers()`                                   | `User[]`                      |
| `getUserById(userId)`                             | `User \| undefined`           |
| `findUserByCredentials(username, password)`       | `User \| undefined`           |
| `getTierInfo(tier)`                               | `TierInfo \| undefined`       |
| `getAccountsForUser(userId)`                      | `Account[]`                   |
| `getAccountById(accountId)`                       | `Account \| undefined`        |
| `getTotalBalanceForUser(userId)`                  | `number`                      |
| `getTransactionsForAccount(accountId)`            | `Transaction[]` (newest first) |
| `getTransactionsForUser(userId, limit?)`          | `Transaction[]` (newest first) |
| `getCardsForUser(userId)`                         | `Card[]`                      |
| `getPayeesForUser(userId)`                        | `Payee[]`                     |
| `getBudgetsForUser(userId)`                       | `Budget \| undefined`         |

Notes:

- `findUserByCredentials` normalizes the username by trimming and lowercasing, and matches against either `user.username` or `user.email`. The password is compared verbatim (plaintext — see [the security note](../../db/README.md#-security-considerations)).
- Transaction accessors pre-sort by `date` descending.
- All accessors return empty arrays / `undefined` for unknown IDs — they never throw.

### Formatters (`src/format.ts`)

| Function                                                  | Example output                |
| --------------------------------------------------------- | ----------------------------- |
| `formatCurrency(amount, currency='USD', opts?)`           | `$1,234.56`                   |
| `formatCompactCurrency(amount, currency='USD')`           | `$1.5M`                       |
| `formatDate(iso, opts?)`                                  | `Jan 15, 2024`                |
| `formatRelativeDate(iso)`                                 | `Today`, `Yesterday`, `3 days ago`, or `Jan 15, 2024` |
| `maskAccountNumber(value)`                                | `••••6789`                    |

All formatters guard against invalid input: invalid date strings echo back unchanged, and `maskAccountNumber('')` returns `''`.

---

## 🧪 Usage example

```ts
import {
  findUserByCredentials,
  getAccountsForUser,
  getTransactionsForUser,
  getCardsForUser,
  formatCurrency,
  formatRelativeDate,
  maskAccountNumber,
} from '@goldlink/core';

const user = findUserByCredentials('pmvita', 'admin123');
if (!user) throw new Error('Login failed');

const accounts = getAccountsForUser(user.id);
const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
console.log(formatCurrency(totalBalance)); // "$41,107,004.04"

const recent = getTransactionsForUser(user.id, 5);
recent.forEach((t) => {
  console.log(`${formatRelativeDate(t.date)}  ${t.merchant}  ${formatCurrency(t.amount)}`);
});

const cards = getCardsForUser(user.id);
const masked = maskAccountNumber(accounts[0].accountNumber); // "••••7821"
```

---

## 🧰 Scripts

From this package directory (`packages/core`):

```bash
pnpm typecheck   # tsc --noEmit
pnpm test        # vitest run
pnpm test:watch  # vitest in watch mode
```

`pnpm test` is wired into the root `pnpm test` command and runs in CI. **19 cases pass today**, split between data accessors (`src/__tests__/data.test.ts`) and formatters (`src/__tests__/format.test.ts`).

---

## 🧭 Implementation notes

- The JSON files at `db/*.json` are imported with TypeScript's `resolveJsonModule`. Type assertions like `as unknown as User[]` are intentional — the JSON has no compile-time guarantee of conformance, so the accessors are the type boundary.
- This package is **read-only** by design. Writes belong with a real backend.
- The package version is `0.0.0` and `private: true` — it is not intended for publication outside the workspace.
