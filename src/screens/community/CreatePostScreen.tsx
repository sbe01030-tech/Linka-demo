import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { useLanguageStore } from '../../store/languageStore';
import { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePost'>;

type PostCategory = 'popular' | 'chat' | 'tips' | 'ask' | 'announce';

const CATEGORIES: { key: PostCategory; emoji: string; labelId: string; labelEn: string; labelKo: string; bg: string; color: string }[] = [
  { key: 'chat',     emoji: '💬', labelId: 'Ngobrol',    labelEn: 'Chat',     labelKo: '잡담',  bg: Colors.section,  color: Colors.gray },
  { key: 'tips',     emoji: '💡', labelId: 'Tips',       labelEn: 'Tips',     labelKo: '팁',    bg: '#F0FDF4',       color: '#16A34A' },
  { key: 'ask',      emoji: '❓', labelId: 'Tanya',      labelEn: 'Ask',      labelKo: '질문',  bg: '#EFF6FF',       color: '#2563EB' },
  { key: 'announce', emoji: '📢', labelId: 'Pengumuman', labelEn: 'Announce', labelKo: '공지',  bg: '#F5F3FF',       color: '#7C3AED' },
];

export default function CreatePostScreen({ navigation }: Props) {
  const { t, lang } = useLanguageStore();
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState<PostCategory>('chat');
  const [title, setTitle]       = useState('');
  const [body, setBody]         = useState('');
  const [isAnon, setIsAnon]     = useState(false);

  const catLabel = (c: typeof CATEGORIES[0]) =>
    lang === 'ko' ? c.labelKo : lang === 'en' ? c.labelEn : c.labelId;

  const submit = () => {
    if (!title.trim()) {
      Alert.alert(
        lang === 'ko' ? '제목을 입력해주세요' : lang === 'en' ? 'Please enter a title' : 'Judul tidak boleh kosong',
        '',
        [{ text: 'OK' }]
      );
      return;
    }
    if (!body.trim()) {
      Alert.alert(
        lang === 'ko' ? '내용을 입력해주세요' : lang === 'en' ? 'Please enter some content' : 'Isi postingan tidak boleh kosong',
        '',
        [{ text: 'OK' }]
      );
      return;
    }
    Alert.alert(
      lang === 'ko' ? '게시됐습니다!' : lang === 'en' ? 'Posted!' : 'Postingan berhasil dikirim!',
      '',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const selectedCat = CATEGORIES.find((c) => c.key === category)!;

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={22} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>
          {lang === 'ko' ? '글쓰기' : lang === 'en' ? 'Write Post' : 'Tulis Postingan'}
        </Text>
        <TouchableOpacity
          style={[s.submitBtn, (!title.trim() || !body.trim()) && s.submitBtnDisabled]}
          onPress={submit}
          activeOpacity={0.85}
        >
          <Text style={s.submitBtnText}>
            {lang === 'ko' ? '게시' : lang === 'en' ? 'Post' : 'Kirim'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.form} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Category selector */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>
            {lang === 'ko' ? '카테고리' : lang === 'en' ? 'Category' : 'Kategori'}
          </Text>
          <View style={s.catWrap}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.catRow}>
              {CATEGORIES.map((c) => (
                <TouchableOpacity
                  key={c.key}
                  style={[s.catChip, category === c.key && { backgroundColor: c.bg, borderColor: c.color }]}
                  onPress={() => setCategory(c.key)}
                  activeOpacity={0.75}
                >
                  <Text style={s.catEmoji}>{c.emoji}</Text>
                  <Text style={[s.catChipText, category === c.key && { color: c.color, fontWeight: '700' }]}>
                    {catLabel(c)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Title input */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>
            {lang === 'ko' ? '제목' : lang === 'en' ? 'Title' : 'Judul'}
          </Text>
          <TextInput
            style={s.titleInput}
            placeholder={
              lang === 'ko' ? '제목을 입력하세요' :
              lang === 'en' ? 'Enter a title...' :
              'Tuliskan judul postingan...'
            }
            placeholderTextColor={Colors.grayLight}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <Text style={s.charCount}>{title.length}/100</Text>
        </View>

        {/* Body input */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>
            {lang === 'ko' ? '내용' : lang === 'en' ? 'Content' : 'Isi'}
          </Text>
          <TextInput
            style={s.bodyInput}
            placeholder={
              lang === 'ko' ? '내용을 자유롭게 적어주세요...' :
              lang === 'en' ? 'Share your thoughts freely...' :
              'Tulis isi postingan kamu...'
            }
            placeholderTextColor={Colors.grayLight}
            value={body}
            onChangeText={setBody}
            multiline
            textAlignVertical="top"
            maxLength={1000}
          />
          <Text style={s.charCount}>{body.length}/1000</Text>
        </View>

        {/* Anonymous toggle */}
        <TouchableOpacity
          style={s.anonRow}
          onPress={() => setIsAnon(!isAnon)}
          activeOpacity={0.75}
        >
          <View style={[s.checkbox, isAnon && s.checkboxActive]}>
            {isAnon && <Ionicons name="checkmark" size={12} color={Colors.white} />}
          </View>
          <View style={s.anonInfo}>
            <Text style={s.anonLabel}>
              {lang === 'ko' ? '익명으로 게시' : lang === 'en' ? 'Post anonymously' : 'Posting anonim'}
            </Text>
            <Text style={s.anonSub}>
              {lang === 'ko' ? '이름이 "익명"으로 표시됩니다' :
               lang === 'en' ? 'Your name will appear as "Anon"' :
               'Nama kamu akan muncul sebagai "Anonim"'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Preview card */}
        {(title.trim() || body.trim()) ? (
          <View style={s.previewSection}>
            <Text style={s.previewLabel}>
              {lang === 'ko' ? '미리보기' : lang === 'en' ? 'Preview' : 'Pratinjau'}
            </Text>
            <View style={s.previewCard}>
              <View style={s.previewTop}>
                <View style={[s.previewCatTag, { backgroundColor: selectedCat.bg }]}>
                  <Text style={[s.previewCatText, { color: selectedCat.color }]}>
                    {selectedCat.emoji} {catLabel(selectedCat)}
                  </Text>
                </View>
              </View>
              {title ? <Text style={s.previewTitle}>{title}</Text> : null}
              {body ? <Text style={s.previewBody} numberOfLines={2}>{body}</Text> : null}
              <Text style={s.previewAuthor}>
                {isAnon ? (lang === 'ko' ? '익명' : lang === 'en' ? 'Anon' : 'Anonim') : (lang === 'ko' ? '나' : 'Me')}
                {' · '}
                {lang === 'ko' ? '방금 전' : lang === 'en' ? 'Just now' : 'Baru saja'}
              </Text>
            </View>
          </View>
        ) : null}

        <View style={{ height: 60 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },

  header: {
    paddingHorizontal: 16, paddingBottom: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.dark },
  submitBtn: {
    backgroundColor: Colors.accent, borderRadius: Radius.pill,
    paddingHorizontal: 18, paddingVertical: 8,
  },
  submitBtnDisabled: { backgroundColor: Colors.grayLight },
  submitBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },

  form: { flex: 1, paddingHorizontal: 20 },

  section: { paddingTop: 20 },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: Colors.gray, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },

  catWrap: { height: 44 },
  catRow: { gap: 8, alignItems: 'center' },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.borderMid,
    paddingHorizontal: 12, paddingVertical: 7,
    backgroundColor: Colors.white,
  },
  catEmoji:    { fontSize: 13 },
  catChipText: { fontSize: 13, color: Colors.gray },

  titleInput: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 16, fontWeight: '600', color: Colors.dark,
    backgroundColor: Colors.section,
  },

  bodyInput: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: Colors.dark,
    backgroundColor: Colors.section,
    minHeight: 140,
    lineHeight: 22,
  },

  charCount: { fontSize: 11, color: Colors.grayLight, textAlign: 'right', marginTop: 4 },

  anonRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    paddingVertical: 20, borderTopWidth: 1, borderTopColor: Colors.border,
    marginTop: 20,
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 1.5, borderColor: Colors.borderMid,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  checkboxActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  anonInfo: { flex: 1 },
  anonLabel: { fontSize: 14, fontWeight: '600', color: Colors.dark, marginBottom: 2 },
  anonSub:   { fontSize: 12, color: Colors.gray },

  previewSection: { paddingTop: 20 },
  previewLabel: { fontSize: 12, fontWeight: '600', color: Colors.gray, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  previewCard: {
    borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingTop: 14, paddingBottom: 12,
    backgroundColor: Colors.section,
  },
  previewTop: { marginBottom: 8 },
  previewCatTag: { alignSelf: 'flex-start', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 3 },
  previewCatText: { fontSize: 11, fontWeight: '700' },
  previewTitle: { fontSize: 15, fontWeight: '600', color: Colors.dark, marginBottom: 5 },
  previewBody:  { fontSize: 13, color: Colors.gray, lineHeight: 19, marginBottom: 8 },
  previewAuthor: { fontSize: 12, color: Colors.grayLight },
});
