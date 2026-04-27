import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius } from '../../constants/colors';
import { useLanguageStore } from '../../store/languageStore';
import { useAuthStore } from '../../store/authStore';
import { RootStackParamList } from '../../types';
import { C1, C2, C3, C4, C5, C6 } from '../../constants/photos';

type Props = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  popular:  { bg: '#FFF7ED', color: '#EA580C' },
  chat:     { bg: Colors.section, color: Colors.gray },
  tips:     { bg: '#F0FDF4', color: '#16A34A' },
  ask:      { bg: '#EFF6FF', color: '#2563EB' },
  announce: { bg: '#F5F3FF', color: '#7C3AED' },
};

interface MockComment {
  id: string;
  author: string;
  photo?: string;
  text: string;
  time: string;
  likes: number;
  isLiked: boolean;
}

const MOCK_COMMENTS_ID: MockComment[] = [
  { id: 'c1', author: 'Bunda Ratna',  photo: C1, text: 'Setuju banget! Saya juga baru pakai ART bulan lalu, langsung kerasa bedanya 😊', time: '18 mnt lalu', likes: 5, isLiked: false },
  { id: 'c2', author: 'Bunda Indah',  photo: C2, text: 'Kontraknya perlu banget, ada yang bisa share template-nya nggak?', time: '25 mnt lalu', likes: 12, isLiked: true },
  { id: 'c3', author: 'Bunda Sari',   photo: C3, text: 'Yang penting cek surat keterangan domisili ya, biar lebih aman!', time: '1 jam lalu', likes: 8, isLiked: false },
  { id: 'c4', author: 'Bunda Dewi',   photo: C4, text: 'Di Linka semua ART sudah terverifikasi, jadi lebih tenang', time: '2 jam lalu', likes: 19, isLiked: false },
  { id: 'c5', author: 'Bunda Putri',  photo: C5, text: 'Kalau dari Linka tinggal pakai aja, dokumennya sudah lengkap 👍', time: '3 jam lalu', likes: 7, isLiked: false },
];

const MOCK_COMMENTS_KO: MockComment[] = [
  { id: 'c1', author: '익명 맘',  photo: C1, text: '완전 동의해요! 저도 지난달에 ART 쓰기 시작했는데 확실히 다르네요 😊', time: '18분 전', likes: 5, isLiked: false },
  { id: 'c2', author: '두 아이 맘', photo: C2, text: '계약서 진짜 필요해요. 템플릿 공유해주실 수 있나요?', time: '25분 전', likes: 12, isLiked: true },
  { id: 'c3', author: '새내기 맘', photo: C3, text: '주민등록증 꼭 확인하세요, 더 안전해요!', time: '1시간 전', likes: 8, isLiked: false },
  { id: 'c4', author: '세 아이 맘', photo: C4, text: 'Linka ART는 다 검증됐으니까 걱정 없어요', time: '2시간 전', likes: 19, isLiked: false },
  { id: 'c5', author: '청결 맘', photo: C5, text: 'Linka에서 고르면 서류 다 되어 있어서 편해요 👍', time: '3시간 전', likes: 7, isLiked: false },
];

const MOCK_COMMENTS_EN: MockComment[] = [
  { id: 'c1', author: 'Anon Mom',   photo: C1, text: 'Totally agree! I started using ART last month and it made such a difference 😊', time: '18 min ago', likes: 5, isLiked: false },
  { id: 'c2', author: 'Mom of 2',   photo: C2, text: 'A contract is a must. Can someone share a template?', time: '25 min ago', likes: 12, isLiked: true },
  { id: 'c3', author: 'New Mom',    photo: C3, text: 'Always check their ID card — much safer!', time: '1 hr ago', likes: 8, isLiked: false },
  { id: 'c4', author: 'Mom of 3',   photo: C4, text: 'Linka ART are all verified so no worries', time: '2 hrs ago', likes: 19, isLiked: false },
  { id: 'c5', author: 'Clean Mom',  photo: C5, text: 'Booking through Linka is easy, all docs ready 👍', time: '3 hrs ago', likes: 7, isLiked: false },
];

export default function PostDetailScreen({ navigation, route }: Props) {
  const { title, category, author, time, preview, comments: commentCount, likes: likeCount } = route.params;
  const { lang } = useLanguageStore();
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const mockComments = lang === 'ko' ? MOCK_COMMENTS_KO : lang === 'en' ? MOCK_COMMENTS_EN : MOCK_COMMENTS_ID;
  const [commentsList, setCommentsList] = useState<MockComment[]>(mockComments);
  const [input, setInput] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeTotal, setLikeTotal] = useState(likeCount);

  const tagStyle = CATEGORY_COLORS[category] ?? { bg: Colors.section, color: Colors.gray };

  const catLabel = (): string => {
    const map: Record<string, Record<string, string>> = {
      popular:  { id: 'Populer', en: 'Popular',  ko: '인기' },
      chat:     { id: 'Ngobrol', en: 'Chat',      ko: '잡담' },
      tips:     { id: 'Tips',    en: 'Tips',      ko: '팁' },
      ask:      { id: 'Tanya',   en: 'Ask',       ko: '질문' },
      announce: { id: 'Info',    en: 'Announce',  ko: '공지' },
    };
    return map[category]?.[lang] ?? category;
  };

  const sendComment = () => {
    if (!input.trim()) return;
    const newComment: MockComment = {
      id: `c${Date.now()}`,
      author: user?.name ?? (lang === 'ko' ? '나' : 'Me'),
      text: input.trim(),
      time: lang === 'ko' ? '방금 전' : lang === 'en' ? 'Just now' : 'Baru saja',
      likes: 0, isLiked: false,
    };
    setCommentsList((prev) => [newComment, ...prev]);
    setInput('');
  };

  const toggleCommentLike = (id: string) => {
    setCommentsList((prev) =>
      prev.map((c) => c.id === id
        ? { ...c, likes: c.isLiked ? c.likes - 1 : c.likes + 1, isLiked: !c.isLiked }
        : c
      )
    );
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={s.headerTitle} numberOfLines={1}>
          {lang === 'ko' ? '게시글' : lang === 'en' ? 'Post' : 'Postingan'}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Post body */}
        <View style={s.postCard}>
          <View style={s.postTop}>
            <View style={[s.catTag, { backgroundColor: tagStyle.bg }]}>
              <Text style={[s.catTagText, { color: tagStyle.color }]}>{catLabel()}</Text>
            </View>
            <Text style={s.postTime}>{time}</Text>
          </View>

          <Text style={s.postTitle}>{title}</Text>
          <Text style={s.postBody}>{preview}</Text>
          <Text style={s.postBodyExtra}>
            {lang === 'ko'
              ? '이 글에 공감하시나요? 댓글로 여러분의 생각을 나눠주세요!'
              : lang === 'en'
              ? 'Can you relate? Share your thoughts in the comments below!'
              : 'Apakah kamu setuju? Bagikan pendapatmu di kolom komentar di bawah!'}
          </Text>

          <View style={s.postFooter}>
            <Text style={s.postAuthor}>{author}</Text>
            <View style={s.metaRow}>
              <TouchableOpacity
                style={s.likeBtn}
                onPress={() => {
                  setLiked(!liked);
                  setLikeTotal((n) => liked ? n - 1 : n + 1);
                }}
              >
                <Ionicons
                  name={liked ? 'heart' : 'heart-outline'}
                  size={14}
                  color={liked ? '#EF4444' : Colors.grayLight}
                />
                <Text style={[s.metaNum, liked && { color: '#EF4444' }]}>{likeTotal}</Text>
              </TouchableOpacity>
              <Ionicons name="chatbubble-outline" size={14} color={Colors.grayLight} />
              <Text style={s.metaNum}>{commentsList.length}</Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={s.divider}>
          <Text style={s.dividerText}>
            {lang === 'ko' ? `댓글 ${commentsList.length}개` : lang === 'en' ? `${commentsList.length} Comments` : `${commentsList.length} Komentar`}
          </Text>
        </View>

        {/* Comments */}
        {commentsList.map((c) => (
          <View key={c.id} style={s.commentRow}>
            {c.photo ? (
              <Image source={{ uri: c.photo }} style={s.commentAvatar} />
            ) : (
              <View style={[s.commentAvatar, s.commentAvatarFallback]}>
                <Text style={s.commentAvatarLetter}>{c.author.charAt(0)}</Text>
              </View>
            )}
            <View style={s.commentBody}>
              <View style={s.commentTopRow}>
                <Text style={s.commentAuthor}>{c.author}</Text>
                <Text style={s.commentTime}>{c.time}</Text>
              </View>
              <Text style={s.commentText}>{c.text}</Text>
              <TouchableOpacity style={s.commentLikeBtn} onPress={() => toggleCommentLike(c.id)}>
                <Ionicons
                  name={c.isLiked ? 'heart' : 'heart-outline'}
                  size={12}
                  color={c.isLiked ? '#EF4444' : Colors.grayLight}
                />
                <Text style={[s.commentLikeNum, c.isLiked && { color: '#EF4444' }]}>{c.likes}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Comment input bar */}
      <View style={s.inputBar}>
        <TextInput
          style={s.commentInput}
          placeholder={
            lang === 'ko' ? '댓글 달기...' :
            lang === 'en' ? 'Write a comment...' :
            'Tulis komentar...'
          }
          placeholderTextColor={Colors.grayLight}
          value={input}
          onChangeText={setInput}
          returnKeyType="send"
          onSubmitEditing={sendComment}
        />
        <TouchableOpacity
          style={[s.sendBtn, !input.trim() && s.sendBtnDisabled]}
          onPress={sendComment}
          activeOpacity={0.8}
        >
          <Ionicons name="send" size={16} color={input.trim() ? Colors.white : Colors.grayLight} />
        </TouchableOpacity>
      </View>
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
  backBtn:     { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: Colors.dark, textAlign: 'center' },

  scroll: { flex: 1 },

  postCard: {
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  postTop:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  catTag:   { borderRadius: 5, paddingHorizontal: 8, paddingVertical: 3 },
  catTagText: { fontSize: 11, fontWeight: '700' },
  postTime: { fontSize: 11, color: Colors.grayLight },
  postTitle:     { fontSize: 18, fontWeight: '700', color: Colors.dark, lineHeight: 26, marginBottom: 12 },
  postBody:      { fontSize: 14, color: Colors.darkMid, lineHeight: 22, marginBottom: 10 },
  postBodyExtra: { fontSize: 14, color: Colors.gray, lineHeight: 22, marginBottom: 16 },
  postFooter:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border },
  postAuthor:    { fontSize: 13, color: Colors.grayLight },
  metaRow:       { flexDirection: 'row', alignItems: 'center', gap: 8 },
  likeBtn:       { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaNum:       { fontSize: 13, color: Colors.grayLight },

  divider: { paddingHorizontal: 20, paddingVertical: 14, backgroundColor: Colors.section, borderBottomWidth: 1, borderBottomColor: Colors.border },
  dividerText: { fontSize: 13, fontWeight: '600', color: Colors.dark },

  commentRow: {
    flexDirection: 'row', gap: 12,
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  commentAvatar: { width: 36, height: 36, borderRadius: 18 },
  commentAvatarFallback: {
    backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center',
  },
  commentAvatarLetter: { fontSize: 14, fontWeight: '700', color: Colors.accent },
  commentBody:   { flex: 1 },
  commentTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  commentAuthor: { fontSize: 13, fontWeight: '600', color: Colors.dark },
  commentTime:   { fontSize: 11, color: Colors.grayLight },
  commentText:   { fontSize: 13, color: Colors.darkMid, lineHeight: 19, marginBottom: 6 },
  commentLikeBtn:{ flexDirection: 'row', alignItems: 'center', gap: 4 },
  commentLikeNum:{ fontSize: 12, color: Colors.grayLight },

  inputBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  commentInput: {
    flex: 1,
    backgroundColor: Colors.section, borderRadius: Radius.pill,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 14, color: Colors.dark,
    borderWidth: 1, borderColor: Colors.border,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.section },
});
