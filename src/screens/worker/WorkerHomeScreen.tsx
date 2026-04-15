import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';

const MOCK_REQUESTS = [
  {
    id: 'r1',
    customerName: 'Bunda Wulandari',
    customerPhoto: 'https://randomuser.me/api/portraits/women/59.jpg',
    date: '2026-04-15', startTime: '09:00', duration: 4,
    address: 'Jl. Kemang Raya No.12, Jakarta Selatan',
    totalPrice: 120000,
    depositAmount: 36000,
    notes: 'Tolong fokus di dapur dan kamar mandi ya',
  },
  {
    id: 'r2',
    customerName: 'Bunda Indah',
    customerPhoto: 'https://randomuser.me/api/portraits/women/41.jpg',
    date: '2026-04-15', startTime: '14:00', duration: 3,
    address: 'Jl. Fatmawati No.8, Jakarta Selatan',
    totalPrice: 90000,
    depositAmount: 27000,
    notes: '',
  },
];

export default function WorkerHomeScreen() {
  const { user }  = useAuthStore();
  const { t }     = useLanguageStore();
  const [isOnline, setIsOnline] = useState(true);

  const firstName = user?.name?.split(' ')[0] ?? '';

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>

      {/* ── Sticky header ── */}
      <View style={s.header}>
        <View style={s.headerTop}>
          <View>
            <Text style={s.greeting}>{t.workerHome.ready}, {firstName}</Text>
            <Text style={s.subGreeting}>
              {user?.role === 'tutor' ? 'Semangat mengajar hari ini!' : t.workerHome.readyHelper}
            </Text>
          </View>
          <TouchableOpacity style={s.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={Colors.grayLight} />
          </TouchableOpacity>
        </View>

        {/* Online toggle */}
        <View style={[s.toggleCard, isOnline && s.toggleCardOnline]}>
          <View style={s.toggleLeft}>
            <View style={[s.statusDot, { backgroundColor: isOnline ? Colors.success : Colors.grayLight }]} />
            <View>
              <Text style={s.toggleTitle}>{isOnline ? t.workerHome.online : t.workerHome.offline}</Text>
              <Text style={s.toggleSub}>{isOnline ? t.workerHome.onlineDesc : t.workerHome.offlineDesc}</Text>
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

      {/* ── Stats ── */}
      <View style={s.statsCard}>
        {[
          { label: t.workerHome.todayEarnings, value: 'Rp 245rb' },
          { label: t.workerHome.todayJobs,     value: '3' },
          { label: t.workerHome.rating,         value: `${user?.rating ?? '4.8'}` },
        ].map((stat, i, arr) => (
          <React.Fragment key={stat.label}>
            <View style={s.statCol}>
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
            {i < arr.length - 1 && <View style={s.statDivider} />}
          </React.Fragment>
        ))}
      </View>

      {/* ── Incoming requests ── */}
      <View style={s.section}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>{t.workerHome.incomingRequests}</Text>
          {isOnline && (
            <View style={s.badge}>
              <Text style={s.badgeText}>{MOCK_REQUESTS.length}</Text>
            </View>
          )}
        </View>

        {isOnline ? (
          MOCK_REQUESTS.map((req) => (
            <View key={req.id} style={s.requestCard}>
              {/* Customer row */}
              <View style={s.reqTop}>
                {req.customerPhoto ? (
                  <Image source={{ uri: req.customerPhoto }} style={s.reqAvatar} />
                ) : (
                  <View style={[s.reqAvatar, s.reqAvatarFallback]}>
                    <Text style={s.reqAvatarLetter}>{req.customerName.charAt(0)}</Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={s.reqName}>{req.customerName}</Text>
                  <Text style={s.reqMeta}>{req.date} · {req.startTime} · {req.duration} {t.workerHome.hours}</Text>
                </View>
                <Text style={s.reqPrice}>Rp {(req.totalPrice/1000).toFixed(0)}rb</Text>
              </View>

              {/* Details block */}
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
                <TouchableOpacity style={s.btnSecondary} activeOpacity={0.8}>
                  <Text style={s.btnSecondaryText}>{t.workerHome.reject}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnPrimary} activeOpacity={0.85}>
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

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },

  header: {
    backgroundColor: Colors.white,
    paddingTop: 44, paddingHorizontal: 20, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    gap: 10,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting:    { fontFamily: 'Nunito_800ExtraBold', fontSize: 20, color: Colors.dark },
  subGreeting: { fontSize: 14, color: Colors.gray, marginTop: 2 },
  notifBtn:    { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },

  toggleCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.section, borderRadius: Radius.lg,
    paddingHorizontal: 16, paddingVertical: 14,
    borderWidth: 1, borderColor: Colors.border,
  },
  toggleCardOnline: {
    borderColor: Colors.accent + '40',
    backgroundColor: Colors.accentLight,
  },
  toggleLeft:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusDot:   { width: 8, height: 8, borderRadius: 4 },
  toggleTitle: { fontSize: 14, fontWeight: '600', color: Colors.dark },
  toggleSub:   { fontSize: 12, color: Colors.gray, marginTop: 1 },

  statsCard: {
    flexDirection: 'row',
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    paddingVertical: 16, marginHorizontal: 20, marginTop: 8,
  },
  statCol:     { flex: 1, alignItems: 'center', gap: 4 },
  statDivider: { width: 1, backgroundColor: Colors.border, marginVertical: 4 },
  statValue:   { fontSize: 18, fontWeight: '700', color: Colors.dark },
  statLabel:   { fontSize: 11, color: Colors.gray, textAlign: 'center' },

  section: { paddingHorizontal: 20, paddingTop: 16, gap: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.dark },
  badge: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.pill, width: 22, height: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: Colors.white },

  requestCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border,
    padding: 16, ...Shadow.sm,
  },
  reqTop:    { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  reqAvatar: { width: 46, height: 46, borderRadius: 23 },
  reqAvatarFallback: {
    backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center',
  },
  reqAvatarLetter: { fontSize: 18, fontWeight: '700', color: Colors.accent },
  reqName: { fontSize: 14, fontWeight: '700', color: Colors.darkMid, marginBottom: 3 },
  reqMeta: { fontSize: 12, color: Colors.grayLight },
  reqPrice: { fontSize: 15, fontWeight: '700', color: Colors.accent },

  reqDetails: {
    backgroundColor: Colors.section, borderRadius: Radius.md,
    paddingHorizontal: 14, paddingVertical: 10,
    gap: 6, marginBottom: 10,
  },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  detailText:{ flex: 1, fontSize: 12, color: Colors.gray, lineHeight: 18 },

  depositInfo: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.accentLight, borderRadius: Radius.sm,
    paddingHorizontal: 10, paddingVertical: 7,
    marginBottom: 12,
  },
  depositText: { fontSize: 12, color: Colors.accent, fontWeight: '500' },

  reqActions: { flexDirection: 'row', gap: 10 },
  btnSecondary: {
    flex: 1, alignItems: 'center', paddingVertical: 11,
    borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.borderMid,
  },
  btnSecondaryText: { fontSize: 13, fontWeight: '600', color: Colors.gray },
  btnPrimary: {
    flex: 2, alignItems: 'center', paddingVertical: 11,
    borderRadius: Radius.pill, backgroundColor: Colors.accent,
  },
  btnPrimaryText: { fontSize: 13, fontWeight: '700', color: Colors.white },

  offlineCard: {
    backgroundColor: Colors.section, borderRadius: Radius.lg,
    alignItems: 'center', paddingVertical: 48, gap: 12,
    borderWidth: 1, borderColor: Colors.border,
  },
  offlineText: { fontSize: 14, color: Colors.gray, textAlign: 'center', lineHeight: 22 },
});
