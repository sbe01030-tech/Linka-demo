import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Modal, FlatList, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { LANGUAGES, LangCode } from '../../i18n';
import { useLanguageStore } from '../../store/languageStore';

interface Props {
  variant?: 'button' | 'row';
}

export default function LanguageSelector({ variant = 'button' }: Props) {
  const { lang, t, setLang } = useLanguageStore();
  const [visible, setVisible] = useState(false);
  const current = LANGUAGES.find((l) => l.code === lang)!;

  const select = (code: LangCode) => { setLang(code); setVisible(false); };

  return (
    <>
      {variant === 'button' ? (
        // Pill variant — bg-gray-50 rounded-full, used on white header backgrounds
        <TouchableOpacity style={s.pillBtn} onPress={() => setVisible(true)} activeOpacity={0.75}>
          <Ionicons name="globe-outline" size={13} color={Colors.grayLight} />
          <Text style={s.pillCode}>{current.code.toUpperCase()}</Text>
          <Ionicons name="chevron-down" size={10} color={Colors.grayLight} />
        </TouchableOpacity>
      ) : (
        // Row variant — matches bg-gray-50 rounded-xl menu list item pattern
        <TouchableOpacity style={s.row} onPress={() => setVisible(true)} activeOpacity={0.75}>
          <Ionicons name="globe-outline" size={16} color={Colors.grayLight} />
          <Text style={s.rowLabel}>{t.profile.language}</Text>
          <View style={[s.flagBadgeSm, { backgroundColor: current.color }]}>
            <Text style={s.flagCodeSm}>{current.countryCode}</Text>
          </View>
          <Text style={s.rowValue}>{current.nativeLabel}</Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.grayLight} />
        </TouchableOpacity>
      )}

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={s.overlay} onPress={() => setVisible(false)}>
          <Pressable style={s.sheet} onPress={() => {}}>
            {/* Handle */}
            <View style={s.handle} />
            <Text style={s.sheetTitle}>{t.lang.selectLanguage}</Text>

            <FlatList
              data={LANGUAGES}
              keyExtractor={(i) => i.code}
              renderItem={({ item }) => {
                const active = item.code === lang;
                return (
                  <TouchableOpacity
                    style={s.langItem}
                    onPress={() => select(item.code)}
                    activeOpacity={0.7}
                  >
                    <View style={[s.flagBadge, { backgroundColor: item.color }]}>
                      <Text style={s.flagCode}>{item.countryCode}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      {/* text-sm font-bold */}
                      <Text style={[s.langNative, active && s.langNativeActive]}>
                        {item.nativeLabel}
                      </Text>
                      {/* text-xs text-gray-400 */}
                      <Text style={s.langEnglish}>{item.label}</Text>
                    </View>
                    {active && (
                      // Active: rounded-full bg-black checkmark
                      <View style={s.checkCircle}>
                        <Ionicons name="checkmark" size={13} color={Colors.white} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={s.sep} />}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  // Pill variant: bg-gray-50 rounded-full border border-gray-100
  pillBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.section,
    paddingHorizontal: 11, paddingVertical: 7,
    borderRadius: Radius.pill,
    borderWidth: 1, borderColor: Colors.border,
  },
  pillCode: { fontSize: 12, fontWeight: '600', color: Colors.dark },

  // Row variant — matches the menu-row pattern in Profile screens
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    gap: 12,
  },
  rowLabel: { flex: 1, fontSize: 14, color: Colors.dark, fontWeight: '400' },
  rowValue: { fontSize: 13, color: Colors.gray, marginRight: 2 },

  // Modal
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingBottom: 44, paddingTop: 12,
    ...Shadow.lg,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 16, fontWeight: '400', color: Colors.dark,
    textAlign: 'center', marginBottom: 8, paddingHorizontal: 20,
  },

  // Language items
  langItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 24, paddingVertical: 15,
  },
  langFlag:   { fontSize: 24 },
  // text-sm font-bold text-gray-800
  langNative: { fontSize: 14, fontWeight: '700', color: Colors.darkMid, marginBottom: 1 },
  langNativeActive: { color: Colors.dark },
  // text-xs text-gray-400
  langEnglish: { fontSize: 12, color: Colors.grayLight },
  // rounded-full bg-black
  checkCircle: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  sep: { height: 1, backgroundColor: Colors.border, marginHorizontal: 24 },
});
