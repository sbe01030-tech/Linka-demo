import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions, Pressable,
} from 'react-native';
import Svg, { Line, Rect, Circle, Ellipse, Path } from 'react-native-svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useAuthStore } from '../../store/authStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const { width: W, height: H } = Dimensions.get('window');
// Scale from design canvas (390 × 844) to actual screen
const sx = W / 390;
const sy = H / 844;

const BRAND = '#00C853';

// Network nodes — position in 390×844 canvas
const NODES = [
  { id: 1, cx: 460, cy: -80,  r: 220, delay: 0,   opacity: 0.70 },
  { id: 2, cx: -40, cy: 790,  r: 140, delay: 100,  opacity: 0.78 },
  { id: 3, cx: -10, cy: 310,  r: 96,  delay: 200,  opacity: 0.70 },
  { id: 4, cx: 360, cy: 640,  r: 72,  delay: 280,  opacity: 0.82 },
  { id: 5, cx: 148, cy: 148,  r: 42,  delay: 350,  opacity: 0.74 },
  { id: 6, cx: 352, cy: 240,  r: 32,  delay: 400,  opacity: 0.55 },
  { id: 7, cx: 90,  cy: 658,  r: 16,  delay: 450,  opacity: 0.60 },
];

// Network edges connecting nodes
const EDGES = [
  { id: 'e1', x1: 460, y1: -30,  x2: 148, y2: 148,  delay: 550 },
  { id: 'e2', x1: 148, y1: 148,  x2: -10, y2: 310,  delay: 620 },
  { id: 'e3', x1: 148, y1: 148,  x2: 352, y2: 240,  delay: 670 },
  { id: 'e4', x1: -10, y1: 310,  x2: -40, y2: 760,  delay: 720 },
  { id: 'e5', x1: 352, y1: 240,  x2: 360, y2: 640,  delay: 770 },
  { id: 'e6', x1: 360, y1: 640,  x2: -40, y2: 760,  delay: 820 },
  { id: 'e7', x1: 90,  y1: 658,  x2: 360, y2: 640,  delay: 860 },
  { id: 'e8', x1: -10, y1: 310,  x2: 90,  y2: 658,  delay: 900 },
  { id: 'e9', x1: 90,  y1: 658,  x2: -40, y2: 760,  delay: 940 },
];

// Animated SVG Line
const AnimatedLine = Animated.createAnimatedComponent(Line);

export default function SplashScreen({ navigation }: Props) {
  // 데모: 자동 전환 없음. 화면 터치 시 Welcome(워커/유저로 시작) 페이지로 이동
  const enter = () => navigation.navigate('Welcome');

  // Per-node animated values
  const nodeScales   = useRef(NODES.map(() => new Animated.Value(0))).current;
  const nodeOpacity  = useRef(NODES.map(() => new Animated.Value(0))).current;
  // Per-edge animated values
  const edgeOpacity  = useRef(EDGES.map(() => new Animated.Value(0))).current;
  // Logo text
  const charOpacity  = useRef(new Animated.Value(0)).current;
  const charY        = useRef(new Animated.Value(20)).current;
  const textOpacity  = useRef(new Animated.Value(0)).current;
  const textY        = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    // Animate each node with a spring
    NODES.forEach((node, i) => {
      const delay = node.delay;
      Animated.parallel([
        Animated.spring(nodeScales[i], {
          toValue: 1, delay,
          speed: 8, bounciness: 14,
          useNativeDriver: true,
        }),
        Animated.timing(nodeOpacity[i], {
          toValue: 1, delay,
          duration: 400, useNativeDriver: true,
        }),
      ]).start();
    });

    // Animate each edge
    EDGES.forEach((edge, i) => {
      Animated.timing(edgeOpacity[i], {
        toValue: 0.30, delay: edge.delay,
        duration: 500, useNativeDriver: true,
      }).start();
    });

    // Character slides up
    Animated.parallel([
      Animated.timing(charOpacity, { toValue: 1, delay: 600, duration: 700, useNativeDriver: true }),
      Animated.timing(charY,       { toValue: 0, delay: 600, duration: 700, useNativeDriver: true }),
    ]).start();

    // Text slides up after nodes appear
    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1, delay: 1000,
        duration: 600, useNativeDriver: true,
      }),
      Animated.timing(textY, {
        toValue: 0, delay: 1000,
        duration: 600, useNativeDriver: true,
      }),
    ]).start();

    // 데모: 자동 전환 타이머 없음 — 애니메이션만 재생 후 정지 상태 유지
    return () => {
      // 언마운트 시 진행 중인 native 애니메이션 노드 정리 (Android 크래시 방지)
      nodeScales.forEach((v) => v.stopAnimation());
      nodeOpacity.forEach((v) => v.stopAnimation());
      edgeOpacity.forEach((v) => v.stopAnimation());
      charOpacity.stopAnimation();
      charY.stopAnimation();
      textOpacity.stopAnimation();
      textY.stopAnimation();
    };
  }, []);

  return (
    <Pressable style={s.root} onPress={enter}>

      {/* ── White circle nodes ── */}
      {NODES.map((node, i) => {
        const diameter = node.r * 2 * sx;
        return (
          <Animated.View
            key={node.id}
            style={[
              s.circle,
              {
                width:           diameter,
                height:          diameter,
                borderRadius:    node.r * sx,
                left:            node.cx * sx - node.r * sx,
                top:             node.cy * sy - node.r * sy,
                backgroundColor: `rgba(255,255,255,${node.opacity})`,
                opacity:         nodeOpacity[i],
                transform:       [{ scale: nodeScales[i] }],
              },
            ]}
          />
        );
      })}

      {/* ── SVG edge lines (white, low opacity) ── */}
      <Svg
        style={StyleSheet.absoluteFillObject}
        viewBox="0 0 390 844"
        preserveAspectRatio="xMidYMid slice"
      >
        {EDGES.map((edge, i) => (
          <AnimatedLine
            key={edge.id}
            x1={edge.x1} y1={edge.y1}
            x2={edge.x2} y2={edge.y2}
            stroke="white"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity={edgeOpacity[i]}
          />
        ))}
      </Svg>

      {/* ── Character ── */}
      <Animated.View style={{ opacity: charOpacity, transform: [{ translateY: charY }] }}>
        <Svg width={160 * sx} height={160 * sx} viewBox="0 0 160 160">
          <Rect x="46" y="100" width="68" height="50" rx="24" fill="white" />
          <Circle cx="80" cy="74" r="50" fill="white" />
          <Circle cx="64" cy="72" r="10" fill="#1a1a2e" />
          <Circle cx="96" cy="72" r="10" fill="#1a1a2e" />
          <Circle cx="69" cy="67" r="4"  fill="white" />
          <Circle cx="101" cy="67" r="4" fill="white" />
          <Ellipse cx="50"  cy="87" rx="12" ry="7" fill="#FFB3C6" fillOpacity="0.5" />
          <Ellipse cx="110" cy="87" rx="12" ry="7" fill="#FFB3C6" fillOpacity="0.5" />
          <Path d="M67,92 Q80,104 93,92" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" fill="none" />
          <Circle cx="72" cy="132" r="5" fill="#A8BEFC" />
          <Circle cx="88" cy="132" r="5" fill="#A8BEFC" />
          <Line x1="77" y1="132" x2="83" y2="132" stroke="#A8BEFC" strokeWidth="2.5" />
        </Svg>
      </Animated.View>

      {/* ── Logo + tagline ── */}
      <Animated.View
        style={[
          s.textWrap,
          { opacity: textOpacity, transform: [{ translateY: textY }] },
        ]}
      >
        <Text style={s.logo}>Linka</Text>
        <Text style={s.taglineRow}>Links Make Life</Text>
      </Animated.View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BRAND,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },

  circle: {
    position: 'absolute',
  },

  textWrap: {
    alignItems: 'center',
    gap: 0,
  },

  logo: {
    fontFamily:    'Nunito_900Black',
    fontSize:       72,
    color:         '#FFFFFF',
    letterSpacing: -0.5,
    includeFontPadding: false,
  },

  taglineRow: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize:    15,
    color:      'rgba(255,255,255,0.65)',
    marginTop:  -14,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
});
