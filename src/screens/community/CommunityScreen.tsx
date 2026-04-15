import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { useLanguageStore } from '../../store/languageStore';
import { LangCode } from '../../i18n';
import { CommunityPost } from '../../types';

type CategoryKey = 'all' | 'popular' | 'chat' | 'tips' | 'ask' | 'announce';

const CATEGORY_KEYS: CategoryKey[] = ['all', 'popular', 'chat', 'tips', 'ask', 'announce'];

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  popular:  { bg: '#FFF7ED', color: '#EA580C' },
  chat:     { bg: Colors.section, color: Colors.gray },
  tips:     { bg: '#F0FDF4', color: '#16A34A' },
  ask:      { bg: '#EFF6FF', color: '#2563EB' },
  announce: { bg: '#F5F3FF', color: '#7C3AED' },
};

type PostData = CommunityPost & { isPinned?: boolean };

function getPosts(lang: LangCode): PostData[] {
  if (lang === 'ko') return [
    { id: 'p1', category: 'popular', title: 'ART 새로 구했는데, 처음에 뭘 확인해야 할까요?', preview: '처음 ART를 써보려는데, 체크리스트 같은 게 있을까요? 계약서도 필요한가요?', author: '익명', time: '23분 전', comments: 12, likes: 34 },
    { id: 'p2', category: 'tips', title: '초등 수학 과외, 몇 학년부터 시작하는 게 좋을까요?', preview: '주변에서 3학년부터 많이 시작하던데, 여러분은 어떻게 생각하세요?', author: '두 아이 맘', time: '1시간 전', comments: 28, likes: 61 },
    { id: 'p3', category: 'chat', title: '남편이 집안일 안 도와줘서 스트레스...', preview: '같이 일하는데 집은 제가 다 해요. ART 쓰는 게 나을까요?', author: '익명', time: '2시간 전', comments: 47, likes: 132 },
    { id: 'p4', category: 'ask', title: '영어 과외 선생님, 일주일에 1번 vs 2번 어떻게 생각하세요?', preview: '초등학교 3학년 아이, 스피킹이 목표예요. 1번으로 시작하는 게 좋을까요?', author: '영어 맘', time: '3시간 전', comments: 19, likes: 44 },
    { id: 'p5', category: 'tips', title: '일일 요리 도우미 진짜 시간 절약돼요!', preview: '처음엔 비쌀 것 같았는데, 건강하게 먹고 시간도 절약돼서 강추합니다!', author: '세 아이 맘', time: '4시간 전', comments: 33, likes: 89 },
    { id: 'p6', category: 'popular', title: '과외 선생님한테 간식 준비해야 하나요?', preview: '집으로 오시는 선생님한테 음료나 간식 드리는 게 예의인가요?', author: '새내기 맘', time: '5시간 전', comments: 56, likes: 178 },
    { id: 'p7', category: 'chat', title: '오늘 청소 도우미 불렀는데 집이 반짝반짝!', preview: '구석구석 다 청소해주시고 냄새도 없어졌어요. 다음 달에 또 부를게요 😄', author: '청결 맘', time: '어제', comments: 8, likes: 27 },
  ];
  if (lang === 'en') return [
    { id: 'p1', category: 'popular', title: 'New housekeeper — what should I prepare?', preview: 'First time hiring a housekeeper. Is there a checklist I should follow? Do I need a contract?', author: 'Anon Mom', time: '23 min ago', comments: 12, likes: 34 },
    { id: 'p2', category: 'tips', title: 'Private math tutoring — which grade to start?', preview: 'Many around me start in grade 3. What do you think is the right time to begin?', author: 'Mom of 2', time: '1 hr ago', comments: 28, likes: 61 },
    { id: 'p3', category: 'chat', title: 'Husband won\'t help with housework — so stressed...', preview: 'We both work but I handle everything at home. Would hiring a housekeeper help?', author: 'Anon', time: '2 hrs ago', comments: 47, likes: 132 },
    { id: 'p4', category: 'ask', title: 'English tutoring — once or twice a week?', preview: 'My child is in grade 3, aiming for speaking skills. Is starting once a week better?', author: 'English Mom', time: '3 hrs ago', comments: 19, likes: 44 },
    { id: 'p5', category: 'tips', title: 'Daily cooking service really saves so much time!', preview: 'I thought it would be expensive, but eating healthy and saving time is totally worth it!', author: 'Mom of 3', time: '4 hrs ago', comments: 33, likes: 89 },
    { id: 'p6', category: 'popular', title: 'Should I prepare snacks for the tutor?', preview: 'The tutor comes to our home — is it polite to offer drinks or snacks?', author: 'New Mom', time: '5 hrs ago', comments: 56, likes: 178 },
    { id: 'p7', category: 'chat', title: 'Hired a cleaning service today — house is sparkling!', preview: 'Every corner was cleaned and the smell is gone. Definitely calling them next month 😄', author: 'Clean Mom', time: 'Yesterday', comments: 8, likes: 27 },
  ];
  return [
    { id: 'p1', category: 'popular', title: 'ART baru, apa yang perlu dicek ya?', preview: 'Mau pertama kali pakai ART, ada checklist yang harus disiapkan nggak? Perlu kontrak juga?', author: 'Bunda Anon', time: '23 mnt lalu', comments: 12, likes: 34 },
    { id: 'p2', category: 'tips', title: 'Les privat matematika SD, mulai kelas berapa ya?', preview: 'Di sekitar saya banyak yang mulai kelas 3, gimana menurut Bunda-Bunda di sini?', author: 'Bunda 2 Anak', time: '1 jam lalu', comments: 28, likes: 61 },
    { id: 'p3', category: 'chat', title: 'Suami nggak mau bantu kerjaan rumah, capek...', preview: 'Sama-sama kerja tapi yang beresin rumah saya sendiri. Mending pakai ART aja ya?', author: 'Bunda Anon', time: '2 jam lalu', comments: 47, likes: 132 },
    { id: 'p4', category: 'ask', title: 'Guru les bahasa Inggris, seminggu 1x vs 2x menurut kalian?', preview: 'Anak saya kelas 3 SD, target bisa speaking. Mending mulai 1x atau langsung 2x?', author: 'Bunda English', time: '3 jam lalu', comments: 19, likes: 44 },
    { id: 'p5', category: 'tips', title: 'Jasa masak harian terbukti menghemat waktu banget!', preview: 'Awalnya mikir mahal, tapi ternyata hemat waktu dan makan lebih sehat. Highly recommended!', author: 'Bunda 3 Anak', time: '4 jam lalu', comments: 33, likes: 89 },
    { id: 'p6', category: 'popular', title: 'Perlu siapkan camilan untuk guru les nggak ya?', preview: 'Guru les datang ke rumah, apakah etisnya harus siapin minuman atau snack juga?', author: 'Bunda Baru', time: '5 jam lalu', comments: 56, likes: 178 },
    { id: 'p7', category: 'chat', title: 'Hari ini pakai jasa bersih-bersih, rumah jadi kinclong!', preview: 'Sampai pojok-pojok dibersihin, bau juga hilang. Pasti panggil lagi bulan depan 😄', author: 'Bunda Bersih', time: 'Kemarin', comments: 8, likes: 27 },
  ];
}

export default function CommunityScreen() {
  const { t, lang } = useLanguageStore();
  const [activeTab, setActiveTab]  = useState<CategoryKey>('all');
  const [searchText, setSearchText] = useState('');

  const MOCK_POSTS = getPosts(lang);

  const catLabel = (key: CategoryKey): string => {
    const map: Record<CategoryKey, string> = {
      all:      t.community.filterAll,
      popular:  t.community.catPopular,
      chat:     t.community.catChat,
      tips:     t.community.catTips,
      ask:      t.community.catAsk,
      announce: t.community.catAnnounce,
    };
    return map[key];
  };

  const filtered = MOCK_POSTS.filter((p) => {
    const matchTab    = activeTab === 'all' || p.category === activeTab;
    const matchSearch = searchText === '' ||
      p.title.toLowerCase().includes(searchText.toLowerCase()) ||
      p.preview.toLowerCase().includes(searchText.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerRow}>
          <Text style={s.pageTitle}>{t.community.title}</Text>
          <TouchableOpacity style={s.writeBtn}>
            <Ionicons name="pencil" size={14} color={Colors.white} />
            <Text style={s.writeBtnText}>{t.community.writeBtn}</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={s.searchBar}>
          <Ionicons name="search-outline" size={15} color={Colors.grayLight} />
          <TextInput
            style={s.searchInput}
            placeholder={t.community.searchPlaceholder}
            placeholderTextColor={Colors.grayLight}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={15} color={Colors.grayLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category tabs */}
      <View style={s.tabsWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabsScroll}>
          {CATEGORY_KEYS.map((key) => (
            <TouchableOpacity
              key={key}
              style={[s.tab, activeTab === key && s.tabActive]}
              onPress={() => setActiveTab(key)}
            >
              {key === 'popular'  && <Text style={s.tabEmoji}>🔥</Text>}
              {key === 'tips'     && <Text style={s.tabEmoji}>💡</Text>}
              <Text style={[s.tabText, activeTab === key && s.tabTextActive]}>{catLabel(key)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Post list */}
      <ScrollView style={s.list} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="chatbubble-ellipses-outline" size={40} color={Colors.grayLight} />
            <Text style={s.emptyText}>{t.community.emptyText}</Text>
          </View>
        ) : (
          filtered.map((post, i) => {
            const tagStyle = CATEGORY_COLORS[post.category] ?? { bg: Colors.section, color: Colors.gray };
            return (
              <TouchableOpacity key={post.id} style={s.postCard} activeOpacity={0.85}>
                <View style={s.postTop}>
                  <View style={[s.catTag, { backgroundColor: tagStyle.bg }]}>
                    <Text style={[s.catTagText, { color: tagStyle.color }]}>
                      {catLabel(post.category as CategoryKey)}
                    </Text>
                  </View>
                  <Text style={s.postTime}>{post.time}</Text>
                </View>

                <Text style={s.postTitle}>{post.title}</Text>
                <Text style={s.postPreview} numberOfLines={2}>{post.preview}</Text>

                <View style={s.postFooter}>
                  <Text style={s.postAuthor}>{post.author}</Text>
                  <View style={s.metaRow}>
                    <Ionicons name="chatbubble-outline" size={12} color={Colors.grayLight} />
                    <Text style={s.metaNum}>{post.comments}</Text>
                    <Ionicons name="heart-outline" size={12} color={Colors.grayLight} />
                    <Text style={s.metaNum}>{post.likes}</Text>
                  </View>
                </View>

                {/* Separator */}
                {i < filtered.length - 1 && <View style={s.separator} />}
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* FAB write button */}
      <TouchableOpacity style={s.fab} activeOpacity={0.85}>
        <Ionicons name="create-outline" size={22} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },

  header: {
    paddingTop: 56, paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    gap: 10,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pageTitle: { fontSize: 22, fontWeight: '700', color: Colors.dark },
  writeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.accent, borderRadius: Radius.pill,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  writeBtnText: { fontSize: 13, fontWeight: '700', color: Colors.white },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.section, borderRadius: Radius.pill,
    paddingHorizontal: 14, paddingVertical: 9,
    borderWidth: 1, borderColor: Colors.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.dark },

  tabsWrap: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabsScroll: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  tab: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.borderMid,
    backgroundColor: Colors.white,
  },
  tabActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  tabEmoji:  { fontSize: 12 },
  tabText:       { fontSize: 13, fontWeight: '500', color: Colors.gray },
  tabTextActive: { color: Colors.white, fontWeight: '700' },

  list: { flex: 1 },
  empty: { alignItems: 'center', paddingTop: 72, gap: 12 },
  emptyText: { fontSize: 14, color: Colors.gray },

  postCard: { paddingHorizontal: 16, paddingTop: 16 },
  postTop:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 7 },
  catTag: { borderRadius: 5, paddingHorizontal: 8, paddingVertical: 3 },
  catTagText: { fontSize: 11, fontWeight: '700' },
  postTime: { fontSize: 11, color: Colors.grayLight },

  postTitle:  { fontSize: 15, fontWeight: '600', color: Colors.dark, marginBottom: 5, lineHeight: 22 },
  postPreview:{ fontSize: 13, color: Colors.gray, lineHeight: 19, marginBottom: 10 },

  postFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  postAuthor: { fontSize: 12, color: Colors.grayLight },
  metaRow:    { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaNum:    { fontSize: 12, color: Colors.grayLight },

  separator: { height: 1, backgroundColor: Colors.border },

  fab: {
    position: 'absolute', bottom: 24, right: 20,
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.lg,
  },
});
