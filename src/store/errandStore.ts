/**
 * Errand 시스템 mock 스토어 (백엔드 없이 시연용)
 *
 * 관리:
 *  - ErrandPost 리스트 (시드 + 사용자가 만든 글 push)
 *  - KYC 본인인증 상태 (1회성)
 *  - 사용자의 ErrandResume
 *  - 지원자 목록 (errandId → applicantId[])
 *
 * 앱 재시작 시 초기화됨 (시연 동안만 유지).
 */
import { create } from 'zustand';
import {
  ErrandPost,
  ErrandCategory,
  ErrandApplicant,
  ErrandResume,
  KYCInfo,
} from '../types';

// ── 시드 데이터 ───────────────────────────────────────────────────
const NOW = new Date();
const seedPosts: ErrandPost[] = [
  {
    id: 'e1',
    authorId: 'cust-1', authorName: 'Anonim', authorTemperature: 37.3,
    title: 'Tolong bunuh kecoa di kamar mandi ㅠㅠ',
    titleI18n: {
      ko: '화장실에 바퀴벌레 좀 잡아주세요 ㅠㅠ',
      en: 'Please get rid of the cockroach in my bathroom ㅠㅠ',
      id: 'Tolong bunuh kecoa di kamar mandi ㅠㅠ',
    },
    description: '(Foto kedua ada kecoanya!)\nSudah disemprot Hit tapi ukurannya gede banget, takut buat dibuang...\nTolongin ya...',
    photos: [],
    category: 'pestcontrol',
    payType: 'perJob', amount: 50000, sameDayPayment: true,
    scheduledLabel: 'Hari ini', timeLabel: 'Negotiable',
    area: { name: 'Kebayoran Baru', lat: -6.2444, lng: 106.8050, radius: 300 },
    views: 34, createdAt: '1 menit lalu', status: 'open',
    applicantIds: ['ap-춘식이'],
  },
  {
    id: 'e2',
    authorId: 'cust-2', authorName: 'Anonim', authorTemperature: 41.5,
    title: 'Tolong belikan barang di Indomaret',
    titleI18n: {
      ko: 'Indomaret에서 물건 좀 사다 주세요',
      en: 'Please buy some items at Indomaret',
      id: 'Tolong belikan barang di Indomaret',
    },
    description: 'Aqua 1.5L 2 botol, roti tawar gandum 1 bungkus, mie instan goreng 2 bungkus.\nLagi sakit jadi nggak bisa keluar rumah.',
    photos: [],
    category: 'shopping',
    payType: 'perJob', amount: 25000, sameDayPayment: true,
    scheduledLabel: 'Hari ini', timeLabel: 'Sebelum jam 3 sore',
    area: { name: 'Senopati', lat: -6.2478, lng: 106.8032, radius: 250 },
    views: 87, createdAt: '12 menit lalu', status: 'open',
    applicantIds: [],
  },
  {
    id: 'e3',
    authorId: 'cust-3', authorName: 'Anonim', authorTemperature: 36.8,
    title: 'Ambilkan paket di Alfamart',
    titleI18n: {
      ko: 'Alfamart에서 택배 좀 찾아다 주세요',
      en: 'Pick up my package at Alfamart',
      id: 'Ambilkan paket di Alfamart',
    },
    description: 'Paket J&T ada di Alfamart dekat rumah. Ukurannya kecil dan ringan.\nLangsung antar ke pintu apartemen aja.',
    photos: [],
    category: 'delivery',
    payType: 'perJob', amount: 15000, sameDayPayment: true,
    scheduledLabel: 'Hari ini', timeLabel: 'Negotiable',
    area: { name: 'Cilandak', lat: -6.2535, lng: 106.8022, radius: 300 },
    views: 52, createdAt: '24 menit lalu', status: 'open',
    applicantIds: [],
  },
  {
    id: 'e4',
    authorId: 'cust-4', authorName: 'Anonim', authorTemperature: 42.1,
    title: 'Antrekan di restoran SCBD',
    titleI18n: {
      ko: 'SCBD 레스토랑 줄 대신 서주세요',
      en: 'Wait in line at an SCBD restaurant',
      id: 'Antrekan di restoran SCBD',
    },
    description: 'Restoran viral di SCBD, biasanya antre 1,5–2 jam. Saya kabari kalau hampir sampai.\nOngkos transport + tip ada.',
    photos: [],
    category: 'queuing',
    payType: 'hourly', amount: 30000, sameDayPayment: true,
    scheduledLabel: 'Besok', timeLabel: '11:00 - 14:00',
    area: { name: 'SCBD', lat: -6.2457, lng: 106.8075, radius: 400 },
    views: 124, createdAt: '1 jam lalu', status: 'open',
    applicantIds: ['ap-춘식이'],
  },
  {
    id: 'e5',
    authorId: 'cust-5', authorName: 'Anonim', authorTemperature: 38.9,
    title: 'Bagi brosur di area Pondok Indah',
    titleI18n: {
      ko: 'Pondok Indah 지역 전단지 배포',
      en: 'Hand out flyers around Pondok Indah',
      id: 'Bagi brosur di area Pondok Indah',
    },
    description: 'Promosi cafe baru — 500 brosur, sekitar 3 jam. Sudah disiapkan rute.\nBoleh dibawa sambil keliling pakai motor.',
    photos: [],
    category: 'flyer',
    payType: 'daily', amount: 150000, sameDayPayment: false,
    scheduledLabel: 'Sabtu, 30 Mei', timeLabel: '10:00 - 13:00',
    area: { name: 'Pondok Indah', lat: -6.2515, lng: 106.8005, radius: 600 },
    views: 76, createdAt: '3 jam lalu', status: 'open',
    applicantIds: [],
  },
  {
    id: 'e6',
    authorId: 'cust-6', authorName: 'Anonim', authorTemperature: 36.5,
    title: 'Pet sitting 2 hari (kucing)',
    titleI18n: {
      ko: '2일 펫 시팅 (고양이)',
      en: '2-day pet sitting (cat)',
      id: 'Pet sitting 2 hari (kucing)',
    },
    description: 'Kucing 2 ekor, perlu kasih makan & main pagi sore. Saya keluar kota weekend ini.\nKunci akan dititipkan di security.',
    photos: [],
    category: 'pet',
    payType: 'daily', amount: 100000, sameDayPayment: true,
    scheduledLabel: 'Sabtu - Minggu', timeLabel: 'Pagi & Sore',
    area: { name: 'Menteng', lat: -6.2462, lng: 106.8056, radius: 200 },
    views: 41, createdAt: '5 jam lalu', status: 'open',
    applicantIds: [],
  },
];

// ── 시드 지원자 ───────────────────────────────────────────────────
const seedApplicants: Record<string, ErrandApplicant> = {
  'ap-춘식이': {
    id: 'ap-춘식이',
    name: '춘식이', // 당근 데모처럼 닉네임 그대로
    temperature: 37.3,
    appliedAt: '1초 전 활동',
  },
};

// ── 스토어 ────────────────────────────────────────────────────────
interface ErrandState {
  posts: ErrandPost[];
  applicants: Record<string, ErrandApplicant>;
  kyc: KYCInfo;
  resume: ErrandResume | null;

  // posts
  addPost: (post: Omit<ErrandPost, 'id' | 'views' | 'createdAt' | 'status' | 'applicantIds'>) => string;
  getPost: (id: string) => ErrandPost | undefined;
  incrementView: (id: string) => void;
  applyToErrand: (errandId: string, applicantId: string) => void;
  addApplicant: (errandId: string, applicant: ErrandApplicant) => void;

  // KYC
  setKYC: (info: Partial<KYCInfo>) => void;
  completeKYC: () => void;

  // resume
  setResume: (resume: ErrandResume) => void;
}

export const useErrandStore = create<ErrandState>((set, get) => ({
  posts: seedPosts,
  applicants: seedApplicants,
  kyc: { isVerified: false },
  resume: null,

  addPost: (partial) => {
    const id = `e${Date.now()}`;
    const post: ErrandPost = {
      ...partial,
      id,
      views: 0,
      createdAt: 'Baru saja',
      status: 'open',
      applicantIds: [],
    };
    set((s) => ({ posts: [post, ...s.posts] }));
    return id;
  },

  getPost: (id) => get().posts.find((p) => p.id === id),

  incrementView: (id) =>
    set((s) => ({
      posts: s.posts.map((p) => (p.id === id ? { ...p, views: p.views + 1 } : p)),
    })),

  applyToErrand: (errandId, applicantId) =>
    set((s) => ({
      posts: s.posts.map((p) =>
        p.id === errandId && !p.applicantIds.includes(applicantId)
          ? { ...p, applicantIds: [...p.applicantIds, applicantId] }
          : p
      ),
    })),

  // 지원자 프로필까지 함께 저장 → 요청자(고객)가 실제 지원자 정보 확인 가능
  addApplicant: (errandId, applicant) =>
    set((s) => ({
      applicants: { ...s.applicants, [applicant.id]: applicant },
      posts: s.posts.map((p) =>
        p.id === errandId && !p.applicantIds.includes(applicant.id)
          ? { ...p, applicantIds: [...p.applicantIds, applicant.id] }
          : p
      ),
    })),

  setKYC: (info) => set((s) => ({ kyc: { ...s.kyc, ...info } })),

  completeKYC: () =>
    set((s) => ({
      kyc: { ...s.kyc, isVerified: true, verifiedAt: new Date().toISOString() },
    })),

  setResume: (resume) => set({ resume }),
}));

// 헬퍼: 카테고리 라벨/아이콘
export const CATEGORY_META: Record<ErrandCategory, { id: string; label: { id: string; ko: string; en: string }; icon: string; bg: string }> = {
  shopping:    { id: 'shopping',    label: { id: 'Belanja',          ko: '장보기',     en: 'Shopping'    }, icon: 'cart-outline',           bg: '#FFF3C0' },
  delivery:    { id: 'delivery',    label: { id: 'Antar/Terima',     ko: '배달·수령',   en: 'Delivery'    }, icon: 'bicycle-outline',        bg: '#CCE8FF' },
  queuing:     { id: 'queuing',     label: { id: 'Antre',            ko: '줄서기',     en: 'Queuing'     }, icon: 'time-outline',           bg: '#FFD8EA' },
  cleaning:    { id: 'cleaning',    label: { id: 'Bersih-bersih',    ko: '청소',       en: 'Cleaning'    }, icon: 'sparkles-outline',       bg: '#D7F4E1' },
  pestcontrol: { id: 'pestcontrol', label: { id: 'Tangkap Serangga', ko: '벌레잡기',    en: 'Pest'        }, icon: 'bug-outline',            bg: '#FFE0D0' },
  flyer:       { id: 'flyer',       label: { id: 'Bagi Brosur',      ko: '전단지',     en: 'Flyer'       }, icon: 'newspaper-outline',      bg: '#E8E2FF' },
  moving:      { id: 'moving',      label: { id: 'Pindah Barang',    ko: '운반',       en: 'Moving'      }, icon: 'cube-outline',           bg: '#FFE5D6' },
  pet:         { id: 'pet',         label: { id: 'Pet Sitter',       ko: '펫 시팅',    en: 'Pet Sitter'  }, icon: 'paw-outline',            bg: '#FFDBD3' },
  tutor:       { id: 'tutor',       label: { id: 'Les Singkat',      ko: '단기 과외',  en: 'Short Tutor' }, icon: 'school-outline',         bg: '#D2EAFF' },
  other:       { id: 'other',       label: { id: 'Lainnya',          ko: '기타',       en: 'Other'       }, icon: 'ellipsis-horizontal-outline', bg: '#EAEAEF' },
};

// 헬퍼: 글 제목 (번역 있으면 언어별, 없으면 원문 title)
export function errandTitle(post: ErrandPost, lang: string): string {
  if (post.titleI18n && (lang === 'ko' || lang === 'en' || lang === 'id')) {
    return post.titleI18n[lang];
  }
  return post.title;
}

export function payLabel(payType: 'perJob' | 'hourly' | 'daily', amount: number, lang: 'ko' | 'en' | 'id'): string {
  const rp = `Rp ${amount.toLocaleString('id-ID')}`;
  if (payType === 'perJob')  return lang === 'ko' ? `건당 ${rp}` : lang === 'en' ? `${rp} / job`  : `${rp} / pekerjaan`;
  if (payType === 'hourly')  return lang === 'ko' ? `시급 ${rp}` : lang === 'en' ? `${rp} / hour` : `${rp} / jam`;
  return                        lang === 'ko' ? `일급 ${rp}` : lang === 'en' ? `${rp} / day`  : `${rp} / hari`;
}
