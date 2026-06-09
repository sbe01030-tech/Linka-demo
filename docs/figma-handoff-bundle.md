# Linka 앱 — Figma 핸드오프 번들

React Native + Expo 인도네시아 가사도우미·드라이버·심부름 매칭 앱.
아래 디자인 토큰 + 각 화면 .tsx 코드를 그대로 보고 Figma에 픽셀 단위로 재현해줘.

타겟 디바이스: **iPhone 15 Pro (393 × 852 pt)**

---

## 디자인 토큰

### Colors / Radius / Shadow (src/constants/colors.ts)

```ts
// ─────────────────────────────────────────────────────────────
//  Linka Design System
//
//  Brand accent:  #3A6FF8  — electric blue (matches splash)
//  Page bg:       #FFFFFF
//  Section bg:    #F9FAFB  (gray-50)
//  Card bg:       #FFFFFF  + border #F3F4F6 (gray-100)
//  Text 900:      #111827  primary
//  Text 800:      #1F2937  card titles
//  Text 500:      #6B7280  secondary
//  Text 400:      #9CA3AF  meta / icons default
//  Border 100:    #F3F4F6
//  Border 200:    #E5E7EB
// ─────────────────────────────────────────────────────────────

export const Colors = {
  // Page & surface
  white:      '#FFFFFF',
  background: '#FFFFFF',
  section:    '#F9FAFB',
  card:       '#FFFFFF',
  surface:    '#FFFFFF',

  // Text hierarchy
  dark:        '#111827',   // gray-900  — primary text, headings
  darkMid:     '#1F2937',   // gray-800  — card titles
  gray:        '#6B7280',   // gray-500  — secondary text
  grayLight:   '#9CA3AF',   // gray-400  — meta, icons

  // Brand accent — vivid green
  accent:      '#00C853',
  accentLight: '#E8FFF3',
  primary:     '#00C853',

  // Borders
  border:      '#F3F4F6',   // gray-100
  borderMid:   '#E5E7EB',   // gray-200

  // Utility aliases
  primaryLight: '#E8FFF3',
  primaryPale:  '#E8FFF3',
  primaryDark:  '#00A846',
  cta:          '#00C853',

  textPrimary:   '#111827',
  textSecondary: '#6B7280',
  textMuted:     '#9CA3AF',

  divider: '#F3F4F6',

  // Status
  success: '#22C55E',
  danger:  '#EF4444',
  warning: '#F59E0B',

  // Service category colors — service-specific, NOT brand
  helperColor: '#F59E0B',   // amber — 가사도우미
  helperLight: '#FFFBEB',
  tutorColor:  '#6366F1',   // indigo — 과외
  tutorLight:  '#EEF2FF',

  // Gray scale
  gray50:  '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',

  black: '#000000',
  white2: '#FFFFFF',
};

// Border radius — rounded-2xl = 16, rounded-full = 999
export const Radius = {
  xs:   6,
  sm:   8,
  md:   12,
  lg:   16,   // rounded-2xl
  xl:   20,
  pill: 999,  // rounded-full
};

// Shadows — very subtle
export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
};
```

---

## Login 화면

**파일**: `src/screens/auth/LoginScreen.tsx`

```tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { RootStackParamList } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import LanguageSelector from '../../components/common/LanguageSelector';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
type DemoIcon = 'person-outline' | 'home-outline' | 'car-outline';

export default function LoginScreen({ navigation }: Props) {
  const { t } = useLanguageStore();
  const { login, isLoading } = useAuthStore();
  const insets = useSafeAreaInsets();

  const [phone,    setPhone]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [focused,  setFocused]  = useState<string | null>(null);

  const DEMO: { label: string; phone: string; icon: DemoIcon; desc: string }[] = [
    { label: t.auth.customer, phone: '0812-3456-7890', icon: 'person-outline', desc: t.auth.customerDesc },
    { label: t.auth.helper,   phone: '0812-3456-7891', icon: 'home-outline',   desc: t.auth.helperDesc },
    { label: t.auth.driver,   phone: '0812-3456-7892', icon: 'car-outline',    desc: t.auth.driverDesc },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <View style={[s.topBar, { paddingTop: insets.top + 10 }]}>
          <View style={s.logoRow}>
            <View style={s.logoMark}>
              <Text style={s.logoLetter}>L</Text>
            </View>
            <Text style={s.logoName}>{t.appName}</Text>
          </View>
          <LanguageSelector variant="button" />
        </View>

        {/* Heading — text-2xl font-normal */}
        <View style={s.hero}>
          <Text style={s.heading}>{t.auth.welcome}</Text>
          <Text style={s.sub}>{t.auth.signIn}</Text>
        </View>

        {/* Form */}
        <View style={s.form}>
          <Text style={s.label}>{t.auth.phone}</Text>
          <View style={[s.field, focused === 'phone' && s.fieldFocused]}>
            <Ionicons
              name="call-outline"
              size={16}
              color={focused === 'phone' ? Colors.dark : Colors.grayLight}
            />
            <TextInput
              style={s.input}
              placeholder={t.auth.phonePlaceholder}
              placeholderTextColor={Colors.grayLight}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              onFocus={() => setFocused('phone')}
              onBlur={() => setFocused(null)}
            />
          </View>

          <Text style={[s.label, { marginTop: 16 }]}>{t.auth.password}</Text>
          <View style={[s.field, focused === 'pass' && s.fieldFocused]}>
            <Ionicons
              name="lock-closed-outline"
              size={16}
              color={focused === 'pass' ? Colors.dark : Colors.grayLight}
            />
            <TextInput
              style={[s.input, { flex: 1 }]}
              placeholder={t.auth.passwordPlaceholder}
              placeholderTextColor={Colors.grayLight}
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocused('pass')}
              onBlur={() => setFocused(null)}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Ionicons
                name={showPass ? 'eye-off-outline' : 'eye-outline'}
                size={16}
                color={Colors.grayLight}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={s.forgotRow} onPress={() => Alert.alert(
            t.auth.forgotPassword,
            'Hubungi customer service kami di WhatsApp:\n0812-LINKA-CS',
            [{ text: 'OK' }]
          )}>
            <Text style={s.forgot}>{t.auth.forgotPassword}</Text>
          </TouchableOpacity>

          {/* rounded-full bg-black text-white */}
          <TouchableOpacity
            style={s.btn}
            onPress={() => { if (!phone || !password) return; login(phone, password); }}
            activeOpacity={0.85}
          >
            {isLoading
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={s.btnText}>{t.auth.login}</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={s.divRow}>
          <View style={s.divLine} />
          <Text style={s.divLabel}>{t.auth.quickLogin}</Text>
          <View style={s.divLine} />
        </View>

        {/* Demo tiles */}
        <View style={s.demoRow}>
          {DEMO.map((d) => (
            <TouchableOpacity
              key={d.phone}
              style={s.demoCard}
              onPress={() => { setPhone(d.phone); setPassword('demo123'); }}
              activeOpacity={0.8}
            >
              <View style={s.demoAvatar}>
                <Ionicons name={d.icon} size={18} color={Colors.accent} />
              </View>
              <Text style={s.demoLabel}>{d.label}</Text>
              <Text style={s.demoDesc}>{d.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Register */}
        <View style={s.registerRow}>
          <Text style={s.registerText}>{t.auth.noAccount}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={s.registerLink}> {t.auth.register}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: Colors.white, paddingBottom: 40 },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 4,
  },
  logoRow:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoMark:   { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center' },
  logoLetter: { fontSize: 14, fontWeight: '800', color: Colors.white },
  logoName:   { fontFamily: 'Nunito_900Black', fontSize: 18, color: Colors.dark, letterSpacing: -0.3 },

  // text-2xl font-normal
  hero:    { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 28 },
  heading: { fontSize: 24, fontWeight: '400', color: Colors.dark, letterSpacing: -0.2, marginBottom: 6 },
  sub:     { fontSize: 14, color: Colors.gray },

  form:  { paddingHorizontal: 20 },
  label: { fontSize: 13, fontWeight: '500', color: Colors.darkMid, marginBottom: 8 },

  // bg-gray-50 rounded-xl  (list-row style)
  field: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.section,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  fieldFocused: { borderColor: Colors.dark, backgroundColor: Colors.white },
  input: { flex: 1, paddingVertical: 13, fontSize: 15, color: Colors.dark },

  forgotRow: { alignItems: 'flex-end', marginTop: 10, marginBottom: 6 },
  forgot:    { fontSize: 13, color: Colors.gray, fontWeight: '500' },

  // rounded-full bg-black
  btn: {
    marginTop: 20,
    backgroundColor: Colors.accent,
    borderRadius: Radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnText: { fontSize: 15, fontWeight: '700', color: Colors.white },

  divRow:  { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 24, paddingHorizontal: 20 },
  divLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  divLabel:{ fontSize: 12, color: Colors.gray },

  // Demo cards — rounded-2xl border border-gray-100
  demoRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 28 },
  demoCard: {
    flex: 1, alignItems: 'center', gap: 10,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    paddingVertical: 16,
    ...Shadow.sm,
  },
  // rounded-full ring-2 ring-gray-100
  demoAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.section,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  demoLabel: { fontSize: 13, fontWeight: '700', color: Colors.dark },
  demoDesc:  { fontSize: 11, color: Colors.gray, textAlign: 'center', marginTop: 2 },

  registerRow: { flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 20 },
  registerText:{ fontSize: 14, color: Colors.gray },
  registerLink:{ fontSize: 14, fontWeight: '700', color: Colors.dark },
});
```

---

## 고객 홈 (HomeScreen)

**파일**: `src/screens/customer/HomeScreen.tsx`

```tsx
import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, Alert, Dimensions,
} from 'react-native';

const SCREEN_W = Dimensions.get('window').width;
const AD_W = SCREEN_W - 16;

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CategoryCharacter, { CatCharKey } from '../../components/common/CategoryCharacter_A';
import { CATEGORY_ICONS } from '../../components/icons/CategoryIcons';
import { TexturedCircle } from '../../components/icons/TexturedCircle';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { AVATAR_STACK, W1, W2, W3, W4, W5, W6 } from '../../constants/photos';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import { LangCode } from '../../i18n';
import { RootStackParamList, CommunityPost } from '../../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;


function getPreviewPosts(lang: LangCode): CommunityPost[] {
  if (lang === 'ko') return [
    { id: 'p1', category: 'popular', title: 'ART 새로 구했는데, 처음에 뭘 확인해야 할까요?', preview: '처음 ART를 써보려는데, 체크리스트 같은 게 있을까요?', author: '익명', time: '23분 전', comments: 12, likes: 34 },
    { id: 'p2', category: 'tips', title: '초등 수학 과외, 몇 학년부터 시작하는 게 좋을까요?', preview: '주변에서 3학년부터 많이 시작하던데, 여러분은 어떻게 생각하세요?', author: '두 아이 맘', time: '1시간 전', comments: 28, likes: 61 },
    { id: 'p3', category: 'chat', title: '남편이 집안일 안 도와줘서 스트레스...', preview: '같이 일하는데 집은 제가 다 해요. 다들 어떻게 하세요?', author: '익명', time: '2시간 전', comments: 47, likes: 132 },
  ];
  if (lang === 'en') return [
    { id: 'p1', category: 'popular', title: 'New housekeeper — what do I need to prepare?', preview: 'First time using a housekeeper. Any checklist I should know about?', author: 'Anon Mom', time: '23 min ago', comments: 12, likes: 34 },
    { id: 'p2', category: 'tips', title: 'Private math tutoring — which grade to start?', preview: 'Many around me start in grade 3. What do you think is the right time?', author: 'Mom of 2', time: '1 hr ago', comments: 28, likes: 61 },
    { id: 'p3', category: 'chat', title: 'Husband won\'t help with housework — so stressed...', preview: 'We both work but I do everything at home. How do others handle this?', author: 'Anon', time: '2 hrs ago', comments: 47, likes: 132 },
  ];
  return [
    { id: 'p1', category: 'popular', title: 'ART baru, apa yang perlu disiapkan ya?', preview: 'Mau pertama kali pakai ART, ada checklist yang perlu diperhatikan nggak?', author: 'Bunda Anon', time: '23 mnt lalu', comments: 12, likes: 34 },
    { id: 'p2', category: 'tips', title: 'Les privat matematika SD, mulai kelas berapa?', preview: 'Di sekitar saya banyak yang mulai kelas 3, gimana menurut Bunda-Bunda?', author: 'Bunda 2 Anak', time: '1 jam lalu', comments: 28, likes: 61 },
    { id: 'p3', category: 'chat', title: 'Suami nggak mau bantu kerjaan rumah, stres...', preview: 'Sama-sama kerja tapi yang beresin rumah saya sendiri. Bunda yang lain gimana?', author: 'Bunda Anon', time: '2 jam lalu', comments: 47, likes: 132 },
  ];
}

const CATEGORY_META: {
  id: string; key: string; bgColor: string;
}[] = [
  { id: 'helper',    key: 'catArt',              bgColor: '#FFDC7B' },  // 중간 옐로
  { id: 'cooking',   key: 'catCooking',          bgColor: '#FFAFA8' },  // 중간 코랄
  { id: 'cleaning',  key: 'catCleaning',         bgColor: '#97E2B7' },  // 중간 민트
  { id: 'childcare', key: 'catChildcare',        bgColor: '#FFB1D1' },  // 중간 핑크
  { id: 'driver_designated', key: 'catDriverDesignated', bgColor: '#C6BCF5' },  // 중간 라벤더
  { id: 'driver_daily',      key: 'catDriverDaily',      bgColor: '#FFC896' },  // 중간 피치
  { id: 'errand',    key: 'catErrand',           bgColor: '#FFBCBF' },  // 중간 로즈
  { id: 'more',      key: 'catMore',             bgColor: '#D0D0D9' },  // 중간 그레이
];

// [비교용 0 섹션] 새 PNG 8종 (assets/icons-v2/)
const V2_ICONS: Record<string, any> = {
  helper:            require('../../../assets/icons-v2/helper.png'),
  cooking:           require('../../../assets/icons-v2/cooking.png'),
  cleaning:          require('../../../assets/icons-v2/cleaning.png'),
  childcare:         require('../../../assets/icons-v2/childcare.png'),
  driver_designated: require('../../../assets/icons-v2/driver_designated.png'),
  driver_daily:      require('../../../assets/icons-v2/driver_daily.png'),
  errand:            require('../../../assets/icons-v2/errand.png'),
  more:              require('../../../assets/icons-v2/more.png'),
};

// [비교용 B 섹션] 얼굴 들어간 편집 PNG 아이콘 매핑 (white/ — 외곽선만 흰색 변환됨)
const FACE_ICONS: Record<string, any> = {
  helper:            require('../../../assets/icons-faces/white/helper.png'),
  cooking:           require('../../../assets/icons-faces/white/cooking.png'),
  cleaning:          require('../../../assets/icons-faces/white/cleaning.png'),
  childcare:         require('../../../assets/icons-faces/white/childcare.png'),
  driver_designated: require('../../../assets/icons-faces/white/driver_designated.png'),
  driver_daily:      require('../../../assets/icons-faces/white/driver_daily.png'),
  errand:            require('../../../assets/icons-faces/white/errand.png'),
  more:              require('../../../assets/icons-faces/white/more.png'),
};

// [비교용 C 섹션] 카드 위 배지 텍스트 (없는 카테고리는 표시 안 함)
const CATEGORY_BADGES: Record<string, string> = {
  helper:            '정기',
  cooking:           '단기',
  childcare:         '인기',
  driver_designated: '야간',
  errand:            '신규',
};

const AVATAR_URLS = AVATAR_STACK;

interface MockWorker {
  id: string; name: string; photo: string; location: string;
  rating: number; pricePerHour: number; totalJobs: number;
  isAvailable: boolean; skills: string[]; isVerified: boolean;
  temperature: number;
}

const MOCK_WORKERS: MockWorker[] = [
  { id:'w1', name:'Renny Ivonnie',   photo:W1, location:'Kebayoran Baru', rating:4.6, pricePerHour:25000, totalJobs:112, isAvailable:true,  skills:['Cuci','Belanja','Deep Clean'],   isVerified:true, temperature:49.4 },
  { id:'w2', name:'Brilian Zabrina', photo:W2, location:'Senopati',       rating:4.7, pricePerHour:15000, totalJobs:132, isAvailable:true,  skills:['Cuci','Masak','Belanja'],        isVerified:true, temperature:64.1 },
  { id:'w3', name:'Fitri Yatun',     photo:W3, location:'Cilandak',       rating:4.7, pricePerHour:20000, totalJobs:208, isAvailable:false, skills:['Beberes','Asuh Anak','Belanja'], isVerified:true, temperature:64.8 },
  { id:'w4', name:'Sarinah Sohari',  photo:W4, location:'Pondok Indah',   rating:4.9, pricePerHour:15000, totalJobs:86,  isAvailable:true,  skills:['Asuh Anak','Belanja','Lansia'],  isVerified:true, temperature:52.5 },
  { id:'w5', name:'Yeni',            photo:W5, location:'Kemang',         rating:5.0, pricePerHour:25000, totalJobs:108, isAvailable:true,  skills:['Deep Clean','Asuh Anak','Masak'], isVerified:true, temperature:55.9 },
  { id:'w6', name:'Rani Oktaviani',  photo:W6, location:'Menteng',        rating:4.5, pricePerHour:30000, totalJobs:247, isAvailable:true,  skills:['Cuci','Belanja','Masak'],        isVerified:true, temperature:68.8 },
];

// ── Mock drivers (고객 차량 운전 서비스) ──────────────────────────
import { MOCK_DRIVERS, DRIVER_SERVICE_META } from '../../constants/mockDrivers';
import { HELPER_OF_MONTH, DRIVER_OF_MONTH } from '../../constants/monthlyAwards';
import MonthlyAwardCard from '../../components/common/MonthlyAwardCard';

// ── Mock ads ──────────────────────────────────────────────────────
const ADS = [
  {
    id: 'a1',
    bg: Colors.accentLight,
    border: Colors.accent + '30',
    badge: Colors.accent + '25',
    badgeColor: Colors.accent,
    title: '첫 예약 20% 할인 쿠폰',
    sub: '지금 바로 헬퍼를 예약하고 혜택을 받아보세요!',
    cta: '쿠폰 받기',
  },
  {
    id: 'a2',
    bg: '#FFF7ED',
    border: '#F59E0B30',
    badge: '#F59E0B25',
    badgeColor: '#F59E0B',
    title: 'Linka Pro 멤버십',
    sub: '월정액으로 우선 매칭 & 수수료 0% 혜택',
    cta: '자세히 보기',
  },
  {
    id: 'a3',
    bg: '#F0FDF4',
    border: '#22C55E30',
    badge: '#22C55E25',
    badgeColor: '#22C55E',
    title: '친구 초대하면 Rp 50rb 적립',
    sub: '친구가 첫 예약 완료 시 즉시 크레딧 지급',
    cta: '초대하기',
  },
];

// ── Tiny mascot face (chest-level, 36×36) ──────────────────────
function MascotFace({ size = 36 }: { size?: number }) {
  const s = size / 36;
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36">
      <Circle cx="18" cy="16" r="14" fill="white" />
      <Circle cx="13" cy="15" r="3"  fill="#1a1a2e" />
      <Circle cx="23" cy="15" r="3"  fill="#1a1a2e" />
      <Circle cx="14.2" cy="13.5" r="1.2" fill="white" />
      <Circle cx="24.2" cy="13.5" r="1.2" fill="white" />
      <Ellipse cx="9"  cy="19" rx="3.5" ry="2" fill="#FFB3C6" fillOpacity="0.5" />
      <Ellipse cx="27" cy="19" rx="3.5" ry="2" fill="#FFB3C6" fillOpacity="0.5" />
      <Path d="M14,21 Q18,25 22,21" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

export default function HomeScreen() {
  const navigation  = useNavigation<Nav>();
  const { user }    = useAuthStore();
  const { t, lang } = useLanguageStore();
  const insets      = useSafeAreaInsets();
  const adPage = useRef(0);
  const adScrollRef = useRef<ScrollView>(null);

  React.useEffect(() => {
    const timer = setInterval(() => {
      const next = (adPage.current + 1) % ADS.length;
      adScrollRef.current?.scrollTo({ x: next * (AD_W + 12), animated: true });
      adPage.current = next;
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const firstName = user?.name?.split(' ')[0] ?? 'Bunda';
  const MOCK_POSTS = getPreviewPosts(lang);
  const CATEGORIES = CATEGORY_META.map((c) => ({ ...c, label: (t.homeNew as any)[c.key] as string }));

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>

      {/* ── Sticky header ── */}
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <View style={s.headerRow}>
          {/* Logo */}
          <View style={s.logoRow}>
            <MascotFace size={32} />
            <Text style={s.logoText}>Linka</Text>
          </View>
          {/* Location */}
          <TouchableOpacity style={s.locationChip} onPress={() => (navigation as any).navigate('Map')}>
            <Ionicons name="location" size={13} color={Colors.accent} />
            <Text style={s.locationText}>{t.homeNew.locationDefault}</Text>
            <Ionicons name="chevron-down" size={12} color={Colors.gray} />
          </TouchableOpacity>
          {/* Bell */}
          <TouchableOpacity style={s.bellBtn} onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={22} color={Colors.dark} />
            <View style={s.bellDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Service type buttons ── */}
      <View style={s.svcBtnWrap}>
        <TouchableOpacity
          style={s.svcBtn}
          onPress={() => (navigation as any).navigate('Map', { expanded: true, serviceType: 'regular' })}
          activeOpacity={0.75}
        >
          <Ionicons name="calendar-outline" size={15} color={Colors.accent} />
          <Text style={s.svcBtnText}>{t.homeNew.serviceRegular}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.svcBtn}
          onPress={() => (navigation as any).navigate('Map', { expanded: true, serviceType: 'onetime' })}
          activeOpacity={0.75}
        >
          <Ionicons name="flash-outline" size={15} color={Colors.accent} />
          <Text style={s.svcBtnText}>{t.homeNew.serviceSpecial}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Find nearby helper banner ── */}
      <TouchableOpacity
        style={s.nearbyBanner}
        activeOpacity={0.88}
        onPress={() => (navigation as any).navigate('Map')}
      >
        <View style={s.nearbyLeft}>
          <View style={s.nearbyIconWrap}>
            <Ionicons name="location" size={18} color={Colors.white} />
          </View>
          <View>
            <Text style={s.nearbyTitle}>
              {lang === 'ko' ? '내 주변의 손길' : lang === 'en' ? 'Help near you' : 'Bantuan di sekitar'}
            </Text>
            <Text style={s.nearbySub}>
              {lang === 'ko' ? '지도 위에서 바로 만나보세요.'
                : lang === 'en' ? 'Meet them right on the map.'
                : 'Temui di peta, saat itu juga.'}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.accent} />
      </TouchableOpacity>

      {/* ── Category grid — 0: 새 PNG 아이콘 (v2) ── */}
      <View style={s.catSection}>
        <View style={s.catGrid}>
          {CATEGORIES.map((cat) => {
            const isDriver = cat.id.startsWith('driver_');
            const onPress = () => {
              if (cat.id === 'errand') { (navigation as any).navigate('ErrandBoard'); return; }
              if (isDriver)            { (navigation as any).navigate('Map', { expanded: true, partnerFilter: 'driver' }); return; }
              (navigation as any).navigate('Map', { expanded: true, partnerFilter: 'helper' });
            };
            const v2Src = V2_ICONS[cat.id];
            return (
              <TouchableOpacity
                key={`Z-${cat.id}`}
                style={s.catItem}
                activeOpacity={0.75}
                onPress={onPress}
              >
                <View style={s.catIconStage}>
                  <TexturedCircle size={69} color="#00C85312" style={s.catIconBg} />
                  <View style={s.catIconShiftCentered}>
                    {v2Src
                      ? <Image source={v2Src} style={s.catFaceIcon} resizeMode="contain" />
                      : <CategoryCharacter category={cat.id as CatCharKey} size={52} />
                    }
                  </View>
                </View>
                <Text style={s.catLabel}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Errand section ── */}
      <TouchableOpacity
        style={s.errandBanner}
        activeOpacity={0.88}
        onPress={() => (navigation as any).navigate('ErrandBoard')}
      >
        <View style={s.errandLeft}>
          <View style={s.errandIconWrap}>
            <Ionicons name="bicycle" size={20} color={Colors.white} />
          </View>
          <View>
            <Text style={s.errandTitle}>
              {lang === 'ko' ? '심부름 요청하기' : lang === 'en' ? 'Request an Errand' : 'Minta Bantuan Jasa'}
            </Text>
            <Text style={s.errandSub}>
              {lang === 'ko' ? '장보기·배달·줄서기 등 심부름을 맡겨보세요' : lang === 'en' ? 'Shopping, delivery, queuing & more' : 'Belanja, antar, antre & lainnya'}
            </Text>
          </View>
        </View>
        <View style={s.errandRight}>
          <Text style={s.errandCount}>
            {lang === 'ko' ? '헬퍼 12명 대기중' : lang === 'en' ? '12 helpers ready' : '12 helper siap'}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.white} />
        </View>
      </TouchableOpacity>

      {/* ── Recommended workers ── */}
      <View style={s.workerSection}>
        <View style={s.sectionHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[s.sectionEyebrow, { color: Colors.helperColor }]}>
              {lang === 'ko' ? '추천 헬퍼' : lang === 'en' ? 'TOP HELPERS' : 'HELPER PILIHAN'}
            </Text>
            <Text style={s.sectionHeadline}>
              {lang === 'ko' ? '이웃처럼 가까운,\n가족처럼 편안한.'
                : lang === 'en' ? 'Close as neighbors.\nEasy as family.'
                : 'Sedekat tetangga,\nsenyaman keluarga.'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => (navigation as any).navigate('Map', { expanded: true })}>
            <Text style={s.seeAll}>{t.homeNew.seeAll}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.workerScroll}>
          {MOCK_WORKERS.map((w) => (
            <TouchableOpacity
              key={w.id}
              style={s.workerCard}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('WorkerDetail', { workerId: w.id })}
            >
              <View style={s.workerPhotoWrap}>
                <Image source={{ uri: w.photo }} style={s.workerPhoto} />
                <View style={[s.workerAvailDot, { backgroundColor: w.isAvailable ? Colors.success : Colors.grayLight }]} />
              </View>
              <View style={s.workerNameRow}>
                <Text style={s.workerName} numberOfLines={1}>{w.name.split(' ')[0]}</Text>
                {w.isVerified && <Ionicons name="checkmark-circle" size={12} color={Colors.accent} />}
              </View>
              <View style={s.workerLocRow}>
                <Ionicons name="location-outline" size={10} color={Colors.grayLight} />
                <Text style={s.workerLoc} numberOfLines={1}>{w.location}</Text>
              </View>
              <View style={s.workerSkillsRow}>
                {w.skills.slice(0, 2).map((sk) => (
                  <View key={sk} style={s.workerSkillTag}><Text style={s.workerSkillText}>{sk}</Text></View>
                ))}
              </View>
              <View style={s.workerPriceRow}>
                <Ionicons name="thermometer" size={11} color="#EF4444" />
                <Text style={s.workerRating}>{w.temperature.toFixed(1)}°</Text>
                <Text style={s.workerPriceDot}>·</Text>
                <Text style={s.workerPrice}>Rp {(w.pricePerHour / 1000).toFixed(0)}rb</Text>
                <Text style={s.workerPriceUnit}>/jam</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Available count bar ── */}
      <TouchableOpacity style={s.countBar} activeOpacity={0.85} onPress={() => (navigation as any).navigate('Map', { expanded: true })}>
        <View style={s.avatarStack}>
          {AVATAR_URLS.map((uri, i) => (
            <Image key={i} source={{ uri }} style={[s.stackAvatar, { marginLeft: i === 0 ? 0 : -10, zIndex: 3 - i }]} />
          ))}
        </View>
        <Text style={s.countText}>{t.homeNew.countBarText}</Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.accent} />
      </TouchableOpacity>

      {/* ── Ad carousel ── */}
      <View style={s.adWrap}>
        <ScrollView
          ref={adScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={AD_W + 12}
          decelerationRate="fast"
          contentContainerStyle={s.adScrollContent}
          onMomentumScrollEnd={(e) => {
            adPage.current = Math.round(e.nativeEvent.contentOffset.x / (AD_W + 12));
          }}
        >
          {ADS.map((ad) => (
            <View key={ad.id} style={[s.adCard, { backgroundColor: ad.bg, borderColor: ad.border }]}>
              <View style={[s.adBadge, { backgroundColor: ad.badge }]}>
                <Text style={[s.adBadgeText, { color: ad.badgeColor }]}>AD</Text>
              </View>
              <View style={s.adContent}>
                <Text style={s.adTitle}>{ad.title}</Text>
                <Text style={s.adSub}>{ad.sub}</Text>
                <TouchableOpacity
                  style={[s.adBtn, { backgroundColor: ad.badgeColor }]}
                  onPress={() => Alert.alert(ad.title, ad.sub)}
                >
                  <Text style={s.adBtnText}>{ad.cta}</Text>
                </TouchableOpacity>
              </View>
              <View style={s.adMascotWrap}>
                <MascotFace size={56} />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* ── Recommended drivers ── */}
      <View style={s.tutorSection}>
        <View style={s.sectionHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[s.sectionEyebrow, { color: Colors.tutorColor }]}>
              {lang === 'ko' ? '추천 드라이버' : lang === 'en' ? 'TOP DRIVERS' : 'SOPIR PILIHAN'}
            </Text>
            <Text style={s.sectionHeadline}>
              {lang === 'ko' ? '안전한 길.\n편안한 이동.'
                : lang === 'en' ? 'Safer road.\nEasier ride.'
                : 'Jalan aman.\nPerjalanan nyaman.'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => (navigation as any).navigate('Map', { expanded: true, partnerFilter: 'driver' })}>
            <Text style={s.seeAll}>{t.homeNew.seeAll}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tutorScroll}>
          {MOCK_DRIVERS.map((driver) => {
            const topService = driver.services[0];
            const meta = DRIVER_SERVICE_META[topService];
            return (
              <TouchableOpacity
                key={driver.id}
                style={s.tutorCard}
                activeOpacity={0.88}
                onPress={() => (navigation as any).navigate('DriverDetail', { driverId: driver.id })}
              >
                <Image source={typeof driver.photo === "string" ? { uri: driver.photo } : driver.photo} style={s.tutorPhoto} />
                {driver.isVerified && (
                  <View style={s.tutorVerifyBadge}>
                    <Ionicons name="checkmark-circle" size={14} color={Colors.accent} />
                  </View>
                )}
                <Text style={s.tutorName} numberOfLines={1}>{driver.firstName}</Text>
                <View style={[s.tutorGradeBadge, { backgroundColor: meta.bg, flexDirection: 'row', alignItems: 'center', gap: 3 }]}>
                  <Ionicons name={meta.icon as any} size={10} color={meta.color} />
                  <Text style={[s.tutorGradeText, { color: meta.color }]}>{driver.licenseClass}</Text>
                </View>
                <View style={s.tutorSubjectsRow}>
                  {driver.drivableTypes.slice(0, 2).map((t) => (
                    <View key={t} style={s.tutorSubjectTag}>
                      <Text style={s.tutorSubjectText} numberOfLines={1}>{t.toUpperCase()}</Text>
                    </View>
                  ))}
                </View>
                <View style={s.tutorPriceRow}>
                  <Ionicons name="thermometer-outline" size={11} color="#F59E0B" />
                  <Text style={s.tutorRating}>{driver.temperature.toFixed(1)}°</Text>
                  <Text style={s.tutorPriceDot}>·</Text>
                  <Text style={s.tutorPrice}>Rp {(driver.pricePerHour / 1000).toFixed(0)}rb</Text>
                  <Text style={s.tutorPriceUnit}>/jam</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Community preview ── */}
      <View style={s.communitySection}>
        <View style={s.sectionHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[s.sectionEyebrow, { color: '#F97316' }]}>
              {t.homeNew.popularPosts.toString().toUpperCase()}
            </Text>
            <Text style={s.sectionHeadline}>
              {lang === 'ko' ? '오늘의 고민.\n내일의 답.'
                : lang === 'en' ? 'Today’s questions.\nTomorrow’s answers.'
                : 'Pertanyaan hari ini.\nJawaban esok.'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => (navigation as any).navigate('Community')}>
            <Text style={s.seeAll}>{t.homeNew.seeAll}</Text>
          </TouchableOpacity>
        </View>
        {MOCK_POSTS.map((post) => (
          <TouchableOpacity key={post.id} style={s.postCard} activeOpacity={0.85}
            onPress={() => navigation.navigate('PostDetail', { postId: post.id, title: post.title, category: post.category, author: post.author, time: post.time, preview: post.preview, comments: post.comments, likes: post.likes })}
          >
            <View style={s.postTop}>
              <View style={[s.categoryTag, post.category === 'popular' && s.categoryTagHot]}>
                <Text style={[s.categoryTagText, post.category === 'popular' && s.categoryTagTextHot]}>
                  {post.category === 'popular' ? t.community.catPopular
                    : post.category === 'tips' ? t.community.catTips
                    : post.category === 'chat' ? t.community.catChat
                    : post.category === 'ask' ? t.community.catAsk
                    : post.category === 'announce' ? t.community.catAnnounce
                    : post.category}
                </Text>
              </View>
              <Text style={s.postTime}>{post.time}</Text>
            </View>
            <Text style={s.postTitle} numberOfLines={1}>{post.title}</Text>
            <Text style={s.postPreview} numberOfLines={1}>{post.preview}</Text>
            <View style={s.postMeta}>
              <Text style={s.postAuthor}>{post.author}</Text>
              <View style={s.postMetaRight}>
                <Ionicons name="chatbubble-outline" size={11} color={Colors.grayLight} />
                <Text style={s.postMetaNum}>{post.comments}</Text>
                <Ionicons name="heart-outline" size={11} color={Colors.grayLight} />
                <Text style={s.postMetaNum}>{post.likes}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Monthly MVP section ── */}
      <View style={s.mvpBackdrop}>
        <MonthlyAwardCard
          helper={HELPER_OF_MONTH}
          driver={DRIVER_OF_MONTH}
          lang={lang}
          onPressHelper={() => navigation.navigate('WorkerDetail', { workerId: HELPER_OF_MONTH.winnerId })}
          onPressDriver={() => (navigation as any).navigate('DriverDetail', { driverId: DRIVER_OF_MONTH.winnerId })}
        />
      </View>

      {/* ── 3 Main Topics hero (moved to bottom) ── */}
      <View style={s.topicsSection}>
        <View style={s.topicsRow}>
          {/* 가사·돌봄 */}
          <TouchableOpacity
            style={s.topicCard}
            activeOpacity={0.85}
            onPress={() => (navigation as any).navigate('Map', { expanded: true })}
          >
            <View style={s.topicBlobClip}>
              <Svg width="100%" height="100%" viewBox="0 0 170 170" preserveAspectRatio="xMidYMid slice">
                <Circle cx="-10" cy="-10" r="48" fill="none" stroke={Colors.helperColor} strokeWidth={1.8} opacity={0.35} />
                <Circle cx="170" cy="160" r="50" fill="none" stroke={Colors.helperColor} strokeWidth={1.8} opacity={0.4} />
              </Svg>
            </View>
            <View style={[s.topicIconLarge, { backgroundColor: Colors.helperLight }]}>
              <Ionicons name="home" size={26} color={Colors.helperColor} />
            </View>
            <Text style={[s.topicEyebrow, { color: Colors.helperColor }]}>
              {lang === 'ko' ? '가사·돌봄' : lang === 'en' ? 'HOME CARE' : 'ASISTEN'}
            </Text>
            <Text style={s.topicHeadline} numberOfLines={2}>
              {lang === 'ko' ? '집안일은 덜고,\n시간은 더 늘리고.'
                : lang === 'en' ? 'Less chores.\nMore time.'
                : 'Kurangi kerja.\nTambah waktu.'}
            </Text>
            <View style={[s.topicLivePill, { backgroundColor: Colors.helperLight }]}>
              <View style={[s.topicLiveDot, { backgroundColor: Colors.helperColor }]} />
              <Text style={[s.topicLiveText, { color: Colors.helperColor }]}>
                {lang === 'ko' ? '지금 23명' : lang === 'en' ? '23 online' : '23 aktif'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* 드라이버 */}
          <TouchableOpacity
            style={s.topicCard}
            activeOpacity={0.85}
            onPress={() => (navigation as any).navigate('DriverBoard')}
          >
            <View style={s.topicBlobClip}>
              <Svg width="100%" height="100%" viewBox="0 0 170 170" preserveAspectRatio="xMidYMid slice">
                <Circle cx="-10" cy="-10" r="48" fill="none" stroke={Colors.tutorColor} strokeWidth={1.8} opacity={0.35} />
                <Circle cx="170" cy="160" r="50" fill="none" stroke={Colors.tutorColor} strokeWidth={1.8} opacity={0.4} />
              </Svg>
            </View>
            <View style={[s.topicIconLarge, { backgroundColor: Colors.tutorLight }]}>
              <Ionicons name="car" size={26} color={Colors.tutorColor} />
            </View>
            <Text style={[s.topicEyebrow, { color: Colors.tutorColor }]}>
              {lang === 'ko' ? '드라이버' : lang === 'en' ? 'DRIVER' : 'SOPIR'}
            </Text>
            <Text style={s.topicHeadline} numberOfLines={2}>
              {lang === 'ko' ? '운전은 잠시 내려두고,\n편히 쉬세요.'
                : lang === 'en' ? 'Set the wheel down.\nJust sit back.'
                : 'Turunkan setir.\nSantai saja.'}
            </Text>
            <View style={[s.topicLivePill, { backgroundColor: Colors.tutorLight }]}>
              <View style={[s.topicLiveDot, { backgroundColor: Colors.tutorColor }]} />
              <Text style={[s.topicLiveText, { color: Colors.tutorColor }]}>
                {lang === 'ko' ? '지금 8명' : lang === 'en' ? '8 online' : '8 aktif'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 심부름 — 아래쪽 가로 길게 */}
        <TouchableOpacity
          style={s.topicWideCard}
          activeOpacity={0.85}
          onPress={() => (navigation as any).navigate('ErrandBoard')}
        >
          <View style={s.topicBlobClip}>
            <Svg width="100%" height="100%" viewBox="0 0 360 90" preserveAspectRatio="xMidYMid slice">
              <Circle cx="-10" cy="-10" r="36" fill="none" stroke={Colors.accent} strokeWidth={1.8} opacity={0.35} />
              <Circle cx="360" cy="95"  r="58" fill="none" stroke={Colors.accent} strokeWidth={1.8} opacity={0.4}  />
            </Svg>
          </View>
          <View style={[s.topicIconLarge, { backgroundColor: Colors.accentLight, marginBottom: 0 }]}>
            <Ionicons name="bicycle" size={26} color={Colors.accent} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <View style={s.topicWideTitleRow}>
              <Text style={[s.topicEyebrow, { color: Colors.accent, marginBottom: 0 }]}>
                {lang === 'ko' ? '심부름' : lang === 'en' ? 'ERRANDS' : 'TITIP'}
              </Text>
              <View style={[s.topicLivePill, { backgroundColor: Colors.accentLight, marginTop: 0 }]}>
                <View style={[s.topicLiveDot, { backgroundColor: Colors.accent }]} />
                <Text style={[s.topicLiveText, { color: Colors.accent }]}>
                  {lang === 'ko' ? '요청 4건' : lang === 'en' ? '4 new' : '4 baru'}
                </Text>
              </View>
            </View>
            <Text style={[s.topicHeadline, { marginTop: 4, fontSize: 15 }]} numberOfLines={1}>
              {lang === 'ko' ? '바쁜 순간에, 더 빠른 손.'
                : lang === 'en' ? 'Busy moments. Faster hands.'
                : 'Saat sibuk, tangan cepat.'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.grayLight} />
        </TouchableOpacity>
      </View>

      {/* ── Linka footer (bottom) ── */}
      <View style={s.mvpBackdrop}>
        <View style={s.footer}>
          <View style={s.footerLogoRow}>
            <MascotFace size={24} />
            <Text style={s.footerLogoText}>Linka</Text>
          </View>
          <Text style={s.footerTagline}>
            {lang === 'ko' ? '작은 연결로 세상을 아름답게'
              : lang === 'en' ? 'Small connections, warmer world'
              : 'Koneksi kecil, dunia yang hangat'}
          </Text>
          <Text style={s.footerCopy}>© 2026 Linka</Text>
        </View>
      </View>
    </ScrollView>
  );
}

// ── Styles ─────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F5F5' },

  // Header
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoRow:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoText:  { fontFamily: 'Nunito_900Black', fontSize: 22, color: Colors.accent, letterSpacing: -0.5 },
  locationChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 3,
    marginLeft: 4,
  },
  locationText: { fontSize: 13, fontWeight: '600', color: Colors.dark },
  bellBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  bellDot: {
    position: 'absolute', top: 7, right: 7,
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: Colors.danger, borderWidth: 1.5, borderColor: Colors.white,
  },

  // Service buttons
  svcBtnWrap: {
    flexDirection: 'row', gap: 10,
    backgroundColor: Colors.white,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  svcBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 11,
    borderRadius: Radius.pill,
    borderWidth: 1.1, borderColor: Colors.accent,
    backgroundColor: Colors.white,
  },
  svcBtnText: { fontSize: 14, fontWeight: '500', color: Colors.dark },

  // Category grid
  catSection: {
    backgroundColor: Colors.white, marginTop: 8,
    paddingTop: 20, paddingBottom: 12, paddingHorizontal: 16,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border,
  },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  catItem: { width: '25%', alignItems: 'center', marginBottom: 18, gap: 8 },
  // stage: 셀 안의 아이콘 영역. 아이콘은 stage 중앙에 정렬됨.
  // 그룹(아이콘+bg)을 우측 +7 만큼 이동 → bg가 텍스트와 가로 중앙 정렬됨
  catIconStage: {
    width: 64, height: 64,
    alignItems: 'center', justifyContent: 'center',
    transform: [{ translateX: 7 }],
  },
  // bg: 69x69 둥근 사각형 (60에서 +15%). bg 중심 (25, 29) — 아래로 +4 이동.
  catIconBg: {
    position: 'absolute',
    width: 69, height: 69,
    borderRadius: 17,
    left: -9.5, top: -3.5,
  },
  // 아이콘만 살짝 좌상단으로 (배경 동그라미는 그대로)
  catIconShift: {
    transform: [{ translateX: -3 }, { translateY: -3 }],
  },
  // 청소 — 우측+아래로 약간씩
  catIconShiftCleaning: {
    transform: [{ translateX: -1 }, { translateY: -3 }],
  },
  // 육아도우미 — 기본보다 우측으로 약간
  catIconShiftChildcare: {
    transform: [{ translateX: 0 }, { translateY: -3 }],
  },
  // 요리·대리운전·일일 기사·심부름 — 기본보다 아래로 약간
  catIconShiftDown: {
    transform: [{ translateX: -3 }, { translateY: 0 }],
  },
  // [비교용] 배경 동그라미 중앙에 아이콘 정렬 — bg와 함께 아래로 +4 이동
  catIconShiftCentered: {
    transform: [{ translateX: -7 }, { translateY: -1 }],
  },
  // [비교용 B] 얼굴 들어간 PNG 아이콘 — 42 → 48 (+15%)
  catFaceIcon: {
    width: 48,
    height: 48,
  },
  // [비교용 C — Gojek/Grab 스타일: 둥근 사각 카드 + 배지]
  catGridC: { flexDirection: 'row', flexWrap: 'wrap' },
  catItemC: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 22,
    gap: 8,
    paddingHorizontal: 4,
  },
  catCardC: {
    width: 70, height: 70,
    borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
    // 살짝 그림자 (입체감)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  catBadgeC: {
    position: 'absolute',
    top: -6, left: -6,
    backgroundColor: Colors.dark,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 10,
    zIndex: 1,
    minWidth: 30,
    alignItems: 'center',
  },
  catBadgeTextC: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  catFaceIconC: {
    width: 50,
    height: 50,
  },
  catLabelC: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.dark,
    textAlign: 'center',
    lineHeight: 16,
  },
  // [비교용] 섹션 라벨
  compareLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.gray,
    letterSpacing: 0.6,
    paddingBottom: 12,
    textTransform: 'uppercase',
  },
  catLabel: { fontSize: 11, fontWeight: '500', color: Colors.dark, textAlign: 'center', lineHeight: 15 },

  // Nearby banner
  nearbyBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white,
    marginHorizontal: 8, marginTop: 5, marginBottom: 1,
    borderRadius: Radius.lg,
    paddingHorizontal: 14, paddingVertical: 13,
    borderWidth: 1, borderColor: Colors.border,
  },
  nearbyLeft:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  nearbyIconWrap:{ width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center' },
  nearbyTitle:   { fontSize: 13, fontWeight: '700', color: Colors.dark, marginBottom: 2 },
  nearbySub:     { fontSize: 11, color: Colors.gray },

  // Count bar
  countBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.white, marginTop: 8,
    paddingHorizontal: 16, paddingVertical: 14,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border,
  },
  avatarStack: { flexDirection: 'row' },
  stackAvatar: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: Colors.white },
  countText:   { flex: 1, fontSize: 13, color: Colors.dark },
  countBold:   { fontWeight: '700', color: Colors.accent },

  // Ad carousel
  adWrap: { marginTop: 8 },
  adScrollContent: { paddingHorizontal: 8, gap: 12, paddingVertical: 2 },
  adCard: {
    width: AD_W,
    flexDirection: 'row', alignItems: 'center',
    borderRadius: Radius.lg,
    padding: 16, borderWidth: 1,
    overflow: 'hidden',
  },
  adBadge: {
    position: 'absolute', top: 10, right: 10,
    borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2,
  },
  adBadgeText: { fontSize: 10, fontWeight: '700' },
  adContent: { flex: 1, gap: 4 },
  adTitle: { fontSize: 15, fontWeight: '700', color: Colors.dark },
  adSub:   { fontSize: 12, color: Colors.gray },
  adBtn: {
    alignSelf: 'flex-start', marginTop: 8,
    borderRadius: Radius.pill,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  adBtnText: { fontSize: 12, fontWeight: '700', color: Colors.white },
  adMascotWrap: { marginLeft: 8 },

  // Worker section
  workerSection: {
    backgroundColor: Colors.white, marginTop: 8,
    paddingTop: 16, paddingBottom: 8,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border,
  },
  workerScroll: { paddingHorizontal: 16, gap: 10, paddingBottom: 4, paddingTop: 10 },
  workerCard: {
    width: 136, backgroundColor: Colors.white,
    borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border,
    padding: 12, gap: 6, ...Shadow.sm,
  },
  workerPhotoWrap: { position: 'relative', alignSelf: 'center', marginBottom: 2 },
  workerPhoto:     { width: 56, height: 56, borderRadius: 28 },
  workerAvailDot:  { position: 'absolute', bottom: 1, right: 1, width: 11, height: 11, borderRadius: 5.5, borderWidth: 2, borderColor: Colors.white },
  workerNameRow:   { flexDirection: 'row', alignItems: 'center', gap: 4 },
  workerName:      { fontSize: 13, fontWeight: '700', color: Colors.dark, flex: 1 },
  workerLocRow:    { flexDirection: 'row', alignItems: 'center', gap: 3 },
  workerLoc:       { fontSize: 10, color: Colors.grayLight, flex: 1 },
  workerSkillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  workerSkillTag:  { backgroundColor: Colors.section, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  workerSkillText: { fontSize: 9, color: Colors.gray },
  workerPriceRow:  { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 },
  workerRating:    { fontSize: 11, fontWeight: '600', color: Colors.dark },
  workerPriceDot:  { fontSize: 10, color: Colors.grayLight, marginHorizontal: 2 },
  workerPrice:     { fontSize: 11, fontWeight: '700', color: Colors.accent },
  workerPriceUnit: { fontSize: 10, color: Colors.grayLight },

  // Tutor section
  tutorSection: {
    backgroundColor: Colors.white, marginTop: 8,
    paddingTop: 16, paddingBottom: 8,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border,
  },
  tutorScroll: { paddingHorizontal: 16, gap: 10, paddingBottom: 4, paddingTop: 10 },
  tutorCard: {
    width: 130, backgroundColor: Colors.white,
    borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border,
    padding: 12, gap: 5, alignItems: 'center', ...Shadow.sm,
  },
  tutorPhoto:       { width: 56, height: 56, borderRadius: 28, marginBottom: 2 },
  tutorVerifyBadge: { position: 'absolute', top: 10, right: 10 },
  tutorName:        { fontSize: 13, fontWeight: '700', color: Colors.dark, textAlign: 'center' },
  tutorGradeBadge:  { backgroundColor: '#CCE8FF', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  tutorGradeText:   { fontSize: 10, fontWeight: '600', color: '#1D4ED8' },
  tutorSubjectsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, justifyContent: 'center' },
  tutorSubjectTag:  { backgroundColor: Colors.section, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  tutorSubjectText: { fontSize: 9, color: Colors.gray },
  tutorPriceRow:    { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 },
  tutorRating:      { fontSize: 11, fontWeight: '600', color: Colors.dark },
  tutorPriceDot:    { fontSize: 10, color: Colors.grayLight, marginHorizontal: 2 },
  tutorPrice:       { fontSize: 11, fontWeight: '700', color: '#3B82F6' },
  tutorPriceUnit:   { fontSize: 10, color: Colors.grayLight },

  // Errand banner
  errandBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#F97316',
    marginHorizontal: 8, marginTop: 10,
    borderRadius: Radius.lg,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  errandLeft:    { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  errandIconWrap:{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  errandTitle:   { fontSize: 14, fontWeight: '700', color: Colors.white, marginBottom: 2 },
  errandSub:     { fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  errandRight:   { flexDirection: 'row', alignItems: 'center', gap: 4 },
  errandCount:   { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },

  // Community
  communitySection: {
    backgroundColor: Colors.white, marginTop: 8,
    paddingTop: 16, paddingBottom: 8,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 16, marginBottom: 8, gap: 12,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  sectionTagline:  { fontSize: 11, color: Colors.grayLight, marginTop: 2, fontWeight: '500', letterSpacing: -0.1 },
  sectionEyebrow:  { fontSize: 10, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 },
  sectionHeadline: { fontSize: 18, fontWeight: '800', letterSpacing: -0.4, color: Colors.dark, lineHeight: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.dark },
  sectionCount: { fontSize: 12, color: Colors.gray },
  seeAll: { fontSize: 13, color: Colors.gray },

  postCard: {
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  postTop: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 },
  categoryTag: {
    backgroundColor: Colors.section, borderRadius: 4,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  categoryTagHot: { backgroundColor: '#FFF7ED' },
  categoryTagText:    { fontSize: 11, fontWeight: '600', color: Colors.gray },
  categoryTagTextHot: { color: '#EA580C' },
  postTime:   { fontSize: 11, color: Colors.grayLight },
  postTitle:  { fontSize: 14, fontWeight: '600', color: Colors.dark, marginBottom: 3 },
  postPreview:{ fontSize: 12, color: Colors.gray, marginBottom: 6 },
  postMeta:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  postAuthor: { fontSize: 11, color: Colors.grayLight },
  postMetaRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  postMetaNum:   { fontSize: 11, color: Colors.grayLight },

  // 3 Topics hero
  topicsSection: {
    paddingHorizontal: 16, paddingTop: 20, paddingBottom: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border,
    marginTop: 10,
  },
  topicsHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginBottom: 14,
  },
  topicsAccent: {
    width: 3, height: 16, borderRadius: 2,
    backgroundColor: Colors.accent,
  },
  topicsLead: {
    fontSize: 16, fontWeight: '800', color: Colors.dark,
    letterSpacing: -0.3,
  },
  topicsRow: {
    flexDirection: 'row', gap: 10,
  },
  topicCard: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 18, paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  topicBlob: {
    ...StyleSheet.absoluteFillObject,
  },
  topicWideBlob: {
    ...StyleSheet.absoluteFillObject,
  },
  topicBlobClip: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    overflow: 'hidden',
  },
  topicWideCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingVertical: 16, paddingHorizontal: 16,
    marginTop: 10,
    borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  topicIconWrap: {
    width: 42, height: 42, borderRadius: 21,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: Colors.accentLight,
  },
  topicIconLarge: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  topicLabelLarge: {
    fontSize: 16, fontWeight: '800', letterSpacing: -0.3,
    color: Colors.dark,
    marginBottom: 4,
  },
  topicSubLarge: {
    fontSize: 11, color: Colors.gray,
    lineHeight: 16,
    marginBottom: 'auto' as any,
  },
  topicEyebrow: {
    fontSize: 10, fontWeight: '800', letterSpacing: 0.8,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  topicHeadline: {
    fontSize: 15, fontWeight: '800', letterSpacing: -0.3,
    color: Colors.dark, lineHeight: 20,
    marginBottom: 'auto' as any,
  },
  topicLivePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 999,
    marginTop: 10,
  },
  topicLiveDot: {
    width: 6, height: 6, borderRadius: 3,
  },
  topicLiveText: {
    fontSize: 11, fontWeight: '700', letterSpacing: -0.2,
  },
  topicWideTitleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    gap: 8,
  },
  topicLabel: {
    fontSize: 14, fontWeight: '800', letterSpacing: -0.2,
    marginBottom: 2,
    color: Colors.dark,
  },
  topicSub: {
    fontSize: 11, color: Colors.gray,
    lineHeight: 15,
  },
  topicChevron: {
    position: 'absolute', bottom: 12, right: 12,
    width: 20, height: 20,
    alignItems: 'center', justifyContent: 'center',
  },

  // MVP bottom section
  mvpBackdrop: {
    marginTop: 8,
    paddingTop: 8, paddingBottom: 32,
    backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 4,
    gap: 3,
  },
  footerLogoRow:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerLogoText: { fontFamily: 'Nunito_900Black', fontSize: 16, color: Colors.accent, letterSpacing: -0.3 },
  footerTagline:  { fontSize: 11, color: Colors.gray, fontWeight: '600', marginTop: 2 },
  footerCopy:     { fontSize: 10, color: Colors.grayLight, marginTop: 4 },
});
```

---

## 탐색 (Explore — 인스타 스토리식)

**파일**: `src/screens/customer/ExploreScreen.tsx`

```tsx
/**
 * ExploreScreen — 인스타 스토리식 워커 탐색
 *
 * UX:
 *  - 추천 풀 (가까운 + 온라인) 최대 10명을 좌→우 슬라이드 스트립으로 노출
 *  - 워커당 페이지 1개 (인물 사진 1장 + 정보 카드)
 *  - 좌/우 탭 또는 좌우 스와이프로 이전·다음 워커
 *  - 상단 진행바: 활성 칸은 브랜드 컬러
 *  - 전환: 모든 카드가 옆에 미리 깔려 있어서 슬라이드 시 검은 화면 없음
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableWithoutFeedback,
  TouchableOpacity, Dimensions, Animated, PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { RootStackParamList } from '../../types';
import {
  getRecommendedWorkers,
  EXPLORE_CATEGORY_META,
  ExploreWorker,
} from '../../constants/exploreWorkers';
import { useFavoriteStore } from '../../store/favoriteStore';
import { useLanguageStore } from '../../store/languageStore';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type T  = (ko: string, en: string, id: string) => string;
const { width: SW } = Dimensions.get('window');

export default function ExploreScreen() {
  const navigation = useNavigation<Nav>();
  const insets     = useSafeAreaInsets();
  const { lang }   = useLanguageStore();
  const tx: T = (ko, en, id) => lang === 'ko' ? ko : lang === 'en' ? en : id;

  const workers = useMemo(getRecommendedWorkers, []);
  const [idx, setIdx]   = useState(0);
  const [done, setDone] = useState(false);

  // 스트립 X 위치 — 모든 카드를 옆으로 깔아두고 translateX 만 이동
  const stripX = useRef(new Animated.Value(0)).current;

  // 모든 훅은 early return 위에서 — 훅 순서 일관성 유지 (React 규칙)
  const idxRef = useRef(idx);
  idxRef.current = idx;
  const workersLenRef = useRef(workers.length);
  workersLenRef.current = workers.length;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_e, g) => Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderRelease: (_e, g) => {
        const curr = idxRef.current;
        const len  = workersLenRef.current;
        if (g.dx < -50) {
          if (curr + 1 >= len) setDone(true);
          else setIdx(curr + 1);
        } else if (g.dx > 50) {
          if (curr > 0) setIdx(curr - 1);
        }
      },
    })
  ).current;

  useEffect(() => {
    Animated.timing(stripX, {
      toValue: -idx * SW,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [idx, stripX]);

  if (workers.length === 0) return <EmptyScreen insetsTop={insets.top} tx={tx} />;
  if (done) return <FinishedScreen insetsTop={insets.top} tx={tx} onReset={() => { setIdx(0); setDone(false); }} />;

  const next = () => {
    if (idx + 1 >= workers.length) { setDone(true); return; }
    setIdx(idx + 1);
  };
  const prev = () => {
    if (idx === 0) return;
    setIdx(idx - 1);
  };

  return (
    <View style={s.root}>
      {/* 카드 스트립 — 워커들을 가로로 깔아두고 stripX 만 이동 (검은 화면 없음) */}
      <Animated.View
        style={[s.strip, { width: SW * workers.length, transform: [{ translateX: stripX }] }]}
        {...panResponder.panHandlers}
      >
        {workers.map((w) => (
          <WorkerCard
            key={w.id}
            worker={w}
            navigation={navigation}
            insetsTop={insets.top}
            insetsBottom={insets.bottom}
            lang={lang}
            tx={tx}
          />
        ))}
      </Animated.View>

      {/* 상단 진행바 (overlay) */}
      <View style={[s.topBar, { paddingTop: insets.top + 14 }]} pointerEvents="none">
        <View style={s.progressRow}>
          {workers.map((_, i) => (
            <View
              key={i}
              style={[
                s.progressSeg,
                i < idx && s.progressSegDone,
                i === idx && s.progressSegActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* 좌/우 탭 zone — 헤더 아래에서 시작 (헤더 탭 가리지 않도록) */}
      <TouchableWithoutFeedback onPress={prev}>
        <View style={[s.tapZone, { left: 0, top: insets.top + 90 }]} />
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={next}>
        <View style={[s.tapZone, { right: 0, top: insets.top + 90 }]} />
      </TouchableWithoutFeedback>
    </View>
  );
}

// ── Worker card (스트립 안의 한 칸) ─────────────────────────────
function WorkerCard({ worker, navigation, insetsTop, insetsBottom, lang, tx }: {
  worker: ExploreWorker;
  navigation: Nav;
  insetsTop: number;
  insetsBottom: number;
  lang: string;
  tx: T;
}) {
  const photo = worker.photos[0]; // 워커당 1장만

  return (
    <View style={[s.cardSlot, { width: SW }]}>
      {/* Photo — 카드 안에서 남은 공간 다 채움 */}
      <View style={s.photoArea}>
        {photo ? (
          <Image source={{ uri: photo }} style={s.photo} resizeMode="cover" />
        ) : (
          <View style={[s.photo, { backgroundColor: Colors.section }]} />
        )}
        {/* 인스타식 상단 페이드 (Dynamic Island 가독성) */}
        <LinearGradient
          colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.15)', 'transparent']}
          locations={[0, 0.45, 1]}
          style={s.photoTopGradient}
          pointerEvents="none"
        />

        {/* 인스타식 헤더 — 탭하면 워커 프로필 페이지로 */}
        <TouchableOpacity
          style={[s.storyHeader, { top: insetsTop + 28 }]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('WorkerDetail', { workerId: worker.detailWorkerId })}
        >
          {photo ? (
            <Image source={{ uri: photo }} style={s.headerAvatar} />
          ) : (
            <View style={[s.headerAvatar, { backgroundColor: Colors.section }]} />
          )}
          <View style={s.headerTextWrap}>
            <View style={s.headerNameRow}>
              <Text style={s.headerName}>{worker.name}</Text>
              {worker.isVerified && (
                <Ionicons name="checkmark-circle" size={13} color="#FFFFFF" style={{ opacity: 0.9 }} />
              )}
            </View>
            <View style={s.headerSubRow}>
              {worker.isAvailable && <View style={s.headerOnlineDot} />}
              <Text style={s.headerSub}>
                {worker.isAvailable
                  ? tx('지금 활동중', 'Active now', 'Aktif sekarang')
                  : tx('오프라인', 'Offline', 'Offline')}
              </Text>
              <Text style={s.headerDot}>·</Text>
              <Text style={s.headerSub}>{worker.location}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Info card */}
      <View style={[s.infoCard, { paddingBottom: 10 }]}>
        <View style={s.infoTop}>
          <View style={s.nameRow}>
            <Text style={s.name}>{worker.name}</Text>
            <Text style={s.age}>{worker.age}</Text>
            {worker.isVerified && <Ionicons name="checkmark-circle" size={18} color={Colors.accent} />}
          </View>

          <View style={s.metaRow}>
            <Ionicons name="star" size={13} color="#F59E0B" />
            <Text style={s.metaStrong}>{worker.rating.toFixed(1)}</Text>
            <Text style={s.metaText}>{tx(`리뷰 ${worker.reviewCount}건`, `${worker.reviewCount} reviews`, `${worker.reviewCount} ulasan`)}</Text>
            <Text style={s.metaDot}>·</Text>
            <Ionicons name="location-outline" size={12} color={Colors.grayLight} />
            <Text style={s.metaText}>{worker.location}</Text>
          </View>

          <View style={s.catRow}>
            {worker.categories.map((c) => {
              const meta = EXPLORE_CATEGORY_META[c];
              return (
                <View key={c} style={[s.catChip, { backgroundColor: meta.color + '18' }]}>
                  <Ionicons name={meta.icon as any} size={12} color={meta.color} />
                  <Text style={[s.catLabel, { color: meta.color }]}>
                    {lang === 'ko' ? meta.ko : lang === 'en' ? meta.en : meta.id}
                  </Text>
                </View>
              );
            })}
          </View>

          {worker.bio && <Text style={s.bio} numberOfLines={2}>{worker.bio}</Text>}
        </View>

        {/* Actions — 저장 / 메시지 / 예약 */}
        <View style={s.actions}>
          <FavBtn workerId={worker.id} tx={tx} />
          <IconBtn
            icon="chatbubble-ellipses-outline"
            label={tx('메시지', 'Message', 'Pesan')}
            onPress={() => navigation.navigate('ChatDetail', { chatId: `chat_${worker.id}`, name: worker.name, photo: worker.photos[0], role: 'helper' })}
          />
          <IconBtn
            icon="calendar-outline"
            label={tx('예약', 'Book', 'Pesan')}
            accent
            onPress={() => navigation.navigate('WorkerDetail', { workerId: worker.detailWorkerId })}
          />
        </View>
      </View>
    </View>
  );
}

// ── Sub-components ───────────────────────────────────────────
function IconBtn({ icon, label, accent, onPress }: {
  icon: any; label: string; accent?: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity style={s.iconBtn} activeOpacity={0.6} onPress={onPress}>
      <Ionicons name={icon} size={22} color={accent ? Colors.accent : Colors.dark} />
      <Text style={[s.iconLabel, accent && { color: Colors.accent, fontWeight: '700' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function FavBtn({ workerId, tx }: { workerId: string; tx: T }) {
  const isFav  = useFavoriteStore((s) => s.isFavorite(workerId));
  const toggle = useFavoriteStore((s) => s.toggle);
  return (
    <TouchableOpacity style={s.iconBtn} activeOpacity={0.6} onPress={() => toggle(workerId)}>
      <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={22} color={isFav ? '#EF4444' : Colors.dark} />
      <Text style={[s.iconLabel, isFav && { color: '#EF4444', fontWeight: '700' }]}>{tx('저장', 'Save', 'Simpan')}</Text>
    </TouchableOpacity>
  );
}

function EmptyScreen({ insetsTop, tx }: { insetsTop: number; tx: T }) {
  return (
    <View style={[s.root, { paddingTop: insetsTop + 80, alignItems: 'center', backgroundColor: Colors.white }]}>
      <Ionicons name="location-outline" size={64} color={Colors.grayLight} />
      <Text style={s.emptyTitle}>{tx('근처에 온라인 워커가 없어요', 'No online workers nearby', 'Belum ada helper online di sekitar')}</Text>
      <Text style={s.emptySub}>{tx('잠시 후 다시 확인해주세요', 'Check back in a moment', 'Coba cek lagi nanti')}</Text>
    </View>
  );
}

function FinishedScreen({ insetsTop, tx, onReset }: { insetsTop: number; tx: T; onReset: () => void }) {
  return (
    <View style={[s.root, { paddingTop: insetsTop + 80, alignItems: 'center', backgroundColor: Colors.white }]}>
      <Ionicons name="sparkles" size={64} color={Colors.accent} />
      <Text style={s.emptyTitle}>{tx('근처 워커 다 확인했어요', "You've seen everyone nearby", 'Sudah lihat semuanya')}</Text>
      <Text style={s.emptySub}>{tx('나중에 다시 확인해주세요', 'Check back later', 'Cek lagi nanti')}</Text>
      <TouchableOpacity style={s.resetBtn} activeOpacity={0.85} onPress={onReset}>
        <Text style={s.resetBtnText}>{tx('다시 보기', 'Restart', 'Mulai lagi')}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────
const s = StyleSheet.create({
  // 배경 흰색 — 슬라이드 중에도 까만 화면 안 보이도록
  root: { flex: 1, backgroundColor: Colors.white, overflow: 'hidden' },

  // 카드 스트립 — 가로로 모든 워커 카드를 깔아둠
  strip: { flex: 1, flexDirection: 'row' },

  // 단일 카드 슬롯 (한 워커 = 한 화면)
  cardSlot: { height: '100%', backgroundColor: Colors.white },

  photoArea: { width: '100%', flex: 1, backgroundColor: Colors.section, position: 'relative' },
  photo:     { width: '100%', height: '100%' },
  photoTopGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 160 },

  // 인스타식 스토리 헤더 — 사진 위에 떠있는 아바타 + 이름 + 상태
  storyHeader: {
    position: 'absolute', left: 14, right: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  headerAvatar: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.85)',
  },
  headerTextWrap: { flex: 1, gap: 1 },
  headerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerName: {
    fontSize: 14, fontWeight: '700', color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.45)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2,
  },
  headerSubRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerOnlineDot: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E',
  },
  headerSub: {
    fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2,
  },
  headerDot: { fontSize: 11, color: 'rgba(255,255,255,0.65)' },

  // 상단 진행바 (전체 화면 overlay)
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    paddingHorizontal: 14, zIndex: 10,
  },
  progressRow: { flexDirection: 'row', gap: 4 },
  progressSeg: {
    flex: 1, height: 3, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.32)',
  },
  progressSegDone:   { backgroundColor: 'rgba(255,255,255,0.85)' },
  progressSegActive: { backgroundColor: Colors.accent },   // 브랜드 컬러

  // 좌/우 탭 zone — top은 inline으로 지정 (insets 동적)
  tapZone: { position: 'absolute', width: SW * 0.4, height: '50%', zIndex: 5 },

  // 정보 카드 — 콘텐츠 만큼만
  infoCard: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20, paddingTop: 18, paddingBottom: 4,
    marginTop: -22,
    borderTopLeftRadius: 22, borderTopRightRadius: 22,
  },
  infoTop: { gap: 8, marginBottom: 12 },

  nameRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  name:    { fontSize: 22, fontWeight: '800', color: Colors.dark, letterSpacing: -0.3 },
  age:     { fontSize: 16, fontWeight: '500', color: Colors.gray, marginLeft: 2 },

  metaRow:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaStrong: { fontSize: 13, fontWeight: '700', color: Colors.dark },
  metaText: { fontSize: 12, color: Colors.gray },
  metaDot:  { fontSize: 12, color: Colors.grayLight, marginHorizontal: 2 },

  catRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  catChip:  {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 9, paddingVertical: 5,
    borderRadius: 11,
  },
  catLabel: { fontSize: 11, fontWeight: '700' },

  bio: { fontSize: 13, color: Colors.gray, lineHeight: 18 },

  // 액션 — 미니멀
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 2,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  iconBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 8, gap: 3,
  },
  iconLabel: { fontSize: 10, fontWeight: '500', color: Colors.dark },

  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.dark, marginTop: 16 },
  emptySub:   { fontSize: 13, color: Colors.gray, marginTop: 4 },
  resetBtn:   { marginTop: 24, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: Colors.accent },
  resetBtnText: { fontSize: 13, fontWeight: '700', color: Colors.white },
});
```

---

## 지도 (Map)

**파일**: `src/screens/map/MapScreen.tsx`

```tsx
import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, Animated, Platform,
  ActivityIndicator, Image, FlatList, Dimensions,
  Modal, Pressable,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { useLanguageStore } from '../../store/languageStore';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, CustomerTabParamList } from '../../types';
import { W1, W2, W3, W4, W5, W6, W7, W8, W9, W10, W11, W12, D7, D8, D9, D10, D11 } from '../../constants/photos';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type SvcType       = 'regular' | 'onetime' | 'live-in';
type ExpLevel      = 'all' | '1y' | '3y' | '5y';
type SortBy        = 'rating' | 'price_low' | 'price_high' | 'reviews';
type PartnerFilter = 'all' | 'helper' | 'driver';

const { height: SCREEN_H } = Dimensions.get('window');
const EXPANDED_H = SCREEN_H * 0.72;
const PEEK_H     = 240;

interface Partner {
  id: string; name: string; firstName: string;
  lat: number; lng: number;
  rating: number; pricePerHour: number; isAvailable: boolean;
  photo: string | number; location: string; totalJobs: number;
  serviceFrequency: 'regular' | 'special' | 'both';
  skills: string[]; experienceYears: number; isVerified: boolean;
  partnerType: 'helper' | 'driver';
  driverServices?: string[];
  licenseClass?: string;
}

// URL 문자열 또는 local require (number) 둘 다 받아서 Image source로 변환
const imgSrc = (p: string | number | undefined): any =>
  typeof p === 'string' ? { uri: p } : p;

// ── Demo cluster center (Kebayoran Baru, South Jakarta) ─────────
// For internal preview: always shows the dense cluster regardless of GPS
const DEMO_REGION = { latitude: -6.2488, longitude: 106.8052, latitudeDelta: 0.010, longitudeDelta: 0.010 };

const MOCK_PARTNERS: Partner[] = [
  { id:'p1',  name:'Sari Dewi',        firstName:'Sari',    lat:-6.2440, lng:106.8022, rating:5.0, pricePerHour:30000, isAvailable:true,  photo:W1,  location:'Kebayoran Baru', totalJobs:312, serviceFrequency:'regular', skills:['Beberes','Masak','Cuci'],      experienceYears:10, isVerified:true,  partnerType:'helper' },
  { id:'p2',  name:'Rina Wulandari',   firstName:'Rina',    lat:-6.2465, lng:106.8058, rating:4.9, pricePerHour:25000, isAvailable:true,  photo:W2,  location:'Kebayoran Baru', totalJobs:198, serviceFrequency:'regular', skills:['Masak Sehat','Beberes'],       experienceYears:7,  isVerified:true,  partnerType:'helper' },
  { id:'p3',  name:'Dewi Anggraeni',   firstName:'Dewi',    lat:-6.2492, lng:106.8072, rating:4.7, pricePerHour:28000, isAvailable:true,  photo:W3,  location:'Kemang',         totalJobs:143, serviceFrequency:'both',    skills:['Masak','Cuci'],                experienceYears:5,  isVerified:true,  partnerType:'helper' },
  { id:'p4',  name:'Fitri Handayani',  firstName:'Fitri',   lat:-6.2512, lng:106.8036, rating:4.9, pricePerHour:27000, isAvailable:true,  photo:W4,  location:'Pesanggrahan',   totalJobs:227, serviceFrequency:'regular', skills:['Setrika','Beberes'],           experienceYears:8,  isVerified:true,  partnerType:'helper' },
  { id:'p5',  name:'Indah Lestari',    firstName:'Indah',   lat:-6.2530, lng:106.8088, rating:4.8, pricePerHour:35000, isAvailable:false, photo:W5,  location:'Pondok Indah',   totalJobs:89,  serviceFrequency:'special', skills:['Deep Cleaning'],               experienceYears:3,  isVerified:true,  partnerType:'helper' },
  { id:'p6',  name:'Nurul Hidayah',    firstName:'Nurul',   lat:-6.2458, lng:106.8098, rating:4.8, pricePerHour:24000, isAvailable:true,  photo:W6,  location:'Kebayoran Baru', totalJobs:89,  serviceFrequency:'special', skills:['Cuci','Setrika'],              experienceYears:6,  isVerified:true,  partnerType:'helper' },
  { id:'p7',  name:'Sri Mulyani',      firstName:'Sri',     lat:-6.2480, lng:106.8012, rating:4.6, pricePerHour:23000, isAvailable:true,  photo:W7,  location:'Cilandak',       totalJobs:64,  serviceFrequency:'regular', skills:['Masak','Cuci'],                experienceYears:5,  isVerified:false, partnerType:'helper' },
  { id:'p8',  name:'Ratna Sari',       firstName:'Ratna',   lat:-6.2522, lng:106.8062, rating:4.9, pricePerHour:25000, isAvailable:true,  photo:W8,  location:'Kebayoran Baru', totalJobs:112, serviceFrequency:'both',    skills:['Beberes','Setrika'],           experienceYears:7,  isVerified:true,  partnerType:'helper' },
  { id:'p9',  name:'Wulan Sari',       firstName:'Wulan',   lat:-6.2447, lng:106.8078, rating:5.0, pricePerHour:26000, isAvailable:false, photo:W9,  location:'Pondok Indah',   totalJobs:201, serviceFrequency:'regular', skills:['Masak','Beberes'],             experienceYears:9,  isVerified:true,  partnerType:'helper' },
  { id:'p10', name:'Mega Putri',       firstName:'Mega',    lat:-6.2505, lng:106.8046, rating:4.7, pricePerHour:22000, isAvailable:true,  photo:W10, location:'Pesanggrahan',   totalJobs:77,  serviceFrequency:'special', skills:['Cuci','Deep Cleaning'],        experienceYears:2,  isVerified:false, partnerType:'helper' },
  { id:'p11', name:'Lina Kartini',     firstName:'Lina',    lat:-6.2470, lng:106.8032, rating:4.8, pricePerHour:26000, isAvailable:true,  photo:W11, location:'Kebayoran Baru', totalJobs:134, serviceFrequency:'regular', skills:['Beberes','Cuci'],              experienceYears:6,  isVerified:true,  partnerType:'helper' },
  { id:'p12', name:'Aisyah Putri',     firstName:'Aisyah',  lat:-6.2496, lng:106.8091, rating:4.9, pricePerHour:29000, isAvailable:true,  photo:W12, location:'Kemang',         totalJobs:176, serviceFrequency:'both',    skills:['Masak','Beberes','Setrika'],   experienceYears:8,  isVerified:true,  partnerType:'helper' },
  { id:'p13', name:'Yuni Rahayu',      firstName:'Yuni',    lat:-6.2460, lng:106.8052, rating:4.6, pricePerHour:21000, isAvailable:true,  photo:W3,  location:'Cilandak',       totalJobs:55,  serviceFrequency:'special', skills:['Cuci','Setrika'],              experienceYears:3,  isVerified:false, partnerType:'helper' },
  { id:'p14', name:'Hana Pratiwi',     firstName:'Hana',    lat:-6.2535, lng:106.8022, rating:4.9, pricePerHour:32000, isAvailable:true,  photo:W5,  location:'Pondok Indah',   totalJobs:248, serviceFrequency:'regular', skills:['Masak Sehat','Deep Cleaning'], experienceYears:11, isVerified:true,  partnerType:'helper' },
  { id:'p15', name:'Reni Susanti',     firstName:'Reni',    lat:-6.2475, lng:106.8068, rating:4.7, pricePerHour:24000, isAvailable:false, photo:W7,  location:'Kebayoran Baru', totalJobs:92,  serviceFrequency:'both',    skills:['Beberes','Masak'],             experienceYears:4,  isVerified:true,  partnerType:'helper' },
  { id:'p16', name:'Tutik Wahyuni',    firstName:'Tutik',   lat:-6.2500, lng:106.8082, rating:4.8, pricePerHour:27000, isAvailable:true,  photo:W9,  location:'Pesanggrahan',   totalJobs:163, serviceFrequency:'regular', skills:['Setrika','Cuci','Beberes'],    experienceYears:7,  isVerified:true,  partnerType:'helper' },
  { id:'p17', name:'Mira Handayani',   firstName:'Mira',    lat:-6.2450, lng:106.8040, rating:5.0, pricePerHour:33000, isAvailable:true,  photo:W1,  location:'Kebayoran Baru', totalJobs:289, serviceFrequency:'regular', skills:['Masak','Beberes','Cuci'],      experienceYears:12, isVerified:true,  partnerType:'helper' },
  { id:'p18', name:'Novi Anggraini',   firstName:'Novi',    lat:-6.2518, lng:106.8014, rating:4.6, pricePerHour:22000, isAvailable:true,  photo:W4,  location:'Cilandak',       totalJobs:48,  serviceFrequency:'special', skills:['Deep Cleaning','Cuci'],        experienceYears:2,  isVerified:false, partnerType:'helper' },
  { id:'p19', name:'Desi Kurniawati',  firstName:'Desi',    lat:-6.2485, lng:106.8056, rating:4.8, pricePerHour:28000, isAvailable:true,  photo:W6,  location:'Kemang',         totalJobs:121, serviceFrequency:'both',    skills:['Masak','Setrika'],             experienceYears:6,  isVerified:true,  partnerType:'helper' },
  { id:'p20', name:'Ayu Puspita',      firstName:'Ayu',     lat:-6.2442, lng:106.8092, rating:4.9, pricePerHour:31000, isAvailable:false, photo:W2,  location:'Pondok Indah',   totalJobs:187, serviceFrequency:'regular', skills:['Masak Sehat','Beberes'],       experienceYears:9,  isVerified:true,  partnerType:'helper' },
  // ── Drivers (고객 차량 운전 서비스) ───────────────────────────
  { id:'d1',  name:'Rahmat Hidayat',   firstName:'Rahmat',  lat:-6.2444, lng:106.8050, rating:5.0, pricePerHour:55000,  isAvailable:true,  photo:D7,  location:'Kebayoran Baru', totalJobs:284, serviceFrequency:'both',    skills:['Sedan','SUV','MPV'],           experienceYears:8,  isVerified:true,  partnerType:'driver', driverServices:['designated','daily','airport'], licenseClass:'SIM A' },
  { id:'d2',  name:'Budi Setiawan',    firstName:'Budi',    lat:-6.2478, lng:106.8032, rating:4.9, pricePerHour:50000,  isAvailable:true,  photo:D8,  location:'Menteng',        totalJobs:192, serviceFrequency:'regular', skills:['Sedan','SUV'],                 experienceYears:6,  isVerified:true,  partnerType:'driver', driverServices:['designated','hourly','commute'], licenseClass:'SIM A' },
  { id:'d3',  name:'Joko Susanto',     firstName:'Joko',    lat:-6.2510, lng:106.8018, rating:4.8, pricePerHour:45000,  isAvailable:true,  photo:D9,  location:'Cilandak',       totalJobs:156, serviceFrequency:'both',    skills:['Sedan','SUV','MPV','Van'],     experienceYears:10, isVerified:true,  partnerType:'driver', driverServices:['daily','intercity','event'], licenseClass:'SIM A Umum' },
  { id:'d4',  name:'Ari Wibowo',       firstName:'Ari',     lat:-6.2498, lng:106.8084, rating:4.9, pricePerHour:60000,  isAvailable:true,  photo:D10, location:'Kemang',         totalJobs:221, serviceFrequency:'both',    skills:['Sedan','SUV','MPV'],           experienceYears:7,  isVerified:true,  partnerType:'driver', driverServices:['designated','airport','event'], licenseClass:'SIM A' },
  { id:'d5',  name:'Agus Setiawan',    firstName:'Agus',    lat:-6.2520, lng:106.8040, rating:4.9, pricePerHour:52000,  isAvailable:true,  photo:D11, location:'Fatmawati',      totalJobs:178, serviceFrequency:'both',    skills:['Sedan','MPV','Van'],           experienceYears:9,  isVerified:true,  partnerType:'driver', driverServices:['daily','intercity','airport'], licenseClass:'SIM A Umum' },
];

const MAP_STYLE = [
  { elementType:'geometry',           stylers:[{color:'#f2f2f0'}] },
  { elementType:'labels.text.fill',   stylers:[{color:'#555555'}] },
  { elementType:'labels.text.stroke', stylers:[{color:'#f2f2f0'}] },
  { featureType:'road',             elementType:'geometry',        stylers:[{color:'#ffffff'}] },
  { featureType:'road',             elementType:'geometry.stroke', stylers:[{color:'#e8e8e8'}] },
  { featureType:'road.highway',     elementType:'geometry',        stylers:[{color:'#f0ede8'}] },
  { featureType:'water',            elementType:'geometry',        stylers:[{color:'#cde8f4'}] },
  { featureType:'poi.park',         elementType:'geometry',        stylers:[{color:'#daecd8'}] },
  { featureType:'poi',              stylers:[{visibility:'off'}] },
  { featureType:'transit',          stylers:[{visibility:'off'}] },
  { featureType:'landscape.built',  elementType:'geometry',        stylers:[{color:'#ebebeb'}] },
];

// ── Activity categories (identical to WorkerSearchScreen) ────────
const ACTIVITY_CATS = [
  {
    id: 'cleaning', icon: 'sparkles-outline' as const, color: '#10B981', bg: '#ECFDF5',
    label: { id: 'Kebersihan·Kerapian', ko: '청소·정리', en: 'Cleaning' },
    items: [
      { id: 'floor',    label: { id: 'Sapu & Pel Lantai',   ko: '바닥 청소',    en: 'Floor Cleaning' }, skill: 'Beberes'      },
      { id: 'kitchen',  label: { id: 'Bersih Dapur',        ko: '주방 청소',    en: 'Kitchen' },        skill: 'Beberes'      },
      { id: 'bathroom', label: { id: 'Bersih Kamar Mandi',  ko: '화장실 청소',  en: 'Bathroom' },       skill: 'Beberes'      },
      { id: 'balcony',  label: { id: 'Bersih Balkon',       ko: '베란다 청소',  en: 'Balcony' },        skill: 'Beberes'      },
      { id: 'window',   label: { id: 'Bersih Jendela',      ko: '창문 청소',    en: 'Windows' },        skill: 'Deep Cleaning'},
      { id: 'ac',       label: { id: 'Bersih AC',           ko: '에어컨 청소',  en: 'AC Cleaning' },    skill: 'Deep Cleaning'},
    ],
  },
  {
    id: 'cooking', icon: 'restaurant-outline' as const, color: '#F97316', bg: '#FFF1EC',
    label: { id: 'Masak·Makanan', ko: '요리·식사', en: 'Cooking' },
    items: [
      { id: 'meal',     label: { id: 'Masak Harian',    ko: '식사 준비',   en: 'Daily Meals' },      skill: 'Masak'      },
      { id: 'sidedish', label: { id: 'Lauk Pauk',       ko: '반찬 만들기', en: 'Side Dishes' },      skill: 'Masak'      },
      { id: 'dishes',   label: { id: 'Cuci Piring',     ko: '설거지',      en: 'Dishwashing' },      skill: 'Cuci'       },
      { id: 'prep',     label: { id: 'Persiapan Bahan', ko: '식재료 손질', en: 'Food Prep' },        skill: 'Masak Sehat'},
    ],
  },
  {
    id: 'laundry', icon: 'shirt-outline' as const, color: '#3B82F6', bg: '#EFF6FF',
    label: { id: 'Cuci·Setrika', ko: '세탁·관리', en: 'Laundry' },
    items: [
      { id: 'wash',    label: { id: 'Cuci Baju',       ko: '빨래',        en: 'Washing' },          skill: 'Cuci'    },
      { id: 'iron',    label: { id: 'Setrika',         ko: '다림질',      en: 'Ironing' },          skill: 'Setrika' },
      { id: 'fold',    label: { id: 'Rapikan Pakaian', ko: '세탁물 정리', en: 'Folding' },          skill: 'Setrika' },
      { id: 'laundry', label: { id: 'Laundry Kilat',   ko: '빠른 세탁',   en: 'Express Laundry' },  skill: 'Laundry' },
    ],
  },
  {
    id: 'other', icon: 'grid-outline' as const, color: '#8B5CF6', bg: '#F5F3FF',
    label: { id: 'Lainnya', ko: '기타', en: 'Others' },
    items: [
      { id: 'grocery', label: { id: 'Belanja Bahan', ko: '장보기',        en: 'Grocery Shopping' }, skill: 'Masak'   },
      { id: 'trash',   label: { id: 'Buang Sampah',  ko: '쓰레기 분리수거', en: 'Waste Disposal' }, skill: 'Beberes' },
    ],
  },
];

// flat list of all activity items — derived from ACTIVITY_CATS
const ALL_ACTIVITY_ITEMS = ACTIVITY_CATS.flatMap((cat) => cat.items.map((i) => ({ ...i, cat: cat.id })));

export default function MapScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<RouteProp<CustomerTabParamList, 'Map'>>();
  const { lang }   = useLanguageStore();
  const insets     = useSafeAreaInsets();
  const mapRef     = useRef<MapView>(null);

  const tx = (id: string, ko: string, en: string) =>
    lang === 'ko' ? ko : lang === 'en' ? en : id;
  const tLabel = (o: { id: string; ko: string; en: string }) =>
    lang === 'ko' ? o.ko : lang === 'en' ? o.en : o.id;

  // ── Map state ────────────────────────────────────────────────
  const [region, setRegion] = useState<Region>(DEMO_REGION);
  const [locationGranted, setLocationGranted] = useState(false);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState<Partner | null>(null);

  // ── Bottom sheet state ───────────────────────────────────────
  const [isExpanded, setIsExpanded] = useState(false);
  const sheetAnim   = useRef(new Animated.Value(EXPANDED_H - PEEK_H)).current;
  const detailAnim  = useRef(new Animated.Value(0)).current;

  // ── Filter state ─────────────────────────────────────────────
  const [partnerFilter, setPartnerFilter]      = useState<PartnerFilter>('all');
  const [serviceType, setServiceType]         = useState<SvcType | null>(null);
  const [selectedActivities, setSelectedAct]  = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly]        = useState(false);
  const [availableOnly, setAvailableOnly]      = useState(false);
  const [expLevel, setExpLevel]                = useState<ExpLevel>('all');
  const [sortBy, setSortBy]                    = useState<SortBy>('rating');

  // Modal visibility
  const [showActModal,  setShowActModal]  = useState(false);
  const [showCondModal, setShowCondModal] = useState(false);
  const [showWrkModal,  setShowWrkModal]  = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  // Temp filter state
  const [tmpAct,  setTmpAct]  = useState<string[]>([]);
  const [tmpSvc,  setTmpSvc]  = useState<SvcType | null>(null);
  const [tmpVer,  setTmpVer]  = useState(false);
  const [tmpExp,  setTmpExp]  = useState<ExpLevel>('all');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationGranted(true);
        // Demo mode: keep cluster region as default instead of jumping to GPS position
      }
      setLoading(false);
    })();
  }, []);

  // 언마운트 시 진행 중인 sheet/detail 애니메이션 정지 — Android 네이티브 노드 정리
  useEffect(() => {
    return () => {
      sheetAnim.stopAnimation();
      detailAnim.stopAnimation();
    };
  }, [sheetAnim, detailAnim]);

  // ── Handle navigation params (expand sheet / set service type / partner filter) ──
  // Use specific primitive deps to avoid infinite loop from setParams triggering re-renders
  useEffect(() => {
    const p = route.params as { expanded?: boolean; serviceType?: SvcType; partnerFilter?: PartnerFilter } | undefined;
    if (!p?.expanded && p?.serviceType === undefined && p?.partnerFilter === undefined) return;
    if (p.serviceType   !== undefined) setServiceType(p.serviceType);
    if (p.partnerFilter !== undefined) setPartnerFilter(p.partnerFilter);
    if (p.expanded) {
      setIsExpanded(true);
      sheetAnim.setValue(0);
    }
    // Clear only the params we consumed so subsequent focuses don't re-trigger
    (navigation as any).setParams({ expanded: undefined, serviceType: undefined, partnerFilter: undefined });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.expanded, route.params?.serviceType, route.params?.partnerFilter]);

  // ── Sheet expand/collapse ────────────────────────────────────
  const expandSheet = () => {
    setIsExpanded(true);
    Animated.spring(sheetAnim, { toValue: 0, useNativeDriver: true, speed: 20, bounciness: 3 }).start();
  };
  const collapseSheet = () => {
    setIsExpanded(false);
    Animated.timing(sheetAnim, { toValue: EXPANDED_H - PEEK_H, duration: 240, useNativeDriver: true }).start();
  };

  // ── Selected detail sheet ────────────────────────────────────
  const showDetail = (p: Partner) => {
    setSelected(p);
    Animated.spring(detailAnim, { toValue: 1, useNativeDriver: true, speed: 22, bounciness: 4 }).start();
  };
  const hideDetail = () => {
    Animated.timing(detailAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => setSelected(null));
  };

  const detailTranslateY = detailAnim.interpolate({ inputRange: [0, 1], outputRange: [320, 0] });

  // ── Filtered list ────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...MOCK_PARTNERS];

    if (partnerFilter !== 'all') list = list.filter((p) => p.partnerType === partnerFilter);

    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase()));

    if (serviceType === 'regular') list = list.filter((p) => p.serviceFrequency === 'regular' || p.serviceFrequency === 'both');
    else if (serviceType === 'onetime') list = list.filter((p) => p.serviceFrequency === 'special' || p.serviceFrequency === 'both');

    if (availableOnly) list = list.filter((p) => p.isAvailable);
    if (verifiedOnly) list = list.filter((p) => p.isVerified);
    if (expLevel === '1y') list = list.filter((p) => p.experienceYears >= 1);
    else if (expLevel === '3y') list = list.filter((p) => p.experienceYears >= 3);
    else if (expLevel === '5y') list = list.filter((p) => p.experienceYears >= 5);

    if (selectedActivities.length > 0) {
      const skills = ALL_ACTIVITY_ITEMS
        .filter((i: { id: string; skill: string }) => selectedActivities.includes(i.id))
        .map((i: { skill: string }) => i.skill);
      if (skills.length > 0) list = list.filter((p) => skills.some((sk: string) => p.skills.includes(sk)));
    }

    if (sortBy === 'rating')      list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'price_low')   list.sort((a, b) => a.pricePerHour - b.pricePerHour);
    else if (sortBy === 'price_high')  list.sort((a, b) => b.pricePerHour - a.pricePerHour);
    else if (sortBy === 'reviews')     list.sort((a, b) => b.totalJobs - a.totalJobs);

    return list;
  }, [search, partnerFilter, serviceType, availableOnly, verifiedOnly, expLevel, selectedActivities, sortBy]);

  const actActive  = selectedActivities.length > 0;
  const condActive = serviceType !== null;
  const wrkActive  = verifiedOnly || expLevel !== 'all';

  const SVC_TYPES = [
    { key: 'regular' as SvcType, label: tx('Berkala','정기','Regular'),  desc: tx('Jadwal tetap mingguan','정해진 날마다 방문','Fixed schedule') },
    { key: 'onetime' as SvcType, label: tx('Sekali','단기','One-time'),  desc: tx('Satu kali atau beberapa hari','하루 또는 며칠만 활동','Single visit') },
    { key: 'live-in' as SvcType, label: tx('Tinggal','상주','Live-in'), desc: tx('Tinggal di rumah','고객 집에서 생활','Lives at home') },
  ];
  const EXP_LEVELS = [
    { key: 'all' as ExpLevel, label: tx('Semua','전체','All') },
    { key: '1y'  as ExpLevel, label: tx('1 thn+','1년+','1yr+') },
    { key: '3y'  as ExpLevel, label: tx('3 thn+','3년+','3yr+') },
    { key: '5y'  as ExpLevel, label: tx('5 thn+','5년+','5yr+') },
  ];
  const SORT_OPTIONS = [
    { key: 'rating'     as SortBy, label: tx('Nilai terbaik','평점순','Top rated') },
    { key: 'reviews'    as SortBy, label: tx('Ulasan terbanyak','후기 많은순','Most reviewed') },
    { key: 'price_low'  as SortBy, label: tx('Harga terendah','가격 낮은순','Lowest price') },
    { key: 'price_high' as SortBy, label: tx('Harga tertinggi','가격 높은순','Highest price') },
  ];

  const goToMyLocation = async () => {
    if (!locationGranted) return;
    try {
      const loc = await Location.getCurrentPositionAsync({});
      const r = { latitude: loc.coords.latitude, longitude: loc.coords.longitude, latitudeDelta: 0.018, longitudeDelta: 0.018 };
      mapRef.current?.animateToRegion(r, 400);
    } catch {}
  };

  return (
    <View style={s.root}>
      {/* ── Map ──────────────────────────────────────────── */}
      {loading ? (
        <View style={s.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          customMapStyle={MAP_STYLE}
          region={region}
          showsUserLocation={locationGranted}
          showsMyLocationButton={false}
          showsCompass={false}
          onPress={() => selected && hideDetail()}
        >
          {filtered.map((p) => (
            <PartnerMarker
              key={p.id}
              partner={p}
              selected={selected?.id === p.id}
              onPress={() => showDetail(p)}
            />
          ))}
        </MapView>
      )}

      {/* ── Top overlay ──────────────────────────────────── */}
      <View style={[s.overlay, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
        <View style={s.searchWrap}>
          <View style={s.searchBar}>
            <Ionicons name="search-outline" size={16} color={Colors.grayLight} />
            <TextInput
              style={s.searchInput}
              placeholder={tx('Cari helper atau lokasi...', '헬퍼 또는 위치 검색...', 'Search helper or area...')}
              placeholderTextColor={Colors.grayLight}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={16} color={Colors.grayLight} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Zoom + location */}
        <View style={s.zoomBtns}>
          <TouchableOpacity style={s.zoomBtn} onPress={() => {
            const r = { ...region, latitudeDelta: region.latitudeDelta / 2, longitudeDelta: region.longitudeDelta / 2 };
            mapRef.current?.animateToRegion(r, 250); setRegion(r);
          }} activeOpacity={0.8}>
            <Ionicons name="add" size={20} color={Colors.dark} />
          </TouchableOpacity>
          <View style={s.zoomDivider} />
          <TouchableOpacity style={s.zoomBtn} onPress={() => {
            const r = { ...region, latitudeDelta: Math.min(region.latitudeDelta * 2, 60), longitudeDelta: Math.min(region.longitudeDelta * 2, 60) };
            mapRef.current?.animateToRegion(r, 250); setRegion(r);
          }} activeOpacity={0.8}>
            <Ionicons name="remove" size={20} color={Colors.dark} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={s.locBtn} onPress={goToMyLocation} activeOpacity={0.8}>
          <Ionicons name="navigate" size={18} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      {/* ══════════════════════════════════════════════════
          EXPANDABLE BOTTOM SHEET
      ══════════════════════════════════════════════════ */}
      <Animated.View style={[s.bottomSheet, { height: EXPANDED_H, transform: [{ translateY: sheetAnim }] }]}>

        {/* Handle — tap to toggle */}
        <TouchableOpacity style={s.handleWrap} onPress={isExpanded ? collapseSheet : expandSheet} activeOpacity={0.7}>
          <View style={s.handle} />
        </TouchableOpacity>

        {/* ── PEEK CONTENT — always visible (header + filters + stories) ── */}
        <View style={s.peekContent}>
          {/* Header row */}
          <View style={s.peekHeaderRow}>
            <View style={s.peekHeaderLeft}>
              <Text style={s.peekTitle}>{tx('내 주변 헬퍼', '내 주변 헬퍼', 'Nearby Helpers')}</Text>
              <View style={s.peekCountBadge}>
                <Text style={s.peekCountBadgeText}>{filtered.length}</Text>
              </View>
            </View>
            {isExpanded ? (
              <TouchableOpacity style={s.expandCloseBtn} onPress={collapseSheet} activeOpacity={0.7}>
                <Ionicons name="chevron-down" size={18} color={Colors.gray} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={s.peekExpandBtn} onPress={expandSheet} activeOpacity={0.8}>
                <Ionicons name="list-outline" size={13} color={Colors.white} />
                <Text style={s.peekExpandText}>{tx('전체보기', '전체보기', 'See all')}</Text>
                <Ionicons name="chevron-up" size={12} color={Colors.white} />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.peekFilterRow}>
            {/* Partner type toggle */}
            <TouchableOpacity style={[s.peekToggleChip, partnerFilter === 'helper' && s.peekToggleOn]} onPress={() => setPartnerFilter((v) => v === 'helper' ? 'all' : 'helper')} activeOpacity={0.75}>
              <Ionicons name="home-outline" size={11} color={partnerFilter === 'helper' ? Colors.white : Colors.helperColor} />
              <Text style={[s.peekToggleText, partnerFilter === 'helper' && s.peekToggleTextOn]}>{tx('Helper','헬퍼','Helper')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.peekToggleChip, partnerFilter === 'driver' && s.peekToggleOnTutor]} onPress={() => setPartnerFilter((v) => v === 'driver' ? 'all' : 'driver')} activeOpacity={0.75}>
              <Ionicons name="car-outline" size={11} color={partnerFilter === 'driver' ? Colors.white : Colors.tutorColor} />
              <Text style={[s.peekToggleText, partnerFilter === 'driver' && s.peekToggleTextOn]}>{tx('Driver','드라이버','Driver')}</Text>
            </TouchableOpacity>
            <View style={s.peekChipDivider} />
            <TouchableOpacity style={[s.peekChip, condActive && s.peekChipActive]} onPress={() => { setTmpSvc(serviceType); setShowCondModal(true); }} activeOpacity={0.75}>
              <Ionicons name="calendar-outline" size={12} color={condActive ? Colors.white : Colors.gray} />
              <Text style={[s.peekChipText, condActive && s.peekChipTextActive]}>{condActive ? SVC_TYPES.find((sv) => sv.key === serviceType)?.label : tx('정기/단기', '정기/단기', 'Job Type')}</Text>
              {condActive && <Ionicons name="close" size={11} color={Colors.white} onTouchEnd={(e: any) => { e.stopPropagation(); setServiceType(null); }} />}
            </TouchableOpacity>
            <View style={s.peekChipDivider} />
            <TouchableOpacity style={[s.peekToggleChip, availableOnly && s.peekToggleOn]} onPress={() => setAvailableOnly((v) => !v)} activeOpacity={0.75}>
              <View style={[s.peekToggleDot, { backgroundColor: availableOnly ? Colors.white : Colors.success }]} />
              <Text style={[s.peekToggleText, availableOnly && s.peekToggleTextOn]}>{tx('지금 가능', '지금 가능', 'Available')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.peekToggleChip, verifiedOnly && s.peekToggleOn]} onPress={() => setVerifiedOnly((v) => !v)} activeOpacity={0.75}>
              <Ionicons name="shield-checkmark" size={11} color={verifiedOnly ? Colors.white : Colors.accent} />
              <Text style={[s.peekToggleText, verifiedOnly && s.peekToggleTextOn]}>{tx('인증', '인증', 'Verified')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.peekToggleChip, expLevel === '5y' && s.peekToggleOn]} onPress={() => setExpLevel((v) => v === '5y' ? 'all' : '5y')} activeOpacity={0.75}>
              <Ionicons name="star" size={11} color={expLevel === '5y' ? Colors.white : '#F59E0B'} />
              <Text style={[s.peekToggleText, expLevel === '5y' && s.peekToggleTextOn]}>{tx('경력 5년+', '경력 5년+', '5yr+')}</Text>
            </TouchableOpacity>
            <View style={s.peekChipDivider} />
            <TouchableOpacity style={[s.peekChip, actActive && s.peekChipActive]} onPress={() => { setTmpAct(selectedActivities); setShowActModal(true); }} activeOpacity={0.75}>
              <Ionicons name="construct-outline" size={12} color={actActive ? Colors.white : Colors.gray} />
              <Text style={[s.peekChipText, actActive && s.peekChipTextActive]}>{tx('업무 종류', '업무 종류', 'Activities')}{actActive ? ` ·${selectedActivities.length}` : ''}</Text>
              {actActive && <Ionicons name="close" size={11} color={Colors.white} onTouchEnd={(e: any) => { e.stopPropagation(); setSelectedAct([]); }} />}
            </TouchableOpacity>
            <TouchableOpacity style={[s.peekChip, wrkActive && s.peekChipActive]} onPress={() => { setTmpVer(verifiedOnly); setTmpExp(expLevel); setShowWrkModal(true); }} activeOpacity={0.75}>
              <Ionicons name="person-circle-outline" size={12} color={wrkActive ? Colors.white : Colors.gray} />
              <Text style={[s.peekChipText, wrkActive && s.peekChipTextActive]}>{tx('헬퍼 조건', '헬퍼 조건', 'Helper')}{wrkActive ? ' ●' : ''}</Text>
              {wrkActive && <Ionicons name="close" size={11} color={Colors.white} onTouchEnd={(e: any) => { e.stopPropagation(); setVerifiedOnly(false); setExpLevel('all'); }} />}
            </TouchableOpacity>
            <TouchableOpacity style={s.peekChip} onPress={() => setShowSortModal(true)} activeOpacity={0.75}>
              <Ionicons name="funnel-outline" size={12} color={Colors.gray} />
              <Text style={s.peekChipText}>{SORT_OPTIONS.find((o) => o.key === sortBy)?.label}</Text>
              <Ionicons name="chevron-down" size={11} color={Colors.gray} />
            </TouchableOpacity>
          </ScrollView>

          {/* Stories scroll */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.storiesRow}>
            {filtered.map((p) => (
              <TouchableOpacity key={p.id} style={s.storyItem} activeOpacity={0.82} onPress={() => showDetail(p)}>
                <View style={[s.storyRing, { borderColor: p.isAvailable ? Colors.accent : Colors.gray200 }]}>
                  <Image source={imgSrc(p.photo)} style={s.storyPhoto} />
                  <View style={[s.storyDot, { backgroundColor: p.isAvailable ? Colors.success : Colors.grayLight }]} />
                </View>
                <View style={s.storyRatingRow}>
                  <Ionicons name="star" size={8} color="#F59E0B" />
                  <Text style={s.storyRating}>{p.rating.toFixed(1)}</Text>
                </View>
                <Text style={s.storyName} numberOfLines={1}>{p.firstName}</Text>
                <Text style={s.storyPrice}>Rp {(p.pricePerHour / 1000).toFixed(0)}rb</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── EXPANDED: 워커 리스트 ── */}
        {isExpanded && (
          <View style={{ flex: 1 }}>
            <View style={s.expandSortRow}>
              <Text style={s.expandCount}>
                <Text style={s.expandCountNum}>{filtered.length}</Text>
                {tx(' helper', '명', ' helpers')}
              </Text>
              <TouchableOpacity style={s.sortBtn} onPress={() => setShowSortModal(true)}>
                <Ionicons name="funnel-outline" size={12} color={Colors.gray} />
                <Text style={s.sortBtnText}>{SORT_OPTIONS.find((o) => o.key === sortBy)?.label}</Text>
                <Ionicons name="chevron-down" size={11} color={Colors.gray} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={filtered}
              keyExtractor={(p) => p.id}
              contentContainerStyle={s.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={s.empty}>
                  <Ionicons name="search-outline" size={36} color={Colors.grayLight} />
                  <Text style={s.emptyText}>{tx('Tidak ada helper', '헬퍼가 없어요', 'No helpers found')}</Text>
                </View>
              }
              renderItem={({ item: p }) => (
                <TouchableOpacity style={s.listCard} activeOpacity={0.92}
                  onPress={() => { collapseSheet(); p.partnerType === 'driver' ? navigation.navigate('DriverDetail', { driverId: p.id }) : navigation.navigate('WorkerDetail', { workerId: p.id }); }}>
                  <View style={s.listAvatarWrap}>
                    <Image source={imgSrc(p.photo)} style={s.listAvatar} />
                    <View style={[s.listAvailDot, { backgroundColor: p.isAvailable ? Colors.success : Colors.grayLight }]} />
                  </View>
                  <View style={s.listInfo}>
                    <View style={s.listNameRow}>
                      <Text style={s.listName}>{p.name}</Text>
                      {p.isVerified && <Ionicons name="checkmark-circle" size={13} color={Colors.accent} />}
                    </View>
                    <View style={s.listSubRow}>
                      <Ionicons name="location-outline" size={11} color={Colors.grayLight} />
                      <Text style={s.listSub}>{p.location}</Text>
                      <Text style={s.listDot}>·</Text>
                      <Ionicons name="star" size={11} color="#F59E0B" />
                      <Text style={s.listSub}>{p.rating.toFixed(1)}</Text>
                    </View>
                    <View style={s.listTagsRow}>
                      {p.skills.slice(0, 3).map((sk) => (
                        <View key={sk} style={s.listTag}><Text style={s.listTagText}>{sk}</Text></View>
                      ))}
                    </View>
                  </View>
                  <View style={s.listRight}>
                    <Text style={s.listPrice}>Rp {(p.pricePerHour / 1000).toFixed(0)}rb</Text>
                    <Text style={s.listPriceUnit}>/jam</Text>
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
          </View>
        )}
      </Animated.View>

      {/* ── Selected partner detail sheet ──────────────── */}
      {selected && (
        <>
          <TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={hideDetail} />
          <Animated.View style={[s.detailSheet, { transform: [{ translateY: detailTranslateY }] }]}>
            <View style={s.sheetHandle} />
            <View style={s.sheetHeader}>
              <Image source={imgSrc(selected.photo)} style={s.sheetPhoto} />
              <View style={s.sheetMeta}>
                <View style={s.sheetNameRow}>
                  <Text style={s.sheetName}>{selected.name}</Text>
                  <View style={[s.onlineDot, { backgroundColor: selected.isAvailable ? Colors.success : Colors.grayLight }]} />
                </View>
                <View style={s.sheetTagRow}>
                  {selected.partnerType === 'driver' ? (
                    <View style={[s.sheetTypeBadge, { backgroundColor: '#EDE9FE' }]}>
                      <Ionicons name="car" size={11} color={Colors.tutorColor} />
                      <Text style={[s.sheetTypeText, { color: Colors.tutorColor }]}>Driver</Text>
                    </View>
                  ) : (
                    <View style={[s.sheetTypeBadge, { backgroundColor: Colors.helperLight }]}>
                      <Ionicons name="home" size={11} color={Colors.helperColor} />
                      <Text style={[s.sheetTypeText, { color: Colors.helperColor }]}>Helper</Text>
                    </View>
                  )}
                  <Text style={s.sheetLocation}>{selected.location}</Text>
                </View>
              </View>
              <TouchableOpacity style={s.sheetClose} onPress={hideDetail}>
                <Ionicons name="close" size={16} color={Colors.gray} />
              </TouchableOpacity>
            </View>
            <View style={s.statsRow}>
              <View style={s.statItem}>
                <View style={s.statValueRow}>
                  <Ionicons name="star" size={13} color="#F59E0B" />
                  <Text style={s.statValue}>{selected.rating}</Text>
                </View>
                <Text style={s.statLabel}>{tx('Rating','평점','Rating')}</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.statItem}>
                <Text style={s.statValue}>Rp {selected.pricePerHour.toLocaleString('id-ID')}</Text>
                <Text style={s.statLabel}>/ jam</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.statItem}>
                <Text style={s.statValue}>{selected.totalJobs}</Text>
                <Text style={s.statLabel}>{tx('Pekerjaan','완료','Jobs')}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[s.bookBtn, !selected.isAvailable && s.bookBtnDisabled]}
              activeOpacity={selected.isAvailable ? 0.85 : 1}
              onPress={() => {
                if (!selected.isAvailable) return;
                hideDetail();
                if (selected.partnerType === 'driver') {
                  navigation.navigate('DriverDetail', { driverId: selected.id });
                } else {
                  navigation.navigate('WorkerDetail', { workerId: selected.id });
                }
              }}
            >
              <Text style={s.bookBtnText}>
                {selected.isAvailable ? tx('Lihat Profil','프로필 보기','View Profile') : tx('Sedang Sibuk','현재 예약 불가','Unavailable')}
              </Text>
              {selected.isAvailable && <Ionicons name="arrow-forward" size={16} color={Colors.white} />}
            </TouchableOpacity>
          </Animated.View>
        </>
      )}

      {/* ════════════════════════════════════════════════
          FILTER MODALS
      ════════════════════════════════════════════════ */}

      {/* Modal: 원하는 업무 */}
      <Modal visible={showActModal} transparent animationType="slide" onRequestClose={() => setShowActModal(false)}>
        <View style={s.modalRoot}>
          <Pressable style={s.modalOverlay} onPress={() => setShowActModal(false)} />
          <View style={[s.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>{tx('Pilih Jenis Kerja', '원하는 업무', 'Select Activities')}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {ACTIVITY_CATS.map((cat) => (
                <View key={cat.id} style={s.actCatSection}>
                  <View style={s.actCatHeader}>
                    <View style={[s.actCatIcon, { backgroundColor: cat.bg }]}>
                      <Ionicons name={cat.icon} size={14} color={cat.color} />
                    </View>
                    <Text style={s.actCatLabel}>{tLabel(cat.label)}</Text>
                  </View>
                  <View style={s.actPillsRow}>
                    {cat.items.map((item) => {
                      const sel = tmpAct.includes(item.id);
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[s.actPill, sel && s.actPillSel]}
                          onPress={() => setTmpAct((prev) => prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id])}
                          activeOpacity={0.7}
                        >
                          <Text style={[s.actPillText, sel && s.actPillTextSel]}>{tLabel(item.label)}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
              <View style={{ height: 8 }} />
            </ScrollView>
            <View style={s.modalFooter}>
              <TouchableOpacity style={s.resetBtn} onPress={() => setTmpAct([])}>
                <Ionicons name="refresh-outline" size={14} color={Colors.gray} />
                <Text style={s.resetBtnText}>{tx('Reset','초기화','Reset')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.applyBtn} onPress={() => { setSelectedAct(tmpAct); setShowActModal(false); }}>
                <Text style={s.applyBtnText}>{tx('Terapkan','적용하기','Apply')}{tmpAct.length > 0 ? ` (${tmpAct.length})` : ''}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: 업무 조건 */}
      <Modal visible={showCondModal} transparent animationType="slide" onRequestClose={() => setShowCondModal(false)}>
        <View style={s.modalRoot}>
          <Pressable style={s.modalOverlay} onPress={() => setShowCondModal(false)} />
          <View style={[s.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>{tx('Kondisi Pekerjaan','업무 조건','Job Conditions')}</Text>
            {SVC_TYPES.map((svc) => {
              const sel = tmpSvc === svc.key;
              return (
                <TouchableOpacity key={svc.key} style={[s.condRow, sel && s.condRowSel]}
                  onPress={() => setTmpSvc(sel ? null : svc.key)} activeOpacity={0.7}>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.condLabel, sel && s.condLabelSel]}>{svc.label}</Text>
                    <Text style={s.condDesc}>{svc.desc}</Text>
                  </View>
                  <View style={[s.condCheck, sel && s.condCheckSel]}>
                    {sel && <Ionicons name="checkmark" size={14} color={Colors.white} />}
                  </View>
                </TouchableOpacity>
              );
            })}
            <View style={[s.modalFooter, { marginTop: 16 }]}>
              <TouchableOpacity style={s.resetBtn} onPress={() => setTmpSvc(null)}>
                <Ionicons name="refresh-outline" size={14} color={Colors.gray} />
                <Text style={s.resetBtnText}>{tx('Reset','초기화','Reset')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.applyBtn} onPress={() => { setServiceType(tmpSvc); setShowCondModal(false); }}>
                <Text style={s.applyBtnText}>{tx('Terapkan','적용하기','Apply')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: 헬퍼 조건 */}
      <Modal visible={showWrkModal} transparent animationType="slide" onRequestClose={() => setShowWrkModal(false)}>
        <View style={s.modalRoot}>
          <Pressable style={s.modalOverlay} onPress={() => setShowWrkModal(false)} />
          <View style={[s.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>{tx('Kondisi Helper','헬퍼 조건','Helper Conditions')}</Text>
            <TouchableOpacity style={s.condRow} onPress={() => setTmpVer((v) => !v)} activeOpacity={0.7}>
              <View style={{ flex: 1 }}>
                <Text style={s.condLabel}>{tx('Terverifikasi','인증 헬퍼만','Verified Only')}</Text>
                <Text style={s.condDesc}>{tx('Sudah terverifikasi platform','플랫폼 인증을 받은 헬퍼','Platform certified')}</Text>
              </View>
              <View style={[s.condCheck, tmpVer && s.condCheckSel]}>
                {tmpVer && <Ionicons name="checkmark" size={14} color={Colors.white} />}
              </View>
            </TouchableOpacity>
            <Text style={[s.condSectionLabel, { marginTop: 18 }]}>{tx('Pengalaman','경력','Experience')}</Text>
            <View style={s.expRow}>
              {EXP_LEVELS.map((exp) => {
                const sel = tmpExp === exp.key;
                return (
                  <TouchableOpacity key={exp.key} style={[s.expPill, sel && s.expPillSel]} onPress={() => setTmpExp(exp.key)} activeOpacity={0.7}>
                    <Text style={[s.expPillText, sel && s.expPillTextSel]}>{exp.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={[s.modalFooter, { marginTop: 24 }]}>
              <TouchableOpacity style={s.resetBtn} onPress={() => { setTmpVer(false); setTmpExp('all'); }}>
                <Ionicons name="refresh-outline" size={14} color={Colors.gray} />
                <Text style={s.resetBtnText}>{tx('Reset','초기화','Reset')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.applyBtn} onPress={() => { setVerifiedOnly(tmpVer); setExpLevel(tmpExp); setShowWrkModal(false); }}>
                <Text style={s.applyBtnText}>{tx('Terapkan','적용하기','Apply')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: 정렬 */}
      <Modal visible={showSortModal} transparent animationType="slide" onRequestClose={() => setShowSortModal(false)}>
        <View style={s.modalRoot}>
          <Pressable style={s.modalOverlay} onPress={() => setShowSortModal(false)} />
          <View style={[s.sortSheet, { paddingBottom: insets.bottom + 8 }]}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>{tx('Urutkan','정렬','Sort by')}</Text>
            {SORT_OPTIONS.map((opt) => {
              const active = sortBy === opt.key;
              return (
                <TouchableOpacity key={opt.key} style={s.sortOptRow} onPress={() => { setSortBy(opt.key); setShowSortModal(false); }} activeOpacity={0.7}>
                  <Text style={[s.sortOptText, active && s.sortOptTextActive]}>{opt.label}</Text>
                  {active && <Ionicons name="checkmark" size={18} color={Colors.accent} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── Photo pin marker ──────────────────────────────────────────────
function PhotoMarker({ partner, selected, onImageLoad }: { partner: Partner; selected: boolean; onImageLoad?: () => void }) {
  const size = selected ? 52 : 44;
  const br   = selected ? 26 : 22;
  const isDriver = partner.partnerType === 'driver';
  const accent = isDriver ? Colors.tutorColor : Colors.helperColor;
  const borderColor = selected ? accent : Colors.white;
  return (
    <View style={m.wrap}>
      <View style={[m.bubble, { width: size + 6, height: size + 6, borderRadius: br + 3, borderColor }]}>
        <Image
          source={imgSrc(partner.photo)}
          style={{ width: size, height: size, borderRadius: br }}
          onLoad={onImageLoad}
        />
      </View>
      <View style={[m.typeBadge, { backgroundColor: accent }]}>
        <Ionicons name={isDriver ? 'car' : 'home'} size={8} color={Colors.white} />
      </View>
      <View style={[m.onlineDot, { backgroundColor: partner.isAvailable ? Colors.success : Colors.grayLight, top: 2, right: 2 }]} />
      <View style={[m.tail, { borderTopColor: borderColor }]} />
    </View>
  );
}

// ── Marker wrapper with load tracking (fixes Android blank markers) ──
function PartnerMarker({ partner, selected, onPress }: { partner: Partner; selected: boolean; onPress: () => void }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Marker
      coordinate={{ latitude: partner.lat, longitude: partner.lng }}
      onPress={onPress}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={!loaded || selected}
    >
      <PhotoMarker partner={partner} selected={selected} onImageLoad={() => setLoaded(true)} />
    </Marker>
  );
}

const m = StyleSheet.create({
  wrap:     { alignItems: 'center' },
  bubble:   { borderWidth: 2.5, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white, shadowColor:'#000', shadowOffset:{width:0,height:3}, shadowOpacity:0.18, shadowRadius:4, elevation:6 },
  typeBadge:{ position:'absolute', right:0, bottom:8, width:16, height:16, borderRadius:8, alignItems:'center', justifyContent:'center', borderWidth:1.5, borderColor:Colors.white },
  onlineDot:{ position:'absolute', width:11, height:11, borderRadius:5.5, borderWidth:1.5, borderColor:Colors.white },
  tail:     { width:0, height:0, borderLeftWidth:6, borderRightWidth:6, borderTopWidth:8, borderLeftColor:'transparent', borderRightColor:'transparent', marginTop:-1 },
});

const s = StyleSheet.create({
  root: { flex: 1 },

  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F8F8' },

  // Top overlay
  overlay: { position:'absolute', top:0, left:0, right:0 },
  searchWrap: { paddingHorizontal: 14, marginBottom: 8 },
  searchBar: { flexDirection:'row', alignItems:'center', gap:8, backgroundColor:Colors.white, borderRadius:Radius.pill, paddingHorizontal:14, paddingVertical:11, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.10, shadowRadius:6, elevation:4 },
  searchInput: { flex:1, fontSize:14, color:Colors.dark },

  zoomBtns: { position:'absolute', right:14, top:60, backgroundColor:Colors.white, borderRadius:12, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.12, shadowRadius:5, elevation:4, overflow:'hidden' },
  zoomBtn:  { width:42, height:42, alignItems:'center', justifyContent:'center' },
  zoomDivider: { height:1, backgroundColor:Colors.border, marginHorizontal:8 },
  locBtn:   { position:'absolute', right:14, top:172, width:42, height:42, borderRadius:21, backgroundColor:Colors.white, alignItems:'center', justifyContent:'center', shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.12, shadowRadius:5, elevation:4 },

  // Bottom sheet
  bottomSheet: {
    position:'absolute', bottom:0, left:0, right:0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 22, borderTopRightRadius: 22,
    shadowColor:'#000', shadowOffset:{width:0,height:-3}, shadowOpacity:0.10, shadowRadius:10, elevation:12,
    overflow: 'hidden',
  },
  handleWrap: { alignItems:'center', paddingVertical: 12 },
  handle:     { width:36, height:4, borderRadius:2, backgroundColor:Colors.border },

  // PEEK content — stories style
  peekContent:      { paddingBottom: 10 },
  peekHeaderRow:    { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, paddingBottom:10 },
  peekHeaderLeft:   { flexDirection:'row', alignItems:'center', gap:8 },
  peekTitle:        { fontSize:15, fontWeight:'700', color:Colors.dark },
  peekCountBadge:   { backgroundColor:Colors.accentLight, borderRadius:Radius.pill, paddingHorizontal:8, paddingVertical:2 },
  peekCountBadgeText:{ fontSize:12, fontWeight:'700', color:Colors.accent },
  peekExpandBtn:    { flexDirection:'row', alignItems:'center', gap:4, backgroundColor:Colors.accent, borderRadius:Radius.pill, paddingHorizontal:12, paddingVertical:7 },
  peekExpandText:   { fontSize:12, fontWeight:'700', color:Colors.white },

  // Peek filter chips
  peekFilterRow:    { paddingHorizontal:16, gap:7, paddingBottom:10, flexDirection:'row', alignItems:'center' },
  peekChip:         { flexDirection:'row', alignItems:'center', gap:4, paddingHorizontal:10, paddingVertical:6, borderRadius:Radius.pill, borderWidth:1, borderColor:Colors.borderMid, backgroundColor:Colors.white },
  peekChipActive:   { backgroundColor:Colors.accent, borderColor:Colors.accent },
  peekChipText:     { fontSize:12, fontWeight:'500', color:Colors.gray },
  peekChipTextActive:{ color:Colors.white, fontWeight:'600' },
  // Peek on/off toggle chips
  peekToggleChip:   { flexDirection:'row', alignItems:'center', gap:4, paddingHorizontal:10, paddingVertical:6, borderRadius:Radius.pill, borderWidth:1, borderColor:Colors.borderMid, backgroundColor:Colors.white },
  peekToggleOn:       { backgroundColor:Colors.accent, borderColor:Colors.accent },
  peekToggleOnTutor:  { backgroundColor:Colors.tutorColor, borderColor:Colors.tutorColor },
  peekToggleDot:    { width:7, height:7, borderRadius:4 },
  peekToggleText:   { fontSize:12, fontWeight:'500', color:Colors.gray },
  peekToggleTextOn: { color:Colors.white, fontWeight:'600' },
  peekChipDivider:  { width:1, height:18, backgroundColor:Colors.border, marginHorizontal:2 },

  // Stories
  storiesRow:    { paddingHorizontal:16, gap:14, paddingBottom:2 },
  storyItem:     { alignItems:'center', width:62 },
  storyRing:     { width:62, height:62, borderRadius:31, borderWidth:2.5, padding:2, marginBottom:5, position:'relative' },
  storyPhoto:    { width:53, height:53, borderRadius:26.5 },
  storyDot:      { position:'absolute', bottom:1, right:1, width:13, height:13, borderRadius:6.5, borderWidth:2, borderColor:Colors.white },
  storyRatingRow:{ flexDirection:'row', alignItems:'center', gap:2, marginBottom:3 },
  storyRating:   { fontSize:10, fontWeight:'700', color:Colors.dark },
  storyName:     { fontSize:11, fontWeight:'600', color:Colors.dark, textAlign:'center', width:62 },
  storyPrice:    { fontSize:10, color:Colors.gray, textAlign:'center' },

  // Expanded header
  expandHeader:    { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, paddingBottom:10 },
  expandHeaderTitle:{ fontSize:15, fontWeight:'700', color:Colors.dark },
  expandCloseBtn:  { width:32, height:32, borderRadius:16, backgroundColor:Colors.section, alignItems:'center', justifyContent:'center' },

  // EXPANDED content
  expandFilterBar:  { flexDirection:'row', gap:7, paddingHorizontal:16, paddingBottom:10 },
  expandChip:       { flexDirection:'row', alignItems:'center', gap:4, paddingHorizontal:11, paddingVertical:7, borderRadius:Radius.pill, borderWidth:1, borderColor:Colors.borderMid, backgroundColor:Colors.white },
  expandChipActive:    { backgroundColor:Colors.accent, borderColor:Colors.accent },
  expandChipText:      { fontSize:12, fontWeight:'500', color:Colors.dark },
  expandChipTextActive:{ color:Colors.white, fontWeight:'600' },

  expandSortRow:   { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, paddingBottom:10 },
  expandCount:     { fontSize:13, color:Colors.gray },
  expandCountNum:  { fontWeight:'700', color:Colors.dark },
  sortBtn:         { flexDirection:'row', alignItems:'center', gap:4, paddingHorizontal:10, paddingVertical:5, borderRadius:Radius.pill, borderWidth:1, borderColor:Colors.border },
  sortBtnText:     { fontSize:12, color:Colors.gray },

  // List cards in expanded
  listContent: { paddingHorizontal:16, paddingBottom:32 },
  empty:       { alignItems:'center', paddingTop:40, gap:10 },
  emptyText:   { fontSize:14, color:Colors.grayLight },
  listCard:    { flexDirection:'row', alignItems:'center', gap:12, backgroundColor:Colors.white, borderRadius:Radius.lg, borderWidth:1, borderColor:Colors.border, padding:12, ...Shadow.sm },
  listAvatarWrap: { position:'relative' },
  listAvatar:  { width:50, height:50, borderRadius:25 },
  listAvailDot:{ position:'absolute', bottom:1, right:1, width:11, height:11, borderRadius:5.5, borderWidth:2, borderColor:Colors.white },
  listInfo:    { flex:1 },
  listNameRow: { flexDirection:'row', alignItems:'center', gap:5, marginBottom:3 },
  listName:    { fontSize:14, fontWeight:'700', color:Colors.dark },
  listSubRow:  { flexDirection:'row', alignItems:'center', gap:3, marginBottom:5 },
  listSub:     { fontSize:11, color:Colors.grayLight },
  listDot:     { fontSize:11, color:Colors.grayLight },
  listTagsRow: { flexDirection:'row', gap:5 },
  listTag:     { backgroundColor:Colors.section, borderRadius:4, paddingHorizontal:7, paddingVertical:2 },
  listTagText: { fontSize:10, color:Colors.gray },
  listRight:   { alignItems:'flex-end' },
  listPrice:   { fontSize:14, fontWeight:'700', color:Colors.accent },
  listPriceUnit:{ fontSize:11, color:Colors.gray },

  // Selected detail sheet
  backdrop:     { ...StyleSheet.absoluteFillObject, backgroundColor:'transparent' },
  detailSheet:  { position:'absolute', bottom:0, left:0, right:0, backgroundColor:Colors.white, borderTopLeftRadius:22, borderTopRightRadius:22, paddingHorizontal:20, paddingBottom:36, paddingTop:12, shadowColor:'#000', shadowOffset:{width:0,height:-3}, shadowOpacity:0.12, shadowRadius:10, elevation:14 },
  sheetHandle:  { width:36, height:4, borderRadius:2, backgroundColor:Colors.border, alignSelf:'center', marginBottom:18 },
  sheetHeader:  { flexDirection:'row', alignItems:'center', gap:12, marginBottom:16 },
  sheetPhoto:   { width:52, height:52, borderRadius:26 },
  sheetMeta:    { flex:1, gap:6 },
  sheetNameRow: { flexDirection:'row', alignItems:'center', gap:8 },
  sheetName:    { fontSize:16, fontWeight:'700', color:Colors.dark },
  onlineDot:    { width:8, height:8, borderRadius:4 },
  sheetVerifiedBadge: { flexDirection:'row', alignItems:'center', gap:3, backgroundColor:Colors.accentLight, borderRadius:Radius.pill, paddingHorizontal:7, paddingVertical:3 },
  sheetVerifiedText:  { fontSize:11, fontWeight:'600', color:Colors.accent },
  sheetTagRow:  { flexDirection:'row', alignItems:'center', gap:8 },
  sheetTypeBadge:{ flexDirection:'row', alignItems:'center', gap:4, borderRadius:Radius.pill, paddingHorizontal:8, paddingVertical:3 },
  sheetTypeText: { fontSize:11, fontWeight:'700' },
  sheetLocation: { fontSize:12, color:Colors.grayLight },
  sheetClose:    { width:30, height:30, borderRadius:15, backgroundColor:Colors.section, alignItems:'center', justifyContent:'center' },
  statsRow:     { flexDirection:'row', alignItems:'center', backgroundColor:Colors.section, borderRadius:Radius.lg, paddingVertical:14, marginBottom:14 },
  statItem:     { flex:1, alignItems:'center', gap:4 },
  statValueRow: { flexDirection:'row', alignItems:'center', gap:4 },
  statValue:    { fontSize:15, fontWeight:'700', color:Colors.dark },
  statLabel:    { fontSize:11, color:Colors.gray },
  statDivider:  { width:1, height:28, backgroundColor:Colors.border },
  bookBtn:      { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, backgroundColor:Colors.dark, borderRadius:Radius.pill, paddingVertical:15 },
  bookBtnDisabled:{ backgroundColor:Colors.grayLight },
  bookBtnText:  { fontSize:15, fontWeight:'700', color:Colors.white },

  // Filter modals
  modalRoot:   { flex:1 },
  modalOverlay:{ flex:1, backgroundColor:'rgba(0,0,0,0.4)' },
  modalSheet:  { backgroundColor:Colors.white, borderTopLeftRadius:24, borderTopRightRadius:24, paddingTop:12, paddingHorizontal:20, maxHeight:'85%', ...Shadow.lg },
  sortSheet:   { backgroundColor:Colors.white, borderTopLeftRadius:24, borderTopRightRadius:24, paddingTop:12, paddingHorizontal:20, ...Shadow.lg },
  modalHandle: { width:36, height:4, borderRadius:2, backgroundColor:Colors.border, alignSelf:'center', marginBottom:20 },
  modalTitle:  { fontSize:17, fontWeight:'700', color:Colors.dark, marginBottom:16 },

  actCatSection:{ marginBottom:18 },
  actCatHeader: { flexDirection:'row', alignItems:'center', gap:8, marginBottom:10 },
  actCatIcon:   { width:24, height:24, borderRadius:6, alignItems:'center', justifyContent:'center' },
  actCatLabel:  { fontSize:14, fontWeight:'700', color:Colors.dark },
  actPillsRow:  { flexDirection:'row', flexWrap:'wrap', gap:8 },
  actPill:      { paddingHorizontal:13, paddingVertical:8, borderRadius:Radius.pill, borderWidth:1, borderColor:Colors.border, backgroundColor:Colors.white },
  actPillSel:   { backgroundColor:Colors.accent, borderColor:Colors.accent },
  actPillText:  { fontSize:13, color:Colors.dark },
  actPillTextSel:{ color:Colors.white, fontWeight:'600' },

  condSectionLabel:{ fontSize:13, fontWeight:'600', color:Colors.grayLight, marginBottom:10 },
  condRow:      { flexDirection:'row', alignItems:'center', paddingVertical:14, paddingHorizontal:16, borderRadius:Radius.md, marginBottom:8, borderWidth:1.5, borderColor:Colors.border, backgroundColor:Colors.white },
  condRowSel:   { borderColor:Colors.accent, backgroundColor:Colors.accentLight },
  condLabel:    { fontSize:15, fontWeight:'600', color:Colors.dark, marginBottom:2 },
  condLabelSel: { color:Colors.accent },
  condDesc:     { fontSize:12, color:Colors.gray },
  condCheck:    { width:22, height:22, borderRadius:11, borderWidth:1.5, borderColor:Colors.border, alignItems:'center', justifyContent:'center' },
  condCheckSel: { backgroundColor:Colors.accent, borderColor:Colors.accent },

  expRow:       { flexDirection:'row', gap:8 },
  expPill:      { flex:1, alignItems:'center', paddingVertical:10, borderRadius:Radius.md, borderWidth:1.5, borderColor:Colors.border, backgroundColor:Colors.white },
  expPillSel:   { backgroundColor:Colors.accent, borderColor:Colors.accent },
  expPillText:  { fontSize:13, fontWeight:'500', color:Colors.dark },
  expPillTextSel:{ color:Colors.white, fontWeight:'700' },

  sortOptRow:   { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:14, borderBottomWidth:1, borderBottomColor:Colors.border },
  sortOptText:  { fontSize:15, color:Colors.dark },
  sortOptTextActive:{ fontWeight:'700', color:Colors.accent },

  modalFooter:  { flexDirection:'row', gap:10, paddingTop:16, borderTopWidth:1, borderTopColor:Colors.border },
  resetBtn:     { flexDirection:'row', alignItems:'center', gap:6, paddingHorizontal:16, paddingVertical:13, borderRadius:Radius.pill, borderWidth:1, borderColor:Colors.border },
  resetBtnText: { fontSize:14, color:Colors.gray },
  applyBtn:     { flex:1, alignItems:'center', paddingVertical:14, borderRadius:Radius.pill, backgroundColor:Colors.accent },
  applyBtnText: { fontSize:15, fontWeight:'700', color:Colors.white },
});
```

---

## 워커 디테일 (커버+갤러리)

**파일**: `src/screens/customer/WorkerDetailScreen.tsx`

```tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { getMonthlyAwardBadge } from '../../constants/monthlyAwards';
import { MvpMiniBadge } from '../../components/common/MonthlyAwardCard';
import { W1, W2, W3, W4, W5, W6, W7, W8, C1, C2, C3 } from '../../constants/photos';

// 워커가 SNS처럼 본인 프로필 꾸미는 톤 — 6장 (WorkerProfileScreen 동일)
const GALLERY_PHOTOS: string[] = [W1, W2, W4, W5, W6, W7];
// 기본 커버 (워커가 따로 설정 안 한 경우 — W3 사용. WorkerProfileScreen 기본값과 동일)
const DEFAULT_COVER = W3;
import { RootStackParamList, Worker } from '../../types';
import { useLanguageStore } from '../../store/languageStore';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkerDetail'>;

/** 평점과 누적 주문 기반 Linka 온도 추정치 (목업) */
const computeTemp = (rating: number, totalJobs: number) =>
  Math.max(36.5, Math.min(99, 36.5 + (rating - 4.5) * 18 + Math.sqrt(totalJobs) * 1.5));

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
  // ── Tutors ────────────────────────────────────────────────────
  {
    id: 't1', name: 'Budi Santoso', phone: '0821-1111-2222', role: 'tutor', serviceType: 'tutor',
    photo: W1,
    pricePerHour: 80000,
    location: 'Menteng, Jakarta Pusat',
    bio: 'Lulusan ITB jurusan Matematika. Sudah 6 tahun mengajar privat, khusus SMP–SMA. Metode belajar menyenangkan, sabar, dan fokus pada pemahaman konsep dasar.',
    subjects: ['Matematika', 'Fisika', 'Kimia'],
    isAvailable: true, rating: 5.0, totalJobs: 52, isVerified: true, experienceYears: 6,
  },
  {
    id: 't2', name: 'Lisa Permata', phone: '0821-3333-4444', role: 'tutor', serviceType: 'tutor',
    photo: W2,
    pricePerHour: 70000,
    location: 'Kemang, Jakarta Selatan',
    bio: 'Native-like English speaker, lulusan S2 Linguistik UI. Pengalaman mengajar konversasi, grammar, IELTS, dan TOEFL. Cocok untuk semua usia.',
    subjects: ['Bahasa Inggris', 'IELTS', 'TOEFL'],
    isAvailable: true, rating: 4.9, totalJobs: 38, isVerified: true, experienceYears: 5,
  },
  {
    id: 't3', name: 'Hendra Wijaya', phone: '0821-5555-6666', role: 'tutor', serviceType: 'tutor',
    photo: W3,
    pricePerHour: 100000,
    location: 'Senayan, Jakarta Selatan',
    bio: 'Mantan guru SMA unggulan, kini full-time tutor privat. Spesialis persiapan SNBT dan olimpiade Sains. Murid berhasil masuk UI, ITB, dan UNPAD.',
    subjects: ['Kimia', 'Biologi', 'Persiapan SNBT'],
    isAvailable: true, rating: 4.8, totalJobs: 29, isVerified: true, experienceYears: 9,
  },
  {
    id: 't4', name: 'Anisa Rahayu', phone: '0821-7777-8888', role: 'tutor', serviceType: 'tutor',
    photo: W4,
    pricePerHour: 65000,
    location: 'Tebet, Jakarta Selatan',
    bio: 'Ahli matematika SD–SMP. Menggunakan metode visual dan permainan agar anak tidak takut matematika. Sudah membimbing 60+ murid.',
    subjects: ['Matematika SD', 'Matematika SMP'],
    isAvailable: true, rating: 4.9, totalJobs: 61, isVerified: true, experienceYears: 4,
  },
  {
    id: 't5', name: 'Rizky Pratama', phone: '0821-9999-0000', role: 'tutor', serviceType: 'tutor',
    photo: W5,
    pricePerHour: 90000,
    location: 'Kelapa Gading, Jakarta Utara',
    bio: 'Certified IELTS instructor dengan skor IELTS 8.5. Fokus pada persiapan IELTS, TOEFL iBT, dan beasiswa luar negeri. Metode intensif & efisien.',
    subjects: ['Bahasa Inggris', 'IELTS', 'Beasiswa'],
    isAvailable: true, rating: 4.7, totalJobs: 18, isVerified: true, experienceYears: 3,
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
  const insets = useSafeAreaInsets();
  const worker = MOCK_WORKERS.find((w) => w.id === workerId) ?? MOCK_WORKERS[0];
  const [duration, setDuration] = useState(4);

  const depositRate = 0.3; // 30% deposit
  const totalPrice  = worker.pricePerHour * duration;
  const deposit     = Math.ceil(totalPrice * depositRate / 1000) * 1000;
  const remaining   = totalPrice - deposit;

  const isTutor = worker.serviceType === 'tutor';

  const handleBook = () => {
    navigation.navigate('Booking', {
      workerId:     worker.id,
      workerName:   worker.name,
      workerPhoto:  worker.photo,
      pricePerHour: worker.pricePerHour,
      serviceType:  worker.serviceType,
      pricePerDay:  worker.pricePerDay,
    });
  };

  const handleChat = () => {
    navigation.navigate('ChatDetail', {
      chatId: `chat_${worker.id}`,
      name: worker.name,
      photo: worker.photo,
      role: worker.role,
    });
  };

  // 워커별 커버 — mock: 모든 워커가 같은 W3 사용 (실제로는 worker.coverPhoto 필드 만들어서 워커가 설정)
  // 미설정 워커는 흰 배경
  const coverPhoto: string | null = DEFAULT_COVER;

  return (
    <View style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Cover photo (SNS-style — 워커가 설정한 사진. 없으면 흰 배경) ── */}
        <View style={s.coverWrap}>
          {coverPhoto ? (
            <Image source={{ uri: coverPhoto }} style={s.coverImage} />
          ) : (
            <View style={[s.coverImage, { backgroundColor: Colors.white }]} />
          )}
          {/* Floating back button on cover */}
          <TouchableOpacity style={[s.backBtn, { top: insets.top + 6 }]} onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('CustomerTabs' as never)}>
            <Ionicons name="chevron-back" size={24} color={Colors.dark} />
          </TouchableOpacity>
          <TouchableOpacity style={[s.shareBtn, { top: insets.top + 6 }]}>
            <Ionicons name="share-outline" size={20} color={Colors.dark} />
          </TouchableOpacity>
        </View>

        {/* ── Hero — avatar overlapping cover + identity ── */}
        <View style={s.heroSns}>
          <View style={s.avatarRing}>
            {worker.photo ? (
              <Image source={{ uri: worker.photo }} style={s.avatarBig} />
            ) : (
              <View style={[s.avatarBig, s.heroPhotoFallback]}>
                <Text style={s.heroPhotoLetter}>{worker.name.charAt(0)}</Text>
              </View>
            )}
            {worker.isAvailable && <View style={s.availStatusDot} />}
          </View>

          <View style={s.heroNameRow}>
            <Text style={s.heroNameBig}>{worker.name}</Text>
            {worker.isVerified && (
              <Ionicons name="checkmark-circle" size={20} color={Colors.accent} />
            )}
            {getMonthlyAwardBadge(worker.id) && <MvpMiniBadge role="helper" />}
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

        {/* Stats */}
        <View style={s.statsCard}>
          {[
            { label: t.workerDetail.jobsDone, value: `${worker.totalJobs}` },
            { label: 'Suhu Linka',            value: `${computeTemp(worker.rating ?? 4.5, worker.totalJobs ?? 0).toFixed(1)}°C`, isTemp: true },
            { label: t.workerDetail.expYears, value: `${worker.experienceYears}` },
          ].map((stat, i, arr) => (
            <React.Fragment key={stat.label}>
              <View style={s.statCol}>
                <Text style={[s.statValue, stat.isTemp && { color: '#EF4444' }]}>{stat.value}</Text>
                <Text style={s.statLabel}>{stat.label}</Text>
              </View>
              {i < arr.length - 1 && <View style={s.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Verification badges */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>신뢰 정보</Text>
          <View style={s.verifyRow}>
            <View style={[s.verifyChip, worker.isVerified && s.verifyChipOn]}>
              <Ionicons name="card-outline" size={14} color={worker.isVerified ? Colors.accent : Colors.grayLight} />
              <Text style={[s.verifyText, worker.isVerified && s.verifyTextOn]}>KTP</Text>
            </View>
            <View style={[s.verifyChip, worker.isVerified && s.verifyChipOn]}>
              <Ionicons name="shield-checkmark-outline" size={14} color={worker.isVerified ? Colors.accent : Colors.grayLight} />
              <Text style={[s.verifyText, worker.isVerified && s.verifyTextOn]}>BPJS</Text>
            </View>
            <View style={[s.verifyChip, worker.isVerified && s.verifyChipOn]}>
              <Ionicons name="card-outline" size={14} color={worker.isVerified ? Colors.accent : Colors.grayLight} />
              <Text style={[s.verifyText, worker.isVerified && s.verifyTextOn]}>Bank</Text>
            </View>
            <View style={[s.verifyChip, s.verifyChipOn]}>
              <Ionicons name="finger-print-outline" size={14} color={Colors.accent} />
              <Text style={[s.verifyText, s.verifyTextOn]}>본인인증</Text>
            </View>
          </View>
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

        {/* Gallery — SNS photos */}
        {!isTutor && (
          <View style={s.section}>
            <View style={s.portfolioHeader}>
              <Text style={s.sectionTitle}>사진</Text>
              <Text style={s.portfolioCount}>{GALLERY_PHOTOS.length}</Text>
            </View>
            <View style={s.portfolioGrid}>
              {GALLERY_PHOTOS.map((uri, i) => (
                <View key={i} style={s.portfolioCell}>
                  <Image source={{ uri }} style={s.portfolioImage} />
                </View>
              ))}
            </View>
          </View>
        )}

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
    position: 'absolute', left: 16, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.sm,
  },
  shareBtn: {
    position: 'absolute', right: 16, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.sm,
  },

  // ── Cover (SNS-style) ──
  coverWrap: { width: '100%', height: 180, position: 'relative', backgroundColor: Colors.accentLight },
  coverImage: { width: '100%', height: '100%' },
  coverOverlay: {
    position: 'absolute', inset: 0,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },

  // ── SNS hero ──
  heroSns: {
    paddingHorizontal: 20, paddingTop: 0, paddingBottom: 18,
    alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  avatarRing: {
    marginTop: -54,
    width: 112, height: 112, borderRadius: 56,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.md,
    position: 'relative',
  },
  avatarBig: { width: 104, height: 104, borderRadius: 52 },
  availStatusDot: {
    position: 'absolute', bottom: 6, right: 6,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: Colors.success,
    borderWidth: 3, borderColor: Colors.white,
  },
  heroNameBig: { fontSize: 22, fontWeight: '800', color: Colors.dark },

  // Hero (legacy — kept for fallback)
  hero: {
    paddingHorizontal: 20, paddingBottom: 20,
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
  heroNameRow:{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, marginBottom: 5 },
  heroName:   { fontSize: 20, fontWeight: '700', color: Colors.dark },
  heroMeta:   { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  heroMetaText: { fontSize: 13, color: Colors.gray },
  heroPillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },

  // ── Verification chips ──
  verifyRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  verifyChip:   {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 11, paddingVertical: 7,
    borderRadius: Radius.pill,
    borderWidth: 1.2, borderColor: Colors.border,
    backgroundColor: Colors.section,
  },
  verifyChipOn: { backgroundColor: Colors.accentLight, borderColor: Colors.accent + '40' },
  verifyText:   { fontSize: 12, fontWeight: '600', color: Colors.grayLight },
  verifyTextOn: { color: Colors.accent },

  // ── Portfolio grid ──
  portfolioHeader: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 12 },
  portfolioCount:  { fontSize: 12, color: Colors.grayLight, fontWeight: '500' },
  portfolioGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  portfolioCell:   { width: '32%', aspectRatio: 1, borderRadius: 10, overflow: 'hidden', backgroundColor: Colors.section },
  portfolioImage:  { width: '100%', height: '100%' },
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
```

---

## 드라이버 디테일

**파일**: `src/screens/driver/DriverDetailScreen.tsx`

```tsx
/**
 * DriverDetailScreen — 드라이버 상세 & 예약
 * 고객이 드라이버 프로필을 보고 예약하는 페이지
 */
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { W1, W2, W4, W5, W6, W7 } from '../../constants/photos';

// SNS 사진 — 드라이버가 본인 프로필 꾸미는 톤 (워커와 동일 풀)
const GALLERY_PHOTOS: string[] = [W1, W2, W4, W5, W6, W7];
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { useLanguageStore } from '../../store/languageStore';
import { RootStackParamList } from '../../types';
import { MOCK_DRIVERS, DRIVER_SERVICE_META } from '../../constants/mockDrivers';
import { getMonthlyAwardBadge } from '../../constants/monthlyAwards';
import { MvpMiniBadge } from '../../components/common/MonthlyAwardCard';

type Props = NativeStackScreenProps<RootStackParamList, 'DriverDetail'>;

export default function DriverDetailScreen({ navigation, route }: Props) {
  const { driverId } = route.params;
  const { lang }     = useLanguageStore();
  const insets       = useSafeAreaInsets();
  const driver       = MOCK_DRIVERS.find(d => d.id === driverId) ?? MOCK_DRIVERS[0];

  const tx = (id: string, ko: string, en: string) =>
    lang === 'ko' ? ko : lang === 'en' ? en : id;

  const handleBook = () => {
    navigation.navigate('Booking', {
      workerId: driver.id,
      workerName: driver.name,
      workerPhoto: driver.photo,
      pricePerHour: driver.pricePerHour,
      serviceType: 'driver',
      driverServices: driver.services,
      drivableTypes: driver.drivableTypes,
    });
  };

  const driverPhoto = typeof driver.photo === 'string' ? { uri: driver.photo } : driver.photo;
  // 드라이버는 아직 커버 사진 편집 화면이 없어서 미설정 — 흰 배경 (카톡 기본 톤)
  const coverPhoto: string | null = null;

  return (
    <View style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* ── Cover (드라이버가 설정한 사진. 없으면 흰 배경) ── */}
        <View style={s.coverWrap}>
          {coverPhoto ? (
            <Image source={{ uri: coverPhoto }} style={s.coverImage} />
          ) : (
            <View style={[s.coverImage, { backgroundColor: Colors.white }]} />
          )}
          <TouchableOpacity style={[s.backBtn, { top: insets.top + 6 }]} onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('CustomerTabs' as never)}>
            <Ionicons name="chevron-back" size={24} color={Colors.dark} />
          </TouchableOpacity>
          <TouchableOpacity style={[s.shareBtn, { top: insets.top + 6 }]}>
            <Ionicons name="share-outline" size={20} color={Colors.dark} />
          </TouchableOpacity>
        </View>

        {/* ── SNS hero ── */}
        <View style={s.heroSns}>
          <View style={s.avatarRing}>
            <Image source={driverPhoto} style={s.avatarBig} />
            {driver.isAvailable && <View style={s.availStatusDot} />}
          </View>

          <View style={s.nameRow}>
            <Text style={s.heroName}>{driver.firstName}</Text>
            {driver.isVerified && (
              <View style={s.verifyBadge}>
                <Ionicons name="checkmark-circle" size={12} color={Colors.white} />
                <Text style={s.verifyText}>{tx('Verified', '인증', 'Verified')}</Text>
              </View>
            )}
            {getMonthlyAwardBadge(driver.id) && <MvpMiniBadge role="driver" />}
          </View>
          <View style={s.heroMetaRow}>
            <Ionicons name="location-outline" size={12} color={Colors.grayLight} />
            <Text style={s.heroMetaText}>{driver.location}</Text>
          </View>
          <View style={s.heroMetaRow}>
            <Ionicons name="trophy-outline" size={12} color={Colors.grayLight} />
            <Text style={s.heroMetaText}>
              {driver.experienceYears}{tx('thn', '년', 'yr')} {tx('pengalaman', '경력', 'exp')} · {driver.licenseClass}
            </Text>
          </View>

          {/* Verification chips */}
          <View style={s.verifyChipRow}>
            <View style={[s.verifyChip, s.verifyChipOn]}>
              <Ionicons name="card-outline" size={12} color={Colors.accent} />
              <Text style={[s.verifyChipText, s.verifyChipTextOn]}>SIM</Text>
            </View>
            <View style={[s.verifyChip, driver.isVerified && s.verifyChipOn]}>
              <Ionicons name="card-outline" size={12} color={driver.isVerified ? Colors.accent : Colors.grayLight} />
              <Text style={[s.verifyChipText, driver.isVerified && s.verifyChipTextOn]}>KTP</Text>
            </View>
            <View style={[s.verifyChip, s.verifyChipOn]}>
              <Ionicons name="finger-print-outline" size={12} color={Colors.accent} />
              <Text style={[s.verifyChipText, s.verifyChipTextOn]}>본인인증</Text>
            </View>
          </View>
        </View>

        {/* Linka 온도 */}
        <View style={s.tempCard}>
          <View style={{ flex: 1 }}>
            <Text style={s.tempLabel}>
              {tx('Suhu Linka', 'Linka 온도', 'Linka Temperature')}
            </Text>
            <Text style={s.tempBigText}>{driver.temperature.toFixed(1)}°C</Text>
            <Text style={s.tempSub}>
              {driver.totalJobs} {tx('pesanan selesai', '완료 건', 'completed')}
            </Text>
          </View>
          <View style={s.thermometerWrap}>
            <View style={s.thermoBg}>
              <View style={[s.thermoFill, {
                height: `${Math.min(driver.temperature, 100)}%`,
                backgroundColor: driver.temperature > 60 ? '#EF4444' : driver.temperature > 40 ? '#F59E0B' : '#60A5FA'
              }]} />
            </View>
            <View style={s.thermoBulb}>
              <Ionicons name="thermometer" size={18} color={Colors.white} />
            </View>
          </View>
        </View>

        {/* Services */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>
            {tx('Layanan yang Disediakan', '제공 서비스', 'Services Offered')}
          </Text>
          <View style={s.serviceGrid}>
            {driver.services.map(svc => {
              const meta = DRIVER_SERVICE_META[svc];
              const label =
                svc === 'designated' ? tx('Sopir Pengganti', '대리운전', 'Designated')
                : svc === 'daily'    ? tx('Sopir Harian', '일일 기사', 'Daily')
                : svc === 'hourly'   ? tx('Sopir Per Jam', '시간제 기사', 'Hourly')
                : svc === 'commute'  ? tx('Sopir Rutin', '출퇴근 기사', 'Commute')
                : svc === 'airport'  ? tx('Antar Bandara', '공항 기사', 'Airport')
                : svc === 'intercity'? tx('Antar Kota', '도시간 이동', 'Intercity')
                : tx('Sopir Acara', '행사 기사', 'Event');
              return (
                <View key={svc} style={[s.serviceCard, { backgroundColor: meta.bg, borderColor: meta.color + '40' }]}>
                  <Ionicons name={meta.icon as any} size={14} color={meta.color} />
                  <Text style={[s.serviceLabel, { color: meta.color }]}>{label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* 운전 능력 */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>
            {tx('Kemampuan Mengemudi', '운전 능력', 'Driving Skills')}
          </Text>

          <View style={s.skillRow}>
            <Text style={s.skillLabel}>{tx('Tipe Kendaraan', '가능 차종', 'Vehicle Types')}</Text>
            <View style={s.skillChips}>
              {driver.drivableTypes.map(t => (
                <View key={t} style={s.skillChip}>
                  <Text style={s.skillChipText}>{t.replace('_', ' ').toUpperCase()}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={s.skillRow}>
            <Text style={s.skillLabel}>{tx('Transmisi', '변속기', 'Transmission')}</Text>
            <View style={s.skillChips}>
              <View style={s.skillChip}>
                <Text style={s.skillChipText}>
                  {driver.transmission === 'auto' ? tx('Matic', '오토', 'Auto')
                    : driver.transmission === 'manual' ? tx('Manual', '수동', 'Manual')
                    : tx('Matic + Manual', '오토 + 수동', 'Both')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Gallery — SNS photos */}
        <View style={s.section}>
          <View style={s.galleryHeader}>
            <Text style={s.sectionTitle}>{tx('Foto', '사진', 'Photos')}</Text>
            <Text style={s.galleryCount}>{GALLERY_PHOTOS.length}</Text>
          </View>
          <View style={s.galleryGrid}>
            {GALLERY_PHOTOS.map((uri, i) => (
              <View key={i} style={s.galleryCell}>
                <Image source={{ uri }} style={s.galleryImage} />
              </View>
            ))}
          </View>
        </View>

        {/* Info */}
        <View style={s.infoBox}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.accent} />
          <Text style={s.infoText}>
            {tx(
              'Semua sopir sudah terverifikasi SIM dan bersih dari pelanggaran lalu lintas.',
              '모든 드라이버는 SIM 인증 완료 및 교통 위반 기록이 없는 분들입니다.',
              'All drivers are SIM-verified with clean traffic records.'
            )}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom booking bar */}
      <View style={[s.bottomBar, { paddingBottom: insets.bottom + 14 }]}>
        <View style={{ flex: 1 }}>
          <Text style={s.priceSub}>{tx('Tarif', '요금', 'Rate')}</Text>
          <Text style={s.priceBig}>Rp {driver.pricePerHour.toLocaleString()}<Text style={s.priceUnit}>/{tx('jam', '시간', 'hr')}</Text></Text>
        </View>
        <TouchableOpacity
          style={[s.bookBtn, !driver.isAvailable && s.bookBtnDisabled]}
          onPress={handleBook}
          disabled={!driver.isAvailable}
          activeOpacity={0.85}
        >
          <Text style={s.bookBtnText}>
            {driver.isAvailable
              ? tx('Pesan Sekarang', '예약하기', 'Book Now')
              : tx('Sedang Sibuk', '운행중', 'Unavailable')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },

  backBtn: {
    position: 'absolute', left: 16, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.sm,
  },
  shareBtn: {
    position: 'absolute', right: 16, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.sm,
  },

  // Cover
  coverWrap:    { width: '100%', height: 180, position: 'relative', backgroundColor: Colors.accentLight },
  coverImage:   { width: '100%', height: '100%' },
  coverOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.18)' },

  // SNS hero
  heroSns: {
    paddingHorizontal: 20, paddingBottom: 18,
    alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  avatarRing: {
    marginTop: -54,
    width: 112, height: 112, borderRadius: 56,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.md,
    position: 'relative',
    marginBottom: 12,
  },
  avatarBig: { width: 104, height: 104, borderRadius: 52 },
  availStatusDot: {
    position: 'absolute', bottom: 6, right: 6,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: Colors.success,
    borderWidth: 3, borderColor: Colors.white,
  },

  verifyChipRow: { flexDirection: 'row', gap: 6, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' },
  verifyChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.section,
  },
  verifyChipOn:      { backgroundColor: Colors.accentLight, borderColor: Colors.accent + '40' },
  verifyChipText:    { fontSize: 11, fontWeight: '600', color: Colors.grayLight },
  verifyChipTextOn:  { color: Colors.accent },

  // legacy
  hero: {
    paddingHorizontal: 20, paddingBottom: 20,
    flexDirection: 'row', gap: 16, alignItems: 'flex-start',
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  heroPhoto: { width: 88, height: 88, borderRadius: 44 },
  nameRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  heroName:  { fontSize: 22, fontWeight: '800', color: Colors.dark },
  verifyBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.accent, borderRadius: 10,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  verifyText: { fontSize: 10, fontWeight: '700', color: Colors.white },
  heroMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
  heroMetaText: { fontSize: 12, color: Colors.gray },

  tempCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginTop: 16,
    backgroundColor: '#FFF7ED', borderRadius: Radius.lg,
    padding: 16, borderWidth: 1, borderColor: '#F59E0B30',
  },
  tempLabel:   { fontSize: 12, fontWeight: '600', color: '#B45309' },
  tempBigText: { fontSize: 32, fontWeight: '800', color: '#F59E0B', lineHeight: 38 },
  tempSub:     { fontSize: 11, color: '#92400E', marginTop: 2 },
  thermometerWrap: { alignItems: 'center', marginLeft: 12 },
  thermoBg: {
    width: 14, height: 70, borderRadius: 7,
    backgroundColor: '#FEF3C7', overflow: 'hidden',
    justifyContent: 'flex-end',
    borderWidth: 1, borderColor: '#F59E0B40',
  },
  thermoFill: { width: '100%' },
  thermoBulb: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#F59E0B',
    alignItems: 'center', justifyContent: 'center',
    marginTop: -6,
  },

  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.dark, marginBottom: 12 },

  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  serviceCard: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: Radius.md, borderWidth: 1,
  },
  serviceEmoji: { fontSize: 14 },
  serviceLabel: { fontSize: 12, fontWeight: '700' },

  // Gallery
  galleryHeader: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 12 },
  galleryCount:  { fontSize: 12, color: Colors.grayLight, fontWeight: '500' },
  galleryGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  galleryCell:   { width: '32%', aspectRatio: 1, borderRadius: 10, overflow: 'hidden', backgroundColor: Colors.section },
  galleryImage:  { width: '100%', height: '100%' },

  skillRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  skillLabel: { fontSize: 12, color: Colors.gray, width: 100 },
  skillChips: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  skillChip:  { backgroundColor: Colors.section, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  skillChipText: { fontSize: 11, fontWeight: '600', color: Colors.dark },

  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    marginHorizontal: 20, marginTop: 24,
    backgroundColor: Colors.accentLight, borderRadius: Radius.md,
    padding: 14,
  },
  infoText: { flex: 1, fontSize: 12, color: Colors.dark, lineHeight: 18 },

  bottomBar: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingTop: 14,
    backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  priceSub:  { fontSize: 11, color: Colors.grayLight },
  priceBig:  { fontSize: 18, fontWeight: '800', color: Colors.dark },
  priceUnit: { fontSize: 12, fontWeight: '500', color: Colors.grayLight },
  bookBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.pill,
    paddingHorizontal: 28, paddingVertical: 14,
  },
  bookBtnDisabled: { backgroundColor: Colors.grayLight },
  bookBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});
```

---

## 심부름 보드

**파일**: `src/screens/errand/ErrandBoardScreen.tsx`

```tsx
/**
 * ErrandBoardScreen — 심부름 목록 (당근알바 스타일)
 *
 * 누구나 볼 수 있고, 누구나 지원 가능 (워커/드라이버 등록 안 해도 됨).
 * 지원 시 1회성 KYC + 이력서 작성 → 즉시 지원 완료.
 */
import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { RootStackParamList, ErrandPost, ErrandCategory } from '../../types';
import { useErrandStore, CATEGORY_META, payLabel } from '../../store/errandStore';
import { useLanguageStore } from '../../store/languageStore';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type CatFilter = ErrandCategory | 'all';

export default function ErrandBoardScreen() {
  const navigation = useNavigation<Nav>();
  const insets     = useSafeAreaInsets();
  const { lang }   = useLanguageStore();
  const tx = (ko: string, en: string, id: string) => lang === 'ko' ? ko : lang === 'en' ? en : id;

  const posts = useErrandStore((s) => s.posts);
  const [cat, setCat]       = useState<CatFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(
    () => posts.filter((p) => cat === 'all' || p.category === cat),
    [posts, cat]
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const FILTERS: { id: CatFilter; label: string }[] = [
    { id: 'all', label: tx('전체', 'All', 'Semua') },
    ...Object.values(CATEGORY_META).map((m) => ({
      id: m.id as CatFilter,
      label: m.label[lang as 'ko' | 'en' | 'id'] ?? m.label.id,
    })),
  ];

  return (
    <View style={s.root}>
      {/* ── Header ── */}
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={s.iconBtn} onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate("CustomerTabs" as never)}>
          <Ionicons name="close" size={26} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{tx('Linka 심부름', 'Linka Errand', 'Linka Jasa')}</Text>
        <TouchableOpacity style={s.iconBtn} onPress={() => navigation.navigate('ErrandCreate')}>
          <Ionicons name="add" size={26} color={Colors.dark} />
        </TouchableOpacity>
      </View>

      {/* ── Filter chips row ── */}
      <View style={s.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
          <TouchableOpacity style={s.refreshChip} activeOpacity={0.7} onPress={onRefresh}>
            <Ionicons name="refresh" size={16} color={Colors.dark} />
          </TouchableOpacity>

          {/* Category chips */}
          {FILTERS.map((f) => (
            <FilterChip
              key={f.id}
              label={f.label}
              active={cat === f.id}
              onPress={() => setCat(f.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* ── List ── */}
      <ScrollView
        contentContainerStyle={s.listWrap}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} />}
      >
        {filtered.map((post) => (
          <ErrandCard
            key={post.id}
            post={post}
            lang={lang}
            onPress={() => navigation.navigate('ErrandDetail', { errandId: post.id })}
          />
        ))}

        {filtered.length === 0 && (
          <View style={s.emptyWrap}>
            <Ionicons name="search-outline" size={32} color={Colors.grayLight} />
            <Text style={s.emptyText}>{tx('해당 카테고리 글이 없어요', 'No posts in this category', 'Belum ada di kategori ini')}</Text>
          </View>
        )}

        {/* "이런 일도 구해요" — 추천 */}
        <View style={s.recoSection}>
          <Text style={s.recoTitle}>✨ {tx('이런 일도 구해요', 'You might also like', 'Mungkin Anda juga suka')}</Text>
          {posts.slice(0, 3).map((post) => (
            <TouchableOpacity
              key={`reco-${post.id}`}
              style={s.recoItem}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('ErrandDetail', { errandId: post.id })}
            >
              <View style={{ flex: 1 }}>
                <Text style={s.recoItemTitle} numberOfLines={1}>{post.title}</Text>
                <Text style={s.recoItemMeta}>
                  {post.createdAt} · {payLabel(post.payType, post.amount, lang as any)}
                </Text>
              </View>
              <View style={[s.recoThumb, { backgroundColor: CATEGORY_META[post.category].bg }]}>
                <Ionicons name={CATEGORY_META[post.category].icon as any} size={20} color={Colors.dark} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── Floating create button ── */}
      <TouchableOpacity
        style={[s.fab, { bottom: insets.bottom + 18 }]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('ErrandCreate')}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

// ── Components ───────────────────────────────────────────────────
function FilterChip({
  label, active, onPress, withCaret, dark,
}: { label: string; active?: boolean; onPress: () => void; withCaret?: boolean; dark?: boolean }) {
  return (
    <TouchableOpacity
      style={[s.chip, dark && s.chipDark, !dark && active && s.chipActive]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {withCaret && (
        <Ionicons name="calendar-outline" size={13} color={dark ? Colors.white : Colors.dark} style={{ marginRight: 4 }} />
      )}
      <Text style={[s.chipText, dark && s.chipTextDark, !dark && active && s.chipTextActive]}>
        {label}
      </Text>
      {withCaret && (
        <Ionicons name="chevron-down" size={13} color={dark ? Colors.white : Colors.gray} style={{ marginLeft: 3 }} />
      )}
    </TouchableOpacity>
  );
}

function ErrandCard({ post, lang, onPress }: { post: ErrandPost; lang: string; onPress: () => void }) {
  const meta  = CATEGORY_META[post.category];
  const tx = (ko: string, en: string, id: string) => lang === 'ko' ? ko : lang === 'en' ? en : id;

  return (
    <TouchableOpacity style={s.card} activeOpacity={0.85} onPress={onPress}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={s.cardTitle} numberOfLines={2}>{post.title}</Text>

        <View style={s.cardRow}>
          <Ionicons name="wallet-outline" size={14} color={Colors.gray} />
          <Text style={s.cardRowText}>{payLabel(post.payType, post.amount, lang as any)}</Text>
        </View>
        <View style={s.cardRow}>
          <Ionicons name="time-outline" size={14} color={Colors.gray} />
          <Text style={s.cardRowText}>{post.scheduledLabel} · {post.timeLabel}</Text>
        </View>

        <View style={s.cardMetaRow}>
          <Text style={s.cardMeta}>Linka Errand</Text>
          <Text style={s.cardMetaDot}>·</Text>
          <Text style={s.cardMeta}>{post.area.name}</Text>
          <Text style={s.cardMetaDot}>·</Text>
          <Text style={s.cardMeta}>{post.createdAt}</Text>
        </View>

        <View style={s.badgeRow}>
          {post.sameDayPayment && (
            <View style={[s.badge, { backgroundColor: Colors.accentLight }]}>
              <Text style={[s.badgeText, { color: Colors.accent }]}>
                {tx('당일지급', 'Same-day pay', 'Bayar hari yang sama')}
              </Text>
            </View>
          )}
          {post.applicantIds.length > 0 && (
            <View style={[s.badge, { backgroundColor: Colors.section }]}>
              <Text style={[s.badgeText, { color: Colors.gray }]}>
                {tx(`지원 ${post.applicantIds.length}`, `${post.applicantIds.length} applied`, `${post.applicantIds.length} pelamar`)}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={[s.cardThumb, { backgroundColor: meta.bg }]}>
        <Ionicons name={meta.icon as any} size={32} color={Colors.dark} />
      </View>
    </TouchableOpacity>
  );
}

// ── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 8, paddingBottom: 10,
    backgroundColor: Colors.white,
  },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.dark },

  filterBar: {
    paddingVertical: 8,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  filterRow: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  refreshChip: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.section,
    alignItems: 'center', justifyContent: 'center',
  },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: Colors.borderMid,
    backgroundColor: Colors.white,
  },
  chipDark:   { backgroundColor: Colors.dark, borderColor: Colors.dark },
  chipActive: { backgroundColor: Colors.dark, borderColor: Colors.dark },
  chipText:       { fontSize: 13, fontWeight: '500', color: Colors.dark },
  chipTextDark:   { color: Colors.white, fontWeight: '600' },
  chipTextActive: { color: Colors.white, fontWeight: '600' },

  listWrap: { paddingHorizontal: 16, paddingTop: 12 },

  card: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  cardTitle:    { fontSize: 16, fontWeight: '700', color: Colors.dark, lineHeight: 22, marginBottom: 8 },
  cardRow:      { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  cardRowText:  { fontSize: 13, color: Colors.dark, fontWeight: '500' },
  cardMetaRow:  { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  cardMeta:     { fontSize: 11, color: Colors.grayLight },
  cardMetaDot:  { fontSize: 11, color: Colors.grayLight },
  badgeRow:     { flexDirection: 'row', gap: 6, marginTop: 8 },
  badge:        { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText:    { fontSize: 11, fontWeight: '600' },

  cardThumb: {
    width: 80, height: 80, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },

  emptyWrap: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyText: { fontSize: 13, color: Colors.grayLight },

  recoSection: { marginTop: 24, paddingTop: 16, borderTopWidth: 8, borderTopColor: Colors.section, marginHorizontal: -16, paddingHorizontal: 16 },
  recoTitle:   { fontSize: 16, fontWeight: '800', color: Colors.dark, marginBottom: 12 },
  recoItem:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  recoItemTitle: { fontSize: 14, fontWeight: '600', color: Colors.dark, marginBottom: 4 },
  recoItemMeta:  { fontSize: 12, color: Colors.grayLight },
  recoThumb:   { width: 50, height: 50, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },

  fab: {
    position: 'absolute', right: 18,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#F97316',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#F97316', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 8,
  },
});
```

---

## 심부름 디테일

**파일**: `src/screens/errand/ErrandDetailScreen.tsx`

```tsx
/**
 * ErrandDetailScreen — 심부름 상세 (당근알바 스타일)
 *
 * 누구나 볼 수 있고, 하단 [지원하기]:
 *  - KYC 미인증 시 → KYCVerify 라우트로 이동 (인증 후 ErrandApply 복귀)
 *  - KYC 인증 완료 시 → ErrandApply로 바로 이동 (이력서 작성/지원)
 */
import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { RootStackParamList } from '../../types';
import { useErrandStore, CATEGORY_META, payLabel } from '../../store/errandStore';
import { useLanguageStore } from '../../store/languageStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ErrandDetail'>;

export default function ErrandDetailScreen({ navigation, route }: Props) {
  const { errandId } = route.params;
  const insets       = useSafeAreaInsets();
  const { lang }     = useLanguageStore();
  const tx = (ko: string, en: string, id: string) => lang === 'ko' ? ko : lang === 'en' ? en : id;

  const post           = useErrandStore((s) => s.posts.find((p) => p.id === errandId));
  const applicantsMap  = useErrandStore((s) => s.applicants);
  const isVerified     = useErrandStore((s) => s.kyc.isVerified);
  const incrementView  = useErrandStore((s) => s.incrementView);

  useEffect(() => {
    if (post) incrementView(errandId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errandId]);

  if (!post) {
    return (
      <View style={s.notFoundWrap}>
        <Text style={{ fontSize: 14, color: Colors.gray }}>
          {tx('요청을 찾을 수 없어요', 'Post not found', 'Postingan tidak ditemukan')}
        </Text>
      </View>
    );
  }

  const meta = CATEGORY_META[post.category];
  const applicants = post.applicantIds.map((id) => applicantsMap[id]).filter(Boolean);

  const handleApply = () => {
    if (isVerified) {
      navigation.navigate('ErrandApply', { errandId });
    } else {
      navigation.navigate('KYCVerify', { onDoneRoute: 'ErrandApply', onDoneParams: { errandId } });
    }
  };

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* ── Hero (placeholder) ── */}
        <View style={[s.hero, { backgroundColor: meta.bg }]}>
          {/* photos 없으면 카테고리 아이콘 큼지막하게 */}
          <Ionicons name={meta.icon as any} size={84} color={Colors.dark} style={{ opacity: 0.55 }} />
          <View style={s.heroPager}>
            <Text style={s.heroPagerText}>1 / {Math.max(1, post.photos.length)}</Text>
          </View>

          {/* Top floating buttons */}
          <View style={[s.heroTop, { top: insets.top + 8 }]}>
            <TouchableOpacity style={s.floatBtn} onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate("CustomerTabs" as never)}>
              <Ionicons name="chevron-back" size={22} color={Colors.dark} />
            </TouchableOpacity>
            <View style={s.heroTopRight}>
              <TouchableOpacity style={s.floatBtn}>
                <Ionicons name="share-outline" size={20} color={Colors.dark} />
              </TouchableOpacity>
              <TouchableOpacity style={s.floatBtn}>
                <Ionicons name="alert-circle-outline" size={20} color={Colors.dark} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Title + time ── */}
        <View style={s.section}>
          <Text style={s.title}>{post.title}</Text>
          <Text style={s.timeAgo}>{post.createdAt}</Text>
        </View>

        <View style={s.divider} />

        {/* ── Key info ── */}
        <View style={s.infoBlock}>
          <View style={s.infoRow}>
            <View style={s.infoIcon}>
              <Ionicons name="wallet" size={18} color={Colors.gray} />
            </View>
            <Text style={s.infoText}>{payLabel(post.payType, post.amount, lang as any)}</Text>
            {post.sameDayPayment && (
              <Text style={s.sameDayBadge}>{tx('당일지급', 'Same-day pay', 'Bayar hari yang sama')}</Text>
            )}
          </View>
          <View style={s.infoRow}>
            <View style={s.infoIcon}><Ionicons name="calendar" size={18} color={Colors.gray} /></View>
            <Text style={s.infoText}>{post.scheduledLabel}</Text>
            <Text style={s.infoSubLink}>{tx('달력보기', 'Calendar', 'Lihat kalender')} ▾</Text>
          </View>
          <View style={s.infoRow}>
            <View style={s.infoIcon}><Ionicons name="time" size={18} color={Colors.gray} /></View>
            <Text style={s.infoText}>{post.timeLabel}</Text>
          </View>
          <View style={s.infoRow}>
            <View style={s.infoIcon}><Ionicons name="information-circle" size={18} color={Colors.gray} /></View>
            <Text style={s.infoText}>{meta.label[lang as 'ko' | 'en' | 'id'] ?? meta.label.id}</Text>
          </View>
        </View>

        {/* ── Description ── */}
        <View style={[s.section, { paddingTop: 12 }]}>
          <Text style={s.descText}>{post.description}</Text>
          <Text style={s.viewsText}>
            {tx('조회', 'Views', 'Dilihat')} {post.views.toLocaleString('id-ID')}
          </Text>
        </View>

        <View style={s.divider} />

        {/* ── Applicants count ── */}
        <View style={s.section}>
          <View style={s.applicantHeader}>
            <Ionicons name="people-outline" size={18} color={Colors.dark} />
            <Text style={s.applicantCount}>
              {tx('지원자', 'Applicants', 'Pelamar')} {post.applicantIds.length}{tx('명', '', '')}
            </Text>
          </View>
        </View>

        {/* ── Map placeholder ── */}
        <View style={s.section}>
          <View style={s.mapBox}>
            <View style={s.mapGrid}>
              {/* 가짜 격자 + 도로 라인 */}
              <View style={[s.mapRoad, { top: '30%' }]} />
              <View style={[s.mapRoad, { top: '60%' }]} />
              <View style={[s.mapRoadV, { left: '40%' }]} />
              <View style={[s.mapRoadV, { left: '75%' }]} />
            </View>
            {/* 반투명 원 — 대략 위치만 */}
            <View style={s.mapCircle} />
          </View>
          <View style={s.mapAddressRow}>
            <Text style={s.mapAddress}>Jakarta Selatan, {post.area.name}</Text>
            <TouchableOpacity style={s.copyBtn}>
              <Ionicons name="copy-outline" size={13} color={Colors.dark} />
              <Text style={s.copyBtnText}>{tx('복사', 'Copy', 'Salin')}</Text>
            </TouchableOpacity>
          </View>
          {/* Nearby placeholders */}
          <View style={{ marginTop: 12, gap: 6 }}>
            <NearbyRow line="Hak-dong" mins={6} />
            <NearbyRow line="Nonhyeon" mins={7} highlight />
            <NearbyRow line="Eonju" mins={10} />
          </View>
        </View>

        {/* ── Notification CTA ── */}
        <View style={[s.section, { paddingTop: 0 }]}>
          <View style={s.notifyCard}>
            <Text style={s.notifyText}>
              {tx(
                `${post.area.name}에서 ${meta.label.ko} 글이 올라오면 바로 알려드릴까요?`,
                `Get notified when new ${meta.label.en} posts come up in ${post.area.name}?`,
                `Mau dapat notifikasi saat ada postingan ${meta.label.id} baru di ${post.area.name}?`
              )}
            </Text>
            <TouchableOpacity style={s.notifyBtn} activeOpacity={0.8}>
              <Ionicons name="notifications-outline" size={14} color={Colors.dark} />
              <Text style={s.notifyBtnText}>{tx('알림 받기', 'Notify me', 'Notifikasi')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={s.divider} />

        {/* ── Co-applicants ── */}
        <View style={s.section}>
          <View style={s.appHeaderRow}>
            <Text style={s.sectionHeading}>{tx('함께 일할 분이에요', 'Co-applicants', 'Pelamar lainnya')}</Text>
            <TouchableOpacity>
              <Text style={s.linkText}>{tx('다른 알바 보기', 'See more', 'Lihat lain')} ›</Text>
            </TouchableOpacity>
          </View>

          {applicants.length === 0 ? (
            <Text style={s.emptyApplicants}>
              {tx('아직 지원자가 없어요. 가장 먼저 지원해보세요!', 'No applicants yet. Be the first!', 'Belum ada pelamar. Jadilah yang pertama!')}
            </Text>
          ) : (
            applicants.map((ap) => (
              <View key={ap.id} style={s.applicantCard}>
                <View style={s.applicantAvatar}>
                  <Ionicons name="person" size={28} color={Colors.grayLight} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={s.applicantNameRow}>
                    <Text style={s.applicantName}>{ap.name}</Text>
                    <View style={s.tempBadge}>
                      <Text style={s.tempBadgeText}>{ap.temperature.toFixed(1)}°C</Text>
                    </View>
                  </View>
                  <Text style={s.applicantSub}>{ap.appliedAt}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── Sticky bottom bar ── */}
      <View style={[s.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity style={s.heartBtn}>
          <Ionicons name="heart-outline" size={26} color={Colors.gray} />
        </TouchableOpacity>
        <TouchableOpacity style={s.applyBtn} activeOpacity={0.88} onPress={handleApply}>
          <Text style={s.applyBtnText}>{tx('지원하기', 'Apply', 'Lamar Sekarang')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Sub-components ───────────────────────────────────────────────
function NearbyRow({ line, mins, highlight }: { line: string; mins: number; highlight?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View style={[s.lineBadge, { backgroundColor: highlight ? '#EF4444' : '#7B8A3D' }]}>
        <Text style={s.lineBadgeText}>{highlight ? '신분당' : '7'}</Text>
      </View>
      <Text style={s.stationName}>{line}</Text>
      <Text style={s.stationDot}>·</Text>
      <Text style={s.stationMins}>걸어서 {mins}분</Text>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },
  notFoundWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white },

  hero: { width: '100%', aspectRatio: 1.05, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  heroPager: { position: 'absolute', right: 14, bottom: 14, backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  heroPagerText: { color: Colors.white, fontSize: 11, fontWeight: '600' },
  heroTop: { position: 'absolute', left: 0, right: 0, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between' },
  heroTopRight: { flexDirection: 'row', gap: 8 },
  floatBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.85)', alignItems: 'center', justifyContent: 'center' },

  section: { paddingHorizontal: 20, paddingVertical: 16 },
  divider: { height: 1, backgroundColor: Colors.border },

  title:   { fontSize: 22, fontWeight: '800', color: Colors.dark, lineHeight: 28, marginBottom: 6 },
  timeAgo: { fontSize: 12, color: Colors.grayLight },

  infoBlock: { paddingHorizontal: 20, paddingTop: 16, gap: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoIcon: { width: 22, alignItems: 'center' },
  infoText:    { fontSize: 14, fontWeight: '500', color: Colors.dark },
  infoSubLink: { fontSize: 12, color: Colors.gray, marginLeft: 4 },
  sameDayBadge: { fontSize: 12, color: Colors.accent, fontWeight: '700', marginLeft: 6 },

  descText:  { fontSize: 15, color: Colors.dark, lineHeight: 23, marginBottom: 14 },
  viewsText: { fontSize: 12, color: Colors.grayLight },

  applicantHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  applicantCount: { fontSize: 14, fontWeight: '700', color: Colors.dark },

  mapBox: { width: '100%', aspectRatio: 1.9, backgroundColor: '#F1F4EE', borderRadius: 14, overflow: 'hidden', position: 'relative' },
  mapGrid: { position: 'absolute', inset: 0 },
  mapRoad:  { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: '#E1E6D4' },
  mapRoadV: { position: 'absolute', top: 0, bottom: 0, width: 2, backgroundColor: '#E1E6D4' },
  mapCircle: {
    position: 'absolute', top: '30%', left: '35%', width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(249, 115, 22, 0.25)',
  },
  mapAddressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  mapAddress:    { flex: 1, fontSize: 15, fontWeight: '700', color: Colors.dark },
  copyBtn:       { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: Colors.section, borderRadius: 6 },
  copyBtnText:   { fontSize: 11, color: Colors.dark, fontWeight: '600' },

  lineBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, minWidth: 22, alignItems: 'center' },
  lineBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.white },
  stationName: { fontSize: 13, fontWeight: '700', color: Colors.dark },
  stationDot:  { fontSize: 13, color: Colors.grayLight },
  stationMins: { fontSize: 12, color: Colors.gray },

  notifyCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: Colors.section, borderRadius: 12, marginTop: 16 },
  notifyText: { flex: 1, fontSize: 12, color: Colors.dark, lineHeight: 17 },
  notifyBtn:  { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: Colors.white, borderRadius: 16, borderWidth: 1, borderColor: Colors.border },
  notifyBtnText: { fontSize: 12, fontWeight: '600', color: Colors.dark },

  appHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionHeading: { fontSize: 16, fontWeight: '800', color: Colors.dark },
  linkText:    { fontSize: 12, color: Colors.gray },
  emptyApplicants: { fontSize: 13, color: Colors.grayLight, paddingVertical: 8 },

  applicantCard: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  applicantAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.section, alignItems: 'center', justifyContent: 'center' },
  applicantNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  applicantName:    { fontSize: 14, fontWeight: '700', color: Colors.dark },
  applicantSub:     { fontSize: 11, color: Colors.grayLight, marginTop: 2 },
  tempBadge:        { backgroundColor: '#FFF3E0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tempBadgeText:    { fontSize: 10, fontWeight: '700', color: '#F97316' },

  bottomBar: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingTop: 10,
    backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  heartBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  applyBtn: {
    flex: 1, height: 50, borderRadius: 12, backgroundColor: '#F97316',
    alignItems: 'center', justifyContent: 'center',
  },
  applyBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
```

---

## 심부름 지원 (이력서)

**파일**: `src/screens/errand/ErrandApplyScreen.tsx`

```tsx
/**
 * ErrandApplyScreen — 이력서 작성 + 지원 완료
 *
 * KYC 통과 후 진입.
 * - 이미 저장된 이력서가 있으면 미리 채워두고 "지원하기" 즉시 가능
 * - 처음이면 폼 작성 필수 (자기소개 15자 이상)
 *
 * 제출 → errandStore.applyToErrand → 성공 모달 → 상세로 복귀
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  Modal, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius } from '../../constants/colors';
import { RootStackParamList } from '../../types';
import { useErrandStore } from '../../store/errandStore';
import { useLanguageStore } from '../../store/languageStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ErrandApply'>;

// 인도네시아 맥락에 맞춘 옵션
const STRENGTH_OPTIONS = [
  { id: 'tepat-waktu', ko: '시간 약속을 지켜요', en: 'On time',       id_l: 'Tepat waktu'         },
  { id: 'ramah',       ko: '친절해요',          en: 'Friendly',      id_l: 'Ramah'               },
  { id: 'teliti',      ko: '일처리가 꼼꼼해요',   en: 'Thorough',      id_l: 'Teliti'              },
  { id: 'aktif',       ko: '적극적이에요',       en: 'Proactive',     id_l: 'Aktif'               },
  { id: 'rapi',        ko: '깔끔해요',          en: 'Neat',          id_l: 'Rapi'                },
];

const EXTRA_OPTIONS = [
  { id: 'non-smoker',   ko: '비흡연',          en: 'Non-smoker',     id_l: 'Tidak merokok'       },
  { id: 'long-term',    ko: '장기근무 가능',    en: 'Long-term OK',   id_l: 'Bisa jangka panjang' },
  { id: 'has-vehicle',  ko: '차량 보유',        en: 'Has vehicle',    id_l: 'Punya kendaraan'     },
  { id: 'has-ktp',      ko: 'KTP 소지',         en: 'KTP holder',     id_l: 'Punya KTP'           },
  { id: 'childcare',    ko: '육아 경험',         en: 'Childcare exp.', id_l: 'Pengalaman anak'     },
  { id: 'english',      ko: '영어 가능',         en: 'English OK',     id_l: 'Bisa Bahasa Inggris' },
  { id: 'pet-exp',      ko: '반려동물 경험',     en: 'Pet experience', id_l: 'Pengalaman hewan'    },
  { id: 'cooking',      ko: '요리 능숙',         en: 'Cooking skill',  id_l: 'Ahli memasak'        },
];

export default function ErrandApplyScreen({ navigation, route }: Props) {
  const { errandId } = route.params;
  const insets = useSafeAreaInsets();
  const { lang } = useLanguageStore();
  const tx = (ko: string, en: string, id: string) => lang === 'ko' ? ko : lang === 'en' ? en : id;
  const lopt = (o: { ko: string; en: string; id_l: string }) =>
    lang === 'ko' ? o.ko : lang === 'en' ? o.en : o.id_l;

  const post     = useErrandStore((s) => s.posts.find((p) => p.id === errandId));
  const resume   = useErrandStore((s) => s.resume);
  const setResume = useErrandStore((s) => s.setResume);
  const applyToErrand = useErrandStore((s) => s.applyToErrand);
  const kyc      = useErrandStore((s) => s.kyc);

  const [intro, setIntro]         = useState(resume?.intro ?? '');
  const [strengths, setStrengths] = useState<string[]>(resume?.strengths ?? []);
  const [extras, setExtras]       = useState<string[]>(resume?.extras ?? []);
  const [showDone, setShowDone]   = useState(false);

  const introOk = intro.trim().length >= 15;
  const canSubmit = introOk;

  const toggle = (arr: string[], val: string, max?: number): string[] => {
    if (arr.includes(val)) return arr.filter((v) => v !== val);
    if (max != null && arr.length >= max) return arr;
    return [...arr, val];
  };

  const submit = () => {
    if (!canSubmit) {
      Alert.alert(tx('확인', 'Wait', 'Tunggu'), tx('자기소개는 15자 이상 적어주세요.', 'Intro must be 15+ characters.', 'Perkenalan minimal 15 karakter.'));
      return;
    }
    setResume({ photoUri: undefined, experiences: [], intro, strengths, extras });
    // 본인 지원자 id 가공 — name 기반 (실제 user id 없어서 mock)
    const myApplicantId = `me-${kyc.fullName ?? 'user'}`;
    // 시드 applicants에 없으면 직접 추가는 store에 함수 없음 — applicants는 readonly 시드 + push 안 함, OK.
    applyToErrand(errandId, myApplicantId);
    setShowDone(true);
  };

  if (!post) return null;

  return (
    <View style={[s.root, { paddingTop: insets.top + 4 }]}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate("CustomerTabs" as never)} style={s.closeBtn}>
          <Ionicons name="close" size={26} color={Colors.dark} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={s.bigTitle}>
          {tx('이어서, 알바 이력서를\n작성해 주세요', 'Now, fill out\nyour applicant profile', 'Lanjutkan dengan\nprofil pelamar')}
        </Text>

        {/* Photo (placeholder) */}
        <View style={s.fieldBlock}>
          <Text style={s.fieldTitle}>{tx('사진', 'Photo', 'Foto')} <Text style={s.optional}>({tx('선택', 'optional', 'opsional')})</Text></Text>
          <Text style={s.fieldHelp}>{tx('사진을 등록하면 채용 확률이 6% 상승해요.', 'Adding a photo boosts your chance by 6%.', 'Tambahkan foto: peluang +6%.')}</Text>
          <TouchableOpacity style={s.photoCircle} activeOpacity={0.85}>
            <Ionicons name="person" size={48} color={Colors.grayLight} />
            <View style={s.cameraBadge}>
              <Ionicons name="camera" size={16} color={Colors.white} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Intro */}
        <View style={s.fieldBlock}>
          <Text style={s.fieldTitle}>{tx('자기소개', 'Intro', 'Perkenalan')} <Text style={s.req}>*</Text></Text>
          <Text style={s.fieldHelp}>
            {tx('50자 이상 작성하면 채용 확률이 18% 상승해요.', '50+ chars boosts your chance by 18%.', '50+ karakter: peluang +18%.')}
          </Text>
          <TextInput
            style={s.textarea}
            placeholder={tx('최소 15자 이상 입력해주세요', 'At least 15 characters', 'Minimal 15 karakter')}
            placeholderTextColor={Colors.grayLight}
            multiline
            value={intro}
            onChangeText={setIntro}
          />
          <Text style={s.charCount}>{intro.length}</Text>
        </View>

        {/* Strengths */}
        <View style={s.fieldBlock}>
          <Text style={s.fieldTitle}>{tx('나의 장점', 'My Strengths', 'Kelebihan Saya')}</Text>
          <Text style={s.fieldHelp}>{tx('최대 2개까지 선택할 수 있어요.', 'Up to 2.', 'Pilih maksimal 2.')}</Text>
          <View style={s.chipWrap}>
            {STRENGTH_OPTIONS.map((o) => {
              const active = strengths.includes(o.id);
              return (
                <TouchableOpacity
                  key={o.id}
                  style={[s.tagChip, active && s.tagChipActive]}
                  activeOpacity={0.8}
                  onPress={() => setStrengths(toggle(strengths, o.id, 2))}
                >
                  <Text style={[s.tagChipText, active && s.tagChipTextActive]}>{lopt(o)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Extras */}
        <View style={s.fieldBlock}>
          <Text style={s.fieldTitle}>{tx('추가 정보', 'Extras', 'Info Tambahan')} <Text style={s.optional}>({tx('선택', 'optional', 'opsional')})</Text></Text>
          <View style={s.chipWrap}>
            {EXTRA_OPTIONS.map((o) => {
              const active = extras.includes(o.id);
              return (
                <TouchableOpacity
                  key={o.id}
                  style={[s.tagChip, active && s.tagChipActive]}
                  activeOpacity={0.8}
                  onPress={() => setExtras(toggle(extras, o.id))}
                >
                  <Text style={[s.tagChipText, active && s.tagChipTextActive]}>{lopt(o)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Consent */}
        <View style={s.consentRow}>
          <Ionicons name="checkmark" size={16} color={Colors.gray} />
          <Text style={s.consentText}>
            {tx('(필수) 개인정보 제3자 제공 동의', '(Required) Personal data sharing consent', '(Wajib) Persetujuan pembagian data')}
          </Text>
        </View>
        <Text style={[s.consentLink]}>
          {tx('개인정보처리 관련 고지사항', 'Privacy notice', 'Pemberitahuan privasi')}
        </Text>
      </ScrollView>

      <View style={[s.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[s.primaryBtn, !canSubmit && s.primaryBtnDisabled]}
          disabled={!canSubmit}
          activeOpacity={0.88}
          onPress={submit}
        >
          <Text style={s.primaryBtnText}>{tx('지원하기', 'Apply', 'Lamar Sekarang')}</Text>
        </TouchableOpacity>
      </View>

      {/* 지원 완료 모달 */}
      <Modal visible={showDone} transparent animationType="fade" onRequestClose={() => setShowDone(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <View style={s.successCircle}>
              <Ionicons name="checkmark" size={48} color={Colors.accent} />
            </View>
            <Text style={s.modalTitle}>
              {tx('지원이 완료되었어요!', 'Application submitted!', 'Lamaran terkirim!')}
            </Text>
            <Text style={s.modalSub}>
              {tx(
                '요청자가 확인하면 채팅으로 알려드릴게요.',
                "We'll notify you in chat when the poster reviews.",
                'Kami akan beri tahu lewat chat saat dilihat.'
              )}
            </Text>
            <TouchableOpacity
              style={s.primaryBtn}
              activeOpacity={0.85}
              onPress={() => {
                setShowDone(false);
                if (navigation.canGoBack()) navigation.goBack();
                else navigation.navigate('CustomerTabs' as never);
              }}
            >
              <Text style={s.primaryBtnText}>{tx('확인', 'OK', 'OK')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginLeft: -8 },

  bigTitle: { fontSize: 22, fontWeight: '800', color: Colors.dark, lineHeight: 30, marginBottom: 28 },

  fieldBlock: { marginBottom: 28 },
  fieldTitle: { fontSize: 15, fontWeight: '700', color: Colors.dark, marginBottom: 6 },
  fieldHelp:  { fontSize: 12, color: Colors.gray, lineHeight: 17, marginBottom: 12 },
  optional:   { fontSize: 12, color: Colors.gray, fontWeight: '400' },
  req:        { color: '#EF4444' },

  photoCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.section,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
    position: 'relative',
  },
  cameraBadge: {
    position: 'absolute', bottom: 0, right: -2,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.dark, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.white,
  },

  textarea: {
    minHeight: 110, padding: 14,
    borderWidth: 1.5, borderColor: Colors.borderMid, borderRadius: 12,
    fontSize: 14, color: Colors.dark, textAlignVertical: 'top',
  },
  charCount: { fontSize: 11, color: Colors.grayLight, alignSelf: 'flex-end', marginTop: 4 },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.2, borderColor: Colors.borderMid,
    backgroundColor: Colors.white,
  },
  tagChipActive: { backgroundColor: Colors.dark, borderColor: Colors.dark },
  tagChipText:       { fontSize: 13, color: Colors.dark },
  tagChipTextActive: { color: Colors.white, fontWeight: '600' },

  consentRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  consentText: { fontSize: 13, color: Colors.dark, fontWeight: '500' },
  consentLink: { fontSize: 12, color: Colors.gray, marginTop: 4, marginLeft: 24, textDecorationLine: 'underline' },

  bottomBar: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    paddingHorizontal: 20, paddingTop: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  primaryBtn: {
    height: 54, borderRadius: 14, backgroundColor: Colors.dark,
    alignItems: 'center', justifyContent: 'center',
  },
  primaryBtnDisabled: { backgroundColor: Colors.borderMid },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  modalCard: {
    width: '100%', backgroundColor: Colors.white, borderRadius: 20,
    paddingHorizontal: 24, paddingVertical: 28, alignItems: 'center', gap: 14,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: Colors.dark, textAlign: 'center' },
  modalSub:   { fontSize: 13, color: Colors.gray, textAlign: 'center', lineHeight: 19, marginBottom: 10 },
  successCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.accentLight, alignItems: 'center', justifyContent: 'center',
  },
});
```

---

## KYC 본인인증 (인도네시아 NIK)

**파일**: `src/screens/errand/KYCVerifyScreen.tsx`

```tsx
/**
 * KYCVerifyScreen — 인도네시아식 본인인증 (1회성)
 *
 * 시뮬레이션:
 *  1. Intro      — "1회 인증 필요" 설명
 *  2. NIK + Name — 16자리 NIK + KTP 이름
 *  3. DOB + 성별/출생지
 *  4. KTP photo  — 카메라 placeholder ("Tap to capture")
 *  5. Selfie     — "셀카 + KTP" 라이브니스 placeholder
 *  6. Verifying  — 로딩
 *  7. Success    — 완료
 *
 * onDoneRoute / onDoneParams 가 들어오면 그쪽으로 reset.
 */
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,
  ActivityIndicator, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius } from '../../constants/colors';
import { RootStackParamList } from '../../types';
import { useErrandStore } from '../../store/errandStore';
import { useLanguageStore } from '../../store/languageStore';

type Props = NativeStackScreenProps<RootStackParamList, 'KYCVerify'>;

type Step = 'intro' | 'identity' | 'dob' | 'ktp' | 'selfie' | 'verifying' | 'success';

export default function KYCVerifyScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { lang } = useLanguageStore();
  const tx = (ko: string, en: string, id: string) => lang === 'ko' ? ko : lang === 'en' ? en : id;

  const setKYC      = useErrandStore((s) => s.setKYC);
  const completeKYC = useErrandStore((s) => s.completeKYC);

  const [step, setStep]     = useState<Step>('intro');
  const [nik, setNik]       = useState('');
  const [name, setName]     = useState('');
  const [dob, setDob]       = useState('');           // DD/MM/YYYY
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [birthplace, setBirthplace] = useState('');
  const [ktpCaptured, setKtpCaptured]       = useState(false);
  const [selfieCaptured, setSelfieCaptured] = useState(false);

  // verifying → success 자동 전환
  useEffect(() => {
    if (step === 'verifying') {
      const t = setTimeout(() => setStep('success'), 1800);
      return () => clearTimeout(t);
    }
  }, [step]);

  const finish = () => {
    completeKYC();
    setKYC({
      nik, fullName: name, dob, gender: gender || undefined, birthplace,
      ktpPhotoUri: ktpCaptured ? 'mock://ktp' : undefined,
      selfieUri: selfieCaptured ? 'mock://selfie' : undefined,
    });
    if (route.params?.onDoneRoute) {
      // 인증 후 원래 가려던 화면으로 reset (인증 화면이 history에 남지 않도록)
      navigation.reset({
        index: 1,
        routes: [
          { name: 'ErrandBoard' },
          { name: route.params.onDoneRoute as any, params: route.params.onDoneParams },
        ],
      });
    } else {
      if (navigation.canGoBack()) navigation.goBack();
      else navigation.navigate('CustomerTabs' as never);
    }
  };

  return (
    <View style={[s.root, { paddingTop: insets.top + 4 }]}>
      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate("CustomerTabs" as never)} style={s.closeBtn}>
          <Ionicons name="close" size={26} color={Colors.dark} />
        </TouchableOpacity>
      </View>

      {step === 'intro'     && <IntroStep   onNext={() => setStep('identity')} tx={tx} />}
      {step === 'identity'  && <IdentityStep nik={nik} name={name} setNik={setNik} setName={setName} onNext={() => setStep('dob')} tx={tx} />}
      {step === 'dob'       && <DobStep    dob={dob} setDob={setDob} gender={gender} setGender={setGender} birthplace={birthplace} setBirthplace={setBirthplace} onNext={() => setStep('ktp')} tx={tx} />}
      {step === 'ktp'       && <KtpStep    captured={ktpCaptured} onCapture={() => setKtpCaptured(true)} onNext={() => setStep('selfie')} tx={tx} />}
      {step === 'selfie'    && <SelfieStep captured={selfieCaptured} onCapture={() => setSelfieCaptured(true)} onNext={() => setStep('verifying')} tx={tx} />}
      {step === 'verifying' && <VerifyingStep tx={tx} />}
      {step === 'success'   && <SuccessStep onConfirm={finish} tx={tx} />}
    </View>
  );
}

// ── Step components ────────────────────────────────────────────────
type T = (ko: string, en: string, id: string) => string;

function IntroStep({ onNext, tx }: { onNext: () => void; tx: T }) {
  return (
    <View style={s.body}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <View style={s.faceCircle}>
          <Ionicons name="person" size={64} color="#D7B98B" />
          <View style={s.shieldBadge}>
            <Ionicons name="shield-checkmark" size={18} color={Colors.white} />
          </View>
        </View>
        <Text style={s.bigTitle}>
          {tx('Linka 심부름이 처음이라면\n본인인증 1회가 필요해요', "First time? You'll need to verify\nyour identity once.", 'Pertama kali pakai?\nVerifikasi identitas dulu (1x saja)')}
        </Text>
        <Text style={s.bigSub}>
          {tx(
            '인증은 신뢰할 수 있는 지원자임을 보여주는 첫 번째 약속이에요.',
            'Verification shows the poster you can be trusted.',
            'Verifikasi menunjukkan bahwa Anda pelamar yang bisa dipercaya.'
          )}
        </Text>
      </View>
      <TouchableOpacity style={s.primaryBtn} activeOpacity={0.85} onPress={onNext}>
        <Text style={s.primaryBtnText}>
          {tx('30초 만에 인증하기', 'Verify in 30 seconds', 'Verifikasi dalam 30 detik')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function IdentityStep({ nik, name, setNik, setName, onNext, tx }: {
  nik: string; name: string; setNik: (v: string) => void; setName: (v: string) => void; onNext: () => void; tx: T;
}) {
  const valid = nik.length === 16 && name.trim().length >= 2;
  return (
    <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
      <Text style={s.stepTitle}>
        {tx('NIK과 이름을 입력해 주세요', 'Enter your NIK and name', 'Masukkan NIK dan nama Anda')}
      </Text>
      <Text style={s.stepHelp}>
        {tx('KTP에 표시된 그대로 입력해주세요.', 'Type exactly as shown on your KTP.', 'Masukkan persis seperti di KTP.')}
      </Text>

      <Text style={s.label}>NIK <Text style={s.req}>*</Text></Text>
      <TextInput
        style={s.input}
        placeholder="16 digit"
        placeholderTextColor={Colors.grayLight}
        keyboardType="number-pad"
        maxLength={16}
        value={nik}
        onChangeText={setNik}
      />
      <Text style={s.hint}>{nik.length} / 16</Text>

      <Text style={[s.label, { marginTop: 18 }]}>{tx('이름 (KTP 기준)', 'Full Name (as on KTP)', 'Nama Lengkap (sesuai KTP)')}</Text>
      <TextInput
        style={s.input}
        placeholder={tx('홍길동', 'Budi Santoso', 'Budi Santoso')}
        placeholderTextColor={Colors.grayLight}
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={s.helpLink}><Text style={s.helpLinkText}>{tx('인증에 어려움이 있나요?', 'Need help?', 'Butuh bantuan verifikasi?')}</Text></TouchableOpacity>

      <View style={{ flex: 1, minHeight: 60 }} />

      <TouchableOpacity
        style={[s.primaryBtn, !valid && s.primaryBtnDisabled]}
        activeOpacity={0.85}
        disabled={!valid}
        onPress={onNext}
      >
        <Text style={s.primaryBtnText}>{tx('다음', 'Next', 'Lanjut')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function DobStep({ dob, setDob, gender, setGender, birthplace, setBirthplace, onNext, tx }: {
  dob: string; setDob: (v: string) => void;
  gender: 'male' | 'female' | ''; setGender: (g: 'male' | 'female') => void;
  birthplace: string; setBirthplace: (v: string) => void;
  onNext: () => void; tx: T;
}) {
  const valid = dob.length >= 8 && !!gender && birthplace.trim().length >= 2;
  return (
    <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
      <Text style={s.stepTitle}>
        {tx('생년월일·성별을 입력해 주세요', 'Date of birth & gender', 'Tanggal lahir & jenis kelamin')}
      </Text>

      <Text style={s.label}>{tx('생년월일', 'Date of Birth', 'Tanggal Lahir')}</Text>
      <TextInput
        style={s.input}
        placeholder="DD/MM/YYYY"
        placeholderTextColor={Colors.grayLight}
        keyboardType="number-pad"
        value={dob}
        onChangeText={(t) => {
          const digits = t.replace(/\D/g, '').slice(0, 8);
          let out = digits;
          if (digits.length > 4) out = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
          else if (digits.length > 2) out = `${digits.slice(0, 2)}/${digits.slice(2)}`;
          setDob(out);
        }}
        maxLength={10}
      />

      <Text style={[s.label, { marginTop: 18 }]}>{tx('성별', 'Gender', 'Jenis Kelamin')}</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {[
          { id: 'male',   label: tx('남성', 'Male',   'Pria')   },
          { id: 'female', label: tx('여성', 'Female', 'Wanita') },
        ].map((g) => (
          <TouchableOpacity
            key={g.id}
            style={[s.genderBtn, gender === g.id && s.genderBtnActive]}
            onPress={() => setGender(g.id as 'male' | 'female')}
            activeOpacity={0.8}
          >
            <Text style={[s.genderBtnText, gender === g.id && s.genderBtnTextActive]}>{g.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[s.label, { marginTop: 18 }]}>{tx('출생지', 'Birthplace', 'Tempat Lahir')}</Text>
      <TextInput
        style={s.input}
        placeholder="Jakarta"
        placeholderTextColor={Colors.grayLight}
        value={birthplace}
        onChangeText={setBirthplace}
      />

      <View style={{ flex: 1, minHeight: 40 }} />
      <TouchableOpacity
        style={[s.primaryBtn, !valid && s.primaryBtnDisabled]}
        disabled={!valid}
        activeOpacity={0.85}
        onPress={onNext}
      >
        <Text style={s.primaryBtnText}>{tx('다음', 'Next', 'Lanjut')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function KtpStep({ captured, onCapture, onNext, tx }: {
  captured: boolean; onCapture: () => void; onNext: () => void; tx: T;
}) {
  return (
    <View style={s.body}>
      <Text style={s.stepTitle}>{tx('KTP 사진을 찍어주세요', 'Take a photo of your KTP', 'Foto KTP Anda')}</Text>
      <Text style={s.stepHelp}>
        {tx('카드 전체가 프레임 안에 들어가게 찍어주세요.', 'Make sure the entire card fits in the frame.', 'Pastikan seluruh kartu masuk dalam frame.')}
      </Text>

      <View style={s.captureWrap}>
        {/* placeholder KTP card frame */}
        <View style={[s.ktpFrame, captured && s.ktpFrameDone]}>
          {captured ? (
            <>
              <Ionicons name="checkmark-circle" size={48} color={Colors.accent} />
              <Text style={s.captureDoneText}>{tx('KTP 캡처 완료', 'KTP captured', 'Foto KTP berhasil')}</Text>
            </>
          ) : (
            <>
              <Ionicons name="card-outline" size={42} color={Colors.grayLight} />
              <Text style={s.captureHint}>{tx('탭하여 촬영', 'Tap to capture', 'Ketuk untuk foto')}</Text>
            </>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[s.secondaryBtn, captured && { display: 'none' }]}
        activeOpacity={0.85}
        onPress={onCapture}
      >
        <Ionicons name="camera-outline" size={18} color={Colors.dark} />
        <Text style={s.secondaryBtnText}>{tx('촬영하기', 'Take photo', 'Ambil Foto')}</Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }} />

      <TouchableOpacity
        style={[s.primaryBtn, !captured && s.primaryBtnDisabled]}
        disabled={!captured}
        activeOpacity={0.85}
        onPress={onNext}
      >
        <Text style={s.primaryBtnText}>{tx('다음', 'Next', 'Lanjut')}</Text>
      </TouchableOpacity>
    </View>
  );
}

function SelfieStep({ captured, onCapture, onNext, tx }: {
  captured: boolean; onCapture: () => void; onNext: () => void; tx: T;
}) {
  return (
    <View style={s.body}>
      <Text style={s.stepTitle}>{tx('KTP를 들고 셀카를 찍어주세요', 'Selfie holding your KTP', 'Selfie sambil pegang KTP')}</Text>
      <Text style={s.stepHelp}>
        {tx('얼굴과 KTP가 함께 보여야 해요.', 'Both your face and KTP must be visible.', 'Wajah dan KTP harus terlihat bersamaan.')}
      </Text>

      <View style={s.captureWrap}>
        <View style={[s.selfieFrame, captured && s.ktpFrameDone]}>
          {captured ? (
            <>
              <Ionicons name="checkmark-circle" size={48} color={Colors.accent} />
              <Text style={s.captureDoneText}>{tx('셀카 캡처 완료', 'Selfie captured', 'Selfie berhasil')}</Text>
            </>
          ) : (
            <>
              <Ionicons name="happy-outline" size={42} color={Colors.grayLight} />
              <Text style={s.captureHint}>{tx('탭하여 촬영', 'Tap to capture', 'Ketuk untuk foto')}</Text>
            </>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[s.secondaryBtn, captured && { display: 'none' }]}
        activeOpacity={0.85}
        onPress={onCapture}
      >
        <Ionicons name="camera-reverse-outline" size={18} color={Colors.dark} />
        <Text style={s.secondaryBtnText}>{tx('촬영하기', 'Take selfie', 'Ambil Selfie')}</Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }} />

      <TouchableOpacity
        style={[s.primaryBtn, !captured && s.primaryBtnDisabled]}
        disabled={!captured}
        activeOpacity={0.85}
        onPress={onNext}
      >
        <Text style={s.primaryBtnText}>{tx('인증 요청', 'Submit', 'Kirim')}</Text>
      </TouchableOpacity>
    </View>
  );
}

function VerifyingStep({ tx }: { tx: T }) {
  return (
    <View style={[s.body, { alignItems: 'center', justifyContent: 'center' }]}>
      <ActivityIndicator size="large" color={Colors.accent} />
      <Text style={[s.stepTitle, { marginTop: 24, textAlign: 'center' }]}>
        {tx('인증 중이에요...', 'Verifying...', 'Memverifikasi...')}
      </Text>
      <Text style={[s.stepHelp, { textAlign: 'center' }]}>
        {tx('잠시만 기다려 주세요.', 'Please wait a moment.', 'Mohon tunggu sebentar.')}
      </Text>
    </View>
  );
}

function SuccessStep({ onConfirm, tx }: { onConfirm: () => void; tx: T }) {
  return (
    <View style={s.body}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <View style={s.successCircle}>
          <Ionicons name="checkmark" size={56} color={Colors.accent} />
        </View>
        <Text style={[s.bigTitle, { textAlign: 'center' }]}>
          {tx('본인인증이 완료되었어요', 'Verification complete', 'Verifikasi selesai')}
        </Text>
      </View>
      <TouchableOpacity style={s.primaryBtn} activeOpacity={0.85} onPress={onConfirm}>
        <Text style={s.primaryBtnText}>{tx('확인', 'Confirm', 'OK')}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginLeft: -8 },

  body: { flexGrow: 1, paddingTop: 12, paddingBottom: 20 },

  bigTitle: { fontSize: 22, fontWeight: '800', color: Colors.dark, lineHeight: 30, textAlign: 'center' },
  bigSub:   { fontSize: 14, color: Colors.gray, textAlign: 'center', lineHeight: 21 },

  stepTitle: { fontSize: 22, fontWeight: '800', color: Colors.dark, marginBottom: 8, lineHeight: 30 },
  stepHelp:  { fontSize: 13, color: Colors.gray, marginBottom: 28, lineHeight: 19 },

  label: { fontSize: 13, fontWeight: '600', color: Colors.dark, marginBottom: 8 },
  req:   { color: '#EF4444' },
  input: {
    borderWidth: 1.5, borderColor: Colors.borderMid, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: Colors.dark,
  },
  hint:  { fontSize: 11, color: Colors.grayLight, marginTop: 4, alignSelf: 'flex-end' },

  helpLink: { alignSelf: 'center', marginTop: 24 },
  helpLinkText: { fontSize: 13, color: Colors.gray, textDecorationLine: 'underline' },

  genderBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    borderWidth: 1.5, borderColor: Colors.borderMid, alignItems: 'center',
  },
  genderBtnActive: { backgroundColor: Colors.dark, borderColor: Colors.dark },
  genderBtnText: { fontSize: 14, fontWeight: '600', color: Colors.dark },
  genderBtnTextActive: { color: Colors.white },

  faceCircle: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: '#F4D6B3', alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  shieldBadge: {
    position: 'absolute', bottom: 8, right: 12,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: Colors.white,
  },

  captureWrap: { alignItems: 'center', justifyContent: 'center', marginVertical: 24 },
  ktpFrame: {
    width: '100%', aspectRatio: 1.6, borderRadius: 14,
    borderWidth: 2, borderColor: Colors.borderMid, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.section,
  },
  ktpFrameDone: { borderStyle: 'solid', borderColor: Colors.accent, backgroundColor: Colors.accentLight },
  selfieFrame: {
    width: 240, height: 280, borderRadius: 140,
    borderWidth: 2, borderColor: Colors.borderMid, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.section,
  },
  captureHint: { fontSize: 13, color: Colors.grayLight },
  captureDoneText: { fontSize: 14, fontWeight: '700', color: Colors.accent },

  secondaryBtn: {
    flexDirection: 'row', gap: 6, alignSelf: 'center',
    paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 22, borderWidth: 1.2, borderColor: Colors.borderMid,
  },
  secondaryBtnText: { fontSize: 14, fontWeight: '600', color: Colors.dark },

  primaryBtn: {
    height: 56, borderRadius: 14, backgroundColor: Colors.dark,
    alignItems: 'center', justifyContent: 'center',
  },
  primaryBtnDisabled: { backgroundColor: Colors.borderMid },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },

  successCircle: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: Colors.accentLight, alignItems: 'center', justifyContent: 'center',
  },
});
```

---

## 워커 측 대시보드

**파일**: `src/screens/worker/WorkerHomeScreen.tsx`

```tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Switch,
  TouchableOpacity, Image, Alert,
} from 'react-native';
import { C1, C2 } from '../../constants/photos';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';

// ── Mock order requests ─────────────────────────────────────────
const MOCK_REQUESTS = [
  {
    id: 'r1',
    customerName: 'Bunda Wulandari',
    customerPhoto: C1,
    date: '2026-04-16',
    startTime: '09:00',
    duration: 4,
    address: 'Jl. Kemang Raya No.12, Jakarta Selatan',
    totalPrice: 120000,
    depositAmount: 36000,
    services: ['Masak', 'Beberes'],
    notes: 'Tolong fokus di dapur dan kamar mandi ya',
  },
  {
    id: 'r2',
    customerName: 'Bunda Indah',
    customerPhoto: C2,
    date: '2026-04-16',
    startTime: '14:00',
    duration: 3,
    address: 'Jl. Fatmawati No.8, Jakarta Selatan',
    totalPrice: 90000,
    depositAmount: 27000,
    services: ['Bersih-bersih', 'Setrika'],
    notes: '',
  },
];

// ── Today's confirmed schedule ──────────────────────────────────
const MOCK_SCHEDULE = [
  { id: 's1', time: '09:00–13:00', customer: 'Bunda Wulandari', service: 'Masak + Beberes', done: true },
  { id: 's2', time: '14:00–17:00', customer: 'Bunda Indah',     service: 'Bersih-bersih',   done: false },
];

export default function WorkerHomeScreen() {
  const { user }  = useAuthStore();
  const { t, lang } = useLanguageStore();
  const insets = useSafeAreaInsets();
  const [isOnline, setIsOnline] = useState(true);
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const firstName = user?.name?.split(' ')[0] ?? '';
  const isDriver  = user?.role === 'driver';

  return (
    <ScrollView
      style={s.root}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[0]}
    >
      {/* ── Sticky header ── */}
      <View style={[s.header, { paddingTop: insets.top + 15 }]}>
        <View style={s.headerTop}>
          <View style={s.headerLeft}>
            <View style={[s.artBadge, isDriver && { backgroundColor: '#3B82F6' }]}>
              <Ionicons name={isDriver ? 'car' : 'home'} size={11} color={Colors.white} />
              <Text style={s.artBadgeText}>{isDriver ? 'DRIVER' : 'ART'}</Text>
            </View>
            <View>
              <Text style={s.greeting}>Halo, {firstName}</Text>
              <Text style={s.subGreeting}>
                {isDriver
                  ? (lang === 'ko' ? '오늘도 안전운전 부탁드려요' : lang === 'en' ? 'Drive safely today' : 'Selamat berkendara aman hari ini')
                  : t.workerHome.readyHelper}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={s.notifBtn}
            onPress={() =>
              Alert.alert(
                lang === 'ko' ? '알림' : lang === 'en' ? 'Notifications' : 'Notifikasi',
                lang === 'ko' ? '새 알림이 없습니다.' : lang === 'en' ? 'No new notifications.' : 'Tidak ada notifikasi baru.',
                [{ text: 'OK' }],
              )
            }
          >
            <Ionicons name="notifications-outline" size={22} color={Colors.grayLight} />
            <View style={s.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Online toggle ── */}
      <View style={s.toggleWrap}>
        <View style={[s.toggleCard, isOnline && s.toggleCardOnline]}>
          <View style={s.toggleLeft}>
            <View style={[s.statusPulse, isOnline && s.statusPulseOn]}>
              <View style={[s.statusDot, { backgroundColor: isOnline ? Colors.accent : Colors.grayLight }]} />
            </View>
            <View>
              <Text style={s.toggleTitle}>
                {isOnline ? t.workerHome.online : t.workerHome.offline}
              </Text>
              <Text style={s.toggleSub}>
                {isOnline ? t.workerHome.onlineDesc : t.workerHome.offlineDesc}
              </Text>
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

      {/* ── Earnings hero card ── */}
      <View style={s.heroCard}>
        <View style={s.heroLeft}>
          <Text style={s.heroLabel}>{t.workerHome.todayEarnings}</Text>
          <Text style={s.heroValue}>Rp 210.000</Text>
          <View style={s.heroTrend}>
            <Ionicons name="trending-up" size={12} color="rgba(255,255,255,0.8)" />
            <Text style={s.heroTrendText}>+Rp 30rb vs kemarin</Text>
          </View>
        </View>
        <View style={s.heroRight}>
          <View style={s.heroStat}>
            <Text style={s.heroStatValue}>2</Text>
            <Text style={s.heroStatLabel}>{t.workerHome.todayJobs}</Text>
          </View>
          <View style={s.heroStatDivider} />
          <View style={s.heroStat}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={s.heroStatValue}>{user?.rating ?? '4.8'}</Text>
            </View>
            <Text style={s.heroStatLabel}>{t.workerHome.rating}</Text>
          </View>
        </View>
      </View>

      {/* ── Today's schedule ── */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>{t.workerHome.scheduleTitle}</Text>
        <View style={s.scheduleCard}>
          {MOCK_SCHEDULE.map((item, i) => (
            <View
              key={item.id}
              style={[
                s.scheduleRow,
                i < MOCK_SCHEDULE.length - 1 && s.scheduleRowBorder,
              ]}
            >
              <View style={[s.scheduleTimeBadge, item.done && s.scheduleTimeDone]}>
                <Text style={[s.scheduleTime, item.done && s.scheduleTimeDoneText]}>
                  {item.time}
                </Text>
              </View>
              <View style={s.scheduleInfo}>
                <Text style={s.scheduleCustomer}>{item.customer}</Text>
                <Text style={s.scheduleService}>{item.service}</Text>
              </View>
              <Ionicons
                name={item.done ? 'checkmark-circle' : 'time-outline'}
                size={20}
                color={item.done ? Colors.success : Colors.grayLight}
              />
            </View>
          ))}
        </View>
      </View>

      {/* ── Incoming requests ── */}
      <View style={s.section}>
        <View style={s.sectionHeaderRow}>
          <Text style={s.sectionTitle}>{t.workerHome.incomingRequests}</Text>
          {isOnline && (
            <View style={s.badge}>
              <Text style={s.badgeText}>{requests.length}</Text>
            </View>
          )}
        </View>

        {isOnline ? (
          requests.map((req) => (
            <View key={req.id} style={s.requestCard}>
              {/* Customer row */}
              <View style={s.reqTop}>
                <Image source={{ uri: req.customerPhoto }} style={s.reqAvatar} />
                <View style={{ flex: 1 }}>
                  <Text style={s.reqName}>{req.customerName}</Text>
                  <Text style={s.reqMeta}>
                    {req.date} · {req.startTime} · {req.duration} {t.workerHome.hours}
                  </Text>
                </View>
                <Text style={s.reqPrice}>
                  Rp {(req.totalPrice / 1000).toFixed(0)}rb
                </Text>
              </View>

              {/* Service tags */}
              <View style={s.reqTagsRow}>
                {req.services.map((svc) => (
                  <View key={svc} style={s.reqTag}>
                    <Text style={s.reqTagText}>{svc}</Text>
                  </View>
                ))}
              </View>

              {/* Details */}
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
                <TouchableOpacity
                  style={s.btnSecondary}
                  activeOpacity={0.8}
                  onPress={() =>
                    Alert.alert(
                      lang === 'ko' ? '요청 거절' : lang === 'en' ? 'Reject Request' : 'Tolak Permintaan',
                      lang === 'ko'
                        ? `${req.customerName}의 요청을 거절하시겠습니까?`
                        : lang === 'en'
                        ? `Reject ${req.customerName}'s request?`
                        : `Tolak permintaan dari ${req.customerName}?`,
                      [
                        { text: lang === 'ko' ? '아니오' : lang === 'en' ? 'No' : 'Tidak', style: 'cancel' },
                        {
                          text: lang === 'ko' ? '거절' : lang === 'en' ? 'Reject' : 'Tolak',
                          style: 'destructive',
                          onPress: () => setRequests((prev) => prev.filter((r) => r.id !== req.id)),
                        },
                      ],
                    )
                  }
                >
                  <Text style={s.btnSecondaryText}>{t.workerHome.reject}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.btnPrimary}
                  activeOpacity={0.85}
                  onPress={() =>
                    Alert.alert(
                      lang === 'ko' ? '요청 수락' : lang === 'en' ? 'Request Accepted' : 'Permintaan Diterima',
                      lang === 'ko'
                        ? `${req.customerName}의 요청을 수락했습니다!`
                        : lang === 'en'
                        ? `You accepted ${req.customerName}'s request!`
                        : `Permintaan dari ${req.customerName} diterima!`,
                      [
                        {
                          text: 'OK',
                          onPress: () =>
                            setRequests((prev) => prev.filter((r) => r.id !== req.id)),
                        },
                      ],
                    )
                  }
                >
                  <Ionicons name="checkmark" size={15} color={Colors.white} />
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

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const AMBER = Colors.accent;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F5F5' },

  // ── Header ──
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  artBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: AMBER,
    borderRadius: Radius.pill,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  artBadgeText: { fontSize: 11, fontWeight: '800', color: Colors.white },
  greeting:    { fontSize: 18, fontWeight: '700', color: Colors.dark },
  subGreeting: { fontSize: 12, color: Colors.gray, marginTop: 1 },
  notifBtn: {
    width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute', top: 7, right: 7,
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: Colors.danger,
    borderWidth: 1.5, borderColor: Colors.white,
  },

  // ── Online toggle ──
  toggleWrap: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 },
  toggleCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: 16, paddingVertical: 14,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  toggleCardOnline: { borderColor: Colors.accent + '40', backgroundColor: Colors.accentLight },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusPulse: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.section,
  },
  statusPulseOn: { backgroundColor: Colors.accent + '20' },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  toggleTitle: { fontSize: 14, fontWeight: '700', color: Colors.dark },
  toggleSub:   { fontSize: 12, color: Colors.gray, marginTop: 1 },

  // ── Earnings hero ──
  heroCard: {
    marginHorizontal: 16, marginTop: 10,
    backgroundColor: AMBER,
    borderRadius: Radius.xl,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.md,
  },
  heroLeft: { flex: 1 },
  heroLabel: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.75)', marginBottom: 4 },
  heroValue: { fontSize: 28, fontWeight: '800', color: Colors.white, letterSpacing: -0.5 },
  heroTrend: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  heroTrendText: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  heroRight: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    paddingLeft: 16,
    borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.3)',
  },
  heroStat:       { alignItems: 'center', gap: 3 },
  heroStatValue:  { fontSize: 16, fontWeight: '700', color: Colors.white },
  heroStatLabel:  { fontSize: 10, color: 'rgba(255,255,255,0.7)' },
  heroStatDivider:{ width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.3)' },

  // ── Sections ──
  section: { paddingHorizontal: 16, paddingTop: 20, gap: 12 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.dark },
  badge: {
    backgroundColor: AMBER,
    borderRadius: Radius.pill, width: 22, height: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: Colors.white },

  // ── Schedule ──
  scheduleCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden',
  },
  scheduleRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 14, paddingVertical: 13,
  },
  scheduleRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  scheduleTimeBadge: {
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.sm,
    paddingHorizontal: 8, paddingVertical: 4,
    minWidth: 104, alignItems: 'center',
  },
  scheduleTimeDone:    { backgroundColor: Colors.section },
  scheduleTime:        { fontSize: 11, fontWeight: '700', color: Colors.accent },
  scheduleTimeDoneText:{ color: Colors.grayLight },
  scheduleInfo:    { flex: 1 },
  scheduleCustomer:{ fontSize: 13, fontWeight: '600', color: Colors.dark },
  scheduleService: { fontSize: 11, color: Colors.gray, marginTop: 2 },

  // ── Request card ──
  requestCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border,
    padding: 16, ...Shadow.sm,
  },
  reqTop:    { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  reqAvatar: { width: 46, height: 46, borderRadius: 23 },
  reqName:   { fontSize: 14, fontWeight: '700', color: Colors.darkMid, marginBottom: 3 },
  reqMeta:   { fontSize: 12, color: Colors.grayLight },
  reqPrice:  { fontSize: 15, fontWeight: '700', color: AMBER },

  reqTagsRow: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  reqTag: {
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.pill,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: AMBER + '40',
  },
  reqTagText: { fontSize: 11, fontWeight: '600', color: AMBER },

  reqDetails: {
    backgroundColor: Colors.section, borderRadius: Radius.md,
    paddingHorizontal: 14, paddingVertical: 10,
    gap: 6, marginBottom: 10,
  },
  detailRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  detailText: { flex: 1, fontSize: 12, color: Colors.gray, lineHeight: 18 },

  depositInfo: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.accentLight, borderRadius: Radius.sm,
    paddingHorizontal: 10, paddingVertical: 7,
    marginBottom: 12,
  },
  depositText: { fontSize: 12, color: Colors.accent, fontWeight: '500' },

  reqActions: { flexDirection: 'row', gap: 10 },
  btnSecondary: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 11,
    borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.borderMid,
  },
  btnSecondaryText: { fontSize: 13, fontWeight: '600', color: Colors.gray },
  btnPrimary: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 11,
    borderRadius: Radius.pill, backgroundColor: AMBER,
  },
  btnPrimaryText: { fontSize: 13, fontWeight: '700', color: Colors.white },

  offlineCard: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    alignItems: 'center', paddingVertical: 48, gap: 12,
    borderWidth: 1, borderColor: Colors.border,
  },
  offlineText: { fontSize: 14, color: Colors.gray, textAlign: 'center', lineHeight: 22 },
});
```

---

## Explore mock 데이터

**파일**: `src/constants/exploreWorkers.ts`

```tsx
/**
 * 탐색(Explore) 탭 전용 워커 mock.
 *
 * 기존 W1~W12 사진을 재사용하되, Explore UX(인스타 스토리)에 필요한 추가 필드
 * 포함: age, photos[], categories[], reviewCount, lat/lng (거리 계산용).
 *
 * 카테고리는 4종으로 통일: 가사 / 베이비시터 / 청소 / 요리.
 * 기존 skills를 이 4개로 매핑.
 *
 * id는 MOCK_WORKERS / MapScreen Partner와 충돌하지 않게 'ex-'로 시작.
 * (예약/채팅 라우팅 시 이 id 그대로 넘김 — 기존 라우트가 id 기반으로 매칭하면 됨)
 */
import {
  W1, W2, W3, W4, W5, W6, W7, W8, W9, W10, W11, W12,
} from './photos';

export type ExploreCategory = 'household' | 'babysitter' | 'cleaning' | 'cooking';

export interface ExploreWorker {
  id: string;
  detailWorkerId: string;      // WorkerDetail 라우트로 넘길 ID (MOCK_WORKERS의 w-N과 매칭)
  name: string;
  age: number;
  photos: string[];            // 1~3장
  categories: ExploreCategory[];
  rating: number;
  reviewCount: number;
  location: string;            // 동네명
  lat: number;
  lng: number;
  bio?: string;
  isAvailable: boolean;        // 온라인 상태 = 의뢰 받을 수 있음
  isVerified: boolean;
}

// 사용자(고객) 설정 위치 = Kebayoran Baru (지도 데모 중심)
export const USER_HOME_LOCATION = { lat: -6.2488, lng: 106.8052, name: 'Kebayoran Baru' };

// ── Mock workers (12명) ──────────────────────────────────────
// detailWorkerId: WorkerDetail의 MOCK_WORKERS와 매칭 (w1~w8 존재, ex9~12는 cycle)
export const EXPLORE_WORKERS: ExploreWorker[] = [
  {
    id: 'ex-1', detailWorkerId: 'w1', name: 'Sari Dewi',        age: 34,
    photos: [W1, W4, W11],
    categories: ['household', 'cooking', 'cleaning'],
    rating: 5.0, reviewCount: 312,
    location: 'Kebayoran Baru', lat: -6.2470, lng: 106.8044,
    bio: 'ART 10년 경력. 요리·정리 전문. 아이 돌보기 가능 🌿',
    isAvailable: true, isVerified: true,
  },
  {
    id: 'ex-2', detailWorkerId: 'w2', name: 'Rina Wulandari',   age: 28,
    photos: [W2, W6],
    categories: ['cooking', 'household'],
    rating: 4.9, reviewCount: 198,
    location: 'Kebayoran Baru', lat: -6.2484, lng: 106.8062,
    bio: '건강 식단 요리 전문 · 시간 약속 잘 지킵니다',
    isAvailable: true, isVerified: true,
  },
  {
    id: 'ex-3', detailWorkerId: 'w3', name: 'Dewi Anggraeni',   age: 31,
    photos: [W3, W5],
    categories: ['babysitter', 'cooking'],
    rating: 4.7, reviewCount: 143,
    location: 'Kemang', lat: -6.2498, lng: 106.8084,
    bio: '아이와 함께한 7년, 둘째 가정에 익숙해요',
    isAvailable: true, isVerified: true,
  },
  {
    id: 'ex-4', detailWorkerId: 'w4', name: 'Fitri Handayani',  age: 36,
    photos: [W4, W7, W12],
    categories: ['household', 'cleaning'],
    rating: 4.9, reviewCount: 227,
    location: 'Fatmawati', lat: -6.2520, lng: 106.8040,
    bio: '꼼꼼한 청소 + 다림질. expat 가정 다수 경험',
    isAvailable: true, isVerified: true,
  },
  {
    id: 'ex-5', detailWorkerId: 'w5', name: 'Indah Lestari',    age: 26,
    photos: [W5, W8],
    categories: ['cleaning'],
    rating: 4.8, reviewCount: 89,
    location: 'Pondok Indah', lat: -6.2515, lng: 106.8005,
    bio: 'Deep cleaning 스페셜리스트',
    isAvailable: false, isVerified: true,
  },
  {
    id: 'ex-6', detailWorkerId: 'w6', name: 'Nur Aini',         age: 40,
    photos: [W6, W9],
    categories: ['cooking', 'household'],
    rating: 4.9, reviewCount: 176,
    location: 'Senopati', lat: -6.2478, lng: 106.8030,
    bio: '인도네시아·중식 가정요리, 행사 케이터링 가능',
    isAvailable: true, isVerified: true,
  },
  {
    id: 'ex-7', detailWorkerId: 'w7', name: 'Siti Rahayu',      age: 29,
    photos: [W7, W2],
    categories: ['babysitter', 'household'],
    rating: 4.6, reviewCount: 64,
    location: 'Cilandak', lat: -6.2535, lng: 106.8022,
    bio: '유아 ~ 초등 돌봄, 영유아 응급처치 자격',
    isAvailable: true, isVerified: false,
  },
  {
    id: 'ex-8', detailWorkerId: 'w8', name: 'Ratna Sari',       age: 33,
    photos: [W8, W3, W10],
    categories: ['household', 'cooking', 'cleaning'],
    rating: 4.9, reviewCount: 112,
    location: 'Kebayoran Baru', lat: -6.2492, lng: 106.8058,
    bio: '전반적인 집안일 다 가능합니다',
    isAvailable: true, isVerified: true,
  },
  {
    id: 'ex-9', detailWorkerId: 'w1', name: 'Wulan Sari',       age: 42,
    photos: [W9, W6],
    categories: ['cooking'],
    rating: 5.0, reviewCount: 201,
    location: 'Pondok Indah', lat: -6.2510, lng: 106.7998,
    bio: '베테랑 요리사. 어떤 메뉴든 맞춰 만들어요',
    isAvailable: false, isVerified: true,
  },
  {
    id: 'ex-10', detailWorkerId: 'w2', name: 'Mega Putri',       age: 24,
    photos: [W10, W11],
    categories: ['cleaning', 'household'],
    rating: 4.7, reviewCount: 47,
    location: 'Pesanggrahan', lat: -6.2540, lng: 106.8000,
    bio: '깔끔하고 빠른 청소가 자신 있어요',
    isAvailable: true, isVerified: false,
  },
  {
    id: 'ex-11', detailWorkerId: 'w3', name: 'Lina Kartini',     age: 31,
    photos: [W11, W1],
    categories: ['household', 'babysitter'],
    rating: 4.8, reviewCount: 134,
    location: 'Kebayoran Baru', lat: -6.2475, lng: 106.8035,
    bio: '두 아이 가정, 다정한 돌봄 + 청소',
    isAvailable: true, isVerified: true,
  },
  {
    id: 'ex-12', detailWorkerId: 'w4', name: 'Aisyah Putri',     age: 27,
    photos: [W12, W4, W7],
    categories: ['household', 'cooking', 'cleaning'],
    rating: 4.9, reviewCount: 176,
    location: 'Kemang', lat: -6.2496, lng: 106.8091,
    bio: '청소·요리·정리 다 능숙해요',
    isAvailable: true, isVerified: true,
  },
];

// 카테고리 라벨 매핑
export const EXPLORE_CATEGORY_META: Record<ExploreCategory, {
  icon: string; ko: string; en: string; id: string; color: string;
}> = {
  household:  { icon: 'home-outline',  ko: '가사',       en: 'Household', id: 'Rumah',      color: '#F59E0B' },
  babysitter: { icon: 'happy-outline', ko: '베이비시터',  en: 'Babysitter', id: 'Baby Sitter', color: '#EC4899' },
  cleaning:   { icon: 'sparkles-outline', ko: '청소',    en: 'Cleaning',  id: 'Bersih',     color: '#3B82F6' },
  cooking:    { icon: 'restaurant-outline', ko: '요리',  en: 'Cooking',   id: 'Masak',      color: '#EF4444' },
};

// ── 거리 계산 (Haversine, km) ──────────────────────────────
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const aVal = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(aVal)));
}

// ── 추천 풀 선정 — 최대 10명 ────────────────────────────────
export function getRecommendedWorkers(): ExploreWorker[] {
  return EXPLORE_WORKERS
    // 1) 온라인 (의뢰 받을 수 있는 워커) 필수
    .filter((w) => w.isAvailable)
    .map((w) => ({
      worker: w,
      distance: distanceKm(USER_HOME_LOCATION, w),
    }))
    // 2) 거리순 (가까운 순) → 3) 평점 (높은 순) → 4) 동순위에선 reviewCount
    .sort((a, b) => {
      if (Math.abs(a.distance - b.distance) > 0.5) return a.distance - b.distance;
      if (b.worker.rating !== a.worker.rating) return b.worker.rating - a.worker.rating;
      return b.worker.reviewCount - a.worker.reviewCount;
    })
    .slice(0, 10)
    .map((x) => x.worker);
}
```
