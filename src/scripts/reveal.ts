/**
 * 스크롤 reveal — 페이지 전체에서 "공유 IntersectionObserver 1개"로 .reveal 요소를 처리.
 * 보이면 .is-visible 토글(CSS가 transform/opacity 애니메이션 담당), 한 번 보이면 관찰 해제.
 * prefers-reduced-motion 이면 즉시 모두 표시하고 관찰하지 않음.
 */
export function initReveal(): void {
  if (typeof window === 'undefined') return;

  const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
  if (els.length === 0) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );

  els.forEach((el) => io.observe(el));
}
