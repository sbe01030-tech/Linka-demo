// CategoryCharacter.tsx
// Converted from design handoff — LinkaIcon.jsx (viewBox 0 0 200 200)
import React from 'react';
import Svg, {
  Circle, Rect, Path, Ellipse, G, Text as ST, Line,
} from 'react-native-svg';

export type CatCharKey =
  | 'helper' | 'cooking' | 'cleaning' | 'custom'
  | 'tutor'  | 'homevisit' | 'english' | 'more'
  | 'childcare' | 'errand';

// ── Shared base: face circle + cheeks + eyes + smile + bow-tie ────
// symbol renders BEHIND the white face circle (sticks out of head top)
function BaseFace({ symbol }: { symbol?: React.ReactNode }) {
  return (
    <G transform="translate(100, 100) scale(1.15) translate(-100, -100)">
      {/* white face circle */}
      <Circle cx={100} cy={108} r={62} fill="#FFFFFF" />
      {/* cheeks */}
      <Ellipse cx={70}  cy={108} rx={12} ry={7} fill="#FBD0DC" />
      <Ellipse cx={130} cy={108} rx={12} ry={7} fill="#FBD0DC" />
      {/* eyes */}
      <Circle cx={82}  cy={92} r={11} fill="#1E2A3A" />
      <Circle cx={118} cy={92} r={11} fill="#1E2A3A" />
      {/* eye highlights */}
      <Circle cx={85}  cy={88} r={3} fill="#E2E8F0" />
      <Circle cx={121} cy={88} r={3} fill="#E2E8F0" />
      {/* smile */}
      <Path d="M88 110 Q100 122 112 110" stroke="#1E2A3A" strokeWidth={4} fill="none" strokeLinecap="round" />
      {/* bow-tie / link mark */}
      <G transform="translate(100, 150)">
        <Ellipse cx={-8} cy={0} rx={10} ry={6.5} fill="#93C5FD" />
        <Ellipse cx={8}  cy={0} rx={10} ry={6.5} fill="#93C5FD" />
        <Circle  cx={0}  cy={0} r={3.2}           fill="#3B82F6" />
      </G>
      {/* symbol rendered last — always in front */}
      {symbol}
    </G>
  );
}

// ── 1. 가사도우미 — apron bib ─────────────────────────────────────
function HelperChar() {
  return (
    <BaseFace
      symbol={
        <G transform="translate(100, 32)">
          <Path d="M-22 -8 L22 -8 L18 28 L-18 28 Z"
                fill="#FBBF24" stroke="#1E2A3A" strokeWidth={2.5} strokeLinejoin="round" />
          <Rect x={-8} y={8} width={16} height={10} rx={2}
                fill="#FFFFFF" stroke="#1E2A3A" strokeWidth={2} />
          <Path d="M-12 -8 C -10 -18 10 -18 12 -8"
                fill="none" stroke="#1E2A3A" strokeWidth={2.5} strokeLinecap="round" />
        </G>
      }
    />
  );
}

// ── 2. 요리 — chef hat ────────────────────────────────────────────
function CookingChar() {
  return (
    <BaseFace
      symbol={
        <G transform="translate(100, 40)">
          <Rect x={-24} y={12} width={48} height={10} rx={2}
                fill="#FFFFFF" stroke="#1E2A3A" strokeWidth={2.5} />
          <Path d="M-26 12 C -34 12 -34 -10 -22 -8 C -22 -22 -8 -22 -4 -14 C 0 -22 14 -20 14 -6 C 26 -10 30 12 22 12 Z"
                fill="#FFFFFF" stroke="#1E2A3A" strokeWidth={2.5} strokeLinejoin="round" />
        </G>
      }
    />
  );
}

// ── 3. 청소 — broom ───────────────────────────────────────────────
function CleaningChar() {
  return (
    <BaseFace
      symbol={
        <G transform="translate(100, 22)">
          <G transform="rotate(-15)">
            <Rect x={-2.5} y={-8} width={5} height={36} rx={2} fill="#8B5A3C" />
            <Path d="M-18 22 L18 22 L14 40 L-14 40 Z"
                  fill="#10B981" stroke="#1E2A3A" strokeWidth={2.2} strokeLinejoin="round" />
            <Path d="M-10 26 L-10 40 M0 26 L0 40 M10 26 L10 40"
                  stroke="#1E2A3A" strokeWidth={1.5} strokeLinecap="round" />
          </G>
        </G>
      }
    />
  );
}

// ── 4. 맞춤 — checklist clipboard ────────────────────────────────
function CustomChar() {
  return (
    <BaseFace
      symbol={
        <G transform="translate(100, 30)">
          <Rect x={-18} y={-4} width={36} height={30} rx={3}
                fill="#FFFFFF" stroke="#1E2A3A" strokeWidth={2.5} />
          <Rect x={-8} y={-10} width={16} height={8} rx={2}
                fill="#A78BFA" stroke="#1E2A3A" strokeWidth={2} />
          {/* checkmarks */}
          <Path d="M-12 5 l3 3 l6 -6"
                stroke="#A78BFA" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M-12 15 l3 3 l6 -6"
                stroke="#A78BFA" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {/* lines */}
          <Line x1={-1} y1={7}  x2={12} y2={7}  stroke="#CBD5E1" strokeWidth={2} strokeLinecap="round" />
          <Line x1={-1} y1={17} x2={10} y2={17} stroke="#CBD5E1" strokeWidth={2} strokeLinecap="round" />
        </G>
      }
    />
  );
}

// ── 5. 과외 — graduation cap ─────────────────────────────────────
function TutorChar() {
  return (
    <BaseFace
      symbol={
        <G transform="translate(100, 44)">
          {/* cap brim */}
          <Path d="M-24 2 L24 2 L18 12 L-18 12 Z" fill="#1E2A3A" />
          {/* mortarboard top */}
          <Path d="M-32 -4 L0 -16 L32 -4 L0 6 Z"
                fill="#60A5FA" stroke="#1E2A3A" strokeWidth={2.5} strokeLinejoin="round" />
          {/* tassel */}
          <Path d="M0 -4 L22 2 L22 10"
                stroke="#1E2A3A" strokeWidth={2} fill="none" strokeLinecap="round" />
          <Circle cx={22} cy={12} r={3} fill="#60A5FA" stroke="#1E2A3A" strokeWidth={2} />
          {/* center button */}
          <Circle cx={0} cy={-5} r={1.8} fill="#1E2A3A" />
        </G>
      }
    />
  );
}

// ── 6. 방문서비스 — house ─────────────────────────────────────────
function HomeVisitChar() {
  return (
    <BaseFace
      symbol={
        <G transform="translate(100, 40)">
          {/* roof */}
          <Path d="M-26 8 L0 -14 L26 8 Z"
                fill="#F472B6" stroke="#1E2A3A" strokeWidth={2.5} strokeLinejoin="round" />
          {/* chimney */}
          <Rect x={10} y={-8} width={6} height={10} fill="#F472B6" stroke="#1E2A3A" strokeWidth={2} />
          {/* wall hint */}
          <Rect x={-20} y={8} width={40} height={8} fill="#FFFFFF" stroke="#1E2A3A" strokeWidth={2.5} />
          {/* door */}
          <Rect x={-4} y={10} width={8} height={6} fill="#F472B6" />
        </G>
      }
    />
  );
}

// ── 7. 영어 — ABC blocks ──────────────────────────────────────────
function EnglishChar() {
  return (
    <BaseFace
      symbol={
        <G transform="translate(100, 42)">
          <Rect x={-30} y={-2} width={18} height={18} rx={3}
                fill="#2DD4BF" stroke="#1E2A3A" strokeWidth={2.2} />
          <ST x={-21} y={12} textAnchor="middle" fill="#FFFFFF" fontSize={13} fontWeight="800">A</ST>
          <Rect x={-9} y={-8} width={18} height={18} rx={3}
                fill="#FFFFFF" stroke="#1E2A3A" strokeWidth={2.2} />
          <ST x={0} y={6} textAnchor="middle" fill="#1E2A3A" fontSize={13} fontWeight="800">B</ST>
          <Rect x={12} y={-2} width={18} height={18} rx={3}
                fill="#2DD4BF" stroke="#1E2A3A" strokeWidth={2.2} />
          <ST x={21} y={12} textAnchor="middle" fill="#FFFFFF" fontSize={13} fontWeight="800">C</ST>
        </G>
      }
    />
  );
}

// ── 9. 육아도우미 — baby bottle ───────────────────────────────────
function ChildcareChar() {
  return (
    <BaseFace
      symbol={
        <G transform="translate(100, 34)">
          {/* nipple */}
          <Path d="M-5 -20 Q0 -26 5 -20 L6 -14 L-6 -14 Z"
                fill="#F9A8D4" stroke="#1E2A3A" strokeWidth={2.2} strokeLinejoin="round" />
          {/* collar ring */}
          <Rect x={-9} y={-14} width={18} height={5} rx={2}
                fill="#FFFFFF" stroke="#1E2A3A" strokeWidth={2} />
          {/* bottle body */}
          <Rect x={-13} y={-9} width={26} height={32} rx={6}
                fill="#FFFFFF" stroke="#1E2A3A" strokeWidth={2.5} />
          {/* milk fill */}
          <Rect x={-10} y={5} width={20} height={16} rx={4}
                fill="#F9A8D4" />
          {/* measure line */}
          <Line x1={-8} y1={2} x2={8} y2={2} stroke="#CBD5E1" strokeWidth={1.8} strokeLinecap="round" />
        </G>
      }
    />
  );
}

// ── 10. 심부름 — delivery box ─────────────────────────────────────
function ErrandChar() {
  return (
    <BaseFace
      symbol={
        <G transform="translate(100, 38)">
          {/* box body */}
          <Rect x={-20} y={-4} width={40} height={30} rx={3}
                fill="#FDE68A" stroke="#1E2A3A" strokeWidth={2.5} />
          {/* box lid top */}
          <Rect x={-22} y={-12} width={44} height={10} rx={3}
                fill="#FCD34D" stroke="#1E2A3A" strokeWidth={2.5} />
          {/* lid center flap line */}
          <Line x1={0} y1={-12} x2={0} y2={-2} stroke="#1E2A3A" strokeWidth={2} strokeLinecap="round" />
          {/* tape strip vertical */}
          <Rect x={-4} y={-4} width={8} height={30} rx={2}
                fill="#93C5FD" opacity={0.7} />
          {/* tape strip horizontal */}
          <Rect x={-20} y={10} width={40} height={6} rx={2}
                fill="#93C5FD" opacity={0.7} />
        </G>
      }
    />
  );
}

// ── 8. 더보기 — three dots ────────────────────────────────────────
function MoreChar() {
  return (
    <BaseFace
      symbol={
        <G transform="translate(100, 42)">
          <Circle cx={-18} cy={8} r={6} fill="#94A3B8" stroke="#1E2A3A" strokeWidth={2} />
          <Circle cx={0}   cy={8} r={6} fill="#94A3B8" stroke="#1E2A3A" strokeWidth={2} />
          <Circle cx={18}  cy={8} r={6} fill="#94A3B8" stroke="#1E2A3A" strokeWidth={2} />
        </G>
      }
    />
  );
}

// ── Registry ──────────────────────────────────────────────────────
const CHARS: Record<CatCharKey, () => React.JSX.Element> = {
  helper:     HelperChar,
  cooking:    CookingChar,
  cleaning:   CleaningChar,
  custom:     CustomChar,
  tutor:      TutorChar,
  homevisit:  HomeVisitChar,
  english:    EnglishChar,
  more:       MoreChar,
  childcare:  ChildcareChar,
  errand:     ErrandChar,
};

export default function CategoryCharacter({
  category,
  size = 64,
}: {
  category: CatCharKey;
  size?: number;
}) {
  const Char = CHARS[category];
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Char />
    </Svg>
  );
}
