/**
 * 관심 워커 (저장) 스토어 — 시연용 in-memory.
 * 추후 백엔드 연결 시 동기화 미들웨어 추가.
 */
import { create } from 'zustand';

interface FavoriteState {
  ids: string[];
  isFavorite: (workerId: string) => boolean;
  toggle: (workerId: string) => void;
  add: (workerId: string) => void;
  remove: (workerId: string) => void;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  ids: [],
  isFavorite: (id) => get().ids.includes(id),
  toggle: (id) =>
    set((s) => ({
      ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id],
    })),
  add: (id) =>
    set((s) => ({ ids: s.ids.includes(id) ? s.ids : [...s.ids, id] })),
  remove: (id) =>
    set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
}));
