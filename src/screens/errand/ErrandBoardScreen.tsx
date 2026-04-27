/**
 * ErrandBoardScreen — 심부름 요청 게시판
 * 고객이 올린 요청을 헬퍼가 보고 수락하는 역방향 마켓플레이스
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { RootStackParamList, ErrandRequest } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CATEGORY_LABELS_BY_LANG = (lang: string): Record<ErrandRequest['category'], string> => ({
  shopping:  lang === 'ko' ? '장보기·쇼핑' : lang === 'en' ? 'Shopping' : 'Belanja·Shopping',
  delivery:  lang === 'ko' ? '배달·수령'   : lang === 'en' ? 'Delivery' : 'Antar·Terima',
  queuing:   lang === 'ko' ? '줄서기·대리' : lang === 'en' ? 'Queuing'  : 'Antre·Wakili',
  other:     lang === 'ko' ? '기타'        : lang === 'en' ? 'Other'    : 'Lainnya',
});

const CATEGORY_ICONS: Record<ErrandRequest['category'], string> = {
  shopping: 'cart-outline',
  delivery: 'bicycle-outline',
  queuing:  'time-outline',
  other:    'ellipsis-horizontal-outline',
};

const CATEGORY_COLORS: Record<ErrandRequest['category'], string> = {
  shopping: '#FFF3C0',
  delivery: '#CCE8FF',
  queuing:  '#FFD8EA',
  other:    '#EAEAEF',
};

// ── 목업 데이터 ───────────────────────────────────────────────────
const MOCK_ERRANDS: ErrandRequest[] = [
  {
    id: 'e1',
    title: 'Tolong belikan barang di Indomaret dekat stasiun',
    description: 'Aqua 1.5L 2 botol, roti tawar gandum 1 bungkus, mie instan goreng 2 bungkus.\nLagi sakit jadi tidak bisa keluar rumah.',
    location: 'Jakarta Selatan, Kebayoran Baru',
    budget: 15000,
    category: 'shopping',
    status: 'open',
    authorId: 'u1',
    authorName: 'Anonim',
    createdAt: '10 menit lalu',
    deadline: 'Hari ini jam 3 sore',
  },
  {
    id: 'e2',
    title: 'Ambilkan paket di Alfamart, tidak bisa keluar!',
    description: 'Paket J&T ada di Alfamart dekat rumah. Ukurannya kecil dan tidak berat. Bisa langsung diantar ke depan pintu.',
    location: 'Jakarta Timur, Duren Sawit',
    budget: 20000,
    category: 'delivery',
    status: 'open',
    authorId: 'u2',
    authorName: 'Anonim',
    createdAt: '25 menit lalu',
  },
  {
    id: 'e3',
    title: 'Cari orang untuk antre di restoran populer',
    description: 'Restoran viral di SCBD, biasanya antrenya 1,5–2 jam. Nanti saya kabari kalau sudah mau tiba. Ongkos + tip ada.',
    location: 'Jakarta Selatan, SCBD',
    budget: 50000,
    category: 'queuing',
    status: 'open',
    authorId: 'u3',
    authorName: 'Anonim',
    createdAt: '1 jam lalu',
    deadline: 'Hari ini jam 11 pagi',
  },
  {
    id: 'e4',
    title: 'Ambilkan obat resep di apotek dekat rumah',
    description: 'Nanti saya kirim foto resepnya. Apotek ada di dekat komplek, tidak jauh. Ongkos transport + uang lelah ditanggung.',
    location: 'Jakarta Barat, Kemanggisan',
    budget: 30000,
    category: 'other',
    status: 'open',
    authorId: 'u4',
    authorName: 'Anonim',
    createdAt: '2 jam lalu',
  },
];

// ── 카테고리 필터 ──────────────────────────────────────────────────
const FILTERS_BY_LANG = (lang: string): { id: ErrandRequest['category'] | 'all'; label: string }[] => ([
  { id: 'all',      label: lang === 'ko' ? '전체'   : lang === 'en' ? 'All'      : 'Semua' },
  { id: 'shopping', label: lang === 'ko' ? '장보기' : lang === 'en' ? 'Shopping' : 'Belanja' },
  { id: 'delivery', label: lang === 'ko' ? '배달'   : lang === 'en' ? 'Delivery' : 'Antar·Terima' },
  { id: 'queuing',  label: lang === 'ko' ? '줄서기' : lang === 'en' ? 'Queuing'  : 'Antre' },
  { id: 'other',    label: lang === 'ko' ? '기타'   : lang === 'en' ? 'Other'    : 'Lainnya' },
]);

// ── 요청 카드 ──────────────────────────────────────────────────────
function ErrandCard({ item, onPress, lang }: { item: ErrandRequest; onPress: () => void; lang: string }) {
  const labels = CATEGORY_LABELS_BY_LANG(lang);
  return (
    <TouchableOpacity style={ec.card} onPress={onPress} activeOpacity={0.82}>
      <View style={ec.cardTop}>
        <View style={[ec.catBadge, { backgroundColor: CATEGORY_COLORS[item.category] }]}>
          <Ionicons name={CATEGORY_ICONS[item.category] as any} size={12} color={Colors.dark} />
          <Text style={ec.catLabel}>{labels[item.category]}</Text>
        </View>
        <Text style={ec.time}>{item.createdAt}</Text>
      </View>

      <Text style={ec.title} numberOfLines={2}>{item.title}</Text>
      <Text style={ec.desc} numberOfLines={2}>{item.description}</Text>

      <View style={ec.cardBottom}>
        <View style={ec.locationRow}>
          <Ionicons name="location-outline" size={12} color={Colors.grayLight} />
          <Text style={ec.location}>{item.location}</Text>
        </View>
        {item.deadline && (
          <View style={ec.deadlineRow}>
            <Ionicons name="alarm-outline" size={12} color="#F97316" />
            <Text style={ec.deadline}>{item.deadline}</Text>
          </View>
        )}
        <View style={ec.budgetBadge}>
          <Text style={ec.budget}>Rp {item.budget.toLocaleString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const ec = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 8,
    ...Shadow.sm,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
  },
  catLabel:  { fontSize: 11, fontWeight: '600', color: Colors.dark },
  time:      { fontSize: 11, color: Colors.grayLight },
  title:     { fontSize: 15, fontWeight: '700', color: Colors.dark, lineHeight: 21 },
  desc:      { fontSize: 13, color: Colors.gray, lineHeight: 19 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, flex: 1 },
  location:  { fontSize: 11, color: Colors.grayLight },
  deadlineRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  deadline:  { fontSize: 11, color: '#F97316', fontWeight: '600' },
  budgetBadge: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 10,
  },
  budget: { fontSize: 12, fontWeight: '700', color: Colors.accent },
});

// ── 메인 ──────────────────────────────────────────────────────────
export default function ErrandBoardScreen() {
  const navigation = useNavigation<Nav>();
  const { user }   = useAuthStore();
  const insets     = useSafeAreaInsets();
  const { lang }   = useLanguageStore();
  const tx = (ko: string, en: string, id: string) => lang === 'ko' ? ko : lang === 'en' ? en : id;
  const FILTERS = FILTERS_BY_LANG(lang);
  const [filter,   setFilter]   = useState<ErrandRequest['category'] | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const isHelper = user?.role === 'helper' || user?.role === 'tutor';

  const filtered = filter === 'all'
    ? MOCK_ERRANDS
    : MOCK_ERRANDS.filter(e => e.category === filter);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <View style={s.root}>
      {/* 헤더 */}
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>{tx('심부름 요청', 'Errand Requests', 'Permintaan Jasa')}</Text>
          <Text style={s.headerSub}>{tx('고객이 올린 심부름을 수락해보세요', 'Accept errands posted by customers', 'Terima permintaan dari pelanggan')}</Text>
        </View>
        {!isHelper && (
          <TouchableOpacity
            style={s.postBtn}
            onPress={() => navigation.navigate('ErrandCreate')}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={18} color={Colors.white} />
            <Text style={s.postBtnText}>{tx('요청하기', 'Post', 'Buat')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 필터 탭 */}
      <View style={s.filterWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filterRow}
        >
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f.id}
              style={[s.filterChip, filter === f.id && s.filterChipActive]}
              onPress={() => setFilter(f.id)}
              activeOpacity={0.75}
            >
              <Text style={[s.filterText, filter === f.id && s.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 요청 목록 */}
      <ScrollView
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} />}
      >
        <Text style={s.countText}>
          {tx(`요청 ${filtered.length}건`, `${filtered.length} requests`, `${filtered.length} permintaan`)}
        </Text>
        {filtered.map(item => (
          <ErrandCard
            key={item.id}
            item={item}
            lang={lang}
            onPress={() => navigation.navigate('ErrandDetail', { errandId: item.id })}
          />
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* 고객 플로팅 버튼 */}
      {!isHelper && (
        <TouchableOpacity
          style={s.fab}
          onPress={() => navigation.navigate('ErrandCreate')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={24} color={Colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.section },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: 20, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.dark },
  headerSub:   { fontSize: 12, color: Colors.grayLight, marginTop: 2 },
  postBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.accent,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: Radius.pill,
  },
  postBtnText: { fontSize: 13, fontWeight: '700', color: Colors.white },

  filterWrap: {
    height: 56,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  filterRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8, alignItems: 'center' },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1.2, borderColor: Colors.borderMid,
    backgroundColor: Colors.white,
  },
  filterChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterText:       { fontSize: 13, fontWeight: '500', color: Colors.gray },
  filterTextActive: { color: Colors.white, fontWeight: '700' },

  list:      { paddingHorizontal: 16, gap: 10 },
  countText: { fontSize: 12, color: Colors.grayLight, marginBottom: 4 },

  fab: {
    position: 'absolute', bottom: 24, right: 20,
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 8,
  },
});
