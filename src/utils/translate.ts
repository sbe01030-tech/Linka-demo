/**
 * 메시지 번역 (데모용) — 무료 Google translate gtx 엔드포인트 사용.
 * 양방향: 받는 사람의 언어로 번역 (sl=auto 로 원문 언어 자동 감지).
 *  - 고객(한국어) ←→ 워커(인도네시아어) 모두 동작
 * 인터넷이 필요. 실패 시 null 반환 → 호출부에서 원문 유지.
 */
export type TargetLang = 'ko' | 'id' | 'en';

export async function translateText(text: string, target: TargetLang): Promise<string | null> {
  const q = text.trim();
  if (!q) return null;
  try {
    const url =
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(q)}`;
    const r = await fetch(url);
    if (!r.ok) return null;
    const j = await r.json();
    // j[0] = [[translatedSegment, originalSegment, ...], ...]
    const out = (j[0] || []).map((seg: any[]) => seg[0]).join('');
    return out || null;
  } catch {
    return null;
  }
}
