/**
 * ErrandCreateScreen — 심부름 요청 작성
 * 고객이 심부름 요청을 올리는 화면
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius } from '../../constants/colors';
import { useLanguageStore } from '../../store/languageStore';

export default function ErrandCreateScreen() {
  const navigation = useNavigation();
  const insets     = useSafeAreaInsets();
  const { lang }   = useLanguageStore();
  const tx = (ko: string, en: string, id: string) => lang === 'ko' ? ko : lang === 'en' ? en : id;

  const CATEGORIES = [
    { id: 'shopping', label: tx('장보기·쇼핑', 'Shopping', 'Belanja·Shopping'),  icon: 'cart-outline',                color: '#F59E0B' },
    { id: 'delivery', label: tx('배달·수령', 'Delivery', 'Antar·Terima'),         icon: 'bicycle-outline',             color: '#3B82F6' },
    { id: 'queuing',  label: tx('줄서기·대리', 'Queuing', 'Antre·Wakili'),        icon: 'time-outline',                color: '#EC4899' },
    { id: 'other',    label: tx('기타', 'Other', 'Lainnya'),                      icon: 'ellipsis-horizontal-outline', color: '#6B7280' },
  ];

  const [category, setCategory] = useState('shopping');
  const [title,    setTitle]    = useState('');
  const [desc,     setDesc]     = useState('');
  const [location, setLocation] = useState('');
  const [budget,   setBudget]   = useState('');
  const [deadline, setDeadline] = useState('');
  const [focused,  setFocused]  = useState<string | null>(null);

  const canSubmit = title.trim() && desc.trim() && location.trim() && budget.trim();

  const handleSubmit = () => {
    Alert.alert(
      tx('요청 등록 완료!', 'Request posted!', 'Permintaan Berhasil!'),
      tx(
        '요청이 등록됐어요.\n근처 헬퍼가 곧 응답할 거예요.',
        'Your request has been posted.\nNearby helpers will respond soon.',
        'Permintaan kamu sudah dikirim.\nHelper terdekat akan segera merespons.'
      ),
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 헤더 */}
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={20} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{tx('심부름 요청하기', 'Post Errand', 'Buat Permintaan')}</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 카테고리 선택 */}
        <Text style={s.label}>{tx('카테고리', 'Category', 'Kategori')}</Text>
        <View style={s.catGrid}>
          {CATEGORIES.map(c => (
            <TouchableOpacity
              key={c.id}
              style={[s.catCard, category === c.id && s.catCardActive]}
              onPress={() => setCategory(c.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={c.icon as any}
                size={20}
                color={category === c.id ? Colors.accent : Colors.gray}
              />
              <Text style={[s.catLabel, category === c.id && s.catLabelActive]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 제목 */}
        <Text style={s.label}>{tx('요청 제목', 'Title', 'Judul Permintaan')}</Text>
        <View style={[s.field, focused === 'title' && s.fieldFocused]}>
          <TextInput
            style={s.input}
            placeholder={tx('예: 편의점에서 음료 사다 주세요', 'e.g. Please buy drinks at the convenience store', 'cth. Tolong belikan minuman di Indomaret dekat stasiun')}
            placeholderTextColor={Colors.grayLight}
            value={title}
            onChangeText={setTitle}
            onFocus={() => setFocused('title')}
            onBlur={() => setFocused(null)}
            maxLength={50}
          />
        </View>

        {/* 상세 설명 */}
        <Text style={s.label}>{tx('상세 내용', 'Details', 'Detail Permintaan')}</Text>
        <View style={[s.field, s.fieldMulti, focused === 'desc' && s.fieldFocused]}>
          <TextInput
            style={[s.input, s.inputMulti]}
            placeholder={tx('필요한 물건, 주의사항, 특이사항 등', 'Items needed, notes, special requests', 'Tuliskan barang yang dibutuhkan, catatan penting, atau hal khusus lainnya')}
            placeholderTextColor={Colors.grayLight}
            value={desc}
            onChangeText={setDesc}
            onFocus={() => setFocused('desc')}
            onBlur={() => setFocused(null)}
            multiline
            numberOfLines={4}
            maxLength={300}
          />
          <Text style={s.charCount}>{desc.length}/300</Text>
        </View>

        {/* 위치 */}
        <Text style={s.label}>{tx('위치·지역', 'Location', 'Lokasi·Area')}</Text>
        <View style={[s.field, focused === 'location' && s.fieldFocused]}>
          <Ionicons name="location-outline" size={16} color={Colors.grayLight} />
          <TextInput
            style={s.input}
            placeholder={tx('예: 서울 강남구 역삼동', 'e.g. Seoul Gangnam', 'cth. Jakarta Selatan, Kebayoran Baru')}
            placeholderTextColor={Colors.grayLight}
            value={location}
            onChangeText={setLocation}
            onFocus={() => setFocused('location')}
            onBlur={() => setFocused(null)}
          />
        </View>

        {/* 예산 */}
        <Text style={s.label}>{tx('제안 금액 (Rp)', 'Budget (Rp)', 'Budget (Rp)')}</Text>
        <View style={[s.field, focused === 'budget' && s.fieldFocused]}>
          <Text style={s.prefix}>Rp</Text>
          <TextInput
            style={s.input}
            placeholder="10000"
            placeholderTextColor={Colors.grayLight}
            value={budget}
            onChangeText={setBudget}
            onFocus={() => setFocused('budget')}
            onBlur={() => setFocused(null)}
            keyboardType="numeric"
          />
        </View>

        {/* 마감 시간 (선택) */}
        <Text style={s.label}>
          {tx('마감 시간', 'Deadline', 'Batas Waktu')} <Text style={s.optional}>{tx('(선택)', '(optional)', '(opsional)')}</Text>
        </Text>
        <View style={[s.field, focused === 'deadline' && s.fieldFocused]}>
          <Ionicons name="alarm-outline" size={16} color={Colors.grayLight} />
          <TextInput
            style={s.input}
            placeholder={tx('예: 오늘 오후 3시까지', 'e.g. Today 3 PM', 'cth. Hari ini jam 3 sore')}
            placeholderTextColor={Colors.grayLight}
            value={deadline}
            onChangeText={setDeadline}
            onFocus={() => setFocused('deadline')}
            onBlur={() => setFocused(null)}
          />
        </View>

        {/* 안내 */}
        <View style={s.notice}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.accent} />
          <Text style={s.noticeText}>
            {tx(
              '요청이 등록되면 근처 헬퍼에게 알림이 가요.\n헬퍼가 수락하면 채팅으로 연결됩니다.',
              "Once posted, nearby helpers get notified.\nYou'll be connected via chat when accepted.",
              'Setelah permintaan dikirim, helper terdekat akan mendapat notifikasi.\nJika helper menerima, kamu akan terhubung lewat chat.'
            )}
          </Text>
        </View>

        {/* 등록 버튼 */}
        <TouchableOpacity
          style={[s.submitBtn, !canSubmit && s.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
          activeOpacity={0.85}
        >
          <Text style={s.submitBtnText}>{tx('요청 등록하기', 'Submit Request', 'Kirim Permintaan')}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn:     { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.dark },

  scroll: { paddingHorizontal: 20, paddingTop: 24, gap: 6 },
  label:  { fontSize: 13, fontWeight: '600', color: Colors.darkMid, marginTop: 16, marginBottom: 8 },
  optional: { fontSize: 12, fontWeight: '400', color: Colors.grayLight },

  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catCard: {
    width: '47%', flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 12, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.borderMid,
    backgroundColor: Colors.white,
  },
  catCardActive: { borderColor: Colors.accent, backgroundColor: Colors.accentLight },
  catLabel:      { fontSize: 13, fontWeight: '500', color: Colors.gray },
  catLabelActive:{ color: Colors.accent, fontWeight: '700' },

  field: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.section,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  fieldMulti:   { alignItems: 'flex-start', paddingTop: 12, paddingBottom: 8 },
  fieldFocused: { borderColor: Colors.accent, backgroundColor: Colors.white },
  input:        { flex: 1, paddingVertical: 13, fontSize: 15, color: Colors.dark },
  inputMulti:   { minHeight: 100, textAlignVertical: 'top' },
  charCount:    { fontSize: 11, color: Colors.grayLight, alignSelf: 'flex-end', paddingBottom: 8 },
  prefix:       { fontSize: 14, fontWeight: '600', color: Colors.gray },

  notice: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.md, padding: 14, marginTop: 8,
  },
  noticeText: { flex: 1, fontSize: 12, color: Colors.accent, lineHeight: 18 },

  submitBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 16,
  },
  submitBtnDisabled: { backgroundColor: Colors.borderMid },
  submitBtnText:     { fontSize: 15, fontWeight: '700', color: Colors.white },
});
