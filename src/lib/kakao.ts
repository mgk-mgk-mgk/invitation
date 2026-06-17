/**
 * 카카오톡 공유 (JavaScript SDK).
 * Feed 템플릿으로 카드를 "직접" 구성합니다(OG 스크래핑에 의존하지 않음 → 더 안정적).
 * 동시에 <head> 의 OG 메타가 생링크/아이메시지 붙여넣기를 커버합니다.
 *
 * 운영 체크리스트:
 *  1) developers.kakao.com 에 배포 도메인 등록 (플랫폼 > Web)
 *  2) PUBLIC_KAKAO_JS_KEY 설정
 *  3) 이미지 바꾸면 OG 캐시 리셋: developers.kakao.com/tool/clear/og
 */

declare global {
  interface Window {
    Kakao?: any;
  }
}

const SDK_SRC = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js';
const SDK_INTEGRITY = 'sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka';

let sdkPromise: Promise<void> | null = null;

function loadSdk(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.Kakao) return Promise.resolve();
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SDK_SRC;
    s.integrity = SDK_INTEGRITY;
    s.crossOrigin = 'anonymous';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Kakao SDK load 실패'));
    document.head.appendChild(s);
  });
  return sdkPromise;
}

export async function initKakao(): Promise<boolean> {
  const key = import.meta.env.PUBLIC_KAKAO_JS_KEY as string | undefined;
  if (!key) return false;
  try {
    await loadSdk();
    if (!window.Kakao.isInitialized()) window.Kakao.init(key);
    return true;
  } catch {
    return false;
  }
}

export interface SharePayload {
  title: string;
  description: string;
  imageUrl: string; // 절대 https
  linkUrl: string;  // 절대 https
}

/** 카카오톡 Feed 공유. SDK 미설정/실패 시 false 반환 → 호출부에서 링크복사로 폴백. */
export async function shareToKakao(p: SharePayload): Promise<boolean> {
  const ok = await initKakao();
  if (!ok || !window.Kakao?.Share) return false;
  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: p.title,
      description: p.description,
      imageUrl: p.imageUrl,
      link: { mobileWebUrl: p.linkUrl, webUrl: p.linkUrl },
    },
    buttons: [
      {
        title: '청첩장 보기',
        link: { mobileWebUrl: p.linkUrl, webUrl: p.linkUrl },
      },
    ],
  });
  return true;
}
