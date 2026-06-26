/**
 * demoStore — 시연용 일회성 이벤트 플래그.
 * 워커가 예약을 수락하면 confirmNotif=true → 고객 홈으로 돌아왔을 때 확정 팝업 노출.
 */
import { create } from 'zustand';

interface DemoState {
  confirmNotif: boolean;
  setConfirmNotif: (v: boolean) => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  confirmNotif: false,
  setConfirmNotif: (v) => set({ confirmNotif: v }),
}));
