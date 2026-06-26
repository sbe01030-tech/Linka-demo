import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { getMonthlyAwardBadge } from '../../constants/monthlyAwards';
import { MvpMiniBadge } from '../../components/common/MonthlyAwardCard';
import TransText from '../../components/common/TransText';
import { W1, W2, W3, W4, W5, W6, W7, W8, C1, C2, C3, BA1, BA2, BA3, BA4 } from '../../constants/photos';

// 워커 프로필 갤러리 — 청소 비포/애프터 4장
const GALLERY_PHOTOS: string[] = [BA1, BA2, BA3, BA4];
// 기본 커버 (워커가 따로 설정 안 한 경우 — W3 사용. WorkerProfileScreen 기본값과 동일)
const DEFAULT_COVER = W3;
import { RootStackParamList, Worker } from '../../types';
import { useLanguageStore } from '../../store/languageStore';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkerDetail'>;

/** 평점과 누적 주문 기반 Linka Point 추정치 (100점 만점, 목업) */
const computeLinkaPoint = (rating: number, totalJobs: number) =>
  Math.min(100, Math.round(72 + (rating - 4.5) * 16 + Math.sqrt(totalJobs) * 0.9));

/** 사용량(누적 활동) 기반 레벨 — 점수만으로 부족한 평가를 보완 */
const LEVELS = [
  { lv: 1, name: '새싹',   min: 0 },
  { lv: 2, name: '성실',   min: 50 },
  { lv: 3, name: '숙련',   min: 150 },
  { lv: 4, name: '베테랑', min: 300 },
  { lv: 5, name: '마스터', min: 600 },
];
const levelOf = (jobs: number) => {
  let i = 0;
  for (let k = 0; k < LEVELS.length; k++) if (jobs >= LEVELS[k].min) i = k;
  const cur = LEVELS[i], next = LEVELS[i + 1];
  const isMax = !next;
  const progress = isMax ? 1 : (jobs - cur.min) / (next.min - cur.min);
  return {
    lv: cur.lv, name: cur.name, isMax,
    progress: Math.max(0.05, Math.min(1, progress)),
    remaining: isMax ? 0 : next.min - jobs,
  };
};

// Same mock data as HomeScreen
const MOCK_WORKERS: Worker[] = [
  {
    id: 'helper-me', name: 'Sari Dewi', phone: '0812-3456-7891', role: 'helper', serviceType: 'helper',
    serviceFrequency: 'regular',
    photo: W1,
    pricePerHour: 30000, pricePerDay: 200000,
    location: 'Cibodas, Tangerang', bio: 'ART berpengalaman 10 tahun. Bisa masak, cuci, setrika, dan beberes. Teliti, jujur, dan tepat waktu.',
    skills: ['Beberes', 'Masak', 'Cuci', 'Setrika'],
    isAvailable: true, rating: 5.0, totalJobs: 312, isVerified: true, experienceYears: 10,
  },
  {
    id: 'w1', name: 'Sari Dewi', phone: '0812-3456-7890', role: 'helper', serviceType: 'helper',
    serviceFrequency: 'regular',
    photo: W1,
    pricePerHour: 30000, pricePerDay: 200000,
    location: 'Kebayoran, Jakarta Selatan', bio: 'ART berpengalaman 10 tahun. Bisa masak (masakan Indonesia & Western), cuci, setrika, dan beberes. Banyak pengalaman di keluarga dengan anak kecil.',
    skills: ['Masak', 'Cuci', 'Setrika', 'Beberes'],
    isAvailable: true, rating: 5.0, totalJobs: 312, isVerified: true, experienceYears: 10,
  },
  {
    id: 'w2', name: 'Rina Wulandari', phone: '0813-4567-8901', role: 'helper', serviceType: 'helper',
    serviceFrequency: 'regular',
    photo: W2,
    pricePerHour: 30000, pricePerDay: 160000,
    location: 'Cilandak, Jakarta Selatan', bio: 'Spesialis masak menu sehat harian dan bersih-bersih. Sudah 7 tahun pengalaman, jujur dan tepat waktu.',
    skills: ['Masak Sehat', 'Beberes', 'Cuci'],
    isAvailable: true, rating: 4.9, totalJobs: 198, isVerified: true, experienceYears: 7,
  },
  {
    id: 'w3', name: 'Dewi Anggraeni', phone: '0816-7890-1234', role: 'helper', serviceType: 'helper',
    serviceFrequency: 'both',
    photo: W3,
    pricePerHour: 33000, pricePerDay: 180000,
    location: 'Kemang, Jakarta Selatan', bio: 'Berpengalaman di keluarga dengan anak kecil. Sabar & telaten. Bisa masak, cuci, dan jaga anak.',
    skills: ['Masak', 'Cuci', 'Perawatan Anak'],
    isAvailable: true, rating: 4.7, totalJobs: 156, isVerified: true, experienceYears: 5,
  },
  {
    id: 'w4', name: 'Fitri Handayani', phone: '0815-6789-0123', role: 'helper', serviceType: 'helper',
    serviceFrequency: 'regular',
    photo: W4,
    pricePerHour: 31000, pricePerDay: 175000,
    location: 'Fatmawati, Jakarta Selatan', bio: 'Teliti dan jujur. Sudah kerja di 3 keluarga expat. Bisa masak Western & Indonesia.',
    skills: ['Masak', 'Setrika', 'Beberes'],
    isAvailable: true, rating: 4.9, totalJobs: 227, isVerified: true, experienceYears: 8,
  },
  {
    id: 'w5', name: 'Indah Lestari', phone: '0817-8901-2345', role: 'helper', serviceType: 'helper',
    serviceFrequency: 'special',
    photo: W5,
    pricePerHour: 35000, pricePerDay: 220000,
    location: 'Pondok Indah, Jakarta Selatan', bio: 'Spesialis bersih-bersih deep cleaning & pasca renovasi. Cepat dan rapi.',
    skills: ['Deep Cleaning', 'Beberes', 'Cuci'],
    isAvailable: true, rating: 4.8, totalJobs: 89, isVerified: true, experienceYears: 3,
  },
  {
    id: 'w6', name: 'Nur Aini Susanti', phone: '0818-9012-3456', role: 'helper', serviceType: 'helper',
    serviceFrequency: 'special',
    photo: W6,
    pricePerHour: 40000, pricePerDay: 260000,
    location: 'BSD, Tangerang Selatan', bio: 'Jasa catering & masak untuk acara keluarga. Bisa menu pernikahan, arisan, dan ulang tahun.',
    skills: ['Catering', 'Masak Acara', 'Masak Indonesia'],
    isAvailable: true, rating: 4.9, totalJobs: 143, isVerified: true, experienceYears: 6,
  },
  {
    id: 'w7', name: 'Siti Rahayu', phone: '0819-0123-4567', role: 'helper', serviceType: 'helper',
    serviceFrequency: 'regular',
    photo: W7,
    pricePerHour: 32000, pricePerDay: 140000,
    location: 'Ciputat, Tangerang Selatan', bio: 'ART tinggal atau harian. Pengalaman 5 tahun, suka bekerja dengan anak-anak.',
    skills: ['Masak', 'Cuci', 'Jaga Anak', 'Setrika'],
    isAvailable: true, rating: 4.6, totalJobs: 178, isVerified: false, experienceYears: 5,
  },
  {
    id: 'w8', name: 'Wulandari Putri', phone: '0820-1234-5678', role: 'helper', serviceType: 'helper',
    serviceFrequency: 'special',
    photo: W8,
    pricePerHour: 45000, pricePerDay: 290000,
    location: 'Pamulang, Tangerang Selatan', bio: 'Spesialis setrika & laundry kilat. Baju selesai rapi dalam 1 hari.',
    skills: ['Setrika', 'Cuci', 'Laundry Kilat'],
    isAvailable: false, rating: 4.8, totalJobs: 302, isVerified: true, experienceYears: 7,
  },
  // ── Tutors ────────────────────────────────────────────────────
  {
    id: 't1', name: 'Budi Santoso', phone: '0821-1111-2222', role: 'tutor', serviceType: 'tutor',
    photo: W1,
    pricePerHour: 80000,
    location: 'Menteng, Jakarta Pusat',
    bio: 'Lulusan ITB jurusan Matematika. Sudah 6 tahun mengajar privat, khusus SMP–SMA. Metode belajar menyenangkan, sabar, dan fokus pada pemahaman konsep dasar.',
    subjects: ['Matematika', 'Fisika', 'Kimia'],
    isAvailable: true, rating: 5.0, totalJobs: 52, isVerified: true, experienceYears: 6,
  },
  {
    id: 't2', name: 'Lisa Permata', phone: '0821-3333-4444', role: 'tutor', serviceType: 'tutor',
    photo: W2,
    pricePerHour: 70000,
    location: 'Kemang, Jakarta Selatan',
    bio: 'Native-like English speaker, lulusan S2 Linguistik UI. Pengalaman mengajar konversasi, grammar, IELTS, dan TOEFL. Cocok untuk semua usia.',
    subjects: ['Bahasa Inggris', 'IELTS', 'TOEFL'],
    isAvailable: true, rating: 4.9, totalJobs: 38, isVerified: true, experienceYears: 5,
  },
  {
    id: 't3', name: 'Hendra Wijaya', phone: '0821-5555-6666', role: 'tutor', serviceType: 'tutor',
    photo: W3,
    pricePerHour: 100000,
    location: 'Senayan, Jakarta Selatan',
    bio: 'Mantan guru SMA unggulan, kini full-time tutor privat. Spesialis persiapan SNBT dan olimpiade Sains. Murid berhasil masuk UI, ITB, dan UNPAD.',
    subjects: ['Kimia', 'Biologi', 'Persiapan SNBT'],
    isAvailable: true, rating: 4.8, totalJobs: 29, isVerified: true, experienceYears: 9,
  },
  {
    id: 't4', name: 'Anisa Rahayu', phone: '0821-7777-8888', role: 'tutor', serviceType: 'tutor',
    photo: W4,
    pricePerHour: 65000,
    location: 'Tebet, Jakarta Selatan',
    bio: 'Ahli matematika SD–SMP. Menggunakan metode visual dan permainan agar anak tidak takut matematika. Sudah membimbing 60+ murid.',
    subjects: ['Matematika SD', 'Matematika SMP'],
    isAvailable: true, rating: 4.9, totalJobs: 61, isVerified: true, experienceYears: 4,
  },
  {
    id: 't5', name: 'Rizky Pratama', phone: '0821-9999-0000', role: 'tutor', serviceType: 'tutor',
    photo: W5,
    pricePerHour: 90000,
    location: 'Kelapa Gading, Jakarta Utara',
    bio: 'Certified IELTS instructor dengan skor IELTS 8.5. Fokus pada persiapan IELTS, TOEFL iBT, dan beasiswa luar negeri. Metode intensif & efisien.',
    subjects: ['Bahasa Inggris', 'IELTS', 'Beasiswa'],
    isAvailable: true, rating: 4.7, totalJobs: 18, isVerified: true, experienceYears: 3,
  },
];

const MOCK_REVIEWS = [
  { id: 'r1', name: 'Bunda Wulan', photo: C1, rating: 5, text: 'Mbak Sari sangat teliti dan bersih sekali masakannya. Pasti akan dipanggil lagi!', textKo: '사리 씨는 정말 꼼꼼하고 요리도 아주 깔끔해요. 다음에 꼭 또 부를 거예요!', date: '2 hari lalu' },
  { id: 'r2', name: 'Bunda Hana',  photo: C2, rating: 5, text: 'Tepat waktu dan rumah jadi bersih banget. Anak-anak juga suka!', textKo: '시간 약속도 잘 지키고 집이 정말 깨끗해졌어요. 아이들도 좋아해요!', date: '1 minggu lalu' },
  { id: 'r3', name: 'Bunda Tari',  photo: C3, rating: 4, text: 'Ramah dan profesional. Masakannya enak, keluarga puas.', textKo: '친절하고 프로페셔널해요. 음식도 맛있어서 가족 모두 만족했어요.', date: '2 minggu lalu' },
];

// 기술(스킬) 한국어 라벨
const SKILL_KO: Record<string, string> = {
  'Masak': '요리', 'Masak Sehat': '건강식 요리', 'Masak Acara': '행사 요리', 'Masak Indonesia': '인니 요리',
  'Cuci': '빨래', 'Setrika': '다림질', 'Beberes': '청소',
  'Deep Cleaning': '대청소', 'Deep Clean': '대청소', 'Catering': '케이터링',
  'Laundry': '빠른 세탁', 'Laundry Kilat': '빠른 세탁',
  'Jaga Anak': '아이 돌봄', 'Asuh Anak': '아이 돌봄', 'Perawatan Anak': '아이 돌봄',
  'Belanja': '장보기', 'Lansia': '어르신 돌봄',
};

// 워커 소개글 한국어 목번역 (id 기준)
const BIO_KO: Record<string, string> = {
  'helper-me': '10년 경력의 가사도우미입니다. 요리·빨래·다림질·청소 모두 가능하고, 꼼꼼하고 정직하며 시간 약속을 잘 지킵니다.',
  'w1': '10년 경력의 가사도우미입니다. 인도네시아식·서양식 요리, 빨래, 다림질, 청소 모두 가능해요. 어린 자녀가 있는 가정 경험이 많습니다.',
  'w2': '매일 건강식 요리와 청소 전문이에요. 7년 경력에 정직하고 시간 약속을 잘 지킵니다.',
  'w3': '어린아이가 있는 가정 경험이 많아요. 인내심 있고 꼼꼼합니다. 요리·빨래·아이 돌봄 가능해요.',
  'w4': '꼼꼼하고 정직합니다. 외국인 가정 3곳에서 일한 경험이 있고, 서양식·인도네시아식 요리가 가능해요.',
  'w5': '입주 청소·리노베이션 후 청소 전문입니다. 빠르고 깔끔하게 해드려요.',
  'w6': '가족 행사용 케이터링·요리 전문이에요. 결혼식·모임·생일 메뉴까지 가능합니다.',
  'w7': '입주 또는 출퇴근 가사도우미입니다. 5년 경력이고 아이들과 함께 일하는 걸 좋아해요.',
  'w8': '다림질·빠른 세탁 전문이에요. 하루 안에 옷을 깔끔하게 마무리해 드립니다.',
};


export default function WorkerDetailScreen({ navigation, route }: Props) {
  const { workerId } = route.params;
  const { t, lang } = useLanguageStore();
  const tx = (ko: string, en: string, id: string) => (lang === 'ko' ? ko : lang === 'en' ? en : id);
  const insets = useSafeAreaInsets();
  const worker = MOCK_WORKERS.find((w) => w.id === workerId) ?? MOCK_WORKERS[0];
  const [duration, setDuration] = useState(4);

  const totalPrice  = worker.pricePerHour * duration;

  const isTutor = worker.serviceType === 'tutor';
  const lvl = levelOf(worker.totalJobs ?? 0);

  const handleBook = () => {
    navigation.navigate('Booking', {
      workerId:     worker.id,
      workerName:   worker.name,
      workerPhoto:  worker.photo,
      pricePerHour: worker.pricePerHour,
      serviceType:  worker.serviceType,
      pricePerDay:  worker.pricePerDay,
    });
  };

  const handleChat = () => {
    navigation.navigate('ChatDetail', {
      chatId: `chat_${worker.id}`,
      name: worker.name,
      photo: worker.photo,
      role: worker.role,
    });
  };

  // 워커별 커버 — mock: 모든 워커가 같은 W3 사용 (실제로는 worker.coverPhoto 필드 만들어서 워커가 설정)
  // 미설정 워커는 흰 배경
  const coverPhoto: string | null = DEFAULT_COVER;

  return (
    <View style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Cover photo (SNS-style — 워커가 설정한 사진. 없으면 흰 배경) ── */}
        <View style={s.coverWrap}>
          {coverPhoto ? (
            <Image source={{ uri: coverPhoto }} style={s.coverImage} />
          ) : (
            <View style={[s.coverImage, { backgroundColor: Colors.white }]} />
          )}
          {/* Floating back button on cover */}
          <TouchableOpacity style={[s.backBtn, { top: insets.top + 6 }]} onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('CustomerTabs' as never)}>
            <Ionicons name="chevron-back" size={24} color={Colors.dark} />
          </TouchableOpacity>
          <TouchableOpacity style={[s.shareBtn, { top: insets.top + 6 }]}>
            <Ionicons name="share-outline" size={20} color={Colors.dark} />
          </TouchableOpacity>
        </View>

        {/* ── Hero — avatar overlapping cover + identity ── */}
        <View style={s.heroSns}>
          <View style={s.avatarRing}>
            {worker.photo ? (
              <Image source={{ uri: worker.photo }} style={s.avatarBig} />
            ) : (
              <View style={[s.avatarBig, s.heroPhotoFallback]}>
                <Text style={s.heroPhotoLetter}>{worker.name.charAt(0)}</Text>
              </View>
            )}
            {worker.isAvailable && <View style={s.availStatusDot} />}
          </View>

          <View style={s.heroNameRow}>
            <Text style={s.heroNameBig}>{worker.name}</Text>
            {worker.isVerified && (
              <Ionicons name="checkmark-circle" size={20} color={Colors.accent} />
            )}
            {getMonthlyAwardBadge(worker.id) && <MvpMiniBadge role="helper" />}
          </View>

          <View style={s.heroMeta}>
            <Ionicons name="location-outline" size={13} color={Colors.grayLight} />
            <Text style={s.heroMetaText}>{worker.location}</Text>
          </View>

          <View style={s.heroPillsRow}>
            <View style={[s.pill, { backgroundColor: isTutor ? Colors.tutorLight : Colors.helperLight }]}>
              <Ionicons
                name={isTutor ? 'school-outline' : 'home-outline'}
                size={11}
                color={isTutor ? Colors.tutorColor : Colors.helperColor}
              />
              <Text style={[s.pillText, { color: isTutor ? Colors.tutorColor : Colors.helperColor }]}>
                {isTutor ? t.services.tutorFull : t.services.art}
              </Text>
            </View>
            <View style={s.pill}>
              <Ionicons name="star" size={11} color={Colors.accent} />
              <Text style={s.pillText}>{worker.rating} rating</Text>
            </View>
            <View style={[s.pill, { backgroundColor: Colors.accentLight, borderColor: '#BFEBD2' }]}>
              <Ionicons name="ribbon-outline" size={11} color={Colors.accent} />
              <Text style={[s.pillText, { color: Colors.primaryDark }]}>Lv.{lvl.lv} {lvl.name}</Text>
            </View>
            <View style={[s.pill, { backgroundColor: worker.isAvailable ? '#F0FDF4' : Colors.section }]}>
              <View style={[s.availDot, { backgroundColor: worker.isAvailable ? Colors.success : Colors.grayLight }]} />
              <Text style={[s.pillText, { color: worker.isAvailable ? Colors.success : Colors.grayLight }]}>
                {worker.isAvailable ? t.workerDetail.available : t.workerDetail.busy}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={s.statsCard}>
          {[
            { label: t.workerDetail.jobsDone, value: `${worker.totalJobs}` },
            { label: 'Linka Point',           value: `${computeLinkaPoint(worker.rating ?? 4.5, worker.totalJobs ?? 0)}`, isTemp: true },
            { label: t.workerDetail.expYears, value: `${worker.experienceYears}` },
          ].map((stat, i, arr) => (
            <React.Fragment key={stat.label}>
              <View style={s.statCol}>
                <Text style={[s.statValue, stat.isTemp && { color: Colors.accent }]}>{stat.value}</Text>
                <Text style={s.statLabel}>{stat.label}</Text>
              </View>
              {i < arr.length - 1 && <View style={s.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Level — 사용량 기반 (점수 보완) */}
        <View style={s.levelRow}>
          <View style={s.levelHead}>
            <View style={s.levelLabel}>
              <Ionicons name="ribbon" size={13} color={Colors.accent} />
              <Text style={s.levelLv}>Lv.{lvl.lv}</Text>
              <Text style={s.levelName}>{lvl.name}</Text>
            </View>
            <Text style={s.levelRemain}>
              {lvl.isMax ? '최고 레벨' : `다음 레벨까지 ${lvl.remaining}건`}
            </Text>
          </View>
          <View style={s.levelTrack}>
            <View style={[s.levelFill, { width: `${Math.round(lvl.progress * 100)}%` }]} />
          </View>
        </View>

        {/* Verification badges */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>신뢰 정보</Text>
          <View style={s.verifyRow}>
            <View style={[s.verifyChip, worker.isVerified && s.verifyChipOn]}>
              <Ionicons name="card-outline" size={14} color={worker.isVerified ? Colors.accent : Colors.grayLight} />
              <Text style={[s.verifyText, worker.isVerified && s.verifyTextOn]}>KTP</Text>
            </View>
            <View style={[s.verifyChip, worker.isVerified && s.verifyChipOn]}>
              <Ionicons name="shield-checkmark-outline" size={14} color={worker.isVerified ? Colors.accent : Colors.grayLight} />
              <Text style={[s.verifyText, worker.isVerified && s.verifyTextOn]}>BPJS</Text>
            </View>
            <View style={[s.verifyChip, worker.isVerified && s.verifyChipOn]}>
              <Ionicons name="card-outline" size={14} color={worker.isVerified ? Colors.accent : Colors.grayLight} />
              <Text style={[s.verifyText, worker.isVerified && s.verifyTextOn]}>Bank</Text>
            </View>
            <View style={[s.verifyChip, s.verifyChipOn]}>
              <Ionicons name="finger-print-outline" size={14} color={Colors.accent} />
              <Text style={[s.verifyText, s.verifyTextOn]}>본인인증</Text>
            </View>
          </View>
        </View>

        {/* About */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>{t.workerDetail.about}</Text>
          <TransText original={worker.bio} translated={BIO_KO[worker.id]} target="ko" textStyle={s.bioText} />
        </View>

        {/* Subjects / Skills */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>{isTutor ? t.services.lesTutor : t.workerDetail.skills}</Text>
          <View style={s.skillsWrap}>
            {(isTutor ? worker.subjects : worker.skills)?.map((item) => (
              <View key={item} style={[s.skillPill, isTutor && s.tutorPill]}>
                <Text style={[s.skillText, isTutor && s.tutorPillText]}>
                  {!isTutor && lang === 'ko' ? (SKILL_KO[item] ?? item) : item}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Gallery — SNS photos */}
        {!isTutor && (
          <View style={s.section}>
            <View style={s.portfolioHeader}>
              <Text style={s.sectionTitle}>사진</Text>
              <Text style={s.portfolioCount}>{GALLERY_PHOTOS.length}</Text>
            </View>
            <View style={s.portfolioGrid}>
              {GALLERY_PHOTOS.map((uri, i) => (
                <View key={i} style={s.portfolioCell}>
                  <Image source={{ uri }} style={s.portfolioImage} />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Booking calculator */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>{t.workerDetail.calcTitle}</Text>
          <View style={s.calcCard}>
            {/* Duration picker */}
            <View style={s.calcRow}>
              <Text style={s.calcLabel}>{t.workerDetail.duration}</Text>
              <View style={s.durationPicker}>
                <TouchableOpacity
                  style={s.durationBtn}
                  onPress={() => setDuration((d) => Math.max(1, d - 1))}
                >
                  <Ionicons name="remove" size={16} color={Colors.dark} />
                </TouchableOpacity>
                <Text style={s.durationVal}>{duration}</Text>
                <TouchableOpacity
                  style={s.durationBtn}
                  onPress={() => setDuration((d) => Math.min(12, d + 1))}
                >
                  <Ionicons name="add" size={16} color={Colors.dark} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={s.calcDivider} />

            <View style={s.calcRow}>
              <Text style={s.calcLabel}>{t.workerDetail.ratePerHour}</Text>
              <Text style={s.calcVal}>Rp {worker.pricePerHour.toLocaleString('id-ID')}</Text>
            </View>
            <View style={s.calcRow}>
              <Text style={s.calcLabel}>{t.orders.total}</Text>
              <Text style={s.calcValBold}>Rp {totalPrice.toLocaleString('id-ID')}</Text>
            </View>

            <View style={s.calcDivider} />

            {/* 후불 결제 + 취소 수수료 안내 */}
            <View style={s.depositInfo}>
              <Ionicons name="time-outline" size={14} color={Colors.accent} />
              <Text style={s.depositInfoText}>{tx('후불 결제 · 서비스 완료 후 결제', 'Pay after service is done', 'Bayar setelah layanan selesai')}</Text>
            </View>
            <Text style={[s.depositNote, { fontWeight: '700', color: Colors.darkMid, marginTop: 8 }]}>
              {tx('취소 수수료 안내', 'Cancellation policy', 'Kebijakan pembatalan')}
            </Text>
            <Text style={s.depositNote}>{tx('• 방문 24시간 전까지: 무료 취소', '• Up to 24h before: free', '• Sampai 24 jam sebelum: gratis')}</Text>
            <Text style={s.depositNote}>{tx('• 24시간 이내: 예상 금액의 30%', '• Within 24h: 30% of estimate', '• Dalam 24 jam: 30%')}</Text>
            <Text style={s.depositNote}>{tx('• 방문 후 취소: 50%', '• After arrival: 50%', '• Setelah tiba: 50%')}</Text>
          </View>
        </View>

        {/* Reviews */}
        <View style={s.section}>
          <View style={s.reviewHeader}>
            <Text style={s.sectionTitle}>{t.workerDetail.reviews}</Text>
            <View style={s.ratingBadge}>
              <Ionicons name="star" size={12} color={Colors.accent} />
              <Text style={s.ratingBadgeText}>{worker.rating}</Text>
            </View>
          </View>
          {MOCK_REVIEWS.map((rv) => (
            <View key={rv.id} style={s.reviewCard}>
              <View style={s.reviewTop}>
                <Image source={{ uri: rv.photo }} style={s.reviewAvatar} />
                <View style={{ flex: 1 }}>
                  <Text style={s.reviewName}>{rv.name}</Text>
                  <View style={s.starsRow}>
                    {Array.from({ length: rv.rating }).map((_, i) => (
                      <Ionicons key={i} name="star" size={11} color={Colors.accent} />
                    ))}
                    <Text style={s.reviewDate}>{rv.date}</Text>
                  </View>
                </View>
              </View>
              <TransText original={rv.text} translated={rv.textKo} target="ko" textStyle={s.reviewText} />
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={s.bottomBar}>
        <TouchableOpacity style={s.chatBtn} onPress={handleChat} activeOpacity={0.8}>
          <Ionicons name="chatbubble-ellipses-outline" size={18} color={Colors.accent} />
          <Text style={s.chatBtnText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.bookBtn, !worker.isAvailable && s.bookBtnDisabled]}
          onPress={handleBook}
          activeOpacity={0.85}
          disabled={!worker.isAvailable}
        >
          <Text style={s.bookBtnText}>
            {worker.isAvailable ? t.workerDetail.bookNow : t.workerDetail.notAvailable}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },

  backBtn: {
    position: 'absolute', left: 16, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.sm,
  },
  shareBtn: {
    position: 'absolute', right: 16, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.sm,
  },

  // ── Cover (SNS-style) ──
  coverWrap: { width: '100%', height: 180, position: 'relative', backgroundColor: Colors.accentLight },
  coverImage: { width: '100%', height: '100%' },
  coverOverlay: {
    position: 'absolute', inset: 0,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },

  // ── SNS hero ──
  heroSns: {
    paddingHorizontal: 20, paddingTop: 0, paddingBottom: 18,
    alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  avatarRing: {
    marginTop: -54,
    width: 112, height: 112, borderRadius: 56,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.md,
    position: 'relative',
  },
  avatarBig: { width: 104, height: 104, borderRadius: 52 },
  availStatusDot: {
    position: 'absolute', bottom: 6, right: 6,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: Colors.success,
    borderWidth: 3, borderColor: Colors.white,
  },
  heroNameBig: { fontSize: 22, fontWeight: '800', color: Colors.dark },

  // Hero (legacy — kept for fallback)
  hero: {
    paddingHorizontal: 20, paddingBottom: 20,
    flexDirection: 'row', gap: 16, alignItems: 'flex-start',
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  heroPhoto: { width: 88, height: 88, borderRadius: 44 },
  heroPhotoFallback: {
    backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center',
  },
  heroPhotoLetter: { fontSize: 32, fontWeight: '700', color: Colors.accent },
  heroInfo:   { flex: 1 },
  heroNameRow:{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, marginBottom: 5 },
  heroName:   { fontSize: 20, fontWeight: '700', color: Colors.dark },
  heroMeta:   { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  heroMetaText: { fontSize: 13, color: Colors.gray },
  heroPillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },

  // ── Verification chips ──
  verifyRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  verifyChip:   {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 11, paddingVertical: 7,
    borderRadius: Radius.pill,
    borderWidth: 1.2, borderColor: Colors.border,
    backgroundColor: Colors.section,
  },
  verifyChipOn: { backgroundColor: Colors.accentLight, borderColor: Colors.accent + '40' },
  verifyText:   { fontSize: 12, fontWeight: '600', color: Colors.grayLight },
  verifyTextOn: { color: Colors.accent },

  // ── Portfolio grid ──
  portfolioHeader: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 12 },
  portfolioCount:  { fontSize: 12, color: Colors.grayLight, fontWeight: '500' },
  portfolioGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  portfolioCell:   { width: '32%', aspectRatio: 1, borderRadius: 10, overflow: 'hidden', backgroundColor: Colors.section },
  portfolioImage:  { width: '100%', height: '100%' },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.section, borderRadius: Radius.pill,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: Colors.border,
  },
  pillText:  { fontSize: 11, fontWeight: '600', color: Colors.gray },
  availDot:  { width: 6, height: 6, borderRadius: 3 },

  // Stats
  statsCard: {
    flexDirection: 'row', paddingVertical: 20,
    marginHorizontal: 20, marginTop: 20,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  statCol:     { flex: 1, alignItems: 'center', gap: 4 },
  statDivider: { width: 1, backgroundColor: Colors.border, marginVertical: 4 },
  statValue:   { fontSize: 20, fontWeight: '700', color: Colors.dark },
  statLabel:   { fontSize: 11, color: Colors.gray },

  // 레벨 (사용량 기반) — 절제된 진행바
  levelRow:    { marginHorizontal: 20, marginTop: 16 },
  levelHead:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  levelLabel:  { flexDirection: 'row', alignItems: 'center', gap: 5 },
  levelLv:     { fontSize: 13, fontWeight: '800', color: Colors.primaryDark },
  levelName:   { fontSize: 13, fontWeight: '600', color: Colors.gray },
  levelRemain: { fontSize: 11, color: Colors.grayLight },
  levelTrack:  { height: 6, borderRadius: 3, backgroundColor: Colors.section, overflow: 'hidden' },
  levelFill:   { height: 6, borderRadius: 3, backgroundColor: Colors.accent },

  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.dark, marginBottom: 12 },

  bioText: { fontSize: 14, color: Colors.gray, lineHeight: 22 },

  detailBlock: {
    backgroundColor: Colors.section, borderRadius: Radius.lg,
    paddingHorizontal: 16, paddingVertical: 12, gap: 10,
    borderWidth: 1, borderColor: Colors.border,
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailText: { fontSize: 14, color: Colors.dark },

  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillPill: {
    backgroundColor: Colors.accentLight, borderRadius: Radius.pill,
    paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1, borderColor: Colors.accent + '30',
  },
  skillText: { fontSize: 13, fontWeight: '600', color: Colors.accent },
  tutorPill: {
    backgroundColor: Colors.tutorLight,
    borderColor: Colors.tutorColor + '30',
  },
  tutorPillText: { color: Colors.tutorColor },

  // Booking calc
  calcCard: {
    backgroundColor: Colors.section, borderRadius: Radius.lg,
    padding: 16, borderWidth: 1, borderColor: Colors.border, gap: 10,
  },
  calcRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  calcLabel:   { fontSize: 14, color: Colors.gray },
  calcVal:     { fontSize: 14, fontWeight: '600', color: Colors.dark },
  calcValBold: { fontSize: 16, fontWeight: '700', color: Colors.dark },
  calcDivider: { height: 1, backgroundColor: Colors.border },

  durationPicker: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  durationBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  durationVal: { fontSize: 18, fontWeight: '700', color: Colors.dark, minWidth: 24, textAlign: 'center' },

  depositInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  depositInfoText: { fontSize: 12, fontWeight: '700', color: Colors.accent },
  depositNote: { fontSize: 11, color: Colors.gray, lineHeight: 16, marginTop: 2 },

  // Reviews
  reviewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.accentLight, borderRadius: Radius.pill,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  ratingBadgeText: { fontSize: 13, fontWeight: '700', color: Colors.accent },

  reviewCard: {
    backgroundColor: Colors.section, borderRadius: Radius.lg,
    padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: Colors.border,
  },
  reviewTop:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reviewAvatar:{ width: 36, height: 36, borderRadius: 18 },
  reviewName:  { fontSize: 13, fontWeight: '700', color: Colors.dark, marginBottom: 3 },
  starsRow:    { flexDirection: 'row', alignItems: 'center', gap: 2 },
  reviewDate:  { fontSize: 11, color: Colors.grayLight, marginLeft: 6 },
  reviewText:  { fontSize: 13, color: Colors.gray, lineHeight: 20 },

  // Bottom bar
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 10,
    backgroundColor: Colors.white,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28,
    borderTopWidth: 1, borderTopColor: Colors.border,
    ...Shadow.md,
  },
  chatBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 13, paddingHorizontal: 18,
    borderRadius: Radius.pill,
    borderWidth: 1.5, borderColor: Colors.accent,
    backgroundColor: Colors.accentLight,
  },
  chatBtnText: { fontSize: 14, fontWeight: '700', color: Colors.accent },
  bookBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 14,
    borderRadius: Radius.pill, backgroundColor: Colors.accent,
  },
  bookBtnDisabled: { backgroundColor: Colors.grayLight },
  bookBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});
