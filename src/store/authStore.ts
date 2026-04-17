import { create } from 'zustand';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (name: string, phone: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

// Mock data untuk development
const MOCK_USERS: User[] = [
  { id: '1', name: 'Bunda Wulandari', phone: '0812-3456-7890', role: 'customer', rating: 4.8 },
  { id: '2', name: 'Sari Dewi',       phone: '0812-3456-7891', role: 'helper',   rating: 5.0, totalJobs: 312, isVerified: true },
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,

  login: async (phone: string, _password: string) => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    const found = MOCK_USERS.find((u) => u.phone === phone) ?? MOCK_USERS[0];
    set({ user: { ...found, phone }, isLoggedIn: true, isLoading: false });
  },

  register: async (name: string, phone: string, _password: string, role: UserRole) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 1000));
    const newUser: User = {
      id: Date.now().toString(),
      name,
      phone,
      role,
      isVerified: false,
    };
    set({ user: newUser, isLoggedIn: true, isLoading: false });
  },

  logout: () => set({ user: null, isLoggedIn: false }),

  setUser: (user: User) => set({ user }),
}));
