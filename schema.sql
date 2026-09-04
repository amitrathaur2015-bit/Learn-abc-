-- ============================================================================
-- Chhota Scholar - Part 3 Supabase schema
-- Run this once in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- Safe to re-run: everything uses IF NOT EXISTS / OR REPLACE.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- Helper: updated_at trigger
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================================
-- 1. PROFILES (parent/user accounts) - one row per auth.users row
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'parent' check (role in ('parent', 'admin')),
  referral_code text unique,
  referred_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile row (with a referral code) whenever someone signs up.
-- referred_by is read from the signup call's options.data.referred_by if present.
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_code text;
  ref_by uuid;
begin
  new_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 7));
  begin
    ref_by := (new.raw_user_meta_data->>'referred_by')::uuid;
  exception when others then
    ref_by := null;
  end;

  insert into public.profiles (id, email, full_name, referral_code, referred_by)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new_code, ref_by)
  on conflict (id) do nothing;

  if ref_by is not null and ref_by <> new.id then
    insert into public.referrals (referrer_id, referred_id, status)
    values (ref_by, new.id, 'pending')
    on conflict (referred_id) do nothing;
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- true if the calling user's profile has role = 'admin'
create or replace function public.is_admin()
returns boolean as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$ language sql security definer stable;

alter table public.profiles enable row level security;

drop policy if exists "profiles self select" on public.profiles;
create policy "profiles self select" on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

-- ============================================================================
-- 2. CHILD PROFILES
-- ============================================================================
create table if not exists public.child_profiles (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  avatar_emoji text default '🧒',
  created_at timestamptz not null default now()
);

alter table public.child_profiles enable row level security;

drop policy if exists "child profiles owner all" on public.child_profiles;
create policy "child profiles owner all" on public.child_profiles for all
  using (parent_id = auth.uid() or public.is_admin())
  with check (parent_id = auth.uid());

-- ============================================================================
-- 3. CONTENT REFERENCE TABLES (subjects, levels, lessons, writing, quizzes, games)
-- ============================================================================
create table if not exists public.subjects (
  id text primary key,
  title text not null,
  emoji text,
  sort_order int default 0
);

create table if not exists public.classes_levels (
  id text primary key,
  title text not null,
  sort_order int default 0
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  subject_id text references public.subjects(id),
  level_id text references public.classes_levels(id),
  title text not null,
  description text,
  image_url text,
  audio_url text,
  is_premium boolean not null default false,
  is_published boolean not null default false,
  sort_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists lessons_set_updated_at on public.lessons;
create trigger lessons_set_updated_at before update on public.lessons
  for each row execute function public.set_updated_at();

create table if not exists public.writing_templates (
  id text primary key,               -- e.g. 'A', '7', matches the app's CharacterTemplate id
  subject text not null check (subject in ('english', 'hindi', 'numbers')),
  label text not null,
  difficulty int default 1,
  is_published boolean not null default true
);

create table if not exists public.tracing_paths (
  id uuid primary key default gen_random_uuid(),
  template_id text not null references public.writing_templates(id) on delete cascade,
  stroke_order int not null default 0,
  path_d text not null,
  start_x numeric not null,
  start_y numeric not null
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons(id) on delete set null,
  subject_id text references public.subjects(id),
  level_id text references public.classes_levels(id),
  title text not null,
  is_premium boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  prompt text not null,
  options jsonb not null,           -- [{id, label, emoji?}, ...]
  correct_option_id text not null,
  sort_order int default 0
);

create table if not exists public.games (
  id text primary key,               -- e.g. 'letter-picture'
  title text not null,
  emoji text,
  engine text not null,
  description text,
  is_premium boolean not null default false,
  is_published boolean not null default true
);

alter table public.subjects enable row level security;
alter table public.classes_levels enable row level security;
alter table public.lessons enable row level security;
alter table public.writing_templates enable row level security;
alter table public.tracing_paths enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.games enable row level security;

drop policy if exists "subjects public read" on public.subjects;
create policy "subjects public read" on public.subjects for select using (true);
drop policy if exists "subjects admin write" on public.subjects;
create policy "subjects admin write" on public.subjects for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "levels public read" on public.classes_levels;
create policy "levels public read" on public.classes_levels for select using (true);
drop policy if exists "levels admin write" on public.classes_levels;
create policy "levels admin write" on public.classes_levels for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "lessons public read" on public.lessons;
create policy "lessons public read" on public.lessons for select using (is_published or public.is_admin());
drop policy if exists "lessons admin write" on public.lessons;
create policy "lessons admin write" on public.lessons for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "writing templates public read" on public.writing_templates;
create policy "writing templates public read" on public.writing_templates for select using (is_published or public.is_admin());
drop policy if exists "writing templates admin write" on public.writing_templates;
create policy "writing templates admin write" on public.writing_templates for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "tracing paths public read" on public.tracing_paths;
create policy "tracing paths public read" on public.tracing_paths for select using (true);
drop policy if exists "tracing paths admin write" on public.tracing_paths;
create policy "tracing paths admin write" on public.tracing_paths for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "quizzes public read" on public.quizzes;
create policy "quizzes public read" on public.quizzes for select using (is_published or public.is_admin());
drop policy if exists "quizzes admin write" on public.quizzes;
create policy "quizzes admin write" on public.quizzes for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "quiz questions public read" on public.quiz_questions;
create policy "quiz questions public read" on public.quiz_questions for select using (true);
drop policy if exists "quiz questions admin write" on public.quiz_questions;
create policy "quiz questions admin write" on public.quiz_questions for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "games public read" on public.games;
create policy "games public read" on public.games for select using (is_published or public.is_admin());
drop policy if exists "games admin write" on public.games;
create policy "games admin write" on public.games for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- 4. PROGRESS, BADGES, REWARDS
-- ============================================================================
create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.child_profiles(id) on delete cascade,
  activity_type text not null check (activity_type in ('writing', 'quiz', 'game')),
  subject_id text,
  ref_id text,                       -- letter/number id, quiz id, or game id
  level int,
  correct boolean,
  stars_earned int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.badges (
  id text primary key,
  title text not null,
  emoji text,
  description text
);

create table if not exists public.child_badges (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.child_profiles(id) on delete cascade,
  badge_id text not null references public.badges(id),
  earned_at timestamptz not null default now(),
  unique (child_id, badge_id)
);

alter table public.progress enable row level security;
alter table public.badges enable row level security;
alter table public.child_badges enable row level security;

drop policy if exists "progress owner all" on public.progress;
create policy "progress owner all" on public.progress for all
  using (
    public.is_admin() or
    exists (select 1 from public.child_profiles c where c.id = progress.child_id and c.parent_id = auth.uid())
  )
  with check (
    exists (select 1 from public.child_profiles c where c.id = progress.child_id and c.parent_id = auth.uid())
  );

drop policy if exists "badges public read" on public.badges;
create policy "badges public read" on public.badges for select using (true);
drop policy if exists "badges admin write" on public.badges;
create policy "badges admin write" on public.badges for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "child badges owner all" on public.child_badges;
create policy "child badges owner all" on public.child_badges for all
  using (
    public.is_admin() or
    exists (select 1 from public.child_profiles c where c.id = child_badges.child_id and c.parent_id = auth.uid())
  )
  with check (
    exists (select 1 from public.child_profiles c where c.id = child_badges.child_id and c.parent_id = auth.uid())
  );

-- ============================================================================
-- 5. USAGE EVENTS (server-side free-limit tracking)
-- ============================================================================
create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles(id) on delete cascade,
  child_id uuid references public.child_profiles(id) on delete set null,
  activity_type text not null,       -- 'writing' | 'quiz' | 'game'
  created_at timestamptz not null default now()
);

alter table public.usage_events enable row level security;

drop policy if exists "usage events owner all" on public.usage_events;
create policy "usage events owner all" on public.usage_events for all
  using (parent_id = auth.uid() or public.is_admin())
  with check (parent_id = auth.uid());

-- Counts this parent's meaningful learning activities in the last 30 days.
-- SECURITY DEFINER so it can be called safely from the client via RPC -
-- it only ever counts the calling user's own rows (auth.uid()).
create or replace function public.count_recent_usage(p_days int default 30)
returns int as $$
  select count(*)::int from public.usage_events
  where parent_id = auth.uid()
    and created_at > now() - (p_days || ' days')::interval;
$$ language sql security definer stable;

-- ============================================================================
-- 6. SUBSCRIPTIONS & PAYMENTS (write access is service-role / edge-function only)
-- ============================================================================
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles(id) on delete cascade,
  plan text not null check (plan in ('monthly', 'yearly')),
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id),
  provider text not null,
  provider_payment_id text unique,
  amount numeric not null,
  currency text not null default 'INR',
  status text not null default 'pending' check (status in ('pending', 'verified', 'failed')),
  created_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;

-- Parents can only ever READ their own subscription/payment rows.
-- INSERT/UPDATE happens exclusively inside the verify-payment edge function
-- using the service-role key, which bypasses RLS - there is deliberately no
-- policy here that lets the client write these tables directly.
drop policy if exists "subscriptions owner read" on public.subscriptions;
create policy "subscriptions owner read" on public.subscriptions for select
  using (parent_id = auth.uid() or public.is_admin());

drop policy if exists "payments owner read" on public.payments;
create policy "payments owner read" on public.payments for select
  using (parent_id = auth.uid() or public.is_admin());

-- true if the calling user currently has an active, non-expired subscription
create or replace function public.has_active_subscription()
returns boolean as $$
  select exists (
    select 1 from public.subscriptions
    where parent_id = auth.uid() and status = 'active' and expires_at > now()
  );
$$ language sql security definer stable;

-- ============================================================================
-- 7. REFERRALS
-- ============================================================================
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles(id) on delete cascade,
  referred_id uuid not null unique references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'qualified', 'rewarded')),
  created_at timestamptz not null default now()
);

create table if not exists public.referral_rewards (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid not null references public.referrals(id) on delete cascade,
  parent_id uuid not null references public.profiles(id) on delete cascade,
  reward_type text not null,
  reward_value numeric not null,
  granted_at timestamptz not null default now(),
  unique (referral_id, parent_id)
);

alter table public.referrals enable row level security;
alter table public.referral_rewards enable row level security;

drop policy if exists "referrals participant read" on public.referrals;
create policy "referrals participant read" on public.referrals for select
  using (referrer_id = auth.uid() or referred_id = auth.uid() or public.is_admin());

drop policy if exists "referral rewards owner read" on public.referral_rewards;
create policy "referral rewards owner read" on public.referral_rewards for select
  using (parent_id = auth.uid() or public.is_admin());

-- Referral rows themselves are inserted by the handle_new_user trigger
-- (security definer) at signup time - not directly writable by the client.
-- Qualification/reward-granting happens in the process-referral edge
-- function using the service-role key, per the anti-fraud rules below.

-- ============================================================================
-- 8. MONETIZATION / AD / ADMIN SETTINGS (singleton rows, DB-driven)
-- ============================================================================
create table if not exists public.monetization_settings (
  id int primary key default 1,
  ads_enabled boolean not null default false,
  paid_system_enabled boolean not null default false,
  referral_enabled boolean not null default true,
  free_limit_enabled boolean not null default true,
  free_limit_count int not null default 15,
  monthly_price numeric not null default 99,
  yearly_price numeric not null default 799,
  currency text not null default 'INR',
  referral_reward_type text not null default 'free_days',
  referral_reward_value numeric not null default 7,
  referral_max_reward numeric not null default 90,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into public.monetization_settings (id) values (1) on conflict (id) do nothing;

create table if not exists public.ad_settings (
  id int primary key default 1,
  provider text default 'none',
  ad_unit_id text,
  home_page_ads boolean not null default false,
  subject_page_ads boolean not null default false,
  games_ads boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into public.ad_settings (id) values (1) on conflict (id) do nothing;

-- Part 4: if ad_settings already existed from an earlier run of this file
-- (before the placement columns existed), add them now without losing data.
alter table public.ad_settings add column if not exists home_page_ads boolean not null default false;
alter table public.ad_settings add column if not exists subject_page_ads boolean not null default false;
alter table public.ad_settings add column if not exists games_ads boolean not null default false;

create table if not exists public.admin_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.monetization_settings enable row level security;
alter table public.ad_settings enable row level security;
alter table public.admin_settings enable row level security;

drop policy if exists "monetization public read" on public.monetization_settings;
create policy "monetization public read" on public.monetization_settings for select using (true);
drop policy if exists "monetization admin write" on public.monetization_settings;
create policy "monetization admin write" on public.monetization_settings for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "ad settings public read" on public.ad_settings;
create policy "ad settings public read" on public.ad_settings for select using (true);
drop policy if exists "ad settings admin write" on public.ad_settings;
create policy "ad settings admin write" on public.ad_settings for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin settings admin all" on public.admin_settings;
create policy "admin settings admin all" on public.admin_settings for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- 9. SEED: badges catalog (matches src/data/rewardsContent.ts)
-- ============================================================================
insert into public.badges (id, title, emoji, description) values
  ('writing-star', 'Writing Star', '⭐', 'Completed 10 writing activities'),
  ('abc-champion', 'ABC Champion', '🏆', 'Traced every available letter'),
  ('number-star', 'Number Star', '🔢', 'Traced every available number'),
  ('quiz-whiz', 'Quiz Whiz', '🧠', 'Answered 20 quiz questions correctly')
on conflict (id) do nothing;

-- ============================================================================
-- DONE. To create your first admin:
--   1. Register normally in the app (Parent Area -> Create Account).
--   2. In SQL Editor, run:
--        update public.profiles set role = 'admin' where email = 'you@example.com';
-- ============================================================================
