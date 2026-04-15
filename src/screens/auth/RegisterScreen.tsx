import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../constants/colors';
import { RootStackParamList, UserRole } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import LanguageSelector from '../../components/common/LanguageSelector';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;
type RoleIcon = 'person-outline' | 'school-outline' | 'home-outline';

export default function RegisterScreen({ navigation }: Props) {
  const { t } = useLanguageStore();
  const { register, isLoading } = useAuthStore();

  const [name,     setName]     = useState('');
  const [phone,    setPhone]    = useState('');
  const [password, setPassword] = useState('');
  const [role,     setRole]     = useState<UserRole>('customer');
  const [showPass, setShowPass] = useState(false);
  const [focused,  setFocused]  = useState<string | null>(null);

  const ROLES: { value: UserRole; icon: RoleIcon; label: string; desc: string }[] = [
    { value: 'customer', icon: 'person-outline', label: t.auth.customer, desc: t.auth.findWorker },
    { value: 'helper',   icon: 'home-outline',   label: t.auth.helper,   desc: t.auth.becomeHelper },
    { value: 'tutor',    icon: 'school-outline',  label: 'Guru Les',     desc: 'Daftar sebagai guru les privat dan mulai mengajar' },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <View style={s.topBar}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={Colors.dark} />
          </TouchableOpacity>
          <Text style={s.topTitle}>{t.auth.createAccount}</Text>
          <LanguageSelector variant="button" />
        </View>

        <View style={s.hero}>
          <Text style={s.sub}>{t.auth.joinNow}</Text>
        </View>

        <View style={s.form}>
          {/* Role selector — filter pills: active=bg-black text-white, inactive=bg-gray-50 */}
          <Text style={s.sectionLabel}>{t.auth.iWantTo}</Text>
          <View style={s.roleRow}>
            {ROLES.map((r) => (
              <TouchableOpacity
                key={r.value}
                style={[s.rolePill, role === r.value && s.rolePillActive]}
                onPress={() => setRole(r.value)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={r.icon}
                  size={14}
                  color={role === r.value ? Colors.white : Colors.gray}
                />
                <Text style={[s.rolePillText, role === r.value && s.rolePillTextActive]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Role description */}
          <Text style={s.roleDesc}>
            {ROLES.find((r) => r.value === role)?.desc ?? ''}
          </Text>

          {/* Name */}
          <Text style={[s.label, { marginTop: 20 }]}>{t.auth.fullName}</Text>
          <View style={[s.field, focused === 'name' && s.fieldFocused]}>
            <Ionicons name="person-outline" size={16} color={focused === 'name' ? Colors.dark : Colors.grayLight} />
            <TextInput
              style={s.input}
              placeholder={t.auth.fullNamePlaceholder}
              placeholderTextColor={Colors.grayLight}
              value={name}
              onChangeText={setName}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
            />
          </View>

          {/* Phone */}
          <Text style={[s.label, { marginTop: 16 }]}>{t.auth.phone}</Text>
          <View style={[s.field, focused === 'phone' && s.fieldFocused]}>
            <Ionicons name="call-outline" size={16} color={focused === 'phone' ? Colors.dark : Colors.grayLight} />
            <TextInput
              style={s.input}
              placeholder={t.auth.phonePlaceholder}
              placeholderTextColor={Colors.grayLight}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              onFocus={() => setFocused('phone')}
              onBlur={() => setFocused(null)}
            />
          </View>

          {/* Password */}
          <Text style={[s.label, { marginTop: 16 }]}>{t.auth.password}</Text>
          <View style={[s.field, focused === 'pass' && s.fieldFocused]}>
            <Ionicons name="lock-closed-outline" size={16} color={focused === 'pass' ? Colors.dark : Colors.grayLight} />
            <TextInput
              style={[s.input, { flex: 1 }]}
              placeholder={t.auth.minPassword}
              placeholderTextColor={Colors.grayLight}
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocused('pass')}
              onBlur={() => setFocused(null)}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={16} color={Colors.grayLight} />
            </TouchableOpacity>
          </View>

          {/* CTA — rounded-full bg-black */}
          <TouchableOpacity
            style={s.btn}
            onPress={() => { if (!name || !phone || !password) return; register(name, phone, password, role); }}
            activeOpacity={0.85}
          >
            {isLoading
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={s.btnText}>{t.auth.registerNow}</Text>
            }
          </TouchableOpacity>

          <View style={s.loginRow}>
            <Text style={s.loginText}>{t.auth.hasAccount}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={s.loginLink}> {t.auth.login}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: Colors.white, paddingBottom: 40 },

  topBar: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingTop: 54, paddingBottom: 8,
  },
  backBtn:  { width: 34, height: 34, borderRadius: 10, backgroundColor: Colors.section, alignItems: 'center', justifyContent: 'center' },
  topTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: Colors.dark },

  hero: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 20 },
  sub:  { fontSize: 14, color: Colors.gray },

  form: { paddingHorizontal: 20 },

  sectionLabel: { fontSize: 13, fontWeight: '500', color: Colors.darkMid, marginBottom: 12 },

  // Filter pills: rounded-full px-5 py-2
  roleRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 8 },
  rolePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: Colors.section,
  },
  rolePillActive: { backgroundColor: Colors.accent },
  rolePillText:   { fontSize: 13, fontWeight: '500', color: Colors.gray },
  rolePillTextActive: { color: Colors.white },
  roleDesc: { fontSize: 12, color: Colors.gray, marginBottom: 4, lineHeight: 18 },

  label: { fontSize: 13, fontWeight: '500', color: Colors.darkMid, marginBottom: 8 },
  field: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.section, borderRadius: Radius.md,
    paddingHorizontal: 14, borderWidth: 1.5, borderColor: 'transparent',
  },
  fieldFocused: { borderColor: Colors.dark, backgroundColor: Colors.white },
  input: { flex: 1, paddingVertical: 13, fontSize: 15, color: Colors.dark },

  // rounded-full bg-black
  btn: {
    marginTop: 24, backgroundColor: Colors.accent,
    borderRadius: Radius.pill, paddingVertical: 14, alignItems: 'center',
  },
  btnText: { fontSize: 15, fontWeight: '700', color: Colors.white },

  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  loginText:{ fontSize: 14, color: Colors.gray },
  loginLink:{ fontSize: 14, fontWeight: '700', color: Colors.dark },
});
