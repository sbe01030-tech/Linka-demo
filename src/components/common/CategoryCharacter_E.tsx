/**
 * CategoryCharacter — Version E
 * Solid flat style — filled silhouettes, no outlines, no faces
 * Soft charcoal (#4A4A4A) + mint accent (#5ECFCA)
 * Korean fintech style (Toss / Karrot)
 */
import React from 'react';
import Svg, { Path, Circle, G, Rect, Polygon } from 'react-native-svg';

export type CatCharKey =
  | 'helper' | 'cooking' | 'cleaning' | 'custom'
  | 'tutor'  | 'homevisit' | 'english' | 'more';

const C = '#4A4A4A';   // charcoal
const M = '#00C853';   // brand green
const ML = '#E8FFF3';  // brand green light

// ── 1. 가사도우미 — Apron ─────────────────────────────────────
function HelperIcon() {
  return (
    <G>
      {/* Bib top with neck loop */}
      <Path
        fill={C}
        d="M9 2 Q12 0.5 15 2 L17 6 H7 Z"
      />
      {/* Neck loop gap (white cutout) */}
      <Path
        fill="white"
        d="M10.5 2.5 Q12 1.5 13.5 2.5 L14.5 5 H9.5 Z"
      />
      {/* Main apron body */}
      <Path
        fill={C}
        d="M5 6 H19 L18 21 Q17.5 22.5 12 22.5 Q6.5 22.5 6 21 Z"
      />
      {/* Waist tie left */}
      <Rect x={2} y={12} width={4} height={2.5} rx={1.2} fill={M} />
      {/* Waist tie right */}
      <Rect x={18} y={12} width={4} height={2.5} rx={1.2} fill={M} />
      {/* Pocket */}
      <Rect x={9} y={16} width={6} height={4.5} rx={1.5} fill={M} />
    </G>
  );
}

// ── 2. 요리 — Frying pan ──────────────────────────────────────
function CookingIcon() {
  return (
    <G>
      {/* Pan body */}
      <Circle cx={10} cy={14} r={7.5} fill={C} />
      {/* Handle */}
      <Rect x={17} y={12.5} width={6} height={3} rx={1.5} fill={C} />
      {/* Pan inner shine */}
      <Circle cx={8} cy={12} r={2.5} fill={ML} />
      {/* Steam puffs */}
      <Circle cx={8}  cy={4.5} r={1.8} fill={M} />
      <Circle cx={12} cy={3}   r={1.8} fill={M} />
      <Circle cx={10} cy={5.5} r={1.4} fill={M} />
    </G>
  );
}

// ── 3. 청소 — Vacuum cleaner ──────────────────────────────────
function CleaningIcon() {
  return (
    <G>
      {/* Main body */}
      <Rect x={1} y={9} width={15} height={8} rx={4} fill={C} />
      {/* Hose */}
      <Path
        fill="none"
        stroke={C}
        strokeWidth={3}
        strokeLinecap="round"
        d="M16 13 Q20 13 21 15.5 L23 17.5"
      />
      {/* Nozzle tip */}
      <Rect x={21} y={16} width={3} height={3} rx={1} fill={C} />
      {/* Left wheel */}
      <Circle cx={5} cy={17} r={2} fill={M} />
      {/* Right wheel */}
      <Circle cx={11} cy={17} r={2} fill={M} />
      {/* Vent lines on body */}
      <Rect x={4} y={11.5} width={7} height={1.2} rx={0.6} fill={ML} />
      <Rect x={4} y={13.5} width={5} height={1.2} rx={0.6} fill={ML} />
    </G>
  );
}

// ── 4. 맞춤 — Toolbox ─────────────────────────────────────────
function CustomIcon() {
  return (
    <G>
      {/* Box body */}
      <Rect x={2} y={11} width={20} height={11} rx={2.5} fill={C} />
      {/* Handle */}
      <Path
        fill="none"
        stroke={C}
        strokeWidth={2.5}
        strokeLinecap="round"
        d="M8.5 11 V8.5 Q8.5 6.5 12 6.5 Q15.5 6.5 15.5 8.5 V11"
      />
      {/* Lid stripe */}
      <Rect x={2} y={14.5} width={20} height={2} rx={0} fill={M} />
      {/* Clasp */}
      <Rect x={10.5} y={13} width={3} height={4} rx={1} fill={ML} />
    </G>
  );
}

// ── 5. 과외 — Graduation cap ──────────────────────────────────
function TutorIcon() {
  return (
    <G>
      {/* Cap board */}
      <Polygon points="12,6 23,11 12,16 1,11" fill={C} />
      {/* Center button */}
      <Circle cx={12} cy={11} r={2} fill={M} />
      {/* Cap body below board */}
      <Path
        fill={C}
        d="M6 13 V17 Q6 21 12 21 Q18 21 18 17 V13 L12 16 Z"
      />
      {/* Tassel string */}
      <Rect x={21.2} y={11} width={1.6} height={5} rx={0.8} fill={M} />
      {/* Tassel ball */}
      <Circle cx={22} cy={17} r={2} fill={M} />
    </G>
  );
}

// ── 6. 방문서비스 — House ─────────────────────────────────────
function HomeVisitIcon() {
  return (
    <G>
      {/* Roof */}
      <Polygon points="12,3 23,12 1,12" fill={C} />
      {/* Body */}
      <Rect x={3.5} y={12} width={17} height={10} rx={1} fill={C} />
      {/* Door */}
      <Rect x={8.5} y={15} width={7} height={7} rx={1.5} fill={M} />
      {/* Doorknob */}
      <Circle cx={14.5} cy={18.5} r={0.8} fill={C} />
      {/* Window */}
      <Rect x={5} y={14} width={3} height={3} rx={0.8} fill={ML} />
    </G>
  );
}

// ── 7. 영어 — Letter A ────────────────────────────────────────
function EnglishIcon() {
  return (
    <G>
      {/* Rounded square background */}
      <Rect x={2} y={2} width={20} height={20} rx={5} fill={C} />
      {/* Bold A left stroke */}
      <Path
        fill={M}
        d="M8 18 L11.5 6 L12.5 6 L16 18 H14 L13 15 H11 L10 18 Z"
      />
      {/* A crossbar */}
      <Rect x={10.2} y={12.5} width={3.6} height={1.8} rx={0.5} fill={C} />
    </G>
  );
}

// ── 8. 더보기 — 4-dot grid ────────────────────────────────────
function MoreIcon() {
  return (
    <G>
      {/* Top-left */}
      <Rect x={3}  y={3}  width={8} height={8} rx={2.5} fill={C} />
      {/* Top-right */}
      <Rect x={13} y={3}  width={8} height={8} rx={2.5} fill={M} />
      {/* Bottom-left */}
      <Rect x={3}  y={13} width={8} height={8} rx={2.5} fill={M} />
      {/* Bottom-right */}
      <Rect x={13} y={13} width={8} height={8} rx={2.5} fill={C} />
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
  size = 52,
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
