/**
 * AddressPicker — 카카오T 스타일 주소 선택 모달.
 *  - 검색창에 한글/인니어 입력 → 입력하는 즉시 결과 리스트(자동완성)
 *  - 결과 탭 → 지도가 그 위치로 이동
 *  - 지도 중앙 고정 핀: 지도를 드래그하면 멈출 때마다 핀 위치 주소 자동 표시(역지오코딩)
 *  - '이 위치로 선택' → 주소 + 좌표 반환
 * Nominatim(OpenStreetMap) 무료 지오코딩 · 인도네시아 우선 · 인터넷 필요.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Modal, TextInput, TouchableOpacity,
  ActivityIndicator, Platform, StatusBar, ScrollView,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { translateText } from '../../utils/translate';

interface Props {
  visible: boolean;
  initial?: { lat: number; lng: number; address?: string };
  lang?: string;
  autoQuery?: string; // 데모: 열릴 때 자동으로 채워 검색할 검색어
  onClose: () => void;
  onSelect: (r: { address: string; lat: number; lng: number }) => void;
}

interface Hit { label: string; sub: string; lat: number; lng: number }

// 기본 중심 — Tangerang Cibodas
const DEFAULT = { latitude: -6.2150, longitude: 106.6440 };

// Photon(코무트) 응답 properties → 표시용 이름/전체주소
const nameOf = (p: any): string =>
  p.name || [p.street, p.housenumber].filter(Boolean).join(' ') || p.city || p.state || p.country || '';
const addrOf = (p: any): string => {
  const seen = new Set<string>(); const parts: string[] = [];
  const push = (v?: string) => { if (v && !seen.has(v)) { seen.add(v); parts.push(v); } };
  if (p.name) push(p.name);
  push([p.street, p.housenumber].filter(Boolean).join(' '));
  push(p.suburb); push(p.district); push(p.city); push(p.county); push(p.state); push(p.postcode); push(p.country);
  return parts.join(', ');
};

// ── 구글 Geocoding (회사명·상세주소 검색, app.json의 키 재사용) ──
const GOOGLE_KEY = 'AIzaSyCSEF54icEAH5Yfs1BT3-8HH1Y427ZL9eE';
async function googleSearch(q: string): Promise<Hit[]> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(q)}&language=ko&region=id&key=${GOOGLE_KEY}`;
  const r = await fetch(url); const j = await r.json();
  if (j.status !== 'OK' || !Array.isArray(j.results)) return [];
  return j.results.slice(0, 7).map((res: any) => {
    const fa: string = res.formatted_address || '';
    return { label: fa.split(',')[0] || fa, sub: fa, lat: res.geometry.location.lat, lng: res.geometry.location.lng };
  });
}
async function googleReverse(lat: number, lng: number): Promise<string | null> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=ko&key=${GOOGLE_KEY}`;
  const r = await fetch(url); const j = await r.json();
  return (j.status === 'OK' && j.results?.[0]?.formatted_address) || null;
}

export default function AddressPicker({ visible, initial, lang = 'ko', autoQuery, onClose, onSelect }: Props) {
  const insets = useSafeAreaInsets();
  const tx = (ko: string, en: string, id: string) => (lang === 'ko' ? ko : lang === 'en' ? en : id);
  const mapRef = useRef<MapView>(null);
  const center = useRef({ lat: initial?.lat ?? DEFAULT.latitude, lng: initial?.lng ?? DEFAULT.longitude });
  const debounce = useRef<any>(null);
  const reqId = useRef(0);

  const [query, setQuery]     = useState('');

  // 데모: 열릴 때 autoQuery 자동 입력 → 자동 검색
  useEffect(() => {
    if (visible && autoQuery) setQuery(autoQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const [address, setAddress] = useState(initial?.address ?? '');
  const [hits, setHits]       = useState<Hit[]>([]);
  const [searching, setSearching] = useState(false);
  const [reversing, setReversing] = useState(false);
  const [picked, setPicked]   = useState(false); // 결과를 막 선택함(리스트 닫기)

  const initialRegion: Region = {
    latitude:  initial?.lat ?? DEFAULT.latitude,
    longitude: initial?.lng ?? DEFAULT.longitude,
    latitudeDelta: 0.006, longitudeDelta: 0.006,
  };

  // 입력 → 디바운스 자동완성 (인도네시아 우선)
  useEffect(() => {
    if (!visible) return;
    if (picked) { setPicked(false); return; }
    if (debounce.current) clearTimeout(debounce.current);
    const q = query.trim();
    if (q.length < 2) { setHits([]); setSearching(false); return; }
    setSearching(true);
    debounce.current = setTimeout(async () => {
      const my = ++reqId.current;
      try {
        const b = center.current;
        // 1순위: 구글 Geocoding (회사명·상세주소)
        let list: Hit[] = await googleSearch(q);
        if (my !== reqId.current) return; // 오래된 응답 무시
        // 폴백: 구글 결과 없을 때 Photon (한글이면 인니어 번역 후)
        if (list.length === 0) {
          let term = q;
          if (/[가-힣]/.test(q)) {
            const t = await translateText(q, 'id');
            if (my !== reqId.current) return;
            if (t) term = t;
          }
          const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(term)}&limit=7&lat=${b.lat}&lon=${b.lng}`;
          const r = await fetch(url);
          const j = await r.json();
          if (my !== reqId.current) return;
          list = (j?.features ?? []).map((f: any) => {
            const p = f.properties || {};
            const c = f.geometry?.coordinates ?? [b.lng, b.lat];
            return { label: nameOf(p), sub: addrOf(p), lat: c[1], lng: c[0] };
          }).filter((h: Hit) => h.label);
        }
        setHits(list);
      } catch {
        if (my === reqId.current) setHits([]);
      } finally {
        if (my === reqId.current) setSearching(false);
      }
    }, 400);
    return () => debounce.current && clearTimeout(debounce.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, visible]);

  const pick = (h: Hit) => {
    setPicked(true);
    setQuery(h.label);
    setHits([]);
    setAddress(h.sub);
    center.current = { lat: h.lat, lng: h.lng };
    mapRef.current?.animateToRegion({ latitude: h.lat, longitude: h.lng, latitudeDelta: 0.004, longitudeDelta: 0.004 }, 500);
  };

  // 지도 멈춤 → 중앙 좌표 역지오코딩
  const onRegionChangeComplete = async (r: Region) => {
    center.current = { lat: r.latitude, lng: r.longitude };
    const my = ++reqId.current;
    setReversing(true);
    try {
      let addr = await googleReverse(r.latitude, r.longitude);
      if (my !== reqId.current) return;
      if (!addr) {
        const res = await fetch(`https://photon.komoot.io/reverse?lat=${r.latitude}&lon=${r.longitude}`);
        const j = await res.json();
        const p = j?.features?.[0]?.properties;
        if (p) addr = addrOf(p);
      }
      if (my === reqId.current && addr) setAddress(addr);
    } catch {}
    finally { if (my === reqId.current) setReversing(false); }
  };

  const confirm = () =>
    onSelect({ address: address || tx('선택한 위치', 'Selected location', 'Lokasi terpilih'), lat: center.current.lat, lng: center.current.lng });

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={s.root}>
        <StatusBar barStyle="dark-content" />
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={initialRegion}
          onRegionChangeComplete={onRegionChangeComplete}
          showsMyLocationButton={false}
        />

        {/* 중앙 고정 핀 */}
        <View style={s.pinWrap} pointerEvents="none">
          <Ionicons name="location" size={42} color={Colors.accent} style={s.pinIcon} />
          <View style={s.pinDot} />
        </View>

        {/* 상단 검색바 + 결과 리스트 */}
        <View style={[s.top, { paddingTop: insets.top + 8 }]}>
          <View style={s.searchRow}>
            <TouchableOpacity style={s.backBtn} onPress={onClose}>
              <Ionicons name="chevron-back" size={24} color={Colors.dark} />
            </TouchableOpacity>
            <View style={s.searchBox}>
              <Ionicons name="search" size={16} color={Colors.grayLight} />
              <TextInput
                style={s.searchInput}
                placeholder={tx('주소·장소 검색 (한글/인니어)', 'Search address or place', 'Cari alamat / tempat')}
                placeholderTextColor={Colors.grayLight}
                value={query}
                onChangeText={setQuery}
                autoCorrect={false}
                returnKeyType="search"
              />
              {searching
                ? <ActivityIndicator size="small" color={Colors.accent} />
                : query.length > 0 && (
                  <TouchableOpacity onPress={() => { setQuery(''); setHits([]); }}>
                    <Ionicons name="close-circle" size={18} color={Colors.grayLight} />
                  </TouchableOpacity>
                )}
            </View>
          </View>

          {/* 자동완성 결과 */}
          {hits.length > 0 && (
            <View style={s.results}>
              <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 260 }}>
                {hits.map((h, i) => (
                  <TouchableOpacity key={`${h.lat},${h.lng},${i}`} style={s.resultRow} onPress={() => pick(h)} activeOpacity={0.7}>
                    <Ionicons name="location-outline" size={16} color={Colors.accent} />
                    <View style={{ flex: 1 }}>
                      <Text style={s.resultLabel} numberOfLines={1}>{h.label}</Text>
                      <Text style={s.resultSub} numberOfLines={1}>{h.sub}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          {!searching && query.trim().length >= 2 && hits.length === 0 && (
            <View style={s.results}>
              <Text style={s.noResult}>{tx('검색 결과가 없어요', 'No results', 'Tidak ada hasil')}</Text>
            </View>
          )}
        </View>

        {/* 하단 주소 카드 */}
        <View style={[s.bottomCard, { paddingBottom: insets.bottom + 16 }]}>
          <Text style={s.bottomLabel}>{tx('선택한 주소', 'Selected address', 'Alamat terpilih')}</Text>
          <View style={s.addrRow}>
            <Ionicons name="location-outline" size={16} color={Colors.accent} />
            <Text style={s.addrText} numberOfLines={2}>
              {reversing ? tx('주소 확인 중…', 'Locating…', 'Mencari…') : (address || tx('지도를 움직여 위치를 맞춰주세요', 'Move the map to set location', 'Geser peta untuk atur lokasi'))}
            </Text>
          </View>
          <TouchableOpacity style={s.confirmBtn} onPress={confirm} activeOpacity={0.85}>
            <Text style={s.confirmText}>{tx('이 위치로 선택', 'Use this location', 'Pakai lokasi ini')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.section },

  pinWrap: { position: 'absolute', top: '50%', left: '50%', alignItems: 'center', marginLeft: -21, marginTop: -46 },
  pinIcon: { textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  pinDot:  { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.35)', marginTop: -4 },

  top: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 12, paddingBottom: 8 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadow.sm },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.white, borderRadius: Radius.pill, paddingHorizontal: 14, paddingVertical: 10, ...Shadow.sm },
  searchInput: { flex: 1, fontSize: 14, color: Colors.dark, padding: 0 },

  results: { marginTop: 8, marginLeft: 48, backgroundColor: Colors.white, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.md },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  resultLabel: { fontSize: 14, fontWeight: '700', color: Colors.dark },
  resultSub: { fontSize: 11, color: Colors.grayLight, marginTop: 1 },
  noResult: { fontSize: 13, color: Colors.gray, padding: 14 },

  bottomCard: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 20, paddingTop: 18, ...Shadow.lg },
  bottomLabel: { fontSize: 12, fontWeight: '700', color: Colors.gray, marginBottom: 8 },
  addrRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 16, minHeight: 40 },
  addrText: { flex: 1, fontSize: 14, color: Colors.dark, fontWeight: '600', lineHeight: 20 },
  confirmBtn: { backgroundColor: Colors.accent, borderRadius: Radius.pill, paddingVertical: 15, alignItems: 'center' },
  confirmText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
