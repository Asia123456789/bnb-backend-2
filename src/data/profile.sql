create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  is_admin boolean default false
  user_id uuid unique -- viktigt för koppling till Supabase-auth
);
