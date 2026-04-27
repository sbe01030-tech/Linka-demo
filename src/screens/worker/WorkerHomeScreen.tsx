import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Switch,
  TouchableOpacity, Image, Alert,
} from 'react-native';
import { C1, C2 } from '../../constants/photos';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';

// ── Mock order requests ─────────────────────────────────────────
const MOCK_REQUESTS = [
  {
    id: 'r1',
    customerName: 'Bunda Wulandari',
    customerPhoto: C1,
    date: '2026-04-16',
    startTime: '09:00',
    duration: 4,
    address: 'Jl. Kemang Raya No.12, Jakarta Selatan',
    totalPrice: 120000,
    depositAmount: 36000,
    services: ['Masak', 'Beberes'],
    notes: 'Tolong fokus di dapur dan kamar mandi ya',
  },
  {
    id: 'r2',
    customerName: 'Bunda Indah',
    customerPhoto: C2,
    date: '2026-04-16',
    startTime: '14:00',
    duration: 3,
    address: 'Jl. Fatmawati No.8, Jakarta Selatan',
    totalPrice: 90000,
    depositAmount: 27000,
    services: ['Bersih-bersih', 'Setrika'],
    notes: '',
  },
];

// ── Today's confirmed schedule ──────────────────────────────────
const MOCK_SCHEDULE = [
  { id: 's1', time: '09:00–13:00', customer: 'Bunda Wulandari', service: 'Masak + Beberes', done: true },
  { id: 's2', time: '14:00–17:00', customer: 'Bunda Indah',     service: 'Bersih-bersih',   done: false },
];

export default function WorkerHomeScreen() {
  const { user }  = useAuthStore();
  const { t, lang } = useLanguageStore();
  const insets = useSafeAreaInsets();
  const [isOnline, setIsOnline] = useState(true);
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const firstName = user?.name?.split(' ')[0] ?? '';
  const isDriver  = user?.role === 'driver';

  return (
    <ScrollView
      style={s.root}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[0]}
    >
      {/* ── Sticky header ── */}
      <View style={[s.header, { paddingTop: insets.top + 15 }]}>
        <View style={s.headerTop}>
          <View style={s.headerLeft}>
            <View style={[s.artBadge, isDriver && { backgroundColor: '#3B82F6' }]}>
              <Ionicons name={isDriver ? 'car' : 'home'} size={11} color={Colors.white} />
              <Text style={s.artBadgeText}>{isDriver ? 'DRIVER' : 'ART'}</Text>
            </View>
            <View>
              <Text style={s.greeting}>Halo, {firstName}</Text>
              <Text style={s.subGreeting}>
                {isDriver
                  ? (lang === 'ko' ? '오늘도 안전운전 부탁드려요' : lang === 'en' ? 'Drive safely today' : 'Selamat berkendara aman hari ini')
                  : t.workerHome.readyHelper}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={s.notifBtn}
            onPress={() =>
              Alert.alert(
                lang === 'ko' ? '알림' : lang === 'en' ? 'Notifications' : 'Notifikasi',
                lang === 'ko' ? '새 알림이 없습니다.' : lang === 'en' ? 'No new notifications.' : 'Tidak ada notifikasi baru.',
                [{ text: 'OK' }],
              )
            }
          >
            <Ionicons name="notifications-outline" size={22} color={Colors.grayLight} />
            <View style={s.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Online toggle ── */}
      <View style={s.toggleWrap}>
        <View style={[s.toggleCard, isOnline && s.toggleCardOnline]}>
          <View style={s.toggleLeft}>
            <View style={[s.statusPulse, isOnline && s.statusPulseOn]}>
              <View style={[s.statusDot, { backgroundColor: isOnline ? Colors.accent : Colors.grayLight }]} />
            </View>
            <View>
              <Text style={s.toggleTitle}>
                {isOnline ? t.workerHome.online : t.workerHome.offline}
              </Text>
              <Text style={s.toggleSub}>
                {isOnline ? t.workerHome.onlineDesc : t.workerHome.offlineDesc}
              </Text>
            </View>
          </View>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: Colors.border, true: Colors.accent + '50' }}
            thumbColor={isOnline ? Colors.accent : Colors.grayLight}
          />
        </View>
      </View>

      {/* ── Earnings hero card ── */}
      <View style={s.heroCard}>
        <View style={s.heroLeft}>
          <Text style={s.heroLabel}>{t.workerHome.todayEarnings}</Text>
          <Text style={s.heroValue}>Rp 210.000</Text>
          <View style={s.heroTrend}>
            <Ionicons name="trending-up" size={12} color="rgba(255,255,255,0.8)" />
            <Text style={s.heroTrendText}>+Rp 30rb vs kemarin</Text>
          </View>
        </View>
        <View style={s.heroRight}>
          <View style={s.heroStat}>
            <Text style={s.heroStatValue}>2</Text>
            <Text style={s.heroStatLabel}>{t.workerHome.todayJobs}</Text>
          </View>
          <View style={s.heroStatDivider} />
          <View style={s.heroStat}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={s.heroStatValue}>{user?.rating ?? '4.8'}</Text>
            </View>
            <Text style={s.heroStatLabel}>{t.workerHome.rating}</Text>
          </View>
        </View>
      </View>

      {/* ── Today's schedule ── */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>{t.workerHome.scheduleTitle}</Text>
        <View style={s.scheduleCard}>
          {MOCK_SCHEDULE.map((item, i) => (
            <View
              key={item.id}
              style={[
                s.scheduleRow,
                i < MOCK_SCHEDULE.length - 1 && s.scheduleRowBorder,
              ]}
            >
              <View style={[s.scheduleTimeBadge, item.done && s.scheduleTimeDone]}>
                <Text style={[s.scheduleTime, item.done && s.scheduleTimeDoneText]}>
                  {item.time}
                </Text>
              </View>
              <View style={s.scheduleInfo}>
                <Text style={s.scheduleCustomer}>{item.customer}</Text>
                <Text style={s.scheduleService}>{item.service}</Text>
              </View>
              <Ionicons
                name={item.done ? 'checkmark-circle' : 'time-outline'}
                size={20}
                color={item.done ? Colors.success : Colors.grayLight}
              />
            </View>
          ))}
        </View>
      </View>

      {/* ── Incoming requests ── */}
      <View style={s.section}>
        <View style={s.sectionHeaderRow}>
          <Text style={s.sectionTitle}>{t.workerHome.incomingRequests}</Text>
          {isOnline && (
            <View style={s.badge}>
              <Text style={s.badgeText}>{requests.length}</Text>
            </View>
          )}
        </View>

        {isOnline ? (
          requests.map((req) => (
            <View key={req.id} style={s.requestCard}>
              {/* Customer row */}
              <View style={s.reqTop}>
                <Image source={{ uri: req.customerPhoto }} style={s.reqAvatar} />
                <View style={{ flex: 1 }}>
                  <Text style={s.reqName}>{req.customerName}</Text>
                  <Text style={s.reqMeta}>
                    {req.date} · {req.startTime} · {req.duration} {t.workerHome.hours}
                  </Text>
                </View>
                <Text style={s.reqPrice}>
                  Rp {(req.totalPrice / 1000).toFixed(0)}rb
                </Text>
              </View>

              {/* Service tags */}
              <View style={s.reqTagsRow}>
                {req.services.map((svc) => (
                  <View key={svc} style={s.reqTag}>
                    <Text style={s.reqTagText}>{svc}</Text>
                  </View>
                ))}
              </View>

              {/* Details */}
              <View style={s.reqDetails}>
                <View style={s.detailRow}>
                  <Ionicons name="location-outline" size={13} color={Colors.grayLight} />
                  <Text style={s.detailText} numberOfLines={1}>{req.address}</Text>
                </View>
                {req.notes ? (
                  <View style={s.detailRow}>
                    <Ionicons name="chatbubble-ellipses-outline" size={13} color={Colors.grayLight} />
                    <Text style={s.detailText}>{req.notes}</Text>
                  </View>
                ) : null}
              </View>

              {/* Deposit info */}
              <View style={s.depositInfo}>
                <Ionicons name="shield-checkmark-outline" size={12} color={Colors.accent} />
                <Text style={s.depositText}>
                  DP escrow Rp {req.depositAmount.toLocaleString('id-ID')} sudah ditahan
                </Text>
              </View>

              {/* Actions */}
              <View style={s.reqActions}>
                <TouchableOpacity
                  style={s.btnSecondary}
                  activeOpacity={0.8}
                  onPress={() =>
                    Alert.alert(
                      lang === 'ko' ? '요청 거절' : lang === 'en' ? 'Reject Request' : 'Tolak Permintaan',
                      lang === 'ko'
                        ? `${req.customerName}의 요청을 거절하시겠습니까?`
                        : lang === 'en'
                        ? `Reject ${req.customerName}'s request?`
                        : `Tolak permintaan dari ${req.customerName}?`,
                      [
                        { text: lang === 'ko' ? '아니오' : lang === 'en' ? 'No' : 'Tidak', style: 'cancel' },
                        {
                          text: lang === 'ko' ? '거절' : lang === 'en' ? 'Reject' : 'Tolak',
                          style: 'destructive',
                          onPress: () => setRequests((prev) => prev.filter((r) => r.id !== req.id)),
                        },
                      ],
                    )
                  }
                >
                  <Text style={s.btnSecondaryText}>{t.workerHome.reject}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.btnPrimary}
                  activeOpacity={0.85}
                  onPress={() =>
                    Alert.alert(
                      lang === 'ko' ? '요청 수락' : lang === 'en' ? 'Request Accepted' : 'Permintaan Diterima',
                      lang === 'ko'
                        ? `${req.customerName}의 요청을 수락했습니다!`
                        : lang === 'en'
                        ? `You accepted ${req.customerName}'s request!`
                        : `Permintaan dari ${req.customerName} diterima!`,
                      [
                        {
                          text: 'OK',
                          onPress: () =>
                            setRequests((prev) => prev.filter((r) => r.id !== req.id)),
                        },
                      ],
                    )
                  }
                >
                  <Ionicons name="checkmark" size={15} color={Colors.white} />
                  <Text style={s.btnPrimaryText}>{t.workerHome.accept}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={s.offlineCard}>
            <Ionicons name="moon-outline" size={36} color={Colors.grayLight} />
            <Text style={s.offlineText}>{t.workerHome.goOnline}</Text>
          </View>
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const AMBER = Colors.accent;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F5F5' },

  // ── Header ──
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  artBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: AMBER,
    borderRadius: Radius.pill,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  artBadgeText: { fontSize: 11, fontWeight: '800', color: Colors.white },
  greeting:    { fontSize: 18, fontWeight: '700', color: Colors.dark },
  subGreeting: { fontSize: 12, color: Colors.gray, marginTop: 1 },
  notifBtn: {
    width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute', top: 7, right: 7,
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: Colors.danger,
    borderWidth: 1.5, borderColor: Colors.white,
  },

  // ── Online toggle ──
  toggleWrap: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 },
  toggleCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: 16, paddingVertical: 14,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  toggleCardOnline: { borderColor: Colors.accent + '40', backgroundColor: Colors.accentLight },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusPulse: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.section,
  },
  statusPulseOn: { backgroundColor: Colors.accent + '20' },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  toggleTitle: { fontSize: 14, fontWeight: '700', color: Colors.dark },
  toggleSub:   { fontSize: 12, color: Colors.gray, marginTop: 1 },

  // ── Earnings hero ──
  heroCard: {
    marginHorizontal: 16, marginTop: 10,
    backgroundColor: AMBER,
    borderRadius: Radius.xl,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.md,
  },
  heroLeft: { flex: 1 },
  heroLabel: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.75)', marginBottom: 4 },
  heroValue: { fontSize: 28, fontWeight: '800', color: Colors.white, letterSpacing: -0.5 },
  heroTrend: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  heroTrendText: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  heroRight: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    paddingLeft: 16,
    borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.3)',
  },
  heroStat:       { alignItems: 'center', gap: 3 },
  heroStatValue:  { fontSize: 16, fontWeight: '700', color: Colors.white },
  heroStatLabel:  { fontSize: 10, color: 'rgba(255,255,255,0.7)' },
  heroStatDivider:{ width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.3)' },

  // ── Sections ──
  section: { paddingHorizontal: 16, paddingTop: 20, gap: 12 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.dark },
  badge: {
    backgroundColor: AMBER,
    borderRadius: Radius.pill, width: 22, height: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: Colors.white },

  // ── Schedule ──
  scheduleCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden',
  },
  scheduleRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 14, paddingVertical: 13,
  },
  scheduleRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  scheduleTimeBadge: {
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.sm,
    paddingHorizontal: 8, paddingVertical: 4,
    minWidth: 104, alignItems: 'center',
  },
  scheduleTimeDone:    { backgroundColor: Colors.section },
  scheduleTime:        { fontSize: 11, fontWeight: '700', color: Colors.accent },
  scheduleTimeDoneText:{ color: Colors.grayLight },
  scheduleInfo:    { flex: 1 },
  scheduleCustomer:{ fontSize: 13, fontWeight: '600', color: Colors.dark },
  scheduleService: { fontSize: 11, color: Colors.gray, marginTop: 2 },

  // ── Request card ──
  requestCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border,
    padding: 16, ...Shadow.sm,
  },
  reqTop:    { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  reqAvatar: { width: 46, height: 46, borderRadius: 23 },
  reqName:   { fontSize: 14, fontWeight: '700', color: Colors.darkMid, marginBottom: 3 },
  reqMeta:   { fontSize: 12, color: Colors.grayLight },
  reqPrice:  { fontSize: 15, fontWeight: '700', color: AMBER },

  reqTagsRow: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  reqTag: {
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.pill,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: AMBER + '40',
  },
  reqTagText: { fontSize: 11, fontWeight: '600', color: AMBER },

  reqDetails: {
    backgroundColor: Colors.section, borderRadius: Radius.md,
    paddingHorizontal: 14, paddingVertical: 10,
    gap: 6, marginBottom: 10,
  },
  detailRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  detailText: { flex: 1, fontSize: 12, color: Colors.gray, lineHeight: 18 },

  depositInfo: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.accentLight, borderRadius: Radius.sm,
    paddingHorizontal: 10, paddingVertical: 7,
    marginBottom: 12,
  },
  depositText: { fontSize: 12, color: Colors.accent, fontWeight: '500' },

  reqActions: { flexDirection: 'row', gap: 10 },
  btnSecondary: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 11,
    borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.borderMid,
  },
  btnSecondaryText: { fontSize: 13, fontWeight: '600', color: Colors.gray },
  btnPrimary: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 11,
    borderRadius: Radius.pill, backgroundColor: AMBER,
  },
  btnPrimaryText: { fontSize: 13, fontWeight: '700', color: Colors.white },

  offlineCard: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    alignItems: 'center', paddingVertical: 48, gap: 12,
    borderWidth: 1, borderColor: Colors.border,
  },
  offlineText: { fontSize: 14, color: Colors.gray, textAlign: 'center', lineHeight: 22 },
});
