/**
 * CategoryCharacter — Version C
 * Minimal thin-line icons, 1.5px stroke, #333333
 * No background. Korean startup style (Soomgo / Karrot).
 */
import React from 'react';
import Svg, { Path, Circle, G, Rect, Line } from 'react-native-svg';

export type CatCharKey =
  | 'helper' | 'cooking' | 'cleaning' | 'custom'
  | 'tutor'  | 'homevisit' | 'english' | 'more';

const STROKE = '#333333';
const SW = 1.5;

const BASE = {
  fill: 'none' as const,
  stroke: STROKE,
  strokeWidth: SW,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

// ── 1. 가사도우미 — person + broom ─────────────────────────────
function HelperIcon() {
  return (
    <G {...BASE}>
      {/* Head */}
      <Circle cx="12" cy="7" r="3" />
      {/* Body */}
      <Path d="M6 21v-2a4 4 0 014-4h2" />
      {/* Broom handle */}
      <Path d="M16 13l4-4" />
      {/* Broom head */}
      <Path d="M17.5 17.5l-4-4 1.5-1.5 4 4z" />
      <Path d="M14.5 16.5l2.5 2.5" />
    </G>
  );
}

// ── 2. 요리 — chef hat ─────────────────────────────────────────
function CookingIcon() {
  return (
    <G {...BASE}>
      {/* Hat top dome */}
      <Path d="M9 15V12C9 9.5 7 8 7 5.5A5 5 0 0117 5.5C17 8 15 9.5 15 12v3" />
      {/* Hat brim */}
      <Path d="M7 15h10" />
      <Path d="M8 18h8" />
      {/* Brim bottom */}
      <Path d="M9 18v1a1 1 0 001 1h4a1 1 0 001-1v-1" />
    </G>
  );
}

// ── 3. 청소 — house + broom ────────────────────────────────────
function CleaningIcon() {
  return (
    <G {...BASE}>
      {/* House */}
      <Path d="M3 11L12 4l9 7" />
      <Path d="M5 11v9h5v-5h4v5h5v-9" />
      {/* Broom inside */}
      <Path d="M13 16l3-3" />
      <Path d="M14.5 19l-2-2.5 1-1 2.5 2z" />
    </G>
  );
}

// ── 4. 맞춤 — scissors ────────────────────────────────────────
function CustomIcon() {
  return (
    <G {...BASE}>
      {/* Scissors blades */}
      <Path d="M20 4L8.12 15.88" />
      <Path d="M14.47 14.48L20 20" />
      <Path d="M8.12 8.12L12 12" />
      {/* Circle handles */}
      <Circle cx="5.5" cy="6.5" r="2.5" />
      <Circle cx="5.5" cy="17.5" r="2.5" />
    </G>
  );
}

// ── 5. 과외 — graduation cap ──────────────────────────────────
function TutorIcon() {
  return (
    <G {...BASE}>
      {/* Cap top */}
      <Path d="M2 10l10-5 10 5-10 5z" />
      {/* Cap sides */}
      <Path d="M6 12.5V17c0 1.66 2.69 3 6 3s6-1.34 6-3v-4.5" />
      {/* Tassel string */}
      <Line x1="20" y1="10" x2="20" y2="14" />
      <Path d="M19 14l1 2 1-2" />
    </G>
  );
}

// ── 6. 방문서비스 — medical bag ────────────────────────────────
function HomeVisitIcon() {
  return (
    <G {...BASE}>
      {/* Bag body */}
      <Rect x="3" y="8" width="18" height="14" rx="2" />
      {/* Handle */}
      <Path d="M9 8V6a3 3 0 016 0v2" />
      {/* Cross */}
      <Line x1="12" y1="12" x2="12" y2="17" />
      <Line x1="9.5" y1="14.5" x2="14.5" y2="14.5" />
    </G>
  );
}

// ── 7. 영어 — speech bubble + A ──────────────────────────────
function EnglishIcon() {
  return (
    <G {...BASE}>
      {/* Bubble */}
      <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      {/* Letter A */}
      <Path d="M9 13l3-6 3 6" strokeWidth={1.4} />
      <Path d="M10.2 11h3.6" strokeWidth={1.4} />
    </G>
  );
}

// ── 8. 더보기 — 3×3 grid ─────────────────────────────────────
function MoreIcon() {
  return (
    <G fill={STROKE} stroke="none">
      <Circle cx="5"  cy="5"  r="1.5" />
      <Circle cx="12" cy="5"  r="1.5" />
      <Circle cx="19" cy="5"  r="1.5" />
      <Circle cx="5"  cy="12" r="1.5" />
      <Circle cx="12" cy="12" r="1.5" />
      <Circle cx="19" cy="12" r="1.5" />
      <Circle cx="5"  cy="19" r="1.5" />
      <Circle cx="12" cy="19" r="1.5" />
      <Circle cx="19" cy="19" r="1.5" />
    </G>
  );
}

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
  size = 64,
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
