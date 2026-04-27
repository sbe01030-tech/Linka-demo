/**
 * DriverBoardScreen — 드라이버 목록 게시판
 * 고객 차량을 대신 운전해줄 드라이버를 찾는 페이지
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { useLanguageStore } from '../../store/languageStore';
import { RootStackParamList, DriverServiceKind } from '../../types';
import { MOCK_DRIVERS, DRIVER_SERVICE_META } from '../../constants/mockDrivers';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type FilterId = 'all' | DriverServiceKind;

export default function DriverBoardScreen() {
  const navigation = useNavigation<Nav>();
  const { lang }   = useLanguageStore();
  const insets     = useSafeAreaInsets();
  const [filter, setFilter]         = useState<FilterId>('all');
  const [refreshing, setRefreshing] = useState(false);

  const FILTERS: { id: FilterId; label: string }[] = [
    { id: 'all',        label: lang === 'ko' ? '전체' : lang === 'en' ? 'All' : 'Semua' },
    { id: 'designated', label: lang === 'ko' ? '대리운전' : lang === 'en' ? 'Designated' : 'Pengganti' },
    { id: 'daily',      label: lang === 'ko' ? '일일' : lang === 'en' ? 'Daily' : 'Harian' },
    { id: 'hourly',     label: lang === 'ko' ? '시간제' : lang === 'en' ? 'Hourly' : 'Per Jam' },
    { id: 'commute',    label: lang === 'ko' ? '출퇴근' : lang === 'en' ? 'Commute' : 'Rutin' },
    { id: 'airport',    label: lang === 'ko' ? '공항' : lang === 'en' ? 'Airport' : 'Bandara' },
    { id: 'event',      label: lang === 'ko' ? '행사' : lang === 'en' ? 'Event' : 'Acara' },
  ];

  const filtered = filter === 'all'
    ? MOCK_DRIVERS
    : MOCK_DRIVERS.filter(d => d.services.includes(filter));

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
          <Text style={s.headerTitle}>
            {lang === 'ko' ? '드라이버 찾기' : lang === 'en' ? 'Find a Driver' : 'Cari Sopir'}
          </Text>
          <Text style={s.headerSub}>
            {lang === 'ko' ? '내 차를 안전하게 운전해드려요' : lang === 'en' ? 'Safe driving for your car' : 'Mengemudi mobil Anda dengan aman'}
          </Text>
        </View>
      </View>

      {/* 필터 */}
      <View style={s.filterWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f.id}
              style={[s.filterChip, filter === f.id && s.filterChipActive]}
              onPress={() => setFilter(f.id)}
              activeOpacity={0.75}
            >
              <Text style={[s.filterText, filter === f.id && s.filterTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 리스트 */}
      <ScrollView
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} />}
      >
        <Text style={s.countText}>
          {filtered.length} {lang === 'ko' ? '명' : lang === 'en' ? 'drivers' : 'sopir'}
        </Text>

        {filtered.map(driver => (
          <TouchableOpacity
            key={driver.id}
            style={s.card}
            onPress={() => navigation.navigate('DriverDetail', { driverId: driver.id })}
            activeOpacity={0.82}
          >
            <Image source={typeof driver.photo === "string" ? { uri: driver.photo } : driver.photo} style={s.photo} />

            <View style={{ flex: 1 }}>
              <View style={s.nameRow}>
                <Text style={s.name} numberOfLines={1}>{driver.firstName}</Text>
                {driver.isVerified && <Ionicons name="checkmark-circle" size={13} color={Colors.accent} />}
                <View style={[s.availDot, { backgroundColor: driver.isAvailable ? Colors.success : Colors.grayLight }]} />
              </View>

              <View style={s.metaRow}>
                <Ionicons name="location-outline" size={11} color={Colors.grayLight} />
                <Text style={s.metaText}>{driver.location}</Text>
                <Text style={s.metaDot}>·</Text>
                <Ionicons name="trophy-outline" size={11} color={Colors.grayLight} />
                <Text style={s.metaText}>
                  {driver.experienceYears}{lang === 'ko' ? '년' : lang === 'en' ? 'y' : 'thn'}
                </Text>
              </View>

              <View style={s.serviceRow}>
                {driver.services.slice(0, 3).map(svc => {
                  const meta = DRIVER_SERVICE_META[svc];
                  return (
                    <View key={svc} style={[s.serviceChip, { backgroundColor: meta.bg }]}>
                      <Ionicons name={meta.icon as any} size={11} color={meta.color} />
                    </View>
                  );
                })}
              </View>

              <View style={s.bottomRow}>
                <View style={s.tempWrap}>
                  <Ionicons name="thermometer" size={12} color="#F59E0B" />
                  <Text style={s.tempText}>{driver.temperature.toFixed(1)}°</Text>
                </View>
                <Text style={s.priceText}>Rp {(driver.pricePerHour / 1000).toFixed(0)}rb/{lang === 'ko' ? '시간' : 'jam'}</Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={16} color={Colors.grayLight} />
          </TouchableOpacity>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.section },

  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 20, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.dark },
  headerSub:   { fontSize: 12, color: Colors.grayLight, marginTop: 2 },

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

  list:      { paddingHorizontal: 16, paddingTop: 12, gap: 10 },
  countText: { fontSize: 12, color: Colors.grayLight, marginBottom: 4 },

  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    padding: 12,
    ...Shadow.sm,
  },
  photo: { width: 60, height: 60, borderRadius: 30 },

  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 },
  name:    { fontSize: 14, fontWeight: '700', color: Colors.dark, maxWidth: 120 },
  availDot: { width: 7, height: 7, borderRadius: 4, marginLeft: 'auto' },

  metaRow:  { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6 },
  metaText: { fontSize: 11, color: Colors.gray },
  metaDot:  { fontSize: 11, color: Colors.grayLight, marginHorizontal: 2 },

  serviceRow:  { flexDirection: 'row', gap: 4, marginBottom: 6 },
  serviceChip: {
    paddingHorizontal: 7, paddingVertical: 3,
    borderRadius: 6,
  },
  serviceChipText: { fontSize: 11, fontWeight: '600' },

  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tempWrap:  { flexDirection: 'row', alignItems: 'center', gap: 3 },
  tempText:  { fontSize: 12, fontWeight: '700', color: '#F59E0B' },
  priceText: { fontSize: 12, fontWeight: '700', color: Colors.accent },
});
