/**
 * ReviewScreen — Linka 온도 리뷰
 * 당근온도 스타일 — 별점 대신 태그 선택으로 온도 상승/하락
 */
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Alert, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { Colors, Radius } from '../../constants/colors';
import { useLanguageStore } from '../../store/languageStore';
import { RootStackParamList } from '../../types';
import { reviewedOrderIds } from './OrdersScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'Review'>;

// ── Linka Point 변화량 설정 (100점 만점) ─────────────────────────
const POS_DELTA = 5;    // 긍정 태그 1개당 (점)
const NEG_DELTA = -8;   // 부정 태그 1개당 (점)
const TEXT_BONUS = 3;   // 성의있는 글 작성 시 (점)

// ── 리뷰 반영 스토어 (세션 내 공유) ──────────────────────────────
// 실제 서비스에서는 서버 저장, 여기서는 클라이언트 mock
export const targetTempChanges = new Map<string, number>();

// ── Linka 마스코트 (감정에 따라 표정 변화) ─────────────────────
function MascotFace({ size = 80, mood }: { size?: number; mood: 'happy' | 'neutral' | 'sad' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* head */}
      <Circle cx="50" cy="50" r="40" fill="#FFF3C0" stroke="#1a1a2e" strokeWidth="2.5" />
      {/* cheeks */}
      <Ellipse cx="30" cy="58" rx="7" ry="4" fill="#FBD0DC" />
      <Ellipse cx="70" cy="58" rx="7" ry="4" fill="#FBD0DC" />
      {/* eyes */}
      {mood === 'happy' ? (
        <>
          <Path d="M32 44 Q37 38 42 44" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
          <Path d="M58 44 Q63 38 68 44" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : mood === 'sad' ? (
        <>
          <Circle cx="37" cy="46" r="3.5" fill="#1a1a2e" />
          <Circle cx="63" cy="46" r="3.5" fill="#1a1a2e" />
          <Circle cx="38" cy="45" r="1" fill="white" />
          <Circle cx="64" cy="45" r="1" fill="white" />
        </>
      ) : (
        <>
          <Circle cx="37" cy="46" r="4" fill="#1a1a2e" />
          <Circle cx="63" cy="46" r="4" fill="#1a1a2e" />
          <Circle cx="38" cy="45" r="1.3" fill="white" />
          <Circle cx="64" cy="45" r="1.3" fill="white" />
        </>
      )}
      {/* mouth */}
      {mood === 'happy' ? (
        <Path d="M38 65 Q50 76 62 65" stroke="#1a1a2e" strokeWidth="2.5" fill="#EF4444" strokeLinecap="round" />
      ) : mood === 'sad' ? (
        <Path d="M40 70 Q50 62 60 70" stroke="#1a1a2e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : (
        <Path d="M42 67 L58 67" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" />
      )}
    </Svg>
  );
}

// ── 온도계 시각 ───────────────────────────────────────────────────
function Thermometer({ temp }: { temp: number }) {
  const pct = Math.max(0, Math.min(temp, 99)) / 99;
  const color = temp >= 70 ? '#EF4444' : temp >= 50 ? '#F59E0B' : temp >= 30 ? '#60A5FA' : '#93C5FD';
  return (
    <View style={th.wrap}>
      <View style={th.tube}>
        <View style={[th.fill, { height: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
      <View style={[th.bulb, { backgroundColor: color }]}>
        <Text style={th.bulbText}>°C</Text>
      </View>
    </View>
  );
}

const th = StyleSheet.create({
  wrap: { alignItems: 'center' },
  tube: {
    width: 16, height: 100, borderRadius: 8,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden', justifyContent: 'flex-end',
    borderWidth: 1.5, borderColor: '#E5E7EB',
  },
  fill: { width: '100%' },
  bulb: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    marginTop: -8,
    borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.08)',
  },
  bulbText: { fontSize: 11, fontWeight: '800', color: Colors.white },
});

export default function ReviewScreen({ navigation, route }: Props) {
  const { workerName, workerPhoto, orderId } = route.params;
  const { t, lang } = useLanguageStore();
  const insets      = useSafeAreaInsets();

  const POS_TAGS = [
    { id: 'friendly',      label: t.linkaTemp.tagFriendly },
    { id: 'onTime',        label: t.linkaTemp.tagOnTime },
    { id: 'clean',         label: t.linkaTemp.tagClean },
    { id: 'skilled',       label: t.linkaTemp.tagSkilled },
    { id: 'careful',       label: t.linkaTemp.tagCareful },
    { id: 'patient',       label: t.linkaTemp.tagPatient },
    { id: 'warmVibes',     label: t.linkaTemp.tagWarmVibes },
    { id: 'communicative', label: t.linkaTemp.tagCommunicative },
  ];
  const NEG_TAGS = [
    { id: 'late',       label: t.linkaTemp.tagLate },
    { id: 'rushed',     label: t.linkaTemp.tagRushed },
    { id: 'cold',       label: t.linkaTemp.tagCold },
    { id: 'unclean',    label: t.linkaTemp.tagUnclean },
    { id: 'notSkilled', label: t.linkaTemp.tagNotSkilled },
  ];

  const [positive, setPositive] = useState<string[]>([]);
  const [negative, setNegative] = useState<string[]>([]);
  const [showNeg,  setShowNeg]  = useState(false);
  const [text,     setText]     = useState('');

  // Linka Point 변화 계산 (정수 점)
  const delta = useMemo(() => {
    let d = positive.length * POS_DELTA + negative.length * NEG_DELTA;
    if (text.trim().length > 20) d += TEXT_BONUS;
    return Math.round(d);
  }, [positive, negative, text]);

  const mood: 'happy' | 'neutral' | 'sad' =
    delta > 0 ? 'happy' : delta < 0 ? 'sad' : 'neutral';

  const toggle = (id: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  };

  const submit = () => {
    if (positive.length === 0 && negative.length === 0) {
      Alert.alert(
        '',
        lang === 'ko' ? '태그를 하나 이상 선택해주세요' :
        lang === 'en' ? 'Please select at least one tag' :
        'Pilih minimal satu tag',
        [{ text: 'OK' }]
      );
      return;
    }
    reviewedOrderIds.add(orderId);
    targetTempChanges.set(orderId, delta);
    Alert.alert(
      t.linkaTemp.thanksTitle,
      `${delta >= 0 ? '+' : ''}${delta} Linka Point\n${t.linkaTemp.thanksSub}`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const tx = (ko: string, en: string, id: string) =>
    lang === 'ko' ? ko : lang === 'en' ? en : id;

  const deltaColor = delta > 0 ? Colors.accent : delta < 0 ? '#EF4444' : Colors.grayLight;
  const deltaLabel = delta >= 0 ? `+${delta}점` : `${delta}점`;

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <View>
          <Text style={s.headerTitle}>{tx('Linka Point 주기', 'Give Linka Point', 'Beri Linka Point')}</Text>
          <Text style={s.headerSub}>{tx('100점 만점으로 평가해요', 'Rate out of 100', 'Nilai dari 100')}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero: Mascot + thermometer + worker */}
        <View style={s.hero}>
          <View style={s.heroLeft}>
            <MascotFace mood={mood} size={88} />
          </View>
          <View style={s.heroCenter}>
            <Text style={s.heroGreeting}>
              {tx('어땠어요?', 'How was it?', 'Bagaimana?')}
            </Text>
            <Text style={s.heroWorker} numberOfLines={1}>{workerName}</Text>
            <View style={[s.deltaBadge, { backgroundColor: deltaColor + '22', borderColor: deltaColor + '55' }]}>
              <Ionicons
                name={delta > 0 ? 'arrow-up' : delta < 0 ? 'arrow-down' : 'remove'}
                size={12} color={deltaColor}
              />
              <Text style={[s.deltaText, { color: deltaColor }]}>{deltaLabel}</Text>
            </View>
          </View>
          <View style={s.pointCoin}>
            <Text style={s.pointCoinNum}>{delta >= 0 ? `+${delta}` : `${delta}`}</Text>
            <Text style={s.pointCoinUnit}>Linka Point</Text>
          </View>
        </View>

        {/* 긍정 태그 */}
        <View style={s.section}>
          <View style={s.sectionHeaderRow}>
            <Text style={s.sectionTitle}>
              {tx('좋았던 점', 'What was great', 'Yang baik')}
            </Text>
            <Text style={s.sectionHint}>+{POS_DELTA}점 {tx('/ 개', '/ each', '/ per')}</Text>
          </View>
          <View style={s.tagWrap}>
            {POS_TAGS.map((tag) => {
              const active = positive.includes(tag.id);
              return (
                <TouchableOpacity
                  key={tag.id}
                  style={[s.tag, active && s.tagActivePos]}
                  onPress={() => toggle(tag.id, positive, setPositive)}
                  activeOpacity={0.75}
                >
                  <Text style={[s.tagText, active && s.tagTextActive]}>{tag.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 부정 태그 (접혀있음) */}
        <View style={s.section}>
          <TouchableOpacity style={s.negToggle} onPress={() => setShowNeg(!showNeg)} activeOpacity={0.75}>
            <Ionicons name="chatbox-ellipses-outline" size={15} color={Colors.gray} />
            <Text style={s.negToggleText}>
              {tx('아쉬웠던 점도 있었어요 (선택)', 'Room for improvement (optional)', 'Ada yang kurang (opsional)')}
            </Text>
            <Ionicons name={showNeg ? 'chevron-up' : 'chevron-down'} size={14} color={Colors.gray} />
          </TouchableOpacity>
          {showNeg && (
            <>
              <Text style={s.negHint}>
                {tx('솔직한 피드백은 커뮤니티에 도움이 됩니다', 'Honest feedback helps the community', 'Feedback jujur membantu komunitas')}
              </Text>
              <View style={s.tagWrap}>
                {NEG_TAGS.map((tag) => {
                  const active = negative.includes(tag.id);
                  return (
                    <TouchableOpacity
                      key={tag.id}
                      style={[s.tag, active && s.tagActiveNeg]}
                      onPress={() => toggle(tag.id, negative, setNegative)}
                      activeOpacity={0.75}
                    >
                      <Text style={[s.tagText, active && s.tagTextActive]}>{tag.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </View>

        {/* 자유 텍스트 */}
        <View style={s.section}>
          <View style={s.sectionHeaderRow}>
            <Text style={s.sectionTitle}>{t.linkaTemp.freeTextTitle}</Text>
            {text.trim().length > 20 && (
              <View style={s.bonusBadge}>
                <Ionicons name="add" size={10} color="#16A34A" />
                <Text style={s.bonusText}>+{TEXT_BONUS}점</Text>
              </View>
            )}
          </View>
          <TextInput
            style={s.textInput}
            placeholder={t.linkaTemp.freeTextPlaceholder}
            placeholderTextColor={Colors.grayLight}
            value={text}
            onChangeText={setText}
            multiline
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={s.charCount}>{text.length}/500</Text>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[s.submitBtn, (positive.length === 0 && negative.length === 0) && s.submitBtnDisabled]}
          onPress={submit}
          activeOpacity={0.85}
        >
          <Ionicons name="star" size={16} color={Colors.white} />
          <Text style={s.submitBtnText}>{t.linkaTemp.submitReview}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },

  header: {
    paddingHorizontal: 16, paddingBottom: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  backBtn:     { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 15, fontWeight: '700', color: Colors.dark, textAlign: 'center' },
  headerSub:   { fontSize: 11, color: Colors.grayLight, textAlign: 'center', marginTop: 1 },

  scroll: { flex: 1 },

  hero: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    marginHorizontal: 20, marginTop: 20,
    paddingHorizontal: 16, paddingVertical: 16,
    backgroundColor: '#F0FBF5', borderRadius: Radius.lg,
    borderWidth: 1, borderColor: '#00C85333',
  },
  heroLeft:   { },
  heroCenter: { flex: 1, gap: 4 },
  heroGreeting: { fontSize: 12, color: '#00A846', fontWeight: '600' },
  pointCoin: { width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E7FBF0', borderWidth: 1.5, borderColor: Colors.accent },
  pointCoinNum: { fontSize: 20, fontWeight: '800', color: Colors.primaryDark },
  pointCoinUnit: { fontSize: 8, fontWeight: '700', color: Colors.accent, marginTop: 1 },
  heroWorker:   { fontSize: 18, fontWeight: '800', color: Colors.dark },
  deltaBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    alignSelf: 'flex-start', marginTop: 4,
    borderRadius: Radius.pill, borderWidth: 1,
    paddingHorizontal: 9, paddingVertical: 3,
  },
  deltaText: { fontSize: 12, fontWeight: '800' },

  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionHeaderRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.dark },
  sectionHint:  { fontSize: 11, color: Colors.grayLight, fontWeight: '600' },

  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    borderRadius: Radius.pill, borderWidth: 1.2, borderColor: Colors.borderMid,
    paddingHorizontal: 13, paddingVertical: 8,
    backgroundColor: Colors.white,
  },
  tagActivePos: { backgroundColor: '#E7FBF0', borderColor: Colors.accent },
  tagActiveNeg: { backgroundColor: '#DBEAFE', borderColor: '#60A5FA' },
  tagText:       { fontSize: 13, color: Colors.dark, fontWeight: '500' },
  tagTextActive: { fontWeight: '700' },

  negToggle: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 4, marginBottom: 4,
  },
  negToggleText: { flex: 1, fontSize: 13, color: Colors.gray, fontWeight: '600' },
  negHint: { fontSize: 11, color: Colors.grayLight, marginBottom: 10 },

  textInput: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: Colors.dark,
    backgroundColor: Colors.section,
    minHeight: 100, lineHeight: 21,
  },
  charCount: { fontSize: 11, color: Colors.grayLight, textAlign: 'right', marginTop: 4 },
  bonusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    backgroundColor: '#DCFCE7', borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  bonusText: { fontSize: 10, color: '#16A34A', fontWeight: '700' },

  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginHorizontal: 20, marginTop: 28,
    backgroundColor: Colors.accent, borderRadius: Radius.pill,
    paddingVertical: 15,
  },
  submitBtnDisabled: { backgroundColor: Colors.grayLight },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
