import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../types';
import { C1, C2, C3 } from '../../constants/photos';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MOCK_WORKER_ORDERS = [
  {
    id: 'wo1',
    customerName: 'Bunda Wulandari',
    customerPhoto: C1,
    date: '2026-04-15', startTime: '09:00', duration: 4,
    address: 'Jl. Kemang Raya No.12, Jakarta Selatan',
    earnings: 120000, depositPaid: 36000, remaining: 84000,
    status: 'upcoming' as const,
  },
  {
    id: 'wo2',
    customerName: 'Bunda Indah',
    customerPhoto: C2,
    date: '2026-04-13', startTime: '10:00', duration: 5,
    address: 'Jl. Fatmawati No.8, Jakarta Selatan',
    earnings: 150000, depositPaid: 45000, remaining: 105000,
    status: 'awaiting_customer' as const,
  },
  {
    id: 'wo3',
    customerName: 'Bunda Tari',
    customerPhoto: C3,
    date: '2026-04-11', startTime: '13:00', duration: 3,
    address: 'Jl. Cipete Raya No.5, Jakarta Selatan',
    earnings: 90000, depositPaid: 27000, remaining: 0,
    status: 'completed' as const,
    rating: 5,
  },
];

type OrderStatus = 'upcoming' | 'awaiting_customer' | 'completed';

export default function WorkerOrdersScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuthStore();
  const { t }    = useLanguageStore();
  const insets   = useSafeAreaInsets();

  const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
    upcoming:         { label: t.workerOrders.upcomingLabel,    color: Colors.accent  },
    awaiting_customer:{ label: t.workerOrders.awaitingCustomer, color: Colors.warning },
    completed:        { label: t.workerOrders.completed,        color: Colors.success },
  };
  const [tab, setTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [orders, setOrders] = useState(MOCK_WORKER_ORDERS);

  const totalEarnings = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.earnings, 0);

  const list = orders.filter((o) =>
    tab === 'upcoming'
      ? o.status === 'upcoming' || o.status === 'awaiting_customer'
      : o.status === 'completed'
  );

  const TABS = [
    { key: 'upcoming'  as const, label: t.workerOrders.upcoming },
    { key: 'completed' as const, label: t.workerOrders.completed },
  ];

  const markDone = (orderId: string) => {
    Alert.alert(
      t.workerOrders.markDoneTitle,
      t.workerOrders.markDoneMsg,
      [
        { text: t.profile.cancel, style: 'cancel' },
        {
          text: t.workerOrders.markDoneConfirm,
          onPress: () =>
            setOrders((prev) =>
              prev.map((o) => o.id === orderId ? { ...o, status: 'awaiting_customer' as const } : o)
            ),
        },
      ]
    );
  };

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <View style={s.headerRow}>
          <Text style={s.pageTitle}>{t.workerOrders.title}</Text>
          <View style={s.earningPill}>
            <Ionicons name="wallet-outline" size={12} color={Colors.accent} />
            <Text style={s.earningText}>Rp {totalEarnings.toLocaleString('id-ID')}</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={s.tabsWrap}>
        <View style={s.tabsRow}>
          {TABS.map((tb) => (
            <TouchableOpacity
              key={tb.key}
              style={s.tab}
              onPress={() => setTab(tb.key)}
              activeOpacity={0.7}
            >
              <Text style={[s.tabText, tab === tb.key && s.tabTextActive]}>{tb.label}</Text>
              {tab === tb.key && <View style={s.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={s.list} showsVerticalScrollIndicator={false}>
        {list.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="file-tray-outline" size={40} color={Colors.grayLight} />
            <Text style={s.emptyTitle}>{t.workerOrders.noData}</Text>
          </View>
        ) : (
          list.map((order) => {
            const cfg = STATUS_CONFIG[order.status];
            return (
              <View key={order.id} style={s.card}>
                {/* Awaiting customer banner */}
                {order.status === 'awaiting_customer' && (
                  <View style={s.awaitingBanner}>
                    <Ionicons name="time-outline" size={13} color={Colors.warning} />
                    <Text style={s.awaitingBannerText}>
                      {t.workerOrders.awaitingCustomer} — Rp {order.remaining.toLocaleString('id-ID')}
                    </Text>
                  </View>
                )}

                {/* Customer row */}
                <View style={s.cardTop}>
                  {order.customerPhoto ? (
                    <Image source={{ uri: order.customerPhoto }} style={s.avatar} />
                  ) : (
                    <View style={[s.avatar, s.avatarFallback]}>
                      <Text style={s.avatarLetter}>{order.customerName.charAt(0)}</Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={s.customerName}>{order.customerName}</Text>
                    <Text style={s.metaText}>{order.date} · {order.startTime} · {order.duration} {t.workerHome.hours}</Text>
                  </View>
                  <View style={[s.statusPill, { backgroundColor: cfg.color + '15', borderColor: cfg.color + '40' }]}>
                    <Text style={[s.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                </View>

                {/* Details */}
                <View style={s.detailsBlock}>
                  <View style={s.detailRow}>
                    <Ionicons name="location-outline" size={13} color={Colors.grayLight} />
                    <Text style={s.detailText} numberOfLines={1}>{order.address}</Text>
                  </View>
                </View>

                {/* Payment breakdown */}
                <View style={s.paymentBlock}>
                  <View style={s.paymentRow}>
                    <View style={s.depositLabelRow}>
                      <Ionicons name="shield-checkmark-outline" size={12} color={Colors.accent} />
                      <Text style={s.paymentLabel}>{t.workerOrders.depositReceived}</Text>
                    </View>
                    <Text style={s.depositAmt}>Rp {order.depositPaid.toLocaleString('id-ID')}</Text>
                  </View>
                  {order.remaining > 0 && (
                    <View style={s.paymentRow}>
                      <Text style={s.paymentLabel}>{t.workerOrders.remainingWaiting}</Text>
                      <Text style={s.remainingAmt}>Rp {order.remaining.toLocaleString('id-ID')}</Text>
                    </View>
                  )}
                  <View style={s.paymentDivider} />
                  <View style={s.paymentRow}>
                    <Text style={s.earningsLabel}>{t.workerOrders.earnings}</Text>
                    <View style={s.footerRight}>
                      {order.status === 'completed' && (order as any).rating && (
                        <View style={s.starsRow}>
                          {Array.from({ length: (order as any).rating }).map((_: unknown, i: number) => (
                            <Ionicons key={i} name="star" size={11} color={Colors.accent} />
                          ))}
                        </View>
                      )}
                      <Text style={s.earningsAmt}>Rp {order.earnings.toLocaleString('id-ID')}</Text>
                    </View>
                  </View>
                </View>

                {/* CTA buttons */}
                {order.status === 'upcoming' && (
                  <View style={s.actionsRow}>
                    <TouchableOpacity style={s.chatBtn} activeOpacity={0.8}
                      onPress={() => navigation.navigate('ChatDetail', {
                        chatId: order.id,
                        name: order.customerName,
                        photo: order.customerPhoto,
                        role: 'customer',
                      })}
                    >
                      <Ionicons name="chatbubble-ellipses-outline" size={14} color={Colors.accent} />
                      <Text style={s.chatBtnText}>Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={s.startBtn}
                      activeOpacity={0.85}
                      onPress={() => markDone(order.id)}
                    >
                      <Text style={s.startBtnText}>{t.workerOrders.startJob}</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {order.status === 'awaiting_customer' && (
                  <View style={s.awaitingNote}>
                    <Ionicons name="information-circle-outline" size={13} color={Colors.gray} />
                    <Text style={s.awaitingNoteText}>{t.workerOrders.autoRelease}</Text>
                  </View>
                )}
              </View>
            );
          })
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },

  header: {
    paddingBottom: 16, paddingHorizontal: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pageTitle: { fontSize: 22, fontWeight: '700', color: Colors.dark },
  earningPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.accentLight, borderRadius: Radius.pill,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: Colors.accent + '30',
  },
  earningText: { fontSize: 13, fontWeight: '700', color: Colors.accent },

  tabsWrap: { paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabsRow:  { flexDirection: 'row' },
  tab:      { paddingRight: 28, paddingVertical: 14, position: 'relative' },
  tabText:  { fontSize: 14, fontWeight: '500', color: Colors.grayLight },
  tabTextActive:  { color: Colors.dark, fontWeight: '700' },
  tabUnderline: {
    position: 'absolute', bottom: -1, left: 0, right: 28,
    height: 2, backgroundColor: Colors.accent, borderRadius: 1,
  },

  list: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  empty: { alignItems: 'center', paddingTop: 72, gap: 12 },
  emptyTitle: { fontSize: 15, fontWeight: '500', color: Colors.dark },

  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border,
    padding: 16, marginBottom: 12, overflow: 'hidden',
    ...Shadow.sm,
  },

  awaitingBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    backgroundColor: '#FFFBEB',
    marginHorizontal: -16, marginTop: -16,
    paddingHorizontal: 16, paddingVertical: 10,
    marginBottom: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.warning + '30',
  },
  awaitingBannerText: { flex: 1, fontSize: 12, fontWeight: '500', color: '#92400E' },

  cardTop:  { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  avatar:   { width: 46, height: 46, borderRadius: 23 },
  avatarFallback: {
    backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarLetter: { fontSize: 18, fontWeight: '700', color: Colors.accent },
  customerName: { fontSize: 14, fontWeight: '700', color: Colors.darkMid, marginBottom: 3 },
  metaText: { fontSize: 12, color: Colors.grayLight },

  statusPill: {
    borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1,
  },
  statusText: { fontSize: 11, fontWeight: '700' },

  detailsBlock: {
    backgroundColor: Colors.section, borderRadius: Radius.md,
    paddingHorizontal: 14, paddingVertical: 10,
    marginBottom: 12,
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText:{ flex: 1, fontSize: 12, color: Colors.gray },

  // Payment breakdown
  paymentBlock: { gap: 7, marginBottom: 12 },
  paymentRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  depositLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  paymentLabel: { fontSize: 12, color: Colors.gray },
  depositAmt:   { fontSize: 12, fontWeight: '600', color: Colors.dark },
  remainingAmt: { fontSize: 12, fontWeight: '600', color: Colors.grayLight },
  paymentDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 2 },
  earningsLabel:  { fontSize: 13, color: Colors.gray },
  footerRight:    { flexDirection: 'row', alignItems: 'center', gap: 6 },
  starsRow:       { flexDirection: 'row', gap: 1 },
  earningsAmt:    { fontSize: 17, fontWeight: '700', color: Colors.accent },

  actionsRow: { flexDirection: 'row', gap: 10 },
  chatBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 11, paddingHorizontal: 16,
    borderRadius: Radius.pill,
    borderWidth: 1, borderColor: Colors.accent + '50',
    backgroundColor: Colors.accentLight,
  },
  chatBtnText: { fontSize: 13, fontWeight: '600', color: Colors.accent },
  startBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 12,
    borderRadius: Radius.pill, backgroundColor: Colors.accent,
  },
  startBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },

  awaitingNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    backgroundColor: Colors.section, borderRadius: Radius.sm,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  awaitingNoteText: { flex: 1, fontSize: 11, color: Colors.gray, lineHeight: 16 },
});
