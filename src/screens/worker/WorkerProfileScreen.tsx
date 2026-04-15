import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import LanguageSelector from '../../components/common/LanguageSelector';

type MenuIcon =
  | 'create-outline'       | 'car-outline'
  | 'construct-outline'    | 'document-text-outline'
  | 'wallet-outline'       | 'star-outline'
  | 'help-circle-outline';

export default function WorkerProfileScreen() {
  const { user, logout } = useAuthStore();
  const { t }            = useLanguageStore();
  const isDriver         = user?.role === 'tutor';

  const STATS = [
    { label: t.workerProfile.totalJobs,  value: `${user?.totalJobs ?? 0}` },
    { label: t.workerHome.rating,        value: `${user?.rating ?? '–'}` },
    { label: t.workerProfile.experience, value: `4 ${t.workerProfile.years}` },
  ];

  const MENU: { icon: MenuIcon; label: string }[] = [
    { icon: 'create-outline',        label: t.workerProfile.editProfile },
    { icon: isDriver ? 'car-outline' : 'construct-outline', label: isDriver ? t.workerProfile.vehicleInfo : t.workerProfile.skillsServices },
    { icon: 'document-text-outline', label: t.workerProfile.documents },
    { icon: 'wallet-outline',        label: t.workerProfile.bankAccount },
    { icon: 'star-outline',          label: t.workerProfile.reviews },
    { icon: 'help-circle-outline',   label: t.workerProfile.help },
  ];

  const handleLogout = () => {
    Alert.alert(t.profile.logoutConfirm, t.profile.logoutMsg, [
      { text: t.profile.cancel, style: 'cancel' },
      { text: t.profile.logout, style: 'destructive', onPress: logout },
    ]);
  };

  const initial = user?.name?.charAt(0).toUpperCase() ?? 'W';

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.pageTitle}>{t.workerProfile.editProfile}</Text>
      </View>

      {/* Profile card */}
      <View style={s.profileCard}>
        {/* Avatar: rounded-full ring-2 ring-gray-100 */}
        <View style={s.avatarWrap}>
          <View style={s.avatar}>
            <Text style={s.avatarInitial}>{initial}</Text>
          </View>
          <TouchableOpacity style={s.cameraBtn}>
            <Ionicons name="camera-outline" size={13} color={Colors.gray} />
          </TouchableOpacity>
        </View>
        {/* text-2xl font-normal */}
        <Text style={s.userName}>{user?.name}</Text>
        <Text style={s.userPhone}>{user?.phone}</Text>
        <View style={s.roleChip}>
          <Text style={s.roleChipText}>
            {isDriver ? 'Guru Les Privat' : 'ART'}
          </Text>
        </View>
      </View>

      {/* Stats — one white card, 3 columns */}
      <View style={s.statsCard}>
        {STATS.map((stat, i, arr) => (
          <React.Fragment key={stat.label}>
            <View style={s.statCol}>
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
            {i < arr.length - 1 && <View style={s.statDivider} />}
          </React.Fragment>
        ))}
      </View>

      {/* Rate card — bg-gray-50 rounded-xl */}
      <View style={s.rateCard}>
        <Text style={s.rateTitle}>{t.workerProfile.myRate}</Text>
        <View style={s.rateRow}>
          <View style={s.rateItem}>
            <Text style={s.rateLabel}>{t.workerProfile.perHour}</Text>
            <Text style={s.rateValue}>Rp 30.000</Text>
          </View>
          {!isDriver && (
            <View style={s.rateItem}>
              <Text style={s.rateLabel}>{t.workerProfile.perDay}</Text>
              <Text style={s.rateValue}>Rp 200.000</Text>
            </View>
          )}
          {/* Secondary: rounded-full border border-gray-200 */}
          <TouchableOpacity style={s.changeBtn} activeOpacity={0.8}>
            <Text style={s.changeBtnText}>{t.workerProfile.change}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu list — bg-gray-50 rounded-xl, divide-y */}
      <View style={s.menuSection}>
        <View style={s.menuList}>
          {MENU.map((item, i) => (
            <TouchableOpacity key={i} style={s.menuRow} activeOpacity={0.75}>
              <Ionicons name={item.icon} size={16} color={Colors.grayLight} />
              <Text style={s.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.grayLight} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Language selector as a row */}
        <View style={s.menuList}>
          <LanguageSelector variant="row" />
        </View>
      </View>

      {/* Logout — secondary button style: rounded-full border border-gray-200 */}
      <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={15} color={Colors.gray} />
        <Text style={s.logoutText}>{t.profile.logout}</Text>
      </TouchableOpacity>

      <Text style={s.version}>{t.profile.version}</Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },

  header: {
    paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  // text-2xl font-normal
  pageTitle: { fontSize: 22, fontWeight: '400', color: Colors.dark },

  // Profile card — centered, white
  profileCard: {
    alignItems: 'center',
    paddingTop: 28, paddingBottom: 24,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  avatarWrap: { position: 'relative', marginBottom: 14 },
  // rounded-full ring-2 ring-gray-100
  avatar: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: Colors.section,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { fontSize: 28, fontWeight: '700', color: Colors.dark },
  cameraBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  // text-2xl font-normal
  userName:  { fontSize: 20, fontWeight: '400', color: Colors.dark, marginBottom: 3 },
  userPhone: { fontSize: 14, color: Colors.gray, marginBottom: 12 },
  // filter pill: rounded-full bg-gray-50 text-gray-500
  roleChip: {
    backgroundColor: Colors.section,
    borderRadius: Radius.pill,
    paddingHorizontal: 14, paddingVertical: 5,
    borderWidth: 1, borderColor: Colors.border,
  },
  roleChipText: { fontSize: 13, color: Colors.gray },

  // Stats — white card, 3 columns
  statsCard: {
    flexDirection: 'row',
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    paddingVertical: 20, marginHorizontal: 20, marginTop: 20,
  },
  statCol:     { flex: 1, alignItems: 'center', gap: 4 },
  statDivider: { width: 1, backgroundColor: Colors.border, marginVertical: 4 },
  statValue:   { fontSize: 20, fontWeight: '700', color: Colors.dark },
  statLabel:   { fontSize: 11, color: Colors.gray, textAlign: 'center' },

  // Rate card: bg-gray-50 rounded-xl
  rateCard: {
    backgroundColor: Colors.section,
    borderRadius: Radius.lg,
    marginHorizontal: 20, marginTop: 20,
    padding: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  rateTitle: { fontSize: 13, fontWeight: '600', color: Colors.dark, marginBottom: 12 },
  rateRow:   { flexDirection: 'row', alignItems: 'center', gap: 16 },
  rateItem:  { flex: 1 },
  rateLabel: { fontSize: 11, color: Colors.gray, marginBottom: 3 },
  rateValue: { fontSize: 17, fontWeight: '700', color: Colors.dark },
  // Secondary: rounded-full border border-gray-200
  changeBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1, borderColor: Colors.borderMid,
  },
  changeBtnText: { fontSize: 13, fontWeight: '600', color: Colors.gray },

  // Menu: bg-gray-50 rounded-xl, divide-y divide-gray-100
  menuSection: { paddingHorizontal: 20, paddingTop: 24, gap: 12 },
  menuList: {
    backgroundColor: Colors.section,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border,
  },
  menuRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  menuLabel: { flex: 1, fontSize: 14, color: Colors.dark, fontWeight: '400' },

  // Secondary button: rounded-full border border-gray-200 text-gray-700
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginHorizontal: 20, marginTop: 16,
    paddingVertical: 13, borderRadius: Radius.pill,
    borderWidth: 1, borderColor: Colors.borderMid,
  },
  logoutText: { fontSize: 14, fontWeight: '500', color: Colors.gray },

  version: { textAlign: 'center', fontSize: 12, color: Colors.grayLight, marginTop: 20 },
});
