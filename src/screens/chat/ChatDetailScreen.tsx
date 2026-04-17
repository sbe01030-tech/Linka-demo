import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { RootStackParamList, ChatMessage } from '../../types';
import { useLanguageStore } from '../../store/languageStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatDetail'>;

const MOCK_MESSAGES: ChatMessage[] = [
  { id: 'm1', from: 'other', text: 'Halo, saya sudah terima pesanan Anda. Ada yang perlu saya siapkan?', time: '09:00', read: true },
  { id: 'm2', from: 'me',    text: 'Halo! Tolong datang tepat waktu ya, jam 8 pagi', time: '09:02', read: true },
  { id: 'm3', from: 'other', text: 'Siap, saya akan pastikan hadir tepat waktu. Apakah ada permintaan khusus?', time: '09:03', read: true },
  { id: 'm4', from: 'me',    text: 'Tidak ada, yang penting bersih dan rapi ya', time: '09:05', read: true },
  { id: 'm5', from: 'other', text: 'Tentu! Saya sudah 5 tahun pengalaman. Tidak perlu khawatir 😊', time: '09:06', read: true },
  { id: 'm6', from: 'other', text: 'Baik bu, saya akan datang jam 8 pagi ya', time: '10:32', read: false },
];

export default function ChatDetailScreen({ navigation, route }: Props) {
  const { name, photo, role } = route.params;
  const { t } = useLanguageStore();
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const msg: ChatMessage = {
      id: `m${Date.now()}`,
      from: 'me',
      text,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setMessages((prev) => [...prev, msg]);
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
      <View style={s.header}>
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
        <TouchableOpacity style={s.callBtn}>
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
          const isMe = item.from === 'me';
          const showTime =
            index === messages.length - 1 ||
            messages[index + 1]?.time !== item.time;
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
              <View style={[s.bubble, isMe ? s.bubbleMe : s.bubbleOther]}>
                <Text style={[s.bubbleText, isMe && s.bubbleTextMe]}>{item.text}</Text>
              </View>
              {showTime && (
                <Text style={[s.bubbleTime, isMe && s.bubbleTimeMe]}>{item.time}</Text>
              )}
            </View>
          );
        }}
      />

      {/* Input bar */}
      <View style={s.inputBar}>
        <TouchableOpacity style={s.attachBtn}>
          <Ionicons name="add-circle-outline" size={24} color={Colors.grayLight} />
        </TouchableOpacity>
        <TextInput
          style={s.input}
          placeholder={t.chat.typeMessage}
          placeholderTextColor={Colors.grayLight}
          value={input}
          onChangeText={setInput}
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
    paddingTop: 52, paddingBottom: 12,
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

  bubble: {
    maxWidth: '72%', borderRadius: Radius.lg,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  bubbleOther: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    ...Shadow.sm,
  },
  bubbleMe: {
    backgroundColor: Colors.accent,
    borderBottomRightRadius: 4,
  },
  bubbleText:   { fontSize: 14, color: Colors.dark, lineHeight: 20 },
  bubbleTextMe: { color: Colors.white },

  bubbleTime:   { fontSize: 10, color: Colors.grayLight, alignSelf: 'flex-end', marginTop: 2 },
  bubbleTimeMe: { alignSelf: 'flex-start' },

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
