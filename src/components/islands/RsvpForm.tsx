import { useState } from 'preact/hooks';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

interface Props {
  askSide: boolean;
  askHeadcount: boolean;
  askMeal: boolean;
  deadlineISO?: string;
}

type Side = 'groom' | 'bride';

const cx = (...xs: Array<string | false | undefined>) => xs.filter(Boolean).join(' ');

export default function RsvpForm({ askSide, askHeadcount, askMeal, deadlineISO }: Props) {
  const [side, setSide] = useState<Side>('groom');
  const [attending, setAttending] = useState(true);
  const [name, setName] = useState('');
  const [headcount, setHeadcount] = useState(1);
  const [meal, setMeal] = useState(true);
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // 봇 트랩
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const past = deadlineISO ? Date.parse(deadlineISO) < Date.now() : false;

  async function submit(e: Event) {
    e.preventDefault();
    if (honeypot) {
      setStatus('done'); // 봇: 조용히 성공 처리
      return;
    }
    if (!name.trim()) return;

    const sb = getSupabase();
    if (!sb) {
      setStatus('error');
      return;
    }
    setStatus('sending');
    const { error } = await sb.from('rsvps').insert({
      side: askSide ? side : 'groom',
      attending,
      headcount: askHeadcount && attending ? headcount : attending ? 1 : 0,
      meal: askMeal && attending ? meal : null,
      name: name.trim(),
      message: message.trim() || null,
    });
    setStatus(error ? 'error' : 'done');
  }

  if (!isSupabaseConfigured) {
    return (
      <p class="island-note">
        참석여부 기능은 Supabase 설정 후 활성화됩니다. (.env 의 PUBLIC_SUPABASE_URL / ANON_KEY)
      </p>
    );
  }

  if (status === 'done') {
    return (
      <div class="rsvp-done center">
        <p class="rsvp-done__icon">💐</p>
        <p>참석 여부가 전달되었습니다.<br />소중한 마음 감사합니다!</p>
      </div>
    );
  }

  if (past) {
    return <p class="island-note center">참석 여부 응답이 마감되었습니다. 감사합니다.</p>;
  }

  return (
    <form class="rsvp-form" onSubmit={submit}>
      {askSide && (
        <div class="rsvp-row">
          <span class="rsvp-label">구분</span>
          <div class="seg">
            <button type="button" class={cx('seg__b', side === 'groom' && 'is-on')} onClick={() => setSide('groom')}>신랑측</button>
            <button type="button" class={cx('seg__b', side === 'bride' && 'is-on')} onClick={() => setSide('bride')}>신부측</button>
          </div>
        </div>
      )}

      <div class="rsvp-row">
        <span class="rsvp-label">참석</span>
        <div class="seg">
          <button type="button" class={cx('seg__b', attending && 'is-on')} onClick={() => setAttending(true)}>참석</button>
          <button type="button" class={cx('seg__b', !attending && 'is-on')} onClick={() => setAttending(false)}>미참석</button>
        </div>
      </div>

      <label class="rsvp-field">
        <span class="rsvp-label">성함</span>
        <input type="text" value={name} maxLength={30} placeholder="성함을 입력해 주세요"
          onInput={(e) => setName((e.target as HTMLInputElement).value)} required />
      </label>

      {attending && askHeadcount && (
        <label class="rsvp-field">
          <span class="rsvp-label">동행 인원 (본인 포함)</span>
          <input type="number" min={1} max={20} value={headcount}
            onInput={(e) => setHeadcount(Number((e.target as HTMLInputElement).value) || 1)} />
        </label>
      )}

      {attending && askMeal && (
        <div class="rsvp-row">
          <span class="rsvp-label">식사</span>
          <div class="seg">
            <button type="button" class={cx('seg__b', meal && 'is-on')} onClick={() => setMeal(true)}>예정</button>
            <button type="button" class={cx('seg__b', !meal && 'is-on')} onClick={() => setMeal(false)}>안함</button>
          </div>
        </div>
      )}

      <label class="rsvp-field">
        <span class="rsvp-label">남기실 말씀 (선택)</span>
        <textarea value={message} maxLength={500} onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)} />
      </label>

      {/* 봇 트랩 (사람에겐 안 보임) */}
      <input type="text" value={honeypot} onInput={(e) => setHoneypot((e.target as HTMLInputElement).value)}
        tabIndex={-1} autocomplete="off" aria-hidden="true"
        style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0" />

      {status === 'error' && <p class="island-error">전송에 실패했어요. 잠시 후 다시 시도해 주세요.</p>}

      <button type="submit" class="btn btn--accent btn--block" disabled={status === 'sending'}>
        {status === 'sending' ? '전송 중…' : '참석 여부 전달하기'}
      </button>

      <style>{`
        .rsvp-form { display: grid; gap: 1rem; }
        .rsvp-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
        .rsvp-field { display: grid; gap: 0.4rem; }
        .rsvp-label { font-size: 0.82rem; color: var(--c-ink-soft); }
        .seg { display: inline-flex; border: 1px solid var(--c-line); border-radius: 999px; overflow: hidden; background: var(--c-surface); }
        .seg__b { border: none; background: transparent; padding: 0.5rem 1rem; font-size: 0.85rem; cursor: pointer; color: var(--c-ink-soft); }
        .seg__b.is-on { background: var(--c-accent); color: #fff; }
        .rsvp-done__icon { font-size: 2rem; margin: 0 0 0.5rem; }
        .island-note, .island-error { font-size: 0.85rem; color: var(--c-ink-soft); }
        .island-error { color: #b5524b; }
      `}</style>
    </form>
  );
}
