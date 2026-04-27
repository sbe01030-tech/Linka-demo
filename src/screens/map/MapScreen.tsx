import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, Animated, Platform,
  ActivityIndicator, Image, FlatList, Dimensions,
  Modal, Pressable,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow } from '../../constants/colors';
import { useLanguageStore } from '../../store/languageStore';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, CustomerTabParamList } from '../../types';
import { W1, W2, W3, W4, W5, W6, W7, W8, W9, W10, W11, W12, D7, D8, D9, D10, D11 } from '../../constants/photos';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type SvcType       = 'regular' | 'onetime' | 'live-in';
type ExpLevel      = 'all' | '1y' | '3y' | '5y';
type SortBy        = 'rating' | 'price_low' | 'price_high' | 'reviews';
type PartnerFilter = 'all' | 'helper' | 'driver';

const { height: SCREEN_H } = Dimensions.get('window');
const EXPANDED_H = SCREEN_H * 0.72;
const PEEK_H     = 240;

interface Partner {
  id: string; name: string; firstName: string;
  lat: number; lng: number;
  rating: number; pricePerHour: number; isAvailable: boolean;
  photo: string | number; location: string; totalJobs: number;
  serviceFrequency: 'regular' | 'special' | 'both';
  skills: string[]; experienceYears: number; isVerified: boolean;
  partnerType: 'helper' | 'driver';
  driverServices?: string[];
  licenseClass?: string;
}

// URL 문자열 또는 local require (number) 둘 다 받아서 Image source로 변환
const imgSrc = (p: string | number | undefined): any =>
  typeof p === 'string' ? { uri: p } : p;

// ── Demo cluster center (Kebayoran Baru, South Jakarta) ─────────
// For internal preview: always shows the dense cluster regardless of GPS
const DEMO_REGION = { latitude: -6.2488, longitude: 106.8052, latitudeDelta: 0.010, longitudeDelta: 0.010 };

const MOCK_PARTNERS: Partner[] = [
  { id:'p1',  name:'Sari Dewi',        firstName:'Sari',    lat:-6.2440, lng:106.8022, rating:5.0, pricePerHour:30000, isAvailable:true,  photo:W1,  location:'Kebayoran Baru', totalJobs:312, serviceFrequency:'regular', skills:['Beberes','Masak','Cuci'],      experienceYears:10, isVerified:true,  partnerType:'helper' },
  { id:'p2',  name:'Rina Wulandari',   firstName:'Rina',    lat:-6.2465, lng:106.8058, rating:4.9, pricePerHour:25000, isAvailable:true,  photo:W2,  location:'Kebayoran Baru', totalJobs:198, serviceFrequency:'regular', skills:['Masak Sehat','Beberes'],       experienceYears:7,  isVerified:true,  partnerType:'helper' },
  { id:'p3',  name:'Dewi Anggraeni',   firstName:'Dewi',    lat:-6.2492, lng:106.8072, rating:4.7, pricePerHour:28000, isAvailable:true,  photo:W3,  location:'Kemang',         totalJobs:143, serviceFrequency:'both',    skills:['Masak','Cuci'],                experienceYears:5,  isVerified:true,  partnerType:'helper' },
  { id:'p4',  name:'Fitri Handayani',  firstName:'Fitri',   lat:-6.2512, lng:106.8036, rating:4.9, pricePerHour:27000, isAvailable:true,  photo:W4,  location:'Pesanggrahan',   totalJobs:227, serviceFrequency:'regular', skills:['Setrika','Beberes'],           experienceYears:8,  isVerified:true,  partnerType:'helper' },
  { id:'p5',  name:'Indah Lestari',    firstName:'Indah',   lat:-6.2530, lng:106.8088, rating:4.8, pricePerHour:35000, isAvailable:false, photo:W5,  location:'Pondok Indah',   totalJobs:89,  serviceFrequency:'special', skills:['Deep Cleaning'],               experienceYears:3,  isVerified:true,  partnerType:'helper' },
  { id:'p6',  name:'Nurul Hidayah',    firstName:'Nurul',   lat:-6.2458, lng:106.8098, rating:4.8, pricePerHour:24000, isAvailable:true,  photo:W6,  location:'Kebayoran Baru', totalJobs:89,  serviceFrequency:'special', skills:['Cuci','Setrika'],              experienceYears:6,  isVerified:true,  partnerType:'helper' },
  { id:'p7',  name:'Sri Mulyani',      firstName:'Sri',     lat:-6.2480, lng:106.8012, rating:4.6, pricePerHour:23000, isAvailable:true,  photo:W7,  location:'Cilandak',       totalJobs:64,  serviceFrequency:'regular', skills:['Masak','Cuci'],                experienceYears:5,  isVerified:false, partnerType:'helper' },
  { id:'p8',  name:'Ratna Sari',       firstName:'Ratna',   lat:-6.2522, lng:106.8062, rating:4.9, pricePerHour:25000, isAvailable:true,  photo:W8,  location:'Kebayoran Baru', totalJobs:112, serviceFrequency:'both',    skills:['Beberes','Setrika'],           experienceYears:7,  isVerified:true,  partnerType:'helper' },
  { id:'p9',  name:'Wulan Sari',       firstName:'Wulan',   lat:-6.2447, lng:106.8078, rating:5.0, pricePerHour:26000, isAvailable:false, photo:W9,  location:'Pondok Indah',   totalJobs:201, serviceFrequency:'regular', skills:['Masak','Beberes'],             experienceYears:9,  isVerified:true,  partnerType:'helper' },
  { id:'p10', name:'Mega Putri',       firstName:'Mega',    lat:-6.2505, lng:106.8046, rating:4.7, pricePerHour:22000, isAvailable:true,  photo:W10, location:'Pesanggrahan',   totalJobs:77,  serviceFrequency:'special', skills:['Cuci','Deep Cleaning'],        experienceYears:2,  isVerified:false, partnerType:'helper' },
  { id:'p11', name:'Lina Kartini',     firstName:'Lina',    lat:-6.2470, lng:106.8032, rating:4.8, pricePerHour:26000, isAvailable:true,  photo:W11, location:'Kebayoran Baru', totalJobs:134, serviceFrequency:'regular', skills:['Beberes','Cuci'],              experienceYears:6,  isVerified:true,  partnerType:'helper' },
  { id:'p12', name:'Aisyah Putri',     firstName:'Aisyah',  lat:-6.2496, lng:106.8091, rating:4.9, pricePerHour:29000, isAvailable:true,  photo:W12, location:'Kemang',         totalJobs:176, serviceFrequency:'both',    skills:['Masak','Beberes','Setrika'],   experienceYears:8,  isVerified:true,  partnerType:'helper' },
  { id:'p13', name:'Yuni Rahayu',      firstName:'Yuni',    lat:-6.2460, lng:106.8052, rating:4.6, pricePerHour:21000, isAvailable:true,  photo:W3,  location:'Cilandak',       totalJobs:55,  serviceFrequency:'special', skills:['Cuci','Setrika'],              experienceYears:3,  isVerified:false, partnerType:'helper' },
  { id:'p14', name:'Hana Pratiwi',     firstName:'Hana',    lat:-6.2535, lng:106.8022, rating:4.9, pricePerHour:32000, isAvailable:true,  photo:W5,  location:'Pondok Indah',   totalJobs:248, serviceFrequency:'regular', skills:['Masak Sehat','Deep Cleaning'], experienceYears:11, isVerified:true,  partnerType:'helper' },
  { id:'p15', name:'Reni Susanti',     firstName:'Reni',    lat:-6.2475, lng:106.8068, rating:4.7, pricePerHour:24000, isAvailable:false, photo:W7,  location:'Kebayoran Baru', totalJobs:92,  serviceFrequency:'both',    skills:['Beberes','Masak'],             experienceYears:4,  isVerified:true,  partnerType:'helper' },
  { id:'p16', name:'Tutik Wahyuni',    firstName:'Tutik',   lat:-6.2500, lng:106.8082, rating:4.8, pricePerHour:27000, isAvailable:true,  photo:W9,  location:'Pesanggrahan',   totalJobs:163, serviceFrequency:'regular', skills:['Setrika','Cuci','Beberes'],    experienceYears:7,  isVerified:true,  partnerType:'helper' },
  { id:'p17', name:'Mira Handayani',   firstName:'Mira',    lat:-6.2450, lng:106.8040, rating:5.0, pricePerHour:33000, isAvailable:true,  photo:W1,  location:'Kebayoran Baru', totalJobs:289, serviceFrequency:'regular', skills:['Masak','Beberes','Cuci'],      experienceYears:12, isVerified:true,  partnerType:'helper' },
  { id:'p18', name:'Novi Anggraini',   firstName:'Novi',    lat:-6.2518, lng:106.8014, rating:4.6, pricePerHour:22000, isAvailable:true,  photo:W4,  location:'Cilandak',       totalJobs:48,  serviceFrequency:'special', skills:['Deep Cleaning','Cuci'],        experienceYears:2,  isVerified:false, partnerType:'helper' },
  { id:'p19', name:'Desi Kurniawati',  firstName:'Desi',    lat:-6.2485, lng:106.8056, rating:4.8, pricePerHour:28000, isAvailable:true,  photo:W6,  location:'Kemang',         totalJobs:121, serviceFrequency:'both',    skills:['Masak','Setrika'],             experienceYears:6,  isVerified:true,  partnerType:'helper' },
  { id:'p20', name:'Ayu Puspita',      firstName:'Ayu',     lat:-6.2442, lng:106.8092, rating:4.9, pricePerHour:31000, isAvailable:false, photo:W2,  location:'Pondok Indah',   totalJobs:187, serviceFrequency:'regular', skills:['Masak Sehat','Beberes'],       experienceYears:9,  isVerified:true,  partnerType:'helper' },
  // ── Drivers (고객 차량 운전 서비스) ───────────────────────────
  { id:'d1',  name:'Rahmat Hidayat',   firstName:'Rahmat',  lat:-6.2444, lng:106.8050, rating:5.0, pricePerHour:55000,  isAvailable:true,  photo:D7,  location:'Kebayoran Baru', totalJobs:284, serviceFrequency:'both',    skills:['Sedan','SUV','MPV'],           experienceYears:8,  isVerified:true,  partnerType:'driver', driverServices:['designated','daily','airport'], licenseClass:'SIM A' },
  { id:'d2',  name:'Budi Setiawan',    firstName:'Budi',    lat:-6.2478, lng:106.8032, rating:4.9, pricePerHour:50000,  isAvailable:true,  photo:D8,  location:'Menteng',        totalJobs:192, serviceFrequency:'regular', skills:['Sedan','SUV'],                 experienceYears:6,  isVerified:true,  partnerType:'driver', driverServices:['designated','hourly','commute'], licenseClass:'SIM A' },
  { id:'d3',  name:'Joko Susanto',     firstName:'Joko',    lat:-6.2510, lng:106.8018, rating:4.8, pricePerHour:45000,  isAvailable:true,  photo:D9,  location:'Cilandak',       totalJobs:156, serviceFrequency:'both',    skills:['Sedan','SUV','MPV','Van'],     experienceYears:10, isVerified:true,  partnerType:'driver', driverServices:['daily','intercity','event'], licenseClass:'SIM A Umum' },
  { id:'d4',  name:'Ari Wibowo',       firstName:'Ari',     lat:-6.2498, lng:106.8084, rating:4.9, pricePerHour:60000,  isAvailable:true,  photo:D10, location:'Kemang',         totalJobs:221, serviceFrequency:'both',    skills:['Sedan','SUV','MPV'],           experienceYears:7,  isVerified:true,  partnerType:'driver', driverServices:['designated','airport','event'], licenseClass:'SIM A' },
  { id:'d5',  name:'Agus Setiawan',    firstName:'Agus',    lat:-6.2520, lng:106.8040, rating:4.9, pricePerHour:52000,  isAvailable:true,  photo:D11, location:'Fatmawati',      totalJobs:178, serviceFrequency:'both',    skills:['Sedan','MPV','Van'],           experienceYears:9,  isVerified:true,  partnerType:'driver', driverServices:['daily','intercity','airport'], licenseClass:'SIM A Umum' },
];

const MAP_STYLE = [
  { elementType:'geometry',           stylers:[{color:'#f2f2f0'}] },
  { elementType:'labels.text.fill',   stylers:[{color:'#555555'}] },
  { elementType:'labels.text.stroke', stylers:[{color:'#f2f2f0'}] },
  { featureType:'road',             elementType:'geometry',        stylers:[{color:'#ffffff'}] },
  { featureType:'road',             elementType:'geometry.stroke', stylers:[{color:'#e8e8e8'}] },
  { featureType:'road.highway',     elementType:'geometry',        stylers:[{color:'#f0ede8'}] },
  { featureType:'water',            elementType:'geometry',        stylers:[{color:'#cde8f4'}] },
  { featureType:'poi.park',         elementType:'geometry',        stylers:[{color:'#daecd8'}] },
  { featureType:'poi',              stylers:[{visibility:'off'}] },
  { featureType:'transit',          stylers:[{visibility:'off'}] },
  { featureType:'landscape.built',  elementType:'geometry',        stylers:[{color:'#ebebeb'}] },
];

// ── Activity categories (identical to WorkerSearchScreen) ────────
const ACTIVITY_CATS = [
  {
    id: 'cleaning', icon: 'sparkles-outline' as const, color: '#10B981', bg: '#ECFDF5',
    label: { id: 'Kebersihan·Kerapian', ko: '청소·정리', en: 'Cleaning' },
    items: [
      { id: 'floor',    label: { id: 'Sapu & Pel Lantai',   ko: '바닥 청소',    en: 'Floor Cleaning' }, skill: 'Beberes'      },
      { id: 'kitchen',  label: { id: 'Bersih Dapur',        ko: '주방 청소',    en: 'Kitchen' },        skill: 'Beberes'      },
      { id: 'bathroom', label: { id: 'Bersih Kamar Mandi',  ko: '화장실 청소',  en: 'Bathroom' },       skill: 'Beberes'      },
      { id: 'balcony',  label: { id: 'Bersih Balkon',       ko: '베란다 청소',  en: 'Balcony' },        skill: 'Beberes'      },
      { id: 'window',   label: { id: 'Bersih Jendela',      ko: '창문 청소',    en: 'Windows' },        skill: 'Deep Cleaning'},
      { id: 'ac',       label: { id: 'Bersih AC',           ko: '에어컨 청소',  en: 'AC Cleaning' },    skill: 'Deep Cleaning'},
    ],
  },
  {
    id: 'cooking', icon: 'restaurant-outline' as const, color: '#F97316', bg: '#FFF1EC',
    label: { id: 'Masak·Makanan', ko: '요리·식사', en: 'Cooking' },
    items: [
      { id: 'meal',     label: { id: 'Masak Harian',    ko: '식사 준비',   en: 'Daily Meals' },      skill: 'Masak'      },
      { id: 'sidedish', label: { id: 'Lauk Pauk',       ko: '반찬 만들기', en: 'Side Dishes' },      skill: 'Masak'      },
      { id: 'dishes',   label: { id: 'Cuci Piring',     ko: '설거지',      en: 'Dishwashing' },      skill: 'Cuci'       },
      { id: 'prep',     label: { id: 'Persiapan Bahan', ko: '식재료 손질', en: 'Food Prep' },        skill: 'Masak Sehat'},
    ],
  },
  {
    id: 'laundry', icon: 'shirt-outline' as const, color: '#3B82F6', bg: '#EFF6FF',
    label: { id: 'Cuci·Setrika', ko: '세탁·관리', en: 'Laundry' },
    items: [
      { id: 'wash',    label: { id: 'Cuci Baju',       ko: '빨래',        en: 'Washing' },          skill: 'Cuci'    },
      { id: 'iron',    label: { id: 'Setrika',         ko: '다림질',      en: 'Ironing' },          skill: 'Setrika' },
      { id: 'fold',    label: { id: 'Rapikan Pakaian', ko: '세탁물 정리', en: 'Folding' },          skill: 'Setrika' },
      { id: 'laundry', label: { id: 'Laundry Kilat',   ko: '빠른 세탁',   en: 'Express Laundry' },  skill: 'Laundry' },
    ],
  },
  {
    id: 'other', icon: 'grid-outline' as const, color: '#8B5CF6', bg: '#F5F3FF',
    label: { id: 'Lainnya', ko: '기타', en: 'Others' },
    items: [
      { id: 'grocery', label: { id: 'Belanja Bahan', ko: '장보기',        en: 'Grocery Shopping' }, skill: 'Masak'   },
      { id: 'trash',   label: { id: 'Buang Sampah',  ko: '쓰레기 분리수거', en: 'Waste Disposal' }, skill: 'Beberes' },
    ],
  },
];

// flat list of all activity items — derived from ACTIVITY_CATS
const ALL_ACTIVITY_ITEMS = ACTIVITY_CATS.flatMap((cat) => cat.items.map((i) => ({ ...i, cat: cat.id })));

export default function MapScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<RouteProp<CustomerTabParamList, 'Map'>>();
  const { lang }   = useLanguageStore();
  const insets     = useSafeAreaInsets();
  const mapRef     = useRef<MapView>(null);

  const tx = (id: string, ko: string, en: string) =>
    lang === 'ko' ? ko : lang === 'en' ? en : id;
  const tLabel = (o: { id: string; ko: string; en: string }) =>
    lang === 'ko' ? o.ko : lang === 'en' ? o.en : o.id;

  // ── Map state ────────────────────────────────────────────────
  const [region, setRegion] = useState<Region>(DEMO_REGION);
  const [locationGranted, setLocationGranted] = useState(false);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState<Partner | null>(null);

  // ── Bottom sheet state ───────────────────────────────────────
  const [isExpanded, setIsExpanded] = useState(false);
  const sheetAnim   = useRef(new Animated.Value(EXPANDED_H - PEEK_H)).current;
  const detailAnim  = useRef(new Animated.Value(0)).current;

  // ── Filter state ─────────────────────────────────────────────
  const [partnerFilter, setPartnerFilter]      = useState<PartnerFilter>('all');
  const [serviceType, setServiceType]         = useState<SvcType | null>(null);
  const [selectedActivities, setSelectedAct]  = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly]        = useState(false);
  const [availableOnly, setAvailableOnly]      = useState(false);
  const [expLevel, setExpLevel]                = useState<ExpLevel>('all');
  const [sortBy, setSortBy]                    = useState<SortBy>('rating');

  // Modal visibility
  const [showActModal,  setShowActModal]  = useState(false);
  const [showCondModal, setShowCondModal] = useState(false);
  const [showWrkModal,  setShowWrkModal]  = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  // Temp filter state
  const [tmpAct,  setTmpAct]  = useState<string[]>([]);
  const [tmpSvc,  setTmpSvc]  = useState<SvcType | null>(null);
  const [tmpVer,  setTmpVer]  = useState(false);
  const [tmpExp,  setTmpExp]  = useState<ExpLevel>('all');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationGranted(true);
        // Demo mode: keep cluster region as default instead of jumping to GPS position
      }
      setLoading(false);
    })();
  }, []);

  // ── Handle navigation params (expand sheet / set service type) ──
  // Use specific primitive deps to avoid infinite loop from setParams triggering re-renders
  useEffect(() => {
    const p = route.params as { expanded?: boolean; serviceType?: SvcType } | undefined;
    if (!p?.expanded && p?.serviceType === undefined) return;
    if (p.serviceType !== undefined) setServiceType(p.serviceType);
    if (p.expanded) {
      setIsExpanded(true);
      sheetAnim.setValue(0);
    }
    // Clear only the params we consumed so subsequent focuses don't re-trigger
    (navigation as any).setParams({ expanded: undefined, serviceType: undefined });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.expanded, route.params?.serviceType]);

  // ── Sheet expand/collapse ────────────────────────────────────
  const expandSheet = () => {
    setIsExpanded(true);
    Animated.spring(sheetAnim, { toValue: 0, useNativeDriver: true, speed: 20, bounciness: 3 }).start();
  };
  const collapseSheet = () => {
    setIsExpanded(false);
    Animated.timing(sheetAnim, { toValue: EXPANDED_H - PEEK_H, duration: 240, useNativeDriver: true }).start();
  };

  // ── Selected detail sheet ────────────────────────────────────
  const showDetail = (p: Partner) => {
    setSelected(p);
    Animated.spring(detailAnim, { toValue: 1, useNativeDriver: true, speed: 22, bounciness: 4 }).start();
  };
  const hideDetail = () => {
    Animated.timing(detailAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => setSelected(null));
  };

  const detailTranslateY = detailAnim.interpolate({ inputRange: [0, 1], outputRange: [320, 0] });

  // ── Filtered list ────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...MOCK_PARTNERS];

    if (partnerFilter !== 'all') list = list.filter((p) => p.partnerType === partnerFilter);

    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase()));

    if (serviceType === 'regular') list = list.filter((p) => p.serviceFrequency === 'regular' || p.serviceFrequency === 'both');
    else if (serviceType === 'onetime') list = list.filter((p) => p.serviceFrequency === 'special' || p.serviceFrequency === 'both');

    if (availableOnly) list = list.filter((p) => p.isAvailable);
    if (verifiedOnly) list = list.filter((p) => p.isVerified);
    if (expLevel === '1y') list = list.filter((p) => p.experienceYears >= 1);
    else if (expLevel === '3y') list = list.filter((p) => p.experienceYears >= 3);
    else if (expLevel === '5y') list = list.filter((p) => p.experienceYears >= 5);

    if (selectedActivities.length > 0) {
      const skills = ALL_ACTIVITY_ITEMS
        .filter((i: { id: string; skill: string }) => selectedActivities.includes(i.id))
        .map((i: { skill: string }) => i.skill);
      if (skills.length > 0) list = list.filter((p) => skills.some((sk: string) => p.skills.includes(sk)));
    }

    if (sortBy === 'rating')      list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'price_low')   list.sort((a, b) => a.pricePerHour - b.pricePerHour);
    else if (sortBy === 'price_high')  list.sort((a, b) => b.pricePerHour - a.pricePerHour);
    else if (sortBy === 'reviews')     list.sort((a, b) => b.totalJobs - a.totalJobs);

    return list;
  }, [search, partnerFilter, serviceType, availableOnly, verifiedOnly, expLevel, selectedActivities, sortBy]);

  const actActive  = selectedActivities.length > 0;
  const condActive = serviceType !== null;
  const wrkActive  = verifiedOnly || expLevel !== 'all';

  const SVC_TYPES = [
    { key: 'regular' as SvcType, label: tx('Berkala','정기','Regular'),  desc: tx('Jadwal tetap mingguan','정해진 날마다 방문','Fixed schedule') },
    { key: 'onetime' as SvcType, label: tx('Sekali','단기','One-time'),  desc: tx('Satu kali atau beberapa hari','하루 또는 며칠만 활동','Single visit') },
    { key: 'live-in' as SvcType, label: tx('Tinggal','상주','Live-in'), desc: tx('Tinggal di rumah','고객 집에서 생활','Lives at home') },
  ];
  const EXP_LEVELS = [
    { key: 'all' as ExpLevel, label: tx('Semua','전체','All') },
    { key: '1y'  as ExpLevel, label: tx('1 thn+','1년+','1yr+') },
    { key: '3y'  as ExpLevel, label: tx('3 thn+','3년+','3yr+') },
    { key: '5y'  as ExpLevel, label: tx('5 thn+','5년+','5yr+') },
  ];
  const SORT_OPTIONS = [
    { key: 'rating'     as SortBy, label: tx('Nilai terbaik','평점순','Top rated') },
    { key: 'reviews'    as SortBy, label: tx('Ulasan terbanyak','후기 많은순','Most reviewed') },
    { key: 'price_low'  as SortBy, label: tx('Harga terendah','가격 낮은순','Lowest price') },
    { key: 'price_high' as SortBy, label: tx('Harga tertinggi','가격 높은순','Highest price') },
  ];

  const goToMyLocation = async () => {
    if (!locationGranted) return;
    try {
      const loc = await Location.getCurrentPositionAsync({});
      const r = { latitude: loc.coords.latitude, longitude: loc.coords.longitude, latitudeDelta: 0.018, longitudeDelta: 0.018 };
      mapRef.current?.animateToRegion(r, 400);
    } catch {}
  };

  return (
    <View style={s.root}>
      {/* ── Map ──────────────────────────────────────────── */}
      {loading ? (
        <View style={s.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.accent} />
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
          onPress={() => selected && hideDetail()}
        >
          {filtered.map((p) => (
            <PartnerMarker
              key={p.id}
              partner={p}
              selected={selected?.id === p.id}
              onPress={() => showDetail(p)}
            />
          ))}
        </MapView>
      )}

      {/* ── Top overlay ──────────────────────────────────── */}
      <View style={[s.overlay, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
        <View style={s.searchWrap}>
          <View style={s.searchBar}>
            <Ionicons name="search-outline" size={16} color={Colors.grayLight} />
            <TextInput
              style={s.searchInput}
              placeholder={tx('Cari helper atau lokasi...', '헬퍼 또는 위치 검색...', 'Search helper or area...')}
              placeholderTextColor={Colors.grayLight}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={16} color={Colors.grayLight} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Zoom + location */}
        <View style={s.zoomBtns}>
          <TouchableOpacity style={s.zoomBtn} onPress={() => {
            const r = { ...region, latitudeDelta: region.latitudeDelta / 2, longitudeDelta: region.longitudeDelta / 2 };
            mapRef.current?.animateToRegion(r, 250); setRegion(r);
          }} activeOpacity={0.8}>
            <Ionicons name="add" size={20} color={Colors.dark} />
          </TouchableOpacity>
          <View style={s.zoomDivider} />
          <TouchableOpacity style={s.zoomBtn} onPress={() => {
            const r = { ...region, latitudeDelta: Math.min(region.latitudeDelta * 2, 60), longitudeDelta: Math.min(region.longitudeDelta * 2, 60) };
            mapRef.current?.animateToRegion(r, 250); setRegion(r);
          }} activeOpacity={0.8}>
            <Ionicons name="remove" size={20} color={Colors.dark} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={s.locBtn} onPress={goToMyLocation} activeOpacity={0.8}>
          <Ionicons name="navigate" size={18} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      {/* ══════════════════════════════════════════════════
          EXPANDABLE BOTTOM SHEET
      ══════════════════════════════════════════════════ */}
      <Animated.View style={[s.bottomSheet, { height: EXPANDED_H, transform: [{ translateY: sheetAnim }] }]}>

        {/* Handle — tap to toggle */}
        <TouchableOpacity style={s.handleWrap} onPress={isExpanded ? collapseSheet : expandSheet} activeOpacity={0.7}>
          <View style={s.handle} />
        </TouchableOpacity>

        {/* ── PEEK CONTENT — always visible (header + filters + stories) ── */}
        <View style={s.peekContent}>
          {/* Header row */}
          <View style={s.peekHeaderRow}>
            <View style={s.peekHeaderLeft}>
              <Text style={s.peekTitle}>{tx('내 주변 헬퍼', '내 주변 헬퍼', 'Nearby Helpers')}</Text>
              <View style={s.peekCountBadge}>
                <Text style={s.peekCountBadgeText}>{filtered.length}</Text>
              </View>
            </View>
            {isExpanded ? (
              <TouchableOpacity style={s.expandCloseBtn} onPress={collapseSheet} activeOpacity={0.7}>
                <Ionicons name="chevron-down" size={18} color={Colors.gray} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={s.peekExpandBtn} onPress={expandSheet} activeOpacity={0.8}>
                <Ionicons name="list-outline" size={13} color={Colors.white} />
                <Text style={s.peekExpandText}>{tx('전체보기', '전체보기', 'See all')}</Text>
                <Ionicons name="chevron-up" size={12} color={Colors.white} />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.peekFilterRow}>
            {/* Partner type toggle */}
            <TouchableOpacity style={[s.peekToggleChip, partnerFilter === 'helper' && s.peekToggleOn]} onPress={() => setPartnerFilter((v) => v === 'helper' ? 'all' : 'helper')} activeOpacity={0.75}>
              <Ionicons name="home-outline" size={11} color={partnerFilter === 'helper' ? Colors.white : Colors.helperColor} />
              <Text style={[s.peekToggleText, partnerFilter === 'helper' && s.peekToggleTextOn]}>{tx('Helper','헬퍼','Helper')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.peekToggleChip, partnerFilter === 'driver' && s.peekToggleOnTutor]} onPress={() => setPartnerFilter((v) => v === 'driver' ? 'all' : 'driver')} activeOpacity={0.75}>
              <Ionicons name="car-outline" size={11} color={partnerFilter === 'driver' ? Colors.white : Colors.tutorColor} />
              <Text style={[s.peekToggleText, partnerFilter === 'driver' && s.peekToggleTextOn]}>{tx('Driver','드라이버','Driver')}</Text>
            </TouchableOpacity>
            <View style={s.peekChipDivider} />
            <TouchableOpacity style={[s.peekChip, condActive && s.peekChipActive]} onPress={() => { setTmpSvc(serviceType); setShowCondModal(true); }} activeOpacity={0.75}>
              <Ionicons name="calendar-outline" size={12} color={condActive ? Colors.white : Colors.gray} />
              <Text style={[s.peekChipText, condActive && s.peekChipTextActive]}>{condActive ? SVC_TYPES.find((sv) => sv.key === serviceType)?.label : tx('정기/단기', '정기/단기', 'Job Type')}</Text>
              {condActive && <Ionicons name="close" size={11} color={Colors.white} onTouchEnd={(e: any) => { e.stopPropagation(); setServiceType(null); }} />}
            </TouchableOpacity>
            <View style={s.peekChipDivider} />
            <TouchableOpacity style={[s.peekToggleChip, availableOnly && s.peekToggleOn]} onPress={() => setAvailableOnly((v) => !v)} activeOpacity={0.75}>
              <View style={[s.peekToggleDot, { backgroundColor: availableOnly ? Colors.white : Colors.success }]} />
              <Text style={[s.peekToggleText, availableOnly && s.peekToggleTextOn]}>{tx('지금 가능', '지금 가능', 'Available')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.peekToggleChip, verifiedOnly && s.peekToggleOn]} onPress={() => setVerifiedOnly((v) => !v)} activeOpacity={0.75}>
              <Ionicons name="shield-checkmark" size={11} color={verifiedOnly ? Colors.white : Colors.accent} />
              <Text style={[s.peekToggleText, verifiedOnly && s.peekToggleTextOn]}>{tx('인증', '인증', 'Verified')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.peekToggleChip, expLevel === '5y' && s.peekToggleOn]} onPress={() => setExpLevel((v) => v === '5y' ? 'all' : '5y')} activeOpacity={0.75}>
              <Ionicons name="star" size={11} color={expLevel === '5y' ? Colors.white : '#F59E0B'} />
              <Text style={[s.peekToggleText, expLevel === '5y' && s.peekToggleTextOn]}>{tx('경력 5년+', '경력 5년+', '5yr+')}</Text>
            </TouchableOpacity>
            <View style={s.peekChipDivider} />
            <TouchableOpacity style={[s.peekChip, actActive && s.peekChipActive]} onPress={() => { setTmpAct(selectedActivities); setShowActModal(true); }} activeOpacity={0.75}>
              <Ionicons name="construct-outline" size={12} color={actActive ? Colors.white : Colors.gray} />
              <Text style={[s.peekChipText, actActive && s.peekChipTextActive]}>{tx('업무 종류', '업무 종류', 'Activities')}{actActive ? ` ·${selectedActivities.length}` : ''}</Text>
              {actActive && <Ionicons name="close" size={11} color={Colors.white} onTouchEnd={(e: any) => { e.stopPropagation(); setSelectedAct([]); }} />}
            </TouchableOpacity>
            <TouchableOpacity style={[s.peekChip, wrkActive && s.peekChipActive]} onPress={() => { setTmpVer(verifiedOnly); setTmpExp(expLevel); setShowWrkModal(true); }} activeOpacity={0.75}>
              <Ionicons name="person-circle-outline" size={12} color={wrkActive ? Colors.white : Colors.gray} />
              <Text style={[s.peekChipText, wrkActive && s.peekChipTextActive]}>{tx('헬퍼 조건', '헬퍼 조건', 'Helper')}{wrkActive ? ' ●' : ''}</Text>
              {wrkActive && <Ionicons name="close" size={11} color={Colors.white} onTouchEnd={(e: any) => { e.stopPropagation(); setVerifiedOnly(false); setExpLevel('all'); }} />}
            </TouchableOpacity>
            <TouchableOpacity style={s.peekChip} onPress={() => setShowSortModal(true)} activeOpacity={0.75}>
              <Ionicons name="funnel-outline" size={12} color={Colors.gray} />
              <Text style={s.peekChipText}>{SORT_OPTIONS.find((o) => o.key === sortBy)?.label}</Text>
              <Ionicons name="chevron-down" size={11} color={Colors.gray} />
            </TouchableOpacity>
          </ScrollView>

          {/* Stories scroll */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.storiesRow}>
            {filtered.map((p) => (
              <TouchableOpacity key={p.id} style={s.storyItem} activeOpacity={0.82} onPress={() => showDetail(p)}>
                <View style={[s.storyRing, { borderColor: p.isAvailable ? Colors.accent : Colors.gray200 }]}>
                  <Image source={imgSrc(p.photo)} style={s.storyPhoto} />
                  <View style={[s.storyDot, { backgroundColor: p.isAvailable ? Colors.success : Colors.grayLight }]} />
                </View>
                <View style={s.storyRatingRow}>
                  <Ionicons name="star" size={8} color="#F59E0B" />
                  <Text style={s.storyRating}>{p.rating.toFixed(1)}</Text>
                </View>
                <Text style={s.storyName} numberOfLines={1}>{p.firstName}</Text>
                <Text style={s.storyPrice}>Rp {(p.pricePerHour / 1000).toFixed(0)}rb</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── EXPANDED: 워커 리스트 ── */}
        {isExpanded && (
          <View style={{ flex: 1 }}>
            <View style={s.expandSortRow}>
              <Text style={s.expandCount}>
                <Text style={s.expandCountNum}>{filtered.length}</Text>
                {tx(' helper', '명', ' helpers')}
              </Text>
              <TouchableOpacity style={s.sortBtn} onPress={() => setShowSortModal(true)}>
                <Ionicons name="funnel-outline" size={12} color={Colors.gray} />
                <Text style={s.sortBtnText}>{SORT_OPTIONS.find((o) => o.key === sortBy)?.label}</Text>
                <Ionicons name="chevron-down" size={11} color={Colors.gray} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={filtered}
              keyExtractor={(p) => p.id}
              contentContainerStyle={s.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={s.empty}>
                  <Ionicons name="search-outline" size={36} color={Colors.grayLight} />
                  <Text style={s.emptyText}>{tx('Tidak ada helper', '헬퍼가 없어요', 'No helpers found')}</Text>
                </View>
              }
              renderItem={({ item: p }) => (
                <TouchableOpacity style={s.listCard} activeOpacity={0.92}
                  onPress={() => { collapseSheet(); p.partnerType === 'driver' ? navigation.navigate('DriverDetail', { driverId: p.id }) : navigation.navigate('WorkerDetail', { workerId: p.id }); }}>
                  <View style={s.listAvatarWrap}>
                    <Image source={imgSrc(p.photo)} style={s.listAvatar} />
                    <View style={[s.listAvailDot, { backgroundColor: p.isAvailable ? Colors.success : Colors.grayLight }]} />
                  </View>
                  <View style={s.listInfo}>
                    <View style={s.listNameRow}>
                      <Text style={s.listName}>{p.name}</Text>
                      {p.isVerified && <Ionicons name="checkmark-circle" size={13} color={Colors.accent} />}
                    </View>
                    <View style={s.listSubRow}>
                      <Ionicons name="location-outline" size={11} color={Colors.grayLight} />
                      <Text style={s.listSub}>{p.location}</Text>
                      <Text style={s.listDot}>·</Text>
                      <Ionicons name="star" size={11} color="#F59E0B" />
                      <Text style={s.listSub}>{p.rating.toFixed(1)}</Text>
                    </View>
                    <View style={s.listTagsRow}>
                      {p.skills.slice(0, 3).map((sk) => (
                        <View key={sk} style={s.listTag}><Text style={s.listTagText}>{sk}</Text></View>
                      ))}
                    </View>
                  </View>
                  <View style={s.listRight}>
                    <Text style={s.listPrice}>Rp {(p.pricePerHour / 1000).toFixed(0)}rb</Text>
                    <Text style={s.listPriceUnit}>/jam</Text>
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
          </View>
        )}
      </Animated.View>

      {/* ── Selected partner detail sheet ──────────────── */}
      {selected && (
        <>
          <TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={hideDetail} />
          <Animated.View style={[s.detailSheet, { transform: [{ translateY: detailTranslateY }] }]}>
            <View style={s.sheetHandle} />
            <View style={s.sheetHeader}>
              <Image source={imgSrc(selected.photo)} style={s.sheetPhoto} />
              <View style={s.sheetMeta}>
                <View style={s.sheetNameRow}>
                  <Text style={s.sheetName}>{selected.name}</Text>
                  <View style={[s.onlineDot, { backgroundColor: selected.isAvailable ? Colors.success : Colors.grayLight }]} />
                </View>
                <View style={s.sheetTagRow}>
                  {selected.partnerType === 'driver' ? (
                    <View style={[s.sheetTypeBadge, { backgroundColor: '#EDE9FE' }]}>
                      <Ionicons name="car" size={11} color={Colors.tutorColor} />
                      <Text style={[s.sheetTypeText, { color: Colors.tutorColor }]}>Driver</Text>
                    </View>
                  ) : (
                    <View style={[s.sheetTypeBadge, { backgroundColor: Colors.helperLight }]}>
                      <Ionicons name="home" size={11} color={Colors.helperColor} />
                      <Text style={[s.sheetTypeText, { color: Colors.helperColor }]}>Helper</Text>
                    </View>
                  )}
                  <Text style={s.sheetLocation}>{selected.location}</Text>
                </View>
              </View>
              <TouchableOpacity style={s.sheetClose} onPress={hideDetail}>
                <Ionicons name="close" size={16} color={Colors.gray} />
              </TouchableOpacity>
            </View>
            <View style={s.statsRow}>
              <View style={s.statItem}>
                <View style={s.statValueRow}>
                  <Ionicons name="star" size={13} color="#F59E0B" />
                  <Text style={s.statValue}>{selected.rating}</Text>
                </View>
                <Text style={s.statLabel}>{tx('Rating','평점','Rating')}</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.statItem}>
                <Text style={s.statValue}>Rp {selected.pricePerHour.toLocaleString('id-ID')}</Text>
                <Text style={s.statLabel}>/ jam</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.statItem}>
                <Text style={s.statValue}>{selected.totalJobs}</Text>
                <Text style={s.statLabel}>{tx('Pekerjaan','완료','Jobs')}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[s.bookBtn, !selected.isAvailable && s.bookBtnDisabled]}
              activeOpacity={selected.isAvailable ? 0.85 : 1}
              onPress={() => {
                if (!selected.isAvailable) return;
                hideDetail();
                if (selected.partnerType === 'driver') {
                  navigation.navigate('DriverDetail', { driverId: selected.id });
                } else {
                  navigation.navigate('WorkerDetail', { workerId: selected.id });
                }
              }}
            >
              <Text style={s.bookBtnText}>
                {selected.isAvailable ? tx('Lihat Profil','프로필 보기','View Profile') : tx('Sedang Sibuk','현재 예약 불가','Unavailable')}
              </Text>
              {selected.isAvailable && <Ionicons name="arrow-forward" size={16} color={Colors.white} />}
            </TouchableOpacity>
          </Animated.View>
        </>
      )}

      {/* ════════════════════════════════════════════════
          FILTER MODALS
      ════════════════════════════════════════════════ */}

      {/* Modal: 원하는 업무 */}
      <Modal visible={showActModal} transparent animationType="slide" onRequestClose={() => setShowActModal(false)}>
        <View style={s.modalRoot}>
          <Pressable style={s.modalOverlay} onPress={() => setShowActModal(false)} />
          <View style={[s.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>{tx('Pilih Jenis Kerja', '원하는 업무', 'Select Activities')}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {ACTIVITY_CATS.map((cat) => (
                <View key={cat.id} style={s.actCatSection}>
                  <View style={s.actCatHeader}>
                    <View style={[s.actCatIcon, { backgroundColor: cat.bg }]}>
                      <Ionicons name={cat.icon} size={14} color={cat.color} />
                    </View>
                    <Text style={s.actCatLabel}>{tLabel(cat.label)}</Text>
                  </View>
                  <View style={s.actPillsRow}>
                    {cat.items.map((item) => {
                      const sel = tmpAct.includes(item.id);
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[s.actPill, sel && s.actPillSel]}
                          onPress={() => setTmpAct((prev) => prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id])}
                          activeOpacity={0.7}
                        >
                          <Text style={[s.actPillText, sel && s.actPillTextSel]}>{tLabel(item.label)}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
              <View style={{ height: 8 }} />
            </ScrollView>
            <View style={s.modalFooter}>
              <TouchableOpacity style={s.resetBtn} onPress={() => setTmpAct([])}>
                <Ionicons name="refresh-outline" size={14} color={Colors.gray} />
                <Text style={s.resetBtnText}>{tx('Reset','초기화','Reset')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.applyBtn} onPress={() => { setSelectedAct(tmpAct); setShowActModal(false); }}>
                <Text style={s.applyBtnText}>{tx('Terapkan','적용하기','Apply')}{tmpAct.length > 0 ? ` (${tmpAct.length})` : ''}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: 업무 조건 */}
      <Modal visible={showCondModal} transparent animationType="slide" onRequestClose={() => setShowCondModal(false)}>
        <View style={s.modalRoot}>
          <Pressable style={s.modalOverlay} onPress={() => setShowCondModal(false)} />
          <View style={[s.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>{tx('Kondisi Pekerjaan','업무 조건','Job Conditions')}</Text>
            {SVC_TYPES.map((svc) => {
              const sel = tmpSvc === svc.key;
              return (
                <TouchableOpacity key={svc.key} style={[s.condRow, sel && s.condRowSel]}
                  onPress={() => setTmpSvc(sel ? null : svc.key)} activeOpacity={0.7}>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.condLabel, sel && s.condLabelSel]}>{svc.label}</Text>
                    <Text style={s.condDesc}>{svc.desc}</Text>
                  </View>
                  <View style={[s.condCheck, sel && s.condCheckSel]}>
                    {sel && <Ionicons name="checkmark" size={14} color={Colors.white} />}
                  </View>
                </TouchableOpacity>
              );
            })}
            <View style={[s.modalFooter, { marginTop: 16 }]}>
              <TouchableOpacity style={s.resetBtn} onPress={() => setTmpSvc(null)}>
                <Ionicons name="refresh-outline" size={14} color={Colors.gray} />
                <Text style={s.resetBtnText}>{tx('Reset','초기화','Reset')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.applyBtn} onPress={() => { setServiceType(tmpSvc); setShowCondModal(false); }}>
                <Text style={s.applyBtnText}>{tx('Terapkan','적용하기','Apply')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: 헬퍼 조건 */}
      <Modal visible={showWrkModal} transparent animationType="slide" onRequestClose={() => setShowWrkModal(false)}>
        <View style={s.modalRoot}>
          <Pressable style={s.modalOverlay} onPress={() => setShowWrkModal(false)} />
          <View style={[s.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>{tx('Kondisi Helper','헬퍼 조건','Helper Conditions')}</Text>
            <TouchableOpacity style={s.condRow} onPress={() => setTmpVer((v) => !v)} activeOpacity={0.7}>
              <View style={{ flex: 1 }}>
                <Text style={s.condLabel}>{tx('Terverifikasi','인증 헬퍼만','Verified Only')}</Text>
                <Text style={s.condDesc}>{tx('Sudah terverifikasi platform','플랫폼 인증을 받은 헬퍼','Platform certified')}</Text>
              </View>
              <View style={[s.condCheck, tmpVer && s.condCheckSel]}>
                {tmpVer && <Ionicons name="checkmark" size={14} color={Colors.white} />}
              </View>
            </TouchableOpacity>
            <Text style={[s.condSectionLabel, { marginTop: 18 }]}>{tx('Pengalaman','경력','Experience')}</Text>
            <View style={s.expRow}>
              {EXP_LEVELS.map((exp) => {
                const sel = tmpExp === exp.key;
                return (
                  <TouchableOpacity key={exp.key} style={[s.expPill, sel && s.expPillSel]} onPress={() => setTmpExp(exp.key)} activeOpacity={0.7}>
                    <Text style={[s.expPillText, sel && s.expPillTextSel]}>{exp.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={[s.modalFooter, { marginTop: 24 }]}>
              <TouchableOpacity style={s.resetBtn} onPress={() => { setTmpVer(false); setTmpExp('all'); }}>
                <Ionicons name="refresh-outline" size={14} color={Colors.gray} />
                <Text style={s.resetBtnText}>{tx('Reset','초기화','Reset')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.applyBtn} onPress={() => { setVerifiedOnly(tmpVer); setExpLevel(tmpExp); setShowWrkModal(false); }}>
                <Text style={s.applyBtnText}>{tx('Terapkan','적용하기','Apply')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: 정렬 */}
      <Modal visible={showSortModal} transparent animationType="slide" onRequestClose={() => setShowSortModal(false)}>
        <View style={s.modalRoot}>
          <Pressable style={s.modalOverlay} onPress={() => setShowSortModal(false)} />
          <View style={[s.sortSheet, { paddingBottom: insets.bottom + 8 }]}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>{tx('Urutkan','정렬','Sort by')}</Text>
            {SORT_OPTIONS.map((opt) => {
              const active = sortBy === opt.key;
              return (
                <TouchableOpacity key={opt.key} style={s.sortOptRow} onPress={() => { setSortBy(opt.key); setShowSortModal(false); }} activeOpacity={0.7}>
                  <Text style={[s.sortOptText, active && s.sortOptTextActive]}>{opt.label}</Text>
                  {active && <Ionicons name="checkmark" size={18} color={Colors.accent} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── Photo pin marker ──────────────────────────────────────────────
function PhotoMarker({ partner, selected, onImageLoad }: { partner: Partner; selected: boolean; onImageLoad?: () => void }) {
  const size = selected ? 52 : 44;
  const br   = selected ? 26 : 22;
  const isDriver = partner.partnerType === 'driver';
  const accent = isDriver ? Colors.tutorColor : Colors.helperColor;
  const borderColor = selected ? accent : Colors.white;
  return (
    <View style={m.wrap}>
      <View style={[m.bubble, { width: size + 6, height: size + 6, borderRadius: br + 3, borderColor }]}>
        <Image
          source={imgSrc(partner.photo)}
          style={{ width: size, height: size, borderRadius: br }}
          onLoad={onImageLoad}
        />
      </View>
      <View style={[m.typeBadge, { backgroundColor: accent }]}>
        <Ionicons name={isDriver ? 'car' : 'home'} size={8} color={Colors.white} />
      </View>
      <View style={[m.onlineDot, { backgroundColor: partner.isAvailable ? Colors.success : Colors.grayLight, top: 2, right: 2 }]} />
      <View style={[m.tail, { borderTopColor: borderColor }]} />
    </View>
  );
}

// ── Marker wrapper with load tracking (fixes Android blank markers) ──
function PartnerMarker({ partner, selected, onPress }: { partner: Partner; selected: boolean; onPress: () => void }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Marker
      coordinate={{ latitude: partner.lat, longitude: partner.lng }}
      onPress={onPress}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={!loaded || selected}
    >
      <PhotoMarker partner={partner} selected={selected} onImageLoad={() => setLoaded(true)} />
    </Marker>
  );
}

const m = StyleSheet.create({
  wrap:     { alignItems: 'center' },
  bubble:   { borderWidth: 2.5, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white, shadowColor:'#000', shadowOffset:{width:0,height:3}, shadowOpacity:0.18, shadowRadius:4, elevation:6 },
  typeBadge:{ position:'absolute', right:0, bottom:8, width:16, height:16, borderRadius:8, alignItems:'center', justifyContent:'center', borderWidth:1.5, borderColor:Colors.white },
  onlineDot:{ position:'absolute', width:11, height:11, borderRadius:5.5, borderWidth:1.5, borderColor:Colors.white },
  tail:     { width:0, height:0, borderLeftWidth:6, borderRightWidth:6, borderTopWidth:8, borderLeftColor:'transparent', borderRightColor:'transparent', marginTop:-1 },
});

const s = StyleSheet.create({
  root: { flex: 1 },

  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F8F8' },

  // Top overlay
  overlay: { position:'absolute', top:0, left:0, right:0 },
  searchWrap: { paddingHorizontal: 14, marginBottom: 8 },
  searchBar: { flexDirection:'row', alignItems:'center', gap:8, backgroundColor:Colors.white, borderRadius:Radius.pill, paddingHorizontal:14, paddingVertical:11, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.10, shadowRadius:6, elevation:4 },
  searchInput: { flex:1, fontSize:14, color:Colors.dark },

  zoomBtns: { position:'absolute', right:14, top:60, backgroundColor:Colors.white, borderRadius:12, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.12, shadowRadius:5, elevation:4, overflow:'hidden' },
  zoomBtn:  { width:42, height:42, alignItems:'center', justifyContent:'center' },
  zoomDivider: { height:1, backgroundColor:Colors.border, marginHorizontal:8 },
  locBtn:   { position:'absolute', right:14, top:172, width:42, height:42, borderRadius:21, backgroundColor:Colors.white, alignItems:'center', justifyContent:'center', shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.12, shadowRadius:5, elevation:4 },

  // Bottom sheet
  bottomSheet: {
    position:'absolute', bottom:0, left:0, right:0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 22, borderTopRightRadius: 22,
    shadowColor:'#000', shadowOffset:{width:0,height:-3}, shadowOpacity:0.10, shadowRadius:10, elevation:12,
    overflow: 'hidden',
  },
  handleWrap: { alignItems:'center', paddingVertical: 12 },
  handle:     { width:36, height:4, borderRadius:2, backgroundColor:Colors.border },

  // PEEK content — stories style
  peekContent:      { paddingBottom: 10 },
  peekHeaderRow:    { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, paddingBottom:10 },
  peekHeaderLeft:   { flexDirection:'row', alignItems:'center', gap:8 },
  peekTitle:        { fontSize:15, fontWeight:'700', color:Colors.dark },
  peekCountBadge:   { backgroundColor:Colors.accentLight, borderRadius:Radius.pill, paddingHorizontal:8, paddingVertical:2 },
  peekCountBadgeText:{ fontSize:12, fontWeight:'700', color:Colors.accent },
  peekExpandBtn:    { flexDirection:'row', alignItems:'center', gap:4, backgroundColor:Colors.accent, borderRadius:Radius.pill, paddingHorizontal:12, paddingVertical:7 },
  peekExpandText:   { fontSize:12, fontWeight:'700', color:Colors.white },

  // Peek filter chips
  peekFilterRow:    { paddingHorizontal:16, gap:7, paddingBottom:10, flexDirection:'row', alignItems:'center' },
  peekChip:         { flexDirection:'row', alignItems:'center', gap:4, paddingHorizontal:10, paddingVertical:6, borderRadius:Radius.pill, borderWidth:1, borderColor:Colors.borderMid, backgroundColor:Colors.white },
  peekChipActive:   { backgroundColor:Colors.accent, borderColor:Colors.accent },
  peekChipText:     { fontSize:12, fontWeight:'500', color:Colors.gray },
  peekChipTextActive:{ color:Colors.white, fontWeight:'600' },
  // Peek on/off toggle chips
  peekToggleChip:   { flexDirection:'row', alignItems:'center', gap:4, paddingHorizontal:10, paddingVertical:6, borderRadius:Radius.pill, borderWidth:1, borderColor:Colors.borderMid, backgroundColor:Colors.white },
  peekToggleOn:       { backgroundColor:Colors.accent, borderColor:Colors.accent },
  peekToggleOnTutor:  { backgroundColor:Colors.tutorColor, borderColor:Colors.tutorColor },
  peekToggleDot:    { width:7, height:7, borderRadius:4 },
  peekToggleText:   { fontSize:12, fontWeight:'500', color:Colors.gray },
  peekToggleTextOn: { color:Colors.white, fontWeight:'600' },
  peekChipDivider:  { width:1, height:18, backgroundColor:Colors.border, marginHorizontal:2 },

  // Stories
  storiesRow:    { paddingHorizontal:16, gap:14, paddingBottom:2 },
  storyItem:     { alignItems:'center', width:62 },
  storyRing:     { width:62, height:62, borderRadius:31, borderWidth:2.5, padding:2, marginBottom:5, position:'relative' },
  storyPhoto:    { width:53, height:53, borderRadius:26.5 },
  storyDot:      { position:'absolute', bottom:1, right:1, width:13, height:13, borderRadius:6.5, borderWidth:2, borderColor:Colors.white },
  storyRatingRow:{ flexDirection:'row', alignItems:'center', gap:2, marginBottom:3 },
  storyRating:   { fontSize:10, fontWeight:'700', color:Colors.dark },
  storyName:     { fontSize:11, fontWeight:'600', color:Colors.dark, textAlign:'center', width:62 },
  storyPrice:    { fontSize:10, color:Colors.gray, textAlign:'center' },

  // Expanded header
  expandHeader:    { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, paddingBottom:10 },
  expandHeaderTitle:{ fontSize:15, fontWeight:'700', color:Colors.dark },
  expandCloseBtn:  { width:32, height:32, borderRadius:16, backgroundColor:Colors.section, alignItems:'center', justifyContent:'center' },

  // EXPANDED content
  expandFilterBar:  { flexDirection:'row', gap:7, paddingHorizontal:16, paddingBottom:10 },
  expandChip:       { flexDirection:'row', alignItems:'center', gap:4, paddingHorizontal:11, paddingVertical:7, borderRadius:Radius.pill, borderWidth:1, borderColor:Colors.borderMid, backgroundColor:Colors.white },
  expandChipActive:    { backgroundColor:Colors.accent, borderColor:Colors.accent },
  expandChipText:      { fontSize:12, fontWeight:'500', color:Colors.dark },
  expandChipTextActive:{ color:Colors.white, fontWeight:'600' },

  expandSortRow:   { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, paddingBottom:10 },
  expandCount:     { fontSize:13, color:Colors.gray },
  expandCountNum:  { fontWeight:'700', color:Colors.dark },
  sortBtn:         { flexDirection:'row', alignItems:'center', gap:4, paddingHorizontal:10, paddingVertical:5, borderRadius:Radius.pill, borderWidth:1, borderColor:Colors.border },
  sortBtnText:     { fontSize:12, color:Colors.gray },

  // List cards in expanded
  listContent: { paddingHorizontal:16, paddingBottom:32 },
  empty:       { alignItems:'center', paddingTop:40, gap:10 },
  emptyText:   { fontSize:14, color:Colors.grayLight },
  listCard:    { flexDirection:'row', alignItems:'center', gap:12, backgroundColor:Colors.white, borderRadius:Radius.lg, borderWidth:1, borderColor:Colors.border, padding:12, ...Shadow.sm },
  listAvatarWrap: { position:'relative' },
  listAvatar:  { width:50, height:50, borderRadius:25 },
  listAvailDot:{ position:'absolute', bottom:1, right:1, width:11, height:11, borderRadius:5.5, borderWidth:2, borderColor:Colors.white },
  listInfo:    { flex:1 },
  listNameRow: { flexDirection:'row', alignItems:'center', gap:5, marginBottom:3 },
  listName:    { fontSize:14, fontWeight:'700', color:Colors.dark },
  listSubRow:  { flexDirection:'row', alignItems:'center', gap:3, marginBottom:5 },
  listSub:     { fontSize:11, color:Colors.grayLight },
  listDot:     { fontSize:11, color:Colors.grayLight },
  listTagsRow: { flexDirection:'row', gap:5 },
  listTag:     { backgroundColor:Colors.section, borderRadius:4, paddingHorizontal:7, paddingVertical:2 },
  listTagText: { fontSize:10, color:Colors.gray },
  listRight:   { alignItems:'flex-end' },
  listPrice:   { fontSize:14, fontWeight:'700', color:Colors.accent },
  listPriceUnit:{ fontSize:11, color:Colors.gray },

  // Selected detail sheet
  backdrop:     { ...StyleSheet.absoluteFillObject, backgroundColor:'transparent' },
  detailSheet:  { position:'absolute', bottom:0, left:0, right:0, backgroundColor:Colors.white, borderTopLeftRadius:22, borderTopRightRadius:22, paddingHorizontal:20, paddingBottom:36, paddingTop:12, shadowColor:'#000', shadowOffset:{width:0,height:-3}, shadowOpacity:0.12, shadowRadius:10, elevation:14 },
  sheetHandle:  { width:36, height:4, borderRadius:2, backgroundColor:Colors.border, alignSelf:'center', marginBottom:18 },
  sheetHeader:  { flexDirection:'row', alignItems:'center', gap:12, marginBottom:16 },
  sheetPhoto:   { width:52, height:52, borderRadius:26 },
  sheetMeta:    { flex:1, gap:6 },
  sheetNameRow: { flexDirection:'row', alignItems:'center', gap:8 },
  sheetName:    { fontSize:16, fontWeight:'700', color:Colors.dark },
  onlineDot:    { width:8, height:8, borderRadius:4 },
  sheetVerifiedBadge: { flexDirection:'row', alignItems:'center', gap:3, backgroundColor:Colors.accentLight, borderRadius:Radius.pill, paddingHorizontal:7, paddingVertical:3 },
  sheetVerifiedText:  { fontSize:11, fontWeight:'600', color:Colors.accent },
  sheetTagRow:  { flexDirection:'row', alignItems:'center', gap:8 },
  sheetTypeBadge:{ flexDirection:'row', alignItems:'center', gap:4, borderRadius:Radius.pill, paddingHorizontal:8, paddingVertical:3 },
  sheetTypeText: { fontSize:11, fontWeight:'700' },
  sheetLocation: { fontSize:12, color:Colors.grayLight },
  sheetClose:    { width:30, height:30, borderRadius:15, backgroundColor:Colors.section, alignItems:'center', justifyContent:'center' },
  statsRow:     { flexDirection:'row', alignItems:'center', backgroundColor:Colors.section, borderRadius:Radius.lg, paddingVertical:14, marginBottom:14 },
  statItem:     { flex:1, alignItems:'center', gap:4 },
  statValueRow: { flexDirection:'row', alignItems:'center', gap:4 },
  statValue:    { fontSize:15, fontWeight:'700', color:Colors.dark },
  statLabel:    { fontSize:11, color:Colors.gray },
  statDivider:  { width:1, height:28, backgroundColor:Colors.border },
  bookBtn:      { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, backgroundColor:Colors.dark, borderRadius:Radius.pill, paddingVertical:15 },
  bookBtnDisabled:{ backgroundColor:Colors.grayLight },
  bookBtnText:  { fontSize:15, fontWeight:'700', color:Colors.white },

  // Filter modals
  modalRoot:   { flex:1 },
  modalOverlay:{ flex:1, backgroundColor:'rgba(0,0,0,0.4)' },
  modalSheet:  { backgroundColor:Colors.white, borderTopLeftRadius:24, borderTopRightRadius:24, paddingTop:12, paddingHorizontal:20, maxHeight:'85%', ...Shadow.lg },
  sortSheet:   { backgroundColor:Colors.white, borderTopLeftRadius:24, borderTopRightRadius:24, paddingTop:12, paddingHorizontal:20, ...Shadow.lg },
  modalHandle: { width:36, height:4, borderRadius:2, backgroundColor:Colors.border, alignSelf:'center', marginBottom:20 },
  modalTitle:  { fontSize:17, fontWeight:'700', color:Colors.dark, marginBottom:16 },

  actCatSection:{ marginBottom:18 },
  actCatHeader: { flexDirection:'row', alignItems:'center', gap:8, marginBottom:10 },
  actCatIcon:   { width:24, height:24, borderRadius:6, alignItems:'center', justifyContent:'center' },
  actCatLabel:  { fontSize:14, fontWeight:'700', color:Colors.dark },
  actPillsRow:  { flexDirection:'row', flexWrap:'wrap', gap:8 },
  actPill:      { paddingHorizontal:13, paddingVertical:8, borderRadius:Radius.pill, borderWidth:1, borderColor:Colors.border, backgroundColor:Colors.white },
  actPillSel:   { backgroundColor:Colors.accent, borderColor:Colors.accent },
  actPillText:  { fontSize:13, color:Colors.dark },
  actPillTextSel:{ color:Colors.white, fontWeight:'600' },

  condSectionLabel:{ fontSize:13, fontWeight:'600', color:Colors.grayLight, marginBottom:10 },
  condRow:      { flexDirection:'row', alignItems:'center', paddingVertical:14, paddingHorizontal:16, borderRadius:Radius.md, marginBottom:8, borderWidth:1.5, borderColor:Colors.border, backgroundColor:Colors.white },
  condRowSel:   { borderColor:Colors.accent, backgroundColor:Colors.accentLight },
  condLabel:    { fontSize:15, fontWeight:'600', color:Colors.dark, marginBottom:2 },
  condLabelSel: { color:Colors.accent },
  condDesc:     { fontSize:12, color:Colors.gray },
  condCheck:    { width:22, height:22, borderRadius:11, borderWidth:1.5, borderColor:Colors.border, alignItems:'center', justifyContent:'center' },
  condCheckSel: { backgroundColor:Colors.accent, borderColor:Colors.accent },

  expRow:       { flexDirection:'row', gap:8 },
  expPill:      { flex:1, alignItems:'center', paddingVertical:10, borderRadius:Radius.md, borderWidth:1.5, borderColor:Colors.border, backgroundColor:Colors.white },
  expPillSel:   { backgroundColor:Colors.accent, borderColor:Colors.accent },
  expPillText:  { fontSize:13, fontWeight:'500', color:Colors.dark },
  expPillTextSel:{ color:Colors.white, fontWeight:'700' },

  sortOptRow:   { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:14, borderBottomWidth:1, borderBottomColor:Colors.border },
  sortOptText:  { fontSize:15, color:Colors.dark },
  sortOptTextActive:{ fontWeight:'700', color:Colors.accent },

  modalFooter:  { flexDirection:'row', gap:10, paddingTop:16, borderTopWidth:1, borderTopColor:Colors.border },
  resetBtn:     { flexDirection:'row', alignItems:'center', gap:6, paddingHorizontal:16, paddingVertical:13, borderRadius:Radius.pill, borderWidth:1, borderColor:Colors.border },
  resetBtnText: { fontSize:14, color:Colors.gray },
  applyBtn:     { flex:1, alignItems:'center', paddingVertical:14, borderRadius:Radius.pill, backgroundColor:Colors.accent },
  applyBtnText: { fontSize:15, fontWeight:'700', color:Colors.white },
});
