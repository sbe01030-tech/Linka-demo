/**
 * BookingScreen — 예약 플로우
 *
 * Step 1: 서비스 유형 선택 (단기 / 정기)
 *
 * [단기] Step 2: 날짜  → Step 3: 시간+이용시간 → Step 4: 주소+메모 → Step 5: 확인+결제
 * [정기] Step 2: 요일  → Step 3: 시작일+기간+시간+이용시간 → Step 4: 주소+메모 → Step 5: 확인+결제
 */
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Platform, StatusBar, Modal, KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { RootStackParamList } from '../../types';
import { useLanguageStore } from '../../store/languageStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Booking'>;

const GREEN        = Colors.accent;
const DEPOSIT_RATE = 0.3;
const REGULAR_DISC = 0.1; // 정기 10% 할인

// ── 날짜 헬퍼 ──────────────────────────────────────────────────
const DAY_ID  = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
const MONTH_ID = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];

function getDateChips(count = 14) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      label:   `${d.getDate()} ${MONTH_ID[d.getMonth()]}`,
      dayName: DAY_ID[d.getDay()],
      dateStr: d.toISOString().slice(0, 10),
    };
  });
}

const DATE_CHIPS  = getDateChips(14);
const TIME_SLOTS  = Array.from({ length: 13 }, (_, i) => `${(8 + i).toString().padStart(2,'0')}:00`);
const WEEK_DAYS   = ['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
const WEEK_LABELS = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'];
const CONTRACT_OPTIONS = [
  { id: '1m',  label: '1 Bulan',  months: 1 },
  { id: '3m',  label: '3 Bulan',  months: 3 },
  { id: '6m',  label: '6 Bulan',  months: 6 },
  { id: '12m', label: '12 Bulan', months: 12 },
];

// ── 단계 바 ────────────────────────────────────────────────────
type ServiceMode = 'onetime' | 'regular' | null;

function StepBar({ step, mode, isDriver = false, lang = 'id' }: { step: number; mode: ServiceMode; isDriver?: boolean; lang?: string }) {
  const L = (ko: string, en: string, id: string) =>
    lang === 'ko' ? ko : lang === 'en' ? en : id;
  const addr   = isDriver ? L('픽업', 'Pickup', 'Jemput') : L('주소', 'Address', 'Alamat');
  const labels = (mode === 'regular')
    ? [L('유형', 'Type', 'Jenis'), L('요일', 'Day', 'Hari'), L('일정', 'Sched', 'Jadwal'), addr, L('확인', 'Confirm', 'Cek')]
    : [L('유형', 'Type', 'Jenis'), L('날짜', 'Date', 'Tgl'),  L('시간', 'Time', 'Jam'),    addr, L('확인', 'Confirm', 'Cek')];

  return (
    <View style={sb.wrap}>
      {labels.map((label, i) => {
        const idx     = i + 1;
        const done    = step > idx;
        const current = step === idx;
        return (
          <React.Fragment key={label + i}>
            <View style={sb.item}>
              <View style={[sb.dot, done && sb.dotDone, current && sb.dotCurrent]}>
                {done
                  ? <Ionicons name="checkmark" size={11} color="#fff" />
                  : <Text style={[sb.dotNum, current && sb.dotNumCurrent]}>{idx}</Text>
                }
              </View>
              <Text style={[sb.label, current && sb.labelCurrent]}>{label}</Text>
            </View>
            {i < 4 && <View style={[sb.line, done && sb.lineDone]} />}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const sb = StyleSheet.create({
  wrap:          { flexDirection:'row', alignItems:'center', paddingHorizontal:20, paddingVertical:14 },
  item:          { alignItems:'center', gap:3 },
  dot:           { width:24, height:24, borderRadius:12, borderWidth:1.5, borderColor:Colors.borderMid, backgroundColor:Colors.white, alignItems:'center', justifyContent:'center' },
  dotDone:       { backgroundColor:GREEN, borderColor:GREEN },
  dotCurrent:    { borderColor:GREEN },
  dotNum:        { fontSize:10, fontWeight:'700', color:Colors.grayLight },
  dotNumCurrent: { color:GREEN },
  label:         { fontSize:9, color:Colors.grayLight, fontWeight:'500' },
  labelCurrent:  { color:GREEN, fontWeight:'700' },
  line:          { flex:1, height:1.5, backgroundColor:Colors.borderMid, marginBottom:12 },
  lineDone:      { backgroundColor:GREEN },
});

// ── 공통 UI ────────────────────────────────────────────────────
function SectionLabel({ text, mt = 20 }: { text: string; mt?: number }) {
  return <Text style={[u.label, { marginTop: mt }]}>{text}</Text>;
}

const u = StyleSheet.create({
  label: { fontSize:13, fontWeight:'700', color:Colors.darkMid, marginBottom:10 },
});

// ── 메인 ──────────────────────────────────────────────────────
export default function BookingScreen({ route, navigation }: Props) {
  const { workerName, pricePerHour, serviceType } = route.params;
  const insets = useSafeAreaInsets();
  const { lang } = useLanguageStore();
  const isDriver = serviceType === 'driver';
  const tx = (ko: string, en: string, id: string) =>
    lang === 'ko' ? ko : lang === 'en' ? en : id;

  const [step, setStep]           = useState(1);
  const [mode, setMode]           = useState<ServiceMode>(null);
  const [destination, setDest]    = useState('');

  // 단기 상태
  const [selectedDate, setDate]   = useState('');
  const [selectedTime, setTime]   = useState('');
  const [duration,     setDur]    = useState(3);

  // 정기 상태
  const [weekDays,     setWeekDays]     = useState<string[]>([]);
  const [startDate,    setStartDate]    = useState('');
  const [contractId,   setContractId]   = useState('3m');
  const [regTime,      setRegTime]      = useState('');
  const [regDuration,  setRegDuration]  = useState(3);

  // 공통
  const [address, setAddress] = useState('');
  const [notes,   setNotes]   = useState('');
  const [payMethod, setPay]   = useState<'deposit'|'full'>('deposit');
  const [successModal, setSuccess] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const scrollTop = () => scrollRef.current?.scrollTo({ y:0, animated:false });
  const fmt = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

  // ── 금액 계산 ─────────────────────────────────────────────
  const onetimeTotal  = pricePerHour * duration;
  const onetimeDeposit = Math.ceil(onetimeTotal * DEPOSIT_RATE / 1000) * 1000;

  const sessionsPerWeek  = weekDays.length || 1;
  const sessionsPerMonth = Math.round(sessionsPerWeek * 4.3);
  const contractMonths   = CONTRACT_OPTIONS.find(c => c.id === contractId)?.months ?? 3;
  const discountedRate   = Math.floor(pricePerHour * (1 - REGULAR_DISC));
  const monthlyTotal     = discountedRate * regDuration * sessionsPerMonth;
  const contractTotal    = monthlyTotal * contractMonths;
  const regularDeposit   = Math.ceil(monthlyTotal * DEPOSIT_RATE / 1000) * 1000;

  // ── 다음 버튼 활성화 조건 ────────────────────────────────
  const canNext = () => {
    if (step === 1) return mode !== null;
    if (mode === 'onetime') {
      if (step === 2) return !!selectedDate;
      if (step === 3) return !!selectedTime;
      if (step === 4) return address.trim().length > 5;
    }
    if (mode === 'regular') {
      if (step === 2) return weekDays.length > 0;
      if (step === 3) return !!startDate && !!regTime;
      if (step === 4) return address.trim().length > 5;
    }
    return true;
  };

  const goNext = () => {
    if (step < 5) { setStep(s => s + 1); scrollTop(); }
    else setSuccess(true);
  };

  const goBack = () => {
    if (step > 1) { setStep(s => s - 1); scrollTop(); }
    else navigation.goBack();
  };

  const toggleWeekDay = (d: string) => {
    setWeekDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  // ── 렌더 ─────────────────────────────────────────────────
  const renderStep = () => {
    // Step 1: 유형 선택
    if (step === 1) return (
      <View style={s.stepWrap}>
        <Text style={s.stepTitle}>
          {isDriver
            ? tx('어떤 방식으로 이용하시겠어요?', 'How would you like to use?', 'Mau pakai cara apa?')
            : tx('어떤 서비스가 필요하신가요?', 'What service do you need?', 'Layanan apa yang Anda butuhkan?')}
        </Text>
        <Text style={s.stepSub}>
          {tx('이용 방식에 따라 예약 방식이 달라집니다',
              'Booking flow depends on the type',
              'Alur pemesanan tergantung jenisnya')}
        </Text>

        <TouchableOpacity
          style={[s.typeCard, mode === 'onetime' && s.typeCardActive]}
          onPress={() => setMode('onetime')}
          activeOpacity={0.8}
        >
          <View style={[s.typeIconWrap, { backgroundColor: '#FFF3C0' }, mode === 'onetime' && { backgroundColor: Colors.accentLight }]}>
            <Ionicons name="flash-outline" size={26} color={mode === 'onetime' ? GREEN : '#F59E0B'} />
          </View>
          <View style={{ flex:1, gap:4 }}>
            <View style={s.typeCardTitleRow}>
              <Text style={[s.typeCardTitle, mode === 'onetime' && { color: GREEN }]}>
                {isDriver
                  ? tx('단기 이용', 'One-time Use', 'Sekali Pakai')
                  : tx('단기 서비스', 'One-time Service', 'Layanan Sekali')}
              </Text>
              <View style={[s.typeBadge, { backgroundColor:'#FFF3C0' }]}>
                <Text style={[s.typeBadgeText, { color:'#92400E' }]}>{tx('1회', 'Once', '1x')}</Text>
              </View>
            </View>
            <Text style={s.typeCardSub}>
              {isDriver
                ? tx(
                    '특정 날짜 1회 이용\n대리운전·공항픽업·행사 당일 기사',
                    'One-time on a set date\nDesignated · Airport · Event driver',
                    'Sekali pakai di tanggal tertentu\nSopir pengganti · Bandara · Acara'
                  )
                : tx(
                    '특정 날짜에 1회 방문하는 서비스\n청소, 요리, 이사 정리 등 스팟 서비스',
                    'One-time visit on a specific date\nCleaning, cooking, moving — spot service',
                    'Kunjungan sekali di tanggal tertentu\nBersih, masak, pindahan — spot service'
                  )}
            </Text>
          </View>
          <View style={[s.typeRadio, mode === 'onetime' && s.typeRadioActive]}>
            {mode === 'onetime' && <View style={s.typeRadioDot} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.typeCard, mode === 'regular' && s.typeCardActive]}
          onPress={() => setMode('regular')}
          activeOpacity={0.8}
        >
          <View style={[s.typeIconWrap, { backgroundColor:'#EEF2FF' }, mode === 'regular' && { backgroundColor: Colors.accentLight }]}>
            <Ionicons name="repeat-outline" size={26} color={mode === 'regular' ? GREEN : Colors.tutorColor} />
          </View>
          <View style={{ flex:1, gap:4 }}>
            <View style={s.typeCardTitleRow}>
              <Text style={[s.typeCardTitle, mode === 'regular' && { color: GREEN }]}>
                {isDriver
                  ? tx('정기 이용', 'Regular Use', 'Pemakaian Rutin')
                  : tx('정기 서비스', 'Regular Service', 'Layanan Rutin')}
              </Text>
              <View style={[s.typeBadge, { backgroundColor: Colors.accentLight }]}>
                <Text style={[s.typeBadgeText, { color: GREEN }]}>-10%</Text>
              </View>
            </View>
            <Text style={s.typeCardSub}>
              {isDriver
                ? tx(
                    '매주 정해진 요일·시간 반복\n출퇴근 기사·등하교·주간 전속 기사\n주/월 단위 계약 시 10% 할인',
                    'Weekly fixed days & times\nCommute · School run · Weekly driver\n10% off for weekly/monthly contracts',
                    'Jadwal tetap mingguan\nSopir antar kantor/sekolah · harian\nDiskon 10% untuk kontrak mingguan/bulanan'
                  )
                : tx(
                    '매주 정해진 요일에 반복 방문하는 서비스\n정기 계약 시 10% 할인 적용',
                    'Weekly recurring service\n10% off on regular contracts',
                    'Layanan berkala mingguan\nDiskon 10% untuk kontrak rutin'
                  )}
            </Text>
          </View>
          <View style={[s.typeRadio, mode === 'regular' && s.typeRadioActive]}>
            {mode === 'regular' && <View style={s.typeRadioDot} />}
          </View>
        </TouchableOpacity>
      </View>
    );

    // ── 단기 플로우 ────────────────────────────────────────
    if (mode === 'onetime') {
      if (step === 2) return (
        <View style={s.stepWrap}>
          <Text style={s.stepTitle}>{tx('날짜를 선택해주세요', 'Pick a date', 'Pilih tanggal')}</Text>
          <Text style={s.stepSub}>{tx('서비스를 받고 싶은 날짜를 골라주세요', 'Choose the day you want the service', 'Pilih hari Anda ingin layanan')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.hScroll} contentContainerStyle={{ paddingHorizontal:20 }}>
            {DATE_CHIPS.map(chip => {
              const active = selectedDate === chip.dateStr;
              return (
                <TouchableOpacity key={chip.dateStr} style={[s.dateChip, active && s.dateChipActive]} onPress={() => setDate(chip.dateStr)}>
                  <Text style={[s.dateChipDay, active && s.chipTextActive]}>{chip.dayName}</Text>
                  <Text style={[s.dateChipLabel, active && s.chipTextActive]}>{chip.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          {selectedDate && (
            <View style={s.selectedBadge}>
              <Ionicons name="calendar-outline" size={15} color={GREEN} />
              <Text style={s.selectedBadgeText}>
                {DATE_CHIPS.find(c => c.dateStr === selectedDate)?.dayName},{' '}
                {DATE_CHIPS.find(c => c.dateStr === selectedDate)?.label}
              </Text>
            </View>
          )}
        </View>
      );

      if (step === 3) return (
        <View style={s.stepWrap}>
          <Text style={s.stepTitle}>{tx('시간을 선택해주세요', 'Pick a time', 'Pilih jam')}</Text>
          <Text style={s.stepSub}>{tx('시작 시간과 이용 시간을 정해주세요', 'Set start time and duration', 'Tentukan jam mulai dan durasi')}</Text>

          <SectionLabel text={tx('시작 시간', 'Start time', 'Jam mulai')} mt={0} />
          <View style={s.timeGrid}>
            {TIME_SLOTS.map(t => {
              const active = selectedTime === t;
              return (
                <TouchableOpacity key={t} style={[s.timeChip, active && s.timeChipActive]} onPress={() => setTime(t)}>
                  <Text style={[s.timeChipText, active && s.chipTextActive]}>{t}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <SectionLabel text={tx('이용 시간', 'Duration', 'Durasi')} />
          <DurationPicker value={duration} onChange={setDur} />

          {selectedTime && (
            <View style={s.pricePreview}>
              <Text style={s.pricePreviewLabel}>{tx('예상 금액', 'Estimate', 'Perkiraan')}</Text>
              <Text style={s.pricePreviewAmt}>{fmt(onetimeTotal)}</Text>
            </View>
          )}
        </View>
      );
    }

    // ── 정기 플로우 ────────────────────────────────────────
    if (mode === 'regular') {
      if (step === 2) return (
        <View style={s.stepWrap}>
          <Text style={s.stepTitle}>{tx('방문 요일을 선택해주세요', 'Pick days of the week', 'Pilih hari')}</Text>
          <Text style={s.stepSub}>{tx('매주 방문할 요일을 1개 이상 선택해주세요', 'Pick one or more days per week', 'Pilih setidaknya satu hari per minggu')}</Text>

          <View style={s.weekDayGrid}>
            {WEEK_DAYS.map((d, i) => {
              const active = weekDays.includes(d);
              return (
                <TouchableOpacity key={d} style={[s.weekDayChip, active && s.weekDayChipActive]} onPress={() => toggleWeekDay(d)}>
                  <Text style={[s.weekDayShort, active && s.chipTextActive]}>{d}</Text>
                  <Text style={[s.weekDayFull, active && s.chipTextActive]}>{WEEK_LABELS[i]}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {weekDays.length > 0 && (
            <View style={s.selectedBadge}>
              <Ionicons name="repeat-outline" size={15} color={GREEN} />
              <Text style={s.selectedBadgeText}>
                {tx('매주', 'Every', 'Tiap')} {weekDays.join(', ')} · {tx('월 약', '~', '~')} {Math.round(weekDays.length * 4.3)}{tx('회', 'x/mo', 'x/bln')}
              </Text>
            </View>
          )}
        </View>
      );

      if (step === 3) return (
        <View style={s.stepWrap}>
          <Text style={s.stepTitle}>{tx('일정을 설정해주세요', 'Set the schedule', 'Atur jadwal')}</Text>
          <Text style={s.stepSub}>{tx('시작일, 계약 기간, 방문 시간을 정해주세요', 'Pick start date, contract and time', 'Pilih tanggal mulai, kontrak & jam')}</Text>

          <SectionLabel text={tx('시작일', 'Start date', 'Tanggal mulai')} mt={0} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.hScroll} contentContainerStyle={{ paddingHorizontal:20 }}>
            {DATE_CHIPS.map(chip => {
              const active = startDate === chip.dateStr;
              return (
                <TouchableOpacity key={chip.dateStr} style={[s.dateChip, active && s.dateChipActive]} onPress={() => setStartDate(chip.dateStr)}>
                  <Text style={[s.dateChipDay, active && s.chipTextActive]}>{chip.dayName}</Text>
                  <Text style={[s.dateChipLabel, active && s.chipTextActive]}>{chip.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <SectionLabel text={tx('계약 기간', 'Contract period', 'Masa kontrak')} />
          <View style={s.contractGrid}>
            {CONTRACT_OPTIONS.map(opt => {
              const active = contractId === opt.id;
              return (
                <TouchableOpacity key={opt.id} style={[s.contractChip, active && s.contractChipActive]} onPress={() => setContractId(opt.id)}>
                  <Text style={[s.contractChipText, active && s.chipTextActive]}>{opt.label}</Text>
                  {opt.id === '3m' && <Text style={[s.contractBadge, active && { color: GREEN }]}>{tx('인기', 'Popular', 'Populer')}</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          <SectionLabel text={tx('방문 시작 시간', 'Start time', 'Jam mulai')} />
          <View style={s.timeGrid}>
            {TIME_SLOTS.map(t => {
              const active = regTime === t;
              return (
                <TouchableOpacity key={t} style={[s.timeChip, active && s.timeChipActive]} onPress={() => setRegTime(t)}>
                  <Text style={[s.timeChipText, active && s.chipTextActive]}>{t}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <SectionLabel text={tx('1회 이용 시간', 'Duration per visit', 'Durasi per kunjungan')} />
          <DurationPicker value={regDuration} onChange={setRegDuration} />

          {regTime && (
            <View style={s.regularPriceBox}>
              <View style={s.regularPriceRow}>
                <Text style={s.regularPriceLabel}>{tx('할인 요금', 'Discounted rate', 'Tarif diskon')}</Text>
                <Text style={s.regularPriceValue}>
                  {fmt(discountedRate)}/jam <Text style={s.discountTag}>(10% OFF)</Text>
                </Text>
              </View>
              <View style={s.regularPriceRow}>
                <Text style={s.regularPriceLabel}>{tx('월 예상 금액', 'Monthly est.', 'Perkiraan bulanan')}</Text>
                <Text style={[s.regularPriceValue, { fontWeight:'800', color:Colors.dark }]}>{fmt(monthlyTotal)}</Text>
              </View>
              <View style={[s.regularPriceRow, { borderTopWidth:1, borderTopColor:Colors.border, paddingTop:10, marginTop:4 }]}>
                <Text style={s.regularPriceLabel}>{tx('총 계약 금액', 'Contract total', 'Total kontrak')} ({contractMonths}{tx('개월', ' mo', ' bln')})</Text>
                <Text style={[s.regularPriceValue, { fontWeight:'800', color:GREEN }]}>{fmt(contractTotal)}</Text>
              </View>
            </View>
          )}
        </View>
      );
    }

    // Step 4: 주소 (공통)
    if (step === 4) return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.stepWrap}>
          <Text style={s.stepTitle}>
            {isDriver
              ? tx('픽업·도착지를 입력해주세요', 'Enter pickup & destination', 'Isi lokasi jemput & tujuan')
              : tx('주소를 입력해주세요', 'Enter address', 'Isi alamat')}
          </Text>
          <Text style={s.stepSub}>
            {isDriver
              ? tx('드라이버가 픽업할 위치와 목적지를 알려주세요', 'Tell us where to pick up and drop off', 'Beri tahu lokasi jemput dan tujuan')
              : tx('서비스를 받을 정확한 주소를 입력해주세요', 'Enter the exact service address', 'Isi alamat layanan yang tepat')}
          </Text>

          <SectionLabel text={isDriver ? tx('픽업 위치', 'Pickup', 'Lokasi jemput') : tx('주소', 'Address', 'Alamat')} mt={0} />
          <View style={s.inputWrap}>
            <Ionicons name="location-outline" size={18} color={Colors.grayLight} />
            <TextInput
              style={s.input}
              placeholder={isDriver ? 'Jl. Senopati No.1, Jakarta Selatan' : 'Jl. Kemang Raya No.12, Jakarta Selatan'}
              placeholderTextColor={Colors.grayLight}
              value={address}
              onChangeText={setAddress}
              multiline
            />
          </View>

          {isDriver && (
            <>
              <SectionLabel text={tx('도착지 (선택)', 'Destination (optional)', 'Tujuan (opsional)')} />
              <View style={s.inputWrap}>
                <Ionicons name="flag-outline" size={18} color={Colors.grayLight} />
                <TextInput
                  style={s.input}
                  placeholder="Bandara Soekarno-Hatta, Tangerang"
                  placeholderTextColor={Colors.grayLight}
                  value={destination}
                  onChangeText={setDest}
                  multiline
                />
              </View>
            </>
          )}

          <SectionLabel text={tx('요청사항 (선택)', 'Notes (optional)', 'Catatan (opsional)')} />
          <View style={[s.inputWrap, { alignItems:'flex-start', paddingTop:12 }]}>
            <Ionicons name="document-text-outline" size={18} color={Colors.grayLight} style={{ marginTop:2 }} />
            <TextInput
              style={[s.input, { minHeight:90 }]}
              placeholder={
                isDriver
                  ? tx('예: 자동 세단, 골프백 실을 수 있으면 좋아요', 'e.g. Automatic sedan, room for golf bag', 'cth. Sedan matic, muat tas golf')
                  : mode === 'regular'
                  ? tx('예: 고양이 2마리 있어요. 마스크 착용 부탁드려요', 'e.g. I have 2 cats. Please wear a mask', 'cth. Ada 2 kucing. Tolong pakai masker')
                  : tx('예: 이사 정리 후 상태라 짐이 많아요', 'e.g. Post-move, lots of stuff still around', 'cth. Baru pindahan, masih banyak barang')
              }
              placeholderTextColor={Colors.grayLight}
              value={notes}
              onChangeText={setNotes}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    );

    // Step 5: 확인 (단기/정기 분리)
    if (step === 5) {
      if (mode === 'onetime') return <OnetimeConfirm />;
      return <RegularConfirm />;
    }
    return null;
  };

  // ── 단기 확인 화면 ───────────────────────────────────────
  const OnetimeConfirm = () => {
    const dateChip = DATE_CHIPS.find(c => c.dateStr === selectedDate);
    const partnerLbl = isDriver ? tx('드라이버', 'Driver', 'Sopir') : tx('헬퍼', 'Helper', 'Helper');
    const hrUnit = tx('시간', 'h', 'jam');
    return (
      <View style={s.stepWrap}>
        <Text style={s.stepTitle}>{tx('예약 내용 확인', 'Review your booking', 'Cek pemesanan')}</Text>
        <Text style={s.stepSub}>{tx('아래 내용으로 예약 요청을 보냅니다', "We'll send the request with these details", 'Permintaan akan dikirim dengan detail berikut')}</Text>

        <SummaryCard rows={[
          { icon:'person-outline',       label:partnerLbl,                             value:workerName },
          { icon:'flash-outline',        label:tx('유형', 'Type', 'Jenis'),            value:tx('단기 서비스 (1회)', 'One-time service', 'Sekali pakai') },
          { icon:'calendar-outline',     label:tx('날짜', 'Date', 'Tanggal'),          value:`${dateChip?.dayName}, ${dateChip?.label}` },
          { icon:'time-outline',         label:tx('시간', 'Time', 'Jam'),              value:`${selectedTime} · ${duration}${hrUnit}` },
          { icon:'location-outline',     label:isDriver ? tx('픽업', 'Pickup', 'Jemput') : tx('주소', 'Address', 'Alamat'), value:address },
          ...(notes ? [{ icon:'document-text-outline' as any, label:tx('요청사항', 'Notes', 'Catatan'), value:notes }] : []),
        ]} />

        <SectionLabel text={tx('결제 방식', 'Payment', 'Pembayaran')} />
        <PayMethodPicker
          method={payMethod}
          onChange={setPay}
          depositAmt={onetimeDeposit}
          fullAmt={onetimeTotal}
          remainAmt={onetimeTotal - onetimeDeposit}
          lang={lang}
        />
        <PriceBox
          rows={[
            { label:`${fmt(pricePerHour)}/jam × ${duration}${hrUnit}`, value:fmt(onetimeTotal) },
          ]}
          totalLabel={tx('총 금액', 'Total', 'Total')}
          totalValue={fmt(onetimeTotal)}
          payNow={fmt(payMethod === 'deposit' ? onetimeDeposit : onetimeTotal)}
          lang={lang}
        />
      </View>
    );
  };

  // ── 정기 확인 화면 ───────────────────────────────────────
  const RegularConfirm = () => {
    const startChip = DATE_CHIPS.find(c => c.dateStr === startDate);
    const contract  = CONTRACT_OPTIONS.find(c => c.id === contractId);
    const partnerLbl = isDriver ? tx('드라이버', 'Driver', 'Sopir') : tx('헬퍼', 'Helper', 'Helper');
    const hrUnit = tx('시간', 'h', 'jam');
    const moUnit = tx('개월', 'mo', 'bln');
    return (
      <View style={s.stepWrap}>
        <Text style={s.stepTitle}>{tx('정기 계약 내용 확인', 'Review your contract', 'Cek kontrak Anda')}</Text>
        <Text style={s.stepSub}>{tx('아래 내용으로 정기 계약 요청을 보냅니다', "We'll send the regular contract request", 'Permintaan kontrak rutin akan dikirim')}</Text>

        <SummaryCard rows={[
          { icon:'person-outline',    label:partnerLbl,                                 value:workerName },
          { icon:'repeat-outline',    label:tx('유형', 'Type', 'Jenis'),                value:tx('정기 서비스 (매주 반복)', 'Regular (weekly)', 'Rutin (mingguan)') },
          { icon:'calendar-outline',  label:tx('방문 요일', 'Days', 'Hari'),            value:`${tx('매주', 'Every', 'Tiap')} ${weekDays.join(', ')}` },
          { icon:'today-outline',     label:tx('시작일', 'Start', 'Mulai'),             value:`${startChip?.dayName}, ${startChip?.label}` },
          { icon:'hourglass-outline', label:tx('계약 기간', 'Contract', 'Kontrak'),     value:`${contract?.label} (${contractMonths}${moUnit})` },
          { icon:'time-outline',      label:tx('방문 시간', 'Time', 'Jam'),             value:`${regTime} · ${regDuration}${hrUnit}/${tx('회', 'visit', 'kunjungan')}` },
          { icon:'location-outline',  label:isDriver ? tx('픽업', 'Pickup', 'Jemput') : tx('주소', 'Address', 'Alamat'), value:address },
          ...(notes ? [{ icon:'document-text-outline' as any, label:tx('요청사항', 'Notes', 'Catatan'), value:notes }] : []),
        ]} />

        {/* 정기 요금 안내 */}
        <View style={s.regularSummaryBox}>
          <View style={s.regularSummaryRow}>
            <Text style={s.regularSummaryLabel}>{tx('정기 할인 요금', 'Discounted rate', 'Tarif diskon')}</Text>
            <Text style={s.regularSummaryValue}>{fmt(discountedRate)}/jam <Text style={s.discountTag}>-10%</Text></Text>
          </View>
          <View style={s.regularSummaryRow}>
            <Text style={s.regularSummaryLabel}>{tx('월', '', '')} {Math.round(weekDays.length * 4.3)}{tx('회', 'x', 'x')} × {regDuration}{hrUnit}</Text>
            <Text style={s.regularSummaryValue}>{fmt(monthlyTotal)}/{tx('월', 'mo', 'bln')}</Text>
          </View>
          <View style={[s.regularSummaryRow, s.regularSummaryTotal]}>
            <Text style={s.regularSummaryTotalLabel}>{tx('총 계약 금액', 'Contract total', 'Total kontrak')}</Text>
            <Text style={s.regularSummaryTotalValue}>{fmt(contractTotal)}</Text>
          </View>
        </View>

        <SectionLabel text={tx('결제 방식', 'Payment', 'Pembayaran')} />
        <PayMethodPicker
          method={payMethod}
          onChange={setPay}
          depositAmt={regularDeposit}
          fullAmt={monthlyTotal}
          remainAmt={monthlyTotal - regularDeposit}
          isRegular
          lang={lang}
        />
        <PriceBox
          rows={[{ label:tx('1개월 선결제 기준', 'First month prepaid', 'Prabayar bulan pertama'), value:fmt(monthlyTotal) }]}
          totalLabel={tx('이번 달 금액', 'This month', 'Bulan ini')}
          totalValue={fmt(monthlyTotal)}
          payNow={fmt(payMethod === 'deposit' ? regularDeposit : monthlyTotal)}
          lang={lang}
        />
      </View>
    );
  };

  // ── 재사용 컴포넌트 ──────────────────────────────────────
  const SummaryCard = ({ rows }: { rows: { icon: string; label: string; value: string }[] }) => (
    <View style={s.summaryCard}>
      {rows.map((row, i) => (
        <React.Fragment key={row.label}>
          {i > 0 && <View style={s.summaryDivider} />}
          <View style={s.summaryRow}>
            <View style={s.summaryIcon}>
              <Ionicons name={row.icon as any} size={15} color={GREEN} />
            </View>
            <View style={{ flex:1 }}>
              <Text style={s.summaryRowLabel}>{row.label}</Text>
              <Text style={s.summaryRowValue}>{row.value}</Text>
            </View>
          </View>
        </React.Fragment>
      ))}
    </View>
  );

  const PayMethodPicker = ({
    method, onChange, depositAmt, fullAmt, remainAmt, isRegular = false, lang: langProp = 'id',
  }: {
    method: 'deposit'|'full'; onChange: (v:'deposit'|'full') => void;
    depositAmt: number; fullAmt: number; remainAmt: number; isRegular?: boolean; lang?: string;
  }) => {
    const P = (ko: string, en: string, id: string) => langProp === 'ko' ? ko : langProp === 'en' ? en : id;
    return (
    <>
      <TouchableOpacity style={[s.payCard, method === 'deposit' && s.payCardActive]} onPress={() => onChange('deposit')}>
        <PayRadio active={method === 'deposit'} />
        <View style={{ flex:1 }}>
          <Text style={s.payCardTitle}>
            {isRegular
              ? P('계약금 30% 선결제 (월별)', '30% deposit (monthly)', 'DP 30% (bulanan)')
              : P('계약금 30% 선결제', '30% deposit', 'DP 30%')}
          </Text>
          <Text style={s.payCardSub}>
            {P('지금', 'Now', 'Sekarang')} {fmt(depositAmt)} · {P('서비스', 'service', 'layanan')} {isRegular ? P('후', 'after', 'setelah') : P('완료 후', 'after completion', 'setelah selesai')} {fmt(remainAmt)} {P('잔금', 'balance', 'sisa')}
          </Text>
        </View>
        <View style={s.payBadge}><Text style={s.payBadgeText}>{P('추천', 'Recommended', 'Rekomendasi')}</Text></View>
      </TouchableOpacity>
      <TouchableOpacity style={[s.payCard, method === 'full' && s.payCardActive]} onPress={() => onChange('full')}>
        <PayRadio active={method === 'full'} />
        <View style={{ flex:1 }}>
          <Text style={s.payCardTitle}>{P('전액 선결제', 'Pay in full', 'Bayar penuh')}</Text>
          <Text style={s.payCardSub}>{P('지금', 'Now', 'Sekarang')} {fmt(fullAmt)} {P('전액 결제', 'full payment', 'bayar penuh')}</Text>
        </View>
      </TouchableOpacity>
    </>
    );
  };

  const PayRadio = ({ active }: { active: boolean }) => (
    <View style={[s.payRadio, active && s.payRadioActive]}>
      {active && <View style={s.payRadioDot} />}
    </View>
  );

  const PriceBox = ({ rows, totalLabel, totalValue, payNow, lang: langProp = 'id' }: {
    rows: { label: string; value: string }[];
    totalLabel: string; totalValue: string; payNow: string; lang?: string;
  }) => {
    const payNowLbl = langProp === 'ko' ? '지금 결제' : langProp === 'en' ? 'Pay now' : 'Bayar sekarang';
    return (
    <View style={s.priceBox}>
      {rows.map(r => (
        <View key={r.label} style={s.priceBoxRow}>
          <Text style={s.priceBoxLabel}>{r.label}</Text>
          <Text style={s.priceBoxValue}>{r.value}</Text>
        </View>
      ))}
      <View style={[s.priceBoxRow, s.priceBoxTotalRow]}>
        <Text style={s.priceBoxTotalLabel}>{totalLabel}</Text>
        <Text style={s.priceBoxTotalValue}>{totalValue}</Text>
      </View>
      <View style={s.priceBoxRow}>
        <Text style={s.priceBoxLabel}>{payNowLbl}</Text>
        <Text style={[s.priceBoxValue, { color:GREEN, fontWeight:'800' }]}>{payNow}</Text>
      </View>
    </View>
    );
  };

  // ── DurationPicker ───────────────────────────────────────
  function DurationPicker({ value, onChange }: { value: number; onChange: (n:number) => void }) {
    return (
      <View style={s.durationRow}>
        <TouchableOpacity style={[s.durBtn, value <= 1 && s.durBtnDisabled]} onPress={() => onChange(Math.max(1, value - 1))}>
          <Ionicons name="remove" size={20} color={value <= 1 ? Colors.grayLight : Colors.dark} />
        </TouchableOpacity>
        <View style={s.durDisplay}>
          <Text style={s.durNum}>{value}</Text>
          <Text style={s.durUnit}>{tx('시간', 'hours', 'jam')}</Text>
        </View>
        <TouchableOpacity style={[s.durBtn, value >= 8 && s.durBtnDisabled]} onPress={() => onChange(Math.min(8, value + 1))}>
          <Ionicons name="add" size={20} color={value >= 8 ? Colors.grayLight : Colors.dark} />
        </TouchableOpacity>
      </View>
    );
  }

  const nextLabel = step === 5
    ? (mode === 'regular'
        ? tx('정기 계약 요청 보내기', 'Send contract request', 'Kirim permintaan kontrak')
        : tx('예약 요청 보내기', 'Send booking request', 'Kirim permintaan'))
    : tx('다음', 'Next', 'Lanjut');

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* 헤더 */}
      <View style={s.header}>
        <TouchableOpacity onPress={goBack} style={s.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{workerName} · {tx('예약', 'Booking', 'Pemesanan')}</Text>
        <View style={{ width:40 }} />
      </View>

      {/* 단계 바 */}
      <StepBar step={step} mode={mode} isDriver={isDriver} lang={lang} />

      <ScrollView
        ref={scrollRef}
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {renderStep()}
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={[s.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[s.nextBtn, !canNext() && s.nextBtnDisabled]}
          onPress={goNext}
          disabled={!canNext()}
        >
          <Text style={s.nextBtnText}>{nextLabel}</Text>
          {step < 5 && <Ionicons name="chevron-forward" size={18} color="#fff" />}
        </TouchableOpacity>
      </View>

      {/* 성공 모달 */}
      <Modal visible={successModal} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Ionicons name="checkmark-circle" size={56} color={GREEN} style={{ marginBottom:16 }} />
            <Text style={s.modalTitle}>
              {mode === 'regular'
                ? tx('정기 계약 요청 완료!', 'Contract request sent!', 'Permintaan kontrak terkirim!')
                : tx('예약 요청 완료!', 'Booking request sent!', 'Permintaan terkirim!')}
            </Text>
            <Text style={s.modalSub}>
              {tx(
                `${workerName}에게 ${mode === 'regular' ? '정기 계약' : '예약'} 요청을 보냈어요.\n수락되면 알림으로 알려드릴게요.`,
                `Your ${mode === 'regular' ? 'contract' : 'booking'} request has been sent to ${workerName}.\nWe'll notify you when accepted.`,
                `Permintaan ${mode === 'regular' ? 'kontrak' : 'pemesanan'} telah dikirim ke ${workerName}.\nKami akan beri tahu saat diterima.`
              )}
            </Text>
            <TouchableOpacity
              style={s.modalBtn}
              onPress={() => { setSuccess(false); navigation.navigate('CustomerTabs'); }}
            >
              <Text style={s.modalBtnText}>{tx('홈으로 돌아가기', 'Back to home', 'Kembali ke beranda')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── 스타일 ────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:   { flex:1, backgroundColor:Colors.white },
  scroll: { flex:1 },
  header: {
    flexDirection:'row', alignItems:'center', justifyContent:'space-between',
    paddingHorizontal:16, paddingVertical:10,
    borderBottomWidth:1, borderBottomColor:Colors.border,
  },
  backBtn:     { width:40, height:40, alignItems:'center', justifyContent:'center' },
  headerTitle: { fontSize:16, fontWeight:'700', color:Colors.dark },

  stepWrap:  { paddingHorizontal:20, paddingTop:8 },
  stepTitle: { fontSize:20, fontWeight:'800', color:Colors.dark, marginBottom:6 },
  stepSub:   { fontSize:13, color:Colors.gray, marginBottom:24, lineHeight:20 },

  // 유형 선택
  typeCard: {
    flexDirection:'row', alignItems:'flex-start', gap:14,
    borderWidth:1.5, borderColor:Colors.borderMid, borderRadius:Radius.lg,
    padding:18, marginBottom:14, backgroundColor:Colors.white, ...Shadow.sm,
  },
  typeCardActive:   { borderColor:GREEN, backgroundColor:Colors.accentLight },
  typeIconWrap:     { width:50, height:50, borderRadius:25, alignItems:'center', justifyContent:'center' },
  typeCardTitleRow: { flexDirection:'row', alignItems:'center', gap:8 },
  typeCardTitle:    { fontSize:16, fontWeight:'800', color:Colors.dark },
  typeCardSub:      { fontSize:12, color:Colors.gray, lineHeight:19 },
  typeBadge:        { paddingHorizontal:8, paddingVertical:3, borderRadius:Radius.pill },
  typeBadgeText:    { fontSize:11, fontWeight:'700' },
  typeRadio:        { width:20, height:20, borderRadius:10, borderWidth:2, borderColor:Colors.borderMid, alignItems:'center', justifyContent:'center', marginTop:2 },
  typeRadioActive:  { borderColor:GREEN },
  typeRadioDot:     { width:10, height:10, borderRadius:5, backgroundColor:GREEN },

  // 날짜 칩
  hScroll:        { marginHorizontal:-20, marginBottom:12 },
  dateChip:       { alignItems:'center', paddingHorizontal:14, paddingVertical:11, marginRight:8, borderRadius:Radius.md, borderWidth:1.5, borderColor:Colors.borderMid, backgroundColor:Colors.white, minWidth:62 },
  dateChipActive: { borderColor:GREEN, backgroundColor:Colors.accentLight },
  dateChipDay:    { fontSize:11, fontWeight:'600', color:Colors.grayLight, marginBottom:4 },
  dateChipLabel:  { fontSize:13, fontWeight:'700', color:Colors.dark },
  chipTextActive: { color:GREEN },

  // 선택 확인 배지
  selectedBadge: {
    flexDirection:'row', alignItems:'center', gap:8,
    backgroundColor:Colors.accentLight, borderRadius:Radius.md,
    paddingHorizontal:14, paddingVertical:10, marginTop:4,
  },
  selectedBadgeText: { fontSize:13, fontWeight:'600', color:GREEN },

  // 시간
  timeGrid:      { flexDirection:'row', flexWrap:'wrap', gap:8 },
  timeChip:      { paddingHorizontal:14, paddingVertical:10, borderRadius:Radius.md, borderWidth:1.5, borderColor:Colors.borderMid, backgroundColor:Colors.white },
  timeChipActive:{ borderColor:GREEN, backgroundColor:Colors.accentLight },
  timeChipText:  { fontSize:13, fontWeight:'600', color:Colors.gray },

  // 요일 선택
  weekDayGrid: { flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:8 },
  weekDayChip: {
    alignItems:'center', paddingHorizontal:12, paddingVertical:10,
    borderRadius:Radius.md, borderWidth:1.5, borderColor:Colors.borderMid,
    backgroundColor:Colors.white, minWidth:72,
  },
  weekDayChipActive: { borderColor:GREEN, backgroundColor:Colors.accentLight },
  weekDayShort: { fontSize:12, fontWeight:'800', color:Colors.gray, marginBottom:2 },
  weekDayFull:  { fontSize:10, color:Colors.grayLight },

  // 계약 기간
  contractGrid: { flexDirection:'row', gap:8, flexWrap:'wrap', marginBottom:4 },
  contractChip: {
    paddingHorizontal:18, paddingVertical:11,
    borderRadius:Radius.lg, borderWidth:1.5, borderColor:Colors.borderMid,
    backgroundColor:Colors.white, alignItems:'center',
  },
  contractChipActive: { borderColor:GREEN, backgroundColor:Colors.accentLight },
  contractChipText:   { fontSize:13, fontWeight:'700', color:Colors.gray },
  contractBadge:      { fontSize:10, color:Colors.grayLight, marginTop:2 },

  // 이용 시간 조절
  durationRow: {
    flexDirection:'row', alignItems:'center', justifyContent:'center', gap:24,
    backgroundColor:Colors.section, borderRadius:Radius.lg,
    paddingVertical:16, borderWidth:1, borderColor:Colors.border,
  },
  durBtn:        { width:44, height:44, borderRadius:22, borderWidth:1.5, borderColor:Colors.borderMid, alignItems:'center', justifyContent:'center', backgroundColor:Colors.white },
  durBtnDisabled:{ opacity:0.3 },
  durDisplay:    { alignItems:'center' },
  durNum:        { fontSize:32, fontWeight:'800', color:Colors.dark },
  durUnit:       { fontSize:13, color:Colors.gray, fontWeight:'500' },

  // 정기 요금 박스 (step 3)
  regularPriceBox: {
    backgroundColor:Colors.section, borderRadius:Radius.lg,
    borderWidth:1, borderColor:Colors.border, padding:16, gap:10, marginTop:16,
  },
  regularPriceRow:   { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  regularPriceLabel: { fontSize:13, color:Colors.gray },
  regularPriceValue: { fontSize:13, color:Colors.dark, fontWeight:'600' },
  discountTag:       { fontSize:11, color:GREEN, fontWeight:'700' },

  // 가격 확인 박스 (step 5)
  pricePreview: {
    flexDirection:'row', justifyContent:'space-between', alignItems:'center',
    backgroundColor:Colors.section, borderRadius:Radius.lg,
    padding:16, marginTop:16, borderWidth:1, borderColor:Colors.border,
  },
  pricePreviewLabel: { fontSize:13, color:Colors.gray },
  pricePreviewAmt:   { fontSize:17, fontWeight:'800', color:Colors.dark },

  // 주소 입력
  inputWrap: {
    flexDirection:'row', alignItems:'center', gap:10,
    backgroundColor:Colors.section, borderRadius:Radius.lg,
    paddingHorizontal:14, borderWidth:1.5, borderColor:Colors.borderMid, paddingVertical:4,
  },
  input: { flex:1, fontSize:14, color:Colors.dark, paddingVertical:12 },

  // 확인 요약 카드
  summaryCard:     { borderRadius:Radius.lg, borderWidth:1, borderColor:Colors.border, overflow:'hidden', ...Shadow.sm },
  summaryRow:      { flexDirection:'row', alignItems:'flex-start', gap:12, padding:14 },
  summaryIcon:     { width:30, height:30, borderRadius:15, backgroundColor:Colors.accentLight, alignItems:'center', justifyContent:'center' },
  summaryDivider:  { height:1, backgroundColor:Colors.border },
  summaryRowLabel: { fontSize:10, color:Colors.grayLight, marginBottom:2 },
  summaryRowValue: { fontSize:13, color:Colors.dark, fontWeight:'600', lineHeight:19 },

  // 정기 요약 박스 (step 5)
  regularSummaryBox: {
    backgroundColor:Colors.section, borderRadius:Radius.lg,
    borderWidth:1, borderColor:Colors.border, padding:16, gap:10, marginTop:12,
  },
  regularSummaryRow:       { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  regularSummaryLabel:     { fontSize:13, color:Colors.gray },
  regularSummaryValue:     { fontSize:13, color:Colors.dark },
  regularSummaryTotal:     { borderTopWidth:1, borderTopColor:Colors.border, paddingTop:10, marginTop:4 },
  regularSummaryTotalLabel:{ fontSize:14, fontWeight:'700', color:Colors.dark },
  regularSummaryTotalValue:{ fontSize:16, fontWeight:'800', color:GREEN },

  // 결제 방식
  payCard: {
    flexDirection:'row', alignItems:'center', gap:12,
    borderWidth:1.5, borderColor:Colors.borderMid, borderRadius:Radius.lg,
    padding:14, marginBottom:10, backgroundColor:Colors.white,
  },
  payCardActive:{ borderColor:GREEN, backgroundColor:Colors.accentLight },
  payRadio:     { width:20, height:20, borderRadius:10, borderWidth:2, borderColor:Colors.borderMid, alignItems:'center', justifyContent:'center' },
  payRadioActive:{ borderColor:GREEN },
  payRadioDot:  { width:10, height:10, borderRadius:5, backgroundColor:GREEN },
  payCardTitle: { fontSize:14, fontWeight:'700', color:Colors.dark, marginBottom:2 },
  payCardSub:   { fontSize:12, color:Colors.gray, lineHeight:18 },
  payBadge:     { backgroundColor:GREEN, borderRadius:Radius.pill, paddingHorizontal:8, paddingVertical:3 },
  payBadgeText: { fontSize:10, fontWeight:'700', color:Colors.white },

  // 금액 박스
  priceBox:          { backgroundColor:Colors.section, borderRadius:Radius.lg, borderWidth:1, borderColor:Colors.border, padding:16, gap:10, marginTop:8 },
  priceBoxRow:       { flexDirection:'row', justifyContent:'space-between' },
  priceBoxLabel:     { fontSize:13, color:Colors.gray },
  priceBoxValue:     { fontSize:13, color:Colors.dark },
  priceBoxTotalRow:  { borderTopWidth:1, borderTopColor:Colors.border, paddingTop:10, marginTop:0 },
  priceBoxTotalLabel:{ fontSize:14, fontWeight:'700', color:Colors.dark },
  priceBoxTotalValue:{ fontSize:16, fontWeight:'800', color:Colors.dark },

  // 하단 버튼
  bottomBar: {
    position:'absolute', bottom:0, left:0, right:0,
    backgroundColor:Colors.white,
    borderTopWidth:1, borderTopColor:Colors.border,
    paddingHorizontal:20, paddingTop:12,
  },
  nextBtn:        { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:6, backgroundColor:GREEN, borderRadius:Radius.pill, paddingVertical:15, ...Shadow.sm },
  nextBtnDisabled:{ backgroundColor:Colors.grayLight },
  nextBtnText:    { fontSize:15, fontWeight:'700', color:Colors.white },

  // 성공 모달
  modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.5)', alignItems:'center', justifyContent:'center', padding:32 },
  modalCard:    { backgroundColor:Colors.white, borderRadius:24, padding:32, alignItems:'center', width:'100%', ...Shadow.lg },
  modalTitle:   { fontSize:20, fontWeight:'800', color:Colors.dark, marginBottom:10 },
  modalSub:     { fontSize:14, color:Colors.gray, textAlign:'center', lineHeight:22, marginBottom:24 },
  modalBtn:     { backgroundColor:GREEN, borderRadius:Radius.pill, paddingHorizontal:32, paddingVertical:14, width:'100%', alignItems:'center' },
  modalBtnText: { fontSize:15, fontWeight:'700', color:Colors.white },
});
