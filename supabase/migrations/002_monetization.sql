-- 观己实验室 · 变现数据表（埋点 / 权益 / 分享登记）
-- 在 Supabase 控制台 → SQL Editor 中运行本文件（001 之后执行）

-- 行为埋点：允许匿名写入，不允许读取（保护隐私）
create table if not exists public.events (
  id bigint generated always as identity primary key,
  event text not null,
  quiz_key text,
  page text,
  data jsonb not null default '{}'::jsonb,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "events_anon_insert" on public.events
  for insert to anon, authenticated
  with check (true);

-- 权益：每用户每测试一条（share / paid），仅本人可读写
create table if not exists public.entitlements (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_key text not null,
  level text not null check (level in ('share', 'paid')),
  order_no text,
  created_at timestamptz not null default now(),
  unique (user_id, quiz_key)
);

alter table public.entitlements enable row level security;

create policy "entitlements_own" on public.entitlements
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 分享登记（V1 分享验证预留）：允许匿名写入，本人可查自己的分享记录
create table if not exists public.share_claims (
  id bigint generated always as identity primary key,
  quiz_key text not null,
  sharer_id uuid references auth.users(id) on delete cascade,
  claimed_by uuid references auth.users(id) on delete cascade,
  ref text,
  created_at timestamptz not null default now()
);

alter table public.share_claims enable row level security;

create policy "share_claims_insert" on public.share_claims
  for insert to anon, authenticated
  with check (true);

create policy "share_claims_own" on public.share_claims
  for select using (
    auth.uid() = sharer_id or auth.uid() = claimed_by
  );
