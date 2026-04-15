import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Rect, Circle, Ellipse, Path, Line } from 'react-native-svg';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import { LangCode } from '../../i18n';
import { Worker, RootStackParamList, CommunityPost } from '../../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// ── Mock data ──────────────────────────────────────────────────
const MOCK_WORKERS: Worker[] = [
  {
    id: 'w1', name: 'Sari Dewi', phone: '0812-3456-7890', role: 'helper', serviceType: 'helper',
    photo: 'https://randomuser.me/api/portraits/women/45.jpg',
    pricePerHour: 30000, location: 'Kebayoran, Jakarta Selatan',
    bio: 'ART berpengalaman 10 tahun, ahli memasak dan bersih-bersih rumah.',
    skills: ['Masak', 'Cuci', 'Setrika', 'Beberes'],
    isAvailable: true, rating: 5.0, totalJobs: 312, isVerified: true, experienceYears: 10,
  },
  {
    id: 'w2', name: 'Rina Wulandari', phone: '0813-4567-8901', role: 'helper', serviceType: 'helper',
    photo: 'https://randomuser.me/api/portraits/women/63.jpg',
    pricePerHour: 25000, location: 'Cilandak, Jakarta Selatan',
    bio: 'Spesialis masak menu sehat & bersih-bersih. Sudah 7 tahun pengalaman.',
    skills: ['Masak Sehat', 'Beberes', 'Cuci'],
    isAvailable: true, rating: 4.9, totalJobs: 198, isVerified: true, experienceYears: 7,
  },
  {
    id: 'w3', name: 'Yanti Kusuma', phone: '0814-5678-9012', role: 'tutor', serviceType: 'tutor',
    photo: 'https://randomuser.me/api/portraits/women/48.jpg',
    pricePerHour: 100000, location: 'Kemang, Jakarta Selatan',
    bio: 'Lulusan UI, guru les privat SD-SMP Matematika & Bahasa Inggris.',
    subjects: ['Matematika', 'Bahasa Inggris', 'IPA'],
    isAvailable: true, rating: 5.0, totalJobs: 87, isVerified: true, experienceYears: 4,
  },
  {
    id: 'w4', name: 'Nina Rahayu', phone: '0815-6789-0123', role: 'tutor', serviceType: 'tutor',
    photo: 'https://randomuser.me/api/portraits/women/56.jpg',
    pricePerHour: 80000, location: 'Pondok Indah, Jakarta Selatan',
    bio: 'Spesialis les Speaking & Reading Bahasa Inggris untuk SD-SMP.',
    subjects: ['Bahasa Inggris', 'English Speaking'],
    isAvailable: true, rating: 4.8, totalJobs: 64, isVerified: true, experienceYears: 3,
  },
  {
    id: 'w5', name: 'Dewi Anggraeni', phone: '0816-7890-1234', role: 'helper', serviceType: 'helper',
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    pricePerHour: 28000, location: 'Menteng, Jakarta Pusat',
    bio: 'Berpengalaman di keluarga dengan anak kecil. Sabar & telaten.',
    skills: ['Masak', 'Cuci', 'Perawatan Anak'],
    isAvailable: false, rating: 4.7, totalJobs: 156, isVerified: true, experienceYears: 5,
  },
];

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

const CATEGORIES = [
  { id: 'helper',    label: 'ART',           icon: 'home',              bg: '#FFFBEB', color: Colors.helperColor },
  { id: 'cooking',   label: 'Masak/Catering',icon: 'restaurant',        bg: '#FFF0EB', color: '#FF6B35' },
  { id: 'cleaning',  label: 'Bersih-bersih', icon: 'sparkles',          bg: '#F0FDF4', color: '#22C55E' },
  { id: 'custom',    label: 'Custom',        icon: 'star',              bg: '#FEF3C7', color: '#F59E0B' },
  { id: 'tutor',     label: 'Les Privat',    icon: 'book',              bg: '#EEF2FF', color: Colors.tutorColor },
  { id: 'homevisit', label: 'Kunjungan',     icon: 'pencil',            bg: '#F5F3FF', color: '#7C3AED' },
  { id: 'english',   label: 'Les Inggris',   icon: 'globe',             bg: '#EFF6FF', color: '#3B82F6' },
  { id: 'more',      label: 'Lainnya',       icon: 'ellipsis-horizontal',bg: Colors.section, color: Colors.gray },
] as const;

const AVATAR_URLS = [
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/women/65.jpg',
  'https://randomuser.me/api/portraits/women/22.jpg',
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
type FilterTab  = 'all' | 'helper' | 'tutor';

export default function HomeScreen() {
  const navigation  = useNavigation<Nav>();
  const { user }    = useAuthStore();
  const { t, lang } = useLanguageStore();
  const [svcTab,    setSvcTab]    = useState<ServiceTab>('regular');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');

  const firstName = user?.name?.split(' ')[0] ?? 'Bunda';
  const MOCK_POSTS = getPreviewPosts(lang);

  const filtered = MOCK_WORKERS.filter((w) =>
    filterTab === 'all' || w.serviceType === filterTab
  );

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
          <TouchableOpacity style={s.locationChip}>
            <Ionicons name="location" size={13} color={Colors.accent} />
            <Text style={s.locationText}>{t.homeNew.locationDefault}</Text>
            <Ionicons name="chevron-down" size={12} color={Colors.gray} />
          </TouchableOpacity>
          {/* Bell */}
          <TouchableOpacity style={s.bellBtn}>
            <Ionicons name="notifications-outline" size={22} color={Colors.dark} />
            <View style={s.bellDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Service type tabs ── */}
      <View style={s.svcTabsWrap}>
        <TouchableOpacity
          style={[s.svcTab, svcTab === 'regular' && s.svcTabActive]}
          onPress={() => setSvcTab('regular')}
        >
          <Ionicons name="calendar-outline" size={15}
            color={svcTab === 'regular' ? Colors.accent : Colors.grayLight} />
          <Text style={[s.svcTabText, svcTab === 'regular' && s.svcTabTextActive]}>{t.homeNew.serviceRegular}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.svcTab, svcTab === 'special' && s.svcTabActive]}
          onPress={() => setSvcTab('special')}
        >
          <Ionicons name="flash-outline" size={15}
            color={svcTab === 'special' ? Colors.accent : Colors.grayLight} />
          <Text style={[s.svcTabText, svcTab === 'special' && s.svcTabTextActive]}>{t.homeNew.serviceSpecial}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Category grid ── */}
      <View style={s.catSection}>
        <View style={s.catGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={s.catItem}
              activeOpacity={0.7}
              onPress={() => {
                if (cat.id === 'helper') setFilterTab('helper');
                else if (cat.id === 'tutor') setFilterTab('tutor');
              }}
            >
              <View style={[s.catIconWrap, { backgroundColor: cat.bg }]}>
                <Ionicons name={cat.icon as any} size={24} color={cat.color} />
              </View>
              <Text style={s.catLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Available count bar ── */}
      <TouchableOpacity style={s.countBar} activeOpacity={0.85}>
        <View style={s.avatarStack}>
          {AVATAR_URLS.map((uri, i) => (
            <Image key={i} source={{ uri }} style={[s.stackAvatar, { marginLeft: i === 0 ? 0 : -10, zIndex: 3 - i }]} />
          ))}
        </View>
        <Text style={s.countText}>{t.homeNew.countBarText}</Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.accent} />
      </TouchableOpacity>

      {/* ── Ad card ── */}
      <View style={s.adCard}>
        <View style={s.adBadge}><Text style={s.adBadgeText}>AD</Text></View>
        <View style={s.adContent}>
          <Text style={s.adTitle}>{t.homeNew.adTitle}</Text>
          <Text style={s.adSub}>{t.homeNew.adSub}</Text>
          <TouchableOpacity style={s.adBtn}>
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
          <TouchableOpacity>
            <Text style={s.seeAll}>{t.homeNew.seeAll}</Text>
          </TouchableOpacity>
        </View>
        {MOCK_POSTS.map((post) => (
          <TouchableOpacity key={post.id} style={s.postCard} activeOpacity={0.85}>
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

      {/* ── Filter tabs ── */}
      <View style={s.filterTabsWrap}>
        {([
          { id: 'all',    label: t.homeNew.filterAll },
          { id: 'helper', label: t.homeNew.filterHelper },
          { id: 'tutor',  label: t.homeNew.filterTutor },
        ] as { id: FilterTab; label: string }[]).map((tb) => (
          <TouchableOpacity
            key={tb.id}
            style={[s.filterTab, filterTab === tb.id && s.filterTabActive]}
            onPress={() => setFilterTab(tb.id)}
          >
            <Text style={[s.filterTabText, filterTab === tb.id && s.filterTabTextActive]}>
              {tb.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Partner list ── */}
      <View style={s.listSection}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>
            {filterTab === 'helper' ? t.homeNew.filterHelper : filterTab === 'tutor' ? t.homeNew.filterTutor : t.homeNew.allMitra}
          </Text>
          <Text style={s.sectionCount}>{filtered.length} {t.homeNew.activeCount}</Text>
        </View>
        {filtered.map((w, i) => (
          <React.Fragment key={w.id}>
            <WorkerCard
              worker={w}
              onPress={() => navigation.navigate('WorkerDetail', { workerId: w.id })}
            />
            {/* Inline ad every 3 cards */}
            {(i + 1) % 3 === 0 && i < filtered.length - 1 && (
              <View style={s.inlineAd}>
                <Text style={s.adBadgeText2}>AD</Text>
                <Text style={s.inlineAdText}>{t.homeNew.inlineAd}</Text>
              </View>
            )}
          </React.Fragment>
        ))}
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// ── Worker card ────────────────────────────────────────────────
function WorkerCard({ worker, onPress }: { worker: Worker; onPress: () => void }) {
  const { t } = useLanguageStore();
  const isHelper = worker.serviceType === 'helper';
  const accentColor = isHelper ? Colors.helperColor : Colors.tutorColor;
  const accentBg    = isHelper ? Colors.helperLight : Colors.tutorLight;
  const tags = isHelper ? (worker.skills ?? []) : (worker.subjects ?? []);

  return (
    <TouchableOpacity style={s.card} activeOpacity={0.93} onPress={onPress}>
      <View style={s.cardLeft}>
        {/* Safety badge */}
        <View style={s.safetyBadge}>
          <Ionicons name="shield-checkmark" size={10} color={Colors.accent} />
          <Text style={s.safetyText}>{t.services.insurance}</Text>
        </View>

        {/* Avatar */}
        <View style={s.avatarWrap}>
          {worker.photo ? (
            <Image source={{ uri: worker.photo }} style={s.avatar} />
          ) : (
            <View style={[s.avatar, s.avatarFallback]}>
              <Ionicons name="person" size={22} color={Colors.grayLight} />
            </View>
          )}
          <View style={[s.availDot, { backgroundColor: worker.isAvailable ? Colors.success : Colors.grayLight }]} />
        </View>
      </View>

      <View style={s.cardInfo}>
        <View style={s.nameRow}>
          <Text style={s.workerName}>{worker.name}</Text>
          {worker.isVerified && <Ionicons name="checkmark-circle" size={14} color={Colors.accent} />}
          <View style={[s.typePill, { backgroundColor: accentBg }]}>
            <Text style={[s.typePillText, { color: accentColor }]}>
              {isHelper ? t.services.art : t.services.tutor}
            </Text>
          </View>
        </View>

        <View style={s.locationRow}>
          <Ionicons name="location-outline" size={11} color={Colors.grayLight} />
          <Text style={s.locationLabel}>{worker.location}</Text>
          <Text style={s.dot}>·</Text>
          <Ionicons name="briefcase-outline" size={11} color={Colors.grayLight} />
          <Text style={s.locationLabel}>{worker.totalJobs}x</Text>
        </View>

        {/* Skill tags */}
        <View style={s.tagsRow}>
          {tags.slice(0, 3).map((tag) => (
            <View key={tag} style={s.skillTag}>
              <Text style={s.skillTagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={s.cardFooter}>
          <View style={s.ratingRow}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={s.ratingVal}>{worker.rating.toFixed(1)}</Text>
            <Text style={s.ratingCount}>({worker.totalJobs})</Text>
          </View>
          <Text style={s.price}>
            Rp {worker.pricePerHour.toLocaleString('id-ID')}<Text style={s.priceUnit}>{t.home.perHour}</Text>
          </Text>
        </View>
      </View>

      <TouchableOpacity style={s.heartBtn}>
        <Ionicons name="heart-outline" size={20} color={Colors.grayLight} />
      </TouchableOpacity>
    </TouchableOpacity>
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

  // Service tabs
  svcTabsWrap: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  svcTab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 13,
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  svcTabActive:     { borderBottomColor: Colors.accent },
  svcTabText:       { fontSize: 14, fontWeight: '500', color: Colors.grayLight },
  svcTabTextActive: { color: Colors.accent, fontWeight: '700' },

  // Category grid
  catSection: {
    backgroundColor: Colors.white, marginTop: 8,
    paddingVertical: 20, paddingHorizontal: 16,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border,
  },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  catItem: { width: '25%', alignItems: 'center', marginBottom: 16, gap: 7 },
  catIconWrap: {
    width: 54, height: 54, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  catLabel: { fontSize: 11, fontWeight: '500', color: Colors.dark, textAlign: 'center' },

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

  // Filter tabs
  filterTabsWrap: {
    flexDirection: 'row', gap: 8,
    backgroundColor: Colors.white, marginTop: 8,
    paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border,
  },
  filterTab: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.borderMid,
    backgroundColor: Colors.white,
  },
  filterTabActive:     { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterTabText:       { fontSize: 13, fontWeight: '500', color: Colors.gray },
  filterTabTextActive: { color: Colors.white, fontWeight: '700' },

  // List
  listSection: { paddingHorizontal: 16, paddingTop: 12, gap: 10 },

  // Worker card
  card: {
    flexDirection: 'row', gap: 12,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border,
    padding: 14,
    ...Shadow.sm,
  },
  cardLeft:  { alignItems: 'center', gap: 6 },
  safetyBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    backgroundColor: Colors.accentLight,
    borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2,
  },
  safetyText: { fontSize: 9, fontWeight: '700', color: Colors.accent },
  avatarWrap:   { position: 'relative' },
  avatar:       { width: 56, height: 56, borderRadius: 28 },
  avatarFallback: {
    backgroundColor: Colors.section, borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  availDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 12, height: 12, borderRadius: 6,
    borderWidth: 2, borderColor: Colors.white,
  },

  cardInfo: { flex: 1 },
  nameRow:  { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4, flexWrap: 'wrap' },
  workerName: { fontSize: 15, fontWeight: '700', color: Colors.darkMid },
  typePill:   { borderRadius: Radius.pill, paddingHorizontal: 8, paddingVertical: 2 },
  typePillText: { fontSize: 10, fontWeight: '700' },

  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6 },
  locationLabel: { fontSize: 11, color: Colors.grayLight },
  dot: { fontSize: 11, color: Colors.grayLight },

  tagsRow: { flexDirection: 'row', gap: 5, flexWrap: 'wrap', marginBottom: 8 },
  skillTag: {
    backgroundColor: Colors.section, borderRadius: 4,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  skillTagText: { fontSize: 11, color: Colors.gray },

  cardFooter:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingRow:   { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingVal:   { fontSize: 13, fontWeight: '600', color: Colors.dark },
  ratingCount: { fontSize: 11, color: Colors.grayLight },
  price:       { fontSize: 14, fontWeight: '700', color: Colors.accent },
  priceUnit:   { fontSize: 11, fontWeight: '400', color: Colors.gray },

  heartBtn: {
    width: 32, height: 32,
    alignItems: 'center', justifyContent: 'center',
  },

  // Inline ad
  inlineAd: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.section, borderRadius: Radius.md,
    paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: Colors.border,
  },
  adBadgeText2: { fontSize: 9, fontWeight: '700', color: Colors.grayLight },
  inlineAdText: { flex: 1, fontSize: 11, color: Colors.gray, lineHeight: 16 },
});
