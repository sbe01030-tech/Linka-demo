import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, FlatList,
  TouchableOpacity, Image, Modal, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { RootStackParamList, Worker } from '../../types';
import { useLanguageStore } from '../../store/languageStore';
import { W1, W2, W3, W4, W5, W6, W7, W8 } from '../../constants/photos';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkerSearch'>;

// ── Mock workers ─────────────────────────────────────────────────
const MOCK_WORKERS: Worker[] = [
  { id: 'w1', name: 'Sari Dewi',        phone: '', role: 'helper', serviceType: 'helper', serviceFrequency: 'regular', photo: W1, pricePerHour: 30000, location: 'Kebayoran, Jakarta Selatan', bio: '', skills: ['Beberes', 'Masak', 'Cuci', 'Setrika'], isAvailable: true,  rating: 5.0, totalJobs: 312, isVerified: true,  experienceYears: 10 },
  { id: 'w2', name: 'Rina Wulandari',   phone: '', role: 'helper', serviceType: 'helper', serviceFrequency: 'regular', photo: W2, pricePerHour: 25000, location: 'Cilandak, Jakarta Selatan',  bio: '', skills: ['Masak Sehat', 'Beberes', 'Cuci'],         isAvailable: true,  rating: 4.9, totalJobs: 198, isVerified: true,  experienceYears: 7  },
  { id: 'w3', name: 'Dewi Anggraeni',   phone: '', role: 'helper', serviceType: 'helper', serviceFrequency: 'both',    photo: W3, pricePerHour: 28000, location: 'Kemang, Jakarta Selatan',    bio: '', skills: ['Masak', 'Cuci', 'Beberes'],               isAvailable: true,  rating: 4.7, totalJobs: 156, isVerified: true,  experienceYears: 5  },
  { id: 'w4', name: 'Fitri Handayani',  phone: '', role: 'helper', serviceType: 'helper', serviceFrequency: 'regular', photo: W4, pricePerHour: 27000, location: 'Fatmawati, Jakarta Selatan',  bio: '', skills: ['Masak', 'Setrika', 'Beberes'],            isAvailable: true,  rating: 4.9, totalJobs: 227, isVerified: true,  experienceYears: 8  },
  { id: 'w5', name: 'Indah Lestari',    phone: '', role: 'helper', serviceType: 'helper', serviceFrequency: 'special', photo: W5, pricePerHour: 35000, location: 'Pondok Indah, Jakarta Selatan',bio:'', skills: ['Deep Cleaning', 'Beberes', 'Cuci'],        isAvailable: true,  rating: 4.8, totalJobs: 89,  isVerified: true,  experienceYears: 3  },
  { id: 'w6', name: 'Nur Aini Susanti', phone: '', role: 'helper', serviceType: 'helper', serviceFrequency: 'special', photo: W6, pricePerHour: 40000, location: 'BSD, Tangerang Selatan',      bio: '', skills: ['Catering', 'Masak Acara'],               isAvailable: true,  rating: 4.9, totalJobs: 143, isVerified: true,  experienceYears: 6  },
  { id: 'w7', name: 'Siti Rahayu',      phone: '', role: 'helper', serviceType: 'helper', serviceFrequency: 'regular', photo: W7, pricePerHour: 22000, location: 'Ciputat, Tangerang Selatan',  bio: '', skills: ['Masak', 'Cuci', 'Setrika'],              isAvailable: true,  rating: 4.6, totalJobs: 178, isVerified: false, experienceYears: 5  },
  { id: 'w8', name: 'Wulandari Putri',  phone: '', role: 'helper', serviceType: 'helper', serviceFrequency: 'special', photo: W8, pricePerHour: 45000, location: 'Pamulang, Tangerang Selatan', bio: '', skills: ['Setrika', 'Cuci', 'Laundry'],             isAvailable: false, rating: 4.8, totalJobs: 302, isVerified: true,  experienceYears: 7  },
];

// ── Activity categories ───────────────────────────────────────────
const ACTIVITY_CATS = [
  {
    id: 'cleaning', icon: 'sparkles-outline' as const, color: '#10B981', bg: '#ECFDF5',
    label: { id: 'Kebersihan·Kerapian', ko: '청소·정리', en: 'Cleaning' },
    items: [
      { id: 'floor',    label: { id: 'Sapu & Pel Lantai',    ko: '바닥 청소',     en: 'Floor Cleaning' },     skill: 'Beberes' },
      { id: 'kitchen',  label: { id: 'Bersih Dapur',         ko: '주방 청소',     en: 'Kitchen' },            skill: 'Beberes' },
      { id: 'bathroom', label: { id: 'Bersih Kamar Mandi',   ko: '화장실 청소',   en: 'Bathroom' },           skill: 'Beberes' },
      { id: 'balcony',  label: { id: 'Bersih Balkon',        ko: '베란다 청소',   en: 'Balcony' },            skill: 'Beberes' },
      { id: 'window',   label: { id: 'Bersih Jendela',       ko: '창문 청소',     en: 'Windows' },            skill: 'Deep Cleaning' },
      { id: 'ac',       label: { id: 'Bersih AC',            ko: '에어컨 청소',   en: 'AC Cleaning' },        skill: 'Deep Cleaning' },
    ],
  },
  {
    id: 'cooking', icon: 'restaurant-outline' as const, color: '#F97316', bg: '#FFF1EC',
    label: { id: 'Masak·Makanan', ko: '요리·식사', en: 'Cooking' },
    items: [
      { id: 'meal',     label: { id: 'Masak Harian',        ko: '식사 준비',     en: 'Daily Meals' },        skill: 'Masak' },
      { id: 'sidedish', label: { id: 'Lauk Pauk',           ko: '반찬 만들기',   en: 'Side Dishes' },        skill: 'Masak' },
      { id: 'dishes',   label: { id: 'Cuci Piring',         ko: '설거지',        en: 'Dishwashing' },        skill: 'Cuci' },
      { id: 'prep',     label: { id: 'Persiapan Bahan',     ko: '식재료 손질',   en: 'Food Prep' },          skill: 'Masak Sehat' },
    ],
  },
  {
    id: 'laundry', icon: 'shirt-outline' as const, color: '#3B82F6', bg: '#EFF6FF',
    label: { id: 'Cuci·Setrika', ko: '세탁·관리', en: 'Laundry' },
    items: [
      { id: 'wash',     label: { id: 'Cuci Baju',           ko: '빨래',          en: 'Washing' },            skill: 'Cuci' },
      { id: 'iron',     label: { id: 'Setrika',             ko: '다림질',        en: 'Ironing' },            skill: 'Setrika' },
      { id: 'fold',     label: { id: 'Rapikan Pakaian',     ko: '세탁물 정리',   en: 'Folding' },            skill: 'Setrika' },
      { id: 'laundry',  label: { id: 'Laundry Kilat',       ko: '빠른 세탁',     en: 'Express Laundry' },    skill: 'Laundry' },
    ],
  },
  {
    id: 'other', icon: 'grid-outline' as const, color: '#8B5CF6', bg: '#F5F3FF',
    label: { id: 'Lainnya', ko: '기타', en: 'Others' },
    items: [
      { id: 'grocery',  label: { id: 'Belanja Bahan',       ko: '장보기',        en: 'Grocery Shopping' },   skill: 'Masak' },
      { id: 'trash',    label: { id: 'Buang Sampah',        ko: '쓰레기 분리수거', en: 'Waste Disposal' },    skill: 'Beberes' },
    ],
  },
];

type SvcType = 'regular' | 'onetime' | 'live-in';
type ExpLevel = 'all' | '1y' | '3y' | '5y';
type SortBy   = 'rating' | 'price_low' | 'price_high' | 'reviews';

export default function WorkerSearchScreen({ navigation, route }: Props) {
  const { lang } = useLanguageStore();
  const insets = useSafeAreaInsets();

  // ── Filter state ─────────────────────────────────────────────
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [serviceType, setServiceType] = useState<SvcType | null>(
    route.params?.serviceType === 'regular' ? 'regular'
    : route.params?.serviceType === 'onetime' ? 'onetime'
    : null
  );
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [expLevel, setExpLevel]         = useState<ExpLevel>('all');
  const [sortBy, setSortBy]             = useState<SortBy>('rating');

  // ── Modal visibility ─────────────────────────────────────────
  const [showActivity, setShowActivity]   = useState(false);
  const [showCondition, setShowCondition] = useState(false);
  const [showWorker, setShowWorker]       = useState(false);
  const [showSort, setShowSort]           = useState(false);

  // ── Temp state for modals ────────────────────────────────────
  const [tempActivities, setTempActivities]   = useState<string[]>([]);
  const [tempServiceType, setTempServiceType] = useState<SvcType | null>(null);
  const [tempVerified, setTempVerified]       = useState(false);
  const [tempExpLevel, setTempExpLevel]       = useState<ExpLevel>('all');

  // ── i18n helpers ─────────────────────────────────────────────
  const tx = (id: string, ko: string, en: string) =>
    lang === 'ko' ? ko : lang === 'en' ? en : id;

  const tLabel = (o: { id: string; ko: string; en: string }) =>
    lang === 'ko' ? o.ko : lang === 'en' ? o.en : o.id;

  // ── Filtering ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...MOCK_WORKERS];

    if (serviceType === 'regular') {
      list = list.filter((w) => w.serviceFrequency === 'regular' || w.serviceFrequency === 'both');
    } else if (serviceType === 'onetime') {
      list = list.filter((w) => w.serviceFrequency === 'special' || w.serviceFrequency === 'both');
    }

    if (verifiedOnly) list = list.filter((w) => w.isVerified);

    if (expLevel === '1y') list = list.filter((w) => w.experienceYears >= 1);
    else if (expLevel === '3y') list = list.filter((w) => w.experienceYears >= 3);
    else if (expLevel === '5y') list = list.filter((w) => w.experienceYears >= 5);

    if (selectedActivities.length > 0) {
      const neededSkills = ACTIVITY_CATS.flatMap((cat) =>
        cat.items.filter((i) => selectedActivities.includes(i.id)).map((i) => i.skill)
      );
      if (neededSkills.length > 0) {
        list = list.filter((w) =>
          neededSkills.some((sk) => (w.skills ?? []).includes(sk))
        );
      }
    }

    if (sortBy === 'rating')     list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'price_low')  list.sort((a, b) => a.pricePerHour - b.pricePerHour);
    else if (sortBy === 'price_high') list.sort((a, b) => b.pricePerHour - a.pricePerHour);
    else if (sortBy === 'reviews')    list.sort((a, b) => b.totalJobs - a.totalJobs);

    return list;
  }, [serviceType, verifiedOnly, expLevel, selectedActivities, sortBy]);

  // ── Chip active states ───────────────────────────────────────
  const activityActive  = selectedActivities.length > 0;
  const conditionActive = serviceType !== null;
  const workerActive    = verifiedOnly || expLevel !== 'all';

  const SERVICE_TYPES: { key: SvcType; label: string; desc: string }[] = [
    { key: 'regular', label: tx('Berkala', '정기', 'Regular'),   desc: tx('Jadwal tetap, mingguan atau bulanan', '정해진 날마다 방문', 'Fixed schedule, weekly or monthly') },
    { key: 'onetime', label: tx('Sekali', '단기', 'One-time'),   desc: tx('Satu kali atau beberapa hari', '하루 또는 며칠만 활동', 'Single visit or a few days') },
    { key: 'live-in', label: tx('Tinggal', '상주', 'Live-in'),   desc: tx('Tinggal di rumah pelanggan', '고객 집에서 함께 생활', 'Lives at customer\'s home') },
  ];

  const EXP_LEVELS: { key: ExpLevel; label: string }[] = [
    { key: 'all', label: tx('Semua', '전체', 'All') },
    { key: '1y',  label: tx('1 tahun+', '1년+', '1yr+') },
    { key: '3y',  label: tx('3 tahun+', '3년+', '3yr+') },
    { key: '5y',  label: tx('5 tahun+', '5년+', '5yr+') },
  ];

  const SORT_OPTIONS: { key: SortBy; label: string }[] = [
    { key: 'rating',     label: tx('Nilai terbaik', '평점순',     'Top rated') },
    { key: 'reviews',    label: tx('Ulasan terbanyak', '후기 많은순', 'Most reviewed') },
    { key: 'price_low',  label: tx('Harga terendah', '가격 낮은순', 'Lowest price') },
    { key: 'price_high', label: tx('Harga tertinggi', '가격 높은순', 'Highest price') },
  ];

  const sortLabel = SORT_OPTIONS.find((s) => s.key === sortBy)?.label ?? '';

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>

      {/* ── Header ──────────────────────────────────────────── */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <TouchableOpacity style={s.locationRow}>
          <Ionicons name="location" size={14} color={Colors.accent} />
          <Text style={s.locationText}>Jakarta Selatan</Text>
          <Ionicons name="chevron-down" size={13} color={Colors.gray} />
        </TouchableOpacity>
        <TouchableOpacity style={s.searchIconBtn}>
          <Ionicons name="search-outline" size={22} color={Colors.dark} />
        </TouchableOpacity>
      </View>

      {/* ── Filter chips ─────────────────────────────────────── */}
      <View style={s.filterBar}>
        <TouchableOpacity
          style={[s.filterChip, activityActive && s.filterChipActive]}
          onPress={() => { setTempActivities(selectedActivities); setShowActivity(true); }}
        >
          <Text style={[s.filterChipText, activityActive && s.filterChipTextActive]}>
            {tx('Jenis Kerja', '원하는 업무', 'Activities')}
            {activityActive ? ` (${selectedActivities.length})` : ''}
          </Text>
          <Ionicons name="chevron-down" size={12} color={activityActive ? Colors.white : Colors.gray} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.filterChip, conditionActive && s.filterChipActive]}
          onPress={() => { setTempServiceType(serviceType); setShowCondition(true); }}
        >
          <Text style={[s.filterChipText, conditionActive && s.filterChipTextActive]}>
            {conditionActive
              ? SERVICE_TYPES.find((s) => s.key === serviceType)?.label
              : tx('Kondisi Kerja', '업무 조건', 'Job Type')}
          </Text>
          <Ionicons name="chevron-down" size={12} color={conditionActive ? Colors.white : Colors.gray} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.filterChip, workerActive && s.filterChipActive]}
          onPress={() => { setTempVerified(verifiedOnly); setTempExpLevel(expLevel); setShowWorker(true); }}
        >
          <Text style={[s.filterChipText, workerActive && s.filterChipTextActive]}>
            {tx('Kondisi Helper', '헬퍼 조건', 'Helper Filter')}
            {workerActive ? ' ●' : ''}
          </Text>
          <Ionicons name="chevron-down" size={12} color={workerActive ? Colors.white : Colors.gray} />
        </TouchableOpacity>
      </View>

      {/* ── Sort row ─────────────────────────────────────────── */}
      <View style={s.sortRow}>
        <Text style={s.resultCount}>
          <Text style={s.resultCountNum}>{filtered.length}</Text>
          {tx(' helper tersedia', '명의 헬퍼', ' helpers found')}
        </Text>
        <TouchableOpacity style={s.sortBtn} onPress={() => setShowSort(true)}>
          <Ionicons name="funnel-outline" size={13} color={Colors.gray} />
          <Text style={s.sortBtnText}>{sortLabel}</Text>
          <Ionicons name="chevron-down" size={12} color={Colors.gray} />
        </TouchableOpacity>
      </View>

      {/* ── Worker list ──────────────────────────────────────── */}
      <FlatList
        data={filtered}
        keyExtractor={(w) => w.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="search-outline" size={40} color={Colors.grayLight} />
            <Text style={s.emptyText}>{tx('Tidak ada helper', '헬퍼가 없어요', 'No helpers found')}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <WorkerCard
            worker={item}
            onPress={() => navigation.navigate('WorkerDetail', { workerId: item.id })}
            tx={tx}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />

      {/* ════════════════════════════════════════════════════════
          MODAL 1 — 원하는 업무
      ════════════════════════════════════════════════════════ */}
      <Modal visible={showActivity} transparent animationType="slide" onRequestClose={() => setShowActivity(false)}>
        <View style={s.modalRoot}>
          <Pressable style={s.modalOverlay} onPress={() => setShowActivity(false)} />
          <View style={[s.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={s.modalHandle} />
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{tx('Pilih Jenis Pekerjaan', '원하는 업무', 'Select Activities')}</Text>
              <Text style={s.modalSub}>{tx('Maks. 5 pilihan', '최대 5개 선택', 'Max 5 selections')}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {ACTIVITY_CATS.map((cat) => (
                <View key={cat.id} style={s.actCatSection}>
                  <View style={s.actCatHeader}>
                    <View style={[s.actCatIcon, { backgroundColor: cat.bg }]}>
                      <Ionicons name={cat.icon} size={14} color={cat.color} />
                    </View>
                    <Text style={s.actCatLabel}>{tLabel(cat.label)}</Text>
                  </View>
                  <View style={s.actPillsRow}>
                    {cat.items.map((item) => {
                      const sel = tempActivities.includes(item.id);
                      const disabled = !sel && tempActivities.length >= 5;
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[s.actPill, sel && s.actPillSel, disabled && s.actPillDisabled]}
                          onPress={() => {
                            if (disabled) return;
                            setTempActivities((prev) =>
                              prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id]
                            );
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={[s.actPillText, sel && s.actPillTextSel]}>{tLabel(item.label)}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
              <View style={{ height: 8 }} />
            </ScrollView>

            <View style={s.modalFooter}>
              <TouchableOpacity style={s.resetBtn} onPress={() => setTempActivities([])}>
                <Ionicons name="refresh-outline" size={15} color={Colors.gray} />
                <Text style={s.resetBtnText}>{tx('Reset', '초기화', 'Reset')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.applyBtn}
                onPress={() => { setSelectedActivities(tempActivities); setShowActivity(false); }}
              >
                <Text style={s.applyBtnText}>
                  {tx('Terapkan', '적용하기', 'Apply')}
                  {tempActivities.length > 0 ? ` (${tempActivities.length})` : ''}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ════════════════════════════════════════════════════════
          MODAL 2 — 업무 조건
      ════════════════════════════════════════════════════════ */}
      <Modal visible={showCondition} transparent animationType="slide" onRequestClose={() => setShowCondition(false)}>
        <View style={s.modalRoot}>
          <Pressable style={s.modalOverlay} onPress={() => setShowCondition(false)} />
          <View style={[s.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={s.modalHandle} />
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{tx('Kondisi Pekerjaan', '업무 조건', 'Job Conditions')}</Text>
            </View>

            <Text style={s.condSectionLabel}>{tx('Jenis Layanan', '업무 유형', 'Service Type')}</Text>
            {SERVICE_TYPES.map((svc) => {
              const sel = tempServiceType === svc.key;
              return (
                <TouchableOpacity
                  key={svc.key}
                  style={[s.condRow, sel && s.condRowSel]}
                  onPress={() => setTempServiceType(sel ? null : svc.key)}
                  activeOpacity={0.7}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[s.condLabel, sel && s.condLabelSel]}>{svc.label}</Text>
                    <Text style={s.condDesc}>{svc.desc}</Text>
                  </View>
                  <View style={[s.condCheck, sel && s.condCheckSel]}>
                    {sel && <Ionicons name="checkmark" size={14} color={Colors.white} />}
                  </View>
                </TouchableOpacity>
              );
            })}

            <View style={[s.modalFooter, { marginTop: 16 }]}>
              <TouchableOpacity style={s.resetBtn} onPress={() => setTempServiceType(null)}>
                <Ionicons name="refresh-outline" size={15} color={Colors.gray} />
                <Text style={s.resetBtnText}>{tx('Reset', '초기화', 'Reset')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.applyBtn}
                onPress={() => { setServiceType(tempServiceType); setShowCondition(false); }}
              >
                <Text style={s.applyBtnText}>{tx('Terapkan', '적용하기', 'Apply')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ════════════════════════════════════════════════════════
          MODAL 3 — 헬퍼 조건
      ════════════════════════════════════════════════════════ */}
      <Modal visible={showWorker} transparent animationType="slide" onRequestClose={() => setShowWorker(false)}>
        <View style={s.modalRoot}>
          <Pressable style={s.modalOverlay} onPress={() => setShowWorker(false)} />
          <View style={[s.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={s.modalHandle} />
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{tx('Kondisi Helper', '헬퍼 조건', 'Helper Conditions')}</Text>
            </View>

            {/* Verified toggle */}
            <TouchableOpacity style={s.verifiedRow} onPress={() => setTempVerified((v) => !v)} activeOpacity={0.7}>
              <View style={s.verifiedLeft}>
                <Ionicons name="shield-checkmark-outline" size={18} color={Colors.accent} />
                <View>
                  <Text style={s.condLabel}>{tx('Helper Terverifikasi', '인증 헬퍼만', 'Verified Only')}</Text>
                  <Text style={s.condDesc}>{tx('Sudah terverifikasi platform', '플랫폼 인증을 받은 헬퍼', 'Platform certified helpers')}</Text>
                </View>
              </View>
              <View style={[s.condCheck, tempVerified && s.condCheckSel]}>
                {tempVerified && <Ionicons name="checkmark" size={14} color={Colors.white} />}
              </View>
            </TouchableOpacity>

            {/* Experience */}
            <Text style={[s.condSectionLabel, { marginTop: 20 }]}>{tx('Pengalaman', '경력', 'Experience')}</Text>
            <View style={s.expRow}>
              {EXP_LEVELS.map((exp) => {
                const sel = tempExpLevel === exp.key;
                return (
                  <TouchableOpacity
                    key={exp.key}
                    style={[s.expPill, sel && s.expPillSel]}
                    onPress={() => setTempExpLevel(exp.key)}
                    activeOpacity={0.7}
                  >
                    <Text style={[s.expPillText, sel && s.expPillTextSel]}>{exp.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={[s.modalFooter, { marginTop: 24 }]}>
              <TouchableOpacity style={s.resetBtn} onPress={() => { setTempVerified(false); setTempExpLevel('all'); }}>
                <Ionicons name="refresh-outline" size={15} color={Colors.gray} />
                <Text style={s.resetBtnText}>{tx('Reset', '초기화', 'Reset')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.applyBtn}
                onPress={() => { setVerifiedOnly(tempVerified); setExpLevel(tempExpLevel); setShowWorker(false); }}
              >
                <Text style={s.applyBtnText}>{tx('Terapkan', '적용하기', 'Apply')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ════════════════════════════════════════════════════════
          MODAL 4 — 정렬
      ════════════════════════════════════════════════════════ */}
      <Modal visible={showSort} transparent animationType="slide" onRequestClose={() => setShowSort(false)}>
        <View style={s.modalRoot}>
          <Pressable style={s.modalOverlay} onPress={() => setShowSort(false)} />
          <View style={[s.sortSheet, { paddingBottom: insets.bottom + 8 }]}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>{tx('Urutkan', '정렬', 'Sort by')}</Text>
            {SORT_OPTIONS.map((opt) => {
              const active = sortBy === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={s.sortOptionRow}
                  onPress={() => { setSortBy(opt.key); setShowSort(false); }}
                  activeOpacity={0.7}
                >
                  <Text style={[s.sortOptionText, active && s.sortOptionTextActive]}>{opt.label}</Text>
                  {active && <Ionicons name="checkmark" size={18} color={Colors.accent} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>

    </View>
  );
}

// ── Worker Card ───────────────────────────────────────────────────
function WorkerCard({
  worker, onPress, tx,
}: {
  worker: Worker;
  onPress: () => void;
  tx: (id: string, ko: string, en: string) => string;
}) {
  const [favorited, setFavorited] = useState(false);

  return (
    <TouchableOpacity style={s.card} activeOpacity={0.92} onPress={onPress}>
      {/* Avatar col */}
      <View style={s.cardLeft}>
        <View style={s.safetyBadge}>
          <Ionicons name="shield-checkmark" size={9} color={Colors.accent} />
          <Text style={s.safetyText}>{tx('Proteksi', '보호', 'Protected')}</Text>
        </View>
        <View style={s.avatarWrap}>
          {worker.photo
            ? <Image source={{ uri: worker.photo }} style={s.avatar} />
            : <View style={[s.avatar, s.avatarFallback]}><Ionicons name="person" size={22} color={Colors.grayLight} /></View>
          }
          <View style={[s.availDot, { backgroundColor: worker.isAvailable ? Colors.success : Colors.grayLight }]} />
        </View>
      </View>

      {/* Info col */}
      <View style={s.cardInfo}>
        <View style={s.nameRow}>
          <Text style={s.workerName}>{worker.name}</Text>
          {worker.isVerified && <Ionicons name="checkmark-circle" size={14} color={Colors.accent} />}
        </View>
        <View style={s.locationRow}>
          <Ionicons name="location-outline" size={11} color={Colors.grayLight} />
          <Text style={s.locationLabel}>{worker.location}</Text>
          <Text style={s.dot}>·</Text>
          <Ionicons name="briefcase-outline" size={11} color={Colors.grayLight} />
          <Text style={s.locationLabel}>{worker.totalJobs}x</Text>
        </View>
        <View style={s.tagsRow}>
          {(worker.skills ?? []).slice(0, 3).map((tag) => (
            <View key={tag} style={s.skillTag}>
              <Text style={s.skillTagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={s.cardFooter}>
          <View style={s.ratingRow}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={s.ratingVal}>{worker.rating.toFixed(1)}</Text>
            <Text style={s.ratingCount}>({worker.totalJobs})</Text>
          </View>
          <Text style={s.price}>
            Rp {worker.pricePerHour.toLocaleString('id-ID')}
            <Text style={s.priceUnit}>/jam</Text>
          </Text>
        </View>
      </View>

      {/* Heart */}
      <TouchableOpacity
        style={s.heartBtn}
        onPress={(e) => { e.stopPropagation(); setFavorited((f) => !f); }}
      >
        <Ionicons
          name={favorited ? 'heart' : 'heart-outline'}
          size={20}
          color={favorited ? '#EF4444' : Colors.grayLight}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F5F5' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    gap: 10,
  },
  backBtn:      { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  locationRow:  { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 15, fontWeight: '600', color: Colors.dark },
  searchIconBtn:{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },

  // Filter bar
  filterBar: {
    flexDirection: 'row', gap: 8,
    backgroundColor: Colors.white,
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: Radius.pill,
    borderWidth: 1, borderColor: Colors.borderMid,
    backgroundColor: Colors.white,
  },
  filterChipActive:    { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterChipText:      { fontSize: 12, fontWeight: '500', color: Colors.dark },
  filterChipTextActive:{ color: Colors.white, fontWeight: '600' },

  // Sort row
  sortRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: Colors.white,
    marginBottom: 8,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  resultCount:    { fontSize: 13, color: Colors.gray },
  resultCountNum: { fontWeight: '700', color: Colors.dark },
  sortBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: Radius.pill,
    borderWidth: 1, borderColor: Colors.border,
  },
  sortBtnText: { fontSize: 12, color: Colors.gray },

  // List
  list:  { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 32 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 14, color: Colors.grayLight },

  // Worker card
  card: {
    flexDirection: 'row', gap: 12,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border,
    padding: 14, ...Shadow.sm,
  },
  cardLeft:       { alignItems: 'center', gap: 6 },
  safetyBadge:    { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: Colors.accentLight, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  safetyText:     { fontSize: 9, fontWeight: '700', color: Colors.accent },
  avatarWrap:     { position: 'relative' },
  avatar:         { width: 56, height: 56, borderRadius: 28 },
  avatarFallback: { backgroundColor: Colors.section, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  availDot:       { position: 'absolute', bottom: 1, right: 1, width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: Colors.white },
  cardInfo:       { flex: 1 },
  nameRow:        { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  workerName:     { fontSize: 15, fontWeight: '700', color: Colors.darkMid },
  locationRow:    { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6 },
  locationLabel:  { fontSize: 11, color: Colors.grayLight },
  dot:            { fontSize: 11, color: Colors.grayLight },
  tagsRow:        { flexDirection: 'row', gap: 5, flexWrap: 'wrap', marginBottom: 8 },
  skillTag:       { backgroundColor: Colors.section, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  skillTagText:   { fontSize: 11, color: Colors.gray },
  cardFooter:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingRow:      { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingVal:      { fontSize: 13, fontWeight: '600', color: Colors.dark },
  ratingCount:    { fontSize: 11, color: Colors.grayLight },
  price:          { fontSize: 14, fontWeight: '700', color: Colors.accent },
  priceUnit:      { fontSize: 11, fontWeight: '400', color: Colors.gray },
  heartBtn:       { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },

  // Modal base
  modalRoot:    { flex: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 12, paddingHorizontal: 20,
    maxHeight: '85%',
    ...Shadow.lg,
  },
  sortSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 12, paddingHorizontal: 20,
    ...Shadow.lg,
  },
  modalHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center', marginBottom: 20,
  },
  modalHeader: { marginBottom: 16 },
  modalTitle:  { fontSize: 17, fontWeight: '700', color: Colors.dark, marginBottom: 4 },
  modalSub:    { fontSize: 13, color: Colors.grayLight },

  // Activity filter
  actCatSection: { marginBottom: 20 },
  actCatHeader:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  actCatIcon:    { width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  actCatLabel:   { fontSize: 14, fontWeight: '700', color: Colors.dark },
  actPillsRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actPill: {
    paddingHorizontal: 13, paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  actPillSel:      { backgroundColor: Colors.accent, borderColor: Colors.accent },
  actPillDisabled: { opacity: 0.35 },
  actPillText:     { fontSize: 13, color: Colors.dark },
  actPillTextSel:  { color: Colors.white, fontWeight: '600' },

  // Condition filter
  condSectionLabel: { fontSize: 13, fontWeight: '600', color: Colors.grayLight, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  condRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 16,
    borderRadius: Radius.md, marginBottom: 8,
    borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  condRowSel:    { borderColor: Colors.accent, backgroundColor: Colors.accentLight },
  condLabel:     { fontSize: 15, fontWeight: '600', color: Colors.dark, marginBottom: 2 },
  condLabelSel:  { color: Colors.accent },
  condDesc:      { fontSize: 12, color: Colors.gray },
  condCheck: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 1.5, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  condCheckSel: { backgroundColor: Colors.accent, borderColor: Colors.accent },

  // Verified row
  verifiedRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 16,
    borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  verifiedLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },

  // Experience pills
  expRow:        { flexDirection: 'row', gap: 8 },
  expPill: {
    flex: 1, alignItems: 'center',
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  expPillSel:     { backgroundColor: Colors.accent, borderColor: Colors.accent },
  expPillText:    { fontSize: 13, fontWeight: '500', color: Colors.dark },
  expPillTextSel: { color: Colors.white, fontWeight: '700' },

  // Sort options
  sortOptionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  sortOptionText:       { fontSize: 15, color: Colors.dark },
  sortOptionTextActive: { fontWeight: '700', color: Colors.accent },

  // Modal footer
  modalFooter: {
    flexDirection: 'row', gap: 10,
    paddingTop: 16,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  resetBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 13,
    borderRadius: Radius.pill,
    borderWidth: 1, borderColor: Colors.border,
  },
  resetBtnText: { fontSize: 14, color: Colors.gray },
  applyBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 14,
    borderRadius: Radius.pill,
    backgroundColor: Colors.accent,
  },
  applyBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
