/**
 * WelcomeScreen
 * 스플래시 이후 → 회원가입 유도 랜딩
 *
 * 디자인:
 *  - 흰 배경 위에 스플래시 원들을 얇은 윤곽선(stroke only)으로 배치
 *  - Nunito_900Black 로고 (스플래시 통일)
 *  - 헤드라인 + 서브텍스트 + 칩
 *  - 고객 / 헬퍼·튜터 가입 카드
 *  - 하단 로그인 링크
 */
import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions, StatusBar, Pressable,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path, Line, Rect } from 'react-native-svg';
import { Colors, Radius } from '../../constants/colors';
import { RootStackParamList } from '../../types';
import { useLanguageStore } from '../../store/languageStore';
import { useAuthStore } from '../../store/authStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const { width: W, height: H } = Dimensions.get('window');
const BRAND = Colors.accent; // #00C853


// ── 스플래시 원 → 윤곽선 only 데코 (절대 위치 SVG) ───────────────
// 스플래시 NODES 좌표계(390×844) 그대로 사용, stroke만 남김
function DecoCircles() {
  return (
    <Svg
      style={StyleSheet.absoluteFillObject}
      viewBox={`0 0 ${W} ${H}`}
      pointerEvents="none"
    >
      {/* 우상단 대형 원 (cx 460, cy -80, r 220) */}
      <Circle
        cx={490 * (W / 390)}
        cy={20 * (H / 844)}
        r={240 * (W / 390)}
        fill="none"
        stroke={BRAND}
        strokeWidth="1.2"
        opacity="0.40"
      />
      {/* 좌하단 중형 원 (cx -40, cy 790, r 168 = 140×1.2) */}
      <Circle
        cx={-40 * (W / 390)}
        cy={790 * (H / 844)}
        r={168 * (W / 390)}
        fill="none"
        stroke={BRAND}
        strokeWidth="1.2"
        opacity="0.40"
      />
      {/* 우하 소형 원 (cx 360, cy 640, r 72) */}
      <Circle
        cx={360 * (W / 390)}
        cy={640 * (H / 844)}
        r={60 * (W / 390)}
        fill="none"
        stroke={BRAND}
        strokeWidth="1"
        opacity="0.40"
      />
    </Svg>
  );
}

// ── 가입 카드 ─────────────────────────────────────────────────────
function SignupCard({
  icon, accentColor, eyebrow, headline, onPress,
}: {
  icon: any;
  accentColor: string;
  eyebrow: string;
  headline: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.80}>
      <View style={[s.cardIconWrap, { backgroundColor: accentColor + '18' }]}>
        <Ionicons name={icon} size={20} color={accentColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[s.cardEyebrow, { color: accentColor }]}>{eyebrow}</Text>
        <Text style={s.cardHeadline}>{headline}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={Colors.borderMid} />
    </TouchableOpacity>
  );
}

// ── 메인 ─────────────────────────────────────────────────────────
export default function WelcomeScreen({ navigation }: Props) {
  const { lang } = useLanguageStore();
  // 데모: 페이지 아무데나 터치 → 고객으로 로그인 → 홈
  const quickStart = useAuthStore((s) => s.quickStart);
  const enterHome = () => quickStart('customer');
  const opacity = useRef(new Animated.Value(0)).current;
  const slideY  = useRef(new Animated.Value(30)).current;

  const tx = (ko: string, en: string, id: string) =>
    lang === 'ko' ? ko : lang === 'en' ? en : id;

  const chipsLabels = [
    tx('청소', 'Cleaning', 'Bersih'),
    tx('빨래', 'Laundry', 'Cuci'),
    tx('세탁·다림질', 'Wash·Iron', 'Setrika'),
    tx('설거지', 'Dishes', 'Piring'),
  ];
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideY, { toValue: 0, speed: 14, bounciness: 4, useNativeDriver: true }),
    ]).start();
    return () => {
      // 언마운트 시 native 애니메이션 노드 정리
      opacity.stopAnimation();
      slideY.stopAnimation();
    };
  }, []);

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* 배경 데코 원 */}
      <DecoCircles />

      <Animated.View style={[s.inner, { opacity, transform: [{ translateY: slideY }] }]}>

        {/* ── 상단: 로고 ── */}
        <View style={s.logoRow}>
          <View style={s.logoMark}>
            <Text style={s.logoLetter}>L</Text>
          </View>
          <Text style={s.logoText}>Linka</Text>
        </View>

        {/* ── 히어로 텍스트 ── */}
        <View style={s.heroBlock}>
          <Text style={s.headline}>
            {tx('스트레스 받지 말고\n', 'Skip the stress\n', 'Tanpa stres\n')}
            <Text style={s.headlineBrand}>Linka!</Text>
          </Text>
          <Text style={s.subText}>
            {tx(
              'Linka하는 순간, 집안일이 사라져요.\n가장 가까운 손길을 지금 연결하세요.',
              'Linka, and the chores disappear.\nThe nearest helping hand, right now.',
              'Sekali Linka, pekerjaan rumah beres.\nBantuan terdekat, sekarang juga.'
            )}
          </Text>

          {/* 카테고리 칩 */}
          <View style={s.chipRow}>
            {chipsLabels.map((label) => (
              <View key={label} style={[s.chip, { backgroundColor: '#5AE58F', borderWidth: 0 }]}>
                <Text style={[s.chipText, { color: Colors.white }]}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── 가입 카드 ── */}
        <View style={s.cardArea}>
          <SignupCard
            icon="home-outline"
            accentColor={BRAND}
            eyebrow={tx('고객으로 시작', 'CUSTOMER', 'PELANGGAN')}
            headline={tx('집안일 끝, 내 시간 시작.',
                         'Chores done. Time’s yours.',
                         'Kerja beres, waktu jadi milikmu.')}
            onPress={() => navigation.navigate('Register', { initialRole: 'customer' })}
          />
          <SignupCard
            icon="briefcase-outline"
            accentColor="#F97316"
            eyebrow={tx('헬퍼로 시작', 'HELPER', 'HELPER')}
            headline={tx('내 시간이, 누군가의 하루가 된다.',
                         'Your hours become someone’s day.',
                         'Waktu Anda menjadi hari seseorang.')}
            onPress={() => navigation.navigate('Register', { initialRole: 'helper' })}
          />

          {/* 로그인 링크 */}
          <TouchableOpacity
            style={s.loginRow}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={s.loginText}>{tx('이미 회원이신가요? ', 'Already a member? ', 'Sudah punya akun? ')}</Text>
            <Text style={[s.loginText, s.loginLink]}>{tx('로그인', 'Log in', 'Masuk')}</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>

      {/* 데모: 화면 아무데나 터치하면 홈으로 (가입 카드 위 전체를 덮는 투명 레이어) */}
      <Pressable style={StyleSheet.absoluteFill} onPress={enterHome} />
    </View>
  );
}

// ── 스타일 ────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: H * 0.08,
    paddingBottom: 36,
  },

  // 로고
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoMark: {
    width: 23,
    height: 23,
    borderRadius: 6,
    backgroundColor: BRAND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.white,
  },
  logoText: {
    fontFamily: 'Nunito_900Black',
    fontSize: 23,
    color: Colors.dark,
    letterSpacing: -0.5,
    includeFontPadding: false,
  },

  // 히어로
  heroBlock: {
    gap: 12,
    marginTop: H * 0.07,
  },
  headline: {
    fontFamily: 'DMSans_800ExtraBold',
    fontSize: 34,
    color: Colors.dark,
    lineHeight: 48,
    letterSpacing: -1.5,
  },
  headlineAccent: {
    fontFamily: 'DMSans_800ExtraBold',
    color: BRAND,
  },
  // 로고와 동일한 폰트(Nunito_900Black)로 'Linka!' 표기
  headlineBrand: {
    fontFamily: 'Nunito_900Black',
    fontSize: 38,
    color: BRAND,
    letterSpacing: -0.5,
  },
  subText: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 22,
    fontFamily: 'DMSans_700Bold',
  },

  // 칩
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // 카드 영역
  cardArea: {
    gap: 10,
    marginTop: 26,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1.2,
    borderColor: Colors.borderMid,
    paddingHorizontal: 18,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: Colors.dark,
    marginBottom: 3,
  },
  cardAccent: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
  },
  cardSub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: Colors.grayLight,
    lineHeight: 17,
  },
  cardEyebrow: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 10,
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  cardHeadline: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: Colors.dark,
    letterSpacing: -0.3,
    lineHeight: 20,
  },

  // 로그인 링크
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
  },
  loginText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: Colors.grayLight,
  },
  loginLink: {
    color: BRAND,
    textDecorationLine: 'underline',
  },

});
