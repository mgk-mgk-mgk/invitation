# 모바일 청첩장 (Mobile Wedding Invitation)

콘텐츠 한 파일(`wedding.config.ts`)이 곧 청첩장인 **데이터 주도 정적 사이트**입니다.
Astro(정적) + 최소 인터랙티브 섬(Preact) + Supabase(RSVP·방명록) + 카카오톡 공유 OG.

> 📐 설계 의사결정·아키텍처: [`docs/DESIGN.md`](docs/DESIGN.md) · 📋 진행 상황·남은 작업: [`docs/PROGRESS.md`](docs/PROGRESS.md)

## 빠른 시작

```bash
npm install
cp .env.example .env      # 값 채우기 (Supabase / Kakao / 도메인)
npm run dev               # http://localhost:4321
npm run build && npm run preview
```

## 어디를 고치나요?

| 하고 싶은 것 | 고칠 곳 |
|---|---|
| 이름·날짜·인사말·계좌·지도·문구 전부 | **`wedding.config.ts`** (단일 진실의 원천) |
| 섹션 on/off (격식판↔캐주얼판) | `wedding.config.ts` 의 각 섹션 `enabled` / `coupleStory.enabled` |
| 색/폰트/간격 | `src/styles/tokens.css` |
| 섹션 순서·배치 | `src/pages/index.astro` |
| RSVP/방명록 백엔드 | `supabase/schema.sql` |

> 날짜는 `cover.datetimeISO` **하나**가 진실. 요일·D-day·캘린더·신혼 N일차는 전부 자동 계산되므로 요일을 손으로 적지 마세요.

## 이미지 넣기

`public/images/` 에 아래를 넣으세요(파일명은 `wedding.config.ts` 와 맞추면 됩니다).

- `hero.jpg` — 표지(세로형 권장). 첫 화면 LCP라 가장 중요.
- `gallery/01.jpg … 09.jpg` — 갤러리(정사각 권장).
- `map-static.png` — 예식장 정적 지도 캡처(네이버/카카오맵 스샷).
- `og-1200x630.jpg` — 카톡 공유 썸네일(1200×630, 절대 https URL로 `share.ogImage` 지정).

성능을 위해선 이미지를 `src/assets/` 로 옮기고 컴포넌트의 `<img>` 를 astro `<Image>` 로 바꾸면 빌드타임 AVIF/WebP·blur-up 최적화가 켜집니다.

## Supabase 설정 (RSVP·방명록)

1. supabase.com 에서 프로젝트 생성.
2. **SQL Editor** 에 `supabase/schema.sql` 붙여넣고 실행(테이블 + RLS + 방문수 RPC).
3. **Settings → API** 에서 `Project URL` 과 `anon public` 키를 `.env` 에 입력.
   - ⚠️ `service_role` 키는 절대 클라이언트/`.env`(PUBLIC_*)에 넣지 마세요.
4. 결과 확인: RSVP·방명록 응답은 Supabase 대시보드 **Table editor** 에서 직접 봅니다(관리자 페이지는 MVP에 없음).
5. 무료 티어는 ~7일 미사용 시 자동 일시정지 → **청첩장 발송 직전에 한 번 깨워두세요**.

## 카카오톡 공유

1. developers.kakao.com → 앱 생성 → **JavaScript 키**를 `.env` `PUBLIC_KAKAO_JS_KEY` 에.
2. **플랫폼 → Web** 에 배포 도메인 등록.
3. `share.ogImage` 는 절대 https URL(~1200×630).
4. 이미지 바꾸면 **OG 캐시 리셋**: <https://developers.kakao.com/tool/clear/og>

## 배포 (GitHub Pages — GitHub Actions)

프로젝트 repo 로 배포하면 `https://<유저>.github.io/<repo>/` 에 서빙됩니다.
`.github/workflows/deploy.yml` 이 push 시 빌드→배포까지 자동 처리합니다.

1. GitHub 에 **public** repo 생성 후 `git push -u origin main`
2. **Settings → Pages → Source = GitHub Actions**
3. **Settings → Secrets and variables → Actions → Variables** 에 빌드타임 키 3개 등록
   (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `PUBLIC_KAKAO_JS_KEY` — 모두 브라우저 노출 공개키라 Variables 로 충분)
4. push 하면 Actions 가 빌드(저장소 좌표에서 `base`/`site` 자동 도출)→ Pages 배포

> ⚠️ GitHub 무료 Pages 는 **소스가 공개**됩니다. 실제 계좌·전화번호 입력 시 노출에 유의하세요.
> 대역폭 soft-limit 100GB/월(청첩장 규모엔 충분). 비공개 소스를 원하면 Cloudflare Pages(빌드 결과물만 업로드)도 대안.

## 폰트 (프로덕션 성능)

지금은 CDN 웹폰트(`global.css`)로 빠르게 시작합니다. 프로덕션에선 **한글 명조를 서브셋**해 self-host 하세요(풀 한글 폰트는 1만+ 글자라 렌더 블로킹). 히어로/제목 문구를 바꾸면 서브셋을 다시 뽑아야 글자가 빠지지 않습니다.

## 발송 전 체크리스트 ✅

- [ ] 지도 핀/주소가 정확한가
- [ ] 날짜 **그리고 요일**이 맞는가
- [ ] 전화/문자/길찾기/계좌복사/공유 링크가 전부 작동하는가
- [ ] 카카오 OG 썸네일이 제대로 뜨는가(캐시 리셋 했는가)
- [ ] Supabase RLS 점검(anon이 RSVP 조회 불가 / 미승인 방명록 비노출)
- [ ] **카카오톡 인앱**에서 직접 한 번 열어 복사·공유·딥링크 확인
- [ ] 1~2개월 전 발송으로 수정 여유 확보

## 구조

```
wedding.config.ts        ★ 콘텐츠 + 토글 (유일하게 자주 고치는 파일)
src/
  pages/index.astro      유일한 페이지: config → 섹션 매핑, <head>/OG
  layouts/BaseLayout.astro
  types/wedding.ts       데이터 계약
  lib/                   config(zod검증)·datetime·ics·kakao·supabase·clipboard
  components/
    sections/            섹션별 정적 .astro (Cover, Greeting, ...)
    islands/             인터랙티브 섬: RsvpForm, Guestbook, Lightbox, ShareBar
    ui/                  Section, Accordion, CopyButton, DeepLinkButton, BgmToggle
  scripts/reveal.ts      스크롤 reveal (공유 IntersectionObserver 1개)
  styles/                tokens.css, global.css
supabase/schema.sql      테이블 + RLS + 방문수 RPC
```
