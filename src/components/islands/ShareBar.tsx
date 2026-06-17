import { shareToKakao } from '@/lib/kakao';
import { copyText, toast } from '@/lib/clipboard';

interface Props {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
}

/** 떠 있는 공유 바 — 카카오톡 공유 + 링크 복사. */
export default function ShareBar({ title, description, imageUrl, linkUrl }: Props) {
  async function onKakao() {
    const ok = await shareToKakao({ title, description, imageUrl, linkUrl });
    if (!ok) {
      const copied = await copyText(linkUrl);
      toast(copied ? '카카오 공유 미설정 — 링크를 복사했어요' : '공유에 실패했어요');
    }
  }

  async function onCopy() {
    const ok = await copyText(linkUrl);
    toast(ok ? '청첩장 링크가 복사되었습니다' : '복사에 실패했어요');
  }

  return (
    <div class="sharebar">
      <button type="button" class="sharebar__btn sharebar__kakao" onClick={onKakao}>
        <span aria-hidden="true">💬</span> 카카오톡 공유
      </button>
      <button type="button" class="sharebar__btn" onClick={onCopy} aria-label="링크 복사">
        🔗
      </button>

      <style>{`
        .sharebar {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          bottom: calc(1rem + env(safe-area-inset-bottom));
          width: min(var(--w-phone), 100vw);
          padding: 0 1.5rem;
          display: flex;
          gap: 0.5rem;
          z-index: 60;
          pointer-events: none;
        }
        .sharebar__btn {
          pointer-events: auto;
          border: none;
          border-radius: 999px;
          padding: 0.8rem 1rem;
          font-size: 0.9rem;
          font-family: var(--font-sans);
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(0,0,0,0.18);
          background: var(--c-surface);
          color: var(--c-ink);
        }
        .sharebar__kakao {
          flex: 1;
          background: #fee500;
          color: #191600;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
