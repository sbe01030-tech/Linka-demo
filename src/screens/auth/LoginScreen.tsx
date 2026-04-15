import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { RootStackParamList } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import LanguageSelector from '../../components/common/LanguageSelector';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
type DemoIcon = 'person-outline' | 'car-outline' | 'home-outline';

export default function LoginScreen({ navigation }: Props) {
  const { t } = useLanguageStore();
  const { login, isLoading } = useAuthStore();

  const [phone,    setPhone]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [focused,  setFocused]  = useState<string | null>(null);

  const DEMO: { label: string; phone: string; icon: DemoIcon }[] = [
    { label: t.auth.customer, phone: '081234567890', icon: 'person-outline' },
    { label: t.auth.driver,   phone: '081234567891', icon: 'car-outline' },
    { label: t.auth.helper,   phone: '081234567892', icon: 'home-outline' },
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
          <View style={s.logoRow}>
            <View style={s.logoMark}>
              <Text style={s.logoLetter}>L</Text>
            </View>
            <Text style={s.logoName}>{t.appName}</Text>
          </View>
          <LanguageSelector variant="button" />
        </View>

        {/* Heading — text-2xl font-normal */}
        <View style={s.hero}>
          <Text style={s.heading}>{t.auth.welcome}</Text>
          <Text style={s.sub}>{t.auth.signIn}</Text>
        </View>

        {/* Form */}
        <View style={s.form}>
          <Text style={s.label}>{t.auth.phone}</Text>
          <View style={[s.field, focused === 'phone' && s.fieldFocused]}>
            <Ionicons
              name="call-outline"
              size={16}
              color={focused === 'phone' ? Colors.dark : Colors.grayLight}
            />
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

          <Text style={[s.label, { marginTop: 16 }]}>{t.auth.password}</Text>
          <View style={[s.field, focused === 'pass' && s.fieldFocused]}>
            <Ionicons
              name="lock-closed-outline"
              size={16}
              color={focused === 'pass' ? Colors.dark : Colors.grayLight}
            />
            <TextInput
              style={[s.input, { flex: 1 }]}
              placeholder={t.auth.passwordPlaceholder}
              placeholderTextColor={Colors.grayLight}
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocused('pass')}
              onBlur={() => setFocused(null)}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Ionicons
                name={showPass ? 'eye-off-outline' : 'eye-outline'}
                size={16}
                color={Colors.grayLight}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={s.forgotRow}>
            <Text style={s.forgot}>{t.auth.forgotPassword}</Text>
          </TouchableOpacity>

          {/* rounded-full bg-black text-white */}
          <TouchableOpacity
            style={s.btn}
            onPress={() => { if (!phone || !password) return; login(phone, password); }}
            activeOpacity={0.85}
          >
            {isLoading
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={s.btnText}>{t.auth.login}</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={s.divRow}>
          <View style={s.divLine} />
          <Text style={s.divLabel}>{t.auth.quickLogin}</Text>
          <View style={s.divLine} />
        </View>

        {/* Demo tiles — rounded-2xl border border-gray-100 */}
        <View style={s.demoRow}>
          {DEMO.map((d) => (
            <TouchableOpacity
              key={d.phone}
              style={s.demoCard}
              onPress={() => { setPhone(d.phone); setPassword('demo123'); }}
              activeOpacity={0.8}
            >
              {/* avatar: rounded-full ring-2 ring-gray-100 */}
              <View style={s.demoAvatar}>
                <Ionicons name={d.icon} size={18} color={Colors.grayLight} />
              </View>
              <Text style={s.demoLabel}>{d.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Register */}
        <View style={s.registerRow}>
          <Text style={s.registerText}>{t.auth.noAccount}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={s.registerLink}> {t.auth.register}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: Colors.white, paddingBottom: 40 },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 54, paddingBottom: 4,
  },
  logoRow:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoMark:   { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center' },
  logoLetter: { fontSize: 14, fontWeight: '800', color: Colors.white },
  logoName:   { fontSize: 16, fontWeight: '700', color: Colors.dark },

  // text-2xl font-normal
  hero:    { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 28 },
  heading: { fontSize: 24, fontWeight: '400', color: Colors.dark, letterSpacing: -0.2, marginBottom: 6 },
  sub:     { fontSize: 14, color: Colors.gray },

  form:  { paddingHorizontal: 20 },
  label: { fontSize: 13, fontWeight: '500', color: Colors.darkMid, marginBottom: 8 },

  // bg-gray-50 rounded-xl  (list-row style)
  field: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.section,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  fieldFocused: { borderColor: Colors.dark, backgroundColor: Colors.white },
  input: { flex: 1, paddingVertical: 13, fontSize: 15, color: Colors.dark },

  forgotRow: { alignItems: 'flex-end', marginTop: 10, marginBottom: 6 },
  forgot:    { fontSize: 13, color: Colors.gray, fontWeight: '500' },

  // rounded-full bg-black
  btn: {
    marginTop: 20,
    backgroundColor: Colors.accent,
    borderRadius: Radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnText: { fontSize: 15, fontWeight: '700', color: Colors.white },

  divRow:  { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 24, paddingHorizontal: 20 },
  divLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  divLabel:{ fontSize: 12, color: Colors.gray },

  // Demo cards — rounded-2xl border border-gray-100
  demoRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 28 },
  demoCard: {
    flex: 1, alignItems: 'center', gap: 10,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    paddingVertical: 16,
    ...Shadow.sm,
  },
  // rounded-full ring-2 ring-gray-100
  demoAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.section,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  demoLabel: { fontSize: 12, fontWeight: '500', color: Colors.darkMid },

  registerRow: { flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 20 },
  registerText:{ fontSize: 14, color: Colors.gray },
  registerLink:{ fontSize: 14, fontWeight: '700', color: Colors.dark },
});
