create table if not exists public.blogs (
  id text primary key,
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  category text not null default 'Blog',
  cover_image_url text not null default '/images/image-1.jpg',
  read_time text not null default '5 min read',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blogs enable row level security;

create index if not exists blogs_slug_idx on public.blogs (slug);
create index if not exists blogs_created_at_idx on public.blogs (created_at desc);
create index if not exists blogs_is_published_idx on public.blogs (is_published);

create or replace function public.set_blog_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blogs_set_updated_at on public.blogs;

create trigger blogs_set_updated_at
before update on public.blogs
for each row
execute function public.set_blog_updated_at();

drop policy if exists "blogs_public_read" on public.blogs;
drop policy if exists "blogs_public_insert" on public.blogs;
drop policy if exists "blogs_public_update" on public.blogs;
drop policy if exists "blogs_public_delete" on public.blogs;

create policy "blogs_public_read"
on public.blogs
for select
to public
using (true);

create policy "blogs_public_insert"
on public.blogs
for insert
to public
with check (true);

create policy "blogs_public_update"
on public.blogs
for update
to public
using (true)
with check (true);

create policy "blogs_public_delete"
on public.blogs
for delete
to public
using (true);
