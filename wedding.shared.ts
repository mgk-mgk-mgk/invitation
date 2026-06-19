import type { WeddingConfig } from '@/types/wedding';

/**
 * ★ 격식판·캐주얼판이 공유하는 "사실" 데이터 (한 곳만 고치면 양쪽 반영)
 * 실제 정보(이름·날짜·예식장·혼주 연락처·계좌·갤러리 등)는 전부 여기에 둡니다.
 * 버전별로 톤이 다른 값(테마·인사말·안내문구·우리의 이야기·공유 문구 등)만
 * 각 wedding.config.ts / wedding.casual.config.ts 에 남겨 스프레드로 덧붙입니다.
 *
 * 타입은 WeddingConfig 의 인덱스 접근 타입으로 고정해 두어, 형태가 어긋나면 빌드가 막힙니다.
 */

/** 표지의 사실 정보 — scrollCue(스크롤 안내 문구)만 버전별로 다릅니다. */
export const coverBase: Omit<WeddingConfig['cover'], 'scrollCue'> = {
  heroImage: '/images/hero.jpg',
  groomName: '강민구',
  brideName: '유미진',
  datetimeISO: '2026-10-03T12:10:00+09:00', // 요일/D-day/캘린더 전부 여기서 파생
  venueShort: '파티움하우스 수원 파티움홀',
  dateHeroStyle: 'YYYY.MM.DD DAY',
};

export const bgm: WeddingConfig['bgm'] = {
  enabled: true,
  src: '/bgm.mp3',
  autoplay: false,
};

/** 혼인 당사자·혼주(이름·전화·계보). greeting.message(인사말)만 버전별로 다릅니다. */
export const families: Pick<WeddingConfig['greeting'], 'groom' | 'bride'> = {
  groom: {
    person: { name: '강민구', phone: '010-1234-5678', birthOrder: '장남' },
    father: { name: '김아버지', phone: '010-1111-1111' },
    mother: { name: '박어머니', phone: '010-2222-2222' },
  },
  bride: {
    person: { name: '유미진', phone: '010-8765-4321', birthOrder: '차녀' },
    father: { name: '이아버지', phone: '010-3333-3333' },
    mother: { name: '최어머니', phone: '010-4444-4444' },
  },
};

export const gallery: WeddingConfig['gallery'] = {
  enabled: true,
  layout: 'grid',
  images: Array.from({ length: 17 }, (_, i) => {
    const n = String(i + 1).padStart(2, '0');
    return { src: `/images/gallery/${n}.jpg`, alt: `웨딩 사진 ${i + 1}` };
  }),
};

export const calendar: WeddingConfig['calendar'] = {
  enabled: true,
  showCountdown: true,
};

export const location: WeddingConfig['location'] = {
  venueName: '파티움하우스 수원',
  hallFloor: '파티움홀 (3층)',
  address: '경기 수원시 팔달구 효원로 289',
  staticMapImage: '/images/map-static.png',
  mapEmbedSrc: 'https://maps.google.com/maps?q=파티움하우스%20수원&z=16&hl=ko&output=embed',
  directions: {
    naverMapUrl: 'https://map.naver.com/p/entry/place/12055125',
    kakaoMapUrl: 'https://map.kakao.com/?itemId=1818839884',
    tmapUrl: 'https://map.life/6e0491e2',
    venuePageUrl: 'https://www.partyumhouse.com/location/#request',
  },
};

/** 계좌 — reassuranceNote(안심 문구)만 버전별로 다릅니다. */
export const accountsBase: Omit<WeddingConfig['accounts'], 'reassuranceNote'> = {
  enabled: true,
  heading: '마음 전하실 곳',
  list: [
    { side: 'groom', holderLabel: '신랑 강민구', bank: '국민은행', number: '123-45-678901', kakaoPayUrl: '' },
    { side: 'groom', holderLabel: '아버지 김아버지', bank: '신한은행', number: '110-222-333444' },
    { side: 'bride', holderLabel: '신부 유미진', bank: '카카오뱅크', number: '3333-01-2345678', kakaoPayUrl: '' },
    { side: 'bride', holderLabel: '어머니 최어머니', bank: '우리은행', number: '1002-555-666777' },
  ],
};

export const rsvp: WeddingConfig['rsvp'] = {
  enabled: false,
  deadlineISO: '2026-10-10T23:59:59+09:00',
  askSide: true,
  askHeadcount: true,
  askMeal: true,
};

export const guestbook: WeddingConfig['guestbook'] = {
  enabled: false,
  moderation: 'auto-approve',
  allowPassword: true,
};

/** 공유용 og:image(절대 URL). 제목·설명·링크·맺음말은 버전별로 다릅니다. */
export const ogImage = 'https://your-invitation.pages.dev/images/og-1200x630.jpg';
