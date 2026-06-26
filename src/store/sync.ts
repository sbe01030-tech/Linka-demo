/**
 * 데모용 크로스-시뮬레이터 동기화 클라이언트.
 *
 * 로컬 sync-server.js (localhost:4000) 와 통신.
 *  - push*: 로컬에서 메시지/예약/대화방이 생기면 서버로 전송 (fire-and-forget)
 *  - fetchState: 서버 전체 상태를 받아옴 (App 폴러가 1.5초마다 호출 → 스토어 merge)
 *
 * 서버가 안 떠 있어도 앱은 그대로 동작(단일 기기). 모든 호출 실패는 조용히 무시.
 */

// iOS 시뮬레이터에서 localhost = 호스트 Mac. 두 시뮬레이터 모두 같은 서버를 본다.
export const SYNC_BASE = 'http://localhost:4000';

const post = (path: string, body: any) =>
  fetch(`${SYNC_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch(() => {}); // 서버 미가동 시 무시

export function pushThread(thread: any) {
  post('/push', { kind: 'thread', payload: thread });
}

export function pushMessage(threadId: string, msg: any) {
  post('/push', { kind: 'message', payload: { threadId, msg } });
}

export function pushBooking(booking: any) {
  post('/push', { kind: 'booking', payload: booking });
}

export interface RemoteState {
  threads: any[];
  messagesByThread: Record<string, any[]>;
  bookings: any[];
}

export async function fetchState(): Promise<RemoteState | null> {
  try {
    const r = await fetch(`${SYNC_BASE}/state`);
    if (!r.ok) return null;
    return (await r.json()) as RemoteState;
  } catch {
    return null; // 서버 미가동 → 단일 기기 모드
  }
}
