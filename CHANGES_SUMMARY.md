# GoldLink Bank — Changelog

A running record of major rework. Dates use ISO-8601. The original "rebrand + JSON wiring" notes are preserved as an appendix at the bottom.

---

## 2026-05-12 — Monorepo, Expo mobile app, JSON wiring, quality gates

The single biggest reshape since the original SecureBank → GoldLink rebrand. Four parallel workers landed changes that, taken together, restructured the repo and added a second app.

### 🏗 Monorepo layout

Converted the project to a **pnpm workspace**. Sources moved off the root:

```text
GoldLink-Bank/
├── apps/
│   ├── web/                # was the root Vite SPA
│   └── mobile/             # NEW — Expo SDK 54
├── packages/
│   └── core/               # NEW — shared TypeScript package
├── db/                     # unchanged location
├── pnpm-workspace.yaml     # NEW — covers apps/* + packages/*
└── tsconfig.base.json      # NEW — shared TS settings
```

Root `package.json` now exposes top-level scripts that delegate to workspaces:

| Script               | What it runs                                             |
| -------------------- | -------------------------------------------------------- |
| `pnpm dev`           | `pnpm --filter web dev`                                  |
| `pnpm build`         | `pnpm --filter web build`                                |
| `pnpm lint`          | ESLint v9 across web + core                              |
| `pnpm lint:fix`      | ESLint with `--fix`                                      |
| `pnpm format`        | Prettier write                                           |
| `pnpm format:check`  | Prettier check (used by CI)                              |
| `pnpm typecheck`     | `tsc --noEmit` across workspaces, excluding `apps/web`   |
| `pnpm test`          | Vitest across workspaces with a `test` script            |

### 📱 New: Expo mobile app (`apps/mobile`)

A native iOS/Android companion built on **Expo SDK 54** and **Expo Router 6**, runnable in **Expo Go** with no native build steps. Screens:

- **Splash** (`/`) → reads `expo-secure-store`, routes to `/login` or `/(tabs)/dashboard`
- **Login** (`/login`) — username + password, validated via `findUserByCredentials` from `@goldlink/core`
- **Dashboard** — greeting, total balance hero, recent activity
- **Accounts** — per-user account list → detail screen with full transaction history
- **Transfers** — placeholder screen
- **Cards** — per-user card tiles with status, network, expiry, available credit
- **More** — profile card, sub-routes for Bill Pay / Mobile Deposit / Budgeting / Settings (all placeholders), sign out

Theme tokens at `apps/mobile/src/theme.ts` mirror the web's carbon + gold palette. The app uses plain RN `StyleSheet` — **NativeWind was considered and deferred** to keep Expo Go compatibility simple and avoid an extra build-time dependency.

Demo logins (advertised on the login screen):

- `pmvita` / `admin123` — UHNW
- `sarah.johnson@email.com` / `demo123` — Private Banking
- `demo@bank.com` / `demo123` — Platinum

### 📦 New: shared `@goldlink/core` package

A small TypeScript package consumed by `apps/mobile`. No runtime dependencies.

- **`src/types.ts`** — `User`, `Account`, `Transaction`, `Card`, `Payee`, `Budget`, `TierInfo`, plus enums (`UserTier`, `AccountType`, `CardType`, `RecurringFrequency`, status enums)
- **`src/data.ts`** — `getUserById`, `getAllUsers`, `findUserByCredentials`, `getTierInfo`, `getAccountsForUser`, `getAccountById`, `getTotalBalanceForUser`, `getTransactionsForAccount`, `getTransactionsForUser`, `getCardsForUser`, `getPayeesForUser`, `getBudgetsForUser`
- **`src/format.ts`** — `formatCurrency`, `formatCompactCurrency`, `formatDate`, `formatRelativeDate`, `maskAccountNumber`
- **Tests** — 19 Vitest cases in `src/__tests__/`

`apps/web` does **not** yet consume the package — that's a planned follow-up.

### 🔌 Web JSON wiring

Four web components were converted from hardcoded fixtures to per-user JSON-driven views:

- `apps/web/src/app/components/Cards.tsx` — filters `db/cards.json` by `userId`, shows card-specific recent activity from `db/transactions.json`
- `apps/web/src/app/components/BillPay.tsx` — filters `db/payees.json` by `userId`; derives pending/paid status from `recurringPayment.nextDue`
- `apps/web/src/app/components/Budgeting.tsx` — reads category + savings-goal data from `db/budgets.json`
- `apps/web/src/app/components/Transfers.tsx` — populates From/To account selects from per-user `db/accounts.json`; uses `db/payees.json` as the saved-recipient list for non-internal transfers

Three `TODO: backfill` markers were left intentionally:

- `Cards.tsx` — `dailyLimit` for debit/non-credit cards (UI hardcodes $250k for now)
- `BillPay.tsx` — explicit `status` on each payee
- `Budgeting.tsx` — `db/budgets.json` entry for new sign-up users

Transfer/Bill-Pay/Deposit _submissions_ remain simulated (`setTimeout` → success screen). Nothing is written back to JSON.

### ✅ Quality gates

- **ESLint v9** (flat config) at `eslint.config.mjs`, covering `apps/web/src/**/*.{ts,tsx}` and `packages/core/src/**/*.{ts,tsx}`, plus root configs
- **Prettier 3** at `prettier.config.mjs`; `.prettierignore` currently excludes all of `apps/web/` and all `*.md` files (see [caveats](#-known-caveats--carry-overs))
- **Vitest** in `@goldlink/core` — 19 passing tests for data accessors and formatters
- **GitHub Actions** (`.github/workflows/ci.yml`) runs Prettier check → ESLint → typecheck → Vitest → web build on every push to `main` and on every PR

### ⚙️ Misc

- `pnpm-workspace.yaml` pins `@types/react` to `^18.3.12` (and `@types/react-dom` to `^18.3.1`) across the workspace to keep `apps/web` (React 18.3) compatible with Expo's transitive React 19 typings
- Expo app has `newArchEnabled: true` and `experiments.reactCompiler: true` in `app.json`

### ⚠️ Known caveats / carry-overs

These are tracked as follow-ups in the README's "Current limitations" section:

1. **`apps/web` still uses local types** instead of `@goldlink/core` (e.g. `(typeof cardsData)['cards'][number]`). Moving web onto the shared package is the next architectural step.
2. **Prettier is scoped narrowly.** `apps/web/` and `*.md` are both ignored. Re-enabling Prettier on `apps/web` is queued behind step 1.
3. **Root `pnpm typecheck` excludes `apps/web`** due to pre-existing `motion/react` `Variant` type errors. Web keeps its own `pnpm --filter web typecheck` script.
4. **3 `TODO: backfill` comments** in `apps/web/src/app/components/` (Cards, BillPay, Budgeting).
5. **Schema overlap:** `db/payees.json` is used both as the bill-pay payee list and as the saved-recipient list for web Transfers. Real backend work should split these.

---

## 📜 Pre-monorepo notes (appendix)

The history below predates the monorepo restructure. Paths and file lists are kept as-written for accuracy. Current locations are noted in brackets where they differ.

### 🎨 Branding updates

**Application name change**

- **OLD:** SecureBank
- **NEW:** GoldLink Bank

**Files updated with new branding:**

1. `src/app/components/LoginPage.tsx` — login screen title  
   _(now at `apps/web/src/app/components/LoginPage.tsx`)_
2. `src/app/components/Layout.tsx` — header and mobile menu (2 locations)  
   _(now at `apps/web/src/app/components/Layout.tsx`)_
3. `db/README.md` — complete database documentation
4. `BANKING_APP_GUIDE.md` — comprehensive app guide

### 🔐 Authentication changes

**Old system (generic demo):** any username/password worked; generic `demo@bank.com` user; no user-specific data.

**New system (validating against `db/users.json`):** username `pmvita` / password `admin123` for the admin (UHNWI) user; loads actual user data from the JSON store; shows user-specific accounts, transactions, cards, etc.

### 💾 Database integration

Components reworked to load real per-user data (paths shown are as-written; current paths are `apps/web/src/app/components/*`):

- **Dashboard** — loads accounts from `db/accounts.json`, transactions from `db/transactions.json`, tier benefits for UHNWI, RM info, balance trends, spending analytics
- **Accounts** — user-specific accounts, transaction history per account, masked numbers, interest rates, search/filter
- **Cards** — cards from `db/cards.json`, credit limits, available credit, rewards (156,789 for Pierre)
- **Transfers** — accounts in dropdowns, masked numbers
- **BillPay** — payees from `db/payees.json`, recurring schedules, due dates
- **Budgeting** — categories and savings goals from `db/budgets.json` (Pierre: $3.25M / $1.45M / $6.8M goals)

### 👑 UHNWI experience (Pierre Mvita)

When logged in as `pmvita`:

1. **Golden tier badge** — crown icon, "Ultra High Net Worth" label
2. **Relationship manager** — Victoria Sterling on the dashboard
3. **Premium benefits card** — 8 UHNWI perks
4. **High-value portfolio** — 4 accounts totaling ~$41.1M with rates up to 4.25% APY
5. **Luxury transactions** — Tiffany & Co. -$45,678.99, Four Seasons Bora Bora -$28,500, Quarterly Dividend +$125,000, Le Bernardin -$850.50
6. **Visa Infinite** — $500k limit, 156,789 rewards points
7. **UI extras** — "Contact Team" button, premium account names

### 📊 Database files created

In `db/`:

1. **`users.json`** (~5.8 KB) — 3 demo users, 5 tier definitions
2. **`accounts.json`** (~2.8 KB) — 8 accounts, $43.7M total
3. **`cards.json`** (~4.1 KB) — 7 cards (Visa Infinite, World Elite, etc.)
4. **`transactions.json`** (~6.6 KB) — 15+ transactions
5. **`payees.json`** (~4.0 KB) — 9 bill-pay recipients
6. **`budgets.json`** (~4.5 KB) — categories + goals per user
7. **`README.md`** (~15 KB) — full schema documentation

### 🎯 Key improvements (from the rebrand)

- Personalized greeting "Welcome back, Pierre"
- Tier-appropriate UI elements
- Real data throughout the app
- Consistent GoldLink Bank branding
- Masked card numbers (`••••3456`) and account numbers (`••••4521`)
- 2FA flow + biometric option (UI only)
- Responsive across desktop (1920+), laptop, tablet, mobile

### 📝 Files modified (pre-monorepo)

Web components (at the time, all under `src/app/components/`; now under `apps/web/src/app/components/`):

1. `LoginPage.tsx`
2. `Dashboard.tsx`
3. `Layout.tsx`
4. `Accounts.tsx`
5. `Transfers.tsx`
6. `Cards.tsx`
7. `BillPay.tsx`
8. `Budgeting.tsx`

Database files (in `db/`): `users.json`, `accounts.json`, `cards.json`, `transactions.json`, `payees.json`, `budgets.json`, `README.md`.

Documentation: `BANKING_APP_GUIDE.md` (new), `CHANGES_SUMMARY.md` (this file).

### ✨ Original "next steps" (most have since been partially addressed)

1. **Backend integration** — replace JSON with a REST API; real auth; PostgreSQL
2. **Security** — bcrypt, JWT, rate limiting, HTTPS
3. **Additional features** — real-time notifications, document vault, investment portfolio tracking, video banking, mobile apps (**partially shipped** — see the 2026-05-12 section above for the Expo app)
4. **Compliance** — PCI-DSS, SOC 2, GDPR, pen testing

---
