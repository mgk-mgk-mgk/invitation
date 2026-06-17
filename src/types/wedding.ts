/**
 * 청첩장 콘텐츠 계약 (Single Source of Truth 의 타입).
 * 실제 값은 /wedding.config.ts 에 있으며, src/lib/config.ts 가 zod 로 빌드타임 검증합니다.
 *
 * 설계 원칙
 *  - 날짜는 cover.datetimeISO "하나"가 진실의 원천. 요일/D-day/캘린더/신혼 N일차는 전부 파생.
 *  - 한국 예법을 데이터 "모양"에 박아둡니다(계좌 제목 기본값, 故 처리, 출생순 호칭, 화환 사양 등).
 *  - 각 섹션은 enabled 토글로 on/off → 격식판/캐주얼판이 같은 빌드.
 */

export type ThemeName = 'ivory' | 'sage' | 'blush';
export type BirthOrder =
  | '장남' | '차남' | '삼남' | '아들'
  | '장녀' | '차녀' | '삼녀' | '딸';

export interface Person {
  name: string;
  phone?: string;
  birthOrder?: BirthOrder; // 계보 줄: "○○○ · ○○○ 의 장남 ○○○"
}

export interface Parent {
  name: string;
  phone?: string;
  deceased?: boolean; // true → 故 ○○○ 로 표기(또는 hideIfDeceased 로 생략)
  hideIfDeceased?: boolean;
}

export interface FamilySide {
  person: Person;
  father?: Parent;
  mother?: Parent;
}

export interface BankAccount {
  side: 'groom' | 'bride';
  holderLabel: string; // 예: "신랑 ○○○", "신랑 아버지 ○○○"
  bank: string;        // 예: "국민은행"
  number: string;      // 예: "123-45-678901"
  kakaoPayUrl?: string;
}

export interface GalleryImage {
  src: string; // /images/gallery/01.jpg
  alt: string; // 접근성 필수
}

export interface TimelineItem {
  date: string;  // "2019.03"
  title: string;
  body?: string;
}

export interface NoticeItem {
  title: string;
  body: string;
}

export interface WeddingConfig {
  meta: {
    locale: 'ko-KR';
    theme?: ThemeName;
  };

  cover: {
    heroImage: string;
    groomName: string;
    brideName: string;
    /** '2026-10-17T13:00:00+09:00' — 요일/날짜히어로/D-day 전부 여기서 파생 */
    datetimeISO: string;
    /** '○○웨딩홀 3F 그랜드볼룸' */
    venueShort: string;
    dateHeroStyle?: 'YYYY.MM.DD' | 'YYYY.MM.DD DAY';
    scrollCue?: string;
  };

  bgm: {
    enabled: boolean;
    src: string;
    /** 문자 그대로 false — iOS 가 자동재생을 막습니다. 사용자가 토글로 켭니다. */
    autoplay: false;
  };

  greeting: {
    message: string;       // 겸손한 초대문(짧게)
    groom: FamilySide;
    bride: FamilySide;
  };

  gallery: {
    enabled: boolean;
    layout: 'grid' | 'carousel';
    images: GalleryImage[];
  };

  coupleStory: {
    enabled: boolean;      // 격식판 기본 false
    groomProfile?: string;
    brideProfile?: string;
    timeline?: TimelineItem[];
  };

  calendar: {
    enabled: boolean;
    showCountdown: boolean;
    addToCalendar: boolean;
  };

  location: {
    venueName: string;
    hallFloor?: string;
    address: string;        // 복사 가능 폴백
    staticMapImage: string; // 가벼운 정적 지도 이미지(카톡 웹뷰 안전)
    directions: {
      naverMapUrl?: string;
      kakaoMapUrl?: string;
      tmapUrl?: string;
    };
    byCar?: string;
    byTransit?: string;
    byShuttle?: string;
  };

  contacts: {
    enabled: boolean;       // greeting.groom / greeting.bride 의 인물·부모에서 연락처를 끌어옵니다
  };

  accounts: {
    enabled: boolean;
    heading: string;        // 기본 '마음 전하실 곳'
    reassuranceNote?: string;
    list: BankAccount[];
  };

  rsvp: {
    enabled: boolean;
    deadlineISO?: string;
    askSide: boolean;
    askHeadcount: boolean;
    askMeal: boolean;
  };

  guestbook: {
    enabled: boolean;
    moderation: 'auto-approve' | 'manual';
    allowPassword: boolean;
  };

  notices: {
    declineWreath: boolean; // 화환은 정중히 사양합니다
    items: NoticeItem[];
  };

  share: {
    siteUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;        // 절대 https URL, ~1200x630
    closingMessage: string;
  };
}
