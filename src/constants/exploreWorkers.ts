/**
 * 탐색(Explore) 탭 전용 워커 mock.
 *
 * 기존 W1~W12 사진을 재사용하되, Explore UX(인스타 스토리)에 필요한 추가 필드
 * 포함: age, photos[], categories[], reviewCount, lat/lng (거리 계산용).
 *
 * 카테고리는 4종으로 통일: 가사 / 베이비시터 / 청소 / 요리.
 * 기존 skills를 이 4개로 매핑.
 *
 * id는 MOCK_WORKERS / MapScreen Partner와 충돌하지 않게 'ex-'로 시작.
 * (예약/채팅 라우팅 시 이 id 그대로 넘김 — 기존 라우트가 id 기반으로 매칭하면 됨)
 */
import {
  W1, W2, W3, W4, W5, W6, W7, W8, W9, W10, W11, W12,
} from './photos';

export type ExploreCategory = 'household' | 'babysitter' | 'cleaning' | 'cooking';

export interface ExploreWorker {
  id: string;
  detailWorkerId: string;      // WorkerDetail 라우트로 넘길 ID (MOCK_WORKERS의 w-N과 매칭)
  name: string;
  age: number;
  photos: string[];            // 1~3장
  categories: ExploreCategory[];
  rating: number;
  reviewCount: number;
  location: string;            // 동네명
  lat: number;
  lng: number;
  bio?: string;
  isAvailable: boolean;        // 온라인 상태 = 의뢰 받을 수 있음
  isVerified: boolean;
}

// 사용자(고객) 설정 위치 = Kebayoran Baru (지도 데모 중심)
export const USER_HOME_LOCATION = { lat: -6.2488, lng: 106.8052, name: 'Kebayoran Baru' };

// ── Mock workers (12명) ──────────────────────────────────────
// detailWorkerId: WorkerDetail의 MOCK_WORKERS와 매칭 (w1~w8 존재, ex9~12는 cycle)
export const EXPLORE_WORKERS: ExploreWorker[] = [
  {
    id: 'ex-1', detailWorkerId: 'w1', name: 'Sari Dewi',        age: 34,
    photos: [W1, W4, W11],
    categories: ['household', 'cooking', 'cleaning'],
    rating: 5.0, reviewCount: 312,
    location: 'Kebayoran Baru', lat: -6.2470, lng: 106.8044,
    bio: 'ART 10년 경력. 요리·정리 전문. 아이 돌보기 가능 🌿',
    isAvailable: true, isVerified: true,
  },
  {
    id: 'ex-2', detailWorkerId: 'w2', name: 'Rina Wulandari',   age: 28,
    photos: [W2, W6],
    categories: ['cooking', 'household'],
    rating: 4.9, reviewCount: 198,
    location: 'Kebayoran Baru', lat: -6.2484, lng: 106.8062,
    bio: '건강 식단 요리 전문 · 시간 약속 잘 지킵니다',
    isAvailable: true, isVerified: true,
  },
  {
    id: 'ex-3', detailWorkerId: 'w3', name: 'Dewi Anggraeni',   age: 31,
    photos: [W3, W5],
    categories: ['babysitter', 'cooking'],
    rating: 4.7, reviewCount: 143,
    location: 'Kemang', lat: -6.2498, lng: 106.8084,
    bio: '아이와 함께한 7년, 둘째 가정에 익숙해요',
    isAvailable: true, isVerified: true,
  },
  {
    id: 'ex-4', detailWorkerId: 'w4', name: 'Fitri Handayani',  age: 36,
    photos: [W4, W7, W12],
    categories: ['household', 'cleaning'],
    rating: 4.9, reviewCount: 227,
    location: 'Fatmawati', lat: -6.2520, lng: 106.8040,
    bio: '꼼꼼한 청소 + 다림질. expat 가정 다수 경험',
    isAvailable: true, isVerified: true,
  },
  {
    id: 'ex-5', detailWorkerId: 'w5', name: 'Indah Lestari',    age: 26,
    photos: [W5, W8],
    categories: ['cleaning'],
    rating: 4.8, reviewCount: 89,
    location: 'Pondok Indah', lat: -6.2515, lng: 106.8005,
    bio: 'Deep cleaning 스페셜리스트',
    isAvailable: false, isVerified: true,
  },
  {
    id: 'ex-6', detailWorkerId: 'w6', name: 'Nur Aini',         age: 40,
    photos: [W6, W9],
    categories: ['cooking', 'household'],
    rating: 4.9, reviewCount: 176,
    location: 'Senopati', lat: -6.2478, lng: 106.8030,
    bio: '인도네시아·중식 가정요리, 행사 케이터링 가능',
    isAvailable: true, isVerified: true,
  },
  {
    id: 'ex-7', detailWorkerId: 'w7', name: 'Siti Rahayu',      age: 29,
    photos: [W7, W2],
    categories: ['babysitter', 'household'],
    rating: 4.6, reviewCount: 64,
    location: 'Cilandak', lat: -6.2535, lng: 106.8022,
    bio: '유아 ~ 초등 돌봄, 영유아 응급처치 자격',
    isAvailable: true, isVerified: false,
  },
  {
    id: 'ex-8', detailWorkerId: 'w8', name: 'Ratna Sari',       age: 33,
    photos: [W8, W3, W10],
    categories: ['household', 'cooking', 'cleaning'],
    rating: 4.9, reviewCount: 112,
    location: 'Kebayoran Baru', lat: -6.2492, lng: 106.8058,
    bio: '전반적인 집안일 다 가능합니다',
    isAvailable: true, isVerified: true,
  },
  {
    id: 'ex-9', detailWorkerId: 'w1', name: 'Wulan Sari',       age: 42,
    photos: [W9, W6],
    categories: ['cooking'],
    rating: 5.0, reviewCount: 201,
    location: 'Pondok Indah', lat: -6.2510, lng: 106.7998,
    bio: '베테랑 요리사. 어떤 메뉴든 맞춰 만들어요',
    isAvailable: false, isVerified: true,
  },
  {
    id: 'ex-10', detailWorkerId: 'w2', name: 'Mega Putri',       age: 24,
    photos: [W10, W11],
    categories: ['cleaning', 'household'],
    rating: 4.7, reviewCount: 47,
    location: 'Pesanggrahan', lat: -6.2540, lng: 106.8000,
    bio: '깔끔하고 빠른 청소가 자신 있어요',
    isAvailable: true, isVerified: false,
  },
  {
    id: 'ex-11', detailWorkerId: 'w3', name: 'Lina Kartini',     age: 31,
    photos: [W11, W1],
    categories: ['household', 'babysitter'],
    rating: 4.8, reviewCount: 134,
    location: 'Kebayoran Baru', lat: -6.2475, lng: 106.8035,
    bio: '두 아이 가정, 다정한 돌봄 + 청소',
    isAvailable: true, isVerified: true,
  },
  {
    id: 'ex-12', detailWorkerId: 'w4', name: 'Aisyah Putri',     age: 27,
    photos: [W12, W4, W7],
    categories: ['household', 'cooking', 'cleaning'],
    rating: 4.9, reviewCount: 176,
    location: 'Kemang', lat: -6.2496, lng: 106.8091,
    bio: '청소·요리·정리 다 능숙해요',
    isAvailable: true, isVerified: true,
  },
];

// 카테고리 라벨 매핑
export const EXPLORE_CATEGORY_META: Record<ExploreCategory, {
  icon: string; ko: string; en: string; id: string; color: string;
}> = {
  household:  { icon: 'home-outline',  ko: '가사',       en: 'Household', id: 'Rumah',      color: '#F59E0B' },
  babysitter: { icon: 'happy-outline', ko: '베이비시터',  en: 'Babysitter', id: 'Baby Sitter', color: '#EC4899' },
  cleaning:   { icon: 'sparkles-outline', ko: '청소',    en: 'Cleaning',  id: 'Bersih',     color: '#3B82F6' },
  cooking:    { icon: 'restaurant-outline', ko: '요리',  en: 'Cooking',   id: 'Masak',      color: '#EF4444' },
};

// ── 거리 계산 (Haversine, km) ──────────────────────────────
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const aVal = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(aVal)));
}

// ── 추천 풀 선정 — 최대 10명 ────────────────────────────────
export function getRecommendedWorkers(): ExploreWorker[] {
  return EXPLORE_WORKERS
    // 1) 온라인 (의뢰 받을 수 있는 워커) 필수
    .filter((w) => w.isAvailable)
    .map((w) => ({
      worker: w,
      distance: distanceKm(USER_HOME_LOCATION, w),
    }))
    // 2) 거리순 (가까운 순) → 3) 평점 (높은 순) → 4) 동순위에선 reviewCount
    .sort((a, b) => {
      if (Math.abs(a.distance - b.distance) > 0.5) return a.distance - b.distance;
      if (b.worker.rating !== a.worker.rating) return b.worker.rating - a.worker.rating;
      return b.worker.reviewCount - a.worker.reviewCount;
    })
    .slice(0, 10)
    .map((x) => x.worker);
}
