import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { W1, W2, W3, W4, W5, W6, W7, W8, C1, C2, C3 } from '../../constants/photos';
import { RootStackParamList, Worker } from '../../types';
import { useLanguageStore } from '../../store/languageStore';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkerDetail'>;

// Same mock data as HomeScreen
const MOCK_WORKERS: Worker[] = [
  {
    id: 'w1', name: 'Sari Dewi', phone: '0812-3456-7890', role: 'helper', serviceType: 'helper',
    serviceFrequency: 'regular',
    photo: W1,
    pricePerHour: 30000, pricePerDay: 200000,
    location: 'Kebayoran, Jakarta Selatan', bio: 'ART berpengalaman 10 tahun. Bisa masak (masakan Indonesia & Western), cuci, setrika, dan beberes. Banyak pengalaman di keluarga dengan anak kecil.',
    skills: ['Masak', 'Cuci', 'Setrika', 'Beberes'],
    isAvailable: true, rating: 5.0, totalJobs: 312, isVerified: true, experienceYears: 10,
  },
  {
    id: 'w2', name: 'Rina Wulandari', phone: '0813-4567-8901', role: 'helper', serviceType: 'helper',
    serviceFrequency: 'regular',
    photo: W2,
    pricePerHour: 25000, pricePerDay: 160000,
    location: 'Cilandak, Jakarta Selatan', bio: 'Spesialis masak menu sehat harian dan bersih-bersih. Sudah 7 tahun pengalaman, jujur dan tepat waktu.',
    skills: ['Masak Sehat', 'Beberes', 'Cuci'],
    isAvailable: true, rating: 4.9, totalJobs: 198, isVerified: true, experienceYears: 7,
  },
  {
    id: 'w3', name: 'Dewi Anggraeni', phone: '0816-7890-1234', role: 'helper', serviceType: 'helper',
    serviceFrequency: 'both',
    photo: W3,
    pricePerHour: 28000, pricePerDay: 180000,
    location: 'Kemang, Jakarta Selatan', bio: 'Berpengalaman di keluarga dengan anak kecil. Sabar & telaten. Bisa masak, cuci, dan jaga anak.',
    skills: ['Masak', 'Cuci', 'Perawatan Anak'],
    isAvailable: true, rating: 4.7, totalJobs: 156, isVerified: true, experienceYears: 5,
  },
  {
    id: 'w4', name: 'Fitri Handayani', phone: '0815-6789-0123', role: 'helper', serviceType: 'helper',
    serviceFrequency: 'regular',
    photo: W4,
    pricePerHour: 27000, pricePerDay: 175000,
    location: 'Fatmawati, Jakarta Selatan', bio: 'Teliti dan jujur. Sudah kerja di 3 keluarga expat. Bisa masak Western & Indonesia.',
    skills: ['Masak', 'Setrika', 'Beberes'],
    isAvailable: true, rating: 4.9, totalJobs: 227, isVerified: true, experienceYears: 8,
  },
  {
    id: 'w5', name: 'Indah Lestari', phone: '0817-8901-2345', role: 'helper', serviceType: 'helper',
    serviceFrequency: 'special',
    photo: W5,
    pricePerHour: 35000, pricePerDay: 220000,
    location: 'Pondok Indah, Jakarta Selatan', bio: 'Spesialis bersih-bersih deep cleaning & pasca renovasi. Cepat dan rapi.',
    skills: ['Deep Cleaning', 'Beberes', 'Cuci'],
    isAvailable: true, rating: 4.8, totalJobs: 89, isVerified: true, experienceYears: 3,
  },
  {
    id: 'w6', name: 'Nur Aini Susanti', phone: '0818-9012-3456', role: 'helper', serviceType: 'helper',
    serviceFrequency: 'special',
    photo: W6,
    pricePerHour: 40000, pricePerDay: 260000,
    location: 'BSD, Tangerang Selatan', bio: 'Jasa catering & masak untuk acara keluarga. Bisa menu pernikahan, arisan, dan ulang tahun.',
    skills: ['Catering', 'Masak Acara', 'Masak Indonesia'],
    isAvailable: true, rating: 4.9, totalJobs: 143, isVerified: true, experienceYears: 6,
  },
  {
    id: 'w7', name: 'Siti Rahayu', phone: '0819-0123-4567', role: 'helper', serviceType: 'helper',
    serviceFrequency: 'regular',
    photo: W7,
    pricePerHour: 22000, pricePerDay: 140000,
    location: 'Ciputat, Tangerang Selatan', bio: 'ART tinggal atau harian. Pengalaman 5 tahun, suka bekerja dengan anak-anak.',
    skills: ['Masak', 'Cuci', 'Jaga Anak', 'Setrika'],
    isAvailable: true, rating: 4.6, totalJobs: 178, isVerified: false, experienceYears: 5,
  },
  {
    id: 'w8', name: 'Wulandari Putri', phone: '0820-1234-5678', role: 'helper', serviceType: 'helper',
    serviceFrequency: 'special',
    photo: W8,
    pricePerHour: 45000, pricePerDay: 290000,
    location: 'Pamulang, Tangerang Selatan', bio: 'Spesialis setrika & laundry kilat. Baju selesai rapi dalam 1 hari.',
    skills: ['Setrika', 'Cuci', 'Laundry Kilat'],
    isAvailable: false, rating: 4.8, totalJobs: 302, isVerified: true, experienceYears: 7,
  },
];

const MOCK_REVIEWS = [
  { id: 'r1', name: 'Bunda Wulan', photo: C1, rating: 5, text: 'Mbak Sari sangat teliti dan bersih sekali masakannya. Pasti akan dipanggil lagi!', date: '2 hari lalu' },
  { id: 'r2', name: 'Bunda Hana',  photo: C2, rating: 5, text: 'Tepat waktu dan rumah jadi bersih banget. Anak-anak juga suka!', date: '1 minggu lalu' },
  { id: 'r3', name: 'Bunda Tari',  photo: C3, rating: 4, text: 'Ramah dan profesional. Masakannya enak, keluarga puas.', date: '2 minggu lalu' },
];

export default function WorkerDetailScreen({ navigation, route }: Props) {
  const { workerId } = route.params;
  const { t } = useLanguageStore();
  const worker = MOCK_WORKERS.find((w) => w.id === workerId) ?? MOCK_WORKERS[0];
  const [duration, setDuration] = useState(4);

  const depositRate = 0.3; // 30% deposit
  const totalPrice  = worker.pricePerHour * duration;
  const deposit     = Math.ceil(totalPrice * depositRate / 1000) * 1000;
  const remaining   = totalPrice - deposit;

  const isTutor = worker.serviceType === 'tutor';

  const handleBook = () => {
    Alert.alert(
      t.workerDetail.confirmTitle,
      t.workerDetail.confirmMsg,
      [
        { text: t.profile.cancel, style: 'cancel' },
        {
          text: t.workerDetail.confirmBook,
          onPress: () => {
            Alert.alert(t.workerDetail.bookSuccess, t.workerDetail.bookSuccessMsg, [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          },
        },
      ]
    );
  };

  const handleChat = () => {
    navigation.navigate('ChatDetail', {
      chatId: `chat_${worker.id}`,
      name: worker.name,
      photo: worker.photo,
      role: worker.role,
    });
  };

  return (
    <View style={s.root}>
      {/* Back button overlay */}
      <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color={Colors.dark} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero — photo + identity */}
        <View style={s.hero}>
          {worker.photo ? (
            <Image source={{ uri: worker.photo }} style={s.heroPhoto} />
          ) : (
            <View style={[s.heroPhoto, s.heroPhotoFallback]}>
              <Text style={s.heroPhotoLetter}>{worker.name.charAt(0)}</Text>
            </View>
          )}
          <View style={s.heroInfo}>
            <View style={s.heroNameRow}>
              <Text style={s.heroName}>{worker.name}</Text>
              {worker.isVerified && (
                <Ionicons name="checkmark-circle" size={18} color={Colors.accent} />
              )}
            </View>
            <View style={s.heroMeta}>
              <Ionicons name="location-outline" size={13} color={Colors.grayLight} />
              <Text style={s.heroMetaText}>{worker.location}</Text>
            </View>
            <View style={s.heroPillsRow}>
              <View style={[s.pill, { backgroundColor: isTutor ? Colors.tutorLight : Colors.helperLight }]}>
                <Ionicons
                  name={isTutor ? 'school-outline' : 'home-outline'}
                  size={11}
                  color={isTutor ? Colors.tutorColor : Colors.helperColor}
                />
                <Text style={[s.pillText, { color: isTutor ? Colors.tutorColor : Colors.helperColor }]}>
                  {isTutor ? t.services.tutorFull : t.services.art}
                </Text>
              </View>
              <View style={s.pill}>
                <Ionicons name="star" size={11} color={Colors.accent} />
                <Text style={s.pillText}>{worker.rating} rating</Text>
              </View>
              <View style={[s.pill, { backgroundColor: worker.isAvailable ? '#F0FDF4' : Colors.section }]}>
                <View style={[s.availDot, { backgroundColor: worker.isAvailable ? Colors.success : Colors.grayLight }]} />
                <Text style={[s.pillText, { color: worker.isAvailable ? Colors.success : Colors.grayLight }]}>
                  {worker.isAvailable ? t.workerDetail.available : t.workerDetail.busy}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={s.statsCard}>
          {[
            { label: t.workerDetail.jobsDone, value: `${worker.totalJobs}` },
            { label: t.workerHome.rating,     value: `${worker.rating}` },
            { label: t.workerDetail.expYears, value: `${worker.experienceYears}` },
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

        {/* About */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>{t.workerDetail.about}</Text>
          <Text style={s.bioText}>{worker.bio}</Text>
        </View>

        {/* Subjects / Skills */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>{isTutor ? t.services.lesTutor : t.workerDetail.skills}</Text>
          <View style={s.skillsWrap}>
            {(isTutor ? worker.subjects : worker.skills)?.map((item) => (
              <View key={item} style={[s.skillPill, isTutor && s.tutorPill]}>
                <Text style={[s.skillText, isTutor && s.tutorPillText]}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Booking calculator */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>{t.workerDetail.calcTitle}</Text>
          <View style={s.calcCard}>
            {/* Duration picker */}
            <View style={s.calcRow}>
              <Text style={s.calcLabel}>{t.workerDetail.duration}</Text>
              <View style={s.durationPicker}>
                <TouchableOpacity
                  style={s.durationBtn}
                  onPress={() => setDuration((d) => Math.max(1, d - 1))}
                >
                  <Ionicons name="remove" size={16} color={Colors.dark} />
                </TouchableOpacity>
                <Text style={s.durationVal}>{duration}</Text>
                <TouchableOpacity
                  style={s.durationBtn}
                  onPress={() => setDuration((d) => Math.min(12, d + 1))}
                >
                  <Ionicons name="add" size={16} color={Colors.dark} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={s.calcDivider} />

            <View style={s.calcRow}>
              <Text style={s.calcLabel}>{t.workerDetail.ratePerHour}</Text>
              <Text style={s.calcVal}>Rp {worker.pricePerHour.toLocaleString('id-ID')}</Text>
            </View>
            <View style={s.calcRow}>
              <Text style={s.calcLabel}>{t.orders.total}</Text>
              <Text style={s.calcValBold}>Rp {totalPrice.toLocaleString('id-ID')}</Text>
            </View>

            <View style={s.calcDivider} />

            {/* Deposit breakdown */}
            <View style={s.depositInfo}>
              <Ionicons name="shield-checkmark-outline" size={14} color={Colors.accent} />
              <Text style={s.depositInfoText}>{t.workerDetail.escrowSystem}</Text>
            </View>
            <View style={s.calcRow}>
              <Text style={s.calcLabel}>{t.workerDetail.depositNow}</Text>
              <Text style={[s.calcVal, { color: Colors.accent }]}>Rp {deposit.toLocaleString('id-ID')}</Text>
            </View>
            <View style={s.calcRow}>
              <Text style={s.calcLabel}>{t.workerDetail.remainingAfter}</Text>
              <Text style={s.calcVal}>Rp {remaining.toLocaleString('id-ID')}</Text>
            </View>
            <Text style={s.depositNote}>{t.workerDetail.escrowNote}</Text>
          </View>
        </View>

        {/* Reviews */}
        <View style={s.section}>
          <View style={s.reviewHeader}>
            <Text style={s.sectionTitle}>{t.workerDetail.reviews}</Text>
            <View style={s.ratingBadge}>
              <Ionicons name="star" size={12} color={Colors.accent} />
              <Text style={s.ratingBadgeText}>{worker.rating}</Text>
            </View>
          </View>
          {MOCK_REVIEWS.map((rv) => (
            <View key={rv.id} style={s.reviewCard}>
              <View style={s.reviewTop}>
                <Image source={{ uri: rv.photo }} style={s.reviewAvatar} />
                <View style={{ flex: 1 }}>
                  <Text style={s.reviewName}>{rv.name}</Text>
                  <View style={s.starsRow}>
                    {Array.from({ length: rv.rating }).map((_, i) => (
                      <Ionicons key={i} name="star" size={11} color={Colors.accent} />
                    ))}
                    <Text style={s.reviewDate}>{rv.date}</Text>
                  </View>
                </View>
              </View>
              <Text style={s.reviewText}>{rv.text}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={s.bottomBar}>
        <TouchableOpacity style={s.chatBtn} onPress={handleChat} activeOpacity={0.8}>
          <Ionicons name="chatbubble-ellipses-outline" size={18} color={Colors.accent} />
          <Text style={s.chatBtnText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.bookBtn, !worker.isAvailable && s.bookBtnDisabled]}
          onPress={handleBook}
          activeOpacity={0.85}
          disabled={!worker.isAvailable}
        >
          <Text style={s.bookBtnText}>
            {worker.isAvailable ? `${t.workerDetail.bookNow} · Rp ${deposit.toLocaleString('id-ID')} DP` : t.workerDetail.notAvailable}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },

  backBtn: {
    position: 'absolute', top: 52, left: 16, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.sm,
  },

  // Hero
  hero: {
    paddingTop: 80, paddingHorizontal: 20, paddingBottom: 20,
    flexDirection: 'row', gap: 16, alignItems: 'flex-start',
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  heroPhoto: { width: 88, height: 88, borderRadius: 44 },
  heroPhotoFallback: {
    backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center',
  },
  heroPhotoLetter: { fontSize: 32, fontWeight: '700', color: Colors.accent },
  heroInfo:   { flex: 1 },
  heroNameRow:{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 },
  heroName:   { fontSize: 20, fontWeight: '700', color: Colors.dark },
  heroMeta:   { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  heroMetaText: { fontSize: 13, color: Colors.gray },
  heroPillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.section, borderRadius: Radius.pill,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: Colors.border,
  },
  pillText:  { fontSize: 11, fontWeight: '600', color: Colors.gray },
  availDot:  { width: 6, height: 6, borderRadius: 3 },

  // Stats
  statsCard: {
    flexDirection: 'row', paddingVertical: 20,
    marginHorizontal: 20, marginTop: 20,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  statCol:     { flex: 1, alignItems: 'center', gap: 4 },
  statDivider: { width: 1, backgroundColor: Colors.border, marginVertical: 4 },
  statValue:   { fontSize: 20, fontWeight: '700', color: Colors.dark },
  statLabel:   { fontSize: 11, color: Colors.gray },

  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.dark, marginBottom: 12 },

  bioText: { fontSize: 14, color: Colors.gray, lineHeight: 22 },

  detailBlock: {
    backgroundColor: Colors.section, borderRadius: Radius.lg,
    paddingHorizontal: 16, paddingVertical: 12, gap: 10,
    borderWidth: 1, borderColor: Colors.border,
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailText: { fontSize: 14, color: Colors.dark },

  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillPill: {
    backgroundColor: Colors.accentLight, borderRadius: Radius.pill,
    paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1, borderColor: Colors.accent + '30',
  },
  skillText: { fontSize: 13, fontWeight: '600', color: Colors.accent },
  tutorPill: {
    backgroundColor: Colors.tutorLight,
    borderColor: Colors.tutorColor + '30',
  },
  tutorPillText: { color: Colors.tutorColor },

  // Booking calc
  calcCard: {
    backgroundColor: Colors.section, borderRadius: Radius.lg,
    padding: 16, borderWidth: 1, borderColor: Colors.border, gap: 10,
  },
  calcRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  calcLabel:   { fontSize: 14, color: Colors.gray },
  calcVal:     { fontSize: 14, fontWeight: '600', color: Colors.dark },
  calcValBold: { fontSize: 16, fontWeight: '700', color: Colors.dark },
  calcDivider: { height: 1, backgroundColor: Colors.border },

  durationPicker: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  durationBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  durationVal: { fontSize: 18, fontWeight: '700', color: Colors.dark, minWidth: 24, textAlign: 'center' },

  depositInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  depositInfoText: { fontSize: 12, fontWeight: '700', color: Colors.accent },
  depositNote: { fontSize: 11, color: Colors.gray, lineHeight: 16, marginTop: 2 },

  // Reviews
  reviewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.accentLight, borderRadius: Radius.pill,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  ratingBadgeText: { fontSize: 13, fontWeight: '700', color: Colors.accent },

  reviewCard: {
    backgroundColor: Colors.section, borderRadius: Radius.lg,
    padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: Colors.border,
  },
  reviewTop:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reviewAvatar:{ width: 36, height: 36, borderRadius: 18 },
  reviewName:  { fontSize: 13, fontWeight: '700', color: Colors.dark, marginBottom: 3 },
  starsRow:    { flexDirection: 'row', alignItems: 'center', gap: 2 },
  reviewDate:  { fontSize: 11, color: Colors.grayLight, marginLeft: 6 },
  reviewText:  { fontSize: 13, color: Colors.gray, lineHeight: 20 },

  // Bottom bar
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 10,
    backgroundColor: Colors.white,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28,
    borderTopWidth: 1, borderTopColor: Colors.border,
    ...Shadow.md,
  },
  chatBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 13, paddingHorizontal: 18,
    borderRadius: Radius.pill,
    borderWidth: 1.5, borderColor: Colors.accent,
    backgroundColor: Colors.accentLight,
  },
  chatBtnText: { fontSize: 14, fontWeight: '700', color: Colors.accent },
  bookBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 14,
    borderRadius: Radius.pill, backgroundColor: Colors.accent,
  },
  bookBtnDisabled: { backgroundColor: Colors.grayLight },
  bookBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});
