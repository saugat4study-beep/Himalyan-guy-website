-- =========================================================
-- The Himalayan Guy — Database Schema
-- Run this whole file once in Supabase: Project > SQL Editor > New query > paste > Run
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------- CATEGORIES ----------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  created_at timestamptz default now()
);

-- ---------- TAGS ----------
create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  created_at timestamptz default now()
);

-- ---------- POSTS ----------
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,                          -- HTML from the rich text editor
  featured_image text,
  category_id uuid references categories(id) on delete set null,
  status text not null default 'draft' check (status in ('draft','published','scheduled')),
  published_at timestamptz,
  reading_time int default 5,
  author_name text default 'The Himalayan Guy',
  meta_title text,
  meta_description text,
  views int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists posts_status_idx on posts(status);
create index if not exists posts_published_idx on posts(published_at desc);

-- ---------- POST <-> TAGS ----------
create table if not exists post_tags (
  post_id uuid references posts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- ---------- COMMENTS ----------
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  parent_id uuid references comments(id) on delete cascade,
  name text not null,
  email text not null,
  content text not null,
  status text not null default 'pending' check (status in ('pending','approved')),
  likes int default 0,
  created_at timestamptz default now()
);

create index if not exists comments_post_idx on comments(post_id);

-- ---------- NEWSLETTER SUBSCRIBERS ----------
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

-- ---------- CONTACT MESSAGES ----------
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- ---------- GALLERY ----------
create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  category text,          -- Mountains, Lakes, Trekking, Villages, Wildlife, Culture
  caption text,
  created_at timestamptz default now()
);

-- =========================================================
-- ROW LEVEL SECURITY
-- Public visitors: read published posts/comments, insert comments/messages/subscribers.
-- Logged-in admin (you): full read/write on everything.
-- =========================================================

alter table categories enable row level security;
alter table tags enable row level security;
alter table posts enable row level security;
alter table post_tags enable row level security;
alter table comments enable row level security;
alter table subscribers enable row level security;
alter table messages enable row level security;
alter table gallery_images enable row level security;

-- Categories / tags: public read, admin write
create policy "public read categories" on categories for select using (true);
create policy "admin write categories" on categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read tags" on tags for select using (true);
create policy "admin write tags" on tags for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Posts: public can read published posts, admin can read/write everything
create policy "public read published posts" on posts for select using (status = 'published' and (published_at is null or published_at <= now()));
create policy "admin read all posts" on posts for select using (auth.role() = 'authenticated');
create policy "admin write posts" on posts for insert with check (auth.role() = 'authenticated');
create policy "admin update posts" on posts for update using (auth.role() = 'authenticated');
create policy "admin delete posts" on posts for delete using (auth.role() = 'authenticated');

create policy "public read post_tags" on post_tags for select using (true);
create policy "admin write post_tags" on post_tags for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Comments: public can read approved comments and insert new ones (pending), admin manages all
create policy "public read approved comments" on comments for select using (status = 'approved');
create policy "admin read all comments" on comments for select using (auth.role() = 'authenticated');
create policy "public insert comments" on comments for insert with check (status = 'pending');
create policy "admin update comments" on comments for update using (auth.role() = 'authenticated');
create policy "admin delete comments" on comments for delete using (auth.role() = 'authenticated');

-- Subscribers: public can insert only, admin can read/manage
create policy "public insert subscribers" on subscribers for insert with check (true);
create policy "admin read subscribers" on subscribers for select using (auth.role() = 'authenticated');
create policy "admin delete subscribers" on subscribers for delete using (auth.role() = 'authenticated');

-- Messages: public can insert only, admin can read/manage
create policy "public insert messages" on messages for insert with check (true);
create policy "admin read messages" on messages for select using (auth.role() = 'authenticated');
create policy "admin update messages" on messages for update using (auth.role() = 'authenticated');
create policy "admin delete messages" on messages for delete using (auth.role() = 'authenticated');

-- Gallery: public read, admin write
create policy "public read gallery" on gallery_images for select using (true);
create policy "admin write gallery" on gallery_images for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- =========================================================
-- STORAGE — run this part too (creates the image bucket)
-- =========================================================
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

create policy "public read blog-images"
on storage.objects for select
using (bucket_id = 'blog-images');

create policy "admin upload blog-images"
on storage.objects for insert
with check (bucket_id = 'blog-images' and auth.role() = 'authenticated');

create policy "admin delete blog-images"
on storage.objects for delete
using (bucket_id = 'blog-images' and auth.role() = 'authenticated');

-- =========================================================
-- SEED DATA (optional — remove if you don't want sample content)
-- =========================================================
insert into categories (name, slug) values
  ('Trekking', 'trekking'),
  ('Culture', 'culture'),
  ('Villages', 'villages'),
  ('Wildlife', 'wildlife'),
  ('Gear', 'gear')
on conflict (name) do nothing;
