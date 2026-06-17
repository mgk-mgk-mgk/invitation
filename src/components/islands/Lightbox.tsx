import { useEffect, useState } from 'preact/hooks';
import type { GalleryImage } from '@/types/wedding';

interface Props {
  images: GalleryImage[];
}

/**
 * 풀스크린 갤러리 뷰어. 썸네일은 정적(Astro)으로 렌더되고, 이 섬은 오버레이만 담당.
 * [data-gallery-item][data-index] 버튼 클릭을 위임 처리.
 */
export default function Lightbox({ images }: Props) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-gallery-item]');
      if (!btn) return;
      const i = Number(btn.dataset.index);
      if (!Number.isNaN(i)) setIndex(i);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIndex(null);
      if (e.key === 'ArrowRight') setIndex((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === 'ArrowLeft') setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, images.length]);

  if (!open || index === null) return null;
  const img = images[index];
  const go = (d: number) => setIndex((index + d + images.length) % images.length);

  // 간단 스와이프
  let startX = 0;
  const onTouchStart = (e: TouchEvent) => (startX = e.touches[0].clientX);
  const onTouchEnd = (e: TouchEvent) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  return (
    <div class="lb" role="dialog" aria-modal="true" aria-label="사진 크게 보기" onClick={() => setIndex(null)}>
      <button class="lb__close" aria-label="닫기" onClick={() => setIndex(null)}>×</button>
      <button class="lb__nav lb__prev" aria-label="이전" onClick={(e) => { e.stopPropagation(); go(-1); }}>‹</button>
      <img
        class="lb__img"
        src={img.src}
        alt={img.alt}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart as any}
        onTouchEnd={onTouchEnd as any}
      />
      <button class="lb__nav lb__next" aria-label="다음" onClick={(e) => { e.stopPropagation(); go(1); }}>›</button>
      <p class="lb__count">{index + 1} / {images.length}</p>

      <style>{`
        .lb { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.92);
          display: grid; place-items: center; }
        .lb__img { max-width: 92vw; max-height: 82vh; object-fit: contain; border-radius: 6px; }
        .lb__close { position: absolute; top: calc(1rem + env(safe-area-inset-top)); right: 1rem;
          font-size: 2rem; color: #fff; background: none; border: none; cursor: pointer; line-height: 1; }
        .lb__nav { position: absolute; top: 50%; transform: translateY(-50%);
          font-size: 2.5rem; color: #fff; background: none; border: none; cursor: pointer; padding: 0 0.6rem; }
        .lb__prev { left: 0.2rem; }
        .lb__next { right: 0.2rem; }
        .lb__count { position: absolute; bottom: calc(1.4rem + env(safe-area-inset-bottom));
          color: #fff; font-size: 0.85rem; letter-spacing: 0.1em; }
      `}</style>
    </div>
  );
}
