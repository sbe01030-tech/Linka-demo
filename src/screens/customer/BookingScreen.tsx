/**
 * BookingScreen — 빠른 예약 플로우 (2 페이지)
 *
 * Page 1 (요청 내용): 카테고리 다중선택 · 날짜(빠른칩 + 달력) · 시간 · 이용시간 · 주소 · 요청사항
 * Page 2 (확인):      요약 · 후불(PG) 결제수단 · 취소수수료 안내
 *
 * 목적: 15~30초 내 예약 완료. 선결제/계약금 없음(후불).
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
import { useBookingStore } from '../../store/bookingStore';
import { CUSTOMER_ME, HELPER_ME } from '../../store/chatStore';
import AddressPicker from '../../components/common/AddressPicker';
import { DEMO_NOTES } from '../../constants/demoStrings';

type Props = NativeStackScreenProps<RootStackParamList, 'Booking'>;

const GREEN = Colors.accent;

// 데모: 주소칸 자동 검색어 (요청사항 문구는 demoStrings의 DEMO_NOTES 사용)
const DEMO_ADDR_QUERY = 'PT GLOBAL UTAMA ABADI';

// ── 집안일 4개 카테고리 (다중 선택) ──────────────────────────────
const HOME_CATS = [
  { id: 'clean',   icon: 'sparkles-outline',   ko: '청소',       en: 'Cleaning',    id_l: 'Bersih-bersih' },
  { id: 'laundry', icon: 'water-outline',      ko: '빨래',       en: 'Laundry',     id_l: 'Cuci' },
  { id: 'iron',    icon: 'shirt-outline',      ko: '세탁·다림질', en: 'Wash · Iron', id_l: 'Setrika' },
  { id: 'dish',    icon: 'restaurant-outline', ko: '설거지',     en: 'Dishes',      id_l: 'Cuci Piring' },
] as const;

// ── 날짜 헬퍼 ──────────────────────────────────────────────────
const DAY_ID   = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
const DAY_KO   = ['일','월','화','수','목','금','토'];
const DAY_EN   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTH_ID = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];

const iso = (d: Date) => d.toISOString().slice(0, 10);

function getDateChips(count = 14) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return { label: `${d.getDate()} ${MONTH_ID[d.getMonth()]}`, dayIdx: d.getDay(), dateStr: iso(d) };
  });
}
const DATE_CHIPS = getDateChips(14);
const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => `${(8 + i).toString().padStart(2, '0')}:00`);

// ── PG 결제수단 (후불 · 간소화) ─────────────────────────────────
const PAY_METHODS = [
  { id: 'card',    icon: 'card-outline',          ko: '신용/체크카드', en: 'Card',     id_l: 'Kartu' },
  { id: 'ewallet', icon: 'wallet-outline',        ko: '이월렛',       en: 'E-wallet', id_l: 'E-wallet' },
  { id: 'bank',    icon: 'business-outline',      ko: '계좌이체',     en: 'Transfer', id_l: 'Transfer' },
] as const;

// ── 단계 바 (2 스텝) ───────────────────────────────────────────
function StepBar({ step, lang }: { step: number; lang: string }) {
  const L = (ko: string, en: string, id: string) => (lang === 'ko' ? ko : lang === 'en' ? en : id);
  const labels = [L('요청 내용', 'Details', 'Detail'), L('확인·결제', 'Confirm', 'Konfirmasi')];
  return (
    <View style={sb.wrap}>
      {labels.map((label, i) => {
        const idx = i + 1;
        const done = step > idx;
        const current = step === idx;
        return (
          <React.Fragment key={label}>
            <View style={sb.item}>
              <View style={[sb.dot, done && sb.dotDone, current && sb.dotCurrent]}>
                {done ? <Ionicons name="checkmark" size={12} color="#fff" /> : <Text style={[sb.dotNum, current && sb.dotNumCurrent]}>{idx}</Text>}
              </View>
              <Text style={[sb.label, current && sb.labelCurrent]}>{label}</Text>
            </View>
            {i < labels.length - 1 && <View style={[sb.line, done && sb.lineDone]} />}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const sb = StyleSheet.create({
  wrap:          { flexDirection:'row', alignItems:'center', paddingHorizontal:40, paddingVertical:14 },
  item:          { alignItems:'center', gap:4 },
  dot:           { width:26, height:26, borderRadius:13, borderWidth:1.5, borderColor:Colors.borderMid, backgroundColor:Colors.white, alignItems:'center', justifyContent:'center' },
  dotDone:       { backgroundColor:GREEN, borderColor:GREEN },
  dotCurrent:    { borderColor:GREEN },
  dotNum:        { fontSize:11, fontWeight:'700', color:Colors.grayLight },
  dotNumCurrent: { color:GREEN },
  label:         { fontSize:11, color:Colors.grayLight, fontWeight:'600' },
  labelCurrent:  { color:GREEN, fontWeight:'700' },
  line:          { flex:1, height:1.5, backgroundColor:Colors.borderMid, marginBottom:14 },
  lineDone:      { backgroundColor:GREEN },
});

function SectionLabel({ text, mt = 22 }: { text: string; mt?: number }) {
  return <Text style={[u.label, { marginTop: mt }]}>{text}</Text>;
}
const u = StyleSheet.create({ label: { fontSize:13, fontWeight:'700', color:Colors.darkMid, marginBottom:10 } });

// ── 인라인 달력 ────────────────────────────────────────────────
function Calendar({ value, onSelect, lang }: { value: string; onSelect: (s: string) => void; lang: string }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const dayHdr = lang === 'ko' ? DAY_KO : lang === 'en' ? DAY_EN : DAY_ID;
  const monthLabel = lang === 'ko'
    ? `${view.getFullYear()}년 ${view.getMonth() + 1}월`
    : `${MONTH_ID[view.getMonth()]} ${view.getFullYear()}`;

  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const lead = first.getDay();
  const cells: (Date | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1)),
  ];
  const canPrev = view.getFullYear() > today.getFullYear() || view.getMonth() > today.getMonth();
  const shift = (n: number) => setView(new Date(view.getFullYear(), view.getMonth() + n, 1));

  return (
    <View style={cal.wrap}>
      <View style={cal.head}>
        <TouchableOpacity style={[cal.navBtn, !canPrev && { opacity: 0.25 }]} disabled={!canPrev} onPress={() => shift(-1)}>
          <Ionicons name="chevron-back" size={18} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={cal.month}>{monthLabel}</Text>
        <TouchableOpacity style={cal.navBtn} onPress={() => shift(1)}>
          <Ionicons name="chevron-forward" size={18} color={Colors.dark} />
        </TouchableOpacity>
      </View>
      <View style={cal.weekRow}>
        {dayHdr.map((d, i) => (
          <Text key={d} style={[cal.weekDay, i === 0 && { color: '#EF4444' }]}>{d}</Text>
        ))}
      </View>
      <View style={cal.grid}>
        {cells.map((d, i) => {
          if (!d) return <View key={`e${i}`} style={cal.cell} />;
          const ds = iso(d);
          const past = d < today;
          const sel = ds === value;
          return (
            <TouchableOpacity key={ds} style={cal.cell} disabled={past} onPress={() => onSelect(ds)} activeOpacity={0.7}>
              <View style={[cal.dayWrap, sel && cal.daySel]}>
                <Text style={[cal.dayTxt, past && cal.dayPast, sel && cal.dayTxtSel, !past && d.getDay() === 0 && !sel && { color: '#EF4444' }]}>
                  {d.getDate()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const cal = StyleSheet.create({
  wrap:    { borderWidth:1, borderColor:Colors.border, borderRadius:Radius.lg, padding:12, marginTop:10, backgroundColor:Colors.white },
  head:    { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:8 },
  navBtn:  { width:34, height:34, alignItems:'center', justifyContent:'center', borderRadius:17 },
  month:   { fontSize:15, fontWeight:'800', color:Colors.dark },
  weekRow: { flexDirection:'row' },
  weekDay: { flex:1, textAlign:'center', fontSize:11, fontWeight:'600', color:Colors.grayLight, marginBottom:4 },
  grid:    { flexDirection:'row', flexWrap:'wrap' },
  cell:    { width:`${100/7}%`, aspectRatio:1, alignItems:'center', justifyContent:'center' },
  dayWrap: { width:34, height:34, borderRadius:17, alignItems:'center', justifyContent:'center' },
  daySel:  { backgroundColor:GREEN },
  dayTxt:  { fontSize:13, fontWeight:'600', color:Colors.dark },
  dayTxtSel:{ color:Colors.white, fontWeight:'800' },
  dayPast: { color:Colors.borderMid },
});

// ── 메인 ──────────────────────────────────────────────────────
export default function BookingScreen({ route, navigation }: Props) {
  const { workerName, workerPhoto, pricePerHour, serviceType } = route.params;
  const addBooking = useBookingStore((st) => st.addBooking);
  const insets = useSafeAreaInsets();
  const { lang } = useLanguageStore();
  const tx = (ko: string, en: string, id: string) => (lang === 'ko' ? ko : lang === 'en' ? en : id);

  const [step, setStep]          = useState(1);
  const [cats, setCats]          = useState<string[]>([]);     // 다중 카테고리
  const [showCal, setShowCal]    = useState(false);            // 달력 펼침
  const [selectedDate, setDate]  = useState('');
  const [selectedTime, setTime]  = useState('');
  const [duration, setDur]       = useState(3);
  const [address, setAddress]    = useState('');
  const [addrCoord, setAddrCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [showAddrPicker, setShowAddrPicker] = useState(false);
  const [notes, setNotes]        = useState('');
  const [payMethod, setPay]      = useState<string>('card');
  const [successModal, setSuccess] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const scrollTop = () => scrollRef.current?.scrollTo({ y: 0, animated: false });
  const fmt = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

  const total = pricePerHour * duration;
  const hrUnit = tx('시간', 'h', 'jam');

  const toggleCat = (id: string) =>
    setCats((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const catLabel = (c: typeof HOME_CATS[number]) => tx(c.ko, c.en, c.id_l);
  const dateLabel = (ds: string) => {
    if (!ds) return '';
    const d = new Date(ds + 'T00:00:00');
    const day = (lang === 'ko' ? DAY_KO : lang === 'en' ? DAY_EN : DAY_ID)[d.getDay()];
    return lang === 'ko' ? `${d.getMonth() + 1}월 ${d.getDate()}일 (${day})` : `${d.getDate()} ${MONTH_ID[d.getMonth()]} · ${day}`;
  };

  const canNext = () => {
    if (step === 1) return cats.length >= 1 && !!selectedDate && !!selectedTime && address.trim().length > 5;
    return true;
  };

  const goNext = () => {
    if (step < 2) { setStep(2); scrollTop(); return; }
    // 예약 저장 → 헬퍼 일감 + 고객 주문에 공유 반영 (후불: 선결제 0)
    const label = cats.map((id) => { const c = HOME_CATS.find((x) => x.id === id)!; return catLabel(c); }).join(', ');
    addBooking({
      customerId: CUSTOMER_ME.id, customerName: CUSTOMER_ME.name, customerPhoto: CUSTOMER_ME.photo,
      // 데모: 워커는 항상 데모워커(helper-me) → 어떤 워커를 예약해도 워커 기기에 도착
      workerId: HELPER_ME.id,
      workerName, workerPhoto,
      serviceType, serviceLabel: label || tx('집안일', 'Home service', 'Rumah'),
      date: selectedDate, startTime: selectedTime, duration,
      address, notes,
      totalPrice: total, depositPaid: 0, remaining: total,
      status: 'pending',
    });
    setSuccess(true);
  };

  const goBack = () => {
    if (step > 1) { setStep(1); scrollTop(); }
    else navigation.goBack();
  };

  // ── Page 1: 요청 내용 ────────────────────────────────────────
  const renderDetails = () => (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.stepWrap}>
        <Text style={s.stepTitle}>{tx('어떤 도움이 필요하세요?', 'What do you need?', 'Butuh bantuan apa?')}</Text>
        <Text style={s.stepSub}>{tx('필요한 집안일을 모두 골라주세요 (여러 개 선택 가능)', 'Pick all tasks you need (multiple allowed)', 'Pilih semua pekerjaan (boleh lebih dari satu)')}</Text>

        {/* 카테고리 다중 선택 */}
        <View style={s.catGrid}>
          {HOME_CATS.map((c) => {
            const active = cats.includes(c.id);
            return (
              <TouchableOpacity key={c.id} style={[s.catCard, active && s.catCardActive]} onPress={() => toggleCat(c.id)} activeOpacity={0.85}>
                <View style={[s.catCheck, active && s.catCheckActive]}>
                  {active && <Ionicons name="checkmark" size={12} color="#fff" />}
                </View>
                <Ionicons name={c.icon as any} size={26} color={active ? GREEN : Colors.gray} />
                <Text style={[s.catLabel, active && { color: GREEN }]}>{catLabel(c)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 날짜 */}
        <View style={s.rowBetween}>
          <SectionLabel text={tx('날짜', 'Date', 'Tanggal')} mt={24} />
          <TouchableOpacity style={s.calToggle} onPress={() => setShowCal((v) => !v)} activeOpacity={0.7}>
            <Ionicons name="calendar-outline" size={14} color={GREEN} />
            <Text style={s.calToggleText}>{showCal ? tx('빠른 선택', 'Quick pick', 'Cepat') : tx('달력에서 선택', 'Calendar', 'Kalender')}</Text>
          </TouchableOpacity>
        </View>

        {showCal ? (
          <Calendar value={selectedDate} onSelect={(d) => setDate(d)} lang={lang} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.hScroll} contentContainerStyle={{ paddingHorizontal: 20 }}>
            {DATE_CHIPS.map((chip) => {
              const active = selectedDate === chip.dateStr;
              const dayName = (lang === 'ko' ? DAY_KO : lang === 'en' ? DAY_EN : DAY_ID)[chip.dayIdx];
              return (
                <TouchableOpacity key={chip.dateStr} style={[s.dateChip, active && s.dateChipActive]} onPress={() => setDate(chip.dateStr)}>
                  <Text style={[s.dateChipDay, active && s.chipTextActive]}>{dayName}</Text>
                  <Text style={[s.dateChipLabel, active && s.chipTextActive]}>{chip.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
        {!!selectedDate && (
          <View style={s.selectedBadge}>
            <Ionicons name="calendar" size={14} color={GREEN} />
            <Text style={s.selectedBadgeText}>{dateLabel(selectedDate)}</Text>
          </View>
        )}

        {/* 시간 */}
        <SectionLabel text={tx('시작 시간', 'Start time', 'Jam mulai')} />
        <View style={s.timeGrid}>
          {TIME_SLOTS.map((t) => {
            const active = selectedTime === t;
            return (
              <TouchableOpacity key={t} style={[s.timeChip, active && s.timeChipActive]} onPress={() => setTime(t)}>
                <Text style={[s.timeChipText, active && s.chipTextActive]}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 이용 시간 */}
        <SectionLabel text={tx('이용 시간', 'Duration', 'Durasi')} />
        <View style={s.durationRow}>
          <TouchableOpacity style={[s.durBtn, duration <= 1 && s.durBtnDisabled]} onPress={() => setDur(Math.max(1, duration - 1))}>
            <Ionicons name="remove" size={20} color={duration <= 1 ? Colors.grayLight : Colors.dark} />
          </TouchableOpacity>
          <View style={s.durDisplay}>
            <Text style={s.durNum}>{duration}</Text>
            <Text style={s.durUnit}>{tx('시간', 'hours', 'jam')}</Text>
          </View>
          <TouchableOpacity style={[s.durBtn, duration >= 8 && s.durBtnDisabled]} onPress={() => setDur(Math.min(8, duration + 1))}>
            <Ionicons name="add" size={20} color={duration >= 8 ? Colors.grayLight : Colors.dark} />
          </TouchableOpacity>
        </View>

        {/* 주소 — 지도에서 검색·핀으로 선택 */}
        <SectionLabel text={tx('주소', 'Address', 'Alamat')} />
        <TouchableOpacity style={s.addrPickBtn} onPress={() => setShowAddrPicker(true)} activeOpacity={0.8}>
          <Ionicons name="location-outline" size={18} color={address ? GREEN : Colors.grayLight} />
          <Text style={[s.addrPickText, !address && { color: Colors.grayLight }]} numberOfLines={2}>
            {address || tx('지도에서 주소를 검색·선택하세요', 'Search & pick on the map', 'Cari & pilih di peta')}
          </Text>
          <Ionicons name="map-outline" size={18} color={GREEN} />
        </TouchableOpacity>

        {/* 요청사항 */}
        <SectionLabel text={tx('요청사항 (선택)', 'Notes (optional)', 'Catatan (opsional)')} />
        <View style={[s.inputWrap, { alignItems: 'flex-start', paddingTop: 12 }]}>
          <Ionicons name="document-text-outline" size={18} color={Colors.grayLight} style={{ marginTop: 2 }} />
          <TextInput
            style={[s.input, { minHeight: 72 }]}
            placeholder={tx('예: 고양이 2마리 있어요. 마스크 부탁드려요', 'e.g. I have 2 cats. Please wear a mask', 'cth. Ada 2 kucing. Tolong pakai masker')}
            placeholderTextColor={Colors.grayLight}
            value={notes}
            onChangeText={setNotes}
            onFocus={() => { if (!notes) setNotes(DEMO_NOTES); }}
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  // ── Page 2: 확인 · 결제 ──────────────────────────────────────
  const renderConfirm = () => {
    const catText = cats.map((id) => catLabel(HOME_CATS.find((x) => x.id === id)!)).join(' · ');
    const rows: { icon: string; label: string; value: string }[] = [
      { icon: 'person-outline',   label: tx('헬퍼', 'Helper', 'Helper'),    value: workerName },
      { icon: 'sparkles-outline', label: tx('서비스', 'Service', 'Layanan'), value: catText },
      { icon: 'calendar-outline', label: tx('날짜', 'Date', 'Tanggal'),     value: dateLabel(selectedDate) },
      { icon: 'time-outline',     label: tx('시간', 'Time', 'Jam'),         value: `${selectedTime} · ${duration}${hrUnit}` },
      { icon: 'location-outline', label: tx('주소', 'Address', 'Alamat'),   value: address },
      ...(notes ? [{ icon: 'document-text-outline', label: tx('요청사항', 'Notes', 'Catatan'), value: notes }] : []),
    ];
    return (
      <View style={s.stepWrap}>
        <Text style={s.stepTitle}>{tx('예약 내용 확인', 'Review your booking', 'Cek pemesanan')}</Text>
        <Text style={s.stepSub}>{tx('아래 내용으로 예약 요청을 보냅니다', "We'll send the request with these details", 'Permintaan akan dikirim dengan detail berikut')}</Text>

        <View style={s.summaryCard}>
          {rows.map((row, i) => (
            <React.Fragment key={row.label}>
              {i > 0 && <View style={s.summaryDivider} />}
              <View style={s.summaryRow}>
                <View style={s.summaryIcon}><Ionicons name={row.icon as any} size={15} color={GREEN} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={s.summaryRowLabel}>{row.label}</Text>
                  <Text style={s.summaryRowValue}>{row.value}</Text>
                </View>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* 후불 결제 안내 */}
        <SectionLabel text={tx('결제 방식', 'Payment', 'Pembayaran')} />
        <View style={s.postpaidBanner}>
          <Ionicons name="time-outline" size={18} color={GREEN} />
          <Text style={s.postpaidText}>
            {tx('후불 결제 — 서비스 완료 후 등록한 수단으로 자동 결제됩니다.',
                'Pay later — charged automatically after the service is done.',
                'Bayar nanti — otomatis ditagih setelah layanan selesai.')}
          </Text>
        </View>

        {/* PG 결제수단 (간소화) */}
        <View style={s.payRow}>
          {PAY_METHODS.map((m) => {
            const active = payMethod === m.id;
            return (
              <TouchableOpacity key={m.id} style={[s.payChip, active && s.payChipActive]} onPress={() => setPay(m.id)} activeOpacity={0.8}>
                <Ionicons name={m.icon as any} size={18} color={active ? GREEN : Colors.gray} />
                <Text style={[s.payChipText, active && { color: GREEN }]}>{tx(m.ko, m.en, m.id_l)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 금액 */}
        <View style={s.priceBox}>
          <View style={s.priceBoxRow}>
            <Text style={s.priceBoxLabel}>{`${fmt(pricePerHour)}/jam × ${duration}${hrUnit}`}</Text>
            <Text style={s.priceBoxValue}>{fmt(total)}</Text>
          </View>
          <View style={[s.priceBoxRow, s.priceBoxTotalRow]}>
            <Text style={s.priceBoxTotalLabel}>{tx('예상 결제 금액 (후불)', 'Estimated total (pay later)', 'Perkiraan total (bayar nanti)')}</Text>
            <Text style={s.priceBoxTotalValue}>{fmt(total)}</Text>
          </View>
        </View>

        {/* 취소 수수료 안내 */}
        <View style={s.cancelNotice}>
          <View style={s.cancelHead}>
            <Ionicons name="information-circle-outline" size={15} color={Colors.gray} />
            <Text style={s.cancelTitle}>{tx('취소 수수료 안내', 'Cancellation policy', 'Kebijakan pembatalan')}</Text>
          </View>
          <Text style={s.cancelLine}>{tx('• 방문 24시간 전까지: 무료 취소', '• Up to 24h before: free', '• Sampai 24 jam sebelum: gratis')}</Text>
          <Text style={s.cancelLine}>{tx('• 24시간 이내: 예상 금액의 30% 부과', '• Within 24h: 30% fee', '• Dalam 24 jam: biaya 30%')}</Text>
          <Text style={s.cancelLine}>{tx('• 헬퍼 방문 후 취소: 50% 부과', '• After helper arrives: 50% fee', '• Setelah helper tiba: biaya 50%')}</Text>
        </View>
      </View>
    );
  };

  const nextLabel = step === 2
    ? tx('예약 요청 보내기', 'Send booking request', 'Kirim permintaan')
    : tx('다음', 'Next', 'Lanjut');

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <View style={s.header}>
        <TouchableOpacity onPress={goBack} style={s.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{workerName} · {tx('예약', 'Booking', 'Pemesanan')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <StepBar step={step} lang={lang} />

      <ScrollView
        ref={scrollRef}
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {step === 1 ? renderDetails() : renderConfirm()}
      </ScrollView>

      <View style={[s.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity style={[s.nextBtn, !canNext() && s.nextBtnDisabled]} onPress={goNext} disabled={!canNext()}>
          <Text style={s.nextBtnText}>{nextLabel}</Text>
          {step < 2 && <Ionicons name="chevron-forward" size={18} color="#fff" />}
        </TouchableOpacity>
      </View>

      {/* 주소 선택 (지도 검색 + 핀) */}
      <AddressPicker
        visible={showAddrPicker}
        lang={lang}
        autoQuery={DEMO_ADDR_QUERY}
        initial={addrCoord ? { ...{ lat: addrCoord.lat, lng: addrCoord.lng }, address } : (address ? { lat: -6.215, lng: 106.644, address } : undefined)}
        onClose={() => setShowAddrPicker(false)}
        onSelect={({ address: a, lat, lng }) => { setAddress(a); setAddrCoord({ lat, lng }); setShowAddrPicker(false); }}
      />

      <Modal visible={successModal} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Ionicons name="checkmark-circle" size={56} color={GREEN} style={{ marginBottom: 16 }} />
            <Text style={s.modalTitle}>{tx('예약 요청 완료!', 'Booking request sent!', 'Permintaan terkirim!')}</Text>
            <Text style={s.modalSub}>
              {tx(
                `${workerName}에게 예약 요청을 보냈어요.\n수락되면 알림으로 알려드릴게요.`,
                `Your booking request has been sent to ${workerName}.\nWe'll notify you when accepted.`,
                `Permintaan telah dikirim ke ${workerName}.\nKami akan beri tahu saat diterima.`
              )}
            </Text>
            <TouchableOpacity style={s.modalBtn} onPress={() => { setSuccess(false); navigation.navigate('CustomerTabs'); }}>
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
  header: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, paddingVertical:10, borderBottomWidth:1, borderBottomColor:Colors.border },
  backBtn:     { width:40, height:40, alignItems:'center', justifyContent:'center' },
  headerTitle: { fontSize:16, fontWeight:'700', color:Colors.dark },

  stepWrap:  { paddingHorizontal:20, paddingTop:8 },
  stepTitle: { fontSize:20, fontWeight:'800', color:Colors.dark, marginBottom:6 },
  stepSub:   { fontSize:13, color:Colors.gray, marginBottom:20, lineHeight:20 },

  rowBetween: { flexDirection:'row', alignItems:'center', justifyContent:'space-between' },

  // 카테고리 2×2 그리드
  catGrid:  { flexDirection:'row', flexWrap:'wrap', gap:12 },
  catCard:  { width:'47%', flexGrow:1, alignItems:'center', gap:8, paddingVertical:18, borderRadius:Radius.lg, borderWidth:1.5, borderColor:Colors.borderMid, backgroundColor:Colors.white },
  catCardActive: { borderColor:GREEN, backgroundColor:Colors.accentLight },
  catLabel: { fontSize:14, fontWeight:'700', color:Colors.dark },
  catCheck: { position:'absolute', top:10, right:10, width:18, height:18, borderRadius:9, borderWidth:1.5, borderColor:Colors.borderMid, alignItems:'center', justifyContent:'center', backgroundColor:Colors.white },
  catCheckActive: { backgroundColor:GREEN, borderColor:GREEN },

  // 달력 토글
  calToggle:     { flexDirection:'row', alignItems:'center', gap:5, paddingHorizontal:10, paddingVertical:6, borderRadius:Radius.pill, backgroundColor:Colors.accentLight },
  calToggleText: { fontSize:12, fontWeight:'700', color:GREEN },

  // 날짜 칩
  hScroll:        { marginHorizontal:-20, marginBottom:4 },
  dateChip:       { alignItems:'center', paddingHorizontal:14, paddingVertical:11, marginRight:8, borderRadius:Radius.md, borderWidth:1.5, borderColor:Colors.borderMid, backgroundColor:Colors.white, minWidth:62 },
  dateChipActive: { borderColor:GREEN, backgroundColor:Colors.accentLight },
  dateChipDay:    { fontSize:11, fontWeight:'600', color:Colors.grayLight, marginBottom:4 },
  dateChipLabel:  { fontSize:13, fontWeight:'700', color:Colors.dark },
  chipTextActive: { color:GREEN },

  selectedBadge:     { flexDirection:'row', alignItems:'center', gap:8, backgroundColor:Colors.accentLight, borderRadius:Radius.md, paddingHorizontal:14, paddingVertical:10, marginTop:10 },
  selectedBadgeText: { fontSize:13, fontWeight:'700', color:GREEN },

  // 시간
  timeGrid:       { flexDirection:'row', flexWrap:'wrap', gap:8 },
  timeChip:       { paddingHorizontal:14, paddingVertical:10, borderRadius:Radius.md, borderWidth:1.5, borderColor:Colors.borderMid, backgroundColor:Colors.white },
  timeChipActive: { borderColor:GREEN, backgroundColor:Colors.accentLight },
  timeChipText:   { fontSize:13, fontWeight:'600', color:Colors.gray },

  // 이용 시간
  durationRow: { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:24, backgroundColor:Colors.section, borderRadius:Radius.lg, paddingVertical:16, borderWidth:1, borderColor:Colors.border },
  durBtn:        { width:44, height:44, borderRadius:22, borderWidth:1.5, borderColor:Colors.borderMid, alignItems:'center', justifyContent:'center', backgroundColor:Colors.white },
  durBtnDisabled:{ opacity:0.3 },
  durDisplay:    { alignItems:'center' },
  durNum:        { fontSize:32, fontWeight:'800', color:Colors.dark },
  durUnit:       { fontSize:13, color:Colors.gray, fontWeight:'500' },

  // 입력
  inputWrap: { flexDirection:'row', alignItems:'center', gap:10, backgroundColor:Colors.section, borderRadius:Radius.lg, paddingHorizontal:14, borderWidth:1.5, borderColor:Colors.borderMid, paddingVertical:4 },
  addrPickBtn:  { flexDirection:'row', alignItems:'center', gap:10, backgroundColor:Colors.section, borderRadius:Radius.lg, paddingHorizontal:14, paddingVertical:14, borderWidth:1.5, borderColor:Colors.borderMid },
  addrPickText: { flex:1, fontSize:14, color:Colors.dark, fontWeight:'600', lineHeight:19 },
  input:     { flex:1, fontSize:14, color:Colors.dark, paddingVertical:12 },

  // 요약 카드
  summaryCard:     { borderRadius:Radius.lg, borderWidth:1, borderColor:Colors.border, overflow:'hidden', ...Shadow.sm },
  summaryRow:      { flexDirection:'row', alignItems:'flex-start', gap:12, padding:14 },
  summaryIcon:     { width:30, height:30, borderRadius:15, backgroundColor:Colors.accentLight, alignItems:'center', justifyContent:'center' },
  summaryDivider:  { height:1, backgroundColor:Colors.border },
  summaryRowLabel: { fontSize:10, color:Colors.grayLight, marginBottom:2 },
  summaryRowValue: { fontSize:13, color:Colors.dark, fontWeight:'600', lineHeight:19 },

  // 후불 배너
  postpaidBanner: { flexDirection:'row', alignItems:'center', gap:10, backgroundColor:Colors.accentLight, borderRadius:Radius.lg, padding:14 },
  postpaidText:   { flex:1, fontSize:12.5, fontWeight:'600', color:Colors.darkMid, lineHeight:18 },

  // PG 수단
  payRow:        { flexDirection:'row', gap:8, marginTop:10 },
  payChip:       { flex:1, alignItems:'center', gap:6, paddingVertical:14, borderRadius:Radius.lg, borderWidth:1.5, borderColor:Colors.borderMid, backgroundColor:Colors.white },
  payChipActive: { borderColor:GREEN, backgroundColor:Colors.accentLight },
  payChipText:   { fontSize:12, fontWeight:'700', color:Colors.gray },

  // 금액 박스
  priceBox:          { backgroundColor:Colors.section, borderRadius:Radius.lg, borderWidth:1, borderColor:Colors.border, padding:16, gap:10, marginTop:16 },
  priceBoxRow:       { flexDirection:'row', justifyContent:'space-between' },
  priceBoxLabel:     { fontSize:13, color:Colors.gray },
  priceBoxValue:     { fontSize:13, color:Colors.dark },
  priceBoxTotalRow:  { borderTopWidth:1, borderTopColor:Colors.border, paddingTop:10 },
  priceBoxTotalLabel:{ fontSize:14, fontWeight:'700', color:Colors.dark },
  priceBoxTotalValue:{ fontSize:16, fontWeight:'800', color:GREEN },

  // 취소 수수료 안내
  cancelNotice: { backgroundColor:Colors.section, borderRadius:Radius.lg, borderWidth:1, borderColor:Colors.border, padding:14, marginTop:14, gap:5 },
  cancelHead:   { flexDirection:'row', alignItems:'center', gap:6, marginBottom:3 },
  cancelTitle:  { fontSize:12.5, fontWeight:'700', color:Colors.darkMid },
  cancelLine:   { fontSize:11.5, color:Colors.gray, lineHeight:17 },

  // 하단 버튼
  bottomBar: { position:'absolute', bottom:0, left:0, right:0, backgroundColor:Colors.white, borderTopWidth:1, borderTopColor:Colors.border, paddingHorizontal:20, paddingTop:12 },
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
