import { shareToKakao } from '@/lib/kakao';
import { copyText, toast } from '@/lib/clipboard';

interface Props {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
}

/** 문서 하단 공유 바 — 카카오톡 공유 + 링크 복사. */
export default function ShareBar({ title, description, imageUrl, linkUrl }: Props) {
  function getShareUrl() {
    if (typeof window === 'undefined') return linkUrl;
    const isPlaceholder = /your-invitation\.pages\.dev|example\.github\.io/.test(linkUrl);
    return isPlaceholder ? window.location.href : linkUrl;
  }

  async function onKakao() {
    const shareUrl = getShareUrl();
    const ok = await shareToKakao({ title, description, imageUrl, linkUrl: shareUrl });
    if (!ok) {
      const copied = await copyText(shareUrl);
      toast(copied ? '카카오 공유 설정이 필요해요. 링크를 복사했어요' : '공유에 실패했어요');
    }
  }

  async function onCopy() {
    const ok = await copyText(getShareUrl());
    toast(ok ? '청첩장 링크가 복사되었습니다' : '복사에 실패했어요');
  }

  return (
    <div class="sharebar">
      <button type="button" class="sharebar__btn sharebar__kakao" onClick={onKakao} aria-label="카카오톡으로 공유하기">
        <svg class="sharebar__kakao-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4C6.48 4 2 7.53 2 11.88c0 2.8 1.86 5.25 4.66 6.65l-.86 3.05a.45.45 0 0 0 .68.5l3.75-2.5c.57.08 1.16.13 1.77.13 5.52 0 10-3.53 10-7.88S17.52 4 12 4Z" />
        </svg>
      </button>
      <button type="button" class="sharebar__btn" onClick={onCopy} aria-label="링크 복사">
        <svg class="sharebar__link-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 7a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-1v-2h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v1H8V7Z" />
          <path d="M6 9h7a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-5a3 3 0 0 1 3-3Zm0 2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H6Z" />
        </svg>
      </button>

      <style>{`
        .sharebar {
          width: 100%;
          padding: 0.25rem var(--pad-x) calc(1rem + env(safe-area-inset-bottom));
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          background: var(--c-bg);
        }
        .sharebar__btn {
          border: none;
          border-radius: 999px;
          width: 48px;
          height: 48px;
          padding: 0;
          font-size: 1.05rem;
          font-family: var(--font-sans);
          cursor: pointer;
          background: var(--c-surface);
          color: var(--c-ink);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.08);
        }
        .sharebar__kakao {
          background: #fee500;
          color: #191600;
        }
        .sharebar__kakao-icon {
          width: 26px;
          height: 26px;
          fill: currentColor;
        }
        .sharebar__link-icon {
          width: 18px;
          height: 18px;
          fill: currentColor;
        }
      `}</style>
    </div>
  );
}
