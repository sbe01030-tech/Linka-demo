import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
const CAT_ICONS: Record<string, any> = {
  helper:    require('../../../assets/icons/cat_helper.png'),
  cooking:   require('../../../assets/icons/cat_cooking.png'),
  cleaning:  require('../../../assets/icons/cat_cleaning.png'),
  custom:    require('../../../assets/icons/cat_custom.png'),
  tutor:     require('../../../assets/icons/cat_tutor.png'),
  homevisit: require('../../../assets/icons/cat_homevisit.png'),
  english:   require('../../../assets/icons/cat_english.png'),
  more:      require('../../../assets/icons/cat_more.png'),
};
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
  { id: 'helper',    key: 'catArt',      bgColor: '#FFF3C0' },
  { id: 'cooking',   key: 'catCooking',  bgColor: '#FFD8D4' },
  { id: 'cleaning',  key: 'catCleaning', bgColor: '#C4F5DC' },
  { id: 'custom',    key: 'catCustom',   bgColor: '#E4DEFF' },
  { id: 'tutor',     key: 'catTutor',    bgColor: '#CCE8FF' },
  { id: 'homevisit', key: 'catVisit',    bgColor: '#FFD8EA' },
  { id: 'english',   key: 'catEnglish',  bgColor: '#C8F4F2' },
  { id: 'more',      key: 'catMore',     bgColor: '#EAEAEF' },
];

const AVATAR_URLS = AVATAR_STACK;

interface MockWorker {
  id: string; name: string; photo: string; location: string;
  rating: number; pricePerHour: number; totalJobs: number;
  isAvailable: boolean; skills: string[]; isVerified: boolean;
}

const MOCK_WORKERS: MockWorker[] = [
  { id:'w1', name:'Sari Dewi',       photo:W1, location:'Kebayoran Baru', rating:5.0, pricePerHour:30000, totalJobs:312, isAvailable:true,  skills:['Beberes','Masak','Cuci'],   isVerified:true  },
  { id:'w2', name:'Rina Wulandari',  photo:W2, location:'Cilandak',       rating:4.9, pricePerHour:25000, totalJobs:198, isAvailable:true,  skills:['Masak Sehat','Beberes'],    isVerified:true  },
  { id:'w3', name:'Dewi Anggraeni',  photo:W3, location:'Kemang',         rating:4.7, pricePerHour:28000, totalJobs:143, isAvailable:true,  skills:['Masak','Cuci'],             isVerified:true  },
  { id:'w4', name:'Fitri Handayani', photo:W4, location:'Fatmawati',      rating:4.9, pricePerHour:27000, totalJobs:227, isAvailable:true,  skills:['Setrika','Beberes'],        isVerified:true  },
  { id:'w5', name:'Indah Lestari',   photo:W5, location:'Pondok Indah',   rating:4.8, pricePerHour:35000, totalJobs:89,  isAvailable:false, skills:['Deep Cleaning'],            isVerified:true  },
  { id:'w6', name:'Nur Aini',        photo:W6, location:'BSD City',       rating:4.8, pricePerHour:24000, totalJobs:89,  isAvailable:true,  skills:['Cuci','Setrika'],           isVerified:true  },
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

type ServiceTab = 'regular' | 'special';

export default function HomeScreen() {
  const navigation  = useNavigation<Nav>();
  const { user }    = useAuthStore();
  const { t, lang } = useLanguageStore();
  const [svcTab, setSvcTab] = useState<ServiceTab>('regular');

  const firstName = user?.name?.split(' ')[0] ?? 'Bunda';
  const MOCK_POSTS = getPreviewPosts(lang);
  const CATEGORIES = CATEGORY_META.map((c) => ({ ...c, label: (t.homeNew as any)[c.key] as string }));

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>

      {/* ── Sticky header ── */}
      <View style={s.header}>
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
          <TouchableOpacity style={s.bellBtn} onPress={() => Alert.alert(
            lang === 'ko' ? '알림' : lang === 'en' ? 'Notifications' : 'Notifikasi',
            lang === 'ko' ? '새 알림이 없습니다.' : lang === 'en' ? 'No new notifications.' : 'Tidak ada notifikasi baru.',
            [{ text: 'OK' }]
          )}>
            <Ionicons name="notifications-outline" size={22} color={Colors.dark} />
            <View style={s.bellDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Service type buttons ── */}
      <View style={s.svcBtnWrap}>
        <TouchableOpacity
          style={[s.svcBtn, svcTab === 'regular' && s.svcBtnActive]}
          onPress={() => { setSvcTab('regular'); (navigation as any).navigate('Map', { expanded: true, serviceType: 'regular' }); }}
          activeOpacity={0.75}
        >
          <Ionicons name="calendar-outline" size={15}
            color={svcTab === 'regular' ? Colors.accent : Colors.gray} />
          <Text style={[s.svcBtnText, svcTab === 'regular' && s.svcBtnTextActive]}>{t.homeNew.serviceRegular}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.svcBtn, svcTab === 'special' && s.svcBtnActive]}
          onPress={() => { setSvcTab('special'); (navigation as any).navigate('Map', { expanded: true, serviceType: 'onetime' }); }}
          activeOpacity={0.75}
        >
          <Ionicons name="flash-outline" size={15}
            color={svcTab === 'special' ? Colors.accent : Colors.gray} />
          <Text style={[s.svcBtnText, svcTab === 'special' && s.svcBtnTextActive]}>{t.homeNew.serviceSpecial}</Text>
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
              {lang === 'ko' ? '내 주변 헬퍼 찾기' : lang === 'en' ? 'Find Helpers Nearby' : 'Cari Helper Terdekat'}
            </Text>
            <Text style={s.nearbySub}>
              {lang === 'ko' ? '지도에서 근처 헬퍼를 확인하세요' : lang === 'en' ? 'See helpers on the map' : 'Lihat helper di peta'}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.accent} />
      </TouchableOpacity>

      {/* ── Category grid ── */}
      <View style={s.catSection}>
        <View style={s.catGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={s.catItem}
              activeOpacity={0.75}
              onPress={() => (navigation as any).navigate('Map', { expanded: true })}
            >
              <View style={[s.catIconWrap, { backgroundColor: cat.bgColor }]}>
                <Image source={CAT_ICONS[cat.id]} style={s.catIconImg} resizeMode="contain" />
              </View>
              <Text style={s.catLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
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

      {/* ── Recommended workers ── */}
      <View style={s.workerSection}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>
            {lang === 'ko' ? '추천 헬퍼' : lang === 'en' ? 'Recommended' : 'Helper Terdekat'}
          </Text>
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
                <Ionicons name="star" size={11} color="#F59E0B" />
                <Text style={s.workerRating}>{w.rating.toFixed(1)}</Text>
                <Text style={s.workerPriceDot}>·</Text>
                <Text style={s.workerPrice}>Rp {(w.pricePerHour / 1000).toFixed(0)}rb</Text>
                <Text style={s.workerPriceUnit}>/jam</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Ad card ── */}
      <View style={s.adCard}>
        <View style={s.adBadge}><Text style={s.adBadgeText}>AD</Text></View>
        <View style={s.adContent}>
          <Text style={s.adTitle}>{t.homeNew.adTitle}</Text>
          <Text style={s.adSub}>{t.homeNew.adSub}</Text>
          <TouchableOpacity style={s.adBtn} onPress={() => Alert.alert('Linka Pro', lang === 'ko' ? '프리미엄 서비스 준비 중입니다.' : lang === 'en' ? 'Premium service coming soon.' : 'Layanan premium segera hadir.')}>
            <Text style={s.adBtnText}>{t.homeNew.adCta}</Text>
          </TouchableOpacity>
        </View>
        <View style={s.adMascotWrap}>
          <MascotFace size={56} />
        </View>
      </View>

      {/* ── Community preview ── */}
      <View style={s.communitySection}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>{t.homeNew.popularPosts}</Text>
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

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// ── Styles ─────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F5F5' },

  // Header
  header: {
    backgroundColor: Colors.white,
    paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12,
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
    borderWidth: 1.5, borderColor: Colors.borderMid,
    backgroundColor: Colors.white,
  },
  svcBtnActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentLight,
  },
  svcBtnText:       { fontSize: 14, fontWeight: '500', color: Colors.gray },
  svcBtnTextActive: { color: Colors.accent, fontWeight: '700' },

  // Category grid
  catSection: {
    backgroundColor: Colors.white, marginTop: 8,
    paddingTop: 20, paddingBottom: 12, paddingHorizontal: 16,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border,
  },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  catItem: { width: '25%', alignItems: 'center', marginBottom: 18, gap: 8 },
  catIconWrap: {
    width: 66, height: 66, borderRadius: 33,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  catIconImg: { width: 65, height: 65, marginTop: 9 },
  catLabel: { fontSize: 11, fontWeight: '500', color: Colors.dark, textAlign: 'center', lineHeight: 15 },

  // Nearby banner
  nearbyBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.accentLight,
    marginHorizontal: 16, marginTop: 10, marginBottom: 2,
    borderRadius: Radius.lg,
    paddingHorizontal: 14, paddingVertical: 13,
    borderWidth: 1, borderColor: Colors.accent + '30',
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

  // Ad card
  adCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.accentLight,
    marginTop: 8, marginHorizontal: 16, borderRadius: Radius.lg,
    padding: 16, borderWidth: 1, borderColor: Colors.accent + '30',
    overflow: 'hidden',
  },
  adBadge: {
    position: 'absolute', top: 10, right: 10,
    backgroundColor: Colors.accent + '25',
    borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2,
  },
  adBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.accent },
  adContent: { flex: 1, gap: 4 },
  adTitle: { fontSize: 15, fontWeight: '700', color: Colors.dark },
  adSub:   { fontSize: 12, color: Colors.gray },
  adBtn: {
    alignSelf: 'flex-start', marginTop: 8,
    backgroundColor: Colors.accent,
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

  // Community
  communitySection: {
    backgroundColor: Colors.white, marginTop: 8,
    paddingTop: 16, paddingBottom: 8,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, marginBottom: 4,
  },
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

});
