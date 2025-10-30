create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  property_id uuid references properties(id),
  check_in date not null,
  check_out date not null,
  total_price numeric not null,
  created_at timestamptz default now()
);
