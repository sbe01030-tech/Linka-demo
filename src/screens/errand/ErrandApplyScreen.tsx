/**
 * ErrandApplyScreen — 이력서 작성 + 지원 완료
 *
 * KYC 통과 후 진입.
 * - 이미 저장된 이력서가 있으면 미리 채워두고 "지원하기" 즉시 가능
 * - 처음이면 폼 작성 필수 (자기소개 15자 이상)
 *
 * 제출 → errandStore.applyToErrand → 성공 모달 → 상세로 복귀
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  Modal, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius } from '../../constants/colors';
import { RootStackParamList } from '../../types';
import { useErrandStore } from '../../store/errandStore';
import { useLanguageStore } from '../../store/languageStore';
import { HELPER_ME } from '../../store/chatStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ErrandApply'>;

// 인도네시아 맥락에 맞춘 옵션
const STRENGTH_OPTIONS = [
  { id: 'tepat-waktu', ko: '시간 약속을 지켜요', en: 'On time',       id_l: 'Tepat waktu'         },
  { id: 'ramah',       ko: '친절해요',          en: 'Friendly',      id_l: 'Ramah'               },
  { id: 'teliti',      ko: '일처리가 꼼꼼해요',   en: 'Thorough',      id_l: 'Teliti'              },
  { id: 'aktif',       ko: '적극적이에요',       en: 'Proactive',     id_l: 'Aktif'               },
  { id: 'rapi',        ko: '깔끔해요',          en: 'Neat',          id_l: 'Rapi'                },
];

const EXTRA_OPTIONS = [
  { id: 'non-smoker',   ko: '비흡연',          en: 'Non-smoker',     id_l: 'Tidak merokok'       },
  { id: 'long-term',    ko: '장기근무 가능',    en: 'Long-term OK',   id_l: 'Bisa jangka panjang' },
  { id: 'has-vehicle',  ko: '차량 보유',        en: 'Has vehicle',    id_l: 'Punya kendaraan'     },
  { id: 'has-ktp',      ko: 'KTP 소지',         en: 'KTP holder',     id_l: 'Punya KTP'           },
  { id: 'childcare',    ko: '육아 경험',         en: 'Childcare exp.', id_l: 'Pengalaman anak'     },
  { id: 'english',      ko: '영어 가능',         en: 'English OK',     id_l: 'Bisa Bahasa Inggris' },
  { id: 'pet-exp',      ko: '반려동물 경험',     en: 'Pet experience', id_l: 'Pengalaman hewan'    },
  { id: 'cooking',      ko: '요리 능숙',         en: 'Cooking skill',  id_l: 'Ahli memasak'        },
];

export default function ErrandApplyScreen({ navigation, route }: Props) {
  const { errandId } = route.params;
  const insets = useSafeAreaInsets();
  const { lang } = useLanguageStore();
  const tx = (ko: string, en: string, id: string) => lang === 'ko' ? ko : lang === 'en' ? en : id;
  const lopt = (o: { ko: string; en: string; id_l: string }) =>
    lang === 'ko' ? o.ko : lang === 'en' ? o.en : o.id_l;

  const post     = useErrandStore((s) => s.posts.find((p) => p.id === errandId));
  const resume   = useErrandStore((s) => s.resume);
  const setResume = useErrandStore((s) => s.setResume);
  const addApplicant = useErrandStore((s) => s.addApplicant);
  const kyc      = useErrandStore((s) => s.kyc);

  const [intro, setIntro]         = useState(resume?.intro ?? '');
  const [strengths, setStrengths] = useState<string[]>(resume?.strengths ?? []);
  const [extras, setExtras]       = useState<string[]>(resume?.extras ?? []);
  const [agreed, setAgreed]       = useState(false);
  const [showDone, setShowDone]   = useState(false);

  const introOk = intro.trim().length >= 15;
  const canSubmit = introOk && agreed;

  const toggle = (arr: string[], val: string, max?: number): string[] => {
    if (arr.includes(val)) return arr.filter((v) => v !== val);
    if (max != null && arr.length >= max) return arr;
    return [...arr, val];
  };

  const submit = () => {
    if (!introOk) {
      Alert.alert(tx('확인', 'Wait', 'Tunggu'), tx('자기소개는 15자 이상 적어주세요.', 'Intro must be 15+ characters.', 'Perkenalan minimal 15 karakter.'));
      return;
    }
    if (!agreed) {
      Alert.alert(tx('확인', 'Wait', 'Tunggu'), tx('필수 약관에 동의해 주세요.', 'Please agree to the required consent.', 'Mohon setujui persetujuan wajib.'));
      return;
    }
    setResume({ photoUri: undefined, experiences: [], intro, strengths, extras });
    // 지원자 프로필을 함께 저장 → 요청자(고객)가 ErrandDetail에서 실제 지원자로 확인
    addApplicant(errandId, {
      id: HELPER_ME.id,
      name: HELPER_ME.name,
      photo: HELPER_ME.photo,
      temperature: 38.5,
      appliedAt: tx('방금 전', 'just now', 'baru saja'),
      resume: { photoUri: undefined, experiences: [], intro, strengths, extras },
    });
    setShowDone(true);
  };

  if (!post) return null;

  return (
    <View style={[s.root, { paddingTop: insets.top + 4 }]}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate("CustomerTabs" as never)} style={s.closeBtn}>
          <Ionicons name="close" size={26} color={Colors.dark} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 130 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={s.bigTitle}>
          {tx('이어서, 알바 이력서를\n작성해 주세요', 'Now, fill out\nyour applicant profile', 'Lanjutkan dengan\nprofil pelamar')}
        </Text>

        {/* Photo (placeholder) */}
        <View style={s.fieldBlock}>
          <Text style={s.fieldTitle}>{tx('사진', 'Photo', 'Foto')} <Text style={s.optional}>({tx('선택', 'optional', 'opsional')})</Text></Text>
          <Text style={s.fieldHelp}>{tx('사진을 등록하면 채용 확률이 6% 상승해요.', 'Adding a photo boosts your chance by 6%.', 'Tambahkan foto: peluang +6%.')}</Text>
          <TouchableOpacity style={s.photoCircle} activeOpacity={0.85}>
            <Ionicons name="person" size={48} color={Colors.grayLight} />
            <View style={s.cameraBadge}>
              <Ionicons name="camera" size={16} color={Colors.white} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Intro */}
        <View style={s.fieldBlock}>
          <Text style={s.fieldTitle}>{tx('자기소개', 'Intro', 'Perkenalan')} <Text style={s.req}>*</Text></Text>
          <Text style={s.fieldHelp}>
            {tx('50자 이상 작성하면 채용 확률이 18% 상승해요.', '50+ chars boosts your chance by 18%.', '50+ karakter: peluang +18%.')}
          </Text>
          <TextInput
            style={s.textarea}
            placeholder={tx('최소 15자 이상 입력해주세요', 'At least 15 characters', 'Minimal 15 karakter')}
            placeholderTextColor={Colors.grayLight}
            multiline
            value={intro}
            onChangeText={setIntro}
          />
          <Text style={s.charCount}>{intro.length}</Text>
        </View>

        {/* Strengths */}
        <View style={s.fieldBlock}>
          <Text style={s.fieldTitle}>{tx('나의 장점', 'My Strengths', 'Kelebihan Saya')}</Text>
          <Text style={s.fieldHelp}>{tx('최대 2개까지 선택할 수 있어요.', 'Up to 2.', 'Pilih maksimal 2.')}</Text>
          <View style={s.chipWrap}>
            {STRENGTH_OPTIONS.map((o) => {
              const active = strengths.includes(o.id);
              return (
                <TouchableOpacity
                  key={o.id}
                  style={[s.tagChip, active && s.tagChipActive]}
                  activeOpacity={0.8}
                  onPress={() => setStrengths(toggle(strengths, o.id, 2))}
                >
                  <Text style={[s.tagChipText, active && s.tagChipTextActive]}>{lopt(o)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Extras */}
        <View style={s.fieldBlock}>
          <Text style={s.fieldTitle}>{tx('추가 정보', 'Extras', 'Info Tambahan')} <Text style={s.optional}>({tx('선택', 'optional', 'opsional')})</Text></Text>
          <View style={s.chipWrap}>
            {EXTRA_OPTIONS.map((o) => {
              const active = extras.includes(o.id);
              return (
                <TouchableOpacity
                  key={o.id}
                  style={[s.tagChip, active && s.tagChipActive]}
                  activeOpacity={0.8}
                  onPress={() => setExtras(toggle(extras, o.id))}
                >
                  <Text style={[s.tagChipText, active && s.tagChipTextActive]}>{lopt(o)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Consent — 탭 가능한 필수 체크박스 */}
        <TouchableOpacity style={s.consentRow} activeOpacity={0.7} onPress={() => setAgreed((a) => !a)}>
          <View style={[s.checkbox, agreed && s.checkboxOn]}>
            {agreed && <Ionicons name="checkmark" size={14} color={Colors.white} />}
          </View>
          <Text style={s.consentText}>
            {tx('(필수) 개인정보 제3자 제공 동의', '(Required) Personal data sharing consent', '(Wajib) Persetujuan pembagian data')}
          </Text>
        </TouchableOpacity>
        <Text style={[s.consentLink]}>
          {tx('개인정보처리 관련 고지사항', 'Privacy notice', 'Pemberitahuan privasi')}
        </Text>
      </ScrollView>

      <View style={[s.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[s.primaryBtn, !canSubmit && s.primaryBtnDisabled]}
          activeOpacity={0.88}
          onPress={submit}
        >
          <Text style={s.primaryBtnText}>{tx('지원하기', 'Apply', 'Lamar Sekarang')}</Text>
        </TouchableOpacity>
      </View>

      {/* 지원 완료 모달 */}
      <Modal visible={showDone} transparent animationType="fade" onRequestClose={() => setShowDone(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <View style={s.successCircle}>
              <Ionicons name="checkmark" size={48} color={Colors.accent} />
            </View>
            <Text style={s.modalTitle}>
              {tx('지원이 완료되었어요!', 'Application submitted!', 'Lamaran terkirim!')}
            </Text>
            <Text style={s.modalSub}>
              {tx(
                '요청자가 확인하면 채팅으로 알려드릴게요.',
                "We'll notify you in chat when the poster reviews.",
                'Kami akan beri tahu lewat chat saat dilihat.'
              )}
            </Text>
            <TouchableOpacity
              style={s.primaryBtn}
              activeOpacity={0.85}
              onPress={() => {
                setShowDone(false);
                if (navigation.canGoBack()) navigation.goBack();
                else navigation.navigate('CustomerTabs' as never);
              }}
            >
              <Text style={s.primaryBtnText}>{tx('확인', 'OK', 'OK')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginLeft: -8 },

  bigTitle: { fontSize: 22, fontWeight: '800', color: Colors.dark, lineHeight: 30, marginBottom: 28 },

  fieldBlock: { marginBottom: 28 },
  fieldTitle: { fontSize: 15, fontWeight: '700', color: Colors.dark, marginBottom: 6 },
  fieldHelp:  { fontSize: 12, color: Colors.gray, lineHeight: 17, marginBottom: 12 },
  optional:   { fontSize: 12, color: Colors.gray, fontWeight: '400' },
  req:        { color: '#EF4444' },

  photoCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.section,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
    position: 'relative',
  },
  cameraBadge: {
    position: 'absolute', bottom: 0, right: -2,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.dark, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.white,
  },

  textarea: {
    minHeight: 110, padding: 14,
    borderWidth: 1.5, borderColor: Colors.borderMid, borderRadius: 12,
    fontSize: 14, color: Colors.dark, textAlignVertical: 'top',
  },
  charCount: { fontSize: 11, color: Colors.grayLight, alignSelf: 'flex-end', marginTop: 4 },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.2, borderColor: Colors.borderMid,
    backgroundColor: Colors.white,
  },
  tagChipActive: { backgroundColor: Colors.dark, borderColor: Colors.dark },
  tagChipText:       { fontSize: 13, color: Colors.dark },
  tagChipTextActive: { color: Colors.white, fontWeight: '600' },

  consentRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 1.5, borderColor: Colors.borderMid,
    alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white,
  },
  checkboxOn: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  consentText: { flex: 1, fontSize: 13, color: Colors.dark, fontWeight: '500' },
  consentLink: { fontSize: 12, color: Colors.gray, marginTop: 4, marginLeft: 24, textDecorationLine: 'underline' },

  bottomBar: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    paddingHorizontal: 20, paddingTop: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  primaryBtn: {
    height: 54, borderRadius: 14, backgroundColor: Colors.dark,
    alignItems: 'center', justifyContent: 'center',
  },
  primaryBtnDisabled: { backgroundColor: Colors.borderMid },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  modalCard: {
    width: '100%', backgroundColor: Colors.white, borderRadius: 20,
    paddingHorizontal: 24, paddingVertical: 28, alignItems: 'center', gap: 14,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: Colors.dark, textAlign: 'center' },
  modalSub:   { fontSize: 13, color: Colors.gray, textAlign: 'center', lineHeight: 19, marginBottom: 10 },
  successCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.accentLight, alignItems: 'center', justifyContent: 'center',
  },
});
