import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { W1, W2, W3, C1, C2, C3 } from '../../constants/photos';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import { RootStackParamList, ChatThread } from '../../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// Mock chat threads for customer
const CUSTOMER_CHATS: ChatThread[] = [
  {
    id: 'ch1',
    name: 'Sari Dewi',
    photo: W1,
    role: 'helper',
    lastMessage: 'Baik bu, saya akan datang jam 9 pagi ya',
    time: '10:32',
    unread: 2,
    orderId: 'o1',
  },
  {
    id: 'ch2',
    name: 'Rina Wulandari',
    photo: W2,
    role: 'helper',
    lastMessage: 'Sudah selesai bersih-bersih bu, terima kasih 🙏',
    time: 'Kemarin',
    unread: 0,
    orderId: 'o2',
  },
  {
    id: 'ch3',
    name: 'Dewi Anggraeni',
    photo: W3,
    role: 'helper',
    lastMessage: 'Besok saya bisa datang jam 8 pagi ya bu',
    time: 'Sen',
    unread: 0,
  },
];

// Mock chat threads for worker
const WORKER_CHATS: ChatThread[] = [
  {
    id: 'wch1',
    name: 'Bunda Wulandari',
    photo: C1,
    role: 'customer',
    lastMessage: 'Oke, ditunggu ya besok jam 9 pagi',
    time: '10:32',
    unread: 1,
    orderId: 'wo1',
  },
  {
    id: 'wch2',
    name: 'Bunda Indah',
    photo: C2,
    role: 'customer',
    lastMessage: 'Terima kasih banyak, rumah jadi bersih!',
    time: 'Kemarin',
    unread: 0,
    orderId: 'wo2',
  },
  {
    id: 'wch3',
    name: 'Bunda Tari',
    photo: C3,
    role: 'customer',
    lastMessage: 'Bisa mulai lebih awal tidak?',
    time: 'Ming',
    unread: 3,
  },
];

export default function ChatListScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuthStore();
  const { t } = useLanguageStore();

  const isWorker = user?.role === 'helper';
  const chats = isWorker ? WORKER_CHATS : CUSTOMER_CHATS;
  const totalUnread = chats.reduce((sum, c) => sum + c.unread, 0);

  const openChat = (chat: ChatThread) => {
    navigation.navigate('ChatDetail', {
      chatId: chat.id,
      name: chat.name,
      photo: chat.photo,
      role: chat.role,
    });
  };

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerRow}>
          <Text style={s.pageTitle}>{t.chat.title}</Text>
          {totalUnread > 0 && (
            <View style={s.unreadBadge}>
              <Text style={s.unreadBadgeText}>{totalUnread}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={s.list} showsVerticalScrollIndicator={false}>
        {chats.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="chatbubble-ellipses-outline" size={40} color={Colors.grayLight} />
            <Text style={s.emptyTitle}>{t.chat.noMessages}</Text>
            <Text style={s.emptyText}>{isWorker ? t.chat.noMessagesDescWorker : t.chat.noMessagesDescCustomer}</Text>
          </View>
        ) : (
          chats.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              style={s.chatRow}
              onPress={() => openChat(chat)}
              activeOpacity={0.85}
            >
              {/* Avatar */}
              <View style={s.avatarWrap}>
                {chat.photo ? (
                  <Image source={{ uri: chat.photo }} style={s.avatar} />
                ) : (
                  <View style={[s.avatar, s.avatarFallback]}>
                    <Text style={s.avatarLetter}>{chat.name.charAt(0)}</Text>
                  </View>
                )}
                {/* Role indicator dot */}
                <View style={[
                  s.roleDot,
                  { backgroundColor: chat.role === 'helper' ? Colors.helperColor : Colors.gray },
                ]} />
              </View>

              {/* Content */}
              <View style={s.chatContent}>
                <View style={s.chatTopRow}>
                  <Text style={s.chatName}>{chat.name}</Text>
                  <Text style={[s.chatTime, chat.unread > 0 && s.chatTimeUnread]}>{chat.time}</Text>
                </View>
                <View style={s.chatBottomRow}>
                  <Text
                    style={[s.chatLastMsg, chat.unread > 0 && s.chatLastMsgUnread]}
                    numberOfLines={1}
                  >
                    {chat.lastMessage}
                  </Text>
                  {chat.unread > 0 && (
                    <View style={s.unreadDot}>
                      <Text style={s.unreadDotText}>{chat.unread}</Text>
                    </View>
                  )}
                </View>
                {chat.orderId && (
                  <View style={s.orderTag}>
                    <Ionicons name="receipt-outline" size={10} color={Colors.accent} />
                    <Text style={s.orderTagText}>{t.chat.relatedOrder}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },

  header: {
    paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pageTitle: { fontSize: 22, fontWeight: '700', color: Colors.dark },
  unreadBadge: {
    backgroundColor: Colors.accent, borderRadius: Radius.pill,
    minWidth: 22, height: 22, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: { fontSize: 12, fontWeight: '700', color: Colors.white },

  list: { flex: 1 },

  empty: { alignItems: 'center', paddingTop: 72, gap: 10, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: Colors.dark },
  emptyText:  { fontSize: 13, color: Colors.gray, textAlign: 'center' },

  chatRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: 20, paddingVertical: 16, gap: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
  },
  avatarFallback: {
    backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarLetter: { fontSize: 20, fontWeight: '700', color: Colors.accent },
  roleDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 12, height: 12, borderRadius: 6,
    borderWidth: 2, borderColor: Colors.white,
  },

  chatContent: { flex: 1 },
  chatTopRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  chatName:    { fontSize: 15, fontWeight: '600', color: Colors.dark },
  chatTime:    { fontSize: 12, color: Colors.grayLight },
  chatTimeUnread: { color: Colors.accent, fontWeight: '600' },

  chatBottomRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chatLastMsg:   { flex: 1, fontSize: 13, color: Colors.gray },
  chatLastMsgUnread: { color: Colors.darkMid, fontWeight: '500' },

  unreadDot: {
    backgroundColor: Colors.accent, borderRadius: Radius.pill,
    minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadDotText: { fontSize: 11, fontWeight: '700', color: Colors.white },

  orderTag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginTop: 5,
  },
  orderTagText: { fontSize: 11, color: Colors.accent, fontWeight: '500' },
});
