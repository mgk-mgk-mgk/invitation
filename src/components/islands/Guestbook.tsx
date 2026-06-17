import { useEffect, useState } from 'preact/hooks';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { weakHash } from '@/lib/clipboard';

interface Props {
  allowPassword: boolean;
}

interface Entry {
  id: number;
  created_at: string;
  name: string;
  message: string;
}

export default function Guestbook({ allowPassword }: Props) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');

  async function load() {
    const sb = getSupabase();
    if (!sb) {
      setLoading(false);
      return;
    }
    const { data } = await sb
      .from('guestbook')
      .select('id, created_at, name, message')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(100);
    setEntries((data as Entry[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: Event) {
    e.preventDefault();
    if (honeypot) return;
    if (!name.trim() || !message.trim()) return;
    const sb = getSupabase();
    if (!sb) {
      setStatus('error');
      return;
    }
    setStatus('sending');
    const password_hash = allowPassword && password ? await weakHash(password) : null;
    const { error } = await sb.from('guestbook').insert({
      name: name.trim(),
      message: message.trim(),
      password_hash,
    });
    if (error) {
      setStatus('error');
      return;
    }
    setName('');
    setMessage('');
    setPassword('');
    setStatus('idle');
    load();
  }

  if (!isSupabaseConfigured) {
    return <p class="island-note">방명록은 Supabase 설정 후 활성화됩니다.</p>;
  }

  return (
    <div class="gb">
      <form class="gb-form" onSubmit={submit}>
        <div class="gb-form__top">
          <input type="text" value={name} maxLength={30} placeholder="이름"
            onInput={(e) => setName((e.target as HTMLInputElement).value)} required />
          {allowPassword && (
            <input type="password" value={password} maxLength={20} placeholder="비밀번호(선택)"
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)} />
          )}
        </div>
        <textarea value={message} maxLength={500} placeholder="축하의 한마디를 남겨주세요"
          onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)} required />
        <input type="text" value={honeypot} onInput={(e) => setHoneypot((e.target as HTMLInputElement).value)}
          tabIndex={-1} autocomplete="off" aria-hidden="true"
          style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0" />
        {status === 'error' && <p class="island-error">등록에 실패했어요. 다시 시도해 주세요.</p>}
        <button type="submit" class="btn btn--accent btn--block" disabled={status === 'sending'}>
          {status === 'sending' ? '등록 중…' : '축하 메시지 남기기'}
        </button>
      </form>

      <div class="gb-list">
        {loading && <p class="island-note center">불러오는 중…</p>}
        {!loading && entries.length === 0 && <p class="island-note center">첫 번째 축하 메시지를 남겨주세요 🤍</p>}
        {entries.map((en) => (
          <div class="gb-item" key={en.id}>
            <p class="gb-item__msg">{en.message}</p>
            <p class="gb-item__meta muted">— {en.name}</p>
          </div>
        ))}
      </div>

      <style>{`
        .gb { display: grid; gap: 1.5rem; }
        .gb-form { display: grid; gap: 0.6rem; }
        .gb-form__top { display: flex; gap: 0.5rem; }
        .gb-list { display: grid; gap: 0.6rem; }
        .gb-item { border: 1px solid var(--c-line); border-radius: 12px; background: var(--c-surface); padding: 0.9rem 1.1rem; }
        .gb-item__msg { margin: 0; font-size: 0.92rem; white-space: pre-line; }
        .gb-item__meta { margin: 0.5rem 0 0; font-size: 0.8rem; text-align: right; }
        .island-note, .island-error { font-size: 0.85rem; color: var(--c-ink-soft); }
        .island-error { color: #b5524b; }
      `}</style>
    </div>
  );
}
