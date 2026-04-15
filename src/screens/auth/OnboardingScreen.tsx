import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  Dimensions, TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../constants/colors';
import { RootStackParamList } from '../../types';
import { useLanguageStore } from '../../store/languageStore';
import LanguageSelector from '../../components/common/LanguageSelector';

const { width } = Dimensions.get('window');
type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

// Each slide has its own visual identity
const SLIDE_CONFIG = [
  {
    id: '1',
    bgColor:    Colors.accent,      // orange filled circle
    iconColor:  Colors.white,
    icon:       'car' as const,
    badges:     ['Profesional', 'Berlisensi', 'GPS Tracked'],
  },
  {
    id: '2',
    bgColor:    Colors.dark,        // dark filled circle
    iconColor:  Colors.white,
    icon:       'home' as const,
    badges:     ['Memasak', 'Bersih-bersih', 'Setrika'],
  },
  {
    id: '3',
    bgColor:    Colors.accentLight, // light orange circle
    iconColor:  Colors.accent,
    icon:       'shield-checkmark' as const,
    badges:     ['KTP Verified', 'Escrow Aman', 'Rating Asli'],
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const { t } = useLanguageStore();
  const [index, setIndex] = useState(0);
  const ref = useRef<FlatList>(null);

  const slides = [
    { ...SLIDE_CONFIG[0], title: t.onboarding.slide1Title, sub: t.onboarding.slide1Sub },
    { ...SLIDE_CONFIG[1], title: t.onboarding.slide2Title, sub: t.onboarding.slide2Sub },
    { ...SLIDE_CONFIG[2], title: t.onboarding.slide3Title, sub: t.onboarding.slide3Sub },
  ];

  const goNext = () => {
    if (index < slides.length - 1) {
      ref.current?.scrollToIndex({ index: index + 1 });
      setIndex(index + 1);
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <View style={s.root}>
      {/* Language selector */}
      <View style={s.langWrap}>
        <LanguageSelector variant="button" />
      </View>

      {/* Slides */}
      <FlatList
        ref={ref}
        data={slides}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={[s.slide, { width }]}>
            {/* Illustration — each slide has unique color identity */}
            <View style={s.illustrationWrap}>
              <View style={[s.illustrationCircle, { backgroundColor: item.bgColor }]}>
                <Ionicons name={item.icon} size={72} color={item.iconColor} />
              </View>
              {/* Brand wordmark below illustration */}
              <View style={s.logoRow}>
                <View style={s.logoMark}>
                  <Text style={s.logoLetter}>L</Text>
                </View>
                <Text style={s.logoName}>Linka</Text>
              </View>
            </View>

            {/* Title + sub */}
            <Text style={s.title}>{item.title}</Text>
            <Text style={s.sub}>{item.sub}</Text>

            {/* Feature badges */}
            <View style={s.badgesRow}>
              {item.badges.map((b: string) => (
                <View key={b} style={s.badge}>
                  <Ionicons name="checkmark-circle" size={12} color={Colors.accent} />
                  <Text style={s.badgeText}>{b}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      />

      {/* Progress dots */}
      <View style={s.dotsRow}>
        {slides.map((_, i) => (
          <View key={i} style={[s.dot, i === index && s.dotActive]} />
        ))}
      </View>

      {/* CTA */}
      <View style={s.bottom}>
        <TouchableOpacity style={s.btn} onPress={goNext} activeOpacity={0.85}>
          <Text style={s.btnText}>
            {index === slides.length - 1 ? t.onboarding.getStarted : t.onboarding.next}
          </Text>
          <Ionicons
            name={index === slides.length - 1 ? 'rocket-outline' : 'arrow-forward'}
            size={16}
            color={Colors.white}
          />
        </TouchableOpacity>
        <TouchableOpacity style={s.skipBtn} onPress={() => navigation.replace('Login')}>
          <Text style={s.skipText}>{t.onboarding.skip}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: Colors.white, alignItems: 'center' },
  langWrap:{ position: 'absolute', top: 52, right: 20, zIndex: 10 },

  slide: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 100,
  },

  illustrationWrap: { alignItems: 'center', marginBottom: 36 },
  illustrationCircle: {
    width: 180, height: 180, borderRadius: 90,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  logoMark: {
    width: 22, height: 22, borderRadius: 6,
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  logoLetter: { fontSize: 13, fontWeight: '800', color: Colors.white },
  logoName:   { fontFamily: 'Nunito_900Black', fontSize: 16, color: Colors.dark, letterSpacing: -0.3 },

  title: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 26,
    color: Colors.dark, textAlign: 'center',
    marginBottom: 10, letterSpacing: -0.4,
  },
  sub: {
    fontSize: 14, color: Colors.gray,
    textAlign: 'center', lineHeight: 22,
    marginBottom: 24,
  },

  badgesRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.pill,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  badgeText: { fontSize: 12, fontWeight: '600', color: Colors.accent },

  dotsRow:  { flexDirection: 'row', gap: 6, marginBottom: 28, marginTop: 16 },
  dot:      { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.border },
  dotActive:{ width: 24, height: 6, borderRadius: 3, backgroundColor: Colors.accent },

  bottom: { width: '100%', paddingHorizontal: 20, paddingBottom: 44, gap: 12 },
  btn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.pill,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnText:  { fontSize: 15, fontWeight: '700', color: Colors.white },
  skipBtn:  { alignItems: 'center', paddingVertical: 6 },
  skipText: { fontSize: 14, color: Colors.gray },
});
