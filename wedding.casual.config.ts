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
 * ★ 캐주얼판 (친구·지인용) — '/casual' 경로
 * 사실 데이터(이름·날짜·예식장·계좌 등)는 wedding.shared.ts 와 공유합니다 — 거기만 고치면 양쪽 반영.
 * 이 파일에는 캐주얼판 고유의 톤만 둡니다:
 *  (1) 친근한 인사말 (2) 우리의 이야기(연애 타임라인) ON (3) 가벼운 안내·공유 문구 (4) 테마 blush.
 */
export const weddingCasual: WeddingConfig = {
  meta: {
    locale: 'ko-KR',
    theme: 'blush', // 격식판(ivory)과 무드 구분
  },

  cover: { ...coverBase, scrollCue: '아래로 살짝 내려보세요', profileImage: '/images/gallery/17.jpg', venueShort: '파티움하우스 수원, 파티움홀(3층)' },

  bgm,

  greeting: {
    message:
      '우리 결혼해요! 🤍\n오래 곁을 지켜준 소중한 사람들과\n이 특별한 날을 함께 나누고 싶어요.\n바쁘시겠지만 오셔서 축하해 주시면 정말 기쁘겠어요.',
    ...families,
  },

  gallery,

  coupleStory: {
    enabled: true, // 캐주얼판의 핵심 — 연애 타임라인을 켭니다
    groomProfile: '늘 한결같고 든든한 사람. 미진이를 만나 더 자주 웃게 됐어요.',
    brideProfile: '웃음이 많고 다정한 사람. 민구와 함께라 매일이 즐거워요.',
    timeline: [
      { date: '2021.05', title: '처음 만난 날', body: '친구 소개로 처음 만나 어색하게 인사했던 그날.' },
      { date: '2021.08', title: '첫 여행', body: '함께 떠난 첫 여행에서 서로를 더 알게 됐어요.' },
      { date: '2024.12', title: '프러포즈', body: '"평생 같이 웃자"는 약속을 나눴습니다.' },
      { date: '2026.10', title: '결혼', body: '이제 부부로 새로운 이야기를 시작해요.' },
    ],
    // 우리 둘의 짧은 영상 — public/video/ 에 파일을 넣고 경로를 맞춰주세요.
    filmSrc: '/video/our-moment.mp4',
    // filmPoster: '/images/film-poster.jpg', // (선택) 영상 포스터 이미지. 생략 시 영상 첫 프레임을 포스터·썸네일로 사용(피드와 동일 내용).
  },

  calendar,

  location,

  contacts: {
    enabled: true, // 친구들이 바로 연락할 수 있게 캐주얼판은 켜둠
  },

  accounts: {
    ...accountsBase,
    reassuranceNote:
      '와주시는 것만으로 충분하지만,\n축하의 마음을 전하고 싶은 분들을 위해 살짝 남겨둘게요. 🙏',
  },

  rsvp,

  guestbook,

  notices: {
    declineWreath: true,
    items: [
      { title: '화환', body: '마음만으로 충분해요. 화환은 정중히 사양할게요. 🙏' },
      { title: '포토부스', body: '곳곳에 포토존을 준비했어요. 예쁘게 찍고 마음껏 담아 가세요. 📸' },
      { title: '드레스코드', body: '편하게 오셔도 좋아요. 봄빛 파스텔이면 사진이 더 예뻐요. 🌸' },
    ],
  },

  share: {
    siteUrl: 'https://your-invitation.pages.dev/casual',
    ogTitle: '민구 ♥ 미진, 우리 결혼해요!',
    ogDescription: '2026.10.03 (토) 낮 12시 10분 · 파티움하우스 수원 파티움홀',
    ogImage,
    closingMessage:
      '함께 웃어준 모든 순간이\n오늘의 우리를 만들었어요.\n와주셔서, 축하해 주셔서 정말 고마워요. 🤍',
  },
};

export default weddingCasual;
