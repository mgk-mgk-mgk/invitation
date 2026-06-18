import type { WeddingConfig } from '@/types/wedding';

/**
 * ★ 단일 진실의 원천 (Single Source of Truth)
 * 이 파일 하나만 고치면 청첩장 전체가 바뀝니다. 아래 값들을 실제 정보로 교체하세요.
 * 빌드 시 src/lib/config.ts 의 zod 스키마가 검증합니다(필수값 누락 시 빌드 실패).
 */
export const wedding: WeddingConfig = {
  meta: {
    locale: 'ko-KR',
    theme: 'ivory',
  },

  cover: {
    heroImage: '/images/hero.jpg',
    groomName: '강민구',
    brideName: '유미진',
    datetimeISO: '2026-10-03T12:10:00+09:00', // 요일/D-day 전부 여기서 파생
    venueShort: '○○웨딩홀 3F 그랜드볼룸',
    dateHeroStyle: 'YYYY.MM.DD DAY',
    scrollCue: '아래로 넘겨주세요',
  },

  bgm: {
    enabled: true,
    src: '/bgm.mp3',
    autoplay: false,
  },

  greeting: {
    message:
      '두 사람이 사랑으로 하나가 되어\n새로운 시작을 함께하려 합니다.\n오셔서 따뜻한 축복으로 함께해 주시면\n더없는 기쁨이겠습니다.',
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
  },

  gallery: {
    enabled: true,
    layout: 'grid',
    images: Array.from({ length: 17 }, (_, i) => {
      const n = String(i + 1).padStart(2, '0');
      return { src: `/images/gallery/${n}.jpg`, alt: `웨딩 사진 ${i + 1}` };
    }),
  },

  coupleStory: {
    enabled: false, // 격식판 기본 off (캐주얼판이면 true)
    timeline: [
      { date: '2021.05', title: '처음 만난 날' },
      { date: '2024.12', title: '프러포즈' },
    ],
  },

  calendar: {
    enabled: true,
    showCountdown: true,
    addToCalendar: true,
  },

  location: {
    venueName: '○○웨딩홀',
    hallFloor: '3F 그랜드볼룸',
    address: '서울특별시 강남구 테헤란로 000',
    staticMapImage: '/images/map-static.png',
    directions: {
      naverMapUrl: 'https://map.naver.com/',
      kakaoMapUrl: 'https://map.kakao.com/',
      tmapUrl: 'https://tmap.life/',
    },
    byCar: '건물 지하 주차장 2시간 무료 (이후 시간당 1,000원)',
    byTransit: '2호선 ○○역 3번 출구 도보 5분',
    byShuttle: '○○역 1번 출구에서 셔틀버스 운행 (11:30~13:00, 15분 간격)',
  },

  contacts: {
    enabled: true,
  },

  accounts: {
    enabled: true,
    heading: '마음 전하실 곳',
    reassuranceNote:
      '참석이 어려우신 분들을 위해 안내드립니다.\n축하해 주시는 따뜻한 마음, 감사히 간직하겠습니다.',
    list: [
      { side: 'groom', holderLabel: '신랑 강민구', bank: '국민은행', number: '123-45-678901', kakaoPayUrl: '' },
      { side: 'groom', holderLabel: '아버지 김아버지', bank: '신한은행', number: '110-222-333444' },
      { side: 'bride', holderLabel: '신부 유미진', bank: '카카오뱅크', number: '3333-01-2345678', kakaoPayUrl: '' },
      { side: 'bride', holderLabel: '어머니 최어머니', bank: '우리은행', number: '1002-555-666777' },
    ],
  },

  rsvp: {
    enabled: true,
    deadlineISO: '2026-10-10T23:59:59+09:00',
    askSide: true,
    askHeadcount: true,
    askMeal: true,
  },

  guestbook: {
    enabled: true,
    moderation: 'auto-approve',
    allowPassword: true,
  },

  notices: {
    declineWreath: true,
    items: [
      { title: '화환', body: '화환은 정중히 사양합니다. 축하해 주시는 마음만 감사히 받겠습니다.' },
      { title: '포토부스', body: '예식 당일 현장에서 찍은 사진을 함께 나눠요. 자유롭게 담아 가세요.' },
    ],
  },

  share: {
    siteUrl: 'https://your-invitation.pages.dev',
    ogTitle: '민구 ♥ 미진 결혼합니다',
    ogDescription: '2026.10.03 (토) 낮 12시 10분, ○○웨딩홀 3F 그랜드볼룸',
    ogImage: 'https://your-invitation.pages.dev/images/og-1200x630.jpg',
    closingMessage:
      '소중한 분들을 모시고\n저희 두 사람의 약속을 나누고 싶습니다.\n함께해 주셔서 진심으로 감사합니다.',
  },
};

export default wedding;
