import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Image, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { RootStackParamList, ChatMessage } from '../../types';
import { useLanguageStore } from '../../store/languageStore';
import { useAuthStore } from '../../store/authStore';
import { useChatStore, ChatThreadRec, CUSTOMER_ME, HELPER_ME } from '../../store/chatStore';
import { translateText, TargetLang } from '../../utils/translate';
import { DEMO_CHAT_MSG, DEMO_TRANSLATIONS } from '../../constants/demoStrings';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatDetail'>;

const EMPTY: ChatMessage[] = [];

export default function ChatDetailScreen({ navigation, route }: Props) {
  const { chatId, name, photo, role } = route.params;
  const { t, lang } = useLanguageStore();
  const insets = useSafeAreaInsets();

  const user = useAuthStore((s) => s.user);
  const meId = user?.id ?? 'cust-me';
  const myRole = user?.role ?? 'customer';
  const myName = user?.name ?? '나';

  const messages = useChatStore((s) => s.messagesByThread[chatId] ?? EMPTY);
  const ensureThread = useChatStore((s) => s.ensureThread);
  const sendMessage  = useChatStore((s) => s.sendMessage);
  const markRead     = useChatStore((s) => s.markRead);

  // 스레드 없으면 생성 + 읽음 처리.
  // 어느 진입점이든 상대를 데모 고정 신원(헬퍼=helper-me / 고객=cust-me)으로 잡아
  // 역할 전환 시 같은 스레드를 양쪽에서 보게 함.
  useEffect(() => {
    // 데모 고정 신원으로 대화방 구성 → 양쪽 기기에서 이름/사진(이성기↔Sari Dewi)이 일관되게 보임
    const rec: ChatThreadRec = { id: chatId, customer: CUSTOMER_ME, helper: HELPER_ME };
    ensureThread(rec);
    markRead(chatId, meId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  const [input, setInput] = useState('');
  // 번역: 기본=번역본 표시. originalIds에 든 메시지만 원문으로 봄.
  const [originalIds, setOriginalIds]   = useState<Set<string>>(new Set());
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loadingIds, setLoadingIds]     = useState<Set<string>>(new Set());
  const listRef = useRef<FlatList>(null);

  // 메시지 언어 감지 → KO↔ID 번역 (한글이면 인니어로, 아니면 한국어로)
  const targetFor = (text: string): TargetLang => (/[가-힣]/.test(text) ? 'id' : 'ko');

  // 받은 메시지는 자동으로 미리 번역해 두기 (기본이 번역본이므로)
  useEffect(() => {
    messages.forEach((m) => {
      if (m.senderId === meId) return;
      if (translations[m.id] || loadingIds.has(m.id)) return;
      const target = targetFor(m.text);
      // 시드 번역 또는 데모 목번역이 있으면 즉시 사용 (라이브 호출로 인한 버벅임 방지)
      const mock = m.translation?.[target] ?? DEMO_TRANSLATIONS[m.text]?.[target];
      if (mock) { setTranslations((prev) => ({ ...prev, [m.id]: mock })); return; }
      setLoadingIds((prev) => new Set(prev).add(m.id));
      translateText(m.text, target).then((res) => {
        setLoadingIds((prev) => { const n = new Set(prev); n.delete(m.id); return n; });
        if (res) setTranslations((prev) => ({ ...prev, [m.id]: res }));
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // 원문 ↔ 번역본 토글
  const toggleOriginal = (m: ChatMessage) =>
    setOriginalIds((prev) => { const n = new Set(prev); n.has(m.id) ? n.delete(m.id) : n.add(m.id); return n; });

  const send = () => {
    const text = input.trim();
    if (!text) return;
    sendMessage(chatId, meId, text);
    setInput('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const roleLabel = role === 'tutor' ? t.services.tutorFull : role === 'helper' ? t.auth.helper : t.auth.customer;
  const roleColor = role === 'tutor' ? Colors.tutorColor : role === 'helper' ? Colors.helperColor : Colors.gray;

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <View style={s.headerAvatarWrap}>
          {photo ? (
            <Image source={{ uri: photo }} style={s.headerAvatar} />
          ) : (
            <View style={[s.headerAvatar, s.headerAvatarFallback]}>
              <Text style={s.headerAvatarLetter}>{name.charAt(0)}</Text>
            </View>
          )}
          {/* Online dot */}
          <View style={s.onlineDot} />
        </View>
        <View style={s.headerInfo}>
          <Text style={s.headerName}>{name}</Text>
          <Text style={[s.headerRole, { color: roleColor }]}>{roleLabel} · {t.chat.online}</Text>
        </View>
        <TouchableOpacity style={s.callBtn} onPress={() => Alert.alert(
          t.chat.title,
          'Fitur panggilan segera hadir.',
          [{ text: 'OK' }]
        )}>
          <Ionicons name="call-outline" size={20} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        style={s.messageList}
        contentContainerStyle={s.messageContent}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item, index }) => {
          const isMe = item.senderId === meId;
          const showTime =
            index === messages.length - 1 ||
            messages[index + 1]?.time !== item.time;
          const tr = translations[item.id];
          const isTranslating = loadingIds.has(item.id);
          const showingOriginal = originalIds.has(item.id);
          // 기본=번역본. 번역본이 있고 원문보기 토글이 아니면 번역본 표시.
          const displayText = (tr && !showingOriginal) ? tr : item.text;
          const canShowTranslate = !isMe && (tr || isTranslating); // 번역본 있을 때만 토글 노출
          return (
            <View style={[s.bubbleWrap, isMe && s.bubbleWrapMe]}>
              {!isMe && (
                <View style={s.bubbleAvatar}>
                  {photo ? (
                    <Image source={{ uri: photo }} style={s.bubbleAvatarImg} />
                  ) : (
                    <View style={[s.bubbleAvatarImg, s.bubbleAvatarFallback]}>
                      <Text style={s.bubbleAvatarLetter}>{name.charAt(0)}</Text>
                    </View>
                  )}
                </View>
              )}
              <View style={s.bubbleCol}>
                <View style={[s.bubble, isMe ? s.bubbleMe : s.bubbleOther]}>
                  <Text style={[s.bubbleText, isMe && s.bubbleTextMe]}>
                    {displayText}
                  </Text>
                </View>
                {/* 기본은 번역본 표시 · 토글로 원문 보기 */}
                {canShowTranslate && (
                  <TouchableOpacity
                    style={s.translateBtn}
                    onPress={() => toggleOriginal(item)}
                    activeOpacity={0.7}
                    disabled={isTranslating}
                  >
                    <Ionicons
                      name={showingOriginal ? 'language' : 'language-outline'}
                      size={11}
                      color={Colors.gray}
                    />
                    <Text style={s.translateBtnText}>
                      {isTranslating ? '...' : showingOriginal ? t.chat.translate : t.chat.showOriginal}
                    </Text>
                  </TouchableOpacity>
                )}
                {showTime && (
                  <Text style={[s.bubbleTime, isMe && s.bubbleTimeMe]}>{item.time}</Text>
                )}
              </View>
            </View>
          );
        }}
      />

      {/* Input bar */}
      <View style={s.inputBar}>
        <TouchableOpacity style={s.attachBtn} onPress={() => Alert.alert('', 'Fitur lampiran segera hadir.', [{ text: 'OK' }])}>
          <Ionicons name="add-circle-outline" size={24} color={Colors.grayLight} />
        </TouchableOpacity>
        <TextInput
          style={s.input}
          placeholder={t.chat.typeMessage}
          placeholderTextColor={Colors.grayLight}
          value={input}
          onChangeText={setInput}
          onFocus={() => { if (!input && myRole === 'customer') setInput(DEMO_CHAT_MSG); }}
          multiline
          returnKeyType="send"
          onSubmitEditing={send}
        />
        <TouchableOpacity
          style={[s.sendBtn, input.trim().length > 0 && s.sendBtnActive]}
          onPress={send}
          activeOpacity={0.85}
        >
          <Ionicons
            name="send"
            size={18}
            color={input.trim().length > 0 ? Colors.white : Colors.grayLight}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.section },

  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white,
    paddingBottom: 12,
    paddingHorizontal: 16, gap: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  headerAvatarWrap: { position: 'relative' },
  headerAvatar: { width: 40, height: 40, borderRadius: 20 },
  headerAvatarFallback: {
    backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center',
  },
  headerAvatarLetter: { fontSize: 16, fontWeight: '700', color: Colors.accent },
  onlineDot: {
    position: 'absolute', bottom: 0, right: 0,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.success,
    borderWidth: 2, borderColor: Colors.white,
  },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 15, fontWeight: '700', color: Colors.dark },
  headerRole: { fontSize: 12, fontWeight: '500' },
  callBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center',
  },

  messageList:    { flex: 1 },
  messageContent: { paddingHorizontal: 16, paddingVertical: 16, gap: 4 },

  bubbleWrap:   { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 8 },
  bubbleWrapMe: { flexDirection: 'row-reverse' },

  bubbleAvatar: {},
  bubbleAvatarImg: { width: 28, height: 28, borderRadius: 14 },
  bubbleAvatarFallback: {
    backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center',
  },
  bubbleAvatarLetter: { fontSize: 11, fontWeight: '700', color: Colors.accent },

  // bubble + 번역 버튼 + 시간을 하나의 컬럼으로 묶음
  bubbleCol: { maxWidth: '72%', flexShrink: 1 },

  bubble: {
    borderRadius: Radius.lg,
    paddingHorizontal: 14, paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  bubbleOther: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    ...Shadow.sm,
  },
  bubbleMe: {
    backgroundColor: Colors.accent,
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
  },
  bubbleText:   { fontSize: 14, color: Colors.dark, lineHeight: 20 },
  bubbleTextMe: { color: Colors.white },

  bubbleTime:   { fontSize: 10, color: Colors.grayLight, alignSelf: 'flex-end', marginTop: 2 },
  bubbleTimeMe: { alignSelf: 'flex-start' },

  // 번역 버튼 — 작고, 회색 톤, 배경 없음 (튀지 않게)
  translateBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingTop: 4, paddingHorizontal: 6,
    alignSelf: 'flex-start',
  },
  translateBtnText: {
    fontSize: 11, color: Colors.gray, fontWeight: '500',
  },

  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    backgroundColor: Colors.white,
    paddingHorizontal: 12, paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  attachBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  input: {
    flex: 1,
    backgroundColor: Colors.section,
    borderRadius: Radius.pill,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 14, color: Colors.dark,
    maxHeight: 100,
    borderWidth: 1, borderColor: Colors.border,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnActive: { backgroundColor: Colors.accent },
});
