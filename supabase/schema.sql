create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.topic_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, topic_id)
);

create table if not exists public.quiz_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null check (score >= 0),
  total integer not null check (total > 0),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.topic_progress enable row level security;
alter table public.quiz_attempts enable row level security;

create policy "Users can read their profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can read their progress" on public.topic_progress for select using (auth.uid() = user_id);
create policy "Users can write their progress" on public.topic_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can read their quiz attempts" on public.quiz_attempts for select using (auth.uid() = user_id);
create policy "Users can create quiz attempts" on public.quiz_attempts for insert with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'Learner'), new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
