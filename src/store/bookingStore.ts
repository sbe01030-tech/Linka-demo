/**
 * bookingStore — 역할 전환에도 공유되는 예약(청소 등 예약하기) 데이터.
 *
 * 고객이 예약하면 store에 저장 → 고객 '주문' + 헬퍼 '일감'에 동시에 반영.
 * 데모 신원(chatStore와 동일): 고객 cust-me(우리집), 헬퍼 helper-me(Sari Dewi).
 * 세션 한정(앱 재시작 시 초기화) · 단일 기기 데모용.
 */
import { create } from 'zustand';
import { pushBooking } from './sync';

export type BookingStatus =
  | 'pending' | 'confirmed' | 'ongoing' | 'awaiting_confirmation' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  customerId: string; customerName: string; customerPhoto?: any;
  workerId: string;   workerName: string;   workerPhoto?: any;
  serviceType: string; serviceLabel?: string;
  date: string; startTime: string; duration: number;
  address: string; notes?: string;
  totalPrice: number; depositPaid: number; remaining: number;
  status: BookingStatus;
  ord: number;
}

interface BookingState {
  bookings: Booking[];
  addBooking: (b: Omit<Booking, 'id' | 'ord' | 'status'> & { status?: BookingStatus }) => string;
  forCustomer: (customerId: string) => Booking[];
  forWorker: (workerId: string) => Booking[];
  setStatus: (id: string, status: BookingStatus) => void;
  /** 동기화 서버의 예약 병합 (다른 시뮬레이터가 넣은 예약 반영) */
  mergeRemote: (remoteBookings: Booking[]) => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  addBooking: (b) => {
    const id = `bk-${Date.now()}`;
    const rec: Booking = { ...b, id, ord: Date.now(), status: b.status ?? 'pending' };
    set((s) => ({ bookings: [rec, ...s.bookings] }));
    pushBooking(rec); // 다른 시뮬레이터(워커)에 예약 전파
    return id;
  },
  forCustomer: (cid) => get().bookings.filter((b) => b.customerId === cid).sort((a, b) => b.ord - a.ord),
  forWorker: (wid) => get().bookings.filter((b) => b.workerId === wid).sort((a, b) => b.ord - a.ord),
  setStatus: (id, status) => set((s) => ({ bookings: s.bookings.map((b) => (b.id === id ? { ...b, status } : b)) })),
  mergeRemote: (remoteBookings) =>
    set((s) => {
      const have = new Set(s.bookings.map((b) => b.id));
      const adds = (remoteBookings ?? []).filter((b) => b && !have.has(b.id));
      if (!adds.length) return s; // 변화 없음
      return { bookings: [...adds, ...s.bookings].sort((a, b) => b.ord - a.ord) };
    }),
}));

// ── 공유 Booking → 각 화면 형태로 매핑 ─────────────────────────
export function toCustomerOrder(b: Booking) {
  return {
    id: b.id, workerName: b.workerName, workerPhoto: b.workerPhoto,
    serviceType: b.serviceType, date: b.date, startTime: b.startTime, duration: b.duration,
    address: b.address, totalPrice: b.totalPrice, depositPaid: b.depositPaid, remaining: b.remaining,
    status: b.status,
  };
}

const WORKER_STATUS: Record<BookingStatus, string> = {
  pending: 'upcoming', confirmed: 'upcoming', ongoing: 'upcoming',
  awaiting_confirmation: 'awaiting_customer', completed: 'completed', cancelled: 'completed',
};

export function toWorkerOrder(b: Booking) {
  return {
    id: b.id, customerName: b.customerName, customerPhoto: b.customerPhoto,
    date: b.date, startTime: b.startTime, duration: b.duration, address: b.address,
    earnings: b.totalPrice, depositPaid: b.depositPaid, remaining: b.remaining,
    status: WORKER_STATUS[b.status],
  };
}
