# GoldLink Bank — architecture

> Companion to [`supabase/README.md`](../supabase/README.md). Read this first
> for the high-level shape; read the Supabase README for the operational
> playbook.

## The two abstractions

Two interfaces sit between the apps and any concrete data/auth backend, both
living in `@goldlink/core`:

```text
                       ┌─────────────────────────────────────┐
                       │  apps/web  (React 18 + Vite)        │
                       │  apps/mobile  (Expo SDK 54)         │
                       └─────────────────┬───────────────────┘
                                         │ imports @goldlink/core
                                         ▼
        ┌───────────────────────────────────────────────────────────┐
        │ @goldlink/core                                            │
        │                                                           │
        │   ┌──────────────────────┐   ┌──────────────────────┐    │
        │   │  Repositories        │   │  AuthProvider        │    │
        │   │  (interfaces)        │   │  (interface)         │    │
        │   │   users, accounts,   │   │   sign-in / sign-up  │    │
        │   │   transactions,      │   │   OTP                │    │
        │   │   cards, payees,     │   │   sessions           │    │
        │   │   budgets            │   │                      │    │
        │   └──────────┬───────────┘   └──────────┬───────────┘    │
        │              │                          │                │
        │      ┌───────┴────────┐        ┌────────┴───────┐        │
        │      │                │        │                │        │
        │      ▼                ▼        ▼                ▼        │
        │  ┌────────┐      ┌─────────┐ ┌───────────┐ ┌──────────┐  │
        │  │ Json   │      │ Supabase│ │ Simulated │ │ Supabase │  │
        │  │ repos  │      │ repos   │ │ auth      │ │ auth     │  │
        │  └───┬────┘      └────┬────┘ └─────┬─────┘ └────┬─────┘  │
        │      │                │            │            │        │
        └──────┼────────────────┼────────────┼────────────┼────────┘
               │                │            │            │
               ▼                ▼            ▼            ▼
         db/*.json     Supabase Postgres   in-memory   Supabase Auth
        (read once,     (real persistence) session       (real JWT,
         mutate          + RLS              cache         email/SMS OTP)
         in-memory)
```

Picking a backend happens at app startup via two factories:

```ts
import { createRepositories, createAuthProvider } from '@goldlink/core';

const repos = createRepositories({
  mode: process.env.GOLDLINK_DATA_MODE === 'supabase' ? 'supabase' : 'json',
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
});

const auth = createAuthProvider({
  mode: process.env.GOLDLINK_AUTH_MODE === 'supabase' ? 'supabase' : 'simulated',
  repos,
  supabaseClient, // only required in supabase mode
});
```

## Reads vs writes today

| Surface                | Reads                         | Writes                                                       |
| ---------------------- | ----------------------------- | ------------------------------------------------------------ |
| `JsonRepository.*`     | ✅ from `db/*.json`           | ⚠️ mutate an in-memory copy of the JSON. **Lost on reload.** |
| `SupabaseRepository.*` | ✅ from Postgres (real)       | ✅ real (compiles today; not exercised end-to-end yet)       |
| `SimulatedAuthProvider`| ✅ via UserRepository         | ⚠️ session cached in memory; "OTP" accepts any 6 digits      |
| `SupabaseAuthProvider` | ✅ via `supabase.auth.*`      | ✅ real (compiling stub; full flows need wiring)             |

So with JSON mode the apps now have **session-scoped persistence** — transfers, payee adds, budget edits all stick until the page is reloaded — but no durable backing store.

## The "flip"

With the abstraction in place, switching every app onto a real database is a single command + two env vars:

```bash
pnpm db:setup      # boot Supabase, apply migrations, load seed.sql
```

```ini
# .env.local
GOLDLINK_DATA_MODE=supabase
GOLDLINK_AUTH_MODE=supabase
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=<supabase status output>
```

Restart `pnpm dev` / Expo and the factories now resolve to the Supabase-backed implementations. No application code changes. See [`supabase/README.md`](../supabase/README.md) for the operational details.

## Module map

```text
packages/core/src/
├── types.ts                 # domain types (User, Account, ...)
├── format.ts                # formatters (no change)
├── data.ts                  # legacy synchronous accessors (THIN WRAPPER
│                            #   over jsonStore — back-compat only)
├── repositories/
│   ├── types.ts             # UserRepository, AccountRepository, ...
│   ├── jsonStore.ts         # shared in-memory copy of db/*.json
│   ├── json.ts              # JsonRepository implementations
│   ├── supabase.ts          # SupabaseRepository implementations
│   ├── mappers.ts           # row <-> domain helpers
│   ├── factory.ts           # createRepositories(), resolveDefaultMode()
│   └── index.ts             # public re-exports
└── auth/
    ├── types.ts             # AuthProvider, AuthSession
    ├── simulated.ts         # SimulatedAuthProvider (JSON-backed)
    ├── supabase.ts          # SupabaseAuthProvider (compiling stub)
    ├── factory.ts           # createAuthProvider()
    └── index.ts             # public re-exports

supabase/
├── config.toml
├── migrations/
│   ├── 20260512000000_initial_schema.sql
│   └── 20260512000001_rls_policies.sql
├── scripts/
│   └── generate-seed.mjs    # regenerates seed.sql from db/*.json
└── seed.sql                 # generated, committed
```

## Caveats

- `SupabaseRepository.*` compiles cleanly but has not been exercised against a live Supabase instance. The first real run is likely to surface column-name typos and rows-as-strings (numeric columns serialize as strings via PostgREST by default — `mappers.ts` already handles that, but the assumption is untested).
- `SupabaseAuthProvider.verifyOtp` is intentionally a `throw` — the Supabase flavour of OTP needs to know the email/phone the code was issued for, which the `AuthProvider` interface doesn't currently carry. Extend the interface (`verifyOtp(input: { code: string; email?: string; phone?: string })`) when you wire the Supabase flow up.
- The RLS policies assume `auth.uid() === public.users.id`. The seed script derives `users.id` deterministically from the legacy `USR-XXX` ids — recreate Supabase Auth users with matching uuids for the demo accounts, or rewrite the policies to use a mapping table.
- `JsonRepository.create*` mutations are in-memory only. Reloading the SPA or restarting Metro reverts everything to the on-disk JSON. This is documented in `packages/core/src/repositories/jsonStore.ts`.
- The legacy `data.ts` accessors are kept synchronous for back-compat; new code should consume the async `Repositories` instead.
