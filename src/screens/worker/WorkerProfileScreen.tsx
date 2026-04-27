import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Image, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import LanguageSelector from '../../components/common/LanguageSelector';
import { RootStackParamList } from '../../types';
import {
  W1, W2, W3, W4, W5, W6, W7,
} from '../../constants/photos';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width: SW } = Dimensions.get('window');
const PHOTO_SIZE = (SW - 3) / 3; // 3-col grid, 1px gaps

// ── Mock portfolio photos ───────────────────────────────────────
const PORTFOLIO: string[] = [W1, W2, W4, W5, W6, W7];

// ── Helper services offered ────────────────────────────────────
const ALL_SERVICES = [
  { id: 'masak',   label: 'Masak',           color: '#FF6B35', bg: '#FFF0EB' },
  { id: 'bersih',  label: 'Bersih-bersih',   color: '#22C55E', bg: '#F0FDF4' },
  { id: 'cuci',    label: 'Cuci',            color: '#3B82F6', bg: '#EFF6FF' },
  { id: 'setrika', label: 'Setrika',         color: '#8B5CF6', bg: '#F5F3FF' },
  { id: 'beberes', label: 'Beberes',         color: Colors.helperColor, bg: '#FFFBEB' },
  { id: 'anak',    label: 'Jaga Anak',       color: '#EC4899', bg: '#FDF2F8' },
];

// ── Profile completion config ──────────────────────────────────
const COMPLETION_STEPS = [
  { key: 'photo',    label: 'Foto profil',   done: false },
  { key: 'bio',      label: 'Bio / Tentang', done: true  },
  { key: 'services', label: 'Layanan',       done: true  },
  { key: 'rate',     label: 'Tarif',         done: true  },
  { key: 'ktp',      label: 'KTP',           done: false },
  { key: 'bank',     label: 'Rekening',      done: false },
];

export default function WorkerProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { user, logout } = useAuthStore();
  const { t, lang }      = useLanguageStore();

  const [activeServices, setActiveServices] = useState<string[]>(['masak', 'bersih', 'beberes']);
  const [editingServices, setEditingServices] = useState(false);

  const COMING_SOON = lang === 'ko' ? '준비 중입니다.' : lang === 'en' ? 'Coming soon.' : 'Segera hadir.';

  const handleLogout = () => {
    Alert.alert(t.profile.logoutConfirm, t.profile.logoutMsg, [
      { text: t.profile.cancel, style: 'cancel' },
      { text: t.profile.logout, style: 'destructive', onPress: logout },
    ]);
  };

  const toggleService = (id: string) => {
    setActiveServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const initial    = user?.name?.charAt(0).toUpperCase() ?? 'W';
  const doneCount  = COMPLETION_STEPS.filter((s) => s.done).length;
  const completion = Math.round((doneCount / COMPLETION_STEPS.length) * 100);

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>

      {/* ── Cover photo ── */}
      <View style={s.coverWrap}>
        <Image source={{ uri: W3 }} style={s.coverImg} />
        <View style={s.coverOverlay} />
        <TouchableOpacity
          style={s.coverEditBtn}
          onPress={() => Alert.alert('', COMING_SOON)}
          activeOpacity={0.85}
        >
          <Ionicons name="camera-outline" size={14} color={Colors.white} />
          <Text style={s.coverEditText}>Edit sampul</Text>
        </TouchableOpacity>
      </View>

      {/* ── Profile avatar (overlapping cover) ── */}
      <View style={s.avatarSection}>
        <View style={s.avatarWrap}>
          <View style={s.avatarRing}>
            <View style={s.avatar}>
              <Text style={s.avatarInitial}>{initial}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={s.avatarCamBtn}
            onPress={() => Alert.alert('', COMING_SOON)}
            activeOpacity={0.85}
          >
            <Ionicons name="camera" size={12} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={s.nameBlock}>
          <View style={s.nameRow}>
            <Text style={s.userName}>{user?.name ?? 'Nama Lengkap'}</Text>
            <View style={s.verifiedChip}>
              <Ionicons name="checkmark-circle" size={12} color={Colors.accent} />
              <Text style={s.verifiedText}>{t.workerProfile.verified}</Text>
            </View>
          </View>
          <View style={s.locationRow}>
            <Ionicons name="location-outline" size={12} color={Colors.grayLight} />
            <Text style={s.locationText}>Jakarta Selatan, Indonesia</Text>
          </View>
          <Text style={s.bioText}>
            ART berpengalaman 4 tahun. Suka masak dan beberes rumah dengan teliti.
            Bisa jaga anak. 🌿
          </Text>
          <TouchableOpacity
            style={s.editBioBtn}
            onPress={() => navigation.navigate('EditProfile')}
            activeOpacity={0.8}
          >
            <Ionicons name="pencil-outline" size={12} color={Colors.gray} />
            <Text style={s.editBioText}>Edit profil</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Stats row ── */}
      <View style={s.statsRow}>
        {[
          { label: t.workerProfile.totalJobs, value: `${user?.totalJobs ?? 48}`, isRating: false },
          { label: t.workerHome.rating,        value: `${user?.rating ?? '4.8'}`, isRating: true },
          { label: t.workerProfile.experience, value: `4 ${t.workerProfile.years}`, isRating: false },
        ].map((stat, i, arr) => (
          <React.Fragment key={stat.label}>
            <View style={s.statCol}>
              {stat.isRating ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Ionicons name="star" size={16} color="#F59E0B" />
                  <Text style={s.statValue}>{stat.value}</Text>
                </View>
              ) : (
                <Text style={s.statValue}>{stat.value}</Text>
              )}
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
            {i < arr.length - 1 && <View style={s.statDivider} />}
          </React.Fragment>
        ))}
      </View>

      {/* ── Profile completion ── */}
      <View style={s.completionCard}>
        <View style={s.completionHeader}>
          <View>
            <Text style={s.completionTitle}>Kelengkapan profil</Text>
            <Text style={s.completionSub}>
              {COMING_SOON.startsWith('Segera')
                ? `${doneCount} dari ${COMPLETION_STEPS.length} langkah selesai`
                : `${doneCount} of ${COMPLETION_STEPS.length} steps done`}
            </Text>
          </View>
          <Text style={s.completionPct}>{completion}%</Text>
        </View>
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${completion}%` }]} />
        </View>
        <View style={s.completionSteps}>
          {COMPLETION_STEPS.map((step) => (
            <View key={step.key} style={s.completionStep}>
              <Ionicons
                name={step.done ? 'checkmark-circle' : 'ellipse-outline'}
                size={14}
                color={step.done ? Colors.accent : Colors.grayLight}
              />
              <Text
                style={[
                  s.completionStepText,
                  !step.done && s.completionStepPending,
                ]}
              >
                {step.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── My services ── */}
      <View style={s.section}>
        <View style={s.sectionHeaderRow}>
          <Text style={s.sectionTitle}>Layanan saya</Text>
          <TouchableOpacity
            onPress={() => setEditingServices((v) => !v)}
            style={s.editBtn}
            activeOpacity={0.8}
          >
            <Ionicons
              name={editingServices ? 'checkmark-outline' : 'pencil-outline'}
              size={13}
              color={Colors.gray}
            />
            <Text style={s.editBtnText}>{editingServices ? 'Simpan' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>
        <View style={s.servicesWrap}>
          {ALL_SERVICES.map((svc) => {
            const active = activeServices.includes(svc.id);
            return (
              <TouchableOpacity
                key={svc.id}
                style={[
                  s.svcChip,
                  active
                    ? { backgroundColor: svc.bg, borderColor: svc.color + '60' }
                    : { opacity: editingServices ? 0.5 : 0.35 },
                ]}
                onPress={() => editingServices && toggleService(svc.id)}
                activeOpacity={editingServices ? 0.7 : 1}
              >
                <Text style={[s.svcChipText, active && { color: svc.color }]}>
                  {svc.label}
                </Text>
                {editingServices && (
                  <Ionicons
                    name={active ? 'checkmark-circle' : 'add-circle-outline'}
                    size={14}
                    color={active ? svc.color : Colors.grayLight}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Rate card ── */}
      <View style={s.section}>
        <View style={s.sectionHeaderRow}>
          <Text style={s.sectionTitle}>{t.workerProfile.myRate}</Text>
          <TouchableOpacity
            onPress={() => Alert.alert(t.workerProfile.myRate, COMING_SOON)}
            style={s.editBtn}
            activeOpacity={0.8}
          >
            <Ionicons name="pencil-outline" size={13} color={Colors.gray} />
            <Text style={s.editBtnText}>{t.workerProfile.change}</Text>
          </TouchableOpacity>
        </View>
        <View style={s.rateCard}>
          <View style={s.rateCol}>
            <Text style={s.ratePer}>{t.workerProfile.perHour}</Text>
            <Text style={s.rateValue}>Rp 30.000</Text>
          </View>
          <View style={s.rateDivider} />
          <View style={s.rateCol}>
            <Text style={s.ratePer}>{t.workerProfile.perDay}</Text>
            <Text style={s.rateValue}>Rp 200.000</Text>
          </View>
          <View style={s.rateDivider} />
          <View style={s.rateCol}>
            <Text style={s.ratePer}>Min. jam</Text>
            <Text style={s.rateValue}>3 jam</Text>
          </View>
        </View>
      </View>

      {/* ── Portfolio photos ── */}
      <View style={[s.section, { paddingHorizontal: 0 }]}>
        <View style={[s.sectionHeaderRow, { paddingHorizontal: 16 }]}>
          <Text style={s.sectionTitle}>Portofolio saya</Text>
          <TouchableOpacity
            onPress={() => Alert.alert('', COMING_SOON)}
            style={s.editBtn}
            activeOpacity={0.8}
          >
            <Ionicons name="add-outline" size={14} color={Colors.gray} />
            <Text style={s.editBtnText}>Tambah foto</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.portfolioHint}>
          Foto pekerjaanmu membantu pelanggan memilih kamu ✨
        </Text>

        {/* 3-column grid */}
        <View style={s.photoGrid}>
          {PORTFOLIO.map((uri, i) => (
            <TouchableOpacity
              key={i}
              style={s.photoCell}
              onPress={() => Alert.alert('', COMING_SOON)}
              activeOpacity={0.85}
            >
              <Image source={{ uri }} style={s.photoImg} />
            </TouchableOpacity>
          ))}
          {/* Add photo button */}
          <TouchableOpacity
            style={[s.photoCell, s.photoAddCell]}
            onPress={() => Alert.alert('', COMING_SOON)}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={28} color={Colors.grayLight} />
            <Text style={s.photoAddText}>Tambah</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Documents / Registration ── */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Dokumen & Registrasi</Text>
        <View style={s.docsCard}>
          {[
            {
              icon: 'id-card-outline' as const,
              label: 'KTP / Identitas',
              sub: 'Dibutuhkan untuk verifikasi',
              status: 'Belum diunggah',
              statusColor: Colors.danger,
              bg: '#FEF2F2',
            },
            {
              icon: 'card-outline' as const,
              label: t.workerProfile.bankAccount,
              sub: 'Untuk pencairan penghasilan',
              status: 'Belum terdaftar',
              statusColor: Colors.danger,
              bg: '#FEF2F2',
            },
            {
              icon: 'shield-checkmark-outline' as const,
              label: 'BPJS Ketenagakerjaan',
              sub: 'Opsional — tingkatkan kepercayaan',
              status: 'Belum diunggah',
              statusColor: Colors.grayLight,
              bg: Colors.section,
            },
          ].map((doc, i, arr) => (
            <TouchableOpacity
              key={doc.label}
              style={[s.docRow, i < arr.length - 1 && s.docRowBorder]}
              onPress={() => Alert.alert(doc.label, COMING_SOON)}
              activeOpacity={0.75}
            >
              <View style={[s.docIconWrap, { backgroundColor: doc.bg }]}>
                <Ionicons name={doc.icon} size={18} color={doc.statusColor} />
              </View>
              <View style={s.docInfo}>
                <Text style={s.docLabel}>{doc.label}</Text>
                <Text style={s.docSub}>{doc.sub}</Text>
              </View>
              <View style={s.docStatusWrap}>
                <Text style={[s.docStatus, { color: doc.statusColor }]}>{doc.status}</Text>
                <Ionicons name="chevron-forward" size={14} color={Colors.grayLight} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Menu rows ── */}
      <View style={s.section}>
        <View style={s.menuCard}>
          {[
            { icon: 'star-outline' as const,         label: t.workerProfile.reviews },
            { icon: 'help-circle-outline' as const,  label: t.workerProfile.help },
          ].map((item, i, arr) => (
            <TouchableOpacity
              key={item.label}
              style={[s.menuRow, i < arr.length - 1 && s.menuRowBorder]}
              onPress={() => {
                if (item.label === t.workerProfile.help) navigation.navigate('HelpFAQ');
                else Alert.alert(item.label, COMING_SOON);
              }}
              activeOpacity={0.75}
            >
              <Ionicons name={item.icon} size={16} color={Colors.grayLight} />
              <Text style={s.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.grayLight} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Language selector */}
        <View style={s.menuCard}>
          <LanguageSelector variant="row" />
        </View>
      </View>

      {/* ── Logout ── */}
      <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={15} color={Colors.gray} />
        <Text style={s.logoutText}>{t.profile.logout}</Text>
      </TouchableOpacity>

      <Text style={s.version}>{t.profile.version}</Text>
      <View style={{ height: 48 }} />
    </ScrollView>
  );
}

const AMBER = Colors.helperColor;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },

  // ── Cover ──
  coverWrap: { width: '100%', height: 180, position: 'relative' },
  coverImg:  { width: '100%', height: '100%', resizeMode: 'cover' },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  coverEditBtn: {
    position: 'absolute', bottom: 12, right: 14,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: Radius.pill,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  coverEditText: { fontSize: 12, color: Colors.white, fontWeight: '500' },

  // ── Avatar section ──
  avatarSection: { paddingHorizontal: 16, paddingBottom: 8, marginTop: -40 },
  avatarWrap:    { position: 'relative', alignSelf: 'flex-start', marginBottom: 12 },
  avatarRing: {
    width: 84, height: 84, borderRadius: 42,
    borderWidth: 3, borderColor: Colors.white,
    backgroundColor: Colors.white,
    ...Shadow.sm,
  },
  avatar: {
    width: 78, height: 78, borderRadius: 39,
    backgroundColor: AMBER + '20',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { fontSize: 30, fontWeight: '700', color: AMBER },
  avatarCamBtn: {
    position: 'absolute', bottom: 2, right: 2,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: AMBER,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.white,
  },

  nameBlock:   {},
  nameRow:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  userName:    { fontSize: 20, fontWeight: '700', color: Colors.dark },
  verifiedChip: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.pill,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  verifiedText: { fontSize: 11, fontWeight: '600', color: Colors.accent },
  locationRow:  { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  locationText: { fontSize: 12, color: Colors.grayLight },
  bioText: {
    fontSize: 13, color: Colors.gray, lineHeight: 20, marginBottom: 10,
  },
  editBioBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: Colors.section,
    borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  editBioText: { fontSize: 12, color: Colors.gray, fontWeight: '500' },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16, paddingVertical: 18,
    borderTopWidth: 1, borderTopColor: Colors.border,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  statCol:     { flex: 1, alignItems: 'center', gap: 3 },
  statDivider: { width: 1, backgroundColor: Colors.border, marginVertical: 4 },
  statValue:   { fontSize: 18, fontWeight: '700', color: Colors.dark },
  statLabel:   { fontSize: 11, color: Colors.gray, textAlign: 'center' },

  // ── Completion ──
  completionCard: {
    marginHorizontal: 16, marginTop: 20,
    backgroundColor: Colors.section,
    borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    padding: 16,
  },
  completionHeader: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    marginBottom: 10,
  },
  completionTitle: { fontSize: 14, fontWeight: '700', color: Colors.dark, marginBottom: 2 },
  completionSub:   { fontSize: 12, color: Colors.gray },
  completionPct:   { fontSize: 22, fontWeight: '800', color: AMBER },
  progressTrack: {
    height: 6, backgroundColor: Colors.border, borderRadius: 3,
    overflow: 'hidden', marginBottom: 12,
  },
  progressFill: {
    height: '100%', backgroundColor: AMBER, borderRadius: 3,
  },
  completionSteps: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  completionStep:  { flexDirection: 'row', alignItems: 'center', gap: 5 },
  completionStepText:    { fontSize: 12, color: Colors.dark },
  completionStepPending: { color: Colors.grayLight },

  // ── Section ──
  section: { paddingHorizontal: 16, paddingTop: 24, gap: 12 },
  sectionHeaderRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.dark },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.section,
    borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  editBtnText: { fontSize: 12, color: Colors.gray, fontWeight: '500' },

  portfolioHint: {
    fontSize: 12, color: Colors.grayLight,
    paddingHorizontal: 16, marginTop: -4,
  },

  // ── Services chips ──
  servicesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  svcChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.section,
    borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  svcChipText: { fontSize: 13, fontWeight: '500', color: Colors.gray },

  // ── Rate card ──
  rateCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.section,
    borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border,
    padding: 16,
  },
  rateCol:     { flex: 1, alignItems: 'center' },
  rateDivider: { width: 1, height: 32, backgroundColor: Colors.border },
  ratePer:     { fontSize: 11, color: Colors.gray, marginBottom: 4 },
  rateValue:   { fontSize: 16, fontWeight: '700', color: Colors.dark },

  // ── Photo grid ──
  photoGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 1.5,
    marginTop: 4,
  },
  photoCell: { width: PHOTO_SIZE, height: PHOTO_SIZE },
  photoImg:  { width: '100%', height: '100%', resizeMode: 'cover' },
  photoAddCell: {
    backgroundColor: Colors.section,
    alignItems: 'center', justifyContent: 'center',
    gap: 4,
  },
  photoAddText: { fontSize: 11, color: Colors.grayLight, fontWeight: '500' },

  // ── Docs ──
  docsCard: {
    backgroundColor: Colors.section,
    borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden',
  },
  docRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 14, paddingVertical: 14,
  },
  docRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  docIconWrap: {
    width: 38, height: 38, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  docInfo: { flex: 1 },
  docLabel: { fontSize: 13, fontWeight: '600', color: Colors.dark, marginBottom: 2 },
  docSub:   { fontSize: 11, color: Colors.grayLight },
  docStatusWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  docStatus:     { fontSize: 11, fontWeight: '500' },

  // ── Menu ──
  menuCard: {
    backgroundColor: Colors.section,
    borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, gap: 12,
  },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuLabel: { flex: 1, fontSize: 14, color: Colors.dark, fontWeight: '400' },

  // ── Logout ──
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginHorizontal: 16, marginTop: 24,
    paddingVertical: 13, borderRadius: Radius.pill,
    borderWidth: 1, borderColor: Colors.borderMid,
  },
  logoutText: { fontSize: 14, fontWeight: '500', color: Colors.gray },

  version: { textAlign: 'center', fontSize: 12, color: Colors.grayLight, marginTop: 20 },
});
