/**
 * DriverDetailScreen — 드라이버 상세 & 예약
 * 고객이 드라이버 프로필을 보고 예약하는 페이지
 */
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { W1, W2, W4, W5, W6, W7 } from '../../constants/photos';

// SNS 사진 — 드라이버가 본인 프로필 꾸미는 톤 (워커와 동일 풀)
const GALLERY_PHOTOS: string[] = [W1, W2, W4, W5, W6, W7];
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { useLanguageStore } from '../../store/languageStore';
import { RootStackParamList } from '../../types';
import { MOCK_DRIVERS, DRIVER_SERVICE_META } from '../../constants/mockDrivers';
import { getMonthlyAwardBadge } from '../../constants/monthlyAwards';
import { MvpMiniBadge } from '../../components/common/MonthlyAwardCard';

type Props = NativeStackScreenProps<RootStackParamList, 'DriverDetail'>;

export default function DriverDetailScreen({ navigation, route }: Props) {
  const { driverId } = route.params;
  const { lang }     = useLanguageStore();
  const insets       = useSafeAreaInsets();
  const driver       = MOCK_DRIVERS.find(d => d.id === driverId) ?? MOCK_DRIVERS[0];

  const tx = (id: string, ko: string, en: string) =>
    lang === 'ko' ? ko : lang === 'en' ? en : id;

  const handleBook = () => {
    navigation.navigate('Booking', {
      workerId: driver.id,
      workerName: driver.name,
      workerPhoto: driver.photo,
      pricePerHour: driver.pricePerHour,
      serviceType: 'driver',
      driverServices: driver.services,
      drivableTypes: driver.drivableTypes,
    });
  };

  const driverPhoto = typeof driver.photo === 'string' ? { uri: driver.photo } : driver.photo;
  // 드라이버는 아직 커버 사진 편집 화면이 없어서 미설정 — 흰 배경 (카톡 기본 톤)
  const coverPhoto: string | null = null;

  return (
    <View style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* ── Cover (드라이버가 설정한 사진. 없으면 흰 배경) ── */}
        <View style={s.coverWrap}>
          {coverPhoto ? (
            <Image source={{ uri: coverPhoto }} style={s.coverImage} />
          ) : (
            <View style={[s.coverImage, { backgroundColor: Colors.white }]} />
          )}
          <TouchableOpacity style={[s.backBtn, { top: insets.top + 6 }]} onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('CustomerTabs' as never)}>
            <Ionicons name="chevron-back" size={24} color={Colors.dark} />
          </TouchableOpacity>
          <TouchableOpacity style={[s.shareBtn, { top: insets.top + 6 }]}>
            <Ionicons name="share-outline" size={20} color={Colors.dark} />
          </TouchableOpacity>
        </View>

        {/* ── SNS hero ── */}
        <View style={s.heroSns}>
          <View style={s.avatarRing}>
            <Image source={driverPhoto} style={s.avatarBig} />
            {driver.isAvailable && <View style={s.availStatusDot} />}
          </View>

          <View style={s.nameRow}>
            <Text style={s.heroName}>{driver.firstName}</Text>
            {driver.isVerified && (
              <View style={s.verifyBadge}>
                <Ionicons name="checkmark-circle" size={12} color={Colors.white} />
                <Text style={s.verifyText}>{tx('Verified', '인증', 'Verified')}</Text>
              </View>
            )}
            {getMonthlyAwardBadge(driver.id) && <MvpMiniBadge role="driver" />}
          </View>
          <View style={s.heroMetaRow}>
            <Ionicons name="location-outline" size={12} color={Colors.grayLight} />
            <Text style={s.heroMetaText}>{driver.location}</Text>
          </View>
          <View style={s.heroMetaRow}>
            <Ionicons name="trophy-outline" size={12} color={Colors.grayLight} />
            <Text style={s.heroMetaText}>
              {driver.experienceYears}{tx('thn', '년', 'yr')} {tx('pengalaman', '경력', 'exp')} · {driver.licenseClass}
            </Text>
          </View>

          {/* Verification chips */}
          <View style={s.verifyChipRow}>
            <View style={[s.verifyChip, s.verifyChipOn]}>
              <Ionicons name="card-outline" size={12} color={Colors.accent} />
              <Text style={[s.verifyChipText, s.verifyChipTextOn]}>SIM</Text>
            </View>
            <View style={[s.verifyChip, driver.isVerified && s.verifyChipOn]}>
              <Ionicons name="card-outline" size={12} color={driver.isVerified ? Colors.accent : Colors.grayLight} />
              <Text style={[s.verifyChipText, driver.isVerified && s.verifyChipTextOn]}>KTP</Text>
            </View>
            <View style={[s.verifyChip, s.verifyChipOn]}>
              <Ionicons name="finger-print-outline" size={12} color={Colors.accent} />
              <Text style={[s.verifyChipText, s.verifyChipTextOn]}>본인인증</Text>
            </View>
          </View>
        </View>

        {/* Linka 온도 */}
        <View style={s.tempCard}>
          <View style={{ flex: 1 }}>
            <Text style={s.tempLabel}>
              {tx('Suhu Linka', 'Linka 온도', 'Linka Temperature')}
            </Text>
            <Text style={s.tempBigText}>{driver.temperature.toFixed(1)}°C</Text>
            <Text style={s.tempSub}>
              {driver.totalJobs} {tx('pesanan selesai', '완료 건', 'completed')}
            </Text>
          </View>
          <View style={s.thermometerWrap}>
            <View style={s.thermoBg}>
              <View style={[s.thermoFill, {
                height: `${Math.min(driver.temperature, 100)}%`,
                backgroundColor: driver.temperature > 60 ? '#EF4444' : driver.temperature > 40 ? '#F59E0B' : '#60A5FA'
              }]} />
            </View>
            <View style={s.thermoBulb}>
              <Ionicons name="thermometer" size={18} color={Colors.white} />
            </View>
          </View>
        </View>

        {/* Services */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>
            {tx('Layanan yang Disediakan', '제공 서비스', 'Services Offered')}
          </Text>
          <View style={s.serviceGrid}>
            {driver.services.map(svc => {
              const meta = DRIVER_SERVICE_META[svc];
              const label =
                svc === 'designated' ? tx('Sopir Pengganti', '대리운전', 'Designated')
                : svc === 'daily'    ? tx('Sopir Harian', '일일 기사', 'Daily')
                : svc === 'hourly'   ? tx('Sopir Per Jam', '시간제 기사', 'Hourly')
                : svc === 'commute'  ? tx('Sopir Rutin', '출퇴근 기사', 'Commute')
                : svc === 'airport'  ? tx('Antar Bandara', '공항 기사', 'Airport')
                : svc === 'intercity'? tx('Antar Kota', '도시간 이동', 'Intercity')
                : tx('Sopir Acara', '행사 기사', 'Event');
              return (
                <View key={svc} style={[s.serviceCard, { backgroundColor: meta.bg, borderColor: meta.color + '40' }]}>
                  <Ionicons name={meta.icon as any} size={14} color={meta.color} />
                  <Text style={[s.serviceLabel, { color: meta.color }]}>{label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* 운전 능력 */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>
            {tx('Kemampuan Mengemudi', '운전 능력', 'Driving Skills')}
          </Text>

          <View style={s.skillRow}>
            <Text style={s.skillLabel}>{tx('Tipe Kendaraan', '가능 차종', 'Vehicle Types')}</Text>
            <View style={s.skillChips}>
              {driver.drivableTypes.map(t => (
                <View key={t} style={s.skillChip}>
                  <Text style={s.skillChipText}>{t.replace('_', ' ').toUpperCase()}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={s.skillRow}>
            <Text style={s.skillLabel}>{tx('Transmisi', '변속기', 'Transmission')}</Text>
            <View style={s.skillChips}>
              <View style={s.skillChip}>
                <Text style={s.skillChipText}>
                  {driver.transmission === 'auto' ? tx('Matic', '오토', 'Auto')
                    : driver.transmission === 'manual' ? tx('Manual', '수동', 'Manual')
                    : tx('Matic + Manual', '오토 + 수동', 'Both')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Gallery — SNS photos */}
        <View style={s.section}>
          <View style={s.galleryHeader}>
            <Text style={s.sectionTitle}>{tx('Foto', '사진', 'Photos')}</Text>
            <Text style={s.galleryCount}>{GALLERY_PHOTOS.length}</Text>
          </View>
          <View style={s.galleryGrid}>
            {GALLERY_PHOTOS.map((uri, i) => (
              <View key={i} style={s.galleryCell}>
                <Image source={{ uri }} style={s.galleryImage} />
              </View>
            ))}
          </View>
        </View>

        {/* Info */}
        <View style={s.infoBox}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.accent} />
          <Text style={s.infoText}>
            {tx(
              'Semua sopir sudah terverifikasi SIM dan bersih dari pelanggaran lalu lintas.',
              '모든 드라이버는 SIM 인증 완료 및 교통 위반 기록이 없는 분들입니다.',
              'All drivers are SIM-verified with clean traffic records.'
            )}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom booking bar */}
      <View style={[s.bottomBar, { paddingBottom: insets.bottom + 14 }]}>
        <View style={{ flex: 1 }}>
          <Text style={s.priceSub}>{tx('Tarif', '요금', 'Rate')}</Text>
          <Text style={s.priceBig}>Rp {driver.pricePerHour.toLocaleString()}<Text style={s.priceUnit}>/{tx('jam', '시간', 'hr')}</Text></Text>
        </View>
        <TouchableOpacity
          style={[s.bookBtn, !driver.isAvailable && s.bookBtnDisabled]}
          onPress={handleBook}
          disabled={!driver.isAvailable}
          activeOpacity={0.85}
        >
          <Text style={s.bookBtnText}>
            {driver.isAvailable
              ? tx('Pesan Sekarang', '예약하기', 'Book Now')
              : tx('Sedang Sibuk', '운행중', 'Unavailable')}
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

  // Cover
  coverWrap:    { width: '100%', height: 180, position: 'relative', backgroundColor: Colors.accentLight },
  coverImage:   { width: '100%', height: '100%' },
  coverOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.18)' },

  // SNS hero
  heroSns: {
    paddingHorizontal: 20, paddingBottom: 18,
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
    marginBottom: 12,
  },
  avatarBig: { width: 104, height: 104, borderRadius: 52 },
  availStatusDot: {
    position: 'absolute', bottom: 6, right: 6,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: Colors.success,
    borderWidth: 3, borderColor: Colors.white,
  },

  verifyChipRow: { flexDirection: 'row', gap: 6, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' },
  verifyChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.section,
  },
  verifyChipOn:      { backgroundColor: Colors.accentLight, borderColor: Colors.accent + '40' },
  verifyChipText:    { fontSize: 11, fontWeight: '600', color: Colors.grayLight },
  verifyChipTextOn:  { color: Colors.accent },

  // legacy
  hero: {
    paddingHorizontal: 20, paddingBottom: 20,
    flexDirection: 'row', gap: 16, alignItems: 'flex-start',
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  heroPhoto: { width: 88, height: 88, borderRadius: 44 },
  nameRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  heroName:  { fontSize: 22, fontWeight: '800', color: Colors.dark },
  verifyBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.accent, borderRadius: 10,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  verifyText: { fontSize: 10, fontWeight: '700', color: Colors.white },
  heroMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
  heroMetaText: { fontSize: 12, color: Colors.gray },

  tempCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginTop: 16,
    backgroundColor: '#FFF7ED', borderRadius: Radius.lg,
    padding: 16, borderWidth: 1, borderColor: '#F59E0B30',
  },
  tempLabel:   { fontSize: 12, fontWeight: '600', color: '#B45309' },
  tempBigText: { fontSize: 32, fontWeight: '800', color: '#F59E0B', lineHeight: 38 },
  tempSub:     { fontSize: 11, color: '#92400E', marginTop: 2 },
  thermometerWrap: { alignItems: 'center', marginLeft: 12 },
  thermoBg: {
    width: 14, height: 70, borderRadius: 7,
    backgroundColor: '#FEF3C7', overflow: 'hidden',
    justifyContent: 'flex-end',
    borderWidth: 1, borderColor: '#F59E0B40',
  },
  thermoFill: { width: '100%' },
  thermoBulb: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#F59E0B',
    alignItems: 'center', justifyContent: 'center',
    marginTop: -6,
  },

  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.dark, marginBottom: 12 },

  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  serviceCard: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: Radius.md, borderWidth: 1,
  },
  serviceEmoji: { fontSize: 14 },
  serviceLabel: { fontSize: 12, fontWeight: '700' },

  // Gallery
  galleryHeader: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 12 },
  galleryCount:  { fontSize: 12, color: Colors.grayLight, fontWeight: '500' },
  galleryGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  galleryCell:   { width: '32%', aspectRatio: 1, borderRadius: 10, overflow: 'hidden', backgroundColor: Colors.section },
  galleryImage:  { width: '100%', height: '100%' },

  skillRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  skillLabel: { fontSize: 12, color: Colors.gray, width: 100 },
  skillChips: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  skillChip:  { backgroundColor: Colors.section, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  skillChipText: { fontSize: 11, fontWeight: '600', color: Colors.dark },

  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    marginHorizontal: 20, marginTop: 24,
    backgroundColor: Colors.accentLight, borderRadius: Radius.md,
    padding: 14,
  },
  infoText: { flex: 1, fontSize: 12, color: Colors.dark, lineHeight: 18 },

  bottomBar: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingTop: 14,
    backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  priceSub:  { fontSize: 11, color: Colors.grayLight },
  priceBig:  { fontSize: 18, fontWeight: '800', color: Colors.dark },
  priceUnit: { fontSize: 12, fontWeight: '500', color: Colors.grayLight },
  bookBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.pill,
    paddingHorizontal: 28, paddingVertical: 14,
  },
  bookBtnDisabled: { backgroundColor: Colors.grayLight },
  bookBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});
