import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius } from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ navigation }: Props) {
  const { user, setUser } = useAuthStore();
  const { lang } = useLanguageStore();
  const insets = useSafeAreaInsets();

  const [name,  setName]  = useState(user?.name  ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [isDirty, setIsDirty] = useState(false);

  const L = {
    id: { title: 'Edit Profil', save: 'Simpan', cancel: 'Batal', name: 'Nama Lengkap', namePh: 'Masukkan nama lengkap', phone: 'Nomor Telepon', phonePh: 'Masukkan nomor telepon', saved: 'Profil berhasil disimpan!', noChange: 'Tidak ada perubahan.', emptyName: 'Nama tidak boleh kosong.' },
    en: { title: 'Edit Profile', save: 'Save', cancel: 'Cancel', name: 'Full Name', namePh: 'Enter your full name', phone: 'Phone Number', phonePh: 'Enter your phone number', saved: 'Profile saved!', noChange: 'No changes made.', emptyName: 'Name cannot be empty.' },
    ko: { title: '프로필 편집', save: '저장', cancel: '취소', name: '이름', namePh: '이름 입력', phone: '전화번호', phonePh: '전화번호 입력', saved: '프로필이 저장됐습니다!', noChange: '변경된 내용이 없습니다.', emptyName: '이름을 입력해주세요.' },
    zh: { title: '编辑资料', save: '保存', cancel: '取消', name: '姓名', namePh: '请输入姓名', phone: '电话号码', phonePh: '请输入电话号码', saved: '资料保存成功！', noChange: '没有任何更改。', emptyName: '姓名不能为空。' },
    ja: { title: 'プロフィール編集', save: '保存', cancel: 'キャンセル', name: '氏名', namePh: '氏名を入力', phone: '電話番号', phonePh: '電話番号を入力', saved: '保存されました！', noChange: '変更はありません。', emptyName: '名前を入力してください。' },
  } as const;

  const t = L[lang as keyof typeof L] ?? L.id;

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('', t.emptyName, [{ text: 'OK' }]);
      return;
    }
    if (!isDirty) {
      Alert.alert('', t.noChange, [{ text: 'OK' }]);
      return;
    }
    if (user) {
      setUser({ ...user, name: name.trim(), phone: phone.trim() });
    }
    Alert.alert('', t.saved, [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  const onChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setIsDirty(true);
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{t.title}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={s.form} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Avatar placeholder */}
        <View style={s.avatarSection}>
          <View style={s.avatarWrap}>
            <View style={s.avatar}>
              <Text style={s.avatarInitial}>{name.charAt(0).toUpperCase() || '?'}</Text>
            </View>
            <TouchableOpacity style={s.cameraBtn} onPress={() => Alert.alert('', lang === 'ko' ? '사진 업로드 기능 준비 중입니다' : lang === 'en' ? 'Photo upload coming soon' : 'Fitur upload foto segera hadir')}>
              <Ionicons name="camera-outline" size={14} color={Colors.gray} />
            </TouchableOpacity>
          </View>
          <Text style={s.avatarHint}>
            {lang === 'ko' ? '프로필 사진 변경' : lang === 'en' ? 'Change profile photo' : 'Ganti foto profil'}
          </Text>
        </View>

        {/* Name field */}
        <View style={s.fieldGroup}>
          <Text style={s.fieldLabel}>{t.name}</Text>
          <View style={s.inputWrap}>
            <Ionicons name="person-outline" size={16} color={Colors.grayLight} />
            <TextInput
              style={s.input}
              placeholder={t.namePh}
              placeholderTextColor={Colors.grayLight}
              value={name}
              onChangeText={onChange(setName)}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Phone field */}
        <View style={s.fieldGroup}>
          <Text style={s.fieldLabel}>{t.phone}</Text>
          <View style={s.inputWrap}>
            <Ionicons name="call-outline" size={16} color={Colors.grayLight} />
            <TextInput
              style={s.input}
              placeholder={t.phonePh}
              placeholderTextColor={Colors.grayLight}
              value={phone}
              onChangeText={onChange(setPhone)}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Info note */}
        <View style={s.infoNote}>
          <Ionicons name="information-circle-outline" size={14} color={Colors.grayLight} />
          <Text style={s.infoText}>
            {lang === 'ko'
              ? '이름과 전화번호는 서비스 제공자에게 표시됩니다.'
              : lang === 'en'
              ? 'Your name and phone number are visible to service providers.'
              : 'Nama dan nomor telepon Anda akan ditampilkan kepada mitra layanan.'}
          </Text>
        </View>

        {/* Save button */}
        <TouchableOpacity style={s.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={s.saveBtnText}>{t.save}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.cancelBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={s.cancelBtnText}>{t.cancel}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
  backBtn:     { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.dark },

  form: { flex: 1, paddingHorizontal: 20 },

  avatarSection: { alignItems: 'center', paddingVertical: 28 },
  avatarWrap: { position: 'relative', marginBottom: 8 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.accent + '40',
  },
  avatarInitial: { fontSize: 30, fontWeight: '700', color: Colors.accent },
  cameraBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: Colors.white,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarHint: { fontSize: 13, color: Colors.accent, fontWeight: '500' },

  fieldGroup: { marginBottom: 20 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: Colors.gray, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.section, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 13,
  },
  input: { flex: 1, fontSize: 15, color: Colors.dark },

  infoNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: Colors.section, borderRadius: Radius.md,
    paddingHorizontal: 14, paddingVertical: 12,
    marginBottom: 24, borderWidth: 1, borderColor: Colors.border,
  },
  infoText: { flex: 1, fontSize: 12, color: Colors.gray, lineHeight: 18 },

  saveBtn: {
    backgroundColor: Colors.accent, borderRadius: Radius.pill,
    paddingVertical: 15, alignItems: 'center', marginBottom: 12,
  },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },

  cancelBtn: {
    borderRadius: Radius.pill, paddingVertical: 14, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.borderMid,
  },
  cancelBtnText: { fontSize: 14, fontWeight: '500', color: Colors.gray },
});
