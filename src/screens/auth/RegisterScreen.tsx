/**
 * RegisterScreen — multi-step onboarding wizard
 *
 * Helper / Tutor flow  (6 phases):
 *   0  Role selection
 *   1  Services offered
 *   2  Conditions — rate · area · work type · schedule
 *   3  Profile — bio + photo
 *   4  Terms of Service  ← mandatory agree step
 *   5  Account — name · phone · password
 *
 * Customer flow  (5 phases):
 *   0   Role selection
 *   11  Services wanted
 *   12  Area / location
 *   4   Terms of Service  ← mandatory agree step  (shared phase number)
 *   5   Account — name · phone · password
 */
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
  Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { RootStackParamList, UserRole } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

// ── Static constants ──────────────────────────────────────────────

const GREEN = Colors.accent;

// Area labels stay fixed (proper nouns)
const AREAS = [
  { id: 'jps', label: 'Jakarta Selatan' },
  { id: 'jpt', label: 'Jakarta Pusat' },
  { id: 'jpb', label: 'Jakarta Barat' },
  { id: 'jpe', label: 'Jakarta Timur' },
  { id: 'jpn', label: 'Jakarta Utara' },
  { id: 'dep', label: 'Depok' },
  { id: 'bks', label: 'Bekasi' },
  { id: 'bgr', label: 'Bogor' },
  { id: 'tng', label: 'Tangerang' },
  { id: 'tns', label: 'Tangerang Selatan' },
];

// ── Step progress indicator ───────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <View style={si.wrap}>
      {Array.from({ length: total }).map((_, i) => {
        const done    = i < current - 1;
        const active  = i === current - 1;
        const pending = i > current - 1;
        return (
          <React.Fragment key={i}>
            {i > 0 && <View style={[si.line, done && si.lineDone]} />}
            <View style={[si.dot, done && si.dotDone, active && si.dotActive, pending && si.dotPending]}>
              {done
                ? <Ionicons name="checkmark" size={11} color={Colors.white} />
                : <Text style={[si.dotNum, active && si.dotNumActive, pending && si.dotNumPending]}>{i + 1}</Text>
              }
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
}

const si = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
  dot: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  dotDone:    { backgroundColor: GREEN },
  dotActive:  { backgroundColor: GREEN },
  dotPending: { backgroundColor: Colors.section, borderWidth: 1.5, borderColor: Colors.borderMid },
  dotNum:        { fontSize: 13, fontWeight: '700' },
  dotNumActive:  { color: Colors.white },
  dotNumPending: { color: Colors.grayLight },
  line: { width: 36, height: 2, backgroundColor: Colors.border, marginHorizontal: -1 },
  lineDone: { backgroundColor: GREEN },
});

// ── Tip banner ────────────────────────────────────────────────────

function TipBanner({ text }: { text: string }) {
  return (
    <View style={tb.wrap}>
      <Text style={tb.label}>Tip</Text>
      <Text style={tb.text}>{text}</Text>
    </View>
  );
}

const tb = StyleSheet.create({
  wrap:  { flexDirection: 'row', gap: 8, backgroundColor: '#FFF7ED', borderRadius: Radius.md, padding: 12, alignItems: 'flex-start' },
  label: { fontSize: 12, fontWeight: '700', color: '#F97316' },
  text:  { flex: 1, fontSize: 12, color: '#9A3412', lineHeight: 18 },
});

// ── Main component ────────────────────────────────────────────────

// ── Per-language inline policy text ──────────────────────────────
const POLICY_TEXT: Record<string, { p1Title: string; p1Body: string; p2Title: string; p2Body: string }> = {
  ko: {
    p1Title: 'Linka 앱 서비스 운영정책',
    p1Body:  'Linka 앱은 이용자(고객) 또는 헬퍼(도우미·과외선생님)를 찾고 연락할 수 있도록 정보를 제공하는 플랫폼입니다. (주)링카인도네시아는 고객과 도우미 간의 계약 소개·알선만 하며, 파견업체나 채용 대행사가 아닙니다. (주)링카인도네시아는 고객과 도우미 간에 발생하는 모든 문제에 대한 책임이 없음을 알려드립니다.',
    p2Title: 'Linka 앱 회원의 의무',
    p2Body:  '회원은 자신에게 적합한 헬퍼(도우미) 또는 고객(이용자)을 선택하고, 서로 합의한 계약 조건이나 관련 법에 의거하여 성실히 활동해야 합니다. 상호 합의한 내용을 사전 조율 없이 일방적으로 해지 통보할 경우, 서비스이용약관에 따라 강제 탈퇴될 수 있습니다.',
  },
  en: {
    p1Title: 'Linka Service Policy',
    p1Body:  'The Linka app connects users (customers) with helpers (home assistants or tutors). PT Linka Indonesia acts solely as an intermediary and is not a staffing agency or employer of helpers. The Company bears no responsibility for any issues arising between customers and helpers.',
    p2Title: 'Member Obligations',
    p2Body:  'Members must independently select suitable helpers or customers, and act honestly in accordance with mutually agreed contract terms or applicable laws. Unilateral termination without prior coordination may result in penalties per the Terms of Service.',
  },
  id: {
    p1Title: 'Kebijakan Operasional Linka',
    p1Body:  'Aplikasi Linka menghubungkan pengguna (pelanggan) dengan helper (asisten rumah tangga atau guru les). PT Linka Indonesia hanya bertindak sebagai perantara dan bukan merupakan agen tenaga kerja maupun pemberi kerja. Perusahaan tidak bertanggung jawab atas permasalahan yang timbul antara pelanggan dan helper.',
    p2Title: 'Kewajiban Anggota',
    p2Body:  'Anggota wajib memilih helper atau pelanggan yang sesuai secara mandiri dan melaksanakan seluruh kegiatan dengan penuh tanggung jawab. Pemutusan kontrak secara sepihak dapat dikenai sanksi sesuai Ketentuan Layanan.',
  },
  zh: {
    p1Title: 'Linka应用服务运营政策',
    p1Body:  'Linka应用连接用户（客户）与助手（家政员或家教）。PT Linka Indonesia仅作为中介，并非劳务派遣机构或助手的雇主。公司对客户与助手之间产生的任何问题不承担责任。',
    p2Title: '会员义务',
    p2Body:  '会员须自行选择适合的助手或客户，并诚实负责地按照约定条款开展活动。未经协商单方面解除合同可能受到处罚。',
  },
  ja: {
    p1Title: 'Linkaアプリサービス運営方針',
    p1Body:  'Linkaアプリはユーザー（お客様）とヘルパー（家事アシスタントまたは家庭教師）を繋ぐプラットフォームです。PT Linka Indonesiaは仲介者としてのみ機能し、人材派遣会社やヘルパーの雇用主ではありません。当社はお客様とヘルパー間に生じる問題について責任を負いません。',
    p2Title: 'Linkaアプリ会員の義務',
    p2Body:  '会員は自分に適したヘルパーまたはお客様を選択し、合意した契約条件に基づいて誠実に活動する必要があります。事前調整なしの一方的な解除通知は、利用規約に基づき制裁の対象となります。',
  },
};

export default function RegisterScreen({ navigation, route }: Props) {
  const { register, isLoading } = useAuthStore();
  const { t, lang } = useLanguageStore();
  const insets = useSafeAreaInsets();
  const tr = t.register;
  const initialRole = route.params?.initialRole;

  // ── Translated lists (rebuilt on lang change) ──
  const ART_SERVICES = [
    { id: 'masak',   label: tr.artCooking,       icon: 'restaurant-outline' },
    { id: 'bersih',  label: tr.artCleaning,       icon: 'brush-outline' },
    { id: 'cuci',    label: tr.artLaundry,        icon: 'shirt-outline' },
    { id: 'beberes', label: tr.artOrganizing,     icon: 'home-outline' },
    { id: 'anak',    label: tr.artChildcare,      icon: 'happy-outline' },
    { id: 'belanja', label: tr.artShopping,       icon: 'cart-outline' },
    { id: 'masak2',  label: tr.artSpecialCooking, icon: 'cafe-outline' },
    { id: 'kebun',   label: tr.artGardening,      icon: 'leaf-outline' },
  ];
  const TUTOR_SERVICES = [
    { id: 'math',     label: tr.tutorMath,      icon: 'calculator-outline' },
    { id: 'ipa',      label: tr.tutorScience,   icon: 'flask-outline' },
    { id: 'english',  label: tr.tutorEnglish,   icon: 'chatbubble-ellipses-outline' },
    { id: 'mandarin', label: tr.tutorMandarin,  icon: 'globe-outline' },
    { id: 'pkn',      label: tr.tutorCivics,    icon: 'book-outline' },
    { id: 'seni',     label: tr.tutorArts,      icon: 'musical-notes-outline' },
    { id: 'coding',   label: tr.tutorCoding,    icon: 'code-slash-outline' },
    { id: 'olahraga', label: tr.tutorSports,    icon: 'football-outline' },
  ];
  const CUSTOMER_SERVICES = [
    { id: 'art',     label: tr.custArt,          icon: 'home-outline' },
    { id: 'cook',    label: tr.artCooking,        icon: 'restaurant-outline' },
    { id: 'clean',   label: tr.artCleaning,       icon: 'brush-outline' },
    { id: 'tutor',   label: tr.custTutor,         icon: 'school-outline' },
    { id: 'child',   label: tr.artChildcare,      icon: 'happy-outline' },
    { id: 'laundry', label: tr.artLaundry,        icon: 'shirt-outline' },
    { id: 'garden',  label: tr.artGardening,      icon: 'leaf-outline' },
    { id: 'other',   label: tr.artShopping,       icon: 'ellipsis-horizontal-outline' },
  ];
  const WORK_TYPES = [
    { id: 'reguler', label: tr.wtRegularLabel, sub: tr.wtRegularSub, icon: 'calendar-outline' },
    { id: 'sekali',  label: tr.wtOnceLabel,    sub: tr.wtOnceSub,    icon: 'flash-outline' },
    { id: 'tinggal', label: tr.wtLiveinLabel,  sub: tr.wtLiveinSub,  icon: 'home-outline' },
  ];
  const SCHEDULES = [
    { id: 'pagi',  label: tr.scMorningLabel,   sub: tr.scMorningSub,   icon: 'sunny-outline' },
    { id: 'siang', label: tr.scAfternoonLabel, sub: tr.scAfternoonSub, icon: 'partly-sunny-outline' },
    { id: 'sore',  label: tr.scEveningLabel,   sub: tr.scEveningSub,   icon: 'moon-outline' },
    { id: 'fleks', label: tr.scFlexLabel,      sub: tr.scFlexSub,      icon: 'time-outline' },
  ];
  const BIO_TEMPLATES = {
    pengalaman: [tr.bioTpl0, tr.bioTpl1, tr.bioTpl2, tr.bioTpl3],
    sifat:      [tr.bioTpl4, tr.bioTpl5, tr.bioTpl6, tr.bioTpl7],
    kemampuan:  [tr.bioTpl8, tr.bioTpl9, tr.bioTpl10, tr.bioTpl11],
  };

  // ── Wizard state ──
  // initialRole이 있으면 역할 선택 단계(0) 스킵
  const [phase, setPhase] = useState(() => {
    if (!initialRole) return 0;
    if (initialRole === 'customer') return 11;
    if (initialRole === 'driver')   return 20;
    return 1; // helper or tutor
  });
  const [role, setRole] = useState<UserRole>(initialRole ?? 'customer');

  // Phase 1 — helper services
  const [services, setServices] = useState<string[]>([]);

  // Phase 2 — helper conditions
  const [rate,      setRate]      = useState('30000');
  const [areas,     setAreas]     = useState<string[]>([]);
  const [workTypes, setWorkTypes] = useState<string[]>([]);
  const [schedules, setSchedules] = useState<string[]>([]);

  // Phase 3 — helper profile
  const [bio,    setBio]    = useState('');
  const [bioTab, setBioTab] = useState<'pengalaman' | 'sifat' | 'kemampuan'>('pengalaman');

  // Phase 11 — customer service wants
  const [custServices, setCustServices] = useState<string[]>([]);

  // Phase 12 — customer area
  const [custAreas, setCustAreas] = useState<string[]>([]);

  // Phase 4 — terms (5 items: policy, service, privacy, thirdparty, marketing)
  const [termsChecked, setTermsChecked] = useState([false, false, false, false, false]);

  // Phase 5 — account
  const [name,     setName]     = useState('');
  const [phone,    setPhone]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [focused,  setFocused]  = useState<string | null>(null);

  // Phase 6 — identity verification (helper/tutor/driver)
  const [ktpUploaded,    setKtpUploaded]    = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);

  // Phase 20 — driver skill (drivable types + transmission + experience)
  const [drivableTypes, setDrivableTypes] = useState<string[]>([]);
  const [transmission,  setTransmission]  = useState<'auto' | 'manual' | 'both'>('auto');
  const [driverExp,     setDriverExp]     = useState('3');

  // Phase 21 — driver service kinds
  const [driverKinds, setDriverKinds] = useState<string[]>([]);

  // Phase 22 — driver area + rate
  const [driverAreas, setDriverAreas] = useState<string[]>([]);
  const [driverRate,  setDriverRate]  = useState('50000');

  const scrollRef = useRef<ScrollView>(null);

  const isHelper = role === 'helper' || role === 'tutor';
  const isDriver = role === 'driver';
  const isWorker = isHelper || isDriver;
  const serviceList = role === 'tutor' ? TUTOR_SERVICES : ART_SERVICES;

  // ── Driver-specific lists ──
  const DRIVABLE_TYPES = [
    { id: 'sedan',        label: tr.vehSedan,        icon: 'car-outline' },
    { id: 'suv',          label: tr.vehSuv,          icon: 'car-sport-outline' },
    { id: 'mpv',          label: tr.vehMpv,          icon: 'bus-outline' },
    { id: 'van',          label: tr.vehVan,          icon: 'bus' },
    { id: 'manual_stick', label: tr.vehManualStick,  icon: 'cog-outline' },
  ];
  const TRANSMISSION_OPTS = [
    { id: 'auto',   label: tr.transAuto,   icon: 'flash-outline' },
    { id: 'manual', label: tr.transManual, icon: 'cog-outline' },
    { id: 'both',   label: tr.transBoth,   icon: 'swap-horizontal-outline' },
  ] as const;
  const DRIVER_KINDS = [
    { id: 'designated', label: tr.dsvDesignated, sub: tr.dsvDesignatedSub, icon: 'moon-outline' },
    { id: 'daily',      label: tr.dsvDaily,      sub: tr.dsvDailySub,      icon: 'sunny-outline' },
    { id: 'hourly',     label: tr.dsvHourly,     sub: tr.dsvHourlySub,     icon: 'time-outline' },
    { id: 'commute',    label: tr.dsvCommute,    sub: tr.dsvCommuteSub,    icon: 'repeat-outline' },
    { id: 'airport',    label: tr.dsvAirport,    sub: tr.dsvAirportSub,    icon: 'airplane-outline' },
    { id: 'intercity',  label: tr.dsvIntercity,  sub: tr.dsvIntercitySub,  icon: 'map-outline' },
    { id: 'event',      label: tr.dsvEvent,      sub: tr.dsvEventSub,      icon: 'heart-outline' },
  ];

  const scrollToTop = () => scrollRef.current?.scrollTo({ y: 0, animated: false });

  // ── Navigation ──

  const goNext = (nextPhase: number) => { setPhase(nextPhase); scrollToTop(); };

  const goBack = () => {
    scrollToTop();
    if (phase === 0)  { navigation.goBack(); return; }
    if (phase === 1)  { setPhase(0);  return; }
    if (phase === 2)  { setPhase(1);  return; }
    if (phase === 3)  { setPhase(2);  return; }
    if (phase === 11) { initialRole ? navigation.goBack() : setPhase(0); return; }
    if (phase === 12) { setPhase(11); return; }
    if (phase === 20) { initialRole ? navigation.goBack() : setPhase(0); return; }
    if (phase === 21) { setPhase(20); return; }
    if (phase === 22) { setPhase(21); return; }
    if (phase === 4)  {
      const prev = isHelper ? 3 : isDriver ? 22 : 12;
      setPhase(prev); return;
    }
    if (phase === 5)  { setPhase(4);  return; }
    if (phase === 6)  { setPhase(5);  return; }
  };

  const handleNext = () => {
    if (phase === 0)  {
      const next = isDriver ? 20 : isHelper ? 1 : 11;
      goNext(next); return;
    }
    if (phase === 1)  { goNext(2);  return; }
    if (phase === 2)  { goNext(3);  return; }
    if (phase === 3)  { goNext(4);  return; }
    if (phase === 11) { goNext(12); return; }
    if (phase === 12) { goNext(4);  return; }
    if (phase === 20) { goNext(21); return; }
    if (phase === 21) { goNext(22); return; }
    if (phase === 22) { goNext(4);  return; }
    if (phase === 4)  { goNext(5);  return; }
  };

  const handleRegister = async () => {
    if (!name.trim() || !phone.trim() || !password.trim()) return;
    if (isWorker) { goNext(6); return; }  // workers go to verification step
    await register(name.trim(), phone.trim(), password, role);
  };

  const handleRegisterFinal = async () => {
    await register(name.trim(), phone.trim(), password, role);
  };

  const toggleItem = (id: string, list: string[], setList: (v: string[]) => void, max?: number) => {
    if (list.includes(id)) { setList(list.filter(x => x !== id)); }
    else { if (max && list.length >= max) return; setList([...list, id]); }
  };
  const appendBio = (sentence: string) => setBio(prev => prev ? `${prev} ${sentence}` : sentence);

  // Terms
  const termsAllChecked   = termsChecked.every(Boolean);
  // items 0-3 are required, item 4 is optional
  const termsReqSatisfied = termsChecked[0] && termsChecked[1] && termsChecked[2] && termsChecked[3];
  const toggleTermsAll    = () => setTermsChecked(termsChecked.map(() => !termsAllChecked));
  const toggleTerm        = (i: number) => { const n = [...termsChecked]; n[i] = !n[i]; setTermsChecked(n); };

  // ── Step indicator ──
  const helperStepLabels = [tr.stepService, tr.stepCondition, tr.stepProfile, tr.stepTerms, tr.stepAccount, 'Verifikasi'];
  const custStepLabels   = [tr.stepCustService, tr.stepCustArea, tr.stepTerms, tr.stepAccount];
  const driverStepLabels = [tr.stepDriverSkill, tr.stepDriverService, tr.stepDriverArea, tr.stepTerms, tr.stepAccount, tr.stepDriverLicense];

  let indicatorStep = 0, indicatorTotal = 0;
  let stepLabelArr: string[] = [];
  if (isHelper && phase >= 1 && phase <= 6) {
    indicatorStep = phase; indicatorTotal = 6; stepLabelArr = helperStepLabels;
  } else if (isDriver) {
    if (phase === 20)      { indicatorStep = 1; indicatorTotal = 6; stepLabelArr = driverStepLabels; }
    else if (phase === 21) { indicatorStep = 2; indicatorTotal = 6; stepLabelArr = driverStepLabels; }
    else if (phase === 22) { indicatorStep = 3; indicatorTotal = 6; stepLabelArr = driverStepLabels; }
    else if (phase === 4)  { indicatorStep = 4; indicatorTotal = 6; stepLabelArr = driverStepLabels; }
    else if (phase === 5)  { indicatorStep = 5; indicatorTotal = 6; stepLabelArr = driverStepLabels; }
    else if (phase === 6)  { indicatorStep = 6; indicatorTotal = 6; stepLabelArr = driverStepLabels; }
  } else if (role === 'customer') {
    if (phase === 11) { indicatorStep = 1; indicatorTotal = 4; stepLabelArr = custStepLabels; }
    else if (phase === 12) { indicatorStep = 2; indicatorTotal = 4; stepLabelArr = custStepLabels; }
    else if (phase === 4)  { indicatorStep = 3; indicatorTotal = 4; stepLabelArr = custStepLabels; }
    else if (phase === 5)  { indicatorStep = 4; indicatorTotal = 4; stepLabelArr = custStepLabels; }
  }
  const showStepIndicator = indicatorStep > 0;

  // ── Top bar title ──
  const topTitle =
    phase === 0  ? tr.titleRole
    : phase === 1  ? tr.titleService
    : phase === 2  ? tr.titleCondition
    : phase === 3  ? tr.titleProfile
    : phase === 4  ? tr.titleTerms
    : phase === 5  ? tr.titleAccount
    : phase === 6  ? (isDriver ? tr.driverLicenseTitle : 'Verifikasi Identitas')
    : phase === 11 ? tr.titleService
    : phase === 12 ? tr.titleCondition
    : phase === 20 ? tr.driverSkillTitle
    : phase === 21 ? tr.driverServiceTitle
    : phase === 22 ? tr.driverAreaTitle
    : tr.titleCondition;

  // ── Next button disabled? ──
  const nextDisabled =
    (phase === 1 && services.length === 0) ||
    (phase === 11 && custServices.length === 0) ||
    (phase === 20 && drivableTypes.length === 0) ||
    (phase === 21 && driverKinds.length === 0) ||
    (phase === 22 && driverAreas.length === 0) ||
    (phase === 4 && !termsReqSatisfied);

  // ── Show bottom bar? (phase 5 & 6 have inline CTA) ──
  const showBottomBar = phase !== 5 && phase !== 6;
  const showSkip = (isHelper && (phase === 2 || phase === 3)) || (role === 'customer' && phase === 12);

  // ── RENDER ───────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ── Persistent top bar ── */}
      <View style={[s.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={s.backBtn} onPress={goBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={s.topTitle}>{topTitle}</Text>
        <View style={{ width: 34 }} />
      </View>

      {/* ── Step indicator ── */}
      {showStepIndicator && (
        <View style={s.indicatorWrap}>
          <StepIndicator current={indicatorStep} total={indicatorTotal} />
          <Text style={s.stepLabel}>{stepLabelArr[indicatorStep - 1]}</Text>
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ══ PHASE 0 — Role selection ══════════════════════════════ */}
        {phase === 0 && (
          <View style={s.phaseWrap}>
            <Text style={s.phaseTitle}>{tr.roleQuestion}</Text>
            <Text style={s.phaseSub}>{tr.roleSubtitle}</Text>

            {([
              { value: 'customer' as UserRole, icon: 'search-outline', label: tr.roleCustomerLabel, sub: tr.roleCustomerSub, highlight: false },
              { value: 'helper'   as UserRole, icon: 'home-outline',   label: tr.roleHelperLabel,   sub: tr.roleHelperSub,   highlight: true  },
            ] as const).map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[s.roleCard, role === opt.value && s.roleCardActive, opt.highlight && s.roleCardHighlight]}
                onPress={() => setRole(opt.value)}
                activeOpacity={0.8}
              >
                <View style={[s.roleEmoji, role === opt.value && s.roleEmojiActive]}>
                  <Ionicons name={opt.icon as any} size={24} color={role === opt.value ? Colors.accent : Colors.gray} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.roleLabel, role === opt.value && s.roleLabelActive]}>{opt.label}</Text>
                  <Text style={s.roleSub}>{opt.sub}</Text>
                </View>
                <View style={[s.radioOuter, role === opt.value && s.radioOuterActive]}>
                  {role === opt.value && <View style={s.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ══ PHASE 1 — Helper/Tutor services ══════════════════════ */}
        {phase === 1 && (
          <View style={s.phaseWrap}>
            <Text style={s.phaseTitle}>{tr.serviceQuestion}</Text>
            <TipBanner text={tr.serviceTip} />
            <View style={s.chipGrid}>
              {serviceList.map((svc) => {
                const active = services.includes(svc.id);
                return (
                  <TouchableOpacity
                    key={svc.id}
                    style={[s.svcCard, active && s.svcCardActive]}
                    onPress={() => toggleItem(svc.id, services, setServices)}
                    activeOpacity={0.75}
                  >
                    <Ionicons name={svc.icon as any} size={22} color={active ? Colors.accent : Colors.gray} />
                    <Text style={[s.svcLabel, active && s.svcLabelActive]}>{svc.label}</Text>
                    {active && (
                      <View style={s.svcCheck}>
                        <Ionicons name="checkmark" size={10} color={Colors.white} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ══ PHASE 2 — Helper conditions ═══════════════════════════ */}
        {phase === 2 && (
          <View style={s.phaseWrap}>
            <Text style={s.sectionTitle}>{tr.rateTitle}</Text>
            <Text style={s.sectionSub}>{tr.rateChangeNote}</Text>
            <View style={s.rateRow}>
              <Text style={s.ratePrefix}>Rp</Text>
              <TextInput style={s.rateInput} keyboardType="numeric" value={rate} onChangeText={setRate} placeholder="30000" placeholderTextColor={Colors.grayLight} />
              <Text style={s.rateSuffix}>{tr.rateUnit}</Text>
            </View>
            <Text style={s.rateHint}>{tr.rateAverage}</Text>

            <Text style={[s.sectionTitle, { marginTop: 28 }]}>{tr.areaTitle}</Text>
            <Text style={s.sectionSub}>{tr.areaSub}</Text>
            <View style={s.areaGrid}>
              {AREAS.map((area) => {
                const active = areas.includes(area.id);
                const maxed  = !active && areas.length >= 3;
                return (
                  <TouchableOpacity key={area.id} style={[s.areaChip, active && s.areaChipActive, maxed && s.areaChipDisabled]}
                    onPress={() => toggleItem(area.id, areas, setAreas, 3)} activeOpacity={0.75}>
                    <Text style={[s.areaChipText, active && s.areaChipTextActive]}>{area.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[s.sectionTitle, { marginTop: 28 }]}>{tr.workTypeTitle}</Text>
            {WORK_TYPES.map((wt) => {
              const active = workTypes.includes(wt.id);
              return (
                <TouchableOpacity key={wt.id} style={[s.optionCard, active && s.optionCardActive]}
                  onPress={() => toggleItem(wt.id, workTypes, setWorkTypes)} activeOpacity={0.8}>
                  <Ionicons name={wt.icon as any} size={22} color={active ? Colors.accent : Colors.gray} />
                  <View style={{ flex: 1 }}>
                    <Text style={[s.optionLabel, active && s.optionLabelActive]}>{wt.label}</Text>
                    <Text style={s.optionSub}>{wt.sub}</Text>
                  </View>
                  <View style={[s.radioOuter, active && s.radioOuterActive]}>{active && <View style={s.radioInner} />}</View>
                </TouchableOpacity>
              );
            })}

            <Text style={[s.sectionTitle, { marginTop: 28 }]}>{tr.scheduleTitle}</Text>
            {SCHEDULES.map((sc) => {
              const active = schedules.includes(sc.id);
              return (
                <TouchableOpacity key={sc.id} style={[s.optionCard, active && s.optionCardActive]}
                  onPress={() => toggleItem(sc.id, schedules, setSchedules)} activeOpacity={0.8}>
                  <Ionicons name={sc.icon as any} size={22} color={active ? Colors.accent : Colors.gray} />
                  <View style={{ flex: 1 }}>
                    <Text style={[s.optionLabel, active && s.optionLabelActive]}>{sc.label}</Text>
                    <Text style={s.optionSub}>{sc.sub}</Text>
                  </View>
                  <View style={[s.checkboxOuter, active && s.checkboxActive]}>
                    {active && <Ionicons name="checkmark" size={12} color={Colors.white} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ══ PHASE 3 — Helper profile / bio ════════════════════════ */}
        {phase === 3 && (
          <View style={s.phaseWrap}>
            <Text style={s.phaseTitle}>{tr.introTitle}</Text>
            <Text style={s.phaseSub}>{tr.introSub}</Text>

            <TouchableOpacity style={s.photoCard} activeOpacity={0.8}>
              <Ionicons name="camera-outline" size={28} color={Colors.grayLight} />
              <Text style={s.photoNum}>0 / 5 {tr.photoCount}</Text>
              <Text style={s.photoHint}>{tr.photoHint}</Text>
            </TouchableOpacity>

            <TipBanner text={tr.photoTip} />

            <Text style={[s.sectionTitle, { marginTop: 20 }]}>{tr.bioTitle}</Text>
            <View style={s.bioWrap}>
              <TextInput
                style={s.bioInput} multiline numberOfLines={5}
                placeholder={tr.bioPlaceholder}
                placeholderTextColor={Colors.grayLight}
                value={bio} onChangeText={setBio}
                maxLength={2000} textAlignVertical="top"
              />
              <Text style={s.bioCount}>{bio.length} / 2000</Text>
            </View>

            <Text style={s.templateHint}>{tr.templateHint}</Text>
            <View style={s.tabRow}>
              {(['pengalaman', 'sifat', 'kemampuan'] as const).map((tab) => (
                <TouchableOpacity key={tab} style={[s.tabBtn, bioTab === tab && s.tabBtnActive]}
                  onPress={() => setBioTab(tab)} activeOpacity={0.75}>
                  <Text style={[s.tabBtnText, bioTab === tab && s.tabBtnTextActive]}>
                    {tab === 'pengalaman' ? tr.tabExperience : tab === 'sifat' ? tr.tabPersonality : tr.tabSkill}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={s.templateList}>
              {BIO_TEMPLATES[bioTab].map((sentence, i) => (
                <TouchableOpacity key={i} style={s.templateRow} onPress={() => appendBio(sentence)} activeOpacity={0.75}>
                  <Text style={s.templateText} numberOfLines={2}>{sentence}</Text>
                  <View style={s.templateSelectBtn}>
                    <Text style={s.templateSelectText}>{tr.templateSelect}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ══ PHASE 11 — Customer: services wanted ══════════════════ */}
        {phase === 11 && (
          <View style={s.phaseWrap}>
            <Text style={s.phaseTitle}>{tr.custServiceQuestion}</Text>
            <TipBanner text={tr.custServiceTip} />
            <View style={s.chipGrid}>
              {CUSTOMER_SERVICES.map((svc) => {
                const active = custServices.includes(svc.id);
                return (
                  <TouchableOpacity
                    key={svc.id}
                    style={[s.svcCard, active && s.svcCardActive]}
                    onPress={() => toggleItem(svc.id, custServices, setCustServices)}
                    activeOpacity={0.75}
                  >
                    <Ionicons name={svc.icon as any} size={22} color={active ? Colors.accent : Colors.gray} />
                    <Text style={[s.svcLabel, active && s.svcLabelActive]}>{svc.label}</Text>
                    {active && (
                      <View style={s.svcCheck}>
                        <Ionicons name="checkmark" size={10} color={Colors.white} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ══ PHASE 12 — Customer: area ═════════════════════════════ */}
        {phase === 12 && (
          <View style={s.phaseWrap}>
            <Text style={s.phaseTitle}>내 지역 설정</Text>
            <Text style={s.phaseSub}>서비스를 받고 싶은 지역을 선택해주세요 (최대 3개)</Text>
            <View style={s.areaGrid}>
              {AREAS.map((area) => {
                const active = custAreas.includes(area.id);
                const maxed  = !active && custAreas.length >= 3;
                return (
                  <TouchableOpacity key={area.id} style={[s.areaChip, active && s.areaChipActive, maxed && s.areaChipDisabled]}
                    onPress={() => toggleItem(area.id, custAreas, setCustAreas, 3)} activeOpacity={0.75}>
                    <Text style={[s.areaChipText, active && s.areaChipTextActive]}>{area.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ══ PHASE 20 — Driver: drivable types + transmission + exp ═ */}
        {phase === 20 && (
          <View style={s.phaseWrap}>
            <Text style={s.phaseTitle}>{tr.driverSkillTitle}</Text>
            <Text style={s.phaseSub}>{tr.driverSkillSub}</Text>

            <Text style={[s.sectionTitle, { marginTop: 18 }]}>{tr.drivableTypesLabel}</Text>
            <Text style={s.sectionSub}>{tr.drivableTypesSub}</Text>
            <View style={s.chipGrid}>
              {DRIVABLE_TYPES.map((v) => {
                const active = drivableTypes.includes(v.id);
                return (
                  <TouchableOpacity
                    key={v.id}
                    style={[s.svcCard, active && s.svcCardActive]}
                    onPress={() => toggleItem(v.id, drivableTypes, setDrivableTypes)}
                    activeOpacity={0.75}
                  >
                    <Ionicons name={v.icon as any} size={22} color={active ? Colors.accent : Colors.gray} />
                    <Text style={[s.svcLabel, active && s.svcLabelActive]}>{v.label}</Text>
                    {active && (
                      <View style={s.svcCheck}>
                        <Ionicons name="checkmark" size={10} color={Colors.white} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[s.sectionTitle, { marginTop: 24 }]}>{tr.transmissionLabel}</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {TRANSMISSION_OPTS.map((t) => {
                const active = transmission === t.id;
                return (
                  <TouchableOpacity
                    key={t.id}
                    style={[s.svcCard, { flex: 1 }, active && s.svcCardActive]}
                    onPress={() => setTransmission(t.id)}
                    activeOpacity={0.75}
                  >
                    <Ionicons name={t.icon as any} size={20} color={active ? Colors.accent : Colors.gray} />
                    <Text style={[s.svcLabel, active && s.svcLabelActive]}>{t.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[s.sectionTitle, { marginTop: 24 }]}>{tr.driverExperience}</Text>
            <View style={[s.field, focused === 'exp' && s.fieldFocused]}>
              <Ionicons name="trophy-outline" size={16} color={Colors.grayLight} />
              <TextInput style={s.input} placeholder="3" placeholderTextColor={Colors.grayLight}
                keyboardType="numeric" maxLength={2}
                value={driverExp} onChangeText={setDriverExp}
                onFocus={() => setFocused('exp')} onBlur={() => setFocused(null)} />
            </View>
          </View>
        )}

        {/* ══ PHASE 21 — Driver: service kinds ══════════════════════ */}
        {phase === 21 && (
          <View style={s.phaseWrap}>
            <Text style={s.phaseTitle}>{tr.driverServiceTitle}</Text>
            <TipBanner text={tr.driverServiceSub} />
            {DRIVER_KINDS.map((k) => {
              const active = driverKinds.includes(k.id);
              return (
                <TouchableOpacity
                  key={k.id}
                  style={[s.optionCard, active && s.optionCardActive]}
                  onPress={() => toggleItem(k.id, driverKinds, setDriverKinds)}
                  activeOpacity={0.8}
                >
                  <Ionicons name={k.icon as any} size={22} color={active ? Colors.accent : Colors.gray} />
                  <View style={{ flex: 1 }}>
                    <Text style={[s.optionLabel, active && s.optionLabelActive]}>{k.label}</Text>
                    <Text style={s.optionSub}>{k.sub}</Text>
                  </View>
                  <View style={[s.checkboxOuter, active && s.checkboxActive]}>
                    {active && <Ionicons name="checkmark" size={12} color={Colors.white} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ══ PHASE 22 — Driver: area + rate ════════════════════════ */}
        {phase === 22 && (
          <View style={s.phaseWrap}>
            <Text style={s.sectionTitle}>{tr.rateTitle}</Text>
            <Text style={s.sectionSub}>{tr.rateChangeNote}</Text>
            <View style={s.rateRow}>
              <Text style={s.ratePrefix}>Rp</Text>
              <TextInput style={s.rateInput} keyboardType="numeric" value={driverRate} onChangeText={setDriverRate} placeholder="50000" placeholderTextColor={Colors.grayLight} />
              <Text style={s.rateSuffix}>{tr.rateUnit}</Text>
            </View>

            <Text style={[s.sectionTitle, { marginTop: 24 }]}>{tr.driverAreaTitle}</Text>
            <Text style={s.sectionSub}>{tr.driverAreaSub}</Text>
            <View style={s.areaGrid}>
              {AREAS.map((area) => {
                const active = driverAreas.includes(area.id);
                const maxed  = !active && driverAreas.length >= 3;
                return (
                  <TouchableOpacity key={area.id} style={[s.areaChip, active && s.areaChipActive, maxed && s.areaChipDisabled]}
                    onPress={() => toggleItem(area.id, driverAreas, setDriverAreas, 3)} activeOpacity={0.75}>
                    <Text style={[s.areaChipText, active && s.areaChipTextActive]}>{area.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ══ PHASE 4 — Terms of Service (mandatory for all) ════════ */}
        {phase === 4 && (
          <View style={s.phaseWrap}>
            {/* Inline policy text sections */}
            {(() => {
              const p = POLICY_TEXT[lang] ?? POLICY_TEXT.id;
              return (
                <View style={s.termsInlineWrap}>
                  <View style={s.termsInlineSection}>
                    <Text style={s.termsInlineTitle}>{p.p1Title}</Text>
                    <Text style={s.termsInlineBody}>{p.p1Body}</Text>
                  </View>
                  <View style={s.termsInlineDivider} />
                  <View style={s.termsInlineSection}>
                    <Text style={s.termsInlineTitle}>{p.p2Title}</Text>
                    <Text style={s.termsInlineBody}>{p.p2Body}</Text>
                  </View>
                </View>
              );
            })()}

            {/* Consent checklist */}
            <View style={s.termsCard}>
              {/* Agree all */}
              <TouchableOpacity style={s.termsAgreeAllRow} onPress={toggleTermsAll} activeOpacity={0.8}>
                <View style={[s.termsBigCheck, termsAllChecked && s.termsBigCheckOn]}>
                  {termsAllChecked && <Ionicons name="checkmark" size={16} color={Colors.white} />}
                </View>
                <Text style={s.termsAgreeAllText}>{tr.termsAgreeAll}</Text>
              </TouchableOpacity>

              <View style={s.termsDivider} />

              {/* Individual items — 5 total (0=policy, 1=service, 2=privacy, 3=thirdparty, 4=marketing) */}
              {[
                { label: tr.termsItem1, opt: false, hasView: false },
                { label: tr.termsItem2, opt: false, hasView: true  },
                { label: tr.termsItem3, opt: false, hasView: true  },
                { label: tr.termsItem4, opt: false, hasView: true  },
                { label: lang === 'ko' ? '(선택)이벤트·혜택 및 커뮤니티 알림 수신'
                        : lang === 'en' ? '(Optional) Receive promo & community notifications'
                        : lang === 'ja' ? '（任意）イベント・特典・コミュニティ通知受信'
                        : lang === 'zh' ? '（可选）接收活动及社区通知'
                        : '(Opsional) Terima notifikasi promo & komunitas',
                  opt: true, hasView: true },
              ].map((item, i) => (
                <View key={i} style={s.termsItemRow}>
                  <TouchableOpacity
                    style={s.termsItemCheckArea}
                    onPress={() => toggleTerm(i)}
                    activeOpacity={0.75}
                  >
                    <View style={[s.termsSmallCheck, termsChecked[i] && s.termsSmallCheckOn]}>
                      {termsChecked[i] && <Ionicons name="checkmark" size={12} color={Colors.white} />}
                    </View>
                    <Text style={[s.termsItemLabel, item.opt && s.termsItemLabelOpt]} numberOfLines={2}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                  {item.hasView && (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Terms', { mode: 'view' })}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={s.termsViewBtn}
                    >
                      <Ionicons name="chevron-forward" size={13} color={Colors.grayLight} />
                      <Text style={s.termsViewBtnText}>{tr.termsViewLabel}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            <Text style={s.termsNote}>
              {tr.termsNote}{' '}
              <Text style={s.termsNoteLink}>{tr.termsTerms}</Text>
              {' '}{tr.termsAnd}{' '}
              <Text style={s.termsNoteLink}>{tr.termsPrivacy}</Text>
              {' '}Linka.
            </Text>
          </View>
        )}

        {/* ══ PHASE 5 — Account ══════════════════════════════════════ */}
        {phase === 5 && (
          <View style={s.phaseWrap}>
            <Text style={s.phaseTitle}>
              {isWorker ? tr.accountTitleHelper : tr.accountTitleCustomer}
            </Text>
            <Text style={s.phaseSub}>
              {isWorker ? tr.accountSubHelper : tr.accountSubCustomer}
            </Text>

            <Text style={s.label}>{tr.labelName}</Text>
            <View style={[s.field, focused === 'name' && s.fieldFocused]}>
              <Ionicons name="person-outline" size={16} color={focused === 'name' ? Colors.dark : Colors.grayLight} />
              <TextInput style={s.input} placeholder={tr.namePlaceholder} placeholderTextColor={Colors.grayLight}
                value={name} onChangeText={setName} onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} />
            </View>

            <Text style={[s.label, { marginTop: 16 }]}>{tr.labelPhone}</Text>
            <View style={[s.field, focused === 'phone' && s.fieldFocused]}>
              <Ionicons name="call-outline" size={16} color={focused === 'phone' ? Colors.dark : Colors.grayLight} />
              <TextInput style={s.input} placeholder={tr.phonePlaceholder} placeholderTextColor={Colors.grayLight}
                keyboardType="phone-pad" value={phone} onChangeText={setPhone}
                onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)} />
            </View>

            <Text style={[s.label, { marginTop: 16 }]}>{tr.labelPassword}</Text>
            <View style={[s.field, focused === 'pass' && s.fieldFocused]}>
              <Ionicons name="lock-closed-outline" size={16} color={focused === 'pass' ? Colors.dark : Colors.grayLight} />
              <TextInput style={[s.input, { flex: 1 }]} placeholder={tr.passwordPlaceholder}
                placeholderTextColor={Colors.grayLight} secureTextEntry={!showPass}
                value={password} onChangeText={setPassword}
                onFocus={() => setFocused('pass')} onBlur={() => setFocused(null)} />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={16} color={Colors.grayLight} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[s.ctaBtn, (!name || !phone || !password) && s.ctaBtnDisabled]}
              onPress={handleRegister}
              activeOpacity={0.85}
              disabled={!name || !phone || !password || isLoading}
            >
              {isLoading
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={s.ctaBtnText}>{tr.finish}</Text>
              }
            </TouchableOpacity>

            <View style={s.loginRow}>
              <Text style={s.loginText}>{tr.hasAccount}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={s.loginLink}> {tr.loginLink}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Phase 6: Verifikasi Identitas (helper/tutor/driver) ── */}
        {phase === 6 && (
          <View style={s.phaseWrap}>
            <Text style={s.phaseTitle}>
              {isDriver ? tr.driverLicenseTitle : 'Verifikasi Identitas'}
            </Text>
            <Text style={s.phaseSub}>
              {isDriver
                ? tr.driverLicenseSub
                : 'Unggah KTP dan foto selfie untuk meningkatkan kepercayaan pelanggan. Identitas Anda aman dan tidak dibagikan.'}
            </Text>

            {isDriver && (
              <View style={s.requiredBanner}>
                <Ionicons name="alert-circle" size={14} color="#DC2626" />
                <Text style={s.requiredBannerText}>
                  SIM wajib diverifikasi sebelum mulai menerima pesanan
                </Text>
              </View>
            )}

            {/* KTP / SIM 업로드 */}
            <TouchableOpacity
              style={[s.verifyUploadCard, ktpUploaded && s.verifyUploadCardDone]}
              onPress={() => setKtpUploaded(!ktpUploaded)}
              activeOpacity={0.8}
            >
              <View style={[s.verifyIconCircle, ktpUploaded && s.verifyIconCircleDone]}>
                {ktpUploaded
                  ? <Ionicons name="checkmark" size={22} color={Colors.white} />
                  : <Ionicons name={isDriver ? 'car-outline' : 'card-outline'} size={22} color={Colors.accent} />
                }
              </View>
              <View style={{ flex: 1 }}>
                <View style={s.verifyCardTitleRow}>
                  <Text style={s.verifyCardTitle}>{isDriver ? 'Foto SIM' : 'Foto KTP'}</Text>
                  {isDriver && <Text style={s.requiredChip}>Wajib</Text>}
                </View>
                <Text style={s.verifyCardSub}>
                  {ktpUploaded
                    ? (isDriver ? '✓ SIM berhasil diunggah' : '✓ KTP berhasil diunggah')
                    : (isDriver ? 'Ambil foto SIM Anda yang jelas dan masih berlaku' : 'Ambil foto KTP Anda yang jelas dan terbaca')}
                </Text>
              </View>
              <View style={[s.verifyStatusDot, ktpUploaded && s.verifyStatusDotDone]}>
                <Ionicons
                  name={ktpUploaded ? 'checkmark' : 'camera-outline'}
                  size={14}
                  color={ktpUploaded ? Colors.white : Colors.grayLight}
                />
              </View>
            </TouchableOpacity>

            {/* 셀카 업로드 */}
            <TouchableOpacity
              style={[s.verifyUploadCard, selfieUploaded && s.verifyUploadCardDone]}
              onPress={() => setSelfieUploaded(!selfieUploaded)}
              activeOpacity={0.8}
            >
              <View style={[s.verifyIconCircle, selfieUploaded && s.verifyIconCircleDone]}>
                {selfieUploaded
                  ? <Ionicons name="checkmark" size={22} color={Colors.white} />
                  : <Ionicons name="person-outline" size={22} color={Colors.accent} />
                }
              </View>
              <View style={{ flex: 1 }}>
                <View style={s.verifyCardTitleRow}>
                  <Text style={s.verifyCardTitle}>{isDriver ? 'Selfie dengan SIM' : 'Selfie dengan KTP'}</Text>
                  {isDriver && <Text style={s.requiredChip}>Wajib</Text>}
                </View>
                <Text style={s.verifyCardSub}>
                  {selfieUploaded
                    ? '✓ Selfie berhasil diunggah'
                    : (isDriver ? 'Foto wajah Anda sambil memegang SIM' : 'Foto wajah Anda sambil memegang KTP')}
                </Text>
              </View>
              <View style={[s.verifyStatusDot, selfieUploaded && s.verifyStatusDotDone]}>
                <Ionicons
                  name={selfieUploaded ? 'checkmark' : 'camera-outline'}
                  size={14}
                  color={selfieUploaded ? Colors.white : Colors.grayLight}
                />
              </View>
            </TouchableOpacity>

            {/* 안내 박스 */}
            <View style={s.verifyInfoBox}>
              <Ionicons name="shield-checkmark-outline" size={16} color={Colors.accent} />
              <Text style={s.verifyInfoText}>
                {isDriver
                  ? 'SIM Anda akan diverifikasi untuk keamanan pelanggan. Data dienkripsi dan hanya digunakan untuk proses verifikasi (1×24 jam).'
                  : 'Data Anda dienkripsi dan hanya digunakan untuk verifikasi. Proses verifikasi membutuhkan 1×24 jam.'}
              </Text>
            </View>

            {/* 등록 버튼 */}
            <TouchableOpacity
              style={[s.ctaBtn, { marginTop: 8 }, (!ktpUploaded || !selfieUploaded) && s.ctaBtnDisabled]}
              onPress={handleRegisterFinal}
              activeOpacity={0.85}
              disabled={!ktpUploaded || !selfieUploaded || isLoading}
            >
              {isLoading
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={s.ctaBtnText}>Daftar & Kirim Verifikasi</Text>
              }
            </TouchableOpacity>

            {/* 건너뛰기 — 헬퍼만 가능, 드라이버는 필수 */}
            {!isDriver && (
              <TouchableOpacity style={[s.loginRow, { marginTop: 8 }]} onPress={handleRegisterFinal}>
                <Text style={s.loginText}>Lewati, verifikasi nanti  </Text>
                <Text style={s.loginLink}>→</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── Persistent bottom CTA ── */}
      {showBottomBar && (
        <View style={s.bottomBar}>
          {showSkip && (
            <TouchableOpacity style={s.skipBtn} onPress={handleNext} activeOpacity={0.7}>
              <Text style={s.skipText}>{tr.skip}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[s.nextBtn, nextDisabled && s.nextBtnDisabled]}
            onPress={handleNext}
            disabled={nextDisabled}
            activeOpacity={0.85}
          >
            <Text style={s.nextBtnText}>
              {phase === 4 ? tr.termsAgreeAll : tr.next}
            </Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

// ── Styles ────────────────────────────────────────────────────────

const s = StyleSheet.create({
  // Layout
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: Colors.section,
    alignItems: 'center', justifyContent: 'center',
  },
  topTitle: { fontSize: 16, fontWeight: '700', color: Colors.dark },
  indicatorWrap: { paddingBottom: 0, backgroundColor: Colors.white },
  stepLabel: {
    textAlign: 'center', fontSize: 12, fontWeight: '600',
    color: GREEN, marginTop: -8, marginBottom: 10,
  },

  scroll: { flexGrow: 1, paddingBottom: 40 },
  phaseWrap: { paddingHorizontal: 20, paddingTop: 20, gap: 12 },

  phaseTitle: { fontSize: 22, fontWeight: '700', color: Colors.dark, lineHeight: 30 },
  phaseSub:   { fontSize: 13, color: Colors.gray, marginTop: -4 },

  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.dark },
  sectionSub:   { fontSize: 12, color: Colors.gray, marginTop: -4 },

  // Role cards
  roleCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg, borderWidth: 1.5, borderColor: Colors.border,
    padding: 16, ...Shadow.sm,
  },
  roleCardActive:    { borderColor: GREEN, backgroundColor: Colors.accentLight },
  roleCardHighlight: { borderColor: Colors.borderMid },
  roleEmoji: {
    width: 52, height: 52, borderRadius: Radius.md,
    backgroundColor: Colors.section, alignItems: 'center', justifyContent: 'center',
  },
  roleEmojiActive: { backgroundColor: Colors.white },
  roleLabel:       { fontSize: 15, fontWeight: '700', color: Colors.dark, marginBottom: 3 },
  roleLabelActive: { color: GREEN },
  roleSub:         { fontSize: 12, color: Colors.gray, lineHeight: 18 },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 1.5, borderColor: Colors.borderMid,
    alignItems: 'center', justifyContent: 'center',
  },
  radioOuterActive: { borderColor: GREEN },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: GREEN },

  // Service chips
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  svcCard: {
    width: '47%', flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg, borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 14,
    position: 'relative', ...Shadow.sm,
  },
  svcCardActive:  { borderColor: GREEN, backgroundColor: Colors.accentLight },
  svcLabel:       { fontSize: 13, fontWeight: '500', color: Colors.gray, flex: 1 },
  svcLabelActive: { color: Colors.dark, fontWeight: '700' },
  svcCheck: {
    position: 'absolute', top: 6, right: 6,
    width: 18, height: 18, borderRadius: 9, backgroundColor: GREEN,
    alignItems: 'center', justifyContent: 'center',
  },

  // Rate
  rateRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.section, borderRadius: Radius.lg,
    paddingHorizontal: 16, paddingVertical: 4,
    borderWidth: 1.5, borderColor: Colors.borderMid,
  },
  ratePrefix: { fontSize: 16, fontWeight: '600', color: Colors.gray },
  rateInput:  { flex: 1, fontSize: 22, fontWeight: '700', color: Colors.dark, paddingVertical: 12 },
  rateSuffix: { fontSize: 14, color: Colors.gray },
  rateHint:   { fontSize: 12, color: Colors.grayLight, marginTop: -4 },

  // Area chips
  areaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  areaChip: {
    borderRadius: Radius.pill, borderWidth: 1.5, borderColor: Colors.borderMid,
    paddingHorizontal: 14, paddingVertical: 8, backgroundColor: Colors.white,
  },
  areaChipActive:    { borderColor: GREEN, backgroundColor: Colors.accentLight },
  areaChipDisabled:  { opacity: 0.4 },
  areaChipText:      { fontSize: 13, fontWeight: '500', color: Colors.gray },
  areaChipTextActive:{ color: GREEN, fontWeight: '700' },

  // Option cards (work type / schedule)
  optionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg, borderWidth: 1.5, borderColor: Colors.border,
    padding: 14, ...Shadow.sm,
  },
  optionCardActive:  { borderColor: GREEN, backgroundColor: Colors.accentLight },
  optionLabel:       { fontSize: 14, fontWeight: '600', color: Colors.dark, marginBottom: 2 },
  optionLabelActive: { color: GREEN },
  optionSub:         { fontSize: 12, color: Colors.gray },
  checkboxOuter: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 1.5, borderColor: Colors.borderMid,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: GREEN, borderColor: GREEN },

  // Profile / bio
  photoCard: {
    height: 110, borderRadius: Radius.lg,
    borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed',
    backgroundColor: Colors.section,
    alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  photoNum:  { fontSize: 14, fontWeight: '600', color: Colors.grayLight },
  photoHint: { fontSize: 12, color: Colors.grayLight },
  bioWrap: {
    backgroundColor: Colors.section, borderRadius: Radius.lg,
    borderWidth: 1.5, borderColor: Colors.borderMid,
    padding: 14, position: 'relative',
  },
  bioInput:  { fontSize: 14, color: Colors.dark, lineHeight: 22, minHeight: 100 },
  bioCount:  { fontSize: 11, color: Colors.grayLight, alignSelf: 'flex-end', marginTop: 4 },
  templateHint: { fontSize: 12, color: Colors.grayLight, marginTop: 4 },
  tabRow: { flexDirection: 'row', gap: 6, marginTop: -4 },
  tabBtn: {
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: Radius.pill, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  tabBtnActive:     { borderColor: GREEN, backgroundColor: Colors.accentLight },
  tabBtnText:       { fontSize: 12, fontWeight: '500', color: Colors.gray },
  tabBtnTextActive: { color: GREEN, fontWeight: '700' },
  templateList: {
    backgroundColor: Colors.section, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  templateRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  templateText:       { flex: 1, fontSize: 13, color: Colors.gray, lineHeight: 18 },
  templateSelectBtn:  { backgroundColor: Colors.white, borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.borderMid, paddingHorizontal: 12, paddingVertical: 5 },
  templateSelectText: { fontSize: 12, fontWeight: '600', color: Colors.dark },

  // Terms phase
  termsOverviewCard: {
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.accent + '30',
    padding: 16, gap: 10,
  },
  termsOverviewBadge:     { flexDirection: 'row', alignItems: 'center', gap: 6 },
  termsOverviewBadgeText: { fontSize: 12, fontWeight: '700', color: Colors.accent },
  termsOverviewBody:      { fontSize: 12, color: Colors.dark, lineHeight: 20 },

  termsCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden',
  },
  termsAgreeAllRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 16, backgroundColor: Colors.section,
  },
  termsBigCheck: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 2, borderColor: Colors.borderMid,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
  },
  termsBigCheckOn:   { backgroundColor: GREEN, borderColor: GREEN },
  termsAgreeAllText: { fontSize: 14, fontWeight: '700', color: Colors.dark, flex: 1 },
  termsDivider:      { height: 1, backgroundColor: Colors.border },

  termsItemRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingLeft: 16, paddingRight: 12, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  termsItemCheckArea:  { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  termsSmallCheck: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 1.5, borderColor: Colors.borderMid,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  termsSmallCheckOn:   { backgroundColor: GREEN, borderColor: GREEN },
  termsItemLabel:      { flex: 1, fontSize: 13, color: Colors.dark, lineHeight: 18 },
  termsItemLabelOpt:   { color: Colors.gray },
  termsViewBtn:        { flexDirection: 'row', alignItems: 'center', gap: 2, paddingLeft: 8 },
  termsViewBtnText:    { fontSize: 11, color: Colors.grayLight },

  termsNote:     { fontSize: 11, color: Colors.grayLight, lineHeight: 18, textAlign: 'center', marginTop: 4 },
  termsNoteLink: { color: Colors.accent, fontWeight: '500' },

  // Account form
  label: { fontSize: 13, fontWeight: '600', color: Colors.darkMid, marginBottom: 8 },
  field: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.section, borderRadius: Radius.lg,
    paddingHorizontal: 14, borderWidth: 1.5, borderColor: 'transparent',
  },
  fieldFocused: { borderColor: GREEN, backgroundColor: Colors.white },
  input: { flex: 1, paddingVertical: 13, fontSize: 15, color: Colors.dark },

  ctaBtn: {
    marginTop: 20, backgroundColor: GREEN,
    borderRadius: Radius.pill, paddingVertical: 15,
    alignItems: 'center', ...Shadow.sm,
  },
  ctaBtnDisabled: { backgroundColor: Colors.borderMid },
  ctaBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },

  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  loginText: { fontSize: 14, color: Colors.gray },
  loginLink: { fontSize: 14, fontWeight: '700', color: Colors.dark },

  // Bottom bar
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border,
    paddingHorizontal: 20, paddingBottom: Platform.OS === 'ios' ? 32 : 16, paddingTop: 12,
    gap: 10,
  },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: GREEN, borderRadius: Radius.pill, paddingVertical: 15,
    ...Shadow.sm,
  },
  nextBtnDisabled: { backgroundColor: Colors.borderMid },
  nextBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  skipBtn:  { alignItems: 'center' },
  skipText: { fontSize: 14, color: Colors.gray, fontWeight: '500' },

  // Verification phase styles
  verifyUploadCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 1.5, borderColor: Colors.borderMid, borderRadius: Radius.lg,
    padding: 16, backgroundColor: Colors.white, marginBottom: 12, ...Shadow.sm,
  },
  verifyUploadCardDone: { borderColor: Colors.accent, backgroundColor: Colors.accentLight },
  verifyIconCircle: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center',
  },
  verifyIconCircleDone: { backgroundColor: Colors.accent },
  verifyCardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  verifyCardTitle: { fontSize: 14, fontWeight: '700', color: Colors.dark },
  verifyCardSub:   { fontSize: 12, color: Colors.gray, lineHeight: 18 },
  requiredBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FEE2E2', borderRadius: Radius.md,
    paddingHorizontal: 12, paddingVertical: 9,
    marginBottom: 12,
  },
  requiredBannerText: { flex: 1, fontSize: 12, color: '#B91C1C', fontWeight: '600' },
  requiredChip: {
    fontSize: 10, fontWeight: '700', color: '#DC2626',
    backgroundColor: '#FEE2E2', paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 6,
  },
  verifyStatusDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.section, borderWidth: 1, borderColor: Colors.borderMid,
    alignItems: 'center', justifyContent: 'center',
  },
  verifyStatusDotDone: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  verifyInfoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: Colors.accentLight, borderRadius: Radius.md,
    padding: 14, marginBottom: 12,
  },
  verifyInfoText: { flex: 1, fontSize: 12, color: Colors.dark, lineHeight: 18 },

  // Inline terms policy block
  termsInlineWrap: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: 4,
  },
  termsInlineSection: { padding: 16, gap: 8 },
  termsInlineDivider: { height: 1, backgroundColor: Colors.border },
  termsInlineTitle: { fontSize: 13, fontWeight: '800', color: Colors.dark, lineHeight: 20 },
  termsInlineBody: { fontSize: 12, color: Colors.gray, lineHeight: 20 },
});
