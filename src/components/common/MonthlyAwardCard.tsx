/**
 * 이 달의 헬퍼 / 드라이버 카드
 * 브랜드 컬러 — Linka 그린 기반, 헬퍼=앰버 / 드라이버=인디고
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { Colors, Radius } from '../../constants/colors';
import { MonthlyAward } from '../../types';

interface Props {
  helper: MonthlyAward;
  driver: MonthlyAward;
  onPressHelper?: () => void;
  onPressDriver?: () => void;
  lang: string;
}

const tx = (lang: string, ko: string, en: string, id: string) =>
  lang === 'ko' ? ko : lang === 'en' ? en : id;

function LaurelIcon({ size = 18, color = Colors.accent }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M6 3 Q2 9 5 14 M8 5 Q6 9 8 12 M10 8 Q9 11 11 13"
        stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"
      />
      <Path
        d="M18 3 Q22 9 19 14 M16 5 Q18 9 16 12 M14 8 Q15 11 13 13"
        stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"
      />
    </Svg>
  );
}

function WinnerAvatar({
  photo, accent, icon,
}: {
  photo?: string; accent: string; icon: string;
}) {
  return (
    <View style={av.wrap}>
      <Image source={{ uri: photo }} style={av.photo} />
      <View style={[av.crownBadge, { backgroundColor: accent }]}>
        <Ionicons name={icon as any} size={11} color={Colors.white} />
      </View>
    </View>
  );
}

const av = StyleSheet.create({
  wrap:   { width: 88, height: 88, alignItems: 'center', justifyContent: 'center' },
  photo:  { width: 66, height: 66, borderRadius: 33, borderWidth: 3, borderColor: Colors.white },
  crownBadge: {
    position: 'absolute', top: 0, right: 4,
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: Colors.white,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 3, elevation: 3,
  },
});

export default function MonthlyAwardCard({ helper, driver, onPressHelper, onPressDriver, lang }: Props) {
  const periodLabel =
    lang === 'ko' ? `${helper.period.slice(0, 4)}.${helper.period.slice(5, 7)}`
    : lang === 'en' ? new Date(helper.period + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    : `${['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'][parseInt(helper.period.slice(5, 7), 10) - 1]} ${helper.period.slice(0, 4)}`;

  return (
    <View style={s.wrap}>
      {/* Header */}
      <View style={s.topRow}>
        <LaurelIcon size={16} color={Colors.accent} />
        <View>
          <Text style={s.topTitle}>
            {tx(lang, '이 달의 MVP', "This Month's MVP", 'MVP Bulan Ini')}
          </Text>
          <Text style={s.topPeriod}>{periodLabel}</Text>
        </View>
        <LaurelIcon size={16} color={Colors.accent} />
      </View>

      {/* Two winners */}
      <View style={s.winnersRow}>
        {/* Helper */}
        <TouchableOpacity style={s.winnerCol} onPress={onPressHelper} activeOpacity={0.82}>
          <WinnerAvatar photo={helper.winnerPhoto} accent={Colors.helperColor} icon="home" />
          <Text style={[s.roleTag, { color: Colors.helperColor }]}>
            {tx(lang, '이 달의 헬퍼', 'Helper', 'Helper')}
          </Text>
          <Text style={s.winnerName} numberOfLines={1}>{helper.winnerName}</Text>
          <View style={[s.tempChip, { backgroundColor: Colors.accentLight, borderColor: Colors.accent + '30' }]}>
            <Ionicons name="thermometer" size={10} color={Colors.accent} />
            <Text style={[s.tempNum, { color: Colors.accent }]}>{helper.temperature.toFixed(1)}</Text>
            <Text style={[s.tempUnit, { color: Colors.accent }]}>°C</Text>
          </View>
          {helper.reason && (
            <Text style={s.reason} numberOfLines={2}>{helper.reason}</Text>
          )}
        </TouchableOpacity>

        <View style={s.vDivider} />

        {/* Rising helper */}
        <TouchableOpacity style={s.winnerCol} onPress={onPressDriver} activeOpacity={0.82}>
          <WinnerAvatar photo={driver.winnerPhoto} accent={Colors.helperColor} icon="ribbon" />
          <Text style={[s.roleTag, { color: Colors.helperColor }]}>
            {tx(lang, '이 달의 신인', 'Rising Star', 'Bintang Baru')}
          </Text>
          <Text style={s.winnerName} numberOfLines={1}>{driver.winnerName}</Text>
          <View style={[s.tempChip, { backgroundColor: Colors.accentLight, borderColor: Colors.accent + '30' }]}>
            <Ionicons name="thermometer" size={10} color={Colors.accent} />
            <Text style={[s.tempNum, { color: Colors.accent }]}>{driver.temperature.toFixed(1)}</Text>
            <Text style={[s.tempUnit, { color: Colors.accent }]}>°C</Text>
          </View>
          {driver.reason && (
            <Text style={s.reason} numberOfLines={2}>{driver.reason}</Text>
          )}
        </TouchableOpacity>
      </View>

    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    marginHorizontal: 16, marginTop: 12, marginBottom: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1.5, borderColor: Colors.accent + '30',
    paddingTop: 14, paddingBottom: 14,
  },
  topRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20, paddingBottom: 10,
  },
  topTitle:  { fontSize: 13, fontWeight: '800', color: Colors.dark, textAlign: 'center', letterSpacing: 0.4 },
  topPeriod: { fontSize: 10, color: Colors.accent, fontWeight: '700', textAlign: 'center', marginTop: 1 },

  winnersRow: {
    flexDirection: 'row', alignItems: 'stretch',
    paddingHorizontal: 4, paddingTop: 8, paddingBottom: 4,
  },
  winnerCol: { flex: 1, alignItems: 'center', paddingHorizontal: 8, gap: 3 },
  vDivider:  {
    width: 1, backgroundColor: Colors.border,
    marginVertical: 12,
  },

  roleTag: {
    fontSize: 10, fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  winnerName: {
    fontSize: 15, fontWeight: '800',
    color: Colors.dark,
    marginTop: 1,
  },
  tempChip: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    borderRadius: 999,
    paddingHorizontal: 9, paddingVertical: 3,
    marginTop: 4,
    borderWidth: 0.8,
  },
  tempNum:  { fontSize: 12, fontWeight: '800' },
  tempUnit: { fontSize: 9, fontWeight: '700', marginLeft: -1 },
  reason: {
    fontSize: 10, color: Colors.grayLight, textAlign: 'center',
    marginTop: 6, lineHeight: 14,
    paddingHorizontal: 4,
  },

});

/**
 * 프로필에 붙는 작은 MVP 뱃지 — 브랜드 그린
 */
export function MvpMiniBadge({ role }: { role: 'helper' | 'driver' }) {
  return (
    <View style={mb.wrap}>
      <Ionicons name="trophy" size={9} color={Colors.accent} />
      <Text style={mb.text}>MVP</Text>
    </View>
  );
}

const mb = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.accentLight,
    borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
    borderWidth: 1, borderColor: Colors.accent + '40',
  },
  text: { fontSize: 9, fontWeight: '800', color: Colors.accent, letterSpacing: 0.4 },
});
