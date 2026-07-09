import type { WeddingConfig } from '@/types/wedding';
import {
  coverBase,
  bgm,
  families,
  gallery,
  calendar,
  location,
  accountsBase,
  rsvp,
  guestbook,
  ogImage,
} from './wedding.shared';

/**
 * ★ 격식판 (기본) — '/' 경로
 * 사실 데이터(이름·날짜·예식장·계좌 등)는 wedding.shared.ts 에 있습니다 — 거기만 고치면 양쪽 반영.
 * 이 파일에는 격식판 고유의 톤(테마·인사말·안내·공유 문구 등)만 둡니다.
 * 빌드 시 src/lib/config.ts 의 zod 스키마가 합쳐진 결과를 검증합니다.
 */
export const wedding: WeddingConfig = {
  meta: {
    locale: 'ko-KR',
    theme: 'ivory',
  },

  cover: { ...coverBase, scrollCue: '아래로 넘겨주세요' },

  bgm,

  greeting: {
    message:
      '두 사람이 사랑으로 하나가 되어\n새로운 시작을 함께하려 합니다.\n오셔서 따뜻한 축복으로 함께해 주시면\n더없는 기쁨이겠습니다.',
    ...families,
  },

  gallery,

  coupleStory: {
    enabled: false, // 격식판 기본 off (캐주얼판이면 true)
    timeline: [
      { date: '2021.05', title: '처음 만난 날' },
      { date: '2024.12', title: '프러포즈' },
    ],
  },

  calendar,

  location,

  contacts: {
    enabled: false,
  },

  accounts: {
    ...accountsBase,
    reassuranceNote:
      '참석이 어려우신 분들을 위해 안내드립니다.\n축하해 주시는 따뜻한 마음, 감사히 간직하겠습니다.',
  },

  rsvp,

  guestbook,

  notices: {
    declineWreath: false,
    items: [],
  },

  share: {
    siteUrl: 'https://mgk-mgk-mgk.github.io/invitation/',
    ogTitle: '민구 ♥ 미진 결혼합니다',
    ogDescription: '2026.10.03 (토) 낮 12시 10분, 파티움하우스 수원 파티움홀',
    ogImage,
    closingMessage:
      '소중한 분들을 모시고\n저희 두 사람의 약속을 나누고 싶습니다.\n함께해 주셔서 진심으로 감사합니다.',
  },
};

export default wedding;
