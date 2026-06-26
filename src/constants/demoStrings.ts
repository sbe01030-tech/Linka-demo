/**
 * 시연용 고정 문구 + 빠른 목(mock) 번역.
 * 라이브 번역이 버벅이므로, 데모에서 쓰는 문장은 미리 번역해 즉시 표시한다.
 */

// 고객이 채팅 입력창 클릭 시 자동 입력되는 예약 문의
export const DEMO_CHAT_MSG    = '지금 예약하면 내일 시간 맞춰 방문 가능하실까요?';
export const DEMO_CHAT_MSG_ID = 'Kalau pesan sekarang, apakah bisa datang tepat waktu besok?';

// 예약 요청사항 자동 입력 문구
export const DEMO_NOTES    = '주방이랑 화장실 위주로 부탁드려요. 감사합니다!';
export const DEMO_NOTES_ID = 'Tolong fokus di dapur dan kamar mandi ya. Terima kasih!';

// 원문 → 목번역 룩업 (TransText가 라이브 호출 전에 먼저 확인)
export const DEMO_TRANSLATIONS: Record<string, { ko?: string; id?: string; en?: string }> = {
  [DEMO_CHAT_MSG]: { id: DEMO_CHAT_MSG_ID },
  [DEMO_NOTES]:    { id: DEMO_NOTES_ID },
};
