-- 모바일 청첩장 백엔드 스키마
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- 핵심 원칙: 클라이언트는 anon(public) 키만 사용 → RLS 로 "할 수 있는 일"을 못 박습니다.

-- =========================================================
-- 1) 테이블
-- =========================================================

-- 참석여부(RSVP)
create table if not exists public.rsvps (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  side        text not null check (side in ('groom', 'bride')),   -- 신랑측/신부측
  attending   boolean not null,                                    -- 참석/미참석
  headcount   int  not null default 1 check (headcount between 0 and 20),
  meal        boolean,                                             -- 식사 여부(null = 미응답)
  name        text,
  message     text check (char_length(message) <= 500)
);

-- 방명록
create table if not exists public.guestbook (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  name          text not null check (char_length(name) between 1 and 30),
  message       text not null check (char_length(message) between 1 and 500),
  password_hash text,            -- 작성자 본인 삭제용(선택). 클라이언트에서 해시해 저장.
  approved      boolean not null default true   -- auto-approve. 수동 승인 원하면 기본값 false 로 변경.
);

-- 사이트 메타(방문수 등 단순 카운터)
create table if not exists public.site_meta (
  key   text primary key,
  value bigint not null default 0
);

insert into public.site_meta (key, value)
values ('visits', 0)
on conflict (key) do nothing;

-- =========================================================
-- 2) Row Level Security
-- =========================================================

alter table public.rsvps     enable row level security;
alter table public.guestbook enable row level security;
alter table public.site_meta enable row level security;

-- RSVP: 누구나 작성만 가능, 읽기 불가(개인정보) → 신랑신부는 대시보드에서 직접 조회
drop policy if exists "rsvp insert (anon)" on public.rsvps;
create policy "rsvp insert (anon)"
  on public.rsvps for insert to anon
  with check (true);

-- 방명록: 누구나 작성, 승인된 글만 읽기
drop policy if exists "guestbook insert (anon)" on public.guestbook;
create policy "guestbook insert (anon)"
  on public.guestbook for insert to anon
  with check (true);

drop policy if exists "guestbook select approved (anon)" on public.guestbook;
create policy "guestbook select approved (anon)"
  on public.guestbook for select to anon
  using (approved = true);

-- site_meta: anon 직접 접근 금지(증가는 아래 RPC 로만)
-- (정책을 만들지 않으면 RLS 가 모두 차단)

-- =========================================================
-- 3) 방문수 증가 RPC (SECURITY DEFINER 로 RLS 우회 + 안전하게 +1)
-- =========================================================
create or replace function public.increment_visits()
returns bigint
language sql
security definer
set search_path = public
as $$
  update public.site_meta
     set value = value + 1
   where key = 'visits'
  returning value;
$$;

grant execute on function public.increment_visits() to anon;

-- =========================================================
-- 발송 전 RLS 점검(권장):
--   - anon 키로 rsvps SELECT 가 막히는지
--   - guestbook 의 approved=false 행이 안 보이는지
--   - anon 키로 site_meta 직접 SELECT/UPDATE 가 막히는지
-- =========================================================
