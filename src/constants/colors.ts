// ─────────────────────────────────────────────────────────────
//  Linka Design System
//
//  Brand accent:  #3A6FF8  — electric blue (matches splash)
//  Page bg:       #FFFFFF
//  Section bg:    #F9FAFB  (gray-50)
//  Card bg:       #FFFFFF  + border #F3F4F6 (gray-100)
//  Text 900:      #111827  primary
//  Text 800:      #1F2937  card titles
//  Text 500:      #6B7280  secondary
//  Text 400:      #9CA3AF  meta / icons default
//  Border 100:    #F3F4F6
//  Border 200:    #E5E7EB
// ─────────────────────────────────────────────────────────────

export const Colors = {
  // Page & surface
  white:      '#FFFFFF',
  background: '#FFFFFF',
  section:    '#F9FAFB',
  card:       '#FFFFFF',
  surface:    '#FFFFFF',

  // Text hierarchy
  dark:        '#111827',   // gray-900  — primary text, headings
  darkMid:     '#1F2937',   // gray-800  — card titles
  gray:        '#6B7280',   // gray-500  — secondary text
  grayLight:   '#9CA3AF',   // gray-400  — meta, icons

  // Brand accent — vivid green
  accent:      '#00C853',
  accentLight: '#E8FFF3',
  primary:     '#00C853',

  // Borders
  border:      '#F3F4F6',   // gray-100
  borderMid:   '#E5E7EB',   // gray-200

  // Utility aliases
  primaryLight: '#E8FFF3',
  primaryPale:  '#E8FFF3',
  primaryDark:  '#00A846',
  cta:          '#00C853',

  textPrimary:   '#111827',
  textSecondary: '#6B7280',
  textMuted:     '#9CA3AF',

  divider: '#F3F4F6',

  // Status
  success: '#22C55E',
  danger:  '#EF4444',
  warning: '#F59E0B',

  // Service category colors — service-specific, NOT brand
  helperColor: '#F59E0B',   // amber — 가사도우미
  helperLight: '#FFFBEB',
  tutorColor:  '#6366F1',   // indigo — 과외
  tutorLight:  '#EEF2FF',

  // Gray scale
  gray50:  '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',

  black: '#000000',
  white2: '#FFFFFF',
};

// Border radius — rounded-2xl = 16, rounded-full = 999
export const Radius = {
  xs:   6,
  sm:   8,
  md:   12,
  lg:   16,   // rounded-2xl
  xl:   20,
  pill: 999,  // rounded-full
};

// Shadows — very subtle
export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
};
