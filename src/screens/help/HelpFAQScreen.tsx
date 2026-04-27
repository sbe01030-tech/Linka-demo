import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius } from '../../constants/colors';
import { useLanguageStore } from '../../store/languageStore';
import { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'HelpFAQ'>;

interface FAQItem { q: string; a: string }

const FAQ_ID: FAQItem[] = [
  { q: 'Bagaimana cara memesan ART di Linka?', a: 'Buka halaman Beranda, pilih ART yang sesuai, lalu klik tombol "Pesan Sekarang". Isi detail jadwal dan alamat, kemudian lakukan pembayaran DP 30% untuk mengamankan pesanan.' },
  { q: 'Apakah semua mitra Linka sudah terverifikasi?', a: 'Ya! Semua mitra Linka telah melewati proses verifikasi identitas, pengecekan latar belakang, dan pelatihan dasar. Setiap mitra juga memiliki asuransi ketenagakerjaan.' },
  { q: 'Bagaimana sistem pembayaran di Linka?', a: 'Kamu membayar DP 30% saat pemesanan untuk mengamankan jadwal. Sisa 70% dibayarkan setelah pekerjaan selesai dan kamu mengonfirmasi hasilnya. Dana aman di escrow selama proses berlangsung.' },
  { q: 'Apa yang terjadi jika ART tidak datang atau terlambat?', a: 'Jika mitra tidak datang, kamu akan mendapatkan refund penuh. Jika terlambat lebih dari 30 menit tanpa konfirmasi, kamu berhak membatalkan dan mendapat refund 100%.' },
  { q: 'Bagaimana cara membatalkan pesanan?', a: 'Buka tab Pesanan, pilih pesanan yang ingin dibatalkan, lalu tap "Batalkan". Kebijakan refund: >24 jam sebelum jadwal = refund 100%, <24 jam = refund 50%, setelah mitra tiba = tidak ada refund.' },
  { q: 'Apakah saya bisa meminta ART yang sama berulang kali?', a: 'Tentu! Kamu bisa menandai mitra sebagai favorit dan memesan langsung dari profil mereka. Pemesanan berulang juga lebih cepat karena data tersimpan.' },
  { q: 'Bagaimana jika ada barang yang rusak atau hilang?', a: 'Semua mitra Linka diasuransikan. Jika ada kejadian tidak diinginkan, hubungi tim Linka dalam 24 jam setelah kejadian dengan bukti foto. Klaim akan diproses dalam 3-5 hari kerja.' },
  { q: 'Bagaimana cara menghubungi customer service Linka?', a: 'Kamu bisa menghubungi kami melalui fitur Chat di aplikasi, email ke help@linka.id, atau WhatsApp ke 0812-LINKA-CS (Senin–Sabtu, 08.00–20.00 WIB).' },
];

const FAQ_EN: FAQItem[] = [
  { q: 'How do I book a housekeeper on Linka?', a: 'Open the Home page, choose a suitable helper, and tap "Book Now". Fill in the schedule and address, then pay a 30% deposit to secure your booking.' },
  { q: 'Are all Linka partners verified?', a: 'Yes! All Linka partners have passed identity verification, background checks, and basic training. Each partner also holds employment insurance.' },
  { q: 'How does payment work on Linka?', a: 'You pay a 30% deposit when booking to secure the schedule. The remaining 70% is paid after the job is done and you confirm completion. Funds are held in escrow throughout.' },
  { q: 'What if the helper doesn\'t show up or is late?', a: 'If the partner doesn\'t show up, you\'ll receive a full refund. If they\'re more than 30 minutes late without notice, you can cancel and receive a 100% refund.' },
  { q: 'How do I cancel an order?', a: 'Go to the Orders tab, select the order, and tap "Cancel". Refund policy: >24 hours before schedule = 100% refund, <24 hours = 50% refund, after partner arrives = no refund.' },
  { q: 'Can I rebook the same helper?', a: 'Absolutely! You can mark a partner as a favorite and book directly from their profile. Repeat bookings are also faster since your details are saved.' },
  { q: 'What if something is damaged or missing?', a: 'All Linka partners are insured. If something happens, contact Linka support within 24 hours with photo evidence. Claims are processed within 3–5 business days.' },
  { q: 'How do I contact Linka customer service?', a: 'You can reach us via the in-app Chat feature, email at help@linka.id, or WhatsApp at 0812-LINKA-CS (Mon–Sat, 08:00–20:00 WIB).' },
];

const FAQ_KO: FAQItem[] = [
  { q: 'Linka에서 ART를 예약하는 방법은?', a: '홈 화면에서 원하는 ART를 선택하고 "지금 예약" 버튼을 누르세요. 일정과 주소를 입력한 후 30% 계약금을 결제하면 예약이 확정됩니다.' },
  { q: '모든 Linka 파트너는 인증된 사람인가요?', a: '네! 모든 Linka 파트너는 신원 확인, 배경 조회, 기본 교육을 완료했습니다. 각 파트너는 고용보험도 가입되어 있습니다.' },
  { q: 'Linka의 결제 방식은 어떻게 되나요?', a: '예약 시 30% 계약금을 결제하여 일정을 확보합니다. 나머지 70%는 작업 완료 후 확인 시 결제됩니다. 에스크로로 안전하게 관리됩니다.' },
  { q: 'ART가 오지 않거나 늦으면 어떻게 되나요?', a: '파트너가 오지 않으면 전액 환불됩니다. 사전 연락 없이 30분 이상 늦으면 취소 후 100% 환불을 받을 수 있습니다.' },
  { q: '주문을 취소하는 방법은?', a: '주문 탭에서 취소할 주문을 선택 후 "취소"를 탭하세요. 환불 정책: 예정 24시간 초과 = 100% 환불, 24시간 미만 = 50% 환불, 파트너 도착 후 = 환불 없음.' },
  { q: '같은 ART를 다시 예약할 수 있나요?', a: '물론이죠! 파트너를 즐겨찾기에 추가하고 프로필에서 바로 예약할 수 있습니다. 재예약은 정보가 저장되어 더 빠릅니다.' },
  { q: '물건이 파손되거나 분실되면 어떻게 되나요?', a: '모든 Linka 파트너는 보험에 가입되어 있습니다. 사건 발생 24시간 이내에 사진 증거와 함께 고객센터에 연락하세요. 청구는 영업일 기준 3~5일 내 처리됩니다.' },
  { q: 'Linka 고객센터에 연락하는 방법은?', a: '앱 내 채팅, 이메일 help@linka.id, 또는 WhatsApp 0812-LINKA-CS (월~토, 08:00~20:00 WIB)로 연락해 주세요.' },
];

export default function HelpFAQScreen({ navigation }: Props) {
  const { lang } = useLanguageStore();
  const insets = useSafeAreaInsets();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = lang === 'ko' ? FAQ_KO : lang === 'en' ? FAQ_EN : FAQ_ID;

  const title = lang === 'ko' ? '도움말 & FAQ' : lang === 'en' ? 'Help & FAQ' : 'Bantuan & FAQ';
  const contactLabel = lang === 'ko' ? '고객센터 연락' : lang === 'en' ? 'Contact Support' : 'Hubungi Kami';

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{title}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Search hint */}
        <View style={s.searchHint}>
          <Ionicons name="help-circle-outline" size={36} color={Colors.accent} />
          <Text style={s.searchHintTitle}>
            {lang === 'ko' ? '무엇을 도와드릴까요?' : lang === 'en' ? 'How can we help?' : 'Ada yang bisa kami bantu?'}
          </Text>
          <Text style={s.searchHintSub}>
            {lang === 'ko' ? '아래에서 자주 묻는 질문을 확인하세요.' : lang === 'en' ? 'Browse frequently asked questions below.' : 'Temukan jawaban untuk pertanyaan yang sering ditanyakan.'}
          </Text>
        </View>

        {/* FAQ accordion */}
        <View style={s.faqList}>
          {faqs.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[s.faqItem, openIndex === i && s.faqItemOpen]}
              onPress={() => setOpenIndex(openIndex === i ? null : i)}
              activeOpacity={0.8}
            >
              <View style={s.faqQ}>
                <Text style={[s.faqQText, openIndex === i && s.faqQTextOpen]}>{item.q}</Text>
                <Ionicons
                  name={openIndex === i ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={openIndex === i ? Colors.accent : Colors.grayLight}
                />
              </View>
              {openIndex === i && (
                <Text style={s.faqA}>{item.a}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact CTA */}
        <View style={s.contactCard}>
          <View style={s.contactIcon}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color={Colors.white} />
          </View>
          <View style={s.contactInfo}>
            <Text style={s.contactTitle}>{contactLabel}</Text>
            <Text style={s.contactSub}>
              {lang === 'ko' ? '원하는 답을 찾지 못했나요? 직접 문의하세요.' : lang === 'en' ? 'Can\'t find what you need? Contact us directly.' : 'Tidak menemukan jawaban? Hubungi kami langsung.'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.accent} />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },

  header: {
    paddingHorizontal: 16, paddingBottom: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  backBtn:     { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.dark },

  scroll: { flex: 1 },

  searchHint: {
    alignItems: 'center', paddingVertical: 28, paddingHorizontal: 32, gap: 8,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  searchHintTitle: { fontSize: 18, fontWeight: '700', color: Colors.dark, textAlign: 'center' },
  searchHintSub:   { fontSize: 13, color: Colors.gray, textAlign: 'center', lineHeight: 19 },

  faqList: { paddingHorizontal: 16, paddingTop: 12 },

  faqItem: {
    borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: 8, overflow: 'hidden',
    backgroundColor: Colors.white,
  },
  faqItemOpen: { borderColor: Colors.accent + '50', backgroundColor: Colors.accentLight },

  faqQ: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  faqQText:     { flex: 1, fontSize: 14, fontWeight: '500', color: Colors.dark, lineHeight: 20 },
  faqQTextOpen: { color: Colors.accent, fontWeight: '600' },
  faqA: {
    fontSize: 13, color: Colors.darkMid, lineHeight: 21,
    paddingHorizontal: 16, paddingBottom: 16,
  },

  contactCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginHorizontal: 16, marginTop: 12,
    backgroundColor: Colors.section, borderRadius: Radius.lg,
    padding: 16, borderWidth: 1, borderColor: Colors.border,
  },
  contactIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  contactInfo: { flex: 1 },
  contactTitle: { fontSize: 14, fontWeight: '700', color: Colors.dark, marginBottom: 2 },
  contactSub:   { fontSize: 12, color: Colors.gray, lineHeight: 17 },
});
