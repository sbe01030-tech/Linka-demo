/**
 * KYCVerifyScreen — 인도네시아식 본인인증 (1회성)
 *
 * 시뮬레이션:
 *  1. Intro      — "1회 인증 필요" 설명
 *  2. NIK + Name — 16자리 NIK + KTP 이름
 *  3. DOB + 성별/출생지
 *  4. KTP photo  — 카메라 placeholder ("Tap to capture")
 *  5. Selfie     — "셀카 + KTP" 라이브니스 placeholder
 *  6. Verifying  — 로딩
 *  7. Success    — 완료
 *
 * onDoneRoute / onDoneParams 가 들어오면 그쪽으로 reset.
 */
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,
  ActivityIndicator, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius } from '../../constants/colors';
import { RootStackParamList } from '../../types';
import { useErrandStore } from '../../store/errandStore';
import { useLanguageStore } from '../../store/languageStore';

type Props = NativeStackScreenProps<RootStackParamList, 'KYCVerify'>;

type Step = 'intro' | 'identity' | 'dob' | 'ktp' | 'selfie' | 'verifying' | 'success';

export default function KYCVerifyScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { lang } = useLanguageStore();
  const tx = (ko: string, en: string, id: string) => lang === 'ko' ? ko : lang === 'en' ? en : id;

  const setKYC      = useErrandStore((s) => s.setKYC);
  const completeKYC = useErrandStore((s) => s.completeKYC);

  const [step, setStep]     = useState<Step>('intro');
  const [nik, setNik]       = useState('');
  const [name, setName]     = useState('');
  const [dob, setDob]       = useState('');           // DD/MM/YYYY
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [birthplace, setBirthplace] = useState('');
  const [ktpCaptured, setKtpCaptured]       = useState(false);
  const [selfieCaptured, setSelfieCaptured] = useState(false);

  // verifying → success 자동 전환
  useEffect(() => {
    if (step === 'verifying') {
      const t = setTimeout(() => setStep('success'), 1800);
      return () => clearTimeout(t);
    }
  }, [step]);

  const finish = () => {
    completeKYC();
    setKYC({
      nik, fullName: name, dob, gender: gender || undefined, birthplace,
      ktpPhotoUri: ktpCaptured ? 'mock://ktp' : undefined,
      selfieUri: selfieCaptured ? 'mock://selfie' : undefined,
    });
    if (route.params?.onDoneRoute) {
      // 인증 후 원래 가려던 화면으로 reset (인증 화면이 history에 남지 않도록)
      navigation.reset({
        index: 1,
        routes: [
          { name: 'ErrandBoard' },
          { name: route.params.onDoneRoute as any, params: route.params.onDoneParams },
        ],
      });
    } else {
      if (navigation.canGoBack()) navigation.goBack();
      else navigation.navigate('CustomerTabs' as never);
    }
  };

  return (
    <View style={[s.root, { paddingTop: insets.top + 4 }]}>
      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate("CustomerTabs" as never)} style={s.closeBtn}>
          <Ionicons name="close" size={26} color={Colors.dark} />
        </TouchableOpacity>
      </View>

      {step === 'intro'     && <IntroStep   onNext={() => setStep('identity')} tx={tx} />}
      {step === 'identity'  && <IdentityStep nik={nik} name={name} setNik={setNik} setName={setName} onNext={() => setStep('dob')} tx={tx} />}
      {step === 'dob'       && <DobStep    dob={dob} setDob={setDob} gender={gender} setGender={setGender} birthplace={birthplace} setBirthplace={setBirthplace} onNext={() => setStep('ktp')} tx={tx} />}
      {step === 'ktp'       && <KtpStep    captured={ktpCaptured} onCapture={() => setKtpCaptured(true)} onNext={() => setStep('selfie')} tx={tx} />}
      {step === 'selfie'    && <SelfieStep captured={selfieCaptured} onCapture={() => setSelfieCaptured(true)} onNext={() => setStep('verifying')} tx={tx} />}
      {step === 'verifying' && <VerifyingStep tx={tx} />}
      {step === 'success'   && <SuccessStep onConfirm={finish} tx={tx} />}
    </View>
  );
}

// ── Step components ────────────────────────────────────────────────
type T = (ko: string, en: string, id: string) => string;

function IntroStep({ onNext, tx }: { onNext: () => void; tx: T }) {
  return (
    <View style={s.body}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <View style={s.faceCircle}>
          <Ionicons name="person" size={64} color="#D7B98B" />
          <View style={s.shieldBadge}>
            <Ionicons name="shield-checkmark" size={18} color={Colors.white} />
          </View>
        </View>
        <Text style={s.bigTitle}>
          {tx('Linka 심부름이 처음이라면\n본인인증 1회가 필요해요', "First time? You'll need to verify\nyour identity once.", 'Pertama kali pakai?\nVerifikasi identitas dulu (1x saja)')}
        </Text>
        <Text style={s.bigSub}>
          {tx(
            '인증은 신뢰할 수 있는 지원자임을 보여주는 첫 번째 약속이에요.',
            'Verification shows the poster you can be trusted.',
            'Verifikasi menunjukkan bahwa Anda pelamar yang bisa dipercaya.'
          )}
        </Text>
      </View>
      <TouchableOpacity style={s.primaryBtn} activeOpacity={0.85} onPress={onNext}>
        <Text style={s.primaryBtnText}>
          {tx('30초 만에 인증하기', 'Verify in 30 seconds', 'Verifikasi dalam 30 detik')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function IdentityStep({ nik, name, setNik, setName, onNext, tx }: {
  nik: string; name: string; setNik: (v: string) => void; setName: (v: string) => void; onNext: () => void; tx: T;
}) {
  const valid = nik.length === 16 && name.trim().length >= 2;
  return (
    <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
      <Text style={s.stepTitle}>
        {tx('NIK과 이름을 입력해 주세요', 'Enter your NIK and name', 'Masukkan NIK dan nama Anda')}
      </Text>
      <Text style={s.stepHelp}>
        {tx('KTP에 표시된 그대로 입력해주세요.', 'Type exactly as shown on your KTP.', 'Masukkan persis seperti di KTP.')}
      </Text>

      <Text style={s.label}>NIK <Text style={s.req}>*</Text></Text>
      <TextInput
        style={s.input}
        placeholder="16 digit"
        placeholderTextColor={Colors.grayLight}
        keyboardType="number-pad"
        maxLength={16}
        value={nik}
        onChangeText={setNik}
      />
      <Text style={s.hint}>{nik.length} / 16</Text>

      <Text style={[s.label, { marginTop: 18 }]}>{tx('이름 (KTP 기준)', 'Full Name (as on KTP)', 'Nama Lengkap (sesuai KTP)')}</Text>
      <TextInput
        style={s.input}
        placeholder={tx('홍길동', 'Budi Santoso', 'Budi Santoso')}
        placeholderTextColor={Colors.grayLight}
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={s.helpLink}><Text style={s.helpLinkText}>{tx('인증에 어려움이 있나요?', 'Need help?', 'Butuh bantuan verifikasi?')}</Text></TouchableOpacity>

      <View style={{ flex: 1, minHeight: 60 }} />

      <TouchableOpacity
        style={[s.primaryBtn, !valid && s.primaryBtnDisabled]}
        activeOpacity={0.85}
        disabled={!valid}
        onPress={onNext}
      >
        <Text style={s.primaryBtnText}>{tx('다음', 'Next', 'Lanjut')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function DobStep({ dob, setDob, gender, setGender, birthplace, setBirthplace, onNext, tx }: {
  dob: string; setDob: (v: string) => void;
  gender: 'male' | 'female' | ''; setGender: (g: 'male' | 'female') => void;
  birthplace: string; setBirthplace: (v: string) => void;
  onNext: () => void; tx: T;
}) {
  const valid = dob.length >= 8 && !!gender && birthplace.trim().length >= 2;
  return (
    <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
      <Text style={s.stepTitle}>
        {tx('생년월일·성별을 입력해 주세요', 'Date of birth & gender', 'Tanggal lahir & jenis kelamin')}
      </Text>

      <Text style={s.label}>{tx('생년월일', 'Date of Birth', 'Tanggal Lahir')}</Text>
      <TextInput
        style={s.input}
        placeholder="DD/MM/YYYY"
        placeholderTextColor={Colors.grayLight}
        keyboardType="number-pad"
        value={dob}
        onChangeText={(t) => {
          const digits = t.replace(/\D/g, '').slice(0, 8);
          let out = digits;
          if (digits.length > 4) out = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
          else if (digits.length > 2) out = `${digits.slice(0, 2)}/${digits.slice(2)}`;
          setDob(out);
        }}
        maxLength={10}
      />

      <Text style={[s.label, { marginTop: 18 }]}>{tx('성별', 'Gender', 'Jenis Kelamin')}</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {[
          { id: 'male',   label: tx('남성', 'Male',   'Pria')   },
          { id: 'female', label: tx('여성', 'Female', 'Wanita') },
        ].map((g) => (
          <TouchableOpacity
            key={g.id}
            style={[s.genderBtn, gender === g.id && s.genderBtnActive]}
            onPress={() => setGender(g.id as 'male' | 'female')}
            activeOpacity={0.8}
          >
            <Text style={[s.genderBtnText, gender === g.id && s.genderBtnTextActive]}>{g.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[s.label, { marginTop: 18 }]}>{tx('출생지', 'Birthplace', 'Tempat Lahir')}</Text>
      <TextInput
        style={s.input}
        placeholder="Jakarta"
        placeholderTextColor={Colors.grayLight}
        value={birthplace}
        onChangeText={setBirthplace}
      />

      <View style={{ flex: 1, minHeight: 40 }} />
      <TouchableOpacity
        style={[s.primaryBtn, !valid && s.primaryBtnDisabled]}
        disabled={!valid}
        activeOpacity={0.85}
        onPress={onNext}
      >
        <Text style={s.primaryBtnText}>{tx('다음', 'Next', 'Lanjut')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function KtpStep({ captured, onCapture, onNext, tx }: {
  captured: boolean; onCapture: () => void; onNext: () => void; tx: T;
}) {
  return (
    <View style={s.body}>
      <Text style={s.stepTitle}>{tx('KTP 사진을 찍어주세요', 'Take a photo of your KTP', 'Foto KTP Anda')}</Text>
      <Text style={s.stepHelp}>
        {tx('카드 전체가 프레임 안에 들어가게 찍어주세요.', 'Make sure the entire card fits in the frame.', 'Pastikan seluruh kartu masuk dalam frame.')}
      </Text>

      <View style={s.captureWrap}>
        {/* placeholder KTP card frame */}
        <View style={[s.ktpFrame, captured && s.ktpFrameDone]}>
          {captured ? (
            <>
              <Ionicons name="checkmark-circle" size={48} color={Colors.accent} />
              <Text style={s.captureDoneText}>{tx('KTP 캡처 완료', 'KTP captured', 'Foto KTP berhasil')}</Text>
            </>
          ) : (
            <>
              <Ionicons name="card-outline" size={42} color={Colors.grayLight} />
              <Text style={s.captureHint}>{tx('탭하여 촬영', 'Tap to capture', 'Ketuk untuk foto')}</Text>
            </>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[s.secondaryBtn, captured && { display: 'none' }]}
        activeOpacity={0.85}
        onPress={onCapture}
      >
        <Ionicons name="camera-outline" size={18} color={Colors.dark} />
        <Text style={s.secondaryBtnText}>{tx('촬영하기', 'Take photo', 'Ambil Foto')}</Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }} />

      <TouchableOpacity
        style={[s.primaryBtn, !captured && s.primaryBtnDisabled]}
        disabled={!captured}
        activeOpacity={0.85}
        onPress={onNext}
      >
        <Text style={s.primaryBtnText}>{tx('다음', 'Next', 'Lanjut')}</Text>
      </TouchableOpacity>
    </View>
  );
}

function SelfieStep({ captured, onCapture, onNext, tx }: {
  captured: boolean; onCapture: () => void; onNext: () => void; tx: T;
}) {
  return (
    <View style={s.body}>
      <Text style={s.stepTitle}>{tx('KTP를 들고 셀카를 찍어주세요', 'Selfie holding your KTP', 'Selfie sambil pegang KTP')}</Text>
      <Text style={s.stepHelp}>
        {tx('얼굴과 KTP가 함께 보여야 해요.', 'Both your face and KTP must be visible.', 'Wajah dan KTP harus terlihat bersamaan.')}
      </Text>

      <View style={s.captureWrap}>
        <View style={[s.selfieFrame, captured && s.ktpFrameDone]}>
          {captured ? (
            <>
              <Ionicons name="checkmark-circle" size={48} color={Colors.accent} />
              <Text style={s.captureDoneText}>{tx('셀카 캡처 완료', 'Selfie captured', 'Selfie berhasil')}</Text>
            </>
          ) : (
            <>
              <Ionicons name="happy-outline" size={42} color={Colors.grayLight} />
              <Text style={s.captureHint}>{tx('탭하여 촬영', 'Tap to capture', 'Ketuk untuk foto')}</Text>
            </>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[s.secondaryBtn, captured && { display: 'none' }]}
        activeOpacity={0.85}
        onPress={onCapture}
      >
        <Ionicons name="camera-reverse-outline" size={18} color={Colors.dark} />
        <Text style={s.secondaryBtnText}>{tx('촬영하기', 'Take selfie', 'Ambil Selfie')}</Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }} />

      <TouchableOpacity
        style={[s.primaryBtn, !captured && s.primaryBtnDisabled]}
        disabled={!captured}
        activeOpacity={0.85}
        onPress={onNext}
      >
        <Text style={s.primaryBtnText}>{tx('인증 요청', 'Submit', 'Kirim')}</Text>
      </TouchableOpacity>
    </View>
  );
}

function VerifyingStep({ tx }: { tx: T }) {
  return (
    <View style={[s.body, { alignItems: 'center', justifyContent: 'center' }]}>
      <ActivityIndicator size="large" color={Colors.accent} />
      <Text style={[s.stepTitle, { marginTop: 24, textAlign: 'center' }]}>
        {tx('인증 중이에요...', 'Verifying...', 'Memverifikasi...')}
      </Text>
      <Text style={[s.stepHelp, { textAlign: 'center' }]}>
        {tx('잠시만 기다려 주세요.', 'Please wait a moment.', 'Mohon tunggu sebentar.')}
      </Text>
    </View>
  );
}

function SuccessStep({ onConfirm, tx }: { onConfirm: () => void; tx: T }) {
  return (
    <View style={s.body}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <View style={s.successCircle}>
          <Ionicons name="checkmark" size={56} color={Colors.accent} />
        </View>
        <Text style={[s.bigTitle, { textAlign: 'center' }]}>
          {tx('본인인증이 완료되었어요', 'Verification complete', 'Verifikasi selesai')}
        </Text>
      </View>
      <TouchableOpacity style={s.primaryBtn} activeOpacity={0.85} onPress={onConfirm}>
        <Text style={s.primaryBtnText}>{tx('확인', 'Confirm', 'OK')}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginLeft: -8 },

  body: { flexGrow: 1, paddingTop: 12, paddingBottom: 20 },

  bigTitle: { fontSize: 22, fontWeight: '800', color: Colors.dark, lineHeight: 30, textAlign: 'center' },
  bigSub:   { fontSize: 14, color: Colors.gray, textAlign: 'center', lineHeight: 21 },

  stepTitle: { fontSize: 22, fontWeight: '800', color: Colors.dark, marginBottom: 8, lineHeight: 30 },
  stepHelp:  { fontSize: 13, color: Colors.gray, marginBottom: 28, lineHeight: 19 },

  label: { fontSize: 13, fontWeight: '600', color: Colors.dark, marginBottom: 8 },
  req:   { color: '#EF4444' },
  input: {
    borderWidth: 1.5, borderColor: Colors.borderMid, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: Colors.dark,
  },
  hint:  { fontSize: 11, color: Colors.grayLight, marginTop: 4, alignSelf: 'flex-end' },

  helpLink: { alignSelf: 'center', marginTop: 24 },
  helpLinkText: { fontSize: 13, color: Colors.gray, textDecorationLine: 'underline' },

  genderBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    borderWidth: 1.5, borderColor: Colors.borderMid, alignItems: 'center',
  },
  genderBtnActive: { backgroundColor: Colors.dark, borderColor: Colors.dark },
  genderBtnText: { fontSize: 14, fontWeight: '600', color: Colors.dark },
  genderBtnTextActive: { color: Colors.white },

  faceCircle: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: '#F4D6B3', alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  shieldBadge: {
    position: 'absolute', bottom: 8, right: 12,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: Colors.white,
  },

  captureWrap: { alignItems: 'center', justifyContent: 'center', marginVertical: 24 },
  ktpFrame: {
    width: '100%', aspectRatio: 1.6, borderRadius: 14,
    borderWidth: 2, borderColor: Colors.borderMid, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.section,
  },
  ktpFrameDone: { borderStyle: 'solid', borderColor: Colors.accent, backgroundColor: Colors.accentLight },
  selfieFrame: {
    width: 240, height: 280, borderRadius: 140,
    borderWidth: 2, borderColor: Colors.borderMid, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.section,
  },
  captureHint: { fontSize: 13, color: Colors.grayLight },
  captureDoneText: { fontSize: 14, fontWeight: '700', color: Colors.accent },

  secondaryBtn: {
    flexDirection: 'row', gap: 6, alignSelf: 'center',
    paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 22, borderWidth: 1.2, borderColor: Colors.borderMid,
  },
  secondaryBtnText: { fontSize: 14, fontWeight: '600', color: Colors.dark },

  primaryBtn: {
    height: 56, borderRadius: 14, backgroundColor: Colors.dark,
    alignItems: 'center', justifyContent: 'center',
  },
  primaryBtnDisabled: { backgroundColor: Colors.borderMid },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },

  successCircle: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: Colors.accentLight, alignItems: 'center', justifyContent: 'center',
  },
});
