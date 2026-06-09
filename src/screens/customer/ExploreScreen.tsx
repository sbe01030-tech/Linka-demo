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
