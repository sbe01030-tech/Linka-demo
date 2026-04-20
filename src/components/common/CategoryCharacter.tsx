import React from 'react';
import Svg, {
  Circle, Rect, Path, Ellipse, Line, G, Text as ST,
} from 'react-native-svg';

export type CatCharKey =
  | 'helper' | 'cooking' | 'cleaning' | 'custom'
  | 'tutor'  | 'homevisit' | 'english' | 'more';

const W      = '#FFFFFF';
const EYE    = '#2A2D3E';
const BLUSH  = '#FFB3C6';
const BOW_L  = '#93C5F8';   // bow-tie wings
const BOW_C  = '#5BA8F5';   // bow-tie knot

// ── Base character  (60 × 60 viewBox) ────────────────────────────
// Soft blob body — rounded rect that fills most of the frame
// Large eyes · pink blush · gentle smile · blue bow-tie
function Base({ children }: { children?: React.ReactNode }) {
  return (
    <G>
      {/* Body blob */}
      <Rect x={4} y={3} width={52} height={54} rx={22} fill={W} />

      {/* Eyes */}
      <Circle cx={21} cy={22} r={8}   fill={EYE} />
      <Circle cx={39} cy={22} r={8}   fill={EYE} />
      {/* Eye shine (upper-left of each eye) */}
      <Circle cx={18} cy={19} r={3}   fill={W} />
      <Circle cx={36} cy={19} r={3}   fill={W} />

      {/* Blush */}
      <Ellipse cx={10} cy={30} rx={6.5} ry={4}  fill={BLUSH} fillOpacity={0.65} />
      <Ellipse cx={50} cy={30} rx={6.5} ry={4}  fill={BLUSH} fillOpacity={0.65} />

      {/* Smile */}
      <Path d="M18,35 Q30,44 42,35" stroke={EYE} strokeWidth={2.2} strokeLinecap="round" fill="none" />

      {/* Bow-tie */}
      <Ellipse cx={23} cy={47} rx={10} ry={6}  fill={BOW_L} />
      <Ellipse cx={37} cy={47} rx={10} ry={6}  fill={BOW_L} />
      <Circle  cx={30} cy={47} r={4.8}          fill={BOW_C} />

      {children}
    </G>
  );
}

// ── 1. 가사도우미 — clipboard + broom ────────────────────────────
function HelperChar() {
  return (
    <Base>
      {/* Clipboard */}
      <Rect x={18} y={49} width={20} height={16} rx={3} fill="#F5E6C0" />
      <Rect x={24} y={47} width={8}  height={4}  rx={2} fill="#F0A050" />
      {/* Broom handle */}
      <Line x1={54} y1={26} x2={54} y2={54} stroke="#8B6228" strokeWidth={4.5} strokeLinecap="round" />
      {/* Broom head */}
      <Rect x={48} y={51} width={12} height={7} rx={2.5} fill="#D4A020" />
    </Base>
  );
}

// ── 2. 요리 — chef-hat brim + ladle ─────────────────────────────
function CookingChar() {
  return (
    <Base>
      {/* Chef hat brim across top of head */}
      <Rect x={11} y={5} width={38} height={7} rx={3.5} fill="#D8D8D8" />
      {/* Ladle handle (right) */}
      <Line x1={55} y1={34} x2={55} y2={54} stroke="#8B6228" strokeWidth={4.5} strokeLinecap="round" />
      {/* Ladle bowl */}
      <Circle cx={55} cy={28} r={7.5} fill="#C8C8C8" />
      <Circle cx={55} cy={28} r={5.5} fill="#DEDEDE" />
    </Base>
  );
}

// ── 3. 청소 — green bubbles + sponge ────────────────────────────
function CleaningChar() {
  return (
    <Base>
      {/* Green spray bubbles */}
      <Circle cx={22} cy={4}  r={3.5} fill="#3ECC7E" />
      <Circle cx={42} cy={3}  r={2.5} fill="#3ECC7E" />
      <Circle cx={12} cy={10} r={5}   fill="#3ECC7E" />
      <Circle cx={50} cy={9}  r={4}   fill="#3ECC7E" />
      {/* Sponge (bottom-right) */}
      <Rect x={43} y={47} width={16} height={12} rx={3} fill="#F5DD68" />
      <Rect x={45} y={49} width={2.5} height={8} rx={1} fill="#E0C030" />
      <Rect x={49} y={49} width={2.5} height={8} rx={1} fill="#E0C030" />
      <Rect x={53} y={49} width={2.5} height={8} rx={1} fill="#E0C030" />
    </Base>
  );
}

// ── 4. 맞춤 — purple pin + linked rings ─────────────────────────
function CustomChar() {
  return (
    <Base>
      {/* Purple dotted pin (left) */}
      <Rect x={5}  y={22} width={5} height={5} rx={1.5} fill="#9B7BE8" />
      <Rect x={5}  y={30} width={5} height={5} rx={1.5} fill="#9B7BE8" />
      <Rect x={5}  y={38} width={5} height={5} rx={1.5} fill="#9B7BE8" />
      <Circle cx={7.5} cy={50} r={5.5} fill="#9B7BE8" />
      {/* Linked rings (right) */}
      <Circle cx={48} cy={42} r={7}   fill="none" stroke="#888" strokeWidth={3.5} />
      <Circle cx={55} cy={49} r={7}   fill="none" stroke="#888" strokeWidth={3.5} />
    </Base>
  );
}

// ── 5. 과외 — glasses + pencil ───────────────────────────────────
function TutorChar() {
  return (
    <Base>
      {/* Glasses rings over eyes */}
      <Circle cx={21} cy={22} r={10} fill="none" stroke={BOW_C} strokeWidth={2.5} />
      <Circle cx={39} cy={22} r={10} fill="none" stroke={BOW_C} strokeWidth={2.5} />
      {/* Bridge */}
      <Line x1={31} y1={22} x2={29} y2={22} stroke={BOW_C} strokeWidth={2.5} />
      {/* Pencil (right) */}
      <Rect x={53} y={19} width={6} height={28} rx={2} fill="#F5D03A" />
      {/* Pencil tip */}
      <Path d="M53,47 L56,55 L59,47 Z" fill="#E87050" />
    </Base>
  );
}

// ── 6. 방문 서비스 — list + briefcase ────────────────────────────
function HomeVisitChar() {
  return (
    <Base>
      {/* List/form (left) */}
      <Rect x={1} y={41} width={17} height={18} rx={2} fill={BOW_C} />
      <Rect x={3} y={44} width={13} height={2}  rx={1} fill={W} opacity={0.7} />
      <Rect x={3} y={48} width={13} height={2}  rx={1} fill={W} opacity={0.7} />
      <Rect x={3} y={52} width={13} height={2}  rx={1} fill={W} opacity={0.7} />
      <Rect x={3} y={56} width={13} height={2}  rx={1} fill={W} opacity={0.7} />
      {/* Briefcase (right) */}
      <Rect x={42} y={44} width={17} height={14} rx={3} fill="#7B3F10" />
      <Path d="M47 44 Q47 40 51 40 Q55 40 55 44" fill="none" stroke="#5A2E0A" strokeWidth={2.8} strokeLinecap="round" />
      <Circle cx={51} cy={51} r={2.5} fill="#D4A020" />
    </Base>
  );
}

// ── 7. 언어 과외 — "Hi" + "안녕" speech bubbles ─────────────────
function EnglishChar() {
  return (
    <Base>
      {/* "Hi" bubble (upper-left) */}
      <Rect x={0} y={1} width={23} height={16} rx={6} fill="#00C0D8" />
      <Path d="M7,16 L4,22 L14,16 Z" fill="#00C0D8" />
      <ST x={11.5} y={13} textAnchor="middle" fontSize={9} fontWeight="bold" fill={W}>Hi</ST>
      {/* "안녕" bubble (upper-right) */}
      <Rect x={37} y={1} width={25} height={16} rx={6} fill="#00C0D8" />
      <Path d="M46,16 L50,22 L56,16 Z" fill="#00C0D8" />
      <ST x={49.5} y={13} textAnchor="middle" fontSize={8} fontWeight="bold" fill={W}>안녕</ST>
    </Base>
  );
}

// ── 8. 더보기 — plain character ───────────────────────────────────
function MoreChar() {
  return <Base />;
}

// ── Registry ─────────────────────────────────────────────────────
const CHARS: Record<CatCharKey, () => React.JSX.Element> = {
  helper:    HelperChar,
  cooking:   CookingChar,
  cleaning:  CleaningChar,
  custom:    CustomChar,
  tutor:     TutorChar,
  homevisit: HomeVisitChar,
  english:   EnglishChar,
  more:      MoreChar,
};

export default function CategoryCharacter({
  category,
  size = 60,
}: {
  category: CatCharKey;
  size?: number;
}) {
  const Char = CHARS[category];
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <Char />
    </Svg>
  );
}
