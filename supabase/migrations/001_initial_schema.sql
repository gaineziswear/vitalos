-- ── VitalOS — Initial Supabase Schema ───────────────────────────────────────
-- Run this in the Supabase SQL editor for your project.

-- ── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Enums ────────────────────────────────────────────────────────────────────
create type tier as enum ('node', 'validator', 'staker', 'architect', 'protocol');
create type tier_status as enum ('active', 'trialing', 'expired', 'cancelled');

-- ── profiles ─────────────────────────────────────────────────────────────────
create table public.profiles (
  id                      uuid primary key references auth.users(id) on delete cascade,
  email                   text not null,
  display_name            text,
  avatar_url              text,
  tier                    tier not null default 'architect',
  tier_status             tier_status not null default 'trialing',
  trial_started_at        timestamptz default now(),
  trial_ends_at           timestamptz default (now() + interval '7 days'),
  subscription_id         text,
  subscription_period_end timestamptz,
  preferred_language      text not null default 'en' check (preferred_language in ('en','fr')),
  mode                    text not null default 'beginner' check (mode in ('beginner','professional')),
  onboarding_completed    boolean not null default false,
  capital_objective       text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table public.profiles enable row level security;

-- Users can read their own profile only
create policy "profiles: read own"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile only
create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Users can insert their own profile only (on sign-up)
create policy "profiles: insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ── Trigger: updated_at ───────────────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- ── Trigger: auto-create profile on auth.users insert ─────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  trial_end timestamptz := now() + interval '7 days';
begin
  insert into public.profiles (
    id, email, display_name, tier, tier_status,
    trial_started_at, trial_ends_at
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    'architect',
    'trialing',
    now(),
    trial_end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── capital_mandates ─────────────────────────────────────────────────────────
create table public.capital_mandates (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid not null references public.profiles(id) on delete cascade,
  name                  text not null default 'My Mandate',
  objective             text,
  liquidity             text,
  max_protocol_exposure numeric(5,2) default 10,
  max_chain_exposure    numeric(5,2) default 40,
  max_illiquid          numeric(5,2) default 20,
  max_leverage          numeric(5,2) default 0,
  experimental_budget   numeric(5,2) default 5,
  min_liquidity         numeric(5,2) default 80,
  min_yield_improvement numeric(5,2) default 1,
  is_active             boolean default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.capital_mandates enable row level security;

create policy "mandates: own"
  on public.capital_mandates for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── audit_logs ───────────────────────────────────────────────────────────────
create table public.audit_logs (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references public.profiles(id) on delete set null,
  action     text not null,
  object     text,
  meta       jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_logs enable row level security;

-- Only append — no update or delete by users
create policy "audit_logs: insert own"
  on public.audit_logs for insert
  with check (auth.uid() = user_id);

create policy "audit_logs: read own"
  on public.audit_logs for select
  using (auth.uid() = user_id);

-- ── Indexes ───────────────────────────────────────────────────────────────────
create index profiles_tier_idx on public.profiles(tier);
create index mandates_user_idx on public.capital_mandates(user_id);
create index audit_user_idx    on public.audit_logs(user_id, created_at desc);
