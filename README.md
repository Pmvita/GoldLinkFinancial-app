# 🏦 GoldLink Bank

![GoldLink Bank](https://images.unsplash.com/photo-1634733988138-bf2c3a2a13fa?q=80&w=2070&auto=format&fit=crop)

**GoldLink Bank** is a premium banking prototype tailored for Ultra High Net Worth Individuals (UHNWI). It pairs a polished web experience with a native-feel mobile companion, both driven by the same local JSON mock backend. The aesthetic is built around a deep carbon and metallic gold palette and is engineered to feel like exclusive, private banking software.

---

## 📦 Monorepo layout

This repo is a **pnpm workspace**. Source lives under `apps/*` and `packages/*`:

```text
GoldLink-Bank/
├── apps/
│   ├── web/                    # Vite + React 18 SPA (the original app)
│   │   └── src/app/components/ # Dashboard, Accounts, Cards, Transfers, …
│   └── mobile/                 # Expo SDK 54 + Expo Router app (Expo Go compatible)
│       └── app/                # File-based routes: splash, login, (tabs)/*
├── packages/
│   └── core/                   # Shared TS package — types, JSON accessors, formatters
├── db/                         # Local JSON mock backend (users, accounts, …)
├── .github/workflows/ci.yml    # Prettier + ESLint + typecheck + Vitest + web build
├── eslint.config.mjs           # Flat ESLint v9 config
├── prettier.config.mjs
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

Both apps consume `db/*.json` directly. Mobile reads through `@goldlink/core`; web still imports JSON files directly (see [Current limitations](#-current-limitations--follow-ups)).

---

## 🚀 Getting started

### Prerequisites

- Node.js 20+ (CI runs on 20)
- pnpm 11 (managed by the repo's `packageManager` field)
- For the mobile app: the [Expo Go](https://expo.dev/go) app on your iOS or Android device

### Install once at the root

```bash
git clone https://github.com/your-username/goldlink-bank.git
cd goldlink-bank
pnpm install
```

### Run the web app

From the repo root:

```bash
pnpm dev          # alias for `pnpm --filter web dev`
pnpm build        # alias for `pnpm --filter web build`
```

Or directly: `pnpm --filter web dev`. Vite serves at the URL it prints (typically <http://localhost:5173>).

### Run the mobile app

```bash
cd apps/mobile
pnpm start        # launches the Expo dev server
```

Scan the QR code with **Expo Go** on your phone. The first run from `apps/mobile` is `pnpm start`; subsequent helpers (`pnpm ios`, `pnpm android`, `pnpm web`) target specific platforms. See [`apps/mobile/README.md`](apps/mobile/README.md) for more.

### Repo-wide scripts

Run from the repo root:

| Command              | What it does                                                    |
| -------------------- | --------------------------------------------------------------- |
| `pnpm dev`           | Runs the web app via Vite                                       |
| `pnpm build`         | Builds the web app                                              |
| `pnpm lint`          | Runs ESLint v9 across `apps/web/src` and `packages/core/src`    |
| `pnpm lint:fix`      | Same, with `--fix`                                              |
| `pnpm format`        | Prettier write                                                  |
| `pnpm format:check`  | Prettier check (used by CI)                                     |
| `pnpm typecheck`     | `tsc --noEmit` across workspaces _except_ `apps/web` (see below) |
| `pnpm test`          | Vitest across workspaces that define a `test` script            |

---

## 🔐 Demo credentials

All three demo users live in `db/users.json`. Use any of them on either the web or mobile login screen.

| Tier              | Username / Email             | Password   |
| ----------------- | ---------------------------- | ---------- |
| Ultra High Net Worth (UHNWI) | `pmvita`                     | `admin123` |
| Private Banking   | `sarah.johnson@email.com`    | `demo123`  |
| Platinum          | `demo@bank.com`              | `demo123`  |

Passwords are intentionally plain-text — this is a demo. Do not reuse them for anything real.

> The web login flow walks through a simulated 2FA step (any 6-digit code passes) and a simulated biometric prompt. The mobile login screen is plain username + password only — see [Current limitations](#-current-limitations--follow-ups).

---

## ✨ Highlights

### Web (`apps/web`)

- **Splash + Login + Sign-up + 2FA + biometric** flows (UI only; 2FA accepts any 6-digit code)
- **Dashboard** with tier badge, balance trends, spending analytics, recent activity
- **Accounts / Account detail** with masked numbers, interest rates, transaction history
- **Cards** with credit/debit visuals, freeze, change-PIN buttons (UI only)
- **Transfers** — internal/domestic/international wires with a simulated authorize → processing → success flow
- **Bill Pay** — per-user payees with due-date derivation and a simulated "Pay Now"
- **Budgeting** — Recharts pie/bar visualizations of categories and savings goals
- **Mobile Deposit** — placeholder upload-and-process simulation
- **Settings** — profile, password, 2FA, biometric, notifications, sessions, privacy (UI scaffolding)

### Mobile (`apps/mobile`)

Expo SDK 54, Expo Router file-based navigation, plain React Native `StyleSheet` (no NativeWind). Runs in Expo Go.

| Route                        | Screen                          |
| ---------------------------- | ------------------------------- |
| `/` (splash)                 | Logo + session check → routes   |
| `/login`                     | Username + password login       |
| `/(tabs)/dashboard`          | Greeting, total balance, recent activity |
| `/(tabs)/accounts`           | Per-user account list           |
| `/(tabs)/transfers`          | Placeholder ("Coming soon")     |
| `/(tabs)/cards`              | Per-user card tiles             |
| `/(tabs)/more`               | Profile, settings/sub-screens   |
| `/accounts/[id]`             | Account detail + transactions   |
| `/more/[screen]`             | Bill pay / deposit / budgeting / settings placeholders |

Sessions are persisted via `expo-secure-store`. All data is read from `@goldlink/core` (which loads `db/*.json`).

### Shared core (`packages/core`)

A small TypeScript package consumed by `apps/mobile`. See [`packages/core/README.md`](packages/core/README.md) for the full API. Highlights:

- **Types:** `User`, `Account`, `Transaction`, `Card`, `Payee`, `Budget`, plus enums for tier/type/status.
- **Data accessors:** `getUserById`, `findUserByCredentials`, `getAccountsForUser`, `getTransactionsForAccount`, `getTransactionsForUser`, `getCardsForUser`, `getPayeesForUser`, `getBudgetsForUser`, `getTotalBalanceForUser`, `getTierInfo`, `getAccountById`, `getAllUsers`.
- **Formatters:** `formatCurrency`, `formatCompactCurrency`, `formatDate`, `formatRelativeDate`, `maskAccountNumber`.
- **Tests:** 19 Vitest cases covering data accessors and formatters.

---

## 🎨 Design system

GoldLink Bank's visual identity is built around exclusivity and legibility:

- **Bespoke "GL" monogram** as the central brand mark
- **Deep Carbon** (`#0a0a0c` / `#121217` / `#1a1a20`) for surfaces
- **Metallic Gold** (`#cca858`, `#e6cc80`, `#d4af37`) as the single primary accent
- **Inter** for typography; weights from 300 (display) to 700 (bold)
- **Liquid responsiveness** — the web layout adapts cleanly across desktop/laptop/tablet/mobile

The mobile theme tokens live at `apps/mobile/src/theme.ts` and intentionally mirror the web's `apps/web/src/styles/` palette.

---

## 🛠 Tech stack

**Web (`apps/web`)** — React 18.3, TypeScript, Vite 6, Tailwind CSS v4, shadcn/ui + Radix primitives, MUI (icons + a few primitives), motion (`motion/react`), Recharts, Lucide, Sonner, React Hook Form, React Router 7.

**Mobile (`apps/mobile`)** — React 19, React Native 0.81, Expo SDK 54, Expo Router 6, `expo-secure-store`, `expo-linear-gradient`, `@expo/vector-icons` (Feather), plain `StyleSheet` (NativeWind was considered and deferred).

**Shared (`packages/core`)** — TypeScript only, no runtime dependencies; tested with Vitest.

**Tooling** — pnpm workspaces, ESLint v9 (flat config) + `eslint-config-prettier`, Prettier 3, TypeScript 5.6, GitHub Actions (`.github/workflows/ci.yml`).

---

## ⚠️ Current limitations / follow-ups

This is a demo / portfolio prototype. Treat the following as known engineering truths, not bugs:

1. **No real backend.** Both apps read JSON files directly from `db/`. There is no API server, no auth service, no database, no persistence of writes — every mutation is in-memory and lost on reload.
2. **Auth is plaintext.** Passwords are stored unhashed in `db/users.json`. The web 2FA step accepts any 6-digit code; biometric is a UI prompt only. The mobile login screen does username + password only (no 2FA, no biometric).
3. **Web still uses local types.** `apps/web/src/app/components/*` re-derive types from JSON (`(typeof cardsData)['cards'][number]`) instead of consuming `@goldlink/core`. Refactoring web onto the shared package is a planned follow-up.
4. **3 outstanding `TODO: backfill` markers** in `apps/web/src/app/components/`:
   - `Cards.tsx` — `dailyLimit` field missing for debit/non-credit cards in `db/cards.json`
   - `BillPay.tsx` — `status` field missing on payees in `db/payees.json` (currently derived from `nextDue`)
   - `Budgeting.tsx` — `db/budgets.json` has no entry for newly-created users
5. **Schema overlap.** Web's Transfers screen treats `db/payees.json` as the list of "saved recipients" for wires, but the same JSON also feeds Bill Pay. Splitting recipients vs payees may be needed before any real backend is wired in.
6. **Submissions are simulated.** Transfers, bill payments, and check deposits all run a `setTimeout` and show a success screen — nothing is written to the JSON files.
7. **Prettier is scoped narrowly.** `.prettierignore` currently excludes all of `apps/web/` and all `*.md` files. `pnpm format:check` therefore covers `packages/core`, configs at the root, and `apps/mobile` non-md files. Re-enabling Prettier on `apps/web` is tracked as a follow-up in `.prettierignore`.
8. **Typecheck excludes `apps/web`.** Root `pnpm typecheck` runs `tsc` everywhere _except_ `apps/web` because of pre-existing `motion/react` `Variant` type errors. The web app keeps its own `pnpm --filter web typecheck` script for local use.
9. **`@types/react` is pinned to v18.** `pnpm-workspace.yaml` overrides `@types/react` to `^18.3.12` so apps/web (React 18) doesn't collide with Expo's transitive React 19 typings. The mobile app runs React 19 at runtime — if it ever adds a `typecheck` script that depends on v19-only type features, this pin will need revisiting.
10. **Expo "New Architecture" is enabled** (`app.json` → `newArchEnabled: true`) and `experiments.reactCompiler` is on. Both are stable but worth knowing if you hit Expo Go edge cases.

If you're picking up this repo, the highest-leverage next steps are (a) moving `apps/web` onto `@goldlink/core` so the type sources of truth converge, and (b) re-enabling Prettier on `apps/web` once that refactor lands.

---

## 🧪 Quality gates

CI runs on every push to `main` and every PR (`.github/workflows/ci.yml`):

1. `pnpm install --frozen-lockfile`
2. `pnpm format:check`
3. `pnpm lint`
4. `pnpm typecheck` (excludes `apps/web` for now — see above)
5. `pnpm test` — currently 19 Vitest cases in `@goldlink/core`
6. `pnpm --filter web build`

---

## 📄 License

MIT. All data, users, and transactions in `db/*.json` are fictional and exist solely to demonstrate the UI/UX.

---

<div align="center">

**GoldLink Bank**  
_Exceptional Banking for Exceptional People_

© 2026 GoldLink Bank

</div>
