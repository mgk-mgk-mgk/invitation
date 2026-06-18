import { z } from 'zod';
import { wedding } from '../../wedding.config';
import type { WeddingConfig } from '@/types/wedding';

/**
 * 빌드타임 검증: 필수값(날짜·예식장·og:image 등)이 빠지면 "결혼식"이 아니라 "빌드"가 실패합니다.
 * datetimeISO 가 실제 파싱 가능한 날짜인지까지 확인합니다.
 */

const personSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  birthOrder: z
    .enum(['장남', '차남', '삼남', '아들', '장녀', '차녀', '삼녀', '딸'])
    .optional(),
});

const parentSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  deceased: z.boolean().optional(),
  hideIfDeceased: z.boolean().optional(),
});

const familySideSchema = z.object({
  person: personSchema,
  father: parentSchema.optional(),
  mother: parentSchema.optional(),
});

const isoDate = z
  .string()
  .refine((s) => !Number.isNaN(Date.parse(s)), { message: '유효한 ISO 날짜가 아닙니다' });

const configSchema = z.object({
  meta: z.object({
    locale: z.literal('ko-KR'),
    theme: z.enum(['ivory', 'sage', 'blush']).optional(),
  }),
  cover: z.object({
    heroImage: z.string().min(1),
    groomName: z.string().min(1),
    brideName: z.string().min(1),
    datetimeISO: isoDate,
    venueShort: z.string().min(1),
    dateHeroStyle: z.enum(['YYYY.MM.DD', 'YYYY.MM.DD DAY']).optional(),
    scrollCue: z.string().optional(),
  }),
  bgm: z.object({
    enabled: z.boolean(),
    src: z.string(),
    autoplay: z.literal(false),
  }),
  greeting: z.object({
    message: z.string().min(1),
    groom: familySideSchema,
    bride: familySideSchema,
  }),
  gallery: z.object({
    enabled: z.boolean(),
    layout: z.enum(['grid', 'carousel']),
    images: z.array(z.object({ src: z.string(), alt: z.string().min(1) })),
  }),
  coupleStory: z.object({
    enabled: z.boolean(),
    groomProfile: z.string().optional(),
    brideProfile: z.string().optional(),
    timeline: z
      .array(z.object({ date: z.string(), title: z.string(), body: z.string().optional() }))
      .optional(),
  }),
  calendar: z.object({
    enabled: z.boolean(),
    showCountdown: z.boolean(),
    addToCalendar: z.boolean(),
  }),
  location: z.object({
    venueName: z.string().min(1),
    hallFloor: z.string().optional(),
    address: z.string().min(1),
    staticMapImage: z.string().min(1),
    directions: z.object({
      naverMapUrl: z.string().optional(),
      kakaoMapUrl: z.string().optional(),
      tmapUrl: z.string().optional(),
      venuePageUrl: z.string().optional(),
    }),
    byCar: z.string().optional(),
    byTransit: z.string().optional(),
    byShuttle: z.string().optional(),
  }),
  contacts: z.object({ enabled: z.boolean() }),
  accounts: z.object({
    enabled: z.boolean(),
    heading: z.string().min(1),
    reassuranceNote: z.string().optional(),
    list: z.array(
      z.object({
        side: z.enum(['groom', 'bride']),
        holderLabel: z.string().min(1),
        bank: z.string().min(1),
        number: z.string().min(1),
        kakaoPayUrl: z.string().optional(),
      }),
    ),
  }),
  rsvp: z.object({
    enabled: z.boolean(),
    deadlineISO: isoDate.optional(),
    askSide: z.boolean(),
    askHeadcount: z.boolean(),
    askMeal: z.boolean(),
  }),
  guestbook: z.object({
    enabled: z.boolean(),
    moderation: z.enum(['auto-approve', 'manual']),
    allowPassword: z.boolean(),
  }),
  notices: z.object({
    declineWreath: z.boolean(),
    items: z.array(z.object({ title: z.string(), body: z.string() })),
  }),
  share: z.object({
    siteUrl: z.string().url(),
    ogTitle: z.string().min(1),
    ogDescription: z.string().min(1),
    ogImage: z.string().url(),
    closingMessage: z.string().min(1),
  }),
});

const parsed = configSchema.safeParse(wedding);
if (!parsed.success) {
  // 빌드 콘솔에 어떤 필드가 잘못됐는지 그대로 출력하고 빌드를 멈춥니다.
  console.error('\n❌ wedding.config.ts 검증 실패:\n', parsed.error.format());
  throw new Error('wedding.config.ts 검증 실패 — 위 항목을 고쳐주세요.');
}

// ── base path / 절대 URL 보정 ──────────────────────────────────────────────
// GitHub Pages 프로젝트 repo는 https://<유저>.github.io/<repo>/ 하위에 서빙됩니다.
// 그래서 로컬 에셋(/images, /bgm.mp3)에는 base 를, 공유용 OG 절대 URL 에는 origin+base 를
// 붙여야 합니다. env 미설정(로컬/루트 배포) 시에는 원본 값을 그대로 둡니다.
const BASE = import.meta.env.BASE_URL || '/'; // 예: '/invitation/' (로컬 '/')
const ORIGIN = import.meta.env.PUBLIC_SITE_ORIGIN as string | undefined; // 예: 'https://user.github.io'
const SITE = ORIGIN ? ORIGIN.replace(/\/+$/, '') + BASE.replace(/\/+$/, '') : undefined;

/** 로컬 에셋 경로에 base prefix. 이미 절대(http/data)면 그대로. */
const withBase = (p: string): string => {
  if (/^(https?:)?\/\//.test(p) || p.startsWith('data:')) return p;
  return BASE.replace(/\/+$/, '') + (p.startsWith('/') ? p : '/' + p);
};

/** 공유용 절대 URL 생성(origin+base 기준). env 없으면 원본 유지. */
const toAbsolute = (urlOrPath: string): string => {
  if (!SITE) return urlOrPath;
  const path = /^https?:\/\//.test(urlOrPath) ? new URL(urlOrPath).pathname : urlOrPath;
  return SITE + (path.startsWith('/') ? path : '/' + path);
};

const data = parsed.data as WeddingConfig;
data.cover.heroImage = withBase(data.cover.heroImage);
data.bgm.src = withBase(data.bgm.src);
data.location.staticMapImage = withBase(data.location.staticMapImage);
data.gallery.images = data.gallery.images.map((img) => ({ ...img, src: withBase(img.src) }));
data.share.siteUrl = SITE ?? data.share.siteUrl;
data.share.ogImage = toAbsolute(data.share.ogImage);

export const config: WeddingConfig = data;
export default config;
