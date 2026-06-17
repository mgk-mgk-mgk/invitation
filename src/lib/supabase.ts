import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * 브라우저용 Supabase 클라이언트 (anon/public 키만).
 * 섬(island) 컴포넌트에서만 사용합니다. service_role 키는 절대 클라이언트에 두지 마세요.
 * env 가 비어 있으면 null 을 반환 → 섬들이 "설정 필요" 상태로 안전하게 degrade.
 */
const url = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (_client) return _client;
  if (!url || !anonKey) {
    if (import.meta.env.DEV) {
      console.warn('[supabase] PUBLIC_SUPABASE_URL / ANON_KEY 미설정 — RSVP·방명록이 비활성화됩니다.');
    }
    return null;
  }
  _client = createClient(url, anonKey, { auth: { persistSession: false } });
  return _client;
}

export const isSupabaseConfigured = Boolean(url && anonKey);

// 방문수 +1 (RPC). 실패해도 조용히 무시.
export async function bumpVisits(): Promise<number | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.rpc('increment_visits');
  if (error) return null;
  return typeof data === 'number' ? data : null;
}
