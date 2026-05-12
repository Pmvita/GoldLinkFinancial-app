# GoldLink Bank — Feature & Implementation Guide

## 🏦 Overview

**GoldLink Bank** is a multi-tier private wealth and banking prototype, available as a Vite-powered web SPA (`apps/web`) and an Expo Go mobile companion (`apps/mobile`). Both apps share a local JSON mock backend (`db/`) and the mobile app additionally consumes a shared TypeScript package (`@goldlink/core`).

For setup, scripts, and known engineering caveats, see the [top-level README](README.md). This document focuses on **what the product currently does**, separating real behavior from simulated UI flows.

---

## 🚀 Quick start

### Demo logins

All credentials live in `db/users.json` and work on both the web and mobile login screens.

| Tier              | Username / Email             | Password   |
| ----------------- | ---------------------------- | ---------- |
| Ultra High Net Worth | `pmvita`                  | `admin123` |
| Private Banking   | `sarah.johnson@email.com`    | `demo123`  |
| Platinum          | `demo@bank.com`              | `demo123`  |

Plain-text passwords are intentional — see the [security note](#-security-features-demo-only).

### Run

```bash
# Web SPA
pnpm dev            # from repo root

# Mobile app
cd apps/mobile && pnpm start
# Scan the QR code with the Expo Go app on your iOS or Android device.
```

---

## 💎 User tiers

`db/users.json` ships with three pre-built users that map onto three of the five tiers defined in the file. The remaining two tiers (Standard, Premium) are defined in the `tiers` metadata block but have no demo user assigned.

### Ultra High Net Worth (UHNWI) 👑 — `pmvita`

**Required balance:** $10,000,000+ · **Relationship manager:** Victoria Sterling · **Member since:** March 15, 2018

**Portfolio:**

| Account                       | Balance         | Rate         |
| ----------------------------- | --------------- | ------------ |
| Private Wealth Checking       | $2,847,563.42   | 1.75% APY    |
| High-Yield Savings            | $8,456,982.18   | 4.25% APY    |
| Portfolio Investment          | $24,567,890.55  | Market rate  |
| Money Market                  | $5,234,567.89   | 3.85% APY    |
| **Total**                     | **$41,107,004.04** | —         |

**Listed UHNWI benefits** (rendered in the web tier card; tier metadata also lives in `db/users.json`): dedicated wealth team, family office services, global investment access, art/yacht/aircraft financing, multi-generational planning, philanthropic support, custom banking, private jet partnerships, real-estate advisory.

### Private Banking 💼 — Sarah Johnson

**Required balance:** $1M–$9.99M · **RM:** Michael Chen · **Total assets:** $1,691,357.17 across Private Banking Checking and Private Savings · **Cards:** Mastercard World Elite ($150k limit) + Private Banking Debit.

### Platinum 🥇 — John Smith

**Required balance:** $250k–$999k · **Total assets:** $909,689.17 across Platinum Checking and Platinum Savings · **Cards:** Visa Signature ($50k) + Platinum Checking Debit.

---

## 🎯 Feature matrix

Legend: ✅ Implemented · 🧪 Simulated demo flow · 🖼️ UI-only (no real behavior) · 🚧 Placeholder · ➖ Not in this app

| Feature                       | Web (`apps/web`)        | Mobile (`apps/mobile`)    |
| ----------------------------- | ----------------------- | ------------------------- |
| Splash screen                 | ✅                      | ✅ (session check)        |
| Username/password login       | ✅ (validates `db/users.json`) | ✅ (validates via `@goldlink/core`) |
| 2FA OTP step                  | 🖼️ (any 6 digits pass)  | ➖                        |
| Biometric login               | 🖼️ (button only)        | ➖                        |
| Sign-up / "Request invitation" | 🧪 (creates ephemeral in-memory user; never persisted) | ➖ |
| Persistent session            | 🖼️ (local React state)  | ✅ (`expo-secure-store`)  |
| Dashboard / balance hero      | ✅                      | ✅                        |
| Tier badge & RM info          | ✅                      | ✅ (tier badge; RM on `more`) |
| Balance trend chart           | ✅ (derived from txns)  | ➖                        |
| Spending analytics            | ✅                      | ➖                        |
| Recent transactions           | ✅                      | ✅                        |
| Accounts list                 | ✅                      | ✅                        |
| Account detail + history      | ✅                      | ✅                        |
| Account number masking        | ✅                      | ✅ (`maskAccountNumber`)  |
| Card list                     | ✅ (per-user JSON)      | ✅                        |
| Card freeze / change PIN      | 🖼️                      | ➖                        |
| Card-specific recent activity | ✅                      | ➖                        |
| Internal / domestic / international transfers | 🧪 (form → 1.5s spinner → success screen; nothing written) | 🚧 (placeholder screen) |
| Saved recipients              | ✅ reads (uses `db/payees.json` as recipients — see [caveat](#-known-data-model-gaps)) | ➖ |
| Bill Pay payee list           | ✅ (per-user JSON)      | 🚧 (placeholder)          |
| Bill Pay "Pay Now"            | 🖼️                      | ➖                        |
| Recurring payment schedules   | ✅ (read from JSON)     | ➖                        |
| Mobile check deposit          | 🧪 (form → 2s spinner → success; no upload, no OCR) | 🚧 (placeholder) |
| Budgeting categories          | ✅ (per-user JSON, Recharts pie + bars) | 🚧 (placeholder) |
| Savings goals                 | ✅ (read from JSON)     | ➖                        |
| Settings (profile, password, 2FA, biometric, notifications, sessions, privacy) | 🖼️ (UI scaffolding, no persistence) | 🚧 (placeholder) |
| Sign out                      | ✅                      | ✅ (clears secure session) |

### What "real" means here

When the table says **✅** for data-driven screens (Cards, Bill Pay, Budgeting, Transfers' account selectors, Accounts, Dashboard) the components filter `db/*.json` by the currently-logged-in user. The screens really do show user-specific accounts/cards/transactions/payees — but no _writes_ are persisted. Refresh the page and any in-memory toggles or "paid" states reset.

---

## ⚠️ Known data model gaps

Two schema decisions are worth flagging before any backend work begins:

1. **Payees double as wire recipients.** `apps/web/src/app/components/Transfers.tsx` reads `db/payees.json` for the "Saved recipient" dropdown on non-internal transfers. The same file feeds Bill Pay. A real banking schema would separate _payees_ (recurring biller relationships) from _transfer recipients_ (counterparties with routing details).
2. **Missing fields, deferred via `TODO: backfill` markers** (3 in `apps/web/src/app/components/`):
   - `Cards.tsx` — `dailyLimit` for debit/non-credit cards (the UI hardcodes $250k as a placeholder)
   - `BillPay.tsx` — explicit `status` per payee (currently derived from `recurringPayment.nextDue`)
   - `Budgeting.tsx` — `db/budgets.json` has no entry for newly-created (sign-up) users

---

## 📊 Database

Six JSON files in `db/` back the entire prototype. See [`db/README.md`](db/README.md) for the full schema, sample records, and tier-fee definitions.

```text
db/
├── users.json          # 3 users, 5 tier definitions
├── accounts.json       # 8 bank accounts ($43.7M total)
├── cards.json          # 7 credit/debit cards
├── transactions.json   # ~15+ transactions across all users
├── payees.json         # 9 bill-pay payees (also used as wire recipients in web)
└── budgets.json        # per-user category budgets + savings goals
```

### Relationships

```text
users.json (id)
  ├─→ accounts.json (userId)
  │     └─→ transactions.json (accountId)
  ├─→ cards.json (userId, accountId)
  │     └─→ transactions.json (cardId)
  ├─→ payees.json (userId)
  └─→ budgets.json (userId)
```

### Access patterns

- **Mobile** uses `@goldlink/core` (see [`packages/core/README.md`](packages/core/README.md)). The package re-exports typed accessors like `getAccountsForUser(userId)` and `getCardsForUser(userId)`.
- **Web** currently imports the JSON files directly (`import accountsData from '../../../../../db/accounts.json'`) and filters in component-level `useEffect`s. Moving web onto `@goldlink/core` is a planned refactor.

---

## 🎨 Branding & design

### Color scheme

| Token        | Value                                  | Use                                    |
| ------------ | -------------------------------------- | -------------------------------------- |
| Carbon BG    | `#0a0a0c` / `#121217` / `#1a1a20`      | Page, card, elevated card backgrounds  |
| Gold accent  | `#cca858` / `#e6cc80` / `#d4af37`      | Brand, CTAs, focus rings, highlights   |
| Text         | `#fafafa` / `#a1a1aa` / `#71717a`      | Primary / secondary / muted text       |
| Border       | `#27272a`                              | Card / divider borders                 |
| Success      | `#10b981`                              | Credits, "active" status               |
| Danger       | `#ef4444`                              | Frozen cards, sign-out, errors         |

### Typography

- **Inter** family (the mobile theme references the Inter weights 300/400/500/600/700)
- Numbers use `tabular-nums` / monospace for account and card numbers
- Headings lean light (`font-light` / `300`) for the executive aesthetic

### Tier accents (web)

The web app applies tier-specific gradients in component-level Tailwind classes:

- UHNW: `from-amber-400 to-yellow-500`
- Private: `from-purple-600 to-indigo-600`
- Platinum: `from-gray-400 to-gray-500`

---

## 🔒 Security features (demo only)

**Current state — do not use any of this with real data:**

- Plain-text passwords in `db/users.json`
- No encryption at rest or in transit
- Web auth state lives in local component state (no token, no refresh)
- Mobile auth state is a small JSON blob in `expo-secure-store` (keychain on iOS, encrypted shared prefs on Android) — encrypted by the OS, but the credentials themselves are still plaintext on disk in `db/users.json`
- Full card numbers and CVVs are present in `db/cards.json` for the masking UI; nothing tokenized

**Before any production deployment**, expect to implement:

1. Hashed passwords (bcrypt / Argon2)
2. Real auth (OAuth 2.0 / OIDC or a hosted auth provider)
3. PCI-DSS tokenization for card data; AES-256 at rest; TLS 1.3 in transit
4. Real 2FA (TOTP/WebAuthn) and real biometric attestation
5. Server-side authorization, audit logging, anomaly detection, rate limiting
6. Compliance: PCI-DSS Level 1, SOC 2 Type II, GDPR/CCPA depending on jurisdiction

---

## 🛠️ Technical stack

| Surface              | Stack                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| `apps/web`           | React 18.3, TypeScript 5, Vite 6, Tailwind v4, shadcn/ui + Radix, MUI 7, motion (`motion/react`), Recharts, Lucide, Sonner, React Hook Form, React Router 7 |
| `apps/mobile`        | React 19, React Native 0.81, Expo SDK 54, Expo Router 6, `expo-secure-store`, `expo-linear-gradient`, `@expo/vector-icons` (Feather), plain `StyleSheet` |
| `packages/core`      | TypeScript only; tested with Vitest                                                                      |
| Tooling              | pnpm workspaces, ESLint v9 (flat config), Prettier 3, GitHub Actions CI                                  |
| "Database"           | JSON files in `db/`                                                                                      |

---

## 📱 Responsive design

The web SPA is optimized for desktop, laptop, tablet, and mobile (Safari/Chrome) viewports. It uses a hamburger menu in mobile widths and a persistent sidebar above the tablet breakpoint.

The **mobile app** is a separate, native experience (iOS / Android via Expo Go) — it is not the web SPA's responsive layout, it's its own Expo Router app under `apps/mobile/app/`.

---

## 🎯 UHNWI experience (Pierre Mvita) — what to look for

When signed in as `pmvita` on the **web** app:

1. Gold tier badge with crown / award icon and "Ultra High Net Worth" label
2. Greeting: "Welcome back, Pierre"
3. Victoria Sterling shown as relationship manager (on dashboard and in the `more` profile card on mobile)
4. Premium benefits card on the dashboard
5. Four accounts (Checking, Savings, Investment, Money Market) totaling $41.1M
6. Visa Infinite credit card with $500k limit and 156,789 rewards points + two debit cards (one of which is frozen)
7. High-value transactions (Tiffany & Co. -$45,678.99; Quarterly Dividend +$125,000; Four Seasons Bora Bora -$28,500; Le Bernardin -$850.50)
8. "Contact Team" quick action on the dashboard

On the **mobile** app, the experience is intentionally lighter — splash → login → dashboard hero with total balance, accounts/cards tabs, and a "More" stub for the rest.

---

## 📈 UHNWI portfolio metrics

**Composition (Pierre Mvita, USR-001):**

- Checking: ~7% ($2.85M)
- Savings: ~21% ($8.46M)
- Investment: ~60% ($24.57M)
- Money Market: ~12% ($5.23M)

**Credit profile:**

- Total credit limit: $500,000
- Available credit: $412,456.72
- Rewards points: 156,789
- Outstanding card balance: $87,543.28

(Numbers are taken verbatim from `db/accounts.json` and `db/cards.json`.)

---

## 🗺️ Roadmap

### Done

- Local JSON mock backend
- Web SPA with full screen surface (Dashboard, Accounts, Cards, Transfers, Bill Pay, Budgeting, Mobile Deposit, Settings)
- Per-user filtering across Cards, Bill Pay, Budgeting, Transfers
- Mobile companion app (Expo SDK 54, Expo Go compatible)
- Shared `@goldlink/core` package consumed by mobile
- ESLint v9 + Prettier + Vitest + GitHub Actions CI

### Planned

- Move `apps/web` onto `@goldlink/core` so types and accessors are shared (eliminates the local `(typeof cardsData)['cards'][number]` patterns)
- Re-enable Prettier on `apps/web` (currently ignored in `.prettierignore`)
- Fix the pre-existing `motion/react` `Variant` type errors so root `pnpm typecheck` can include `apps/web`
- Backfill the 3 outstanding `TODO: backfill` data fields
- Split `payees.json` into bill-pay payees vs wire recipients
- Wire mobile Transfers / Bill Pay / Deposit / Budgeting / Settings screens (currently placeholder)
- Real backend + auth + persistence

---

## 📞 Documentation map

- [`README.md`](README.md) — entry point, monorepo layout, scripts, caveats
- [`db/README.md`](db/README.md) — full database schema, tier definitions, integration examples
- [`packages/core/README.md`](packages/core/README.md) — shared package API surface
- [`apps/mobile/README.md`](apps/mobile/README.md) — Expo run instructions and demo credentials
- [`CHANGES_SUMMARY.md`](CHANGES_SUMMARY.md) — changelog of major reworks
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — quick reference for contributors

---

<div align="center">

**GoldLink Bank** — _Exceptional Banking for Exceptional People_

© 2026 GoldLink Bank. All data is fictional.

</div>
