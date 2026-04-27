/**
 * CategoryCharacter — Version B
 * Faithful react-native-svg conversion of LinkaCategoryIcons.jsx
 *
 * Version A backup: CategoryCharacter_A.tsx
 */
import React from 'react';
import Svg, {
  Circle, Path, G, Defs, LinearGradient, Stop,
} from 'react-native-svg';

export type CatCharKey =
  | 'helper' | 'cooking' | 'cleaning' | 'custom'
  | 'tutor'  | 'homevisit' | 'english' | 'more';

// ── Palette — exact copy from LinkaCategoryIcons.jsx ──────────────
const PAL: Record<CatCharKey, { top: string; bot: string }> = {
  helper:    { top: '#FFE174', bot: '#F5C026' },
  cooking:   { top: '#FFA8B5', bot: '#F17188' },
  cleaning:  { top: '#7FD9A0', bot: '#3EB873' },
  custom:    { top: '#8FD0EC', bot: '#4FAFD6' },
  tutor:     { top: '#9FBCE2', bot: '#6B92C8' },
  homevisit: { top: '#F5A3B8', bot: '#E4728F' },
  english:   { top: '#7ED6C8', bot: '#3FB8A6' },
  more:      { top: '#B8C2CC', bot: '#8995A1' },
};

// ── iOS squircle path (200×200 canvas, r = 0.28 × 200 = 56) ──────
// Formula: squirclePath(s, r) from LinkaCategoryIcons.jsx
// M r,0 L s-r,0 C s-r*0.2,0 s,r*0.2 s,r  L s,s-r  C s,s-r*0.2 s-r*0.2,s s-r,s  L r,s  C r*0.2,s 0,s-r*0.2 0,s-r  L 0,r  C 0,r*0.2 r*0.2,0 r,0 Z
const SQUIRCLE =
  'M 56,0 L 144,0 ' +
  'C 188.8,0 200,11.2 200,56 ' +
  'L 200,144 ' +
  'C 200,188.8 188.8,200 144,200 ' +
  'L 56,200 ' +
  'C 11.2,200 0,188.8 0,144 ' +
  'L 0,56 ' +
  'C 0,11.2 11.2,0 56,0 Z';

// ── Symbol positioning ────────────────────────────────────────────
// Original: symbol SVG is size*0.56 of container, viewBox 0 0 24 24
// On our 200×200 canvas: target = 200*0.56 = 112, offset = (200-112)/2 = 44
// scale = 112/24 ≈ 4.667  →  strokeWidth 2 scales to ~9.3 (looks right)
const SYM_TRANSFORM = 'translate(44, 44) scale(4.667)';
const SW = 2; // stroke-width in 24×24 space (matches original)

// ── Shared base: squircle bg + centered symbol ────────────────────
function Base({ id, children }: { id: CatCharKey; children: React.ReactNode }) {
  const { top, bot } = PAL[id];
  const gId = `g_${id}`;
  return (
    <G>
      <Defs>
        {/* Vertical gradient — same direction as original (y1=0 → y2=1) */}
        <LinearGradient id={gId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={top} />
          <Stop offset="1" stopColor={bot} />
        </LinearGradient>
      </Defs>
      <Path d={SQUIRCLE} fill={`url(#${gId})`} />
      <G transform={SYM_TRANSFORM}>
        {children}
      </G>
    </G>
  );
}

// ── 1. 가사도우미 — house + heart ────────────────────────────────
function HelperChar() {
  return (
    <Base id="helper">
      <G fill="none" stroke="white" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M3.5 11L12 4l8.5 7" />
        <Path d="M5.5 10v9h13v-9" />
        {/* Heart on door */}
        <Path d="M12 17.2c-2.2-1.5-3.3-2.8-3.3-4.2 0-1.1.9-1.9 1.9-1.9.7 0 1.1.3 1.4.8.3-.5.7-.8 1.4-.8 1 0 1.9.8 1.9 1.9 0 1.4-1.1 2.7-3.3 4.2z"
          fill="white" stroke="none" />
      </G>
    </Base>
  );
}

// ── 2. 요리 — steam + pot ────────────────────────────────────────
function CookingChar() {
  return (
    <Base id="cooking">
      <G fill="none" stroke="white" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M6 14v5.5a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V14" />
        <Path d="M4.5 14a3 3 0 01-3-3 3 3 0 013-3c.3-2.3 2.1-4 4.3-4 1.3 0 2.5.6 3.3 1.5.8-.9 2-1.5 3.3-1.5 2.2 0 4 1.7 4.3 4a3 3 0 013 3 3 3 0 01-3 3H4.5z" />
        <Path d="M9 14v3M12 14v3M15 14v3" opacity={0.55} />
      </G>
    </Base>
  );
}

// ── 3. 청소 — scissors/broom ─────────────────────────────────────
function CleaningChar() {
  return (
    <Base id="cleaning">
      <G fill="none" stroke="white" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M17.5 3.5l-7 7" />
        <Path d="M14.5 10.5l-3-3" />
        <Path d="M8 12.5l3.5 3.5-4.8 4.2a1.4 1.4 0 01-2-.1l-.8-.8a1.4 1.4 0 01-.1-2L8 12.5z" />
        <Path d="M8 12.5l3.5 3.5" opacity={0.55} />
      </G>
    </Base>
  );
}

// ── 4. 맞춤 — magic wand + sparkles ──────────────────────────────
function CustomChar() {
  return (
    <Base id="custom">
      <G fill="none" stroke="white" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M15 4l-11 11 3 3 11-11z" />
        <Path d="M13 6l3 3" />
        <Path d="M19 4v3M17.5 5.5h3M19 9v2M18 10h2" opacity={0.9} />
        <Path d="M5 7v2M4 8h2" opacity={0.75} />
      </G>
    </Base>
  );
}

// ── 5. 과외 — open book ──────────────────────────────────────────
function TutorChar() {
  return (
    <Base id="tutor">
      <G fill="none" stroke="white" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v14H5.5a1.5 1.5 0 01-1.5-1.5v-11z" />
        <Path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v14h5.5a1.5 1.5 0 001.5-1.5v-11z" />
        <Path d="M7 8h2M7 11h2M15 8h2M15 11h2" opacity={0.75} />
      </G>
    </Base>
  );
}

// ── 6. 방문서비스 — house + door ─────────────────────────────────
function HomeVisitChar() {
  return (
    <Base id="homevisit">
      <G fill="none" stroke="white" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M3.5 12L12 5l8.5 7" />
        <Path d="M5.5 11v9h13v-9" />
        <Path d="M9 20v-4.5a1 1 0 011-1h4a1 1 0 011 1V20" />
        <Circle cx={12} cy={17} r={0.6} fill="white" stroke="none" />
      </G>
    </Base>
  );
}

// ── 7. 영어 — speech bubble + A ──────────────────────────────────
function EnglishChar() {
  return (
    <Base id="english">
      <G fill="none" stroke="white" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v8a2.5 2.5 0 01-2.5 2.5H11l-4 3.5V17H6.5A2.5 2.5 0 014 14.5v-8z" />
        <Path d="M9.5 13l2.5-6 2.5 6M10.5 11h3" strokeWidth={SW * 0.9} />
      </G>
    </Base>
  );
}

// ── 8. 더보기 — 3×3 dots ─────────────────────────────────────────
function MoreChar() {
  return (
    <Base id="more">
      <G fill="white" stroke="none">
        <Circle cx={6}  cy={6}  r={1.6} />
        <Circle cx={12} cy={6}  r={1.6} />
        <Circle cx={18} cy={6}  r={1.6} />
        <Circle cx={6}  cy={12} r={1.6} />
        <Circle cx={12} cy={12} r={1.6} />
        <Circle cx={18} cy={12} r={1.6} />
        <Circle cx={6}  cy={18} r={1.6} />
        <Circle cx={12} cy={18} r={1.6} />
        <Circle cx={18} cy={18} r={1.6} />
      </G>
    </Base>
  );
}

// ── Registry ──────────────────────────────────────────────────────
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
