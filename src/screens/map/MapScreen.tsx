import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, Animated, Platform,
  ActivityIndicator, Image,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { W1, W2, W3, W4, W5, W6, W7, W8, W9, W10 } from '../../constants/photos';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type FilterType = 'all' | 'helper';

interface Partner {
  id: string;
  name: string;
  firstName: string;
  type: 'helper';
  lat: number;
  lng: number;
  rating: number;
  pricePerHour: number;
  isAvailable: boolean;
  photo: string;
  location: string;
  totalJobs: number;
}

// Titik tengah: antara Jakarta Selatan dan Tangerang Selatan
const BASE_LAT = -6.2850;
const BASE_LNG = 106.7600;

const MOCK_PARTNERS: Partner[] = [
  // ── Jakarta Selatan ───────────────────────────────────
  {
    id: 'p1', name: 'Sari Dewi', firstName: 'Sari',
    type: 'helper',
    lat: -6.2553, lng: 106.8062,
    rating: 5.0, pricePerHour: 30000, isAvailable: true,
    photo: W1,
    location: 'Kebayoran Baru', totalJobs: 312,
  },
  {
    id: 'p2', name: 'Rina Wulandari', firstName: 'Rina',
    type: 'helper',
    lat: -6.2900, lng: 106.8088,
    rating: 4.9, pricePerHour: 25000, isAvailable: true,
    photo: W2,
    location: 'Cilandak', totalJobs: 198,
  },
  {
    id: 'p3', name: 'Dewi Anggraeni', firstName: 'Dewi',
    type: 'helper',
    lat: -6.2607, lng: 106.8124,
    rating: 4.7, pricePerHour: 28000, isAvailable: true,
    photo: W3,
    location: 'Kemang', totalJobs: 143,
  },
  {
    id: 'p4', name: 'Fitri Handayani', firstName: 'Fitri',
    type: 'helper',
    lat: -6.2900, lng: 106.7990,
    rating: 4.9, pricePerHour: 27000, isAvailable: true,
    photo: W4,
    location: 'Fatmawati', totalJobs: 227,
  },
  {
    id: 'p5', name: 'Indah Lestari', firstName: 'Indah',
    type: 'helper',
    lat: -6.2490, lng: 106.8050,
    rating: 4.8, pricePerHour: 26000, isAvailable: false,
    photo: W5,
    location: 'Kebayoran Lama', totalJobs: 178,
  },
  // ── Tangerang Selatan ─────────────────────────────────
  {
    id: 'p6', name: 'Nurul Hidayah', firstName: 'Nurul',
    type: 'helper',
    lat: -6.3122, lng: 106.6622,
    rating: 4.8, pricePerHour: 24000, isAvailable: true,
    photo: W6,
    location: 'BSD City', totalJobs: 89,
  },
  {
    id: 'p7', name: 'Sri Mulyani', firstName: 'Sri',
    type: 'helper',
    lat: -6.3050, lng: 106.7200,
    rating: 4.6, pricePerHour: 23000, isAvailable: true,
    photo: W7,
    location: 'Ciputat', totalJobs: 64,
  },
  {
    id: 'p8', name: 'Ratna Sari', firstName: 'Ratna',
    type: 'helper',
    lat: -6.3280, lng: 106.6900,
    rating: 4.9, pricePerHour: 25000, isAvailable: true,
    photo: W8,
    location: 'Pamulang', totalJobs: 112,
  },
  {
    id: 'p9', name: 'Wulan Sari', firstName: 'Wulan',
    type: 'helper',
    lat: -6.2900, lng: 106.7100,
    rating: 5.0, pricePerHour: 26000, isAvailable: false,
    photo: W9,
    location: 'Pondok Aren', totalJobs: 201,
  },
  {
    id: 'p10', name: 'Mega Putri', firstName: 'Mega',
    type: 'helper',
    lat: -6.3333, lng: 106.7167,
    rating: 4.7, pricePerHour: 22000, isAvailable: true,
    photo: W10,
    location: 'Serpong', totalJobs: 77,
  },
];

const MAP_STYLE = [
  { elementType: 'geometry',           stylers: [{ color: '#f2f2f0' }] },
  { elementType: 'labels.text.fill',   stylers: [{ color: '#555555' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f2f2f0' }] },
  { featureType: 'road',             elementType: 'geometry',        stylers: [{ color: '#ffffff' }] },
  { featureType: 'road',             elementType: 'geometry.stroke', stylers: [{ color: '#e8e8e8' }] },
  { featureType: 'road.arterial',    elementType: 'geometry',        stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.highway',     elementType: 'geometry',        stylers: [{ color: '#f0ede8' }] },
  { featureType: 'road.highway',     elementType: 'geometry.stroke', stylers: [{ color: '#e0dbd4' }] },
  { featureType: 'water',            elementType: 'geometry',        stylers: [{ color: '#cde8f4' }] },
  { featureType: 'water',            elementType: 'labels.text.fill',stylers: [{ color: '#8ab4c8' }] },
  { featureType: 'poi.park',         elementType: 'geometry',        stylers: [{ color: '#daecd8' }] },
  { featureType: 'poi.park',         elementType: 'labels.text.fill',stylers: [{ color: '#7daa79' }] },
  { featureType: 'poi',              stylers: [{ visibility: 'off' }] },
  { featureType: 'transit',          stylers: [{ visibility: 'off' }] },
  { featureType: 'landscape.built',  elementType: 'geometry',        stylers: [{ color: '#ebebeb' }] },
];

export default function MapScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState<Region>({
    latitude: BASE_LAT, longitude: BASE_LNG,
    latitudeDelta: 0.14, longitudeDelta: 0.14,
  });
  const [locationGranted, setLocationGranted] = useState(false);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<FilterType>('all');
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState<Partner | null>(null);

  const sheetAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationGranted(true);
        try {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          const { latitude, longitude } = loc.coords;
          setRegion({ latitude, longitude, latitudeDelta: 0.022, longitudeDelta: 0.022 });
        } catch {
          // 권한은 있지만 위치 못 가져온 경우 Jakarta 기본값 사용
        }
      }
      setLoading(false);
    })();
  }, []);

  const showSheet = (partner: Partner) => {
    setSelected(partner);
    Animated.spring(sheetAnim, {
      toValue: 1, useNativeDriver: true,
      speed: 22, bounciness: 4,
    }).start();
  };

  const hideSheet = () => {
    Animated.timing(sheetAnim, {
      toValue: 0, duration: 180, useNativeDriver: true,
    }).start(() => setSelected(null));
  };

  const goToMyLocation = async () => {
    if (!locationGranted) return;
    try {
      const loc = await Location.getCurrentPositionAsync({});
      const r = {
        latitude: loc.coords.latitude, longitude: loc.coords.longitude,
        latitudeDelta: 0.018, longitudeDelta: 0.018,
      };
      mapRef.current?.animateToRegion(r, 400);
    } catch {}
  };

  const filtered = MOCK_PARTNERS.filter((p) => {
    const matchFilter = filter === 'all' || p.type === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.location.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });


  const sheetTranslateY = sheetAnim.interpolate({
    inputRange: [0, 1], outputRange: [320, 0],
  });

  const FILTERS: { id: FilterType; label: string; icon: any }[] = [
    { id: 'all',    label: t.mapScreen.filterAll,    icon: 'apps-outline' },
    { id: 'helper', label: t.mapScreen.filterHelper, icon: 'home-outline' },
  ];

  return (
    <View style={s.root}>
      {loading ? (
        <View style={s.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={s.loadingText}>{t.common.loading}</Text>
        </View>
      ) : (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          customMapStyle={MAP_STYLE}
          region={region}
          showsUserLocation={locationGranted}
          showsMyLocationButton={false}
          showsCompass={false}
          onPress={() => selected && hideSheet()}
        >
          {filtered.map((partner) => (
            <Marker
              key={partner.id}
              coordinate={{ latitude: partner.lat, longitude: partner.lng }}
              onPress={() => showSheet(partner)}
              anchor={{ x: 0.5, y: 1 }}
              tracksViewChanges={false}
            >
              <PhotoMarker partner={partner} selected={selected?.id === partner.id} />
            </Marker>
          ))}
        </MapView>
      )}

      {/* ── Top overlay ── */}
      <View style={s.overlay} pointerEvents="box-none">
        {/* Search bar */}
        <View style={s.searchWrap}>
          <View style={s.searchBar}>
            <Ionicons name="search-outline" size={16} color={Colors.grayLight} />
            <TextInput
              style={s.searchInput}
              placeholder={t.mapScreen.searchPlaceholder}
              placeholderTextColor={Colors.grayLight}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 ? (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={16} color={Colors.grayLight} />
              </TouchableOpacity>
            ) : (
              <View style={s.searchAvatar}>
                {user?.name ? (
                  <Text style={s.searchAvatarText}>{user.name.charAt(0)}</Text>
                ) : (
                  <Ionicons name="person" size={13} color={Colors.grayLight} />
                )}
              </View>
            )}
          </View>
        </View>

        {/* Filter pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.filtersScroll}
          contentContainerStyle={s.filtersContent}
          pointerEvents="auto"
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[s.pill, filter === f.id && s.pillActive]}
              onPress={() => setFilter(f.id)}
              activeOpacity={0.75}
            >
              <Ionicons
                name={f.icon}
                size={13}
                color={filter === f.id ? Colors.white : Colors.gray}
              />
              <Text style={[s.pillText, filter === f.id && s.pillTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Live count chip */}
          <View style={s.countChip}>
            <View style={[s.countDot, { backgroundColor: Colors.helperColor }]} />
            <Text style={s.countText}>{t.mapScreen.helperLabel} {filtered.length}</Text>
          </View>
        </ScrollView>

        {/* My location button */}
        <TouchableOpacity style={s.locBtn} onPress={goToMyLocation} activeOpacity={0.8}>
          <Ionicons name="navigate" size={18} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      {/* ── Persistent bottom summary (no marker selected) ── */}
      {!selected && !loading && (
        <View style={s.summaryPanel}>
          <View style={s.summaryHandle} />
          <View style={s.summaryRow}>
            {/* Helper count */}
            <View style={s.summaryItem}>
              <View style={[s.summaryIconBg, { backgroundColor: Colors.helperLight }]}>
                <Ionicons name="home" size={16} color={Colors.helperColor} />
              </View>
              <View>
                <Text style={s.summaryCount}>{filtered.length}</Text>
                <Text style={s.summaryLabel}>{t.mapScreen.helperLabel}</Text>
              </View>
            </View>

            <View style={s.summaryDivider} />

            {/* Available now */}
            <View style={s.summaryItem}>
              <View style={[s.summaryIconBg, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              </View>
              <View>
                <Text style={s.summaryCount}>{filtered.filter(p => p.isAvailable).length}</Text>
                <Text style={s.summaryLabel}>Siap kerja</Text>
              </View>
            </View>

            <View style={s.summaryDivider} />

            {/* Location */}
            <View style={s.summaryItem}>
              <View style={[s.summaryIconBg, { backgroundColor: '#EEF2FF' }]}>
                <Ionicons name="location" size={16} color="#6366F1" />
              </View>
              <View>
                <Text style={s.summaryCount}>{t.mapScreen.locationDefault}</Text>
                <Text style={s.summaryLabel}>📍</Text>
              </View>
            </View>
          </View>

          {/* Partner avatar row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.avatarRowContent}
          >
            {MOCK_PARTNERS.filter(p => p.isAvailable).map((p) => (
              <TouchableOpacity
                key={p.id}
                style={s.avatarChip}
                activeOpacity={0.8}
                onPress={() => showSheet(p)}
              >
                <Image source={{ uri: p.photo }} style={s.avatarChipPhoto} />
                <View style={[s.avatarChipDot, { backgroundColor: Colors.success }]} />
                <View style={s.avatarChipInfo}>
                  <Text style={s.avatarChipName} numberOfLines={1}>{p.firstName}</Text>
                  <Text style={s.avatarChipPrice}>
                    🏠 Rp {(p.pricePerHour/1000).toFixed(0)}rb
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ── Bottom sheet ── */}
      {selected && (
        <>
          {/* Dim backdrop */}
          <TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={hideSheet} />

          <Animated.View style={[s.sheet, { transform: [{ translateY: sheetTranslateY }] }]}>
            <View style={s.sheetHandle} />

            {/* Header row */}
            <View style={s.sheetHeader}>
              <Image source={{ uri: selected.photo }} style={s.sheetPhoto} />

              <View style={s.sheetMeta}>
                <View style={s.sheetNameRow}>
                  <Text style={s.sheetName}>{selected.name}</Text>
                  <View style={[s.onlineDot, {
                    backgroundColor: selected.isAvailable ? Colors.success : Colors.grayLight
                  }]} />
                </View>

                <View style={s.sheetTagRow}>
                  <View style={[s.sheetTypeBadge, { backgroundColor: Colors.helperLight }]}>
                    <Ionicons name="home" size={11} color={Colors.helperColor} />
                    <Text style={[s.sheetTypeText, { color: Colors.helperColor }]}>
                      {t.mapScreen.helperLabel}
                    </Text>
                  </View>

                  <Text style={s.sheetLocation}>
                    <Ionicons name="location-outline" size={11} color={Colors.grayLight} /> {selected.location}
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={s.sheetClose} onPress={hideSheet}>
                <Ionicons name="close" size={16} color={Colors.gray} />
              </TouchableOpacity>
            </View>

            {/* Stats row */}
            <View style={s.statsRow}>
              <View style={s.statItem}>
                <View style={s.statValueRow}>
                  <Ionicons name="star" size={13} color="#F59E0B" />
                  <Text style={s.statValue}>{selected.rating}</Text>
                </View>
                <Text style={s.statLabel}>{t.mapScreen.ratingLabel}</Text>
              </View>

              <View style={s.statDivider} />

              <View style={s.statItem}>
                <Text style={s.statValue}>
                  Rp {selected.pricePerHour.toLocaleString('id-ID')}
                </Text>
                <Text style={s.statLabel}>/ jam</Text>
              </View>

              <View style={s.statDivider} />

              <View style={s.statItem}>
                <Text style={s.statValue}>{selected.totalJobs}</Text>
                <Text style={s.statLabel}>{t.mapScreen.jobsLabel}</Text>
              </View>
            </View>

            {/* Status bar */}
            <View style={[s.statusBar, {
              backgroundColor: selected.isAvailable ? '#ECFDF5' : '#F5F5F5',
              borderColor: selected.isAvailable ? '#D1FAE5' : Colors.border,
            }]}>
              <View style={[s.statusDot, {
                backgroundColor: selected.isAvailable ? Colors.success : Colors.grayLight
              }]} />
              <Text style={[s.statusText, {
                color: selected.isAvailable ? '#065F46' : Colors.grayLight
              }]}>
                {selected.isAvailable
                  ? t.mapScreen.availableNow.replace('{name}', selected.firstName)
                  : t.mapScreen.busyNow.replace('{name}', selected.firstName)}
              </Text>
            </View>

            {/* Book button */}
            <TouchableOpacity
              style={[s.bookBtn, !selected.isAvailable && s.bookBtnDisabled]}
              activeOpacity={selected.isAvailable ? 0.85 : 1}
              onPress={() => {
                if (selected.isAvailable) {
                  hideSheet();
                  navigation.navigate('WorkerDetail', { workerId: selected.id });
                }
              }}
            >
              <Text style={s.bookBtnText}>
                {selected.isAvailable ? t.mapScreen.bookBtn : t.mapScreen.notAvailableBtn}
              </Text>
              {selected.isAvailable && (
                <Ionicons name="arrow-forward" size={16} color={Colors.white} />
              )}
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </View>
  );
}

// ── Photo pin marker ──────────────────────────────────────────────
function PhotoMarker({ partner, selected }: { partner: Partner; selected: boolean }) {
  const borderColor = selected ? Colors.helperColor : Colors.white;

  const size = selected ? 52 : 44;
  const br   = selected ? 26 : 22;

  return (
    <View style={m.wrap}>
      {/* Photo bubble */}
      <View style={[m.bubble, { width: size + 6, height: size + 6, borderRadius: br + 3, borderColor }]}>
        <Image
          source={{ uri: partner.photo }}
          style={{ width: size, height: size, borderRadius: br }}
        />
      </View>

      {/* Type mini badge — bottom-right of bubble */}
      <View style={[m.typeBadge, { backgroundColor: Colors.helperColor, bottom: 8 }]}>
        <Ionicons name="home" size={8} color={Colors.white} />
      </View>

      {/* Online dot — top-right */}
      <View style={[m.onlineDot, {
        backgroundColor: partner.isAvailable ? Colors.success : Colors.grayLight,
        top: 2, right: 2,
      }]} />

      {/* Triangle tail */}
      <View style={[m.tail, { borderTopColor: borderColor }]} />
    </View>
  );
}

const m = StyleSheet.create({
  wrap: { alignItems: 'center' },
  bubble: {
    borderWidth: 2.5,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.white,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18, shadowRadius: 4,
    elevation: 6,
  },
  typeBadge: {
    position: 'absolute', right: 0,
    width: 16, height: 16, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.white,
  },
  onlineDot: {
    position: 'absolute',
    width: 11, height: 11, borderRadius: 5.5,
    borderWidth: 1.5, borderColor: Colors.white,
  },
  tail: {
    width: 0, height: 0,
    borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    marginTop: -1,
  },
});

const s = StyleSheet.create({
  root: { flex: 1 },

  loadingWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F8F8F8', gap: 12,
  },
  loadingText: { fontSize: 14, color: Colors.gray },

  // ── Overlay ──────────────────────────────────────────────────
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0,
    paddingTop: 52,
  },

  searchWrap: { paddingHorizontal: 14, marginBottom: 10 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.white,
    borderRadius: Radius.pill,
    paddingHorizontal: 14, paddingVertical: 11,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10, shadowRadius: 6, elevation: 4,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.dark },
  searchAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.section,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  searchAvatarText: { fontSize: 12, fontWeight: '700', color: Colors.dark },

  filtersScroll:  { flexGrow: 0 },
  filtersContent: { paddingHorizontal: 14, gap: 8, paddingBottom: 4 },

  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.white,
    borderRadius: Radius.pill,
    paddingHorizontal: 12, paddingVertical: 7,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
  },
  pillActive:     { backgroundColor: Colors.dark },
  pillText:       { fontSize: 13, fontWeight: '500', color: Colors.gray },
  pillTextActive: { color: Colors.white, fontWeight: '700' },

  countChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.white,
    borderRadius: Radius.pill,
    paddingHorizontal: 12, paddingVertical: 7,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
  },
  countDot:  { width: 6, height: 6, borderRadius: 3 },
  countSep:  { width: 1, height: 12, backgroundColor: Colors.border },
  countText: { fontSize: 12, fontWeight: '600', color: Colors.dark },

  locBtn: {
    position: 'absolute', right: 14, top: 118,
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 5, elevation: 4,
  },

  // ── Persistent summary panel ─────────────────────────────────
  summaryPanel: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingTop: 10, paddingBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 10,
  },
  summaryHandle: {
    width: 32, height: 4, borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center', marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 14,
  },
  summaryItem:   { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  summaryIconBg: {
    width: 38, height: 38, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  summaryCount: { fontSize: 14, fontWeight: '700', color: Colors.dark },
  summaryLabel: { fontSize: 11, color: Colors.gray, marginTop: 1 },
  summaryDivider: { width: 1, height: 32, backgroundColor: Colors.border, marginHorizontal: 4 },

  avatarRowContent: { paddingHorizontal: 16, gap: 10 },
  avatarChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.section,
    borderRadius: 12, padding: 8,
    borderWidth: 1, borderColor: Colors.border,
    position: 'relative',
  },
  avatarChipPhoto: { width: 36, height: 36, borderRadius: 18 },
  avatarChipDot: {
    position: 'absolute', top: 6, left: 6,
    width: 10, height: 10, borderRadius: 5,
    borderWidth: 1.5, borderColor: Colors.white,
  },
  avatarChipInfo: { gap: 2 },
  avatarChipName:  { fontSize: 12, fontWeight: '700', color: Colors.dark },
  avatarChipPrice: { fontSize: 11, color: Colors.gray },

  // ── Backdrop ──────────────────────────────────────────────────
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },

  // ── Bottom sheet ──────────────────────────────────────────────
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 22, borderTopRightRadius: 22,
    paddingHorizontal: 20, paddingBottom: 36, paddingTop: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.10, shadowRadius: 10, elevation: 12,
  },
  sheetHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center', marginBottom: 18,
  },

  // Header
  sheetHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  sheetPhoto:  { width: 52, height: 52, borderRadius: 26 },
  sheetMeta:   { flex: 1, gap: 6 },
  sheetNameRow:{ flexDirection: 'row', alignItems: 'center', gap: 8 },
  sheetName:   { fontSize: 16, fontWeight: '700', color: Colors.dark },
  onlineDot:   { width: 8, height: 8, borderRadius: 4 },
  sheetTagRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sheetTypeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: Radius.pill,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  sheetTypeText: { fontSize: 11, fontWeight: '700' },
  sheetLocation: { fontSize: 12, color: Colors.grayLight },
  sheetClose: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.section,
    alignItems: 'center', justifyContent: 'center',
  },

  // Stats
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.section, borderRadius: Radius.lg,
    paddingVertical: 14, marginBottom: 14,
  },
  statItem:     { flex: 1, alignItems: 'center', gap: 4 },
  statValueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statValue:    { fontSize: 15, fontWeight: '700', color: Colors.dark },
  statLabel:    { fontSize: 11, color: Colors.gray },
  statDivider:  { width: 1, height: 28, backgroundColor: Colors.border },

  // Status bar
  statusBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: Radius.md, borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 10,
    marginBottom: 16,
  },
  statusDot:  { width: 7, height: 7, borderRadius: 3.5 },
  statusText: { fontSize: 13, fontWeight: '500', flex: 1 },

  // Book button
  bookBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.dark,
    borderRadius: Radius.pill, paddingVertical: 15,
  },
  bookBtnDisabled: { backgroundColor: Colors.grayLight },
  bookBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
