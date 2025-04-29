-- Supabase SQL for user profile table
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text,
  name text,
  birthdate date,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS and allow users to select/update their own profile
alter table profiles enable row level security;

create policy "Users can view their own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);
