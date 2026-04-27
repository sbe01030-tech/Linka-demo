/**
 * ErrandDetailScreen — 심부름 요청 상세
 * 헬퍼가 요청을 보고 수락하는 화면
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { RootStackParamList, ErrandRequest } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ErrandDetail'>;

const MOCK_ERRANDS: Record<string, ErrandRequest> = {
  e1: {
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
  e2: {
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
  e3: {
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
  e4: {
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
};

export default function ErrandDetailScreen({ navigation, route }: Props) {
  const { errandId } = route.params;
  const { user }     = useAuthStore();
  const insets       = useSafeAreaInsets();
  const { lang }     = useLanguageStore();
  const tx = (ko: string, en: string, id: string) => lang === 'ko' ? ko : lang === 'en' ? en : id;
  const errand       = MOCK_ERRANDS[errandId];
  const [accepted, setAccepted] = useState(false);
  const isHelper = user?.role === 'helper' || user?.role === 'tutor';

  if (!errand) {
    return (
      <View style={s.root}>
        <Text>{tx('요청을 찾을 수 없어요', 'Request not found', 'Permintaan tidak ditemukan')}</Text>
      </View>
    );
  }

  const handleAccept = () => {
    Alert.alert(
      tx('이 요청을 수락하시겠어요?', 'Accept this request?', 'Terima permintaan ini?'),
      `"${errand.title}"\n\n${tx(
        '수락하면 요청자와 채팅으로 연결됩니다.',
        "Once accepted, you'll be connected with the customer via chat.",
        'Setelah diterima, kamu akan terhubung lewat chat dengan pelanggan.'
      )}`,
      [
        { text: tx('취소', 'Cancel', 'Batal'), style: 'cancel' },
        {
          text: tx('수락', 'Accept', 'Terima'),
          onPress: () => {
            setAccepted(true);
            Alert.alert(
              tx('수락 완료!', 'Accepted!', 'Berhasil Diterima!'),
              tx('요청자에게 알림이 전송됐어요. 채팅에서 확인해주세요.', 'Notification sent to the customer. Check your chat.', 'Notifikasi telah dikirim ke pelanggan. Cek chat kamu ya.')
            );
          },
        },
      ]
    );
  };

  return (
    <View style={s.root}>
      {/* 헤더 */}
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={20} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{tx('요청 상세', 'Request Detail', 'Detail Permintaan')}</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* 상태 뱃지 */}
        <View style={[s.statusBadge, accepted && s.statusBadgeAccepted]}>
          <Ionicons
            name={accepted ? 'checkmark-circle' : 'radio-button-on'}
            size={14}
            color={accepted ? Colors.accent : '#F97316'}
          />
          <Text style={[s.statusText, accepted && s.statusTextAccepted]}>
            {accepted ? tx('수락됨', 'Accepted', 'Diterima') : tx('모집중', 'Open', 'Dicari')}
          </Text>
        </View>

        {/* 제목 */}
        <Text style={s.title}>{errand.title}</Text>

        {/* 메타 정보 */}
        <View style={s.metaRow}>
          <View style={s.metaItem}>
            <Ionicons name="location-outline" size={14} color={Colors.grayLight} />
            <Text style={s.metaText}>{errand.location}</Text>
          </View>
          <View style={s.metaItem}>
            <Ionicons name="time-outline" size={14} color={Colors.grayLight} />
            <Text style={s.metaText}>{errand.createdAt}</Text>
          </View>
        </View>

        {errand.deadline && (
          <View style={s.deadlineBanner}>
            <Ionicons name="alarm-outline" size={15} color="#F97316" />
            <Text style={s.deadlineText}>{tx('마감', 'Deadline', 'Batas')}: {errand.deadline}</Text>
          </View>
        )}

        {/* 상세 내용 */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>{tx('요청 내용', 'Request Detail', 'Detail Permintaan')}</Text>
          <Text style={s.descText}>{errand.description}</Text>
        </View>

        {/* 제안 금액 */}
        <View style={s.budgetCard}>
          <Text style={s.budgetLabel}>{tx('제안 금액', 'Proposed Price', 'Penawaran Harga')}</Text>
          <Text style={s.budgetAmount}>Rp {errand.budget.toLocaleString()}</Text>
          <Text style={s.budgetNote}>
            * {tx('실제 금액은 채팅으로 협의 가능해요', 'Final price can be negotiated in chat', 'Harga final dapat dinegosiasi lewat chat')}
          </Text>
        </View>

        {/* 주의사항 */}
        <View style={s.noticeBox}>
          <Text style={s.noticeTitle}>{tx('주의사항', 'Notes', 'Perhatian')}</Text>
          {[
            tx('수락 후 취소 시 패널티가 부과될 수 있어요', 'Canceling after acceptance may incur a penalty', 'Pembatalan setelah diterima dapat dikenakan penalti'),
            tx('현금 또는 앱 내 결제 가능합니다', 'Cash or in-app payment accepted', 'Pembayaran bisa tunai atau lewat aplikasi'),
            tx('완료 후 요청자 확인 시 정산됩니다', 'Funds released after customer confirmation', 'Dana dicairkan setelah pelanggan mengkonfirmasi selesai'),
          ].map((n, i) => (
            <View key={i} style={s.noticeItem}>
              <Text style={s.noticeDot}>·</Text>
              <Text style={s.noticeText}>{n}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 하단 버튼 */}
      {isHelper && (
        <View style={s.bottomBar}>
          <View style={s.priceWrap}>
            <Text style={s.priceLabel}>{tx('제안 금액', 'Proposed Price', 'Penawaran Harga')}</Text>
            <Text style={s.priceAmount}>Rp {errand.budget.toLocaleString()}</Text>
          </View>
          <TouchableOpacity
            style={[s.acceptBtn, accepted && s.acceptBtnDone]}
            onPress={handleAccept}
            disabled={accepted}
            activeOpacity={0.85}
          >
            <Text style={s.acceptBtnText}>
              {accepted ? tx('수락 완료', 'Accepted', 'Sudah Diterima') : tx('수락하기', 'Accept', 'Terima')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn:     { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.dark },
  scroll:      { paddingHorizontal: 20, paddingTop: 20, gap: 0 },

  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: '#FFF7ED', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 5, marginBottom: 12,
  },
  statusBadgeAccepted: { backgroundColor: Colors.accentLight },
  statusText:          { fontSize: 12, fontWeight: '700', color: '#F97316' },
  statusTextAccepted:  { color: Colors.accent },

  title: { fontSize: 20, fontWeight: '800', color: Colors.dark, lineHeight: 28, marginBottom: 12 },

  metaRow:  { flexDirection: 'row', gap: 16, marginBottom: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: Colors.grayLight },

  deadlineBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFF7ED', borderRadius: Radius.md,
    padding: 10, marginBottom: 20,
  },
  deadlineText: { fontSize: 13, fontWeight: '600', color: '#F97316' },

  section:      { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.dark, marginBottom: 10 },
  descText:     { fontSize: 15, color: Colors.dark, lineHeight: 24 },

  budgetCard: {
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.lg, padding: 16, marginBottom: 20,
    gap: 4,
  },
  budgetLabel:  { fontSize: 12, color: Colors.accent, fontWeight: '600' },
  budgetAmount: { fontSize: 24, fontWeight: '800', color: Colors.accent },
  budgetNote:   { fontSize: 11, color: Colors.accent, opacity: 0.7 },

  noticeBox: {
    backgroundColor: Colors.section, borderRadius: Radius.lg,
    padding: 16, gap: 6,
  },
  noticeTitle: { fontSize: 13, fontWeight: '700', color: Colors.dark, marginBottom: 4 },
  noticeItem:  { flexDirection: 'row', gap: 6 },
  noticeDot:   { fontSize: 13, color: Colors.grayLight },
  noticeText:  { flex: 1, fontSize: 12, color: Colors.gray, lineHeight: 18 },

  bottomBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    paddingBottom: 32,
    backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border,
    gap: 16,
  },
  priceWrap:   { flex: 1 },
  priceLabel:  { fontSize: 11, color: Colors.grayLight },
  priceAmount: { fontSize: 18, fontWeight: '800', color: Colors.dark },
  acceptBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.pill,
    paddingHorizontal: 28, paddingVertical: 13,
  },
  acceptBtnDone: { backgroundColor: Colors.borderMid },
  acceptBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
