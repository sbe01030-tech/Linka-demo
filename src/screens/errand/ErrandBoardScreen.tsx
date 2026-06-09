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
import { useErrandStore, CATEGORY_META, payLabel, errandTitle } from '../../store/errandStore';
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
                <Text style={s.recoItemTitle} numberOfLines={1}>{errandTitle(post, lang)}</Text>
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
        <Text style={s.cardTitle} numberOfLines={2}>{errandTitle(post, lang)}</Text>

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
