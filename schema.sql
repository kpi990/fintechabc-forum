-- ============================================================================
-- fintechabc.com community platform — database schema
-- Already applied to your live Supabase project. Kept here for reference
-- and for anyone who needs to recreate the database from scratch.
-- ============================================================================

create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  display_name text,
  avatar_url text,
  karma integer not null default 0,
  is_moderator boolean not null default false,
  is_admin boolean not null default false,
  is_banned boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  is_paid boolean not null default false,
  stripe_price_id text,
  coin_id text unique,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references public.boards(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete set null,
  title text not null,
  body text,
  score integer not null default 0,
  is_removed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade not null,
  parent_id uuid references public.comments(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  body text not null,
  score integer not null default 0,
  is_removed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  unique (user_id, post_id),
  unique (user_id, comment_id),
  check (
    (post_id is not null and comment_id is null) or
    (post_id is null and comment_id is not null)
  )
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  board_id uuid references public.boards(id) on delete cascade not null,
  stripe_customer_id text not null,
  stripe_subscription_id text not null,
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, board_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  post_id uuid references public.posts(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  reason text not null,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.boards enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.votes enable row level security;
alter table public.subscriptions enable row level security;
alter table public.reports enable row level security;

create policy "profiles are publicly readable" on public.profiles for select using (true);
create policy "users can update their own profile" on public.profiles for update using (auth.uid() = id);
create policy "boards are publicly readable" on public.boards for select using (true);
create policy "authenticated users can create coin boards" on public.boards for insert
  with check (coin_id is not null and auth.uid() is not null);
create policy "posts are publicly readable" on public.posts for select using (true);
create policy "authenticated users can create posts" on public.posts for insert with check (auth.uid() = author_id);
create policy "authors and moderators can update posts" on public.posts for update using (
  auth.uid() = author_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_moderator)
);
create policy "comments are publicly readable" on public.comments for select using (true);
create policy "authenticated users can create comments" on public.comments for insert with check (auth.uid() = author_id);
create policy "authors and moderators can update comments" on public.comments for update using (
  auth.uid() = author_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_moderator)
);
create policy "users manage their own votes" on public.votes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users see their own subscriptions" on public.subscriptions for select using (auth.uid() = user_id);
create policy "users can create reports" on public.reports for insert with check (auth.uid() = reporter_id);
create policy "moderators can read reports" on public.reports for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_moderator)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)) || '_' || substr(new.id::text, 1, 4),
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  insert into public.user_emails (id, email) values (new.id, new.email);
  return new;
end;
$$;

-- Trigger-only function: never meant to be called directly via PostgREST RPC.
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon;
revoke execute on function public.handle_new_user() from authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into public.boards (slug, name, description, is_paid)
values
  ('general', 'General Discussion', 'Open discussion on crypto and financial markets. Not financial advice.', false),
  ('news', 'Market News', 'Share and discuss market-moving news.', false)
on conflict (slug) do nothing;

-- Admin portal: user management + moderation (added when the admin portal was built)
create policy "admins can update any profile" on public.profiles for update using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
);

create policy "moderators can update reports" on public.reports for update using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and (p.is_moderator or p.is_admin))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and (p.is_moderator or p.is_admin))
);

-- Admin-only email lookup (added when the admin Users page needed emails).
-- Kept out of public.profiles because that table has a public-read policy;
-- a bare email column there would leak every user's address to anon visitors.
create table if not exists public.user_emails (
  id uuid primary key references public.profiles(id) on delete cascade,
  email text not null
);
alter table public.user_emails enable row level security;
create policy "admins can read user emails" on public.user_emails for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
);

-- Watchlist (crypto only in v1 - no data source for individual India stocks yet)
create table if not exists public.watchlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  coin_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, coin_id)
);
alter table public.watchlist_items enable row level security;
create policy "users manage their own watchlist" on public.watchlist_items for all using (
  auth.uid() = user_id
) with check (
  auth.uid() = user_id
);
