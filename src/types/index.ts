export type UserRole = 'customer' | 'helper' | 'tutor';

export type ServiceType = 'helper' | 'tutor';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  photo?: string;
  rating?: number;
  totalJobs?: number;
  isVerified?: boolean;
}

export interface Worker extends User {
  role: 'helper' | 'tutor';
  serviceType: ServiceType;
  pricePerHour: number;
  pricePerDay?: number;
  location: string;
  bio: string;
  skills?: string[];
  subjects?: string[];       // for tutors
  isAvailable: boolean;
  experienceYears: number;
}

export interface CommunityPost {
  id: string;
  category: '인기글' | '자유수다' | '육아꿀팁' | '궁금해요';
  title: string;
  preview: string;
  author: string;
  time: string;
  comments: number;
  likes: number;
}

export interface BookingRequest {
  id: string;
  customerId: string;
  workerId: string;
  serviceType: ServiceType;
  date: string;
  startTime: string;
  duration: number;
  address: string;
  notes?: string;
  totalPrice: number;
  depositAmount: number;
  remainingAmount: number;
  status: 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled' | 'awaiting_confirmation';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  from: 'me' | 'other';
  text: string;
  time: string;
  read: boolean;
}

export interface ChatThread {
  id: string;
  name: string;
  photo?: string;
  role: 'helper' | 'tutor' | 'customer';
  lastMessage: string;
  time: string;
  unread: number;
  orderId?: string;
}

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  RoleSelect: undefined;
  CustomerTabs: undefined;
  WorkerTabs: undefined;
  WorkerDetail: { workerId: string };
  ChatDetail: { chatId: string; name: string; photo?: string; role: string };
};

export type CustomerTabParamList = {
  Home: undefined;
  Community: undefined;
  Map: undefined;
  ChatList: undefined;
  Profile: undefined;
};

export type WorkerTabParamList = {
  WorkerHome: undefined;
  WorkerMap: undefined;
  WorkerChat: undefined;
  WorkerOrders: undefined;
  WorkerProfile: undefined;
};
