/**
 * 인스타그램 UI 인라인 SVG 아이콘 — 외부 아이콘 라이브러리 없이 stroke/size 일관 유지.
 * Astro 에서 `set:html` 로 렌더합니다. 대부분 24x24, currentColor 기반(액션/네비).
 */

export const chevronLeft =
  `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;

export const more =
  `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>`;

export const heart =
  `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 8.6c0 4.5-7.6 9.5-8.8 10.3-1.2-.8-8.8-5.8-8.8-10.3A4.6 4.6 0 0 1 12 6.7a4.6 4.6 0 0 1 8.8 1.9z"/></svg>`;

/** 더블탭 팝용 꽉 찬 하트 */
export const heartFill =
  `<svg viewBox="0 0 24 24"><path d="M20.8 8.6c0 4.5-7.6 9.5-8.8 10.3-1.2-.8-8.8-5.8-8.8-10.3A4.6 4.6 0 0 1 12 6.7a4.6 4.6 0 0 1 8.8 1.9z"/></svg>`;

export const comment =
  `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.7 11.8a8.4 8.4 0 0 1-12.1 7.6L3.3 21l1.6-5.2A8.4 8.4 0 1 1 20.7 11.8z"/></svg>`;

export const share =
  `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="21.5" y1="3" x2="10.5" y2="13"/><polygon points="21.5 3 14.8 21 10.5 13 3 9 21.5 3"/></svg>`;

export const bookmark =
  `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h12v17l-6-4.3L6 21z"/></svg>`;

export const home =
  `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5.2 9.3V21H10v-6h4v6h4.8V9.3"/></svg>`;

export const search =
  `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>`;

export const plusSquare =
  `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`;

/** 게시물 그리드 탭 아이콘 */
export const gridIcon =
  `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>`;

export const reelsIcon =
  `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M3 8h18M8.5 3l3 5M14 3l3 5"/><path d="M10.5 10.5v5l4-2.5z" fill="currentColor" stroke="none"/></svg>`;

export const tagIcon =
  `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="3.2"/><path d="M5 20c.6-3.5 3.4-5.5 7-5.5s6.4 2 7 5.5"/></svg>`;

/** 인증 배지(블루) — @아이디·이름·게시물 헤더에 재사용 */
export const verified =
  `<svg viewBox="0 0 24 24" width="15" height="15"><circle cx="12" cy="12" r="10" fill="#3897f0"/><path d="M10.3 15.4 6.8 11.9l1.3-1.3 2.2 2.2 5.1-5.1 1.3 1.3z" fill="#fff"/></svg>`;
