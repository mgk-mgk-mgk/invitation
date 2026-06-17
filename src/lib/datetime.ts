/**
 * 날짜 파생 유틸 — cover.datetimeISO "하나"에서 요일/날짜히어로/D-day를 모두 계산.
 * 손으로 요일을 적지 않으므로 "날짜-요일 불일치"(청첩장 최대 실수)가 구조적으로 불가능.
 */

const KST = 'Asia/Seoul';
const DOW_KO = ['일', '월', '화', '수', '목', '금', '토'];
const DOW_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

/** KST 기준의 연/월/일/요일/시각을 안전하게 추출 */
function kstParts(iso: string) {
  const d = new Date(iso);
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: KST,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    weekday: 'short',
  });
  const map: Record<string, string> = {};
  for (const p of fmt.formatToParts(d)) map[p.type] = p.value;
  const weekdayIndex = DOW_EN.indexOf((map.weekday || '').toUpperCase());
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    weekdayIndex: weekdayIndex < 0 ? new Date(iso).getDay() : weekdayIndex,
    date: d,
  };
}

export function dayOfWeekKo(iso: string): string {
  return DOW_KO[kstParts(iso).weekdayIndex];
}

export function dayOfWeekEn(iso: string): string {
  return DOW_EN[kstParts(iso).weekdayIndex];
}

/** "2026.10.17" 또는 "2026.10.17 SAT" */
export function dateHero(iso: string, style: 'YYYY.MM.DD' | 'YYYY.MM.DD DAY' = 'YYYY.MM.DD'): string {
  const { year, month, day } = kstParts(iso);
  const base = `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
  return style === 'YYYY.MM.DD DAY' ? `${base} ${dayOfWeekEn(iso)}` : base;
}

/** "2026년 10월 17일 토요일 오후 1시" */
export function dateKoFull(iso: string): string {
  const { year, month, day, hour, minute } = kstParts(iso);
  const ampm = hour < 12 ? '오전' : '오후';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const min = minute ? ` ${minute}분` : '';
  return `${year}년 ${month}월 ${day}일 ${dayOfWeekKo(iso)}요일 ${ampm} ${h12}시${min}`;
}

/** 캘린더 그리드용: 해당 월의 일 수와 1일의 요일, 결혼식 날짜 */
export function monthGrid(iso: string) {
  const { year, month, day } = kstParts(iso);
  const firstDow = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return { year, month, weddingDay: day, firstDow, daysInMonth };
}

/**
 * D-day. 양수=남은 일, 0=오늘, 음수=지남.
 * 자정(KST) 기준으로 계산. nowIso 를 주입하면 테스트/SSR 고정 가능.
 */
export function dDay(targetIso: string, nowIso?: string): number {
  const t = kstParts(targetIso);
  const n = nowIso ? kstParts(nowIso) : kstParts(new Date().toISOString());
  const target = Date.UTC(t.year, t.month - 1, t.day);
  const today = Date.UTC(n.year, n.month - 1, n.day);
  return Math.round((target - today) / 86_400_000);
}

/** "D-30" / "D-DAY" / "신혼 5일차" 라벨 */
export function dDayLabel(targetIso: string, nowIso?: string): string {
  const d = dDay(targetIso, nowIso);
  if (d > 0) return `D-${d}`;
  if (d === 0) return 'D-DAY';
  return `신혼 ${-d}일차`;
}
