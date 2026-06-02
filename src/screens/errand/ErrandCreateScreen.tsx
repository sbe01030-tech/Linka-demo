/**
 * ErrandCreateScreen — 심부름 요청 글 등록
 *
 * 입력: 제목 / 카테고리 / 보수(타입+금액+당일지급) / 날짜·시간 / 위치(동네) / 설명
 * 등록 시 errandStore.addPost → 목록 최상단에 push → 상세로 이동.
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Switch, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius } from '../../constants/colors';
import { RootStackParamList, ErrandCategory, ErrandPayType } from '../../types';
import { useErrandStore, CATEGORY_META } from '../../store/errandStore';
import { useLanguageStore } from '../../store/languageStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ErrandCreate'>;

const PAY_TYPES: { id: ErrandPayType; ko: string; en: string; id_l: string }[] = [
  { id: 'perJob', ko: '건당',  en: 'Per job', id_l: 'Per pekerjaan' },
  { id: 'hourly', ko: '시급',  en: 'Hourly',  id_l: 'Per jam' },
  { id: 'daily',  ko: '일급',  en: 'Daily',   id_l: 'Per hari' },
];

const AREAS = [
  { name: 'Kebayoran Baru', lat: -6.2444, lng: 106.8050 },
  { name: 'Senopati',       lat: -6.2478, lng: 106.8032 },
  { name: 'Cilandak',       lat: -6.2535, lng: 106.8022 },
  { name: 'Kemang',         lat: -6.2498, lng: 106.8084 },
  { name: 'Menteng',        lat: -6.2462, lng: 106.8056 },
  { name: 'Pondok Indah',   lat: -6.2515, lng: 106.8005 },
  { name: 'SCBD',           lat: -6.2457, lng: 106.8075 },
];

export default function ErrandCreateScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { lang } = useLanguageStore();
  const tx = (ko: string, en: string, id: string) => lang === 'ko' ? ko : lang === 'en' ? en : id;
  const lopt = (o: { ko: string; en: string; id_l: string }) =>
    lang === 'ko' ? o.ko : lang === 'en' ? o.en : o.id_l;

  const addPost = useErrandStore((s) => s.addPost);

  const [title, setTitle]         = useState('');
  const [description, setDesc]    = useState('');
  const [category, setCategory]   = useState<ErrandCategory>('shopping');
  const [payType, setPayType]     = useState<ErrandPayType>('perJob');
  const [amount, setAmount]       = useState('');
  const [sameDay, setSameDay]     = useState(true);
  const [scheduledLabel, setSched] = useState('Hari ini');
  const [timeLabel, setTimeLabel] = useState('Negotiable');
  const [areaIdx, setAreaIdx]     = useState(0);

  const amountNum = Number(amount.replace(/\D/g, ''));
  const canSubmit = title.trim().length >= 3 && description.trim().length >= 10 && amountNum > 0;

  const submit = () => {
    if (!canSubmit) {
      Alert.alert(tx('확인', 'Wait', 'Tunggu'), tx('제목 3자, 설명 10자 이상, 금액 입력 필요해요.', 'Title 3+, desc 10+, amount required.', 'Judul 3+, deskripsi 10+, jumlah wajib.'));
      return;
    }
    const area = AREAS[areaIdx];
    const id = addPost({
      authorId: 'me', authorName: 'Anonim', authorTemperature: 36.5,
      title, description, photos: [],
      category, payType, amount: amountNum, sameDayPayment: sameDay,
      scheduledLabel, timeLabel,
      area: { ...area, radius: 300 },
    });
    navigation.replace('ErrandDetail', { errandId: id });
  };

  return (
    <View style={[s.root, { paddingTop: insets.top + 4 }]}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate("CustomerTabs" as never)} style={s.closeBtn}>
          <Ionicons name="close" size={26} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{tx('심부름 요청 등록', 'New Errand Post', 'Buat Jasa')}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Title */}
        <Field label={tx('제목', 'Title', 'Judul')} required>
          <TextInput
            style={s.input}
            placeholder={tx('어떤 도움이 필요한가요?', 'What do you need help with?', 'Bantuan apa yang Anda butuhkan?')}
            placeholderTextColor={Colors.grayLight}
            value={title}
            onChangeText={setTitle}
          />
        </Field>

        {/* Category */}
        <Field label={tx('카테고리', 'Category', 'Kategori')}>
          <View style={s.chipWrap}>
            {Object.values(CATEGORY_META).map((m) => {
              const active = category === m.id;
              return (
                <TouchableOpacity
                  key={m.id}
                  style={[s.catChip, active && s.catChipActive]}
                  onPress={() => setCategory(m.id as ErrandCategory)}
                  activeOpacity={0.8}
                >
                  <Ionicons name={m.icon as any} size={14} color={active ? Colors.white : Colors.dark} />
                  <Text style={[s.catChipText, active && s.catChipTextActive]}>
                    {m.label[lang as 'ko' | 'en' | 'id'] ?? m.label.id}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Field>

        {/* Pay */}
        <Field label={tx('보수', 'Pay', 'Bayaran')} required>
          <View style={[s.chipWrap, { marginBottom: 10 }]}>
            {PAY_TYPES.map((p) => {
              const active = payType === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[s.payChip, active && s.payChipActive]}
                  onPress={() => setPayType(p.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[s.payChipText, active && s.payChipTextActive]}>{lopt(p)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={s.amountRow}>
            <Text style={s.rpPrefix}>Rp</Text>
            <TextInput
              style={[s.input, { flex: 1, marginLeft: 8 }]}
              placeholder="0"
              placeholderTextColor={Colors.grayLight}
              keyboardType="number-pad"
              value={amount ? Number(amount.replace(/\D/g, '')).toLocaleString('id-ID') : ''}
              onChangeText={(t) => setAmount(t.replace(/\D/g, ''))}
            />
          </View>

          <View style={s.switchRow}>
            <Text style={s.switchLabel}>{tx('당일지급', 'Same-day pay', 'Bayar hari yang sama')}</Text>
            <Switch
              value={sameDay}
              onValueChange={setSameDay}
              trackColor={{ false: Colors.borderMid, true: Colors.accent }}
              thumbColor={Colors.white}
            />
          </View>
        </Field>

        {/* Schedule */}
        <Field label={tx('날짜·시간', 'Schedule', 'Jadwal')}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput
              style={[s.input, { flex: 1 }]}
              placeholder={tx('오늘', 'Hari ini', 'Hari ini')}
              placeholderTextColor={Colors.grayLight}
              value={scheduledLabel}
              onChangeText={setSched}
            />
            <TextInput
              style={[s.input, { flex: 1 }]}
              placeholder={tx('시간 협의', 'Negotiable', 'Negotiable')}
              placeholderTextColor={Colors.grayLight}
              value={timeLabel}
              onChangeText={setTimeLabel}
            />
          </View>
        </Field>

        {/* Area */}
        <Field label={tx('동네', 'Area', 'Wilayah')}>
          <View style={s.chipWrap}>
            {AREAS.map((a, i) => {
              const active = areaIdx === i;
              return (
                <TouchableOpacity
                  key={a.name}
                  style={[s.areaChip, active && s.areaChipActive]}
                  onPress={() => setAreaIdx(i)}
                  activeOpacity={0.8}
                >
                  <Text style={[s.areaChipText, active && s.areaChipTextActive]}>{a.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Field>

        {/* Description */}
        <Field label={tx('설명', 'Description', 'Deskripsi')} required>
          <TextInput
            style={s.textarea}
            placeholder={tx('어떤 일인지 자세히 적어주세요.', 'Describe in detail.', 'Jelaskan dengan detail.')}
            placeholderTextColor={Colors.grayLight}
            multiline
            value={description}
            onChangeText={setDesc}
          />
        </Field>
      </ScrollView>

      <View style={[s.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[s.submitBtn, !canSubmit && s.submitBtnDisabled]}
          disabled={!canSubmit}
          activeOpacity={0.88}
          onPress={submit}
        >
          <Text style={s.submitBtnText}>{tx('등록하기', 'Post', 'Pasang')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <View style={s.fieldBlock}>
      <Text style={s.fieldLabel}>
        {label} {required && <Text style={s.req}>*</Text>}
      </Text>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginLeft: -8 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.dark },

  fieldBlock: { marginBottom: 22 },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: Colors.dark, marginBottom: 10 },
  req: { color: '#EF4444' },

  input: {
    borderWidth: 1.5, borderColor: Colors.borderMid, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: Colors.dark,
  },
  textarea: {
    minHeight: 110, padding: 14,
    borderWidth: 1.5, borderColor: Colors.borderMid, borderRadius: 12,
    fontSize: 14, color: Colors.dark, textAlignVertical: 'top',
  },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 16, borderWidth: 1.2, borderColor: Colors.borderMid,
    backgroundColor: Colors.white,
  },
  catChipActive: { backgroundColor: Colors.dark, borderColor: Colors.dark },
  catChipText:       { fontSize: 12, color: Colors.dark, fontWeight: '500' },
  catChipTextActive: { color: Colors.white, fontWeight: '600' },

  payChip: {
    paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 10, borderWidth: 1.5, borderColor: Colors.borderMid,
  },
  payChipActive:     { backgroundColor: Colors.dark, borderColor: Colors.dark },
  payChipText:       { fontSize: 13, fontWeight: '600', color: Colors.dark },
  payChipTextActive: { color: Colors.white },

  amountRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  rpPrefix:  { fontSize: 14, fontWeight: '700', color: Colors.dark },

  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  switchLabel: { fontSize: 13, color: Colors.dark, fontWeight: '600' },

  areaChip: {
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 16, borderWidth: 1.2, borderColor: Colors.borderMid,
    backgroundColor: Colors.white,
  },
  areaChipActive: { backgroundColor: Colors.dark, borderColor: Colors.dark },
  areaChipText:       { fontSize: 12, color: Colors.dark, fontWeight: '500' },
  areaChipTextActive: { color: Colors.white, fontWeight: '600' },

  bottomBar: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    paddingHorizontal: 20, paddingTop: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  submitBtn: {
    height: 54, borderRadius: 14, backgroundColor: '#F97316',
    alignItems: 'center', justifyContent: 'center',
  },
  submitBtnDisabled: { backgroundColor: Colors.borderMid },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
});
