-- Create albums table
create table public.albums (
  album_id text not null primary key,
  album_name text not null,
  track_count integer default 0
);

-- Create tracks table
create table public.tracks (
  track_id text not null primary key,
  title text not null,
  album_name text,
  album_id text references public.albums(album_id), -- Adding FK constraint for data integrity
  filename text,
  filepath text,
  description text,
  seo_keywords text,
  prompt text,
  tags text[], -- Array of text
  cover_prompt text,
  seed text,
  cover_url text,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS) - Optional but recommended
-- For now, we will enable it but allow public read access as per typical web-ui patterns
alter table public.albums enable row level security;
alter table public.tracks enable row level security;

-- Create policies for public read access
create policy "Allow public read access on albums"
on public.albums for select
to public
using (true);

create policy "Allow public read access on tracks"
on public.tracks for select
to public
using (true);

-- Enable insert/update for service role (implicit, but good to know)
-- If you need to write from client side without auth, you might need more policies.
-- But sync script uses service role key usually or we assume write access.
