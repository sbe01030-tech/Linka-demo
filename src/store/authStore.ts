import { create } from 'zustand';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (name: string, phone: string, password: string, role: UserRole) => Promise<void>;
  quickStart: (role: UserRole) => void;
  switchRole: (role: UserRole) => void; // 데모: 로그아웃 없이 고객↔워커 전환
  logout: () => void;
  setUser: (user: User) => void;
}

// Mock data untuk development
const MOCK_USERS: User[] = [
  { id: '1', name: 'Jacob Ea', phone: '0812-3456-7890', role: 'customer', rating: 4.8 },
  { id: '2', name: 'Sari Dewi',    phone: '0812-3456-7891', role: 'helper',   rating: 5.0, totalJobs: 312, isVerified: true },
];

// 역할별 고정 id — 로그아웃→재로그인(역할 전환)에도 신원 유지 (채팅/요청 공유용)
// 초기 모델: 고객 / 가사도우미 두 갈래
const roleId = (role: UserRole): string =>
  role === 'customer' ? 'cust-me' : 'helper-me';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,

  login: async (phone: string, _password: string) => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    const found = MOCK_USERS.find((u) => u.phone === phone) ?? MOCK_USERS[0];
    set({ user: { ...found, id: roleId(found.role), phone }, isLoggedIn: true, isLoading: false });
  },

  register: async (name: string, phone: string, _password: string, role: UserRole) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 1000));
    const newUser: User = {
      id: roleId(role),
      name,
      phone,
      role,
      isVerified: false,
    };
    set({ user: newUser, isLoggedIn: true, isLoading: false });
  },

  quickStart: (role: UserRole) => {
    const guestUser: User = {
      id: roleId(role),
      name: role === 'customer' ? 'Jacob Ea' : 'Sari Dewi',
      phone: '',
      role,
      isVerified: true,
      rating: role === 'helper' ? 5.0 : 4.8,
      totalJobs: role === 'helper' ? 312 : undefined,
    };
    set({ user: guestUser, isLoggedIn: true });
  },

  // 데모: 프로필 탭 누르면 로그아웃 없이 즉시 역할 전환
  switchRole: (role: UserRole) => {
    const u: User = {
      id: roleId(role),
      name: role === 'customer' ? 'Jacob Ea' : 'Sari Dewi',
      phone: '',
      role,
      isVerified: true,
      rating: role === 'helper' ? 5.0 : 4.8,
      totalJobs: role === 'helper' ? 312 : undefined,
    };
    set({ user: u, isLoggedIn: true });
  },

  logout: () => set({ user: null, isLoggedIn: false }),

  setUser: (user: User) => set({ user }),
}));
