/**
 * chatStore — 역할 전환에도 공유되는 채팅 (인메모리, 시연용).
 *
 * 핵심: 메시지를 컴포넌트 로컬이 아니라 스토어에 보관하고, 보낸 사람을 senderId로 식별.
 * 같은 threadId를 고객/헬퍼가 각자 열면 같은 대화를 보고, 서로의 메시지가 즉시 반영됨.
 *
 * 데모 신원(고정):
 *  - 고객  = CUSTOMER_ME (id 'cust-me', '우리집')
 *  - 헬퍼  = HELPER_ME   (id 'helper-me', 'Sari Dewi')
 * → 고객은 'Sari Dewi'와 대화하고, 헬퍼로 로그인하면 '우리집'과의 같은 대화가 보임.
 *
 * 세션 한정(앱 완전 재시작 시 초기화) · 단일 기기 데모용.
 */
import { create } from 'zustand';
import { ChatMessage } from '../types';
import { SEONGKI_PHOTO, W1, C2, C3, W2, W3 } from '../constants/photos';
import { pushMessage, pushThread } from './sync';

export interface ChatParticipant { id: string; name: string; photo?: any; role: 'customer' | 'helper' | 'tutor' | 'driver' }

// 데모 고정 신원: 고객 = 김도형 대표님 / 워커 = Sari Dewi
export const CUSTOMER_ME: ChatParticipant = { id: 'cust-me', name: '김도형 대표님', photo: SEONGKI_PHOTO, role: 'customer' };
export const HELPER_ME:   ChatParticipant = { id: 'helper-me', name: 'Sari Dewi', photo: W1, role: 'helper' };

// 예시 대화 상대 — 워커(Max) 쪽 다른 고객들 / 고객(이성기) 쪽 다른 헬퍼들
const CUST_SINTA: ChatParticipant = { id: 'cust-2',   name: 'Bunda Sinta',     photo: C2, role: 'customer' };
const CUST_MAYA:  ChatParticipant = { id: 'cust-3',   name: 'Ibu Maya',        photo: C3, role: 'customer' };
const HELP_SARI:  ChatParticipant = { id: 'helper-2', name: 'Rina Wulandari',  photo: W2, role: 'helper' };
const HELP_DEWI:  ChatParticipant = { id: 'helper-3', name: 'Dewi Anggraeni',  photo: W3, role: 'helper' };

export const DEMO_THREAD_ID = 't-demo';

export interface ChatThreadRec {
  id: string;
  customer: ChatParticipant;
  helper: ChatParticipant;
  orderId?: string;
}

const now = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

// ── 시드 대화 ──────────────────────────────────────────────────
//  메인:  김도형 대표님(고객) ↔ Sari Dewi(워커)  — 양쪽 기기에서 보임
//  워커 예시: 다른 고객 2명 ↔ Max (워커 기기에서만 보임)
//  고객 예시: 이성기 ↔ 다른 헬퍼 2명 (고객 기기에서만 보임)
const seedThreads: ChatThreadRec[] = [
  { id: DEMO_THREAD_ID, customer: CUSTOMER_ME, helper: HELPER_ME, orderId: 'o1' },
  { id: 't-ex1', customer: CUST_SINTA, helper: HELPER_ME, orderId: 'o2' },
  { id: 't-ex2', customer: CUST_MAYA,  helper: HELPER_ME },
  { id: 't-ex3', customer: CUSTOMER_ME, helper: HELP_SARI, orderId: 'o3' },
  { id: 't-ex4', customer: CUSTOMER_ME, helper: HELP_DEWI },
];

const seedMessages: Record<string, ChatMessage[]> = {
  [DEMO_THREAD_ID]: [
    {
      id: 'sm1', senderId: HELPER_ME.id, time: '09:00', read: true,
      text: 'Halo Pak, pesanan Anda sudah saya terima. Ada yang perlu saya siapkan?',
      lang: 'id', translation: { ko: '안녕하세요 대표님, 예약 접수했습니다. 따로 준비할 게 있을까요?' },
    },
    { id: 'sm2', senderId: CUSTOMER_ME.id, time: '09:02', read: true,
      text: '네, 내일 오전 8시까지 와주세요. 주방하고 화장실 위주로 부탁드려요',
      lang: 'ko', translation: { id: 'Baik, tolong datang besok jam 8 pagi. Fokus di dapur dan kamar mandi ya.' } },
    {
      id: 'sm3', senderId: HELPER_ME.id, time: '09:06', read: false,
      text: 'Baik Pak, saya akan datang tepat waktu 😊',
      lang: 'id', translation: { ko: '네 대표님, 시간 맞춰 도착하겠습니다 😊' },
    },
  ],
  't-ex1': [
    { id: 'e1a', senderId: CUST_SINTA.id, time: '08:30', read: true,
      text: 'Kak, besok bisa datang jam 10 pagi?', lang: 'id', translation: { ko: '내일 오전 10시에 올 수 있어요?' } },
    { id: 'e1b', senderId: HELPER_ME.id, time: '08:34', read: true,
      text: 'Bisa Bu, sampai jumpa besok ya 🙏', lang: 'id', translation: { ko: '가능해요, 내일 봬요 🙏' } },
  ],
  't-ex2': [
    { id: 'e2a', senderId: CUST_MAYA.id, time: 'Kemarin', read: false,
      text: 'Terima kasih ya kak, rumah jadi bersih banget!', lang: 'id', translation: { ko: '집이 정말 깨끗해졌어요, 감사해요!' } },
  ],
  't-ex3': [
    { id: 'e3a', senderId: HELP_SARI.id, time: '14:10', read: true,
      text: 'Selamat sore Pak, untuk hari Sabtu jadi ya?', lang: 'id', translation: { ko: '안녕하세요 대표님, 토요일 예약 그대로 진행되나요?' } },
    { id: 'e3b', senderId: CUSTOMER_ME.id, time: '14:20', read: true,
      text: '네 토요일 오전으로 부탁드려요', lang: 'ko', translation: { id: 'Iya, tolong Sabtu pagi ya.' } },
  ],
  't-ex4': [
    { id: 'e4a', senderId: HELP_DEWI.id, time: 'Kemarin', read: false,
      text: 'Pak, saya sudah selesai. Mohon dicek ya 🙏', lang: 'id', translation: { ko: '대표님, 작업 끝났습니다. 확인 부탁드려요 🙏' } },
  ],
};

interface ChatState {
  threads: ChatThreadRec[];
  messagesByThread: Record<string, ChatMessage[]>;

  getThread: (threadId: string) => ChatThreadRec | undefined;
  ensureThread: (rec: ChatThreadRec) => void;
  getMessages: (threadId: string) => ChatMessage[];
  sendMessage: (threadId: string, senderId: string, text: string) => void;
  markRead: (threadId: string, readerId: string) => void;
  threadsFor: (userId: string) => ChatThreadRec[];
  /** 현재 사용자 입장에서 상대방 참가자 */
  other: (threadId: string, userId: string) => ChatParticipant | undefined;
  /** 동기화 서버 상태 병합 (다른 시뮬레이터가 보낸 대화방/메시지 반영) */
  mergeRemote: (remote: { threads?: ChatThreadRec[]; messagesByThread?: Record<string, ChatMessage[]> }) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  threads: seedThreads,
  messagesByThread: seedMessages,

  getThread: (threadId) => get().threads.find((t) => t.id === threadId),

  ensureThread: (rec) => {
    set((st) => (st.threads.some((t) => t.id === rec.id)
      ? st
      : { threads: [rec, ...st.threads], messagesByThread: { ...st.messagesByThread, [rec.id]: st.messagesByThread[rec.id] ?? [] } }));
    pushThread(rec); // 다른 시뮬레이터에 대화방 전파
  },

  getMessages: (threadId) => get().messagesByThread[threadId] ?? [],

  sendMessage: (threadId, senderId, text) => {
    const msg: ChatMessage = { id: `m${Date.now()}`, senderId, text, time: now(), read: false };
    set((st) => {
      const prev = st.messagesByThread[threadId] ?? [];
      return { messagesByThread: { ...st.messagesByThread, [threadId]: [...prev, msg] } };
    });
    pushMessage(threadId, msg); // 다른 시뮬레이터에 메시지 전파
  },

  markRead: (threadId, readerId) =>
    set((st) => {
      const prev = st.messagesByThread[threadId] ?? [];
      return { messagesByThread: { ...st.messagesByThread, [threadId]: prev.map((m) => (m.senderId !== readerId ? { ...m, read: true } : m)) } };
    }),

  threadsFor: (userId) =>
    get().threads.filter((t) => t.customer.id === userId || t.helper.id === userId),

  other: (threadId, userId) => {
    const t = get().threads.find((x) => x.id === threadId);
    if (!t) return undefined;
    return t.customer.id === userId ? t.helper : t.customer;
  },

  mergeRemote: (remote) =>
    set((st) => {
      // 대화방: id로 dedupe (로컬 우선)
      const haveThread = new Set(st.threads.map((t) => t.id));
      const newThreads = (remote.threads ?? []).filter((t) => t && !haveThread.has(t.id));
      const threads = newThreads.length ? [...st.threads, ...newThreads] : st.threads;

      // 메시지: 스레드별로 없는 id만 끝에 추가 (서버 도착 순서 유지)
      let changed = false;
      const messagesByThread = { ...st.messagesByThread };
      Object.entries(remote.messagesByThread ?? {}).forEach(([tid, msgs]) => {
        const existing = messagesByThread[tid] ?? [];
        const ids = new Set(existing.map((m) => m.id));
        const adds = (msgs ?? []).filter((m) => m && !ids.has(m.id));
        if (adds.length) { messagesByThread[tid] = [...existing, ...adds]; changed = true; }
      });

      if (!newThreads.length && !changed) return st; // 변화 없음 → 리렌더 방지
      return { threads, messagesByThread };
    }),
}));
