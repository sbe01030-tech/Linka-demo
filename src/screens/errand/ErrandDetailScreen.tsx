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
