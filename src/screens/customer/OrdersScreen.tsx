import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { useLanguageStore } from '../../store/languageStore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../types';
import { W1, W2, W3, W4 } from '../../constants/photos';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { useBookingStore, toCustomerOrder } from '../../store/bookingStore';
import { CUSTOMER_ME } from '../../store/chatStore';

// 리뷰 완료된 주문 ID 추적 (ReviewScreen에서 공유)
export const reviewedOrderIds = new Set<string>();

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MOCK_ORDERS = [
  {
    id: 'o1',
    workerName: 'Sari Dewi',
    workerPhoto: W1,
    serviceType: 'helper',
    date: '2026-04-15', startTime: '09:00', duration: 4,
    address: 'Jl. Kemang Raya No.12, Jakarta Selatan',
    totalPrice: 120000, depositPaid: 36000, remaining: 84000,
    status: 'ongoing' as const,
  },
  {
    id: 'o2',
    workerName: 'Fitri Handayani',
    workerPhoto: W4,
    serviceType: 'helper',
    date: '2026-04-14', startTime: '09:00', duration: 5,
    address: 'Jl. Fatmawati No.8, Jakarta Selatan',
    totalPrice: 135000, depositPaid: 40500, remaining: 94500,
    status: 'awaiting_confirmation' as const,
  },
  {
    id: 'o3',
    workerName: 'Rina Wulandari',
    workerPhoto: W2,
    serviceType: 'helper',
    date: '2026-04-10', startTime: '10:00', duration: 3,
    address: 'Jl. Cilandak KKO No.3, Jakarta Selatan',
    totalPrice: 75000, depositPaid: 22500, remaining: 0,
    status: 'completed' as const,
  },
  {
    id: 'o4',
    workerName: 'Dewi Anggraeni',
    workerPhoto: W3,
    serviceType: 'helper',
    date: '2026-04-08', startTime: '13:00', duration: 4,
    address: 'Jl. Pondok Indah No.10, Jakarta Selatan',
    totalPrice: 112000, depositPaid: 33600, remaining: 0,
    status: 'cancelled' as const,
  },
];

export default function OrdersScreen() {
  const navigation = useNavigation<Nav>();
  const { t, lang } = useLanguageStore();
  const tx = (ko: string, en: string, id: string) => (lang === 'ko' ? ko : lang === 'en' ? en : id);
  const insets = useSafeAreaInsets();
  const setBookingStatus = useBookingStore((st) => st.setStatus);
  // 작업 완료 확인 사운드 (무음 모드에서도)
  const doneSound = useAudioPlayer(require('../../../assets/gallery/Linka.mp3'));
  React.useEffect(() => { setAudioModeAsync({ playsInSilentMode: true }).catch(() => {}); }, []);
  const [tab, setTab] = useState<'active' | 'history'>('active');
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [, forceUpdate] = useState(0);

  // ReviewScreen에서 돌아왔을 때 리뷰 완료 상태 반영
  useFocusEffect(
    React.useCallback(() => { forceUpdate(n => n + 1); }, [])
  );

  const STATUS_CONFIG = {
    pending:               { label: t.orders.pending,        color: Colors.gray      },
    confirmed:             { label: t.orders.confirmed,      color: Colors.accent    },
    ongoing:               { label: t.orders.ongoing,        color: Colors.dark      },
    awaiting_confirmation: { label: t.orders.awaitingConfirm,color: Colors.accent    },
    completed:             { label: t.orders.completed,      color: Colors.success   },
    cancelled:             { label: t.orders.cancelled,      color: Colors.grayLight },
  } as const;

  const TABS = [
    { key: 'active'  as const, label: t.orders.active },
    { key: 'history' as const, label: t.orders.history },
  ];

  // 공유 예약(고객이 방금 넣은 예약) + 기존 mock 합치기
  const bookings = useBookingStore((st) => st.bookings);
  const allOrders = [
    ...bookings.filter((b) => b.customerId === CUSTOMER_ME.id).map(toCustomerOrder),
    ...orders,
  ];
  const list = tab === 'active'
    ? allOrders.filter((o) => ['pending', 'confirmed', 'ongoing', 'awaiting_confirmation'].includes(o.status))
    : allOrders.filter((o) => ['completed', 'cancelled'].includes(o.status));

  const confirmCompletion = (order: { id: string; workerName: string; workerPhoto?: any }) => {
    Alert.alert(
      t.orders.confirmTitle,
      t.orders.confirmMsg,
      [
        { text: t.orders.notYet, style: 'cancel' },
        {
          text: t.orders.yesConfirm,
          onPress: () => {
            try { doneSound.seekTo(0); doneSound.play(); } catch {} // 완료 사운드
            // 공유 스토어 예약(bk-)이면 스토어 상태 변경, 아니면 mock 갱신
            if (order.id.startsWith('bk-')) setBookingStatus(order.id, 'completed');
            else setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: 'completed' as const, remaining: 0 } : o));
            // 완료 확인 후 리뷰 화면으로
            setTimeout(() => {
              navigation.navigate('Review', { orderId: order.id, workerName: order.workerName, workerPhoto: order.workerPhoto });
            }, 300);
          },
        },
      ]
    );
  };

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={s.title}>{t.orders.myOrders}</Text>
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
            <Text style={s.emptyTitle}>{t.orders.noOrders}</Text>
            <Text style={s.emptyText}>{t.orders.noOrdersDesc}</Text>
          </View>
        ) : (
          list.map((order) => {
            const cfg = STATUS_CONFIG[order.status];
            const isAwaitingConfirmation = order.status === 'awaiting_confirmation';
            const isCompleted = order.status === 'completed';
            const isCancelled = order.status === 'cancelled';
            // 작업 완료 확인 버튼 노출 (활성 상태)
            const canConfirmDone = ['pending', 'confirmed', 'ongoing', 'awaiting_confirmation'].includes(order.status);

            return (
              <TouchableOpacity key={order.id} style={s.card} activeOpacity={0.95}>
                {/* Awaiting confirmation banner */}
                {isAwaitingConfirmation && (
                  <View style={s.confirmBanner}>
                    <Ionicons name="time-outline" size={14} color={Colors.accent} />
                    <Text style={s.confirmBannerText}>{t.orders.confirmBannerText}</Text>
                  </View>
                )}

                {/* Top: avatar + name + status */}
                <View style={s.cardTop}>
                  {order.workerPhoto ? (
                    <Image source={{ uri: order.workerPhoto }} style={s.avatar} />
                  ) : (
                    <View style={[s.avatar, s.avatarFallback]}>
                      <Ionicons name="person" size={18} color={Colors.grayLight} />
                    </View>
                  )}
                  <View style={s.cardTopMid}>
                    <Text style={s.workerName}>{order.workerName}</Text>
                    <Text style={s.serviceType}>
                      {order.serviceType === 'tutor' ? 'Les Privat' : 'ART'}
                    </Text>
                  </View>
                  <Text style={[s.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                </View>

                <View style={s.divider} />

                {/* Detail rows */}
                <View style={s.detailsBlock}>
                  <View style={s.detailRow}>
                    <Ionicons name="calendar-outline" size={13} color={Colors.grayLight} />
                    <Text style={s.detailText}>{order.date} · {order.startTime} · {order.duration} {t.orders.hours}</Text>
                  </View>
                  <View style={s.detailRow}>
                    <Ionicons name="location-outline" size={13} color={Colors.grayLight} />
                    <Text style={s.detailText} numberOfLines={1}>{order.address}</Text>
                  </View>
                </View>

                {/* 후불 결제 안내 + 금액 */}
                <View style={s.depositBlock}>
                  <View style={s.depositRow}>
                    <View style={s.depositLabelRow}>
                      <Ionicons name={isCompleted ? 'checkmark-circle-outline' : 'time-outline'} size={12} color={Colors.accent} />
                      <Text style={[s.depositLabel, { color: Colors.accent, fontWeight: '600' }]}>
                        {isCancelled ? tx('취소됨', 'Cancelled', 'Dibatalkan')
                          : isCompleted ? tx('결제 완료 · 후불', 'Paid · postpaid', 'Lunas · bayar nanti')
                          : tx('후불 · 서비스 완료 후 결제', 'Pay after service', 'Bayar setelah selesai')}
                      </Text>
                    </View>
                    <Text style={s.totalPrice}>Rp {order.totalPrice.toLocaleString('id-ID')}</Text>
                  </View>
                </View>

                {/* 작업 완료 확인 버튼 */}
                {canConfirmDone && (
                  <TouchableOpacity
                    style={s.confirmBtn}
                    onPress={() => confirmCompletion(order)}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="checkmark-circle-outline" size={16} color={Colors.white} />
                    <Text style={s.confirmBtnText}>{tx('작업 완료 확인', 'Confirm completion', 'Konfirmasi selesai')}</Text>
                  </TouchableOpacity>
                )}

                {isCompleted && (
                  <View style={s.actionRow}>
                    {reviewedOrderIds.has(order.id) ? (
                      <View style={s.reviewedBadge}>
                        <Ionicons name="checkmark-circle" size={14} color={Colors.accent} />
                        <Text style={s.reviewedBadgeText}>리뷰 완료</Text>
                      </View>
                    ) : (
                      <TouchableOpacity style={s.btnSecondary} activeOpacity={0.8}
                        onPress={() => navigation.navigate('Review', { orderId: order.id, workerName: order.workerName, workerPhoto: order.workerPhoto })}
                      >
                        <Ionicons name="star-outline" size={13} color={Colors.accent} />
                        <Text style={[s.btnSecondaryText, { color: Colors.accent }]}>{t.orders.review}</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={s.btnPrimary} activeOpacity={0.85}
                      onPress={() => navigation.navigate('WorkerDetail', { workerId: order.id })}
                    >
                      <Text style={s.btnPrimaryText}>{t.orders.reorder}</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {isCancelled && (
                  <View style={s.refundNote}>
                    <Ionicons name="information-circle-outline" size={13} color={Colors.grayLight} />
                    <Text style={s.refundNoteText}>{t.orders.refundNote}</Text>
                  </View>
                )}
              </TouchableOpacity>
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
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingBottom: 16, paddingHorizontal: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: Colors.dark },

  tabsWrap: { paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabsRow:  { flexDirection: 'row' },
  tab:      { paddingRight: 28, paddingBottom: 12, paddingTop: 14, position: 'relative' },
  tabText:  { fontSize: 14, fontWeight: '500', color: Colors.grayLight },
  tabTextActive:  { color: Colors.dark, fontWeight: '700' },
  tabUnderline: {
    position: 'absolute', bottom: -1, left: 0, right: 28,
    height: 2, backgroundColor: Colors.accent, borderRadius: 1,
  },

  list: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },

  empty: { alignItems: 'center', paddingTop: 72, gap: 10 },
  emptyTitle:{ fontSize: 16, fontWeight: '500', color: Colors.dark },
  emptyText: { fontSize: 13, color: Colors.gray },

  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    padding: 16, marginBottom: 12,
    overflow: 'hidden',
    ...Shadow.sm,
  },

  confirmBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.accentLight,
    marginHorizontal: -16, marginTop: -16,
    paddingHorizontal: 16, paddingVertical: 10,
    marginBottom: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.accent + '30',
  },
  confirmBannerText: { flex: 1, fontSize: 12, fontWeight: '600', color: Colors.accent },

  cardTop:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarFallback: {
    backgroundColor: Colors.section,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  cardTopMid:  { flex: 1 },
  workerName:  { fontSize: 14, fontWeight: '700', color: Colors.darkMid, marginBottom: 2 },
  serviceType: { fontSize: 12, color: Colors.grayLight },
  statusText:  { fontSize: 12, fontWeight: '700' },

  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 14 },

  detailsBlock: {
    backgroundColor: Colors.section,
    borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 12,
    gap: 8, marginBottom: 12,
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText:  { flex: 1, fontSize: 12, color: Colors.gray },

  // Deposit breakdown
  depositBlock: {
    gap: 6, marginBottom: 14,
  },
  depositRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  depositLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  depositLabel: { fontSize: 12, color: Colors.gray },
  depositPaid:  { fontSize: 12, fontWeight: '600', color: Colors.dark },
  depositRemaining: { fontSize: 12, fontWeight: '600', color: Colors.grayLight },
  totalLabel: { fontSize: 13, color: Colors.gray },
  totalPrice: { fontSize: 17, fontWeight: '700', color: Colors.dark },

  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: Radius.pill, paddingVertical: 13,
  },
  confirmBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },

  actionRow: { flexDirection: 'row', gap: 10 },
  btnSecondary: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10,
    borderRadius: Radius.pill,
    borderWidth: 1, borderColor: Colors.accent + '50',
    backgroundColor: Colors.accentLight,
  },
  btnSecondaryText: { fontSize: 13, fontWeight: '600' },
  btnPrimary: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, borderRadius: Radius.pill,
    backgroundColor: Colors.accent,
  },
  btnPrimaryText: { fontSize: 13, fontWeight: '700', color: Colors.white },

  reviewedBadge: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: Radius.pill,
    backgroundColor: Colors.section, borderWidth: 1, borderColor: Colors.borderMid,
  },
  reviewedBadgeText: { fontSize: 13, fontWeight: '600', color: Colors.accent },

  refundNote: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.section, borderRadius: Radius.sm,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  refundNoteText: { fontSize: 11, color: Colors.gray },
});
