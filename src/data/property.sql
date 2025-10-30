create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  price_per_night numeric not null,
  owner_id uuid references profiles(id),
  created_at timestamptz default now()
);
