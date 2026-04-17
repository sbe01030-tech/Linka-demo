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
  serviceFrequency?: 'regular' | 'special' | 'both';
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
  category: 'popular' | 'chat' | 'tips' | 'ask' | 'announce';
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
  WorkerSearch: { serviceType?: 'regular' | 'onetime' };
  WorkerDetail: { workerId: string };
  ChatDetail: { chatId: string; name: string; photo?: string; role: string };
  CreatePost: undefined;
  PostDetail: { postId: string; title: string; category: string; author: string; time: string; preview: string; comments: number; likes: number };
  EditProfile: undefined;
  HelpFAQ: undefined;
  Review: { orderId: string; workerName: string; workerPhoto?: string };
};

export type CustomerTabParamList = {
  Home: undefined;
  Community: undefined;
  Map: { expanded?: boolean; serviceType?: 'regular' | 'onetime' } | undefined;
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
