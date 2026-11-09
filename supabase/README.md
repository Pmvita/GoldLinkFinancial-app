# Supabase — GoldLink Bank backend

This directory holds everything the [Supabase CLI](https://supabase.com/docs/guides/local-development) needs to run a local Postgres + Auth + Studio stack for GoldLink Bank.

Today it is **opt-in**: the apps still default to `db/*.json`. Flip them onto a real database when you're ready — see the [one-command playbook](#-one-command-flip-to-supabase) below.

---

## 📦 Layout

```text
supabase/
├── config.toml                  # local CLI config (ports, auth, etc.)
├── migrations/
│   ├── 20260512000000_initial_schema.sql   # tables + indexes + triggers
│   └── 20260512000001_rls_policies.sql     # baseline Row-Level Security
├── scripts/
│   └── generate-seed.mjs        # regenerate seed.sql from db/*.json
├── seed.sql                     # generated demo data (commit alongside the script)
└── README.md                    # this file
```

---

## 🔧 One-time install

### 1. Install the Supabase CLI

The CLI ships as a standalone binary — **not** as an npm package. Use Homebrew on macOS:

```bash
brew install supabase/tap/supabase
```

Or follow the [official install docs](https://supabase.com/docs/guides/local-development/cli/getting-started) for Linux/Windows.

### 2. Make sure Docker is running

The CLI spins up Postgres + Studio + Auth + Inbucket in Docker. If `docker info` fails, install Docker Desktop first.

### 3. Pull dependencies

```bash
pnpm install
```

`@supabase/supabase-js` is already a dependency of `@goldlink/core`. No app-level deps need adding.

---

## ⚡ One-command flip to Supabase

From the repo root:

```bash
pnpm db:setup
```

That chains:

1. `supabase start`            — boots Postgres (54322), API (54321), Studio (54323), Inbucket (54324)
2. `supabase migration up`     — applies both migrations
3. `psql … -f supabase/seed.sql` — loads the demo data (idempotent — re-runnable)

When the command finishes, Studio is at <http://127.0.0.1:54323> and the API at <http://127.0.0.1:54321>.

To switch the apps from JSON to Supabase, add this to `.env.local` at the repo root (see [`.env.example`](../.env.example)):

```bash
GOLDLINK_DATA_MODE=supabase
GOLDLINK_AUTH_MODE=supabase
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=<value from `supabase status`>
```

Restart `pnpm dev` / Expo. The repository + auth factories now resolve to the Supabase-backed implementations.

> Each Vite/Expo runtime has its own env-var convention (`VITE_*`, `EXPO_PUBLIC_*`). The apps decide how to plumb these values into `createRepositories({ mode, supabaseUrl, supabaseAnonKey })` — `@goldlink/core` only reads `process.env.GOLDLINK_*` directly when called from Node scripts and tests.

---

## 🧰 Day-to-day scripts

All registered in the root `package.json`:

| Command                       | Effect                                                       |
| ----------------------------- | ------------------------------------------------------------ |
| `pnpm db:start`               | `supabase start`                                             |
| `pnpm db:stop`                | `supabase stop`                                              |
| `pnpm db:reset`               | `supabase db reset` (drops everything, re-runs migrations + seed) |
| `pnpm db:migrate`             | `supabase migration up`                                      |
| `pnpm db:seed`                | re-load `supabase/seed.sql` against the running DB           |
| `pnpm db:setup`               | start → migrate → seed (the "flip" command)                  |
| `pnpm db:regenerate-seed`     | regenerate `supabase/seed.sql` from `db/*.json`              |

The seed script needs `SUPABASE_DB_URL`. The default in `.env.example` (`postgresql://postgres:postgres@localhost:54322/postgres`) matches `supabase start` out of the box.

---

## 🗂 Schema overview

`20260512000000_initial_schema.sql` creates:

- **`tiers`** — reference data (`standard`, `premium`, `platinum`, `private`, `ultra_high_net_worth`). Benefits as `text[]`, fees as `jsonb`.
- **`users`** — profile + preferences (`jsonb`) + address (`jsonb`). `id` is uuid. `tier` FKs to `tiers`.
- **`accounts`** — `user_id` FK to users. Money columns are `numeric(15,2)`.
- **`cards`** — `user_id` + `account_id` FKs. Includes plaintext `card_number`/`cvv` to mirror the JSON fixtures (do not do this in production).
- **`transactions`** — `user_id` + `account_id` + nullable `card_id`. Indexed by `(date desc)` for the activity feeds.
- **`payees`** — `user_id` FK. `recurring_payment` and `last_payment` as `jsonb`.
- **`budgets`** — one per user (`user_id` is unique).
- **`budget_categories`** — many per budget.
- **`savings_goals`** — many per budget.

Every table has `created_at` / `updated_at` `timestamptz` columns with a shared `set_updated_at` trigger.

---

## 🔐 Row-Level Security

`20260512000001_rls_policies.sql` enables RLS on every table and installs a baseline "users can only touch their own rows" set of policies (`auth.uid() = user_id`). `budget_categories` and `savings_goals` are scoped via the owning budget. `tiers` is readable by any authenticated user.

> ⚠️ These policies assume Supabase Auth users have the **same uuid** as `public.users.id`. The seed script derives `public.users.id` deterministically from the legacy `USR-XXX` ids, so you can recreate the demo accounts in Supabase Auth with matching uuids. For real users, replace the equality check with whatever mapping you adopt (e.g. an `auth_user_id` column).

Treat the policy file as a **starting point**. Review every policy before any production traffic touches the DB.

---

## 🌱 Seed regeneration

`db/*.json` remains the canonical source for demo data. If you tweak it, regenerate the seed:

```bash
pnpm db:regenerate-seed
```

The script (`supabase/scripts/generate-seed.mjs`) maps each legacy id (`USR-001`, `ACC-001-CHK`, …) to a deterministic uuid v5 via `sha1("goldlink-bank:" + legacyId)`. The mapping is stable across runs, so foreign keys survive the JSON → Postgres translation.

Re-running `pnpm db:seed` after a regeneration is safe — every INSERT uses `on conflict (...) do nothing`.

---

## 🚦 Verifying without connecting

You can sanity-check the migrations syntactically without running them:

```bash
psql --version                                 # CLI installed?
psql -d 'host=localhost' -f supabase/migrations/20260512000000_initial_schema.sql --variable=ON_ERROR_STOP=on --echo-all
```

The above will obviously fail to connect when there's no DB up — that's fine, the syntax errors (if any) surface before connection retries.
