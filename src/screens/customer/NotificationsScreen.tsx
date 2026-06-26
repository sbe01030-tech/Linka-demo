/**
 * NotificationsScreen — 알림 목록
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, Modal, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { RootStackParamList } from '../../types';
import { W1, W2, W3, W4 } from '../../constants/photos';
import { useLanguageStore } from '../../store/languageStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

type NotifType = 'booking_accepted' | 'booking_rejected' | 'helper_arrived' | 'review_request' | 'promo' | 'system' | 'ramadan';

interface Notif {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  photo?: string;
}

type NotifContent = { titleKo: string; titleEn: string; titleId: string; bodyKo: string; bodyEn: string; bodyId: string; timeKo: string; timeEn: string; timeId: string; };

const MOCK_NOTIFS: (Notif & NotifContent)[] = [
  {
    id: 'n0',
    type: 'ramadan',
    title: '', body: '', time: '',
    titleKo: '라마단 추가 보수 책정 안내',
    titleEn: 'Set your Ramadan additional pay',
    titleId: 'Atur tambahan upah Ramadan',
    bodyKo: '다가오는 라마단 기간(2026.2.17–3.18)에 대한 추가 보수를 책정해주세요. 미리 합의하면 매칭이 원활해져요.',
    bodyEn: 'Please set your additional pay for the upcoming Ramadan period (Feb 17 – Mar 18, 2026). Agreeing early makes matching smoother.',
    bodyId: 'Mohon tetapkan tambahan upah untuk periode Ramadan (17 Feb – 18 Mar 2026). Kesepakatan lebih awal memperlancar pemesanan.',
    timeKo: '방금 전', timeEn: 'Just now', timeId: 'Baru saja',
    read: false,
  },
  {
    id: 'n1',
    type: 'booking_accepted',
    title: '', body: '', time: '', // filled at render
    titleKo: '예약이 확정됐어요!',   titleEn: 'Booking confirmed!',       titleId: 'Pesanan dikonfirmasi!',
    bodyKo: 'Sari Dewi가 4월 22일 예약을 수락했습니다. 당일 헬퍼가 방문할 예정이에요.',
    bodyEn: 'Sari Dewi accepted your April 22 booking. She will visit on the scheduled day.',
    bodyId: 'Sari Dewi menerima pesanan Anda pada 22 April. Helper akan datang sesuai jadwal.',
    timeKo: '방금 전', timeEn: 'Just now', timeId: 'Baru saja',
    read: false, photo: W1,
  },
  {
    id: 'n2',
    type: 'helper_arrived',
    title: '', body: '', time: '',
    titleKo: '헬퍼가 도착했어요', titleEn: 'Your helper arrived', titleId: 'Helper sudah tiba',
    bodyKo: 'Rina Wulandari가 주소지 근처에 도착했습니다. 문을 열어주세요.',
    bodyEn: 'Rina Wulandari has arrived near your address. Please open the door.',
    bodyId: 'Rina Wulandari sudah tiba di sekitar alamat. Silakan buka pintu.',
    timeKo: '10분 전', timeEn: '10 min ago', timeId: '10 mnt lalu',
    read: false, photo: W2,
  },
  {
    id: 'n3',
    type: 'review_request',
    title: '', body: '', time: '',
    titleKo: '서비스는 어떠셨나요?', titleEn: 'How was the service?', titleId: 'Bagaimana layanannya?',
    bodyKo: 'Fitri Handayani의 서비스가 완료됐습니다. 리뷰를 남겨주시면 다른 분들께 큰 도움이 돼요.',
    bodyEn: "Fitri Handayani's service is complete. A quick review helps others.",
    bodyId: 'Layanan Fitri Handayani selesai. Review Anda membantu komunitas.',
    timeKo: '1시간 전', timeEn: '1 hr ago', timeId: '1 jam lalu',
    read: false, photo: W4,
  },
  {
    id: 'n4',
    type: 'booking_rejected',
    title: '', body: '', time: '',
    titleKo: '예약 요청이 거절됐어요', titleEn: 'Booking declined', titleId: 'Pesanan ditolak',
    bodyKo: 'Dewi Anggraeni가 해당 날짜에 다른 일정이 있어 거절했습니다. 다른 헬퍼를 찾아보세요.',
    bodyEn: 'Dewi Anggraeni is busy on that date. Try another helper.',
    bodyId: 'Dewi Anggraeni tidak tersedia di tanggal itu. Coba helper lain.',
    timeKo: '어제', timeEn: 'Yesterday', timeId: 'Kemarin',
    read: true, photo: W3,
  },
  {
    id: 'n5',
    type: 'promo',
    title: '', body: '', time: '',
    titleKo: '첫 정기 계약 20% 할인!', titleEn: 'First contract: 20% off!', titleId: 'Kontrak pertama diskon 20%!',
    bodyKo: '이번 달 처음 정기 계약을 맺으시면 첫 달 20% 할인 혜택을 드립니다. 지금 신청하세요.',
    bodyEn: 'Sign your first regular contract this month and get 20% off the first month. Apply now.',
    bodyId: 'Daftar kontrak rutin pertama bulan ini dan dapatkan diskon 20% bulan pertama.',
    timeKo: '2일 전', timeEn: '2 days ago', timeId: '2 hari lalu',
    read: true,
  },
  {
    id: 'n6',
    type: 'system',
    title: '', body: '', time: '',
    titleKo: 'Linka 앱 업데이트 안내', titleEn: 'Linka update available', titleId: 'Update Linka tersedia',
    bodyKo: '더 나은 서비스를 위해 앱이 업데이트됐습니다. 새로운 지도 필터와 정기 예약 기능을 확인해보세요!',
    bodyEn: 'The app has been updated. Try the new map filters and regular booking flow!',
    bodyId: 'Aplikasi diperbarui. Coba filter peta baru dan alur pemesanan rutin!',
    timeKo: '3일 전', timeEn: '3 days ago', timeId: '3 hari lalu',
    read: true,
  },
];

const TYPE_META: Record<NotifType, { icon: string; color: string; bg: string }> = {
  booking_accepted: { icon: 'checkmark-circle',     color: Colors.accent,       bg: Colors.accentLight },
  booking_rejected: { icon: 'close-circle',         color: Colors.danger,       bg: '#FEF2F2' },
  helper_arrived:   { icon: 'walk',                 color: '#3B82F6',           bg: '#EFF6FF' },
  review_request:   { icon: 'star',                 color: '#F59E0B',           bg: '#FFFBEB' },
  promo:            { icon: 'gift',                 color: '#8B5CF6',           bg: '#F5F3FF' },
  system:           { icon: 'information-circle',   color: Colors.grayLight,    bg: Colors.section },
  ramadan:          { icon: 'moon',                 color: '#D97706',           bg: '#FEF3C7' },
};

export default function NotificationsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { lang } = useLanguageStore();
  const tx = (ko: string, en: string, id: string) =>
    lang === 'ko' ? ko : lang === 'en' ? en : id;

  // 언어에 따라 notif 텍스트 세팅
  const localize = (n: typeof MOCK_NOTIFS[0]) => ({
    ...n,
    title: tx(n.titleKo, n.titleEn, n.titleId),
    body:  tx(n.bodyKo,  n.bodyEn,  n.bodyId),
    time:  tx(n.timeKo,  n.timeEn,  n.timeId),
  });

  const [notifs, setNotifs] = useState(MOCK_NOTIFS.map(localize));
  // 상세 팝업
  const [selected, setSelected] = useState<Notif | null>(null);

  // lang 바뀌면 re-localize
  React.useEffect(() => {
    setNotifs(prev => prev.map(n => {
      const orig = MOCK_NOTIFS.find(m => m.id === n.id);
      if (!orig) return n;
      return { ...localize(orig), read: n.read };
    }));
  }, [lang]);

  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const todayKeys = [
    tx('방금 전','Just now','Baru saja'),
    tx('10분 전','10 min ago','10 mnt lalu'),
    tx('1시간 전','1 hr ago','1 jam lalu'),
  ];
  const todayNotifs   = notifs.filter(n => todayKeys.includes(n.time));
  const earlierNotifs = notifs.filter(n => !todayKeys.includes(n.time));

  const renderNotif = (notif: Notif) => {
    const meta = TYPE_META[notif.type];
    return (
      <TouchableOpacity
        key={notif.id}
        style={[s.card, !notif.read && s.cardUnread]}
        onPress={() => {
          markRead(notif.id);
          // 데모: '예약 확정' 알림은 팝업 대신 '내 예약 목록'으로 이동
          if (notif.type === 'booking_accepted') navigation.navigate('Orders');
          else setSelected(notif);
        }}
        activeOpacity={0.85}
      >
        {/* 아이콘 / 사진 */}
        <View style={s.iconWrap}>
          {notif.photo ? (
            <>
              <Image source={{ uri: notif.photo }} style={s.photo} />
              <View style={[s.typeIconBadge, { backgroundColor: meta.bg }]}>
                <Ionicons name={meta.icon as any} size={11} color={meta.color} />
              </View>
            </>
          ) : (
            <View style={[s.iconCircle, { backgroundColor: meta.bg }]}>
              <Ionicons name={meta.icon as any} size={22} color={meta.color} />
            </View>
          )}
        </View>

        {/* 텍스트 */}
        <View style={s.textWrap}>
          <View style={s.titleRow}>
            <Text style={[s.notifTitle, !notif.read && s.notifTitleUnread]} numberOfLines={1}>
              {notif.title}
            </Text>
            {!notif.read && <View style={s.unreadDot} />}
          </View>
          <Text style={s.notifBody} numberOfLines={2}>{notif.body}</Text>
          <Text style={s.notifTime}>{notif.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      {/* 헤더 */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>{tx('알림', 'Notifications', 'Notifikasi')}</Text>
          {unreadCount > 0 && (
            <Text style={s.headerSub}>
              {tx(`읽지 않은 알림 ${unreadCount}개`, `${unreadCount} unread`, `${unreadCount} belum dibaca`)}
            </Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead} style={s.markAllBtn}>
            <Text style={s.markAllText}>{tx('모두 읽음', 'Mark all read', 'Tandai semua')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {todayNotifs.length > 0 && (
          <>
            <Text style={s.groupLabel}>{tx('오늘', 'Today', 'Hari ini')}</Text>
            {todayNotifs.map(renderNotif)}
          </>
        )}
        {earlierNotifs.length > 0 && (
          <>
            <Text style={s.groupLabel}>{tx('이전', 'Earlier', 'Sebelumnya')}</Text>
            {earlierNotifs.map(renderNotif)}
          </>
        )}

        {notifs.length === 0 && (
          <View style={s.empty}>
            <Ionicons name="notifications-off-outline" size={48} color={Colors.borderMid} />
            <Text style={s.emptyTitle}>{tx('알림이 없습니다', 'No notifications', 'Tidak ada notifikasi')}</Text>
            <Text style={s.emptySub}>
              {tx('새 예약이나 서비스 소식이 생기면 알려드릴게요', "We'll notify you of new bookings and updates", 'Kami akan memberi tahu saat ada pesanan baru')}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* 상세 팝업 */}
      <Modal
        visible={!!selected}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <Pressable style={s.modalBackdrop} onPress={() => setSelected(null)}>
          <Pressable style={s.modalCard} onPress={(e) => e.stopPropagation()}>
            {selected && (() => {
              const meta = TYPE_META[selected.type];
              return (
                <>
                  {/* 아이콘 + 사진 */}
                  <View style={s.modalIconWrap}>
                    {selected.photo ? (
                      <>
                        <Image source={{ uri: selected.photo }} style={s.modalPhoto} />
                        <View style={[s.modalTypeBadge, { backgroundColor: meta.bg }]}>
                          <Ionicons name={meta.icon as any} size={14} color={meta.color} />
                        </View>
                      </>
                    ) : (
                      <View style={[s.modalIconCircle, { backgroundColor: meta.bg }]}>
                        <Ionicons name={meta.icon as any} size={30} color={meta.color} />
                      </View>
                    )}
                  </View>

                  <Text style={s.modalTitle}>{selected.title}</Text>
                  <Text style={s.modalTime}>{selected.time}</Text>
                  <Text style={s.modalBody}>{selected.body}</Text>

                  <TouchableOpacity style={s.modalCloseBtn} onPress={() => setSelected(null)} activeOpacity={0.85}>
                    <Text style={s.modalCloseBtnText}>{tx('확인', 'Got it', 'Mengerti')}</Text>
                  </TouchableOpacity>
                </>
              );
            })()}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.white },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    gap: 8,
  },
  backBtn:     { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.dark },
  headerSub:   { fontSize: 12, color: Colors.grayLight, marginTop: 1 },
  markAllBtn:  { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.pill, backgroundColor: Colors.section },
  markAllText: { fontSize: 12, fontWeight: '600', color: Colors.gray },

  groupLabel: {
    fontSize: 12, fontWeight: '700', color: Colors.grayLight,
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },

  card: {
    flexDirection: 'row', gap: 14,
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  cardUnread: { backgroundColor: '#F0FDF8' },

  iconWrap:    { position: 'relative', width: 48, height: 48 },
  photo:       { width: 48, height: 48, borderRadius: 24 },
  typeIconBadge: {
    position: 'absolute', bottom: -2, right: -2,
    width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.white,
  },
  iconCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },

  textWrap:  { flex: 1, gap: 3 },
  titleRow:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  notifTitle:       { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.darkMid },
  notifTitleUnread: { color: Colors.dark, fontWeight: '700' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accent },
  notifBody: { fontSize: 13, color: Colors.gray, lineHeight: 19 },
  notifTime: { fontSize: 11, color: Colors.grayLight },

  empty: { alignItems: 'center', paddingTop: 80, gap: 12, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.dark },
  emptySub:   { fontSize: 13, color: Colors.gray, textAlign: 'center', lineHeight: 20 },

  // 상세 팝업
  modalBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 28,
  },
  modalCard: {
    width: '100%', backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    paddingHorizontal: 24, paddingTop: 28, paddingBottom: 20,
    alignItems: 'center',
    ...Shadow.md,
  },
  modalIconWrap: { position: 'relative', marginBottom: 16 },
  modalPhoto: { width: 64, height: 64, borderRadius: 32 },
  modalIconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  modalTypeBadge: {
    position: 'absolute', bottom: -3, right: -3,
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.white,
  },
  modalTitle: {
    fontSize: 17, fontWeight: '700', color: Colors.dark,
    textAlign: 'center', lineHeight: 24,
  },
  modalTime: {
    fontSize: 12, color: Colors.grayLight, marginTop: 4, marginBottom: 14,
  },
  modalBody: {
    fontSize: 14, color: Colors.gray, lineHeight: 22,
    textAlign: 'center', marginBottom: 22,
  },
  modalCloseBtn: {
    alignSelf: 'stretch',
    paddingVertical: 12,
    backgroundColor: Colors.accent,
    borderRadius: Radius.pill,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    fontSize: 14, fontWeight: '700', color: Colors.white,
  },
});
