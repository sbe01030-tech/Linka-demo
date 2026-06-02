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
