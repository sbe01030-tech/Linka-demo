import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Modal, Animated, Dimensions,
} from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import LanguageSelector from '../../components/common/LanguageSelector';
import { RootStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type MenuIcon =
  | 'create-outline'        | 'location-outline'
  | 'card-outline'          | 'notifications-outline'
  | 'lock-closed-outline'   | 'help-circle-outline'
  | 'document-text-outline';

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { user, logout } = useAuthStore();
  const { t, lang } = useLanguageStore();
  const insets = useSafeAreaInsets();
  const [showSplash, setShowSplash] = React.useState(false);

  const COMING_SOON = lang === 'ko' ? '준비 중입니다.' : lang === 'en' ? 'Coming soon.' : 'Segera hadir.';

  const STATS = [
    { label: t.profile.totalOrders, value: '12' },
    { label: t.profile.ratingGiven, value: '4.8' },
    { label: t.profile.favorites,   value: '5' },
  ];

  const MENU: { icon: MenuIcon; label: string }[] = [
    { icon: 'create-outline',        label: t.profile.editProfile },
    { icon: 'location-outline',      label: t.profile.savedAddress },
    { icon: 'card-outline',          label: t.profile.payment },
    { icon: 'notifications-outline', label: t.profile.notifications },
    { icon: 'lock-closed-outline',   label: t.profile.security },
    { icon: 'help-circle-outline',   label: t.profile.helpFaq },
    { icon: 'document-text-outline', label: t.profile.terms },
  ];

  const handleLogout = () => {
    Alert.alert(t.profile.logoutConfirm, t.profile.logoutMsg, [
      { text: t.profile.cancel, style: 'cancel' },
      { text: t.profile.logout, style: 'destructive', onPress: logout },
    ]);
  };

  const initial = user?.name?.charAt(0).toUpperCase() ?? 'U';

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <Text style={s.pageTitle}>{t.profile.editProfile}</Text>
      </View>

      {/* Profile card */}
      <View style={s.profileCard}>
        {/* Avatar: rounded-full ring-2 ring-gray-100 */}
        <View style={s.avatarWrap}>
          <View style={s.avatar}>
            <Text style={s.avatarInitial}>{initial}</Text>
          </View>
          <TouchableOpacity style={s.cameraBtn} onPress={() => Alert.alert('', COMING_SOON)}>
            <Ionicons name="camera-outline" size={13} color={Colors.gray} />
          </TouchableOpacity>
        </View>
        {/* text-2xl font-normal */}
        <Text style={s.userName}>{user?.name}</Text>
        <Text style={s.userPhone}>{user?.phone}</Text>
        <View style={s.roleChip}>
          <Text style={s.roleChipText}>{t.auth.customer}</Text>
        </View>
      </View>

      {/* Stats — one white card, 3 columns, gray dividers, plain numbers */}
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

      {/* 내 예약 목록 — 구분된 카드 */}
      <TouchableOpacity
        style={s.ordersCard}
        onPress={() => navigation.navigate('Orders')}
        activeOpacity={0.85}
      >
        <View style={s.ordersIconWrap}>
          <Ionicons name="calendar-clear" size={22} color={Colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.ordersTitle}>내 예약 목록</Text>
          <Text style={s.ordersSub}>진행 중 1건 · 완료 3건</Text>
        </View>
        <View style={s.ordersBadge}>
          <Text style={s.ordersBadgeText}>1</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={Colors.accent} />
      </TouchableOpacity>

      {/* Menu list — bg-gray-50 rounded-xl, divide-y */}
      <View style={s.menuSection}>
        <View style={s.menuList}>
          {MENU.map((item, i) => (
            <TouchableOpacity key={i} style={s.menuRow} activeOpacity={0.75}
              onPress={() => {
                if (i === 0) navigation.navigate('EditProfile');
                else if (i === 5) navigation.navigate('HelpFAQ');
                else if (i === 6) navigation.navigate('Terms', { mode: 'view' });
                else Alert.alert(item.label, COMING_SOON);
              }}
            >
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

      {/* Branding preview button (임시) */}
      <TouchableOpacity
        style={s.brandingBtn}
        onPress={() => setShowSplash(true)}
        activeOpacity={0.85}
      >
        <View style={s.brandingIconWrap}>
          <Ionicons name="sparkles" size={14} color="#fff" />
        </View>
        <Text style={s.brandingBtnText}>브랜딩 스플래쉬 보기</Text>
        <Ionicons name="play-circle-outline" size={18} color={Colors.accent} />
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={15} color={Colors.gray} />
        <Text style={s.logoutText}>{t.profile.logout}</Text>
      </TouchableOpacity>

      <Text style={s.version}>{t.profile.version}</Text>
      <View style={{ height: 40 }} />

      {/* Splash preview modal */}
      <SplashPreviewModal visible={showSplash} onClose={() => setShowSplash(false)} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },

  header: {
    paddingBottom: 16, paddingHorizontal: 20,
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

  // 내 예약 목록 카드
  ordersCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginHorizontal: 20, marginTop: 20,
    paddingVertical: 16, paddingHorizontal: 18,
    borderRadius: Radius.lg,
    backgroundColor: Colors.accentLight,
    borderWidth: 1.5, borderColor: Colors.accent + '40',
    ...Shadow.sm,
  },
  ordersIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.accent + '30',
  },
  ordersTitle:      { fontSize: 15, fontWeight: '700', color: Colors.dark, marginBottom: 2 },
  ordersSub:        { fontSize: 12, color: Colors.gray },
  ordersBadge:      { backgroundColor: Colors.accent, borderRadius: Radius.pill, minWidth: 22, height: 22, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  ordersBadgeText:  { fontSize: 12, fontWeight: '700', color: Colors.white },

  // Branding preview button
  brandingBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 20, marginTop: 20,
    paddingVertical: 14, paddingHorizontal: 16,
    borderRadius: Radius.lg,
    backgroundColor: Colors.accentLight,
    borderWidth: 1, borderColor: Colors.accent + '30',
  },
  brandingIconWrap: {
    width: 26, height: 26, borderRadius: 8,
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  brandingBtnText: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.accent },

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

// ── Splash Preview Modal ──────────────────────────────────────────
const { width: W, height: H } = Dimensions.get('window');
const sx = W / 390;
const sy = H / 844;
const BRAND = '#00C853';

const NODES = [
  { id: 1, cx: 460, cy: -30,  r: 220, delay: 0 },
  { id: 2, cx: -40, cy: 760,  r: 190, delay: 100 },
  { id: 3, cx: -10, cy: 310,  r: 96,  delay: 200 },
  { id: 4, cx: 360, cy: 640,  r: 72,  delay: 280 },
  { id: 5, cx: 148, cy: 148,  r: 42,  delay: 350 },
  { id: 6, cx: 318, cy: 370,  r: 24,  delay: 400 },
  { id: 7, cx: 120, cy: 620,  r: 16,  delay: 450 },
];
const EDGES = [
  { id: 'e1', x1: 460, y1: -30,  x2: 148, y2: 148,  delay: 550 },
  { id: 'e2', x1: 148, y1: 148,  x2: -10, y2: 310,  delay: 620 },
  { id: 'e3', x1: 148, y1: 148,  x2: 318, y2: 370,  delay: 670 },
  { id: 'e4', x1: -10, y1: 310,  x2: -40, y2: 760,  delay: 720 },
  { id: 'e5', x1: 318, y1: 370,  x2: 360, y2: 640,  delay: 770 },
  { id: 'e6', x1: 360, y1: 640,  x2: -40, y2: 760,  delay: 820 },
  { id: 'e7', x1: 120, y1: 620,  x2: 360, y2: 640,  delay: 860 },
  { id: 'e8', x1: -10, y1: 310,  x2: 120, y2: 620,  delay: 900 },
  { id: 'e9', x1: 120, y1: 620,  x2: -40, y2: 760,  delay: 940 },
];
const AnimatedLine = Animated.createAnimatedComponent(Line);

function SplashPreviewModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const nodeScales  = useRef(NODES.map(() => new Animated.Value(0))).current;
  const nodeOpacity = useRef(NODES.map(() => new Animated.Value(0))).current;
  const edgeOpacity = useRef(EDGES.map(() => new Animated.Value(0))).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY       = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    if (!visible) {
      // Reset all animations when modal closes
      nodeScales.forEach(a => a.setValue(0));
      nodeOpacity.forEach(a => a.setValue(0));
      edgeOpacity.forEach(a => a.setValue(0));
      textOpacity.setValue(0);
      textY.setValue(18);
      return;
    }

    // Play animation
    NODES.forEach((node, i) => {
      Animated.parallel([
        Animated.spring(nodeScales[i], { toValue: 1, delay: node.delay, speed: 8, bounciness: 14, useNativeDriver: true }),
        Animated.timing(nodeOpacity[i], { toValue: 1, delay: node.delay, duration: 400, useNativeDriver: true }),
      ]).start();
    });
    EDGES.forEach((edge, i) => {
      Animated.timing(edgeOpacity[i], { toValue: 0.22, delay: edge.delay, duration: 500, useNativeDriver: true }).start();
    });
    Animated.parallel([
      Animated.timing(textOpacity, { toValue: 1, delay: 1000, duration: 600, useNativeDriver: true }),
      Animated.timing(textY,       { toValue: 0, delay: 1000, duration: 600, useNativeDriver: true }),
    ]).start();

    return () => {
      // 모달 닫힐 때 진행 중 애니메이션 정지 — Android 네이티브 노드 race 방지
      nodeScales.forEach((v) => v.stopAnimation());
      nodeOpacity.forEach((v) => v.stopAnimation());
      edgeOpacity.forEach((v) => v.stopAnimation());
      textOpacity.stopAnimation();
      textY.stopAnimation();
    };
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <View style={ms.root}>
        {/* Circles */}
        {NODES.map((node, i) => {
          const d = node.r * 2 * sx;
          return (
            <Animated.View key={node.id} style={[ms.circle, {
              width: d, height: d, borderRadius: node.r * sx,
              left: node.cx * sx - node.r * sx,
              top:  node.cy * sy - node.r * sy,
              opacity: nodeOpacity[i],
              transform: [{ scale: nodeScales[i] }],
            }]} />
          );
        })}

        {/* Lines */}
        <Svg style={StyleSheet.absoluteFillObject} viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
          {EDGES.map((edge, i) => (
            <AnimatedLine key={edge.id}
              x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2}
              stroke="white" strokeWidth="1.4" strokeLinecap="round"
              opacity={edgeOpacity[i]}
            />
          ))}
        </Svg>

        {/* Text */}
        <Animated.View style={[ms.textWrap, { opacity: textOpacity, transform: [{ translateY: textY }] }]}>
          <Text style={ms.logo}>Linka</Text>
          <Text style={ms.taglineRow}>Links Make Life</Text>
        </Animated.View>

        {/* Close button */}
        <TouchableOpacity style={ms.closeBtn} onPress={onClose} activeOpacity={0.8}>
          <Ionicons name="close" size={22} color="rgba(255,255,255,0.9)" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const ms = StyleSheet.create({
  root: {
    flex: 1, backgroundColor: BRAND,
    overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  textWrap: { alignItems: 'center', gap: 0 },
  logo: {
    fontFamily: 'Nunito_900Black',
    fontSize: 72, color: '#FFFFFF',
    letterSpacing: -0.5,
    includeFontPadding: false,
  },
  taglineRow: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15, color: 'rgba(255,255,255,0.65)',
    marginTop: -14, letterSpacing: 1.5,
    textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute', top: 56, right: 20,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
});
