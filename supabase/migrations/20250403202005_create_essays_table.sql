-- Create a table for storing documents
create table if not exists essays (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);