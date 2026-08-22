-- 观己实验室 · Supabase 数据库初始化
-- 在 Supabase 控制台 → SQL Editor 中运行本文件

-- 用户档案（含命盘）
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 测试历史（含深度解读存档）
create table if not exists public.test_results (
  user_id uuid primary key references auth.users(id) on delete cascade,
  history jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- 成长记录（成长轨迹 / 日记 / 三十天）
create table if not exists public.growth_records (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id, kind)
);

-- 行级安全：每行只允许本人读写
alter table public.profiles enable row level security;
alter table public.test_results enable row level security;
alter table public.growth_records enable row level security;

create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "test_results_own" on public.test_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "growth_records_own" on public.growth_records
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 新建用户时自动创建空档案
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, data)
  values (new.id, jsonb_build_object('email', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
