# 설계 & 구현 문서 — 모바일 청첩장

> 최종 업데이트: 2026-06-16 · 상태: 초기 스캐폴드 완료(빌드·타입체크 통과)
> 사용법은 [`../README.md`](../README.md), 진행 상황은 [`./PROGRESS.md`](./PROGRESS.md) 참고.

---

## 1. 개요 & 목표

한국형 **모바일 청첩장**을 외주/유료 제작 서비스 없이 직접 구현한다. 결혼식 전후 몇 달간
운영되는 **모바일 우선·단일 페이지·이미지 중심** 사이트로, 카카오톡 링크로 배포된다.

핵심 목표:

- **셀프 빌드·빠른 출시** — 개발자 1인이 관리.
- **콘텐츠 1파일 주도** — 모든 내용이 `wedding.config.ts` 한 곳에. 재사용/포크 용이.
- **한국 예법 내장** — 비전문가가 실수로 관례를 어길 수 없도록 데이터 모양에 규칙을 박는다.
- **성능·접근성** — 저사양폰·카톡 인앱 웹뷰에서 매끄럽게.

---

## 2. 설계 철학 — 데이터 주도(Data-driven) 정적 우선

청첩장은 "복잡한 앱"이 아니라 **"잘 정돈된 콘텐츠 한 장"** 이다. 따라서:

1. **단일 진실의 원천** — 모든 콘텐츠(이름·날짜·인사말·계좌·사진·지도)는 타입이 박힌
   `wedding.config.ts` 한 파일에. 컴포넌트 트리는 이를 **그리기만 하는 렌더러**.
2. **날짜는 하나의 ISO 문자열이 원천** — `cover.datetimeISO` 하나에서 요일·D-day·캘린더·
   "신혼 N일차"가 전부 **파생**된다. 청첩장 최대 실수인 "날짜-요일 불일치"를 구조적으로 차단.
3. **예법을 데이터 모양에** — 계좌 제목 기본값 `마음 전하실 곳`, 고인 부모 `故`/생략 처리,
   `장남/차녀` 출생순 호칭, `화환 정중히 사양`, BGM `autoplay: false`(iOS가 차단).
4. **정적 우선 + 최소 hydration** — 정적 내러티브는 프레임워크 JS ≈ 0. RSVP·방명록·라이트박스·
   공유바 **4개 섬만** 인터랙티브.
5. **격식판/캐주얼판은 한 빌드** — 섹션별 `enabled` 토글로 전환. 코드 분기 없음.

이 철학은 세 가지 경쟁 설계안(① 심플·빠른출시 ② 기능충실 제품 ③ 성능·모션 중심)을
멀티에이전트로 비교한 뒤, **①을 코어로 삼고 ②③의 강점을 접목**해 도출했다.

- ②에서 접목: 신랑/신부측·인원·식사를 받는 RSVP, (설정 플래그) 방명록 승인, 계좌 그룹핑.
- ③에서 접목(하드 규칙화): 히어로=성역 LCP, 공유 IntersectionObserver 1개, 폰트 서브셋,
  지도 SDK 대신 정적 이미지, 네이티브 `<details>` 아코디언.
- **의도적으로 제외**: ②의 풀 `/admin` 대시보드, SaaS 멀티테넌시 → 1인 유지보수 함정.
  신랑신부는 Supabase 대시보드에서 직접 응답을 본다.

---

## 3. 기술 스택 & 선택 근거

| 영역 | 선택 | 근거 |
|---|---|---|
| 프레임워크 | **Astro 5** (`output: static`) | 정적 출력 기본, 부분 hydration(islands), `astro:assets` 이미지 최적화, `<head>` OG 제어 1급 |
| 인터랙티브 섬 | **Preact** (`@astrojs/preact`) | 작은 번들. RSVP·방명록·라이트박스·공유바만 hydrate |
| 스타일 | 순수 CSS + CSS 변수 토큰 | Tailwind/런타임 CSS-in-JS 불필요. 테마는 `:root[data-theme]` |
| 모션 | 공유 `IntersectionObserver` 1개 + `transform/opacity` | GPU 합성, 저사양폰 안정. `prefers-reduced-motion` 1블록으로 전부 끔 |
| 저장 | **Supabase**(Postgres) + RLS | 서버 시크릿 없이 anon 키만. 호스팅은 계속 정적 |
| 호스팅 | **Cloudflare Pages**(권장) | 무제한 대역폭(카톡 확산 대비), 무료 도메인·SSL, git push 배포 |
| 공유 | **Kakao JS SDK** Feed 템플릿 + `<head>` OG/Twitter 메타 | 카톡 카드 + 생링크/아이메시지 양쪽 대응 |
| 폰트 | 한글 명조(Nanum Myeongjo) + 라틴 세리프(Cormorant) + Pretendard | 현재 CDN, 프로덕션은 self-host+서브셋(성능) |
| 검증 | TypeScript strict + **zod 빌드타임 검증** | 필수값(날짜·예식장·og:image) 누락 시 빌드 실패 |

---

## 4. 정보 구조 (한국 격식판 표준 순서)

게스트가 반드시 찾아야 하는 4가지: **이름 · 정확한 날짜/요일/시간 · 예식장+지도 · 공유 경로.**

| # | 섹션 | 중요도 | 비고 |
|---|---|---|---|
| 1 | 메인/표지 (이름·날짜 히어로·예식장 요약) | ★필수 | LCP·og:image 원본, BGM 토글 기본 OFF |
| 2 | 인사말/모시는 글 (혼주 계보 줄) | ★필수 | 故/생략, 출생순 호칭 |
| 3 | 갤러리 | ◇공통(토글) | 지연로딩 그리드 + 풀스크린 라이트박스 |
| 4 | 커플소개/러브스토리 타임라인 | ○선택 | 격식판 기본 OFF |
| 5 | 예식정보/캘린더/D-day | ◇공통 | 파생 요일, 카운트다운, .ics |
| 6 | 오시는 길 (정적 지도·길찾기·주차/교통/셔틀) | ★필수·검증중요 | SDK 대신 정적 이미지 + 딥링크 |
| 7 | 연락처 (양가 혼주 tel/sms) | ◇공통 | greeting에서 인물·부모 추출 |
| 8 | 마음 전하실 곳 (계좌 + 복사 + 카카오페이) | ◇공통(토글) | 부모님 상의 후 노출 |
| 9 | 참석여부 RSVP | ◇공통 | 신랑/신부측·인원·식사 → Supabase |
| 10 | 방명록 | ◇공통 | 승인된 메시지 피드 + 작성폼 |
| 11 | 안내사항 (화환 사양 등) | ○선택 | |
| 12 | 공유하기/끝인사 | ★필수 | 카카오 Feed 공유 + 링크복사 |

---

## 5. 한국 청첩장 예법 (조사 요약)

코드/카피에 반영된 관례들:

- **마음 전하실 곳** — 계좌는 `계좌번호`가 아닌 완곡한 제목(`마음 전하실 곳`)으로, 신랑측/신부측
  그룹핑, 원탭 복사 + 카카오페이, 불참자 배려 문구. 노출 여부는 부모님과 상의(민감).
- **혼주 계보 표기** — `父 ○○○ · 母 ○○○ 의 장남/차녀 ○○○`. 고인은 `故 ○○○` 또는 가족 합의로 생략.
- **화환 사양** — `화환은 정중히 사양합니다`(공간·환경·허례허식 사유). ※근조 화환은 장례용이므로 혼동 금지.
- **인사말** — 짧고 겸손하게. 어른도 읽으므로 자화자찬·장문 지양.
- **RSVP** — 코로나 이후 표준화. 참석/미참석·측·동행인원·식사 여부 수집.
- **카카오톡 공유 썸네일** — OG 메타(og:title/description/image ~1200×630) 필수. 이미지 변경 시
  카카오 OG 캐시 리셋 안 하면 옛 썸네일 박제.
- **격식판/캐주얼판 2종** — 어른용(정중·계보·예법) vs 친구용(사진·러브스토리·가벼운 톤).

---

## 6. 데이터 모델

### 6.1 콘텐츠 설정 (`wedding.config.ts` / `src/types/wedding.ts`)

`WeddingConfig` 인터페이스가 계약, `wedding.config.ts`가 값, `src/lib/config.ts`가 zod 검증.
주요 구조:

```
WeddingConfig
├─ meta        locale, theme(ivory|sage|blush)
├─ cover       heroImage, groomName, brideName, datetimeISO(★원천), venueShort, dateHeroStyle
├─ bgm         enabled, src, autoplay:false
├─ greeting    message, groom/bride: FamilySide{ person, father?, mother? }
│                Person{ name, phone?, birthOrder }  Parent{ name, phone?, deceased?, hideIfDeceased? }
├─ gallery     enabled, layout(grid|carousel), images[{src, alt}]
├─ coupleStory enabled, profiles?, timeline?[{date,title,body?}]
├─ calendar    enabled, showCountdown, addToCalendar
├─ location    venueName, hallFloor?, address, staticMapImage, directions{naver/kakao/tmap}, byCar/Transit/Shuttle
├─ contacts    enabled  (greeting에서 연락처 추출)
├─ accounts    enabled, heading('마음 전하실 곳'), reassuranceNote?, list[BankAccount{side,holderLabel,bank,number,kakaoPayUrl?}]
├─ rsvp        enabled, deadlineISO?, askSide, askHeadcount, askMeal
├─ guestbook   enabled, moderation(auto-approve|manual), allowPassword
├─ notices     declineWreath, items[{title,body}]
└─ share       siteUrl, ogTitle, ogDescription, ogImage(절대 https ~1200×630), closingMessage
```

### 6.2 백엔드 (`supabase/schema.sql`)

| 테이블 | 컬럼 | RLS (anon 권한) |
|---|---|---|
| `rsvps` | side, attending, headcount, meal, name, message | **INSERT만** (조회 불가 → 대시보드에서) |
| `guestbook` | name, message, password_hash?, approved(기본 true) | INSERT + `approved=true` SELECT |
| `site_meta` | key, value | 직접 접근 차단, `increment_visits()` RPC로만 +1 |

`increment_visits()`는 `SECURITY DEFINER`로 RLS를 우회해 안전하게 카운트. service_role 키는
클라이언트에 절대 두지 않는다.

---

## 7. 컴포넌트 설계 (3계층)

1. **라우팅** — `src/pages/index.astro`가 유일 페이지. zod 검증된 config를 읽어 `<head>`(OG·Kakao·
   폰트·히어로 preload)를 세팅하고, 활성(`enabled`) 섹션만 순서대로 렌더.
2. **정적 섹션** — `src/components/sections/*.astro`. IA 섹션당 1개, 전부 zero-JS.
   공통 래퍼 `ui/Section.astro`가 앵커 id + 라벨/제목 + `.reveal` 적용.
3. **섬(islands)** — `src/components/islands/*.tsx`(Preact). **유일하게 hydrate**:
   - `RsvpForm`(client:visible), `Guestbook`(client:visible), `Lightbox`(client:visible),
     `ShareBar`(client:idle).

공유 UI 프리미티브(`ui/`): `Accordion`(네이티브 `<details>`), `CopyButton`(웹뷰 폴백),
`DeepLinkButton`, `BgmToggle`, `Section`.

로직은 `src/lib/`에만: `config`(zod), `datetime`(요일/D-day), `ics`, `kakao`, `supabase`, `clipboard`.

---

## 8. 주요 메커니즘

- **날짜 파생** (`src/lib/datetime.ts`) — `Intl.DateTimeFormat(timeZone: 'Asia/Seoul')`로 KST 기준
  연/월/일/요일/시각을 추출. `dateHero`, `dateKoFull`, `monthGrid`(캘린더), `dDay`/`dDayLabel` 제공.
  요일을 손으로 적지 않으므로 불일치 불가.
- **스크롤 reveal** (`src/scripts/reveal.ts`) — 페이지 전체에서 IntersectionObserver **1개**가
  `.reveal`에 `.is-visible` 토글(CSS가 transform/opacity 담당), 한 번 보이면 unobserve.
  `prefers-reduced-motion`이면 즉시 전부 표시.
- **카카오 공유** (`src/lib/kakao.ts`) — SDK 동적 로드 후 `Share.sendDefault`(Feed 템플릿)로 카드를
  직접 구성. 미설정/실패 시 `false` 반환 → 호출부에서 링크복사로 폴백.
- **클립보드** (`src/lib/clipboard.ts`) — 표준 `navigator.clipboard` 우선, 실패 시 `execCommand`
  폴백(카톡 인앱 웹뷰 대응). 토스트 + 약식 해시(방명록 본인 삭제용) 포함.
- **이미지/LCP** — 히어로는 `<link rel=preload>` + `fetchpriority=high`. 갤러리/지도는 `loading=lazy`.
  (프로덕션: `src/assets`로 옮겨 `astro:assets <Image>`로 전환하면 빌드타임 AVIF/WebP·blur-up.)

---

## 9. UI/UX 원칙

- **모바일 한 칸 캔버스** — `max-width: 430px` 중앙 정렬 + `safe-area-inset`(노치). 데스크톱도 폰 폭 유지.
- **스크롤 내러티브** — 위→아래 이야기 흐름. 섹션마다 fade/slide reveal.
- **표지 = 성역(LCP)** — 셀룰러에서 빈 화면 금지.
- **지도는 정적 이미지 + 딥링크** — 카톡 웹뷰에서 SDK가 깨지고 프레임을 먹음. 주소 복사 폴백.
- **아코디언은 네이티브 `<details>`** — 키보드/스크린리더 공짜.
- **BGM 기본 OFF**, 떠 있는 토글로 예의.
- **접근성** — reduced-motion 시 애니메이션 최종상태 스냅, 갤러리 `alt` 필수, iOS 자동줌 방지(폼 16px+).

---

## 10. 디렉토리 구조

```
invitation/
├─ wedding.config.ts        ★ 콘텐츠 + 토글 (단일 진실의 원천)
├─ astro.config.mjs / tsconfig.json / package.json
├─ .env.example
├─ public/                  favicon.svg, (사용자가 채울) images/, bgm.mp3
├─ src/
│  ├─ pages/index.astro     유일한 페이지: config → 섹션 매핑, <head>/OG
│  ├─ layouts/BaseLayout.astro
│  ├─ types/wedding.ts      데이터 계약
│  ├─ lib/                  config·datetime·ics·kakao·supabase·clipboard
│  ├─ components/
│  │  ├─ sections/          Cover·Greeting·Gallery·CoupleStory·Calendar·Location·
│  │  │                     Contacts·Accounts·RsvpSection·GuestbookSection·Notices·Closing
│  │  ├─ islands/           RsvpForm·Guestbook·Lightbox·ShareBar (.tsx)
│  │  └─ ui/                Section·Accordion·CopyButton·DeepLinkButton·BgmToggle
│  ├─ scripts/reveal.ts
│  └─ styles/               tokens.css·global.css
├─ supabase/schema.sql      테이블 + RLS + 방문수 RPC
├─ docs/                    DESIGN.md(이 문서)·PROGRESS.md
└─ README.md                사용 가이드 + 발송 전 체크리스트
```
