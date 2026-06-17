/**
 * 클립보드 복사 — 카카오톡 인앱 웹뷰 대응(execCommand 폴백 포함).
 * 계좌번호/주소/링크 복사에 사용.
 */
export async function copyText(text: string): Promise<boolean> {
  // 1) 표준 API
  if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* 폴백으로 진행 */
    }
  }
  // 2) execCommand 폴백 (구형/웹뷰)
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/** 간단 토스트 (전역 1개 재사용) */
let toastEl: HTMLDivElement | null = null;
let toastTimer: number | undefined;

export function toast(message: string): void {
  if (typeof document === 'undefined') return;
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = message;
  toastEl.classList.add('toast--show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl?.classList.remove('toast--show'), 1800);
}

/** 작성자 본인 삭제용 약식 해시(보안용 아님, 단순 식별용) */
export async function weakHash(text: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return text; // 폴백
}
