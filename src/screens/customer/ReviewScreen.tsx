import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Alert, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Radius } from '../../constants/colors';
import { useLanguageStore } from '../../store/languageStore';
import { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Review'>;

const QUICK_TAGS_ID = ['Tepat waktu', 'Ramah', 'Bersih & rapi', 'Profesional', 'Sangat membantu', 'Rekomendasi!'];
const QUICK_TAGS_EN = ['On time', 'Friendly', 'Clean & tidy', 'Professional', 'Very helpful', 'Recommended!'];
const QUICK_TAGS_KO = ['시간 엄수', '친절함', '깔끔함', '프로페셔널', '매우 도움됨', '추천!'];

export default function ReviewScreen({ navigation, route }: Props) {
  const { workerName, workerPhoto, orderId } = route.params;
  const { lang } = useLanguageStore();

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText]       = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const quickTags = lang === 'ko' ? QUICK_TAGS_KO : lang === 'en' ? QUICK_TAGS_EN : QUICK_TAGS_ID;

  const L = {
    id: { title: 'Beri Ulasan', submit: 'Kirim Ulasan', placeholder: 'Ceritakan pengalamanmu (opsional)...', tagline: 'Bagaimana pengalamanmu bekerja sama dengan', ratingLabels: ['', 'Buruk', 'Kurang baik', 'Cukup', 'Bagus', 'Luar biasa!'], success: 'Ulasan berhasil dikirim! Terima kasih.', noRating: 'Pilih bintang dulu ya.' },
    en: { title: 'Leave a Review', submit: 'Submit Review', placeholder: 'Share your experience (optional)...', tagline: 'How was your experience with', ratingLabels: ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'], success: 'Review submitted! Thank you.', noRating: 'Please select a star rating first.' },
    ko: { title: '리뷰 작성', submit: '리뷰 제출', placeholder: '경험을 공유해주세요 (선택사항)...', tagline: '와 함께한 경험은 어땠나요?', ratingLabels: ['', '별로', '아쉬워요', '보통', '좋아요', '최고예요!'], success: '리뷰가 제출됐습니다! 감사합니다.', noRating: '별점을 먼저 선택해주세요.' },
    zh: { title: '写评价', submit: '提交评价', placeholder: '分享您的体验（选填）...', tagline: '您与以下服务者的体验如何', ratingLabels: ['', '很差', '较差', '一般', '好', '非常好！'], success: '评价已提交！谢谢。', noRating: '请先选择星级。' },
    ja: { title: 'レビューを書く', submit: 'レビューを送信', placeholder: '体験を共有してください（任意）...', tagline: 'との体験はいかがでしたか', ratingLabels: ['', '悪い', 'もう少し', '普通', '良い', '最高！'], success: 'レビューを送信しました！ありがとうございます。', noRating: '先に星評価を選択してください。' },
  } as const;

  const t = L[lang as keyof typeof L] ?? L.id;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const submit = () => {
    if (rating === 0) {
      Alert.alert('', t.noRating, [{ text: 'OK' }]);
      return;
    }
    Alert.alert('', t.success, [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  const displayRating = hovered || rating;

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{t.title}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Worker card */}
        <View style={s.workerCard}>
          {workerPhoto ? (
            <Image source={{ uri: workerPhoto }} style={s.workerAvatar} />
          ) : (
            <View style={[s.workerAvatar, s.workerAvatarFallback]}>
              <Text style={s.workerAvatarLetter}>{workerName.charAt(0)}</Text>
            </View>
          )}
          <View style={s.workerInfo}>
            <Text style={s.workerTagline}>{t.tagline}</Text>
            <Text style={s.workerName}>{workerName}</Text>
          </View>
        </View>

        {/* Star rating */}
        <View style={s.starsSection}>
          <View style={s.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                onPressIn={() => setHovered(star)}
                onPressOut={() => setHovered(0)}
                activeOpacity={1}
                style={s.starBtn}
              >
                <Ionicons
                  name={displayRating >= star ? 'star' : 'star-outline'}
                  size={42}
                  color={displayRating >= star ? '#F59E0B' : Colors.border}
                />
              </TouchableOpacity>
            ))}
          </View>
          {displayRating > 0 && (
            <Text style={s.ratingLabel}>{t.ratingLabels[displayRating]}</Text>
          )}
        </View>

        {/* Quick tags */}
        <View style={s.tagsSection}>
          <Text style={s.tagsTitle}>
            {lang === 'ko' ? '태그 선택' : lang === 'en' ? 'Select tags' : 'Pilih tag'}
          </Text>
          <View style={s.tagsWrap}>
            {quickTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[s.tag, selectedTags.includes(tag) && s.tagActive]}
                onPress={() => toggleTag(tag)}
                activeOpacity={0.75}
              >
                {selectedTags.includes(tag) && (
                  <Ionicons name="checkmark" size={12} color={Colors.white} />
                )}
                <Text style={[s.tagText, selectedTags.includes(tag) && s.tagTextActive]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Text input */}
        <View style={s.textSection}>
          <Text style={s.tagsTitle}>
            {lang === 'ko' ? '상세 리뷰' : lang === 'en' ? 'Detailed review' : 'Ulasan detail'}
          </Text>
          <TextInput
            style={s.textInput}
            placeholder={t.placeholder}
            placeholderTextColor={Colors.grayLight}
            value={text}
            onChangeText={setText}
            multiline
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={s.charCount}>{text.length}/500</Text>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[s.submitBtn, rating === 0 && s.submitBtnDisabled]}
          onPress={submit}
          activeOpacity={0.85}
        >
          <Ionicons name="star" size={16} color={Colors.white} />
          <Text style={s.submitBtnText}>{t.submit}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },

  header: {
    paddingTop: 56, paddingHorizontal: 16, paddingBottom: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  backBtn:     { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.dark },

  scroll: { flex: 1, paddingHorizontal: 20 },

  workerCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  workerAvatar: { width: 56, height: 56, borderRadius: 28 },
  workerAvatarFallback: {
    backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center',
  },
  workerAvatarLetter: { fontSize: 22, fontWeight: '700', color: Colors.accent },
  workerInfo: { flex: 1 },
  workerTagline: { fontSize: 12, color: Colors.gray, marginBottom: 3 },
  workerName:    { fontSize: 18, fontWeight: '700', color: Colors.dark },

  starsSection: { alignItems: 'center', paddingVertical: 28 },
  starsRow:     { flexDirection: 'row', gap: 6, marginBottom: 10 },
  starBtn:      { padding: 4 },
  ratingLabel:  { fontSize: 16, fontWeight: '700', color: Colors.dark },

  tagsSection:  { paddingBottom: 20 },
  tagsTitle: { fontSize: 13, fontWeight: '600', color: Colors.gray, marginBottom: 10 },
  tagsWrap:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.borderMid,
    paddingHorizontal: 12, paddingVertical: 7,
    backgroundColor: Colors.white,
  },
  tagActive:    { backgroundColor: Colors.accent, borderColor: Colors.accent },
  tagText:      { fontSize: 13, color: Colors.gray },
  tagTextActive:{ fontSize: 13, color: Colors.white, fontWeight: '600' },

  textSection: { paddingBottom: 24 },
  textInput: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: Colors.dark,
    backgroundColor: Colors.section,
    minHeight: 110, lineHeight: 21,
  },
  charCount: { fontSize: 11, color: Colors.grayLight, textAlign: 'right', marginTop: 4 },

  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.accent, borderRadius: Radius.pill,
    paddingVertical: 15, marginBottom: 12,
  },
  submitBtnDisabled: { backgroundColor: Colors.grayLight },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
