/** 캘린더에 추가(.ics) — 예식 1시간 일정으로 생성 */

function toICSDate(iso: string): string {
  // ICS UTC 포맷: YYYYMMDDTHHMMSSZ
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function buildICS(opts: {
  title: string;
  startIso: string;
  durationMinutes?: number;
  location?: string;
  description?: string;
}): string {
  const start = new Date(opts.startIso);
  const end = new Date(start.getTime() + (opts.durationMinutes ?? 60) * 60_000);
  const esc = (s: string) => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//invitation//wedding//KO',
    'BEGIN:VEVENT',
    `DTSTART:${toICSDate(opts.startIso)}`,
    `DTEND:${toICSDate(end.toISOString())}`,
    `SUMMARY:${esc(opts.title)}`,
    opts.location ? `LOCATION:${esc(opts.location)}` : '',
    opts.description ? `DESCRIPTION:${esc(opts.description)}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');
}

/** 구글 캘린더 추가 링크 */
export function googleCalendarUrl(opts: {
  title: string;
  startIso: string;
  durationMinutes?: number;
  location?: string;
  details?: string;
}): string {
  const start = new Date(opts.startIso);
  const end = new Date(start.getTime() + (opts.durationMinutes ?? 60) * 60_000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: opts.title,
    dates: `${fmt(start)}/${fmt(end)}`,
    location: opts.location ?? '',
    details: opts.details ?? '',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
