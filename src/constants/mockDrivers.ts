/**
 * 드라이버 목업 데이터
 * 고객 차량을 대신 운전해주는 서비스 제공자들
 */
import { ImageSourcePropType } from 'react-native';
import { D1, D2, D3, D4, D5, D6 } from './photos';
import { DriverServiceKind, DrivableVehicleType, TransmissionSkill } from '../types';

export interface MockDriver {
  id: string;
  name: string;
  firstName: string;
  photo: ImageSourcePropType;
  location: string;
  lat?: number;
  lng?: number;
  rating: number;
  pricePerHour: number;
  totalJobs: number;
  isAvailable: boolean;
  isVerified: boolean;
  experienceYears: number;
  drivableTypes: DrivableVehicleType[];
  transmission: TransmissionSkill;
  services: DriverServiceKind[];
  licenseClass: string;    // SIM A, SIM B1 등
  temperature: number;     // Linka 온도
}

export const MOCK_DRIVERS: MockDriver[] = [
  {
    id: 'd1', name: 'Rahmat Hidayat', firstName: 'Rahmat',
    photo: D1, location: 'Kebayoran Baru',
    lat: -6.2444, lng: 106.8050,
    rating: 5.0, pricePerHour: 55000, totalJobs: 284,
    isAvailable: true, isVerified: true, experienceYears: 8,
    drivableTypes: ['sedan', 'suv', 'mpv'], transmission: 'both',
    services: ['designated', 'daily', 'airport', 'event'],
    licenseClass: 'SIM A',
    temperature: 72.3,
  },
  {
    id: 'd2', name: 'Budi Setiawan', firstName: 'Budi',
    photo: D2, location: 'Menteng',
    lat: -6.2478, lng: 106.8032,
    rating: 4.9, pricePerHour: 50000, totalJobs: 192,
    isAvailable: true, isVerified: true, experienceYears: 6,
    drivableTypes: ['sedan', 'suv'], transmission: 'auto',
    services: ['designated', 'hourly', 'commute'],
    licenseClass: 'SIM A',
    temperature: 58.7,
  },
  {
    id: 'd3', name: 'Joko Susanto', firstName: 'Joko',
    photo: D3, location: 'Cilandak',
    lat: -6.2510, lng: 106.8018,
    rating: 4.8, pricePerHour: 45000, totalJobs: 156,
    isAvailable: true, isVerified: true, experienceYears: 10,
    drivableTypes: ['sedan', 'suv', 'mpv', 'van', 'manual_stick'], transmission: 'both',
    services: ['daily', 'intercity', 'event'],
    licenseClass: 'SIM A Umum',
    temperature: 65.1,
  },
  {
    id: 'd4', name: 'Ari Wibowo', firstName: 'Ari',
    photo: D4, location: 'Kemang',
    lat: -6.2498, lng: 106.8084,
    rating: 4.9, pricePerHour: 60000, totalJobs: 221,
    isAvailable: true, isVerified: true, experienceYears: 7,
    drivableTypes: ['sedan', 'suv', 'mpv'], transmission: 'auto',
    services: ['designated', 'airport', 'event', 'hourly'],
    licenseClass: 'SIM A',
    temperature: 68.4,
  },
  {
    id: 'd5', name: 'Dimas Pratama', firstName: 'Dimas',
    photo: D5, location: 'Pondok Indah',
    lat: -6.2532, lng: 106.8092,
    rating: 4.7, pricePerHour: 48000, totalJobs: 98,
    isAvailable: false, isVerified: true, experienceYears: 4,
    drivableTypes: ['sedan', 'suv'], transmission: 'auto',
    services: ['designated', 'commute'],
    licenseClass: 'SIM A',
    temperature: 45.2,
  },
  {
    id: 'd6', name: 'Agus Setiawan', firstName: 'Agus',
    photo: D6, location: 'Fatmawati',
    lat: -6.2520, lng: 106.8040,
    rating: 4.9, pricePerHour: 52000, totalJobs: 178,
    isAvailable: true, isVerified: true, experienceYears: 9,
    drivableTypes: ['sedan', 'mpv', 'van'], transmission: 'both',
    services: ['daily', 'intercity', 'airport'],
    licenseClass: 'SIM A Umum',
    temperature: 71.8,
  },
];

export const DRIVER_SERVICE_META: Record<DriverServiceKind, { icon: string; bg: string; color: string }> = {
  designated: { icon: 'moon-outline',      bg: '#F5F3FF', color: '#7C3AED' },
  daily:      { icon: 'sunny-outline',     bg: '#FFF7ED', color: '#F59E0B' },
  hourly:     { icon: 'time-outline',      bg: '#EFF6FF', color: '#2563EB' },
  commute:    { icon: 'repeat-outline',    bg: '#F0FDF4', color: '#16A34A' },
  airport:    { icon: 'airplane-outline',  bg: '#E0F2FE', color: '#0284C7' },
  intercity:  { icon: 'map-outline',       bg: '#FEF3C7', color: '#B45309' },
  event:      { icon: 'heart-outline',     bg: '#FDE2E4', color: '#DB2777' },
};
