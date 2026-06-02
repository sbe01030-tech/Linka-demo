export type UserRole = 'customer' | 'helper' | 'tutor' | 'driver';

export type ServiceType = 'helper' | 'tutor' | 'driver';

// Linka 온도 — 당근온도 스타일 평판 점수
export interface LinkaTemperature {
  score: number;         // 36.5 기본, 0 ~ 99.9
  totalReviews: number;
  lastUpdated: string;
}

// 드라이버가 운전 가능한 차종
export type DrivableVehicleType = 'sedan' | 'suv' | 'mpv' | 'van' | 'manual_stick';

// 드라이버 변속기 능력
export type TransmissionSkill = 'auto' | 'manual' | 'both';

// 드라이버 서비스 카테고리 (고객 차량을 대신 운전하는 서비스 중심)
export type DriverServiceKind =
  | 'designated'   // 대리운전 (행사 후 귀가 등 단시간)
  | 'daily'        // 일일 기사 (하루 종일)
  | 'hourly'       // 시간제 기사
  | 'commute'      // 출퇴근 기사 (정기)
  | 'airport'      // 공항 픽업/샌딩 (고객 차량 사용)
  | 'intercity'    // 도시간 장거리
  | 'event';       // 행사·웨딩 기사

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  photo?: string;
  rating?: number;
  totalJobs?: number;
  isVerified?: boolean;
  temperature?: LinkaTemperature;
}

export interface Worker extends User {
  role: 'helper' | 'tutor' | 'driver';
  serviceType: ServiceType;
  serviceFrequency?: 'regular' | 'special' | 'both';
  pricePerHour: number;
  pricePerDay?: number;
  location: string;
  bio: string;
  skills?: string[];
  subjects?: string[];                    // for tutors
  isAvailable: boolean;
  experienceYears: number;

  // Driver-only fields (고객 차량 운전 서비스 중심)
  drivableTypes?: DrivableVehicleType[];  // 운전 가능한 차종들
  transmission?: TransmissionSkill;       // 오토/수동/둘 다
  driverServices?: DriverServiceKind[];   // 제공하는 서비스 유형들
  licenseVerified?: boolean;              // SIM 인증 여부
  servingAreas?: string[];                // 운행 가능 지역
  licenseClass?: string;                  // SIM A, SIM B1 등
}

export type ErrandCategory =
  | 'shopping'    // Belanja
  | 'delivery'    // Antar/Terima paket
  | 'queuing'     // Antre
  | 'cleaning'    // Bersih-bersih ringan
  | 'pestcontrol' // Tangkap serangga
  | 'flyer'       // Bagi brosur
  | 'moving'      // Pindah barang
  | 'pet'         // Pet sitting / walk
  | 'tutor'       // Les pendek
  | 'other';

export type ErrandPayType = 'perJob' | 'hourly' | 'daily';
export type ErrandStatus  = 'open' | 'assigned' | 'completed' | 'cancelled';

export interface ErrandPost {
  id: string;
  authorId: string;
  authorName: string;          // "Anonim" or display name
  authorTemperature?: number;  // 작성자 온도 (있으면 표시)
  title: string;
  description: string;
  photos: string[];            // image URIs
  category: ErrandCategory;
  payType: ErrandPayType;
  amount: number;              // Rp
  sameDayPayment: boolean;     // "당일지급" 배지
  scheduledLabel: string;      // e.g. "Hari ini" / "Besok" / "Senin 2 Jun"
  timeLabel: string;           // e.g. "Negotiable" / "10:00 - 12:00"
  area: { name: string; lat: number; lng: number; radius: number };
  views: number;
  createdAt: string;           // relative label
  status: ErrandStatus;
  applicantIds: string[];
  assignedTo?: string;
}

export interface ErrandApplicant {
  id: string;
  name: string;
  photo?: string;
  temperature: number;
  appliedAt: string;           // "1초 전 활동" 같은 라벨
  resume?: ErrandResume;
}

export interface ErrandResume {
  photoUri?: string;
  experiences: string[];       // free-text bullets
  intro: string;               // 자기소개 본문
  strengths: string[];         // 최대 2개 — 'tepat-waktu' 같은 코드
  extras: string[];            // 'non-smoker', 'has-vehicle', etc.
  education?: string;
  certifications?: string[];
}

export interface KYCInfo {
  isVerified: boolean;
  nik?: string;                // 16-digit Indonesian ID
  fullName?: string;           // sesuai KTP
  dob?: string;
  birthplace?: string;
  gender?: 'male' | 'female';
  ktpPhotoUri?: string;        // mock placeholder
  selfieUri?: string;          // mock placeholder
  verifiedAt?: string;
}

// 기존 ErrandRequest는 ErrandPost로 통합됨. 호환용 alias 유지.
export type ErrandRequest = ErrandPost;

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
  role: 'helper' | 'tutor' | 'driver' | 'customer';
  lastMessage: string;
  time: string;
  unread: number;
  orderId?: string;
}

// 리뷰 태그 (Linka 온도 계산용)
export interface ReviewFeedback {
  orderId: string;
  reviewerId: string;
  targetId: string;
  targetRole: 'helper' | 'tutor' | 'driver';
  tags: string[];           // 선택한 긍정 태그
  negativeTags?: string[];  // 선택한 부정 태그
  freeText?: string;
  scoreDelta: number;       // Linka 온도 변화량
  createdAt: string;
}

// 이 달의 헬퍼/드라이버
export interface MonthlyAward {
  period: string;           // "2026-04"
  role: 'helper' | 'driver';
  winnerId: string;
  winnerName: string;
  winnerPhoto?: string;
  temperature: number;
  reason?: string;
}

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: { initialRole?: UserRole } | undefined;
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
  Terms: { mode: 'agree' | 'view' };
  ErrandBoard: undefined;
  ErrandCreate: undefined;
  ErrandDetail: { errandId: string };
  ErrandApply: { errandId: string };
  KYCVerify: { onDoneRoute?: keyof RootStackParamList; onDoneParams?: any };
  Review: { orderId: string; workerName: string; workerPhoto?: any };
  Booking: { workerId: string; workerName: string; workerPhoto?: any; pricePerHour: number; serviceType: ServiceType; pricePerDay?: number; driverServices?: DriverServiceKind[]; drivableTypes?: DrivableVehicleType[] };
  DriverBoard: undefined;
  DriverDetail: { driverId: string };
  Notifications: undefined;
  Orders: undefined;
};

export type CustomerTabParamList = {
  Home: undefined;
  Community: undefined;
  Map: { expanded?: boolean; serviceType?: 'regular' | 'onetime'; partnerFilter?: 'helper' | 'driver' } | undefined;
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
