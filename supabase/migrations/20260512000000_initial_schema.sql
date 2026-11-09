-- GoldLink Bank — initial schema.
--
-- Mirrors the shape of db/*.json. Money columns use numeric(15,2) so we
-- never lose cents to floating-point drift; ISO timestamps are stored as
-- timestamptz; nested objects (addresses, preferences, recurring payment
-- schedules) ride along as jsonb.
--
-- Primary keys are uuids. The seed script (`supabase/scripts/generate-seed.mjs`)
-- maps the legacy "USR-001"/"ACC-001-CHK"/etc. ids to deterministic uuid v5
-- values so foreign-key relationships survive the JSON -> Postgres jump.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helper: updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Reference data
-- ---------------------------------------------------------------------------

create table public.tiers (
  tier text primary key check (
    tier in ('standard', 'premium', 'platinum', 'private', 'ultra_high_net_worth')
  ),
  name text not null,
  min_balance numeric(15, 2) not null,
  max_balance numeric(15, 2),
  benefits text[] not null default '{}',
  fees jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger tiers_set_updated_at
before update on public.tiers
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Users
-- ---------------------------------------------------------------------------

create table public.users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  -- Plaintext password column mirrors the JSON fixtures. Once Supabase Auth
  -- is the source of truth this column becomes vestigial and should be
  -- dropped. Leaving it nullable so future signups via supabase.auth can
  -- skip it.
  password text,
  first_name text not null,
  last_name text not null,
  full_name text not null,
  email text not null unique,
  phone text not null,
  tier text not null references public.tiers (tier) on update cascade,
  tier_name text not null,
  relationship_manager text,
  relationship_manager_phone text,
  member_since date not null,
  date_of_birth date not null,
  address jsonb not null,
  preferences jsonb not null,
  last_login timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index users_tier_idx on public.users (tier);

create trigger users_set_updated_at
before update on public.users
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Accounts
-- ---------------------------------------------------------------------------

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  account_number text not null,
  routing_number text not null,
  type text not null check (
    type in ('checking', 'savings', 'investment', 'money_market')
  ),
  name text not null,
  balance numeric(15, 2) not null default 0,
  currency text not null default 'USD',
  status text not null check (status in ('active', 'frozen', 'closed')),
  opened_date date not null,
  interest_rate numeric(6, 4),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index accounts_user_id_idx on public.accounts (user_id);
create index accounts_type_idx on public.accounts (type);

create trigger accounts_set_updated_at
before update on public.accounts
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Cards
-- ---------------------------------------------------------------------------

create table public.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  account_id uuid not null references public.accounts (id) on delete cascade,
  card_number text not null,
  last_four text not null,
  type text not null check (type in ('credit', 'debit')),
  network text not null,
  name text not null,
  status text not null check (status in ('active', 'frozen', 'closed')),
  expiry_date text not null,
  -- Plaintext cvv mirrors the JSON fixtures. NEVER do this in production.
  cvv text not null,
  credit_limit numeric(15, 2),
  balance numeric(15, 2),
  available_credit numeric(15, 2),
  rewards_points integer,
  issued_date date not null,
  billing_cycle integer,
  next_payment_due date,
  minimum_payment numeric(15, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index cards_user_id_idx on public.cards (user_id);
create index cards_account_id_idx on public.cards (account_id);

create trigger cards_set_updated_at
before update on public.cards
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Transactions
-- ---------------------------------------------------------------------------

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  account_id uuid not null references public.accounts (id) on delete cascade,
  card_id uuid references public.cards (id) on delete set null,
  type text not null check (type in ('debit', 'credit')),
  category text not null,
  merchant text not null,
  description text not null,
  amount numeric(15, 2) not null,
  balance numeric(15, 2) not null,
  date timestamptz not null,
  status text not null check (status in ('completed', 'pending', 'failed')),
  location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index transactions_user_id_idx on public.transactions (user_id);
create index transactions_account_id_idx on public.transactions (account_id);
create index transactions_card_id_idx on public.transactions (card_id);
create index transactions_date_idx on public.transactions (date desc);

create trigger transactions_set_updated_at
before update on public.transactions
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Payees
-- ---------------------------------------------------------------------------

create table public.payees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  account_number text not null,
  category text not null,
  default_amount numeric(15, 2) not null,
  recurring_payment jsonb not null,
  last_payment jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index payees_user_id_idx on public.payees (user_id);

create trigger payees_set_updated_at
before update on public.payees
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Budgets + categories + savings goals
-- ---------------------------------------------------------------------------

create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users (id) on delete cascade,
  monthly_budget numeric(15, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger budgets_set_updated_at
before update on public.budgets
for each row execute function public.set_updated_at();

create table public.budget_categories (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references public.budgets (id) on delete cascade,
  name text not null,
  budget numeric(15, 2) not null default 0,
  spent numeric(15, 2) not null default 0,
  color text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index budget_categories_budget_id_idx on public.budget_categories (budget_id);

create trigger budget_categories_set_updated_at
before update on public.budget_categories
for each row execute function public.set_updated_at();

create table public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references public.budgets (id) on delete cascade,
  name text not null,
  target numeric(15, 2) not null default 0,
  current numeric(15, 2) not null default 0,
  color text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index savings_goals_budget_id_idx on public.savings_goals (budget_id);

create trigger savings_goals_set_updated_at
before update on public.savings_goals
for each row execute function public.set_updated_at();
