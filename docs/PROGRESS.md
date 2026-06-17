# 진행 상황 — 모바일 청첩장

> 최종 업데이트: 2026-06-16 · 설계 근거는 [`./DESIGN.md`](./DESIGN.md), 사용법은 [`../README.md`](../README.md)

---

## 현재 상태 요약

**스캐폴드 + 백엔드 연결 + 라이브 배포 완료.** `wedding.config.ts` 한 파일로 구동되는 정적 청첩장이
GitHub Pages에 라이브(https://mgk-mgk-mgk.github.io/invitation/)로 떠 있고, Supabase(RSVP·방명록·방문수)·
Kakao 공유 키가 실제로 배선·검증됨. **남은 건 실제 신랑신부 콘텐츠/이미지 입력 + 카카오 도메인 등록뿐.**

```
[██████████████████░░] 구조·백엔드·배포 100% / 실제 콘텐츠·이미지 0% (플레이스홀더로 배포됨)
```

| 단계 | 상태 |
|---|---|
| 아키텍처·기술 선택 | ✅ 완료 |
| 프로젝트 스캐폴드 (전 섹션·섬·lib·스타일) | ✅ 완료 |
| 빌드·타입체크 검증 | ✅ 통과 (0 errors) |
| 실제 신랑신부 콘텐츠 입력 | ⬜ 대기 |
| 이미지 에셋 추가 | ⬜ 대기 |
| Supabase 프로젝트 연결 | ✅ 완료 (2026-06-17, REST로 RLS 검증) |
| 카카오 공유 등록 | 🟡 키 배선 완료 (도메인 등록·공유 테스트는 배포 후) |
| 배포(GitHub Pages) | ✅ 완료 (2026-06-17 · https://mgk-mgk-mgk.github.io/invitation/) |

---

## 완료 항목 (구현됨)

### 설정 & 기반
- [x] `package.json` / `astro.config.mjs` / `tsconfig.json`(strict, `@/*` alias) / `.env.example` / `.gitignore`
- [x] `src/types/wedding.ts` — `WeddingConfig` 데이터 계약
- [x] `wedding.config.ts` — 예시 격식판 콘텐츠(플레이스홀더)
- [x] `src/lib/config.ts` — **zod 빌드타임 검증**(필수값 누락/잘못된 날짜 시 빌드 실패)

### 라이브러리
- [x] `datetime.ts` — KST 기준 요일·날짜히어로·캘린더 그리드·D-day/신혼 N일차 파생
- [x] `ics.ts` — .ics 생성 + 구글 캘린더 링크
- [x] `kakao.ts` — SDK 동적 로드 + Feed 템플릿 공유 + 폴백
- [x] `supabase.ts` — anon 클라이언트(미설정 시 안전 degrade) + 방문수 RPC
- [x] `clipboard.ts` — 표준 + `execCommand` 폴백, 토스트, 약식 해시

### 섹션 (정적, zero-JS) — 12개
- [x] Cover(히어로·LCP) · Greeting(계보·故처리) · Gallery · CoupleStory · Calendar(달력·카운트다운)
- [x] Location(정적지도·길찾기·주차/교통/셔틀) · Contacts(양가 tel/sms) · Accounts(계좌·복사·카카오페이)
- [x] RsvpSection · GuestbookSection · Notices(화환 사양) · Closing

### 섬 (Preact, hydrate) — 4개
- [x] `RsvpForm`(측·인원·식사·봇트랩 → Supabase) · `Guestbook`(피드+작성, 봇트랩)
- [x] `Lightbox`(풀스크린·스와이프·키보드) · `ShareBar`(카카오공유+링크복사)

### UI 프리미티브 & 스타일
- [x] `Section` · `Accordion`(네이티브 `<details>`) · `CopyButton`(위임 처리) · `DeepLinkButton` · `BgmToggle`
- [x] `tokens.css`(색/타이포/간격, 3테마) · `global.css`(폰 캔버스·reveal·토스트·reduced-motion)
- [x] `scripts/reveal.ts` — 공유 IntersectionObserver 1개

### 백엔드 & 문서
- [x] `supabase/schema.sql` — rsvps/guestbook/site_meta + RLS + `increment_visits()` RPC
- [x] `README.md`(사용 가이드·발송 전 체크리스트) · `docs/DESIGN.md` · `docs/PROGRESS.md`

---

## 검증 결과 (2026-06-16)

```
npm install   ✅ 424 packages
npm run build ✅ static, 1 page (dist/index.html 32K)
npm run check ✅ 0 errors, 0 warnings (execCommand deprecation 힌트 1 — 의도된 폴백)
```

**렌더 확인**: `2026-10-17` → "토요일 / SAT" 자동 파생, 혼주 계보 줄, 전 12섹션, OG 메타 정상.

**클라이언트 JS 번들(gzip)** — 정적 내러티브는 0, 섬만 로드:

| 청크 | raw | gzip |
|---|---|---|
| preact + signals + hooks (런타임, 공유) | ~21 kB | ~8.6 kB |
| RsvpForm | 4.19 kB | 1.79 kB |
| Guestbook | 2.98 kB | 1.50 kB |
| Lightbox | 2.49 kB | 1.16 kB |
| ShareBar | 2.08 kB | 1.00 kB |
| clipboard / CopyButton script | ~1.3 kB | ~0.8 kB |

---

## MVP 범위 vs 보류

**MVP(현재 스캐폴드 = 이 범위 전부 배선됨)**: 표지·인사말·갤러리·캘린더·오시는길·연락처·
마음전하실곳·RSVP·방명록·안내·공유 + 횡단(zod 검증, reveal, BGM OFF, RLS, 발송 체크리스트).

**보류(의도적, 후순위)**:
- 풀 `/admin` 대시보드(Supabase Auth) → 대시보드 직접 조회로 대체
- 방명록 수동 승인 플로우(현재 auto-approve + 허니팟)
- 러브스토리 타임라인(격식판 기본 off) · 메이슨리/핀치줌 · 방문자 카운터 UI
- 다중 테마 확장 · SaaS 멀티테넌시/섹션 순서 동적화

---

## 남은 작업 (To-Do)

### 1. 콘텐츠 (개발자 = 본인)
- [ ] `wedding.config.ts` — 실제 이름·날짜(`datetimeISO`)·인사말·혼주·계좌·지도 링크·문구
- [ ] `share.siteUrl` / `share.ogImage`를 실제 배포 도메인 절대경로로

### 2. 이미지 에셋 → `public/images/`
- [ ] `hero.jpg`(표지·세로형) · `gallery/01~09.jpg`(정사각) · `map-static.png` · `og-1200x630.jpg`
- [ ] (성능) `src/assets`로 옮겨 `<img>`를 `astro:assets <Image>`로 전환

### 3. Supabase ✅ (2026-06-17 완료)
- [x] 프로젝트 생성(ref `xdljsjehhenpxgkxfcaq`, Seoul) → `schema.sql` 실행 → `.env`에 URL/anon 키
- [x] RLS 점검 — REST로 검증: rsvps SELECT 차단 / site_meta 차단 / guestbook approved만 / insert 허용 / increment_visits RPC 동작

### 4. 카카오 🟡 (키 배선 완료, 2026-06-17)
- [x] JS 키 발급 → `.env` `PUBLIC_KAKAO_JS_KEY` 입력 → 빌드 인라인 확인
- [ ] 플랫폼(Web)에 도메인 등록 — 배포 도메인 필요(5번 후). 로컬 테스트 시 `http://localhost:4321` 등록
- [ ] 실제 공유 카드 테스트(카톡 인앱) + OG 캐시 리셋 — 배포·실이미지 후

### 5. 배포 ✅ (GitHub Pages — 2026-06-17 완료)
라이브: **https://mgk-mgk-mgk.github.io/invitation/** (repo `mgk-mgk-mgk/invitation`, public)
- [x] repo 생성 + `git push origin main` → GitHub Actions 빌드(22s)+배포(9s) 성공
- [x] Pages Source = GitHub Actions (`build_type=workflow`)
- [x] Variables 3개 등록(`PUBLIC_SUPABASE_URL/ANON_KEY/KAKAO_JS_KEY`)
- [x] 라이브 검증: 메인 HTTP 200 · 전 에셋 `/invitation/...` 200 · OG URL 실도메인 반영 ·
      RSVP/방명록 폼 활성(SSR) · supabase 청크에 URL+anon키 인라인 · ShareBar 청크에 Kakao키 인라인
> 코드: astro `base`/`site` env 구동 · 에셋/OG URL 중앙 base 보정(`src/lib/config.ts`) ·
> `.github/workflows/deploy.yml`(repo 좌표에서 base 자동 도출, Variables→`.env`→빌드→Pages).
> 참고: 무료 Pages = public repo 필수 + 대역폭 soft-limit 100GB/월. 실제 PII 입력 시 소스 공개 노출 유의.
> (마이너) 워크플로 액션들이 Node20 deprecation 경고 — 동작엔 영향 없음, 추후 액션 v5 나오면 갱신.

### 6. (선택) 프로덕션 폰트
- [ ] 한글 명조 서브셋 + self-host(현재 CDN). 히어로/제목 문구 변경 시 재서브셋.

---

## 리스크 & 주의사항

| 리스크 | 대응 |
|---|---|
| 한글 웹폰트 무게(렌더블로킹) | 서브셋 woff2 self-host + `font-display: swap` + 핵심 face preload |
| 히어로 미최적화 → 빈 화면 | preload + LQIP + AVIF/WebP + 명시적 width/height(CLS 0) |
| 카톡 인앱 웹뷰 quirks | 정적 지도, 클립보드 폴백, **카톡 안에서 직접 테스트** |
| 카카오 OG 캐시 박제 | 이미지 변경 시 캐시 리셋(developers.kakao.com/tool/clear/og) |
| Supabase RLS 오설정 | insert-only + 승인 select로 잠그고 테스트, 허니팟+길이제한 |
| 무료 티어 7일 유휴 자동정지 | 발송 직전 깨우기 |
| 날짜-요일 불일치 | 구조적 차단(ISO 1개에서 파생) |
| CMS 없음(편집=재배포) | 1인 기술 오너 전제라 허용 |

---

## 변경 이력

- **2026-06-16** — 초기 스캐폴드. 멀티에이전트 조사·설계(한국 관례·UI·스택) → 데이터 주도
  정적 구조로 합성. 전 12섹션 + 4섬 + lib + Supabase 스키마 구현. 빌드·타입체크 통과.
  스택 결정: Astro 5(static) + Preact + Supabase + Cloudflare Pages + Kakao. 톤: 격식판 우선.
