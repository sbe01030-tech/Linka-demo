import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Modal, FlatList, Pressable, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { LANGUAGES, LangCode } from '../../i18n';
import { useLanguageStore } from '../../store/languageStore';

interface Props {
  variant?: 'button' | 'row';
}

// Twemoji PNG — renders exactly like emoji but as a real image, works on all devices
const twemojiUrl = (code: string) =>
  `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${code}.png`;

export default function LanguageSelector({ variant = 'button' }: Props) {
  const { lang, t, setLang } = useLanguageStore();
  const [visible, setVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const current = LANGUAGES.find((l) => l.code === lang)!;

  const select = (code: LangCode) => { setLang(code); setVisible(false); };

  return (
    <>
      {variant === 'button' ? (
        <TouchableOpacity style={s.pillBtn} onPress={() => setVisible(true)} activeOpacity={0.75}>
          <Image source={{ uri: twemojiUrl(current.twemoji) }} style={s.pillFlag} />
          <Text style={s.pillCode}>{current.code.toUpperCase()}</Text>
          <Ionicons name="chevron-down" size={10} color={Colors.grayLight} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={s.row} onPress={() => setVisible(true)} activeOpacity={0.75}>
          <Ionicons name="globe-outline" size={16} color={Colors.grayLight} />
          <Text style={s.rowLabel}>{t.profile.language}</Text>
          <Image source={{ uri: twemojiUrl(current.twemoji) }} style={s.rowFlag} />
          <Text style={s.rowValue}>{current.nativeLabel}</Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.grayLight} />
        </TouchableOpacity>
      )}

      <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
        <Pressable style={s.overlay} onPress={() => setVisible(false)}>
          <Pressable style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 24) }]} onPress={() => {}}>
            <View style={s.handle} />
            <Text style={s.sheetTitle}>{t.lang.selectLanguage}</Text>

            <FlatList
              data={LANGUAGES}
              keyExtractor={(i) => i.code}
              renderItem={({ item }) => {
                const active = item.code === lang;
                return (
                  <TouchableOpacity
                    style={[s.langItem, active && s.langItemActive]}
                    onPress={() => select(item.code)}
                    activeOpacity={0.7}
                  >
                    <Image source={{ uri: twemojiUrl(item.twemoji) }} style={s.langFlag} />
                    <View style={{ flex: 1 }}>
                      <Text style={[s.langNative, active && s.langNativeActive]}>
                        {item.nativeLabel}
                      </Text>
                      <Text style={s.langEnglish}>{item.label}</Text>
                    </View>
                    {active ? (
                      <View style={s.checkCircle}>
                        <Ionicons name="checkmark" size={14} color={Colors.white} />
                      </View>
                    ) : (
                      <View style={s.checkCircleEmpty} />
                    )}
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={s.sep} />}
              scrollEnabled={false}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  pillBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.section,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: Radius.pill,
    borderWidth: 1, borderColor: Colors.border,
  },
  pillFlag: { width: 15, height: 15 },
  pillCode: { fontSize: 12, fontWeight: '600', color: Colors.dark },

  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    gap: 12,
  },
  rowLabel: { flex: 1, fontSize: 14, color: Colors.dark, fontWeight: '400' },
  rowFlag:  { width: 19, height: 19 },
  rowValue: { fontSize: 13, color: Colors.gray, marginRight: 2 },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingTop: 12,
    ...Shadow.lg,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 16, fontWeight: '600', color: Colors.dark,
    textAlign: 'center', marginBottom: 8, paddingHorizontal: 20,
  },

  langItem: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    paddingHorizontal: 24, paddingVertical: 15,
  },
  langItemActive: {
    backgroundColor: Colors.accentLight,
  },
  langFlag: { width: 28, height: 28 },
  langNative: { fontSize: 15, fontWeight: '700', color: Colors.darkMid, marginBottom: 2 },
  langNativeActive: { color: Colors.dark },
  langEnglish: { fontSize: 13, color: Colors.grayLight },

  checkCircle: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  checkCircleEmpty: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 1.5, borderColor: Colors.border,
  },

  sep: { height: 1, backgroundColor: Colors.border, marginLeft: 80 },
});
