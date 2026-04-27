/**
 * CategoryCharacter — Version D
 * Living icons: cute objects with integrated tiny faces
 * 2px stroke, rounded, color accents (mint / peach / sky blue)
 * White background, no shadows, no 3D effects
 */
import React from 'react';
import Svg, { Path, Circle, G, Rect, Line } from 'react-native-svg';

export type CatCharKey =
  | 'helper' | 'cooking' | 'cleaning' | 'custom'
  | 'tutor'  | 'homevisit' | 'english' | 'more';

const INK   = '#3D3D3D';
const MINT  = '#5ECFCA';
const PEACH = '#FFB5A7';
const SKY   = '#74B9FF';
const SW    = 2;

const BASE = {
  fill: 'none' as const,
  stroke: INK,
  strokeWidth: SW,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

// Tiny face helpers
function Eyes({ x1, y, x2 }: { x1: number; y: number; x2: number }) {
  return (
    <>
      <Circle cx={x1} cy={y} r={0.85} fill={INK} stroke="none" />
      <Circle cx={x2} cy={y} r={0.85} fill={INK} stroke="none" />
    </>
  );
}
function Smile({ cx, cy, w = 3 }: { cx: number; cy: number; w?: number }) {
  return (
    <Path
      d={`M${cx - w / 2} ${cy} Q${cx} ${cy + 1.6} ${cx + w / 2} ${cy}`}
      fill="none" stroke={INK} strokeWidth={1.5}
      strokeLinecap="round"
    />
  );
}

// ── 1. 가사도우미 — Apron with face ───────────────────────────
function HelperIcon() {
  return (
    <G>
      {/* Neck strap */}
      <Path {...BASE} d="M10 4 Q12 2.5 14 4" />
      {/* Shoulder straps */}
      <Path {...BASE} d="M10 4 L7.5 8" />
      <Path {...BASE} d="M14 4 L16.5 8" />
      {/* Apron body */}
      <Path {...BASE} d="M6 8 H18 L17 21 Q17 22 12 22 Q7 22 7 21 Z" />
      {/* Waist ties */}
      <Path fill="none" stroke={PEACH} strokeWidth={SW} strokeLinecap="round"
        d="M6 14 L3.5 13" />
      <Path fill="none" stroke={PEACH} strokeWidth={SW} strokeLinecap="round"
        d="M18 14 L20.5 13" />
      {/* Pocket */}
      <Rect x={9.5} y={16.5} width={5} height={3.5} rx={1}
        fill="none" stroke={PEACH} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* Face */}
      <Eyes x1={10} y={11} x2={14} />
      <Smile cx={12} cy={12.5} w={3.5} />
    </G>
  );
}

// ── 2. 요리 — Frying pan with face ────────────────────────────
function CookingIcon() {
  return (
    <G>
      {/* Steam */}
      <Path fill="none" stroke={MINT} strokeWidth={1.5} strokeLinecap="round"
        d="M7 5.5 Q8 4 7 2.5" />
      <Path fill="none" stroke={MINT} strokeWidth={1.5} strokeLinecap="round"
        d="M11 5.5 Q12 4 11 2.5" />
      {/* Pan body */}
      <Circle {...BASE} cx={10} cy={14} r={7} />
      {/* Handle */}
      <Path {...BASE} d="M17 14 L22 12" />
      {/* Face */}
      <Eyes x1={8} y={13} x2={12} />
      <Smile cx={10} cy={15} w={3.5} />
    </G>
  );
}

// ── 3. 청소 — Vacuum cleaner with face ────────────────────────
function CleaningIcon() {
  return (
    <G>
      {/* Body */}
      <Rect {...BASE} x={1.5} y={9} width={14} height={8} rx={4} />
      {/* Hose + nozzle */}
      <Path {...BASE} d="M15.5 13 Q19 13 20 15 L22 17" />
      {/* Suction nozzle tip */}
      <Path {...BASE} d="M21 16 L23 18 M21 18 L23 16" />
      {/* Wheels */}
      <Circle fill="none" stroke={SKY} strokeWidth={1.5} cx={5.5} cy={17} r={1.5} />
      <Circle fill="none" stroke={SKY} strokeWidth={1.5} cx={11} cy={17} r={1.5} />
      {/* Face */}
      <Eyes x1={6} y={12} x2={10} />
      <Smile cx={8} cy={13.5} w={3.5} />
    </G>
  );
}

// ── 4. 맞춤 — Toolbox with face ───────────────────────────────
function CustomIcon() {
  return (
    <G>
      {/* Box body */}
      <Rect {...BASE} x={2} y={10} width={20} height={12} rx={2} />
      {/* Handle */}
      <Path {...BASE} d="M8.5 10 V8 Q8.5 6 12 6 Q15.5 6 15.5 8 V10" />
      {/* Lid line */}
      <Line x1={2} y1={15} x2={22} y2={15}
        stroke={PEACH} strokeWidth={1.5} strokeLinecap="round" />
      {/* Latch */}
      <Rect x={10.5} y={13.5} width={3} height={3} rx={0.8}
        fill="none" stroke={PEACH} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* Face (below lid line) */}
      <Eyes x1={8} y={17.5} x2={16} />
      <Smile cx={12} cy={19} w={4} />
    </G>
  );
}

// ── 5. 과외 — Graduation cap with peeking face ────────────────
function TutorIcon() {
  return (
    <G>
      {/* Board */}
      <Path {...BASE} d="M2 11 L12 7 L22 11 L12 15 Z" />
      {/* Cap button */}
      <Circle cx={12} cy={11} r={1.2} fill={SKY} stroke="none" />
      {/* Tassel string */}
      <Line x1={21} y1={11} x2={21} y2={16}
        fill="none" stroke={SKY} strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx={21} cy={17.5} r={1.5} fill={SKY} stroke="none" />
      {/* Head peeking below */}
      <Circle {...BASE} cx={12} cy={19.5} r={3} />
      {/* Face on head */}
      <Eyes x1={10.7} y={19.2} x2={13.3} />
      <Smile cx={12} cy={20.3} w={2.2} />
    </G>
  );
}

// ── 6. 방문서비스 — House with face on door ───────────────────
function HomeVisitIcon() {
  return (
    <G>
      {/* Roof */}
      <Path {...BASE} d="M2 12 L12 4 L22 12" />
      {/* Walls */}
      <Path {...BASE} d="M4 12 V21 H20 V12" />
      {/* Door */}
      <Rect {...BASE} x={8.5} y={14} width={7} height={7} rx={1} />
      {/* Doorknob */}
      <Circle cx={14.5} cy={17.5} r={0.6} fill={INK} stroke="none" />
      {/* Face on door */}
      <Eyes x1={10.5} y={16} x2={13.5} />
      <Smile cx={12} cy={17.5} w={2.5} />
      {/* Roof accent */}
      <Path fill="none" stroke={PEACH} strokeWidth={1.5} strokeLinecap="round"
        d="M9 12 L12 9 L15 12" />
    </G>
  );
}

// ── 7. 영어 — Speech bubble with A and smile ─────────────────
function EnglishIcon() {
  return (
    <G>
      {/* Bubble */}
      <Path {...BASE}
        d="M3 4.5 Q3 3 4.5 3 H19.5 Q21 3 21 4.5 V14.5 Q21 16 19.5 16 H13 L9.5 20 V16 H4.5 Q3 16 3 14.5 Z" />
      {/* Letter A */}
      <Path fill="none" stroke={SKY} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
        d="M9.5 13.5 L12 7 L14.5 13.5" />
      <Path fill="none" stroke={SKY} strokeWidth={2} strokeLinecap="round"
        d="M10.3 11.5 H13.7" />
      {/* Smile below A */}
      <Smile cx={12} cy={14.5} w={3} />
    </G>
  );
}

// ── 8. 더보기 — 9-dot grid, center has tiny face ─────────────
function MoreIcon() {
  const pts = [
    [5, 5], [12, 5], [19, 5],
    [5, 12],          [19, 12],
    [5, 19], [12, 19], [19, 19],
  ];
  return (
    <G>
      {/* 8 outer dots */}
      {pts.map(([x, y]) => (
        <Circle key={`${x}-${y}`} cx={x} cy={y} r={1.5} fill={INK} stroke="none" />
      ))}
      {/* Center circle (face) */}
      <Circle cx={12} cy={12} r={3.5} fill="none" stroke={INK} strokeWidth={SW} />
      {/* Eyes */}
      <Eyes x1={10.7} y={11.3} x2={13.3} />
      {/* Smile */}
      <Smile cx={12} cy={12.8} w={2} />
    </G>
  );
}

// ── Registry ──────────────────────────────────────────────────
const ICONS: Record<CatCharKey, () => React.JSX.Element> = {
  helper:    HelperIcon,
  cooking:   CookingIcon,
  cleaning:  CleaningIcon,
  custom:    CustomIcon,
  tutor:     TutorIcon,
  homevisit: HomeVisitIcon,
  english:   EnglishIcon,
  more:      MoreIcon,
};

export default function CategoryCharacter({
  category,
  size = 56,
}: {
  category: CatCharKey;
  size?: number;
}) {
  const Icon = ICONS[category];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Icon />
    </Svg>
  );
}
