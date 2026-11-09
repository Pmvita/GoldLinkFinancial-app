-- GoldLink Bank — Row-Level Security baseline.
--
-- IMPORTANT: These policies assume `auth.uid()` matches `public.users.id` —
-- i.e. Supabase Auth users and our application users share the same uuid.
-- The seed script derives `public.users.id` from the legacy "USR-XXX" id
-- deterministically; once you wire the apps to Supabase Auth you will need
-- to either:
--   (a) recreate Supabase Auth users with the same uuids (recommended for
--       the demo accounts), or
--   (b) replace these policies with a mapping table (auth.uid() ->
--       public.users.id) and update both layers in lockstep.
--
-- Treat this file as a STARTING POINT. Review every policy before exposing
-- the database to anything resembling real users or real money.

-- ---------------------------------------------------------------------------
-- Enable RLS everywhere
-- ---------------------------------------------------------------------------

alter table public.tiers enable row level security;
alter table public.users enable row level security;
alter table public.accounts enable row level security;
alter table public.cards enable row level security;
alter table public.transactions enable row level security;
alter table public.payees enable row level security;
alter table public.budgets enable row level security;
alter table public.budget_categories enable row level security;
alter table public.savings_goals enable row level security;

-- ---------------------------------------------------------------------------
-- Tiers: read-only reference data, visible to any authenticated user.
-- ---------------------------------------------------------------------------

create policy "Authenticated users can read tiers"
on public.tiers
for select
to authenticated
using (true);

-- ---------------------------------------------------------------------------
-- Users: each row is visible / mutable only by the matching auth.uid().
-- ---------------------------------------------------------------------------

create policy "Users can view their own profile"
on public.users
for select
to authenticated
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.users
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can insert their own profile"
on public.users
for insert
to authenticated
with check (auth.uid() = id);

-- NOTE: no DELETE policy on users — deletion happens via the auth admin API
-- or a server-side function. Add one explicitly if the product needs it.

-- ---------------------------------------------------------------------------
-- Accounts
-- ---------------------------------------------------------------------------

create policy "Users can view their own accounts"
on public.accounts
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own accounts"
on public.accounts
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own accounts"
on public.accounts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own accounts"
on public.accounts
for delete
to authenticated
using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Cards
-- ---------------------------------------------------------------------------

create policy "Users can view their own cards"
on public.cards
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own cards"
on public.cards
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own cards"
on public.cards
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own cards"
on public.cards
for delete
to authenticated
using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Transactions
-- ---------------------------------------------------------------------------

create policy "Users can view their own transactions"
on public.transactions
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
on public.transactions
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
on public.transactions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own transactions"
on public.transactions
for delete
to authenticated
using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Payees
-- ---------------------------------------------------------------------------

create policy "Users can view their own payees"
on public.payees
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own payees"
on public.payees
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own payees"
on public.payees
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own payees"
on public.payees
for delete
to authenticated
using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Budgets
-- ---------------------------------------------------------------------------

create policy "Users can view their own budget"
on public.budgets
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own budget"
on public.budgets
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own budget"
on public.budgets
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own budget"
on public.budgets
for delete
to authenticated
using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Budget categories — scoped to the owning budget's user.
-- ---------------------------------------------------------------------------

create policy "Users can view their own budget categories"
on public.budget_categories
for select
to authenticated
using (
  exists (
    select 1 from public.budgets b
    where b.id = budget_categories.budget_id
      and b.user_id = auth.uid()
  )
);

create policy "Users can insert their own budget categories"
on public.budget_categories
for insert
to authenticated
with check (
  exists (
    select 1 from public.budgets b
    where b.id = budget_categories.budget_id
      and b.user_id = auth.uid()
  )
);

create policy "Users can update their own budget categories"
on public.budget_categories
for update
to authenticated
using (
  exists (
    select 1 from public.budgets b
    where b.id = budget_categories.budget_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.budgets b
    where b.id = budget_categories.budget_id
      and b.user_id = auth.uid()
  )
);

create policy "Users can delete their own budget categories"
on public.budget_categories
for delete
to authenticated
using (
  exists (
    select 1 from public.budgets b
    where b.id = budget_categories.budget_id
      and b.user_id = auth.uid()
  )
);

-- ---------------------------------------------------------------------------
-- Savings goals — same pattern as budget categories.
-- ---------------------------------------------------------------------------

create policy "Users can view their own savings goals"
on public.savings_goals
for select
to authenticated
using (
  exists (
    select 1 from public.budgets b
    where b.id = savings_goals.budget_id
      and b.user_id = auth.uid()
  )
);

create policy "Users can insert their own savings goals"
on public.savings_goals
for insert
to authenticated
with check (
  exists (
    select 1 from public.budgets b
    where b.id = savings_goals.budget_id
      and b.user_id = auth.uid()
  )
);

create policy "Users can update their own savings goals"
on public.savings_goals
for update
to authenticated
using (
  exists (
    select 1 from public.budgets b
    where b.id = savings_goals.budget_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.budgets b
    where b.id = savings_goals.budget_id
      and b.user_id = auth.uid()
  )
);

create policy "Users can delete their own savings goals"
on public.savings_goals
for delete
to authenticated
using (
  exists (
    select 1 from public.budgets b
    where b.id = savings_goals.budget_id
      and b.user_id = auth.uid()
  )
);
