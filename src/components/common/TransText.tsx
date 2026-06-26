/**
 * TransText — 기본은 '번역본' 표시, '원문 보기' 토글 제공. (시연용 자동번역)
 *  - translated(목번역)가 있으면 즉시 사용, 없으면 DEMO_TRANSLATIONS 룩업, 그래도 없으면 라이브 번역
 *  - target: 번역할 대상 언어 (보는 사람 언어). 고객뷰=ko, 워커 페르소나=id
 */
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { translateText, TargetLang } from '../../utils/translate';
import { DEMO_TRANSLATIONS } from '../../constants/demoStrings';

interface Props {
  original: string;
  translated?: string;
  target: TargetLang;
  textStyle?: StyleProp<TextStyle>;
  tint?: string;
}

const LABELS: Record<TargetLang, { orig: string; trans: string; ing: string }> = {
  ko: { orig: '원문 보기', trans: '번역 보기', ing: '번역 중…' },
  id: { orig: 'Lihat asli', trans: 'Lihat terjemahan', ing: 'Menerjemahkan…' },
  en: { orig: 'Original', trans: 'Translation', ing: 'Translating…' },
};

export default function TransText({ original, translated, target, textStyle, tint = Colors.grayLight }: Props) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [auto, setAuto] = useState<string | undefined>(translated || DEMO_TRANSLATIONS[original]?.[target]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const mock = translated || DEMO_TRANSLATIONS[original]?.[target];
    if (mock) { setAuto(mock); return; }
    let alive = true;
    setLoading(true);
    translateText(original, target).then((r) => {
      if (!alive) return;
      setLoading(false);
      if (r && r.trim() && r.trim() !== original.trim()) setAuto(r);
    });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [original, translated, target]);

  const L = LABELS[target];
  const display = (auto && !showOriginal) ? auto : original;

  return (
    <View>
      <Text style={textStyle}>{display}</Text>
      {(auto || loading) && (
        <TouchableOpacity style={tt.btn} onPress={() => setShowOriginal((v) => !v)} disabled={loading} activeOpacity={0.7}>
          <Ionicons name={showOriginal ? 'language' : 'language-outline'} size={11} color={tint} />
          <Text style={[tt.btnText, { color: tint }]}>{loading ? L.ing : showOriginal ? L.trans : L.orig}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const tt = StyleSheet.create({
  btn:     { flexDirection: 'row', alignItems: 'center', gap: 3, paddingTop: 5, alignSelf: 'flex-start' },
  btnText: { fontSize: 11, fontWeight: '500' },
});
